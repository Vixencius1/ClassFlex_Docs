import "./styles.css";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Alert, Form, Table, Container, FloatingLabel } from "react-bootstrap";
import StudentRow from "./StudentRow";

const api = axios.create({ baseURL: "http://localhost:8000/api/main/" });

export default function Historial({ alumnos }) {
  const [clases, setClases] = useState([]);
  const [selectedClase, setSelectedClase] = useState(null);
  const [asistenciasData, setAsistenciaData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const curso = JSON.parse(localStorage.getItem("curso"));
  const asignatura = JSON.parse(localStorage.getItem("asignatura"));

  const cursoId = curso.id;
  const asignaturaId = asignatura.id;

  let bitacora;

  const fetchClassesData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get(
        `clase/${cursoId}/${asignaturaId}/listar-clases`
      );
      setClases(response.data);
    } catch (error) {
      setError(error);
      console.error("Error al cargar datos de asistencia:", error);
    } finally {
      setLoading(false);
    }
  }, [cursoId, asignaturaId]);

  const fetchAttendanceData = useCallback(async (claseId) => {
    try {
      const response = await api.get(`listar-asistencia/clase/${claseId}`);
      setAsistenciaData(response.data);
    } catch (error) {
      setError("Error al cargar datos de asistencia.");
      console.error("Error al cargar datos de asistencia:", error);
    }
  }, []);

  /* Este handler permite cambiar el estado de asistencia de 
  Ausente a Justificado, pero NO viceversa */
  const handleTogglePresence = async (asistenciaId, justificado) => {
    try {
      const asistenciaData = {
        asistencia_id: asistenciaId,
        justificado,
      };
      const response = await api.patch(
        `asistencia/${asistenciaId}/update`,
        asistenciaData
      );
      setAsistenciaData((prevAsistencias) =>
        prevAsistencias.map((asistencia) =>
          asistencia.id === asistenciaId ? response.data : asistencia
        )
      );
    } catch (error) {
      console.error("Error al actualizar la asistencia:", error);
    }
  };

  useEffect(() => {
    fetchClassesData();
  }, [fetchClassesData, alumnos]);

  useEffect(() => {
    if (clases && clases.length > 0 && !selectedClase) {
      setSelectedClase(clases[0].id);
    }
  }, [clases, selectedClase]);

  useEffect(() => {
    if (selectedClase) {
      fetchAttendanceData(selectedClase);
    }
  }, [selectedClase, fetchAttendanceData]);


  const handleClassChange = (event) => {
    const newClass = Number(event.target.value);
    setSelectedClase(newClass);
  };

  const selectedClassData = clases.find((clase) => clase.id === selectedClase);
  bitacora = selectedClassData ? selectedClassData.comentario : '';

  return (
    <Container className="mb-5">
      {loading && <h1 className="text-center">Cargando historial...</h1>}
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="d-flex justify-content-center mb-3">
        <h2 className="curso-asignatura-title text-center mb-3 p-3" style={{ textTransform: "uppercase" }}>
          {curso.curso} - {asignatura.asignatura}
        </h2>
      </div>
      <Form.Group className="d-flex justify-content-center mb-3">
        <Form.Label htmlFor="form-class-select" style={{ margin: "1rem" }}>
          <strong>CLASE</strong>:
        </Form.Label>
        <Form.Select
          id="form-class-select"
          type="text"
          value={selectedClase || ""}
          onChange={handleClassChange}
          style={{ width: "50vw", border: '1px solid rgba(146, 143, 143, 0.69)' }}
        >
          {clases && clases.length > 0 ? (
            clases.map((clase) => (
              <option key={clase.id} value={clase.id}>
                {clase.fecha} - {asignatura.asignatura} ({clase.hora_inicio}{" "}
                -&gt; {clase.hora_termino})
              </option>
            ))
          ) : (
            <option value="">No hay clases disponibles.</option>
          )}
        </Form.Select>
      </Form.Group>
      <Table
        id="classflex-table"
        style={{ cursor: "pointer" }}
        hover
        responsive
      >
        <thead>
          <tr>
            <th>Rut</th>
            <th>Nombre</th>
            <th>Estado de asistencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos && alumnos.length > 0 ? (
            alumnos.map((alumno) => {
              const asistencia = asistenciasData.find(
                (a) => a.alumno_id === alumno.id
              );
              return (
                <StudentRow
                  key={alumno.id}
                  alumno={alumno}
                  asistencia={asistencia}
                  onTogglePresence={handleTogglePresence}
                />
              );
            })
          ) : (
            <tr>
              <td colSpan="4">No hay alumnos registrados.</td>
            </tr>
          )}
        </tbody>
      </Table>
      {/* Componente que muestra el comentario de la clase seleccionada */}
      <FloatingLabel controlId="labelBitacora" label="Bitácora:">
        <Form.Control
          as="textarea"
          placeholder="Bitácora de la clase"
          style={{ height: '200px', border: '1px solid rgba(146, 143, 143, 0.69)' }}
          readOnly={true}
          value={bitacora}
        />
      </FloatingLabel>
    </Container>
  );
}
