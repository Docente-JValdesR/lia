// Prueba el endpoint de actividad mostrando cada paso del progreso.
const HABILIDADES = {
  "2basico": ["localizar_personajes", "visualizar", "conexion_experiencia"],
  "4basico": ["localizar_explicita", "inferir", "opinion_fundamentada"],
  "6basico": ["localizar_explicita", "inferencia_compleja", "comparar_textos"],
  "8basico": ["localizar_explicita", "hecho_opinion", "proposito_medios"],
  "2medio": ["localizar_relevante", "propositos_implicitos", "punto_de_vista", "validez_fuentes"],
};

const nivel = process.argv[2] || "2medio";
const config = {
  nivel,
  unidad: process.argv[3] || "u2",
  tipoTexto: process.argv[6] || "informativo",
  dificultad: process.argv[4] || "avanzada",
  cantidadPreguntas: Number(process.argv[5]) || 10,
  habilidades: HABILIDADES[nivel],
};

const inicio = Date.now();
const respuesta = await fetch("http://localhost:3000/api/actividad?stream=1", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(config),
});

if (!respuesta.ok) {
  console.log(`HTTP ${respuesta.status}:`, JSON.stringify(await respuesta.json()));
  process.exit(1);
}

const lector = respuesta.body.getReader();
const decodificador = new TextDecoder();
let pendiente = "";

while (true) {
  const { done, value } = await lector.read();
  if (done) break;
  pendiente += decodificador.decode(value, { stream: true });
  const lineas = pendiente.split("\n");
  pendiente = lineas.pop();

  for (const linea of lineas) {
    if (!linea.trim()) continue;
    const e = JSON.parse(linea);
    const s = ((Date.now() - inicio) / 1000).toFixed(1).padStart(5);
    if (e.tipo === "resultado") {
      console.log(
        `${s}s  RESULTADO origen=${e.origen} modelo=${e.modelo ?? "-"} palabras=${e.texto.nPalabras} preguntas=${e.texto.preguntas.length}`
      );
      console.log(`        "${e.texto.titulo}"`);
    } else if (e.tipo === "error") {
      console.log(`${s}s  ERROR ${e.mensaje ?? ""}`);
    } else {
      console.log(`${s}s  ${e.tipo} ${e.proveedor ?? ""} ${e.motivo ?? ""}`);
    }
  }
}
