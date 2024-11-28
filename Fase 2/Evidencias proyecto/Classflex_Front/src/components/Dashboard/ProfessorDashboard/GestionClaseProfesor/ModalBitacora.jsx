import React, { useState} from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const api = axios.create({baseURL: "http://localhost:8000/api/main/"});

function ModalBitacora({ show, handleClose, handleSubmit }) {
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const horaActual = updateTime();

  const updateCourse = async (comentario, horaActual) => {
    const claseId = localStorage.getItem("clase_id");
    setLoading(true);
    setError(null);

    try {
      const response = await api.patch(`clase/${claseId}/update`,
        {
          comentario,
          hora_termino: horaActual,
          activa: false,
        }
      );
      return response.data;
    } catch (err) {
      setError(err);
      console.log("Error al actualizar clase", err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComentario = async (e) => {
    e.preventDefault();
    try {
      await updateCourse(comentario, horaActual);
      await handleSubmit();
      handleClose();
    } catch (err) {
      console.log("Error al guardar bitácora", err);
      console.error(err);
    }
  };

  return (
    <Modal
      className="modal-bitacora d-flex align-items-center"
      show={show}
      onHide={handleClose}
      keyboard={false}
      centered
    >
      <Modal.Header closeButton className="modal-header-bitacora">
        <Modal.Title>Bitácora de la clase</Modal.Title>
      </Modal.Header>
      <form id="form-bitacora" onSubmit={handleSubmitComentario}>
        <Modal.Body className="body-modal-bitacora">
          <textarea
            rows="10"
            cols="43"
            className="textarea-bitacora"
            placeholder="Ingrese comentarios de la clase"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            maxLength={500}
          ></textarea>

          {error && <div className="error-message">{error.message}</div>}
        </Modal.Body>
        <Modal.Footer className="modal-footer-bitacora d-flex justify-content-center">
          <Button variant="none" id="btn-close-bitacora" type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar y cerrar'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default ModalBitacora;