import "./styles.css";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import CustomModal from "../../../CustomModal";
import ValidarRut from "../../../ValidarRut/ValidarRut";
import { useState } from "react";

// Función para verificar caracteres especiales
function hasSpecialSymbols(texto) {
  const regex = /[!@#$%^&*(),.?":{}|<>]/;
  return regex.test(texto);
}

// Componente con formulario para editar un alumno
function FormEditarAlumno({
  alumno,
  onUpdateAlumno,
  setAlumnoAEditar,
  show,
  setShow,
}) {
  // Estados para formulario
  const [rut, setRut] = useState(alumno.rut);
  const [nombre, setNombre] = useState(alumno.nombre);
  const [apellidoPaterno, setApellidoPaterno] = useState(
    alumno.apellido_paterno
  );
  const [apellidoMaterno, setApellidoMaterno] = useState(
    alumno.apellido_materno
  );
  const [direccion, setDireccion] = useState(alumno.direccion);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [rutError, setRutError] = useState("");

  const handleClose = () => {
    setShow(false);
    setAlumnoAEditar(null);
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
      hasSpecialSymbols(apellidoPaterno) ||
      hasSpecialSymbols(apellidoMaterno)
    ) {
      setError("Solo RUT y dirección aceptan carateres especiales '-'");
      setShowError(true);
      return;
    } else {
      setShowError(false);
    }

    // Llamado a api para actualizar alumno
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/main/alumno/${alumno.id}/update`,
        {
          rut: rut,
          nombre: nombre,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
          direccion: direccion,
        }
      );

      // Actualizar el alumno en la lista
      onUpdateAlumno(response.data);
      handleClose();
    } catch (err) {
      console.log("Error al actualizar el alumno", err);
    }
  };

  return (
    <CustomModal
      show={show}
      handleClose={handleClose}
      modalTitle="Editar alumno"
    >
      <Form className="form-edit-alumno" onSubmit={handleSubmit}>
        <Row>
          {/* Columna izquierda */}
          <Col md={6}>
            {/* Input rut del alumno */}
            <Form.Group className="mb-3" controlId="formRutAlumno">
              <Form.Label>RUT alumno</Form.Label>
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

            {/* Input nombre del alumno */}
            <Form.Group className="mb-3" controlId="formNombreAlumno">
              <Form.Label>Nombre alumno</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                maxLength={30}
              />
            </Form.Group>

            {/* Input apellido paterno del alumno */}
            <Form.Group className="mb-3" controlId="formApellidoPatAlumno">
              <Form.Label>Apellido paterno</Form.Label>
              <Form.Control
                type="text"
                value={apellidoPaterno}
                onChange={(event) => setApellidoPaterno(event.target.value)}
                maxLength={30}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            {/* Input apellido materno del alumno */}
            <Form.Group className="mb-3" controlId="formApellidoMatAlumno">
              <Form.Label>Apellido materno</Form.Label>
              <Form.Control
                type="text"
                value={apellidoMaterno}
                onChange={(event) => setApellidoMaterno(event.target.value)}
                maxLength={30}
              />
            </Form.Group>

            {/* Input dirección del alumno */}
            <Form.Group className="mb-3" controlId="formDireccionAlumno">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                value={direccion}
                onChange={(event) => setDireccion(event.target.value)}
                maxLength={30}
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

export default FormEditarAlumno;
