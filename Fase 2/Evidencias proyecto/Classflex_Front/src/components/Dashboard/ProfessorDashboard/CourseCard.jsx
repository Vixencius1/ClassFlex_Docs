import "./styles.css";
import React from "react";
import { Col, Card } from "react-bootstrap";

function CourseCard({ curso, asignatura, nombreProfesor, onClick }) {
  return (
    <Col md={4} className="mt-5">
      <Card className="mb-3 card folder-card" onClick={onClick} id="card-profesor-dashboard">
        <div className="folder-vignette">{curso.curso}</div>
        <Card.Body>
          <Card.Title className="card-title">{nombreProfesor}</Card.Title>
          <div className="card-divider" />
          <Card.Text className="card-text mt-5">Asignatura: {asignatura.asignatura}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default CourseCard;