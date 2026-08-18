import dotenv from "dotenv";
import { createClient } from "@libsql/client";

dotenv.config({ path: ".env.local", quiet: true });

const cliente = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const { rows } = await cliente.execute(`
  SELECT proveedor,
         modelo,
         COUNT(*) AS intentos,
         SUM(CASE WHEN ok THEN 1 ELSE 0 END) AS exitos,
         ROUND(AVG(CASE WHEN ok THEN latencia_ms END)) AS lat_ms,
         ROUND(AVG(CASE WHEN ok THEN tokens_out END)) AS tokens_out,
         ROUND(AVG(CASE WHEN ok THEN tokens_out END) * 1000.0 /
               NULLIF(AVG(CASE WHEN ok THEN latencia_ms END), 0), 1) AS tokens_seg
  FROM generaciones
  GROUP BY proveedor, modelo
  ORDER BY tokens_seg DESC NULLS LAST
`);

console.table(rows);

const salida = 5200;
console.log(`\nTiempo estimado para una actividad de 2º medio avanzada (~${salida} tokens):`);
for (const r of rows) {
  if (!r.tokens_seg) continue;
  console.log(`  ${r.proveedor.padEnd(11)} ${(salida / r.tokens_seg).toFixed(1)} s`);
}
