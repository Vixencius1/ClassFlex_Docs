import { Alert, Container } from "react-bootstrap";
import "./styles.css";
import React, { useCallback, useEffect, useState } from "react";
import NavbarUser from "../../../Navbar/NavbarUser";
import { useFetchProfesorData } from "../../../Hooks/useFetchProfesorData";
import Historial from "./Historial";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api/main/" });

export default function HistorialAsistencias() {
  const [alumnos, setAlumnos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const colegioId = localStorage.getItem("colegio");
  const profesorId = localStorage.getItem("profesor_id");
  const curso = JSON.parse(localStorage.getItem("curso") || "[]");

  const rutaBackButton = "/professor-dashboard/curso";

  const { profesorObject, nombreProf } = useFetchProfesorData(
    colegioId,
    profesorId
  );

  const fetchAlumnosData = useCallback(async (colegioId, cursoId) => {
    try {
      const response = await api.get(
        `alumno/${colegioId}/listar-alumno/${cursoId}`
      );
      setAlumnos(response.data);
    } catch (error) {
      setError("Error al cargar la lista de alumnos.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (colegioId) {
      fetchAlumnosData(colegioId, curso.id);
    } else {
      setError("No se encontró el ID del colegio en el localStorage.");
      setLoading(false);
    }
  }, [colegioId, curso.id, fetchAlumnosData]);

  return (
    <Container fluid md={12}>
      <NavbarUser
        user={profesorObject}
        nombreUser={nombreProf}
        backButton={rutaBackButton}
      />
      {loading && <h1 className="text-center">Cargando asistencias...</h1>}
      <Historial alumnos={alumnos} />
      {error && <Alert variant="danger">{error}</Alert>}
    </Container>
  );
}
