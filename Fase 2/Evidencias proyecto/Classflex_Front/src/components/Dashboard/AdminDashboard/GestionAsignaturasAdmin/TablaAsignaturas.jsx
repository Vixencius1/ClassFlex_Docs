import "./styles.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Asignaturas from "./Asignaturas";

// Componente que muestra la tabla de asignaturas
function TablaAsignaturas({
  asignaturas,
  onEditAsignatura,
  onDeleteAsignatura,
}) {
  return (
    <Container className="table-list-asignaturas">
      <Row>
        <Col>
          {/* Tabla para mostrar las asignaturas */}
          <Table
            className="table align-middle mb-0 bg-white shadow-sm rounded"
            id="classflex-table"
            hover
          >
            <thead className="table-header">
              <tr>
                <th>Asignatura</th>
                <th>Descripción</th>
                <th>Fecha Modificación</th>
                <th>Fecha Creación</th>
                <th>Cant. Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapea la lista de asignaturas para crear filas en la tabla */}
              {asignaturas.map((asignatura, index) => (
                <Asignaturas
                  key={index}
                  asignatura={asignatura}
                  onEditAsignatura={onEditAsignatura}
                  onDeleteAsignatura={onDeleteAsignatura}
                />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default TablaAsignaturas;