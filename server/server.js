// server.js - Main server file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;
const genAI = new GoogleGenerativeAI("AIzaSyDVDNBDVaY6QFXpOqh4wXySZf0-ATjQ0Sc");

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use environment variable in production

// Middleware

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/auth_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Create session schema for storing interview sessions
const SessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  subject: {
    type: String,
    required: true
  },
  questions: {
    type: Array,
    required: true
  },
  answers: {
    type: Array, // Array of { questionId, answerText, evaluation }
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Automatically expire sessions after 24 hours
}
});

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);
const Session = mongoose.model('Session', SessionSchema);

// Validation middleware
const registerValidation = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').not().isEmpty().withMessage('Password is required')
];

const passwordValidation = [
  body('currentPassword').not().isEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

app.post('/api/auth/register', registerValidation, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create and return JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login Route
app.post('/api/auth/login', loginValidation, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create and return JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Auth middleware to protect routes
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
app.put('/api/user/update-name', auth, [
    body('name').not().isEmpty().withMessage('Name is required')
  ], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name } = req.body;
  
    try {
      // Find user by ID (from auth middleware) and update
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { name } },
        { new: true }
      ).select('-password');
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
// Protected route example
app.get('/api/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Interview session routes
app.post('/api/interview/start', auth, async (req, res) => {
  try {
    const { subject } = req.body;
    console.log(req.body);
    if (!subject) {
      return res.status(400).json({ success: false, message: 'Subject is required' });
    }
    
    // Generate interview questions using Gemini API
    let questions;
    try {
      questions = await generateInterviewQuestions(subject);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate interview questions',
        error: error.message
      });
    }
    
    // Create a new interview session
    const sessionId = generateSessionId();
    
    // Store session in the database
    const interviewSession = new Session({
      sessionId,
      subject,
      questions,
      userId: req.user.id // Associate session with user
    });
    
    await interviewSession.save();
    
    // Return the session data to the client
    return res.status(200).json({
      success: true,
      message: 'Interview session created successfully',
      session: {
        id: sessionId,
        subject,
        questions
      }
    });
    
  } catch (error) {
    console.error('Error creating interview session:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create interview session',
      error: error.message
    });
  }
});

// Retrieve a specific interview session
app.get('/api/interview/session/:sessionId', auth, async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      session: {
        id: session.sessionId,
        subject: session.subject,
        questions: session.questions,
        createdAt: session.createdAt
      }
    });
    
  } catch (error) {
    console.error('Error retrieving interview session:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve interview session',
      error: error.message
    });
  }
});

// Function to generate interview questions using Gemini API
async function generateInterviewQuestions(subject) {
  try {
    // Get the Gemini model
    console.log("jjj");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('went')
    // Create prompt for generating interview questions
    const prompt = `Generate 10 most commonly asked interview questions about ${subject}. 
    Format the response as a JSON array of objects, where each object has:
    1. "id": a number
    2. "question": the interview question text
    3. "difficulty": an assessment of the difficulty (easy, medium, hard)
    Only respond with the JSON, no introductory or explanatory text.`;
    
    // Generate content
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response with error handling
    // Remove any backticks or "json" markers that might be in the response
    const cleanedText = text.replace(/```json|```/g, '').trim();
    
    try {
      const questions = JSON.parse(cleanedText);
      
      // Validate the response structure
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }
      
      // Ensure each question has the required fields
      questions.forEach((q, index) => {
        if (!q.id) q.id = index + 1;
        if (!q.question) throw new Error(`Question at index ${index} is missing question text`);
        if (!q.difficulty) q.difficulty = 'medium';
      });
      
      return questions;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Received text:', cleanedText);
      
      // Fall back to a manual parsing approach or return default questions
      return [
        { id: 1, question: `Tell me about your experience with ${subject}`, difficulty: 'easy' },
        { id: 2, question: `What are the key challenges you've faced when working with ${subject}?`, difficulty: 'medium' },
        { id: 3, question: `Explain a complex concept related to ${subject}`, difficulty: 'hard' }
      ];
    }
  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    throw new Error('Failed to generate interview questions: ' + error.message);
  }
}

// Generate a cryptographically secure session ID
function generateSessionId() {
  return 'sess_' + require('crypto').randomBytes(16).toString('hex');
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // In production, you might want to exit and let your process manager restart the app
  // process.exit(1);
});