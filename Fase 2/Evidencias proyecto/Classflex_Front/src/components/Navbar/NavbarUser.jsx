import "./styles.css";
import { useEffect, useState } from "react";
import { Button, Col, Container, Navbar, Row } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router";
import axios from "axios";
import NavForm from "./NavForm";
import NavUsername from "./NavUsername";

export default function NavbarUser({user, backButton = null}) {
  const [nombreUser, setNombreUser] = useState(null);
  const [colegio, setColegio] = useState(null);
  const [curso, setCurso] = useState(null);
  const role = localStorage.getItem("role");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    
    if(user){
      setNombreUser(
        `${user.nombre} ${user.apellido_paterno} ${user.apellido_materno}`
      );

      /* Se comparan roles debido a que el componente se implementa en Profesor y Alumno */
      if (role === "professor"){
        const colegioId = localStorage.getItem("colegio");
        const selectedColegio = user.colegios?.find(
          (colegio) => colegio.id === parseInt(colegioId)
        );
        setColegio(selectedColegio);
      }

      if (role === "student") {
        setColegio(user.colegio || null);
        setCurso(user.curso.curso);
      }

      setLoading(false);
    }
  }, [user, role]);

  const handleLogout = () => {
    const channel = new BroadcastChannel("sesion_channel");
    channel.postMessage("logout");
    axios
      .post("http://localhost:8000/api/logout")
      .then((response) => {
        window.location.href = "/";
        localStorage.removeItem("colegio");
        localStorage.removeItem("colegios");
        localStorage.removeItem("role");
        localStorage.removeItem("profesor_id");
        localStorage.removeItem("profesor");
        localStorage.removeItem("asignatura");
        localStorage.removeItem("curso");
        localStorage.removeItem("alumno_id");
        localStorage.removeItem("clase_activa");
        localStorage.removeItem("clase_id");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Navbar expand="lg" className="mt-3 p-3 navbar">
      <Container fluid>
        {loading ? (
          <Row className="w-100 align-items-center text-center">
            <h2>Cargando...</h2>
          </Row>
        ) : (
          <Row className="w-100 align-items-center text-center">
            <Col md={1} sm={3}>
              {backButton && (
                <IoMdArrowRoundBack
                  size={36}
                  className="back-button"
                  onClick={() => navigate(backButton)}
                />
              )}
            </Col>
            <Col md={2} sm={12}>
              <Navbar.Brand href="" id="navbar-brand">
                <img
                  src="ClassFlex__logo_grande.svg"
                  alt="classflex-logo"
                  id="logo-classflex-navbar"
                />
              </Navbar.Brand>
            </Col>
            <Col md={5} sm={12}>
              {loading ? (
                <p>Cargando colegio...</p>
              ) : (
                <NavForm colegio={colegio} curso={curso}/>
              )}
            </Col>
            <Col md={2} sm={6}>
              <NavUsername nombre={nombreUser} />
            </Col>
            <Col md={2} sm={6}>
              <Button variant="none" id="logout-button" onClick={handleLogout}>
                <CiLogout size={20} className="icon-spacing" />
                <span>Cerrar sesión</span>
              </Button>
            </Col>
          </Row>
        )}
      </Container>
    </Navbar>
  );
}