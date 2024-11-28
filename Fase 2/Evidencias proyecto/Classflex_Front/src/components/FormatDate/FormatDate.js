function FormatDate(fecha) {
  try {
    const partes = fecha.split('-');

    if (partes.length !== 3) {
      throw new Error("Formato de fecha incorrecto. Debe ser 'Año-Mes-Día'");
    }

    const año = partes[0].trim();
    const mes = partes[1].trim();
    const día = partes[2].trim();

    // Formatear la nueva fecha
    const nuevaFecha = `${día}/${mes}/${año}`;

    return nuevaFecha;
  } catch (err) {
    return err;
  }
}

export default FormatDate;