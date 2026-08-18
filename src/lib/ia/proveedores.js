import "server-only";
import { ENV } from "@/lib/env";

// Los cuatro proveedores exponen una API compatible con OpenAI, así que comparten adaptador.
export const MODELOS = [
  {
    id: "groq",
    proveedor: "groq",
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    modelo: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    // gpt-oss es un modelo de razonamiento: sin acotarlo devuelve el JSON vacío.
    extras: { reasoning_effort: "low" },
    get clave() {
      return ENV.ia.groq;
    },
  },
  {
    id: "gemini",
    proveedor: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    modelo: process.env.GEMINI_MODEL || "gemini-3.6-flash",
    get clave() {
      return ENV.ia.gemini;
    },
  },
  {
    id: "mistral",
    proveedor: "mistral",
    baseUrl: "https://api.mistral.ai/v1/chat/completions",
    modelo: process.env.MISTRAL_MODEL || "mistral-small-latest",
    get clave() {
      return ENV.ia.mistral;
    },
  },
  {
    id: "openrouter",
    proveedor: "openrouter",
    baseUrl: "https://openrouter.ai/api/v1/chat/completions",
    modelo: process.env.OPENROUTER_MODEL || "google/gemma-4-31b-it:free",
    get clave() {
      return ENV.ia.openrouter;
    },
  },
];

export function modelosDisponibles() {
  return MODELOS.filter((m) => Boolean(m.clave));
}

export function resolverRonda(soloProveedor) {
  const disponibles = modelosDisponibles();
  if (!soloProveedor) return disponibles;
  return disponibles.filter((m) => m.id === soloProveedor);
}

export async function pedirGeneracion(modelo, prompt, { timeoutMs = 90000 } = {}) {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), timeoutMs);
  const inicio = Date.now();

  try {
    const respuesta = await fetch(modelo.baseUrl, {
      method: "POST",
      signal: control.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${modelo.clave}`,
      },
      body: JSON.stringify({
        model: modelo.modelo,
        temperature: 0.8,
        response_format: { type: "json_object" },
        ...(modelo.extras ?? {}),
        messages: [
          { role: "system", content: prompt.sistema },
          { role: "user", content: prompt.usuario },
        ],
      }),
    });

    const latenciaMs = Date.now() - inicio;

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      throw new Error(`HTTP ${respuesta.status}: ${detalle.slice(0, 300)}`);
    }

    const cuerpo = await respuesta.json();
    const contenido = cuerpo.choices?.[0]?.message?.content;
    if (!contenido) throw new Error("La respuesta no contiene contenido");

    return {
      contenido,
      latenciaMs,
      tokensIn: cuerpo.usage?.prompt_tokens ?? null,
      tokensOut: cuerpo.usage?.completion_tokens ?? null,
    };
  } finally {
    clearTimeout(temporizador);
  }
}

// Algunos modelos envuelven el JSON en un bloque de código pese a la instrucción.
export function extraerJSON(contenido) {
  const limpio = contenido
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const inicio = limpio.indexOf("{");
  const fin = limpio.lastIndexOf("}");
  if (inicio === -1 || fin === -1) throw new Error("No se encontró un objeto JSON en la respuesta");
  return JSON.parse(limpio.slice(inicio, fin + 1));
}
