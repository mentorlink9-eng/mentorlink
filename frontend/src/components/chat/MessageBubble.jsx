import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { format, isToday, isYesterday } from 'date-fns';
import './MessageBubble.css';

const MessageBubble = ({ message, isFirstInGroup }) => {
  const { user } = useAuth();
  const isSent = message.sender?._id === user?._id;

  const formatMessageTime = (date) => {
    if (!date) return '';

    try {
      const messageDate = new Date(date);

      if (isToday(messageDate)) {
        return format(messageDate, 'h:mm a');
      } else if (isYesterday(messageDate)) {
        return `Yesterday ${format(messageDate, 'h:mm a')}`;
      } else {
        return format(messageDate, 'MMM d, h:mm a');
      }
    } catch {
      return '';
    }
  };

  return (
    <div className={`message-bubble-wrapper ${isSent ? 'sent' : 'received'}`}>
      {!isSent && isFirstInGroup && (
        <div className="message-avatar">
          <img
            src={message.sender?.profileImage || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'}
            alt={message.sender?.name}
          />
        </div>
      )}

      <div className={`message-bubble ${isSent ? 'sent-bubble' : 'received-bubble'}`}>
        {message.messageType === 'text' && (
          <p className="message-content">{message.content}</p>
        )}

        {message.messageType === 'image' && message.attachments?.[0] && (
          <div className="message-image">
            <img src={message.attachments[0].fileUrl} alt="Shared image" />
          </div>
        )}

        {message.messageType === 'file' && message.attachments?.[0] && (
          <div className="message-file">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2"/>
              <polyline points="13 2 13 9 20 9" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <div className="file-info">
              <p className="file-name">{message.attachments[0].fileName}</p>
              <a
                href={message.attachments[0].fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="file-download"
              >
                Download
              </a>
            </div>
          </div>
        )}

        <div className="message-meta">
          <span className="message-time">{formatMessageTime(message.createdAt)}</span>
          {isSent && (
            <span className="message-status">
              {message.isRead ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="read-receipt">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 6L12 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
