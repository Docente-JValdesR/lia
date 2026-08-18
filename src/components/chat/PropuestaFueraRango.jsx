"use client";

import { getExtension } from "@/data/curriculum";

export default function PropuestaFueraRango({ propuesta, config, onAceptar, onReintentar, cargando }) {
  if (!propuesta) return null;
  const rango = getExtension(config.nivel, config.dificultad);
  const palabras = propuesta.texto?.nPalabras ?? propuesta.nPalabras;

  return (
    <div className="rounded-3xl border border-accent/50 bg-accent-soft p-5 shadow-[0_18px_60px_rgba(217,147,44,0.12)] sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-lg text-white">!</span>
        <div>
          <h2 className="text-base font-extrabold text-ink">Encontré una actividad que puede servirte</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Tiene <strong>{palabras} palabras</strong>, fuera del rango solicitado de {rango.min} a {rango.max}. Sus preguntas y habilidades sí pasaron la revisión curricular.
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={onAceptar} disabled={cargando} className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60">
          {cargando ? "Guardando..." : "Usar este texto"}
        </button>
        <button type="button" onClick={onReintentar} disabled={cargando} className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand disabled:opacity-60">
          Generar otro
        </button>
      </div>
      <p className="mt-3 text-[11px] text-ink-soft">Si lo usas, quedará guardado con sus {palabras} palabras reales.</p>
    </div>
  );
}