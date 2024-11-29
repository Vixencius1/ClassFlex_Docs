import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";
import Alumnos from "./Alumnos";
import CustomToast from "../../../CustomToast/CustomToast";
import { useEffect, useState } from "react";

function TablaAlumnos({ alumnos, onEditAlumno }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState({
    background: "#d4edda",
    text: "#155724",
  });

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Función para calcular itemsPerPage según el tamaño de pantalla
  const calculateItemsPerPage = () => {
    const width = window.innerWidth;
    if (width >= 1200) {
      return 5;
    } else if (width >= 768) {
      return 4;
    } else {
      return 3;
    }
  };

  // Actualiza itemsPerPage al cargar la página y al redimensionar
  useEffect(() => {
    const updateItemsPerPage = () => setItemsPerPage(calculateItemsPerPage());
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  // Cálculo de los datos visibles
  const totalPages = Math.ceil(alumnos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlumnos = alumnos.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Container
        className="table-list-alumnos"
        style={{ position: "relative" }}
      >
        <Row>
          <Col>
            {/* Tabla para mostrar los alumnos */}
            <Table
              className="table align-middle mb-0 bg-white shadow-sm rounded"
              id="classflex-table"
              hover
            >
              <thead className="table-header">
                <tr>
                  <th>Curso</th>
                  <th>RUT</th>
                  <th>Nombre</th>
                  <th>Apellido paterno</th>
                  <th>Apellido materno</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th>Cuenta usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentAlumnos.map((alumno) => (
                  <Alumnos
                    key={alumno.id}
                    alumno={alumno}
                    onEditAlumno={onEditAlumno}
                    setShowToast={setShowToast}
                    setToastMessage={setToastMessage}
                    setToastColor={setToastColor}
                  />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        {/* Paginación */}
        <Pagination
          style={{
            position: "absolute",
            right: "0",
            left: "0",
            bottom: "0",
          }}
          className="justify-content-center mt-3"
        >
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </Container>

      <CustomToast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
        backgroundColor={toastColor.background}
        textColor={toastColor.text}
      />
    </div>
  );
}

export default TablaAlumnos;
