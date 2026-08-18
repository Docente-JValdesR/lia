"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import AvisoIA from "@/components/AvisoIA";
import BotonGuiaDocentePDF from "@/components/BotonGuiaDocentePDF";
import ChatLIA from "@/components/chat/ChatLIA";
import ProgresoGeneracion from "@/components/chat/ProgresoGeneracion";
import PropuestaFueraRango from "@/components/chat/PropuestaFueraRango";
import ConfigPanel from "@/components/ConfigPanel";
import LecturaView from "@/components/LecturaView";
import Quiz from "@/components/Quiz";
import Resultados from "@/components/Resultados";
import { useVoz } from "@/components/voz/VozProvider";
import { CONFIG_DEFAULT, getExtension } from "@/data/curriculum";
import { confirmarActividad, generarConProgreso } from "@/lib/generarConProgreso";
import { aleatorizarActividad } from "@/lib/aleatorizarActividad";

const PASOS = [
  { id: "config", label: "Configurar" },
  { id: "lectura", label: "Leer" },
  { id: "preguntas", label: "Responder" },
  { id: "resultados", label: "Avanzar" },
];

export default function PaginaPractica() {
  return (
    <Suspense fallback={null}>
      <AplicacionLectura />
    </Suspense>
  );
}

function AplicacionLectura() {
  const { soportada, activa, setActiva, nombreVoz } = useVoz();
  const [modo, setModo] = useState("conversacion");
  const idSolicitado = useSearchParams().get("texto");

  const [paso, setPaso] = useState("config");
  const [config, setConfig] = useState(CONFIG_DEFAULT);
  const [lectura, setLectura] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [metricas, setMetricas] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [pasosGeneracion, setPasosGeneracion] = useState([]);
  const [error, setError] = useState(null);
  const [propuesta, setPropuesta] = useState(null);
  const lecturaInicioRef = useRef(null);

  useEffect(() => {
    if (modo !== "docente" || paso !== "lectura" || !lectura) return;
    const temporizador = requestAnimationFrame(() => {
      lecturaInicioRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    });
    return () => cancelAnimationFrame(temporizador);
  }, [modo, paso, lectura]);

  // Abre directamente un texto de la biblioteca, sin pasar por la configuración.
  useEffect(() => {
    if (!idSolicitado) return;
    setModo("docente");
    setCargando(true);
    fetch(`/api/textos/${idSolicitado}`)
      .then((r) => r.json())
      .then((datos) => {
        if (datos.error) throw new Error(datos.error);
        setLectura(aleatorizarActividad(datos));
        setRespuestas({});
        setMetricas(null);
        setPaso("lectura");
      })
      .catch((e) => setError(`No se pudo abrir el texto: ${e.message}`))
      .finally(() => setCargando(false));
  }, [idSolicitado]);

  const generar = async () => {
    setCargando(true);
    setError(null);
    setPropuesta(null);
    setPasosGeneracion([{ tipo: "preparando", estado: "activo" }]);

    const anotar = (evento) =>
      setPasosGeneracion((previos) => {
        const cerrados = previos.map((p) =>
          p.estado === "activo"
            ? { ...p, estado: evento.tipo === "rechazado" ? "fallido" : "hecho" }
            : p
        );
        if (["listo", "sin_disponibilidad"].includes(evento.tipo)) return cerrados;
        return [...cerrados, { ...evento, estado: "activo" }];
      });

    const final = await generarConProgreso(config, { onPaso: anotar });
    setPasosGeneracion([]);
    setCargando(false);

    if (final.tipo === "error") {
      setError(
        `${final.titulo ?? "No disponible"}: ${final.mensaje ?? "Inténtalo nuevamente."}`
      );
      return;
    }

    if (final.propuestaFueraRango) {
      setPropuesta(final);
      return;
    }

    if (final.aviso) setError(final.aviso);
    setLectura(aleatorizarActividad(final.texto));
    setRespuestas({});
    setMetricas(null);
    setPaso("lectura");
  };

  const pasoActual = PASOS.findIndex((p) => p.id === paso);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Practicar con L+IA</h1>
          <p className="text-sm text-ink-soft">
            {modo === "conversacion"
              ? "Conversa con L+IA: te guía paso a paso desde la configuración hasta el cierre."
              : "Panel completo para preparar y diagnosticar actividades de lectura."}
          </p>
        </div>

        <div className="flex flex-col items-start gap-1 sm:items-end">
          <div className="flex flex-wrap items-center gap-2">
            {soportada && (
              <button
                type="button"
                onClick={() => setActiva(!activa)}
                title={nombreVoz ? `Voz: ${nombreVoz}` : undefined}
                className={`h-9 rounded-full border px-3.5 text-xs font-semibold transition ${
                  activa
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-surface text-ink-soft hover:border-brand hover:text-brand"
                }`}
              >
                🔊 {activa ? "Voz activada" : "Activar voz"}
              </button>
            )}
            <div className="flex h-9 items-center rounded-full border border-line bg-surface p-1">
              {[
                { id: "conversacion", label: "Conversación" },
                { id: "docente", label: "Modo docente" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModo(m.id)}
                  className={`h-7 rounded-full px-4 text-xs font-semibold transition ${
                    modo === m.id ? "bg-brand text-white" : "text-ink-soft hover:text-brand"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <span className="h-4 max-w-[18rem] truncate text-[10px] text-ink-soft">
            {activa && nombreVoz ? `Voz: ${nombreVoz}` : ""}
          </span>
        </div>
      </div>

      {modo === "conversacion" ? (
        <>
          <AvisoIA variante="compacto" className="mb-5" />
          <ChatLIA />
        </>
      ) : (
        <>
          <AvisoIA variante="compacto" className="mb-5" />
          <nav className="mb-6 flex flex-wrap items-center gap-1.5">
            {PASOS.map((p, i) => (
              <span
                key={p.id}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  i === pasoActual
                    ? "bg-brand-soft text-brand"
                    : i < pasoActual
                      ? "text-teal"
                      : "text-ink-soft"
                }`}
              >
                {i + 1}. {p.label}
              </span>
            ))}
          </nav>

          {error && (
            <div className="mb-5 rounded-2xl border border-accent bg-accent-soft px-4 py-3 text-sm text-ink">
              {error}
            </div>
          )}

          {paso === "config" && (
            <>
              {propuesta && (
                <div className="mb-5">
                  <PropuestaFueraRango
                    propuesta={propuesta}
                    config={config}
                    cargando={cargando}
                    onReintentar={() => setPropuesta(null)}
                    onAceptar={async () => {
                      setCargando(true);
                      try {
                        const texto = await confirmarActividad(config, propuesta);
                        setLectura(aleatorizarActividad(texto));
                        setPropuesta(null);
                        setPaso("lectura");
                      } catch (e) {
                        setError(e.message);
                      } finally {
                        setCargando(false);
                      }
                    }}
                  />
                </div>
              )}
              {cargando && (
                <div className="mb-5">
                  <ProgresoGeneracion
                    pasos={pasosGeneracion}
                    extension={getExtension(config.nivel, config.dificultad)}
                  />
                </div>
              )}
              <ConfigPanel
                config={config}
                onChange={setConfig}
                onGenerar={generar}
                cargando={cargando}
              />
            </>
          )}

          {paso === "lectura" && lectura && (
            <div ref={lecturaInicioRef} className="space-y-4 scroll-mt-6">
              <LecturaView
                lectura={lectura}
                acciones={<BotonGuiaDocentePDF lectura={lectura} />}
                onTerminar={(m) => {
                  setMetricas(m);
                  setPaso("preguntas");
                }}
                onVolver={() => setPaso("config")}
              />
            </div>
          )}

          {paso === "preguntas" && lectura && (
            <Quiz
              lectura={lectura}
              onReleer={() => setPaso("lectura")}
              onFinalizar={(nuevasRespuestas) => {
                setRespuestas(nuevasRespuestas);
                setPaso("resultados");
              }}
            />
          )}

          {paso === "resultados" && lectura && (
            <Resultados
              lectura={lectura}
              respuestas={respuestas}
              metricas={metricas}
              onReintentar={() => {
                setRespuestas({});
                setPaso("lectura");
              }}
              onNueva={() => setPaso("config")}
            />
          )}
        </>
      )}
    </div>
  );
}
