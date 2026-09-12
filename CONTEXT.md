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
├── index.html                 # Punto de entrada (4 pantallas: menu, juego, cierre, informe)
├── css/
│   └── estilos.css            # Tema "detective" con variables CSS
├── js/
│   ├── contenido.js        # (data/) Contenido de fases y desafios
│   ├── gestor-escenas.js      # window.GestorEscenas - mostrar/ocultar pantallas
│   ├── puntaje.js             # window.Puntaje - puntos, penalizacion, rango
│   ├── progreso.js            # window.Progreso - localStorage
│   ├── pistas.js              # window.Pistas - pistas y penalizacion
│   ├── motor.js               # window.Motor - renderizar y validar desafios
│   ├── escena-juego.js        # window.EscenaJuego - flujo de juego
│   ├── escena-cierre.js       # window.EscenaCierre - cierre narrativo de fase
│   ├── escena-informe.js      # window.EscenaInforme - informe final
│   ├── menu.js                # window.Menu - menu principal
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