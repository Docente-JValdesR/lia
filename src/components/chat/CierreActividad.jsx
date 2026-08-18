"use client";

import { useMemo } from "react";
import Serpentinas from "@/components/chat/Serpentinas";
import ValoracionActividad from "@/components/chat/ValoracionActividad";
import BotonEscuchar from "@/components/voz/BotonEscuchar";
import { consejoPara } from "@/data/consejos";
import { mensajeLogro } from "@/lib/guion";

export default function CierreActividad({ nivelId, resultado, lectura, children }) {
  const { correctas, total, porcentaje, ejeBajo } = resultado;
  const logro = mensajeLogro(nivelId, porcentaje);
  const consejo = useMemo(
    () => consejoPara(nivelId, ejeBajo?.id),
    [nivelId, ejeBajo?.id]
  );

  const textoCompleto = [
    logro.titulo,
    `Obtuviste ${correctas} de ${total} respuestas correctas.`,
    logro.texto,
    consejo ? `Consejo de L+IA: ${consejo}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {logro.celebrar && <Serpentinas />}

      <div className="rounded-3xl border border-line bg-surface p-6 text-center sm:p-8">
        <span className="text-4xl" aria-hidden="true">
          {logro.celebrar ? "🎉" : "💪"}
        </span>

        <h3 className="mt-3 text-2xl font-extrabold text-ink">{logro.titulo}</h3>

        <p className="lia-text-gradient mt-3 text-4xl font-extrabold">
          {correctas}/{total}
        </p>
        <p className="mt-1 text-sm font-semibold text-ink-soft">
          {porcentaje}% de comprensión
        </p>

        <div className="mx-auto mt-5 h-2 w-full max-w-xs overflow-hidden rounded-full bg-surface-2">
          <div
            className={`h-full transition-all ${porcentaje >= 70 ? "bg-teal" : "bg-accent"}`}
            style={{ width: `${porcentaje}%` }}
          />
        </div>

        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
          {logro.texto}
        </p>

        {consejo && (
          <div className="mx-auto mt-6 max-w-md rounded-2xl bg-brand-soft p-5 text-left">
            <p className="text-xs font-bold uppercase tracking-wide text-brand">
              Consejo de L+IA
              {ejeBajo ? ` · ${ejeBajo.label}` : ""}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{consejo}</p>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <BotonEscuchar id="cierre-actividad" texto={textoCompleto} etiqueta="Escuchar" />
        </div>

        {lectura?.id && !String(lectura.id).startsWith("demo") && (
          <div className="mt-6 text-left">
            <ValoracionActividad lectura={lectura} />
          </div>
        )}

        {children && <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div>}
      </div>
    </>
  );
}
