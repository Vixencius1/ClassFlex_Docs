import "./styles.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdEditNote } from "react-icons/md";

// Componente que muestra los datos de un profesor en una fila de la tabla
function Profesor({
  profesor,
  onEditProfesor,
  setShowToast,
  setToastMessage,
  setToastColor,
}) {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = async () => {
    const nuevoEstado = !isActive;
    try {
      await actualizarEstadoUsuario(nuevoEstado);
      setIsActive(nuevoEstado);
      setToastMessage("!Actualización de estado exitosa!");
      setToastColor({ background: "#d4edda", text: "#155724" });
      setShowToast(true);
    } catch (error) {
      console.error("Error al actualizar profesores:", error);
      setToastMessage("Error al actualizar el estado.");
      setToastColor({ background: "#f8d7da", text: "#721c24" });
      setShowToast(true);
    }
  };

  const actualizarEstadoUsuario = async (nuevoEstado) => {
    return await axios.patch(
      `http://localhost:8000/api/usuarios/${profesor.usuario}/update`,
      { is_active: nuevoEstado }
    );
  };

  const normalizeIsActive = (isActiveValue) => {
    if (typeof isActiveValue === "boolean") {
      return isActiveValue;
    }
    return isActiveValue === "True" || isActiveValue === "true";
  };

  useEffect(() => {
    setIsActive(normalizeIsActive(profesor.is_active));
  }, [profesor]);

  return (
    <tr>
      <td>{profesor.rut}</td>
      <td>{profesor.nombre}</td>
      <td>{profesor.apellido_paterno}</td>
      <td>{profesor.apellido_materno}</td>
      <td>{profesor.contacto}</td>
      <td>{profesor.correo}</td>
      <td>
        <label className="switch">
          <input type="checkbox" checked={isActive} onChange={handleToggle} />
          <span className="slider"></span>
        </label>
        {isActive ? "Activa" : "Inactiva"}
      </td>
      <td>
        {/* Botones de editar y eliminar */}
        <Button
          variant="none"
          className="me-2"
          onClick={() => onEditProfesor(profesor)}
        >
          <MdEditNote className="btn-edit" size={28} />
        </Button>
      </td>
    </tr>
  );
}

export default Profesor;
