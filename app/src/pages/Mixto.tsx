import { useMemo, useState } from 'react'
import { TEMAS } from '../content'
import SesionTest, { TITULO, rangos } from '../components/SesionTest'
import FiltroNucleo from '../components/FiltroNucleo'
import {
  CUANTAS,
  PRIMER_TEMA_SUPUESTOS,
  disponibles,
  esTarjeta,
  guardarSeleccion,
  leerSeleccion,
  sortear,
  temasConTipo,
  type Cuantas,
  type ItemSesion,
  type SeleccionMixto,
  type TipoMixto,
} from '../lib/mixto'

const TODOS = TEMAS.map((t) => t.numero)

export default function Mixto() {
  const [sel, setSel] = useState<SeleccionMixto>(leerSeleccion)
  const [sesion, setSesion] = useState<ItemSesion[] | null>(null)
  // Cada sesion nueva monta la suya desde cero
  const [vuelta, setVuelta] = useState(0)

  function cambiar(parcial: Partial<SeleccionMixto>) {
    const nueva = { ...sel, ...parcial }
    setSel(nueva)
    guardarSeleccion(nueva)
  }

  function empezar(items: ItemSesion[]) {
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
  empezar: (items: ItemSesion[]) => void
}) {
  const [desde, setDesde] = useState(9)
  const [hasta, setHasta] = useState(20)

  const conTipo = useMemo(() => new Set(temasConTipo(sel.tipo)), [sel.tipo])
  const elegidos = sel.temas.filter((n) => conTipo.has(n))
  // Lo disponible con cada filtro de nucleo: el elegido es el que se sortea
  const pools = useMemo(
    () => ({
      todas: disponibles(sel.temas, sel.tipo, 'todas'),
      solo: disponibles(sel.temas, sel.tipo, 'solo'),
      sin: disponibles(sel.temas, sel.tipo, 'sin'),
    }),
    [sel.temas, sel.tipo],
  )
  const supuestos = sel.tipo === 'supuestos'
  const mixta = sel.tipo === 'mixta'
  const pool = pools[supuestos ? 'todas' : sel.nucleo]
  const tarjetas = pool.filter(esTarjeta).length
  const saldran = sel.cuantas === 0 ? pool.length : Math.min(sel.cuantas, pool.length)
  const cosas = (n: number) =>
    mixta ? `${n} entre preguntas y tarjetas` : `${n} ${n === 1 ? 'pregunta' : 'preguntas'}`

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
        se ve hasta que la contestas (ni el de cada tarjeta hasta que le das la vuelta).
      </p>

      <div className="tarjeta mixto-panel">
        <h2>Tipo</h2>
        <div className="botones">
          {tipoBoton('test', 'Test · 3 opciones')}
          {tipoBoton('supuestos', 'Supuestos · 4 opciones')}
          {tipoBoton('mixta', 'Test + tarjetas')}
        </div>
        {mixta && (
          <p className="contador" style={{ margin: '0.5rem 0 0' }}>
            Preguntas de test de 3 opciones y tarjetas de repaso, mezcladas al azar. Las tarjetas se
            valoran como en el repaso del tema: cuentan para su repaso espaciado, y las que marques
            «Fallo» van a tus falladas.
          </p>
        )}
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

        <h2>{mixta ? 'Preguntas y tarjetas' : 'Preguntas'}</h2>
        <FiltroNucleo
          valor={sel.nucleo}
          cambiar={(nucleo) => cambiar({ nucleo })}
          cuentas={{ todas: pools.todas.length, solo: pools.solo.length, sin: pools.sin.length }}
          desactivado={supuestos}
          nota="Los supuestos no tienen preguntas núcleo: salen todas."
        />
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
          {mixta
            ? `${pool.length} disponibles: ${pool.length - tarjetas} preguntas de test y ${tarjetas} tarjetas`
            : `${pool.length} preguntas disponibles`}
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
            Empezar ({cosas(saldran)})
          </button>
        </div>
      </div>
    </div>
  )
}
