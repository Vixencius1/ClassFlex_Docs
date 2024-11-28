import "./styles.css";
import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { BsCalendar2Date } from "react-icons/bs";
import axios from "axios";
import CardGestionCurso from "./CardGestionCurso";
import CustomModal from "../../../CustomModal";

function FormAgregarFecha({ onAddFecha }) {
  // Estados para los campos del formulario
  const curso = JSON.parse(localStorage.getItem("curso"));
  const asignatura = JSON.parse(localStorage.getItem("asignatura"));
  const [fecha, setFecha] = useState("");
  const [evento, setEvento] = useState("");

  // Estado para controlar la visibilidad del modal
  const [show, setShow] = useState(false);

  // Estados para manejo de errores
  // const [error, setError] = useState("");
  // const [showError, setShowError] = useState(false);

  // Funciones para cerrar y abrir el modal
  const handleShow = () => setShow(true);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página

    try {
      // Petición POST a la API para registrar fecha importante
      const response = await axios.post(
        "http://localhost:8000/api/main/crear-fecha",
        {
          curso: curso.id,
          asignatura_id: asignatura.id,
          fecha: fecha,
          evento: evento,
        }
      );

      // Agrega fecha para reflejar en la tabla
      onAddFecha({
        id: response.data.id,
        curso,
        fecha,
        evento,
      });

      // Limpiar los campos del formulario
      setFecha("");
      setEvento("");
      setShow(false);
    } catch (err) {
      console.error("error", err); // Manejo de errores
    }
  };

  return (
    <Container id="container-fechas" className="d-flex justify-content-center">
      <Row>
        <Col>
          <CardGestionCurso
            title={"Registrar fecha importante"}
            content={"Añade una fecha clave para el curso."}
            icon={<BsCalendar2Date size={42} />}
            handleClick={handleShow}
          />
        </Col>
      </Row>

      {/* Modal para agregar un evento */}
      <CustomModal
        show={show}
        handleClose={() => setShow(false)}
        handleShow={() => setShow(true)}
        modalTitle="Agregar evento"
      >
        {/* Formulario para agregar el evento */}
        <Form className="form-add-evento" onSubmit={handleSubmit}>
          {/* Input evento */}
          <Form.Group className="mb-3" controlId="formEvento">
            <Form.Label>Evento</Form.Label>
            <Form.Control
              type="text"
              value={evento}
              onChange={(event) => setEvento(event.target.value)}
              maxLength={200}
            />
          </Form.Group>

          {/* Input fecha */}
          <Form.Group className="mb-3" controlId="formFecha">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={fecha}
              onChange={(event) => setFecha(event.target.value)}
            />
          </Form.Group>

          {/* Mostrar error al momento de ingresar valores no válidos */}
          {/* {showError && <Alert variant="danger">{error}</Alert>} */}

          {/* Botón para aceptar */}
          <Button variant="primary" type="submit">
            Agregar
          </Button>
        </Form>
      </CustomModal>
    </Container>
  );
}

export default FormAgregarFecha;
