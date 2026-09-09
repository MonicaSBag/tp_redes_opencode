(function () {
  "use strict";

  var pantallas = {};
  var actual = null;

  function ocultarTodas() {
    var elementos = document.querySelectorAll(".escena");
    for (var i = 0; i < elementos.length; i++) {
      elementos[i].classList.remove("activa");
    }
  }

  window.GestorEscenas = {
    registrar: function (id, selector) {
      var elemento = document.querySelector(selector);
      if (!elemento) {
        throw new Error("Elemento de escena no encontrado: " + selector);
      }
      pantallas[id] = elemento;
    },
    irA: function (id) {
      var pantalla = pantallas[id];
      if (!pantalla) {
        throw new Error("Escena no registrada: " + id);
      }
      ocultarTodas();
      pantalla.classList.add("activa");
      actual = id;
    },
    actual: function () {
      return actual;
    }
  };
})();