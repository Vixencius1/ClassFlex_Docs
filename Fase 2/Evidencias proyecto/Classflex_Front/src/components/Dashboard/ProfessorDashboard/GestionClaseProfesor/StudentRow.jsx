import React from "react";

function StudentRow({ alumno, onTogglePresence, asistencias }) {
  const existingAsistencia = asistencias.find((a) => a.alumno_id === alumno.id);

  const isPresent = existingAsistencia ? existingAsistencia.presente : false;

  function handleToggle() {
    const newPresence = !isPresent;
    onTogglePresence(alumno.id, newPresence);
  }

  const nombreAlumno = `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`;

  return (
    <tr>
      <td>{alumno.rut}</td>
      <td>{nombreAlumno}</td>
      <td>
        <div className="container-switch">
          <label className="switch-slide">
            <input
              type="checkbox"
              checked={isPresent}
              onChange={handleToggle}
            />
            <span className="is-present-slider"></span>
          </label>
          {isPresent ? "Presente" : "Ausente"}
        </div>
      </td>
    </tr>
  );
}

export default StudentRow;