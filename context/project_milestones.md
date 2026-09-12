# Project Milestones - Detective de Redes

## Objetivo principal

Desarrollar un juego educativo de redes informaticas, web y sin backend, donde el jugador investiga un incidente en NEXUS Corp a lo largo de tres fases. Cada fase se construye sobre desafios que cubren conceptos del trabajo practico. Fuente de detalle: `Documentacion/Requisitos - Detective de Redes.md` y `Documentacion/Plan de desarrollo - Detective de Redes.md`.

## Estado actual

**Fase actual:** Hitos 4 a 7 completados. Las tres fases tienen contenido completo (30 desafios), el informe final es rico en metricas/logros, hay intro narrativa, expediente, manejo de errores y accesibilidad basica. Siguiente: tester manual y pulido de UX.

## Seguimiento de tareas

### Hito 0 - Setup del proyecto

- [x] T-01 Estructura de carpetas e `index.html` con 3 pantallas (menu, juego, informe).
- [x] T-02 `css/estilos.css`: tema detective, variables CSS, componentes (boton, panel, tarjeta, badge, pista, retroalimentacion).

### Hito 1 - Nucleo del motor de juego

- [x] T-03 `gestor-escenas.js`: registrar escenas y navegar entre pantallas (.activa).
- [x] T-04 `progreso.js`: guardado/reanudacion con `localStorage` (clave `detective-redes:progreso`).
- [x] T-05 `puntaje.js`: 100 pts por desafio, -25 pts por pista (minimo 10), rango de detective por proporcion.
- [x] T-06 `pistas.js`: pistas por desafio, se marcan usadas y penalizan el puntaje.
- [x] T-07 `motor.js` + `escena-juego.js`: motor reutilizable con registro de "tipos" de desafio; implementado `opcion_multiple`.
- [x] T-08 `data/contenido.js`: arquitectura de contenido (fases, orden, titulo, desafios). Contenido completo pendiente en Hitos 2-4.

### Hito 2 - Fase 1: La escena del crimen

- [x] T-09 Escribir contenido completo de Fase 1 (Hub, Switch, Router, Gateway, VLAN, LAN/WAN, topologias). 10 desafios (f1-01..f1-10).
- [x] T-10 Diagrama interactivo de reconstruccion de la red (tipo `reconstruccion` registrado en el motor: zonas, nodos y placas).
- [x] T-11 Desafios de identificacion de dispositivos y segmentos (f1-05 Router, f1-06 Gateway, f1-07 LAN/WAN, f1-09 VLAN/segmentos).
- [x] T-12 Cierre narrativo de la fase (pantalla "cierre" con la pieza y conceptos dominados, camino hacia el informe).

### Hito 3 - Fase 2: Siguiendo las pistas

- [x] T-13 Contenido Fase 2 (TCP/IP, TCP/Flags, DHCP, DNS, ARP, NetBIOS, Modelo OSI). 10 desafios (f2-01..f2-10).
- [x] T-14 Panel de evidencias (tipo `evidencias`: registros, configuraciones y resultados de pruebas en formato lectura).
- [x] T-15 Desafios de analisis de paquetes y comunicacion entre dispositivos (capturas TCP, netstat, nslookup, nbtstat).
- [x] T-16 Deteccion de trafico anomalo como cierre narrativo de la fase (f2-10: barrido de puertos). Ademas se agrego el flujo de avance entre fases (boton "Avanzar a la Fase N" en el cierre).

### Hito 4 - Fase 3: El ataque

- [x] T-17 Contenido Fase 3 (Firewall, DMZ, VPN, Routing/OSPF, Spanning Tree, tipos de enlaces, Wireless). 10 desafios (f3-01..f3-10).
- [x] T-18 Desafio de analisis del punto vulnerable (f3-08: regla 3389 + log de acceso).
- [x] T-19 Escenario de decision de contencion: tipo `contencion` (seleccion multiple de medidas, f3-09).

### Hito 5 - Evaluacion e informe final

- [x] T-20 Metricas de partida (fases resueltas, correctas, pistas usadas en el informe).
- [x] T-21 Sistema de rango (base implementada en `Puntaje.rangoDeDetectivo`, nivel incluido en el informe).
- [x] T-22 Pantalla de informe final: metricas + desglose por fase (estado, avance, conceptos) + rango.

### Hito 6 - UI/UX y gamificacion

- [x] T-23 Intro narrativa: escena "intro" con la historia del caso NEXUS al iniciar "Nueva investigación".
- [x] T-24 Expediente/tablero de avance en el menu (estado de cada fase: Resuelta/En curso/Pendiente).
- [x] T-25 Retroalimentacion inmediata (correcto/incorrecto + explicacion) en todos los tipos de desafio.
- [x] T-26 Guia de conceptos por fase en el expediente del menu.
- [x] T-27 Logros (7) derivados de las estadisticas, mostrados en el informe (`js/logros.js`).
- [x] T-28 Responsive (media query base + ajuste de evidencias).

### Hito 7 - Calidad, accesibilidad y mantenimiento

- [x] T-29 Accesibilidad basica: `:focus-visible`, `aria-live` en areas dinamicas, `prefers-reduced-motion`.
- [x] T-30 Rendimiento: sin recursos pesados ni red; el juego corre completamente en cliente (carga local).
- [x] T-31 Documentacion de codigo: cabeceras en todos los modulos + estructura y pruebas en `README.md`.
- [x] T-32 Logging de errores: `js/errores.js` con `error` y `unhandledrejection` + aviso amigable.
- [x] T-33 Anti-trampas: respuestas correctas jamas van al DOM ni a consola; se comparan en runtime.

## Notas

- Flujo completo: menu → expediente → intro (Nueva investigación) → fase 1 (10) → cierre → fase 2 (10) → cierre → fase 3 (10) → cierre → informe final (metricas + desglose + logros + rango).
- Todos los tipos de desafio: `opcion_multiple`, `evidencias`, `reconstruccion` y `contencion`.
- Los tests de integracion (`node tests/test-flujo.js`) recorren el juego completo y verifican intro, logros, informe y manejo de errores.
- WCAG AA completo (contraste, navegacion) queda como auditoria final pendiente de revision con tester real.