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
  createElementNS(ns, tag) { return makeElement(tag); },
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
cargar("js/escena-intro.js");
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

// Estructura: 3 fases x 4 desafios (mejoras Trello: reducir preguntas por fase).
assert.strictEqual(CONTENIDO.fases.length, 3, "tres fases");
for (const fase of CONTENIDO.fases) {
  assert.strictEqual(Motor.totalDesafios(fase), 4, fase.id + " con 4 desafios");
}

// Puntaje: correcta +100, incorrecta -50, pista -25, piso en cero.
{
  const s = { puntaje: 100 };
  Puntaje.aplicarCorrecta(s);
  assert.strictEqual(s.puntaje, 200, "correcta suma 100");
  Puntaje.aplicarIncorrecta(s);
  assert.strictEqual(s.puntaje, 150, "incorrecta resta 50");
  Puntaje.aplicarPista(s);
  assert.strictEqual(s.puntaje, 125, "pista resta 25 (ya no solo al final)");
  const bajo = { puntaje: 30 };
  Puntaje.aplicarIncorrecta(bajo);
  assert.strictEqual(bajo.puntaje, 0, "el puntaje no baja de cero");
  assert.strictEqual(Puntaje.rangoDeDetectivo(1).nombre, "Comisario de Redes", "rango maximo");
}

// Pistas: maximo 3 por sesion; tomar devuelve null cuando estan agotadas.
{
  const estP = { pistasUsadas: {} };
  const primerDesafio = Motor.obtenerDesafio(Motor.obtenerFase("fase1"), 0);
  const pista = Pistas.tomar(estP, "fase1", primerDesafio);
  assert.ok(pista && pista.length > 0, "pista devuelta");
  assert.strictEqual(Pistas.contarUsadas(estP), 1, "se cuenta la pista");
  assert.strictEqual(Pistas.restantes(estP), 2, "quedan 2 pistas");
  assert.strictEqual(Pistas.disponibilidad(estP, "fase1", "f1-01"), "releer", "pista usada se puede releer");
  const releida = Pistas.tomar(estP, "fase1", primerDesafio);
  assert.ok(releida.length > 0, "se puede releer una pista usada");
  assert.strictEqual(Pistas.contarUsadas(estP), 1, "releer no gasta otra pista");

  const lleno = { pistasUsadas: { a: 1, b: 2, c: 3 } };
  assert.strictEqual(Pistas.restantes(lleno), 0, "sin pistas restantes");
  assert.strictEqual(Pistas.limiteAlcanzado(lleno), true, "limite alcanzado");
  assert.strictEqual(Pistas.disponibilidad(lleno, "fase1", "f1-02"), "agotada", "nueva pista agotada");
  assert.strictEqual(Pistas.tomar(lleno, "fase1", primerDesafio), null, "no se otorgan pistas sin cupo");
}

assert.ok(listenersWindow["error"], "se instala el manejador global de errores");
assert.ok(listenersWindow["unhandledrejection"], "se instala el manejador de promesas rechazadas");

// Menu: expediente con guia de conceptos; sin resumen de sesion ni continuar.
Menu.inicializar();
assert.strictEqual(GestorEscenas.actual(), "menu", "el juego arranca en el menu");
assert.strictEqual(elements["expediente"].children[0].className, "expediente-titulo", "el expediente se dibuja");
assert.strictEqual(recolectar("expediente-fase", elements["expediente"]).length, 3, "el tablero lista las 3 fases");

elements["boton-nueva-investigacion"].listeners.click();
assert.strictEqual(GestorEscenas.actual(), "intro", "nueva investigacion abre la intro narrativa");
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
      assert.strictEqual(chip.hidden, true, "la placa desaparece al usarse (mejora Trello)");
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

function resolverFase(idFase) {
  const fase = Motor.obtenerFase(idFase);
  assert.ok(fase, `fase ${idFase} existe`);
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

// El flujo avanza directo entre fases (sin pantalla de cierre: mejora Trello).
resolverFase("fase1");
assert.strictEqual(Progreso.cargar().faseActual, "fase2", "fase 1 avanza directo a fase 2");
assert.strictEqual(GestorEscenas.actual(), "juego", "sigue en la pantalla de juego");

resolverFase("fase2");
assert.strictEqual(Progreso.cargar().faseActual, "fase3", "fase 2 avanza directo a fase 3");

resolverFase("fase3");
assert.strictEqual(GestorEscenas.actual(), "informe", "al terminar la fase 3 se abre el informe");

const progreso = Progreso.cargar();
assert.deepStrictEqual(progreso.fasesCompletadas, ["fase1", "fase2", "fase3"], "las tres fases completadas");
assert.strictEqual(progreso.resueltos.length, 12, "12 desafios resueltos");
assert.strictEqual(progreso.puntaje, 1200, "12 respuestas correctas sin pistas = 1200pts");

// Informe sin logros (mejora Trello): metricas + desglose por fase.
const contenidoInforme = elements["contenido-informe"];
assert.strictEqual(contenidoInforme.children[0].className, "info-grid", "informe con metricas");
assert.strictEqual(contenidoInforme.children[0].children.length, 5, "cinco metricas en el informe");
assert.strictEqual(contenidoInforme.children[1].className, "fases-resumen", "informe con desglose por fase");
assert.strictEqual(recolectar("fase-resumen", contenidoInforme).length, 3, "tres bloques de fase");
assert.strictEqual(recolectar("logro", contenidoInforme).length, 0, "la seccion de logros se removio");

// Comportamiento de respuesta incorrecta: se descuenta, se bloquea y se revela la correcta.
{
  const cont = makeElement("div");
  const estTest = { resueltos: [], fasesCompletadas: [], faseActual: "fase2", indiceDesafio: 1, puntaje: 500, pistasUsadas: {} };
  let incorrectas = 0;
  const fase2 = Motor.obtenerFase("fase2");
  const d2 = Motor.obtenerDesafio(fase2, 1);
  Motor.dibujarDesafio(cont, fase2, d2, 1, 4, {
    estado: estTest,
    alResponderCorrectamente: function () {},
    alResponderIncorrectamente: function () {
      incorrectas += 1;
      Puntaje.aplicarIncorrecta(estTest);
    },
    alUsarPista: function () {}
  });
  const tarjetaM = cont.children[0];
  const opciones = tarjetaM.children[3].children;
  const indiceMal = (d2.respuestaCorrecta + 1) % d2.opciones.length;
  opciones[indiceMal].listeners.click();
  assert.strictEqual(incorrectas, 1, "se cuenta la respuesta incorrecta");
  assert.strictEqual(estTest.puntaje, 450, "se descuentan los puntos acumulados");
  assert.strictEqual(opciones[indiceMal].classList.contains("incorrecta"), true, "opcion incorrecta marcada");
  assert.strictEqual(opciones[d2.respuestaCorrecta].classList.contains("correcta"), true, "se revela la correcta");
  assert.strictEqual(opciones.every((o) => o.disabled), true, "no se puede volver a elegir (una sola oportunidad)");
  const retro = tarjetaM.children[6];
  assert.match(String(retro.textContent), /La respuesta correcta era/, "el feedback explica la correcta");
}

// Abandonar la investigacion: define que pasa si no se completan las preguntas.
EscenaJuego.iniciarInvestigacion();
assert.strictEqual(Progreso.cargar().faseActual, "fase1", "nueva investigacion en fase 1");
elements["boton-abandonar"].listeners.click();
assert.strictEqual(GestorEscenas.actual(), "informe", "abandonar lleva al informe final");
const parcial = Progreso.cargar();
assert.strictEqual(parcial.faseActual, null, "la fase en curso se cierra al abandonar");
assert.strictEqual(parcial.resueltos.length, 0, "sin desafios resueltos si se abandona al inicio");
assert.strictEqual(parcial.puntaje, 0, "sin puntaje acumulado");

console.log("TODOS LOS TESTS PASARON");