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
    listeners: {},
    classList: {
      _set: {},
      add(n) { this._set[n] = 1; },
      remove(n) { delete this._set[n]; },
      contains(n) { return Boolean(this._set[n]); },
    },
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
assert.strictEqual(Motor.totalDesafios(Motor.obtenerFase("fase1")), 4, "fase1 con 4 desafios");

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

function resolverActivos() {
  const contenedor = elements["contenedor-desafio"];
  const tarjeta = contenedor.children[0];
  const opciones = tarjeta.children[2];
  return opciones.children;
}

const fase1 = Motor.obtenerFase("fase1");
for (let i = 0; i < fase1.desafios.length; i++) {
  const botones = resolverActivos();
  const correcto = fase1.desafios[i].respuestaCorrecta;
  botones[correcto].listeners.click();
  assert.strictEqual(elements["boton-siguiente"].hidden, false, "se habilita siguiente tras responder");
  elements["boton-siguiente"].listeners.click();
}

const progreso = Progreso.cargar();
assert.deepStrictEqual(progreso.fasesCompletadas, ["fase1"], "fase 1 completada");
assert.strictEqual(progreso.puntaje, 400, "4 respuestas correctas sin pistas = 400pts");
assert.strictEqual(progreso.resueltos.length, 4, "4 resueltos");
assert.strictEqual(GestorEscenas.actual(), "informe", "el flujo termina en el informe");

console.log("TODOS LOS TESTS PASARON");