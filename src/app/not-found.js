import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-32 text-center">
      <p className="lia-text-gradient text-6xl font-extrabold">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink">Página no encontrada</h1>
      <p className="mt-3 text-ink-soft">
        La página que buscas no existe o cambió de dirección.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          Volver al inicio
        </Link>
        <Link
          href="/app"
          className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
        >
          Ir a practicar
        </Link>
      </div>
    </div>
  );
}
