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

// Asignar asignaturas a profesores
function FormAsignarAsignaturaProfesor() {
  const [profesores, setProfesores] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [profesoresAsignados, setProfesoresAsignados] = useState([]);
  const [panelIzquierdo, setPanelIzquierdo] = useState(null);
  const [panelDerecho, setPanelDerecho] = useState(null);
  const [reloadData, setReloadData] = useState(false);
  const [show, setShow] = useState(false);
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
        .get(
          `http://localhost:8000/api/main/asignatura/${colegioId}/listar-asignatura`,
          { timeout: 5000 }
        )
        .then((response) => {
          setAsignaturas(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener las asignaturas:", error);
        });
    } else {
      console.error("No se encontró el ID del colegio.");
    }
  }, [reloadData]);

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

  // Función para actualizar los profesores asignados a la asignatura
  const actualizarProfesores = async () => {
    const profesoresDuplicados = profesoresAsignados.filter((profesor) =>
      profesor.asignaturas.some(
        (asignatura) => asignatura?.id === panelDerecho?.id
      )
    );

    if (profesoresDuplicados.length > 0) {
      setAlertMessage(
        `Error, profesor(es): ${profesoresDuplicados
          .map((p) => `${p.nombre} ${p.apellido_paterno} ${p.apellido_materno}`)
          .join(", ")} ya está(n) asignado(s) a esta asignatura.`
      );
      setAlertVariant("danger");
      return;
    }
    if (profesoresAsignados.length > 0 && panelDerecho) {
      try {
        const updatePromises = profesoresAsignados.map((profesor) => {
          const asignaturasActualizadas = [
            ...new Set([
              ...profesor.asignaturas.map((a) => a.id),
              panelDerecho.id,
            ]),
          ];

          return axios.patch(
            `http://localhost:8000/api/main/profesor/${profesor.id}/update`,
            {
              asignatura_ids: asignaturasActualizadas,
            },
            { timeout: 5000 }
          );
        });

        await Promise.all(updatePromises);
        handleClose();
      } catch (error) {
        console.error("Error al actualizar los profesores:", error);
      }
    } else {
      console.error(
        "Debes seleccionar una asignatura y tener profesores asignados."
      );
    }
  };

  const handleClose = () => {
    setShow(false);
    setProfesoresAsignados([]);
    setPanelDerecho(null);
    setPanelIzquierdo(null);
    setReloadData((prev) => !prev);
    setAlertMessage(null);
    setIsIzquierdoDisabled(false);
  };

  const handleShow = () => setShow(true);

  // Filtrar profesores según la asignatura seleccionada en el panel izquierdo
  const profesoresFiltrados = panelIzquierdo
    ? profesores.filter((profesor) =>
        profesor.asignaturas?.some(
          (asignatura) => asignatura.id === panelIzquierdo.id
        )
      )
    : profesores.filter(
        (profesor) => !profesor.asignaturas || profesor.asignaturas.length === 0
      );

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
                  Asignar a Profesor
                </Button>
              </Col>
            </Row>
          </Container>

          <CustomModal
            show={show}
            handleClose={handleClose}
            handleShow={() => setShow(true)}
            modalTitle="Vincular asignatura a un profesor"
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
              {/* Selector de asignatura en el panel izquierdo */}
              <Col className="text-center" md={6}>
                <select
                  className="selector-asignatura-izquierda"
                  onChange={(e) => {
                    const asignaturaId = parseInt(e.target.value);
                    setPanelIzquierdo(
                      asignaturaId === 0
                        ? null
                        : asignaturas.find(
                            (asignatura) => asignatura.id === asignaturaId
                          )
                    );
                  }}
                  disabled={isIzquierdoDisabled}
                >
                  <option value={0}>Profesores sin asignaturas</option>
                  {asignaturas.map((asignatura) => (
                    <option
                      value={asignatura.id}
                      key={asignatura.id}
                      title={`Profesor(es) de ${asignatura.asignatura}`}
                    >
                      {`Profesor(es) de ${asignatura.asignatura.substring(
                        0,
                        10
                      )}...`}
                    </option>
                  ))}
                </select>

                <ul className="lista-sin-asignatura mt-4">
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

              {/* Selector de asignatura en el panel derecho */}
              <Col className="text-center" md={6}>
                <select
                  className="selector-asignatura-derecha"
                  onChange={(e) => {
                    const asignaturaId = parseInt(e.target.value);
                    setPanelDerecho(
                      asignaturas.find(
                        (asignatura) => asignatura.id === asignaturaId
                      )
                    );
                  }}
                >
                  <option value={0}>Seleccionar asignatura</option>
                  {asignaturas
                    .filter(
                      (asignatura) => asignatura.id !== panelIzquierdo?.id
                    )
                    .map((asignatura) => (
                      <option value={asignatura.id} key={asignatura.id}>
                        {asignatura.asignatura}
                      </option>
                    ))}
                </select>

                <ul className="lista-asignar-asignaturas mt-4">
                  {profesoresAsignados.map((profesor) => (
                    <li
                      key={profesor.id}
                      onClick={() => devolverProfesor(profesor)}
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
            </Row>
            <Modal.Footer className="d-flex justify-content-center">
              <Button
                id="button-asignar"
                className="none"
                onClick={actualizarProfesores}
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

export default FormAsignarAsignaturaProfesor;
