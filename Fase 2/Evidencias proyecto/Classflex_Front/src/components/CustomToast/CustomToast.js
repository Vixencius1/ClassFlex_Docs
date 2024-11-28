import { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

export default function CustomToast({
  message,
  show,
  onClose,
  backgroundColor,
  textColor,
}) {
  const [positionY, setPositionY] = useState(0);

  const handleScroll = () => {
    setPositionY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    
      <ToastContainer
        className="p-3"
        style={{
          position: "absolute",
          top: "25px",
          right: "10px",
          zIndex: 1,
        }}
      >
        <Toast
          show={show}
          onClose={onClose}
          delay={3000}
          style={{
            backgroundColor: backgroundColor || "#d4edda",
            color: textColor || "#155724",
            border: `1px solid ${textColor || "#155724"}`,
            borderRadius: "5px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            transition: "opacity 0.5s ease-in-out",
            textAlign: "center",
          }}
          autohide
        >
          <Toast.Body>{message}</Toast.Body>
        </Toast>
      </ToastContainer>
  
  );
}
