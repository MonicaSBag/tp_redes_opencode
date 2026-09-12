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
      toggle(n) {
        if (this._set[n]) {
          delete this._set[n];
          return false;
        }
        this._set[n] = 1;
        return true;
      },
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
const listenersWindow = {};
global.document = {
  body: makeElement("body"),
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

global.window = {
  addEventListener(type, fn) { listenersWindow[type] = fn; },
};

function cargar(ruta) {
  require(path.join(RAIZ, ruta));
}

// Orden de carga identico al de <script> en index.html.
cargar("data/contenido.js");
cargar("js/gestor-escenas.js");
cargar("js/puntaje.js");
cargar("js/progreso.js");
cargar("js/pistas.js");
cargar("js/errores.js");
cargar("js/motor.js");
cargar("js/logros.js");
cargar("js/escena-intro.js");
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
const Logros = J.window.Logros;

assert.strictEqual(CONTENIDO.fases.length, 3, "tres fases");
assert.strictEqual(Motor.totalDesafios(Motor.obtenerFase("fase1")), 10, "fase1 con 10 desafios");
assert.strictEqual(Motor.totalDesafios(Motor.obtenerFase("fase2")), 10, "fase2 con 10 desafios");
assert.strictEqual(Motor.totalDesafios(Motor.obtenerFase("fase3")), 10, "fase3 con 10 desafios");

assert.strictEqual(Puntaje.puntosPorDesafio(true), 100, "sin pista = 100pts");
assert.strictEqual(Puntaje.puntosPorDesafio(false), 75, "con pista = 75pts");
assert.strictEqual(Puntaje.rangoDeDetectivo(1).nombre, "Comisario de Redes", "rango maximo");

let estado = { pistasUsadas: {} };
const primerDesafio = Motor.obtenerDesafio(Motor.obtenerFase("fase1"), 0);
const pista = Pistas.tomar(estado, "fase1", primerDesafio);
assert.ok(pista.length > 0, "pista devuelta");
assert.strictEqual(Pistas.contarUsadas(estado), 1, "se cuenta la pista");
assert.strictEqual(Pistas.utilizada(estado, "fase1", "f1-01"), true, "pista marcada usada");

assert.ok(listenersWindow["error"], "se instala el manejador global de errores (T-32)");
assert.ok(listenersWindow["unhandledrejection"], "se instala el manejador de promesas rechazadas");

Menu.inicializar();
assert.strictEqual(GestorEscenas.actual(), "menu", "el juego arranca en el menu");
assert.strictEqual(elements["boton-continuar"].disabled, true, "sin juego no se puede continuar");
assert.strictEqual(elements["expediente"].children[0].className, "expediente-titulo", "el expediente se dibuja (T-24)");
assert.strictEqual(recolectar("expediente-fase", elements["expediente"]).length, 3, "el tablero lista las 3 fases");

elements["boton-nueva-investigacion"].listeners.click();
assert.strictEqual(GestorEscenas.actual(), "intro", "nueva investigacion abre la intro narrativa (T-23)");
assert.strictEqual(elements["texto-intro"].children.length, 3, "la intro tiene la historia de NEXUS");
elements["boton-intro-comenzar"].listeners.click();
assert.strictEqual(Progreso.cargar().faseActual, "fase1", "desde la intro comienza la fase 1");

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
  if (tipo === "evidencias") return 3;
  if (tipo === "contencion") return 2;
  return 2;
}

function resolverDesafio(desafio) {
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
  } else if (desafio.tipo === "contencion") {
    const verificar = tarjeta.children[3];
    assert.strictEqual(verificar.disabled, true, "el plan no se verifica sin medidas marcadas");
    const medidas = tarjeta.children[2].children;
    for (const idx of desafio.datos.correctas) {
      medidas[idx].listeners.click();
      assert.strictEqual(medidas[idx].classList.contains("seleccionada"), true, "medida seleccionada");
    }
    assert.strictEqual(verificar.disabled, false, "el plan se puede verificar con medidas marcadas");
    verificar.listeners.click();
  } else {
    const botones = tarjeta.children[indiceOpciones(desafio.tipo)].children;
    botones[desafio.respuestaCorrecta].listeners.click();
  }

  assert.strictEqual(elements["boton-siguiente"].hidden, false, "se habilita siguiente tras responder");
  elements["boton-siguiente"].listeners.click();
}

function resolverFase(idFase, totalEsperado) {
  const fase = Motor.obtenerFase(idFase);
  assert.ok(fase, `fase ${idFase} existe`);
  assert.strictEqual(fase.desafios.length, totalEsperado, `${idFase} con ${totalEsperado} desafios`);
  for (let i = 0; i < fase.desafios.length; i++) {
    resolverDesafio(fase.desafios[i]);
  }
  const progreso = Progreso.cargar();
  assert.strictEqual(
    progreso.fasesCompletadas[progreso.fasesCompletadas.length - 1],
    idFase,
    `${idFase} completada`
  );
}

resolverFase("fase1", 10);
assert.strictEqual(GestorEscenas.actual(), "cierre", "fase 1 termina en el cierre");
assert.match(elements["boton-cierre-avanzar"].textContent, /^Avanzar a la Fase 2/, "el cierre ofrece avanzar");
elements["boton-cierre-avanzar"].listeners.click();
assert.strictEqual(Progreso.cargar().faseActual, "fase2", "se inicia la fase 2");

resolverFase("fase2", 10);
assert.match(elements["boton-cierre-avanzar"].textContent, /^Avanzar a la Fase 3/, "el cierre ofrece avanzar");
elements["boton-cierre-avanzar"].listeners.click();
assert.strictEqual(Progreso.cargar().faseActual, "fase3", "se inicia la fase 3");

resolverFase("fase3", 10);
assert.strictEqual(elements["boton-cierre-avanzar"].textContent, "Ver informe de investigación", "ultima fase->informe");
elements["boton-cierre-avanzar"].listeners.click();
assert.strictEqual(GestorEscenas.actual(), "informe", "el flujo termina en el informe");

const progreso = Progreso.cargar();
assert.deepStrictEqual(progreso.fasesCompletadas, ["fase1", "fase2", "fase3"], "las tres fases completadas");
assert.strictEqual(progreso.resueltos.length, 30, "30 desafios resueltos");
assert.strictEqual(progreso.puntaje, 3000, "30 respuestas correctas sin pistas = 3000pts");

// Informe (T-20..T-22): metricas, desglose por fase y logros (T-27).
const contenidoInforme = elements["contenido-informe"];
assert.strictEqual(contenidoInforme.children[0].className, "info-grid", "informe con metricas");
assert.strictEqual(contenidoInforme.children[0].children.length, 5, "cinco metricas en el informe");
assert.strictEqual(contenidoInforme.children[1].className, "fases-resumen", "informe con desglose por fase");
assert.strictEqual(recolectar("fase-resumen", contenidoInforme).length, 3, "tres bloques de fase");
const logrosInforme = recolectar("logro", contenidoInforme);
assert.strictEqual(logrosInforme.length, Logros.listar(progreso).length, "los logros se listan en el informe");
assert.ok(
  logrosInforme.every((l) => l.className.split(/\s+/).indexOf("logro-obtenido") !== -1),
  "todos los logros desbloqueados"
);

const logros = Logros.listar(progreso);
assert.strictEqual(
  logros.find((l) => l.id === "caso-cerrado").desbloqueado,
  true,
  "caso cerrado al completar las 3 fases"
);
assert.strictEqual(
  logros.find((l) => l.id === "operacion-limpia").desbloqueado,
  true,
  "operacion limpia sin pistas usadas"
);
assert.strictEqual(
  logros.find((l) => l.id === "comisario-de-redes").desbloqueado,
  true,
  "rango maximo alcanzado"
);
assert.strictEqual(Progreso.cargar().fasesCompletadas.length, CONTENIDO.fases.length, "todas las fases resueltas");

console.log("TODOS LOS TESTS PASARON");