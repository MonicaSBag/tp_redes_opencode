(function () {
  "use strict";

  function totalDesafiosDelJuego() {
    var total = 0;
    for (var i = 0; i < window.CONTENIDO.fases.length; i++) {
      total += window.CONTENIDO.fases[i].desafios.length;
    }
    return total;
  }

  function totalPuntosPosibles() {
    return totalDesafiosDelJuego() * window.Puntaje.PUNTOS_BASE;
  }

  function mostrar(estado) {
    var contenedor = document.getElementById("contenido-informe");
    contenedor.textContent = "";

    var proporcion = Math.max(0, Math.min(1, estado.puntaje / totalPuntosPosibles()));
    var rango = window.Puntaje.rangoDeDetectivo(proporcion);

    var lista = document.createElement("ul");
    lista.className = "info-grid";

    var filas = [
      { clave: "Casos (fases) resueltos", valor: String(estado.fasesCompletadas.length) + " / " + window.CONTENIDO.fases.length },
      { clave: "Respuestas correctas", valor: String(estado.resueltos.length) + " / " + totalDesafiosDelJuego() },
      { clave: "Pistas utilizadas", valor: String(window.Pistas.contarUsadas(estado)) },
      { clave: "Puntaje obtenido", valor: String(estado.puntaje) + " pts" },
      { clave: "Rango de detective", valor: rango.nombre, claseValor: "valor-rango" }
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

    window.GestorEscenas.irA("informe");
  }

  window.EscenaInforme = {
    mostrar: mostrar
  };
})();