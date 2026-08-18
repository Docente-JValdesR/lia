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

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-ink">L+IA está preparando tu actividad</p>
        <span className="font-mono text-xs text-ink-soft">
          {String(Math.floor(segundos / 60)).padStart(2, "0")}:
          {String(segundos % 60).padStart(2, "0")}
        </span>
      </div>

      {extension && (
        <p className="mt-1 text-xs text-ink-soft">
          Un texto de {extension.min} a {extension.max} palabras toma más tiempo de escribir.
        </p>
      )}

      <ol className="mt-4 space-y-2.5">
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
    </div>
  );
}
