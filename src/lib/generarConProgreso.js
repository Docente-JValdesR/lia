"use client";

// Consume el flujo NDJSON de /api/actividad y entrega cada paso al llamador.
export async function generarConProgreso(config, { onPaso, signal } = {}) {
  const respuesta = await fetch("/api/actividad?stream=1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
    signal,
  });

  if (!respuesta.ok || !respuesta.body) {
    const detalle = await respuesta.json().catch(() => ({}));
    return {
      tipo: "error",
      mensaje: detalle.mensaje ?? detalle.error ?? "No se pudo conectar con el servicio.",
    };
  }

  const lector = respuesta.body.getReader();
  const decodificador = new TextDecoder();
  let pendiente = "";
  let final = null;

  while (true) {
    const { done, value } = await lector.read();
    if (done) break;

    pendiente += decodificador.decode(value, { stream: true });
    const lineas = pendiente.split("\n");
    pendiente = lineas.pop() ?? "";

    for (const linea of lineas) {
      if (!linea.trim()) continue;
      let evento;
      try {
        evento = JSON.parse(linea);
      } catch {
        continue;
      }
      if (evento.tipo === "resultado" || evento.tipo === "error") final = evento;
      else onPaso?.(evento);
    }
  }

  return (
    final ?? {
      tipo: "error",
      mensaje: "La conexión se interrumpió antes de terminar la actividad.",
    }
  );
}

export async function confirmarActividad(config, propuesta) {
  const respuesta = await fetch("/api/actividad/confirmar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      config,
      texto: propuesta.texto,
      proveedor: propuesta.proveedor,
      modelo: propuesta.modelo,
    }),
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw new Error(datos.error ?? "No se pudo guardar la propuesta.");
  return datos.texto;
}
