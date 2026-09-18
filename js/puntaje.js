(function () {
  "use strict";

  // Puntaje: premios y penalizaciones de la partida.
  // - Responder correcto suma PUNTOS_BASE.
  // - Usar una pista descuenta PENALIZACION_PISTA al momento (siempre >= 0).
  // - Responder incorrecto descuenta PENALIZACION_INCORRECTA (siempre >= 0).
  var PUNTOS_BASE = 100;
  var PENALIZACION_PISTA = 25;
  var PENALIZACION_INCORRECTA = 50;

  function pisarEnCero(estado) {
    if (estado.puntaje < 0) {
      estado.puntaje = 0;
    }
  }

  function aplicarCorrecta(estado) {
    estado.puntaje += PUNTOS_BASE;
  }

  function aplicarIncorrecta(estado) {
    estado.puntaje -= PENALIZACION_INCORRECTA;
    pisarEnCero(estado);
  }

  function aplicarPista(estado) {
    estado.puntaje -= PENALIZACION_PISTA;
    pisarEnCero(estado);
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
    PENALIZACION_INCORRECTA: PENALIZACION_INCORRECTA,
    aplicarCorrecta: aplicarCorrecta,
    aplicarIncorrecta: aplicarIncorrecta,
    aplicarPista: aplicarPista,
    rangoDeDetectivo: rangoDeDetectivo
  };
})();