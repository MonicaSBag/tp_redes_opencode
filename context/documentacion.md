# Documentacion de arquitectura - Detective de Redes

Notas de arquitectura y especificaciones para agentes de IA y editores inteligentes.

## Decisiones de arquitectura

| Decision | Detalle |
|----------|---------|
| Sin backend | Juego 100% cliente. No hay API ni base de datos externa. |
| Scripts clasicos, no modulos ES | Cada `js/*.js` es un IIFE que expone una API en `window` y se carga con `<script>` en orden en `index.html`. Motivo: funciona abriendo `index.html` con doble clic (sin servidor). |
| Referencias cruzadas via `window` | Los modulos usan `window.NombreModulo` para referenciarse. No usar `import`/`export`. |
| Contenido como objeto JS | `data/contenido.js` define `window.CONTENIDO` (objeto, no JSON fetch) para no depender de servidor local. |
| Guardado | `localStorage` con clave `detective-redes:progreso`. |
| Escenas | Secciones `.escena`; la activa lleva la clase `.activa` (ver `gestor-escenas.js`). Escenas: `menu`, `juego`, `cierre`, `informe`. |
| Extraible por tipos | El motor registra "tipos" de desafio (`Motor.registrarTipo`). Implementados `opcion_multiple` y `reconstruccion`; se pueden agregar tipos nuevos. |
| Anti-trampas | Las respuestas no se revelan hasta resolver; no se imprimen en consola. Sin esto se fuerza localStorage, aceptado en alcance. |

## Esquema de localStorage (clave `detective-redes:progreso`)

```json
{
  "faseActual": "fase1",       // null si no hay fase en curso
  "indiceDesafio": 2,          // posicion dentro de la fase
  "resueltos": ["f1-01", "f1-02"],
  "fasesCompletadas": ["fase1"],
  "puntaje": 400,
  "pistasUsadas": { "fase1:f1-01": true }
}
```

- `resueltos`: ids de desafios respondidos correctamente (global).
- `pistasUsadas`: mapa `faseId:desafioId -> true`.
- No hay cuentas de usuario.

## Esquema de contenido (`window.CONTENIDO`)

```js
{
  version: 2,
  fases: [
    {
      id: "fase1",
      orden: 1,
      titulo: "La escena del crimen",
      conceptoGeneral: "Reconstrucción de la infraestructura",
      pieza: "Texto narrativo que se muestra en la pantalla de cierre de la fase.",
      desafios: [
        {
          id: "f1-01",
          tipo: "opcion_multiple",
          concepto: "Hub",
          pregunta: "...",
          opciones: ["...", "...", "...", "..."],
          respuestaCorrecta: 2,      // indice de la opcion correcta
          pista: "...",
          explicacion: "Se muestra tras responder correcto."
        }
      ]
    }
  ]
}
```

### Esquema del tipo `reconstruccion` (T-10)

Desafio interactivo de diagrama: se arma un "mapa" ubicando placas en nodos por zona y se verifica. `tipo: "reconstruccion"`, con `datos`:

```js
{
  id: "f1-08",
  tipo: "reconstruccion",
  concepto: "Topología",
  pregunta: "...",
  pista: "...",
  explicacion: "Se muestra al verificar correctamente.",
  datos: {
    piso: "Mapa troncal de NEXUS Corp",          // titulo del panel de placas
    zonas: [                                     // zonas visuales del mapa
      { id: "wan", titulo: "Hacia el proveedor (WAN)" },
      { id: "nucleo", titulo: "Núcleo central" },
      { id: "segmento", titulo: "Segmento de usuarios (LAN)" }
    ],
    opciones: ["Router", "Switch", "Gateway", "PC Contabilidad", "PC Marketing", "Hub"],
    nodos: [                                     // lugares vacios a completar
      { id: "nodo-router", zona: "wan", etiquetaCorrecta: "Router" },
      { id: "nodo-pc1",   zona: "segmento", etiquetaCorrecta: "PC Contabilidad" }
    ]
  }
}
```

- DOM del tipo: la interaccion este en `tarjeta.children[2]` (`div.red-diagrama`) con placas `button.red-chip`, nodos `button.nodo` (aria-label `Espacio de red <id>`) y boton `button.boton-verificar`.
- Interaccion: tocar una placa la "arma" (clase `.activo`); tocar un nodo la coloca o (sin placa armada) la quita. `Verificar` se habilita al completar todos los nodos.
- Anti-trampas: `etiquetaCorrecta` jamas se escribe en el DOM; la validacion se hace en runtime comparando la asignacion al verificar. Si falla, los nodos se marcan con `.incorrecta` y se puede reintentar. Se puede agregar un distractor en `opciones` sin corresponder a ningun nodo (p.ej. `Hub`).

## API publica de modulos

### window.GestorEscenas
- `registrar(id, selector)` - registra una escena por selector CSS.
- `irA(id)` - muestra la escena (clase `.activa`) y oculta el resto.
- `actual()` - id de la escena visible.

### window.Puntaje
- `PUNTOS_BASE` (100), `PENALIZACION_PISTA` (25).
- `puntosPorDesafio(usoSinPista)` -> 100 o 75 (minimo 10).
- `rangoDeDetectivo(proporcionPuntaje)` -> `{ nombre, nivel }` (5 rangos).

### window.Progreso
- `cargar()` -> estado (con valores por defecto si no existe).
- `guardar(estado)` - serializa a localStorage (con try/catch).
- `reiniciar()` -> estado reseteado y guardado.
- `CLAVE` (constante).

### window.Pistas
- `utilizada(estado, faseId, desafioId)` -> boolean.
- `contarUsadas(estado)` -> numero total de pistas usadas.
- `tomar(estado, faseId, desafio)` -> texto de la pista; marca como usada y guarda.

### window.Motor
- `obtenerFase(id)` -> objeto fase o null.
- `obtenerDesafio(fase, indice)` -> desafio o null.
- `totalDesafios(fase)` -> cantidad de desafios.
- `registrarTipo(tipo, dibujador)` - registra un tipo de desafio nuevo.
- `dibujarDesafio(contenedor, fase, desafio, indice, total, config)` - renderiza; `config` = `{ estado, alResponderCorrectamente, alResponderIncorrectamente, alUsarPista }`.

### window.EscenaJuego
- `iniciarInvestigacion()` - resetea progreso y comienza la fase 1.
- `continuarInvestigacion()` - reanuda o va al informe.
- Al completar la ultima pregunta de una fase, `finalizarFase` marca la fase como completada y navega a la escena `cierre` (`window.EscenaCierre.mostrar(fase, estado)`), no directamente al informe.

### window.EscenaCierre (T-12)
- `mostrar(fase, estado)` - renderiza la narracion de cierre (`fase.pieza`) y los conceptos unicos de la fase como badges, y navega a la escena `cierre`.
- El boton `boton-cierre-informe` reenvia al informe con `window.EscenaInforme.mostrar(estado)`.
- Los estilos de cierre viven en `css/estilos.css` (`.cierre-narracion`, `.cierre-cabecera`, `.conceptos-wrap`).

### window.EscenaInforme
- `mostrar(estado)` - renderiza metricas y rango, y navega a la escena "informe".

### window.Menu
- `inicializar()` - actualiza estado de botones (Nueva/Continuar) y linea de progreso.

## Ventajas pendientes (roadmap)

- No hay endpoints de API: al no haber backend, esta seccion no aplica. Si en el futuro se agrega servidor, documentar rutas aqui.
- El diagrama interactivo (T-10) ya esta implementado como tipo `reconstruccion` (ver esquema arriba). Los seguimientos de Fase 2 y 3 (panel de evidencias, escenarios de contencion) se sumaran como tipos nuevos via `Motor.registrarTipo`.