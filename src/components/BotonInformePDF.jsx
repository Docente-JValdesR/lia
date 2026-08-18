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
  return `informe-lia-${limpio || "lectura"}.pdf`;
}

export default function BotonInformePDF({ lectura, respuestas, metricas, desempeno }) {
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState(null);

  // La librería de PDF se carga solo al descargar, para no pesar en la carga inicial.
  const descargar = async () => {
    setGenerando(true);
    setError(null);
    try {
      const [{ pdf }, { default: InformePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/InformePDF"),
      ]);

      const blob = await pdf(
        <InformePDF
          lectura={lectura}
          respuestas={respuestas}
          metricas={metricas}
          desempeno={desempeno}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = nombreArchivo(lectura.titulo);
      enlace.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("No se pudo generar el PDF. Inténtalo otra vez.");
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
        className="flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand disabled:opacity-60"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v12" />
          <path d="M7 11l5 5 5-5" />
          <path d="M4 20h16" />
        </svg>
        {generando ? "Generando PDF..." : "Descargar informe en PDF"}
      </button>
      {error && <span className="text-[11px] font-semibold text-danger">{error}</span>}
    </div>
  );
}
