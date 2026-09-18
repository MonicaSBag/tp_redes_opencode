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
| Escenas | Secciones `.escena`; la activa lleva la clase `.activa` (ver `gestor-escenas.js`). Escenas: `menu`, `intro`, `juego`, `informe`. |
| Extraible por tipos | El motor registra "tipos" de desafio (`Motor.registrarTipo`). Implementados `opcion_multiple`, `evidencias`, `reconstruccion` y `contencion`; se pueden agregar tipos nuevos. |
| Avance entre fases | Al terminar la ultima pregunta de una fase se avanza directo a la siguiente (sin pantalla de cierre desde 2026-09-14); al terminar la ultima fase se abre el informe final. |
| Respuesta unica | Cada desafio se responde UNA sola vez: al acertar suma puntos y se avanza; al fallar se descuentan puntos, se revela la respuesta correcta y se avanza igual (no se puede re-elegir ni gastar pista para recibir feedback). |
| Guardado de clientes extras | Los logros fueron removidos (mejora Trello procesada el 2026-09-14); el informe ya no los muestra. Errores globales en `js/errores.js`. |
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
  version: 4,
  fases: [
    {
      id: "fase1",
      orden: 1,
      titulo: "La escena del crimen",
      conceptoGeneral: "Reconstrucción de la infraestructura",
      pieza: "(ya no se usa: la pantalla de cierre fue removida)",
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
- Validacion: la seleccion debe coincidir exactamente con `correctas`. Al acertar, las medidas correctas se marcan `.correcta` y se bloquean. Al fallar NO se puede reintentar (respuesta unica desde 2026-09-14): se marcan las correctas y se descuentan puntos.
- Anti-trampas: `correctas` nunca va al DOM; se compara en runtime.

### Esquema del tipo `reconstruccion` (T-10)

Desafio interactivo de diagrama: se arma un "mapa" ubicando placas en nodos por zona y se verifica. `tipo: "reconstruccion"`, con `datos`:

```js
{
  id: "f1-01",
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
    opciones: [                                  // placas arrastrables (con `iconos.<id>` opcional)
      { id: "router", etiqueta: "Router", icono: "router" },
      { id: "pc-contabilidad", etiqueta: "PC Contabilidad", icono: "pc" }
    ],
    nodos: [                                     // lugares vacios a completar
      { id: "nodo-router", zona: "wan", etiquetaCorrecta: "Router", grupo: null },
      { id: "nodo-pc1",   zona: "segmento", etiquetaCorrecta: "PC Contabilidad", grupo: "usuarios" },
      { id: "nodo-pc2",   zona: "segmento", etiquetaCorrecta: "PC Marketing", grupo: "usuarios" }
    ]
  }
}
```

- DOM del tipo: la interaccion esta en `tarjeta.children[2]` (`div.red-diagrama`) con placas `button.red-chip` (con `span.icono` SVG inline via `document.createElementNS` y `span.red-chip-texto`), nodos `button.nodo` (aria-label `Espacio de red <id>`) y boton `button.boton-verificar`.
- Interaccion: tocar una placa la "arma" (clase `.activo`); tocar un nodo la coloca o (sin placa armada) la quita. Al usar una placa, esta se oculta (`hidden = true`) y reaparece si se desasigna. `Verificar` se habilita al completar todos los nodos.
- Grupos (`datos.nodos[].grupo`): los nodos con el mismo `grupo` pueden colocarse en cualquier orden dentro de su segmento; la verificacion compara por conjunto (los dos PCs son intercambiables). Esto resuelve el bug "error al invertir el orden de las respuestas".
- Anti-trampas: `etiquetaCorrecta` jamas se escribe en el DOM; la validacion se hace en runtime comparando la asignacion al verificar. Al fallar se marcan los nodos `.incorrecta`, se revela el mapa correcto y NO se puede reintentar (respuesta unica). Se puede agregar un distractor en `opciones` sin corresponder a ningun nodo (p.ej. `Hub`).

## API publica de modulos

### window.GestorEscenas
- `registrar(id, selector)` - registra una escena por selector CSS.
- `irA(id)` - muestra la escena (clase `.activa`) y oculta el resto.
- `actual()` - id de la escena visible.

### window.Puntaje
- `PUNTOS_BASE` (100), `PENALIZACION_PISTA` (25, se aplica al instante), `PENALIZACION_INCORRECTA` (50, se aplica al fallar).
- `aplicarCorrecta(estado)` -> suma `PUNTOS_BASE`; `aplicarIncorrecta(estado)` -> resta `PENALIZACION_INCORRECTA`; `aplicarPista(estado)` -> resta `PENALIZACION_PISTA`. El puntaje nunca baja de 0 (piso).
- `rangoDeDetectivo(proporcionPuntaje)` -> `{ nombre, nivel }` (5 rangos).

### window.Progreso
- `cargar()` -> estado (con valores por defecto si no existe).
- `guardar(estado)` - serializa a localStorage (con try/catch).
- `reiniciar()` -> estado reseteado y guardado.
- `CLAVE` (constante).

### window.Pistas
- `LIMITE_PISTAS` (3): maximo de pistas por sesion de investigacion (desde 2026-09-14, antes era una por desafio).
- `utilizada(estado, faseId, desafioId)` -> boolean.
- `contarUsadas(estado)` -> numero total de pistas consumidas.
- `restantes(estado)` -> cuentas restantes del limite.
- `limiteAlcanzado(estado)` -> boolean.
- `disponibilidad(estado, faseId, desafioId)` -> `"releer"` (ya usada en este desafio), `"agotada"` (sin cupo) o `"disponible"`.
- `tomar(estado, faseId, desafio)` -> texto de la pista; marca como usada (releer no gasta cupo) y guarda. Devuelve `null` si el limite esta alcanzado.

### window.Motor
- `obtenerFase(id)` -> objeto fase o null.
- `obtenerDesafio(fase, indice)` -> desafio o null.
- `totalDesafios(fase)` -> cantidad de desafios.
- `registrarTipo(tipo, dibujador)` - registra un tipo de desafio nuevo.
- `dibujarDesafio(contenedor, fase, desafio, indice, total, config)` - renderiza; `config` = `{ estado, alResponderCorrectamente, alResponderIncorrectamente, alUsarPista }`.

### window.EscenaJuego
- `iniciarInvestigacion()` - resetea progreso y comienza la fase 1.
- `iniciarFase(idFase)` - arranca (o reanuda desde cero) una fase especifica: setea `estado.faseActual`, `indiceDesafio = 0`, guarda y navega a "juego".
- `abandonarInvestigacion()` - cierra la fase en curso (deja `faseActual` en `null`), guarda todo lo acumulado y navega al informe final (define el fin sin completar todas las preguntas).
- Al completar la ultima pregunta de una fase, `finalizarFase` marca la fase como completada y avanza directo a la siguiente (sin pantalla de cierre). En la ultima fase navega al informe.

### window.EscenaIntro (T-23)
- `mostrar()` - renderiza la narrativa del caso NEXUS en `#texto-intro` y navega a la escena `intro`.
- El boton `boton-intro-comenzar` inicia la investigacion (`window.EscenaJuego.iniciarInvestigacion()`).

### window.Errores (T-32)
- `activar()` - instala `window.addEventListener("error")` y `("unhandledrejection")`; loguea en consola con prefijo y muestra una barra `#barra-errores` con aviso amigable (role="alert").

### window.EscenaInforme
- `mostrar(estado)` - renderiza 5 metricas (fases resueltas, desafios correctos, pistas usadas `N/3`, puntaje, rango con nivel) y el desglose por fase, y navega a la escena "informe". No incluye logros (removidos el 2026-09-14).

### window.Menu
- `inicializar()` - habilita el boton "Nueva investigación" y dibuja el expediente (`#expediente`): tablero de avance por fase (T-24) y guia de conceptos (T-26). No hay boton "Continuar" ni resumen de sesion (removidos el 2026-09-14): cada investigacion arranca de cero o se abandona.

## Ventajas pendientes (roadmap)

- No hay endpoints de API: al no haber backend, esta seccion no aplica. Si en el futuro se agrega servidor, documentar rutas aqui.
- Auditoria WCAG AA con tester real y pulido visual (Hito 7 parcial: enfoque, aria-live y reduced-motion ya aplicados).
- Los tipos de desafio implementados: `opcion_multiple`, `evidencias`, `reconstruccion` y `contencion`. Futuros formatos se sumaran via `Motor.registrarTipo`.