import { NextResponse } from "next/server";
import { validarConfiguracion } from "@/lib/ia/contrato";
import { obtenerActividad } from "@/lib/ia/orquestador";

export const runtime = "nodejs";
// Límite del plan Hobby de Vercel; el router reserva margen para responder antes del corte.
export const maxDuration = 60;

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

  const inicioMs = Date.now();
  const opciones = { proveedor: entrada.proveedor, inicioMs };

  // Con stream el cliente recibe cada paso en tiempo real (NDJSON).
  if (request.nextUrl.searchParams.get("stream") === "1") {
    const codificador = new TextEncoder();
    const flujo = new ReadableStream({
      async start(controlador) {
        const enviar = (evento) =>
          controlador.enqueue(codificador.encode(`${JSON.stringify(evento)}\n`));

        try {
          const resultado = await obtenerActividad(validacion.config, {
            ...opciones,
            onProgreso: enviar,
          });
          enviar(
            resultado.origen
              ? { tipo: "resultado", ...resultado }
              : { tipo: "error", ...resultado.error }
          );
        } catch (error) {
          enviar({ tipo: "error", codigo: "inesperado", mensaje: error.message });
        } finally {
          controlador.close();
        }
      },
    });

    return new Response(flujo, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  }

  const resultado = await obtenerActividad(validacion.config, opciones);
  if (!resultado.origen) {
    return NextResponse.json(resultado.error, { status: 503 });
  }
  return NextResponse.json(resultado);
}
