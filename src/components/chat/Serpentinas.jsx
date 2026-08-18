"use client";

import { useEffect, useState } from "react";

const COLORES = ["var(--brand)", "var(--teal)", "var(--accent)", "#F472B6", "#60A5FA"];

// Valores derivados del índice para que servidor y cliente rendericen lo mismo.
function pieza(i, total) {
  const base = Math.sin(i * 12.9898) * 43758.5453;
  const azar = base - Math.floor(base);
  return {
    izquierda: `${(i / total) * 100 + azar * 4}%`,
    color: COLORES[i % COLORES.length],
    ancho: 6 + Math.round(azar * 6),
    alto: 10 + Math.round(azar * 8),
    desvio: `${Math.round((azar - 0.5) * 220)}px`,
    giro: `${Math.round(360 + azar * 720)}deg`,
    duracion: `${(2.8 + azar * 1.8).toFixed(2)}s`,
    retraso: `${(azar * 1.2).toFixed(2)}s`,
    redondo: i % 3 === 0,
  };
}

export default function Serpentinas({ cantidad = 70, duracionMs = 5200 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), duracionMs);
    return () => clearTimeout(t);
  }, [duracionMs]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: cantidad }, (_, i) => {
        const p = pieza(i, cantidad);
        return (
          <span
            key={i}
            className="lia-serpentina"
            style={{
              left: p.izquierda,
              width: `${p.ancho}px`,
              height: `${p.alto}px`,
              backgroundColor: p.color,
              borderRadius: p.redondo ? "9999px" : "2px",
              "--desvio": p.desvio,
              "--giro": p.giro,
              "--duracion": p.duracion,
              "--retraso": p.retraso,
            }}
          />
        );
      })}
    </div>
  );
}
