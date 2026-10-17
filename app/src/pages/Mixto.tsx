import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TEMAS } from '../content'
import Markdown from '../components/Markdown'
import Figura from '../components/figuras/Figura'
import AvisoPenalizacion from '../components/AvisoPenalizacion'
import { registrarPregunta } from '../lib/progreso'
import {
  CUANTAS,
  PRIMER_TEMA_SUPUESTOS,
  barajar,
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

const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f']
const TITULO = new Map(TEMAS.map((t) => [t.numero, t.titulo]))
const TODOS = TEMAS.map((t) => t.numero)

interface Respuesta {
  item: ItemMixto
  elegida: number
}

const acierta = (r: Respuesta) => r.elegida === r.item.pregunta.correcta

/** «1-3, 5, 9-12» */
function rangos(ns: number[]): string {
  const orden = [...ns].sort((a, b) => a - b)
  const trozos: string[] = []
  for (let i = 0; i < orden.length; i++) {
    let j = i
    while (j + 1 < orden.length && orden[j + 1] === orden[j] + 1) j++
    trozos.push(i === j ? `${orden[i]}` : `${orden[i]}-${orden[j]}`)
    i = j
  }
  return trozos.join(', ')
}

export default function Mixto() {
  const [sel, setSel] = useState<SeleccionMixto>(leerSeleccion)
  const [sesion, setSesion] = useState<ItemMixto[] | null>(null)
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState<number | null>(null)
  const [respuestas, setRespuestas] = useState<Respuesta[]>([])
  const [fin, setFin] = useState(false)

  function cambiar(parcial: Partial<SeleccionMixto>) {
    const nueva = { ...sel, ...parcial }
    setSel(nueva)
    guardarSeleccion(nueva)
  }

  function empezar(items: ItemMixto[]) {
    setSesion(items)
    setI(0)
    setElegida(null)
    setRespuestas([])
    setFin(false)
    window.scrollTo(0, 0)
  }

  function volver() {
    setSesion(null)
    setFin(false)
    window.scrollTo(0, 0)
  }

  if (!sesion) return <Seleccion sel={sel} cambiar={cambiar} empezar={empezar} />

  if (fin) {
    return (
      <Resultado
        respuestas={respuestas}
        planteadas={sesion.length}
        repetir={(items) => empezar(barajar(items))}
        volver={volver}
      />
    )
  }

  const item = sesion[i]
  const p = item.pregunta
  const respondida = elegida !== null

  function elegir(n: number) {
    if (respondida) return
    setElegida(n)
    setRespuestas((rs) => [...rs, { item, elegida: n }])
    // Cuenta igual que en el test del tema: mismo id, mismo registro.
    registrarPregunta(p.id, n === p.correcta)
  }

  function siguiente() {
    if (i + 1 >= sesion!.length) {
      setFin(true)
    } else {
      setI(i + 1)
      setElegida(null)
    }
    window.scrollTo(0, 0)
  }

  function terminar() {
    if (respuestas.length === 0) volver()
    else setFin(true)
    window.scrollTo(0, 0)
  }

  return (
    <div className="mixto">
      <h1>Test mixto</h1>

      {/* Mientras se responde no se dice de que tema es la pregunta: ni aqui ni en ningun otro sitio */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div className="mixto-cabeza">
          <span className="contador">
            Pregunta {i + 1} de {sesion.length} · {p.opciones.length} opciones
            {p.nucleo && (
              <span className="etiqueta et-nucleo" style={{ marginLeft: '0.5rem' }}>
                Núcleo
              </span>
            )}
          </span>
          <button className="btn btn-peq" onClick={terminar}>
            Terminar aquí
          </button>
        </div>
        <div className="barra" style={{ marginTop: '0.35rem' }}>
          <i style={{ width: `${((i + (respondida ? 1 : 0)) / sesion.length) * 100}%` }} />
        </div>
      </div>

      <AvisoPenalizacion breve />

      {/* key: cada pregunta se monta de nuevo (su figura vuelve a la incognita) */}
      {item.supuesto && (
        <div className="tarjeta supuesto-enunciado" key={`s-${i}-${p.id}`}>
          <b>{item.supuesto.titulo}</b>
          <Markdown>{item.supuesto.enunciado}</Markdown>
          {item.supuesto.figura && <Figura figura={item.supuesto.figura} incognita />}
        </div>
      )}

      <div className="tarjeta" key={`p-${i}-${p.id}`}>
        <div className="mixto-pregunta" style={{ fontWeight: 600 }}>
          <Markdown>{p.pregunta}</Markdown>
        </div>

        {p.figura && <Figura figura={p.figura} incognita={!respondida} />}

        {/* Las opciones, en el orden del dato: no se barajan */}
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
            <b>{elegida === p.correcta ? 'Correcto.' : 'Incorrecto.'}</b>
            <p className="mixto-tema">
              Tema {item.tema}. {TITULO.get(item.tema)}
            </p>
            {p.explicacion && <Markdown>{p.explicacion}</Markdown>}
            {p.fuente && <p className="flash-pista mixto-fuente">Fuente: {p.fuente}</p>}
            <EnlaceApunte item={item} />
          </div>
        )}

        {respondida && (
          <div className="botones" style={{ marginTop: '1rem' }}>
            <button className="btn btn-pri" onClick={siguiente}>
              {i + 1 >= sesion.length ? 'Ver resultado' : 'Siguiente'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/** Abre el apunte en otra pestaña, para no perder el test. */
function EnlaceApunte({ item }: { item: ItemMixto }) {
  const ap = item.apartado
  return (
    <p className="mixto-enlace">
      <Link
        to={`/tema/${item.tema}${ap ? `?ap=${encodeURIComponent(ap)}` : ''}`}
        target="_blank"
        rel="noreferrer"
      >
        {ap ? `Ver el apartado ${ap.replace('/', ', ')} del apunte` : 'Ver el apunte del tema'}
      </Link>
    </p>
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

/* ------------------------------------------------------------------ */

function Resultado({
  respuestas,
  planteadas,
  repetir,
  volver,
}: {
  respuestas: Respuesta[]
  planteadas: number
  repetir: (items: ItemMixto[]) => void
  volver: () => void
}) {
  const total = respuestas.length
  const aciertos = respuestas.filter(acierta).length
  const errores = total - aciertos
  const pct = Math.round((aciertos / total) * 100)
  // El criterio real: acierto +1, error -1/4, sobre 10 puntos.
  const nota = Math.max(0, ((aciertos - errores / 4) / total) * 10)

  const porTema = new Map<number, { aciertos: number; total: number }>()
  for (const r of respuestas) {
    const fila = porTema.get(r.item.tema) ?? { aciertos: 0, total: 0 }
    fila.total++
    if (acierta(r)) fila.aciertos++
    porTema.set(r.item.tema, fila)
  }
  const filas = [...porTema.entries()].sort((a, b) => a[0] - b[0])
  const falladas = respuestas.filter((r) => !acierta(r))

  return (
    <div className="mixto">
      <h1>Test mixto: resultado</h1>

      <div className="tarjeta" style={{ textAlign: 'center' }}>
        <p className="mixto-nota">
          {aciertos} / {total}
        </p>
        <p className="contador" style={{ marginTop: 0 }}>
          {pct}% de aciertos · nota con penalización de 1/4: <b>{nota.toFixed(2)}</b> sobre 10
          {total < planteadas && ` · contestadas ${total} de ${planteadas}`}
        </p>
        <div className="botones" style={{ justifyContent: 'center', marginTop: '1rem' }}>
          <button
            className="btn btn-pri"
            disabled={falladas.length === 0}
            onClick={() => repetir(falladas.map((r) => r.item))}
          >
            Repetir solo las falladas ({falladas.length})
          </button>
          <button className="btn" onClick={() => repetir(respuestas.map((r) => r.item))}>
            Repetir el mismo test
          </button>
          <button className="btn" onClick={volver}>
            Nuevo test mixto
          </button>
        </div>
      </div>

      <h2>Por tema</h2>
      <div className="md-tabla">
        <table className="mixto-desglose">
          <thead>
            <tr>
              <th>Tema</th>
              <th>Aciertos</th>
              <th>Preguntas</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {filas.map(([tema, f]) => (
              <tr key={tema} data-tema={tema}>
                <td>
                  <b>Tema {tema}</b>
                  <span className="item-meta mixto-titulo">{TITULO.get(tema)}</span>
                </td>
                <td className="num" data-aciertos>
                  {f.aciertos}
                </td>
                <td className="num" data-preguntas>
                  {f.total}
                </td>
                <td className="num">{Math.round((f.aciertos / f.total) * 100)}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td className="num" data-aciertos>
                {aciertos}
              </td>
              <td className="num" data-preguntas>
                {total}
              </td>
              <td className="num">{pct}%</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <h2>Falladas ({falladas.length})</h2>
      {falladas.length === 0 ? (
        <p className="vacio">Ninguna. Todo bien.</p>
      ) : (
        <ul className="mixto-falladas">
          {falladas.map(({ item, elegida }) => {
            const p = item.pregunta
            return (
              <li key={p.id} className="tarjeta" data-tema={item.tema}>
                <p className="contador mixto-titulo" style={{ margin: 0 }}>
                  Tema {item.tema}. {TITULO.get(item.tema)}
                </p>
                {item.supuesto && (
                  <p className="contador" style={{ margin: '0.2rem 0 0' }}>
                    Supuesto: {item.supuesto.titulo}
                  </p>
                )}
                <div style={{ fontWeight: 600 }}>
                  <Markdown>{p.pregunta}</Markdown>
                </div>
                <p className="mixto-mala">
                  Marcaste {LETRAS[elegida]}) {p.opciones[elegida]}
                </p>
                <p className="mixto-buena">
                  Correcta: {LETRAS[p.correcta]}) {p.opciones[p.correcta]}
                </p>
                <EnlaceApunte item={item} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
