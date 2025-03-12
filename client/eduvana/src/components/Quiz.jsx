import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Quiz.css";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/generate-quiz", { topic: "General Knowledge" });
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error generating quiz:", error);
        setError("Failed to generate quiz. Please try again.");
      }
      setLoading(false);
    };

    fetchQuiz();
  }, []);

  const handleOptionSelect = (questionId, option) => {
    setAnswers({
      ...answers,
      [questionId]: option
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) {
    return <div className="quiz-container">Loading...</div>;
  }

  if (error) {
    return <div className="quiz-container">{error}</div>;
  }

  return (
    <div className="quiz-container">
      <h3>AI-Based Quiz</h3>
      {questions.length > 0 && (
        <div className="question-container">
          <h4>Question {currentQuestionIndex + 1} of {questions.length}</h4>
          <div className="question">
            <p>{questions[currentQuestionIndex].question}</p>
            <div className="options">
              {questions[currentQuestionIndex].options.map((option) => (
                <div 
                  key={option} 
                  className={`
                    option 
                    ${answers[questions[currentQuestionIndex].id] === option ? 'selected' : ''} 
                    ${submitted && option === questions[currentQuestionIndex].answer ? 'correct' : ''} 
                    ${submitted && answers[questions[currentQuestionIndex].id] === option && option !== questions[currentQuestionIndex].answer ? 'wrong' : ''}
                  `}
                  onClick={() => !submitted && handleOptionSelect(questions[currentQuestionIndex].id, option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
          <div className="navigation-buttons">
            <button onClick={handleBack} disabled={currentQuestionIndex === 0}>Back</button>
            <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
          </div>
        </div>
      )}
      {!submitted && questions.length > 0 && (
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Answers
        </button>
      )}
      {submitted && (
        <div className="results">
          <p>You got {questions.filter(q => answers[q.id] === q.answer).length} out of {questions.length} correct!</p>
        </div>
      )}
    </div>
  );
}

export default Quiz;