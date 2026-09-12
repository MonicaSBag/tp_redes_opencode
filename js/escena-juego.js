(function () {
  "use strict";

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

  function finalizarFase() {
    if (estado.fasesCompletadas.indexOf(faseActual.id) === -1) {
      estado.fasesCompletadas.push(faseActual.id);
    }
    estado.faseActual = null;
    estado.indiceDesafio = 0;
    window.Progreso.guardar(estado);
    window.EscenaCierre.mostrar(faseActual, estado);
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

    window.Motor.dibujarDesafio(elemento("contenedor-desafio"), faseActual, desafio, estado.indiceDesafio, window.Motor.totalDesafios(faseActual), {
      estado: estado,
      alResponderCorrectamente: function () {
        if (estado.resueltos.indexOf(desafio.id) === -1) {
          estado.resueltos.push(desafio.id);
        }
        var sinPista = !window.Pistas.utilizada(estado, faseActual.id, desafio.id);
        estado.puntaje += window.Puntaje.puntosPorDesafio(sinPista);
        window.Progreso.guardar(estado);
        actualizarMarcador();
        botonSiguiente.hidden = false;
      },
      alResponderIncorrectamente: function () {},
      alUsarPista: function () {
        actualizarMarcador();
      }
    });
  }

  function cargarFaseActual() {
    faseActual = window.Motor.obtenerFase(estado.faseActual);
    if (!faseActual) {
      window.EscenaInforme.mostrar(estado);
      return;
    }
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

  function proximaFasePendiente() {
    for (var i = 0; i < window.CONTENIDO.fases.length; i++) {
      var fase = window.CONTENIDO.fases[i];
      if (estado.fasesCompletadas.indexOf(fase.id) === -1) {
        return fase.id;
      }
    }
    return null;
  }

  function continuarInvestigacion() {
    estado = window.Progreso.cargar();
    if (estado.faseActual) {
      window.GestorEscenas.irA("juego");
      cargarFaseActual();
    } else {
      var pendiente = proximaFasePendiente();
      if (pendiente) {
        iniciarFase(pendiente);
      } else {
        window.EscenaInforme.mostrar(estado);
      }
    }
  }

  elemento("boton-siguiente").addEventListener("click", siguienteDesafio);

  window.EscenaJuego = {
    iniciarInvestigacion: iniciarInvestigacion,
    iniciarFase: iniciarFase,
    continuarInvestigacion: continuarInvestigacion
  };
})();