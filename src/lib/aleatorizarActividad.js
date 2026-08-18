function numeroAleatorio(maximo) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const valores = new Uint32Array(1);
    crypto.getRandomValues(valores);
    return valores[0] / (0xffffffff + 1) * maximo;
  }
  return Math.random() * maximo;
}

function mezclar(elementos) {
  const resultado = [...elementos];
  for (let i = resultado.length - 1; i > 0; i -= 1) {
    const j = Math.floor(numeroAleatorio(i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}

export function aleatorizarActividad(lectura) {
  if (!lectura?.preguntas?.length) return lectura;

  return {
    ...lectura,
    preguntas: mezclar(lectura.preguntas).map((pregunta) => {
      const alternativas = pregunta.alternativas.map((texto, indice) => ({
        texto,
        esCorrecta: indice === pregunta.correcta,
      }));
      const mezcladas = mezclar(alternativas);

      return {
        ...pregunta,
        alternativas: mezcladas.map((alternativa) => alternativa.texto),
        correcta: mezcladas.findIndex((alternativa) => alternativa.esCorrecta),
      };
    }),
  };
}