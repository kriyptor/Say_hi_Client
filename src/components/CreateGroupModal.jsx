import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const CreateGroupModal = ({ show, onHide, availableUsers, onCreateGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleSubmit = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      onCreateGroup(groupName, selectedMembers);
      setGroupName('');
      setSelectedMembers([]);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Select Members</Form.Label>
            {availableUsers.map(user => (
              <Form.Check
                key={user.id}
                type="checkbox"
                label={user.name}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedMembers([...selectedMembers, user.id]);
                  } else {
                    setSelectedMembers(selectedMembers.filter(m => m.id !== user.id));
                  }
                }}
              />
            ))}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateGroupModal;