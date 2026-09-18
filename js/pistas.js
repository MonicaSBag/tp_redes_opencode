(function () {
  "use strict";

  // Pistas: marcan uso por desafio, penalizan el puntaje y tienen un maximo
  // de 3 usos por sesion de investigacion.

  var LIMITE_PISTAS = 3;

  function claveDePista(faseId, desafioId) {
    return faseId + ":" + desafioId;
  }

  function utilizada(estado, faseId, desafioId) {
    return Boolean(estado.pistasUsadas[claveDePista(faseId, desafioId)]);
  }

  function contarUsadas(estado) {
    return Object.keys(estado.pistasUsadas).length;
  }

  function restantes(estado) {
    return Math.max(0, LIMITE_PISTAS - contarUsadas(estado));
  }

  function limiteAlcanzado(estado) {
    return restantes(estado) <= 0;
  }

  function disponibilidad(estado, faseId, desafioId) {
    if (utilizada(estado, faseId, desafioId)) {
      return "releer";
    }
    if (limiteAlcanzado(estado)) {
      return "agotada";
    }
    return "disponible";
  }

  function tomar(estado, faseId, desafio) {
    var clave = claveDePista(faseId, desafio.id);
    if (!estado.pistasUsadas[clave]) {
      if (limiteAlcanzado(estado)) {
        return null;
      }
      estado.pistasUsadas[clave] = true;
      window.Progreso.guardar(estado);
    }
    return desafio.pista;
  }

  window.Pistas = {
    LIMITE_PISTAS: LIMITE_PISTAS,
    utilizada: utilizada,
    contarUsadas: contarUsadas,
    restantes: restantes,
    limiteAlcanzado: limiteAlcanzado,
    disponibilidad: disponibilidad,
    tomar: tomar
  };
})();