# Fact-check: Detective de Redes

Verificacion tecnica de la informacion del juego (contenido v4, 12 desafios). Proposito: garantizar que los enunciados, evidencias, pistas y explicaciones sean correctos y no ensenen conceptos erroneos.

Fecha de revision: 2026-09-14
Archivo revisado: `data/contenido.js`

## Criterios y fuentes de referencia

| Tema | Fuente de referencia |
|------|----------------------|
| Modelo OSI y capas | ISO/IEC 7498-1; RFC 1122 (modelo Internet) |
| TCP / handshake | RFC 793 (TCP) y RFC 1180 (a TCP/IP tutorial) |
| ARP | RFC 826 |
| DHCP | RFC 2131 (DORA + prestamo/concesion) |
| DNS | RFC 1035 |
| VLAN | IEEE 802.1Q |
| Spanning Tree / BPDU | IEEE 802.1D |
| OSPF | RFC 2328 |
| RDP / puertos por defecto | IANA Service Name and Transport Protocol Port Number Registry |
| Direccionamiento test y privado | RFC 1918 (privadas), RFC 5737 (test) |
| Firewall / DMZ / minimo privilegio | NIST SP 800-41 (Guidelines on Firewalls and Firewall Policy) |
| VPN IPsec | RFC 6071 (IPsec/IKE overview) |
| Fibra optica / medios | Cisco CCNA 200-301 Oficial Cert Guide (obras de referencia de redes) |

## Verificacion por desafio

### Fase 1 - La escena del crimen

| # | Afirmacion clave | Veredicto | Nota / fuente |
|---|------------------|-----------|---------------|
| f1-01 | El Router da salida hacia el ISP (WAN) y enruta entre redes; el Switch concentra la LAN usando direcciones MAC; el Gateway es la puerta hacia otras redes (siguiente salto predeterminado); las PC forman segmentos de usuarios. | Correcto | Esquema simplificado pero clasico: router de borde hacia el ISP, switch de capa 2 con aprendizaje de MAC, gateway como default gateway. RFC 1812 (router), RFC 826/semantica de MAC en switches. |
| f1-01 | Placas "PC Contabilidad"/"PC Marketing" intercambiables dentro del mismo segmento (orden no relevante). | Correcto | Dos nodos equivalentes del mismo segmento: el orden de colocacion no cambia el diseno logico de la red. |
| f1-02 | El Switch (capa 2) aprende direcciones MAC y envia cada trama solo por el puerto del destinatario; el Hub repite la trama a todos los puertos. | Correcto | Puente/conmutacion IEEE 802.1D; el Hub opera en capa 1 y reenvia por todos los puertos (dominio de colision compartido). |
| f1-03 | Una VLAN divide un switch fisico en redes logicas con dominios de broadcast independientes; equipos de VLAN distintas no se ven entre si sin enrutamiento. | Correcto | IEEE 802.1Q; broadcast se limita a la VLAN (802.1Q, seccion de filtrado y puentes). |
| f1-04 | Para comunicar VLAN distintas se requiere enrutamiento de capa 3 (router o switch multicapa). | Correcto | Inter-VLAN routing; una VLAN no intercambia tramas con otra por capa 2 (802.1Q). |

### Fase 2 - Siguiendo las pistas

| # | Afirmacion clave | Veredicto | Nota / fuente |
|---|------------------|-----------|---------------|
| f2-01 | La conexion TCP se establece con SYN, SYN-ACK, ACK en la capa de transporte del modelo TCP/IP. | Correcto | RFC 793, apertura de conexion en 3 pasos; capa de transporte TCP/IP (RFC 1122). |
| f2-02 | DNS traduce `archivos.nexus.local` (nombre de dominio) a IP; DHCP entrega configuracion automatica (IP, mascara, gateway, DNS) con DISCOVER/OFFER/REQUEST/ACK. | Correcto | RFC 1035 (resolucion de nombres) y RFC 2131 (mensajes DORA, prestamo de 24 h tipico). |
| f2-03 | El puerto remoto identifica el servicio (80 HTTP, 445 SMB, 389 LDAP); el puerto local de origen suele ser efimero. | Correcto | IANA registry: tcp/80 http, tcp/445 microsoft-ds, tcp/389 ldap. Puertos efimeros: RFC 6056. |
| f2-04 | Decenas de SYN a puertos distintos en segundos + consultas ARP barriendo la LAN = escaneo de reconocimiento (port scan). | Correcto | Tecnica clasica de reconocimiento (scan SYN/medio abierto en Nmap); ARP sweep releva hosts de la LAN. |

### Fase 3 - El ataque

| # | Afirmacion clave | Veredicto | Nota / fuente |
|---|------------------|-----------|---------------|
| f3-01 | El puerto 3389 (RDP) abierto hacia un equipo interno via regla del firewall fue el vector de entrada. | Correcto | IANA registry: tcp/3389 ms-wbt-server (RDP). Firewall mal configurado como vector (NIST SP 800-41). |
| f3-02 | Principio de minimo privilegio: abrir solo los puertos imprescindibles y acotarlos a equipos especificos evita este tipo de incidente. | Correcto | NIST SP 800-41 (default deny, allow by exception). |
| f3-03 | Contencion: aislar el host comprometido, cerrar el vector (3389), parchear y rotar credenciales; apagar el firewall o borrar evidencia agrava la situacion. | Correcto | NIST SP 800-61 (respuesta a incidentes): erradicacion/recuperacion + preservacion de evidencia. |
| f3-04 | La conclusion del caso: el atacante entro desde Internet por el RDP expuesto de un equipo interno. | Correcto | Coherente con la evidencia de las fases 2 y 3 (scan -> regla 3389 -> log de acceso). |

## Notas sobre simplificaciones didacticas

- **Gateway como equipo propio**: en redes reales el rol de "gateway" lo cumple frecuentemente el router/firewall del borde. El juego lo presenta como un componente aparte para reforzar el concepto de *puerta de enlace predeterminada* (siguiente salto). Es una simplificacion aceptable y coherente.
- **VPN (regla `vpn.nexus.local:443`)**: la regla del firewall expuesta en f3-01 es coherente con terminales VPN SSL/TLS (comun uso del 443). No contradice el uso de IPsec/IKE para túneles de sitio fijo; ambuento valido para el caso.
- **Direcciones**: se usan rangos de documentacion (`203.0.113.0/24`, RFC 5737) y privados (`192.168.x.x`, RFC 1918) para no publicar direcciones reales de una organizacion.
- **Puerto 80 HTTP como servicio generico del servidor web**: la DMZ publica web en el puerto estandar 80; en produccion suele ir detras de un proxy/443, pero el ejemplo es valido didacticamente.

## Resultado

- **12/12 desafios verificados: Correctos.**
- No se detectaron afirmaciones tecnicas erroneas ni datos inventados en enunciados, evidencias, pistas o explicaciones.
- Las simplificaciones didacticas estan documentadas arriba para que el equipo pueda decidir si agregar disclaimers en pantalla.

> Correcciones aplicadas durante la revision: reescritura del contenido a 4 desafios por fase (v4). No fue necesario modificar ningun dato tecnico por error factico.