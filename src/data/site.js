export const SITE = {
  nombre: "L+IA",
  nombreLargo: "L+IA · Lectura + Inteligencia Artificial",
  eslogan: "Comprende. Practica. Avanza.",
  tagline: "Lectura + Inteligencia Artificial",
  descripcion:
    "Plataforma pedagógica chilena para desarrollar habilidades lectoras. Diseñada sobre el Currículum Nacional y potenciada por inteligencia artificial como motor de personalización.",
  proposito:
    "Ayudar a cada estudiante a desarrollar progresivamente sus habilidades lectoras mediante experiencias de aprendizaje pertinentes, personalizadas y alineadas al currículum chileno.",
  url: "https://l-mas-ia.vercel.app",
  autor: "José Valdés",
  email: "profe.josevaldes@gmail.com",
  telefono: "+56 9 8596 5954",
  telefonoLink: "+56985965954",
  linkedin:
    "https://www.linkedin.com/in/jos%C3%A9-vald%C3%A9s-romero-58b7a5208/",
};

export const NAVEGACION = [
  { title: "Inicio", href: "/" },
  { title: "Sobre L+IA", href: "/about" },
  { title: "Practicar", href: "/app" },
  { title: "Biblioteca", href: "/biblioteca" },
  { title: "Preguntas frecuentes", href: "/faq" },
  { title: "Contacto", href: "/contact" },
];

export const PUBLICOS = [
  {
    id: "estudiantes",
    emoji: "🎒",
    titulo: "Practicar y aprender",
    perfil: "Estudiantes y familias",
    texto:
      "L+IA conversa contigo, prepara un texto a tu medida y te acompaña hasta el cierre. Puede leer en voz alta y, al terminar, te dice qué habilidad conviene practicar después.",
  },
  {
    id: "docentes",
    emoji: "🍎",
    titulo: "Enseñar y crear",
    perfil: "Docentes",
    texto:
      "Genera material nuevo desde un panel completo o reutiliza los textos ya creados desde la Biblioteca, revisando qué Objetivos de Aprendizaje evalúa cada uno antes de llevarlo al aula.",
  },
];

export const CICLO_APRENDIZAJE = [
  "Leer",
  "Comprender",
  "Responder",
  "Recibir retroalimentación",
  "Volver a practicar",
  "Progresar",
];

export const BENEFICIOS_ESTUDIANTE = [
  {
    titulo: "Una conversación, no un formulario",
    texto:
      "L+IA te pregunta el curso, el tema, el tipo de texto y el largo, y te acompaña paso a paso hasta el cierre de la actividad.",
  },
  {
    titulo: "Lectura en voz alta",
    texto:
      "Puedes pedirle que lea sus mensajes, el texto y cada alternativa, un apoyo clave en los primeros niveles y para quienes lo necesiten.",
  },
  {
    titulo: "Textos a tu medida",
    texto:
      "Cada texto se escribe para tu nivel y respeta el rango oficial de palabras de tu curso.",
  },
  {
    titulo: "Velocidad lectora medida",
    texto:
      "La lectura se cronometra y tus palabras por minuto se comparan con la matriz esperada para el curso.",
  },
  {
    titulo: "Cierre que enseña",
    texto:
      "Al terminar ves tu puntaje, el logro por eje y por Objetivo de Aprendizaje, y un consejo de lectura pensado para tu nivel.",
  },
];

export const BENEFICIOS_DOCENTE = [
  {
    titulo: "Generación alineada al currículum",
    texto:
      "Defines nivel, unidad, tipo de texto, extensión, cantidad de preguntas y habilidades; L+IA construye la actividad completa con sus respuestas y explicaciones.",
  },
  {
    titulo: "Validación automática antes de guardar",
    texto:
      "Se rechaza todo texto fuera del rango de palabras del nivel, con habilidades ajenas al curso, alternativas repetidas o ejes sin cubrir.",
  },
  {
    titulo: "Biblioteca reutilizable",
    texto:
      "Cada actividad guardada muestra cómo está construida: nivel, unidad, extensión, OA, ejes y el modelo que la generó.",
  },
  {
    titulo: "Diagnóstico por eje y por OA",
    texto:
      "El informe entrega el logro desagregado, insumo directo para decidir qué reforzar en la próxima clase.",
  },
];

export const PILARES = [
  {
    titulo: "Currículum primero",
    texto:
      "La IA genera el contenido, pero la estructura pedagógica determina qué debe generar.",
  },
  {
    titulo: "Niveles focalizados",
    texto: "2º, 4º, 6º y 8º básico y 2º medio, los cursos evaluados por SIMCE.",
  },
  {
    titulo: "Fluidez y comprensión",
    texto:
      "Velocidad lectora clasificada en seis tramos y comprensión evaluada contra el umbral del 70%.",
  },
  {
    titulo: "Calidad revisada",
    texto:
      "Cada actividad se valida automáticamente y los usuarios la califican con estrellas para curar el banco.",
  },
];

export const PASOS_USO = [
  {
    numero: "01",
    titulo: "Conversa",
    texto:
      "L+IA te pregunta el curso, la unidad, el tipo de texto, la extensión y las habilidades que quieres trabajar.",
  },
  {
    numero: "02",
    titulo: "Lee",
    texto:
      "Recibes un texto escrito para tu nivel, con cronómetro, control de tamaño de letra y opción de escucharlo.",
  },
  {
    numero: "03",
    titulo: "Responde",
    texto:
      "Las preguntas se presentan una a una, indicando el eje y el Objetivo de Aprendizaje que evalúan.",
  },
  {
    numero: "04",
    titulo: "Avanza",
    texto:
      "Ves tu logro por eje y por OA, recibes un consejo de L+IA y valoras el texto con estrellas.",
  },
];

export const PERSONALIDAD = [
  { titulo: "Cercana", texto: "Lenguaje comprensible que acompaña durante todo el proceso." },
  { titulo: "Clara", texto: "Instrucciones, resultados y retroalimentaciones fáciles de entender." },
  { titulo: "Motivadora", texto: "Reconoce el progreso y promueve seguir practicando." },
  { titulo: "Inteligente", texto: "Usa datos y contexto pedagógico para adaptar las experiencias." },
  { titulo: "Confiable", texto: "Docentes y familias entienden qué se trabaja, cómo y con qué límites." },
];

export const FLUJO_PEDAGOGICO = [
  "Currículum chileno",
  "Nivel educativo",
  "Objetivos de Aprendizaje",
  "Habilidades lectoras",
  "Indicadores y criterios",
  "Generación con IA",
  "Validación automática",
  "Actividad",
  "Retroalimentación",
  "Valoración de usuarios",
];

export const FAQ = [
  {
    titulo: "¿Qué es L+IA?",
    texto:
      "L+IA es una plataforma educativa chilena para desarrollar habilidades lectoras. Combina el Currículum Nacional con inteligencia artificial: la IA escribe los textos y las preguntas, y la estructura pedagógica determina qué debe generar.",
  },
  {
    titulo: "¿Los textos son escritos por una inteligencia artificial?",
    texto:
      "Sí. Todos los textos, preguntas, alternativas y explicaciones de la plataforma los escribe una inteligencia artificial. Por eso la información no siempre es correcta: puede tener datos equivocados, imprecisos o incompletos. Recomendamos comprobar los datos antes de darlos por ciertos y, en el caso de los docentes, revisar el material antes de llevarlo al aula.",
  },
  {
    titulo: "¿Cómo se controla la calidad si el contenido es generado?",
    texto:
      "Antes de guardarse, cada actividad pasa por dos filtros automáticos: uno de estructura y otro curricular, que rechaza el texto si se sale del rango de palabras del nivel, si usa habilidades que no corresponden al curso, si repite alternativas o si no cubre los ejes solicitados. Además, cada actividad puede ser calificada con estrellas por quienes la usan, y esa valoración permite retirar del banco los textos deficientes.",
  },
  {
    titulo: "¿Por qué se llama L+IA?",
    texto:
      "L es Lectura, IA es Inteligencia Artificial y el signo + representa la integración: la tecnología se suma al proceso educativo, no reemplaza al docente ni convierte la lectura en una interacción solo tecnológica.",
  },
  {
    titulo: "¿Cómo se practica en L+IA?",
    texto:
      "En modo conversación, L+IA te guía como un chat: te pregunta el curso, el tema, el tipo de texto, el largo y las habilidades, te entrega la lectura, te hace las preguntas una a una y cierra con tu resultado y una recomendación. Los docentes también pueden usar el modo docente, un panel completo para configurar todo de una vez.",
  },
  {
    titulo: "¿Qué es la Biblioteca?",
    texto:
      "Es el conjunto de actividades ya generadas y guardadas. Cada una muestra cómo está construida (nivel, unidad, tipo de texto, extensión, Objetivos de Aprendizaje, ejes y el modelo que la produjo) y puede abrirse para practicar directamente, sin esperar una nueva generación.",
  },
  {
    titulo: "¿Qué pasa si la actividad no se genera?",
    texto:
      "L+IA consulta varios modelos de inteligencia artificial en cadena. Si uno falla o entrega un resultado que no cumple las reglas curriculares, prueba con el siguiente. Si ninguno responde, busca en la Biblioteca una actividad equivalente. Y si tampoco hay, te avisa que está con mucha demanda y te invita a intentarlo en unos minutos.",
  },
  {
    titulo: "¿Para qué niveles está pensada?",
    texto:
      "Para 2º, 4º, 6º y 8º básico y 2º medio. Son los cursos que cuentan con métricas oficiales de velocidad lectora y extensión de textos en las guías curriculares del proyecto.",
  },
  {
    titulo: "¿Cómo se decide el largo del texto?",
    texto:
      "Cada nivel tiene tres rangos de extensión (básica, media y avanzada) definidos en la matriz curricular. Por ejemplo, en 6º básico un texto de dificultad media tiene entre 401 y 600 palabras. Si el texto generado se sale de ese rango, se descarta.",
  },
  {
    titulo: "¿Qué significa la velocidad lectora en palabras por minuto?",
    texto:
      "Es la cantidad de palabras que se leen en un minuto. L+IA la calcula con el cronómetro y la clasifica en seis tramos, de muy lenta a muy rápida, según la tabla oficial del nivel.",
  },
  {
    titulo: "¿L+IA puede leer en voz alta?",
    texto:
      "Sí. Al iniciar la conversación te pregunta si quieres que lea sus mensajes, y esa preferencia queda guardada. Además, cada mensaje, el texto de lectura y cada alternativa tienen su propio botón de escucha. El texto solo se lee de forma manual: es un apoyo y no reemplaza tu lectura, que es la que mide la velocidad lectora.",
  },
  {
    titulo: "¿Para qué sirven las estrellas al final?",
    texto:
      "Sirven para curar el banco de textos. Puedes calificar el texto completo, dejar un comentario y también valorar cada pregunta por separado. Con esa información decidimos qué actividades se conservan y cuáles se retiran.",
  },
  {
    titulo: "¿Es necesario registrarse?",
    texto:
      "No. La plataforma se usa directamente desde el navegador. Por ahora cada actividad es independiente y no se guarda un historial de resultados; el seguimiento del progreso en el tiempo llegará en una etapa posterior, junto con las cuentas de estudiante.",
  },
  {
    titulo: "¿Cómo reporto un problema o propongo una mejora?",
    texto:
      "Puedes escribir a profe.josevaldes@gmail.com o enviar un mensaje por WhatsApp al +56 9 8596 5954. La sección Contacto reúne todos los canales. Si detectas un texto con información incorrecta, avísanos: es la forma más directa de mejorar el banco.",
  },
];
