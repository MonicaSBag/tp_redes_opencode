(function () {
  "use strict";

  // T-23 - Introduce la historia de NEXUS Corp y el incidente antes de empezar.

  var NARRATIVA = [
    "NEXUS Corp, una empresa con sede central y varias sucursales, amanece con sus servicios caídos: no se accede a archivos, la web no responde y las impresoras de la LAN no completan su trabajo.",
    "Como detective especializado en redes, recibís el expediente del caso. Tu misión: reconstruir la infraestructura, analizar el tráfico y descubrir quién o qué provocó el incidente.",
    "Investigás tres fases con cuatro desafíos cada una. Contás con tres pistas por investigación, cada error resta puntos de tu marcador y, si no podés completar el caso, podés cerrar el expediente y aun así recibir el informe final con tu avance."
  ];

  function mostrar() {
    var contenedor = document.getElementById("texto-intro");
    contenedor.textContent = "";
    for (var i = 0; i < NARRATIVA.length; i++) {
      var parrafo = document.createElement("p");
      parrafo.className = "intro-parrafo";
      parrafo.textContent = NARRATIVA[i];
      contenedor.appendChild(parrafo);
    }
    window.GestorEscenas.irA("intro");
  }

  document.getElementById("boton-intro-comenzar").addEventListener("click", function () {
    window.EscenaJuego.iniciarInvestigacion();
  });

  window.EscenaIntro = {
    mostrar: mostrar
  };
})();