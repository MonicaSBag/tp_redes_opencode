# NEXUS CORP — NOC Support Ticket System

Juego educativo de redes en un único archivo. El jugador es el turno de guardia del NOC de la empresa ficticia **NEXUS Corp** y debe resolver tickets de soporte en 3 fases (mañana / tarde / noche).

Todo está en `juego-noc.html`: HTML + CSS + JS vanilla, sin frameworks, sin backend, sin build step, sin dependencias externas.

## Ejecutar

Opción 1 — doble clic en `juego-noc.html`.

Opción 2 — servidor local:

```bash
python -m http.server 8000
# abrir http://localhost:8000/juego-noc.html
```

## Estructura del proyecto

```
./
├── juego-noc.html   # Todo el juego (estilos, vistas y lógica)
├── README.md        # Este archivo
├── .gitignore
└── opencode.json    # Config del agente OpenCode (no es parte del juego)
```

`juego-noc.html` no carga ningún `<script src>`, `<link>` ni `fetch`. Los únicos `<use href="#...">` apuntan a símbolos SVG definidos dentro del mismo archivo.

## Estructura interna de `juego-noc.html`

1. `<style>` (~600 líneas): variables CSS (`--bg`, `--panel`, `--fase1/2/3`), layout `.app` en grid (`top / side+main / foot`), componentes (`.btn`, `.chip`, `.ticket`, `.view`, login, asistente).
2. HTML shell:
   - `#pantalla-login`: login de operario + fondo neural SVG.
   - `#app.hidden`: header (usuario), sidebar (3 fases), main con 3 vistas (`#view-inicio`, `#view-fase`, `#view-resumen`), footer + FAB del asistente.
   - `svg` oculto con símbolos (`#hex-n` e iconos de dispositivos).
3. `<script>` (~1400 líneas):
   - `const FASES`: datos de las 3 fases y sus 9 tickets.
   - Estado y persistencia (`STORAGE_KEY = "nexus-noc-v1"`).
   - Navegación (`irInicio`, `irFase`, `abrirTicket`, `irResumen`).
   - Resolución (`verificar`, `reintentarTicket`, `congelarInteraccion`).
   - Tipos de ticket, consola con tipeo, asistente de pistas, resumen final.

## Contenido del juego: 3 fases, 9 tickets

**Fase 1 — Conectividad básica (turno mañana)**
- `1.1` Red lenta y colisiones: Hub vs Switch (opciones con icono).
- `1.2` Identificación de topología en estrella (diagrama SVG).
- `1.3` Ordenar las 7 capas del modelo OSI (arrastrar/ordenar).

**Fase 2 — Servicios caídos (turno tarde)**
- `2.1` Sin internet, IP `169.254.x.x` APIPA: sin respuesta DHCP (consola `ipconfig /all`).
- `2.2` La web no carga por nombre pero sí por IP: DNS caído (consola `nslookup`).
- `2.3` `ping PC-VENTAS` no encuentra el host: falta resolución de nombres (consola).

**Fase 3 — Diseño y seguridad (turno noche)**
- `3.1` Publicación segura de servidor web: Internet → Firewall → DMZ → Gateway → LAN (armado firewall/DMZ).
- `3.2` Ranking de 6 enlaces entre sucursales por costo/performance (fibra > MPLS > microondas > 4G/5G > residencial > satelital).
- `3.3` IPv4 vs IPv6 en `ipconfig` (32 bits decimal vs 128 bits hexadecimal).

## Flujo y reglas

Login (nombre de operario) → Inicio (tarjetas de fase, desbloqueo secuencial) → Fase (cola de tickets `pendiente / en_curso / resuelto / fallado`; al entrar se muestra solo la cola y el usuario elige qué ticket abrir) → Resumen (`CASO RESUELTO` o `INCOMPLETO` + detalle por ticket).

- El asistente lateral tiene un máximo de 3 pistas en todo el recorrido (cada ticket aporta como máximo sus 2 pistas): el campo trae el mensaje predefinido `Quiero una pista para resolver el incidente` (solo lectura) y se pide con el botón de enviar.
- El botón Siguiente queda bloqueado hasta verificar la respuesta; no se puede continuar con un ticket `pendiente` sin responder (tampoco después de reintentar un fallado).
- Al responder se muestra feedback `fbOk` / `fbKo` y se congela la interacción; los fallados se pueden reintentar.
- El progreso (mapa `id → estado`) se guarda en `localStorage` bajo `nexus-noc-v1`. Borrar esa clave reinicia la partida.

## Instalación del agente OpenCode

OpenCode es el agente de IA que asiste en el desarrollo del proyecto. Elige una de las siguientes opciones:

## Configurar el proveedor de IA (primera vez)

OpenCode necesita una API key de un proveedor de modelos. La forma más simple es usar OpenCode Zen:

1. Ejecuta el agente e inicia sesión:

```bash
opencode
```

2. Dentro del TUI, ejecuta el comando `/connect`, selecciona `opencode` y copia tu API key desde [opencode.ai/auth](https://opencode.ai/auth).

Alternativa por CLI con cualquier proveedor:

```bash
opencode auth login
```

Las credenciales se guardan en `~/.local/share/opencode/auth.json` (no se suben al repositorio).

## Cómo correr el agente

### Modo interactivo (TUI)

```bash
opencode
```

Sugerencia: la primera vez ejecuta `/init` para que OpenCode analice el proyecto y genere el archivo `AGENTS.md`, lo cual mejora la asistencia en este repositorio.

### Modo no interactivo (una sola consulta)

```bash
opencode run "Explica cómo está estructurado el proyecto"
```

### Opciones útiles

```bash
opencode -c                     # continuar la última sesión
opencode run -c "..."           # continuar y responder en modo CLI
opencode stats                  # ver uso de tokens y costo
opencode upgrade                # actualizar a la última versión
```

