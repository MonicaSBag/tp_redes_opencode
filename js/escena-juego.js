(function () {
  "use strict";

  // Escena de juego: flujo de desafios, puntaje, pistas y avance de fases.
  // Sin cierre por fase: al terminar una fase se avanza directo a la siguiente
  // y el feedback completo se da solo en el informe final.

  var estado = null;
  var faseActual = null;

  function elemento(id) {
    return document.getElementById(id);
  }

  function actualizarTitulo() {
    elemento("titulo-fase").textContent = "Fase " + faseActual.orden + " — " + faseActual.titulo;
  }

  function actualizarAvance() {
    elemento("avance-desafios").textContent =
      "Desafío " + (estado.indiceDesafio + 1) + " de " + window.Motor.totalDesafios(faseActual);
  }

  function actualizarMarcador() {
    elemento("marcador-puntaje").textContent = estado.puntaje;
  }

  function actualizarPistas() {
    elemento("pistas-restantes").textContent = String(window.Pistas.restantes(estado));
  }

  function proximaFasePorOrden(fase) {
    for (var i = 0; i < window.CONTENIDO.fases.length; i++) {
      if (window.CONTENIDO.fases[i].orden === fase.orden + 1) {
        return window.CONTENIDO.fases[i];
      }
    }
    return null;
  }

  function finalizarFase() {
    if (estado.fasesCompletadas.indexOf(faseActual.id) === -1) {
      estado.fasesCompletadas.push(faseActual.id);
    }
    estado.faseActual = null;
    estado.indiceDesafio = 0;
    window.Progreso.guardar(estado);

    var siguiente = proximaFasePorOrden(faseActual);
    if (siguiente) {
      iniciarFase(siguiente.id);
    } else {
      window.EscenaInforme.mostrar(estado);
    }
  }

  function siguienteDesafio() {
    if (estado.indiceDesafio + 1 < window.Motor.totalDesafios(faseActual)) {
      estado.indiceDesafio += 1;
      window.Progreso.guardar(estado);
      dibujarDesafioActual();
    } else {
      finalizarFase();
    }
  }

  function dibujarDesafioActual() {
    var desafio = window.Motor.obtenerDesafio(faseActual, estado.indiceDesafio);
    var botonSiguiente = elemento("boton-siguiente");
    botonSiguiente.hidden = true;

    actualizarTitulo();
    actualizarAvance();
    actualizarMarcador();
    actualizarPistas();

    window.Motor.dibujarDesafio(elemento("contenedor-desafio"), faseActual, desafio, estado.indiceDesafio, window.Motor.totalDesafios(faseActual), {
      estado: estado,
      alResponderCorrectamente: function () {
        if (estado.resueltos.indexOf(desafio.id) === -1) {
          estado.resueltos.push(desafio.id);
        }
        window.Puntaje.aplicarCorrecta(estado);
        window.Progreso.guardar(estado);
        actualizarMarcador();
        botonSiguiente.hidden = false;
      },
      alResponderIncorrectamente: function () {
        window.Puntaje.aplicarIncorrecta(estado);
        window.Progreso.guardar(estado);
        actualizarMarcador();
        botonSiguiente.hidden = false;
      },
      alUsarPista: function () {
        window.Puntaje.aplicarPista(estado);
        window.Progreso.guardar(estado);
        actualizarMarcador();
        actualizarPistas();
      }
    });
  }

  function cargarFaseActual() {
    faseActual = window.Motor.obtenerFase(estado.faseActual);
    dibujarDesafioActual();
  }

  function iniciarFase(idFase) {
    estado.faseActual = idFase;
    estado.indiceDesafio = 0;
    window.Progreso.guardar(estado);
    window.GestorEscenas.irA("juego");
    cargarFaseActual();
  }

  function iniciarInvestigacion() {
    estado = window.Progreso.reiniciar();
    iniciarFase(window.CONTENIDO.fases[0].id);
  }

  function abandonarInvestigacion() {
    if (!estado) {
      return;
    }
    estado.faseActual = null;
    estado.indiceDesafio = 0;
    window.Progreso.guardar(estado);
    window.EscenaInforme.mostrar(estado);
  }

  elemento("boton-siguiente").addEventListener("click", siguienteDesafio);
  elemento("boton-abandonar").addEventListener("click", abandonarInvestigacion);

  window.EscenaJuego = {
    iniciarInvestigacion: iniciarInvestigacion,
    iniciarFase: iniciarFase,
    abandonarInvestigacion: abandonarInvestigacion
  };
})();