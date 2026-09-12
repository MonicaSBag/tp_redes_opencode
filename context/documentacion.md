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
| Escenas | Secciones `.escena`; la activa lleva la clase `.activa` (ver `gestor-escenas.js`). Escenas: `menu`, `intro`, `juego`, `cierre`, `informe`. |
| Extraible por tipos | El motor registra "tipos" de desafio (`Motor.registrarTipo`). Implementados `opcion_multiple`, `evidencias`, `reconstruccion` y `contencion`; se pueden agregar tipos nuevos. |
| Avance entre fases | Al terminar una fase, el cierre ofrece avanzar a la siguiente; solo en la ultima ofrece el informe final. |
| Guardado de clientes extras | Los logros se derivan de las estadisticas guardadas (`js/logros.js`); no se persisten por separado. Errores globales en `js/errores.js`. |
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
  version: 3,
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

### Esquema del tipo `evidencias` (T-14 y T-15)

Variante de `opcion_multiple` que antepone paneles de evidencia en formato lectura (logs, configuraciones, salidas de herramientas, capturas). `tipo: "evidencias"`, con `datos.evidencias`:

```js
{
  id: "f2-05",
  tipo: "evidencias",
  concepto: "DNS",
  pregunta: "...",
  opciones: ["NetBIOS", "DHCP", "DNS", "ARP"],
  respuestaCorrecta: 2,
  pista: "...",
  explicacion: "...",
  datos: {
    evidencias: [
      { titulo: "Salida de nslookup", detalle: "> nslookup archivos.nexus.local\nServidor:  dns.nexus.local (192.168.1.10)\n..." }
    ]
  }
}
```

- DOM del tipo (orden de `tarjeta.children`): `[0]` cabecera, `[1]` pregunta, `[2]` bloque `div.evidencias` (un panel `.evidencia` por cada evidencia, con titulo `.evidencia-titulo` y detalle `pre.evidencia-detalle` en monoespaciado), `[3]` contenedor de opciones (como en `opcion_multiple`).
- `detalle` admite saltos de linea (`\n`); se inyecta con `textContent` (nunca `innerHTML` con datos).
- Anti-trampas: `respuestaCorrecta` nunca va al DOM; se compara en runtime.

### Esquema del tipo `contencion` (T-19)

Escenario de contención: se eligen las medidas correctas de una lista (seleccion múltiple) y se verifica. `tipo: "contencion"`, con `datos`:

```js
{
  id: "f3-09",
  tipo: "contencion",
  concepto: "Contención",
  pregunta: "...",
  pista: "...",
  explicacion: "...",
  datos: {
    medidas: ["Desconectar el equipo comprometido", "Cerrar el puerto 3389", "...", "Apagar el firewall (incorrecta)", "..."],
    correctas: [0, 1, 2]        // indices de las medidas que hay que marcar
  }
}
```

- DOM del tipo (orden de `tarjeta.children`): `[0]` cabecera, `[1]` pregunta, `[2]` lista `div.medidas` (botones `button.medida` con marca `.medida-marca` y texto `.medida-texto`), `[3]` boton `button.boton-verificar`, `[4]` pista, `[5]` boton pista, `[6]` retro.
- Interaccion: tocar una medida la marca (clase `.seleccionada`); se pueden marcar varias; `Verificar` se habilita con al menos una marcada.
- Validacion: la seleccion debe coincidir exactamente con `correctas`. Al acertar, las medidas correctas se marcan `.correcta` y se bloquean; al fallar se puede reintentar.
- Anti-trampas: `correctas` nunca va al DOM; se compara en runtime.

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
- `iniciarFase(idFase)` - arranca (o reanuda desde cero) una fase especifica: setea `estado.faseActual`, `indiceDesafio = 0`, guarda y navega a "juego".
- `continuarInvestigacion()` - reanuda la fase en curso o, si no hay fase activa, la siguiente fase pendiente; si todas estan completas va al informe.
- Al completar la ultima pregunta de una fase, `finalizarFase` marca la fase como completada y navega a la escena `cierre` (`window.EscenaCierre.mostrar(fase, estado)`).

### window.EscenaCierre (T-12)
- `mostrar(fase, estado)` - renderiza la narracion de cierre (`fase.pieza`) y los conceptos unicos de la fase como badges, y navega a la escena `cierre`.
- Decide el boton `boton-cierre-avanzar`: si existe una fase siguiente muestra "Avanzar a la Fase N: <titulo>" y llama `window.EscenaJuego.iniciarFase(siguiente.id)`; en la ultima fase muestra "Ver informe de investigación" y llama `window.EscenaInforme.mostrar(estado)`.
- Los estilos de cierre viven en `css/estilos.css` (`.cierre-narracion`, `.cierre-cabecera`, `.conceptos-wrap`).

### window.EscenaIntro (T-23)
- `mostrar()` - renderiza la narrativa del caso NEXUS en `#texto-intro` y navega a la escena `intro`.
- El boton `boton-intro-comenzar` inicia la investigacion (`window.EscenaJuego.iniciarInvestigacion()`).

### window.Logros (T-27)
- `listar(estado)` -> array de `{ id, nombre, descripcion, desbloqueado }` (7 logros) derivado de las estadisticas del estado (resueltos, pistas, fases completadas, puntaje). No se persisten aparte.

### window.Errores (T-32)
- `activar()` - instala `window.addEventListener("error")` y `("unhandledrejection")`; loguea en consola con prefijo y muestra una barra `#barra-errores` con aviso amigable (role="alert").

### window.EscenaInforme
- `mostrar(estado)` - renderiza metricas y rango, y navega a la escena "informe".

### window.Menu
- `inicializar()` - actualiza estado de botones (Nueva/Continuar), la linea de progreso y dibuja el expediente (`#expediente`): tablero de avance por fase (T-24) y guia de conceptos (T-26).
- `boton-nueva-investigacion` abre la intro (T-23); `boton-continuar` reanuda.

## Ventajas pendientes (roadmap)

- No hay endpoints de API: al no haber backend, esta seccion no aplica. Si en el futuro se agrega servidor, documentar rutas aqui.
- Auditoria WCAG AA con tester real y pulido visual (Hito 7 parcial: enfoque, aria-live y reduced-motion ya aplicados).
- Los tipos de desafio implementados: `opcion_multiple`, `evidencias`, `reconstruccion` y `contencion`. Futuros formatos se sumaran via `Motor.registrarTipo`.