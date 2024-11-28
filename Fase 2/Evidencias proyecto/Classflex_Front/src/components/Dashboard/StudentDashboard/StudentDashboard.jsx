import "./styles.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Asistencia from "./Asistencias.js";
import FormatDate from "../../FormatDate/FormatDate.js";
import CustomModal from "../../CustomModal";
import NavbarUser from "../../Navbar/NavbarUser.jsx";
import { Button, Modal, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { initializeChannel } from "../../../data/broadcastChannel.js";

const StudentDashboard = () => {
  const [alumno, setAlumno] = useState(null);
  const [curso, setCurso] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);
  const [asistencia, setAsistencia] = useState([]);
  const [fechas, setFechas] = useState([]);

  const [show, setShow] = useState(false);

  const [selectedNotas, setSelectedNotas] = useState([]);
  const [selectedAsignatura, setSelectedAsignatura] = useState(null);

  useEffect(() => {
    const channel = initializeChannel();

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    const fetchAlumnoData = async () => {
      const alumnoId = localStorage.getItem("alumno_id");
      if (alumnoId) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/main/alumno/${alumnoId}/listar-detalle-alumno`,
            { timeout: 5000 }
          );
          setAlumno(response.data);
          setCurso(response.data.curso);
          setAsignaturas(response.data.curso.asignaturas);
        } catch (error) {
          console.error("Error al recibir datos del estudiante:", error);
        }
      }
    };
    fetchAlumnoData();
  }, []);

  useEffect(() => {
    const fetchAsignaturasData = async () => {
      if (curso) {
        try {
          const fechaResponse = await axios.get(
            `http://localhost:8000/api/main/curso/${curso.id}/listar-fechas`
          );
          setFechas(fechaResponse.data);
          const asistenciaResponse = await axios.get(
            `http://localhost:8000/api/main/listar-asistencia/${alumno.id}`
          );
          setAsistencia(asistenciaResponse.data);
        } catch (error) {
          console.error("Error al recibir datos de asignaturas:", error);
        }
      }
    };
    fetchAsignaturasData();
  }, [curso, alumno]);

  const handleShowModal = async (asignatura) => {
    setSelectedAsignatura(asignatura);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/main/alumno/${alumno.id}/${asignatura.id}/listar-notas`
      );
      setSelectedNotas(response.data);
      setShow(true);
    } catch (error) {
      console.error("Error al recibir notas:", error);
    }
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedNotas([]);
    setSelectedAsignatura(null);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <NavbarUser user={alumno} />
        </Col>
      </Row>
      <Container className="mt-5" fluid>
        <Row className="mt-3">
          {/* Tabla de asignaturas */}
          <Col xs={12} md={6} lg={4} className="justify-content-md-center">
            <h1 className="student-title text-center mb-4">Asignaturas</h1>
            <div className="container-alumno-asignaturas mb-5">
              {asignaturas.length === 0 ? (
                <p>No hay asignaturas asignadas.</p>
              ) : (
                asignaturas.map((asignatura, index) => (
                  <ul
                    className="list-asingnaturas-alumno"
                    key={index}
                    onClick={() => handleShowModal(asignatura)}
                  >
                    <li>{asignatura.asignatura}</li>
                  </ul>
                ))
              )}
            </div>
          </Col>

          {/* Fechas importantes */}
          <Col xs={12} md={6} lg={5}>
            <h1 className="student-title text-center mb-2">
              Fechas Importantes
            </h1>
            <div className="container-alumno-fecha mb-5">
              <Table id="classflex-table" variant="none" hover>
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Asignatura</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {fechas.length === 0 ? (
                    <tr>
                      <td colSpan={3}>No hay fechas importantes.</td>
                    </tr>
                  ) : (
                    fechas.map((fecha, index) => (
                      <tr key={index}>
                        <td>{fecha.evento}</td>
                        <td>{fecha.asignaturaObj.asignatura}</td>
                        <td>{FormatDate(fecha.fecha)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Col>

          {/* Porcentaje de asistencia */}
          <Col xs={12} md={6} lg={3}>
            <h1 className="student-title text-center mb-2">Asistencia</h1>
            <div className="container-alumno-asistencia mb-5">
              <Asistencia asistencia={asistencia}></Asistencia>
            </div>
          </Col>
        </Row>

        {/* Modal con las notas al pulsar asignatura */}
        <CustomModal
          show={show}
          handleClose={handleCloseModal}
          handleShow={() => setShow(true)}
          modalTitle={
            selectedAsignatura
              ? `Notas de ${selectedAsignatura.asignatura}`
              : ""
          }
        >
          <Table responsive={"lg"} hover size="md">
            <thead>
              <tr>
                <th>Evaluación</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {selectedNotas.length === 0 ? (
                <tr>
                  <td colSpan={2}>No hay notas registradas.</td>
                </tr>
              ) : (
                selectedNotas.map((nota, index) => (
                  <tr key={index}>
                    <td>{nota.tipo_evaluacion}</td>
                    <td style={{ color: nota.nota >= 4.0 ? "green" : "red" }}>
                      {nota.nota}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <Modal.Footer className="justify-content-center">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </CustomModal>
      </Container>
    </Container>
  );
};

export default StudentDashboard;
