import "./styles.css";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import { GoHistory, GoNumber } from "react-icons/go";
import axios from "axios";
import CardGestionCurso from "./CardGestionCurso";
import FormAgregarFecha from "./FormAgregarFecha";
import StartClass from "./StartClass";
import FormatDate from "../../../FormatDate/FormatDate.js";

const api = axios.create({
  baseURL: "http://localhost:8000/api/main/",
});

function GestionCurso({ curso, asignatura, profesor }) {
  const [fechasImportantes, setFechasImportantes] = useState([]);
  const [isAlumnosEmpty, setIsAlumnosEmpty] = useState(false);
  const colegioId = localStorage.getItem("colegio");
  const cursoId = curso.id;
  const asignaturaId = asignatura.id;
  const navigate = useNavigate();

  const fetchAlumnosData = async (cursoId) => {
    try {
      const response = await api.get(`alumno/${colegioId}/listar-alumno/${cursoId}`);
      if (response.data.length === 0) {
        setIsAlumnosEmpty(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (colegioId) {
      api
        .get(`curso/${cursoId}/${asignaturaId}/listar-fechas`)
        .then((response) => {
          setFechasImportantes(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [cursoId, asignaturaId]);

  useEffect(() => {
    if (colegioId && cursoId) {
      fetchAlumnosData(cursoId);
    }
  }, [colegioId, cursoId]);

  function handleAddFecha(fecha) {
    setFechasImportantes((fechas) => [...fechas, fecha]);
  }

  return (
    <Container fluid>
      <Row>
        <Col
          className="d-flex justify-content-center"
          xs={12}
          style={{ flexWrap: "wrap", textAlign: "center" }}
        >
          <div className="course-heading">
            <div className="course-item">
              <strong>Curso:</strong>
              <div>{curso.curso}</div>
            </div>
            <div className="course-item">
              <strong>Asignatura:</strong>
              <div>{asignatura.asignatura}</div>
            </div>
            <div className="course-item">
              <strong>Profesor(a):</strong>
              <div>{profesor}</div>
            </div>
          </div>
        </Col>
      </Row>
      <Row id="row-gestion-curso">
        <Col xs={12} sm={6} md={4} lg={3} xxl={2} className="mb-3">
          <StartClass isAlumnosEmpty={isAlumnosEmpty} />
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} xxl={2} className="mb-3">
          <CardGestionCurso
            title={"Historial de asistencias"}
            content={
              "Lista de asistencia de todas las clases realizadas en la asignatura"
            }
            icon={<GoHistory size={42} />}
            handleClick={() =>
              navigate("/professor-dashboard/curso/historial-asistencias")
            }
          />
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} xxl={2} className="mb-3">
          <CardGestionCurso
            title={"Asignar notas"}
            content={"Registrar las calificaciones de los alumnos"}
            icon={<GoNumber size={42} />}
            handleClick={() =>
              navigate("/professor-dashboard/curso/calificaciones")
            }
          />
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} xxl={2} className="mb-3">
          <FormAgregarFecha onAddFecha={handleAddFecha} />
        </Col>
        {/* Columna de tabla Fechas Importantes */}
        <Col
          xs={12}
          sm={12}
          md={8}
          lg={4}
          xxl={3}
          className="mt-3"
          id="table-container-gestion-curso"
        >
          <div className="table-responsive">
            <table id="classflex-table" className="table">
              <thead>
                <tr>
                  <th colSpan={3} className="table-title text-center">
                    Fechas Importantes
                  </th>
                </tr>
                <tr>
                  <th>Fecha</th>
                  <th>Evento</th>
                  <th>Asignatura</th>
                </tr>
              </thead>
              <tbody>
                {fechasImportantes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center">
                      No hay fechas importantes registradas.
                    </td>
                  </tr>
                ) : (
                  fechasImportantes.map((fecha, index) => (
                    <tr key={index}>
                      <td>{FormatDate(fecha.fecha)}</td>
                      <td>{fecha.evento}</td>
                      <td>{asignatura.asignatura || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default GestionCurso;
