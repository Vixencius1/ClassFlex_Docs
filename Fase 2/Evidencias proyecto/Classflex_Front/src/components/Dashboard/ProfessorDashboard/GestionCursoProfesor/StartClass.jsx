import axios from "axios";
import React from "react";
import { useNavigate } from "react-router";
import { FaListCheck } from "react-icons/fa6";
import CardGestionCurso from "./CardGestionCurso";

function StartClass({ isAlumnosEmpty }) {
  const profesorId = localStorage.getItem("profesor_id");
  const claseIniciada = localStorage.getItem("clase_iniciada");
  const curso = JSON.parse(localStorage.getItem("curso") || "[]");
  const asignatura = JSON.parse(localStorage.getItem("asignatura") || "[]");
  const isEmpty = isAlumnosEmpty;

  const navigate = useNavigate();

  const handleIniciarClase = async () => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    const horaActual = updateTime();

    if (!claseIniciada && !isEmpty) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/main/crear-clase",
          {
            comentario: " ",
            activa: true,
            hora_inicio: horaActual,
            hora_termino: horaActual,
            profesor_id: profesorId,
            asignatura_id: asignatura.id,
            curso_id: curso.id,
            alumno_ids: [],
          }
        );

        if (response.status >= 200 && response.status < 300) {
          localStorage.setItem("clase_activa", response.data.activa);
          localStorage.setItem("clase_id", response.data.id);
          localStorage.setItem("clase_iniciada", true);
          navigate("/professor-dashboard/curso/clase");
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error("Error al iniciar la clase:", error);
      }
    } else {
      navigate("/professor-dashboard/curso/clase");
    }
  };

  return (
    <CardGestionCurso
      title={!claseIniciada ? "Iniciar clase" : "Continuar clase"}
      content={"Dar inicio a una clase y tomar asistencia de alumnos"}
      icon={<FaListCheck size={42} />}
      handleClick={handleIniciarClase}
      disabled={isEmpty}
    />
  );
}

export default StartClass;