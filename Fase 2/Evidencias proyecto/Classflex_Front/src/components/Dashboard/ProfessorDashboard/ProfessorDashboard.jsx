import "./styles.css";
import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { initializeChannel } from "../../../data/broadcastChannel.js";
import { useFetchProfesorData } from "../../Hooks/useFetchProfesorData.js";
import LoadCourses from "./LoadCourses.jsx";
import NavbarUser from "../../Navbar/NavbarUser.jsx";


export default function ProfessorDashboard() {
  const colegioId = localStorage.getItem("colegio");
  const profesorId = localStorage.getItem("profesor_id");
  const { profesorObject, cursos, nombreProf, colegios, loading, error } = useFetchProfesorData(colegioId, profesorId);

  let rutaBackButton = colegios.length > 1 ? "/selector-colegios" : null;
  
  useEffect(() => {
    const channel = initializeChannel();
    localStorage.removeItem("clase_iniciada");
    localStorage.removeItem("clase_activa");
    localStorage.removeItem("clase_id");
    localStorage.removeItem("asistencias");
    return () => {
      channel.close();
    };
  }, []);

  return (
    <Container fluid md={12}>
      <NavbarUser user={profesorObject} backButton={rutaBackButton} />
      { loading && <p>Cargando datos...</p> }
      { error && <p>Error al cargar datos: {error}</p> }
      { !loading && !error && <LoadCourses cursos={cursos} profe={[profesorObject]} nombreProfesor={nombreProf} />}
    </Container>
  );
}