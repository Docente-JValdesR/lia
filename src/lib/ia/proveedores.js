import "server-only";
import { ENV } from "@/lib/env";

// Los cuatro proveedores exponen una API compatible con OpenAI, así que comparten adaptador.
// tokensPorSegundo proviene de la medición real registrada en la tabla `generaciones`.
export const MODELOS = [
  {
    id: "groq",
    proveedor: "groq",
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    modelo: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    // gpt-oss es un modelo de razonamiento: sin acotarlo devuelve el JSON vacío.
    extras: { reasoning_effort: "low" },
    maxSalida: 65536,
    tokensPorSegundo: 400,
    get clave() {
      return ENV.ia.groq;
    },
  },
  {
    id: "mistral",
    proveedor: "mistral",
    baseUrl: "https://api.mistral.ai/v1/chat/completions",
    modelo: process.env.MISTRAL_MODEL || "mistral-small-latest",
    maxSalida: 32768,
    tokensPorSegundo: 130,
    get clave() {
      return ENV.ia.mistral;
    },
  },
  {
    id: "openrouter",
    proveedor: "openrouter",
    baseUrl: "https://openrouter.ai/api/v1/chat/completions",
    modelo: process.env.OPENROUTER_MODEL || "nvidia/nemotron-3.5-lightning:free",
    maxSalida: 65536,
    tokensPorSegundo: 90,
    get clave() {
      return ENV.ia.openrouter;
    },
  },
  {
    id: "gemini",
    proveedor: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    modelo: process.env.GEMINI_MODEL || "gemini-3.6-flash",
    maxSalida: 65536,
    tokensPorSegundo: 50,
    get clave() {
      return ENV.ia.gemini;
    },
  },
];

export function modelosDisponibles() {
  return MODELOS.filter((m) => Boolean(m.clave));
}

export function resolverRonda(soloProveedor, { maxTokens = 0, presupuestoMs = 0 } = {}) {
  const disponibles = modelosDisponibles();
  if (soloProveedor) return disponibles.filter((m) => m.id === soloProveedor);
  if (!maxTokens) return disponibles;

  const alcanzan = disponibles.filter((m) => {
    if (m.maxSalida && maxTokens > m.maxSalida) return false;
    if (!presupuestoMs) return true;
    // Se descarta el modelo que no alcanzaría a terminar dentro del tiempo disponible.
    return (maxTokens / m.tokensPorSegundo) * 1000 <= presupuestoMs;
  });

  const ronda = alcanzan.length ? alcanzan : disponibles;
  return [...ronda].sort((a, b) => b.tokensPorSegundo - a.tokensPorSegundo);
}

// El español consume ~1.6 tokens por palabra; cada pregunta suma enunciado, alternativas y explicación.
export function calcularMaxTokens({ palabras, preguntas }) {
  const estimado = Math.ceil(palabras * 1.6 + preguntas * 170 + 600);
  return Math.min(Math.max(estimado, 1500), 16000);
}

export async function pedirGeneracion(modelo, prompt, { timeoutMs = 60000, maxTokens } = {}) {
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
        max_tokens: maxTokens,
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
