import "./styles.css";
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

// Componente con formulario para editar un profesor ya existente
function FormEditarProfesor({
  profesor,
  onUpdateProfesor,
  setProfesorAEditar,
  show,
  setShow,
}) {
  // Estados para formulario
  const [rut, setRut] = useState(profesor.rut);
  const [nombre, setNombre] = useState(profesor.nombre);
  const [apellido_paterno, setApellidoPaterno] = useState(
    profesor.apellido_paterno
  );
  const [apellido_materno, setApellidoMaterno] = useState(
    profesor.apellido_materno
  );
  const [contacto, setContacto] = useState(profesor.contacto);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [rutError, setRutError] = useState("");

  // Recuperar el id del colegio del localStorage
  const colegio = localStorage.getItem("colegio");
  let colegios = [];

  // Si "colegio" existe (no es null), se agrega al array
  if (colegio) {
    colegios.push(colegio);
  }

  // Función para cerrar el modal
  const handleClose = () => {
    setShow(false);
    setProfesorAEditar(null);
  };

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

  // Manejo del submit formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // Llamado a api para actualizar los profesores
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/main/profesor/${profesor.id}/update`,
        {
          rut: rut,
          nombre: nombre,
          apellido_paterno: apellido_paterno,
          apellido_materno: apellido_materno,
          contacto: contacto,
          colegios,
        }
      );

      // Actualizar al profesor en la lista
      onUpdateProfesor(response.data);
      handleClose();
    } catch (err) {
      console.log("Error al actualizar al profesor", err);
    }
  };

  return (
    // Inicio modal de edición
    <CustomModal
      show={show}
      handleClose={handleClose}
      modalTitle="Editar profesor"
    >
      <Form className="form-edit-profesor" onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            {/* Input rut del profesor */}
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

            {/* Input nombre del profesor */}
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                maxLength={50}
              />
            </Form.Group>

            {/* Input apellido paterno del profesor */}
            <Form.Group className="mb-3" controlId="formApPaterno">
              <Form.Label>Apellido Paterno</Form.Label>
              <Form.Control
                type="text"
                value={apellido_paterno}
                onChange={(event) => setApellidoPaterno(event.target.value)}
                maxLength={50}
              />
            </Form.Group>
          </Col>

          {/* Input apellido materno del profesor */}
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formApMaterno">
              <Form.Label>Apellido Materno</Form.Label>
              <Form.Control
                type="text"
                value={apellido_materno}
                onChange={(event) => setApellidoMaterno(event.target.value)}
                maxLength={50}
              />
            </Form.Group>

            {/* Input contacto del profesor */}
            <Form.Group className="mb-3" controlId="formContacto">
              <Form.Label>Contacto</Form.Label>
              <Form.Control
                type="text"
                value={contacto}
                onChange={(event) => setContacto(Number(event.target.value))}
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

        {/* Botón de aceptar y guardar */}
        <Button variant="primary" type="submit">
          Guardar cambios
        </Button>
      </Form>
    </CustomModal>
  );
}

export default FormEditarProfesor;
