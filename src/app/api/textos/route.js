import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializarTexto } from "@/lib/ia/contrato";

export const runtime = "nodejs";

// Sirve el banco de textos. El estudiante nunca gatilla una llamada a un modelo de IA desde aquí.
export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const filtros = {};

  const estado = params.get("estado");
  if (estado && estado !== "todos") filtros.estado = estado;

  for (const campo of ["nivel", "unidad", "tipoTexto", "dificultad", "proveedor"]) {
    const valor = params.get(campo);
    if (valor) filtros[campo] = valor;
  }

  const limite = Math.min(Number(params.get("limite")) || 60, 200);

  try {
    if (params.get("aleatorio") === "1") {
      const total = await prisma.texto.count({ where: filtros });
      if (!total) {
        return NextResponse.json(
          { error: "No hay textos disponibles con esos filtros" },
          { status: 404 }
        );
      }
      const texto = await prisma.texto.findFirst({
        where: filtros,
        skip: Math.floor(Math.random() * total),
        include: { preguntas: { orderBy: { orden: "asc" } } },
      });
      return NextResponse.json(serializarTexto(texto));
    }

    const textos = await prisma.texto.findMany({
      where: filtros,
      orderBy: { creadoEn: "desc" },
      take: limite,
      include: { preguntas: { orderBy: { orden: "asc" } } },
    });

    const valoraciones = await prisma.valoracionTexto.groupBy({
      by: ["textoId"],
      where: { textoId: { in: textos.map((t) => t.id) } },
      _avg: { estrellas: true },
      _count: true,
    });
    const porTexto = new Map(valoraciones.map((v) => [v.textoId, v]));

    return NextResponse.json({
      total: textos.length,
      textos: textos.map((t) => {
        const v = porTexto.get(t.id);
        return {
          ...serializarTexto(t),
          creadoEn: t.creadoEn,
          valoracion: v ? Number(v._avg.estrellas.toFixed(1)) : null,
          nValoraciones: v?._count ?? 0,
        };
      }),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
