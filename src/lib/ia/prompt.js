import {
  DIFICULTADES,
  EJES,
  getExtension,
  getHabilidades,
  getNivel,
  getUnidad,
  ppmReferencia,
  TIPOS_TEXTO,
} from "@/data/curriculum";

export const PROMPT_VERSION = "v1";

const SISTEMA = `Eres un especialista en didáctica de la lectura y en las Bases Curriculares de Lenguaje y Comunicación del MINEDUC de Chile.
Creas textos de lectura y evaluaciones de comprensión rigurosamente ajustados al nivel escolar solicitado.
Escribes en español de Chile, natural y neutro, sin modismos que dificulten la comprensión y sin localismos innecesarios.
Nunca inventas datos falsos: si el texto es informativo, todo lo que afirmas debe ser verificable y correcto.
Evitas contenido sensible, violento, sexual, político partidista o que refuerce estereotipos.
Respondes únicamente con un objeto JSON válido, sin texto adicional ni marcas de código.`;

export function construirPrompt(config) {
  const nivel = getNivel(config.nivel);
  const unidad = getUnidad(config.nivel, config.unidad);
  const rango = getExtension(config.nivel, config.dificultad);
  const dificultad = DIFICULTADES.find((d) => d.id === config.dificultad)?.label;
  const tipoTexto = TIPOS_TEXTO.find((t) => t.id === config.tipoTexto);
  const habilidades = getHabilidades(config.nivel).filter((h) =>
    config.habilidades.includes(h.id)
  );

  const oaInvolucrados = nivel.oa.filter((oa) =>
    habilidades.some((h) => h.oa === oa.codigo)
  );

  const detalleHabilidades = habilidades
    .map((h) => {
      const eje = EJES.find((e) => e.id === h.eje)?.label;
      return `- id "${h.id}" · ${h.label} · eje: ${eje} · ${h.oa} · ${h.detalle}`;
    })
    .join("\n");

  const detalleOA = oaInvolucrados
    .map((oa) => `- ${oa.codigo} (${oa.dominio}): ${oa.enunciado}`)
    .join("\n");

  const objetivo = Math.round((rango.min + rango.max) / 2);
  const minutos = Math.max(1, Math.round(objetivo / ppmReferencia(config.nivel)));

  const usuario = `Genera una actividad de comprensión lectora con estas especificaciones.

## Destinatario
- Nivel: ${nivel.label} (estudiantes de ${nivel.edad})
- Foco pedagógico del nivel: ${nivel.foco}

## Unidad temática del programa
- ${unidad.titulo}: ${unidad.foco}
- Referencias de lectura del programa: ${unidad.lecturas}

## Texto
- Tipo de texto: ${tipoTexto?.label} (${tipoTexto?.detalle})
- Extensión ${dificultad}: entre ${rango.min} y ${rango.max} palabras. Apunta a ${objetivo} palabras.
- Debe poder leerse en torno a ${minutos} minuto(s) a la velocidad esperada del nivel.
- Divídelo en párrafos de entre 3 y 6 oraciones.
- El vocabulario y la sintaxis deben corresponder a la edad indicada.
- El texto debe contener toda la información necesaria para responder las preguntas.

## Objetivos de Aprendizaje involucrados
${detalleOA}

## Preguntas
- Cantidad exacta: ${config.cantidadPreguntas}
- Cada pregunta debe declarar el id exacto de una de estas habilidades:
${detalleHabilidades}
- Distribuye las preguntas entre las habilidades indicadas y cubre todos sus ejes.
- Cada pregunta tiene 4 alternativas, una sola correcta, indicada por su índice (0 a 3).
- Los distractores deben ser verosímiles y del mismo largo aproximado que la correcta.
- La alternativa correcta no debe ser reconocible por su extensión ni por repetir literalmente una frase del texto en preguntas de interpretación.
- La explicación debe indicar en qué parte del texto se sustenta la respuesta.

## Formato de salida
Devuelve exclusivamente este JSON:
{
  "titulo": "string",
  "parrafos": ["string", "string"],
  "preguntas": [
    {
      "enunciado": "string",
      "alternativas": ["string", "string", "string", "string"],
      "correcta": 0,
      "explicacion": "string",
      "habilidad": "id_de_la_habilidad"
    }
  ]
}`;

  return { sistema: SISTEMA, usuario, version: PROMPT_VERSION };
}
