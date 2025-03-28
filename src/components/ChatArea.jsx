import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

const ChatArea = ({ chat, onSendMessage }) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom

  // Handle form submission to send a message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (chat && messageText.trim()) {
      onSendMessage(chat.id, messageText);
      setMessageText('');
    }
  };

  // Auto-scroll to the bottom when messages change or chat is selected
  useEffect(() => {
    if (chat && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat, chat?.messages.length]); // Trigger on chat change or new message

  return (
    <div className="d-flex flex-column" style={{ height: 'calc(100vh - 70px)' }}>
      {/* Fixed Chat Name Header */}
      {chat && (
        <div
          className="bg-white text-center p-3 border-bottom"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1, // Ensure it stays above scrolling content
          }}
        >
          <h3 className="m-0">{chat.name}</h3>
        </div>
      )}

      {/* Messages Section */}
      <div
        className="flex-grow-1 p-3 overflow-auto"
        style={{ marginTop: chat ? '0' : 'auto' }} // Adjust margin when no chat is selected
      >
        {chat ? (
          <div>
            {chat.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`d-flex mb-2 ${
                  msg.sender === 'You' ? 'justify-content-end' : 'justify-content-start'
                }`}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: msg.sender === 'You' ? '#e3f2fd' : '#f5f5f5',
                  }}
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              </div>
            ))}
            {/* Dummy div to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <p className="text-center mt-5">Select a chat to start messaging</p>
        )}
      </div>

      {/* Message Input */}
      {chat && (
        <Form onSubmit={handleSubmit} className="p-3 border-top">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Type a message"
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
            />
            <Button variant="primary" type="submit">
              Send
            </Button>
          </InputGroup>
        </Form>
      )}
    </div>
  );
};

export default ChatArea;