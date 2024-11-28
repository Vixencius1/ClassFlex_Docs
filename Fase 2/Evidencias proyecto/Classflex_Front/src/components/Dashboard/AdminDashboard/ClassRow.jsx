import React from "react";

const ClassRow = ({ asistencia }) => {

  return (
    <React.Fragment>
      <tr className="class-row">
        <td>{asistencia.curso}</td>
        {asistencia.promedio_asistencias === 0 ? (
          <td>100%</td>
        ) : (
          <td>{Math.round(asistencia.promedio_asistencias *100)}%</td>
        )}
        <td>{asistencia.total_asistencias}</td>
        <td>{asistencia.total_clases}</td>
      </tr>
      {asistencia.message && (
      <tr>
        <td colSpan={4}>
          {asistencia.message}    
        </td>
      </tr>
      )}
    </React.Fragment>
  );
}

export default ClassRow;