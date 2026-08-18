import Link from "next/link";
import AvisoIA from "@/components/AvisoIA";
import Logo from "@/components/layout/Logo";
import { SITE } from "@/data/site";

const ENLACES = [
  { title: "Sobre L+IA", href: "/about" },
  { title: "Preguntas frecuentes", href: "/faq" },
  { title: "Contacto", href: "/contact" },
  { title: "Privacidad", href: "/privacy-policy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-2 text-sm font-semibold text-brand">{SITE.eslogan}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{SITE.descripcion}</p>
          </div>

          <ul className="grid gap-2.5 text-sm sm:text-right">
            {ENLACES.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="text-ink-soft transition hover:text-brand">
                  {e.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>Desarrollado por {SITE.autor} · Alineado al Currículum Nacional de Chile</p>
          <p>
            &copy; {new Date().getFullYear()} {SITE.nombre}. Todos los derechos reservados.
          </p>
        </div>

        <AvisoIA variante="linea" className="mt-4" />
      </div>
    </footer>
  );
}
