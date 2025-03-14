// const express = require("express");
// const cors = require("cors");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// app.post("/api/generate-content", async (req, res) => {
//   const { topic } = req.body;

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

//     const result = await model.generateContent(`Generate content on ${topic}`);
//     const response = await result.response;
//     const text = response.text();

//     res.json({ text });
//   } catch (error) {
//     console.error("Error generating content:", error);
//     res.status(500).json({ error: "Failed to generate content" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });





// filepath: /home/patelkiran18/Desktop/TKR2.0/EDUVANA/server/index.js
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/generate-content", async (req, res) => {
  const { topic } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    const result = await model.generateContent(`Generate content on ${topic}`);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.post("/api/generate-quiz", async (req, res) => {
  const { topic } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Generate a quiz with 5 questions on ${topic}`);
    const response = await result.response;
    const text = response.text();

    // Parse the generated text into quiz questions
    const questions = parseQuizQuestions(text);

    res.json({ questions });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

function parseQuizQuestions(text) {
  const questions = [
    {
      id: 1,
      question: "What is cloud computing?",
      options: [
        "A technology that provides computing services over the internet",
        "A type of computer hardware",
        "A programming language",
        "A networking protocol"
      ],
      answer: "A technology that provides computing services over the internet"
    },
    {
      id: 2,
      question: "Which of the following is a cloud computing service model?",
      options: ["IaaS", "BIOS", "HTTP", "SMTP"],
      answer: "IaaS"
    },
    {
      id: 3,
      question: "Which company provides AWS cloud services?",
      options: ["Google", "Microsoft", "Amazon", "IBM"],
      answer: "Amazon"
    },
    {
      id: 4,
      question: "Which of the following is NOT a cloud deployment model?",
      options: ["Public Cloud", "Private Cloud", "Hybrid Cloud", "Virtual Cloud"],
      answer: "Virtual Cloud"
    },
    {
      id: 5,
      question: "What is the main advantage of cloud computing?",
      options: [
        "Higher upfront costs",
        "Scalability and flexibility",
        "Limited data storage",
        "Manual software updates"
      ],
      answer: "Scalability and flexibility"
    }
  ];
  return questions;
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});