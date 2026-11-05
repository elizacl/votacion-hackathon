# Guía de Diseño y Sistema Visual — Hackathon ENEISOFT XVI 2026
> **Referencia oficial para el diseño y construcción de interfaces satélites (Página de Voto de Pares / Peer Voting)**  
> *Facultad de Ingeniería de Sistemas e Informática (FISI) — UNMSM*

Este documento detalla exhaustivamente todos los tokens de diseño, paleta de colores, tipografía, efectos de resplandor, patrones de tarjeta, micro-interacciones, componentes de botones e insignias utilizados en la página de la **Hackathon**, de modo que cualquier pantalla satélite (como la plataforma de **Votación entre Líderes / Voto de Pares**) mantenga un 100% de consistencia estética y funcional.

---

## 1. Concepto Estético y Dirección de Arte

* **Estilo Principal**: *Cyber Matrix / High-Tech Terminal / Dark Tech Executivo*.
* **Atmósfera**: Fondo azul marino profundo y negro cibernético enriquecido con mallas sutiles, flares de luz desenfocados (*ambient glows*) y acentos neón de alta visibilidad (verde esmeralda y cian cuántico).
* **Sensación de Uso**: Plataforma técnica de alto rendimiento para desarrolladores de IA e ingenieros de software, con bordes milimétricos translúcidos (`border-white/10` o `border-[#24ed7a]/30`) y micro-interacciones de resorte (*spring physics*).

---

## 2. Paleta de Colores Oficial (Design Tokens)

### 2.1 Colores Principales de Marca

| Token / Nombre | Hex | Clase Tailwind / Uso | Descripción |
| :--- | :--- | :--- | :--- |
| **Deep Cyber Navy (Fondo Principal)** | `#0a2138` | `bg-[#0a2138]` | Fondo base oscuro de toda la página y secciones técnicas. |
| **Deep Dark Matrix (Fondo de Tarjetas)** | `#071526` / `#071810` / `#071320` | `bg-[#071320]/80` o `bg-[#071810]` | Fondos de tarjetas elevadas con desenfoque de cristal (*backdrop-blur*). |
| **Pure Dark Accent** | `#020705` / `#040d17` | Gradientes `from-... to-[#020705]` | Fondo terminal en extremos de gradientes lineales. |
| **Neon Green (Verde Neón)** | `#24ed7a` / `#00ff87` | `text-[#24ed7a]`, `bg-[#24ed7a]`, `border-[#24ed7a]` | Acento primario, botones principales, llamadas a la acción e indicadores de estado. |
| **Quantum Cyan (Cian Cuántico)** | `#00c8df` / `#60efff` | `text-[#00c8df]`, `bg-[#00c8df]`, `border-[#00c8df]` | Acento secundario, badges complementarios y efectos *hover* de botones. |
| **Amber Warning (Acento Alerta/Crítico)** | `#f59e0b` / `#fbbf24` | `text-amber-400`, `border-amber-400/30`, `bg-amber-400/10` | Badges de advertencia, estado cerrado (`Lock`), penalizaciones o hitos críticos. |
| **Deep Contrast Text** | `#0a2138` | `text-[#0a2138]` | Color de texto sobre botones con fondo `#24ed7a` o `#00c8df` para máxima legibilidad. |

### 2.2 Colores Neutros y Jerarquía Tipográfica

| Elemento | Clases Tailwind recomendadas |
| :--- | :--- |
| **Texto de Encabezados (H1, H2)** | `text-white font-bold` o `font-black` |
| **Subtítulos y Enunciados** | `text-neutral-200` o `text-white/90 font-light` |
| **Texto Secundario / Párrafos** | `text-neutral-400` / `text-neutral-300 font-light leading-relaxed` |
| **Detalles y Metadatos (Mono)** | `text-neutral-500` / `text-neutral-400 font-mono text-xs` |
| **Bordes de Contenedores** | `border border-white/10` o `border-white/15` |
| **Líneas Divisorias sutiles** | `border-white/5` o `bg-gradient-to-r from-transparent via-[#24ed7a]/30 to-transparent` |

### 2.3 Gradientes Emblemáticos

```css
/* Texto degradado ENEISOFT */
.text-gradient-eneisoft {
  background: linear-gradient(135deg, #24ed7a 0%, #00c8df 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Gradiente para botones o fondos */
.bg-gradient-eneisoft {
  background: linear-gradient(135deg, #24ed7a 0%, #00c8df 100%);
}

/* Línea de destello horizontal (Flare Divider) */
.flare-line {
  background: linear-gradient(90deg, transparent 0%, #24ed7a 35%, #00c8df 65%, transparent 100%);
}
```

---

## 3. Tipografía y Estilos de Fuente

Se utilizan dos familias tipográficas configuradas vía variables CSS:
1. **Sans-Serif Principal**: `Geist Sans` (`var(--font-geist-sans)` o `font-sans`).
   * Usada en títulos, subtítulos, párrafos y descripciones.
2. **Monospace Técnica**: `Geist Mono` (`var(--font-geist-mono)` o `font-mono`).
   * Usada en badges, porcentajes, etiquetas numéricas, fechas, horas y terminal labels.

### Jerarquía de Tamaños para Pantallas Satélite
* **Título Principal (Hero)**: `text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] uppercase`.
* **Encabezados de Sección (H2)**: `text-3xl md:text-5xl font-bold tracking-tight text-white mb-4`.
* **Sub-encabezados (H3)**: `text-xl md:text-2xl font-bold text-white tracking-tight`.
* **Párrafo descriptivo**: `text-sm md:text-base text-neutral-400 font-light leading-relaxed max-w-2xl`.
* **Etiquetas y Metadatos**: `text-xs font-mono uppercase tracking-widest text-[#24ed7a]`.

---

## 4. Fondo Ambiental Ciberespacial (*Ambient Glows & Grids*)

Para lograr exactamente la atmósfera de la Hackathon, cualquier pantalla debe envolverse con el fondo estructural con mallas y halos de luz:

```tsx
<div className="relative min-h-screen w-full bg-[#0a2138] text-white overflow-hidden">
  {/* Halos de luz ambient / Cyber Flares desenfocados */}
  <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] bg-[#24ed7a]/10 rounded-full blur-[180px] pointer-events-none" />
  <div className="absolute top-[25%] right-[-10%] w-[50vw] h-[50vw] bg-[#00c8df]/10 rounded-full blur-[180px] pointer-events-none" />
  <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] bg-[#24ed7a]/[0.06] rounded-full blur-[160px] pointer-events-none" />

  {/* Malla técnica tipo circuito / Cyber Grid */}
  <div 
    className="absolute inset-0 opacity-[0.035] pointer-events-none" 
    style={{
      backgroundImage: `linear-gradient(#24ed7a 1px, transparent 1px), linear-gradient(90deg, #24ed7a 1px, transparent 1px)`,
      backgroundSize: '48px 48px'
    }}
  />

  {/* Contenedor central acotado (Boxed Frame) */}
  <div className="boxed-frame boxed-border-dark relative z-10 px-4 sm:px-8 py-20 max-w-7xl mx-auto w-full">
    {/* Contenido de la pantalla */}
  </div>
</div>
```

---

## 5. Componentes y Patrones UI

### 5.1 Badges de Estado y Categoría (*Terminal Pills*)

#### Badge Neón Verde (Activo / Principal):
```tsx
<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#24ed7a]/30 text-xs uppercase tracking-widest text-[#24ed7a] mb-4 bg-[#071320]/80 backdrop-blur-sm shadow-[0_0_15px_rgba(36,237,122,0.15)] font-mono">
  <span className="w-2 h-2 rounded-full bg-[#24ed7a] animate-pulse" />
  <span>Votación entre Líderes · Peer Voting</span>
</div>
```

#### Badge Cian Cuántico (Ponderación / Datos):
```tsx
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00c8df]/30 text-xs font-mono text-[#00c8df] bg-[#00c8df]/10">
  <Users className="w-3.5 h-3.5 text-[#00c8df]" />
  <span>12 Equipos Clasificados</span>
</div>
```

#### Badge Ámbar (Alerta / Regla Crítica):
```tsx
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 text-xs font-mono text-amber-300 bg-amber-400/10">
  <Lock className="w-3.5 h-3.5 text-amber-400" />
  <span>Prohibido votar por su propio equipo</span>
</div>
```

---

### 5.2 Tarjetas de Contenido y Votación (*Cyber Glass Cards*)

#### Tarjeta Principal de Equipo o Selección (Estilo Voto de Pares):
```tsx
<div className="p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-[#071810] via-[#05110c] to-[#020705] border border-[#24ed7a]/25 hover:border-[#24ed7a]/60 transition-all duration-300 shadow-xl relative overflow-hidden group">
  {/* Brillo en hover */}
  <div className="absolute top-0 right-0 w-36 h-36 bg-[#24ed7a]/10 rounded-full blur-2xl group-hover:bg-[#24ed7a]/20 transition-all duration-500 pointer-events-none" />

  {/* Cabecera de la tarjeta */}
  <div className="flex items-center justify-between mb-4">
    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
      Equipo 01
    </span>
    <span className="text-xl font-mono font-bold text-[#24ed7a]">
      3 Pts
    </span>
  </div>

  <h3 className="text-xl font-bold text-white mb-2">Nombre del Proyecto</h3>
  <p className="text-sm text-neutral-400 font-light leading-relaxed mb-6">
    Descripción breve del prototipo funcional y de la solución propuesta.
  </p>

  {/* Metadatos inferiores */}
  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
    <span className="text-[#00c8df]">Sub-Eje: Académico</span>
    <span>Líder de Equipo</span>
  </div>
</div>
```

#### Tarjeta Informativa / Regla de Voto:
```tsx
<div className="p-5 rounded-2xl bg-[#071320]/80 border border-white/10 backdrop-blur-md">
  <div className="flex items-center gap-3">
    <div className="p-2.5 rounded-xl bg-[#24ed7a]/10 border border-[#24ed7a]/20 text-[#24ed7a]">
      <CheckCircle2 className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-sm font-semibold text-white">Sistema de Puntuación</h4>
      <p className="text-xs text-neutral-400">Elige tus 3 proyectos favoritos otorgando 3, 2 y 1 puntos respectivamente.</p>
    </div>
  </div>
</div>
```

---

### 5.3 Botones Interactivos (*Magnetic Button*)

#### Botón de Acción Primaria (Verde Neón con Hover Cian):
```tsx
<button
  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#24ed7a] text-[#0a2138] hover:bg-[#00c8df] hover:text-[#0a2138] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(36,237,122,0.35)] hover:shadow-[0_0_35px_rgba(0,200,223,0.5)] cursor-pointer"
>
  <span>Confirmar y Enviar Voto</span>
  <ArrowRight className="w-4 h-4 text-[#0a2138]" />
</button>
```

#### Botón Secundario / Cancelar / Volver:
```tsx
<button
  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/15 hover:border-white/30 text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer"
>
  <ArrowLeft className="w-4 h-4" />
  <span>Regresar</span>
</button>
```

---

## 6. Iconografía Recomendada (`lucide-react`)

| Icono | Import | Uso en Voto de Pares |
| :--- | :--- | :--- |
| **Scale** | `import { Scale } from "lucide-react"` | Ponderación del 15% del voto de pares. |
| **Users** | `import { Users } from "lucide-react"` | Equipos participantes / comunidad de líderes. |
| **Trophy** | `import { Trophy } from "lucide-react"` | Podio, selección de primer lugar (3 pts). |
| **Award** | `import { Award } from "lucide-react"` | 2.º y 3.er lugar de votación (2 y 1 pts). |
| **ShieldCheck** | `import { ShieldCheck } from "lucide-react"` | Verificación de identidad del líder de equipo. |
| **Lock** | `import { Lock } from "lucide-react"` | Voto confidencial / bloqueo de auto-voto. |
| **CheckCircle2** | `import { CheckCircle2 } from "lucide-react"` | Voto emitido correctamente / confirmación. |
| **AlertTriangle** | `import { AlertTriangle } from "lucide-react"` | Advertencias sobre votos duplicados o inválidos. |

---

## 7. Reglas de Negocio Oficiales para la Pantalla de Voto de Pares

Al crear el formulario o página de **Voto de Pares**, debes reflejar textualmente estas directrices de la competencia:
1. **Ponderación**: El voto colegiado entre pares equivale al **15% de la calificación final** de la Hackathon (el 85% restante corresponde a la mesa de jurados especialistas).
2. **Quiénes Votan**: Únicamente los **12 líderes de equipo clasificados**.
3. **Distribución de Puntos**: Cada líder debe elegir exactamente sus **3 proyectos favoritos**:
   * **1.er Favorito**: 3 puntos.
   * **2.º Favorito**: 2 puntos.
   * **3.er Favorito**: 1 punto.
4. **Restricción Estricta**: **Queda estrictamente prohibido votar por el propio equipo**. El selector debe deshabilitar o excluir al equipo del líder logueado.
5. **Confidencialidad**: Los resultados del voto entre pares se consolidan de manera anónima y secreta hasta la deliberación en el auditorio.

---

## 8. Plantilla Base Recomendada (Next.js / React)

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Users, Trophy, Award, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function PeerVotingPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#0a2138] text-white overflow-hidden py-24 px-4 sm:px-6">
      {/* Halos de luz ambiental */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#24ed7a]/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] bg-[#00c8df]/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Rejilla técnica */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(#24ed7a 1px, transparent 1px), linear-gradient(90deg, #24ed7a 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="boxed-frame boxed-border-dark relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#60efff]/30 text-xs uppercase tracking-widest text-[#60efff] mb-4 bg-[#071320]/80 backdrop-blur-sm font-mono">
          <Users className="w-3.5 h-3.5 text-[#60efff]" />
          Peer Voting · Votación entre Líderes (15%)
        </div>

        {/* Título */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-center mb-4 uppercase">
          Voto de <span className="text-gradient-eneisoft">Pares.</span>
        </h1>

        <p className="text-neutral-400 text-sm md:text-base font-light text-center max-w-2xl mb-12 leading-relaxed">
          Cada líder de equipo evaluará a los demás participantes asignando 3, 2 y 1 punto a sus proyectos favoritos. Prohibido el auto-voto.
        </p>

        {/* Formulario / Tarjetas de selección aquí */}
      </div>
    </div>
  );
}
```

