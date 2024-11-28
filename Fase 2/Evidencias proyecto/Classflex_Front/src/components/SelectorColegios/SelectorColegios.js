import "./SelectorColegios.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SelectorColegios() {
  const colegios = JSON.parse(localStorage.getItem("colegios") || "[]");
  const navigate = useNavigate();

  useEffect(() => {
    if (colegios.length === 1) {
      localStorage.setItem('colegio', colegios[0].id);
      navigate("/professor-dashboard");
    }
  });

  return (
    <Container className="container-selector-colegios text-center">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2>Selecciona un Colegio</h2>
          <ListaColegios colegios={colegios} />
        </Col>
      </Row>
    </Container>
  );
}

function ListaColegios({ colegios }) {
  return (
    <ul className="lista-colegios">
      {colegios.map((colegio) => (
        <Colegio key={colegio.id} colegio={colegio} />
      ))}
    </ul>
  );
}

function Colegio({ colegio }) {
  const navigate = useNavigate();

  function handleClick() {
    localStorage.setItem("colegio", colegio.id);
    navigate("/professor-dashboard");
  }

  return (
    <li className="colegio-item" onClick={handleClick}>
      {colegio.nombre}
    </li>
  );
}
