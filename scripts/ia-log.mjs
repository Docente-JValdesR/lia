import dotenv from "dotenv";
import { createClient } from "@libsql/client";

dotenv.config({ path: ".env.local", quiet: true });

const cliente = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const limite = Number(process.argv[2]) || 8;
const { rows } = await cliente.execute(
  `SELECT proveedor, modelo, ok, latencia_ms, tokens_out, substr(error, 1, 260) AS error
   FROM generaciones ORDER BY creado_en DESC LIMIT ${limite}`
);

for (const r of rows) {
  const estado = r.ok ? "OK   " : "FALLO";
  console.log(`\n${estado} ${r.proveedor} · ${r.modelo} · ${r.latencia_ms ?? "-"}ms · out:${r.tokens_out ?? "-"}`);
  if (r.error) console.log(`      ${String(r.error).replace(/\s+/g, " ")}`);
}

const resumen = await cliente.execute(
  `SELECT proveedor, COUNT(*) total, SUM(CASE WHEN ok THEN 1 ELSE 0 END) exitos,
          ROUND(AVG(latencia_ms)) latencia_prom
   FROM generaciones GROUP BY proveedor ORDER BY exitos DESC`
);
console.log("\nResumen por proveedor:");
console.table(resumen.rows);
