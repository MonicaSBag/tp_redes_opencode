window.CONTENIDO = {
  version: 2,
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
      pieza: "Encontraste evidencia de que existe tráfico anómalo dentro de la infraestructura: hay capturas con patrónes de paquetes que no deberían aparecer en la red de NEXUS.",
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
        }
      ]
    },
    {
      id: "fase3",
      orden: 3,
      titulo: "El ataque",
      conceptoGeneral: "Origen y contención",
      pieza: "Identificaste el origen del incidente, el punto vulnerable de la infraestructura y las medidas necesarias para contenerlo y recuperar el control.",
      desafios: [
        {
          id: "f3-01",
          tipo: "opcion_multiple",
          concepto: "Firewall",
          pregunta: "Para contener el ataque, NEXUS Corp quiere filtrar el tráfico entre la red interna y la externa. ¿Qué dispositivo debés configurar?",
          opciones: ["Switch", "Firewall", "Hub", "Repeatedor"],
          respuestaCorrecta: 1,
          pista: "Aplica reglas de permitir/denegar según dirección, puerto o aplicación.",
          explicacion: "El firewall inspecciona el tráfico entrante y saliente y aplica políticas de seguridad definidas por reglas. Es la barrera típica entre la LAN y la WAN."
        }
      ]
    }
  ]
};