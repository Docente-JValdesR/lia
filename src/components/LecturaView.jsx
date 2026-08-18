"use client";

import { useEffect, useRef, useState } from "react";
import AvisoIA from "@/components/AvisoIA";
import BotonEscuchar from "@/components/voz/BotonEscuchar";
import { getExtension, getNivel, getUnidad } from "@/data/curriculum";

function formatoTiempo(segundos) {
  const m = String(Math.floor(segundos / 60)).padStart(2, "0");
  const s = String(segundos % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function LecturaView({ lectura, onTerminar, onVolver, acciones }) {
  const [segundos, setSegundos] = useState(0);
  const [tamano, setTamano] = useState(18);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const nivel = getNivel(lectura.nivel);
  const unidad = getUnidad(lectura.nivel, lectura.unidad);
  const rango = getExtension(lectura.nivel, lectura.dificultad);
  const texto = lectura.parrafos.join(" ");
  const palabras = texto.split(/\s+/).filter(Boolean).length;
  const dentroDelRango = palabras >= rango.min && palabras <= rango.max;
  const ppm = segundos > 0 ? Math.round((palabras / segundos) * 60) : 0;

  return (
    <section className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-ink">{lectura.titulo}</h2>
          <p className="mt-1 text-xs text-ink-soft">
            {nivel.label} · {unidad.titulo} ·{" "}
            <span className={dentroDelRango ? "" : "font-semibold text-accent"}>
              {palabras} palabras (esperado {rango.min}-{rango.max})
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="flex items-center gap-1 rounded-full border border-line px-2 py-1">
            <button
              type="button"
              onClick={() => setTamano((t) => Math.max(14, t - 2))}
              className="px-2 text-sm font-semibold text-ink-soft transition hover:text-brand"
              aria-label="Reducir texto"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setTamano((t) => Math.min(28, t + 2))}
              className="px-2 text-sm font-semibold text-ink-soft transition hover:text-brand"
              aria-label="Aumentar texto"
            >
              A+
            </button>
          </div>
          <span className="rounded-full bg-brand-soft px-3.5 py-1.5 font-mono text-sm font-semibold text-brand">
            {formatoTiempo(segundos)}
          </span>
          {acciones}
        </div>
      </div>

      <article className="space-y-4 leading-relaxed text-ink" style={{ fontSize: `${tamano}px` }}>
        {lectura.parrafos.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      <AvisoIA variante="compacto" className="mt-6" />

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
        <button
          type="button"
          onClick={() => onTerminar({ segundos, ppm, palabras })}
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover"
        >
          Terminé de leer · Responder preguntas
        </button>
        {onVolver && (
          <button
            type="button"
            onClick={onVolver}
            className="rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
          >
            Volver a configuración
          </button>
        )}
        <div className="flex items-center gap-2">
          <BotonEscuchar id={`texto-${lectura.id}`} texto={texto} etiqueta="Escuchar el texto" />
          <span className="text-[11px] text-ink-soft">Apoyo opcional: no mide tu fluidez</span>
        </div>
      </div>
    </section>
  );
}
