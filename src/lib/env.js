import "server-only";

// Punto único de acceso a credenciales. Nunca debe importarse desde un componente cliente.
function requerida(nombre) {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre}`);
  return valor;
}

function opcional(nombre) {
  return process.env[nombre]?.trim() || null;
}

export const ENV = {
  turso: {
    get url() {
      return requerida("TURSO_DATABASE_URL");
    },
    get token() {
      return requerida("TURSO_AUTH_TOKEN");
    },
  },
  ia: {
    groq: opcional("GROQ_API_KEY"),
    gemini: opcional("GEMINI_API_KEY"),
    openrouter: opcional("OPENROUTER_API_KEY"),
    mistral: opcional("MISTRAL_API_KEY"),
  },
};

export function proveedoresDisponibles() {
  return Object.entries(ENV.ia)
    .filter(([, clave]) => Boolean(clave))
    .map(([nombre]) => nombre);
}
