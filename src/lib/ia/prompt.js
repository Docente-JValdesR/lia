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
  const parrafosSugeridos = Math.max(3, Math.round(objetivo / 90));

  const usuario = `Genera una actividad de comprensión lectora con estas especificaciones.

## Destinatario
- Nivel: ${nivel.label} (estudiantes de ${nivel.edad})
- Foco pedagógico del nivel: ${nivel.foco}

## Unidad temática del programa
- ${unidad.titulo}: ${unidad.foco}
- Referencias de lectura del programa: ${unidad.lecturas}

## Texto
- Tipo de texto: ${tipoTexto?.label} (${tipoTexto?.detalle})
- **Extensión obligatoria: entre ${rango.min} y ${rango.max} palabras.** Apunta a ${objetivo} palabras.
- Este es el requisito más estricto: un texto más corto que ${rango.min} palabras será rechazado.
- Para alcanzar esa extensión escribe alrededor de ${parrafosSugeridos} párrafos de 5 a 7 oraciones cada uno.
- Desarrolla las ideas con ejemplos, detalles y explicaciones; no resumas.
- Debe poder leerse en torno a ${minutos} minuto(s) a la velocidad esperada del nivel.
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

// Sobre este largo, pedir texto y preguntas en una sola respuesta deja textos demasiado cortos.
export const UMBRAL_DOS_FASES = 700;

export function construirPromptTexto(config) {
  const nivel = getNivel(config.nivel);
  const unidad = getUnidad(config.nivel, config.unidad);
  const rango = getExtension(config.nivel, config.dificultad);
  const tipoTexto = TIPOS_TEXTO.find((t) => t.id === config.tipoTexto);
  const objetivo = Math.round((rango.min + rango.max) / 2);
  const parrafos = Math.max(4, Math.round(objetivo / 90));

  const usuario = `Escribe únicamente el texto de lectura de una actividad escolar.

## Destinatario
- Nivel: ${nivel.label} (estudiantes de ${nivel.edad})
- Foco pedagógico: ${nivel.foco}

## Unidad temática
- ${unidad.titulo}: ${unidad.foco}
- Referencias del programa: ${unidad.lecturas}

## Requisitos
- Tipo de texto: ${tipoTexto?.label} (${tipoTexto?.detalle})
- **Extensión obligatoria: entre ${rango.min} y ${rango.max} palabras.** Apunta a ${objetivo}.
- Escribe ${parrafos} párrafos de 5 a 7 oraciones cada uno. Cuenta las palabras mientras escribes.
- Un texto más corto que ${rango.min} palabras será rechazado: desarrolla cada idea con ejemplos y detalles.
- Vocabulario y sintaxis acordes a la edad. Español de Chile, neutro y claro.
- El contenido debe ser correcto y verificable; no inventes datos.

## Formato de salida
Devuelve exclusivamente este JSON:
{ "titulo": "string", "parrafos": ["string", "string"] }`;

  return { sistema: SISTEMA, usuario, version: PROMPT_VERSION };
}

export function construirPromptPreguntas(config, textoGenerado) {
  const nivel = getNivel(config.nivel);
  const habilidades = getHabilidades(config.nivel).filter((h) =>
    config.habilidades.includes(h.id)
  );
  const oaInvolucrados = nivel.oa.filter((oa) => habilidades.some((h) => h.oa === oa.codigo));

  const detalleHabilidades = habilidades
    .map((h) => {
      const eje = EJES.find((e) => e.id === h.eje)?.label;
      return `- id "${h.id}" · ${h.label} · eje: ${eje} · ${h.oa} · ${h.detalle}`;
    })
    .join("\n");

  const usuario = `Crea las preguntas de comprensión para el siguiente texto de ${nivel.label} (estudiantes de ${nivel.edad}).

## Texto
${textoGenerado.titulo}

${textoGenerado.parrafos.join("\n\n")}

## Objetivos de Aprendizaje involucrados
${oaInvolucrados.map((oa) => `- ${oa.codigo} (${oa.dominio}): ${oa.enunciado}`).join("\n")}

## Preguntas
- Cantidad exacta: ${config.cantidadPreguntas}
- Cada pregunta debe declarar el id exacto de una de estas habilidades:
${detalleHabilidades}
- Distribuye las preguntas entre esas habilidades y cubre todos sus ejes.
- Cada pregunta tiene 4 alternativas, una sola correcta, indicada por su índice (0 a 3).
- Los distractores deben ser verosímiles y de largo similar a la correcta.
- Toda respuesta debe poder sustentarse en el texto entregado.
- La explicación debe indicar en qué parte del texto se sustenta la respuesta.

## Formato de salida
Devuelve exclusivamente este JSON:
{ "preguntas": [ { "enunciado": "string", "alternativas": ["a","b","c","d"], "correcta": 0, "explicacion": "string", "habilidad": "id" } ] }`;

  return { sistema: SISTEMA, usuario, version: PROMPT_VERSION };
}

// Segundo intento cuando el modelo entregó un texto fuera del rango exigido.
export function prompsCorreccion(prompt, { nPalabras, rango }) {
  const faltan = rango.min - nPalabras;
  const ajuste =
    faltan > 0
      ? `Tu respuesta anterior tuvo ${nPalabras} palabras, ${faltan} menos que el mínimo exigido. Reescribe la actividad completa con un texto claramente más largo, de entre ${rango.min} y ${rango.max} palabras, agregando párrafos y desarrollando más cada idea.`
      : `Tu respuesta anterior tuvo ${nPalabras} palabras, más que el máximo permitido. Reescribe la actividad completa con un texto de entre ${rango.min} y ${rango.max} palabras.`;

  return { ...prompt, usuario: `${prompt.usuario}\n\n## Corrección obligatoria\n${ajuste}` };
}
