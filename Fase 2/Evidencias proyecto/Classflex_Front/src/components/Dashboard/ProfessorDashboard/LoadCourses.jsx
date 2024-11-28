import "./styles.css";
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import CourseCard from "./CourseCard";

function LoadCourses({ profe, cursos, nombreProfesor }) {
  const [sortedCourses, setSortedCourses] = useState([]);
  const navigate = useNavigate();

  const handleCardClick = (curso, asignatura) => {
    localStorage.setItem("curso", JSON.stringify(curso));
    localStorage.setItem("asignatura", JSON.stringify(asignatura));
    localStorage.setItem("profesor", nombreProfesor);
    navigate("/professor-dashboard/curso");
  };

  useEffect(() => {
    setSortedCourses(cursos);
  }, [cursos]);

  const sortByCurso = () => {
    const sortedCursos = [...sortedCourses].sort((a, b) => {
      if (a.nivel < b.nivel) return -1;
      if (a.nivel > b.nivel) return 1;
      return 0;
    });
    setSortedCourses(sortedCursos);
  };

  return (
    <Container className="mt-4 mb-5">
      <Row className="mb-3">
        <Col md={4}>
          <button className="button" onClick={sortByCurso}>
            Ordenar por Curso
          </button>
        </Col>
      </Row>
      <Row className="mt-3">
        {sortedCourses.length > 0 ? (
          sortedCourses.map((curso) =>
            curso.asignaturas
              .filter((asignatura) =>
                profe[0].asignaturas.some(
                  (profAsignatura) => profAsignatura.id === asignatura.id
                )
              )
              .map((asignatura) => (
                <CourseCard 
                  key={`${curso.curso}-${asignatura.id}`} 
                  curso={curso} 
                  asignatura={asignatura} 
                  nombreProfesor={nombreProfesor}
                  onClick={() => handleCardClick(curso, asignatura)} />
              ))
          )
        ):(
          <h3>No hay cursos disponibles</h3>
        )}
      </Row>
    </Container>
  );
}

export default LoadCourses;