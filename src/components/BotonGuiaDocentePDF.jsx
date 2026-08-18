"use client";

import { useState } from "react";

function nombreArchivo(titulo) {
  const limpio = titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 60);
  return `guia-docente-lia-${limpio || "actividad"}.pdf`;
}

export default function BotonGuiaDocentePDF({ lectura }) {
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState(null);

  const descargar = async () => {
    setGenerando(true);
    setError(null);
    try {
      const [{ pdf }, { default: GuiaDocentePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/GuiaDocentePDF"),
      ]);
      const blob = await pdf(<GuiaDocentePDF lectura={lectura} />).toBlob();
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = nombreArchivo(lectura.titulo);
      enlace.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("No se pudo generar la guía docente. Inténtalo otra vez.");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={descargar}
        disabled={generando}
        className="flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12" />
          <path d="M7 11l5 5 5-5" />
          <path d="M4 20h16" />
        </svg>
        {generando ? "Generando guía..." : "Descargar guía docente"}
      </button>
      {error && <span className="text-[11px] font-semibold text-danger">{error}</span>}
    </div>
  );
}