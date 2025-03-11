import React, { useState } from "react";
import "./CollaborativeLearning.css";

function CollaborativeLearning() {
  const [activeRoom, setActiveRoom] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  // Sample study rooms data
  const studyRooms = [
    { id: 1, name: "Calculus Study Group", members: 5, status: "active", subject: "Mathematics" },
    { id: 2, name: "Python Programming", members: 7, status: "active", subject: "Computer Science" },
    { id: 3, name: "Organic Chemistry", members: 3, status: "active", subject: "Chemistry" },
    { id: 4, name: "World History Discussion", members: 6, status: "active", subject: "History" },
  ];

  const joinRoom = (roomId) => {
    setActiveRoom(roomId);
  };

  return (
    <div className="collaborative-learning-page">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Study Rooms</h3>
          <button 
            className="create-room-btn"
            onClick={() => alert("Create room functionality would be implemented here")}
          >
            +
          </button>
        </div>
        <div className="sidebar-search">
          <input type="text" placeholder="Search rooms..." />
        </div>
        <div className="room-list">
          {studyRooms.map((room) => (
            <div 
              key={room.id} 
              className={`room-item ${activeRoom === room.id ? 'active' : ''}`}
              onClick={() => joinRoom(room.id)}
            >
              <div className="room-icon">{room.subject.charAt(0)}</div>
              <div className="room-info">
                <div className="room-name">{room.name}</div>
                <div className="room-status">
                  <span className="status-dot"></span>
                  {room.members} online
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <button 
            className="join-btn"
            onClick={() => setShowJoinModal(true)}
          >
            Join with code
          </button>
        </div>
      </div>

      <div className="main-content">
        {activeRoom ? (
          <>
            <div className="room-header">
              <h2>{studyRooms.find(room => room.id === activeRoom)?.name}</h2>
              <div className="room-actions">
                <button className="share-btn">Share Screen</button>
                <button className="video-btn">Video Call</button>
              </div>
            </div>
            <div className="video-grid">
              <div className="video-container main-video">
                <div className="video-placeholder">
                  <div className="placeholder-icon">📹</div>
                  <p>Click 'Video Call' to start your camera</p>
                </div>
                <div className="user-name">You</div>
              </div>
              <div className="video-container">
                <div className="video-placeholder">
                  <div className="placeholder-icon">👤</div>
                </div>
                <div className="user-name">Sarah K.</div>
              </div>
              <div className="video-container">
                <div className="video-placeholder">
                  <div className="placeholder-icon">👤</div>
                </div>
                <div className="user-name">Michael T.</div>
              </div>
              <div className="video-container">
                <div className="video-placeholder">
                  <div className="placeholder-icon">👤</div>
                </div>
                <div className="user-name">Emma L.</div>
              </div>
            </div>
            <div className="collaboration-tools">
              <div className="tools-header">
                <h3>Study Tools</h3>
              </div>
              <div className="tools-grid">
                <div className="tool-card">
                  <div className="tool-icon">📝</div>
                  <div className="tool-name">Shared Notes</div>
                </div>
                <div className="tool-card">
                  <div className="tool-icon">⏱️</div>
                  <div className="tool-name">Study Timer</div>
                </div>
                <div className="tool-card">
                  <div className="tool-icon">📊</div>
                  <div className="tool-name">Whiteboard</div>
                </div>
                <div className="tool-card">
                  <div className="tool-icon">📚</div>
                  <div className="tool-name">Resource Library</div>
                </div>
              </div>
            </div>
            <div className="chat-section">
              <div className="chat-messages">
                <div className="message">
                  <span className="message-author">Sarah K.</span>
                  <p>Has anyone finished the problem set for tomorrow?</p>
                </div>
                <div className="message">
                  <span className="message-author">Michael T.</span>
                  <p>I'm stuck on question 3. Could we go through it together?</p>
                </div>
                <div className="message">
                  <span className="message-author">Emma L.</span>
                  <p>Sure! Let me share my screen in a minute.</p>
                </div>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
                <button className="send-btn">Send</button>
              </div>
            </div>
          </>
        ) : (
          <div className="welcome-screen">
            <h1>Welcome to Collaborative Learning</h1>
            <p>Select a study room from the sidebar or join a room with a code to start collaborating.</p>
            <div className="features">
              <div className="feature-card">
                <div className="feature-icon">🎥</div>
                <h3>Video Study Sessions</h3>
                <p>Connect face-to-face with peers through HD video calls</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🖥️</div>
                <h3>Screen Sharing</h3>
                <p>Share your screen to explain concepts or work through problems</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🧠</div>
                <h3>Interactive Tools</h3>
                <p>Collaborate with whiteboards, shared notes, and study timers</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showJoinModal && (
        <div className="modal-overlay">
          <div className="join-modal">
            <h3>Join a Study Room</h3>
            <p>Enter the 6-digit room code to join an existing study session.</p>
            <input 
              type="text" 
              placeholder="Enter code..." 
              maxLength="6"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinCode("");
                }}
              >
                Cancel
              </button>
              <button 
                className="join-confirm-btn"
                onClick={() => {
                  alert(`Joining room with code: ${joinCode}`);
                  setShowJoinModal(false);
                  setJoinCode("");
                }}
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollaborativeLearning;