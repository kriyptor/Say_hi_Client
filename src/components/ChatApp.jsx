import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import CreateGroupModal from './CreateGroupModal';

const ChatApp = ({ handleLogout }) => {
  const [currentTab, setCurrentTab] = useState('private');
  const [selectedChat, setSelectedChat] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  //TODO:Add side effect after mounting the component to call the private & group chat data here

  const [privateChats, setPrivateChats] = useState([
    { id: '1', name: 'Alice', messages: [{ sender: 'Alice', text: 'Hi!' }, { sender: 'You', text: 'Hello!' }] },
    { id: '2', name: 'Bob', messages: [{ sender: 'Bob', text: 'Hey there!' }] },
  ]);

  const [groupChats, setGroupChats] = useState([
    { id: 'g1', name: 'Group A', messages: [{ sender: 'Charlie', text: 'Welcome to Group A!' }] },
  ]);

  const availableUsers = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];

  const filteredPrivateChats = privateChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = (groupName, selectedMembers) => {
    const newGroup = {
      id: `g${Math.random().toString(36).substr(2, 9)}`,
      name: groupName,
      members: selectedMembers,
      messages: [],
    };
    setGroupChats([...groupChats, newGroup]);
    setShowCreateGroupModal(false);
  };

  const handleSendMessage = (chatId, messageText) => {
    if (!messageText.trim()) return;
    const updatedChats = currentTab === 'private' ? privateChats : groupChats;
    const setChats = currentTab === 'private' ? setPrivateChats : setGroupChats;

    const newMessage = { sender: 'You', text: messageText };
    const chatIndex = updatedChats.findIndex(chat => chat.id === chatId);

    if (chatIndex !== -1) {
      const updatedChat = {
        ...updatedChats[chatIndex],
        messages: [...updatedChats[chatIndex].messages, newMessage],
      };
      setChats([
        ...updatedChats.slice(0, chatIndex),
        updatedChat,
        ...updatedChats.slice(chatIndex + 1),
      ]);
    }
  };

  const selectedChatData = currentTab === 'private'
    ? privateChats.find(chat => chat.id === selectedChat)
    : groupChats.find(chat => chat.id === selectedChat);

  return (
    <Container fluid className="p-0">
      <Navbar handleLogout={handleLogout} />
      <Row className="g-0"> 
        <Col xs={12} md={3} className="border-end">
          <Sidebar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            privateChats={filteredPrivateChats}
            groupChats={groupChats}
            setSelectedChat={setSelectedChat}
            setShowCreateGroupModal={setShowCreateGroupModal}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Col>
        <Col xs={12} md={9}>
          <ChatArea chat={selectedChatData} onSendMessage={handleSendMessage} />
        </Col>
      </Row>
      <CreateGroupModal
        show={showCreateGroupModal}
        onHide={() => setShowCreateGroupModal(false)}
        availableUsers={availableUsers}
        onCreateGroup={handleCreateGroup}
      />
    </Container>
  );
};

export default ChatApp;