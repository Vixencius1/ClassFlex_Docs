import "./CreatePasswordForm.css";
import "../../styles/loading-animations.css";
import Logo from "../Logo/Logo.js";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ResetPasswordForm() {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setconfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Agregar estado isLoading
  const [isValidToken, setIsValidToken] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const verifyToken = async (uid, token) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/verify-create-token",
        {
          uid,
          token,
        }
      );

      if (response.data.valid) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    const verifyTokenAsync = async () => {
      const isValid = await verifyToken(uid, token);
      setIsValidToken(isValid);
    };
    verifyTokenAsync();
  }, [uid, token]);

  if (!isValidToken) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Logo />
        <div className="text-center" style={{ fontSize: "24px" }}>
          <h2 style={{ color: "red" }}>Error: Link no válido</h2>
          <p>
            Lo sentimos, el link ha expirado o no es válido. Por favor, intenta
            nuevamente o solicita un nuevo link de restablecimiento de
            contraseña.
          </p>
        </div>
      </Container>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true); // Establecer isLoading en true antes de enviar la solicitud

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/create-password",
        {
          uid: uid,
          token: token,
          new_password: newPassword,
        }
      );

      setMessage(response.data.message); // Mensaje de éxito
      setError(""); // Limpiar mensaje de error
      setNewPassword("");
      setconfirmNewPassword("");
      setIsDisabled(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError("Ocurrió un error. Inténtalo de nuevo más tarde.");
      setMessage(""); // Limpiar mensaje de éxito
    } finally {
      setIsLoading(false); // Establecer isLoading en false después de completar la solicitud
    }
  };

  return (
    <Container
      id="form-reset-password"
      className="d-flex justify-content-center align-items-center"
    >
      <Form id="form-reset" onSubmit={handleSubmit}>
        <h2>Crear Contraseña</h2>
        {/* Nueva Contraseña */}
        <Form.Group className="mb-3" controlId="formNewPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa la contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isDisabled ? "disabled" : ""}
          />
        </Form.Group>
        {/* Confirmar Contraseña */}
        <Form.Group className="mb-3" controlId="formConfirmNewPassword">
          <Form.Label>Confirmar Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa la contraseña nuevamente"
            value={confirmNewPassword}
            onChange={(e) => setconfirmNewPassword(e.target.value)}
            disabled={isDisabled ? "disabled" : ""}
          />
        </Form.Group>
        {/* Mensaje de éxito */}
        {message && <Alert variant="success">{message}</Alert>}
        {/* Mensaje de error */}
        {error && <Alert variant="danger">{error}</Alert>}
        {/* Botón de submit */}
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading || isDisabled}
        >
          {isLoading ? (
            <div className="points-container">
              <div className="loading">
                <div className="point"></div>
                <div className="point"></div>
                <div className="point"></div>
              </div>
            </div>
          ) : (
            "Crear contraseña"
          )}
        </Button>
      </Form>
    </Container>
  );
}
