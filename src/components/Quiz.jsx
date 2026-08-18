"use client";

import { useState } from "react";
import BotonEscuchar from "@/components/voz/BotonEscuchar";
import { EJES, getHabilidad } from "@/data/curriculum";

export default function Quiz({ lectura, onFinalizar, onReleer }) {
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState({});

  const preguntas = lectura.preguntas;
  const pregunta = preguntas[indice];
  const habilidad = getHabilidad(lectura.nivel, pregunta.habilidad);
  const eje = EJES.find((e) => e.id === habilidad?.eje);
  const seleccion = respuestas[pregunta.id];
  const esUltima = indice === preguntas.length - 1;
  const respondidas = Object.keys(respuestas).length;

  const responder = (opcion) =>
    setRespuestas((prev) => ({ ...prev, [pregunta.id]: opcion }));

  return (
    <section className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wide text-ink-soft">
          Pregunta {indice + 1} de {preguntas.length}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {habilidad?.oa && (
            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-bold text-brand">
              {habilidad.oa}
            </span>
          )}
          <span className="rounded-full border border-line px-3 py-1 text-[11px] text-ink-soft">
            {eje ? `${eje.label} · ` : ""}
            {habilidad?.label ?? pregunta.habilidad}
          </span>
        </div>
      </div>

      <div className="mb-7 h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="lia-gradient h-full transition-all"
          style={{ width: `${(respondidas / preguntas.length) * 100}%` }}
        />
      </div>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-ink">{pregunta.enunciado}</h3>
        <BotonEscuchar
          id={`enunciado-${pregunta.id}`}
          texto={pregunta.enunciado}
          etiqueta="Escuchar"
        />
      </div>

      <div className="space-y-3">
        {pregunta.alternativas.map((alt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => responder(i)}
              className={`flex flex-1 items-start gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm transition ${
                seleccion === i
                  ? "border-brand bg-brand-soft text-ink"
                  : "border-line bg-surface-2 text-ink hover:border-brand"
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  seleccion === i ? "bg-brand text-white" : "bg-surface text-ink-soft"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span>{alt}</span>
            </button>
            <BotonEscuchar
              id={`alt-${pregunta.id}-${i}`}
              texto={`Alternativa ${String.fromCharCode(65 + i)}. ${alt}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        <button
          type="button"
          onClick={onReleer}
          className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
        >
          Releer el texto
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setIndice((i) => Math.max(0, i - 1))}
            disabled={indice === 0}
            className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand disabled:opacity-40"
          >
            Anterior
          </button>

          {esUltima ? (
            <button
              type="button"
              onClick={() => onFinalizar(respuestas)}
              disabled={respondidas < preguntas.length}
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ver resultados
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIndice((i) => Math.min(preguntas.length - 1, i + 1))}
              disabled={seleccion === undefined}
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
