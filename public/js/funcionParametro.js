function obtenerParametro(nombre) {
    nombre = nombre.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + nombre + "=([^&#]*)");
    var resultados = regex.exec(location.search);
    return resultados === null ? "" : decodeURIComponent(resultados[1].replace(/\+/g, " "));
};