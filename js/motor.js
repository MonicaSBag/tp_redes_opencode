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

  function crearCabecera(fase, indice, total, concepto) {
    var cabecera = document.createElement("header");
    cabecera.className = "desafio-cabecera";

    var ruta = document.createElement("p");
    ruta.className = "desafio-ruta";
    ruta.textContent = "Fase " + fase.orden + " · Desafío " + (indice + 1) + " de " + total;

    var badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = concepto;

    cabecera.appendChild(ruta);
    cabecera.appendChild(badge);
    return cabecera;
  }

  function crearPregunta(texto) {
    var pregunta = document.createElement("h3");
    pregunta.className = "desafio-pregunta";
    pregunta.textContent = texto;
    return pregunta;
  }

  function crearBloquePista(config, fase, desafio) {
    var contenedor = document.createElement("div");
    contenedor.className = "desafio-pista";
    contenedor.hidden = true;
    var texto = document.createElement("p");
    contenedor.appendChild(texto);

    var boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton-enlace";
    boton.textContent = window.Pistas.utilizada(config.estado, fase.id, desafio.id)
      ? "Volver a leer la pista"
      : "Pedir una pista (−" + window.Puntaje.PENALIZACION_PISTA + " pts)";
    boton.addEventListener("click", function () {
      texto.textContent = window.Pistas.tomar(config.estado, fase.id, desafio);
      contenedor.hidden = false;
      config.alUsarPista();
    });

    return { contenedor: contenedor, boton: boton };
  }

  function crearRetroalimentacion() {
    var retro = document.createElement("div");
    retro.className = "desafio-retroalimentacion";
    retro.hidden = true;
    return retro;
  }

  registrarTipo("opcion_multiple", function (contenedor, fase, desafio, indice, total, config) {
    contenedor.textContent = "";

    var tarjeta = document.createElement("article");
    tarjeta.className = "desafio";

    var cabecera = crearCabecera(fase, indice, total, desafio.concepto);
    var pregunta = crearPregunta(desafio.pregunta);

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

    var pista = crearBloquePista(config, fase, desafio);
    var retroalimentacion = crearRetroalimentacion();
    var configLibro = { resuelto: false };

    tarjeta.appendChild(cabecera);
    tarjeta.appendChild(pregunta);
    tarjeta.appendChild(opcionesContenedor);
    tarjeta.appendChild(pista.contenedor);
    tarjeta.appendChild(pista.boton);
    tarjeta.appendChild(retroalimentacion);
    contenedor.appendChild(tarjeta);
  });

  registrarTipo("evidencias", function (contenedor, fase, desafio, indice, total, config) {
    contenedor.textContent = "";

    var tarjeta = document.createElement("article");
    tarjeta.className = "desafio";

    var cabecera = crearCabecera(fase, indice, total, desafio.concepto);
    var pregunta = crearPregunta(desafio.pregunta);

    var bloqueEvidencias = document.createElement("div");
    bloqueEvidencias.className = "evidencias";
    var evidencias = desafio.datos && desafio.datos.evidencias ? desafio.datos.evidencias : [];
    for (var e = 0; e < evidencias.length; e++) {
      (function (evidencia) {
        var panel = document.createElement("div");
        panel.className = "evidencia";

        var titulo = document.createElement("p");
        titulo.className = "evidencia-titulo";
        titulo.textContent = evidencia.titulo;

        var detalle = document.createElement("pre");
        detalle.className = "evidencia-detalle";
        detalle.textContent = evidencia.detalle;

        panel.appendChild(titulo);
        panel.appendChild(detalle);
        bloqueEvidencias.appendChild(panel);
      })(evidencias[e]);
    }

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
        retroalimentacion.textContent = "Incorrecto. Revisá la evidencia y volvé a intentarlo.";
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

    var pista = crearBloquePista(config, fase, desafio);
    var retroalimentacion = crearRetroalimentacion();
    var configLibro = { resuelto: false };

    tarjeta.appendChild(cabecera);
    tarjeta.appendChild(pregunta);
    tarjeta.appendChild(bloqueEvidencias);
    tarjeta.appendChild(opcionesContenedor);
    tarjeta.appendChild(pista.contenedor);
    tarjeta.appendChild(pista.boton);
    tarjeta.appendChild(retroalimentacion);
    contenedor.appendChild(tarjeta);
  });

  registrarTipo("reconstruccion", function (contenedor, fase, desafio, indice, total, config) {
    contenedor.textContent = "";

    var datos = desafio.datos;
    var nodos = datos.nodos || [];

    var tarjeta = document.createElement("article");
    tarjeta.className = "desafio";

    var cabecera = crearCabecera(fase, indice, total, desafio.concepto);
    var pregunta = crearPregunta(desafio.pregunta);

    var diagrama = document.createElement("div");
    diagrama.className = "red-diagrama";

    var pisoTitulo = document.createElement("p");
    pisoTitulo.className = "red-piso-titulo";
    pisoTitulo.textContent = "Placas disponibles";
    diagrama.appendChild(pisoTitulo);

    var piso = document.createElement("div");
    piso.className = "red-piso";
    var chips = [];

    for (var c = 0; c < datos.opciones.length; c++) {
      (function (texto) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "red-chip";
        chip.textContent = texto;
        chip.addEventListener("click", function () {
          if (configLibro.resuelto) {
            return;
          }
          if (armado === chip) {
            armado.classList.remove("activo");
            armado = null;
            return;
          }
          if (armado) {
            armado.classList.remove("activo");
          }
          armado = chip;
          armado.classList.add("activo");
        });
        chips.push(chip);
        piso.appendChild(chip);
      })(datos.opciones[c]);
    }
    diagrama.appendChild(piso);

    var armado = null;
    var asignados = {};
    var configLibro = { resuelto: false };

    var zonas = datos.zonas || [];
    var paresNodo = [];

    function actualizarEstadoVerificar() {
      var completado = Object.keys(asignados).length === nodos.length;
      verificar.disabled = !completado;
    }

    for (var z = 0; z < zonas.length; z++) {
      (function (zona) {
        var capaZona = document.createElement("div");
        capaZona.className = "red-zona";

        var tituloZona = document.createElement("p");
        tituloZona.className = "red-zona-titulo";
        tituloZona.textContent = zona.titulo;
        capaZona.appendChild(tituloZona);

        var fila = document.createElement("div");
        fila.className = "red-nodos";

        for (var n = 0; n < nodos.length; n++) {
          if (nodos[n].zona !== zona.id) {
            continue;
          }
          (function (nododato) {
            var botonNodo = document.createElement("button");
            botonNodo.type = "button";
            botonNodo.className = "nodo";
            botonNodo.textContent = "?";
            botonNodo.setAttribute("aria-label", "Espacio de red " + nododato.id);
            botonNodo.addEventListener("click", function () {
              if (configLibro.resuelto) {
                return;
              }
              botonNodo.classList.remove("correcta");
              botonNodo.classList.remove("incorrecta");
              if (armado) {
                asignados[nododato.id] = armado.textContent;
                botonNodo.textContent = armado.textContent;
                botonNodo.classList.add("asignado");
                armado.classList.remove("activo");
                armado = null;
              } else {
                delete asignados[nododato.id];
                botonNodo.textContent = "?";
                botonNodo.classList.remove("asignado");
              }
              actualizarEstadoVerificar();
            });
            paresNodo.push({ nodo: nododato, boton: botonNodo });
            fila.appendChild(botonNodo);
          })(nodos[n]);
        }

        capaZona.appendChild(fila);
        diagrama.appendChild(capaZona);
      })(zonas[z]);
    }

    var verificar = document.createElement("button");
    verificar.type = "button";
    verificar.className = "boton boton-verificar";
    verificar.textContent = "Verificar reconstrucción";
    verificar.disabled = true;
    verificar.addEventListener("click", function () {
      if (configLibro.resuelto) {
        return;
      }
      if (Object.keys(asignados).length !== nodos.length) {
        return;
      }
      var todasCorrectas = true;
      for (var i = 0; i < paresNodo.length; i++) {
        var par = paresNodo[i];
        if (asignados[par.nodo.id] === par.nodo.etiquetaCorrecta) {
          par.boton.classList.add("correcta");
        } else {
          par.boton.classList.add("incorrecta");
          todasCorrectas = false;
        }
      }
      retroalimentacion.hidden = false;
      if (todasCorrectas) {
        configLibro.resuelto = true;
        for (var j = 0; j < chips.length; j++) {
          chips[j].disabled = true;
        }
        verificar.disabled = true;
        retroalimentacion.className = "desafio-retroalimentacion exito";
        retroalimentacion.textContent = "Correcto. " + desafio.explicacion;
        config.alResponderCorrectamente();
      } else {
        retroalimentacion.className = "desafio-retroalimentacion error";
        retroalimentacion.textContent = "Todavía no está listo. Revisá los equipos marcados en rojo.";
        config.alResponderIncorrectamente();
      }
    });
    diagrama.appendChild(verificar);

    var pista = crearBloquePista(config, fase, desafio);
    var retroalimentacion = crearRetroalimentacion();

    tarjeta.appendChild(cabecera);
    tarjeta.appendChild(pregunta);
    tarjeta.appendChild(diagrama);
    tarjeta.appendChild(pista.contenedor);
    tarjeta.appendChild(pista.boton);
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