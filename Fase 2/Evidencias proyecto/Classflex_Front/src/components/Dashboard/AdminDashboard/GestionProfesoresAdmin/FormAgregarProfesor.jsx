import "./styles.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import CustomModal from "../../../CustomModal";
import ValidarRut from "../../../ValidarRut/ValidarRut";
import { useState } from "react";

function hasSpecialSymbols(texto) {
  const regex = /[!@#$%^&*(),.?":{}|<>]/;
  return regex.test(texto);
}

// Componente con formulario para agregar un profesor nuevo
function FormAgregarProfesor({ onAddProfesor }) {
  // Estados para los campos del formulario
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido_paterno, setApellidoPaterno] = useState("");
  const [apellido_materno, setApellidoMaterno] = useState("");
  const [correo, setCorreo] = useState("");
  const [contacto, setContacto] = useState("");
  const [rutError, setRutError] = useState("");

  // Estado para controlar la visibilidad del modal
  const [show, setShow] = useState(false);

  // Estados para manejo de errores
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  // Estado para manejar el loading
  const [isLoading, setIsLoading] = useState(false);

  // Recuperar el id del colegio del localStorage
  const colegio = localStorage.getItem("colegio");
  let colegios = [];

  // Si "colegio" existe (no es null), se agrega al array
  if (colegio) {
    colegios.push(colegio);
  }

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

    setIsLoading(true);

    // Verificar si hay un error en el RUT antes de continuar
    if (rutError) {
      return;
    }

    if (
      hasSpecialSymbols(nombre) ||
      hasSpecialSymbols(apellido_paterno) ||
      hasSpecialSymbols(apellido_materno)
    ) {
      setError(
        "Los campos nombre, apellido paterno y apellido materno no pueden contener caracteres especiales."
      );
      setShowError(true);
      return;
    } else {
      setShowError(false);
    }

    try {
      const userResponse = await axios.post(
        "http://localhost:8000/api/register",
        {
          email: correo,
          role: 3,
        },
        { timeout: 5000 }
      );

      const profesorResponse = await axios.post(
        "http://localhost:8000/api/main/crear-profesor",
        {
          rut: rut,
          nombre: nombre,
          apellido_paterno: apellido_paterno,
          apellido_materno: apellido_materno,
          contacto: contacto,
          usuario: userResponse.data.id,
          colegio_ids: colegios,
        },
        { timeout: 5000 }
      );

      // Agregar el profesor al estado después de la creación exitosa
      onAddProfesor({
        id: profesorResponse.data.id,
        rut,
        nombre,
        apellido_paterno,
        apellido_materno,
        contacto,
        correo: profesorResponse.data.correo,
        usuario: userResponse.data.id,
        is_active: userResponse.data.is_active,
      });

      // Limpiar los campos del formulario
      setRut("");
      setNombre("");
      setApellidoPaterno("");
      setApellidoMaterno("");
      setCorreo("");
      setContacto("");
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
            {/* Título de la sección y botón para agregar profesor */}
            <Row className="d-flex justify-content-between align-items-center my-3">
              <Col>
                <h2 className="titulo-seccion">Gestión de Profesores</h2>
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
                  Agregar Profesor
                </Button>
              </Col>
            </Row>
          </Container>

          {/* Modal para agregar un profesor */}
          <CustomModal
            show={show}
            handleClose={() => setShow(false)}
            handleShow={() => setShow(true)}
            modalTitle="Agregar profesor"
          >
            {/* Formulario para agregar al profesor */}
            <Form className="form-add-profesor" onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  {/* Input rut */}
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
                      onChange={(event) => setNombre(event.target.value)}
                      maxLength={50}
                    />
                  </Form.Group>

                  {/* Input apellido_paterno */}
                  <Form.Group className="mb-3" controlId="formApPaterno">
                    <Form.Label>Apellido Paterno</Form.Label>
                    <Form.Control
                      type="text"
                      value={apellido_paterno}
                      onChange={(event) =>
                        setApellidoPaterno(event.target.value)
                      }
                      maxLength={50}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  {/* Input apellido_materno */}
                  <Form.Group className="mb-3" controlId="formApMaterno">
                    <Form.Label>Apellido Materno</Form.Label>
                    <Form.Control
                      type="text"
                      value={apellido_materno}
                      onChange={(event) =>
                        setApellidoMaterno(event.target.value)
                      }
                      maxLength={50}
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

                  {/* Input contacto */}
                  <Form.Group className="mb-3" controlId="formContacto">
                    <Form.Label>Contacto</Form.Label>
                    <Form.Control
                      type="text"
                      value={contacto}
                      onChange={(event) => {
                        const value = event.target.value.replace(/\D/, "");
                        if (value !== "" && value !== "0") {
                          setContacto(Number(value));
                        }
                      }}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/\D/, ""))
                      }
                      maxLength={12}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Mostrar error al momento de ingresar valores erróneos */}
              {showError && <Alert variant="danger">{error}</Alert>}

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

export default FormAgregarProfesor;
