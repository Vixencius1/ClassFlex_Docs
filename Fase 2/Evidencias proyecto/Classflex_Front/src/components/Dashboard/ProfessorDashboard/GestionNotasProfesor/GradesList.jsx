import "./styles.css";
import React from "react";

// Componente para cada alumno
export default function Grades({
  alumno,
  notasHeaders,
  calificaciones,
  setCalificaciones,
}) {
  const nombreAlumno = `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`;

  const handleNotaChange = (index, valor) => {
    if (valor === "" || /^[1-7](\.[0-9]?)?$/.test(valor)) {
      setCalificaciones((prevCalificaciones) => {
        const alumnoCalificaciones = [...(prevCalificaciones[alumno.id] || [])];

        if (index > 0 && !alumnoCalificaciones[index - 1]) {
          return prevCalificaciones;
        }

        if (!alumnoCalificaciones[index]) {
          alumnoCalificaciones[index] = {
            valor: valor === "" ? null : valor,
            isNew: true,
          };
        } else {
          alumnoCalificaciones[index] = {
            ...alumnoCalificaciones[index],
            valor,
            isModified: alumnoCalificaciones[index].valor !== valor,
          };
        }

        return {
          ...prevCalificaciones,
          [alumno.id]: alumnoCalificaciones,
        };
      });
    }
  };

  const handleBlur = (event) => {
    const { value } = event.target;
    if (value !== "") {
      let formattedValue = parseFloat(value).toFixed(1);
      formattedValue = parseFloat(formattedValue);
      if (formattedValue < 1.0) formattedValue = 1.0;
      if (formattedValue > 7.0) formattedValue = 7.0;
      event.target.value = formattedValue;
      setCalificaciones((prevCalificaciones) => {
        const index = parseInt(event.target.getAttribute("data-index"), 10);
        const alumnoCalificaciones = [...(prevCalificaciones[alumno.id] || [])];

        if (index > 0 && !alumnoCalificaciones[index - 1]) {
          return prevCalificaciones;
        }

        if (!alumnoCalificaciones[index]) {
          alumnoCalificaciones[index] = {
            valor: formattedValue,
            isNew: true,
            isModified: false,
          };
        } else {
          alumnoCalificaciones[index] = {
            ...alumnoCalificaciones[index],
            valor: formattedValue,
            isModified: alumnoCalificaciones[index].valor !== formattedValue,
          };
        }

        return {
          ...prevCalificaciones,
          [alumno.id]: alumnoCalificaciones,
        };
      });
    }
  };

  // Cálculo del promedio de notas
  const calcularPromedio = () => {
    const notas =
      calificaciones[alumno.id]?.map((nota) => parseFloat(nota?.valor)) || [];
    const notasValidas = notas.filter((nota) => !isNaN(nota));
    const suma = notasValidas.reduce((acc, curr) => acc + curr, 0);
    return notasValidas.length > 0
      ? (suma / notasValidas.length).toFixed(1)
      : "-";
  };

  return (
    <tr>
      <td>{alumno.rut}</td>
      <td>{nombreAlumno}</td>
      {notasHeaders.map((_, index) => {
        const nota =
          calificaciones[alumno.id] && calificaciones[alumno.id][index]
            ? calificaciones[alumno.id][index].valor
            : "";
        const inputStyle = {
          color: nota && parseFloat(nota) < 4.0 ? "red" : "green",
        };
        return (
          <td key={index}>
            <input
              type="number"
              value={nota || ""}
              step="0.1"
              min="1.0"
              max="7.0"
              data-index={index}
              onChange={(e) => handleNotaChange(index, e.target.value)}
              onBlur={handleBlur}
              placeholder={`Nota ${index + 1}`}
              style={inputStyle}
            />
          </td>
        );
      })}
      <td
        style={{
          verticalAlign: "middle",
          color: calcularPromedio() < 4.0 ? "red" : "green",
        }}
      >
        {calcularPromedio()}
      </td>
    </tr>
  );
}
