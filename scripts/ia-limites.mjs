import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });

const filas = [];

async function json(url, opciones) {
  const r = await fetch(url, opciones);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

try {
  const d = await json("https://api.groq.com/openai/v1/models", {
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
  });
  for (const m of d.data) {
    if (/whisper|tts|guard|orpheus|allam/i.test(m.id)) continue;
    filas.push({
      proveedor: "groq",
      modelo: m.id,
      contexto: m.context_window ?? null,
      maxSalida: m.max_completion_tokens ?? null,
    });
  }
} catch (e) {
  filas.push({ proveedor: "groq", modelo: "error", contexto: null, maxSalida: String(e.message) });
}

try {
  const d = await json(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}&pageSize=200`
  );
  for (const m of d.models) {
    if (!m.supportedGenerationMethods?.includes("generateContent")) continue;
    if (!/gemini-3\.(6|7)-flash$|gemini-3\.5-flash$|gemini-flash-latest/.test(m.name)) continue;
    filas.push({
      proveedor: "gemini",
      modelo: m.name.replace("models/", ""),
      contexto: m.inputTokenLimit ?? null,
      maxSalida: m.outputTokenLimit ?? null,
    });
  }
} catch (e) {
  filas.push({ proveedor: "gemini", modelo: "error", contexto: null, maxSalida: String(e.message) });
}

try {
  const d = await json("https://api.mistral.ai/v1/models", {
    headers: { Authorization: `Bearer ${process.env.MISTRAL_API_KEY}` },
  });
  for (const m of d.data) {
    if (!/mistral-(small|medium|large)-latest/.test(m.id)) continue;
    filas.push({
      proveedor: "mistral",
      modelo: m.id,
      contexto: m.max_context_length ?? null,
      maxSalida: m.max_output_length ?? m.maxTokens ?? null,
    });
  }
} catch (e) {
  filas.push({ proveedor: "mistral", modelo: "error", contexto: null, maxSalida: String(e.message) });
}

try {
  const d = await json("https://openrouter.ai/api/v1/models");
  for (const m of d.data) {
    if (!m.id.endsWith(":free")) continue;
    const salida = m.top_provider?.max_completion_tokens ?? null;
    if (!salida) continue;
    filas.push({
      proveedor: "openrouter",
      modelo: m.id,
      contexto: m.context_length ?? null,
      maxSalida: salida,
    });
  }
} catch (e) {
  filas.push({ proveedor: "openrouter", modelo: "error", contexto: null, maxSalida: String(e.message) });
}

console.table(
  filas.sort((a, b) => (Number(b.maxSalida) || 0) - (Number(a.maxSalida) || 0))
);
