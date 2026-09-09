window.CONTENIDO = {
  version: 1,
  fases: [
    {
      id: "fase1",
      orden: 1,
      titulo: "La escena del crimen",
      conceptoGeneral: "Reconstrucción de la infraestructura",
      pieza: "Intentás reconstruir la red de NEXUS Corp a partir de las evidencias encontradas en la sala de servidores.",
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
        }
      ]
    },
    {
      id: "fase2",
      orden: 2,
      titulo: "Siguiendo las pistas",
      conceptoGeneral: "Análisis del tráfico",
      pieza: "Analizás configuraciones, registros y capturas para entender cómo se comunican los equipos.",
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
      pieza: "Identificás el origen del incidente y decidís cómo contenerlo para recuperar el control.",
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