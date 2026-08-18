import { SITE } from "@/data/site";

export default function manifest() {
  return {
    name: SITE.nombreLargo,
    short_name: SITE.nombre,
    description: SITE.descripcion,
    start_url: "/app",
    display: "standalone",
    background_color: "#f8f9fc",
    theme_color: "#6965db",
    lang: "es-CL",
    categories: ["education", "productivity"],
    icons: [
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
