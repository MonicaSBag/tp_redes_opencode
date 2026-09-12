(function () {
  "use strict";

  function configurarBotones() {
    document.getElementById("boton-reiniciar").addEventListener("click", function () {
      window.EscenaJuego.iniciarInvestigacion();
    });
    document.getElementById("boton-menu").addEventListener("click", function () {
      window.GestorEscenas.irA("menu");
      window.Menu.inicializar();
    });
  }

  function iniciar() {
    window.GestorEscenas.registrar("menu", "#pantalla-menu");
    window.GestorEscenas.registrar("juego", "#pantalla-juego");
    window.GestorEscenas.registrar("cierre", "#pantalla-cierre");
    window.GestorEscenas.registrar("informe", "#pantalla-informe");
    configurarBotones();
    window.Menu.inicializar();
    window.GestorEscenas.irA("menu");
  }

  document.addEventListener("DOMContentLoaded", iniciar);
})();