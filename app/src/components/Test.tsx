import { useMemo, useState } from 'react'
import Markdown from './Markdown'
import Figura from './figuras/Figura'
import AvisoPenalizacion from './AvisoPenalizacion'
import { registrarPregunta } from '../lib/progreso'
import type { PreguntaTest } from '../types'

const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f']

export default function Test({
  preguntas,
  vacio = 'Todavía no hay preguntas para este tema. Se generan a partir del apunte una vez aprobado.',
}: {
  preguntas: PreguntaTest[]
  vacio?: string
}) {
  const [soloNucleo, setSoloNucleo] = useState(false)
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState<number | null>(null)
  const [aciertos, setAciertos] = useState(0)
  const [fin, setFin] = useState(false)

  const hayNucleo = useMemo(() => preguntas.some((p) => p.nucleo), [preguntas])
  const activas = useMemo(
    () => (soloNucleo ? preguntas.filter((p) => p.nucleo) : preguntas),
    [preguntas, soloNucleo],
  )

  function reiniciar(nucleo = soloNucleo) {
    setSoloNucleo(nucleo)
    setI(0)
    setElegida(null)
    setAciertos(0)
    setFin(false)
  }

  if (preguntas.length === 0) return <p className="vacio">{vacio}</p>

  const filtro = hayNucleo && (
    <div className="botones" style={{ marginBottom: '0.75rem' }}>
      <button className={soloNucleo ? 'btn' : 'btn btn-pri'} onClick={() => reiniciar(false)}>
        Todas ({preguntas.length})
      </button>
      <button className={soloNucleo ? 'btn btn-pri' : 'btn'} onClick={() => reiniciar(true)}>
        Solo núcleo ({preguntas.filter((p) => p.nucleo).length})
      </button>
    </div>
  )

  if (activas.length === 0) {
    return (
      <>
        {filtro}
        <p className="vacio">Este tema todavía no tiene preguntas marcadas como núcleo.</p>
      </>
    )
  }

  if (fin) {
    const pct = Math.round((aciertos / activas.length) * 100)
    // Nota simulada con el criterio real: acierto +1, error -1/4, sobre 10 puntos.
    const errores = activas.length - aciertos
    const nota = Math.max(0, ((aciertos - errores / 4) / activas.length) * 10)

    return (
      <>
        {filtro}
        <div className="tarjeta" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.2rem' }}>
            {aciertos} / {activas.length}
          </p>
          <p className="contador" style={{ marginTop: 0 }}>
            {pct}% de aciertos · nota con penalización de 1/4: <b>{nota.toFixed(2)}</b> sobre 10
          </p>
          <div className="botones" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            <button className="btn btn-pri" onClick={() => reiniciar()}>
              Repetir
            </button>
          </div>
        </div>
      </>
    )
  }

  const p = activas[i]
  const respondida = elegida !== null

  function elegir(indice: number) {
    if (respondida) return
    const acierto = indice === p.correcta
    setElegida(indice)
    if (acierto) setAciertos((n) => n + 1)
    registrarPregunta(p.id, acierto)
  }

  function siguiente() {
    if (i + 1 >= activas.length) {
      setFin(true)
    } else {
      setI(i + 1)
      setElegida(null)
    }
  }

  return (
    <div>
      {filtro}

      <div style={{ marginBottom: '0.75rem' }}>
        <span className="contador">
          Pregunta {i + 1} de {activas.length} · {p.opciones.length} opciones
          {p.nucleo && <span className="etiqueta et-nucleo" style={{ marginLeft: '0.5rem' }}>Núcleo</span>}
        </span>
        <div className="barra" style={{ marginTop: '0.35rem' }}>
          <i style={{ width: `${((i + (respondida ? 1 : 0)) / activas.length) * 100}%` }} />
        </div>
      </div>

      <AvisoPenalizacion breve />

      <div className="tarjeta">
        <div style={{ fontWeight: 600 }}>
          <Markdown>{p.pregunta}</Markdown>
        </div>

        {p.figura && <Figura figura={p.figura} incognita={!respondida} />}

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
              {i + 1 >= activas.length ? 'Ver resultado' : 'Siguiente'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
