import type { FiltroNucleo as Filtro } from '../lib/mixto'

const OPCIONES: [Filtro, string][] = [
  ['todas', 'Todas'],
  ['solo', 'Solo núcleo'],
  ['sin', 'Sin núcleo'],
]

/**
 * Todas / Solo núcleo / Sin núcleo, con cuantas quedan con cada una. Con los
 * supuestos va desactivado: no tienen nucleo, y se queda en «Todas».
 */
export default function FiltroNucleo({
  valor,
  cambiar,
  cuentas,
  desactivado = false,
  nota,
}: {
  valor: Filtro
  cambiar: (f: Filtro) => void
  /** Lo disponible con cada filtro */
  cuentas: Record<Filtro, number>
  desactivado?: boolean
  /** Por que esta desactivado */
  nota?: string
}) {
  const marcado = desactivado ? 'todas' : valor
  return (
    <div className="filtro-nucleo">
      <div className="filtro-nucleo-botones" role="group" aria-label="Preguntas núcleo">
        {OPCIONES.map(([f, rotulo]) => (
          <button
            key={f}
            className={marcado === f ? 'btn btn-peq btn-pri' : 'btn btn-peq'}
            aria-pressed={marcado === f}
            data-nucleo={f}
            disabled={desactivado}
            onClick={() => cambiar(f)}
          >
            {rotulo} <span className="filtro-nucleo-n">({cuentas[f]})</span>
          </button>
        ))}
      </div>
      {desactivado && nota && (
        <p className="contador" style={{ margin: '0.35rem 0 0' }}>
          {nota}
        </p>
      )}
    </div>
  )
}
