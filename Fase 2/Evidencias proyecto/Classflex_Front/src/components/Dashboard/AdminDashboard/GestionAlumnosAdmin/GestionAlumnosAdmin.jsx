import "./styles.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Sidebar from "../../../Sidebar/Sidebar.js";
import TablaAlumnos from "./TablaAlumnos.jsx";
import FormAgregarAlumno from "./FormAgregarAlumno.jsx";
import FormEditarAlumno from "./FormEditarAlumno.jsx";
import FormAsignarAlumno from "./FormAsignarAlumno.jsx";
import { useEffect, useState } from "react";
import { initializeChannel } from "../../../../data/broadcastChannel.js";

// Componente principal que gestiona los alumnos
function GestionAlumnosAdmin() {
  const [show, setShow] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoAEditar, setAlumnoAEditar] = useState(null);

  useEffect(() => {
    const channel = initializeChannel();

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    const colegioId = localStorage.getItem("colegio");

    if (colegioId) {
      axios
        .get(`http://localhost:8000/api/main/alumno/${colegioId}/listar-alumno`)
        .then((response) => {
          setAlumnos(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error("No se encontró el ID del colegio en el localStorage.");
    }
  }, []);

  // Función para añadir un nuevo alumno a la lista
  function handleAddAlumnos(alumno) {
    setAlumnos((prevAlumnos) => [...prevAlumnos, alumno]);
  }

  // Función para actualizar datos de alumno
  function handleUpdateAlumno(alumnoActualizado) {
    setAlumnos((alumnos) =>
      alumnos.map((alumno) =>
        alumno.id === alumnoActualizado.id ? alumnoActualizado : alumno
      )
    );
    setShow(false);
  }

  // Función para seleccionar un alumno para editar
  function handleEditAlumno(alumno) {
    setAlumnoAEditar(alumno);
    setShow(true);
  }

  return (
    <Container className="mb-5" fluid>
      <Row>
        <Col md={1}>
          <Sidebar />
        </Col>

        <Col md={11}>
          <FormAgregarAlumno onAddAlumno={handleAddAlumnos} />

          <TablaAlumnos alumnos={alumnos} onEditAlumno={handleEditAlumno} />

          <FormAsignarAlumno />

          {alumnoAEditar && (
            <FormEditarAlumno
              alumno={alumnoAEditar}
              onUpdateAlumno={handleUpdateAlumno}
              setAlumnoAEditar={setAlumnoAEditar}
              show={show}
              setShow={setShow}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default GestionAlumnosAdmin;
