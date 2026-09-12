(function () {
  "use strict";

  // Pistas: marcan uso por desafio y penalizan el puntaje (via Puntaje).
  function claveDePista(faseId, desafioId) {
    return faseId + ":" + desafioId;
  }

  function utilizada(estado, faseId, desafioId) {
    return Boolean(estado.pistasUsadas[claveDePista(faseId, desafioId)]);
  }

  function contarUsadas(estado) {
    return Object.keys(estado.pistasUsadas).length;
  }

  function tomar(estado, faseId, desafio) {
    var clave = claveDePista(faseId, desafio.id);
    if (!estado.pistasUsadas[clave]) {
      estado.pistasUsadas[clave] = true;
      window.Progreso.guardar(estado);
    }
    return desafio.pista;
  }

  window.Pistas = {
    utilizada: utilizada,
    contarUsadas: contarUsadas,
    tomar: tomar
  };
})();