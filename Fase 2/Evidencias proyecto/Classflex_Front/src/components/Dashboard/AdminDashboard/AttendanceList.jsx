import axios from "axios";
import "./styles.css";
import React, { useCallback, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import getMonthYear from "./getMonthYear";
import ClassRow from "./ClassRow";

const api = axios.create({baseURL: "http://localhost:8000/api/main/"});

export default function AttendanceList() {
  const [asistencias, setAsistencias] = useState([]);
  const [peorAsistencias, setPeorAsistencias] = useState(null); 
  const fechaMes = getMonthYear();
  const colegioId = localStorage.getItem('colegio');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendanceData = useCallback(async () => {
    try {
      const response = await api.get(`listar-asistencia/${colegioId}/${fechaMes}`);
      
      if (response.status === 200) {
        setAsistencias(response.data.filter(item => item.promedio_asistencias !== undefined));
        const peorAsistenciaData = response.data.find(item => item.cursos_peor_asistencia);
        if (peorAsistenciaData) {
          setPeorAsistencias(peorAsistenciaData);
        }
      }

      if (response.status === 204) {
        setError("¡No hay cursos o clases registradas!");
        setAsistencias([]);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  }, [colegioId, fechaMes]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  return (
    <div className="table-attendance">
      {error && <h3>Error al cargar datos de asistencias: {error}</h3>}
      {/* Tabla para cursos con la peor asistencia */}
      {peorAsistencias && (
        <div>
          <h4 className="text-danger text-center">Cursos con la peor asistencia:</h4>
          <Table responsive className="table-warning">
            <thead className="text-center">
              <tr>
                <th>Curso</th>
                <th>Asistencia<br/>(Porcentaje %)</th>
                <th>Total Asistencias</th>
                <th>Total Clases</th>
              </tr>
            </thead>
            <tbody>
              {peorAsistencias.cursos_peor_asistencia.map((curso, index) => (
                <tr key={index}>
                  <td>{curso}</td>
                  <td>{Math.round(peorAsistencias.promedio_peor_asistencia * 100)}%</td>
                  <td>{peorAsistencias.peor_total_asistencias}</td>
                  <td>{peorAsistencias.peor_total_clases}</td>

                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Tabla de asistencias de cursos completa */}
      <Table id="classflex-table" style={{cursor: "pointer"}} hover responsive>
        <thead className="text-center">
          <tr>
            <th colSpan={4}>Fecha: {fechaMes}</th>
          </tr>
          <tr>
            <th>Curso</th>
            <th>Asistencia<br/>(Porcentaje %)</th>
            <th>Total Asistencias</th>
            <th>Total Clases</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4}>Cargando datos de asistencias...</td>
            </tr>
          ) : (
            asistencias.length > 0 ? (
              asistencias.map((asistencia, index) => (
              <ClassRow key={index} asistencia={asistencia} />
              ))
            ) : (
              <tr>
                <td colSpan={4}>No hay datos.</td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </div>
  );
}