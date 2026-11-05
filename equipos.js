/**
 * ====================================================================
 * REGISTRO OFICIAL DE EQUIPOS Y PARTICIPANTES
 * Hackathon ENEISOFT XVI 2026 — FISI · UNMSM
 * ====================================================================
 * 
 * Estructura de Datos Oficial:
 * Mapeo de los 12 equipos clasificados y la lista exhaustiva de correos
 * autorizados de sus integrantes. Cualquier integrante registrado de un
 * equipo puede emitir el voto único representativo.
 */

const baseEquipos = [
  {
    nombre: "Claude's Heritage",
    correos: [
      "ghostbain@gmail.com",
      "carlo.calistro@unmsm.edu.pe",
      "erick.garciam@unmsm.edu.pe"
    ]
  },
  {
    nombre: "KAB",
    correos: [
      "kiara.jaramillor@unmsm.edu.pe",
      "alexandra.mkoos@gmail.com",
      "antonella.rojasq@unmsm.edu.pe"
    ]
  },
  {
    nombre: "Magna FISI",
    correos: [
      "joaquin.almonacidv@unmsm.edu.pe",
      "franchis16bm@gmail.com",
      "sebasfernandezc21@gmail.com"
    ]
  },
  {
    nombre: "FIEELON",
    correos: [
      "karla.montesm@unmsm.edu.pe",
      "aldo.ruizc@unmsm.edu.pe",
      "erik.espinel@unmsm.edu.pe"
    ]
  },
  {
    nombre: "Los Hijos de Sam Altman",
    correos: [
      "josuesalazarchamorro4@gmail.com",
      "adrianonavarrog@gmail.com",
      "bryandiego.ia@gmail.com"
    ]
  },
  {
    nombre: "QuantumByte",
    correos: [
      "yalledavid140705@gmail.com",
      "leosait.24@gmail.com",
      "arcilamarco766@gmail.com"
    ]
  },
  {
    nombre: "Spookytech",
    correos: [
      "vivianafloresmontes25@gmail.com",
      "sergioascurra.27102005@gmail.com",
      "peraltacenepoemily@gmail.com"
    ]
  },
  {
    nombre: "Equipo Alfa Buena Maravilla Onda Dinamita Escuadrón Lobo",
    correos: [
      "fernandokarlos7@gmail.com",
      "abigailrebe020520@gmail.com",
      "josephangielos@gmail.com"
    ]
  },
  {
    nombre: "kAIzen",
    correos: [
      "alexander.zavala@unmsm.edu.pe",
      "jeremy.duran@unmsm.edu.pe",
      "paolo.canelo@unmsm.edu.pe"
    ]
  },
  {
    nombre: "Andromeda",
    correos: [
      "marlonmoralesjapa@gmail.com",
      "pierodiaz29@gmail.com",
      "matias.cerquina@unmsm.edu.pe"
    ]
  },
  {
    nombre: "Cuatro Ojos, Mil Líneas",
    correos: [
      "danielaporras190@gmail.com",
      "paolobruce3@gmail.com",
      "josemcastroac@gmail.com"
    ]
  },
  {
    nombre: "Los amigos de Carlos Miguel",
    correos: [
      "braulio.saldana@unmsm.edu.pe",
      "sebastian.rojas6@unmsm.edu.pe",
      "carlos.espinoza24@unmsm.edu.pe"
    ]
  }
];

// Alias para exportación o compatibilidad global
const EQUIPOS = baseEquipos;
