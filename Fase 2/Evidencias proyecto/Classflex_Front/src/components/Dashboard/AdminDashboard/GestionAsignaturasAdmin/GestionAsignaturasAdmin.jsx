import "./styles.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Sidebar from "../../../Sidebar/Sidebar.js";
import TablaAsignaturas from "./TablaAsignaturas.jsx";
import FormAgregarAsignatura from "./FormAgregarAsignatura.jsx";
import FormEditarAsignatura from "./FormEditarAsignatura.jsx";
import FormAsignarAsignaturaProfesor from "./FormAsignarAsignaturaProfesor.jsx";
import FormAsignarAsignaturaCursos from "./FormAsignarAsignaturaCurso.jsx";
import { useCallback, useEffect, useState } from "react";
import { initializeChannel } from "../../../../data/broadcastChannel.js";
import CustomModal from "../../../CustomModal/CustomModal.jsx";
import { Button } from "react-bootstrap";

// Componente principal que gestiona las asignaturas
function GestionAsignaturasAdmin() {
  // Estado para almacenar la lista de asignaturas
  const [asignaturas, setAsignaturas] = useState([]);
  const [asignaturaAEditar, setAsignaturaAEditar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [asignaturaAEliminar, setAsignaturaAEliminar] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const channel = initializeChannel();

    return () => {
      channel.close();
    };
  }, []);

  // Hook que obtiene la lista de asignaturas cuando el componente se renderiza
  useEffect(() => {
    const colegioId = localStorage.getItem("colegio");

    if (colegioId) {
      axios
        .get(
          `http://localhost:8000/api/main/asignatura/${colegioId}/listar-asignatura`
        )
        .then((response) => {
          setAsignaturas(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error("No se encontró el ID del colegio en el localStorage.");
    }
  }, []);

  // Función para añadir una nueva asignatura a la lista
  function handleAddAsignaturas(asignatura) {
    setAsignaturas((asignaturas) => [...asignaturas, asignatura]);
  }

  // Función para actualizar una asignatura existente en la lista
  function handleUpdateAsignaturas(asignaturaActualizada) {
    setAsignaturas((asignaturas) =>
      asignaturas.map((asignatura) =>
        asignatura.id === asignaturaActualizada.id
          ? asignaturaActualizada
          : asignatura
      )
    );
    setShow(false);
  }

  // Función para seleccionar una asignatura para editar
  function handleEditAsignatura(asignatura) {
    setAsignaturaAEditar(asignatura);
    setShow(true);
  }

  // Función para abrir el modal de confirmación al eliminar una asignatura
  const handleDeleteAsignatura = useCallback((asignatura) => {
    setAsignaturaAEliminar(asignatura);
    setShowConfirmModal(true);
  }, []);

  // Función para confirmar la eliminación del asignatura
  const handleConfirmDelete = useCallback(() => {
    if (asignaturaAEliminar) {
      axios
        .delete(
          `http://localhost:8000/api/main/asignatura/${asignaturaAEliminar.id}/delete`
        )
        .then((response) => {
          setAsignaturas((asignaturas) =>
            asignaturas.filter((a) => a.id !== asignaturaAEliminar.id)
          );
          setShowConfirmModal(false);
          setAsignaturaAEliminar(null);
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [asignaturaAEliminar]);

  // Función para cancelar la eliminación
  const handleCancelDelete = useCallback(() => {
    setShowConfirmModal(false);
    setAsignaturaAEliminar(null);
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md={1}>
          {/* Componente Sidebar para la navegación */}
          <Sidebar />
        </Col>

        <Col md={11}>
          <Col className="header-asignaturas-admin">
            <FormAgregarAsignatura onAddAsignatura={handleAddAsignaturas} />
          </Col>

          <Col className="body-asignaturas-admin">
            <TablaAsignaturas
              asignaturas={asignaturas}
              onEditAsignatura={handleEditAsignatura}
              onDeleteAsignatura={handleDeleteAsignatura}
            />

            {asignaturaAEditar && (
              <FormEditarAsignatura
                asignatura={asignaturaAEditar}
                onUpdateAsignatura={handleUpdateAsignaturas}
                setAsignaturaAEditar={setAsignaturaAEditar}
                show={show}
                setShow={setShow}
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
                  ¿Estás seguro de eliminar la asignatura{" "}
                  <strong>{asignaturaAEliminar?.asignatura}</strong>?
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

          <Col className="footer-asignaturas-admin d-flex justify-content-center mb-5">
            <div className="d-flex">
              <FormAsignarAsignaturaProfesor />
              <FormAsignarAsignaturaCursos />
            </div>
          </Col>
        </Col>
      </Row>
    </Container>
  );
}

export default GestionAsignaturasAdmin;
