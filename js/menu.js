(function () {
  "use strict";

  // Menu: acceso a la intro narrativa y guia de conceptos por fase (expediente).
  // Sin resumen de sesion ni boton continuar: cada investigacion arranca de cero.

  var botonNueva = document.getElementById("boton-nueva-investigacion");

  function conceptosUnicos(fase) {
    var vistos = [];
    for (var i = 0; i < fase.desafios.length; i++) {
      if (vistos.indexOf(fase.desafios[i].concepto) === -1) {
        vistos.push(fase.desafios[i].concepto);
      }
    }
    return vistos;
  }

  function dibujarExpediente() {
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

      cabecera.appendChild(nombre);

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

  botonNueva.addEventListener("click", function () {
    window.EscenaIntro.mostrar();
  });

  window.Menu = {
    inicializar: function () {
      dibujarExpediente();
    }
  };
})();