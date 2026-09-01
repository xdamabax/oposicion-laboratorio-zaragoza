import { useEffect, useMemo, useState } from 'react'
import Markdown from './Markdown'
import { getProgreso, registrarTarjeta } from '../lib/progreso'
import { tocaHoy, type Resultado } from '../lib/srs'
import type { Flashcard } from '../types'

type Modo = 'pendientes' | 'todas'

export default function Flashcards({ tarjetas }: { tarjetas: Flashcard[] }) {
  const [modo, setModo] = useState<Modo>('pendientes')
  const [cola, setCola] = useState<Flashcard[]>([])
  const [vista, setVista] = useState(false)
  const [hechas, setHechas] = useState(0)

  const pendientes = useMemo(() => {
    const p = getProgreso()
    return tarjetas.filter((t) => tocaHoy(p.tarjetas[t.id]))
  }, [tarjetas])

  // Al montar (o al cambiar de modo) se rehace la cola de la sesion.
  useEffect(() => {
    const base = modo === 'pendientes' && pendientes.length > 0 ? pendientes : tarjetas
    setCola(base)
    setVista(false)
    setHechas(0)
  }, [modo, pendientes, tarjetas])

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
        Todavia no hay tarjetas para este tema. Se generan a partir del apunte una vez aprobado.
      </p>
    )
  }

  if (!actual) {
    return (
      <div className="tarjeta" style={{ textAlign: 'center' }}>
        <p>
          <b>Sesion terminada.</b> {hechas} {hechas === 1 ? 'repaso' : 'repasos'} registrados.
        </p>
        <div className="botones" style={{ justifyContent: 'center' }}>
          <button className="btn btn-pri" onClick={() => setCola(tarjetas)}>
            Repasar las {tarjetas.length} otra vez
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <span className="contador">
          Quedan {cola.length} de {modo === 'pendientes' ? pendientes.length || tarjetas.length : tarjetas.length}
        </span>
        <div className="botones">
          <button
            className="btn"
            onClick={() => setModo((m) => (m === 'pendientes' ? 'todas' : 'pendientes'))}
          >
            {modo === 'pendientes' ? 'Repasar todas' : 'Solo las de hoy'}
          </button>
        </div>
      </div>

      <div
        className="tarjeta flash"
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
        <div className="flash-a">
          <Markdown>{actual.anverso}</Markdown>
        </div>

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
            Facil
          </button>
        </div>
      )}
    </div>
  )
}
