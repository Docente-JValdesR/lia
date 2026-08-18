import "server-only";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { ENV } from "@/lib/env";

// Reutiliza la instancia entre recargas del servidor de desarrollo.
const globalParaPrisma = globalThis;

function crearCliente() {
  return new PrismaClient({
    adapter: new PrismaLibSql({
      url: ENV.turso.url,
      authToken: ENV.turso.token,
    }),
  });
}

export const prisma = globalParaPrisma.prismaLia ?? crearCliente();

if (process.env.NODE_ENV !== "production") globalParaPrisma.prismaLia = prisma;
