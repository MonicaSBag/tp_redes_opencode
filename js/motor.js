(function () {
  "use strict";

  // Motor de desafios: renderiza y valida por tipo registrado.
  // Comportamiento comun: cada desafio se responde UNA sola vez; si se falla,
  // se descuentan puntos, se revela la respuesta correcta y se continua.

  var tipos = {};

  var ICONOS = {
    Router: "M12 8a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zM3 12h3M18 12h3M6.4 6.4l2 2M15.6 15.6l2 2M17.6 6.4l-2 2M8.4 15.6l-2 2",
    Switch: "M4 8h12l-3-3M16 8l-3 3M20 16H8l3-3M8 16l3 3",
    Gateway: "M12 3 4 8v13h16V8l-8-5zM9 21v-6h6v6",
    Monitor: "M3 4h18v12H3zM9 20h6M12 16v4",
    Hub: "M4 7h4v10H4zM10 7h4v10h-4zM16 7h4v10h-4z"
  };

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

  function crearCabecera(fase, indice, total) {
    var cabecera = document.createElement("header");
    cabecera.className = "desafio-cabecera";

    var ruta = document.createElement("p");
    ruta.className = "desafio-ruta";
    ruta.textContent = "Fase " + fase.orden + " · Desafío " + (indice + 1) + " de " + total;

    cabecera.appendChild(ruta);
    return cabecera;
  }

  function crearPregunta(texto) {
    var pregunta = document.createElement("h3");
    pregunta.className = "desafio-pregunta";
    pregunta.textContent = texto;
    return pregunta;
  }

  function crearIcono(nombre) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("icono");

    var d = ICONOS[nombre] || ICONOS.Monitor;
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1.8");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    return svg;
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

    function refrescarEstadoBoton() {
      var estadoBot = window.Pistas.disponibilidad(config.estado, fase.id, desafio.id);
      if (estadoBot === "releer") {
        boton.textContent = "Volver a leer la pista";
        boton.disabled = false;
      } else if (estadoBot === "agotada") {
        boton.textContent = "Pistas agotadas (máximo " + window.Pistas.LIMITE_PISTAS + " por investigación)";
        boton.disabled = true;
      } else {
        boton.textContent = "Pedir una pista (−" + window.Puntaje.PENALIZACION_PISTA + " pts)";
        boton.disabled = false;
      }
    }
    refrescarEstadoBoton();

    boton.addEventListener("click", function () {
      if (boton.disabled) {
        return;
      }
      var textoPista = window.Pistas.tomar(config.estado, fase.id, desafio);
      if (textoPista === null) {
        return;
      }
      texto.textContent = textoPista;
      contenedor.hidden = false;
      refrescarEstadoBoton();
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

  function revelarOpcionCorrecta(opcionesContenedor, botones, desafio, retroalimentacion, config) {
    retroalimentacion.className = "desafio-retroalimentacion error";
    retroalimentacion.textContent =
      "Incorrecto. La respuesta correcta era: " + desafio.opciones[desafio.respuestaCorrecta] + ". " + desafio.explicacion;
    botones[desafio.respuestaCorrecta].classList.add("correcta");
  }

  function bloquearBotones(lista) {
    for (var i = 0; i < lista.length; i++) {
      lista[i].disabled = true;
    }
  }

  registrarTipo("opcion_multiple", function (contenedor, fase, desafio, indice, total, config) {
    contenedor.textContent = "";

    var tarjeta = document.createElement("article");
    tarjeta.className = "desafio";

    tarjeta.appendChild(crearCabecera(fase, indice, total));
    tarjeta.appendChild(crearPregunta(desafio.pregunta));

    var opcionesContenedor = document.createElement("div");
    opcionesContenedor.className = "desafio-opciones";
    var botones = [];

    function seleccionar(indiceSeleccionado, botonSeleccionado, configLibro) {
      if (configLibro.resuelto) {
        return;
      }
      var correcto = indiceSeleccionado === desafio.respuestaCorrecta;
      configLibro.resuelto = true;
      retroalimentacion.hidden = false;
      bloquearBotones(botones);

      if (correcto) {
        botones[desafio.respuestaCorrecta].classList.add("correcta");
        retroalimentacion.className = "desafio-retroalimentacion exito";
        retroalimentacion.textContent = "Correcto. " + desafio.explicacion;
        config.alResponderCorrectamente();
      } else {
        botonSeleccionado.classList.add("incorrecta");
        revelarOpcionCorrecta(opcionesContenedor, botones, desafio, retroalimentacion, config);
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

    tarjeta.appendChild(crearCabecera(fase, indice, total));
    tarjeta.appendChild(crearPregunta(desafio.pregunta));

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

    function seleccionar(indiceSeleccionado, botonSeleccionado, configLibro) {
      if (configLibro.resuelto) {
        return;
      }
      var correcto = indiceSeleccionado === desafio.respuestaCorrecta;
      configLibro.resuelto = true;
      retroalimentacion.hidden = false;
      bloquearBotones(botones);

      if (correcto) {
        botones[desafio.respuestaCorrecta].classList.add("correcta");
        retroalimentacion.className = "desafio-retroalimentacion exito";
        retroalimentacion.textContent = "Correcto. " + desafio.explicacion;
        config.alResponderCorrectamente();
      } else {
        botonSeleccionado.classList.add("incorrecta");
        revelarOpcionCorrecta(opcionesContenedor, botones, desafio, retroalimentacion, config);
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

    tarjeta.appendChild(bloqueEvidencias);
    tarjeta.appendChild(opcionesContenedor);
    tarjeta.appendChild(pista.contenedor);
    tarjeta.appendChild(pista.boton);
    tarjeta.appendChild(retroalimentacion);
    contenedor.appendChild(tarjeta);
  });

  registrarTipo("contencion", function (contenedor, fase, desafio, indice, total, config) {
    contenedor.textContent = "";

    var datos = desafio.datos;
    var medidas = (datos && datos.medidas) || [];
    var indiceCorrectas = (datos && datos.correctas) || [];

    var tarjeta = document.createElement("article");
    tarjeta.className = "desafio";

    tarjeta.appendChild(crearCabecera(fase, indice, total));
    tarjeta.appendChild(crearPregunta(desafio.pregunta));

    var listaMedidas = document.createElement("div");
    listaMedidas.className = "medidas";
    var toggles = [];

    for (var m = 0; m < medidas.length; m++) {
      (function (indiceMedida, texto) {
        var botonMedida = document.createElement("button");
        botonMedida.type = "button";
        botonMedida.className = "medida";
        var estadoBoton = document.createElement("span");
        estadoBoton.className = "medida-marca";
        estadoBoton.setAttribute("aria-hidden", "true");
        botonMedida.appendChild(estadoBoton);

        var etiqueta = document.createElement("span");
        etiqueta.className = "medida-texto";
        etiqueta.textContent = texto;
        botonMedida.appendChild(etiqueta);

        botonMedida.addEventListener("click", function () {
          if (configLibro.resuelto) {
            return;
          }
          botonMedida.classList.toggle("seleccionada");
          var seleccionadas = 0;
          for (var i = 0; i < toggles.length; i++) {
            if (toggles[i].classList.contains("seleccionada")) {
              seleccionadas += 1;
            }
          }
          verificar.disabled = seleccionadas === 0;
        });

        toggles.push(botonMedida);
        listaMedidas.appendChild(botonMedida);
      })(m, medidas[m]);
    }

    var verificar = document.createElement("button");
    verificar.type = "button";
    verificar.className = "boton boton-verificar";
    verificar.textContent = "Verificar plan de contención";
    verificar.disabled = true;
    verificar.addEventListener("click", function () {
      if (configLibro.resuelto) {
        return;
      }
      var elegidas = [];
      for (var i = 0; i < toggles.length; i++) {
        if (toggles[i].classList.contains("seleccionada")) {
          elegidas.push(i);
        }
      }
      if (elegidas.length === 0) {
        return;
      }

      var acierto = true;
      if (elegidas.length !== indiceCorrectas.length) {
        acierto = false;
      } else {
        for (var j = 0; j < elegidas.length; j++) {
          if (indiceCorrectas.indexOf(elegidas[j]) === -1) {
            acierto = false;
            break;
          }
        }
      }

      retroalimentacion.hidden = false;
      configLibro.resuelto = true;
      bloquearBotones(toggles);
      verificar.disabled = true;

      if (acierto) {
        for (var k = 0; k < toggles.length; k++) {
          if (indiceCorrectas.indexOf(k) !== -1) {
            toggles[k].classList.add("correcta");
          }
        }
        retroalimentacion.className = "desafio-retroalimentacion exito";
        retroalimentacion.textContent = "Correcto. " + desafio.explicacion;
        config.alResponderCorrectamente();
      } else {
        for (var l = 0; l < toggles.length; l++) {
          if (indiceCorrectas.indexOf(l) !== -1) {
            toggles[l].classList.add("correcta");
          } else if (toggles[l].classList.contains("seleccionada")) {
            toggles[l].classList.add("incorrecta");
          }
        }
        var correctasTexto = [];
        for (var q = 0; q < indiceCorrectas.length; q++) {
          correctasTexto.push(medidas[indiceCorrectas[q]]);
        }
        retroalimentacion.className = "desafio-retroalimentacion error";
        retroalimentacion.textContent =
          "Plan incompleto. Las medidas correctas eran: " + correctasTexto.join(" · ") + ".";
        config.alResponderIncorrectamente();
      }
    });

    var pista = crearBloquePista(config, fase, desafio);
    var retroalimentacion = crearRetroalimentacion();
    var configLibro = { resuelto: false };

    tarjeta.appendChild(listaMedidas);
    tarjeta.appendChild(verificar);
    tarjeta.appendChild(pista.contenedor);
    tarjeta.appendChild(pista.boton);
    tarjeta.appendChild(retroalimentacion);
    contenedor.appendChild(tarjeta);
  });

  registrarTipo("reconstruccion", function (contenedor, fase, desafio, indice, total, config) {
    contenedor.textContent = "";

    var datos = desafio.datos;
    var nodos = datos.nodos || [];
    var iconos = datos.iconos || {};

    var tarjeta = document.createElement("article");
    tarjeta.className = "desafio";

    tarjeta.appendChild(crearCabecera(fase, indice, total));
    tarjeta.appendChild(crearPregunta(desafio.pregunta));

    var diagrama = document.createElement("div");
    diagrama.className = "red-diagrama";

    var pisoTitulo = document.createElement("p");
    pisoTitulo.className = "red-piso-titulo";
    pisoTitulo.textContent = "Placas disponibles";
    diagrama.appendChild(pisoTitulo);

    var piso = document.createElement("div");
    piso.className = "red-piso";
    var chips = [];
    var chipPorTexto = {};

    for (var c = 0; c < datos.opciones.length; c++) {
      (function (texto) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "red-chip";
        chip.textContent = texto;
        if (iconos[texto]) {
          chip.appendChild(crearIcono(iconos[texto]));
        }
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
        chipPorTexto[texto] = chip;
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

    function restaurarChip(nodeId) {
      var previo = asignados[nodeId];
      delete asignados[nodeId];
      if (previo && previo.chip) {
        previo.chip.hidden = false;
      }
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
                asignados[nododato.id] = { texto: armado.textContent, chip: armado };
                botonNodo.textContent = armado.textContent;
                botonNodo.classList.add("asignado");
                armado.classList.remove("activo");
                armado.hidden = true;
                armado = null;
              } else {
                restaurarChip(nododato.id);
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

    function grupoDe(nododato) {
      return nododato.grupo || null;
    }

    function verificarGrupos(gruposVistos) {
      var todoOk = true;
      for (var g = 0; g < gruposVistos.length; g++) {
        var miembros = [];
        for (var i = 0; i < paresNodo.length; i++) {
          if (grupoDe(paresNodo[i].nodo) === gruposVistos[g]) {
            miembros.push(paresNodo[i]);
          }
        }
        var esperados = [];
        var recibidos = [];
        for (var j = 0; j < miembros.length; j++) {
          esperados.push(miembros[j].nodo.etiquetaCorrecta);
          recibidos.push(asignados[miembros[j].nodo.id] ? asignados[miembros[j].nodo.id].texto : "");
        }
        esperados.sort();
        recibidos.sort();
        if (esperados.join("|") === recibidos.join("|")) {
          for (var k = 0; k < miembros.length; k++) {
            miembros[k].boton.classList.add("correcta");
          }
        } else {
          for (var l = 0; l < miembros.length; l++) {
            miembros[l].boton.classList.add("incorrecta");
          }
          todoOk = false;
        }
      }
      return todoOk;
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
      var gruposVistos = [];

      for (var i = 0; i < paresNodo.length; i++) {
        var par = paresNodo[i];
        var grupo = grupoDe(par.nodo);
        if (grupo) {
          if (gruposVistos.indexOf(grupo) === -1) {
            gruposVistos.push(grupo);
          }
          continue;
        }
        if (asignados[par.nodo.id] && asignados[par.nodo.id].texto === par.nodo.etiquetaCorrecta) {
          par.boton.classList.add("correcta");
        } else {
          par.boton.classList.add("incorrecta");
          todasCorrectas = false;
        }
      }
      if (!verificarGrupos(gruposVistos)) {
        todasCorrectas = false;
      }

      retroalimentacion.hidden = false;
      if (todasCorrectas) {
        configLibro.resuelto = true;
        bloquearBotones(chips);
        bloquearBotones(nodosBoton);
        verificar.disabled = true;
        retroalimentacion.className = "desafio-retroalimentacion exito";
        retroalimentacion.textContent = "Correcto. " + desafio.explicacion;
        config.alResponderCorrectamente();
      } else {
        configLibro.resuelto = true;
        bloquearBotones(chips);
        bloquearBotones(nodosBoton);
        verificar.disabled = true;
        for (var j = 0; j < paresNodo.length; j++) {
          paresNodo[j].boton.textContent = paresNodo[j].nodo.etiquetaCorrecta;
          paresNodo[j].boton.classList.remove("incorrecta");
          paresNodo[j].boton.classList.add("correcta");
        }
        retroalimentacion.className = "desafio-retroalimentacion error";
        retroalimentacion.textContent =
          "No era así: este es el mapa correcto. " + desafio.explicacion;
        config.alResponderIncorrectamente();
      }
    });
    diagrama.appendChild(verificar);

    var nodosBoton = [];
    for (var nb = 0; nb < paresNodo.length; nb++) {
      nodosBoton.push(paresNodo[nb].boton);
    }

    var pista = crearBloquePista(config, fase, desafio);
    var retroalimentacion = crearRetroalimentacion();

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