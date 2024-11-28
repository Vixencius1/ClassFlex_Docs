import "./styles.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import CustomModal from "../../../CustomModal";
import { useEffect, useState } from "react";

// Componente para asignar uno o muchos alumnos a un curso en específico
function FormAsignarAlumno() {
  const [alumnos, setAlumnos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [alumnosAsignados, setAlumnosAsignados] = useState([]);
  const [show, setShow] = useState(false);
  const [panelIzquierdo, setPanelIzquierdo] = useState(null);
  const [panelDerecho, setPanelDerecho] = useState(null);
  const [reloadAlumnos, setReloadAlumnos] = useState(false);
  const [isIzquierdoDisabled, setIsIzquierdoDisabled] = useState(false);

  useEffect(() => {
    const colegioId = localStorage.getItem("colegio");
    if (colegioId) {
      axios
        .get(
          `http://localhost:8000/api/main/alumno/${colegioId}/listar-alumno`,
          { timeout: 5000 }
        )
        .then((response) => {
          setAlumnos(response.data);
        })
        .catch((error) => {
          console.error(error);
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
  }, [reloadAlumnos]);

  // Función para asignar un alumno al panel derecho
  const asignarAlumno = (alumno) => {
    setAlumnosAsignados((prev) => [...prev, alumno]);
    setAlumnos((prev) => prev.filter((a) => a.id !== alumno.id));
    setIsIzquierdoDisabled(true);
  };

  // Función para devolver un alumno del panel derecho al panel izquierdo
  const devolverAlumno = (alumno) => {
    setAlumnos((prev) => [...prev, alumno]);
    setAlumnosAsignados((prev) => {
      const nuevosAlumnosAsignados = prev.filter((a) => a.id !== alumno.id);

      // Habilitar el selector izquierdo solo si no hay más alumnos asignados
      if (nuevosAlumnosAsignados.length === 0) {
        setIsIzquierdoDisabled(false);
      }

      return nuevosAlumnosAsignados;
    });
  };

  // Función para actualizar los alumnos asignados al curso del panel derecho
  const actualizarAlumnos = async () => {
    // Verifica si hay alumnos asignados
    if (alumnosAsignados.length === 0) {
      console.error("Debes tener alumnos asignados.");
      return;
    }

    if (alumnosAsignados.length > 0 && panelDerecho) {
      try {
        const updatePromises = alumnosAsignados.map((alumno) =>
          axios.patch(
            `http://localhost:8000/api/main/alumno/${alumno.id}/update`,
            { curso_id: panelDerecho.id }
          )
        );

        await Promise.all(updatePromises);

        handleClose();
      } catch (error) {
        console.error("Error al actualizar los alumnos:", error);
      }
    } else {
      console.error("Debes seleccionar un curso y tener alumnos asignados.");
    }
  };

  const handleClose = () => {
    setShow(false);
    setPanelIzquierdo(null);
    setPanelDerecho(null);
    setAlumnosAsignados([]);
    setReloadAlumnos((prev) => !prev);
    setIsIzquierdoDisabled(false);
  };

  const handleShow = () => setShow(true);

  // Filtrar alumnos según el curso seleccionado en el panel izquierdo
  let alumnosFiltrados =
    panelIzquierdo === null
      ? alumnos.filter((alumno) => alumno.curso === null)
      : alumnos.filter((alumno) => alumno.curso?.id === panelIzquierdo.id);

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
                  Asignar Alumno
                </Button>
              </Col>
            </Row>
          </Container>

          <CustomModal
            show={show}
            handleClose={handleClose}
            modalTitle="Asignar alumno a un curso"
          >
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
                  {alumnosFiltrados.map((alumno) => (
                    <li key={alumno.id} onClick={() => asignarAlumno(alumno)}>
                      {alumno.nombre.concat(
                        " ",
                        alumno.apellido_paterno,
                        " ",
                        alumno.apellido_materno
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
                  {alumnosAsignados.map((alumno) => (
                    <li key={alumno.id} onClick={() => devolverAlumno(alumno)}>
                      {alumno.nombre.concat(
                        " ",
                        alumno.apellido_paterno,
                        " ",
                        alumno.apellido_materno
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
                onClick={actualizarAlumnos}
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

export default FormAsignarAlumno;
