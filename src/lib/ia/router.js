import "server-only";
import { getExtension, getHabilidad } from "@/data/curriculum";
import { prisma } from "@/lib/db";
import {
  esquemaLectura,
  esquemaPreguntas,
  esquemaTexto,
  validarCurricularmente,
  validarExtension,
} from "@/lib/ia/esquema";
import {
  construirPrompt,
  construirPromptPreguntas,
  construirPromptTexto,
  prompsCorreccion,
  UMBRAL_DOS_FASES,
} from "@/lib/ia/prompt";
import {
  calcularMaxTokens,
  extraerJSON,
  pedirGeneracion,
  resolverRonda,
} from "@/lib/ia/proveedores";

// El plan de Vercel corta la función a 60 s: se reserva margen para responder antes de ese corte.
const PRESUPUESTO_MS = Number(process.env.PRESUPUESTO_IA_MS) || 48000;
const MINIMO_POR_INTENTO_MS = 10000;
const MAX_CORRECCIONES = 1;

export async function generarActividad(config, opciones = {}) {
  const { proveedor, onProgreso = () => {}, inicioMs = Date.now() } = opciones;

  const rango = getExtension(config.nivel, config.dificultad);
  const maxTokens = calcularMaxTokens({
    palabras: rango.max,
    preguntas: config.cantidadPreguntas,
  });

  const disponibles = resolverRonda(proveedor, { maxTokens, presupuestoMs: PRESUPUESTO_MS });
  if (!disponibles.length) {
    throw new Error(
      proveedor
        ? `El proveedor "${proveedor}" no está configurado.`
        : "No hay proveedores de IA configurados. Define al menos una clave en las variables de entorno."
    );
  }

  const restante = () => PRESUPUESTO_MS - (Date.now() - inicioMs);
  const enDosFases = rango.max > UMBRAL_DOS_FASES;
  const fallos = [];

  for (const modelo of disponibles) {
    if (restante() < MINIMO_POR_INTENTO_MS) {
      fallos.push("Se agotó el tiempo disponible para consultar más modelos.");
      onProgreso({ tipo: "tiempo_agotado" });
      break;
    }

    onProgreso({ tipo: "intentando", proveedor: modelo.proveedor, modelo: modelo.modelo });

    try {
      const datos = enDosFases
        ? await generarEnDosFases({
            modelo,
            alternativos: disponibles.filter((m) => m.id !== modelo.id),
            config,
            rango,
            maxTokens,
            restante,
            onProgreso,
          })
        : await generarEnUnaFase({ modelo, config, maxTokens, restante, onProgreso });

      onProgreso({ tipo: "validando", proveedor: modelo.proveedor });
      const curricular = validarCurricularmente(datos, config);

      if (!curricular.valido) {
        fallos.push(`${modelo.id}: ${curricular.problemas[0]}`);
        onProgreso({
          tipo: "rechazado",
          proveedor: modelo.proveedor,
          motivo: curricular.problemas[0],
        });
        continue;
      }

      onProgreso({ tipo: "guardando", proveedor: modelo.proveedor });
      const texto = await guardarActividad({
        datos,
        config,
        modelo,
        promptVersion: "v1",
        nPalabras: curricular.nPalabras,
      });

      return { texto, proveedor: modelo.proveedor, modelo: modelo.modelo, fallos };
    } catch (error) {
      const mensaje = error.name === "AbortError" ? "tiempo de espera agotado" : error.message;
      fallos.push(`${modelo.id}: ${mensaje}`);
      onProgreso({ tipo: "rechazado", proveedor: modelo.proveedor, motivo: mensaje });
    }
  }

  throw new Error(`Ningún modelo entregó una actividad válida. ${fallos.join(" || ")}`);
}

async function generarEnUnaFase({ modelo, config, maxTokens, restante }) {
  const prompt = construirPrompt(config);
  const salida = await pedirGeneracion(modelo, prompt, {
    timeoutMs: restante(),
    maxTokens,
  });
  await registrar(modelo, prompt, salida, { ok: true });

  const analisis = esquemaLectura.safeParse(extraerJSON(salida.contenido));
  if (!analisis.success) {
    throw new Error(`formato inválido: ${resumirIssues(analisis.error)}`);
  }
  return analisis.data;
}

// Para textos extensos se pide primero el texto y después las preguntas: el modelo cumple mejor la extensión.
async function generarEnDosFases({
  modelo,
  alternativos = [],
  config,
  rango,
  maxTokens,
  restante,
  onProgreso,
}) {
  let prompt = construirPromptTexto(config);
  let textoGenerado = null;

  for (let intento = 0; intento <= MAX_CORRECCIONES; intento++) {
    const salida = await pedirGeneracion(modelo, prompt, {
      timeoutMs: restante(),
      maxTokens: Math.round(maxTokens * 0.75),
    });
    await registrar(modelo, prompt, salida, { ok: true, fase: "texto" });

    const analisis = esquemaTexto.safeParse(extraerJSON(salida.contenido));
    if (!analisis.success) {
      throw new Error(`formato inválido del texto: ${resumirIssues(analisis.error)}`);
    }

    const extension = validarExtension(analisis.data.parrafos, config);
    if (extension.valido) {
      textoGenerado = analisis.data;
      break;
    }

    if (intento === MAX_CORRECCIONES || restante() < MINIMO_POR_INTENTO_MS) {
      throw new Error(extension.problema);
    }

    onProgreso({
      tipo: "rechazado",
      proveedor: modelo.proveedor,
      motivo: `${extension.problema} Pidiendo una versión más extensa.`,
    });
    prompt = prompsCorreccion(construirPromptTexto(config), {
      nPalabras: extension.nPalabras,
      rango,
    });
  }

  const promptPreguntas = construirPromptPreguntas(config, textoGenerado);
  const maxTokensPreguntas = Math.round(maxTokens * 0.5);

  // El texto ya está escrito: si el modelo agotó su cuota, otro puede terminar las preguntas.
  const candidatos = [modelo, ...alternativos];
  let ultimoError = null;

  for (const candidato of candidatos) {
    if (restante() < MINIMO_POR_INTENTO_MS) break;
    onProgreso({ tipo: "intentando", proveedor: candidato.proveedor, modelo: "preguntas" });

    try {
      const salidaPreguntas = await pedirGeneracion(candidato, promptPreguntas, {
        timeoutMs: restante(),
        maxTokens: maxTokensPreguntas,
      });
      await registrar(candidato, promptPreguntas, salidaPreguntas, {
        ok: true,
        fase: "preguntas",
      });

      const analisis = esquemaPreguntas.safeParse(extraerJSON(salidaPreguntas.contenido));
      if (!analisis.success) {
        throw new Error(`formato inválido de preguntas: ${resumirIssues(analisis.error)}`);
      }
      return { ...textoGenerado, preguntas: analisis.data.preguntas };
    } catch (error) {
      ultimoError = error;
      onProgreso({
        tipo: "rechazado",
        proveedor: candidato.proveedor,
        motivo: `preguntas: ${error.message}`,
      });
    }
  }

  throw ultimoError ?? new Error("No se pudieron generar las preguntas.");
}

function resumirIssues(error) {
  return error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" | ");
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

async function registrar(modelo, prompt, salida, extra = {}) {
  try {
    await prisma.generacion.create({
      data: {
        proveedor: modelo.proveedor,
        modelo: extra.fase ? `${modelo.modelo} (${extra.fase})` : modelo.modelo,
        promptVersion: prompt.version,
        prompt: prompt.usuario,
        respuestaCruda: salida?.contenido ?? null,
        tokensIn: salida?.tokensIn ?? null,
        tokensOut: salida?.tokensOut ?? null,
        latenciaMs: salida?.latenciaMs ?? null,
        ok: Boolean(extra.ok),
        error: extra.error ?? null,
      },
    });
  } catch {
    // La trazabilidad nunca debe interrumpir la generación.
  }
}
