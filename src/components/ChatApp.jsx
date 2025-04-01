import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import CreateGroupModal from './CreateGroupModal';

const ChatApp = ({ handleLogout, token }) => {
  const URL = 'http://localhost:4000';

  const [currentTab, setCurrentTab] = useState('private');
  const [selectedChat, setSelectedChat] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  //private chats
  const [privateChats, setPrivateChats] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [privateUserName, setPrivateUserName] = useState(``);
  const [groupName, setGroupName] = useState(``)
  const [groupChats, setGroupChats] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);

  useEffect(() => {
    const fetchChatsDetails = async () => {
      try {
        const privateChat = await axios.get(`${URL}/chat/get-private-chat`, {
          headers: { "Authorization" : token }
        });
        console.log('Private chats details:', privateChat.data.data)
        setPrivateChats(privateChat.data.data);

        const groupChat = await axios.get(`${URL}/chat/get-all-group`, {
          headers: { "Authorization" : token }
        });
        setGroupChats(groupChat.data.data);

        const userList = await axios.get(`${URL}/user/get-all-users`, {
          headers: { "Authorization" : token }
        });
        setAvailableUsers(userList.data.data);

      } catch (error) {
        console.error('Error fetching private chats:', error);
      }
    };

    fetchChatsDetails();
  }, []);


  const getPrivateMessages = async (receiverUserName, receiverUserId) => {
    try {
      
      const response = await axios.get(`${URL}/chat/get-messages`, {
        params: { receiverUser : receiverUserId },
        headers: { "Authorization" : token }
      });
        setPrivateUserName(receiverUserName)
        setPrivateMessages(response.data.chatData);
    } catch (error) {
      console.error('Error fetching private chats:', error);
    }
  };


  const getGroupMessages = async (groupName, groupId) => {
    try {
      const response = await axios.get(`${URL}/chat/get-message-group`, {
        params: { groupId },
        headers: { "Authorization" : token }
      });
      setGroupName(groupName);
      setGroupMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching private chats:', error);
    }
  };


  const filteredPrivateChats = privateChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = async (groupName, selectedMembers) => {
    try {

      const newGroup = await axios.post(`${URL}/chat/create-group`, 
        { groupName : groupName, memberIds : selectedMembers}, 
        {headers: { "Authorization" : token }
      })

      setGroupChats([...groupChats, newGroup.data.data[0]]);
      setShowCreateGroupModal(false);
    } catch (error) {
      console.error('Error fetching private chats:', error);
    }
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
            privateChats={privateChats}
            groupChats={groupChats}
            setSelectedChat={setSelectedChat}
            setShowCreateGroupModal={setShowCreateGroupModal}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getPrivateMessages={getPrivateMessages}
            getGroupMessages={getGroupMessages}
          />
        </Col>
        <Col xs={12} md={9}>
          <ChatArea
            currentTab={currentTab}
            chat={selectedChatData}
            privateMessages={privateMessages}
            privateUserName={privateUserName}
            groupMessages={groupMessages}
            groupName={groupName}
            onSendMessage={handleSendMessage}
          />
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