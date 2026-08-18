"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const CLAVE = "lia.voz";
const VozContext = createContext(null);

// Nombres habituales de voces en Windows, Chrome, Android y macOS.
const FEMENINAS = [
  "catalina",
  "dalia",
  "sabina",
  "paulina",
  "ximena",
  "paloma",
  "isabela",
  "salome",
  "camila",
  "elena",
  "helena",
  "laura",
  "lupe",
  "mónica",
  "monica",
  "esperanza",
  "tereza",
  "female",
  "mujer",
];
const MASCULINAS = [
  "jorge",
  "pablo",
  "raúl",
  "raul",
  "diego",
  "juan",
  "álvaro",
  "alvaro",
  "miguel",
  "carlos",
  "gonzalo",
  "lorenzo",
  "liam",
  "male",
  "hombre",
];
// Chile primero, luego el resto de Latinoamérica; España queda como última opción.
const PRIORIDAD_LOCAL = ["es-cl", "es-419", "es-mx", "es-us", "es-co", "es-pe", "es-ar"];

function puntuarVoz(voz) {
  const nombre = (voz.name ?? "").toLowerCase();
  const lang = (voz.lang ?? "").toLowerCase().replace("_", "-");
  if (!lang.startsWith("es")) return -1;

  let puntaje = 0;
  const indiceLocal = PRIORIDAD_LOCAL.indexOf(lang);
  if (indiceLocal >= 0) puntaje += 60 - indiceLocal * 5;
  else if (lang === "es-es") puntaje += 5;
  else puntaje += 20;

  if (FEMENINAS.some((f) => nombre.includes(f))) puntaje += 50;
  if (MASCULINAS.some((m) => nombre.includes(m))) puntaje -= 60;
  if (nombre.includes("natural") || nombre.includes("online")) puntaje += 15;
  if (nombre.includes("google")) puntaje += 10;

  return puntaje;
}

function elegirVoz(voces) {
  const candidatas = voces
    .map((voz) => ({ voz, puntaje: puntuarVoz(voz) }))
    .filter((c) => c.puntaje >= 0)
    .sort((a, b) => b.puntaje - a.puntaje);
  return candidatas[0]?.voz ?? null;
}

export function VozProvider({ children }) {
  const [soportada, setSoportada] = useState(false);
  const [activa, setActivaEstado] = useState(false);
  const [hablandoId, setHablandoId] = useState(null);
  const [nombreVoz, setNombreVoz] = useState(null);
  const vozRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSoportada(true);
    setActivaEstado(localStorage.getItem(CLAVE) === "1");

    const cargarVoz = () => {
      const elegida = elegirVoz(window.speechSynthesis.getVoices());
      vozRef.current = elegida;
      setNombreVoz(elegida?.name ?? null);
    };
    cargarVoz();
    window.speechSynthesis.addEventListener("voiceschanged", cargarVoz);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", cargarVoz);
      window.speechSynthesis.cancel();
    };
  }, []);

  const detener = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setHablandoId(null);
  }, []);

  const crearEnunciado = useCallback((id, texto) => {
    const enunciado = new SpeechSynthesisUtterance(texto);
    enunciado.lang = vozRef.current?.lang ?? "es-CL";
    if (vozRef.current) enunciado.voice = vozRef.current;
    enunciado.rate = 0.95;
    enunciado.pitch = 1.1;
    enunciado.onstart = () => setHablandoId(id);
    enunciado.onend = () => {
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
        setHablandoId(null);
      }
    };
    enunciado.onerror = () => setHablandoId(null);
    return enunciado;
  }, []);

  const hablar = useCallback(
    (id, texto) => {
      if (!texto || typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const enunciado = crearEnunciado(id, texto);
      setHablandoId(id);
      window.speechSynthesis.speak(enunciado);
    },
    [crearEnunciado]
  );

  const encolar = useCallback(
    (id, texto) => {
      if (!texto || typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.speak(crearEnunciado(id, texto));
    },
    [crearEnunciado]
  );

  const alternar = useCallback(
    (id, texto) => (hablandoId === id ? detener() : hablar(id, texto)),
    [detener, hablar, hablandoId]
  );

  // Si el navegador no emite onend (por ejemplo al bloquear el audio), libera igual el estado.
  useEffect(() => {
    if (!hablandoId) return;
    const intervalo = setInterval(() => {
      const sintesis = window.speechSynthesis;
      if (!sintesis.speaking && !sintesis.pending) setHablandoId(null);
    }, 400);
    return () => clearInterval(intervalo);
  }, [hablandoId]);

  const setActiva = useCallback(
    (valor) => {
      setActivaEstado(valor);
      localStorage.setItem(CLAVE, valor ? "1" : "0");
      if (!valor) detener();
    },
    [detener]
  );

  return (
    <VozContext.Provider
      value={{ soportada, activa, setActiva, hablar, encolar, detener, alternar, hablandoId, nombreVoz }}
    >
      {children}
    </VozContext.Provider>
  );
}

export function useVoz() {
  const ctx = useContext(VozContext);
  if (!ctx) throw new Error("useVoz debe usarse dentro de VozProvider");
  return ctx;
}
