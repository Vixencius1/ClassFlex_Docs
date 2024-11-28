import "./styles.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import CustomModal from "../../../CustomModal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import ValidarRut from "../../../ValidarRut/ValidarRut";
import { useState } from "react";

// Componente con formulario para registrar un alumno
function FormAgregarAlumno({ onAddAlumno }) {
  // Estados para los campos del formulario
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [rutError, setRutError] = useState("");

  // Estado para controlar la visibilidad del modal
  const [show, setShow] = useState(false);

  // Estado para manejar el loading
  const [isLoading, setIsLoading] = useState(false);

  // Validar RUT a medida que el usuario escribe
  const handleRutChange = (event) => {
    const inputRut = event.target.value;
    setRut(inputRut);

    if (inputRut.length > 0 && !ValidarRut.validaRut(inputRut)) {
      setRutError("Ingrese RUT en formato 11.111.111-1");
    } else {
      setRutError("");
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si hay un error en el RUT antes de continuar
    if (rutError) {
      return;
    }

    const colegioId = localStorage.getItem("colegio");

    setIsLoading(true);

    try {
      const userResponse = await axios.post(
        "http://localhost:8000/api/register",
        {
          email: correo,
          role: 2,
        },
        { timeout: 5000 }
      );

      const alumnoResponse = await axios.post(
        "http://localhost:8000/api/main/crear-alumno",
        {
          rut: rut,
          nombre: nombre,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
          direccion: direccion,
          usuario: userResponse.data.id,
          colegio_id: colegioId,
        },
        { timeout: 5000 }
      );

      // Agrega lista de alumnos para reflejar en la tabla
      onAddAlumno({
        id: alumnoResponse.data.id,
        rut,
        nombre,
        apellido_paterno: apellidoPaterno,
        apellido_materno: apellidoMaterno,
        direccion,
        correo: alumnoResponse.data.correo,
        usuario: userResponse.data.id,
        is_active: userResponse.data.is_active,
      });

      // Limpiar los campos del formulario
      setRut("");
      setNombre("");
      setApellidoPaterno("");
      setApellidoMaterno("");
      setCorreo("");
      setDireccion("");
      setShow(false);
      window.location.reload();
    } catch (err) {
      console.log("error", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container id="container-lista">
      <Row>
        <Col>
          <Container>
            {/* Título de la sección y botón para agregar alumno */}
            <Row className="d-flex justify-content-between align-items-center my-3">
              <Col>
                <h2 className="titulo-seccion">Gestión de Alumnos</h2>
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
                  onClick={() => setShow(true)}
                  id="btn-agregar"
                >
                  Agregar Alumno
                </Button>
              </Col>
            </Row>
          </Container>

          {/* Inicio modal con formulario */}
          <CustomModal
            show={show}
            handleClose={() => setShow(false)}
            handleShow={() => setShow(true)}
            modalTitle="Agregar alumno"
          >
            <Form className="form-add-alumno" onSubmit={handleSubmit}>
              <Row>
                {/* Columna izquierda */}
                <Col md={6}>
                  {/* Input RUT */}
                  <Form.Group className="mb-3" controlId="formRut">
                    <Form.Label>RUT</Form.Label>
                    <Form.Control
                      type="text"
                      value={rut}
                      maxLength={12}
                      onChange={handleRutChange}
                      isInvalid={!!rutError}
                    />
                    <Form.Control.Feedback type="invalid">
                      {rutError}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Input nombre */}
                  <Form.Group className="mb-3" controlId="formNombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={nombre}
                      maxLength={30}
                      onChange={(event) => setNombre(event.target.value)}
                    />
                  </Form.Group>

                  {/* Input apellido paterno */}
                  <Form.Group className="mb-3" controlId="formApellidoPaterno">
                    <Form.Label>Apellido paterno</Form.Label>
                    <Form.Control
                      type="text"
                      value={apellidoPaterno}
                      maxLength={30}
                      onChange={(event) =>
                        setApellidoPaterno(event.target.value)
                      }
                    />
                  </Form.Group>
                </Col>

                {/* Columna derecha */}
                <Col md={6}>
                  {/* Input apellido materno */}
                  <Form.Group className="mb-3" controlId="formApellidoMaterno">
                    <Form.Label>Apellido materno</Form.Label>
                    <Form.Control
                      type="text"
                      value={apellidoMaterno}
                      maxLength={30}
                      onChange={(event) =>
                        setApellidoMaterno(event.target.value)
                      }
                    />
                  </Form.Group>

                  {/* Input correo */}
                  <Form.Group className="mb-3" controlId="formCorreo">
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                      type="email"
                      value={correo}
                      maxLength={320}
                      onChange={(event) => setCorreo(event.target.value)}
                    />
                  </Form.Group>

                  {/* Input dirección */}
                  <Form.Group className="mb-3" controlId="formDireccion">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      value={direccion}
                      maxLength={30}
                      onChange={(event) => setDireccion(event.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Botón para aceptar */}
              <Button
                id="btn-submit-agregar"
                variant="none"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Cargando" : "Agregar"}
              </Button>
            </Form>
          </CustomModal>
        </Col>
      </Row>
    </Container>
  );
}

export default FormAgregarAlumno;
