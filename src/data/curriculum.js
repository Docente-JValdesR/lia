// Capa curricular MINEDUC.
// Fuentes acordadas: matriz PPM de la guía técnica (DOCX) y matriz de extensión de la planilla (XLSX v2.0).
// Solo se incluyen los niveles con datos oficiales en las guías (los que rinden SIMCE).

export const CICLOS = [
  { id: "primer_ciclo", label: "1er ciclo básico", detalle: "1º a 4º básico" },
  { id: "segundo_ciclo", label: "2do ciclo básico", detalle: "5º a 8º básico" },
  { id: "media", label: "Enseñanza media", detalle: "1º a 4º medio" },
];

// Ejes de evaluación de Lectura (MINEDUC / Agencia de Calidad).
export const EJES = [
  { id: "localizar", label: "Localizar información" },
  { id: "interpretar", label: "Relacionar e interpretar información" },
  { id: "reflexionar", label: "Reflexionar sobre el texto" },
];

export const DIFICULTADES = [
  { id: "basica", label: "Básica" },
  { id: "media", label: "Media" },
  { id: "avanzada", label: "Avanzada" },
];

export const TIPOS_TEXTO = [
  { id: "narrativo", label: "Narrativo", detalle: "Un relato o una historia" },
  { id: "informativo", label: "Informativo", detalle: "Para aprender sobre un tema" },
  { id: "argumentativo", label: "Argumentativo", detalle: "Alguien defiende una postura" },
  { id: "instructivo", label: "Instructivo", detalle: "Explica cómo hacer algo paso a paso" },
];

export const CATEGORIAS_PPM = [
  { id: "muy_lenta", label: "Muy lenta", tono: "rose" },
  { id: "lenta", label: "Lenta", tono: "rose" },
  { id: "medio_baja", label: "Medio baja", tono: "amber" },
  { id: "medio_alta", label: "Medio alta", tono: "emerald" },
  { id: "rapida", label: "Rápida", tono: "emerald" },
  { id: "muy_rapida", label: "Muy rápida", tono: "sky" },
];

export const NIVELES = [
  {
    id: "2basico",
    label: "2º básico",
    ciclo: "primer_ciclo",
    edad: "7 a 8 años",
    foco:
      "Lectura de palabras de uso frecuente y decodificación automática de oraciones complejas. Fluidez a nivel de oración.",
    ppm: {
      muy_lenta: { max: 42 },
      lenta: { min: 43, max: 57 },
      medio_baja: { min: 58, max: 72 },
      medio_alta: { min: 73, max: 88 },
      rapida: { min: 89, max: 103 },
      muy_rapida: { min: 104 },
    },
    extension: {
      basica: { min: 50, max: 80 },
      media: { min: 81, max: 120 },
      avanzada: { min: 121, max: 150 },
    },
    unidades: [
      {
        id: "u1",
        titulo: "Lectura como aventura",
        foco:
          "Gusto lector e imaginación mediante cuentos tradicionales y fábulas. Foco en decodificación local.",
        lecturas: "Cuentos folclóricos y de autor (Hermanos Grimm, Arnold Lobel).",
      },
      {
        id: "u2",
        titulo: "Información del entorno",
        foco:
          "Artículos informativos breves y textos prácticos con foco en localizar datos explícitos.",
        lecturas: "Artículos explicativos sencillos, infografías con imágenes de apoyo.",
      },
    ],
    oa: [
      {
        codigo: "OA 2",
        enunciado:
          "Leer en voz alta para adquirir fluidez: pronunciando cada palabra con precisión, respetando el punto seguido y el punto aparte, y sin detenerse en cada palabra.",
        dominio: "Fluidez / Precisión / Prosodia",
      },
      {
        codigo: "OA 3",
        enunciado:
          "Comprender textos aplicando estrategias de comprensión lectora: relacionar la información con sus experiencias y conocimientos, visualizar lo que describe el texto.",
        dominio: "Estrategias de comprensión",
      },
      {
        codigo: "OA 4",
        enunciado:
          "Leer independientemente y familiarizarse con un amplio repertorio de literatura para aumentar su conocimiento del mundo y desarrollar su imaginación.",
        dominio: "Comprensión literaria",
      },
    ],
    habilidades: [
      {
        id: "localizar_personajes",
        eje: "localizar",
        oa: "OA 4",
        label: "Localizar personajes y acciones explícitas",
        detalle: "Ubicar quién hace qué dentro del relato",
      },
      {
        id: "secuencia_hechos",
        eje: "localizar",
        oa: "OA 4",
        label: "Reconocer la secuencia de hechos",
        detalle: "Ordenar los acontecimientos según sucedieron",
      },
      {
        id: "visualizar",
        eje: "interpretar",
        oa: "OA 3",
        label: "Visualizar lo que describe el texto",
        detalle: "Reconstruir mentalmente lugares, objetos y personajes",
      },
      {
        id: "vocabulario_contexto",
        eje: "interpretar",
        oa: "OA 3",
        label: "Vocabulario según contexto",
        detalle: "Deducir el significado de palabras nuevas por claves del texto",
      },
      {
        id: "conexion_experiencia",
        eje: "reflexionar",
        oa: "OA 3",
        label: "Conectar con experiencias y conocimientos",
        detalle: "Relacionar lo leído con su propia vida",
      },
    ],
    mecanicaUX:
      "API de voz para medir fluidez en voz alta (PPM): evalúa silencios superiores a 2 segundos y cuenta palabras leídas correctamente, con resaltador de palabras precisas.",
  },
  {
    id: "4basico",
    label: "4º básico",
    ciclo: "primer_ciclo",
    edad: "9 a 10 años",
    foco:
      "Automatización de la decodificación. Lectura fluida respetando toda la ortografía puntual y entonación de diálogos.",
    ppm: {
      muy_lenta: { max: 84 },
      lenta: { min: 85, max: 99 },
      medio_baja: { min: 100, max: 114 },
      medio_alta: { min: 115, max: 129 },
      rapida: { min: 130, max: 144 },
      muy_rapida: { min: 145 },
    },
    extension: {
      basica: { min: 150, max: 200 },
      media: { min: 201, max: 300 },
      avanzada: { min: 301, max: 400 },
    },
    unidades: [
      {
        id: "u1",
        titulo: "Mitología y orígenes",
        foco:
          "Mitos y leyendas locales y universales. Explicaciones fantásticas de fenómenos de la naturaleza.",
        lecturas: "Mitos mapuches y leyendas de la tradición oral de Chile.",
      },
      {
        id: "u2",
        titulo: "Textos prácticos y expositivos",
        foco:
          "Recetas, manuales y biografías. Localización de datos mediante organizadores textuales.",
        lecturas: "Instrucciones de experimentos, biografías de exploradores de Chile.",
      },
    ],
    oa: [
      {
        codigo: "OA 1",
        enunciado:
          "Leer en voz alta de manera fluida variados textos apropiados a su edad: pronunciando con precisión, respetando los signos de puntuación y con velocidad adecuada.",
        dominio: "Fluidez y prosodia avanzada",
      },
      {
        codigo: "OA 2",
        enunciado:
          "Comprender textos aplicando estrategias de comprensión lectora: releer lo no comprendido, recapitular, subrayar ideas relevantes, formular preguntas y responderlas.",
        dominio: "Estrategias activas",
      },
      {
        codigo: "OA 6",
        enunciado:
          "Leer independientemente y comprender textos no literarios (biografías, relatos históricos, cartas, noticias) para ampliar su conocimiento del mundo y formarse una opinión.",
        dominio: "Comprensión expositiva",
      },
    ],
    habilidades: [
      {
        id: "localizar_explicita",
        eje: "localizar",
        oa: "OA 6",
        label: "Localizar información explícita",
        detalle: "Ubicar datos que aparecen literalmente en el texto",
      },
      {
        id: "organizadores_textuales",
        eje: "localizar",
        oa: "OA 6",
        label: "Usar organizadores textuales",
        detalle: "Apoyarse en títulos, subtítulos e índices para buscar información",
      },
      {
        id: "inferir",
        eje: "interpretar",
        oa: "OA 2",
        label: "Realizar inferencias",
        detalle: "Deducir información que no está dicha explícitamente",
      },
      {
        id: "causa_efecto",
        eje: "interpretar",
        oa: "OA 2",
        label: "Inferir relaciones de causa y efecto",
        detalle: "Explicar por qué ocurre lo que ocurre en el texto",
      },
      {
        id: "vocabulario_contexto",
        eje: "interpretar",
        oa: "OA 2",
        label: "Vocabulario según contexto",
        detalle: "Determinar el significado de palabras por claves contextuales",
      },
      {
        id: "idea_relevante",
        eje: "interpretar",
        oa: "OA 2",
        label: "Identificar ideas relevantes",
        detalle: "Distinguir la información central de los detalles",
      },
      {
        id: "opinion_fundamentada",
        eje: "reflexionar",
        oa: "OA 6",
        label: "Formarse una opinión sobre el texto",
        detalle: "Tomar postura y fundamentarla con información leída",
      },
    ],
    mecanicaUX:
      "Subrayado virtual interactivo: se pide marcar en el texto el fragmento que responde a la pregunta y se valida contra la respuesta correcta.",
  },
  {
    id: "6basico",
    label: "6º básico",
    ciclo: "segundo_ciclo",
    edad: "11 a 12 años",
    foco:
      "Fluidez lectora como herramienta de asimilación semántica y paso a la comprensión global de textos extensos.",
    ppm: {
      muy_lenta: { max: 117 },
      lenta: { min: 118, max: 132 },
      medio_baja: { min: 133, max: 147 },
      medio_alta: { min: 148, max: 162 },
      rapida: { min: 163, max: 177 },
      muy_rapida: { min: 178 },
    },
    extension: {
      basica: { min: 300, max: 400 },
      media: { min: 401, max: 600 },
      avanzada: { min: 601, max: 800 },
    },
    unidades: [
      {
        id: "u1",
        titulo: "Identidad y costumbres",
        foco:
          "Diversidad cultural a través de novelas infantiles, mitos complejos e historietas. Influencia del entorno en los personajes.",
        lecturas: "Historietas nacionales y novelas (Quique Hache detective).",
      },
      {
        id: "u2",
        titulo: "Ciencia, tecnología y descubrimiento",
        foco:
          "Contraste de artículos científicos e informativos sobre un mismo tema. Interpretación de textos discontinuos.",
        lecturas: "Artículos de astronomía, gráficos del espacio exterior.",
      },
    ],
    oa: [
      {
        codigo: "OA 1",
        enunciado:
          "Leer de manera fluida textos variados apropiados a su edad, respetando la prosodia indicada por todos los signos de puntuación y decodificando automáticamente la mayoría de las palabras.",
        dominio: "Fluidez automatizada",
      },
      {
        codigo: "OA 3",
        enunciado:
          "Analizar aspectos relevantes de las narraciones leídas para profundizar su comprensión: identificando las acciones principales y explicando la actitud y reacciones de los personajes.",
        dominio: "Comprensión literaria analítica",
      },
      {
        codigo: "OA 6",
        enunciado:
          "Leer independientemente y comprender textos no literarios para ampliar su conocimiento del mundo y formarse una opinión: extrayendo información explícita e implícita y haciendo inferencias complejas.",
        dominio: "Comprensión no literaria",
      },
    ],
    habilidades: [
      {
        id: "localizar_explicita",
        eje: "localizar",
        oa: "OA 6",
        label: "Localizar información explícita",
        detalle: "Ubicar datos relevantes en distintas partes del texto",
      },
      {
        id: "textos_discontinuos",
        eje: "localizar",
        oa: "OA 6",
        label: "Leer textos discontinuos",
        detalle: "Extraer datos desde tablas, gráficos e infografías",
      },
      {
        id: "inferencia_compleja",
        eje: "interpretar",
        oa: "OA 6",
        label: "Realizar inferencias complejas",
        detalle: "Integrar información distribuida para deducir lo implícito",
      },
      {
        id: "actitud_personajes",
        eje: "interpretar",
        oa: "OA 3",
        label: "Explicar actitudes y reacciones",
        detalle: "Justificar el comportamiento de los personajes con el texto",
      },
      {
        id: "lenguaje_figurado",
        eje: "interpretar",
        oa: "OA 3",
        label: "Interpretar lenguaje figurado",
        detalle: "Comprender comparaciones, metáforas y expresiones",
      },
      {
        id: "vocabulario_contexto",
        eje: "interpretar",
        oa: "OA 6",
        label: "Vocabulario según contexto",
        detalle: "Determinar el significado de palabras y expresiones",
      },
      {
        id: "tema_central",
        eje: "interpretar",
        oa: "OA 3",
        label: "Sintetizar el tema central",
        detalle: "Integrar la información global del texto",
      },
      {
        id: "comparar_textos",
        eje: "reflexionar",
        oa: "OA 6",
        label: "Comparar información de dos textos",
        detalle: "Contrastar cómo dos fuentes abordan un mismo tema",
      },
      {
        id: "opinion_fundamentada",
        eje: "reflexionar",
        oa: "OA 6",
        label: "Formarse una opinión fundamentada",
        detalle: "Evaluar el contenido y sostener una postura",
      },
    ],
    mecanicaUX:
      "Creador dinámico de mapas de ideas: se arrastran conceptos y eventos clave a un esquema semivacío, organizándolos con relaciones de jerarquía.",
  },
  {
    id: "8basico",
    label: "8º básico",
    ciclo: "segundo_ciclo",
    edad: "13 a 14 años",
    foco:
      "Lectura automatizada al servicio del análisis crítico de argumentaciones, debate conceptual e investigación.",
    ppm: {
      muy_lenta: { max: 144 },
      lenta: { min: 145, max: 159 },
      medio_baja: { min: 160, max: 174 },
      medio_alta: { min: 175, max: 189 },
      rapida: { min: 190, max: 204 },
      muy_rapida: { min: 205 },
    },
    extension: {
      basica: { min: 500, max: 650 },
      media: { min: 651, max: 900 },
      avanzada: { min: 901, max: 1200 },
    },
    unidades: [
      {
        id: "u1",
        titulo: "Épica, héroes y misterio",
        foco:
          "Fragmentos de epopeyas y relatos policiales. Evolución del héroe literario y estructura del misterio.",
        lecturas: "Epopeyas medievales, cuentos policiales de Edgar Allan Poe.",
      },
      {
        id: "u2",
        titulo: "Medios y argumentación",
        foco:
          "Análisis y evaluación de textos periodísticos de opinión. Identificación de hechos versus opiniones.",
        lecturas: "Columnas de opinión contingentes, cartas al director sobre medioambiente.",
      },
    ],
    oa: [
      {
        codigo: "OA 8",
        enunciado:
          "Formular una interpretación de los textos literarios leídos, coherente con su análisis, considerando una hipótesis de lectura personal, argumentos basados en el texto y análisis de símbolos.",
        dominio: "Interpretación literaria crítica",
      },
      {
        codigo: "OA 10",
        enunciado:
          "Analizar y evaluar textos de los medios de comunicación (noticias, reportajes, cartas al director, propaganda o crónicas), considerando hechos vs opiniones y presencia de estereotipos y prejuicios.",
        dominio: "Análisis de medios crítico",
      },
      {
        codigo: "OA 11",
        enunciado:
          "Leer y comprender textos no literarios para contextualizar y complementar las lecturas literarias realizadas en clases.",
        dominio: "Lectura contextual expositiva",
      },
    ],
    habilidades: [
      {
        id: "localizar_explicita",
        eje: "localizar",
        oa: "OA 11",
        label: "Localizar información explícita",
        detalle: "Ubicar datos precisos en textos extensos",
      },
      {
        id: "hipotesis_lectura",
        eje: "interpretar",
        oa: "OA 8",
        label: "Formular una interpretación",
        detalle: "Sostener una hipótesis de lectura con argumentos del texto",
      },
      {
        id: "simbolos",
        eje: "interpretar",
        oa: "OA 8",
        label: "Analizar símbolos y sentidos",
        detalle: "Interpretar elementos simbólicos del texto literario",
      },
      {
        id: "proposito_medios",
        eje: "interpretar",
        oa: "OA 10",
        label: "Identificar el propósito del emisor",
        detalle: "Reconocer la intención comunicativa en textos de los medios",
      },
      {
        id: "hecho_opinion",
        eje: "reflexionar",
        oa: "OA 10",
        label: "Distinguir hechos de opiniones",
        detalle: "Separar información verificable de valoraciones",
      },
      {
        id: "sesgos_estereotipos",
        eje: "reflexionar",
        oa: "OA 10",
        label: "Detectar sesgos y estereotipos",
        detalle: "Identificar prejuicios y contradicciones en el discurso",
      },
      {
        id: "contextualizar",
        eje: "reflexionar",
        oa: "OA 11",
        label: "Contextualizar con otras lecturas",
        detalle: "Complementar el texto con información externa",
      },
    ],
    mecanicaUX:
      "Verificador de hechos interactivo: se etiquetan afirmaciones como 'Hecho' u 'Opinión' justificando con un ejemplo del texto.",
  },
  {
    id: "2medio",
    label: "2º medio",
    ciclo: "media",
    edad: "15 a 16 años",
    foco:
      "Fluidez al servicio de la comprensión profunda, lectura dialógica, análisis de recursos retóricos y medios multimodales.",
    ppm: {
      muy_lenta: { max: 161 },
      lenta: { min: 162, max: 176 },
      medio_baja: { min: 177, max: 191 },
      medio_alta: { min: 192, max: 206 },
      rapida: { min: 207, max: 221 },
      muy_rapida: { min: 222 },
    },
    extension: {
      basica: { min: 800, max: 1000 },
      media: { min: 1001, max: 1400 },
      avanzada: { min: 1401, max: 1800 },
    },
    unidades: [
      {
        id: "u1",
        titulo: "Ausencia, exilio e identidad",
        foco:
          "Narrativa latinoamericana con foco en la búsqueda de identidad, el desplazamiento y las historias cruzadas.",
        lecturas: "Cuentos de Juan Rulfo, textos de exilio y migración.",
      },
      {
        id: "u2",
        titulo: "Ciudadanía, trabajo y persuasión",
        foco:
          "Evaluación crítica del discurso de los medios masivos y análisis de falacias argumentativas.",
        lecturas: "Campañas publicitarias, documentales sociales chilenos, ensayos.",
      },
    ],
    oa: [
      {
        codigo: "OA 3",
        enunciado:
          "Analizar las narraciones leídas para enriquecer su comprensión, considerando recursos de tiempo (flashbacks, caja china), relaciones intertextuales y dilemas existenciales presentados en el relato.",
        dominio: "Comprensión narrativa avanzada",
      },
      {
        codigo: "OA 10",
        enunciado:
          "Analizar y evaluar textos de los medios de comunicación, considerando los propósitos explícitos e implícitos, efectos de recursos no lingüísticos y modalizadores verbales.",
        dominio: "Lectura crítica multimodal",
      },
      {
        codigo: "OA 20",
        enunciado:
          "Evaluar el punto de vista de un emisor, su razonamiento y uso de recursos retóricos (vocabulario, organización de las ideas, progresión de los argumentos).",
        dominio: "Evaluación retórica de discursos",
      },
    ],
    habilidades: [
      {
        id: "localizar_relevante",
        eje: "localizar",
        oa: "OA 3",
        label: "Localizar información relevante",
        detalle: "Distinguir datos pertinentes en textos complejos",
      },
      {
        id: "recursos_temporales",
        eje: "interpretar",
        oa: "OA 3",
        label: "Analizar recursos temporales",
        detalle: "Reconocer flashbacks, caja china y alteraciones del orden",
      },
      {
        id: "intertextualidad",
        eje: "interpretar",
        oa: "OA 3",
        label: "Establecer relaciones intertextuales",
        detalle: "Vincular el texto con otras obras y referencias culturales",
      },
      {
        id: "propositos_implicitos",
        eje: "interpretar",
        oa: "OA 10",
        label: "Distinguir propósitos explícitos e implícitos",
        detalle: "Identificar lo que el emisor busca lograr y lo que oculta",
      },
      {
        id: "modalizadores",
        eje: "interpretar",
        oa: "OA 10",
        label: "Analizar modalizadores y recursos no lingüísticos",
        detalle: "Evaluar el efecto del diseño, el tono y la adjetivación",
      },
      {
        id: "punto_de_vista",
        eje: "reflexionar",
        oa: "OA 20",
        label: "Evaluar el punto de vista del emisor",
        detalle: "Juzgar la solidez de su razonamiento",
      },
      {
        id: "recursos_retoricos",
        eje: "reflexionar",
        oa: "OA 20",
        label: "Evaluar recursos retóricos",
        detalle: "Analizar la progresión y organización de los argumentos",
      },
      {
        id: "validez_fuentes",
        eje: "reflexionar",
        oa: "OA 20",
        label: "Evaluar validez y suficiencia de fuentes",
        detalle: "Determinar si la evidencia sostiene lo afirmado",
      },
    ],
    mecanicaUX:
      "Simulador de debate socrático y detección de falacias: se identifica el tipo de falacia de un argumento y se propone la contraargumentación.",
  },
];

export function getNivel(nivelId) {
  return NIVELES.find((n) => n.id === nivelId) ?? NIVELES[1];
}

export function getCiclo(nivelId) {
  return getNivel(nivelId).ciclo;
}

export function getHabilidades(nivelId) {
  return getNivel(nivelId).habilidades;
}

export function getHabilidad(nivelId, habilidadId) {
  return getHabilidades(nivelId).find((h) => h.id === habilidadId);
}

export function getUnidades(nivelId) {
  return getNivel(nivelId).unidades;
}

export function getUnidad(nivelId, unidadId) {
  return getUnidades(nivelId).find((u) => u.id === unidadId) ?? getUnidades(nivelId)[0];
}

export function getExtension(nivelId, dificultad) {
  return getNivel(nivelId).extension[dificultad] ?? getNivel(nivelId).extension.media;
}

export function clasificarPPM(nivelId, ppm) {
  const rangos = getNivel(nivelId).ppm;
  const categoria = CATEGORIAS_PPM.find((c) => {
    const r = rangos[c.id];
    return r && (r.min === undefined || ppm >= r.min) && (r.max === undefined || ppm <= r.max);
  });
  return { ...(categoria ?? CATEGORIAS_PPM[0]), rango: rangos[categoria?.id ?? "muy_lenta"] };
}

// Referencia de lectura esperada: punto medio del rango "medio alta" del nivel.
export function ppmReferencia(nivelId) {
  const r = getNivel(nivelId).ppm.medio_alta;
  return Math.round((r.min + r.max) / 2);
}

export function minutosEstimados(nivelId, dificultad) {
  const { min, max } = getExtension(nivelId, dificultad);
  const ppm = ppmReferencia(nivelId);
  return { min: Math.round(min / ppm), max: Math.ceil(max / ppm) };
}

// Una habilidad por eje como selección inicial al cambiar de nivel.
export function habilidadesPorDefecto(nivelId) {
  const habilidades = getHabilidades(nivelId);
  return EJES.map((eje) => habilidades.find((h) => h.eje === eje.id)?.id).filter(Boolean);
}

export const CONFIG_DEFAULT = {
  nivel: "4basico",
  unidad: "u2",
  dificultad: "media",
  tipoTexto: "informativo",
  cantidadPreguntas: 5,
  habilidades: ["localizar_explicita", "inferir", "opinion_fundamentada"],
};
