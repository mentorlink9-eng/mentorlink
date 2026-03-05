import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatHeader.css';

const ChatHeader = ({ recipient, isOnline, onBack }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (recipient?.role === 'mentor') {
      navigate(`/mentor-profile/${recipient._id}`);
    } else if (recipient?.role === 'student') {
      navigate(`/students/${recipient._id}`);
    }
  };

  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="recipient-info">
          <div className="recipient-avatar-wrapper">
            <img
              src={recipient?.profileImage || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'}
              alt={recipient?.name}
              className="recipient-avatar"
            />
            {isOnline && <div className="online-dot"></div>}
          </div>
          <div className="recipient-details">
            <h3 className="recipient-name">{recipient?.name || 'Unknown'}</h3>
            <p className="recipient-status">
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <div className="chat-header-actions">
        <button
          className="header-action-btn"
          onClick={handleViewProfile}
          title="View Profile"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
