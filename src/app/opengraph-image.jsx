import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

export const alt = `${SITE.nombreLargo} · ${SITE.eslogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #f8f9fc 0%, #e8e7ff 55%, #e2f5f5 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 22,
              background: "linear-gradient(135deg, #6965DB, #55BFC0)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 52, fontWeight: 800, color: "#292B38", letterSpacing: -1 }}>
              L+IA
            </div>
            <div style={{ fontSize: 22, color: "#6965DB", fontWeight: 700 }}>
              Lectura + Inteligencia Artificial
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 66, fontWeight: 800, color: "#292B38", lineHeight: 1.1 }}>
            Comprende. Practica. Avanza.
          </div>
          <div style={{ fontSize: 28, color: "#4b4f60", maxWidth: 940, lineHeight: 1.35 }}>
            Comprensión lectora alineada al Currículum Nacional de Chile, con textos y preguntas
            personalizados por nivel.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["2º básico", "4º básico", "6º básico", "8º básico", "2º medio"].map((n) => (
            <div
              key={n}
              style={{
                fontSize: 22,
                color: "#6965DB",
                background: "#ffffff",
                borderRadius: 999,
                padding: "10px 24px",
                fontWeight: 700,
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
