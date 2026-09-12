(function () {
  "use strict";

  // T-32 - Registro global de errores con un aviso amigable para el jugador.

  var mensajes = [];

  function instalarBarra() {
    var barra = document.createElement("div");
    barra.id = "barra-errores";
    barra.className = "barra-errores";
    barra.setAttribute("role", "alert");
    barra.hidden = true;
    document.body.appendChild(barra);
    return barra;
  }

  function notificar(mensaje) {
    var barra = document.getElementById("barra-errores") || instalarBarra();
    mensajes.length = 0;
    mensajes.push(mensaje);
    barra.textContent = "Ocurrió un error inesperado. Podés continuar con tu investigación; si persiste, avisá al administrador.";
    barra.hidden = false;
  }

  function activar() {
    window.addEventListener("error", function (evento) {
      try {
        console.error("Detective de Redes - error capturado:", evento.message);
      } catch (ignorado) {
        // El logging no debe romper el juego.
      }
      notificar(evento.message);
    });

    window.addEventListener("unhandledrejection", function (evento) {
      try {
        console.error("Detective de Redes - promesa rechazada:", evento.reason);
      } catch (ignorado) {
        // El logging no debe romper el juego.
      }
      notificar("Un proceso de la investigación no terminó como se esperaba.");
    });
  }

  window.Errores = {
    activar: activar
  };
})();