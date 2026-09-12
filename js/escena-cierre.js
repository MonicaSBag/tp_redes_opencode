(function () {
  "use strict";

  // Cierre de fase: narracion + conceptos; avanza a la siguiente fase o al informe.
  var datosCierre = null;

  function proximaFase(fase) {
    for (var i = 0; i < window.CONTENIDO.fases.length; i++) {
      if (window.CONTENIDO.fases[i].orden === fase.orden + 1) {
        return window.CONTENIDO.fases[i];
      }
    }
    return null;
  }

  function conceptosUnicos(fase) {
    var vistos = [];
    for (var i = 0; i < fase.desafios.length; i++) {
      if (vistos.indexOf(fase.desafios[i].concepto) === -1) {
        vistos.push(fase.desafios[i].concepto);
      }
    }
    return vistos;
  }

  function mostrar(fase, estado) {
    var contenedor = document.getElementById("contenido-cierre");
    contenedor.textContent = "";

    document.getElementById("cierre-titulo").textContent = "Fase " + fase.orden + " concluida";

    var marco = document.createElement("article");
    marco.className = "desafio";

    var narracion = document.createElement("p");
    narracion.className = "cierre-narracion";
    narracion.textContent = fase.pieza;

    var encabezadoConceptos = document.createElement("p");
    encabezadoConceptos.className = "cierre-cabecera";
    encabezadoConceptos.textContent = "Conceptos dominados en esta investigación:";

    var envoltorio = document.createElement("div");
    envoltorio.className = "conceptos-wrap";
    var conceptos = conceptosUnicos(fase);
    for (var i = 0; i < conceptos.length; i++) {
      var badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = conceptos[i];
      envoltorio.appendChild(badge);
    }

    marco.appendChild(narracion);
    marco.appendChild(encabezadoConceptos);
    marco.appendChild(envoltorio);
    contenedor.appendChild(marco);

    var siguiente = proximaFase(fase);
    datosCierre = {
      fase: fase,
      estado: estado,
      siguiente: siguiente
    };

    var boton = document.getElementById("boton-cierre-avanzar");
    if (siguiente) {
      boton.textContent = "Avanzar a la Fase " + siguiente.orden + ": " + siguiente.titulo;
      boton.classList.add("boton-primario");
    } else {
      boton.textContent = "Ver informe de investigación";
      boton.classList.remove("boton-primario");
    }
    boton.hidden = false;

    window.GestorEscenas.irA("cierre");
  }

  document.getElementById("boton-cierre-avanzar").addEventListener("click", function () {
    if (!datosCierre) {
      return;
    }
    if (datosCierre.siguiente) {
      window.EscenaJuego.iniciarFase(datosCierre.siguiente.id);
    } else {
      window.EscenaInforme.mostrar(datosCierre.estado);
    }
  });

  window.EscenaCierre = {
    mostrar: mostrar
  };
})();