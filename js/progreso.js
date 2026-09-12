(function () {
  "use strict";

  // Progreso: guardado y reanudacion de la partida en localStorage.
  var CLAVE = "detective-redes:progreso";

  function estadoPorDefecto() {
    return {
      faseActual: null,
      indiceDesafio: 0,
      resueltos: [],
      fasesCompletadas: [],
      puntaje: 0,
      pistasUsadas: {}
    };
  }

  function cargar() {
    try {
      var crudo = localStorage.getItem(CLAVE);
      if (!crudo) {
        return estadoPorDefecto();
      }
      return Object.assign(estadoPorDefecto(), JSON.parse(crudo));
    } catch (error) {
      console.warn("No se pudo cargar el progreso:", error);
      return estadoPorDefecto();
    }
  }

  function guardar(estado) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch (error) {
      console.warn("No se pudo guardar el progreso:", error);
    }
  }

  function reiniciar() {
    var estado = estadoPorDefecto();
    guardar(estado);
    return estado;
  }

  window.Progreso = {
    CLAVE: CLAVE,
    cargar: cargar,
    guardar: guardar,
    reiniciar: reiniciar
  };
})();