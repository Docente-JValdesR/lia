"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AvisoIA from "@/components/AvisoIA";
import {
  DIFICULTADES,
  EJES,
  getHabilidad,
  getNivel,
  getUnidad,
  NIVELES,
  TIPOS_TEXTO,
} from "@/data/curriculum";

const claseSelect =
  "rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-brand";

function Estrellas({ valor }) {
  return (
    <span className="flex items-center gap-0.5" title={`${valor} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={n <= Math.round(valor) ? "var(--accent)" : "none"}
          stroke={n <= Math.round(valor) ? "var(--accent)" : "var(--line)"}
          strokeWidth="2"
        >
          <path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 16.9 6.7 19.7l1.1-6.1L3.4 9.4l6-.8L12 3z" />
        </svg>
      ))}
    </span>
  );
}

export default function Biblioteca() {
  const [filtros, setFiltros] = useState({
    nivel: "",
    tipoTexto: "",
    dificultad: "",
    estado: "todos",
  });
  const [textos, setTextos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [abierto, setAbierto] = useState(null);

  useEffect(() => {
    const parametros = new URLSearchParams();
    for (const [campo, valor] of Object.entries(filtros)) {
      if (valor) parametros.set(campo, valor);
    }

    setCargando(true);
    fetch(`/api/textos?${parametros}`)
      .then((r) => r.json())
      .then((datos) => {
        if (datos.error) throw new Error(datos.error);
        setTextos(datos.textos ?? []);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [filtros]);

  const set = (campo, valor) => setFiltros((f) => ({ ...f, [campo]: valor }));

  const resumen = useMemo(() => {
    const palabras = textos.reduce((a, t) => a + t.nPalabras, 0);
    const preguntas = textos.reduce((a, t) => a + t.preguntas.length, 0);
    return { palabras, preguntas };
  }, [textos]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-extrabold text-ink">Biblioteca de textos</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        Actividades ya generadas y guardadas. Cada una indica cómo está construida: nivel, unidad,
        extensión, habilidades evaluadas y modelo que la produjo.
      </p>

      <AvisoIA className="mt-6" />

      <div className="mt-6 flex flex-wrap gap-3">
        <select value={filtros.nivel} onChange={(e) => set("nivel", e.target.value)} className={claseSelect}>
          <option value="">Todos los niveles</option>
          {NIVELES.map((n) => (
            <option key={n.id} value={n.id}>
              {n.label}
            </option>
          ))}
        </select>

        <select value={filtros.tipoTexto} onChange={(e) => set("tipoTexto", e.target.value)} className={claseSelect}>
          <option value="">Todo tipo de texto</option>
          {TIPOS_TEXTO.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        <select value={filtros.dificultad} onChange={(e) => set("dificultad", e.target.value)} className={claseSelect}>
          <option value="">Toda extensión</option>
          {DIFICULTADES.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>

        <select value={filtros.estado} onChange={(e) => set("estado", e.target.value)} className={claseSelect}>
          <option value="todos">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="aprobado">Aprobado</option>
          <option value="retirado">Retirado</option>
        </select>
      </div>

      <p className="mt-4 text-xs text-ink-soft">
        {cargando
          ? "Cargando..."
          : `${textos.length} ${textos.length === 1 ? "texto" : "textos"} · ${resumen.palabras.toLocaleString("es-CL")} palabras · ${resumen.preguntas} preguntas`}
      </p>

      {error && (
        <p className="mt-4 rounded-2xl border border-danger bg-danger-soft p-4 text-sm text-ink">
          {error}
        </p>
      )}

      {!cargando && !textos.length && !error && (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-sm text-ink-soft">
            Todavía no hay textos con esos filtros. Genera uno desde el modo docente.
          </p>
          <Link
            href="/app"
            className="mt-4 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Ir a generar
          </Link>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {textos.map((t) => {
          const nivel = getNivel(t.nivel);
          const unidad = getUnidad(t.nivel, t.unidad);
          const habilidades = [...new Set(t.preguntas.map((p) => p.habilidad))]
            .map((h) => getHabilidad(t.nivel, h))
            .filter(Boolean);
          const ejes = [...new Set(habilidades.map((h) => h.eje))];
          const oas = [...new Set(habilidades.map((h) => h.oa))];
          const expandido = abierto === t.id;

          return (
            <article key={t.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-xl">
                  <h2 className="text-base font-bold text-ink">{t.titulo}</h2>
                  <p className="mt-1 text-xs text-ink-soft">
                    {nivel.label} · {unidad.titulo}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      t.estado === "aprobado"
                        ? "bg-teal-soft text-teal"
                        : t.estado === "retirado"
                          ? "bg-danger-soft text-danger"
                          : "bg-accent-soft text-accent"
                    }`}
                  >
                    {t.estado}
                  </span>
                  {t.valoracion ? (
                    <span className="flex items-center gap-1 text-[11px] text-ink-soft">
                      <Estrellas valor={t.valoracion} /> {t.valoracion} ({t.nValoraciones})
                    </span>
                  ) : (
                    <span className="text-[11px] text-ink-soft">Sin valoraciones</span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-ink-soft">
                  {TIPOS_TEXTO.find((x) => x.id === t.tipoTexto)?.label}
                </span>
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-ink-soft">
                  Extensión {DIFICULTADES.find((d) => d.id === t.dificultad)?.label.toLowerCase()} ·{" "}
                  {t.nPalabras} palabras
                </span>
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-ink-soft">
                  {t.preguntas.length} preguntas
                </span>
                {oas.map((oa) => (
                  <span key={oa} className="rounded-full bg-brand-soft px-2.5 py-1 font-semibold text-brand">
                    {oa}
                  </span>
                ))}
                {ejes.map((eje) => (
                  <span key={eje} className="rounded-full bg-surface-2 px-2.5 py-1 text-ink-soft">
                    {EJES.find((e) => e.id === eje)?.label}
                  </span>
                ))}
                {t.modelo && (
                  <span className="rounded-full bg-surface-2 px-2.5 py-1 text-ink-soft">
                    {t.proveedor} · {t.modelo}
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/app?texto=${t.id}`}
                  className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
                >
                  Practicar este texto
                </Link>
                <button
                  type="button"
                  onClick={() => setAbierto(expandido ? null : t.id)}
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
                >
                  {expandido ? "Ocultar detalle" : "Ver detalle"}
                </button>
              </div>

              {expandido && (
                <div className="mt-5 space-y-4 border-t border-line pt-4">
                  <div className="space-y-2 text-sm leading-relaxed text-ink-soft">
                    {t.parrafos.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {t.preguntas.map((p, i) => {
                      const h = getHabilidad(t.nivel, p.habilidad);
                      return (
                        <div key={p.id} className="rounded-xl bg-surface-2 p-3">
                          <p className="text-xs font-semibold text-ink">
                            {i + 1}. {p.enunciado}
                          </p>
                          <p className="mt-1 text-[11px] text-ink-soft">
                            {h ? `${h.oa} · ${h.label}` : p.habilidad}
                          </p>
                          <ul className="mt-2 space-y-1">
                            {p.alternativas.map((alt, j) => (
                              <li
                                key={j}
                                className={`text-[11px] ${
                                  j === p.correcta ? "font-bold text-teal" : "text-ink-soft"
                                }`}
                              >
                                {String.fromCharCode(65 + j)}. {alt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
