// Contenido educativo del juego: fases, desafios y evidencias (window.CONTENIDO).
// Se puede editar sin tocar la logica; los tipos de desafio los resuelve js/motor.js.
window.CONTENIDO = {
  version: 3,
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
          tipo: "opcion_multiple",
          concepto: "Hub",
          pregunta: "Durante la reconstrucción encontrás un dispositivo que reenvía cada trama a todos sus puertos por igual, sin filtrar el destino. ¿Qué dispositivo es?",
          opciones: ["Router", "Gateway", "Hub", "Switch"],
          respuestaCorrecta: 2,
          pista: "Trabaja en capa 1: repite la señal sin leer la dirección de destino.",
          explicacion: "El Hub es un dispositivo de capa física que repite las tramas a todos los puertos, por lo que el tráfico alcanza a todos los equipos del segmento."
        },
        {
          id: "f1-02",
          tipo: "opcion_multiple",
          concepto: "Switch",
          pregunta: "Otro equipo conecta varias PC dentro de la misma LAN y envía cada trama únicamente al puerto del destinatario. ¿Cómo se llama?",
          opciones: ["Hub", "Switch", "Router", "Modem"],
          respuestaCorrecta: 1,
          pista: "Opera en capa 2 y usa la dirección MAC para decidir el puerto de salida.",
          explicacion: "El Switch trabaja en la capa de enlace de datos: aprende las direcciones MAC y entrega la trama solo por el puerto correcto, reduciendo colisiones."
        },
        {
          id: "f1-03",
          tipo: "opcion_multiple",
          concepto: "VLAN",
          pregunta: "Necesitás separar los equipos de Contabilidad y Marketing en redes lógicas distintas sin comprar nuevo hardware. ¿Qué tecnología permite segmentar el switch en redes virtuales?",
          opciones: ["VLAN", "DMZ", "VPN", "ARP"],
          respuestaCorrecta: 0,
          pista: "Es una 'LAN virtual': aísla el tráfico dentro del mismo switch físico.",
          explicacion: "Una VLAN divide físicamente a un switch en varias redes lógicas. Los equipos de VLAN distintas no se ven entre sí salvo que haya routing."
        },
        {
          id: "f1-04",
          tipo: "opcion_multiple",
          concepto: "Topología",
          pregunta: "Al dibujar la red descubrís que todos los equipos están conectados a un mismo cable central compartido. ¿Qué topología física es?",
          opciones: ["Estrella", "Bus", "Anillo", "Malla"],
          respuestaCorrecta: 1,
          pista: "Todos los dispositivos comparten un único medio de transmisión.",
          explicacion: "En la topología de bus todos los nodos comparten un cable único. En la de estrella todo se conecta a un dispositivo central."
        },
        {
          id: "f1-05",
          tipo: "opcion_multiple",
          concepto: "Router",
          pregunta: "En el rack, un equipo decide por qué camino sale cada paquete hacia el proveedor de Internet y une la LAN con la WAN. ¿Qué dispositivo es?",
          opciones: ["Switch", "Hub", "Router", "Repeatedor"],
          respuestaCorrecta: 2,
          pista: "Puede leer direcciones IP y enrutar paquetes entre redes distintas.",
          explicacion: "El Router opera en capa 3: enruta paquetes entre redes (LAN/WAN) analizando las direcciones IP y eligiendo la mejor ruta."
        },
        {
          id: "f1-06",
          tipo: "opcion_multiple",
          concepto: "Gateway",
          pregunta: "Los PC de la LAN envían todo el tráfico destinado a otras redes hacia la IP 192.168.1.1. ¿Qué rol cumple ese equipo?",
          opciones: ["Servidor DNS", "Gateway (puerta de enlace)", "Servidor DHCP", "Hub"],
          respuestaCorrecta: 1,
          pista: "Es la puerta de salida de la red: todo tráfico hacia otras redes pasa primero por ella.",
          explicacion: "El Gateway es la puerta de enlace predeterminada: recibe el tráfico de la LAN hacia redes externas y lo reenvía al siguiente salto."
        },
        {
          id: "f1-07",
          tipo: "opcion_multiple",
          concepto: "LAN/WAN",
          pregunta: "La red que une la sede principal de NEXUS con sus sucursales a través de operadores, abarcando grandes distancias, ¿qué tipo de red es?",
          opciones: ["LAN", "VLAN", "PAN", "WAN"],
          respuestaCorrecta: 3,
          pista: "Una red de área amplia interconecta redes locales geográficamente distantes.",
          explicacion: "La WAN (red de área amplia) conecta LANs a gran escala mediante operadores. La LAN es local, como la red interna del edificio."
        },
        {
          id: "f1-08",
          tipo: "reconstruccion",
          concepto: "Topología",
          pregunta: "Reconstruí el mapa de red troncal de NEXUS Corp: tocá una placa y luego el lugar del mapa donde corresponde. Cuando esté listo, verificá.",
          opciones: ["Ninguna"],
          respuestaCorrecta: 0,
          pista: "El Router da salida hacia el ISP, el Switch concentra la LAN, el Gateway es la puerta hacia otras redes y las PC forman los segmentos de usuarios.",
          explicacion: "El mapa queda reconstruido: el Router enruta hacia el ISP, el Switch organiza la LAN, el Gateway da salida hacia otras redes y las PC se agrupan en segmentos de usuarios.",
          datos: {
            piso: "Mapa troncal de NEXUS Corp",
            zonas: [
              { id: "wan", titulo: "Hacia el proveedor (WAN)" },
              { id: "nucleo", titulo: "Núcleo central" },
              { id: "segmento", titulo: "Segmento de usuarios (LAN)" }
            ],
            opciones: ["Router", "Switch", "Gateway", "PC Contabilidad", "PC Marketing", "Hub"],
            nodos: [
              { id: "nodo-router", zona: "wan", etiquetaCorrecta: "Router" },
              { id: "nodo-switch", zona: "nucleo", etiquetaCorrecta: "Switch" },
              { id: "nodo-gateway", zona: "nucleo", etiquetaCorrecta: "Gateway" },
              { id: "nodo-pc1", zona: "segmento", etiquetaCorrecta: "PC Contabilidad" },
              { id: "nodo-pc2", zona: "segmento", etiquetaCorrecta: "PC Marketing" }
            ]
          }
        },
        {
          id: "f1-09",
          tipo: "opcion_multiple",
          concepto: "Segmento",
          pregunta: "Contabilidad está en una VLAN y Marketing en otra del mismo switch. ¿Pueden comunicarse directamente?",
          opciones: ["Sí, porque comparten el switch", "Sí, porque están en la misma LAN", "No, necesitan un router para enrutar entre VLAN", "No, nunca pueden comunicarse"],
          respuestaCorrecta: 2,
          pista: "Las VLAN aíslan dominios de broadcast: cruzar entre ellas exige capa 3.",
          explicacion: "Equipos en VLAN distintas forman dominios de broadcast separados: no se ven entre sí ni se comunican sin un router que enrute entre VLAN."
        },
        {
          id: "f1-10",
          tipo: "opcion_multiple",
          concepto: "Topología",
          pregunta: "En tu esquema troncal, todos los equipos del segmento llegan al switch central y el router cuelga de ese mismo switch. ¿Qué topología describe el núcleo?",
          opciones: ["Bus", "Estrella", "Anillo", "Malla completa"],
          respuestaCorrecta: 1,
          pista: "Todos los nodos se conectan a un dispositivo central.",
          explicacion: "La topología en estrella centra las conexiones en un dispositivo (switch o hub): es simple de administrar y tolerante a la caída de un nodo."
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
          tipo: "opcion_multiple",
          concepto: "Modelo TCP/IP",
          pregunta: "En una captura de tráfico ves que TCP reordena y verifica los datos antes de pasarlos a la aplicación. ¿En qué capa del modelo TCP/IP trabaja TCP?",
          opciones: ["Acceso a red", "Internet", "Transporte", "Aplicación"],
          respuestaCorrecta: 2,
          pista: "Esta capa segmenta los datos y garantiza la entrega confiable extremo a extremo.",
          explicacion: "La capa de transporte (TCP en TCP/IP) es responsable de la entrega confiable, el control de flujo y la corrección de errores mediante segmentos."
        },
        {
          id: "f2-02",
          tipo: "evidencias",
          concepto: "Modelo OSI",
          pregunta: "Según el esquema de capas, el enrutamiento entre redes es trabajo de la capa 3 (Red). ¿Qué capa del modelo OSI administra la entrega confiable punto a punto de los datos con TCP?",
          opciones: ["Capa 2 (Enlace)", "Capa 3 (Red)", "Capa 4 (Transporte)", "Capa 7 (Aplicación)"],
          respuestaCorrecta: 2,
          pista: "Es la capa donde vive TCP: segmenta y garantiza la entrega confiable.",
          explicacion: "La capa de transporte (nivel 4 del modelo OSI) segmenta los datos y garantiza la entrega confiable extremo a extremo; TCP es su protocolo típico.",
          datos: {
            evidencias: [
              {
                titulo: "Esquema de capas OSI",
                detalle: "Capa 7  Aplicación  ->  HTTP, DNS, correo\nCapa 4  Transporte   ->  TCP, UDP\nCapa 3  Red          ->  IP, enrutamiento\nCapa 2  Enlace       ->  MAC, switch\nCapa 1  Física       ->  cables, hub"
              }
            ]
          }
        },
        {
          id: "f2-03",
          tipo: "evidencias",
          concepto: "ARP",
          pregunta: "La tabla asocia cada dirección IP de la LAN con una dirección física. ¿Qué protocolo construye esta tabla resolviendo IP a MAC?",
          opciones: ["ARP", "DHCP", "DNS", "NetBIOS"],
          respuestaCorrecta: 0,
          pista: "Pregunta la dirección MAC de una IP dentro de la misma LAN.",
          explicacion: "ARP traduce direcciones IP (capa 3) a direcciones MAC (capa 2) dentro de la LAN, y la tabla se consulta con `arp -a`.",
          datos: {
            evidencias: [
              {
                titulo: "Salida de arp -a",
                detalle: "Dirección IP       Dirección física\n192.168.1.1        aa:bb:cc:11:22:33\n192.168.1.50       44:55:66:aa:bb:cc\n192.168.1.10       99:88:77:cc:aa:00"
              }
            ]
          }
        },
        {
          id: "f2-04",
          tipo: "evidencias",
          concepto: "DHCP",
          pregunta: "El registro muestra cómo una PC nueva de Marketing se unió a la red con dirección y puerta de enlace automáticas. ¿Qué protocolo entregó la configuración IP?",
          opciones: ["DNS", "DHCP", "ARP", "NetBIOS"],
          respuestaCorrecta: 1,
          pista: "Es el servicio que asigna IP, máscara y puerta de enlace automáticamente al encender el equipo.",
          explicacion: "DHCP asigna automáticamente dirección IP, máscara, puerta de enlace y DNS mediante el ciclo DISCOVER / OFFER / REQUEST / ACK.",
          datos: {
            evidencias: [
              {
                titulo: "Registro del servidor DHCP",
                detalle: "[10:00:01] DISCOVER  PC-Marketing solicita configuración\n[10:00:01] OFFER     Ofrece  192.168.10.40 / 255.255.255.0 / gw 192.168.10.1\n[10:00:01] REQUEST   PC-Marketing acepta 192.168.10.40\n[10:00:01] ACK       Asignación confirmada (concesión 24 h)"
              }
            ]
          }
        },
        {
          id: "f2-05",
          tipo: "evidencias",
          concepto: "DNS",
          pregunta: "La herramienta respondió a un nombre interno como `archivos.nexus.local`. ¿Qué protocolo resolvió ese nombre de host a una dirección IP?",
          opciones: ["NetBIOS", "DHCP", "DNS", "ARP"],
          respuestaCorrecta: 2,
          pista: "Traduce nombres de dominio a direcciones IP.",
          explicacion: "DNS convierte nombres de dominio en direcciones IP, permitiendo a los clientes acceder a los servicios por nombre.",
          datos: {
            evidencias: [
              {
                titulo: "Salida de nslookup",
                detalle: "> nslookup archivos.nexus.local\nServidor:  dns.nexus.local (192.168.1.10)\nNombre:    archivos.nexus.local\nDirecciones:  192.168.10.20"
              }
            ]
          }
        },
        {
          id: "f2-06",
          tipo: "evidencias",
          concepto: "TCP Flags",
          pregunta: "Al iniciar la comunicación aparece la secuencia SYN, SYN-ACK, ACK. ¿En qué capa se establece la conexión usando estos flags de TCP?",
          opciones: ["Transporte", "Física", "Internet", "Aplicación"],
          respuestaCorrecta: 0,
          pista: "TCP pertenece a la capa que garantiza la entrega confiable.",
          explicacion: "El protocolo de tres pasos ocurre en la capa de transporte: SYN inicia, SYN-ACK responde y ACK confirma el canal de datos.",
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
          id: "f2-07",
          tipo: "evidencias",
          concepto: "NetBIOS",
          pregunta: "La herramienta muestra los nombres NetBIOS registrados de un equipo de la LAN. ¿Para qué se usan estos nombres?",
          opciones: [
            "Para identificar equipos y servicios dentro de la LAN",
            "Para enrutar paquetes hacia otras redes",
            "Para asignar direcciones IP automáticamente",
            "Para resolver nombres de dominio públicos"
          ],
          respuestaCorrecta: 0,
          pista: "Antes del DNS interno, las LAN se identificaban por estos nombres.",
          explicacion: "NetBIOS provee un espacio de nombres de la LAN (nombres de equipos y servicios) usado históricamente por Windows; los sufijos como <00> o <20> indican estación o servicio compartido.",
          datos: {
            evidencias: [
              {
                titulo: "Salida de nbtstat -n",
                detalle: "Nombre          Tipo     Estado\nNEXUS-PC-7      <00>     Registrado\nTRABAJO         <20>     Registrado\nNEXUS-DOM       <00>     Registrado"
              }
            ]
          }
        },
        {
          id: "f2-08",
          tipo: "evidencias",
          concepto: "TCP/IP",
          pregunta: "En la tabla de conexiones, el equipo mantiene dos sesiones activas. ¿Qué criterio identifica al servicio con el que se comunica cada conexión?",
          opciones: [
            "El puerto local del equipo",
            "El puerto remoto indica el servicio del servidor",
            "La IP de origen define el servicio",
            "No se puede saber sin decodificar el tráfico"
          ],
          respuestaCorrecta: 1,
          pista: "Fijate en el extremo remoto: 80 es HTTP y 445 es compartir archivos (SMB).",
          explicacion: "En la pareja IP:puerto, el puerto remoto identifica el servicio del servidor: 80 (HTTP) y 445 (compartir archivos SMB). El puerto local suele ser temporal.",
          datos: {
            evidencias: [
              {
                titulo: "Salida de netstat -n",
                detalle: "Proto  Dirección local          Dirección remota         Estado\nTCP    192.168.10.40:49155     192.168.1.10:445         ESTABLISHED\nTCP    192.168.10.40:49156     192.168.1.150:80        ESTABLISHED\nTCP    192.168.10.40:49157     192.168.1.10:389        ESTABLISHED"
              }
            ]
          }
        },
        {
          id: "f2-09",
          tipo: "evidencias",
          concepto: "TCP Flags",
          pregunta: "En la captura, los paquetes 3 y 4 corresponden a un intercambio entre la PC y el servidor web. ¿Qué describe ese intercambio?",
          opciones: [
            "El handshake TCP que abre la conexión hacia el servidor",
            "Una consulta DNS para resolver un nombre",
            "El cierre de una conexión ya establecida",
            "Una transmisión de datos del archivo solicitado"
          ],
          respuestaCorrecta: 0,
          pista: "SYN seguido de SYN,ACK es la forma en que TCP abre una conexión.",
          explicacion: "El par SYN / SYN-ACK es la apertura del handshake TCP: el cliente pide conectar y el servidor lo confirma antes de intercambiar datos.",
          datos: {
            evidencias: [
              {
                titulo: "Captura de tráfico (fragmento)",
                detalle: "#  Origen    Destino          Proto  Info\n1  PC        DNS 192.168.1.10 UDP  DNS query A www.nexus.com\n2  DNS       PC               UDP  DNS response 203.0.113.15\n3  PC        192.168.5.1      TCP  49152 -> 80 [SYN] Seq=0\n4  192.168.5.1 PC             TCP  80 -> 49152 [SYN,ACK] Seq=0 Ack=1"
              }
            ]
          }
        },
        {
          id: "f2-10",
          tipo: "evidencias",
          concepto: "Tráfico anómalo",
          pregunta: "El informe marca esta actividad como sospechosa aunque no se descargó ningún archivo. ¿Qué comportamiento evidencia este tráfico?",
          opciones: [
            "Una copia de seguridad automática",
            "Un barrido de puertos (port scan)",
            "Una videollamada del equipo de Marketing",
            "El reinicio programado del servidor"
          ],
          respuestaCorrecta: 1,
          pista: "Muchos SYN a puertos distintos sin completar el handshake no es un uso normal de la red.",
          explicacion: "Enviar SYN a todo el rango de puertos en segundos y consultar ARP por cada IP de la LAN es típico de un escaneo de reconocimiento: alguien releva qué servicios existen antes de atacar.",
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
          tipo: "opcion_multiple",
          concepto: "Firewall",
          pregunta: "Para filtrar el tráfico entre la red interna y la externa, NEXUS Corp quiere aprobar o denegar conexiones por dirección y puerto. ¿Qué dispositivo configurás?",
          opciones: ["Switch", "Firewall", "Hub", "Repeatedor"],
          respuestaCorrecta: 1,
          pista: "Aplica reglas de permitir/denegar según dirección, puerto o aplicación.",
          explicacion: "El firewall inspecciona el tráfico entrante y saliente y aplica políticas definidas por reglas. Es la barrera típica entre la LAN y la WAN."
        },
        {
          id: "f3-02",
          tipo: "evidencias",
          concepto: "DMZ",
          pregunta: "El servidor web público está en una red separada con acceso selectivo desde Internet. ¿Cómo se llama esa zona perimetral?",
          opciones: ["DMZ", "VPN", "VLAN de usuarios", "Capa 2"],
          respuestaCorrecta: 0,
          pista: "Zona desmilitarizada: publica servicios hacia afuera sin exponer la LAN completa.",
          explicacion: "La DMZ (zona desmilitarizada) aloja servicios públicos como web o correo: el firewall solo permite el tráfico necesario hacia ella y la aísla de la red interna.",
          datos: {
            evidencias: [
              {
                titulo: "Diagrama de zonas del firewall",
                detalle: "WAN (Internet)\n   |\nFIREWALL\n   |--- DMZ:  web.nexus.com (203.0.113.5)\n   |         mail.nexus.com (203.0.113.6)\n   |--- LAN:  usuarios (192.168.x.x)"
              }
            ]
          }
        },
        {
          id: "f3-03",
          tipo: "evidencias",
          concepto: "VPN",
          pregunta: "Un auditor se conecta desde un hotel al servidor de archivos como si estuviera dentro de la LAN. ¿Qué tecnología crea ese túnel cifrado?",
          opciones: ["VPN", "VLAN", "DHCP", "STP"],
          respuestaCorrecta: 0,
          pista: "Extiende la red privada de forma cifrada por una red pública.",
          explicacion: "La VPN crea un túnel cifrado entre el cliente remoto y la empresa, extendiendo la red privada sobre una infraestructura pública como Internet.",
          datos: {
            evidencias: [
              {
                titulo: "Registro del cliente VPN",
                detalle: "[12:32:01] Conectando a vpn.nexus.local...\n[12:32:02] Túnel establecido (fase 1: IKE)\n[12:32:03] SA negociada - cifrado AES-256\n[12:32:04] Red interna alcanzable: 192.168.1.0/24"
              }
            ]
          }
        },
        {
          id: "f3-04",
          tipo: "evidencias",
          concepto: "OSPF",
          pregunta: "La tabla de rutas del router muestra dos caminos al mismo destino y elige el de menor costo. ¿Qué protocolo de enrutamiento dinámico construye esta tabla?",
          opciones: ["OSPF", "ARP", "NetBIOS", "STP"],
          respuestaCorrecta: 0,
          pista: "Enrutamiento dinámico de estado de enlace que calcula la mejor ruta por costo.",
          explicacion: "OSPF es un protocolo de enrutamiento dinámico de estado de enlace: propaga las redes conocidas y calcula la mejor ruta por costo para construir la tabla.",
          datos: {
            evidencias: [
              {
                titulo: "Tabla de rutas del router",
                detalle: "Destino          Siguiente salto      Costo\n192.168.10.0/24   192.168.1.2          10\n192.168.20.0/24   192.168.1.2          10\n0.0.0.0/0         192.168.1.1          1   (via OSPF)"
              }
            ]
          }
        },
        {
          id: "f3-05",
          tipo: "evidencias",
          concepto: "STP",
          pregunta: "El switch detecta dos enlaces redundantes a otro switch y bloquea uno para evitar el bucle. ¿Qué protocolo evita bucles en la capa 2?",
          opciones: ["STP", "OSPF", "DHCP", "ARP"],
          respuestaCorrecta: 0,
          pista: "Bloquea puertos redundantes hasta prevenir tramas en círculo.",
          explicacion: "Spanning Tree Protocol evita los bucles de capa 2: calcula un árbol sin ciclos y bloquea los puertos redundantes para que no circule la misma trama por siempre.",
          datos: {
            evidencias: [
              {
                titulo: "Registro del switch",
                detalle: "BPDU recibida en Gi0/2\nCambio de topologia detectado\nPuerto Gi0/2 bloqueado (Backup)\nRaiz de STP: 32768.aa-bb-cc-00-00-01"
              }
            ]
          }
        },
        {
          id: "f3-06",
          tipo: "opcion_multiple",
          concepto: "Tipos de enlace",
          pregunta: "Necesitás unir el edificio principal con otra sede a 5 km donde no se puede colocar cobre por interferencias eléctricas. ¿Qué medio de transmisión conviene?",
          opciones: ["UTP Cat 6", "Fibra óptica", "Coaxial", "Cable paralelo"],
          respuestaCorrecta: 1,
          pista: "Inmune a interferencias electromagnéticas y de larga distancia.",
          explicacion: "La fibra óptica transmite por luz, soporta grandes distancias y es inmune a interferencias electromagnéticas, ideal para enlaces inter-sede."
        },
        {
          id: "f3-07",
          tipo: "opcion_multiple",
          concepto: "Wireless",
          pregunta: "En la red inalámbrica del edificio hay una red de invitados. ¿Qué práctica separa correctamente a los visitantes de la red interna?",
          opciones: [
            "Compartir la contraseña de la red corporativa",
            "Crear una red Wi-Fi separada con acceso solo a Internet",
            "Desactivar el cifrado para simplificar",
            "Usar la misma VLAN que los empleados"
          ],
          respuestaCorrecta: 1,
          pista: "Los invitados no deberían alcanzar recursos internos de la empresa.",
          explicacion: "Una red de invitados separada (VLAN aparte y solo salida a Internet) aísla a los visitantes de los recursos internos."
        },
        {
          id: "f3-08",
          tipo: "evidencias",
          concepto: "Punto vulnerable",
          pregunta: "Comparando las reglas del firewall con el escaneo de la Fase 2, ¿qué componente permitió que el atacante accediera a la red?",
          opciones: [
            "El servidor web de la DMZ",
            "El escritorio remoto (RDP) expuesto en un equipo interno",
            "El switch de acceso",
            "El punto de acceso de los invitados"
          ],
          respuestaCorrecta: 1,
          pista: "La regla deja pasar el puerto 3389 hacia un equipo interno, y el log muestra intentos de acceso repetidos.",
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
          id: "f3-09",
          tipo: "contencion",
          concepto: "Contención",
          pregunta: "Elegí el plan de contención más completo: marcá todas las medidas que correspondan y evitá las que agraven la situación.",
          opciones: ["Ninguna"],
          respuestaCorrecta: 0,
          pista: "Se corta el acceso al equipo comprometido, se elimina el vector y se recupera el control del perímetro.",
          explicacion: "Contener exige aislar el equipo comprometido, parchear el vector (RDP), renovar credenciales y reconfigurar el firewall; apagar el servicio de seguridad o perder evidencia agrava la situación.",
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
          id: "f3-10",
          tipo: "evidencias",
          concepto: "Incidente",
          pregunta: "Con el tráfico ya contenido, ¿qué conclusión cierra el caso?",
          opciones: [
            "La caída se debió a un pico de videollamadas del Marketing",
            "El atacante ingresó desde Internet aprovechando el servicio RDP expuesto de un equipo interno",
            "Un reinicio del servidor DNS causó todo el incidente",
            "El switch se apagó por un rayo y nunca hubo intención maliciosa"
          ],
          respuestaCorrecta: 1,
          pista: "El escaneo de la Fase 2, el log de acceso exitoso y la regla del 3389 apuntan al mismo lugar.",
          explicacion: "La evidencia completa encaja: el escaneo (Fase 2) relevó el puerto 3389, la regla lo dejaba pasar hacia un equipo interno, y el log registra el acceso exitoso: el incidente entró por el RDP expuesto.",
          datos: {
            evidencias: [
              {
                titulo: "Línea de tiempo consolidada",
                detalle: "02:30 - 02:45  Escaneo de puertos desde 192.168.30.7 (Fase 2)\n02:45:12       Intentos de acceso al puerto 3389 (RDP)\n02:46:01       Acceso exitoso al equipo interno 192.168.1.50\n02:46 - 03:00  Ejecucion de comandos y propagacion por la LAN\n03:00          Contencion aplicada y tráfico normalizado"
              }
            ]
          }
        }
      ]
    }
  ]
};