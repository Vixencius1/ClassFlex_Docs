import "./styles.css";
import React from "react";
import { Card } from "react-bootstrap";

function CardGestionCurso({ title, content, icon, handleClick, disabled=false }) {
  
  /* Esta condición existe solamente por la posibilidad 
  de que curso no tenga alumnos registrados */
  if (disabled) {
    return (
      <Card className="text-center" id="card-gestion-curso">
        <Card.Body id="card-body-gestion-curso">
          <Card.Title id="card-title-gestion-curso">{title}</Card.Title>
          <Card.Subtitle id="card-subtitle-gestion-curso" style={{color:'red'}}>No disponible</Card.Subtitle>
          <Card.Text id="card-content-gestion-curso">{content}</Card.Text>
          <div id="icon-gestion-curso">{icon}</div>
        </Card.Body>
      </Card>
    );
  } else {
    return (
      <Card onClick={handleClick} className="text-center" id="card-gestion-curso">
        <Card.Body id="card-body-gestion-curso">
          <Card.Title id="card-title-gestion-curso">{title}</Card.Title>
          <Card.Text id="card-content-gestion-curso">{content}</Card.Text>
          <div id="icon-gestion-curso">{icon}</div>
        </Card.Body>
      </Card>
    );
  }
}

export default CardGestionCurso;