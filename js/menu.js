(function () {
  "use strict";

  // T-23/T-24/T-26 - Menu: acceso a la intro narrativa, tablero de avance y guia de conceptos.

  var botonNueva = document.getElementById("boton-nueva-investigacion");
  var botonContinuar = document.getElementById("boton-continuar");
  var estadoLinea = document.getElementById("estado-progreso");

  function conceptosUnicos(fase) {
    var vistos = [];
    for (var i = 0; i < fase.desafios.length; i++) {
      if (vistos.indexOf(fase.desafios[i].concepto) === -1) {
        vistos.push(fase.desafios[i].concepto);
      }
    }
    return vistos;
  }

  function estadoFase(progreso, fase) {
    if (progreso.fasesCompletadas.indexOf(fase.id) !== -1) {
      return "Resuelta";
    }
    if (progreso.faseActual === fase.id) {
      return "En curso";
    }
    return "Pendiente";
  }

  function dibujarExpediente(progreso) {
    var contenedor = document.getElementById("expediente");
    contenedor.textContent = "";

    var titulo = document.createElement("h2");
    titulo.className = "expediente-titulo";
    titulo.textContent = "Expediente NEXUS Corp — Caso N\u00ba001";
    contenedor.appendChild(titulo);

    for (var i = 0; i < window.CONTENIDO.fases.length; i++) {
      var fase = window.CONTENIDO.fases[i];

      var tarjeta = document.createElement("article");
      tarjeta.className = "expediente-fase";

      var cabecera = document.createElement("p");
      cabecera.className = "expediente-cabecera";

      var nombre = document.createElement("strong");
      nombre.textContent = "Fase " + fase.orden + ": " + fase.titulo;

      var estado = document.createElement("span");
      estado.className = "expediente-estado";
      estado.textContent = estadoFase(progreso, fase);

      cabecera.appendChild(nombre);
      cabecera.appendChild(estado);

      var objetivo = document.createElement("p");
      objetivo.className = "expediente-objetivo";
      objetivo.textContent = "Objetivo: " + fase.conceptoGeneral;

      var guia = document.createElement("p");
      guia.className = "expediente-guia";
      guia.textContent = "Conceptos a dominar:";

      var envoltorio = document.createElement("div");
      envoltorio.className = "conceptos-wrap";
      var conceptos = conceptosUnicos(fase);
      for (var j = 0; j < conceptos.length; j++) {
        var badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = conceptos[j];
        envoltorio.appendChild(badge);
      }

      tarjeta.appendChild(cabecera);
      tarjeta.appendChild(objetivo);
      tarjeta.appendChild(guia);
      tarjeta.appendChild(envoltorio);
      contenedor.appendChild(tarjeta);
    }
  }

  function actualizar() {
    var progreso = window.Progreso.cargar();
    var hayInvestigacion = Boolean(progreso.faseActual) || progreso.resueltos.length > 0;
    botonContinuar.disabled = !hayInvestigacion;
    estadoLinea.textContent = hayInvestigacion
      ? "Investigación en curso — puntaje actual: " + progreso.puntaje + " pts."
      : "No hay investigaciones guardadas.";
    dibujarExpediente(progreso);
  }

  botonNueva.addEventListener("click", function () {
    window.EscenaIntro.mostrar();
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