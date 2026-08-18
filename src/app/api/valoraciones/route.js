import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const esquema = z.object({
  textoId: z.string().min(1),
  estrellas: z.number().int().min(1).max(5),
  comentario: z.string().max(1000).optional().nullable(),
  origen: z.enum(["estudiante", "docente"]).default("estudiante"),
  preguntas: z
    .array(
      z.object({
        preguntaId: z.string().min(1),
        estrellas: z.number().int().min(1).max(5),
        comentario: z.string().max(1000).optional().nullable(),
      })
    )
    .optional()
    .default([]),
});

export async function POST(request) {
  const entrada = await request.json().catch(() => null);
  const analisis = esquema.safeParse(entrada);

  if (!analisis.success) {
    return NextResponse.json(
      { error: "Valoración inválida", problemas: analisis.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const { textoId, estrellas, comentario, origen, preguntas } = analisis.data;

  try {
    await prisma.valoracionTexto.create({
      data: { textoId, estrellas, comentario: comentario || null, origen },
    });

    if (preguntas.length) {
      await prisma.valoracionPregunta.createMany({
        data: preguntas.map((p) => ({
          preguntaId: p.preguntaId,
          estrellas: p.estrellas,
          comentario: p.comentario || null,
          origen,
        })),
      });
    }

    const resumen = await prisma.valoracionTexto.aggregate({
      where: { textoId },
      _avg: { estrellas: true },
      _count: true,
    });

    return NextResponse.json({
      guardado: true,
      promedio: Number(resumen._avg.estrellas?.toFixed(2) ?? 0),
      valoraciones: resumen._count,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
