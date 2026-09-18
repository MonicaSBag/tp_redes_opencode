// Contenido educativo del juego: fases, desafios y evidencias (window.CONTENIDO).
// Se puede editar sin tocar la logica; los tipos de desafio los resuelve js/motor.js.
// v4: 4 desafios por fase redactados en formato incidente (mejoras Trello 2026-09-14).
window.CONTENIDO = {
  version: 4,
  fases: [
    {
      id: "fase1",
      orden: 1,
      titulo: "La escena del crimen",
      conceptoGeneral: "Reconstrucción de la infraestructura",
      pieza: "El mapa queda reconstruido. NEXUS Corp no tiene una sola red: hay un núcleo central con Router de salida hacia el ISP, un Gateway como puerta de la LAN, un Switch organizando el tráfico y segmentos de usuarios separados por VLAN. Ahora entendés cómo está estructurada la infraestructura y podés seguir investigando qué falló.",
      desafios: [
        {
          id: "f1-01",
          tipo: "reconstruccion",
          concepto: "Topología",
          pregunta: "Reconstruí el mapa troncal de NEXUS Corp: tocá una placa y luego el lugar del mapa donde corresponde. Cuando el mapa esté completo, verificá tu reconstrucción.",
          opciones: ["Ninguna"],
          respuestaCorrecta: 0,
          pista: "El Router da salida hacia el ISP, el Switch concentra la LAN, el Gateway es la puerta hacia otras redes y las PC forman los segmentos de usuarios.",
          explicacion: "El Router enruta hacia el ISP, el Switch organiza la LAN por dirección MAC, el Gateway es la puerta hacia otras redes y las PC se agrupan en segmentos de usuarios separados por VLAN.",
          datos: {
            piso: "Placas disponibles",
            zonas: [
              { id: "wan", titulo: "Hacia el proveedor (WAN)" },
              { id: "nucleo", titulo: "Núcleo central" },
              { id: "segmento", titulo: "Segmento de usuarios (LAN)" }
            ],
            opciones: ["Router", "Switch", "Gateway", "PC Contabilidad", "PC Marketing", "Hub"],
            iconos: {
              "Router": "Router",
              "Switch": "Switch",
              "Gateway": "Gateway",
              "PC Contabilidad": "Monitor",
              "PC Marketing": "Monitor",
              "Hub": "Hub"
            },
            nodos: [
              { id: "nodo-router", zona: "wan", etiquetaCorrecta: "Router" },
              { id: "nodo-switch", zona: "nucleo", etiquetaCorrecta: "Switch" },
              { id: "nodo-gateway", zona: "nucleo", etiquetaCorrecta: "Gateway" },
              { id: "nodo-pc1", zona: "segmento", grupo: "usuarios", etiquetaCorrecta: "PC Contabilidad" },
              { id: "nodo-pc2", zona: "segmento", grupo: "usuarios", etiquetaCorrecta: "PC Marketing" }
            ]
          }
        },
        {
          id: "f1-02",
          tipo: "opcion_multiple",
          concepto: "Conmutación",
          pregunta: "En el inventario del rack aparecen dos cajas etiquetadas indistintamente: una repite cada trama a todos los puertos sin mirar el destino y la otra aprendió direcciones MAC y entrega cada trama solo por el puerto del destinatario. Con el tráfico colapsando a la mañana siguiente, ¿cuál dejás conectada para reducir el tráfico innecesario y las colisiones?",
          opciones: ["Switch", "Hub", "Router", "Modem"],
          respuestaCorrecta: 0,
          pista: "El que aprende las direcciones MAC y decide el puerto de salida trabaja en capa 2.",
          explicacion: "El Switch (capa 2) aprende las MAC y envía cada trama solo al puerto del destinatario, disminuyendo el tráfico innecesario y las colisiones; el Hub repite la trama a todos los puertos sin filtrar."
        },
        {
          id: "f1-03",
          tipo: "opcion_multiple",
          concepto: "VLAN",
          pregunta: "Contabilidad y Marketing comparten el mismo switch físico, pero sus equipos no deben verse entre sí ni compartir dominios de broadcast. Sin comprar hardware nuevo, ¿qué tecnología usás para segmentar el switch en redes lógicas separadas?",
          opciones: ["DMZ", "VLAN", "VPN", "ARP"],
          respuestaCorrecta: 1,
          pista: "Es una 'LAN virtual': aísla el tráfico dentro del mismo switch físico.",
          explicacion: "Una VLAN divide lógicamente al switch: cada VLAN es un dominio de broadcast independiente y los equipos de VLAN distintas no se ven entre sí salvo que haya enrutamiento."
        },
        {
          id: "f1-04",
          tipo: "opcion_multiple",
          concepto: "Enrutamiento entre VLAN",
          pregunta: "Contabilidad (VLAN 10) y Marketing (VLAN 20) ya están segmentadas, pero ambas necesitan llegar al servidor de archivos que vive en otra VLAN del mismo switch. Además del switch, ¿qué dispositivo se requiere para que esas redes lógicas intercambien datos?",
          opciones: ["Un segundo switch igual", "Un router que enrute entre VLAN", "Un repetidor inalámbrico", "Un cable cruzado entre VLAN"],
          respuestaCorrecta: 1,
          pista: "Cada VLAN es un dominio de broadcast propio; para salir de él hace falta capa 3.",
          explicacion: "Las VLAN aíslan el tráfico de capa 2. Para comunicarlas entre sí o con otros segmentos hay que enrutar en capa 3, tarea de un router (o de un switch multicapa)."
        }
      ]
    },
    {
      id: "fase2",
      orden: 2,
      titulo: "Siguiendo las pistas",
      conceptoGeneral: "Análisis del tráfico",
      pieza: "El análisis de los registros y las capturas deja algo en claro: el incidente no fue un fallo accidental. Alguien recorrió la red de NEXUS barriendo puertos y preguntando por cada equipo, como quien revisa expedientes antes de actuar. Hay tráfico anómalo dentro de la infraestructura y apunta a un origen interno. La investigación continúa.",
      desafios: [
        {
          id: "f2-01",
          tipo: "evidencias",
          concepto: "Capa de transporte",
          pregunta: "En la captura de la madrugada, el tráfico hacia los servidores de NEXUS empieza con la secuencia SYN, SYN-ACK, ACK. ¿En qué capa del modelo TCP/IP se establece esa conexión y qué garantiza ese intercambio?",
          opciones: ["Acceso a red", "Internet", "Transporte", "Aplicación"],
          respuestaCorrecta: 2,
          pista: "TCP vive en la capa que segmenta los datos y garantiza la entrega confiable extremo a extremo.",
          explicacion: "La capa de transporte (TCP en TCP/IP) abre la conexión con el handshake SYN / SYN-ACK / ACK y garantiza la entrega confiable y ordenada de los datos.",
          datos: {
            evidencias: [
              {
                titulo: "Captura del inicio de conexión",
                detalle: "#  Origen            Destino         Info\n1  PC-Marketing       Servidor HTTP   TCP 49152 -> 80 [SYN] Seq=0\n2  Servidor HTTP      PC-Marketing    TCP 80 -> 49152 [SYN,ACK] Seq=0 Ack=1\n3  PC-Marketing       Servidor HTTP   TCP 49152 -> 80 [ACK] Seq=1 Ack=1"
              }
            ]
          }
        },
        {
          id: "f2-02",
          tipo: "evidencias",
          concepto: "Resolución de direcciones",
          pregunta: "Un equipo nuevo resolvió `archivos.nexus.local` a una dirección IP y, en paralelo, otra PC recibió su configuración de red sin intervención manual. ¿Qué dos protocolos participaron en esos procesos?",
          opciones: ["ARP y NetBIOS", "DNS y DHCP", "Solo DNS", "Solo ARP"],
          respuestaCorrecta: 1,
          pista: "Uno traduce nombres de dominio a IP; el otro entrega IP, máscara y puerta de enlace automáticamente.",
          explicacion: "DNS traduce el nombre `archivos.nexus.local` a una dirección IP, y DHCP entrega la configuración de red (IP, máscara, puerta de enlace, DNS) mediante el ciclo DISCOVER / OFFER / REQUEST / ACK.",
          datos: {
            evidencias: [
              {
                titulo: "Salida de nslookup",
                detalle: "> nslookup archivos.nexus.local\nServidor:   dns.nexus.local (192.168.1.10)\nNombre:     archivos.nexus.local\nDirecciones:  192.168.10.20"
              },
              {
                titulo: "Registro del servidor DHCP",
                detalle: "[10:00:01] DISCOVER  PC-Marketing solicita configuracion\n[10:00:01] OFFER     Ofrece  192.168.10.40 / 255.255.255.0 / gw 192.168.10.1\n[10:00:01] REQUEST   PC-Marketing acepta 192.168.10.40\n[10:00:01] ACK       Asignacion confirmada (concesion 24 h)"
              }
            ]
          }
        },
        {
          id: "f2-03",
          tipo: "evidencias",
          concepto: "Puertos y servicios",
          pregunta: "En la tabla de conexiones, el equipo analizado mantiene varias sesiones activas contra el mismo servidor, cada una asociada a un servicio distinto. ¿Qué dato de la conexión te permite identificar a qué servicio se dirige cada sesión?",
          opciones: [
            "El puerto remoto (extremo del servidor)",
            "La IP de origen del equipo",
            "La cantidad de paquetes enviados",
            "No se puede saber sin descifrar el tráfico"
          ],
          respuestaCorrecta: 0,
          pista: "Fijate en el extremo remoto: 80 es HTTP y 445 es compartir archivos (SMB).",
          explicacion: "En la pareja IP:puerto, el puerto remoto identifica el servicio del servidor: 80 (HTTP), 445 (SMB, archivos compartidos) y 389 (LDAP). El puerto local suele ser temporal.",
          datos: {
            evidencias: [
              {
                titulo: "Salida de netstat -n",
                detalle: "Proto  Direccion local          Direccion remota         Estado\nTCP    192.168.10.40:49155     192.168.1.10:445         ESTABLISHED\nTCP    192.168.10.40:49156     192.168.1.150:80        ESTABLISHED\nTCP    192.168.10.40:49157     192.168.1.10:389        ESTABLISHED"
              }
            ]
          }
        },
        {
          id: "f2-04",
          tipo: "evidencias",
          concepto: "Tráfico anómalo",
          pregunta: "El resumen del análisis marca esta actividad como sospechosa pese a que no se descargó ningún archivo: decenas de SYN a puertos distintos en segundos y consultas ARP por cada IP de la LAN. ¿Qué comportamiento describe ese tráfico?",
          opciones: [
            "Un barrido de puertos (port scan)",
            "Una copia de seguridad programada",
            "Una videollamada del equipo de Marketing",
            "El reinicio del servidor DNS"
          ],
          respuestaCorrecta: 0,
          pista: "Muchos SYN a puertos distintos sin completar el handshake no es un uso normal de la red.",
          explicacion: "Enviar SYN a todo el rango de puertos y consultar ARP por cada IP de la LAN es típico de un escaneo de reconocimiento: alguien releva qué servicios existen antes de atacar.",
          datos: {
            evidencias: [
              {
                titulo: "Resumen de análisis 02:30 - 02:45",
                detalle: "Paquetes SYN desde 192.168.30.7 hacia el servidor 192.168.1.10\ndirigidos a todos los puertos (1-1024) en 40 segundos,\nsin completar el handshake.\nAdemás: solicitudes ARP desde 192.168.30.7\npreguntando por cada dirección IP de la LAN."
              }
            ]
          }
        }
      ]
    },
    {
      id: "fase3",
      orden: 3,
      titulo: "El ataque",
      conceptoGeneral: "Origen y contención",
      pieza: "El origen quedó al descubierto: un equipo interno con el escritorio remoto (RDP) expuesto y credenciales débiles, alcanzable por una regla del firewall. Con los parches aplicados, el puerto cerrado, las credenciales renovadas y la DMZ segmentada, el tráfico anómalo se detuvo. La infraestructura vuelve a estar bajo control: caso resuelto.",
      desafios: [
        {
          id: "f3-01",
          tipo: "evidencias",
          concepto: "Punto vulnerable",
          pregunta: "Analizando las reglas del firewall contra el escaneo detectado en la Fase 2, ¿qué componente permitió que el atacante entrara a la red?",
          opciones: [
            "El servidor web de la DMZ",
            "El escritorio remoto (RDP) expuesto en un equipo interno",
            "El switch de acceso",
            "El punto de acceso de los invitados"
          ],
          respuestaCorrecta: 1,
          pista: "La regla deja pasar el puerto 3389 hacia un equipo interno y el log muestra intentos de acceso repetidos.",
          explicacion: "Una regla habilitaba el puerto 3389 (RDP) hacia un equipo interno con credenciales débiles: el escaneo de la Fase 2 lo descubrió y el atacante entró por allí.",
          datos: {
            evidencias: [
              {
                titulo: "Reglas del firewall",
                detalle: "PERMITIR  TCP * -> 203.0.113.5:80     (web DMZ)\nPERMITIR  TCP 192.168.30.7 -> 192.168.1.50:3389  (RDP)\nPERMITIR  TCP * -> vpn.nexus.local:443\nDENEGAR   RESTANTE"
              },
              {
                titulo: "Registro de accesos 02:45 - 02:50",
                detalle: "[02:45:12] Intento de inicio de sesion 192.168.30.7 -> 192.168.1.50:3389 (fallo)\n[02:45:14] Intento de inicio de sesion 192.168.30.7 -> 192.168.1.50:3389 (fallo)\n[02:46:01] Inicio de sesion exitoso 192.168.30.7 -> 192.168.1.50:3389\n[02:46:03] Ejecucion de comandos remotos"
              }
            ]
          }
        },
        {
          id: "f3-02",
          tipo: "opcion_multiple",
          concepto: "Firewall",
          pregunta: "Con el incidente ya encima, el firewall de NEXUS permitía acceder al puerto 3389 de un equipo interno desde cualquier IP de la red. ¿Qué práctica de firewall evita que un incidente así vuelva a ocurrir?",
          opciones: [
            "Abrir solo los puertos imprescindibles hacia equipos específicos",
            "Publicar más servicios hacia la LAN",
            "Desactivar las reglas para no bloquear el tráfico",
            "Usar el mismo puerto en toda la red interna"
          ],
          respuestaCorrecta: 0,
          pista: "Principio de mínimo privilegio: exponer solo lo necesario y solo a quien lo necesita.",
          explicacion: "El principio de mínimo privilegio indica abrir solo los puertos necesarios y acotarlos a equipos específicos; exponer servicios como el 3389 desde Internet hacia la LAN interna fue el vector que permitió el ataque."
        },
        {
          id: "f3-03",
          tipo: "contencion",
          concepto: "Contención",
          pregunta: "Elegí el plan de contención más completo: marcá todas las medidas que correspondan y evitá las que agraven la situación.",
          opciones: ["Ninguna"],
          respuestaCorrecta: 0,
          pista: "Se corta el acceso al equipo comprometido, se elimina el vector y se recupera el control del perímetro.",
          explicacion: "Contener exige aislar el equipo comprometido, parchear el vector (RDP), renovar credenciales y reconfigurar el firewall; apagar el sistema de seguridad o borrar evidencia agrava la situación.",
          datos: {
            medidas: [
              "Desconectar de la red el equipo 192.168.1.50 comprometido",
              "Cerrar el puerto 3389 en el firewall y quitar la regla",
              "Aplicar los parches de seguridad pendientes",
              "Renovar contraseñas de cuentas internas y de administrador",
              "Apagar el firewall para no bloquear el tráfico bueno",
              "Borrar los registros para que la red vuelva a andar rápido"
            ],
            correctas: [0, 1, 2, 3]
          }
        },
        {
          id: "f3-04",
          tipo: "evidencias",
          concepto: "Incidente",
          pregunta: "Con el tráfico ya contenido, ¿qué conclusión cierra el caso con la evidencia recolectada en las tres fases?",
          opciones: [
            "El atacante ingresó desde Internet usando el RDP expuesto de un equipo interno",
            "La caída se debió a un pico de videollamadas del Marketing",
            "Un reinicio del servidor DNS causó todo el incidente",
            "El switch se apagó por un rayo y nunca hubo intención maliciosa"
          ],
          respuestaCorrecta: 0,
          pista: "El escaneo de la Fase 2, el log de acceso exitoso y la regla del 3389 apuntan al mismo lugar.",
          explicacion: "La evidencia completa encaja: el escaneo (Fase 2) relevó el puerto 3389, la regla lo dejaba pasar hacia un equipo interno y el log registra el acceso exitoso: el incidente entró por el RDP expuesto.",
          datos: {
            evidencias: [
              {
                titulo: "Línea de tiempo consolidada",
                detalle: "02:30 - 02:45  Escaneo de puertos desde 192.168.30.7 (Fase 2)\n02:45:12       Intentos de acceso al puerto 3389 (RDP)\n02:46:01       Acceso exitoso al equipo interno 192.168.1.50\n02:46 - 03:00  Ejecucion de comandos y propagacion por la LAN\n03:00          Contencion aplicada y trafico normalizado"
              }
            ]
          }
        }
      ]
    }
  ]
};