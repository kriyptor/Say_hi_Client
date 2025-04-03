import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function ToastNotification({show, setShow}) {
  return (
    <ToastContainer 
      className="p-3" 
      position="top-center"
      style={{ zIndex: 10 }}
    >
      <Toast onClose={() => setShow(false)} show={show} delay={4000} autohide>
        <Toast.Header>
          <strong className="me-auto">Bootstrap</strong>
        </Toast.Header>
        <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ToastNotification;