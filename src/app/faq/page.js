import Image from "next/image";
import Link from "next/link";
import AvisoIA from "@/components/AvisoIA";
import { FAQ } from "@/data/site";

export const metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas sobre qué es L+IA, cómo se generan los textos con inteligencia artificial, control de calidad, niveles disponibles, velocidad lectora y uso en el aula y en el hogar.",
  alternates: { canonical: "/faq" },
};

const datosFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.titulo,
    acceptedAnswer: { "@type": "Answer", text: item.texto },
  })),
};

export default function Faq() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datosFaq) }}
      />
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-4xl font-extrabold text-ink">Preguntas frecuentes</h1>
          <p className="mt-4 text-ink-soft">
            Lo que suelen preguntar estudiantes, familias, docentes y equipos directivos antes de
            usar L+IA.
          </p>

          <AvisoIA className="mt-6" />

          <div className="mt-10 space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.titulo}
                className="group rounded-2xl border border-line bg-surface p-5 transition hover:border-brand"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-bold text-ink marker:content-['']">
                  {item.titulo}
                  <svg
                    className="h-4 w-4 shrink-0 text-ink-soft transition group-open:rotate-180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.texto}</p>
              </details>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <Image src="/images/faq.svg" alt="" width={460} height={380} className="w-full" />
          <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
            <h2 className="text-sm font-bold text-ink">¿No encuentras tu respuesta?</h2>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              Escríbeme y con gusto respondo dudas sobre el uso pedagógico o técnico de la
              plataforma.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block rounded-full bg-brand-soft px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white"
            >
              Ir a contacto
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
