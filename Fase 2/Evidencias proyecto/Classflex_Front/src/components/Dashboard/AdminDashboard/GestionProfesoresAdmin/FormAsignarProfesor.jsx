import "./styles.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import CustomModal from "../../../CustomModal";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

function FormAsignarProfesor() {
  const [profesores, setProfesores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [profesoresAsignados, setProfesoresAsignados] = useState([]);
  const [show, setShow] = useState(false);
  const [panelIzquierdo, setPanelIzquierdo] = useState(null);
  const [panelDerecho, setPanelDerecho] = useState(null);
  const [reloadProfesores, setReloadProfesores] = useState(false);
  const [isIzquierdoDisabled, setIsIzquierdoDisabled] = useState(false);

  // Estados para manejo de Alert
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState("danger");

  useEffect(() => {
    const colegioId = localStorage.getItem("colegio");

    if (colegioId) {
      axios
        .get(
          `http://localhost:8000/api/main/profesor/${colegioId}/listar-profesor`,
          { timeout: 5000 }
        )
        .then((response) => {
          setProfesores(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los profesores:", error);
        });

      axios
        .get(`http://localhost:8000/api/main/curso/${colegioId}/listar-curso`, {
          timeout: 5000,
        })
        .then((response) => {
          setCursos(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los cursos:", error);
        });
    } else {
      console.error("No se encontró el ID del colegio.");
    }
  }, [reloadProfesores]);

  // Función para asignar un profesor al panel derecho
  const asignarProfesor = (profesor) => {
    setProfesoresAsignados((prev) => [...prev, profesor]);
    setProfesores((prev) => prev.filter((p) => p.id !== profesor.id));
    setIsIzquierdoDisabled(true);
  };

  // Función para devolver un profesor del panel derecho al panel izquierdo
  const devolverProfesor = (profesor) => {
    setProfesores((prev) => [...prev, profesor]);
    setProfesoresAsignados((prev) => {
      const nuevosProfesoresAsignados = prev.filter(
        (p) => p.id !== profesor.id
      );

      // Habilitar el selector izquierdo solo si no hay más profesores asignados
      if (nuevosProfesoresAsignados.length === 0) {
        setIsIzquierdoDisabled(false);
      }

      return nuevosProfesoresAsignados;
    });
  };

  // Función para actualizar los profesores asignados al curso
  const actualizarProfesores = async () => {
    // Verifica si hay alumnos asignados
    if (profesoresAsignados.length === 0) {
      setAlertMessage("Debes asignar al menos un profesor.");
      setAlertVariant("danger");
      return;
    }

    // Validar si algún profesor ya está asignado al curso seleccionado
    const profesoresDuplicados = profesoresAsignados.filter((profesor) =>
      profesor.cursos.some((curso) => curso?.id === panelDerecho?.id)
    );

    if (profesoresDuplicados.length > 0) {
      setAlertMessage(
        `Error, profesor(es): ${profesoresDuplicados
          .map(
            (p) =>
              `${p.nombre.toUpperCase()} ${p.apellido_paterno.toUpperCase()} ${p.apellido_materno.toUpperCase()}`
          )
          .join(
            ", "
          )} ya está(n) asignado(s) al curso ${panelDerecho.curso.toUpperCase()}. Si desea desvincular a alguno de ellos, 
          por favor, pulse el botón de eliminar.`
      );
      setAlertVariant("danger");
      return;
    }

    if (profesoresAsignados.length > 0 && panelDerecho) {
      try {
        const updatePromises = profesoresAsignados.map((profesor) => {
          return axios.patch(
            // Asegúrate de devolver la promesa
            `http://localhost:8000/api/main/profesor/${profesor.id}/update`,
            {
              curso_ids: [
                ...new Set([
                  ...profesor.cursos.map((c) => c.id),
                  panelDerecho.id,
                ]),
              ],
            },
            { timeout: 5000 }
          );
        });
        await Promise.all(updatePromises);
        handleClose();
      } catch (error) {
        console.error("Error al actualizar los profesores:", error);
        setAlertMessage("Hubo un error al asignar los profesores.");
        setAlertVariant("danger");
      }
    } else {
      console.error("Debes seleccionar un curso y tener profesores asignados.");
    }
  };

  // Función para eliminar un curso de un profesor
  const eliminarCursoProfesor = async (profesor) => {
    if (!panelDerecho) {
      setAlertMessage("Debes seleccionar un curso para eliminar.");
      setAlertVariant("danger");
      return;
    }

    try {
      // Actualiza el profesor removiendo el curso seleccionado
      const nuevosCursos = profesor.cursos
        .filter((curso) => curso.id !== panelDerecho.id)
        .map((curso) => curso.id);

      await axios.patch(
        `http://localhost:8000/api/main/profesor/${profesor.id}/update`,
        { curso_ids: nuevosCursos },
        { timeout: 5000 }
      );

      handleClose();
    } catch (error) {
      console.error("Error al eliminar el curso del profesor:", error);
      setAlertMessage("Hubo un error al eliminar el curso del profesor.");
      setAlertVariant("danger");
    }
  };

  const handleClose = () => {
    setShow(false);
    setPanelIzquierdo(null);
    setPanelDerecho(null);
    setProfesoresAsignados([]);
    setReloadProfesores((prev) => !prev);
    setIsIzquierdoDisabled(false);
    setAlertMessage(null);
  };

  const handleShow = () => setShow(true);

  // Filtrar profesores según el curso seleccionado en el panel izquierdo
  const profesoresFiltrados =
    panelIzquierdo === null
      ? profesores.filter((profesor) => profesor.cursos.length === 0)
      : profesores.filter((profesor) =>
          profesor.cursos.some((curso) => curso?.id === panelIzquierdo.id)
        );

  return (
    <Container className="container-asignar">
      <Row>
        <Col>
          <Container>
            <Row>
              <Col md={12} className="d-flex justify-content-center mt-4">
                <Button
                  className="text-white"
                  variant="success"
                  onClick={handleShow}
                >
                  Asignar Profesor
                </Button>
              </Col>
            </Row>
          </Container>

          <CustomModal
            show={show}
            handleClose={handleClose}
            handleShow={() => setShow(true)}
            modalTitle="Asignar profesor a un curso"
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
              {/* Selector de curso en el panel izquierdo */}
              <Col className="text-center" md={6}>
                <select
                  className="selector-curso-izquierdo"
                  onChange={(e) => {
                    const cursoId = parseInt(e.target.value);
                    setPanelIzquierdo(
                      cursoId === 0
                        ? null
                        : cursos.find((curso) => curso.id === cursoId)
                    );
                  }}
                  disabled={isIzquierdoDisabled}
                >
                  <option value={0}>Sin Curso</option>
                  {cursos.map((curso) => (
                    <option value={curso.id} key={curso.id}>
                      {curso.curso}
                    </option>
                  ))}
                </select>

                <ul className="lista-sin-curso mt-4">
                  {profesoresFiltrados.map((profesor) => (
                    <li
                      key={profesor.id}
                      onClick={() => asignarProfesor(profesor)}
                    >
                      {profesor.nombre.concat(
                        " ",
                        profesor.apellido_paterno,
                        " ",
                        profesor.apellido_materno
                      )}
                    </li>
                  ))}
                </ul>
              </Col>

              {/* Selector de curso en el panel derecho */}
              <Col className="text-center" md={6}>
                <select
                  className="selector-curso-derecho"
                  onChange={(e) => {
                    const cursoId = parseInt(e.target.value);
                    setPanelDerecho(
                      cursos.find((curso) => curso.id === cursoId)
                    );
                  }}
                >
                  <option value={0}>Seleccionar curso</option>
                  {cursos
                    .filter((curso) => curso.id !== panelIzquierdo?.id)
                    .map((curso) => (
                      <option value={curso.id} key={curso.id}>
                        {curso.curso}
                      </option>
                    ))}
                </select>

                <ul className="lista-asignar-cursos mt-4">
                  {profesoresAsignados.map((profesor) => (
                    <li
                      key={profesor.id}
                      className="d-flex justify-content-between align-items-center"
                      onClick={() => devolverProfesor(profesor)}
                    >
                      <span>
                        {profesor.nombre.concat(
                          " ",
                          profesor.apellido_paterno,
                          " ",
                          profesor.apellido_materno
                        )}
                      </span>
                      {panelDerecho &&
                        profesor.cursos.some(
                          (curso) => curso.id === panelDerecho.id
                        ) && (
                          <Button
                            variant="none"
                            title={`Desvincular profesor del curso ${
                              panelDerecho ? panelDerecho.curso : "este curso"
                            }`}
                            onClick={() => eliminarCursoProfesor(profesor)}
                          >
                            <FaRegTrashAlt className="btn-delete" size={24} />
                          </Button>
                        )}
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>

            <Modal.Footer className="d-flex justify-content-center">
              <Button
                id="button-asignar"
                className="none"
                onClick={() => {
                  actualizarProfesores();
                }}
                disabled={!panelDerecho || !profesoresAsignados.length}
              >
                Guardar cambios
              </Button>
            </Modal.Footer>
          </CustomModal>
        </Col>
      </Row>
    </Container>
  );
}

export default FormAsignarProfesor;
