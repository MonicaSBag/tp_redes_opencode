# Project Milestones - Detective de Redes

## Objetivo principal

Desarrollar un juego educativo de redes informaticas, web y sin backend, donde el jugador investiga un incidente en NEXUS Corp a lo largo de tres fases. Cada fase se construye sobre desafios que cubren conceptos del trabajo practico. Fuente de detalle: `Documentacion/Requisitos - Detective de Redes.md` y `Documentacion/Plan de desarrollo - Detective de Redes.md`.

## Estado actual

**Fase actual:** Hito 2 completado (Fase 1 con contenido completo, diagrama interactivo y cierre narrativo). Siguiente: Hito 3 (contenido completo de la Fase 2 y panel de evidencias).

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

### Hito 3 - Fase 2: Siguiendo las pistas (SIGUIENTE)

- [ ] T-13 Contenido Fase 2 (TCP/IP, Flags, DHCP, DNS, ARP, NetBIOS, OSI). Hay 1 demo.
- [ ] T-14 Panel de evidencias (logs, config, resultados de pruebas).
- [ ] T-15 Desafios de analisis de paquetes.
- [ ] T-16 Deteccion de trafico anomalo (cierre).

### Hito 4 - Fase 3: El ataque

- [ ] T-17 Contenido Fase 3 (Firewall, DMZ, VPN, OSPF, STP, enlaces, Wireless). Hay 1 demo.
- [ ] T-18 Analisis del punto vulnerable.
- [ ] T-19 Escenario de decision de contencion.

### Hito 5 - Evaluacion e informe final

- [ ] T-20 Metricas de partida (resueltos, correctas, pistas).
- [ ] T-21 Sistema de rango (base implementada en `Puntaje.rangoDeDetectivo`).
- [ ] T-22 Pantalla de informe final (version base ya funciona al terminar una fase).

### Hito 6 - UI/UX y gamificacion

- [ ] T-23 Intro narrativa de NEXUS Corp.
- [ ] T-24 Expediente/tablero de avance.
- [ ] T-25 Retroalimentacion inmediata (ya hay mensaje correcto/incorrecto; falta pulir).
- [ ] T-26 Tutoriales/guia por concepto.
- [ ] T-27 Logros/hitos.
- [ ] T-28 Responsive (base ya aplicada).

### Hito 7 - Calidad, accesibilidad y mantenimiento

- [ ] T-29 Accesibilidad WCAG AA.
- [ ] T-30 Rendimiento (<3s carga, 30fps).
- [ ] T-31 Documentacion de codigo (parcial: existe `context/documentacion.md`).
- [ ] T-32 Logging de errores.
- [ ] T-33 Anti-trampas (parcial: respuestas no expuestas en el DOM).

## Notas

- El flujo completo actual: menu → fase 1 (10 desafios, 1 interactivo) → cierre de fase (pieza + conceptos) → informe. Probado con el test de integracion `node tests/test-flujo.js`.
- Las fases 2 y 3 conservan 1 desafio demo cada una; su contenido completo corresponde a Hitos 3 y 4.
- Los tests de integracion se ejecutan con Node contra stubs de DOM (ver `CONTEXT.md`).