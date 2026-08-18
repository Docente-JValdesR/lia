"use client";

import { useState } from "react";

function Estrellas({ valor, onCambio, tamano = 28, etiqueta }) {
  const [hover, setHover] = useState(0);
  const activo = hover || valor;

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label={etiqueta}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={valor === n}
          aria-label={`${n} de 5`}
          onClick={() => onCambio(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="transition hover:scale-110"
        >
          <svg
            width={tamano}
            height={tamano}
            viewBox="0 0 24 24"
            fill={n <= activo ? "var(--accent)" : "none"}
            stroke={n <= activo ? "var(--accent)" : "var(--line)"}
            strokeWidth="1.6"
            strokeLinejoin="round"
          >
            <path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 16.9 6.7 19.7l1.1-6.1L3.4 9.4l6-.8L12 3z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ValoracionActividad({ lectura, onListo }) {
  const [estrellasTexto, setEstrellasTexto] = useState(0);
  const [comentario, setComentario] = useState("");
  const [porPregunta, setPorPregunta] = useState({});
  const [verPreguntas, setVerPreguntas] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);

  const enviar = async () => {
    setEnviando(true);
    setError(null);
    try {
      const respuesta = await fetch("/api/valoraciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textoId: lectura.id,
          estrellas: estrellasTexto,
          comentario: comentario.trim() || null,
          origen: "estudiante",
          preguntas: Object.entries(porPregunta).map(([preguntaId, estrellas]) => ({
            preguntaId,
            estrellas,
          })),
        }),
      });
      if (!respuesta.ok) {
        const detalle = await respuesta.json().catch(() => ({}));
        throw new Error(detalle.error ?? "No se pudo guardar tu valoración. Inténtalo otra vez.");
      }
      setEnviado(true);
      onListo?.();
    } catch (e) {
      const sinConexion = e instanceof TypeError;
      setError(
        sinConexion
          ? "No hay conexión con el servidor. Revisa que la aplicación esté en línea e inténtalo otra vez."
          : e.message
      );
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="rounded-2xl bg-teal-soft p-5 text-center text-sm font-semibold text-ink">
        ¡Gracias! Tu opinión me ayuda a mejorar los textos que preparo.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <h4 className="text-sm font-bold text-ink">¿Qué te pareció este texto?</h4>
      <p className="mt-1 text-xs text-ink-soft">
        Tu valoración nos ayuda a decidir qué textos conservamos.
      </p>

      <div className="mt-4 flex justify-center">
        <Estrellas
          valor={estrellasTexto}
          onCambio={setEstrellasTexto}
          etiqueta="Valoración del texto"
        />
      </div>

      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="¿Por qué? Cuéntame qué te gustó o qué mejorarías (opcional)."
        rows={2}
        className="mt-4 w-full resize-none rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm text-ink outline-none transition focus:border-brand"
      />

      <button
        type="button"
        onClick={() => setVerPreguntas((v) => !v)}
        className="mt-3 text-xs font-semibold text-brand hover:underline"
      >
        {verPreguntas ? "Ocultar valoración por pregunta" : "Valorar cada pregunta"}
      </button>

      {verPreguntas && (
        <div className="mt-3 space-y-3 border-t border-line pt-3">
          {lectura.preguntas.map((p, i) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-2">
              <p className="max-w-md text-xs text-ink-soft">
                {i + 1}. {p.enunciado}
              </p>
              <Estrellas
                tamano={20}
                valor={porPregunta[p.id] ?? 0}
                onCambio={(n) => setPorPregunta((s) => ({ ...s, [p.id]: n }))}
                etiqueta={`Valoración de la pregunta ${i + 1}`}
              />
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-3 text-xs font-semibold text-danger">{error}</p>}

      <button
        type="button"
        onClick={enviar}
        disabled={!estrellasTexto || enviando}
        className="mt-4 w-full rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-50"
      >
        {enviando ? "Enviando..." : "Enviar valoración"}
      </button>
    </div>
  );
}
