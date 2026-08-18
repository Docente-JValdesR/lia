"use client";

import { useVoz } from "@/components/voz/VozProvider";

export default function BotonEscuchar({ id, texto, etiqueta, className = "" }) {
  const { soportada, alternar, hablandoId } = useVoz();
  if (!soportada) return null;

  const activo = hablandoId === id;

  return (
    <button
      type="button"
      onClick={() => alternar(id, texto)}
      aria-label={activo ? "Detener lectura en voz alta" : "Escuchar en voz alta"}
      title={activo ? "Detener" : "Escuchar"}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
        activo
          ? "border-brand bg-brand text-white"
          : "border-line text-ink-soft hover:border-brand hover:text-brand"
      } ${className}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {activo ? (
          <>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </>
        ) : (
          <>
            <path d="M11 5L6 9H3v6h3l5 4V5z" />
            <path d="M16 9a4 4 0 010 6M19 6.5a8 8 0 010 11" />
          </>
        )}
      </svg>
      {etiqueta && <span>{activo ? "Detener" : etiqueta}</span>}
    </button>
  );
}
