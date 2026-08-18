import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { proveedoresDisponibles } from "@/lib/env";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [textos, aprobados, generaciones] = await Promise.all([
      prisma.texto.count(),
      prisma.texto.count({ where: { estado: "aprobado" } }),
      prisma.generacion.count(),
    ]);

    return NextResponse.json({
      baseDeDatos: "conectada",
      textos,
      aprobados,
      generaciones,
      proveedoresIA: proveedoresDisponibles(),
    });
  } catch (error) {
    return NextResponse.json(
      { baseDeDatos: "error", detalle: error.message },
      { status: 500 }
    );
  }
}
