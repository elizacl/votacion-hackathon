/**
 * ====================================================================
 * REGISTRO OFICIAL DE EQUIPOS Y PARTICIPANTES
 * Hackathon ENEISOFT XVI 2026 — FISI · UNMSM
 * ====================================================================
 * 
 * Estructura de Datos Obligatoria:
 * Mapeo de los 12 equipos clasificados y la lista exhaustiva de correos
 * autorizados de sus integrantes. Cualquier integrante registrado de un
 * equipo puede emitir el voto único representativo.
 */

const baseEquipos = [
  {
    nombre: "Claude's Heritage",
    correos: [
      "carlo.calistro@unmsm.edu.pe",
      "ghostbain@gmail.com",
      "erick.garciam@unmsm.edu.pe"
    ]
  },
  {
    nombre: "KAB",
    correos: [
      "alexandra.mkoos@gmail.com",
      "kiara.jaramillor@unmsm.edu.pe",
      "antonella.rojasq@unmsm.edu.pe"
    ]
  },
  {
    nombre: "Magna FISI",
    correos: [
      "franchis16bm@gmail.com",
      "joaquin.almonacidv@unmsm.edu.pe",
      "sebasfernandezc21@gmail.com"
    ]
  },
  {
    nombre: "FIEELON",
    correos: [
      "aldo.ruizc@unmsm.edu.pe",
      "karla.montesm@unmsm.edu.pe",
      "erik.espinel@unmsm.edu.pe"
    ]
  },
  {
    nombre: "Los Hijos de Sam Altman",
    correos: [
      "cesar.ayllon@unmsm.edu.pe",
      "gabriel.cabrerap@unmsm.edu.pe",
      "diego.riverao@unmsm.edu.pe"
    ]
  },
  {
    nombre: "Devs From The Future",
    correos: [
      "brayan.mamani@unmsm.edu.pe",
      "anthony.silvac@unmsm.edu.pe",
      "jostin.castillor@unmsm.edu.pe"
    ]
  },
  {
    nombre: "kAlzen",
    correos: [
      "eduardo.villajuan@unmsm.edu.pe",
      "jeremy.duran@unmsm.edu.pe",
      "anderson.sanchezs@unmsm.edu.pe"
    ]
  },
  {
    nombre: "Equipo Alfa Buena Maravilla Onda Dinamita Escuadrón Lobo",
    correos: [
      "leonardo.diazp@unmsm.edu.pe",
      "cesar.duran1@unmsm.edu.pe",
      "cristian.gutierrezq@unmsm.edu.pe"
    ]
  },
  {
    nombre: "Tech Titans",
    correos: [
      "cesar.romanc@unmsm.edu.pe",
      "jean.mendozar@unmsm.edu.pe",
      "carlos.diaz110@unmsm.edu.pe"
    ]
  },
  {
    nombre: "Cuatro Ojos, Mil Líneas",
    correos: [
      "bruno.quispev@unmsm.edu.pe",
      "alvaro.sancarrancos@unmsm.edu.pe",
      "renzo.mendozar@unmsm.edu.pe"
    ]
  },
  {
    nombre: "Los ByteCoders",
    correos: [
      "rodrigo.quispeb@unmsm.edu.pe",
      "kevin.quispev@unmsm.edu.pe",
      "victor.chavez19@unmsm.edu.pe"
    ]
  },
  {
    nombre: "Andromeda",
    correos: [
      "diego.flores33@unmsm.edu.pe",
      "angel.llacsamanga@unmsm.edu.pe",
      "david.ramirez8@unmsm.edu.pe"
    ]
  }
];

// Alias para exportación o compatibilidad global
const EQUIPOS = baseEquipos;

