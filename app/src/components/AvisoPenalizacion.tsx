/**
 * Recordatorio de estrategia de examen.
 *
 * Bases generales TRBGTL, base 7.4.C.1: en los dos ejercicios cada respuesta
 * errónea descuenta 1/4 del valor de un acierto y las respuestas en blanco no
 * penalizan. Con esa fórmula, responder siempre tiene valor esperado positivo:
 *   - primer ejercicio (3 opciones):  1/3 - (2/3 x 1/4) = +1/6 de acierto
 *   - segundo ejercicio (4 opciones): 1/4 - (3/4 x 1/4) = +1/16 de acierto
 * Y si descartas una opción, la ventaja sube bastante. Nunca compensa el blanco.
 */
export default function AvisoPenalizacion({ breve = false }: { breve?: boolean }) {
  if (breve) {
    return (
      <p className="aviso-penalizacion">
        Cada fallo resta <b>1/4</b> de acierto y el blanco no penaliza: aun así{' '}
        <b>siempre compensa contestar</b>.
      </p>
    )
  }

  return (
    <div className="tarjeta aviso-penalizacion-caja">
      <b>Estrategia de examen: nunca dejes preguntas en blanco.</b>
      <p style={{ margin: '0.4rem 0 0' }}>
        En los dos ejercicios cada respuesta errónea descuenta <b>1/4</b> del valor de un acierto y
        las respuestas en blanco no penalizan. Aun así, responder al azar tiene valor esperado
        positivo: <b>+1/6</b> de acierto con 3 opciones y <b>+1/16</b> con 4. Si además descartas
        una opción, la ventaja crece. Dejar una pregunta en blanco solo garantiza no sumar.
      </p>
      <p className="contador" style={{ margin: '0.4rem 0 0' }}>
        Bases generales del Ayuntamiento de Zaragoza (TRBGTL), base 7.4.C.1.
      </p>
    </div>
  )
}
