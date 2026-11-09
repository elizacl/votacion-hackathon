# 🏆 Plataforma de Voto de Pares · Hackathon ENEISOFT XVI (2026)

> **Facultad de Ingeniería de Sistemas e Informática (FISI)**  
> **Universidad Nacional Mayor de San Marcos (UNMSM)**  
> 🌐 **Despliegue Oficial en Producción:** [https://peer-voting-eneisoft.netlify.app](https://peer-voting-eneisoft.netlify.app)

Aplicación web moderna de una sola página (**Single Page App - SPA**) desarrollada para gestionar la votación colegiada entre pares (*Peer Voting*) de los equipos clasificados en la **Hackathon ENEISOFT XVI**.

Representa el **15% de la ponderación final** del certamen. Permite a cualquier integrante de un equipo emitir el voto definitivo de su grupo de forma confidencial, interactiva y fluida desde sus dispositivos móviles (vía código QR) o computadoras.

---

## 🚀 Características Principales

- **📱 Experiencia Mobile-First & Touch-Friendly:** Implementada con [SortableJS](https://sortablejs.github.io/Sortable/) para permitir un arrastrar y soltar (*Drag & Drop*) intuitivo y táctil en smartphones.
- **🔒 Autenticación por Correo (Sin contraseñas):** Valida si el correo ingresado pertenece a la nómina oficial de integrantes clasificados (ignora mayúsculas y espacios).
- **🚫 Prohibición Estricta de Auto-voto:** El sistema excluye automáticamente el propio equipo del votante de la lista de candidatos evaluables.
- **⚡ Voto Único por Equipo:** Cualquier integrante del equipo puede votar. El primer integrante que envíe el podio registra la decisión final, bloqueando intentos posteriores de cualquier otro miembro del mismo grupo tanto a nivel de interfaz como en el backend.
- **🥇 Podio Oficial con Puntuación:** Casilleros independientes para:
  - **1° Puesto:** +3 puntos
  - **2° Puesto:** +2 puntos
  - **3° Puesto:** +1 punto
- **📊 Backend Serverless en Google Sheets:** Comunicación con Google Apps Script mediante peticiones asíncronas (`fetch`) en segundo plano sin dependencias de servidores externos ni bases de datos de pago.
- **🎨 Interfaz Cyberpunk / Dark Mode:** Diseñada con Tailwind CSS y efectos de *glassmorphism*, halos de luz ambient y paleta cromática oficial ENEISOFT (`#0a2138`, `#24ed7a`, `#00c8df`, `#f59e0b`).
- **🎉 Celebración Visual:** Animación de confeti al emitir el voto con éxito gracias a `canvas-confetti`.

---

## 📂 Arquitectura y Estructura de Archivos

El proyecto ha sido modularizado para facilitar su mantenimiento, versionado y despliegue en GitHub:

```text
VotosHackathon/
├── index.html                   # Vista principal de la SPA (Pantallas 1, 2 y 3)
├── config.js                    # Configuración global y URL de Google Apps Script
├── equipos.js                   # Nómina oficial de equipos y correos autorizados (100% dinámico)
├── app.js                       # Lógica de negocio (Autenticación, Podio, Drag & Drop, API)
├── styles.css                   # Estilos personalizados, animaciones y glassmorphism
├── google_apps_script_backend.gs# Código fuente del backend para Google Sheets
├── favicon.jpg                  # Favicon e isologotipo oficial del evento
└── README.md                    # Documentación del proyecto
```

### Descripción de Módulos

| Archivo | Responsabilidad |
| :--- | :--- |
| **`config.js`** | Contiene la constante `WEB_APP_URL` que apunta al Web App de Google Apps Script y constantes de puntaje. |
| **`equipos.js`** | Define el arreglo de equipos clasificados y la lista de correos de sus integrantes autorizados. Al editar este archivo, toda la interfaz se adapta automáticamente. |
| **`app.js`** | Controla el flujo completo: validación de correo, consulta a la API de estado de voto, control del podio, modal de confirmación y envío del voto. |
| **`styles.css`** | Clases de diseño, paleta cyberpunk, scrollbars personalizados y retroalimentación de arrastre (`.sortable-ghost`, `.sortable-drag`). |
| **`google_apps_script_backend.gs`** | Script de Google Apps Script para recibir `doGet` (verificar si un equipo ya votó) y `doPost` (guardar la votación en la hoja de cálculo). |

---

## ⚙️ Puesta en Marcha y Configuración

### 1. Configuración de Google Sheets y Apps Script

1. Crea una hoja de cálculo en **Google Drive** (ej. `Votacion_Hackathon_ENEISOFT_2026`).
2. Agrega los encabezados en la **Fila 1**:
   - `Columna A`: **Equipo Votante**
   - `Columna B`: **Correo del Votante**
   - `Columna C`: **1er Puesto (+3 pts)**
   - `Columna D`: **2do Puesto (+2 pts)**
   - `Columna E`: **3er Puesto (+1 pt)**
   - `Columna F`: **Fecha y Hora**
3. En el menú superior de la hoja, ve a **Extensiones** > **Apps Script**.
4. Copia y pega el contenido del archivo [`google_apps_script_backend.gs`](./google_apps_script_backend.gs) en el editor.
5. Haz clic en el botón azul **Implementar** > **Nueva implementación**:
   - **Tipo:** Aplicación web (*Web App*)
   - **Descripción:** `Backend Votación ENEISOFT`
   - **Ejecutar como:** `Yo (tu cuenta)`
   - **Quién tiene acceso:** `Cualquier usuario` *(Anyone)* — **Indispensable para que los participantes puedan votar sin loguearse en Google**.
6. Concede los permisos que Google solicite y copia la **URL de la aplicación web** (termina en `/exec`).

### 2. Vincular el Frontend con el Backend

Abre el archivo [`config.js`](./config.js) y reemplaza el valor de `WEB_APP_URL` con tu URL obtenida en el paso anterior:

```javascript
// config.js
const WEB_APP_URL = "https://script.google.com/macros/s/TU_ID_DE_APPS_SCRIPT/exec";
```

---

## 👥 Gestión Dinámica de Equipos y Participantes

El sistema es **100% dinámico**. Para agregar, quitar o modificar equipos y correos autorizados, **únicamente debes editar el archivo [`equipos.js`](./equipos.js)** sin necesidad de tocar `index.html`, `app.js` ni volver a desplegar el Google Apps Script:

```javascript
// equipos.js
const baseEquipos = [
  {
    nombre: "Nombre del Equipo",
    correos: [
      "integrante1@unmsm.edu.pe",
      "integrante2@gmail.com",
      "integrante3@unmsm.edu.pe"
      // Puedes poner 1, 2, 3, 5 o la cantidad de correos que necesites por equipo
    ]
  },
  // Puedes agregar o quitar tantos equipos como desees
];
```

### ¿Qué se actualiza automáticamente al editar `equipos.js`?
- **Contadores de la interfaz:** El badge de la pantalla de inicio (*"X Equipos Clasificados"*) y el contador de equipos elegibles (*"X-1 disponibles"*) se recalculan solos.
- **Cantidad flexible de integrantes:** Cada equipo puede tener cualquier número de correos registrados (`1`, `3`, `5`, etc.).
- **Filtro anti auto-voto y tarjetas del podio:** Se generan dinámicamente a partir de los equipos presentes en el arreglo.
- **Compatibilidad con Google Sheets:** El backend valida por el nombre del equipo enviado, por lo que cualquier nuevo equipo funciona de inmediato sin reconfigurar Google Sheets.
- **Validación flexible:** Insensible a mayúsculas/minúsculas y espacios en blanco accidentales.

---

## 🌐 Despliegue en Producción

La plataforma se encuentra actualmente desplegada y funcionando en:
👉 **[https://peer-voting-eneisoft.netlify.app](https://peer-voting-eneisoft.netlify.app)**

### Opciones de despliegue continuo:

#### A. Despliegue en Netlify
1. Conecta tu repositorio de GitHub en [Netlify](https://app.netlify.com/).
2. Configuración de publicación:
   - **Build command:** *(dejar vacío)*
   - **Publish directory:** `.` o `/` (raíz del proyecto)
3. Cada vez que hagas `git push` a `main`, Netlify actualizará el sitio automáticamente.

#### B. Despliegue en GitHub Pages
1. Sube los archivos a tu repositorio en GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: Plataforma de votación ENEISOFT XVI"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```
2. En GitHub, ve a **Settings** > **Pages**.
3. En **Build and deployment** > **Branch**, selecciona `main` y la carpeta `/(root)`. Haz clic en **Save**.
4. Genera un **Código QR** con el enlace oficial de Netlify o GitHub Pages para que los integrantes voten directamente desde sus teléfonos en la feria de proyectos.

---

## 🛡️ Seguridad y Reglas de Negocio

1. **Anti Auto-voto:** Filtrado tanto en el listado de selección como validado antes del envío final.
2. **Deduplicación:** La función `doGet` verifica si el equipo ya está registrado en la hoja de cálculo. En caso positivo, se bloquea el acceso con el mensaje:
   > *"Acceso denegado: Alguien de tu equipo ya emitió el voto."*
3. **Persistencia Transaccional:** La función `doPost` del Apps Script vuelve a comprobar antes de escribir si el equipo ya existe en el Sheet, evitando votos duplicados en condiciones de carrera.
4. **CORS Safe:** Se utiliza el modo `no-cors` y codificación de formulario estándar para evitar bloqueos por políticas de origen cruzado en Google Apps Script.

---

## 💻 Tecnologías Utilizadas

- **HTML5 Semántico**
- **Tailwind CSS (CDN)** para estilos modernos y responsivos
- **JavaScript Vanilla (ES6+)** sin frameworks pesados
- **SortableJS** para drag-and-drop táctil y fluido
- **Canvas Confetti** para micro-interacciones de satisfacción
- **Google Apps Script & Google Sheets** como base de datos en tiempo real

---

**Comité Organizador ENEISOFT XVI — FISI · UNMSM (2026)**

