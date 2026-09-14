# Detective de Redes - CONTEXT

Resumen del proyecto para agentes de IA y editores inteligentes.

## Proposito

Juego educativo 100% en el navegador sobre redes informaticas. El jugador es un detective que investiga un incidente en la empresa ficticia NEXUS Corp. Debe superar tres fases de dificultad creciente (reconstruir la red, analizar el trafico, contener el ataque) y al final recibe un informe con su puntaje y rango. No usa servidor: todo se guarda en `localStorage`.

## Stack tecnologico

- HTML5, CSS3 y JavaScript plano (sin frameworks, sin backend, sin build step).
- Los modulos JS son scripts clasicos que se exponen en `window` y se cargan con `<script>` en orden.
- Guardado de progreso con `localStorage`.
- Contenido de fases en `data/contenido.js` (estructura tipo JSON expuesta en `window.CONTENIDO`).

## Estructura de carpetas

```
openCode/
├── CONTEXT.md                 # Este archivo: proposito, stack, comandos
├── README.md                  # Instrucciones de instalacion y uso
├── requirements.txt           # Dependencias de Python (solo documentacion)
├── .gitignore                 # Excluye .env/, caches, claves
├── index.html                 # Punto de entrada (5 pantallas: menu, intro, juego, cierre, informe)
├── css/
│   └── estilos.css            # Tema "detective" con variables CSS
├── js/
│   ├── contenido.js        # (data/) Contenido de fases y desafios
│   ├── gestor-escenas.js      # window.GestorEscenas - mostrar/ocultar pantallas
│   ├── puntaje.js             # window.Puntaje - puntos, penalizacion, rango
│   ├── progreso.js            # window.Progreso - localStorage
│   ├── pistas.js              # window.Pistas - pistas y penalizacion
│   ├── errores.js             # window.Errores - logging global de errores
│   ├── motor.js               # window.Motor - renderizar y validar desafios
│   ├── logros.js              # window.Logros - logros derivados del estado
│   ├── escena-intro.js        # window.EscenaIntro - intro narrativa del caso
│   ├── escena-juego.js        # window.EscenaJuego - flujo de juego
│   ├── escena-cierre.js       # window.EscenaCierre - cierre narrativo de fase
│   ├── escena-informe.js      # window.EscenaInforme - informe final
│   ├── menu.js                # window.Menu - menu, expediente y tablero
│   └── main.js                # Arranque: registra escenas y botones
├── data/
│   └── contenido.js           # window.CONTENIDO (fases, desafios)
├── tests/
│   └── test-flujo.js          # Test de integracion con stubs de DOM (Node)
├── Documentacion/
│   ├── Detective de Redes.docx        # Diseno original (no editar)
│   ├── Requisitos - Detective de Redes.md
│   └── Plan de desarrollo - Detective de Redes.md
└── context/                   # Documentacion para agentes de IA
    ├── project_milestones.md  # Estado de tareas por hito
    ├── documentacion.md       # Esquemas, API de modulos, decisiones
    └── style-guide.md         # Convenciones de codigo
```

## Comandos clave

```bash
# No hay build. Se abre directamente:
#   Doble clic en index.html

# Servidor local (recomendado para desarrollo):
python -m http.server 8000
# luego navegar a http://localhost:8000

# Chequear sintaxis de todos los JS (requiere Node):
for f in data/contenido.js js/*.js; do node --check "$f"; done

# Test de integracion del flujo de juego (requiere Node):
node tests/test-flujo.js

# Instalar dependencias de Python (solo para leer/editar .docx):
pip install -r requirements.txt
```

## Reglas importantes

- Los modulos se referencian entre si con `window.NombreModulo`. No cambiar a import/export (rompe el patron de scripts clasicos).
- No exponer respuestas de desafios en el DOM ni consola (anti-trampas).
- Todo el texto visible del juego va en espanol.
- Cuando un companero escriba **"Realizar el cierre de sesion"**, el agente DEBE anotar el resumen de la sesion en la "Bitacora de sesiones" de este archivo: buscar el nombre de usuario y la fecha (pedirlos al companero si no los tiene claros), y agregar una entrada nueva al FINAL resumiendo lo trabajado (tareas, archivos tocados, decisiones tomadas y proximos pasos). Jamas borrar ni modificar entradas anteriores.
- Cuando un companero escriba **"Procesar tarjetas de Trello"**, el agente DEBE ejecutar el flujo completo de extraccion y movimiento de tarjetas del tablero "Detective de Redes" usando la conexion de Trello de One. Pasos obligatorios en orden:
  1. **Conexion**: ejecutar `one --agent connection list` y usar la conexion de Trello (clave `live::trello::default::...`, confirmar acceso "full"). Si no existe, decirle al companero que corra `one add trello`.
  2. **Acciones**: buscar cada accion con `one --agent actions search trello "<query>" -t execute` y leer SIEMPRE su documentacion con `one --agent actions knowledge trello <actionId>` antes de ejecutar. Acciones necesarias: listar listas de un board (`boards/{id}/lists`), listar cards de una lista (`lists/{id}/cards`), Get a Card by ID (`/1/cards/{id}` con `actions=commentCard,createCard` y `checklists=all`), List a Card's Attachments (`/1/cards/{id}/attachments`), y Update a Card (`PUT /1/cards/{id}` moviendo por `idList`).
  3. **Board y listas**: tablero "Detective de Redes" = board `6aa6d12abc2134a06e61ecd3`. Listar las listas y confirmar por ID: origen "Tareas🤔" = `6aa6d12abc2134a06e61eccf`, destino "DOING ⚙️" = `6aa6d12abc2134a06e61ecd1` (la API devuelve el nombre con un espacio entre "DOING" y el emoji; respetar el nombre tal cual lo devuelve la API, no el de la UI).
  4. **Por cada tarjeta en "Tareas🤔"** (en orden): extraer titulo, descripcion completa (incluidos los `![image.webp](...)` embebidos), comentarios (filtro `actions=commentCard`), checklists, labels, fecha de creacion (accion `createCard`), due date y TODOS los attachments (nombre + URL, especialmente PNG/JPG/JPEG/GIF/WEBP que son evidencia de bugs). Clasificar en: "Mejora propuesta", "Ajuste de bug", "Ajuste de reglas" o "Sin clasificar" (con breve motivo). Agregar la entrada al documento (titulo, resumen de 2-3 lineas, link directo `https://trello.com/c/<shortLink>`, imagenes como `![nombre](URL)` y adjuntos no-imagen como links). Registrar SIEMPRE el estado de extraccion de cada tarjeta.
  5. **Mover SOLO despues de escribir la entrada**: actualizar el `idList` de la tarjeta al de "DOING ⚙️" con Update a Card y segun la respuesta de la API construir la lista de "movida con exito" vs "fallida". Si falla extraer info de una tarjeta, NO moverla y anotarla como pendiente de revision manual. Si el documento con la fecha de hoy ya existe (ej. `Documentacion/mejoras-2026-09-14.md`), NO sobrescribirlo: agregar las tarjetas nuevas al mismo documento cuando sea posible o avisar al companero antes de crear uno nuevo con sufijo.
  6. **Documento**: guardarlo en `Documentacion/mejoras-YYYY-MM-DD.md` con las secciones `## Mejoras propuestas`, `## Ajuste de bugs`, `## Ajuste de reglas`, `## Sin clasificar` y al final `## Resumen de movimiento` (cuantas se movieron, cuales y el motivo del error si alguna fallo). Incluir la advertencia de que las URLs de attachments de Trello pueden requerir autenticacion (key+token) y que si las imagenes no renderizan se dejan como referencia igual.
  7. **Verificacion**: al terminar, listar las cards de "Tareas🤔" y confirmar que quedo vacia. Al final resumir al companero cuantas tarjetas se procesaron, cuantas se movieron y cuales quedaron pendientes de revision manual.

## Bitacora de sesiones

Registro cronologico de los puntos importantes de cada sesion de trabajo. Regla: siempre AGREGAR una entrada nueva al final con el nombre de usuario y la fecha; NUNCA borrar ni modificar entradas anteriores. Asi, cuando un companero trabaje en su maquina local, puede darle este archivo a su agente para retomar con el contexto completo y sin alucinar. La entrada nueva se escribe cuando un companero pide **"Realizar el cierre de sesion"**.

### 2026-09-09 - Usuario: monic

- Se definio el stack: web puro (HTML/CSS/JS plano, sin backend, sin frameworks, sin build). Guardado en `localStorage`. Sin cuentas de usuario. Decisiones registradas en `context/documentacion.md`.
- Se generaron: `Documentacion/Requisitos - Detective de Redes.md` y `Documentacion/Plan de desarrollo - Detective de Redes.md` (33 tareas T-01..T-33 en 8 hitos).
- Se crearon los archivos de contexto: `CONTEXT.md` (este archivo), `context/project_milestones.md`, `context/documentacion.md`, `context/style-guide.md`.
- Implementados los HITOS 0 y 1 (T-01 a T-08): estructura de carpetas, `index.html` (3 pantallas: menu, juego, informe), `css/estilos.css`, `js/gestor-escenas.js`, `js/puntaje.js`, `js/progreso.js`, `js/pistas.js`, `js/motor.js`, `js/escena-juego.js`, `js/escena-informe.js`, `js/menu.js`, `js/main.js`, y `data/contenido.js` con 6 desafios demo (4 de Fase 1).
- Convencion IMPORTANTE: los modulos se exponen en `window` y se referencian entre si SIEMPRE con `window.NombreModulo` (jamas import/export). `data/contenido.js` expone `window.CONTENIDO`.
- El flujo completo del juego funciona (responder, puntaje, pistas, informe) y se valida con el test de integracion en Node:
  `node tests/test-flujo.js` (usa stubs de DOM; no tocar codigo del juego para que pase).
- Estado de avance: 0 de 3 fases con contenido completo. Siguiente paso acordado: Hito 2 (contenido completo de Fase 1 + diagrama interactivo de reconstruccion de la red, T-09 a T-12).

### 2026-09-09 - Usuario: monic - Cierre de sesion (continuacion)

- Preparacion para GitHub: se creo `README.md` (instrucciones de clonado, entorno virtual, instalacion del agente OpenCode configurando API key con `/connect` o `opencode auth login`, y formas de ejecutar el agente), `requirements.txt` (python-docx, lxml, typing_extensions) y `.gitignore` (excluye `.env/`, caches de Python, claves, archivos de editor/SO).
- Se implemento el protocolo de cierre de sesion en la Bitacora de sesiones (ver Reglas importantes): cuando un companero escribe **"Realizar el cierre de sesion"**, el agente agrega una entrada nueva al final con usuario y fecha.
- Estado general: flujo completo jugable y verificado con el test de integracion. Todas las tareas T-01 a T-08 marcadas como completadas en `context/project_milestones.md`.
- Proximos pasos (en orden): Hito 2 (contenido completo de Fase 1, T-09 a T-12) y luego Hitos 3 a 7. Sin cambios de stack pendientes.

### 2026-09-09 - Usuario: monic - Cierre de sesion (continuacion, revision de seguridad)

- Se reviso la exposicion de datos sensibles en todo el proyecto (patrones de API keys, tokens, passwords, claves privadas, JWTs): resultado sin coincidencias. Verificacion adicional con `git ls-files` y `git check-ignore`: `.env/` (venv de Python) queda excluido del repo.
- Se detecto que `CONTEXT.md` y el test exponian la ruta local (usuario de Windows y rutas de maquina). Solucion aplicada: se movio el test al repo en `tests/test-flujo.js` con ruta relativa (`RAIZ = path.resolve(__dirname, "..")`) y se actualizo `CONTEXT.md` (comando `node tests/test-flujo.js` y arbol de estructura con `tests/`).
- Establecido como practica: en los archivos versionados NO deben aparecer rutas locales absolutas ni nombres de usuario de la maquina.
- El test de integracion sigue pasando desde la nueva ubicacion: `node tests/test-flujo.js`.
- Estado general: mismo que el cierre anterior (flujo completo jugable, T-01 a T-08 completadas, 0 de 3 fases con contenido completo). Proximos pasos sin cambio: Hito 2 (T-09 a T-12) y luego Hitos 3 a 7.

### 2026-09-09 - Usuario: monic - Cierre de sesion (continuacion, Hito 2)

- Se completo el **Hito 2** (T-09 a T-12): contenido completo de la Fase 1 en `data/contenido.js` (f1-01..f1-10) incluyendo el desafio interactivo de reconstruccion de la red (f1-08, tipo `reconstruccion`), implementado en `js/motor.js` con `Motor.registrarTipo` (areas `.red-chip` + nodos `.nodo` con `aria-label="Espacio de red <id>"`, boton verificar, retro inmediata).
- Se creo `js/escena-cierre.js` (window.EscenaCierre) con la narracion de cierre (`fase.pieza`), badge de conceptos y boton `boton-cierre-avanzar` para pasar a la siguiente fase. Se agrego la seccion `#pantalla-cierre` en `index.html`.
- CSS nuevo en `estilos.css`: diagrama de red, cierre de fase, estados correcto/incorrecto y mejoras de la tarjeta de desafio.
- Tests actualizados (`tests/test-flujo.js`): cubren los 10 desafios de la Fase 1 y la reconstruccion de la red; siguen pasando con `node tests/test-flujo.js`.
- Docs actualizados: `context/project_milestones.md` (Hito 2 completo) y `context/documentacion.md` (tipo `reconstruccion`, `EscenaCierre`, avance entre fases).
- Estado de avance: 1 de 3 fases con contenido completo. Siguiente paso acordado: Hito 3 (Fase 2 con panel de evidencias, T-13 a T-16).

### 2026-09-12 - Usuario: monic - Cierre de sesion (Hitos 3 a 7)

- Se completo el **Hito 3** (T-13 a T-16): Fase 2 completa (f2-01..f2-10) con el tipo `evidencias` (panel de evidencias falso o correcto en `data/`; `respuestaCorrecta` oculta, comparacion en runtime y respuesta esperada), incluida la deteccion de trafico anomalo (f2-10) que vincula con el incidente final. Cubre TCP/IP, flags, DHCP, DNS, ARP, NetBIOS y Modelo OSI.
- Flujo entre fases: se implemento el avance (cierre con "Avanzar a la Fase N") con `EscenaJuego.iniciarFase(id)` y `continuarInvestigacion` que reanuda la fase pendiente desde el menú. Solo la ultima fase ofrece "Ver informe de investigación".
- Se completo el **Hito 4** (T-17 a T-19): Fase 3 completa (f3-01..f3-10) de Firewall, DMZ, VPN, routing OSPF, Spanning Tree, enlaces (fibra), Wireless, analisis del punto vulnerable (f3-08: regla 3389 + log de acceso) y contencion (f3-09). Nuevo tipo `contencion` en `motor.js`: seleccion multiple de medidas `.medida`/`.seleccionada` con marca, validacion exacta contra `datos.correctas` (nunca expuesto en el DOM ni consola, anti-trampas) y retro.
- Se completo el **Hito 5** (T-20 a T-22): `escena-informe.js` reescrito con metricas (fases resueltas, correctas, pistas usadas, puntaje y rango con nivel), desglose por fase (estado, avance, conceptos dominados) y bloque de logros.
- Se completo el **Hito 6** (T-23 a T-28): escena `intro` con narrativa del caso NEXUS (`js/escena-intro.js`; "Nueva investigación" la abre desde el menú); expediente/tablero de avance en el menú (`#expediente`) con guia de conceptos por fase; `js/logros.js` con 7 logros derivados de las estadisticas (no se persisten aparte); responsive (media query base + ajuste de evidencias).
- Se completo el **Hito 7** (T-29 a T-33): `js/errores.js` con manejador global `error`/`unhandledrejection` y barra de aviso amigable; accesibilidad basica (`:focus-visible`, `aria-live` en areas dinamicas, `prefers-reduced-motion`); cabeceras de documentacion en todos los modulos; `README.md` actualizado con estructura/comandos/pruebas; anti-trampas verificado (grep sin `innerHTML` con datos ni respuestas expuestas).
- `main.js` registra ahora 5 escenas (menu, intro, juego, cierre, informe) y llama `Errores.activar()`. `index.html` agrego `#pantalla-intro`, `#expediente` y los scripts de errores, logros y escena-intro manteniendo el orden de carga.
- Tests actualizados a 30 desafios (10x3); el test recorre el juego completo (menu → intro → fase 1 → fase 2 → fase 3 → informe) verificando contencion, logros (7/7), informe y handler de errores. Se amplio el stub de DOM con `classList.toggle`, `window.addEventListener` y `document.body`. `node tests/test-flujo.js` pasa y `node --check` no reporta errores. (Nota de depuracion: la asercion de logros se verifica sobre tokens de `className` porque el stub mantiene `className` y `classList` desincronizados, a diferencia del navegador real.)
- Docs al dia: `context/project_milestones.md` (Hitos 3 a 7 completados, 33/33 tareas), `context/documentacion.md` (tipo `contencion`, APIs de `Logros`/`EscenaIntro`/`Errores`, escena intro, flujo), `CONTEXT.md` (arbol con los nuevos `js/`, 5 pantallas) y `README.md`.
- Estado general: juego completo y jugable de principio a fin (30 desafios, 3 fases, informe con logros), validado por el test de integracion. Cambios sin commitear (no se pidio commit).
- Proximos pasos sugeridos: tester manual/auditoria visual y WCAG AA con usuario real, pulido de UX, y decidir si se commitea al repositorio remoto de GitHub.

### 2026-09-14 - Usuario: monic - Cierre de sesion (Trello via One: mejoras y bugs)

- Se uso la conexion de Trello de One (`live::trello::default::...`, acceso "full") para procesar el tablero "Detective de Redes" (board `6aa6d12abc2134a06e61ecd3`).
- Flujo One aplicado: `actions search` -> `actions knowledge` (documentacion leida para cada accion) -> `actions execute`. Acciones usadas: listar listas del board, listar cards de una lista, Get a Card by ID (con comentarios/checklists), List a Card's Attachments, y Update a Card (mover por `idList`).
- Listas confirmadas con la API: origen "Tareas🤔" (`6aa6d12abc2134a06e61eccf`) y destino "DOING ⚙️" (`6aa6d12abc2134a06e61ecd1`); nota: la API devuelve "DOING ⚙️" con un espacio entre "DOING" y el emoji, distinto a como se ve en la UI.
- Se procesaron las 16 tarjetas de "Tareas🤔": se extrajo titulo, descripcion (incluidas imagenes embebidas del tipo `![image.webp](...)`), comentarios (ninguna tenia), checklists (ninguna tenia), labels (ninguna tenia), due date (ninguna tenia) y todos los attachments (PNGs de evidencia, en su mayoria capturas de bugs).
- Clasificacion: 9 "Mejoras propuestas" (enunciado integral del cuestionario, visual del mapa de red con iconos, maximo 3 pistas por sesion, quitar feedback por fase, reducir preguntas por fase, remover seccion de logros, definir fin sin completar preguntas, visual mas dinamica, remover resumen de sesion del menu) y 7 "Ajuste de bugs" (secciones que delatan respuestas, sin retroalimentacion en respuesta incorrecta, error al invertir orden de respuestas, uso de pistas sin penalizar puntaje, boton "nueva investigacion" en pantalla final, boton "continuar investigacion", descuento de puntos en respuesta incorrecta).
- Se genero el documento `Documentacion/mejoras-2026-09-14.md` con las secciones Mejoras propuestas / Ajuste de bugs / Ajuste de reglas (vacia) / Sin clasificar (vacia), links directos a cada tarjeta, imagenes adjuntas como `![name](URL)` y una advertencia de que las URLs de attachments requieren autenticacion (key+token).
- Las 16 tarjetas se movieron con exito a "DOING ⚙️" actualizando su `idList` (13 fueron creadas por Yennyfer Garcia y la tarjeta 16 por Monica Sosa). La lista "Tareas🤔" quedo vacia, verificado por API. Ninguna fallo; 0 pendientes de reintento manual.
- Se agrego la seccion "## Resumen de movimiento" con el detalle 16/16 movidas y tabla tarjeta por tarjeta.
- Estado del proyecto: sin cambios en codigo del juego (esta sesion fue de gestion de tareas externas via Trello). Cambios sin commitear (no se pidio commit).
- Proximos pasos sugeridos: procesar las 16 tarjetas ahora en DOING ⚙️ (priorizarlas/implementar mejoras y bugs), actualizar la bitacora de milestones si se implementa algo en el juego, y decidir si se commitea al repositorio remoto de GitHub.

### 2026-09-14 - Usuario: monic - Cierre de sesion (protocolo "Procesar tarjetas de Trello")

- Se agrego en `CONTEXT.md` (Reglas importantes) un nuevo protocolo automatizado con el disparador **"Procesar tarjetas de Trello"**, equivalente al de "Realizar el cierre de sesion" pero para el flujo completo de Trello vía One.
- El protocolo documenta el proceso validado en la sesion anterior (16 tarjetas extraidas y movidas): 1) verificar conexion de Trello con acceso full (`one --agent connection list`); 2) buscar y leer la documentacion de cada accion (`actions search` + `actions knowledge`) antes de ejecutar; 3) confirmar board `6aa6d12abc2134a06e61ecd3` y IDs de listas origen "Tareas🤔" (`6aa6d12abc2134a06e61eccf`) y destino "DOING ⚙️" (`6aa6d12abc2134a06e61ecd1`, con espacio en la API); 4) extraer por tarjeta titulo, descripcion con imagenes embebidas, comentarios, checklists, labels, fechas y todos los attachments; 5) clasificar (Mejora propuesta / Ajuste de bug / Ajuste de reglas / Sin clasificar) y escribir la entrada al documento ANTES de mover; 6) mover solo despues de escribir, registrando movidas vs fallidas; 7) guardar en `Documentacion/mejoras-YYYY-MM-DD.md` con secciones y "## Resumen de movimiento", sin sobrescribir documentos del mismo dia, y verificar que "Tareas🤔" quede vacia.
- Incluye la advertencia de que las URLs de attachments de Trello requieren autenticacion (key+token) y que las imagenes que no rendericen se dejan como referencia.
- Estado del proyecto: sin cambios en codigo del juego. Cambios en `CONTEXT.md` sin commitear (no se pidio commit).
- Proximos pasos sugeridos: si el equipo crea tarjetas nuevas en "Tareas🤔", ejecutar "Procesar tarjetas de Trello"; para el juego, seguir con las 16 tarjetas que estan en DOING ⚙️ y decidir si se commitea al repositorio remoto de GitHub.