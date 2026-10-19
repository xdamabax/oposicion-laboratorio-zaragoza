import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TEMAS } from '../content'
import Markdown from '../components/Markdown'
import Figura from '../components/figuras/Figura'
import SesionTest, {
  EnlaceApunte,
  TITULO,
  TablaDesglose,
  desglose,
  rangos,
  type Respuesta,
} from '../components/SesionTest'
import { registrarTarjeta, useProgreso, vaciarFalladas, type Falladas } from '../lib/progreso'
import { canonico, contarPendientes, type Pendientes } from '../lib/indice'
import { CUANTAS, type Cuantas, type ItemMixto } from '../lib/mixto'
import {
  guardarSeleccion,
  leerSeleccion,
  preguntasFalladas,
  sortearDe,
  tarjetasFalladas,
  type ItemTarjeta,
  type SeleccionFalladas,
  type TipoFalladas,
} from '../lib/falladas'
import type { Resultado as ResultadoTarjeta } from '../lib/srs'

const TODOS = TEMAS.map((t) => t.numero)

const NOMBRE: Record<TipoFalladas, [string, string]> = {
  test: ['pregunta de test', 'preguntas de test'],
  supuestos: ['pregunta de supuestos', 'preguntas de supuestos'],
  tarjetas: ['tarjeta', 'tarjetas'],
}
const cuantasDe = (n: number, tipo: TipoFalladas) => `${n} ${NOMBRE[tipo][n === 1 ? 0 : 1]}`

type Sesion = { tipo: 'preguntas'; items: ItemMixto[] } | { tipo: 'tarjetas'; items: ItemTarjeta[] }

export default function FalladasPagina() {
  const progreso = useProgreso()
  const lista = progreso.falladas
  const pendientes = useMemo(() => contarPendientes(lista), [lista])

  const [sel, setSel] = useState<SeleccionFalladas>(leerSeleccion)
  const [sesion, setSesion] = useState<Sesion | null>(null)
  // Cada sesion nueva monta la suya desde cero
  const [vuelta, setVuelta] = useState(0)

  function cambiar(parcial: Partial<SeleccionFalladas>) {
    const nueva = { ...sel, ...parcial }
    setSel(nueva)
    guardarSeleccion(nueva)
  }

  function empezar(s: Sesion) {
    setSesion(s)
    setVuelta((n) => n + 1)
    window.scrollTo(0, 0)
  }

  function volver() {
    setSesion(null)
    window.scrollTo(0, 0)
  }

  if (sesion?.tipo === 'preguntas') {
    return (
      <SesionTest
        key={vuelta}
        titulo="Test de falladas"
        items={sesion.items}
        volver={volver}
        rotuloNuevo="Nuevo test de falladas"
        extraResultado={(rs) => (
          <Salidas
            ids={rs.map((r: Respuesta) => r.item.pregunta.id)}
            lista={lista.preguntas}
            quedan={pendientes.porClase[sel.tipo]}
            tipo={sel.tipo}
          />
        )}
      />
    )
  }
  if (sesion?.tipo === 'tarjetas') {
    return (
      <SesionTarjetas
        key={vuelta}
        items={sesion.items}
        volver={volver}
        lista={lista}
        quedan={pendientes.porClase.tarjetas}
      />
    )
  }

  if (pendientes.total === 0) {
    return (
      <div className="mixto">
        <h1>Test de falladas</h1>
        <div className="vacio falladas-vacia">
          <p>
            <b>No tienes falladas pendientes.</b>
          </p>
          <p className="contador">
            Cada pregunta que falles en el test de un tema, en los supuestos o en el test mixto entra
            aquí, y sale cuando la aciertas dos veces seguidas. Las tarjetas entran al marcarlas
            «Fallo».
          </p>
          <Link className="btn btn-pri" to="/mixto">
            Ir al test mixto
          </Link>
        </div>
      </div>
    )
  }

  return <Seleccion sel={sel} cambiar={cambiar} empezar={empezar} lista={lista} pendientes={pendientes} />
}

/** Bajo la nota: cuantas de la sesion han salido ya de la lista, y cuantas quedan. */
function Salidas({
  ids,
  lista,
  quedan,
  tipo,
}: {
  ids: string[]
  lista: Record<string, unknown>
  quedan: number
  tipo: TipoFalladas
}) {
  const salen = new Set(ids.filter((id) => !lista[canonico(id)])).size
  return (
    <p className="contador falladas-salen" style={{ margin: '0.4rem 0 0' }}>
      {salen === 0
        ? 'Ninguna sale todavía de la lista'
        : `Salen de la lista ${salen === 1 ? '1, acertada' : `${salen}, acertadas`} dos veces seguidas`}
      {' · '}
      quedan <b data-quedan>{quedan}</b> {NOMBRE[tipo][quedan === 1 ? 0 : 1]} pendientes.
    </p>
  )
}

/* ------------------------------------------------------------------ */

function Seleccion({
  sel,
  cambiar,
  empezar,
  lista,
  pendientes,
}: {
  sel: SeleccionFalladas
  cambiar: (p: Partial<SeleccionFalladas>) => void
  empezar: (s: Sesion) => void
  lista: Falladas
  pendientes: Pendientes
}) {
  const [desde, setDesde] = useState(9)
  const [hasta, setHasta] = useState(20)
  const [confirmar, setConfirmar] = useState(false)

  const deTema = (n: number) => pendientes.porTema.get(n)?.[sel.tipo] ?? 0
  const elegidos = sel.temas.filter((n) => deTema(n) > 0)
  const pool = useMemo(
    () =>
      sel.tipo === 'tarjetas'
        ? tarjetasFalladas(lista, sel.temas)
        : preguntasFalladas(lista, sel.temas, sel.tipo),
    [lista, sel.temas, sel.tipo],
  )
  const saldran = sel.cuantas === 0 ? pool.length : Math.min(sel.cuantas, pool.length)

  const marcar = (ns: number[]) => cambiar({ temas: [...new Set(ns)].sort((a, b) => a - b) })
  const alternar = (n: number) =>
    marcar(sel.temas.includes(n) ? sel.temas.filter((x) => x !== n) : [...sel.temas, n])
  const rango = () => {
    const [a, b] = [Math.min(desde, hasta), Math.max(desde, hasta)]
    return TODOS.filter((n) => n >= a && n <= b)
  }

  function arrancar() {
    if (sel.tipo === 'tarjetas') {
      empezar({ tipo: 'tarjetas', items: sortearDe(pool as ItemTarjeta[], sel.cuantas) })
    } else {
      empezar({ tipo: 'preguntas', items: sortearDe(pool as ItemMixto[], sel.cuantas) })
    }
  }

  const chip = (n: number) => {
    const cuantas = deTema(n)
    const aplica = cuantas > 0
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
        {aplica && (
          <small className="falladas-n" data-cuenta={cuantas}>
            {cuantas}
          </small>
        )}
      </label>
    )
  }

  const tipoBoton = (tipo: TipoFalladas, rotulo: string) => (
    <button
      className={sel.tipo === tipo ? 'btn btn-pri' : 'btn'}
      aria-pressed={sel.tipo === tipo}
      data-tipo={tipo}
      onClick={() => cambiar({ tipo })}
    >
      {rotulo} ({pendientes.porClase[tipo]})
    </button>
  )

  const { porClase } = pendientes

  return (
    <div className="mixto">
      <h1>Test de falladas</h1>
      <p className="sub">
        Lo que has fallado en cualquier test, al azar y sin ver el tema hasta contestar. Una pregunta
        sale de la lista cuando la aciertas dos veces seguidas, aquí o en cualquier otro test; si la
        vuelves a fallar, empieza de cero.
      </p>

      <p className="falladas-resumen" data-total={pendientes.total}>
        <b>{pendientes.total}</b> pendientes: {cuantasDe(porClase.test, 'test')},{' '}
        {cuantasDe(porClase.supuestos, 'supuestos')} y {cuantasDe(porClase.tarjetas, 'tarjetas')}.
      </p>

      <div className="tarjeta mixto-panel">
        <h2>Tipo</h2>
        <div className="botones">
          {tipoBoton('test', 'Test · 3 opciones')}
          {tipoBoton('supuestos', 'Supuestos · 4 opciones')}
          {tipoBoton('tarjetas', 'Tarjetas')}
        </div>
        {sel.tipo === 'tarjetas' && (
          <p className="contador" style={{ margin: '0.5rem 0 0' }}>
            Las tarjetas que marcaste «Fallo». Cuentan también para su repaso espaciado; salen de
            la lista con dos «Bien» o «Fácil» seguidos.
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
          {porClase[sel.tipo] === 0
            ? `No hay ${NOMBRE[sel.tipo][1]} falladas.`
            : elegidos.length === 0
              ? 'Ningún tema elegido.'
              : `${elegidos.length} ${elegidos.length === 1 ? 'tema' : 'temas'}: ${rangos(elegidos)}`}
        </p>

        <h2>{sel.tipo === 'tarjetas' ? 'Tarjetas' : 'Preguntas'}</h2>
        <div className="botones">
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
          {cuantasDe(pool.length, sel.tipo)} falladas en los temas elegidos
          {sel.cuantas !== 0 && pool.length > 0 && pool.length < sel.cuantas
            ? `: solo hay ${pool.length}, saldrán todas`
            : ''}
          .
        </p>

        <div className="botones" style={{ marginTop: '1rem' }}>
          <button className="btn btn-pri" disabled={saldran === 0} onClick={arrancar}>
            Empezar ({cuantasDe(saldran, sel.tipo)})
          </button>
        </div>
      </div>

      <h2>Pendientes por tema</h2>
      <div className="md-tabla">
        <table className="mixto-desglose falladas-pendientes">
          <thead>
            <tr>
              <th>Tema</th>
              <th>Test</th>
              <th>Supuestos</th>
              <th>Tarjetas</th>
            </tr>
          </thead>
          <tbody>
            {[...pendientes.porTema.entries()].map(([tema, f]) => (
              <tr key={tema} data-tema={tema}>
                <td>
                  <b>Tema {tema}</b>
                  <span className="item-meta mixto-titulo">{TITULO.get(tema)}</span>
                </td>
                <td className="num" data-clase="test">
                  {f.test || '–'}
                </td>
                <td className="num" data-clase="supuestos">
                  {f.supuestos || '–'}
                </td>
                <td className="num" data-clase="tarjetas">
                  {f.tarjetas || '–'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td className="num">{porClase.test}</td>
              <td className="num">{porClase.supuestos}</td>
              <td className="num">{porClase.tarjetas}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="falladas-vaciar">
        {confirmar ? (
          <div className="tarjeta">
            <p style={{ marginTop: 0 }}>
              ¿Vaciar la lista? Se quitan las {pendientes.total} pendientes, preguntas y tarjetas. Tu
              progreso y el repaso espaciado de las tarjetas no cambian.
            </p>
            <div className="botones">
              <button
                className="btn btn-bad"
                onClick={() => {
                  vaciarFalladas()
                  setConfirmar(false)
                }}
              >
                Sí, vaciar la lista
              </button>
              <button className="btn" onClick={() => setConfirmar(false)}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-peq" onClick={() => setConfirmar(true)}>
            Vaciar la lista
          </button>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

interface RespuestaTarjeta {
  item: ItemTarjeta
  resultado: ResultadoTarjeta
}

const bien = (r: RespuestaTarjeta) => r.resultado !== 'fallo'

function SesionTarjetas({
  items,
  volver,
  lista,
  quedan,
}: {
  items: ItemTarjeta[]
  volver: () => void
  lista: Falladas
  quedan: number
}) {
  const [sesion, setSesion] = useState(items)
  const [i, setI] = useState(0)
  const [vista, setVista] = useState(false)
  const [respuestas, setRespuestas] = useState<RespuestaTarjeta[]>([])
  const [fin, setFin] = useState(false)

  function empezar(nuevas: ItemTarjeta[]) {
    setSesion(sortearDe(nuevas, 0))
    setI(0)
    setVista(false)
    setRespuestas([])
    setFin(false)
    window.scrollTo(0, 0)
  }

  if (fin) {
    const total = respuestas.length
    const aciertos = respuestas.filter(bien).length
    const fallos = respuestas.filter((r) => !bien(r))
    return (
      <div className="mixto">
        <h1>Tarjetas falladas: resultado</h1>
        <div className="tarjeta" style={{ textAlign: 'center' }}>
          <p className="mixto-nota">
            {aciertos} / {total}
          </p>
          <p className="contador" style={{ marginTop: 0 }}>
            {Math.round((aciertos / total) * 100)}% con «Bien» o «Fácil»
            {total < sesion.length && ` · repasadas ${total} de ${sesion.length}`}
          </p>
          <Salidas
            ids={respuestas.map((r) => r.item.tarjeta.id)}
            lista={lista.tarjetas}
            quedan={quedan}
            tipo="tarjetas"
          />
          <div className="botones" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            <button
              className="btn btn-pri"
              disabled={fallos.length === 0}
              onClick={() => empezar(fallos.map((r) => r.item))}
            >
              Repetir solo las falladas ({fallos.length})
            </button>
            <button className="btn" onClick={() => empezar(respuestas.map((r) => r.item))}>
              Repetir las mismas
            </button>
            <button className="btn" onClick={volver}>
              Nuevo test de falladas
            </button>
          </div>
        </div>

        <h2>Por tema</h2>
        <TablaDesglose
          filas={desglose(respuestas, (r) => r.item.tema, bien)}
          aciertos={aciertos}
          total={total}
          rotuloAciertos="Bien"
        />
      </div>
    )
  }

  const item = sesion[i]
  const t = item.tarjeta

  function responder(resultado: ResultadoTarjeta) {
    registrarTarjeta(t.id, resultado)
    setRespuestas((rs) => [...rs, { item, resultado }])
    if (i + 1 >= sesion.length) setFin(true)
    else {
      setI(i + 1)
      setVista(false)
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
      <h1>Tarjetas falladas</h1>

      {/* Como en el test: el tema no se ve hasta dar la vuelta a la tarjeta */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div className="mixto-cabeza">
          <span className="contador">
            Tarjeta {i + 1} de {sesion.length}
            {t.nucleo && (
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
          <i style={{ width: `${(i / sesion.length) * 100}%` }} />
        </div>
      </div>

      <div
        key={`t-${i}-${t.id}`}
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
          <Markdown>{t.anverso}</Markdown>
        </div>

        {t.figura && <Figura figura={t.figura} incognita={!vista} />}

        {vista ? (
          <div className="flash-b">
            <Markdown>{t.reverso}</Markdown>
            <p className="mixto-tema">
              Tema {item.tema}. {TITULO.get(item.tema)}
            </p>
            {t.fuente && <p className="flash-pista mixto-fuente">Fuente: {t.fuente}</p>}
            <EnlaceApunte tema={item.tema} apartado={item.apartado} />
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
