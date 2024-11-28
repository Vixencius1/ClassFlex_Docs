import "./styles.css";
import Sidebar from "../../Sidebar/Sidebar.js";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect } from "react";
import { initializeChannel } from "../../../data/broadcastChannel.js";
import AttendanceList from "./AttendanceList.jsx";

// Función pricipal del dashboard
export default function AdminDashboard() {
  // Función para cerrar sesión en todas las ventanas
  // Se debe importar en cada componente que requiera de autenticación
  useEffect(() => {
    const channel = initializeChannel();

    // Devuelve una función de limpieza para cerrar el canal al desmontar el componente
    return () => {
      channel.close();
    };
  }, []); // Se ejecuta al montar el componente

  return (
    <Container className="mb-5" style={{ marginTop: "7rem" }}>
      <Row>
        <Col md={2}>
          <Sidebar />
        </Col>
        <Col
          xs={12}
          md={10}
          className="d-flex align-items-center justify-content-center text-center"
          style={{
            border: "2px solid #00bfff",
            borderRadius: "20px",
            flexDirection: "column",
            minHeight: "6vh",
          }}
        >
          <h1 className="text-center pb-3 mt-5">
            Registro de Asistencias Generales
          </h1>
          <p style={{ fontSize: "1.1rem" }}>
            <strong>(Generadas por el mes actual)</strong>
          </p>
        </Col>
      </Row>
      {/* Fila de la tabla de asistencia y otros componentes */}
      <Row className="attendance-row">
        <Col md={{ span: 10, offset: 2 }}>
          <AttendanceList />
        </Col>
      </Row>
    </Container>
  );
}
