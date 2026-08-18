import {
  Document,
  Page,
  Path,
  Rect,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  clasificarPPM,
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
  accent: "#D9932C",
  danger: "#D9534F",
  ink: "#292B38",
  inkSoft: "#6B6F80",
  line: "#E6E8F0",
  canvas: "#F8F9FC",
};

const estilos = StyleSheet.create({
  pagina: { paddingTop: 34, paddingBottom: 56, paddingHorizontal: 40, fontSize: 9.5, color: COLOR.ink },
  membrete: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: COLOR.brand,
    paddingBottom: 10,
    marginBottom: 16,
  },
  marca: { flexDirection: "row", alignItems: "center", gap: 8 },
  marcaTexto: { fontSize: 20, fontWeight: "bold", color: COLOR.ink },
  eslogan: { fontSize: 7.5, color: COLOR.brand, marginTop: 2 },
  metaDerecha: { alignItems: "flex-end" },
  titulo: { fontSize: 15, fontWeight: "bold", marginBottom: 3 },
  subtitulo: { fontSize: 8.5, color: COLOR.inkSoft, marginBottom: 14 },
  seccion: { fontSize: 10.5, fontWeight: "bold", marginTop: 16, marginBottom: 7 },
  fila: { flexDirection: "row", gap: 8 },
  tarjeta: { flex: 1, backgroundColor: COLOR.canvas, borderRadius: 6, padding: 9 },
  tarjetaEtiqueta: { fontSize: 7, color: COLOR.inkSoft, textTransform: "uppercase" },
  tarjetaValor: { fontSize: 15, fontWeight: "bold", marginTop: 2 },
  tarjetaNota: { fontSize: 7, color: COLOR.inkSoft, marginTop: 2 },
  barraFondo: { height: 5, backgroundColor: COLOR.line, borderRadius: 3 },
  itemBarra: { marginBottom: 7 },
  filaBarra: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2.5 },
  chip: {
    backgroundColor: COLOR.brandSoft,
    color: COLOR.brand,
    fontSize: 7,
    paddingVertical: 1.5,
    paddingHorizontal: 4,
    borderRadius: 6,
    fontWeight: "bold",
  },
  pregunta: {
    borderWidth: 1,
    borderColor: COLOR.line,
    borderLeftWidth: 3,
    borderRadius: 5,
    padding: 8,
    marginBottom: 7,
  },
  enunciado: { fontWeight: "bold", marginBottom: 3 },
  detalle: { color: COLOR.inkSoft, marginTop: 2 },
  explicacion: {
    marginTop: 5,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLOR.line,
    color: COLOR.inkSoft,
  },
  pie: {
    position: "absolute",
    bottom: 22,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: COLOR.line,
    paddingTop: 6,
  },
  pieTexto: { fontSize: 6.8, color: COLOR.inkSoft },
});

function Barra({ etiqueta, aciertos, total, chip }) {
  const pct = Math.round((aciertos / total) * 100);
  return (
    <View style={estilos.itemBarra}>
      <View style={estilos.filaBarra}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          {chip && <Text style={estilos.chip}>{chip}</Text>}
          <Text>{etiqueta}</Text>
        </View>
        <Text style={{ color: COLOR.inkSoft }}>
          {aciertos}/{total} · {pct}%
        </Text>
      </View>
      <View style={estilos.barraFondo}>
        <View
          style={{
            height: 5,
            width: `${pct}%`,
            borderRadius: 3,
            backgroundColor: pct >= 70 ? COLOR.teal : COLOR.accent,
          }}
        />
      </View>
    </View>
  );
}

export default function InformePDF({ lectura, respuestas, metricas, desempeno }) {
  const nivel = getNivel(lectura.nivel);
  const unidad = getUnidad(lectura.nivel, lectura.unidad);
  const rango = getExtension(lectura.nivel, lectura.dificultad);
  const ppm = metricas?.ppm ?? 0;
  const categoria = clasificarPPM(lectura.nivel, ppm);
  const segundos = metricas?.segundos ?? 0;
  const fecha = new Date().toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Document
      title={`Informe de lectura · ${lectura.titulo}`}
      author="L+IA"
      subject="Informe de comprensión lectora"
    >
      <Page size="A4" style={estilos.pagina}>
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
            <Text style={{ fontSize: 8, fontWeight: "bold" }}>Informe de comprensión lectora</Text>
            <Text style={{ fontSize: 7.5, color: COLOR.inkSoft, marginTop: 2 }}>{fecha}</Text>
          </View>
        </View>

        <Text style={estilos.titulo}>{lectura.titulo}</Text>
        <Text style={estilos.subtitulo}>
          {nivel.label} ({nivel.edad}) · {unidad.titulo} ·{" "}
          {TIPOS_TEXTO.find((t) => t.id === lectura.tipoTexto)?.label} · Extensión{" "}
          {DIFICULTADES.find((d) => d.id === lectura.dificultad)?.label.toLowerCase()} ·{" "}
          {metricas?.palabras ?? lectura.nPalabras} palabras (rango {rango.min}-{rango.max})
        </Text>

        <View style={estilos.fila}>
          <View style={estilos.tarjeta}>
            <Text style={estilos.tarjetaEtiqueta}>Comprensión</Text>
            <Text style={[estilos.tarjetaValor, { color: COLOR.brand }]}>
              {desempeno.porcentaje}%
            </Text>
            <Text style={estilos.tarjetaNota}>
              {desempeno.correctas} de {desempeno.total} correctas · umbral 70%
            </Text>
          </View>
          <View style={estilos.tarjeta}>
            <Text style={estilos.tarjetaEtiqueta}>Velocidad lectora</Text>
            <Text style={estilos.tarjetaValor}>{ppm} ppm</Text>
            <Text style={[estilos.tarjetaNota, { color: COLOR.brand }]}>
              {categoria.label} para {nivel.label}
            </Text>
          </View>
          <View style={estilos.tarjeta}>
            <Text style={estilos.tarjetaEtiqueta}>Tiempo de lectura</Text>
            <Text style={estilos.tarjetaValor}>
              {Math.floor(segundos / 60)}:{String(segundos % 60).padStart(2, "0")}
            </Text>
            <Text style={estilos.tarjetaNota}>Sesión sugerida: 10-15 min</Text>
          </View>
        </View>

        <Text style={estilos.seccion}>Desempeño por eje de Lectura</Text>
        {desempeno.porEje.map((eje) => (
          <Barra key={eje.id} etiqueta={eje.label} aciertos={eje.aciertos} total={eje.total} />
        ))}

        <Text style={estilos.seccion}>Logro por Objetivo de Aprendizaje</Text>
        {desempeno.porOA.map((oa) => (
          <Barra
            key={oa.codigo}
            chip={oa.codigo}
            etiqueta={oa.dominio}
            aciertos={oa.aciertos}
            total={oa.total}
          />
        ))}

        <Text style={estilos.seccion}>Detalle de las preguntas</Text>
        {lectura.preguntas.map((p, i) => {
          const marcada = respuestas[p.id];
          const acierto = marcada === p.correcta;
          const habilidad = getHabilidad(lectura.nivel, p.habilidad);
          return (
            <View
              key={p.id}
              style={[
                estilos.pregunta,
                { borderLeftColor: acierto ? COLOR.teal : COLOR.danger },
              ]}
              wrap={false}
            >
              <Text style={estilos.enunciado}>
                {i + 1}. {p.enunciado}
              </Text>
              <Text style={{ fontSize: 7.5, color: COLOR.inkSoft }}>
                {habilidad ? `${habilidad.oa} · ${habilidad.label}` : p.habilidad} ·{" "}
                {acierto ? "Correcta" : "Incorrecta"}
              </Text>
              <Text style={estilos.detalle}>
                Respuesta del estudiante: {p.alternativas[marcada] ?? "Sin responder"}
              </Text>
              {!acierto && (
                <Text style={[estilos.detalle, { color: COLOR.teal }]}>
                  Respuesta correcta: {p.alternativas[p.correcta]}
                </Text>
              )}
              <Text style={estilos.explicacion}>{p.explicacion}</Text>
            </View>
          );
        })}

        <View style={estilos.pie} fixed>
          <Text style={estilos.pieTexto}>
            Contenido creado con inteligencia artificial: la información puede tener errores.
            Comprueba los datos antes de darlos por ciertos.
            {lectura.modelo ? ` Texto generado con ${lectura.proveedor} · ${lectura.modelo}.` : ""}
          </Text>
          <Text style={[estilos.pieTexto, { marginTop: 2 }]}>
            L+IA · Lectura + Inteligencia Artificial · Alineado al Currículum Nacional de Chile
            <Text render={({ pageNumber, totalPages }) => `   ·   Página ${pageNumber} de ${totalPages}`} />
          </Text>
        </View>
      </Page>
    </Document>
  );
}
