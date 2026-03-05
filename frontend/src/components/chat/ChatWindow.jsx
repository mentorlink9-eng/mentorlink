import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import './ChatWindow.css';

const ChatWindow = ({ onBack }) => {
  const {
    activeConversation,
    messages,
    fetchMessages,
    markAsRead,
    conversations,
    onlineUsers,
    typingUsers,
    loading
  } = useChat();

  const messagesEndRef = useRef(null);
  const [recipient, setRecipient] = useState(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
      markAsRead(activeConversation);

      // Find recipient info from conversations
      const conv = conversations.find(
        c => c.participant?._id === activeConversation
      );
      if (conv) {
        setRecipient(conv.participant);
      }
    }
  }, [activeConversation, fetchMessages, markAsRead, conversations]);

  if (!activeConversation) {
    return (
      <div className="chat-window">
        <div className="no-conversation-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
            <path d="M9 10h6M9 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3>Select a conversation</h3>
          <p>Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    );
  }

  const isOnline = onlineUsers.has(activeConversation);
  const isTyping = typingUsers.has(activeConversation);

  return (
    <div className="chat-window">
      <ChatHeader
        recipient={recipient}
        isOnline={isOnline}
        onBack={onBack}
      />

      <div className="messages-container">
        {loading && messages.length === 0 ? (
          <div className="loading-messages">
            <div className="spinner"></div>
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <p>No messages yet</p>
            <p className="subtext">Send a message to start the conversation!</p>
          </div>
        ) : (
          <>
            <div className="messages-list">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message._id}
                  message={message}
                  isFirstInGroup={
                    index === 0 ||
                    messages[index - 1]?.sender?._id !== message.sender?._id
                  }
                />
              ))}
              {isTyping && (
                <div className="typing-indicator">
                  <div className="typing-avatar">
                    <img
                      src={recipient?.profileImage || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'}
                      alt={recipient?.name}
                    />
                  </div>
                  <div className="typing-bubble">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>

      <MessageInput recipientId={activeConversation} />
    </div>
  );
};

export default ChatWindow;
