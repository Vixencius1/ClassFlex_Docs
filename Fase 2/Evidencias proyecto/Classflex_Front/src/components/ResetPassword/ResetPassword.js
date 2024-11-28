import "./ResetPassword.css";
import "../../styles/loading-animations.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Logo from "../Logo/Logo.js";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Establecer isLoading en true antes de enviar la solicitud

    try {
      const response = await axios.post(
        "http://localhost:8000/api/change-password",
        {
          email,
        }
      );

      setError("");
      setMessage(response.data.message); // Mensaje de éxito
      setEmail("");
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(
          "Correo no encontrado. Por favor verifica e intenta nuevamente."
        );
      } else {
        setError("Ocurrió un error. Inténtalo de nuevo más tarde.");
      }
      setMessage(""); // Limpiar mensaje de éxito
    } finally {
      setIsLoading(false); // Establecer isLoading en false después de completar la solicitud
    }
  };

  return (
    <Container>
      <Row className="vh-100">
        {/* Columna izquierda para el logo */}
        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-center align-items-center"
          id="logo-column"
        >
          <Logo />
        </Col>
        {/* Columna derecha para el formulario */}
        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-center align-items-center"
        >
          <ResetPasswordForm
            email={email}
            setEmail={setEmail}
            handleSubmit={handleSubmit}
            message={message}
            error={error}
            navigate={navigate}
            isLoading={isLoading}
          />
        </Col>
      </Row>
    </Container>
  );
}

function ResetPasswordForm({
  email,
  setEmail,
  handleSubmit,
  message,
  error,
  isLoading,
}) {
  const navigate = useNavigate();
  return (
    <Container
      id="form-reset"
      className="d-flex justify-content-center align-items-center"
    >
      <div>
        {error && (
          <div
            className="alert alert-danger d-flex justify-content-center align-items-center"
            id="alert"
          >
            {error}
          </div>
        )}
        {message && (
          <div
            className="alert alert-success d-flex justify-content-center align-items-center"
            id="alert"
          >
            {message}
          </div>
        )}
        <Form id="form-restablecer" onSubmit={handleSubmit}>
          <h2>Restablecer contraseña</h2>

          {/* Input de email */}
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresar correo registrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <div id="btns-reset-form">
            {/* Botón de volver */}
            <Button id="btn-volver" onClick={() => navigate("/")}>
              Volver
            </Button>
            {/* Botón de submit */}
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="points-container">
                  <div className="loading">
                    <div className="point"></div>
                    <div className="point"></div>
                    <div className="point"></div>
                  </div>
                </div>
              ) : (
                "Aceptar"
              )}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}
