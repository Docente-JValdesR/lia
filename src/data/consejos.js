// Consejos de estrategia lectora por nivel, diferenciados por eje del currículum.
export const CONSEJOS = {
  "2basico": {
    general: [
      "Lee el texto dos veces: la primera para conocerlo y la segunda para fijarte en los detalles.",
      "Si una palabra te cuesta, léela por partes y sigue adelante; muchas veces se entiende por el resto de la oración.",
      "Lee en voz alta respetando los puntos: te ayuda a entender mejor lo que dice el texto.",
    ],
    localizar: [
      "Cuando busques un dato, vuelve al párrafo y sigue las líneas con tu dedo.",
      "Fíjate en los nombres de los personajes y en lo que hace cada uno.",
      "Ordena los hechos preguntándote qué pasó primero y qué pasó después.",
    ],
    interpretar: [
      "Antes de responder, imagina la escena del texto como si fuera una película.",
      "Si una palabra es nueva, mira las palabras que están cerca para adivinar qué significa.",
      "Pregúntate de qué se trata todo el texto, no solo una parte.",
    ],
    reflexionar: [
      "Piensa si algo del texto te ha pasado a ti: eso ayuda a comprenderlo mejor.",
      "Cuando digas lo que opinas, cuenta también en qué parte del texto lo viste.",
    ],
  },
  "4basico": {
    general: [
      "Si un párrafo no se entiende, vuelve a leer solo ese párrafo antes de seguir.",
      "Al terminar cada párrafo, cuéntate en una frase lo que acabas de leer.",
      "Fíjate en los títulos y subtítulos: te anticipan de qué se trata el texto.",
    ],
    localizar: [
      "Marca mentalmente los datos importantes: nombres, números, fechas y lugares.",
      "Si la pregunta usa una palabra del texto, búscala: la respuesta suele estar cerca.",
      "Usa el índice, los títulos y las imágenes para ubicar la información más rápido.",
    ],
    interpretar: [
      "Si algo no está dicho de forma directa, busca pistas en las oraciones que lo rodean.",
      "Pregúntate por qué ocurrió cada hecho: así descubres las causas y los efectos.",
      "Distingue la idea principal de los detalles que solo la acompañan.",
    ],
    reflexionar: [
      "Cuando des una opinión, apóyala siempre con una parte concreta del texto.",
      "Pregúntate para qué escribió este texto el autor: ¿informar, convencer o entretener?",
    ],
  },
  "6basico": {
    general: [
      "Detente al final de cada párrafo y resume en una frase lo que leíste.",
      "Anota mentalmente las palabras clave: te servirán para reconstruir el texto completo.",
      "Lee los gráficos y las tablas con la misma atención que el texto escrito.",
    ],
    localizar: [
      "Usa los títulos y subtítulos para ubicar rápido dónde está cada información.",
      "En textos con datos, revisa dos veces las cifras antes de responder.",
    ],
    interpretar: [
      "Pregúntate cuál es la idea principal de cada párrafo y únelas al final.",
      "Cuando encuentres lenguaje figurado, pregúntate qué quiso decir realmente el autor.",
      "Explica las reacciones de los personajes a partir de lo que les ocurre en el relato.",
    ],
    reflexionar: [
      "Compara lo que dice el texto con lo que ya sabías sobre el tema.",
      "Si lees dos textos sobre lo mismo, fíjate en qué coinciden y en qué se diferencian.",
    ],
  },
  "8basico": {
    general: [
      "Separa los hechos verificables de las opiniones mientras lees.",
      "Identifica la estructura del texto: introducción, desarrollo y cierre te orientan.",
      "Relee los pasajes densos antes de avanzar: la comprensión se construye por capas.",
    ],
    localizar: [
      "En textos largos, ubica primero qué, quién, cuándo y dónde.",
      "Distingue la información central de los ejemplos que solo la ilustran.",
    ],
    interpretar: [
      "Distingue lo que el autor afirma de lo que solo sugiere.",
      "Pregúntate qué representan los símbolos y las imágenes del texto literario.",
      "Sostén tu interpretación con al menos una cita concreta del texto.",
    ],
    reflexionar: [
      "Pregúntate qué busca lograr el autor y con qué recursos lo intenta.",
      "Detecta si el texto presenta estereotipos o generalizaciones sin respaldo.",
    ],
  },
  "2medio": {
    general: [
      "Identifica la postura del emisor antes de evaluar su argumento.",
      "Fíjate en los conectores: muestran cómo se relacionan las ideas entre sí.",
      "Distingue el contenido del texto de los recursos con que se te presenta.",
    ],
    localizar: [
      "Marca las ideas que sostienen la tesis: esas son tu evidencia.",
      "En textos complejos, selecciona solo la información pertinente a la pregunta.",
    ],
    interpretar: [
      "Reconstruye el orden de los hechos cuando el relato usa saltos temporales.",
      "Analiza qué efecto busca producir cada recurso del lenguaje empleado.",
      "Pregúntate qué supuestos da por sabidos el emisor sin decirlos.",
    ],
    reflexionar: [
      "Evalúa si la evidencia entregada realmente sostiene lo que se afirma.",
      "Revisa la fuente: quién habla, desde dónde y con qué intereses.",
    ],
  },
};

export function consejoPara(nivelId, ejeId) {
  const delNivel = CONSEJOS[nivelId] ?? CONSEJOS["6basico"];
  const opciones = (ejeId && delNivel[ejeId]?.length ? delNivel[ejeId] : delNivel.general) ?? [];
  if (!opciones.length) return null;
  return opciones[Math.floor(Math.random() * opciones.length)];
}
