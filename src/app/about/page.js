import Image from "next/image";
import Link from "next/link";
import AvisoIA from "@/components/AvisoIA";
import { EJES, NIVELES } from "@/data/curriculum";
import { FLUJO_PEDAGOGICO, PERSONALIDAD, SITE } from "@/data/site";

export const metadata = {
  title: "Sobre L+IA",
  description:
    "Qué es L+IA, qué significa su nombre, cuál es su núcleo pedagógico, cómo se generan y validan los textos, y por qué la inteligencia artificial se suma al proceso educativo sin reemplazar al docente.",
  alternates: { canonical: "/about" },
};

const COMPONENTES_NOMBRE = [
  { simbolo: "L", titulo: "Lectura", texto: "El centro de la experiencia y del propósito." },
  { simbolo: "+", titulo: "Integración", texto: "La tecnología se suma, no reemplaza." },
  {
    simbolo: "IA",
    titulo: "Inteligencia Artificial",
    texto: "Motor de personalización y generación de contenido.",
  },
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-extrabold text-ink">
        Sobre <span className="lia-text-gradient">L+IA</span>
      </h1>
      <p className="mt-3 text-xl font-bold text-brand">{SITE.eslogan}</p>

      <p className="mt-6 text-lg leading-relaxed text-ink-soft">
        L+IA es una plataforma educativa chilena orientada al desarrollo y fortalecimiento de las
        habilidades lectoras mediante experiencias de aprendizaje apoyadas por inteligencia
        artificial y alineadas con el Currículum Nacional.
      </p>

      <div className="my-12 flex justify-center">
        <Image src="/images/about.svg" alt="" width={520} height={380} className="w-full max-w-md" />
      </div>

      <section className="rounded-3xl bg-brand-soft p-8">
        <h2 className="text-2xl font-extrabold text-ink">El significado del nombre</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {COMPONENTES_NOMBRE.map((item) => (
            <div key={item.titulo} className="rounded-2xl bg-surface p-5 text-center">
              <span className="lia-text-gradient text-3xl font-extrabold">{item.simbolo}</span>
              <h3 className="mt-2 text-sm font-bold text-ink">{item.titulo}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">{item.texto}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm font-semibold text-ink">
          L+IA no es simplemente una IA que genera textos y preguntas. Es una plataforma pedagógica
          que utiliza IA para adaptar la práctica de la lectura.
        </p>
      </section>

      <section className="mt-14 space-y-4">
        <h2 className="text-2xl font-extrabold text-ink">El núcleo pedagógico</h2>
        <p className="leading-relaxed text-ink-soft">
          Los modelos de IA disponibles hoy también pueden generar textos y preguntas. La
          diferenciación de L+IA está en la estructura pedagógica que determina cómo se utiliza esa
          inteligencia artificial.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface p-6">
          {FLUJO_PEDAGOGICO.map((etapa, i) => (
            <div key={etapa} className="flex items-center gap-2">
              <span className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink">
                {etapa}
              </span>
              {i < FLUJO_PEDAGOGICO.length - 1 && (
                <span className="text-ink-soft" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm font-bold text-brand">
          La IA genera el contenido, pero la estructura pedagógica determina qué debe generar.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-ink">Los tres ejes de Lectura</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {EJES.map((eje) => (
            <div key={eje.id} className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="text-sm font-bold text-ink">{eje.label}</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                {eje.id === "localizar" &&
                  "Encontrar información que está dicha explícitamente en el texto."}
                {eje.id === "interpretar" &&
                  "Deducir, relacionar y sintetizar lo que el texto no dice de forma directa."}
                {eje.id === "reflexionar" &&
                  "Evaluar el contenido y la forma, y tomar postura con fundamento."}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-ink">Cómo se crea cada actividad</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Cuando alguien configura una actividad, la plataforma construye un prompt con todo el
          contexto curricular del nivel y lo envía a un modelo de inteligencia artificial. Si ese
          modelo falla o entrega un resultado que no cumple las reglas, se consulta al siguiente de
          la cadena. La actividad que se guarda es la primera que aprueba todos los filtros.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              titulo: "1. Validación de estructura",
              texto: "El resultado debe tener el formato exacto: título, párrafos, preguntas, alternativas, respuesta correcta y explicación.",
            },
            {
              titulo: "2. Validación curricular",
              texto: "Se rechaza si el texto se sale del rango de palabras del nivel, si usa habilidades ajenas al curso, si repite alternativas o si deja un eje sin cubrir.",
            },
            {
              titulo: "3. Validación humana",
              texto: "Estudiantes y docentes califican con estrellas cada texto y cada pregunta. Esa valoración decide qué se conserva y qué se retira.",
            },
          ].map((paso) => (
            <div key={paso.titulo} className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="text-sm font-bold text-ink">{paso.titulo}</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">{paso.texto}</p>
            </div>
          ))}
        </div>

        <AvisoIA className="mt-6" />

        <p className="mt-4 leading-relaxed text-ink-soft">
          Ningún filtro automático garantiza que un texto sea veraz. Por eso la validación humana no
          es opcional en L+IA: es parte del diseño del producto y la razón por la que existe la
          valoración con estrellas al final de cada actividad.
        </p>
      </section>

      <section className="mt-14 space-y-4">
        <h2 className="text-2xl font-extrabold text-ink">Por qué cursos focalizados</h2>
        <p className="leading-relaxed text-ink-soft">
          L+IA parte con {NIVELES.length} niveles: {NIVELES.map((n) => n.label).join(", ")}. Son los
          cursos que cuentan con métricas oficiales de velocidad lectora y extensión de textos.
          Preferimos ofrecer menos niveles con datos verificados antes que estimar rangos que
          después se traduzcan en exigencias arbitrarias para un estudiante.
        </p>
      </section>

      <section className="mt-14 space-y-4">
        <h2 className="text-2xl font-extrabold text-ink">Una marca que crece con el estudiante</h2>
        <p className="leading-relaxed text-ink-soft">
          L+IA acompaña desde 2º básico hasta 2º medio, por lo que la experiencia no debe ser
          excesivamente infantil. La identidad permanece, pero el lenguaje y la interfaz evolucionan
          según la edad.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
              Estudiante pequeño
            </p>
            <p className="mt-2 text-sm text-ink">
              🎉 ¡Muy bien! Encontraste una pista importante en el texto.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
              Estudiante mayor
            </p>
            <p className="mt-2 text-sm text-ink">
              Buena interpretación. La información del segundo párrafo permite respaldar tu
              respuesta.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-ink">Personalidad de L+IA</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONALIDAD.map((p) => (
            <div key={p.titulo} className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="text-sm font-bold text-brand">{p.titulo}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 space-y-4">
        <h2 className="text-2xl font-extrabold text-ink">Hacia dónde va</h2>
        <p className="leading-relaxed text-ink-soft">
          Las siguientes etapas contemplan cuentas de estudiante con seguimiento del progreso en el
          tiempo, desafíos compartidos por código entre docente y curso, y la generación a partir de
          una necesidad pedagógica descrita en palabras del propio docente, del tipo “mis estudiantes
          tienen dificultades para distinguir información explícita de implícita”.
        </p>
      </section>

      <div className="mt-14 flex flex-wrap gap-3">
        <Link
          href="/app"
          className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          Probar L+IA
        </Link>
        <Link
          href="/faq"
          className="rounded-full border border-line bg-surface px-7 py-3.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
        >
          Ver preguntas frecuentes
        </Link>
      </div>
    </div>
  );
}
