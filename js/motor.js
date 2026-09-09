(function () {
  "use strict";

  var tipos = {};

  function obtenerFase(id) {
    for (var i = 0; i < window.CONTENIDO.fases.length; i++) {
      if (window.CONTENIDO.fases[i].id === id) {
        return window.CONTENIDO.fases[i];
      }
    }
    return null;
  }

  function obtenerDesafio(fase, indice) {
    if (!fase || indice < 0 || indice >= fase.desafios.length) {
      return null;
    }
    return fase.desafios[indice];
  }

  function totalDesafios(fase) {
    return fase.desafios.length;
  }

  function registrarTipo(tipo, dibujador) {
    tipos[tipo] = dibujador;
  }

  function dibujarDesafio(contenedor, fase, desafio, indice, total, config) {
    var tipo = desafio.tipo || "opcion_multiple";
    var dibujador = tipos[tipo] || tipos["opcion_multiple"];
    if (!dibujador) {
      throw new Error("Tipo de desafío desconocido: " + tipo);
    }
    return dibujador(contenedor, fase, desafio, indice, total, config);
  }

  registrarTipo("opcion_multiple", function (contenedor, fase, desafio, indice, total, config) {
    contenedor.textContent = "";

    var tarjeta = document.createElement("article");
    tarjeta.className = "desafio";

    var cabecera = document.createElement("header");
    cabecera.className = "desafio-cabecera";

    var ruta = document.createElement("p");
    ruta.className = "desafio-ruta";
    ruta.textContent = "Fase " + fase.orden + " · Desafío " + (indice + 1) + " de " + total;

    var concepto = document.createElement("span");
    concepto.className = "badge";
    concepto.textContent = desafio.concepto;

    cabecera.appendChild(ruta);
    cabecera.appendChild(concepto);

    var pregunta = document.createElement("h3");
    pregunta.className = "desafio-pregunta";
    pregunta.textContent = desafio.pregunta;

    var opcionesContenedor = document.createElement("div");
    opcionesContenedor.className = "desafio-opciones";
    var botones = [];

    function bloquearOpciones() {
      for (var i = 0; i < botones.length; i++) {
        botones[i].disabled = true;
      }
    }

    function seleccionar(indiceSeleccionado, botonSeleccionado, configLibro) {
      if (configLibro.resuelto) {
        return;
      }
      var correcto = indiceSeleccionado === desafio.respuestaCorrecta;
      retroalimentacion.hidden = false;

      if (correcto) {
        configLibro.resuelto = true;
        botones[desafio.respuestaCorrecta].classList.add("correcta");
        bloquearOpciones();
        retroalimentacion.className = "desafio-retroalimentacion exito";
        retroalimentacion.textContent = "Correcto. " + desafio.explicacion;
        config.alResponderCorrectamente();
      } else {
        botonSeleccionado.classList.add("incorrecta");
        botonSeleccionado.disabled = true;
        retroalimentacion.className = "desafio-retroalimentacion error";
        retroalimentacion.textContent = "Incorrecto. Revisá la pista y volvé a intentarlo.";
        config.alResponderIncorrectamente();
      }
    }

    for (var i = 0; i < desafio.opciones.length; i++) {
      (function (indiceOpcion, texto) {
        var boton = document.createElement("button");
        boton.type = "button";
        boton.className = "desafio-opcion";
        boton.textContent = texto;
        boton.addEventListener("click", function () {
          seleccionar(indiceOpcion, boton, configLibro);
        });
        botones.push(boton);
        opcionesContenedor.appendChild(boton);
      })(i, desafio.opciones[i]);
    }

    var pistaContenedor = document.createElement("div");
    pistaContenedor.className = "desafio-pista";
    pistaContenedor.hidden = true;
    var pistaTexto = document.createElement("p");
    pistaContenedor.appendChild(pistaTexto);

    var botonPista = document.createElement("button");
    botonPista.type = "button";
    botonPista.className = "boton-enlace";
    botonPista.textContent = window.Pistas.utilizada(config.estado, fase.id, desafio.id)
      ? "Volver a leer la pista"
      : "Pedir una pista (−" + window.Puntaje.PENALIZACION_PISTA + " pts)";
    botonPista.addEventListener("click", function () {
      pistaTexto.textContent = window.Pistas.tomar(config.estado, fase.id, desafio);
      pistaContenedor.hidden = false;
      config.alUsarPista();
    });

    var retroalimentacion = document.createElement("div");
    retroalimentacion.className = "desafio-retroalimentacion";
    retroalimentacion.hidden = true;

    var configLibro = { resuelto: false };

    tarjeta.appendChild(cabecera);
    tarjeta.appendChild(pregunta);
    tarjeta.appendChild(opcionesContenedor);
    tarjeta.appendChild(pistaContenedor);
    tarjeta.appendChild(botonPista);
    tarjeta.appendChild(retroalimentacion);
    contenedor.appendChild(tarjeta);
  });

  window.Motor = {
    obtenerFase: obtenerFase,
    obtenerDesafio: obtenerDesafio,
    totalDesafios: totalDesafios,
    registrarTipo: registrarTipo,
    dibujarDesafio: dibujarDesafio
  };
})();