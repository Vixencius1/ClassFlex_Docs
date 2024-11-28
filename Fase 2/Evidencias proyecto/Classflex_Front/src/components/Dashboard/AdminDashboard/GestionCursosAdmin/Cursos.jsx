import Button from "react-bootstrap/Button";
import { MdEditNote } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

// Componente que muestra los datos de un curso en una fila de la tabla
function Cursos({ curso, onEditCurso, onDeleteCurso }) {
  return (
    <tr>
      <td>{curso.curso}</td>
      <td>{curso.nivel}</td>
      <td>{curso.cupos}</td>
      <td>
        <Button
          variant="none"
          className="me-2"
          onClick={() => onEditCurso(curso)}
        >
          <MdEditNote className="btn-edit" size={28} />
        </Button>
        <Button variant="none" onClick={() => onDeleteCurso(curso)}>
          <FaRegTrashAlt id="btn-delete" size={28} />
        </Button>
      </td>
    </tr>
  );
}

export default Cursos;
