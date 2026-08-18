import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializarTexto } from "@/lib/ia/contrato";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const texto = await prisma.texto.findUnique({
      where: { id },
      include: { preguntas: { orderBy: { orden: "asc" } } },
    });

    if (!texto) {
      return NextResponse.json({ error: "Texto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(serializarTexto(texto));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
