import AvisoIA from "@/components/AvisoIA";
import { SITE } from "@/data/site";

export const metadata = {
  title: "Política de privacidad",
  description:
    "Cómo L+IA maneja la información de quienes usan la plataforma: sin cuentas, sin seguimiento, con almacenamiento local y uso acotado de inteligencia artificial.",
  alternates: { canonical: "/privacy-policy" },
};

const SECCIONES = [
  {
    titulo: "1. Introducción",
    texto:
      "Esta política explica cómo L+IA maneja la información de las personas que usan la plataforma. El principio es simple: se procesa únicamente lo necesario para entregar la experiencia de lectura.",
  },
  {
    titulo: "2. Recopilación de información",
    texto:
      "La plataforma no requiere crear una cuenta ni solicita datos personales. No se mantiene un registro de usuarios ni se recopilan nombres, correos ni datos de establecimientos.",
  },
  {
    titulo: "3. Almacenamiento local",
    texto:
      "L+IA no guarda un historial de actividades ni resultados: cada actividad es independiente y sus datos se pierden al recargar la página. Lo único que se conserva en el navegador son tus preferencias de uso, como el tema claro u oscuro y si quieres que L+IA lea en voz alta. Esa información no se envía a ningún servidor.",
  },
  {
    titulo: "4. Cookies y seguimiento",
    texto:
      "L+IA no utiliza cookies publicitarias ni tecnologías de seguimiento de terceros con fines comerciales.",
  },
  {
    titulo: "5. Uso de inteligencia artificial",
    texto:
      "Los textos y las preguntas de la plataforma son generados por modelos de inteligencia artificial de terceros. Para producirlos se envían únicamente los parámetros pedagógicos de la actividad (nivel, unidad temática, tipo de texto, extensión, cantidad de preguntas y habilidades). No se envían datos personales de estudiantes ni de docentes, porque la plataforma no los recopila. Las llamadas a los modelos las realiza el servidor de L+IA, nunca el navegador del usuario.",
  },
  {
    titulo: "6. Exactitud del contenido generado",
    texto:
      "Al ser contenido generado automáticamente, los textos pueden contener información imprecisa, incompleta o errónea. L+IA aplica validaciones automáticas de estructura y de ajuste curricular, pero ninguna de ellas garantiza la veracidad de los hechos narrados o expuestos. El material no debe usarse como fuente de información y se recomienda su revisión antes de emplearlo en el aula.",
  },
  {
    titulo: "7. Valoraciones",
    texto:
      "Al finalizar una actividad puedes calificarla con estrellas y dejar un comentario. Esa información se guarda asociada al texto, no a una persona, y se utiliza para decidir qué actividades se conservan en la Biblioteca. No incluyas datos personales en los comentarios.",
  },
  {
    titulo: "8. Menores de edad y uso escolar",
    texto:
      "La plataforma está pensada para uso escolar y familiar. Dado que no se solicitan datos personales ni se crean cuentas, no se recopila información identificable de estudiantes. Si en el futuro se incorporan cuentas institucionales o desafíos compartidos por curso, se informará y se ajustará esta política antes de habilitarlos.",
  },
  {
    titulo: "9. Cambios en esta política",
    texto:
      "Si se incorporan funcionalidades que impliquen el tratamiento de datos personales, esta política se actualizará y se publicará la nueva versión junto con su fecha de actualización.",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-extrabold text-ink">Política de privacidad</h1>
      <p className="mt-2 text-sm text-ink-soft">Última actualización: 18 de agosto de 2026</p>

      <AvisoIA className="mt-6" />

      <div className="mt-10 space-y-8">
        {SECCIONES.map((s) => (
          <section key={s.titulo}>
            <h2 className="text-lg font-bold text-ink">{s.titulo}</h2>
            <p className="mt-2 leading-relaxed text-ink-soft">{s.texto}</p>
          </section>
        ))}

        <section>
          <h2 className="text-lg font-bold text-ink">10. Contacto</h2>
          <p className="mt-2 leading-relaxed text-ink-soft">
            Ante cualquier duda sobre esta política, puedes escribir a{" "}
            <a href={`mailto:${SITE.email}`} className="font-semibold text-brand hover:underline">
              {SITE.email}
            </a>{" "}
            o comunicarte al {SITE.telefono}.
          </p>
        </section>
      </div>
    </div>
  );
}
