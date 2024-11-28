import "./styles.css";
import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { initializeChannel } from "../../../../data/broadcastChannel.js";
import axios from "axios";
import ModalBitacora from "./ModalBitacora.jsx";
import AttendanceList from "./AttendanceList.jsx";
import NavbarUser from "../../../Navbar/NavbarUser.jsx";

const api = axios.create({baseURL: "http://localhost:8000/api/main/"});

export default function GestionClaseProfesor() {
  const rutaBackButton = "/professor-dashboard/curso";
  const [profesorObject, setProfesorObject] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem("hasReloaded");
    
    const channel = initializeChannel();

    return () => {
      channel.close();
    };
  }, []);

  const fetchProfesorData = useCallback(async (colegioId, profesorId) => {
    try {
      const response = await api.get(`profesor/${colegioId}/${profesorId}/listar-profesor`);
      setProfesorObject(response.data);
    } catch (error) {
      setError("Error al cargar datos del profesor.");
      console.error(error);
    }
  }, []);

  const fetchAlumnosData = useCallback(async (colegioId, cursoId) => {
    try {
      const response = await api.get(`alumno/${colegioId}/listar-alumno/${cursoId}`);
      setAlumnos(response.data);
    } catch (error) {
      setError("Error al cargar la lista de alumnos.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const colegioId = localStorage.getItem("colegio");
    const profesorId = localStorage.getItem("profesor_id");
    const curso = JSON.parse(localStorage.getItem("curso") || "[]");

    if (colegioId) {
      fetchProfesorData(colegioId, profesorId);
      fetchAlumnosData(colegioId, curso.id);
    } else {
      setError("No se encontró el ID del colegio en el localStorage.");
      setLoading(false);
    }
  }, [fetchProfesorData, fetchAlumnosData]);

  return (
    <React.Fragment>
      <Container className="header-gestion-clase" fluid>
        <NavbarUser user={profesorObject} backButton={rutaBackButton} />
      </Container>
      <Container className="body-gestion-clase mt-5">
        {loading && <div className="loading-message">Cargando...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && <AttendanceList alumnos={alumnos} />}
      </Container>
      <Container className="footer-gestion-clase d-flex justify-content-center mt-2 mb-5">
        <ModalBitacora
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      </Container>
    </React.Fragment>
  );
}
