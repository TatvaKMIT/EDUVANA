import React, { useState } from "react";
import axios from "axios";
import "./LearnAI.css";

function LearnAI() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateContent = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/generate-content", { topic });
      setContent(response.data.text);
    } catch (error) {
      console.error("Error generating content:", error);
      setContent("Failed to generate content. Please try again.");
    }
    setLoading(false);
  };
  

  return (
    <div className="learn-ai-page">
      <h1>AI Based Learning</h1>
      <p>Welcome to the AI Based Learning page. Here you can explore AI-powered educational resources and tools.</p>
      <div className="content-generator">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., Cloud Computing)"
        />
        <button onClick={handleGenerateContent} disabled={loading}>
          {loading ? "Generating..." : "Generate Content"}
        </button>
      </div>
      {content && (
        <div className="generated-content">
          <h2>Generated Content on {topic}</h2>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
}

export default LearnAI;