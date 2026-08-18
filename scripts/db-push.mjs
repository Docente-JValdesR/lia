import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });

const cliente = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const sql = readFileSync("prisma/schema.sql", "utf8");
const sentencias = sql
  .split("\n")
  .filter((linea) => !linea.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const sentencia of sentencias) {
  await cliente.execute(sentencia);
  const nombre = sentencia.match(/"([^"]+)"/)?.[1] ?? "";
  console.log(`OK  ${sentencia.slice(0, 24).replace(/\s+/g, " ")} ${nombre}`);
}

const tablas = await cliente.execute(
  "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
);
console.log("\nTablas en Turso:", tablas.rows.map((r) => r.name).join(", "));
