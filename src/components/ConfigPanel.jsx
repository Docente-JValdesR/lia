"use client";

import {
  CICLOS,
  CONFIG_DEFAULT,
  DIFICULTADES,
  EJES,
  getExtension,
  getNivel,
  habilidadesPorDefecto,
  minutosEstimados,
  NIVELES,
  TIPOS_TEXTO,
} from "@/data/curriculum";

const claseSelect =
  "rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand";

export default function ConfigPanel({ config, onChange, onGenerar, cargando }) {
  const set = (campo, valor) => onChange({ ...config, [campo]: valor });

  const nivel = getNivel(config.nivel);
  const ciclo = CICLOS.find((c) => c.id === nivel.ciclo);
  const unidad = nivel.unidades.find((u) => u.id === config.unidad) ?? nivel.unidades[0];
  const extension = getExtension(config.nivel, config.dificultad);
  const tiempo = minutosEstimados(config.nivel, config.dificultad);

  const cambiarNivel = (nivelId) => {
    onChange({
      ...config,
      nivel: nivelId,
      unidad: "u1",
      habilidades: habilidadesPorDefecto(nivelId),
    });
  };

  const toggleHabilidad = (id) => {
    const actuales = config.habilidades ?? [];
    const nuevas = actuales.includes(id)
      ? actuales.filter((h) => h !== id)
      : [...actuales, id];
    set("habilidades", nuevas.length ? nuevas : actuales);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <header className="mb-6">
          <h2 className="text-lg font-bold text-ink">Configuración de la actividad</h2>
          <p className="text-sm text-ink-soft">
            Parámetros alineados al Currículum Nacional para los niveles focalizados.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-ink">Nivel</span>
            <select
              value={config.nivel}
              onChange={(e) => cambiarNivel(e.target.value)}
              className={claseSelect}
            >
              {NIVELES.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-ink-soft">{ciclo?.label}</span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-ink">Tipo de texto</span>
            <select
              value={config.tipoTexto}
              onChange={(e) => set("tipoTexto", e.target.value)}
              className={claseSelect}
            >
              {TIPOS_TEXTO.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-ink-soft">
              {TIPOS_TEXTO.find((t) => t.id === config.tipoTexto)?.detalle}
            </span>
          </label>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-sm font-semibold text-ink">Unidad temática del nivel</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {nivel.unidades.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => set("unidad", u.id)}
                  className={`rounded-2xl border px-4 py-3 text-left text-xs transition ${
                    config.unidad === u.id
                      ? "border-brand bg-brand-soft text-ink"
                      : "border-line bg-surface-2 text-ink-soft hover:border-brand"
                  }`}
                >
                  <span className="block text-sm font-bold text-ink">{u.titulo}</span>
                  <span className="mt-1 block leading-relaxed">{u.foco}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-ink-soft">Lecturas sugeridas: {unidad.lecturas}</p>
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-sm font-semibold text-ink">Extensión del texto</span>
            <div className="grid grid-cols-3 gap-2">
              {DIFICULTADES.map((d) => {
                const rango = getExtension(config.nivel, d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => set("dificultad", d.id)}
                    className={`rounded-2xl border px-2 py-2.5 text-xs transition ${
                      config.dificultad === d.id
                        ? "border-brand bg-brand-soft text-brand"
                        : "border-line bg-surface-2 text-ink-soft hover:border-brand"
                    }`}
                  >
                    <span className="block font-bold">{d.label}</span>
                    <span className="block text-[11px]">
                      {rango.min}-{rango.max} palabras
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-ink-soft">
              {extension.min}-{extension.max} palabras · lectura estimada de {tiempo.min}-
              {tiempo.max} min a la velocidad esperada del nivel
            </p>
          </div>

          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-sm font-semibold text-ink">
              Cantidad de preguntas:{" "}
              <span className="text-brand">{config.cantidadPreguntas}</span>
            </span>
            <input
              type="range"
              min={3}
              max={10}
              value={config.cantidadPreguntas}
              onChange={(e) => set("cantidadPreguntas", Number(e.target.value))}
              className="accent-[var(--brand)]"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <header className="mb-4">
          <h2 className="text-lg font-bold text-ink">Habilidades a trabajar</h2>
          <p className="text-sm text-ink-soft">
            Derivadas de los Objetivos de Aprendizaje de {nivel.label}, organizadas por eje de
            Lectura.
          </p>
        </header>

        <div className="space-y-3">
          {EJES.map((eje) => {
            const delEje = nivel.habilidades.filter((h) => h.eje === eje.id);
            if (!delEje.length) return null;
            return (
              <div key={eje.id} className="rounded-2xl bg-surface-2 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-soft">
                  {eje.label}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {delEje.map((h) => {
                    const activa = config.habilidades?.includes(h.id);
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => toggleHabilidad(h.id)}
                        className={`rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                          activa
                            ? "border-teal bg-teal-soft text-ink"
                            : "border-line bg-surface text-ink-soft hover:border-brand"
                        }`}
                      >
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-ink">{h.label}</span>
                          <span className="rounded-full bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                            {h.oa}
                          </span>
                        </span>
                        <span className="mt-1 block leading-relaxed">{h.detalle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-sm font-bold text-ink">Marco curricular de {nivel.label}</h2>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft">{nivel.foco}</p>

        <div className="mt-4 space-y-2">
          {nivel.oa.map((oa) => (
            <div key={oa.codigo} className="rounded-2xl bg-surface-2 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-bold text-brand">
                  {oa.codigo}
                </span>
                <span className="text-[11px] text-ink-soft">{oa.dominio}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">{oa.enunciado}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-ink-soft">
          <span className="font-semibold text-ink">Mecánica sugerida para el nivel:</span>{" "}
          {nivel.mecanicaUX}
        </p>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onGenerar}
          disabled={cargando}
          className="rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando ? "Generando..." : "Generar actividad"}
        </button>
        <button
          type="button"
          onClick={() => onChange(CONFIG_DEFAULT)}
          className="rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
        >
          Restablecer
        </button>
        <span className="text-xs text-ink-soft">
          Modo demo: se usa un texto estándar hasta conectar la generación con IA.
        </span>
      </div>
    </div>
  );
}
