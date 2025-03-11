import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DashBoard.css";

function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  
  // Fetch actual subjects from API
  useEffect(() => {
    // Replace with actual API call
    const mockSubjects = [
      { id: 1, title: "Cloud Computing", image: "/src/assets/cc.jpeg", progress: 65 },
      { id: 2, title: "Database Management Systems", image: "/src/assets/dbms.jpeg", progress: 42 },
      { id: 3, title: "Operating Systems", image: "/src/assets/os.jpeg", progress: 78 },
    ];
    setSubjects(mockSubjects);
  }, []);

  return (
    <div className="dashboard-page">
      <h1>Learning Dashboard</h1>
      
      <div className="subject-cards">
        {subjects.map((subject) => (
          <Link 
            to={`/subject/${subject.id}`} 
            key={subject.id} 
            className="subject-card"
          >
            <div className="subject-image">
              <img src={subject.image} alt={subject.title} />
              <div className="progress-indicator">
                <div className="progress-bar" style={{ width: `${subject.progress}%` }}></div>
                <span>{subject.progress}% Complete</span>
              </div>
            </div>
            <div className="subject-content">
              <h3>{subject.title}</h3>
              <button className="continue-btn">Continue Learning</button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;