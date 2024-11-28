import "./styles.css";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import CustomModal from "../../../CustomModal";
import { useState } from "react";

// Componente con formulario para agregar un curso nuevo
function FormAgregarCurso({ onAddCurso }) {
  // Estados para los campos del formulario
  const [cursoNumero, setCursoNumero] = useState("");
  const [curso, setCurso] = useState("");
  const [nivel, setNivel] = useState("");
  const [cupos, setCupos] = useState("");
  const [tipoCurso, setTipoCurso] = useState("Básico");
  const [letraCurso, setLetraCurso] = useState("");

  // Estado para controlar la visibilidad del modal
  const [show, setShow] = useState(false);

  // Estados para manejo de errores
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!curso) return;

    const colegio = localStorage.getItem("colegio");

    if (nivel < 1 || nivel > 12) {
      setError("El nivel debe estar entre 1 y 12");
      setShowError(true);
      setNivel("");
      return;
    } else if (cupos < 1) {
      setError("Los cupos deben ser al menos 1");
      setShowError(true);
      setCupos("");
      return;
    } else {
      setShowError(false);
    }

    if (!curso) {
      setError("Debes seleccionar un curso");
      setShowError(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/main/crear-curso",
        {
          curso: curso,
          nivel: nivel,
          cupos: cupos,
          colegio,
        }
      );

      // Agregar el curso al estado después de la creación exitosa
      onAddCurso({
        id: response.data.id,
        curso,
        nivel,
        cupos,
      });

      // Limpiar los campos del formulario
      setCurso("");
      setNivel("");
      setCupos("");
      setShow(false);
      window.location.reload();
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleCursoChange = (event) => {
    const selectedCurso = event.target.value;
    setCursoNumero(selectedCurso);
    setCurso(`${selectedCurso}º ${tipoCurso} ${letraCurso}`);
  };

  const handleTipoCursoChange = (event) => {
    const selectedTipoCurso = event.target.value;
    setTipoCurso(selectedTipoCurso);
    if (cursoNumero) {
      setCurso(`${cursoNumero}º ${selectedTipoCurso} ${letraCurso}`);
    }
  };

  const handleLetraCursoChange = (event) => {
    const selectedLetra = event.target.value;
    setLetraCurso(selectedLetra);
    if (cursoNumero) {
      setCurso(`${cursoNumero}º ${tipoCurso} ${selectedLetra}`);
    }
  };

  return (
    <Container id="container-lista">
      <Row>
        <Col>
          <Container>
            {/* Título de la sección y botón para agregar curso */}
            <Row className="d-flex justify-content-between align-items-center my-3">
              <Col>
                <h2 className="titulo-seccion">Gestión de Cursos</h2>
              </Col>
              <Col
                xs={12}
                sm={6}
                className="text-end mb-2"
                style={{ position: "relative" }}
              >
                <Button
                  id="btn-agregar"
                  className="text-white"
                  variant="info"
                  onClick={() => setShow(true)}
                >
                  Agregar Curso
                </Button>
              </Col>
            </Row>
          </Container>

          <CustomModal
            show={show}
            handleClose={() => setShow(false)}
            handleShow={() => setShow(true)}
            modalTitle="Agregar curso"
          >
            <Form className="form-add-curso" onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                {/* Agregar nombre curso */}
                <Form.Select
                  className="ms-2"
                  onChange={handleCursoChange}
                  isInvalid={!curso}
                  style={{ width: "8rem", height: "3rem" }}
                >
                  <option value="">Curso</option>
                  {Array.from({ length: 8 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}º
                    </option>
                  ))}
                </Form.Select>

                {/* Selector para el tipo de curso */}
                <Form.Select
                  onChange={handleTipoCursoChange}
                  value={tipoCurso}
                  className="ms-2"
                  style={{ width: "8rem", height: "3rem" }}
                >
                  <option value="Básico">Básico</option>
                  {cursoNumero >= 1 && cursoNumero <= 4 && (
                    <option value="Medio">Medio</option>
                  )}
                </Form.Select>

                {/* Selector para la letra del curso */}
                <Form.Select
                  onChange={handleLetraCursoChange}
                  value={letraCurso}
                  className="ms-2"
                  style={{ width: "8rem", height: "3rem" }}
                >
                  <option value="">Letra</option>
                  {Array.from({ length: 26 }, (_, i) => (
                    <option key={i} value={String.fromCharCode(65 + i)}>
                      {String.fromCharCode(65 + i)}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {/* Input nivel */}
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

              {/* Input cupos */}
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

              {/* Botón para aceptar */}
              <Button variant="none" type="submit" id="btn-submit-agregar">
                Agregar
              </Button>
            </Form>
          </CustomModal>
        </Col>
      </Row>
    </Container>
  );
}

export default FormAgregarCurso;
