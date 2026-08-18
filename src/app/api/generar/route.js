import { NextResponse } from "next/server";
import { serializarTexto, validarConfiguracion } from "@/lib/ia/contrato";
import { generarActividad } from "@/lib/ia/router";
import { modelosDisponibles } from "@/lib/ia/proveedores";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET() {
  return NextResponse.json({
    modelos: modelosDisponibles().map((m) => ({ id: m.id, modelo: m.modelo })),
  });
}

export async function POST(request) {
  const entrada = await request.json().catch(() => null);
  if (!entrada) {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const validacion = validarConfiguracion(entrada);
  if (!validacion.valido) {
    return NextResponse.json(
      { error: "Configuración inválida", problemas: validacion.problemas },
      { status: 400 }
    );
  }

  try {
    const resultado = await generarActividad(validacion.config, {
      proveedor: entrada.proveedor,
    });
    return NextResponse.json({
      texto: serializarTexto(resultado.texto),
      proveedor: resultado.proveedor,
      modelo: resultado.modelo,
      reintentos: resultado.fallos,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
