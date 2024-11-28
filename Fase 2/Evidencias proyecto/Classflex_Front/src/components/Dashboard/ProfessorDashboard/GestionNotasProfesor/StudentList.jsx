import "./styles.css";
import React, { useCallback, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Grades from "./GradesList";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api/main/" });

// Componente para la lista de alumnos
export default function StudentList({
  alumnos,
  calificaciones,
  setCalificaciones,
}) {
  const colegioId = localStorage.getItem("colegio");
  const asignatura = JSON.parse(localStorage.getItem("asignatura"));
  const [NOTAS_HEADERS, setNOTAS_HEADERS] = useState([]);
  const [colSpan, setColSpan] = useState(4);

  const fetchAsignaturaData = useCallback(async () => {
    try {
      const response = await api.get(
        `asignatura/${colegioId}/listar-asignatura`
      );
      const filteredData = response.data.find(
        (item) => item.id === asignatura.id
      );

      if (filteredData) {
        setNOTAS_HEADERS(
          Array.from(
            { length: filteredData.cant_notas },
            (_, i) => `Nota ${i + 1}`
          )
        );
        setColSpan(3 + parseInt(filteredData.cant_notas));
      }
    } catch (error) {
      console.error(error);
    }
  }, [asignatura.id, colegioId]);

  useEffect(() => {
    fetchAsignaturaData();
  }, [fetchAsignaturaData]);

  return (
    <div>
      <Table id="table-gestion-calificaciones" responsive>
        <thead>
          <tr>
            <th>RUT</th>
            <th>Nombre Alumno</th>
            {NOTAS_HEADERS.map((nota, index) => (
              <th key={index}>{nota}</th>
            ))}
            <th>Promedio notas</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.length > 0 ? (
            alumnos.map((alumno) => (
              <Grades
                alumno={alumno}
                key={alumno.id}
                notasHeaders={NOTAS_HEADERS}
                calificaciones={calificaciones}
                setCalificaciones={setCalificaciones}
              />
            ))
          ):(
            <tr>
              <td colSpan={colSpan}>No hay alumnos registrados en el curso.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
