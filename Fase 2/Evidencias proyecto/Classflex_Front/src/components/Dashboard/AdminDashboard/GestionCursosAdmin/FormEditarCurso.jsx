import "./styles.css";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import CustomModal from "../../../CustomModal";
import CustomToast from "../../../CustomToast/CustomToast";
import { useEffect, useState } from "react";

// Componente con formulario para editar un curso ya existente
function FormEditarCurso({ curso, onUpdateCurso, onClose }) {
  // Estados para formulario
  const [cursoNombre, setCursoNombre] = useState(curso.curso);
  const [nivel, setNivel] = useState(curso.nivel);
  const [cupos, setCupos] = useState(curso.cupos);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState({
    background: "#d4edda",
    text: "#155724",
  });

  // Estado para controlar la visibilidad del modal
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (curso) {
      setShow(true);
      setCursoNombre(curso.curso);
      setNivel(curso.nivel);
      setCupos(curso.cupos);
    }
  }, [curso]);

  // Manejo del submit formulario
  const handleSubmit = async (e) => {
    const colegio = localStorage.getItem("colegio");
    e.preventDefault();

    if (nivel < 1 || nivel > 12) {
      setError("El nivel debe estar entre 1 y 12");
      setShowError(true);
      return;
    } else {
      setShowError(false);
    }

    // Llamado a api para actualizar los cursos
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/main/curso/${curso.id}/update`,
        {
          curso: cursoNombre,
          nivel: nivel,
          cupos: cupos,
          colegio,
        },
        { timeout: 5000 }
      );

      // Actualizar el curso en la lista
      onUpdateCurso(response.data);

      // Actualizar datos del toast
      setToastMessage("!Actualización exitosa!");
      setToastColor({ background: "#d4edda", text: "#155724" });
      setShowToast(true);

      // Cerrar el modal
      setShow(false);
    } catch (err) {
      console.log("Error al actualizar el curso", err);
      setShow(false);
      setToastMessage("Error al actualizar el curso...");
      setToastColor({ background: "#f8d7da", text: "#721c24" });
      setShowToast(true);
    }
  };

  return (
    <>
      <CustomModal
        show={show}
        handleClose={() => {
          setShow(false);
          onClose();
        }}
        handleShow={() => setShow(true)}
        modalTitle="Editar curso"
      >
        <Form className="form-edit-curso" onSubmit={handleSubmit}>
          {/* Input nombre del curso */}
          <Form.Group className="mb-3" controlId="formCurso">
            <Form.Label>Nombre curso</Form.Label>
            <Form.Control
              type="text"
              value={cursoNombre}
              onChange={(event) => setCursoNombre(event.target.value)}
              maxLength={30}
            />
          </Form.Group>

          {/* Input nivel del curso */}
          <Form.Group className="mb-3" controlId="formNivel">
            <Form.Label>Nivel</Form.Label>
            <Form.Control
              type="text"
              value={nivel}
              onChange={(event) => setNivel(Number(event.target.value))}
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/\D/, ""))
              }
              maxLength={2}
            />
          </Form.Group>

          {/* Input cupos del curso */}
          <Form.Group className="mb-3" controlId="formCupos">
            <Form.Label>Cupos</Form.Label>
            <Form.Control
              type="text"
              value={cupos}
              onChange={(event) => setCupos(Number(event.target.value))}
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/\D/, ""))
              }
              maxLength={2}
            />
          </Form.Group>

          {/* Mostrar error al momento de ingresar niveles erróneos */}
          {showError && <Alert variant="danger">{error}</Alert>}

          {/* Botón de aceptar y guardar */}
          <Button variant="primary" type="submit">
            Guardar cambios
          </Button>
        </Form>
      </CustomModal>
      <CustomToast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
        backgroundColor={toastColor.background}
        textColor={toastColor.text}
      />
    </>
  );
}

export default FormEditarCurso;
