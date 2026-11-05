/**
 * ====================================================================
 * BACKEND EN GOOGLE APPS SCRIPT (Code.gs)
 * Hackathon ENEISOFT XVI 2026 — Voto de Pares (Voto de Integrantes de Equipo)
 * FISI · UNMSM
 * ====================================================================
 * 
 * ESTRUCTURA OFICIAL DE COLUMNAS EN TU GOOGLE SHEET:
 * [A: Equipo Votante | B: Correo del Votante | C: 1er Puesto (+3 pts) | D: 2do Puesto (+2 pts) | E: 3er Puesto (+1 pt) | F: Fecha y Hora]
 * 
 * INSTRUCCIONES DE ACTUALIZACIÓN:
 * 1. Abre tu hoja de cálculo en Google Sheets.
 * 2. Ve a "Extensiones" > "Apps Script".
 * 3. Reemplaza todo el código del editor con este archivo.
 * 4. Haz clic en "Implementar" > "Gestionar implementaciones".
 * 5. Edita la versión activa (o crea "Nueva versión") y guarda.
 */

function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = params.action;
    var sheet = getActiveSheet();
    
    if (action === "check") {
      var equipoBuscado = (params.equipo || "").toString().trim().toLowerCase();
      var data = sheet.getDataRange().getValues();
      var alreadyVoted = false;

      // Busca en Columna A o B desde la primera fila (i = 0) para hojas con o sin encabezados
      for (var i = 0; i < data.length; i++) {
        var colA = (data[i][0] || "").toString().trim().toLowerCase();
        var colB = (data[i][1] || "").toString().trim().toLowerCase();
        if ((colA && colA === equipoBuscado) || (colB && colB === equipoBuscado)) {
          alreadyVoted = true;
          break;
        }
      }

      var result = {
        status: "ok",
        equipo: params.equipo,
        alreadyVoted: alreadyVoted
      };

      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "active", service: "ENEISOFT XVI Voting API" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var sheet = getActiveSheet();
    var contents = {};

    if (e && e.postData && e.postData.contents) {
      try {
        contents = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        contents = e.parameter || {};
      }
    } else if (e && e.parameter) {
      contents = e.parameter;
    }

    // Extracción tolerante a todas las variantes de nombres de propiedades
    var equipoVotante = contents.equipoVotante || contents.equipo || contents.equipo_votante || contents["Equipo Votante"] || "";
    var correoVotante = contents.correoVotante || contents.correo || contents.correoDelVotante || contents.correo_del_votante || contents.correoResponsable || contents.email || contents["Correo del Votante"] || "";
    var puesto1 = contents.puesto1 || contents["1er Puesto (+3 pts)"] || "";
    var puesto2 = contents.puesto2 || contents["2do Puesto (+2 pts)"] || "";
    var puesto3 = contents.puesto3 || contents["3er Puesto (+1 pt)"] || "";
    var timestamp = new Date();

    // Verificación de duplicados para evitar doble voto del mismo equipo
    if (equipoVotante) {
      var data = sheet.getDataRange().getValues();
      var equipoLower = equipoVotante.toString().trim().toLowerCase();
      
      for (var i = 0; i < data.length; i++) {
        var colA = (data[i][0] || "").toString().trim().toLowerCase();
        var colB = (data[i][1] || "").toString().trim().toLowerCase();
        if ((colA && colA === equipoLower) || (colB && colB === equipoLower)) {
          return ContentService.createTextOutput(JSON.stringify({ 
            status: "rejected", 
            message: "El equipo ya ha emitido su voto." 
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // REGISTRO EXACTO SEGÚN LAS COLUMNAS DE TU HOJA:
    // Columna A: Equipo Votante
    // Columna B: Correo del Votante
    // Columna C: 1er Puesto (+3 pts)
    // Columna D: 2do Puesto (+2 pts)
    // Columna E: 3er Puesto (+1 pt)
    // Columna F: Fecha y Hora
    sheet.appendRow([
      equipoVotante,
      correoVotante,
      puesto1,
      puesto2,
      puesto3,
      timestamp
    ]);

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Voto registrado exitosamente." 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getActiveSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Busca obligatoriamente la pestaña llamada "Hoja 1"
  var sheet = ss.getSheetByName("VotoPares"); 
  
  // Si por alguna razón la borraste o no existe, usa la que esté activa por defecto
  if (!sheet) {
    sheet = ss.getActiveSheet();
  }
  
  return sheet;
}
