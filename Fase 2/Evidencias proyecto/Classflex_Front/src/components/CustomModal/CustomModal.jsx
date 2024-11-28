import "./styles.css";
import Modal from "react-bootstrap/Modal";

function CustomModal({ show = false, handleClose, modalTitle = "", children }) {
  return (
    <Modal className="custom-modal" show={show} onHide={handleClose}>
      <Modal.Header closeVariant="white" closeButton>
        <Modal.Title className="col-11 text-center">{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}

export default CustomModal;
