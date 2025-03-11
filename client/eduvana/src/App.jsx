import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DashBoard from "./pages/DashBoard"; // Corrected import
import SubjectPage from "./pages/SubjectPage";
import TopicContent from "./pages/TopicContent";
import InterviewBot from "./pages/InterviewBot";
import Progress from "./pages/Progress";
// import TesseractLearning from "./pages/TesseractLearning";
// import AIAssistant from "./pages/AIAssistant";
import "./App.css";
import CollaborativeLearning from "./pages/CollaborativeLearning";
import LearnAI from "./pages/LearnAI";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashBoard />} /> {/* Corrected route */}
            <Route path="/interview-bot" element={<InterviewBot />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/subject/:subjectId" element={<SubjectPage />} />
            <Route path="/subject/:subjectId/unit/:unitId/topic/:topicId" element={<TopicContent />} />
            {/* <Route path="/learning" element={<TesseractLearning />} /> */}
            {/* <Route path="/ai-assistant" element={<AIAssistant />} /> */}
            <Route path="/collaborative-learning" element={<CollaborativeLearning />} />
            <Route path="/learn-ai" element={<LearnAI />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;