/**
 * ====================================================================
 * CONFIGURACIÓN DE LA PLATAFORMA DE VOTO
 * Hackathon ENEISOFT XVI 2026 — FISI · UNMSM
 * ====================================================================
 * 
 * En este archivo se centralizan los endpoints y parámetros configurables
 * de la aplicación web.
 */

// URL del Web App de Google Apps Script desplegado como aplicación web pública
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyXUEGx-gSIvD8S-RaVbCai_6O7y4YSanv9AYyHAa6Bsdr7NvCP9g4-WTLMGcFurwrt/exec";

// Parámetros y constantes generales del sistema
const APP_CONFIG = {
  NOMBRE_EVENTO: "Hackathon ENEISOFT XVI 2026",
  FACULTAD: "Facultad de Ingeniería de Sistemas e Informática (FISI · UNMSM)",
  PONDERACION_VOTO_PARES: 15, // Representa el 15% del puntaje final
  PUNTOS: {
    PRIMER_PUESTO: 3,
    SEGUNDO_PUESTO: 2,
    TERCER_PUESTO: 1
  }
};
