import { clasificarPPM, getNivel } from "@/data/curriculum";

// El registro cambia con la edad, manteniendo la misma identidad de marca.
export function tonoDe(nivelId) {
  return ["2basico", "4basico"].includes(nivelId) ? "pequeno" : "mayor";
}

export const SALUDO = [
  "¡Hola! 👋 Soy L+IA y te acompaño a practicar lectura.",
  "Vamos a preparar juntos tu actividad. Te haré algunas preguntas cortas.",
];

export const PREGUNTA_VOZ = "Antes de partir, ¿quieres que lea los mensajes en voz alta?";

export const PREGUNTA_NIVEL = "¿En qué curso estás?";

export function confirmacionNivel(nivelId) {
  const nivel = getNivel(nivelId);
  return tonoDe(nivelId) === "pequeno"
    ? `¡Genial, ${nivel.label}! Vamos a trabajar la lectura de tu curso.`
    : `Perfecto, ${nivel.label}. Trabajaremos con los objetivos de lectura de tu nivel.`;
}

export function preguntaUnidad(nivelId) {
  return tonoDe(nivelId) === "pequeno"
    ? "¿Sobre qué te gustaría leer?"
    : "¿Qué unidad temática quieres trabajar?";
}

export function preguntaTipoTexto(nivelId) {
  return tonoDe(nivelId) === "pequeno"
    ? "¿Qué tipo de texto quieres leer?"
    : "¿Con qué tipo de texto trabajamos?";
}

export function preguntaExtension(nivelId) {
  return tonoDe(nivelId) === "pequeno"
    ? "¿Qué tan largo quieres que sea el texto?"
    : "¿Con qué extensión de texto quieres trabajar?";
}

export function preguntaCantidad(nivelId) {
  return tonoDe(nivelId) === "pequeno"
    ? "¿Cuántas preguntas quieres responder?"
    : "¿Cuántas preguntas incluimos en la actividad?";
}

export function propuestaHabilidades(nivelId, etiquetas) {
  const lista = etiquetas.join(", ");
  return tonoDe(nivelId) === "pequeno"
    ? `Voy a preparar preguntas para practicar: ${lista}. ¿Te parece bien?`
    : `Propongo trabajar estas habilidades: ${lista}. ¿Las mantenemos?`;
}

export const PREGUNTA_HABILIDADES_MANUAL =
  "Marca las habilidades que quieras trabajar y cuando estés listo continúa.";

export function resumenConfiguracion({ nivel, unidad, tipoTexto, extension, cantidad }) {
  return `Resumen: ${nivel}, unidad "${unidad}", texto ${tipoTexto.toLowerCase()} de ${extension.min} a ${extension.max} palabras y ${cantidad} preguntas.`;
}

export const PREPARANDO = [
  "Estoy preparando tu texto, dame unos segundos...",
  "Ya casi: estoy escribiendo las preguntas.",
];

export const AVISO_IA =
  "Un dato importante: yo escribo estos textos con inteligencia artificial, así que la información podría tener errores. Si algo te llama la atención, comentálo con tu profesor o profesora.";

export function anuncioLectura(nivelId) {
  return tonoDe(nivelId) === "pequeno"
    ? "¡Listo! Aquí está tu texto. Léelo con calma y cuando termines aprieta el botón."
    : "Preparé tu texto. Cuando termines de leerlo, avísame para pasar a las preguntas.";
}

export function comentarioFluidez(nivelId, ppm) {
  const categoria = clasificarPPM(nivelId, ppm);
  const nivel = getNivel(nivelId);
  const pequeno = tonoDe(nivelId) === "pequeno";

  if (["muy_lenta", "lenta"].includes(categoria.id)) {
    return pequeno
      ? `Leíste a ${ppm} palabras por minuto. Vamos a practicar para leer un poquito más fluido. ¡Ahora las preguntas!`
      : `Leíste a ${ppm} ppm, una velocidad ${categoria.label.toLowerCase()} para ${nivel.label}. Conviene seguir trabajando la fluidez. Vamos con las preguntas.`;
  }
  if (["rapida", "muy_rapida"].includes(categoria.id)) {
    return pequeno
      ? `¡Uy, qué rápido! Leíste a ${ppm} palabras por minuto. Veamos si entendiste todo.`
      : `Leíste a ${ppm} ppm, una velocidad ${categoria.label.toLowerCase()} para ${nivel.label}. Ahora comprobemos la comprensión.`;
  }
  return pequeno
    ? `Leíste a ${ppm} palabras por minuto, muy bien para tu curso. Ahora las preguntas.`
    : `Leíste a ${ppm} ppm, dentro de lo esperado para ${nivel.label}. Pasemos a las preguntas.`;
}

export function presentacionPregunta(nivelId, indice, total) {
  return tonoDe(nivelId) === "pequeno"
    ? `Pregunta ${indice} de ${total}:`
    : `Pregunta ${indice} de ${total}.`;
}

export function feedbackRespuesta(nivelId, acierto, pregunta) {
  const pequeno = tonoDe(nivelId) === "pequeno";
  if (acierto) {
    return pequeno
      ? `🎉 ¡Muy bien! ${pregunta.explicacion}`
      : `Correcto. ${pregunta.explicacion}`;
  }
  return pequeno
    ? `Casi. La respuesta era «${pregunta.alternativas[pregunta.correcta]}». ${pregunta.explicacion}`
    : `No es la opción correcta. La respuesta era «${pregunta.alternativas[pregunta.correcta]}». ${pregunta.explicacion}`;
}

export const CIERRE_PREGUNTAS = "¡Listo! Terminaste todas las preguntas. Veamos cómo te fue.";

// Los rangos siguen el umbral de logro del 70% definido en la guía curricular.
export function mensajeLogro(nivelId, porcentaje) {
  const pequeno = tonoDe(nivelId) === "pequeno";

  if (porcentaje === 100) {
    return {
      celebrar: true,
      titulo: pequeno ? "¡Excelente trabajo!" : "¡Puntaje impecable!",
      texto: pequeno
        ? "Respondiste todas las preguntas correctamente. ¡Lo hiciste muy bien!"
        : "Respondiste correctamente la totalidad de las preguntas. Comprensión sólida del texto.",
    };
  }
  if (porcentaje >= 85) {
    return {
      celebrar: true,
      titulo: pequeno ? "¡Muy bien!" : "Muy buen desempeño",
      texto: pequeno
        ? "Entendiste casi todo el texto. ¡Vas por muy buen camino!"
        : "Tu comprensión del texto está por sobre lo esperado para el nivel.",
    };
  }
  if (porcentaje >= 70) {
    return {
      celebrar: true,
      titulo: pequeno ? "¡Buen trabajo!" : "Objetivo logrado",
      texto: pequeno
        ? "Comprendiste bien el texto. Con un poco más de práctica lo harás todavía mejor."
        : "Alcanzaste el umbral de logro del nivel. Hay espacio para afinar algunos ejes.",
    };
  }
  if (porcentaje >= 40) {
    return {
      celebrar: false,
      titulo: pequeno ? "¡Vas avanzando!" : "Vas en camino",
      texto: pequeno
        ? "Entendiste varias cosas del texto. Sigamos practicando para lograrlo completo."
        : "Aún no alcanzas el umbral de logro, pero ya dominas parte de las habilidades trabajadas.",
    };
  }
  if (porcentaje > 0) {
    return {
      celebrar: false,
      titulo: pequeno ? "Sigamos practicando" : "Conviene reforzar",
      texto: pequeno
        ? "Este texto estuvo difícil, y eso pasa. Con práctica se vuelve mucho más fácil."
        : "El desempeño está bajo lo esperado. Vale la pena volver al texto y revisar las respuestas.",
    };
  }
  return {
    celebrar: false,
    titulo: pequeno ? "No te desanimes" : "Empecemos de nuevo",
    texto: pequeno
      ? "A todos nos pasa alguna vez. Volvamos a leer con calma y lo intentamos otra vez."
      : "Ningún acierto en esta actividad. Releer el texto con una estrategia clara cambia por completo el resultado.",
  };
}

export const DESPEDIDA =
  "Puedes revisar el informe completo para ver cada pregunta con su respuesta correcta, o preparar una actividad nueva.";

export const AGRADECE_VALORACION =
  "¡Gracias! Tu opinión me ayuda a mejorar los textos que preparo.";
