const ICONO = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
    aria-hidden="true"
  >
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
    <path d="M10.3 3.9L2.4 17.5A2 2 0 004.1 20.5h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
  </svg>
);

const TITULO = "Contenido generado con inteligencia artificial";
const CUERPO =
  "Los textos y las preguntas de esta plataforma los escribe una inteligencia artificial. Por eso la información no siempre es correcta: puede tener datos equivocados, imprecisos o incompletos. Comprueba los datos antes de usarlos como fuente y revisa el material antes de llevarlo al aula.";

export default function AvisoIA({ variante = "completo", className = "" }) {
  if (variante === "linea") {
    return (
      <p className={`text-[11px] leading-relaxed text-ink-soft ${className}`}>
        Contenido creado con IA: la información puede tener errores.
      </p>
    );
  }

  if (variante === "compacto") {
    return (
      <div
        className={`flex items-start gap-2.5 rounded-xl border border-accent bg-accent-soft px-3.5 py-2.5 text-accent ${className}`}
      >
        {ICONO}
        <p className="text-[11px] leading-relaxed text-ink">
          <span className="font-bold">Texto creado con IA.</span> La información no siempre es
          correcta: puede tener datos equivocados. Comprueba lo que leas antes de darlo por cierto.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-accent bg-accent-soft p-5 text-accent ${className}`}
    >
      {ICONO}
      <div>
        <h2 className="text-sm font-bold text-ink">{TITULO}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink">{CUERPO}</p>
      </div>
    </div>
  );
}
