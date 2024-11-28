import "./styles.css";
import Button from "react-bootstrap/Button";
import FormatISODate from "../../../FormatIsoDate/FormatIsoDate";
import { MdEditNote } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

// Componente que muestra los datos de una asignatura en una fila de la tabla
function Asignaturas({ asignatura, onEditAsignatura, onDeleteAsignatura }) {
  return (
    <tr>
      <td>{asignatura.asignatura}</td>
      <td>{asignatura.descripcion}</td>
      <td>{FormatISODate(asignatura.fecha_modificacion)}</td>
      <td>{FormatISODate(asignatura.fecha_creacion)}</td>
      <td>{asignatura.cant_notas}</td>
      <td>
        {/* Botones de editar y eliminar */}
        <Button
          variant="none"
          className="me-2"
          onClick={() => onEditAsignatura(asignatura)}
        >
          <MdEditNote className="btn-edit" size={28} />
        </Button>
        <Button variant="none" onClick={() => onDeleteAsignatura(asignatura)}>
          <FaRegTrashAlt className="btn-delete" size={28} />
        </Button>
      </td>
    </tr>
  );
}

export default Asignaturas;
