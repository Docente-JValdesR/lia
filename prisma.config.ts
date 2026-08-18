import dotenv from "dotenv";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { defineConfig } from "prisma/config";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  experimental: { adapter: true },
  adapter: async () =>
    new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    }),
});
