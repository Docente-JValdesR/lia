import { z } from "zod";
import { EJES, getExtension, getHabilidades, getNivel } from "@/data/curriculum";

// Algunos modelos devuelven los párrafos como un solo texto o el índice correcto como cadena.
const aParrafos = z.preprocess((valor) => {
  if (typeof valor === "string") {
    return valor
      .split(/\n\s*\n|\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 20);
  }
  if (Array.isArray(valor)) {
    return valor
      .map((p) => (typeof p === "string" ? p : (p?.texto ?? p?.contenido ?? "")))
      .map((p) => String(p).trim())
      .filter(Boolean);
  }
  return valor;
}, z.array(z.string().min(20)).min(2).max(20));

const aIndice = z.preprocess(
  (valor) => (typeof valor === "string" ? Number(valor) : valor),
  z.number().int().min(0).max(3)
);

export const esquemaTexto = z.object({
  titulo: z.string().min(5).max(160),
  parrafos: aParrafos,
});

export const esquemaPreguntas = z.object({
  preguntas: z
    .array(
      z.object({
        enunciado: z.string().min(10),
        alternativas: z.array(z.string().min(1)).min(3).max(4),
        correcta: aIndice,
        explicacion: z.string().min(15),
        habilidad: z.string().min(2),
      })
    )
    .min(3)
    .max(10),
});

export const esquemaLectura = esquemaTexto.merge(esquemaPreguntas);

// Segunda capa: reglas que el esquema no puede expresar y que definen la validez pedagógica.
export function validarCurricularmente(datos, config) {
  const problemas = [];
  const nivel = getNivel(config.nivel);
  const rango = getExtension(config.nivel, config.dificultad);
  const habilidadesNivel = getHabilidades(config.nivel);
  const idsValidos = new Set(habilidadesNivel.map((h) => h.id));

  const nPalabras = contarPalabras(datos.parrafos);
  const margen = Math.round(rango.min * 0.12);
  const corto = nPalabras < rango.min - margen;
  if (corto || nPalabras > rango.max + margen) {
    problemas.push(
      `El texto tiene ${nPalabras} palabras y ${nivel.label} exige entre ${rango.min} y ${rango.max}.`
    );
  }

  if (datos.preguntas.length !== config.cantidadPreguntas) {
    problemas.push(
      `Se pidieron ${config.cantidadPreguntas} preguntas y llegaron ${datos.preguntas.length}.`
    );
  }

  datos.preguntas.forEach((p, i) => {
    if (!idsValidos.has(p.habilidad)) {
      problemas.push(`Pregunta ${i + 1}: la habilidad "${p.habilidad}" no existe en ${nivel.label}.`);
    }
    if (p.correcta >= p.alternativas.length) {
      problemas.push(`Pregunta ${i + 1}: el índice de la alternativa correcta está fuera de rango.`);
    }
    const normalizadas = p.alternativas.map((a) => a.trim().toLowerCase());
    if (new Set(normalizadas).size !== normalizadas.length) {
      problemas.push(`Pregunta ${i + 1}: hay alternativas repetidas.`);
    }
  });

  const solicitadas = new Set(config.habilidades);
  const entregadas = new Set(datos.preguntas.map((p) => p.habilidad));
  const ejesSolicitados = new Set(
    habilidadesNivel.filter((h) => solicitadas.has(h.id)).map((h) => h.eje)
  );
  const ejesEntregados = new Set(
    habilidadesNivel.filter((h) => entregadas.has(h.id)).map((h) => h.eje)
  );
  for (const eje of ejesSolicitados) {
    if (!ejesEntregados.has(eje)) {
      const label = EJES.find((e) => e.id === eje)?.label ?? eje;
      problemas.push(`No se cubrió el eje "${label}", que sí fue solicitado.`);
    }
  }

  return { valido: problemas.length === 0, problemas, nPalabras, corto };
}

// Valida solo la extensión, para la primera fase de las actividades largas.
export function validarExtension(parrafos, config) {
  const rango = getExtension(config.nivel, config.dificultad);
  const nivel = getNivel(config.nivel);
  const nPalabras = contarPalabras(parrafos);
  const margen = Math.round(rango.min * 0.12);
  const corto = nPalabras < rango.min - margen;
  const largo = nPalabras > rango.max + margen;

  return {
    valido: !corto && !largo,
    corto,
    nPalabras,
    problema:
      corto || largo
        ? `El texto tiene ${nPalabras} palabras y ${nivel.label} exige entre ${rango.min} y ${rango.max}.`
        : null,
  };
}

export function contarPalabras(parrafos) {
  return parrafos.join(" ").split(/\s+/).filter(Boolean).length;
}
