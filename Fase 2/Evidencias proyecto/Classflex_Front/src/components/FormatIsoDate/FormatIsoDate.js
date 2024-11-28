function FormatISODate(fecha_iso) {
  try {
    const datetime = new Date(fecha_iso);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const formatedDateTime = new Intl.DateTimeFormat("es-CL", options).format(
      datetime
    );
    return formatedDateTime;
  } catch (err) {
    return err;
  }
}

export default FormatISODate;
