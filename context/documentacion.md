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
| Escenas | Secciones `.escena`; la activa lleva la clase `.activa` (ver `gestor-escenas.js`). |
| Extraible por tipos | El motor registra "tipos" de desafio (`Motor.registrarTipo`). Hoy existe `opcion_multiple`; se pueden agregar tipos nuevos. |
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
  version: 1,
  fases: [
    {
      id: "fase1",
      orden: 1,
      titulo: "La escena del crimen",
      conceptoGeneral: "Reconstrucción de la infraestructura",
      pieza: "Texto narrativo de la fase.",
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

### window.EscenaInforme
- `mostrar(estado)` - renderiza metricas y rango, y navega a la escena "informe".

### window.Menu
- `inicializar()` - actualiza estado de botones (Nueva/Continuar) y linea de progreso.

## Ventajas pendientes (roadmap)

- No hay endpoints de API: al no haber backend, esta seccion no aplica. Si en el futuro se agrega servidor, documentar rutas aqui.
- El diagrama interactivo (T-10) se anade como nuevo "tipo" de desafio registrado via `Motor.registrarTipo`.