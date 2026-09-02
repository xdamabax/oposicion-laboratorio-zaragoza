import { useState } from 'react'
import Markdown from './Markdown'
import Figura from './figuras/Figura'
import Test from './Test'
import type { Supuesto } from '../types'

/**
 * Segundo ejercicio: casos teorico-practicos con enunciado comun y preguntas
 * de cuatro opciones. El enunciado se mantiene a la vista mientras se responde,
 * como en el examen.
 */
export default function Supuestos({ supuestos }: { supuestos: Supuesto[] }) {
  const [abierto, setAbierto] = useState<string | null>(null)

  if (supuestos.length === 0) {
    return (
      <p className="vacio">
        Todavía no hay supuestos prácticos para este tema.
        <br />
        <span className="contador">
          Los supuestos son el segundo ejercicio y solo se generan para los temas de la parte
          segunda (9 a 40).
        </span>
      </p>
    )
  }

  const activo = supuestos.find((s) => s.id === abierto)

  if (!activo) {
    return (
      <>
        <p className="sub">
          Segundo ejercicio: {supuestos.length}{' '}
          {supuestos.length === 1 ? 'supuesto' : 'supuestos'} con preguntas de cuatro opciones.
        </p>
        <ul className="lista">
          {supuestos.map((s, n) => (
            <li key={s.id}>
              <button className="item" style={{ width: '100%' }} onClick={() => setAbierto(s.id)}>
                <span className="item-num">{n + 1}</span>
                <span className="item-txt" style={{ textAlign: 'left' }}>
                  {s.titulo}
                  <br />
                  <span className="item-meta">{s.preguntas.length} preguntas</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <>
      <div className="botones" style={{ marginBottom: '0.75rem' }}>
        <button className="btn" onClick={() => setAbierto(null)}>
          ← Todos los supuestos
        </button>
      </div>

      <div className="tarjeta supuesto-enunciado">
        <b>{activo.titulo}</b>
        <Markdown>{activo.enunciado}</Markdown>
        {activo.figura && <Figura figura={activo.figura} incognita />}
      </div>

      <Test preguntas={activo.preguntas} />
    </>
  )
}
