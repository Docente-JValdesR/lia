import { SITE } from "@/data/site";

export const metadata = {
  title: "Contacto",
  description:
    "Canales de contacto para consultas, sugerencias, reporte de textos con información incorrecta o uso institucional de L+IA.",
  alternates: { canonical: "/contact" },
};

const CANALES = [
  {
    id: "email",
    titulo: "Correo electrónico",
    texto: "Escríbeme y responderé tu consulta apenas sea posible.",
    valor: SITE.email,
    href: `mailto:${SITE.email}`,
    color: "text-brand",
    icono: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>
    ),
  },
  {
    id: "telefono",
    titulo: "Teléfono",
    texto: "También puedes contactarme directamente por teléfono.",
    valor: SITE.telefono,
    href: `tel:${SITE.telefonoLink}`,
    color: "text-ink",
    icono: (
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" />
    ),
  },
  {
    id: "whatsapp",
    titulo: "WhatsApp",
    texto: "Envíame un mensaje directo para consultas rápidas.",
    valor: SITE.telefono,
    href: `https://wa.me/${SITE.telefonoLink.replace("+", "")}`,
    color: "text-teal",
    externo: true,
    icono: (
      <>
        <path d="M21 12a9 9 0 01-13.4 7.8L3 21l1.3-4.5A9 9 0 1121 12z" />
        <path d="M8.5 9.5c0 4 2 6 6 6l1-2-2.5-1-1 1a5 5 0 01-1.5-1.5l1-1-1-2.5-2 1z" />
      </>
    ),
  },
  {
    id: "linkedin",
    titulo: "LinkedIn",
    texto: "Conoce mi perfil profesional y otros proyectos educativos.",
    valor: "Ver perfil",
    href: SITE.linkedin,
    color: "text-brand",
    externo: true,
    icono: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4" />
      </>
    ),
  },
];

export default function Contacto() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-center text-4xl font-extrabold text-ink">Contacto</h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-ink-soft">
        Para consultas pedagógicas, sugerencias de mejora, problemas técnicos, reporte de un texto
        con información incorrecta o interés en usar L+IA en un establecimiento, puedes escribirme
        directamente.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {CANALES.map((canal) => (
          <div
            key={canal.id}
            className="rounded-2xl border border-line bg-surface p-6 text-center transition hover:-translate-y-0.5 hover:border-brand"
          >
            <svg
              className={`mx-auto h-7 w-7 ${canal.color}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {canal.icono}
            </svg>
            <h2 className="mt-4 text-base font-bold text-ink">{canal.titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{canal.texto}</p>
            <a
              href={canal.href}
              {...(canal.externo ? { target: "_blank", rel: "noreferrer" } : {})}
              className={`mt-4 inline-block text-sm font-semibold ${canal.color} hover:underline`}
            >
              {canal.valor}
            </a>
          </div>
        ))}
      </div>

      <p className="mt-12 text-center text-xs text-ink-soft">
        Proyecto desarrollado por {SITE.autor}.
      </p>
    </div>
  );
}
