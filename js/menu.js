(function () {
  "use strict";

  var botonNueva = document.getElementById("boton-nueva-investigacion");
  var botonContinuar = document.getElementById("boton-continuar");
  var estadoLinea = document.getElementById("estado-progreso");

  function actualizar() {
    var progreso = window.Progreso.cargar();
    var hayInvestigacion = Boolean(progreso.faseActual) || progreso.resueltos.length > 0;
    botonContinuar.disabled = !hayInvestigacion;
    estadoLinea.textContent = hayInvestigacion
      ? "Investigación en curso — puntaje actual: " + progreso.puntaje + " pts."
      : "No hay investigaciones guardadas.";
  }

  botonNueva.addEventListener("click", function () {
    window.EscenaJuego.iniciarInvestigacion();
  });

  botonContinuar.addEventListener("click", function () {
    window.EscenaJuego.continuarInvestigacion();
  });

  window.Menu = {
    inicializar: function () {
      actualizar();
    }
  };
})();