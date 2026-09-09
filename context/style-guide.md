# Guia de estilo - Detective de Redes

Convenciones de codigo para mantener consistencia en este proyecto.

## JavaScript

- Patron de modulo: IIFE con `"use strict";` que expone `window.NombreModulo`.
- Nombres de modulos y funciones en español, salvo clases/conceptos tecnicos de DOM.
- Identificadores en `camelCase`. Constantes en `MAYUSCULAS_CON_GUION_BAJO`.
- Comillas simples en strings JS.
- Punto y coma siempre al final de cada sentencia.
- Declarar variables con `var` (ES5, consistente con el patron actual). Las funciones de control usan el estilo actual del proyecto.
- Comparaciones estrictas (`===`, `!==`).
- Los eventos de tipo click siempre usan `type="button"` en los botones.
- Referencias cruzadas entre modulos SIEMPRE via `window.Modulo` (nunca `import`/`export` ni nombres sueltos).
- Sin librerias externas. Sin build step.

## CSS

- Variables de tema en `:root` (colores, fuentes, radios, sombras): `--fondo`, `--superficie`, `--acento`, `--texto`, `--fuente-*`, etc.
- Clases descriptivas en `kebab-case` (ej. `desafio-opcion`, `boton-primario`, `panel-acciones`).
- Componentes reutilizables: `.boton`, `.boton-primario`, `.badge`, `.desafio*`, `.info-grid`.
- El patron de escenas usa `.escena` (oculta por defecto) y `.escena.activa` (visible).
- No usar estilos inline salvo casos puntuales.

## HTML

- Atributo `lang="es"`.
- Elementos semanticos (`<main>`, `<section>`, `<header>`, `<button>`).
- Las pantallas son `<section class="escena">` identificadas por `id` (pantalla-menu, pantalla-juego, pantalla-informe).
- Textos visibles siempre en español.

## Contenido (data/contenido.js)

- Un desafio por entrada con: `id` unico (fase-desafio, ej. `f1-01`), `tipo`, `concepto`, `pregunta`, `opciones`, `respuestaCorrecta` (indice), `pista`, `explicacion`.
- La `pregunta` formula un caso o evidencia concreta (no preguntas de memoria puras).
- La `explicacion` se muestra cuando el jugador acierta.

## Buena practica obligatoria

- No exponer `respuestaCorrecta` en DOM, consola ni atributos de dataset: se compara indice en runtime.
- Guardar progreso con `Progreso.guardar` al cruzar cada estado relevante (respuesta, pista, cambio de desafio).