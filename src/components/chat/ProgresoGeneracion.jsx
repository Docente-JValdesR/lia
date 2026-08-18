"use client";

import { useEffect, useState } from "react";

const ETIQUETAS = {
  preparando: "Preparando tu actividad",
  intentando: "Escribiendo el texto y las preguntas",
  validando: "Revisando que cumpla el currículum",
  guardando: "Guardando la actividad",
  rechazado: "El resultado no cumplió las reglas, probando otra opción",
  tiempo_agotado: "Tomó más de lo previsto",
  buscando_banco: "Buscando una actividad guardada",
  listo: "¡Listo!",
  sin_disponibilidad: "Sin actividades disponibles",
};

const ETAPAS = ["preparando", "intentando", "validando", "guardando"];

function Icono({ estado }) {
  if (estado === "hecho") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l5 5L19 7" />
      </svg>
    );
  }
  if (estado === "fallido") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    );
  }
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-brand" />;
}

export default function ProgresoGeneracion({ pasos, extension }) {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const actual = [...pasos].reverse().find((paso) => paso.estado === "activo") ?? pasos.at(-1);
  const proveedores = [...new Set(pasos.map((paso) => paso.proveedor).filter(Boolean))];
  const etapa = ETAPAS.indexOf(actual?.tipo);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-surface p-6 shadow-[0_18px_60px_rgba(105,101,219,0.12)] sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-brand/10 bg-brand/5" />
      <div className="relative flex flex-col items-center text-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-[28px] border border-brand/30" />
          <span className="absolute inset-2 animate-[spin_8s_linear_infinite] rounded-[22px] border border-teal/50 border-t-transparent" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-[18px] bg-gradient-to-br from-brand to-teal text-xl font-black tracking-tight text-white shadow-lg shadow-brand/25">
            L<span className="text-teal-soft">+</span>IA
          </span>
        </div>
        <div className="mt-4 flex w-full items-center justify-between gap-3 text-left">
          <div>
            <p className="text-base font-extrabold text-ink">L+IA está creando tu actividad</p>
            <p className="mt-1 text-xs text-ink-soft">Cada etapa valida el contenido antes de entregártelo.</p>
          </div>
          <span className="font-mono text-sm font-semibold text-brand">
          {String(Math.floor(segundos / 60)).padStart(2, "0")}:
          {String(segundos % 60).padStart(2, "0")}
          </span>
        </div>
      </div>

      {extension && (
        <p className="mt-1 text-xs text-ink-soft">
          Un texto de {extension.min} a {extension.max} palabras toma más tiempo de escribir.
        </p>
      )}

      <div className="mt-6 grid grid-cols-4 gap-1.5">
        {ETAPAS.map((id, i) => (
          <div key={id} className={`h-1.5 rounded-full ${i <= etapa ? "bg-brand" : "bg-surface-2"}`} />
        ))}
      </div>

      {actual && (
        <div className="mt-5 rounded-2xl border border-line bg-surface-2 px-4 py-3">
          <p className="text-xs font-bold text-ink">{ETIQUETAS[actual.tipo] ?? actual.tipo}</p>
          {actual.proveedor && <p className="mt-1 text-[11px] text-ink-soft">Modelo en uso: {actual.proveedor}</p>}
        </div>
      )}

      <ol className="mt-5 space-y-2.5">
        {pasos.map((paso, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-0.5">
              <Icono estado={paso.estado} />
            </span>
            <span
              className={`text-xs leading-relaxed ${
                paso.estado === "fallido" ? "text-ink-soft" : "text-ink"
              }`}
            >
              {ETIQUETAS[paso.tipo] ?? paso.tipo}
              {paso.proveedor && (
                <span className="text-ink-soft"> · {paso.proveedor}</span>
              )}
              {paso.motivo && (
                <span className="block text-[11px] text-ink-soft">{paso.motivo}</span>
              )}
            </span>
          </li>
        ))}
      </ol>
      {proveedores.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
          <span className="text-[11px] font-semibold text-ink-soft">Modelos consultados:</span>
          {proveedores.map((proveedor) => (
            <span key={proveedor} className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand">{proveedor}</span>
          ))}
        </div>
      )}
    </div>
  );
}
