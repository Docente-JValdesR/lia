import "server-only";
import { getHabilidad } from "@/data/curriculum";
import { prisma } from "@/lib/db";
import { esquemaLectura, validarCurricularmente } from "@/lib/ia/esquema";
import { construirPrompt } from "@/lib/ia/prompt";
import { extraerJSON, pedirGeneracion, resolverRonda } from "@/lib/ia/proveedores";

// Recorre la ronda de modelos hasta obtener una actividad que pase las dos capas de validación.
export async function generarActividad(config, { intentosPorModelo = 1, proveedor } = {}) {
  const disponibles = resolverRonda(proveedor);
  if (!disponibles.length) {
    throw new Error(
      proveedor
        ? `El proveedor "${proveedor}" no está configurado.`
        : "No hay proveedores de IA configurados. Define al menos una clave en las variables de entorno."
    );
  }

  const prompt = construirPrompt(config);
  const fallos = [];

  for (const modelo of disponibles) {
    for (let intento = 0; intento < intentosPorModelo; intento++) {
      const registro = {
        proveedor: modelo.proveedor,
        modelo: modelo.modelo,
        promptVersion: prompt.version,
        prompt: prompt.usuario,
      };

      try {
        const salida = await pedirGeneracion(modelo, prompt);
        const crudo = extraerJSON(salida.contenido);
        const analisis = esquemaLectura.safeParse(crudo);

        if (!analisis.success) {
          const detalle = analisis.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join(" | ");
          await registrar({ ...registro, ...salida, ok: false, error: `Esquema: ${detalle}` });
          fallos.push(`${modelo.id}: esquema inválido`);
          continue;
        }

        const curricular = validarCurricularmente(analisis.data, config);
        if (!curricular.valido) {
          await registrar({
            ...registro,
            ...salida,
            ok: false,
            error: `Currículum: ${curricular.problemas.join(" | ")}`,
          });
          fallos.push(`${modelo.id}: ${curricular.problemas[0]}`);
          continue;
        }

        const texto = await guardarActividad({
          datos: analisis.data,
          config,
          modelo,
          promptVersion: prompt.version,
          nPalabras: curricular.nPalabras,
        });

        await registrar({
          ...registro,
          ...salida,
          textoId: texto.id,
          ok: true,
          respuestaCruda: salida.contenido,
        });

        return { texto, proveedor: modelo.proveedor, modelo: modelo.modelo, fallos };
      } catch (error) {
        await registrar({ ...registro, ok: false, error: error.message?.slice(0, 900) });
        fallos.push(`${modelo.id}: ${error.message}`);
      }
    }
  }

  const detalle = fallos.join(" || ");
  throw new Error(`Ningún modelo entregó una actividad válida. ${detalle}`);
}

async function guardarActividad({ datos, config, modelo, promptVersion, nPalabras }) {
  return prisma.texto.create({
    data: {
      titulo: datos.titulo,
      parrafos: JSON.stringify(datos.parrafos),
      nivel: config.nivel,
      unidad: config.unidad,
      tipoTexto: config.tipoTexto,
      dificultad: config.dificultad,
      nPalabras,
      estado: "borrador",
      proveedor: modelo.proveedor,
      modelo: modelo.modelo,
      promptVersion,
      preguntas: {
        create: datos.preguntas.map((p, i) => {
          const habilidad = getHabilidad(config.nivel, p.habilidad);
          return {
            orden: i + 1,
            enunciado: p.enunciado,
            alternativas: JSON.stringify(p.alternativas),
            correcta: p.correcta,
            explicacion: p.explicacion,
            habilidadId: p.habilidad,
            eje: habilidad?.eje ?? "",
            oaCodigo: habilidad?.oa ?? "",
          };
        }),
      },
    },
    include: { preguntas: { orderBy: { orden: "asc" } } },
  });
}

async function registrar(datos) {
  try {
    await prisma.generacion.create({
      data: {
        textoId: datos.textoId ?? null,
        proveedor: datos.proveedor,
        modelo: datos.modelo,
        promptVersion: datos.promptVersion,
        prompt: datos.prompt,
        respuestaCruda: datos.respuestaCruda ?? null,
        tokensIn: datos.tokensIn ?? null,
        tokensOut: datos.tokensOut ?? null,
        latenciaMs: datos.latenciaMs ?? null,
        ok: Boolean(datos.ok),
        error: datos.error ?? null,
      },
    });
  } catch {
    // La trazabilidad nunca debe interrumpir la generación.
  }
}
