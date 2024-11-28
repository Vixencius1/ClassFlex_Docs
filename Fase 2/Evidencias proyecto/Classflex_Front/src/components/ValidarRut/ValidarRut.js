var ValidarRut = {
  // Valida el RUT con su cadena completa "XXXXXXXX-X" o con puntos "1.111.111-1"
  validaRut: function (rutCompleto) {
    // Eliminar puntos del RUT
    rutCompleto = rutCompleto.replace(/\./g, "");

    // Validar el formato "XXXXXXXX-X"
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) return false;

    var tmp = rutCompleto.split("-");
    var digv = tmp[1];
    var rut = tmp[0];

    // Convertir 'K' a minúscula para uniformidad
    if (digv === "K") digv = "k";

    // Comparar el dígito verificador calculado con el proporcionado
    return String(ValidarRut.dv(rut)) === digv;
  },
  dv: function (T) {
    var M = 0,
      S = 1;
    for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    return S ? S - 1 : "k";
  },
};

export default ValidarRut;