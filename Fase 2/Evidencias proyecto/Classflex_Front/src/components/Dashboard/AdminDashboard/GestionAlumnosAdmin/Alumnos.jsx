import axios from "axios";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { MdEditNote } from "react-icons/md";

// Componente que muestra los datos alumnos en una fila de la tabla
function Alumnos({
  alumno,
  onEditAlumno,
  setShowToast,
  setToastMessage,
  setToastColor,
}) {
  const [isActive, setIsActive] = useState(true);

  const handleToggle = async () => {
    const nuevoEstado = !isActive;
    try {
      await actualizarEstadoUsuario(nuevoEstado);
      setIsActive(nuevoEstado);
      setToastMessage("Actualización de estado exitosa!");
      setToastColor({ background: "#d4edda", text: "#155724" });
      setShowToast(true);
    } catch (error) {
      console.error("Error al actualizar los alumnos:", error);
      setToastMessage("Error al actualizar el estado.");
      setToastColor({ background: "#f8d7da", text: "#721c24" });
      setShowToast(true);
    }
  };

  const actualizarEstadoUsuario = async (nuevoEstado) => {
    return await axios.patch(
      `http://localhost:8000/api/usuarios/${alumno.usuario}/update`,
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
    setIsActive(normalizeIsActive(alumno.is_active));
  }, [alumno]);

  return (
    <tr>
      <td>{alumno.curso.curso}</td>
      <td>{alumno.rut}</td>
      <td>{alumno.nombre}</td>
      <td>{alumno.apellido_paterno}</td>
      <td>{alumno.apellido_materno}</td>
      <td>{alumno.correo}</td>
      <td>{alumno.direccion}</td>
      <td>
        <div className="switch-container">
          <label className="switch">
            <input type="checkbox" checked={isActive} onChange={handleToggle} />
            <span className="slider"></span>
          </label>
          {isActive ? "Activa" : "Inactiva"}
        </div>
      </td>
      <td>
        {/* Botones de editar y eliminar */}
        <Button
          variant="none"
          className="me-2"
          onClick={() => onEditAlumno(alumno)}
        >
          <MdEditNote className="btn-edit" size={28} />
        </Button>
      </td>
    </tr>
  );
}

export default Alumnos;
