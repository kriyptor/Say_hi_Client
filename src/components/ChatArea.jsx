import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { User, Users } from 'lucide-react';


const ChatArea = ({
  chat,
  onSendMessage,
  privateMessages,
  privateUserName,
  privateUserID,
  groupMessages,
  groupName,
  groupID,
  currentTab,
}) => {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom

  // Handle form submission to send a message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim() && currentTab === "private") {
      console.log("Sending message:", messageText, privateUserID);
      onSendMessage(privateUserID, messageText);
      setMessageText("");
    }else if(messageText.trim() && currentTab === "group"){
      console.log("Sending message:", messageText, groupID);
      onSendMessage(groupID, messageText);
      setMessageText("");
    }
  };

  // Auto-scroll to the bottom when messages change or chat is selected
  useEffect(() => {
    if (chat && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat, chat?.messages.length]); // Trigger on chat change or new message

  return (
    <div
      className="d-flex flex-column"
      style={{ height: "calc(100vh - 70px)" }}
    >
      {/* Fixed Chat Name Header */}
      {currentTab === "group" && groupMessages && (
        <div
          className="bg-white p-3 border-bottom justify-content-between d-flex align-items-center"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1, // Ensure it stays above scrolling content
          }}
        >
          
          <div className='d-flex align-items-center gap-2'>
          <Users />
          <h3 className="m-0">{groupName}</h3>
          </div>

          <Button variant="outline-primary">Info</Button>
        </div>
      )}

      {currentTab === "private" && privateMessages && (
        <div
          className="bg-white p-3 border-bottom justify-content-between d-flex align-items-center"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1, // Ensure it stays above scrolling content
          }}
        >
          <div className='d-flex align-items-center gap-2'>
          <User />
          <h3 className="m-0">{privateUserName}</h3>
          </div>

          <Button variant="outline-primary">Info</Button>
        </div>
      )}

      {/* Messages Section */}
      <div
        className="flex-grow-1 p-3 overflow-auto"
        style={{ marginTop: chat ? "0" : "auto" }} // Adjust margin when no chat is selected
      >
        {currentTab === "private" && privateMessages ? (
          <div>
            {privateMessages.map(({ id, content, senderName, createdAt }) => (
              <div
                key={id}
                className={`d-flex mb-2 ${
                  senderName === "You"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    backgroundColor:
                      senderName === "You" ? "#e3f2fd" : "#f5f5f5",
                  }}
                >
                  <strong>{senderName}:</strong> {content}
                  <p className='text-muted text-xm-end'>{Date(createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {/* Dummy div to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div>
            {groupMessages.map(({ id, content, senderName, createdAt }) => (
              <div
                key={id}
                className={`d-flex mb-2 ${
                  senderName === "You"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    backgroundColor:
                      senderName === "You" ? "#e3f2fd" : "#f5f5f5",
                  }}
                >
                  <strong>{senderName}:</strong> {content}
                <p className='text-muted text-xm-end'>{Date(createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {/* Dummy div to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      {(privateMessages || groupMessages) && (
        <Form onSubmit={handleSubmit} className="p-3 border-top">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Type a message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
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