# Detective de Redes - Plan de desarrollo

Plan de trabajo derivado de *Requisitos - Detective de Redes.md*.

## Stack elegido

- **Frontend**: HTML5, CSS3 y JavaScript (sin frameworks). Juego 100% en navegador.
- **Guardado**: `localStorage` (sin base de datos ni cuentas de usuario).
- **Estructura**: motor de escenas ligero + contenido de fases en archivos JSON.

## Ajustes a los requisitos por la elección del stack

| Requisito | Ajuste |
|-----------|--------|
| RT-02 (base de datos) | Reemplazado por `localStorage`. |
| RT-03 (cuentas/login) | Fuera de alcance: no hay cuentas. |
| RNF-07 (múltiples usuarios) | No aplica: es una app local de un solo jugador. |
| RS-01 / RS-02 (credenciales) | No aplica: no hay credenciales ni datos en servidor. |
| RS-03 (anti-trampas) | Se adapta: las respuestas no deben quedar expuestas en el DOM ni la consola. |

## Convención de tareas

- Cada tarea tiene un ID (`T-XX`), un hito, los requisitos que cubre y dependencias.
- Orden de trabajo sugerido: número de tarea ascendente dentro de cada hito.

---

## Hito 0 - Setup del proyecto

| ID | Tarea | Requisitos | Depende de |
|----|-------|-----------|------------|
| T-01 | Crear estructura de carpetas: `index.html`, `css/`, `js/`, `data/`, `assets/`. | - | - |
| T-02 | Crear hoja de estilos base con tema de detective (paleta, tipografía, variables CSS y componentes: botones, paneles, tarjetas de evidencia). | RUX-01 | T-01 |

## Hito 1 - Núcleo del motor de juego

| ID | Tarea | Requisitos | Depende de |
|----|-------|-----------|------------|
| T-03 | Implementar gestor de escenas (función que muestra/oculta pantallas: menú, escena de caso, informe). | RF-02, RNF-01 | T-01 |
| T-04 | Implementar sistema de progreso con `localStorage` (fase actual, desafíos resueltos, puntaje) que permita guardar y reanudar. | RF-04, RNF-04 | T-03 |
| T-05 | Implementar sistema de puntaje acumulativo por desafío resuelto. | RF-18 | T-04 |
| T-06 | Implementar sistema de pistas: botón que muestra ayuda y descuenta puntos. | RF-19 | T-04 |
| T-07 | Crear motor de desafíos reutilizable: estructura de datos, renderizado y validación de respuestas. | RF-03 | T-03 |
| T-08 | Crear arquitectura de contenido en JSON (fases, niveles, desafíos, conceptos asociados). | RM-02 | T-07 |

## Hito 2 - Fase 1: La escena del crimen

| ID | Tarea | Requisitos | Depende de |
|----|-------|-----------|------------|
| T-09 | Escribir contenido de Fase 1: Hub, Switch, Router, Gateway, VLAN, LAN/WAN y topologías. | RF-06 | T-08 |
| T-10 | Implementar diagrama interactivo de reconstrucción de la red (seleccionar/ubicar dispositivos y conexiones). | RF-05 | T-07, T-09 |
| T-11 | Implementar desafíos de identificación de dispositivos y segmentos (VLAN/LAN/WAN). | RF-05, RF-06 | T-10 |
| T-12 | Cierre narrativo de la fase: el jugador descubre que existen diferentes redes y segmentos. | RF-08 | T-11 |

## Hito 3 - Fase 2: Siguiendo las pistas

| ID | Tarea | Requisitos | Depende de |
|----|-------|-----------|------------|
| T-13 | Escribir contenido de Fase 2: TCP/IP, TCP y Flags, DHCP, DNS, ARP, NetBIOS y Modelo OSI. | RF-10 | T-08 |
| T-14 | Implementar panel de evidencias: registros (logs), configuraciones y resultados de pruebas en formato lectura. | RF-09 | T-07, T-13 |
| T-15 | Implementar desafíos de análisis de paquetes y comunicación entre dispositivos. | RF-11 | T-14 |
| T-16 | Implementar desafío de detección de tráfico anómalo (cierre narrativo de la fase). | RF-12 | T-15 |

## Hito 4 - Fase 3: El ataque

| ID | Tarea | Requisitos | Depende de |
|----|-------|-----------|------------|
| T-17 | Escribir contenido de Fase 3: Firewall, DMZ, VPN, Routing/OSPF, Spanning Tree, tipos de enlaces y Wireless. | RF-14 | T-08 |
| T-18 | Implementar desafíos de análisis del punto vulnerable de la infraestructura. | RF-13, RF-15 | T-17 |
| T-19 | Implementar escenario de decisión de contención (seleccionar medidas correctas). | RF-16 | T-18 |

## Hito 5 - Evaluación e informe final

| ID | Tarea | Requisitos | Depende de |
|----|-------|-----------|------------|
| T-20 | Registrar métricas de la partida: casos resueltos, respuestas correctas, pistas usadas. | RF-17 | T-05, T-06 |
| T-21 | Implementar sistema de rango de detective según puntaje obtenido. | RUX-04, RF-17 | T-20 |
| T-22 | Implementar pantalla de informe final con todos los datos de la investigación. | RF-17 | T-20, T-21 |

## Hito 6 - UI/UX y gamificación

| ID | Tarea | Requisitos | Depende de |
|----|-------|-----------|------------|
| T-23 | Implementar secuencia introductoria con la historia de NEXUS Corp y el incidente. | RF-01 | T-03 |
| T-24 | Implementar expediente o tablero de caso que muestre el avance de la investigación. | RUX-02 | T-04 |
| T-25 | Agregar retroalimentación inmediata en cada respuesta (correcta/incorrecta + explicación breve). | RNF-02 | T-07 |
| T-26 | Incorporar tutoriales o guías breves por concepto complejo. | RNF-03, RC-02 | T-25 |
| T-27 | Implementar sistema de logros/hitos desbloqueables. | RUX-05 | T-20 |
| T-28 | Hacer el diseño responsive (escritorio y móvil). | RNF-09 | T-02 |

## Hito 7 - Calidad, accesibilidad y mantenimiento

| ID | Tarea | Requisitos | Depende de |
|----|-------|-----------|------------|
| T-29 | Auditar accesibilidad: contraste, navegación por teclado, atributos ARIA y textos alternativos. | RNF-10 | T-28 |
| T-30 | Verificar rendimiento: carga inicial menor a 3 s y animaciones fluidas. | RNF-05, RNF-06 | T-28 |
| T-31 | Documentar el código (comentarios en módulos y estructura del proyecto en el README). | RM-01 | - |
| T-32 | Implementar registro de errores (evento global de errores con mensaje amigable para el usuario). | RM-03 | T-03 |
| T-33 | Ocultar respuestas del DOM/consola para desalentar trampas. | RS-03 | T-07 |

---

## Orden de desarrollo sugerido (ruta crítica)

1. **Hito 0 y 1** completos (base del juego funcional navegable).
2. **Fase 1 completa** (Hito 2) → se puede hacer demo de la Fase 1.
3. **Fase 2 y 3** (Hitos 3 y 4).
4. **Evaluación e informe** (Hito 5).
5. **UI/UX + gamificación** (Hito 6) en paralelo una vez estable el núcleo.
6. **Calidad y mantenimiento** (Hito 7).

## Criterio de "tarea terminada"

Una tarea se considera terminada cuando:

- Cumple la descripción y los requisitos listados.
- Funciona en navegador moderno sin errores en consola.
- Está integrada con las tareas de las que dependía.
- Está revisada por el equipo (código y UX).