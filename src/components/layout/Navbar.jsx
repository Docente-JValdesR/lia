"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { NAVEGACION } from "@/data/site";

export default function Navbar() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  const esActivo = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" onClick={() => setAbierto(false)}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAVEGACION.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-full px-3.5 py-2 text-sm transition ${
                  esActivo(item.href)
                    ? "bg-brand-soft font-semibold text-brand"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.title}
              </Link>
            </li>
          ))}
          <li className="ml-1">
            <ThemeToggle />
          </li>
          <li className="ml-1">
            <Link
              href="/app"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover"
            >
              Comenzar
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={abierto}
            className="rounded-xl border border-line p-2 text-ink-soft"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {abierto ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {abierto && (
        <ul className="space-y-1 border-t border-line bg-surface px-6 py-4 md:hidden">
          {NAVEGACION.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setAbierto(false)}
                className={`block rounded-xl px-3 py-2.5 text-sm transition ${
                  esActivo(item.href)
                    ? "bg-brand-soft font-semibold text-brand"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
