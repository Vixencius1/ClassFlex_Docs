import "./styles.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import isLengthValidated from "../../../IsLengthValidated/IsLengthValidated";
import CustomModal from "../../../CustomModal";
import { useState } from "react";

// Componente con formulario para editar una asignatura ya existente
function FormEditarAsignatura({
  asignatura,
  onUpdateAsignatura,
  setAsignaturaAEditar,
  show,
  setShow,
}) {
  // Estados para formulario
  const [asignaturaNombre, setAsignaturaNombre] = useState(
    asignatura.asignatura
  );
  const [descripcion, setDescripcion] = useState(asignatura.descripcion);
  const cantNotas = asignatura.cant_notas;
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  // Función para cerrar el modal
  const handleClose = () => {
    setAsignaturaAEditar(null);
    setShow(false);
  };

  // Manejo del submit formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const colegio = localStorage.getItem("colegio");

    if (!isLengthValidated(asignaturaNombre, 2, 60)) {
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

    if (asignaturaNombre.trim().length !== asignaturaNombre.length) {
      setError(
        "El nombre de asignatura no puede tener espacios al principio o al final."
      );
      setShowError(true);
    } else {
      setShowError(false);
    }

    // Llamado a api para actualizar las asignaturas
    try {
      const response = await axios.put(
        `http://localhost:8000/api/main/asignatura/${asignatura.id}/update`,
        {
          asignatura: asignaturaNombre,
          descripcion: descripcion,
          cant_notas: cantNotas,
          colegio,
        },
        { timeout: 5000 }
      );

      // Actualizar el asignatura en la lista
      onUpdateAsignatura(response.data);
      handleClose();
    } catch (err) {
      console.log("Error al actualizar la asignatura", err);
    }
  };

  return (
    // Inicio modal de edición
    <CustomModal
      show={show}
      handleClose={handleClose}
      handleShow={() => setShow(true)}
      modalTitle="Editar asignatura"
    >
      <Form className="form-edit-asignatura" onSubmit={handleSubmit}>
        {/* Input nombre de la asignatura */}
        <Form.Group className="mb-3" controlId="formAsignatura">
          <Form.Label>Nombre asignatura</Form.Label>
          <Form.Control
            type="text"
            value={asignaturaNombre}
            onChange={(event) => setAsignaturaNombre(event.target.value)}
            maxLength={60}
          />
        </Form.Group>

        {/* Input descripcion de la asignatura */}
        <Form.Group className="mb-3" controlId="formDescripcion">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            maxLength={200}
          />
        </Form.Group>

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

export default FormEditarAsignatura;
