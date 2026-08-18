"use client";

import { useEffect, useState } from "react";

const CLAVE = "lia.tema";

export default function ThemeToggle() {
  const [tema, setTema] = useState(null);

  useEffect(() => {
    setTema(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const cambiar = () => {
    const nuevo = tema === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nuevo === "dark");
    localStorage.setItem(CLAVE, nuevo);
    setTema(nuevo);
  };

  // Evita el desajuste de hidratación mientras se resuelve el tema real.
  if (!tema) return <span className="h-9 w-9" aria-hidden="true" />;

  const esOscuro = tema === "dark";

  return (
    <button
      type="button"
      onClick={cambiar}
      aria-label={esOscuro ? "Activar modo claro" : "Activar modo oscuro"}
      title={esOscuro ? "Modo claro" : "Modo oscuro"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition hover:border-brand hover:text-brand"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {esOscuro ? (
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  );
}
