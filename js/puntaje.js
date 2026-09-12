(function () {
  "use strict";

  // Puntaje: puntos por desafio, penalizacion por pista y rangos de detective.
  var PUNTOS_BASE = 100;
  var PENALIZACION_PISTA = 25;
  var PUNTOS_MINIMOS = 10;

  function puntosPorDesafio(usoSinPista) {
    if (usoSinPista) {
      return PUNTOS_BASE;
    }
    return Math.max(PUNTOS_BASE - PENALIZACION_PISTA, PUNTOS_MINIMOS);
  }

  function rangoDeDetectivo(proporcionPuntaje) {
    if (proporcionPuntaje >= 0.9) {
      return { nombre: "Comisario de Redes", nivel: 5 };
    }
    if (proporcionPuntaje >= 0.75) {
      return { nombre: "Detective Experto", nivel: 4 };
    }
    if (proporcionPuntaje >= 0.6) {
      return { nombre: "Detective Senior", nivel: 3 };
    }
    if (proporcionPuntaje >= 0.4) {
      return { nombre: "Detective Junior", nivel: 2 };
    }
    return { nombre: "Inspector Novato", nivel: 1 };
  }

  window.Puntaje = {
    PUNTOS_BASE: PUNTOS_BASE,
    PENALIZACION_PISTA: PENALIZACION_PISTA,
    puntosPorDesafio: puntosPorDesafio,
    rangoDeDetectivo: rangoDeDetectivo
  };
})();