import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

const { resolverRonda, calcularMaxTokens } = await import("../src/lib/ia/proveedores.js").catch(
  async () => {
    // El módulo usa alias @ y server-only; se reproduce el cálculo aquí.
    return {};
  }
);

if (!resolverRonda) {
  console.log("No se pudo importar el módulo directamente (usa alias '@'). Cálculo manual:");
  const modelos = [
    { id: "groq", tps: 400, max: 65536 },
    { id: "mistral", tps: 130, max: 32768 },
    { id: "openrouter", tps: 90, max: 65536 },
    { id: "gemini", tps: 50, max: 65536 },
  ];
  const maxTokens = Math.ceil(1800 * 1.6 + 10 * 170 + 600);
  const presupuesto = 48000;
  console.log(`maxTokens estimado: ${maxTokens} · presupuesto: ${presupuesto} ms\n`);
  for (const m of modelos) {
    const ms = (maxTokens / m.tps) * 1000;
    console.log(
      `${m.id.padEnd(11)} ${Math.round(ms).toString().padStart(6)} ms  ${ms <= presupuesto ? "ENTRA" : "descartado"}`
    );
  }
}
