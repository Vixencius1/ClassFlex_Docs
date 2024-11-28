
import React from "react";


const StudentRow = ({ alumno, asistencia, onTogglePresence }) => {

  function handleToggle() {
    const newJustificado = !asistencia.justificado;
    if (asistencia) {
      onTogglePresence(asistencia.id, newJustificado);
    }
  }

  return (
    <tr>
      <td>{alumno.rut}</td>
      <td>{`${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`}</td>
      <td>
        {asistencia
          ? asistencia.presente
            ? "Presente" : "Ausente"
          : "No disponible"}
      </td>
      <td>
        {asistencia && !asistencia.presente ? (
          <div className="container-switch">

            <label className="switch-slide mx-2">
              <input
                type="checkbox"
                checked={asistencia.justificado}
                onChange={handleToggle}
                disabled={asistencia.justificado}
              />
              <span className="is-present-slider"></span>
            </label>
            {asistencia.justificado ? "Justificado" : "Ausente"}
          </div>
        ) : (
          <span style={{ color: "green" }}>Presente</span>
        )}
      </td>
    </tr>
  );
};

export default StudentRow;
