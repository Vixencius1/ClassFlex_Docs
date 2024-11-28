import "./Login.css";
import "../../styles/loading-animations.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Logo from "../Logo/Logo.js";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
  // Recibe onLogin como prop
  return (
    <Container>
      <Row className="vh-100">
        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-center align-items-center"
          id="logo-column"
        >
          <Logo />
        </Col>
        <Col xs={12} md={6}>
          <LoginForm onLogin={onLogin} />
        </Col>
      </Row>
    </Container>
  );
}

function LoginForm({ onLogin }) {
  // Recibe onLogin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState("");
  const navigate = useNavigate();

  const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      // Devuelve error si es el primer inicio de sesión
      if (response.data.is_first_login) {
        setError("Debes crear tu primera contraseña para iniciar sesión");
        return;
      }

      // Devuelve error si la cuenta no está activada
      if (response.data.is_active === false) {
        setError(
          "Tu cuenta está desactivada. Por favor, contacta al administrador"
        );
        return;
      }

      // Devuelve error si no hay un colegio asociado al usuario
      if (response.data.colegio_id === null) {
        setError("El usuario no está asociado a un colegio");
        return;
      }

      // Almacena el token de autenticación en una cookie temporal
      if (response.data.jwt) {
        document.cookie = `jwt=${response.data.jwt}; path=/; SameSite=Lax`;

        // Llama a onLogin para actualizar el estado en el componente padre
        onLogin({
          jwt: response.data.jwt,
          role: response.data.role,
          colegio: response.data.colegio_id,
        });

        // Redirigir según el rol del usuario
        switch (response.data.role) {
          case "admin":
            localStorage.setItem("colegio", response.data.colegio_id);
            localStorage.setItem("role", response.data.role);
            navigate("/admin-dashboard");
            break;
          case "student":
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("alumno_id", response.data.alumno_id);
            navigate("/student-dashboard");
            break;
          case "professor":
            localStorage.setItem(
              "colegios",
              JSON.stringify(response.data.colegios)
            );
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("profesor_id", response.data.profesor_id);
            navigate("/selector-colegios");
            break;
          default:
            navigate("/");
        }
      }
    } catch (err) {
      setError("Error en las credenciales. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      id="form-login"
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
        <Form id="form" onSubmit={handleSubmit}>
          <FaUser size={80} id="user-icon" />
          <h2>Bienvenido</h2>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresar correo"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailInvalid(
                  e.target.value.length > 0 && !isEmail(e.target.value)
                );
              }}
              className={isEmailInvalid ? "is-invalid" : ""}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresar contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Link to={"/reset-password"} id="link-reset">
            ¿Olvidaste tu contraseña?
          </Link>
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
              "Ingresar"
            )}
          </Button>
        </Form>
      </div>
    </Container>
  );
}
