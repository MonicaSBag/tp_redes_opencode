# Detective de Redes - Documento de Requisitos

Juego educativo interactivo sobre redes informáticas basado en el diseño del documento *Detective de Redes.docx*.

## 1. Visión general

El jugador asume el rol de un detective especializado en redes informáticas y es convocado por la empresa ficticia **NEXUS Corp** para investigar un incidente que provocó fallas en distintos servicios de su infraestructura. A través de tres fases de investigación de dificultad creciente, deberá analizar evidencias, interpretar configuraciones y resolver problemas de conectividad.

El objetivo educativo es transformar los conceptos teóricos de redes en situaciones prácticas de resolución de problemas, evitando que el usuario simplemente responda preguntas de memoria.

**Misión del jugador:** investigar qué ocurrió, reconstruir el funcionamiento de la red, identificar el origen del incidente y recuperar el control de la infraestructura.

## 2. Requisitos funcionales

### 2.1. Sistema de juego

| ID | Descripción |
|----|-------------|
| RF-01 | El juego debe presentar una narrativa de investigación donde el jugador asuma el rol de detective de redes. |
| RF-02 | El juego debe dividirse en 3 fases de dificultad creciente. |
| RF-03 | Cada fase debe contener desafíos basados en conceptos específicos de redes. |
| RF-04 | El sistema debe registrar el progreso del jugador en cada fase. |

### 2.2. Fase 1 - La escena del crimen

| ID | Descripción |
|----|-------------|
| RF-05 | El jugador debe reconstruir la infraestructura de red de NEXUS Corp analizando dispositivos, conexiones y configuraciones. |
| RF-06 | El juego debe incluir ejercicios sobre: Hub, Switch, Router, Gateway, VLAN, LAN/WAN y Topologías. |
| RF-07 | El jugador debe identificar los distintos dispositivos, conexiones y configuraciones para comprender la estructura de la red. |
| RF-08 | Al completar la fase, el jugador debe descubrir que existen diferentes redes y segmentos dentro de la empresa. |

### 2.3. Fase 2 - Siguiendo las pistas

| ID | Descripción |
|----|-------------|
| RF-09 | El jugador debe analizar el comportamiento de la red mediante configuraciones, registros y resultados de pruebas. |
| RF-10 | El juego debe incluir ejercicios sobre: TCP/IP, TCP y Flags, DHCP, DNS, ARP, NetBIOS y Modelo OSI. |
| RF-11 | El jugador debe determinar cómo se están comunicando los dispositivos. |
| RF-12 | El jugador debe encontrar evidencia de tráfico anómalo dentro de la infraestructura. |

### 2.4. Fase 3 - El ataque

| ID | Descripción |
|----|-------------|
| RF-13 | El jugador debe aplicar los conocimientos de las fases anteriores para analizar una situación compleja. |
| RF-14 | El juego debe incluir ejercicios sobre: Firewall, DMZ, VPN, Routing/OSPF, Spanning Tree, Tipos de enlaces y Wireless. |
| RF-15 | El jugador debe identificar qué componentes de la infraestructura están involucrados en el incidente. |
| RF-16 | El jugador debe determinar cómo se produjo el incidente, identificar el punto vulnerable y seleccionar las medidas de contención. |

### 2.5. Sistema de evaluación

| ID | Descripción |
|----|-------------|
| RF-17 | El juego debe generar un informe final de investigación con: casos resueltos, respuestas correctas, pistas utilizadas, puntaje obtenido, nivel/rango de detective alcanzado y conceptos de redes dominados. |
| RF-18 | El sistema debe otorgar puntaje por cada desafío resuelto. |
| RF-19 | El sistema debe permitir el uso de pistas con penalización en la puntuación (a definir). |

## 3. Requisitos no funcionales

### 3.1. Usabilidad

| ID | Descripción |
|----|-------------|
| RNF-01 | La interfaz debe ser intuitiva y fácil de navegar. |
| RNF-02 | El juego debe proporcionar retroalimentación inmediata sobre las acciones del jugador. |
| RNF-03 | El sistema debe incluir tutoriales o guías para conceptos complejos. |
| RNF-04 | El jugador debe poder guardar y reanudar la investigación. |

### 3.2. Rendimiento

| ID | Descripción |
|----|-------------|
| RNF-05 | El juego debe cargar en menos de 3 segundos en dispositivos estándar. |
| RNF-06 | Las animaciones y transiciones deben ser fluidas (mínimo 30 FPS). |
| RNF-07 | El sistema debe soportar múltiples usuarios simultáneos sin degradación del rendimiento. |

### 3.3. Compatibilidad y accesibilidad

| ID | Descripción |
|----|-------------|
| RNF-08 | El juego debe funcionar en navegadores modernos (Chrome, Firefox, Edge, Safari). |
| RNF-09 | El juego debe ser responsive (escritorio y móvil). |
| RNF-10 | El juego debe ser accesible según WCAG 2.1 nivel AA. |

## 4. Requisitos técnicos

| ID | Descripción |
|----|-------------|
| RT-01 | El juego debe utilizar una arquitectura cliente-servidor. |
| RT-02 | El sistema debe almacenar el progreso del jugador en una base de datos. |
| RT-03 | El juego debe implementar registro e inicio de sesión de usuarios (a definir si es necesario para la entrega). |
| RT-04 | Frontend con HTML5, CSS3 y JavaScript/TypeScript. |
| RT-05 | Backend con Node.js o Python (según decisión del equipo). |
| RT-06 | Base de datos MongoDB o PostgreSQL (según decisión del equipo). |
| RT-07 | Framework de juego a definir (Phaser.js, Pixi.js u otro). |

## 5. Requisitos de contenido educativo

| ID | Descripción |
|----|-------------|
| RC-01 | El juego debe cubrir todos los conceptos de las tres fases (ver secciones 2.2, 2.3 y 2.4). |
| RC-02 | Cada concepto debe incluir explicación teórica y ejercicio práctico. |
| RC-03 | El contenido debe estar alineado con el temario de redes de la materia. |
| RC-04 | El juego debe incluir casos de uso reales y contextualizados en la historia de NEXUS Corp. |
| RC-05 | La dificultad debe aumentar progresivamente entre fases. |
| RC-06 | Cada fase debe tener múltiples niveles o desafíos. |

## 6. Requisitos de experiencia de usuario

| ID | Descripción |
|----|-------------|
| RUX-01 | El diseño visual debe reflejar la temática de detective/investigación. |
| RUX-02 | El juego debe incluir un expediente o tablero de caso que muestre el avance de la investigación. |
| RUX-03 | La navegación debe ser clara y consistente. |
| RUX-04 | El sistema debe implementar mecánicas de gamificación: puntos, insignias y rangos de detective. |
| RUX-05 | El juego debe incluir un sistema de logros o hitos. |

## 7. Requisitos de seguridad

| ID | Descripción |
|----|-------------|
| RS-01 | El sistema debe proteger las credenciales de usuario (hash y/o encriptación). |
| RS-02 | Los datos del jugador deben estar protegidos. |
| RS-03 | El juego debe implementar medidas contra trampas o manipulación del sistema de puntaje. |

## 8. Requisitos de mantenimiento

| ID | Descripción |
|----|-------------|
| RM-01 | El código debe estar documentado y seguir buenas prácticas de desarrollo. |
| RM-02 | El sistema debe permitir actualizar el contenido educativo sin afectar el funcionamiento. |
| RM-03 | El juego debe incluir un sistema de registro de errores (logging). |
| RM-04 | La configuración sensible debe manejarse mediante variables de entorno (nunca en el repositorio). |