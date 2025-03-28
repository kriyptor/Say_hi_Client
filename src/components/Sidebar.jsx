import React from 'react';
import { Nav, Form, Button } from 'react-bootstrap';

const Sidebar = ({
  currentTab,
  setCurrentTab,
  privateChats,
  groupChats,
  setSelectedChat,
  setShowCreateGroupModal,
  searchTerm,
  setSearchTerm,
}) => (
  <div className="p-3">
    <Nav variant="pills" activeKey={currentTab} onSelect={setCurrentTab} className="flex-column">
      <Nav.Item>
        <Nav.Link eventKey="private">Private Chats</Nav.Link>
        {currentTab === 'private' && (
          <div className="mt-2">
            <Form.Control
              type="text"
              placeholder="Search users"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <ul className="list-unstyled">
              {privateChats.map(chat => (
                <li
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className="p-2 hover:bg-light cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  {chat.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Nav.Item>

      <Nav.Item>
        <Nav.Link eventKey="group">Group Chats</Nav.Link>
        {currentTab === 'group' && (
          <div className="mt-2">
            <Button
              variant="success"
              size="sm"
              onClick={() => setShowCreateGroupModal(true)}
              className="mb-2"
            >
              Create Group
            </Button>
            <ul className="list-unstyled">
              {groupChats.map(chat => (
                <li
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className="p-2 hover:bg-light cursor-pointer border border-success p-2 mb-2 border-opacity-75 mb-2 rounded"
                  style={{ cursor: 'pointer' }}
                >
                  {chat.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Nav.Item>
    </Nav>
  </div>
);

export default Sidebar;