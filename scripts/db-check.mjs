import dotenv from "dotenv";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: ".env.local", quiet: true });

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }),
});

const texto = await prisma.texto.create({
  data: {
    titulo: "Prueba de conexión",
    parrafos: JSON.stringify(["Párrafo de prueba."]),
    nivel: "4basico",
    unidad: "u2",
    tipoTexto: "informativo",
    dificultad: "media",
    nPalabras: 3,
    estado: "borrador",
    proveedor: "prueba",
    modelo: "prueba",
    promptVersion: "v0",
    preguntas: {
      create: [
        {
          orden: 1,
          enunciado: "¿Es una prueba?",
          alternativas: JSON.stringify(["Sí", "No"]),
          correcta: 0,
          explicacion: "Es una prueba de conexión.",
          habilidadId: "localizar_explicita",
          eje: "localizar",
          oaCodigo: "OA 6",
        },
      ],
    },
  },
  include: { preguntas: true },
});

console.log("Escritura OK:", texto.id, "· preguntas:", texto.preguntas.length);

const leido = await prisma.texto.findUnique({
  where: { id: texto.id },
  include: { preguntas: true },
});
console.log("Lectura OK:", leido.titulo, "·", JSON.parse(leido.parrafos)[0]);

await prisma.texto.delete({ where: { id: texto.id } });
console.log("Registro de prueba retirado. Conexión Prisma + Turso verificada.");

const total = await prisma.texto.count();
console.log("Textos en la base:", total);
