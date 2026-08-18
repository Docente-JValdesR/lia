-- Esquema de L+IA en Turso. Debe mantenerse alineado con prisma/schema.prisma.
-- Solo crea objetos: nunca elimina ni sobrescribe datos existentes.

CREATE TABLE IF NOT EXISTS "textos" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "titulo" TEXT NOT NULL,
  "parrafos" TEXT NOT NULL,
  "nivel" TEXT NOT NULL,
  "unidad" TEXT NOT NULL,
  "tipo_texto" TEXT NOT NULL,
  "dificultad" TEXT NOT NULL,
  "n_palabras" INTEGER NOT NULL,
  "estado" TEXT NOT NULL DEFAULT 'borrador',
  "proveedor" TEXT,
  "modelo" TEXT,
  "prompt_version" TEXT,
  "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "textos_nivel_unidad_dificultad_estado_idx"
  ON "textos"("nivel", "unidad", "dificultad", "estado");

CREATE INDEX IF NOT EXISTS "textos_estado_idx" ON "textos"("estado");

CREATE TABLE IF NOT EXISTS "preguntas" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "texto_id" TEXT NOT NULL,
  "orden" INTEGER NOT NULL,
  "enunciado" TEXT NOT NULL,
  "alternativas" TEXT NOT NULL,
  "correcta" INTEGER NOT NULL,
  "explicacion" TEXT NOT NULL,
  "habilidad_id" TEXT NOT NULL,
  "eje" TEXT NOT NULL,
  "oa_codigo" TEXT NOT NULL,
  CONSTRAINT "preguntas_texto_id_fkey" FOREIGN KEY ("texto_id")
    REFERENCES "textos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "preguntas_texto_id_idx" ON "preguntas"("texto_id");

CREATE TABLE IF NOT EXISTS "generaciones" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "texto_id" TEXT,
  "proveedor" TEXT NOT NULL,
  "modelo" TEXT NOT NULL,
  "prompt_version" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "respuesta_cruda" TEXT,
  "tokens_in" INTEGER,
  "tokens_out" INTEGER,
  "latencia_ms" INTEGER,
  "ok" BOOLEAN NOT NULL DEFAULT false,
  "error" TEXT,
  "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "generaciones_texto_id_fkey" FOREIGN KEY ("texto_id")
    REFERENCES "textos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "generaciones_proveedor_modelo_idx"
  ON "generaciones"("proveedor", "modelo");

CREATE INDEX IF NOT EXISTS "generaciones_ok_idx" ON "generaciones"("ok");

CREATE TABLE IF NOT EXISTS "valoraciones_texto" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "texto_id" TEXT NOT NULL,
  "estrellas" INTEGER NOT NULL,
  "comentario" TEXT,
  "origen" TEXT NOT NULL DEFAULT 'estudiante',
  "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "valoraciones_texto_texto_id_fkey" FOREIGN KEY ("texto_id")
    REFERENCES "textos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "valoraciones_texto_texto_id_idx"
  ON "valoraciones_texto"("texto_id");

CREATE TABLE IF NOT EXISTS "valoraciones_pregunta" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "pregunta_id" TEXT NOT NULL,
  "estrellas" INTEGER NOT NULL,
  "comentario" TEXT,
  "origen" TEXT NOT NULL DEFAULT 'estudiante',
  "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "valoraciones_pregunta_pregunta_id_fkey" FOREIGN KEY ("pregunta_id")
    REFERENCES "preguntas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "valoraciones_pregunta_pregunta_id_idx"
  ON "valoraciones_pregunta"("pregunta_id");
