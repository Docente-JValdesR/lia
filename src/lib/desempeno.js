import { EJES, getHabilidad, getNivel } from "@/data/curriculum";

export function calcularDesempeno(lectura, respuestas) {
  const preguntas = lectura.preguntas;
  const correctas = preguntas.filter((p) => respuestas[p.id] === p.correcta).length;

  const porEje = EJES.map((eje) => {
    const delEje = preguntas.filter(
      (p) => getHabilidad(lectura.nivel, p.habilidad)?.eje === eje.id
    );
    return {
      ...eje,
      total: delEje.length,
      aciertos: delEje.filter((p) => respuestas[p.id] === p.correcta).length,
    };
  }).filter((e) => e.total > 0);

  const porOA = getNivel(lectura.nivel)
    .oa.map((oa) => {
      const delOA = preguntas.filter(
        (p) => getHabilidad(lectura.nivel, p.habilidad)?.oa === oa.codigo
      );
      return {
        codigo: oa.codigo,
        dominio: oa.dominio,
        total: delOA.length,
        aciertos: delOA.filter((p) => respuestas[p.id] === p.correcta).length,
      };
    })
    .filter((o) => o.total > 0);

  return {
    correctas,
    total: preguntas.length,
    porcentaje: Math.round((correctas / preguntas.length) * 100),
    porEje,
    porOA,
  };
}
