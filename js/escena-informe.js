(function () {
  "use strict";

  // T-20..T-22 - Informe final: metricas, rango y desglose por fase.

  function totalDesafiosFase(fase) {
    return window.Motor.totalDesafios(fase);
  }

  function totalDesafiosDelJuego() {
    var total = 0;
    for (var i = 0; i < window.CONTENIDO.fases.length; i++) {
      total += totalDesafiosFase(window.CONTENIDO.fases[i]);
    }
    return total;
  }

  function totalPuntosPosibles() {
    return totalDesafiosDelJuego() * window.Puntaje.PUNTOS_BASE;
  }

  function resueltosEnFase(estado, fase) {
    var cantidad = 0;
    for (var i = 0; i < fase.desafios.length; i++) {
      if (estado.resueltos.indexOf(fase.desafios[i].id) !== -1) {
        cantidad += 1;
      }
    }
    return cantidad;
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

  function estadoDeFase(estado, fase) {
    if (estado.fasesCompletadas.indexOf(fase.id) !== -1) {
      return "Resuelta";
    }
    if (estado.faseActual === fase.id) {
      return "En curso";
    }
    return "Pendiente";
  }

  function bloquesDeFases(estado) {
    var envoltorio = document.createElement("div");
    envoltorio.className = "fases-resumen";

    var titulo = document.createElement("h3");
    titulo.className = "informe-seccion";
    titulo.textContent = "Fases de la investigación";
    envoltorio.appendChild(titulo);

    for (var i = 0; i < window.CONTENIDO.fases.length; i++) {
      var fase = window.CONTENIDO.fases[i];

      var bloque = document.createElement("article");
      bloque.className = "fase-resumen";

      var cabecera = document.createElement("p");
      cabecera.className = "fase-resumen-cabecera";

      var nombre = document.createElement("strong");
      nombre.textContent = "Fase " + fase.orden + ": " + fase.titulo;

      var estadoBloque = document.createElement("span");
      estadoBloque.className = "fase-resumen-estado";
      estadoBloque.textContent = estadoDeFase(estado, fase);

      cabecera.appendChild(nombre);
      cabecera.appendChild(estadoBloque);

      var avance = document.createElement("p");
      avance.className = "fase-resumen-avance";
      avance.textContent =
        "Desafíos resueltos: " + resueltosEnFase(estado, fase) + " / " + totalDesafiosFase(fase);

      var envoltorioConceptos = document.createElement("div");
      envoltorioConceptos.className = "conceptos-wrap";
      var conceptos = conceptosUnicos(fase);
      for (var j = 0; j < conceptos.length; j++) {
        var badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = conceptos[j];
        envoltorioConceptos.appendChild(badge);
      }

      bloque.appendChild(cabecera);
      bloque.appendChild(avance);
      bloque.appendChild(envoltorioConceptos);
      envoltorio.appendChild(bloque);
    }

    return envoltorio;
  }

  function bloqueDeLogros(estado) {
    var envoltorio = document.createElement("div");
    envoltorio.className = "logros";

    var titulo = document.createElement("h3");
    titulo.className = "informe-seccion";
    titulo.textContent = "Logros";
    envoltorio.appendChild(titulo);

    var lista = document.createElement("ul");
    lista.className = "logros-lista";
    var logros = window.Logros.listar(estado);
    for (var i = 0; i < logros.length; i++) {
      var item = document.createElement("li");
      item.className = "logro" + (logros[i].desbloqueado ? " logro-obtenido" : "");

      var contenido = document.createElement("span");
      contenido.className = "logro-detalle";

      var nombre = document.createElement("strong");
      nombre.textContent = logros[i].nombre;
      contenido.appendChild(nombre);

      var descripcion = document.createElement("small");
      descripcion.textContent = " — " + logros[i].descripcion;
      contenido.appendChild(descripcion);

      var marca = document.createElement("span");
      marca.className = "logro-marca";
      marca.setAttribute("aria-hidden", "true");
      marca.textContent = logros[i].desbloqueado ? "✓" : "·";

      item.appendChild(contenido);
      item.appendChild(marca);
      lista.appendChild(item);
    }

    envoltorio.appendChild(lista);
    return envoltorio;
  }

  function mostrar(estado) {
    var contenedor = document.getElementById("contenido-informe");
    contenedor.textContent = "";

    var proporcion = Math.max(0, Math.min(1, estado.puntaje / totalPuntosPosibles()));
    var rango = window.Puntaje.rangoDeDetectivo(proporcion);

    var lista = document.createElement("ul");
    lista.className = "info-grid";

    var filas = [
      { clave: "Fases resueltas", valor: String(estado.fasesCompletadas.length) + " / " + window.CONTENIDO.fases.length },
      { clave: "Respuestas correctas", valor: String(estado.resueltos.length) + " / " + totalDesafiosDelJuego() },
      { clave: "Pistas utilizadas", valor: String(window.Pistas.contarUsadas(estado)) },
      { clave: "Puntaje obtenido", valor: String(estado.puntaje) + " pts" },
      { clave: "Rango de detective", valor: rango.nombre + " (nivel " + rango.nivel + ")", claseValor: "valor-rango" }
    ];

    for (var i = 0; i < filas.length; i++) {
      var fila = filas[i];
      var item = document.createElement("li");

      var clave = document.createElement("span");
      clave.className = "clave";
      clave.textContent = fila.clave;

      var valor = document.createElement("span");
      valor.className = "valor" + (fila.claseValor ? " " + fila.claseValor : "");
      valor.textContent = fila.valor;

      item.appendChild(clave);
      item.appendChild(valor);
      lista.appendChild(item);
    }

    contenedor.appendChild(lista);
    contenedor.appendChild(bloquesDeFases(estado));
    contenedor.appendChild(bloqueDeLogros(estado));

    window.GestorEscenas.irA("informe");
  }

  window.EscenaInforme = {
    mostrar: mostrar
  };
})();