"use client";

import {
  clasificarPPM,
  DIFICULTADES,
  getExtension,
  getHabilidad,
  getNivel,
} from "@/data/curriculum";
import ValoracionActividad from "@/components/chat/ValoracionActividad";
import BotonInformePDF from "@/components/BotonInformePDF";
import { calcularDesempeno } from "@/lib/desempeno";

const TONOS = {
  rose: "text-danger",
  amber: "text-accent",
  emerald: "text-teal",
  sky: "text-brand",
};

// Regla adaptativa de la guía técnica: fluidez bajo el umbral medio bajo + comprensión < 70%.
function recomendar(categoriaPPM, porcentaje, dificultad, porEje) {
  const lento = ["muy_lenta", "lenta"].includes(categoriaPPM.id);
  const rapido = ["rapida", "muy_rapida"].includes(categoriaPPM.id);
  const indice = DIFICULTADES.findIndex((d) => d.id === dificultad);

  const conPorcentaje = porEje.map((e) => ({ ...e, pct: (e.aciertos / e.total) * 100 }));
  const mejor = [...conPorcentaje].sort((a, b) => b.pct - a.pct)[0];
  const peor = [...conPorcentaje].sort((a, b) => a.pct - b.pct)[0];

  const logro =
    mejor && mejor.pct >= 70
      ? `Has trabajado bien el eje ${mejor.label.toLowerCase()}.`
      : "Aún estás afianzando los ejes trabajados en esta actividad.";

  if (lento && porcentaje < 70) {
    return {
      tono: "amber",
      logro,
      texto:
        indice > 0
          ? `practiquemos con textos de extensión ${DIFICULTADES[indice - 1].label.toLowerCase()} para afianzar la fluidez antes de avanzar.`
          : "practiquemos la fluidez lectora antes de aumentar la extensión del texto.",
    };
  }
  if (porcentaje < 70 && peor) {
    return {
      tono: "amber",
      logro,
      texto: `sigamos practicando preguntas del eje ${peor.label.toLowerCase()}.`,
    };
  }
  if (rapido && porcentaje >= 85 && indice < DIFICULTADES.length - 1) {
    return {
      tono: "emerald",
      logro,
      texto: `avancemos a textos de extensión ${DIFICULTADES[indice + 1].label.toLowerCase()}.`,
    };
  }
  return {
    tono: "emerald",
    logro,
    texto: peor && peor.pct < 100
      ? `sigamos reforzando el eje ${peor.label.toLowerCase()} para consolidar el avance.`
      : "mantengamos este ritmo de práctica.",
  };
}

export default function Resultados({ lectura, respuestas, metricas, onReintentar, onNueva }) {
  const preguntas = lectura.preguntas;
  const nivel = getNivel(lectura.nivel);
  const desempeno = calcularDesempeno(lectura, respuestas);
  const { correctas, porcentaje, porEje, porOA } = desempeno;

  const ppm = metricas?.ppm ?? 0;
  const categoriaPPM = clasificarPPM(lectura.nivel, ppm);
  const rangoExtension = getExtension(lectura.nivel, lectura.dificultad);
  const recomendacion = recomendar(categoriaPPM, porcentaje, lectura.dificultad, porEje);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-ink">Resultados</h2>
        <p className="mt-1 text-xs text-ink-soft">
          {nivel.label} · texto de {metricas?.palabras ?? 0} palabras (rango {rangoExtension.min}-
          {rangoExtension.max})
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-surface-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Comprensión
            </p>
            <p className="mt-1 text-2xl font-extrabold text-brand">{porcentaje}%</p>
            <p className="mt-1 text-[11px] text-ink-soft">
              {correctas} de {preguntas.length} correctas · umbral 70%
            </p>
          </div>
          <div className="rounded-2xl bg-surface-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Velocidad lectora
            </p>
            <p className="mt-1 text-2xl font-extrabold text-ink">
              {ppm} <span className="text-sm font-semibold text-ink-soft">ppm</span>
            </p>
            <p className={`mt-1 text-[11px] font-bold ${TONOS[categoriaPPM.tono]}`}>
              {categoriaPPM.label} para {nivel.label}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Tiempo de lectura
            </p>
            <p className="mt-1 text-2xl font-extrabold text-ink">
              {Math.floor((metricas?.segundos ?? 0) / 60)}:
              {String((metricas?.segundos ?? 0) % 60).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[11px] text-ink-soft">Sesión sugerida: 10-15 min</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-brand-soft p-5">
          <p className="text-sm font-semibold text-ink">
            ⭐ {correctas} de {preguntas.length} respuestas correctas. {recomendacion.logro}
          </p>
          <p className="mt-2 text-sm text-ink">
            <span className="font-bold text-brand">L+IA recomienda:</span> {recomendacion.texto}
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-line bg-surface p-6">
          <h3 className="text-sm font-bold text-ink">Desempeño por eje de Lectura</h3>
          <div className="mt-4 space-y-4">
            {porEje.map((eje) => {
              const pct = Math.round((eje.aciertos / eje.total) * 100);
              return (
                <div key={eje.id}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink">{eje.label}</span>
                    <span className="text-ink-soft">
                      {eje.aciertos}/{eje.total} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={`h-full ${pct >= 70 ? "bg-teal" : "bg-accent"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-6">
          <h3 className="text-sm font-bold text-ink">Logro por Objetivo de Aprendizaje</h3>
          <div className="mt-4 space-y-4">
            {porOA.map((oa) => {
              const pct = Math.round((oa.aciertos / oa.total) * 100);
              return (
                <div key={oa.codigo}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-2">
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-bold text-brand">
                        {oa.codigo}
                      </span>
                      <span className="text-ink-soft">{oa.dominio}</span>
                    </span>
                    <span className="shrink-0 text-ink-soft">
                      {oa.aciertos}/{oa.total}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={`h-full ${pct >= 70 ? "bg-teal" : "bg-accent"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {preguntas.map((p, i) => {
          const marcada = respuestas[p.id];
          const acierto = marcada === p.correcta;
          const habilidad = getHabilidad(lectura.nivel, p.habilidad);
          return (
            <div
              key={p.id}
              className={`rounded-2xl border p-5 ${
                acierto ? "border-teal bg-teal-soft" : "border-danger bg-danger-soft"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-ink">
                    {i + 1}. {p.enunciado}
                  </p>
                  <p className="mt-1 text-[11px] text-ink-soft">
                    {habilidad?.oa ? `${habilidad.oa} · ` : ""}
                    {habilidad?.label ?? p.habilidad}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    acierto ? "text-teal" : "text-danger"
                  }`}
                >
                  {acierto ? "Correcta" : "Incorrecta"}
                </span>
              </div>
              <p className="mt-3 text-sm text-ink-soft">
                Tu respuesta:{" "}
                <span className={`font-semibold ${acierto ? "text-teal" : "text-danger"}`}>
                  {p.alternativas[marcada] ?? "Sin responder"}
                </span>
              </p>
              {!acierto && (
                <p className="mt-1 text-sm text-ink-soft">
                  Correcta:{" "}
                  <span className="font-semibold text-teal">{p.alternativas[p.correcta]}</span>
                </p>
              )}
              <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-ink-soft">
                {p.explicacion}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <BotonInformePDF
          lectura={lectura}
          respuestas={respuestas}
          metricas={metricas}
          desempeno={desempeno}
        />
        <button
          type="button"
          onClick={onReintentar}
          className="rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
        >
          Repetir esta lectura
        </button>
        <button
          type="button"
          onClick={onNueva}
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover"
        >
          Nueva actividad
        </button>
      </div>

      {lectura.id && !String(lectura.id).startsWith("demo") && (
        <ValoracionActividad lectura={lectura} />
      )}
    </section>
  );
}
