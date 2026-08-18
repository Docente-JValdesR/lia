import { Document, Page, Path, Rect, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import {
  DIFICULTADES,
  getExtension,
  getHabilidad,
  getNivel,
  getUnidad,
  TIPOS_TEXTO,
} from "@/data/curriculum";

const COLOR = {
  brand: "#6965DB",
  brandSoft: "#E8E7FF",
  teal: "#3FA9AA",
  ink: "#292B38",
  inkSoft: "#6B6F80",
  line: "#E6E8F0",
  canvas: "#F8F9FC",
};

const estilos = StyleSheet.create({
  pagina: { paddingTop: 36, paddingBottom: 54, paddingHorizontal: 42, fontSize: 9.5, color: COLOR.ink },
  membrete: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: COLOR.brand,
    paddingBottom: 10,
    marginBottom: 18,
  },
  marca: { flexDirection: "row", alignItems: "center", gap: 8 },
  marcaTexto: { fontSize: 20, fontWeight: "bold", color: COLOR.ink },
  eslogan: { fontSize: 8, color: COLOR.inkSoft, marginTop: 2 },
  metaDerecha: { alignItems: "flex-end" },
  tipoDocumento: { fontSize: 8, fontWeight: "bold", color: COLOR.ink },
  fecha: { fontSize: 7.5, color: COLOR.inkSoft, marginTop: 2 },
  titulo: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  subtitulo: { fontSize: 9, color: COLOR.inkSoft, marginBottom: 14 },
  seccion: { fontSize: 12, fontWeight: "bold", color: COLOR.brand, marginTop: 15, marginBottom: 7 },
  texto: { fontSize: 10, lineHeight: 1.45, marginBottom: 8 },
  tarjeta: { backgroundColor: COLOR.canvas, borderRadius: 6, padding: 10, marginBottom: 10 },
  fila: { flexDirection: "row", gap: 8 },
  dato: { flex: 1, backgroundColor: COLOR.canvas, borderRadius: 6, padding: 9, marginBottom: 8 },
  etiqueta: { fontSize: 7, color: COLOR.inkSoft, textTransform: "uppercase", marginBottom: 3 },
  valor: { fontSize: 10, fontWeight: "bold" },
  pregunta: { borderWidth: 1, borderColor: COLOR.line, borderLeftWidth: 3, borderLeftColor: COLOR.brand, borderRadius: 5, padding: 9, marginBottom: 8 },
  enunciado: { fontWeight: "bold", lineHeight: 1.35, marginBottom: 5 },
  alternativa: { color: COLOR.inkSoft, marginTop: 2 },
  respuesta: { color: COLOR.inkSoft, marginTop: 8 },
  detalle: { color: COLOR.inkSoft, marginTop: 4, lineHeight: 1.35 },
  pauta: { borderWidth: 1, borderColor: COLOR.line, borderRadius: 5, padding: 9, marginBottom: 8 },
  pie: { position: "absolute", bottom: 22, left: 42, right: 42, borderTopWidth: 1, borderTopColor: COLOR.line, paddingTop: 6 },
  pieTexto: { fontSize: 7, color: COLOR.inkSoft },
});

function Membrete({ titulo }) {
  const fecha = new Date().toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <View style={estilos.membrete} fixed>
      <View style={estilos.marca}>
        <Svg width="26" height="26" viewBox="0 0 64 64">
          <Rect width="64" height="64" rx="16" fill={COLOR.brand} />
          <Path d="M20 17v24h13" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M43 25v13M36.5 31.5h13" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        </Svg>
        <View>
          <Text style={estilos.marcaTexto}>L+IA</Text>
          <Text style={estilos.eslogan}>Comprende. Practica. Avanza.</Text>
        </View>
      </View>
      <View style={estilos.metaDerecha}>
        <Text style={estilos.tipoDocumento}>{titulo}</Text>
        <Text style={estilos.fecha}>{fecha}</Text>
      </View>
    </View>
  );
}

function Pie() {
  return (
    <View style={estilos.pie} fixed>
      <Text style={estilos.pieTexto}>
        L+IA · Lectura + Inteligencia Artificial · Material para uso docente · Página{" "}
        <Text render={({ pageNumber, totalPages }) => `${pageNumber} de ${totalPages}`} />
      </Text>
    </View>
  );
}

function MetaActividad({ lectura, nivel, unidad, rango, tipo, dificultad }) {
  return (
    <View style={estilos.fila}>
      <View style={estilos.dato}>
        <Text style={estilos.etiqueta}>Nivel</Text>
        <Text style={estilos.valor}>{nivel.label}</Text>
      </View>
      <View style={estilos.dato}>
        <Text style={estilos.etiqueta}>Tipo de texto</Text>
        <Text style={estilos.valor}>{tipo?.label ?? lectura.tipoTexto}</Text>
      </View>
      <View style={estilos.dato}>
        <Text style={estilos.etiqueta}>Dificultad</Text>
        <Text style={estilos.valor}>{dificultad?.label ?? lectura.dificultad}</Text>
      </View>
      <View style={estilos.dato}>
        <Text style={estilos.etiqueta}>Extensión</Text>
        <Text style={estilos.valor}>{lectura.nPalabras} palabras</Text>
        <Text style={{ fontSize: 7, color: COLOR.inkSoft, marginTop: 2 }}>{rango.min}-{rango.max} esperadas</Text>
      </View>
    </View>
  );
}

export default function GuiaDocentePDF({ lectura }) {
  const nivel = getNivel(lectura.nivel);
  const unidad = getUnidad(lectura.nivel, lectura.unidad);
  const rango = getExtension(lectura.nivel, lectura.dificultad);
  const tipo = TIPOS_TEXTO.find((item) => item.id === lectura.tipoTexto);
  const dificultad = DIFICULTADES.find((item) => item.id === lectura.dificultad);
  const habilidades = [...new Set(lectura.preguntas.map((p) => p.habilidad))]
    .map((id) => getHabilidad(lectura.nivel, id))
    .filter(Boolean);
  const objetivos = [...new Set(lectura.preguntas.map((p) => p.oaCodigo ?? getHabilidad(lectura.nivel, p.habilidad)?.oa))]
    .filter(Boolean);
  const minutos = Math.max(5, Math.ceil((lectura.nPalabras / 150) + lectura.preguntas.length * 1.5));

  return (
    <Document title={`Guía docente · ${lectura.titulo}`} author="L+IA" subject="Actividad de comprensión lectora">
      <Page size="A4" style={estilos.pagina}>
        <Membrete titulo="Guía docente · Actividad lista para aplicar" />
        <Text style={estilos.titulo}>{lectura.titulo}</Text>
        <Text style={estilos.subtitulo}>Lee el texto y responde las preguntas. No se incluyen las respuestas en esta sección.</Text>
        <MetaActividad lectura={lectura} nivel={nivel} unidad={unidad} rango={rango} tipo={tipo} dificultad={dificultad} />
        <Text style={estilos.seccion}>Texto de lectura</Text>
        <View style={estilos.tarjeta}>
          {lectura.parrafos.map((parrafo, i) => <Text key={i} style={estilos.texto}>{parrafo}</Text>)}
        </View>
        <Text style={estilos.seccion}>Preguntas de comprensión</Text>
        {lectura.preguntas.map((pregunta, i) => (
          <View key={pregunta.id ?? i} style={estilos.pregunta} wrap={false}>
            <Text style={estilos.enunciado}>{i + 1}. {pregunta.enunciado}</Text>
            {pregunta.alternativas.map((alternativa, j) => (
              <Text key={j} style={estilos.alternativa}>{String.fromCharCode(65 + j)}. {alternativa}</Text>
            ))}
            <Text style={estilos.respuesta}>Respuesta: __________________________________________________</Text>
          </View>
        ))}
        <Pie />
      </Page>

      <Page size="A4" style={estilos.pagina}>
        <Membrete titulo="Pauta de evaluación · Uso docente" />
        <Text style={estilos.titulo}>{lectura.titulo}</Text>
        <Text style={estilos.subtitulo}>Clave de respuestas, habilidad evaluada y retroalimentación sugerida.</Text>
        {lectura.preguntas.map((pregunta, i) => {
          const habilidad = getHabilidad(lectura.nivel, pregunta.habilidad);
          return (
            <View key={pregunta.id ?? i} style={estilos.pauta} wrap={false}>
              <Text style={estilos.enunciado}>{i + 1}. {pregunta.enunciado}</Text>
              <Text style={{ color: COLOR.teal, fontWeight: "bold" }}>Respuesta correcta: {pregunta.alternativas[pregunta.correcta]}</Text>
              <Text style={estilos.detalle}>Eje: {habilidad?.eje ?? "-"} · Habilidad: {habilidad?.label ?? pregunta.habilidad}</Text>
              <Text style={estilos.detalle}>OA: {pregunta.oaCodigo ?? habilidad?.oa ?? "-"}</Text>
              <Text style={estilos.detalle}>Retroalimentación: {pregunta.explicacion}</Text>
            </View>
          );
        })}
        <View style={estilos.tarjeta}>
          <Text style={estilos.enunciado}>Criterio de logro sugerido</Text>
          <Text>Se considera logrado el objetivo cuando el estudiante responde correctamente al menos el 70% de las preguntas y puede justificar sus respuestas con información del texto.</Text>
        </View>
        <Pie />
      </Page>

      <Page size="A4" style={estilos.pagina}>
        <Membrete titulo="Análisis de la actividad · Planificación" />
        <Text style={estilos.titulo}>{lectura.titulo}</Text>
        <Text style={estilos.subtitulo}>Resumen curricular, didáctico y de aplicación para acompañar la actividad.</Text>
        <MetaActividad lectura={lectura} nivel={nivel} unidad={unidad} rango={rango} tipo={tipo} dificultad={dificultad} />
        <Text style={estilos.seccion}>Información de aplicación</Text>
        <View style={estilos.fila}>
          <View style={estilos.dato}><Text style={estilos.etiqueta}>Tiempo estimado</Text><Text style={estilos.valor}>{minutos} minutos</Text><Text style={{ fontSize: 7, color: COLOR.inkSoft, marginTop: 2 }}>Incluye lectura y preguntas</Text></View>
          <View style={estilos.dato}><Text style={estilos.etiqueta}>Preguntas</Text><Text style={estilos.valor}>{lectura.preguntas.length}</Text><Text style={{ fontSize: 7, color: COLOR.inkSoft, marginTop: 2 }}>Alternativas de selección</Text></View>
          <View style={estilos.dato}><Text style={estilos.etiqueta}>Unidad</Text><Text style={estilos.valor}>{unidad.titulo}</Text></View>
        </View>
        <Text style={estilos.seccion}>Propósito curricular</Text>
        <View style={estilos.tarjeta}>
          <Text style={estilos.texto}>{unidad.foco}</Text>
          <Text style={estilos.texto}>Foco del nivel: {nivel.foco}</Text>
        </View>
        <Text style={estilos.seccion}>Habilidades y objetivos evaluados</Text>
        {habilidades.map((habilidad) => (
          <View key={habilidad.id} style={{ marginBottom: 7 }}>
            <Text style={estilos.enunciado}>{habilidad.label}</Text>
            <Text style={estilos.detalle}>{habilidad.eje} · {habilidad.oa} · {habilidad.detalle}</Text>
          </View>
        ))}
        <Text style={estilos.seccion}>Síntesis técnica</Text>
        <View style={estilos.tarjeta}>
          <Text style={estilos.texto}>Tipo: {tipo?.detalle ?? tipo?.label ?? lectura.tipoTexto}.</Text>
          <Text style={estilos.texto}>Extensión curricular: {rango.min} a {rango.max} palabras; el texto generado contiene {lectura.nPalabras}.</Text>
          <Text style={estilos.texto}>Objetivos de aprendizaje involucrados: {objetivos.join(", ") || "según habilidades de las preguntas"}.</Text>
          <Text style={estilos.texto}>Aplicación sugerida: lectura individual o guiada, seguida de revisión colectiva de las respuestas y sus justificaciones.</Text>
        </View>
        <Pie />
      </Page>
    </Document>
  );
}