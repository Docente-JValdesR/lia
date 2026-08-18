import Image from "next/image";
import Link from "next/link";
import AvisoIA from "@/components/AvisoIA";
import { NIVELES } from "@/data/curriculum";
import {
  BENEFICIOS_DOCENTE,
  BENEFICIOS_ESTUDIANTE,
  CICLO_APRENDIZAJE,
  PASOS_USO,
  PILARES,
  PUBLICOS,
  SITE,
} from "@/data/site";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            Alineado al Currículum Nacional de Chile
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            Lectura <span className="lia-text-gradient">+</span> Inteligencia Artificial
          </h1>
          <p className="lia-text-gradient mt-4 text-2xl font-bold">{SITE.eslogan}</p>

          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{SITE.proposito}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/app"
              className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover"
            >
              Comenzar a practicar
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-line bg-surface px-7 py-3.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
            >
              Conocer L+IA
            </Link>
          </div>

          <p className="mt-6 text-xs text-ink-soft">
            Sin registro · Gratuito · Para la escuela y el hogar
          </p>
        </div>

        <Image
          src="/images/hero.svg"
          alt="Actividad de lectura de L+IA con texto, preguntas y resultados"
          width={640}
          height={460}
          priority
          className="w-full"
        />
      </section>

      <section className="grid gap-6 rounded-3xl border border-line bg-surface p-8 sm:grid-cols-2 sm:p-10 lg:grid-cols-4">
        {PILARES.map((p) => (
          <div key={p.titulo}>
            <h2 className="text-sm font-bold text-ink">{p.titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.texto}</p>
          </div>
        ))}
      </section>

      <AvisoIA className="mt-6" />

      <section className="py-20">
        <h2 className="text-center text-3xl font-extrabold text-ink">
          Una plataforma, dos grandes propósitos
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-ink-soft">
          Dos necesidades distintas y profundamente relacionadas, sobre un mismo núcleo: currículum,
          pedagogía e inteligencia artificial.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PUBLICOS.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl border border-line bg-surface p-8 transition hover:border-brand"
            >
              <span className="text-3xl">{p.emoji}</span>
              <h3 className="mt-4 text-xl font-bold text-ink">{p.titulo}</h3>
              <p className="mt-1 text-sm font-semibold text-brand">{p.perfil}</p>
              <p className="mt-4 leading-relaxed text-ink-soft">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-brand-soft p-8 sm:p-12">
        <h2 className="text-center text-2xl font-extrabold text-ink">Ciclo de aprendizaje</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
          {CICLO_APRENDIZAJE.map((etapa, i) => (
            <div key={etapa} className="flex items-center gap-3">
              <span className="rounded-full bg-surface px-4 py-2 text-sm font-semibold text-brand shadow-sm">
                {etapa}
              </span>
              {i < CICLO_APRENDIZAJE.length - 1 && (
                <span className="text-ink-soft" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <h2 className="text-center text-3xl font-extrabold text-ink">Cómo funciona</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-ink-soft">
          Cuatro pasos que caben en los 10 a 15 minutos que recomienda el currículum para una
          actividad de lectura.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS_USO.map((paso) => (
            <div
              key={paso.numero}
              className="rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:border-brand"
            >
              <span className="lia-text-gradient text-3xl font-extrabold">{paso.numero}</span>
              <h3 className="mt-3 text-base font-bold text-ink">{paso.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{paso.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid items-center gap-12 py-12 lg:grid-cols-2">
        <Image
          src="/images/estudiantes.svg"
          alt="Estudiante respondiendo preguntas de comprensión"
          width={520}
          height={370}
          className="w-full"
        />
        <div>
          <p className="text-sm font-bold text-brand">🎒 Estudiantes y familias</p>
          <h2 className="mt-2 text-3xl font-extrabold text-ink">
            Practicar y ver el propio avance
          </h2>
          <ul className="mt-6 space-y-4">
            {BENEFICIOS_ESTUDIANTE.map((b) => (
              <li key={b.titulo} className="rounded-2xl border border-line bg-surface p-5">
                <h3 className="text-sm font-bold text-ink">{b.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{b.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid items-center gap-12 py-12 lg:grid-cols-2">
        <div className="lg:order-2">
          <Image
            src="/images/docentes.svg"
            alt="Panel de configuración y resultados por objetivo de aprendizaje"
            width={520}
            height={370}
            className="w-full"
          />
        </div>
        <div className="lg:order-1">
          <p className="text-sm font-bold text-teal">🍎 Docentes</p>
          <h2 className="mt-2 text-3xl font-extrabold text-ink">
            Crear material sin partir de cero
          </h2>
          <ul className="mt-6 space-y-4">
            {BENEFICIOS_DOCENTE.map((b) => (
              <li key={b.titulo} className="rounded-2xl border border-line bg-surface p-5">
                <h3 className="text-sm font-bold text-ink">{b.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{b.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-line bg-surface p-8 sm:p-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-2xl font-extrabold text-ink">Biblioteca de textos</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Cada actividad generada queda guardada y disponible para volver a usarla. La
              Biblioteca muestra cómo está construida cada una: nivel, unidad, tipo de texto,
              extensión, Objetivos de Aprendizaje, ejes evaluados, el modelo que la produjo y la
              valoración de quienes ya la usaron.
            </p>
          </div>
          <Link
            href="/biblioteca"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
          >
            Explorar la biblioteca
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-line bg-surface p-8 sm:p-12">
        <h2 className="text-2xl font-extrabold text-ink">Niveles disponibles</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          L+IA parte por los cursos focalizados, que son los que cuentan con matrices oficiales de
          velocidad lectora y extensión de textos.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {NIVELES.map((n) => (
            <div key={n.id} className="rounded-2xl bg-surface-2 p-5">
              <p className="text-base font-bold text-ink">{n.label}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">{n.foco}</p>
              <p className="mt-3 text-[11px] font-semibold text-brand">
                {n.extension.basica.min}-{n.extension.avanzada.max} palabras
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 text-center">
        <h2 className="text-3xl font-extrabold text-ink">Comprende. Practica. Avanza.</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          No necesitas cuenta ni instalar nada. Elige un nivel, genera una actividad y descubre qué
          habilidad conviene practicar después.
        </p>
        <Link
          href="/app"
          className="mt-8 inline-block rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover"
        >
          Entrar a L+IA
        </Link>
      </section>
    </div>
  );
}
