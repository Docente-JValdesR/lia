import { NextResponse } from "next/server";
import { validarConfiguracion } from "@/lib/ia/contrato";
import { guardarActividadConfirmada } from "@/lib/ia/router";
import { serializarTexto } from "@/lib/ia/contrato";

export const runtime = "nodejs";

export async function POST(request) {
  const entrada = await request.json().catch(() => null);
  if (!entrada) return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });

  const validacion = validarConfiguracion(entrada.config);
  if (!validacion.valido) {
    return NextResponse.json({ error: "Configuración inválida", problemas: validacion.problemas }, { status: 400 });
  }

  try {
    const texto = await guardarActividadConfirmada({
      datos: entrada.texto,
      config: validacion.config,
      proveedor: entrada.proveedor ?? "confirmado",
      modelo: entrada.modelo ?? "modelo-no-especificado",
    });
    return NextResponse.json({ texto: serializarTexto(texto) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}