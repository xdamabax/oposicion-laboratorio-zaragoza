import { useState } from 'react'
import Markdown from './Markdown'
import { registrarPregunta } from '../lib/progreso'
import type { PreguntaTest } from '../types'

const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f']

export default function Test({ preguntas }: { preguntas: PreguntaTest[] }) {
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState<number | null>(null)
  const [aciertos, setAciertos] = useState(0)
  const [fin, setFin] = useState(false)

  if (preguntas.length === 0) {
    return (
      <p className="vacio">
        Todavia no hay preguntas para este tema. Se generan a partir del apunte una vez aprobado.
      </p>
    )
  }

  if (fin) {
    const pct = Math.round((aciertos / preguntas.length) * 100)
    return (
      <div className="tarjeta" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.2rem' }}>
          {aciertos} / {preguntas.length}
        </p>
        <p className="contador" style={{ marginTop: 0 }}>
          {pct}% de aciertos
        </p>
        <div className="botones" style={{ justifyContent: 'center', marginTop: '1rem' }}>
          <button
            className="btn btn-pri"
            onClick={() => {
              setI(0)
              setElegida(null)
              setAciertos(0)
              setFin(false)
            }}
          >
            Repetir el test
          </button>
        </div>
      </div>
    )
  }

  const p = preguntas[i]
  const respondida = elegida !== null

  function elegir(indice: number) {
    if (respondida) return
    const acierto = indice === p.correcta
    setElegida(indice)
    if (acierto) setAciertos((n) => n + 1)
    registrarPregunta(p.id, acierto)
  }

  function siguiente() {
    if (i + 1 >= preguntas.length) {
      setFin(true)
    } else {
      setI(i + 1)
      setElegida(null)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '0.75rem' }}>
        <span className="contador">
          Pregunta {i + 1} de {preguntas.length}
        </span>
        <div className="barra" style={{ marginTop: '0.35rem' }}>
          <i style={{ width: `${((i + (respondida ? 1 : 0)) / preguntas.length) * 100}%` }} />
        </div>
      </div>

      <div className="tarjeta">
        <div style={{ fontWeight: 600 }}>
          <Markdown>{p.pregunta}</Markdown>
        </div>

        <ul className="opciones">
          {p.opciones.map((texto, n) => {
            let clase = 'opcion'
            if (respondida && n === p.correcta) clase += ' opcion-ok'
            else if (respondida && n === elegida) clase += ' opcion-bad'

            return (
              <li key={n}>
                <button className={clase} onClick={() => elegir(n)} disabled={respondida}>
                  <b>{LETRAS[n]})</b>
                  <span>{texto}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {respondida && (
          <div className="explica">
            <b>{elegida === p.correcta ? 'Correcto.' : 'Incorrecto.'}</b>{' '}
            {p.explicacion && <span>{p.explicacion}</span>}
            {p.fuente && (
              <p className="flash-pista" style={{ margin: '0.5rem 0 0' }}>
                Fuente: {p.fuente}
              </p>
            )}
          </div>
        )}

        {respondida && (
          <div className="botones" style={{ marginTop: '1rem' }}>
            <button className="btn btn-pri" onClick={siguiente}>
              {i + 1 >= preguntas.length ? 'Ver resultado' : 'Siguiente'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
