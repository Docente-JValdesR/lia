import "server-only";
import { prisma } from "@/lib/db";
import { serializarTexto } from "@/lib/ia/contrato";
import { generarActividad } from "@/lib/ia/router";

// En validación se sirven también los borradores; al pasar a producción se limita a "aprobado".
const ESTADOS_SERVIBLES =
  process.env.SOLO_TEXTOS_APROBADOS === "1" ? ["aprobado"] : ["aprobado", "borrador"];

// Se relajan los filtros de menos a más importante: la unidad temática cede antes que el nivel.
const RELAJACIONES = [
  { quitar: [], aviso: null },
  {
    quitar: ["unidad"],
    aviso: "No había una actividad de esa unidad, así que traje otra del mismo nivel.",
  },
  {
    quitar: ["unidad", "tipoTexto"],
    aviso: "No había una actividad con ese tipo de texto, así que traje otra equivalente del nivel.",
  },
  {
    quitar: ["unidad", "tipoTexto", "dificultad"],
    aviso: "Traje una actividad de tu nivel con otra extensión, porque no había una igual a la pedida.",
  },
];

export async function obtenerActividad(config, opciones = {}) {
  const problemas = [];

  try {
    const resultado = await generarActividad(config, opciones);
    return {
      origen: "ia",
      texto: serializarTexto(resultado.texto),
      proveedor: resultado.proveedor,
      modelo: resultado.modelo,
      reintentos: resultado.fallos,
    };
  } catch (error) {
    problemas.push(error.message);
  }

  const delBanco = await buscarEnBanco(config);
  if (delBanco) {
    return {
      origen: "banco",
      texto: serializarTexto(delBanco.texto),
      aviso: delBanco.aviso,
      reintentos: problemas,
    };
  }

  return {
    origen: null,
    error: {
      codigo: "sin_disponibilidad",
      titulo: "L+IA está con mucha demanda",
      mensaje:
        "En este momento no pude preparar tu actividad y todavía no tengo una guardada con esas características. Vuelve a intentarlo en unos minutos.",
      sugerencia:
        "También puedes cambiar el nivel, la unidad o la extensión para encontrar una actividad disponible.",
      reintentarEn: 120,
      detalle: problemas,
    },
  };
}

async function buscarEnBanco(config) {
  const base = {
    nivel: config.nivel,
    unidad: config.unidad,
    tipoTexto: config.tipoTexto,
    dificultad: config.dificultad,
  };

  for (const paso of RELAJACIONES) {
    const filtros = { estado: { in: ESTADOS_SERVIBLES } };
    for (const [campo, valor] of Object.entries(base)) {
      if (!paso.quitar.includes(campo)) filtros[campo] = valor;
    }

    const total = await prisma.texto.count({ where: filtros });
    if (!total) continue;

    const texto = await prisma.texto.findFirst({
      where: filtros,
      skip: Math.floor(Math.random() * total),
      include: { preguntas: { orderBy: { orden: "asc" } } },
    });

    if (texto) return { texto, aviso: paso.aviso };
  }

  return null;
}
