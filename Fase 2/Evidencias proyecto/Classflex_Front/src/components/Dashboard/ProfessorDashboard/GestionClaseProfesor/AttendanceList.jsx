import React, { useState, useEffect } from "react";
import { Button, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentRow from "./StudentRow.jsx";
import ModalBitacora from "./ModalBitacora.jsx";

const api = axios.create({ baseURL: "http://localhost:8000/api/main/" });

function AttendanceList({ alumnos }) {
  const [asistencias, setAsistencias] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Se revisa si hay estados de asistencia guardados
  useEffect(() => {
    const storedAsistencias = localStorage.getItem("asistencias");
    if (storedAsistencias) {
      try {
        setAsistencias(JSON.parse(storedAsistencias));
      } catch (error) {
        console.error("Error parsing asistencias from localStorage:", error);
        setAsistencias([]);
      }
    } else {
      setAsistencias([]);
    }
  }, []);

  // Se guardan los estados de asistencia según se van eligiendo
  useEffect(() => {
    if (asistencias.length > 0) {
      const prevAsistencias =
        JSON.parse(localStorage.getItem("asistencias")) || [];
      if (JSON.stringify(prevAsistencias) !== JSON.stringify(asistencias)) {
        localStorage.setItem("asistencias", JSON.stringify(asistencias));
      }
    }
  }, [asistencias]);

  // Se van agregando alumnos al array según se van pulsando los estados
  const handleTogglePresence = (alumnoId, presente) => {
    setAsistencias((prevAsistencias) => {
      const existingAsistencia = prevAsistencias.find(
        (a) => a.alumno_id === alumnoId
      );
      if (existingAsistencia) {
        return prevAsistencias.map((a) =>
          a.alumno_id === alumnoId ? { ...a, presente } : a
        );
      } else {
        return [
          ...prevAsistencias,
          {
            id: prevAsistencias.length + 1,
            alumno_id: alumnoId,
            presente,
          },
        ];
      }
    });
  };

  // Envío de datos a la api de Asistencia
  const handleSubmitAsistencias = async () => {
    const claseId = localStorage.getItem("clase_id");

    const updatedAsistencias = alumnos.map((alumno) => {
      const existingAsistencia = asistencias.find(
        (a) => a.alumno_id === alumno.id
      );
      return {
        id: existingAsistencia ? existingAsistencia.id : asistencias.length + 1,
        alumno_id: alumno.id,
        clase_id: claseId,
        fecha: new Date().toISOString().split("T")[0],
        presente: existingAsistencia ? existingAsistencia.presente : false,
      };
    });

    setLoading(true);
    setError(null);

    try {
      await api.post(`crear-asistencia/${claseId}`, {
        asistencias: updatedAsistencias,
      });
      localStorage.removeItem("clase_iniciada");
      localStorage.removeItem("asistencias");
      localStorage.removeItem("clase_activa");
      localStorage.removeItem("clase_id");
      navigate("/professor-dashboard/curso");
    } catch (err) {
      console.log("Error al actualizar clase", err);
      setError("Error al enviar la asistencia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table responsive id="classflex-table" className="table">
        <thead>
          <tr>
            <th>RUT</th>
            <th>Nombre Alumno</th>
            <th>Estado de asistencia</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => (
            <StudentRow
              alumno={alumno}
              key={alumno.id}
              onTogglePresence={handleTogglePresence}
              asistencias={asistencias}
            />
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-center mt-3 mb-5">
        <Button onClick={() => setModalShow(true)} disabled={loading}>
          {loading ? "Cerrando clase..." : "Cerrar clase"}
        </Button>
      </div>
      <ModalBitacora
        show={modalShow}
        handleClose={() => setModalShow(false)}
        handleSubmit={handleSubmitAsistencias}
      />
    </div>
  );
}

export default AttendanceList;
