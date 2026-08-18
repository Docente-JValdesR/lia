"use client";

import { useEffect, useRef, useState } from "react";
import { BurbujaLIA, BurbujaUsuario } from "@/components/chat/Burbuja";
import CierreActividad from "@/components/chat/CierreActividad";
import LecturaView from "@/components/LecturaView";
import Resultados from "@/components/Resultados";
import BotonEscuchar from "@/components/voz/BotonEscuchar";
import { useVoz } from "@/components/voz/VozProvider";
import {
  CONFIG_DEFAULT,
  DIFICULTADES,
  EJES,
  getExtension,
  getHabilidad,
  getNivel,
  getUnidad,
  habilidadesPorDefecto,
  NIVELES,
  TIPOS_TEXTO,
} from "@/data/curriculum";
import { calcularDesempeno } from "@/lib/desempeno";
import {
  anuncioLectura,
  AVISO_IA,
  CIERRE_PREGUNTAS,
  comentarioFluidez,
  confirmacionNivel,
  DESPEDIDA,
  PREPARANDO,
  PREGUNTA_HABILIDADES_MANUAL,
  PREGUNTA_NIVEL,
  PREGUNTA_VOZ,
  preguntaCantidad,
  preguntaExtension,
  preguntaTipoTexto,
  preguntaUnidad,
  presentacionPregunta,
  propuestaHabilidades,
  resumenConfiguracion,
  SALUDO,
} from "@/lib/guion";

const CANTIDADES = [3, 5, 8, 10];
const nuevoId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Math.random());

const claseChip =
  "rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand hover:bg-brand-soft hover:text-brand";

export default function ChatLIA() {
  const { soportada, activa, setActiva, hablar } = useVoz();

  const [mensajes, setMensajes] = useState([]);
  const [cola, setCola] = useState([...SALUDO]);
  const [escribiendo, setEscribiendo] = useState(true);
  const [paso, setPaso] = useState("inicio");
  const [config, setConfig] = useState({ ...CONFIG_DEFAULT, nivel: null, unidad: null });
  const [seleccionHabilidades, setSeleccionHabilidades] = useState([]);
  const [lectura, setLectura] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [metricas, setMetricas] = useState(null);
  const [indice, setIndice] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [verInforme, setVerInforme] = useState(false);

  const finRef = useRef(null);
  const ultimoLeidoRef = useRef(null);

  // Muestra los mensajes de L+IA uno a uno para simular la conversación.
  useEffect(() => {
    if (!cola.length) {
      setEscribiendo(false);
      return;
    }
    setEscribiendo(true);
    const temporizador = setTimeout(() => {
      const [primero, ...resto] = cola;
      setMensajes((m) => [...m, { id: nuevoId(), de: "lia", texto: primero }]);
      setCola(resto);
    }, 520);
    return () => clearTimeout(temporizador);
  }, [cola]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensajes, escribiendo, paso]);

  // El soporte de voz se conoce recién tras montar, así que el primer paso se decide al terminar el saludo.
  useEffect(() => {
    if (paso !== "inicio" || cola.length || escribiendo) return;
    setCola([soportada ? PREGUNTA_VOZ : PREGUNTA_NIVEL]);
    setPaso(soportada ? "voz" : "nivel");
  }, [paso, cola.length, escribiendo, soportada]);

  useEffect(() => {
    if (!activa) return;
    const ultimo = mensajes[mensajes.length - 1];
    if (!ultimo || ultimo.de !== "lia" || ultimo.id === ultimoLeidoRef.current) return;
    ultimoLeidoRef.current = ultimo.id;
    hablar(ultimo.id, ultimo.texto);
  }, [mensajes, activa, hablar]);

  const decir = (...textos) => setCola((c) => [...c, ...textos.filter(Boolean)]);
  const responder = (texto) =>
    setMensajes((m) => [...m, { id: nuevoId(), de: "usuario", texto }]);

  const elegirVoz = (quiere) => {
    responder(quiere ? "Sí, léeme" : "No, gracias");
    setActiva(quiere);
    decir(
      quiere
        ? "Perfecto, te iré leyendo cada mensaje. Puedes cambiarlo cuando quieras."
        : "Sin problema. Si lo necesitas, cada mensaje tiene un botón para escucharlo.",
      PREGUNTA_NIVEL
    );
    setPaso("nivel");
  };

  const elegirNivel = (nivelId) => {
    const nivel = getNivel(nivelId);
    responder(nivel.label);
    setConfig((c) => ({
      ...c,
      nivel: nivelId,
      unidad: null,
      habilidades: habilidadesPorDefecto(nivelId),
    }));
    decir(confirmacionNivel(nivelId), preguntaUnidad(nivelId));
    setPaso("unidad");
  };

  const elegirUnidad = (unidadId) => {
    const unidad = getUnidad(config.nivel, unidadId);
    responder(unidad.titulo);
    setConfig((c) => ({ ...c, unidad: unidadId }));
    decir(preguntaTipoTexto(config.nivel));
    setPaso("tipoTexto");
  };

  const elegirTipoTexto = (tipoId) => {
    responder(TIPOS_TEXTO.find((t) => t.id === tipoId)?.label ?? tipoId);
    setConfig((c) => ({ ...c, tipoTexto: tipoId }));
    decir(preguntaExtension(config.nivel));
    setPaso("dificultad");
  };

  const elegirDificultad = (dificultadId) => {
    const etiqueta = DIFICULTADES.find((d) => d.id === dificultadId)?.label;
    responder(etiqueta);
    setConfig((c) => ({ ...c, dificultad: dificultadId }));
    decir(preguntaCantidad(config.nivel));
    setPaso("cantidad");
  };

  const elegirCantidad = (cantidad) => {
    responder(`${cantidad} preguntas`);
    setConfig((c) => ({ ...c, cantidadPreguntas: cantidad }));
    const etiquetas = config.habilidades
      .map((h) => getHabilidad(config.nivel, h)?.label)
      .filter(Boolean);
    decir(propuestaHabilidades(config.nivel, etiquetas));
    setPaso("habilidades");
  };

  const confirmarHabilidades = (mantener) => {
    if (!mantener) {
      responder("Quiero elegirlas");
      setSeleccionHabilidades(config.habilidades);
      decir(PREGUNTA_HABILIDADES_MANUAL);
      setPaso("habilidades_manual");
      return;
    }
    responder("Sí, así está bien");
    mostrarResumen(config.habilidades);
  };

  const guardarHabilidadesManuales = () => {
    const etiquetas = seleccionHabilidades
      .map((h) => getHabilidad(config.nivel, h)?.label)
      .filter(Boolean);
    responder(etiquetas.join(", "));
    setConfig((c) => ({ ...c, habilidades: seleccionHabilidades }));
    mostrarResumen(seleccionHabilidades);
  };

  const mostrarResumen = () => {
    const extension = getExtension(config.nivel, config.dificultad);
    decir(
      resumenConfiguracion({
        nivel: getNivel(config.nivel).label,
        unidad: getUnidad(config.nivel, config.unidad).titulo,
        tipoTexto: TIPOS_TEXTO.find((t) => t.id === config.tipoTexto)?.label ?? "",
        extension,
        cantidad: config.cantidadPreguntas,
      }),
      "¿Comenzamos?"
    );
    setPaso("confirmar");
  };

  const comenzar = async () => {
    responder("¡Comencemos!");
    setPaso("generando");
    decir(PREPARANDO[0]);

    try {
      const res = await fetch("/api/actividad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const cuerpo = await res.json();

      if (!res.ok) {
        decir(cuerpo.mensaje ?? "No pude preparar tu actividad ahora.", cuerpo.sugerencia);
        setPaso("confirmar");
        return;
      }

      setLectura(cuerpo.texto);
      decir(cuerpo.aviso, AVISO_IA, anuncioLectura(cuerpo.texto.nivel));
      setPaso("lectura");
    } catch {
      decir(
        "Tuve un problema de conexión y no pude preparar tu actividad.",
        "Revisa tu conexión e inténtalo otra vez en unos minutos."
      );
      setPaso("confirmar");
    }
  };

  const terminarLectura = (m) => {
    setMetricas(m);
    responder("Terminé de leer");
    decir(
      comentarioFluidez(lectura.nivel, m.ppm),
      presentacionPregunta(lectura.nivel, 1, lectura.preguntas.length),
      lectura.preguntas[0].enunciado
    );
    setIndice(0);
    setPaso("preguntas");
  };

  const responderPregunta = (opcion) => {
    const pregunta = lectura.preguntas[indice];
    const nuevasRespuestas = { ...respuestas, [pregunta.id]: opcion };

    responder(pregunta.alternativas[opcion]);
    setRespuestas(nuevasRespuestas);

    const siguiente = indice + 1;
    // La retroalimentación se reserva para el cierre y el informe, para no condicionar las respuestas siguientes.
    if (siguiente < lectura.preguntas.length) {
      decir(
        presentacionPregunta(lectura.nivel, siguiente + 1, lectura.preguntas.length),
        lectura.preguntas[siguiente].enunciado
      );
      setIndice(siguiente);
      return;
    }

    const desempeno = calcularDesempeno(lectura, nuevasRespuestas);
    const ordenados = [...desempeno.porEje].sort(
      (a, b) => a.aciertos / a.total - b.aciertos / b.total
    );
    const bajo = ordenados[0];

    setResultado({
      correctas: desempeno.correctas,
      total: desempeno.total,
      porcentaje: desempeno.porcentaje,
      ejeBajo: bajo && bajo.aciertos / bajo.total < 1 ? bajo : null,
    });

    decir(CIERRE_PREGUNTAS, DESPEDIDA);
    setPaso("cierre");
  };

  const reiniciar = () => {
    setMensajes([]);
    setCola([...SALUDO, PREGUNTA_NIVEL]);
    setConfig({ ...CONFIG_DEFAULT, nivel: null, unidad: null });
    setLectura(null);
    setRespuestas({});
    setMetricas(null);
    setIndice(0);
    setResultado(null);
    setVerInforme(false);
    setPaso("nivel");
  };

  const listo = !escribiendo && !cola.length;

  return (
    <div className="rounded-3xl border border-line bg-surface-2 p-4 sm:p-6">
      <div className="space-y-4">
        {mensajes.map((m) =>
          m.de === "lia" ? (
            <BurbujaLIA key={m.id} id={m.id} texto={m.texto} />
          ) : (
            <BurbujaUsuario key={m.id} texto={m.texto} />
          )
        )}
        {escribiendo && <BurbujaLIA id="escribiendo" escribiendo />}

        {listo && (
          <div className="pl-12">
            {paso === "voz" && (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => elegirVoz(true)} className={claseChip}>
                  🔊 Sí, léeme
                </button>
                <button type="button" onClick={() => elegirVoz(false)} className={claseChip}>
                  No, gracias
                </button>
              </div>
            )}

            {paso === "nivel" && (
              <div className="flex flex-wrap gap-2">
                {NIVELES.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => elegirNivel(n.id)}
                    className={claseChip}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            )}

            {paso === "unidad" && (
              <div className="grid gap-2 sm:grid-cols-2">
                {getNivel(config.nivel).unidades.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => elegirUnidad(u.id)}
                    className="rounded-2xl border border-line bg-surface p-4 text-left transition hover:border-brand"
                  >
                    <span className="block text-sm font-bold text-ink">{u.titulo}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink-soft">
                      {u.foco}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {paso === "tipoTexto" && (
              <div className="grid gap-2 sm:grid-cols-2">
                {TIPOS_TEXTO.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => elegirTipoTexto(t.id)}
                    className="rounded-2xl border border-line bg-surface p-4 text-left transition hover:border-brand"
                  >
                    <span className="block text-sm font-bold text-ink">{t.label}</span>
                    <span className="mt-1 block text-xs text-ink-soft">{t.detalle}</span>
                  </button>
                ))}
              </div>
            )}

            {paso === "dificultad" && (
              <div className="flex flex-wrap gap-2">
                {DIFICULTADES.map((d) => {
                  const rango = getExtension(config.nivel, d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => elegirDificultad(d.id)}
                      className={claseChip}
                    >
                      {d.label}{" "}
                      <span className="font-normal text-ink-soft">
                        ({rango.min}-{rango.max} palabras)
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {paso === "cantidad" && (
              <div className="flex flex-wrap gap-2">
                {CANTIDADES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => elegirCantidad(c)}
                    className={claseChip}
                  >
                    {c} preguntas
                  </button>
                ))}
              </div>
            )}

            {paso === "habilidades" && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => confirmarHabilidades(true)}
                  className={claseChip}
                >
                  Sí, así está bien
                </button>
                <button
                  type="button"
                  onClick={() => confirmarHabilidades(false)}
                  className={claseChip}
                >
                  Quiero elegirlas
                </button>
              </div>
            )}

            {paso === "habilidades_manual" && (
              <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
                {EJES.map((eje) => {
                  const delEje = getNivel(config.nivel).habilidades.filter(
                    (h) => h.eje === eje.id
                  );
                  if (!delEje.length) return null;
                  return (
                    <div key={eje.id}>
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                        {eje.label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {delEje.map((h) => {
                          const activaHab = seleccionHabilidades.includes(h.id);
                          return (
                            <button
                              key={h.id}
                              type="button"
                              onClick={() =>
                                setSeleccionHabilidades((s) =>
                                  s.includes(h.id) ? s.filter((x) => x !== h.id) : [...s, h.id]
                                )
                              }
                              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                activaHab
                                  ? "border-teal bg-teal-soft text-ink"
                                  : "border-line bg-surface-2 text-ink-soft hover:border-brand"
                              }`}
                            >
                              {h.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={guardarHabilidadesManuales}
                  disabled={!seleccionHabilidades.length}
                  className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            )}

            {paso === "confirmar" && (
              <button
                type="button"
                onClick={comenzar}
                className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover"
              >
                {lectura ? "Intentar de nuevo" : "¡Comencemos!"}
              </button>
            )}

            {paso === "lectura" && lectura && (
              <LecturaView lectura={lectura} onTerminar={terminarLectura} />
            )}

            {paso === "preguntas" && lectura && (
              <div className="flex flex-col gap-2">
                {lectura.preguntas[indice].alternativas.map((alt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => responderPregunta(i)}
                      className="flex flex-1 items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-left text-sm text-ink transition hover:border-brand hover:bg-brand-soft"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-ink-soft">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{alt}</span>
                    </button>
                    <BotonEscuchar
                      id={`alt-${lectura.preguntas[indice].id}-${i}`}
                      texto={`Alternativa ${String.fromCharCode(65 + i)}. ${alt}`}
                    />
                  </div>
                ))}
              </div>
            )}

            {paso === "cierre" && resultado && (
              <CierreActividad nivelId={lectura.nivel} resultado={resultado} lectura={lectura}>
                <button
                  type="button"
                  onClick={() => setVerInforme((v) => !v)}
                  className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
                >
                  {verInforme ? "Ocultar informe" : "Ver informe completo"}
                </button>
                <button type="button" onClick={reiniciar} className={claseChip}>
                  Nueva actividad
                </button>
              </CierreActividad>
            )}
          </div>
        )}

        {paso === "generando" && (
          <p className="pl-12 text-xs text-ink-soft">
            Preparando tu actividad... esto puede tardar unos segundos.
          </p>
        )}

        <div ref={finRef} />
      </div>

      {verInforme && lectura && (
        <div className="mt-6 border-t border-line pt-6">
          <Resultados
            lectura={lectura}
            respuestas={respuestas}
            metricas={metricas}
            onReintentar={reiniciar}
            onNueva={reiniciar}
          />
        </div>
      )}
    </div>
  );
}
