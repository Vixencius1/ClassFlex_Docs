import "./styles.css";
import React, { useEffect, useState } from "react";
import { initializeChannel } from "../../../../data/broadcastChannel.js";
import { Container, Button } from "react-bootstrap";
import axios from "axios";
import CustomToast from "../../../CustomToast/CustomToast.js";
import StudentList from "./StudentList.jsx";
import NavbarUser from "../../../Navbar/NavbarUser.jsx";

// Constantes
const asignatura = JSON.parse(localStorage.getItem("asignatura") || "[]");
const api = axios.create({ baseURL: "http://localhost:8000/api/main/" });

// Funciones de API
const fetchProfesorData = async (colegioId, profesorId) => {
  try {
    const response = await api.get(
      `profesor/${colegioId}/${profesorId}/listar-profesor`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchAlumnosData = async (colegioId, cursoId) => {
  try {
    const response = await api.get(
      `alumno/${colegioId}/listar-alumno/${cursoId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Función para obtener calificaciones de cada alumno por asignatura
const fetchCalificacionesData = async (alumnoId) => {
  try {
    const response = await api.get(
      `alumno/${alumnoId}/${asignatura.id}/listar-notas`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener calificaciones:", error);
    return [];
  }
};

// Función para enviar nuevas calificaciones
const postCalificacionesNuevas = async (nuevasCalificaciones) => {
  try {
    await api.post(`crear-nota/${asignatura.id}/`, {
      calificaciones: nuevasCalificaciones,
    });
    console.log("Datos enviados correctamente");
  } catch (error) {
    console.error("Error al crear nuevas calificaciones:", error);
  }
};

// Función para actualizar calificaciones existentes
const updateCalificaciones = async (calificacionesActualizadas) => {
  try {
    await api.patch(`nota/update`, calificacionesActualizadas);
    console.log("Datos actualizados correctamente");
  } catch (error) {
    console.error("Error al actualizar calificaciones:", error);
  }
};

// Componente principal
export default function GestionNotasProfesor() {
  const [profesorObject, setProfesorObject] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [calificaciones, setCalificaciones] = useState({});
  const [isAlumnosEmpty, setIsAlumnosEmpty] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState({
    background: "#d4edda",
    text: "#155724",
  });

  const rutaBackButton = "/professor-dashboard/curso";

  useEffect(() => {
    const hasReloaded = localStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      localStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const channel = initializeChannel();
    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    const colegioId = localStorage.getItem("colegio");
    const profesorId = localStorage.getItem("profesor_id");
    const curso = JSON.parse(localStorage.getItem("curso") || "[]");

    if (colegioId && profesorId && curso.id) {
      const fetchData = async () => {
        const [profesorData, alumnosData] = await Promise.all([
          fetchProfesorData(colegioId, profesorId),
          fetchAlumnosData(colegioId, curso.id),
        ]);

        setProfesorObject(profesorData);
        setAlumnos(alumnosData);

        if(alumnosData.length === 0) {
          setIsAlumnosEmpty(true);
        } else {
          // Obtener calificaciones para cada alumno
          const calificacionesPorAlumno = {};
          for (const alumno of alumnosData) {
            const notas = await fetchCalificacionesData(alumno.id);
            calificacionesPorAlumno[alumno.id] = notas.map((nota) => ({
              valor: nota.nota,
              id: nota.id,
              isModified: false,
            }));
          }
          setCalificaciones(calificacionesPorAlumno);
          }
      };

      fetchData();
    } else {
      console.error("Información faltante en el localStorage.");
    }
  }, []);

  const handleGuardarCalificaciones = () => {
    const nuevasCalificaciones = [];
    const calificacionesActualizadas = [];

    alumnos.forEach((alumno) => {
      const alumnoNotas = calificaciones[alumno.id] || [];

      alumnoNotas.forEach((nota) => {
        if (nota.isNew) {
          nuevasCalificaciones.push({
            alumno: alumno.id,
            asignatura: asignatura.id,
            nota: nota.valor,
            fecha: new Date().toISOString().split("T")[0],
            tipo_evaluacion: "Evaluación",
          });
        } else if (nota.isModified) {
          console.log("Nota a actualizar:", {
            id: nota.id,
            nota: nota.valor,
          });
          calificacionesActualizadas.push({
            id: nota.id,
            nota: nota.valor,
          });
        }
      });
    });

    if (nuevasCalificaciones.length > 0) {
      postCalificacionesNuevas(nuevasCalificaciones);
    }
    if (calificacionesActualizadas.length > 0) {
      updateCalificaciones(calificacionesActualizadas);
    }

    setToastMessage("!Cambios guardados exitosamente!");
    setToastColor({ background: "#d4edda", text: "#155724" });
    setShowToast(true);

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <React.Fragment>
      <Container className="header-gestion-calificaciones" fluid>
        <NavbarUser user={profesorObject} backButton={rutaBackButton} />
      </Container>
      <Container className="body-gestion-calificaciones mt-5">
        <StudentList
          alumnos={alumnos}
          calificaciones={calificaciones}
          setCalificaciones={setCalificaciones}
        />
      </Container>
      <Container className="footer-gestion-calificaciones d-flex justify-content-center mt-3 mb-5">
        <Button
          id="btn-guardar-gestion-calificaciones"
          onClick={handleGuardarCalificaciones}
          disabled={isAlumnosEmpty}
        >
          Guardar cambios
        </Button>
        <CustomToast
          message={toastMessage}
          show={showToast}
          onClose={() => setShowToast(false)}
          backgroundColor={toastColor.background}
          textColor={toastColor.text}
        />
      </Container>
    </React.Fragment>
  );
}
