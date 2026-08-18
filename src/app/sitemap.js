import { SITE } from "@/data/site";

const RUTAS = [
  { ruta: "", prioridad: 1, frecuencia: "weekly" },
  { ruta: "/app", prioridad: 0.9, frecuencia: "weekly" },
  { ruta: "/biblioteca", prioridad: 0.9, frecuencia: "daily" },
  { ruta: "/about", prioridad: 0.7, frecuencia: "monthly" },
  { ruta: "/faq", prioridad: 0.7, frecuencia: "monthly" },
  { ruta: "/contact", prioridad: 0.5, frecuencia: "yearly" },
  { ruta: "/privacy-policy", prioridad: 0.3, frecuencia: "yearly" },
];

export default function sitemap() {
  const ahora = new Date();
  return RUTAS.map(({ ruta, prioridad, frecuencia }) => ({
    url: `${SITE.url}${ruta}`,
    lastModified: ahora,
    changeFrequency: frecuencia,
    priority: prioridad,
  }));
}
