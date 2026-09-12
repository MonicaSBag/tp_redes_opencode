"use strict";
const assert = require("assert");
const path = require("path");

const RAIZ = path.resolve(__dirname, "..");

function makeElement(tag) {
  const almacen = { textContent: "" };
  const el = {
    tagName: tag,
    children: [],
    hidden: false,
    disabled: false,
    className: "",
    type: "button",
    _attrs: {},
    listeners: {},
    classList: {
      _set: {},
      add(n) { this._set[n] = 1; },
      remove(n) { delete this._set[n]; },
      contains(n) { return Boolean(this._set[n]); },
    },
    setAttribute(k, v) { this._attrs[k] = String(v); },
    getAttribute(k) { return this._attrs[k]; },
    appendChild(child) { this.children.push(child); return child; },
    addEventListener(t, fn) { this.listeners[t] = fn; },
  };
  Object.defineProperty(el, "textContent", {
    get() { return almacen.textContent; },
    set(v) {
      almacen.textContent = v;
      if (v === "") this.children.length = 0;
    },
  });
  return el;
}

const elements = {};
const listenersDoc = {};
global.document = {
  getElementById(id) {
    if (!elements[id]) elements[id] = makeElement("div");
    return elements[id];
  },
  createElement(tag) { return makeElement(tag); },
  querySelector(sel) { return this.getElementById(sel.replace(/^#/, "")); },
  querySelectorAll() { return []; },
  addEventListener(type, fn) { listenersDoc[type] = fn; },
};

const store = {};
global.localStorage = {
  getItem(k) { return k in store ? store[k] : null; },
  setItem(k, v) { store[k] = String(v); },
};

global.window = {};

function cargar(ruta) {
  require(path.join(RAIZ, ruta));
}

cargar("data/contenido.js");
cargar("js/gestor-escenas.js");
cargar("js/puntaje.js");
cargar("js/progreso.js");
cargar("js/pistas.js");
cargar("js/motor.js");
cargar("js/escena-juego.js");
cargar("js/escena-cierre.js");
cargar("js/escena-informe.js");
cargar("js/menu.js");
cargar("js/main.js");

listenersDoc["DOMContentLoaded"]();

const J = global;
const CONTENIDO = J.window.CONTENIDO;
const Motor = J.window.Motor;
const Puntaje = J.window.Puntaje;
const Pistas = J.window.Pistas;
const Progreso = J.window.Progreso;
const GestorEscenas = J.window.GestorEscenas;
const Menu = J.window.Menu;
const EscenaJuego = J.window.EscenaJuego;

assert.strictEqual(CONTENIDO.fases.length, 3, "tres fases");
assert.strictEqual(Motor.totalDesafios(Motor.obtenerFase("fase1")), 10, "fase1 con 10 desafios");
assert.strictEqual(Motor.totalDesafios(Motor.obtenerFase("fase2")), 10, "fase2 con 10 desafios");

assert.strictEqual(Puntaje.puntosPorDesafio(true), 100, "sin pista = 100pts");
assert.strictEqual(Puntaje.puntosPorDesafio(false), 75, "con pista = 75pts");
assert.strictEqual(Puntaje.rangoDeDetectivo(1).nombre, "Comisario de Redes", "rango maximo");

let estado = { pistasUsadas: {} };
const primerDesafio = Motor.obtenerDesafio(Motor.obtenerFase("fase1"), 0);
const pista = Pistas.tomar(estado, "fase1", primerDesafio);
assert.ok(pista.length > 0, "pista devuelta");
assert.strictEqual(Pistas.contarUsadas(estado), 1, "se cuenta la pista");
assert.strictEqual(Pistas.utilizada(estado, "fase1", "f1-01"), true, "pista marcada usada");

Menu.inicializar();
assert.strictEqual(elements["boton-continuar"].disabled, true, "sin juego no se puede continuar");

EscenaJuego.iniciarInvestigacion();
assert.strictEqual(Progreso.cargar().faseActual, "fase1", "comienza la fase 1");

function recolectar(clase, desde, acumulador) {
  acumulador = acumulador || [];
  if (!desde) return acumulador;
  if (typeof desde.className === "string" && desde.className.split(/\s+/).indexOf(clase) !== -1) {
    acumulador.push(desde);
  }
  (desde.children || []).forEach((hijo) => recolectar(clase, hijo, acumulador));
  return acumulador;
}

function indiceOpciones(tipo) {
  return tipo === "evidencias" ? 3 : 2;
}

function resolverFase(idFase, totalEsperado) {
  const fase = Motor.obtenerFase(idFase);
  assert.ok(fase, `fase ${idFase} existe`);
  assert.strictEqual(fase.desafios.length, totalEsperado, `${idFase} con ${totalEsperado} desafios`);

  for (let i = 0; i < fase.desafios.length; i++) {
    const desafio = fase.desafios[i];
    const tarjeta = elements["contenedor-desafio"].children[0];

    if (desafio.tipo === "reconstruccion") {
      const diagrama = tarjeta.children[2];
      for (const nododato of desafio.datos.nodos) {
        const chip = recolectar("red-chip", diagrama).find((ch) => ch.textContent === nododato.etiquetaCorrecta);
        const nodoBoton = recolectar("nodo", diagrama).find(
          (nb) => nb.getAttribute("aria-label") === "Espacio de red " + nododato.id
        );
        assert.ok(chip, "chip presente para " + nododato.etiquetaCorrecta);
        assert.ok(nodoBoton, "nodo presente para " + nododato.id);
        chip.listeners.click();
        assert.strictEqual(chip.classList.contains("activo"), true, "chip armado");
        nodoBoton.listeners.click();
        assert.strictEqual(nodoBoton.textContent, nododato.etiquetaCorrecta, "nodo asignado");
        assert.strictEqual(chip.classList.contains("activo"), false, "chip se desarma al asignar");
      }
      const verificarBoton = recolectar("boton-verificar", diagrama)[0];
      assert.strictEqual(verificarBoton.disabled, false, "verificar habilitado al completar");
      verificarBoton.listeners.click();
    } else {
      const botones = tarjeta.children[indiceOpciones(desafio.tipo)].children;
      botones[desafio.respuestaCorrecta].listeners.click();
    }

    assert.strictEqual(elements["boton-siguiente"].hidden, false, "se habilita siguiente tras responder");
    elements["boton-siguiente"].listeners.click();
  }
}

function llegaACierre(idFase, orden) {
  const progreso = Progreso.cargar();
  assert.strictEqual(progreso.fasesCompletadas[progreso.fasesCompletadas.length - 1], idFase, `${idFase} completada`);
  assert.strictEqual(GestorEscenas.actual(), "cierre", "el flujo pasa por el cierre de fase");
  assert.strictEqual(elements["cierre-titulo"].textContent, `Fase ${orden} concluida`, `titulo del cierre ${orden}`);
}

resolverFase("fase1", 10);

let progreso = Progreso.cargar();
assert.strictEqual(progreso.puntaje, 1000, "fase1 completa = 1000pts");
assert.strictEqual(progreso.resueltos.length, 10, "fase1 con 10 resueltos");
llegaACierre("fase1", 1);
assert.match(
  elements["boton-cierre-avanzar"].textContent,
  /^Avanzar a la Fase 2/,
  "tras la fase 1 el boton avanza a la fase 2"
);

elements["boton-cierre-avanzar"].listeners.click();
assert.strictEqual(Progreso.cargar().faseActual, "fase2", "se inicia la fase 2");

resolverFase("fase2", 10);

progreso = Progreso.cargar();
assert.deepStrictEqual(progreso.fasesCompletadas, ["fase1", "fase2"], "fases 1 y 2 completadas");
assert.strictEqual(progreso.puntaje, 2000, "20 respuestas correctas sin pistas = 2000pts");
assert.strictEqual(progreso.resueltos.length, 20, "20 desafios resueltos");
llegaACierre("fase2", 2);
assert.match(
  elements["boton-cierre-avanzar"].textContent,
  /^Avanzar a la Fase 3/,
  "tras la fase 2 el boton avanza a la fase 3"
);

elements["boton-cierre-avanzar"].listeners.click();
assert.strictEqual(Progreso.cargar().faseActual, "fase3", "se inicia la fase 3");

resolverFase("fase3", 1);

progreso = Progreso.cargar();
assert.deepStrictEqual(progreso.fasesCompletadas, ["fase1", "fase2", "fase3"], "las tres fases completadas");
llegaACierre("fase3", 3);
assert.strictEqual(
  elements["boton-cierre-avanzar"].textContent,
  "Ver informe de investigación",
  "al no quedar fase pendiente va al informe"
);

elements["boton-cierre-avanzar"].listeners.click();
assert.strictEqual(GestorEscenas.actual(), "informe", "desde el cierre de la ultima fase se llega al informe");

console.log("TODOS LOS TESTS PASARON");