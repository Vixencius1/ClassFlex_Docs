import "./styles.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import TablaCursos from "./TablaCursos.jsx";
import Sidebar from "../../../Sidebar/Sidebar.js";
import FormAgregarCurso from "./FormAgregarCurso.jsx";
import FormEditarCurso from "./FormEditarCurso.jsx";
import CustomModal from "../../../CustomModal";
import { useCallback, useEffect, useState } from "react";
import { initializeChannel } from "../../../../data/broadcastChannel.js";

function GestionCursosAdmin() {
  const [cursos, setCursos] = useState([]);
  const [cursoAEditar, setCursoAEditar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cursoAEliminar, setCursoAEliminar] = useState(null);

  useEffect(() => {
    const channel = initializeChannel();

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    const colegio = localStorage.getItem("colegio");
    if (colegio) {
      axios
        .get(`http://localhost:8000/api/main/curso/${colegio}/listar-curso`, {
          timeout: 5000,
        })
        .then((response) => {
          setCursos(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error("No se encontró el ID del colegio en el localStorage.");
    }
  }, []);

  // Función para añadir un nuevo curso a la lista
  const handleAddCursos = useCallback((curso) => {
    setCursos((cursos) => [...cursos, curso]);
  }, []);

  // Función para actualizar un curso existente en la lista
  const handleUpdateCursos = useCallback((cursoActualizado) => {
    setCursos((cursos) =>
      cursos.map((curso) =>
        curso.id === cursoActualizado.id ? cursoActualizado : curso
      )
    );
  }, []);

  // Función para seleccionar un curso para editar
  const handleEditCurso = useCallback((curso) => {
    setCursoAEditar(curso);
  }, []);

  // Función para cerrar el modal
  const handleCloseEditModal = useCallback(() => {
    setCursoAEditar(null);
  }, []);

  // Función para abrir el modal de confirmación al eliminar un curso
  const handleDeleteCurso = useCallback((curso) => {
    setCursoAEliminar(curso);
    setShowConfirmModal(true);
  }, []);

  // Función para confirmar la eliminación del curso
  const handleConfirmDelete = useCallback(() => {
    if (cursoAEliminar) {
      axios
        .delete(
          `http://localhost:8000/api/main/curso/${cursoAEliminar.id}/delete`,
          {
            timeout: 5000,
          }
        )
        .then((response) => {
          setCursos((cursos) =>
            cursos.filter((c) => c.id !== cursoAEliminar.id)
          );
          setShowConfirmModal(false);
          setCursoAEliminar(null);
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
          setShowConfirmModal(false);
        });
    }
  }, [cursoAEliminar]);

  // Función para cancelar la eliminación
  const handleCancelDelete = useCallback(() => {
    setShowConfirmModal(false);
    setCursoAEliminar(null);
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md={1}>
          <Sidebar />
        </Col>

        <Col md={11} className="col-gestion-cursos-admin mb-5">
          <FormAgregarCurso onAddCurso={handleAddCursos} />

          <TablaCursos
            cursos={cursos}
            onEditCurso={handleEditCurso}
            onDeleteCurso={handleDeleteCurso}
          />

          {cursoAEditar && (
            <FormEditarCurso
              curso={cursoAEditar}
              onUpdateCurso={handleUpdateCursos}
              setCursoAEditar={setCursoAEditar}
              onClose={handleCloseEditModal}
            />
          )}

          <CustomModal
            show={showConfirmModal}
            handleClose={handleCancelDelete}
            modalTitle="Confirmar eliminación"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                textAlign: "center",
              }}
            >
              <p>
                ¿Estás seguro de eliminar el curso{" "}
                <strong>{cursoAEliminar?.curso}</strong>?
              </p>
              <div
                className="d-flex justify-content-center"
                style={{ gap: "5px" }}
              >
                <Button variant="secondary" onClick={handleCancelDelete}>
                  Cancelar
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete}>
                  Eliminar
                </Button>
              </div>
            </div>
          </CustomModal>
        </Col>
      </Row>
    </Container>
  );
}

export default GestionCursosAdmin;
