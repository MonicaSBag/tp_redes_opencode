# Detective de Redes

Juego educativo interactivo en el que el jugador asume el rol de un detective especializado en redes informáticas. La empresa ficticia **NEXUS Corp** sufrió un incidente que provocó fallas en su infraestructura y el jugador deberá investigarlo a través de tres fases de dificultad creciente:

1. **Fase 1 - La escena del crimen**: reconstruir la infraestructura de red (Hub, Switch, Router, Gateway, VLAN, LAN/WAN, Topologías).
2. **Fase 2 - Siguiendo las pistas**: analizar el comportamiento de la red (TCP/IP, Flags, DHCP, DNS, ARP, NetBIOS, Modelo OSI).
3. **Fase 3 - El ataque**: identificar el origen del incidente y contenerlo (Firewall, DMZ, VPN, OSPF, Spanning Tree, Wireless).

La documentación completa está en la carpeta `Documentacion/` junto con el documento de requisitos.

## Estructura del proyecto

```
openCode/
├── Documentacion/
│   ├── Detective de Redes.docx            # Diseño original del juego
│   └── Requisitos - Detective de Redes.md  # Requisitos funcionales y técnicos
├── requirements.txt                       # Dependencias de Python
└── README.md                              # Este archivo
```

## Requisitos previos

- **Git** (para clonar el repositorio).
- **Python 3.10+** (para el entorno virtual y dependencias de documentación).
- **Node.js 18+** o un gestor de paquetes (necesario solo si instalas OpenCode con npm).
- Opcional pero **recomendado en Windows**: [WSL](https://learn.microsoft.com/es-es/windows/wsl/install) para usar OpenCode.

## Descarga del repositorio

```bash
git clone https://github.com/TU_USUARIO/detective-de-redes.git
cd detective-de-redes
```

Reemplaza `TU_USUARIO/detective-de-redes` por la URL de tu repositorio.

## Crear el entorno virtual e instalar dependencias

### Windows (PowerShell)

```powershell
python -m venv .env
.env\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Windows (Git Bash / CMD)

```bash
python -m venv .env
source .env/Scripts/activate
pip install -r requirements.txt
```

### Linux / macOS

```bash
python3 -m venv .env
source .env/bin/activate
pip install -r requirements.txt
```

## Instalación del agente OpenCode

OpenCode es el agente de IA que asiste en el desarrollo del proyecto. Elige una de las siguientes opciones:

### Opción A - Windows (recomendada)

```bash
scoop install opencode          # con Scoop
```

```bash
choco install opencode          # con Chocolatey
```

### Opción B - Con Node.js (todas las plataformas)

```bash
npm install -g opencode-ai
```

También es compatible con `bun`, `pnpm` o `yarn`.

### Opción C - WSL / Linux / macOS

```bash
brew install anomalyco/tap/opencode   # macOS / Linux con Homebrew
```

```bash
curl -fsSL https://opencode.ai/install | bash
```

> En Windows se recomienda usar WSL para obtener el mejor rendimiento y compatibilidad con todas las funciones de OpenCode.

Verifica la instalación:

```bash
opencode --version
```

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

## Notas

- El contenido teórico del juego se define en `Documentacion/`.
- No subas a GitHub el entorno virtual ni claves de API: están excluidos por `.gitignore`.
- Usa el archivo `requirements.txt` para instalar las mismas dependencias en cualquier equipo.