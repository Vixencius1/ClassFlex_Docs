import "./styles.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import isLengthValidated from "../../../IsLengthValidated/IsLengthValidated";
import CustomModal from "../../../CustomModal";
import { useState } from "react";

// Componente con formulario para agregar una asignatura nueva
function FormAgregarAsignatura({ onAddAsignatura }) {
  // Estados para los campos del formulario
  const [asignatura, setAsignatura] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantNotas, setCantNotas] = useState("");

  // Estado para controlar la visibilidad del modal
  const [show, setShow] = useState(false);

  // Estados para manejo de errores
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  // Funciones para cerrar y abrir el modal
  const handleClose = () => {
    setAsignatura("");
    setDescripcion("");
    setCantNotas("");
    setShow(false);
  };
  const handleShow = () => setShow(true);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const colegio = localStorage.getItem("colegio");

    if (!isLengthValidated(asignatura, 2, 60)) {
      setError(
        "El nombre de la asignatura debe tener entre 2 y 60 caracteres."
      );
      setShowError(true);
      return;
    } else {
      setShowError(false);
    }

    if (!isLengthValidated(descripcion, 1, 200)) {
      setError(
        "La descripción no puede quedar vacía o tener más de 200 caracteres."
      );
      setShowError(true);
      return;
    } else {
      setShowError(false);
    }

    if (descripcion.trim().length !== descripcion.length) {
      setError(
        "La descripción no puede tener espacios al principio o al final."
      );
      setShowError(true);
    } else {
      setShowError(false);
    }

    if (asignatura.trim().length !== asignatura.length) {
      setError(
        "El nombre de asignatura no puede tener espacios al principio o al final."
      );
      setShowError(true);
    } else {
      setShowError(false);
    }

    if (cantNotas < 1 || cantNotas > 10) {
      setError("La cantidad de notas debe estar entre 1 y 10");
      setShowError(true);
      setCantNotas("");
      return;
    } else {
      setShowError(false);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/main/crear-asignatura",
        {
          asignatura: asignatura,
          descripcion: descripcion,
          cant_notas: cantNotas,
          colegio,
        },
        { timeout: 5000 }
      );

      // Agregar la asignatura al estado después de la creación exitosa
      onAddAsignatura({
        id: response.data.id,
        asignatura,
        descripcion,
        cant_notas: cantNotas,
        fecha_modificacion: response.data.fecha_modificacion,
        fecha_creacion: response.data.fecha_creacion,
      });

      // Limpiar los campos del formulario
      setAsignatura("");
      setDescripcion("");
      setCantNotas("");
      setShow(false);
      window.location.reload();
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <Container id="container-lista-asignaturas">
      <Row>
        <Col>
          <Container>
            {/* Título de la sección y botón para agregar asignatura */}
            <Row className="d-flex justify-content-between align-items-center my-3">
              <Col>
                <h2 className="titulo-seccion">Gestión de Asignaturas</h2>
              </Col>
              <Col
                xs={12}
                sm={6}
                className="text-end mb-2"
                style={{ position: "relative" }}
              >
                <Button
                  className="text-white"
                  variant="info"
                  onClick={handleShow}
                  id="btn-agregar"
                >
                  Agregar Asignatura
                </Button>
              </Col>
            </Row>
          </Container>

          {/* Modal para agregar una asignatura */}
          <CustomModal
            show={show}
            handleClose={handleClose}
            handleShow={() => setShow(true)}
            modalTitle="Agregar asignatura"
          >
            {/* Formulario para agregar la asignatura */}
            <Form className="form-add-asignatura" onSubmit={handleSubmit}>
              {/* Input nombre asignatura */}
              <Form.Group className="mb-3" controlId="formAsignatura">
                <Form.Label>Nombre asignatura</Form.Label>
                <Form.Control
                  type="text"
                  value={asignatura}
                  onChange={(event) => setAsignatura(event.target.value)}
                  maxLength={60}
                />
              </Form.Group>

              {/* Input descripcion */}
              <Form.Group className="mb-3" controlId="formDescripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  value={descripcion}
                  onChange={(event) => setDescripcion(event.target.value)}
                  maxLength={200}
                />
              </Form.Group>

              {/* Input cantidad notas */}
              <Form.Group className="mb-3" controlId="formCantNotas">
                <Form.Label>Cant. Notas</Form.Label>
                <Form.Control
                  type="text"
                  value={cantNotas}
                  onChange={(event) => setCantNotas(Number(event.target.value))}
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/, ""))
                  }
                  maxLength={2}
                />
              </Form.Group>

              {/* Mostrar error al momento de ingresar valores erróneos */}
              {showError && <Alert variant="danger">{error}</Alert>}

              {/* Botón para aceptar */}
              <Button variant="primary" type="submit" id="btn-submit-agregar">
                Agregar
              </Button>
            </Form>
          </CustomModal>
        </Col>
      </Row>
    </Container>
  );
}

export default FormAgregarAsignatura;
