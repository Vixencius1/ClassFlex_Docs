import "./styles.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import CustomModal from "../../../CustomModal";
import { useEffect, useState } from "react";

function FormAsignarAsignaturaCursos() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [asignaturasAsignadas, setAsignaturasAsignadas] = useState([]);
  const [asignaturasCursoSeleccionado, setAsignaturasCursoSeleccionado] =
    useState([]);
  const [panelDerecho, setPanelDerecho] = useState(null);
  const [show, setShow] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState(null);
  const [popoverPlacement, setPopoverPlacement] = useState("right");
  const [showSmallScreenModal, setShowSmallScreenModal] = useState(false);

  // Estados para manejo de Alert
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState("danger");

  useEffect(() => {
    const updatePlacement = () => {
      if (window.innerWidth < 876) {
        setPopoverPlacement("bottom");
        setShowSmallScreenModal(true);
      } else {
        setPopoverPlacement("right");
        setShowSmallScreenModal(false);
      }
    };

    window.addEventListener("resize", updatePlacement);
    updatePlacement();

    return () => window.removeEventListener("resize", updatePlacement);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const colegioId = localStorage.getItem("colegio");
      if (!colegioId) {
        setError("No se encontró el ID del colegio.");
        setLoading(false);
        return;
      }

      try {
        const [asignaturasResponse, cursosResponse] = await Promise.all([
          axios.get(
            `http://localhost:8000/api/main/asignatura/${colegioId}/listar-asignatura`
          ),
          axios.get(
            `http://localhost:8000/api/main/curso/${colegioId}/listar-curso`
          ),
        ]);
        setAsignaturas(asignaturasResponse.data);
        setCursos(cursosResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al obtener datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reloadData]);

  const asignarAsignatura = (asignatura) => {
    if (!asignaturasAsignadas.some((a) => a.id === asignatura.id)) {
      setAsignaturasAsignadas((prev) => [...prev, asignatura]);
      setAsignaturas((prev) => prev.filter((a) => a.id !== asignatura.id));
    }
  };

  const devolverAsignatura = (asignatura) => {
    setAsignaturas((prev) => [...prev, asignatura]);
    setAsignaturasAsignadas((prev) =>
      prev.filter((a) => a.id !== asignatura.id)
    );
  };

  const actualizarCursos = async () => {
    // Verificar si hay asignaturas duplicadas
    const asignaturasDuplicadas = asignaturasAsignadas.filter((asignatura) =>
      panelDerecho.asignaturas.some((a) => a.id === asignatura.id)
    );

    if (asignaturasDuplicadas.length > 0) {
      setAlertMessage(
        `Error, asignatura(s): ${asignaturasDuplicadas
          .map((p) => `${p.asignatura}`)
          .join(", ")} ya está(n) asignada(s) a este curso.`
      );
      setAlertVariant("danger");
      return;
    }

    if (asignaturasAsignadas.length > 0 && panelDerecho) {
      try {
        const updatePromises = asignaturasAsignadas.map((asignatura) =>
          axios.patch(
            `http://localhost:8000/api/main/curso/${panelDerecho.id}/update`,
            {
              asignatura_ids: [
                ...new Set([
                  ...panelDerecho.asignaturas.map((a) => a.id),
                  asignatura.id,
                ]),
              ],
            }
          )
        );
        await Promise.all(updatePromises);
        setAsignaturasAsignadas([]);
        handleClose();
      } catch (error) {
        console.error("Error al actualizar los cursos:", error);
      }
    } else {
      console.error("Selecciona un curso y al menos una asignatura.");
    }
  };

  const handleClose = () => {
    setAsignaturasAsignadas([]);
    setShow(false);
    setAsignaturasCursoSeleccionado([]);
    setPopoverVisible(false);
    setPanelDerecho(null);
    setReloadData((prev) => !prev);
    setAlertMessage(null);
  };

  const handleShow = () => setShow(true);

  const handleCursoChange = (e) => {
    const cursoId = parseInt(e.target.value);
    const cursoSeleccionado = cursos.find((curso) => curso.id === cursoId);
    setPanelDerecho(cursoSeleccionado);

    if (cursoSeleccionado) {
      setAsignaturasCursoSeleccionado(cursoSeleccionado.asignaturas);
      setPopoverTarget(e.target);
      setPopoverVisible(true);
    } else {
      setAsignaturasCursoSeleccionado([]);
      setPopoverVisible(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container className="container-asignar">
      <Row>
        <Col>
          <Container>
            <Row>
              <Col xs={12} sm={6} className="text-end mt-4">
                <Button
                  id="button-asignar-asignaturas"
                  className="text-white"
                  variant="success"
                  onClick={handleShow}
                >
                  Asignar a Curso
                </Button>
              </Col>
            </Row>
          </Container>

          <CustomModal
            show={show}
            handleClose={handleClose}
            handleShow={() => setShow(true)}
            modalTitle="Vincular asignatura a un curso"
          >
            {/* Mostrar el componente Alert si hay un mensaje */}
            {alertMessage && (
              <Alert
                variant={alertVariant}
                className="text-center"
                onClose={() => setAlertMessage(null)}
                dismissible
              >
                {alertMessage}
              </Alert>
            )}
            <Row>
              {/* Lista de asignaturas panel izquierdo */}
              <Col className="text-center" md={6}>
                <ul className="lista-asignaturas">
                  {asignaturas.map((asignatura) => (
                    <li
                      key={asignatura.id}
                      onClick={() => asignarAsignatura(asignatura)}
                    >
                      {asignatura.asignatura}
                    </li>
                  ))}
                </ul>
              </Col>

              {/* Panel derecho con selector de cursos */}
              <Col className="text-center" md={6}>
                <select
                  className="selector-asignatura-derecha"
                  onChange={handleCursoChange}
                >
                  <option value={0}>Seleccionar curso</option>
                  {cursos.map((curso) => (
                    <option value={curso.id} key={curso.id}>
                      {curso.curso}
                    </option>
                  ))}
                </select>

                {/* Conditionally render popover or modal */}
                {!showSmallScreenModal ? (
                  <Overlay
                    show={popoverVisible}
                    target={popoverTarget}
                    placement={popoverPlacement}
                    containerPadding={20}
                  >
                    <Popover id="popover-custom" className="popover-custom">
                      <Popover.Header as="h3">
                        Asignaturas del curso
                      </Popover.Header>
                      <Popover.Body className="popover-body">
                        <ul>
                          {asignaturasCursoSeleccionado.length > 0
                            ? asignaturasCursoSeleccionado.map((asignatura) => (
                                <li key={asignatura.id}>
                                  {asignatura.asignatura}
                                </li>
                              ))
                            : "Sin asignaturas..."}
                        </ul>
                      </Popover.Body>
                    </Popover>
                  </Overlay>
                ) : (
                  <Modal
                    show={popoverVisible}
                    onHide={() => setPopoverVisible(false)}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Asignaturas del curso</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <ul>
                        {asignaturasCursoSeleccionado.length > 0
                          ? asignaturasCursoSeleccionado.map((asignatura) => (
                              <li key={asignatura.id}>
                                {asignatura.asignatura}
                              </li>
                            ))
                          : "Sin asignaturas..."}
                      </ul>
                    </Modal.Body>
                  </Modal>
                )}

                {/* Asignaturas que se agregan al panel derecho */}
                <ul className="lista-asignar-asignaturas mt-4">
                  {asignaturasAsignadas.map((asignatura) => (
                    <li
                      key={asignatura.id}
                      onClick={() => devolverAsignatura(asignatura)}
                    >
                      {asignatura.asignatura}
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>
            <Modal.Footer className="d-flex justify-content-center">
              <Button
                id="button-asignar"
                className="none"
                onClick={actualizarCursos}
                disabled={!panelDerecho}
              >
                Aceptar cambios
              </Button>
            </Modal.Footer>
          </CustomModal>
        </Col>
      </Row>
    </Container>
  );
}

export default FormAsignarAsignaturaCursos;
