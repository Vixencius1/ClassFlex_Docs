import "./styles.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Sidebar from "../../../Sidebar/Sidebar.js";
import TablaProfesores from "./TablaProfesores.jsx";
import FormAgregarProfesor from "./FormAgregarProfesor.jsx";
import FormEditarProfesor from "./FormEditarProfesor.jsx";
import FormAsignarProfesor from "./FormAsignarProfesor.jsx";
import { useEffect, useState } from "react";
import { initializeChannel } from "../../../../data/broadcastChannel.js";

// Componente principal que gestiona los profesores
export default function GestionProfesoresAdmin() {
  // Estado para almacenar la lista de profesores
  const [profesores, setProfesores] = useState([]);
  const [profesorAEditar, setProfesorAEditar] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const channel = initializeChannel();

    return () => {
      channel.close();
    };
  }, []);

  // Hook que obtiene la lista de profesores cuando el componente se renderiza
  useEffect(() => {
    const colegioId = localStorage.getItem("colegio");

    if (colegioId) {
      axios
        .get(
          `http://localhost:8000/api/main/profesor/${colegioId}/listar-profesor`
        )
        .then((response) => {
          setProfesores(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error("No se encontró el ID del colegio en el localStorage.");
    }
  }, []);

  // Función para añadir un nuevo profesor a la lista
  function handleAddProfesores(profesor) {
    setProfesores((profesores) => [...profesores, profesor]);
  }

  // Función para actualizar un profesor existente en la lista
  function handleUpdateProfesor(profesorActualizado) {
    setProfesores((profesores) =>
      profesores.map((profesor) =>
        profesor.id === profesorActualizado.id ? profesorActualizado : profesor
      )
    );
    setShow(false);
  }

  // Función para seleccionar un profesor para editar
  function handleEditProfesor(profesor) {
    setProfesorAEditar(profesor);
    setShow(true);
  }

  return (
    <Container className="mb-5" fluid>
      <Row>
        <Col md={1}>
          <Sidebar />
        </Col>

        <Col md={11}>
          <FormAgregarProfesor onAddProfesor={handleAddProfesores} />

          <TablaProfesores
            profesores={profesores}
            onEditProfesor={handleEditProfesor}
          />

          <FormAsignarProfesor />

          {profesorAEditar && (
            <FormEditarProfesor
              profesor={profesorAEditar}
              onUpdateProfesor={handleUpdateProfesor}
              setProfesorAEditar={setProfesorAEditar}
              show={show}
              setShow={setShow}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}