(function () {
  "use strict";

  // T-27 - Logros derivados de las estadisticas de la partida (no se guardan:
  // son deducibles del estado guardado en `localStorage`).

  function totalPuntosPosibles() {
    var total = 0;
    for (var i = 0; i < window.CONTENIDO.fases.length; i++) {
      total += window.CONTENIDO.fases[i].desafios.length * window.Puntaje.PUNTOS_BASE;
    }
    return total;
  }

  function listar(estado) {
    var resueltos = estado.resueltos.length;
    var pistasUsadas = window.Pistas.contarUsadas(estado);
    var fasesCompletadas = estado.fasesCompletadas.length;
    var proporcion = totalPuntosPosibles() === 0 ? 0 : estado.puntaje / totalPuntosPosibles();

    return [
      {
        id: "primera-pista-encontrada",
        nombre: "Primera pista",
        descripcion: "Resolver el primer desafío.",
        desbloqueado: resueltos >= 1
      },
      {
        id: "escena-reconstruida",
        nombre: "Escena reconstruida",
        descripcion: "Completar la Fase 1: el mapa de la red.",
        desbloqueado: estado.fasesCompletadas.indexOf("fase1") !== -1
      },
      {
        id: "explorador-de-trafico",
        nombre: "Explorador de tráfico",
        descripcion: "Resolver 5 desafíos de la investigación.",
        desbloqueado: resueltos >= 5
      },
      {
        id: "operacion-limpia",
        nombre: "Operación limpia",
        descripcion: "Completar una investigación sin usar pistas.",
        desbloqueado: resueltos > 0 && pistasUsadas === 0
      },
      {
        id: "punto-vulnerable-encontrado",
        nombre: "Punto vulnerable",
        descripcion: "Llegar a la Fase 3 (El ataque).",
        desbloqueado: estado.fasesCompletadas.indexOf("fase3") !== -1 || estado.faseActual === "fase3"
      },
      {
        id: "caso-cerrado",
        nombre: "Caso cerrado",
        descripcion: "Completar las 3 fases del caso NEXUS.",
        desbloqueado: fasesCompletadas === window.CONTENIDO.fases.length
      },
      {
        id: "comisario-de-redes",
        nombre: "Comisario de redes",
        descripcion: "Alcanzar el rango máximo de detective.",
        desbloqueado: proporcion >= 0.9
      }
    ];
  }

  window.Logros = {
    listar: listar
  };
})();