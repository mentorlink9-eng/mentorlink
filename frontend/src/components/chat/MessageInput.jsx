import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import './MessageInput.css';

const MessageInput = ({ recipientId }) => {
  const { sendMessage, startTyping, stopTyping } = useChat();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleTyping = () => {
    // Start typing indicator
    startTyping(recipientId);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(recipientId);
    }, 2000);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    handleTyping();
  };

  const handleSend = async (e) => {
    e?.preventDefault();

    if (!message.trim() || sending) return;

    try {
      setSending(true);
      stopTyping(recipientId);
      await sendMessage(recipientId, message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSend} className="message-input-form">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="message-textarea"
            rows={1}
            maxLength={2000}
            disabled={sending}
          />
        </div>

        <button
          type="submit"
          className={`send-button ${message.trim() ? 'active' : ''}`}
          disabled={!message.trim() || sending}
        >
          {sending ? (
            <div className="sending-spinner"></div>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </form>

      {message.length > 1800 && (
        <div className="character-count">
          {message.length}/2000
        </div>
      )}
    </div>
  );
};

export default MessageInput;
