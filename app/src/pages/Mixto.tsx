import { useMemo, useState } from 'react'
import { TEMAS } from '../content'
import SesionTest, { TITULO, rangos } from '../components/SesionTest'
import {
  CUANTAS,
  PRIMER_TEMA_SUPUESTOS,
  disponibles,
  guardarSeleccion,
  leerSeleccion,
  sortear,
  temasConTipo,
  type Cuantas,
  type ItemMixto,
  type SeleccionMixto,
  type TipoMixto,
} from '../lib/mixto'

const TODOS = TEMAS.map((t) => t.numero)

export default function Mixto() {
  const [sel, setSel] = useState<SeleccionMixto>(leerSeleccion)
  const [sesion, setSesion] = useState<ItemMixto[] | null>(null)
  // Cada sesion nueva monta la suya desde cero
  const [vuelta, setVuelta] = useState(0)

  function cambiar(parcial: Partial<SeleccionMixto>) {
    const nueva = { ...sel, ...parcial }
    setSel(nueva)
    guardarSeleccion(nueva)
  }

  function empezar(items: ItemMixto[]) {
    setSesion(items)
    setVuelta((n) => n + 1)
    window.scrollTo(0, 0)
  }

  function volver() {
    setSesion(null)
    window.scrollTo(0, 0)
  }

  if (!sesion) return <Seleccion sel={sel} cambiar={cambiar} empezar={empezar} />

  return (
    <SesionTest
      key={vuelta}
      titulo="Test mixto"
      items={sesion}
      volver={volver}
      rotuloNuevo="Nuevo test mixto"
    />
  )
}

/* ------------------------------------------------------------------ */

function Seleccion({
  sel,
  cambiar,
  empezar,
}: {
  sel: SeleccionMixto
  cambiar: (p: Partial<SeleccionMixto>) => void
  empezar: (items: ItemMixto[]) => void
}) {
  const [desde, setDesde] = useState(9)
  const [hasta, setHasta] = useState(20)

  const conTipo = useMemo(() => new Set(temasConTipo(sel.tipo)), [sel.tipo])
  const elegidos = sel.temas.filter((n) => conTipo.has(n))
  const pool = useMemo(
    () => disponibles(sel.temas, sel.tipo, sel.soloNucleo),
    [sel.temas, sel.tipo, sel.soloNucleo],
  )
  const hayNucleo = useMemo(
    () => disponibles(sel.temas, sel.tipo, true).length > 0,
    [sel.temas, sel.tipo],
  )
  const saldran = sel.cuantas === 0 ? pool.length : Math.min(sel.cuantas, pool.length)

  const marcar = (ns: number[]) => cambiar({ temas: [...new Set(ns)].sort((a, b) => a - b) })
  const alternar = (n: number) =>
    marcar(sel.temas.includes(n) ? sel.temas.filter((x) => x !== n) : [...sel.temas, n])
  const rango = () => {
    const [a, b] = [Math.min(desde, hasta), Math.max(desde, hasta)]
    return TODOS.filter((n) => n >= a && n <= b)
  }

  const chip = (n: number) => {
    const aplica = conTipo.has(n)
    return (
      <label
        key={n}
        className={`mixto-chip${aplica ? '' : ' mixto-chip-no'}`}
        title={`${n}. ${TITULO.get(n) ?? ''}`}
      >
        <input
          type="checkbox"
          data-tema={n}
          checked={aplica && sel.temas.includes(n)}
          disabled={!aplica}
          onChange={() => alternar(n)}
        />
        <span>{n}</span>
      </label>
    )
  }

  const tipoBoton = (tipo: TipoMixto, rotulo: string) => (
    <button
      className={sel.tipo === tipo ? 'btn btn-pri' : 'btn'}
      aria-pressed={sel.tipo === tipo}
      onClick={() => cambiar({ tipo })}
    >
      {rotulo}
    </button>
  )

  return (
    <div className="mixto">
      <h1>Test mixto</h1>
      <p className="sub">
        Preguntas al azar de los temas que elijas, en orden aleatorio. El tema de cada pregunta no
        se ve hasta que la contestas.
      </p>

      <div className="tarjeta mixto-panel">
        <h2>Tipo</h2>
        <div className="botones">
          {tipoBoton('test', 'Test · 3 opciones')}
          {tipoBoton('supuestos', 'Supuestos · 4 opciones')}
        </div>
        {sel.tipo === 'supuestos' && (
          <p className="contador" style={{ margin: '0.5rem 0 0' }}>
            Solo los temas {PRIMER_TEMA_SUPUESTOS} a 40: los de la parte primera no tienen supuestos.
            Cada pregunta sale con el enunciado de su supuesto.
          </p>
        )}

        <h2>Temas</h2>
        <div className="botones">
          <button className="btn btn-peq" onClick={() => marcar(TODOS)}>
            Todos
          </button>
          <button className="btn btn-peq" onClick={() => marcar([])}>
            Ninguno
          </button>
          <button className="btn btn-peq" onClick={() => marcar(TODOS.filter((n) => n < 9))}>
            Parte primera (1-8)
          </button>
          <button className="btn btn-peq" onClick={() => marcar(TODOS.filter((n) => n >= 9))}>
            Parte segunda (9-40)
          </button>
        </div>

        <div className="mixto-rango">
          <label>
            Del tema{' '}
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={40}
              value={desde}
              aria-label="Primer tema del rango"
              onChange={(e) => setDesde(Number(e.target.value) || 1)}
            />
          </label>
          <label>
            al{' '}
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={40}
              value={hasta}
              aria-label="Último tema del rango"
              onChange={(e) => setHasta(Number(e.target.value) || 1)}
            />
          </label>
          <button className="btn btn-peq" onClick={() => marcar(rango())}>
            Solo estos
          </button>
          <button className="btn btn-peq" onClick={() => marcar([...sel.temas, ...rango()])}>
            Añadir
          </button>
        </div>

        <p className="mixto-parte">Parte primera</p>
        <div className="mixto-chips">{TODOS.filter((n) => n < 9).map(chip)}</div>
        <p className="mixto-parte">Parte segunda</p>
        <div className="mixto-chips">{TODOS.filter((n) => n >= 9).map(chip)}</div>

        <p className="contador mixto-elegidos" style={{ margin: '0.6rem 0 0' }}>
          {elegidos.length === 0
            ? 'Ningún tema elegido.'
            : `${elegidos.length} ${elegidos.length === 1 ? 'tema' : 'temas'}: ${rangos(elegidos)}`}
        </p>

        <h2>Preguntas</h2>
        <label className="mixto-check">
          <input
            type="checkbox"
            checked={sel.soloNucleo && hayNucleo}
            disabled={!hayNucleo}
            onChange={(e) => cambiar({ soloNucleo: e.target.checked })}
          />{' '}
          Solo núcleo
          {!hayNucleo && elegidos.length > 0 && (
            <span className="contador">
              {' '}
              · {sel.tipo === 'supuestos' ? 'los supuestos no tienen' : 'estos temas no tienen'}{' '}
              preguntas núcleo
            </span>
          )}
        </label>
        <div className="botones" style={{ marginTop: '0.6rem' }}>
          {([...CUANTAS, 0] as Cuantas[]).map((c) => (
            <button
              key={c}
              className={sel.cuantas === c ? 'btn btn-peq btn-pri' : 'btn btn-peq'}
              aria-pressed={sel.cuantas === c}
              data-cuantas={c}
              onClick={() => cambiar({ cuantas: c })}
            >
              {c === 0 ? `Todas (${pool.length})` : c}
            </button>
          ))}
        </div>
        <p className="contador mixto-disponibles" style={{ margin: '0.5rem 0 0' }}>
          {pool.length} preguntas disponibles
          {sel.cuantas !== 0 && pool.length > 0 && pool.length < sel.cuantas
            ? `: solo hay ${pool.length}, saldrán todas`
            : ''}
          .
        </p>

        <div className="botones" style={{ marginTop: '1rem' }}>
          <button
            className="btn btn-pri"
            disabled={saldran === 0}
            onClick={() => empezar(sortear(pool, sel.cuantas))}
          >
            Empezar ({saldran} {saldran === 1 ? 'pregunta' : 'preguntas'})
          </button>
        </div>
      </div>
    </div>
  )
}
