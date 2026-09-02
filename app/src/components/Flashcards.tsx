import { useEffect, useMemo, useState } from 'react'
import Markdown from './Markdown'
import Figura from './figuras/Figura'
import { getProgreso, registrarTarjeta } from '../lib/progreso'
import { tocaHoy, type Resultado } from '../lib/srs'
import type { Flashcard } from '../types'

export default function Flashcards({ tarjetas }: { tarjetas: Flashcard[] }) {
  const [soloNucleo, setSoloNucleo] = useState(false)
  const [soloHoy, setSoloHoy] = useState(true)
  const [cola, setCola] = useState<Flashcard[]>([])
  const [vista, setVista] = useState(false)
  const [hechas, setHechas] = useState(0)

  const hayNucleo = useMemo(() => tarjetas.some((t) => t.nucleo), [tarjetas])

  const ambito = useMemo(
    () => (soloNucleo ? tarjetas.filter((t) => t.nucleo) : tarjetas),
    [tarjetas, soloNucleo],
  )

  const pendientes = useMemo(() => {
    const p = getProgreso()
    return ambito.filter((t) => tocaHoy(p.tarjetas[t.id]))
  }, [ambito])

  // Al montar, o al cambiar de ambito/filtro, se rehace la cola de la sesion.
  useEffect(() => {
    const base = soloHoy && pendientes.length > 0 ? pendientes : ambito
    setCola(base)
    setVista(false)
    setHechas(0)
  }, [ambito, pendientes, soloHoy])

  const actual = cola[0]

  function responder(resultado: Resultado) {
    if (!actual) return
    registrarTarjeta(actual.id, resultado)
    setHechas((n) => n + 1)
    setVista(false)
    setCola((c) => {
      const [primera, ...resto] = c
      // Un fallo vuelve al final de la sesion para verla otra vez hoy.
      return resultado === 'fallo' ? [...resto, primera] : resto
    })
  }

  if (tarjetas.length === 0) {
    return (
      <p className="vacio">
        Todavía no hay tarjetas para este tema. Se generan a partir del apunte una vez aprobado.
      </p>
    )
  }

  const controles = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem',
        gap: '0.75rem',
        flexWrap: 'wrap',
      }}
    >
      <div className="botones">
        {hayNucleo && (
          <>
            <button
              className={soloNucleo ? 'btn' : 'btn btn-pri'}
              onClick={() => setSoloNucleo(false)}
            >
              Todas ({tarjetas.length})
            </button>
            <button
              className={soloNucleo ? 'btn btn-pri' : 'btn'}
              onClick={() => setSoloNucleo(true)}
            >
              Solo núcleo ({tarjetas.filter((t) => t.nucleo).length})
            </button>
          </>
        )}
      </div>
      <div className="botones">
        <button className="btn" onClick={() => setSoloHoy((v) => !v)}>
          {soloHoy ? 'Repasar todas' : 'Solo las de hoy'}
        </button>
      </div>
    </div>
  )

  if (ambito.length === 0) {
    return (
      <>
        {controles}
        <p className="vacio">Este tema todavía no tiene tarjetas marcadas como núcleo.</p>
      </>
    )
  }

  if (!actual) {
    return (
      <>
        {controles}
        <div className="tarjeta" style={{ textAlign: 'center' }}>
          <p>
            <b>Sesión terminada.</b> {hechas} {hechas === 1 ? 'repaso' : 'repasos'} registrados.
          </p>
          <div className="botones" style={{ justifyContent: 'center' }}>
            <button className="btn btn-pri" onClick={() => setCola(ambito)}>
              Repasar las {ambito.length} otra vez
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      {controles}

      <span className="contador">
        Quedan {cola.length} de {soloHoy && pendientes.length > 0 ? pendientes.length : ambito.length}
      </span>

      <div
        className="tarjeta flash"
        style={{ marginTop: '0.35rem' }}
        onClick={() => setVista(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setVista(true)
          }
        }}
      >
        {actual.nucleo && <span className="etiqueta et-nucleo">Núcleo</span>}

        <div className="flash-a">
          <Markdown>{actual.anverso}</Markdown>
        </div>

        {actual.figura && <Figura figura={actual.figura} incognita={!vista} />}

        {vista ? (
          <div className="flash-b">
            <Markdown>{actual.reverso}</Markdown>
            {actual.fuente && <p className="flash-pista">Fuente: {actual.fuente}</p>}
          </div>
        ) : (
          <p className="flash-pista">Pulsa para ver la respuesta</p>
        )}
      </div>

      {vista && (
        <div className="botones" style={{ marginTop: '0.75rem', justifyContent: 'center' }}>
          <button className="btn btn-bad" onClick={() => responder('fallo')}>
            Fallo
          </button>
          <button className="btn" onClick={() => responder('bien')}>
            Bien
          </button>
          <button className="btn btn-ok" onClick={() => responder('facil')}>
            Fácil
          </button>
        </div>
      )}
    </div>
  )
}
