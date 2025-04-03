import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import CreateGroupModal from './CreateGroupModal';
import ToastNotification from './ToastNotification';

const ChatApp = ({ handleLogout, token, setSocket, socket }) => {
  const URL = 'http://localhost:4000';

  const [currentTab, setCurrentTab] = useState('private');
  const [selectedChat, setSelectedChat] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);

  //private chats states
  const [privateChats, setPrivateChats] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [privateUserName, setPrivateUserName] = useState(``);
  const [privateUserID, setPrivateUserID] = useState(``);

  //group chat states
  const [groupName, setGroupName] = useState(``);
  const [groupID, setGroupID] = useState(``)
  const [groupChats, setGroupChats] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  

  useEffect(() => {
    const fetchChatsDetails = async () => {
      try {

        //setting up websocket for chat
        const currentSocket = io(URL, { auth : { token : token }});
        setSocket(currentSocket);

        //setting up connection listner
        currentSocket.on('connect', () => {
          console.log('Connected to socket server:', currentSocket.id);
        });

        currentSocket.on('messageSentConfirmation', (data) => {
          console.log('Message confirmed:', data);
        });

        currentSocket.on('groupMessageSentConfirmation', (data) => {
          console.log('Group Message confirmed:', data);
        });

        currentSocket.on('newMessage', (data) => {
          console.log('New message received from newMessage:', data);
          setPrivateMessages(prevMessages => [...prevMessages, data]);
        });

        currentSocket.on('newGroupMessage', (data) => {
          console.log('New message received: newGroupMessage', data);
          setGroupMessages(prevMessages => [...prevMessages, data]);
        });

        const privateChat = await axios.get(`${URL}/chat/get-private-chat`, {
          headers: { "Authorization" : token }
        });
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

     // Cleanup function to remove listeners when component unmounts
     return () => {
      if (socket) {
        socket.off('newMessage');
        socket.off('newGroupMessage');
        socket.disconnect();
      }
    };

  }, [token, URL]);


  const getPrivateMessages = async (receiverUserName, receiverUserId) => {
    try {
      
      const response = await axios.get(`${URL}/chat/get-messages`, {
        params: { receiverUser : receiverUserId },
        headers: { "Authorization" : token }
      });
        setPrivateUserID(receiverUserId);
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
      setGroupID(groupId)
      setGroupName(groupName);
      setGroupMessages(response.data.data);

      if (socket && socket.connected) {
        socket.emit('joinGroup', groupId);
      }

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

/*   const handleSendMessage = (chatId, messageText) => {
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
  }; */

  const handleSendMessage = async (destinationId, messageText) => {
    try {
      if (!messageText.trim() || !destinationId ||!socket || !socket.connected) return;

      if (currentTab === 'private') {
        const tempMessage = {
          id : `temp_private_${Date.now()}`, 
          content : messageText, 
          createdAt : Date.now().toLocaleString(),
          senderName : `You`
        }
        setPrivateMessages(prevMessages => [...prevMessages, tempMessage]);

        const payload = {
          receiverId : destinationId,
          content: messageText,
          tempId: `temp_${Date.now()}`
        }

        socket.emit('sendMessage', payload);

      } else {
        const tempMessage = {
          id : `temp_group_${Date.now()}`, 
          content : messageText, 
          createdAt : Date.now().toLocaleString(),
          senderName : `You`
        }
        setGroupMessages(prevMessages => [...prevMessages, tempMessage]);

        const payload = {
          groupId : destinationId,
          content: messageText,
          tempId: `temp_${Date.now()}`
        }

        socket.emit('sendGroupMessage', payload);

      }

    } catch (error) {
      console.error('Error fetching private chats:', error);
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
            privateUserID={privateUserID}
            groupMessages={groupMessages}
            groupName={groupName}
            groupID={groupID}
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
      {/* <ToastNotification show={show} setShow={setShow} /> */}
    </Container>
  );
};
export default ChatApp;