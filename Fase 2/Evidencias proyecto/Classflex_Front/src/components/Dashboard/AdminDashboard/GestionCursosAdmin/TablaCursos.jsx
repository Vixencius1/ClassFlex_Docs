import "./styles.css";
import Table from "react-bootstrap/Table";
import Cursos from "./Cursos";
import Container from "react-bootstrap/Container";

// Componente que muestra la tabla de cursos
function TablaCursos({ cursos, onEditCurso, onDeleteCurso }) {
  return (
    <Container className="table-list-cursos">
      <Table
        className="table align-middle mb-0 bg-white shadow-sm rounded"
        id="classflex-table"
        hover
      >
        <thead className="table-header">
          <tr>
            <th>Curso</th>
            <th>Nivel</th>
            <th>Cupos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso, index) => (
            <Cursos
              key={index}
              curso={curso}
              onEditCurso={onEditCurso}
              onDeleteCurso={onDeleteCurso}
            />
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default TablaCursos;
