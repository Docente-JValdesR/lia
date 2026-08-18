import { NextResponse } from "next/server";
import { validarConfiguracion } from "@/lib/ia/contrato";
import { obtenerActividad } from "@/lib/ia/orquestador";

export const runtime = "nodejs";
export const maxDuration = 180;

// Punto de entrada del front: intenta generar con IA y, si no lo logra, recurre al banco.
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

  const resultado = await obtenerActividad(validacion.config, {
    proveedor: entrada.proveedor,
  });

  if (!resultado.origen) {
    return NextResponse.json(resultado.error, { status: 503 });
  }

  return NextResponse.json(resultado);
}
