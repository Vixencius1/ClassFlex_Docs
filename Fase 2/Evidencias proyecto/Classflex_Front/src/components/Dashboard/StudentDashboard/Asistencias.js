import "./styles.css";

/* Esta es la función que carga el porcentaje de asistencia del alumno */
function Asistencia({ asistencia }) {
  let respuesta;

  try {
    const totalAsistencias = asistencia.clases_totales || 1;
    const asistenciasAlumno = asistencia.clases_asistidas || 0;
    const porcentaje =
      totalAsistencias > 1
        ? Math.round((asistenciasAlumno / totalAsistencias) * 100)
        : 100;

    respuesta = (
      <div className="asistencia-circle-container">
        <div
          className="progress-circle"
          style={{
            "--percentage": porcentaje,
            "--color": getColor(porcentaje),
          }}
        >
          <div className="wave"></div>
          <span>{porcentaje}%</span>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error al cargar porcentaje de asistencia: ", error);

    respuesta = <h3 className="asistencia-error text-center">Error :(</h3>;
  }

  return respuesta;
}

// Función para determinar el color según el porcentaje
function getColor(porcentaje) {
  if (porcentaje >= 70) {
    return "#11a844";
  } else if (porcentaje >= 40) {
    return "#e6e95b";
  } else {
    return "#bb1a1a";
  }
}

export default Asistencia;
