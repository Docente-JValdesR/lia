import "server-only";
import { z } from "zod";
import {
  DIFICULTADES,
  getHabilidades,
  getNivel,
  getUnidades,
  NIVELES,
  TIPOS_TEXTO,
} from "@/data/curriculum";

const esquemaBase = z.object({
  nivel: z.enum(NIVELES.map((n) => n.id)),
  unidad: z.string(),
  tipoTexto: z.enum(TIPOS_TEXTO.map((t) => t.id)),
  dificultad: z.enum(DIFICULTADES.map((d) => d.id)),
  cantidadPreguntas: z.number().int().min(3).max(10),
  habilidades: z.array(z.string()).min(1),
});

export function validarConfiguracion(entrada) {
  const analisis = esquemaBase.safeParse(entrada);
  if (!analisis.success) {
    return {
      valido: false,
      problemas: analisis.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }

  const config = analisis.data;
  const problemas = [];

  if (!getUnidades(config.nivel).some((u) => u.id === config.unidad)) {
    problemas.push(`La unidad "${config.unidad}" no existe en ${getNivel(config.nivel).label}.`);
  }

  const idsValidos = new Set(getHabilidades(config.nivel).map((h) => h.id));
  const invalidas = config.habilidades.filter((h) => !idsValidos.has(h));
  if (invalidas.length) {
    problemas.push(`Habilidades ajenas al nivel: ${invalidas.join(", ")}.`);
  }

  return problemas.length ? { valido: false, problemas } : { valido: true, config };
}

// Forma con que el front consume una actividad, equivalente al contrato del texto de demostración.
export function serializarTexto(texto) {
  return {
    id: texto.id,
    titulo: texto.titulo,
    parrafos: JSON.parse(texto.parrafos),
    nivel: texto.nivel,
    unidad: texto.unidad,
    tipoTexto: texto.tipoTexto,
    dificultad: texto.dificultad,
    nPalabras: texto.nPalabras,
    estado: texto.estado,
    proveedor: texto.proveedor,
    modelo: texto.modelo,
    preguntas: texto.preguntas.map((p) => ({
      id: p.id,
      enunciado: p.enunciado,
      alternativas: JSON.parse(p.alternativas),
      correcta: p.correcta,
      explicacion: p.explicacion,
      habilidad: p.habilidadId,
    })),
  };
}
