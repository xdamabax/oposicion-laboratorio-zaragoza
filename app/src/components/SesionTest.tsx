import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { TEMAS } from '../content'
import Markdown from './Markdown'
import Figura from './figuras/Figura'
import AvisoPenalizacion from './AvisoPenalizacion'
import TarjetaGiro from './TarjetaGiro'
import { registrarPregunta, registrarTarjeta } from '../lib/progreso'
import { barajar, esTarjeta, type ItemMixto, type ItemSesion, type ItemTarjeta } from '../lib/mixto'
import type { Resultado as ResultadoTarjeta } from '../lib/srs'

/**
 * La sesion de preguntas sueltas de varios temas y su resultado: la del test
 * mixto y la del test de falladas, que se corrigen igual. En la sesion «Test +
 * tarjetas» del mixto entran tambien tarjetas de repaso, que se giran y se
 * valoran como en el repaso del tema.
 */

const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f']
export const TITULO = new Map(TEMAS.map((t) => [t.numero, t.titulo]))

export interface Respuesta {
  item: ItemMixto
  elegida: number
}

/** Lo que se dijo de una tarjeta: «Fallo» es no sabida; «Bien» y «Fácil», sabida. */
export interface Valoracion {
  item: ItemTarjeta
  resultado: ResultadoTarjeta
}

type Contestada = Respuesta | Valoracion

const esValoracion = (c: Contestada): c is Valoracion => 'resultado' in c
const esRespuesta = (c: Contestada): c is Respuesta => !esValoracion(c)
const acierta = (r: Respuesta) => r.elegida === r.item.pregunta.correcta
const sabida = (v: Valoracion) => v.resultado !== 'fallo'

/** «1-3, 5, 9-12» */
export function rangos(ns: number[]): string {
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

export default function SesionTest({
  titulo,
  items,
  volver,
  rotuloNuevo,
  extraResultado,
}: {
  titulo: string
  items: ItemSesion[]
  volver: () => void
  /** Boton del resultado que vuelve a la seleccion */
  rotuloNuevo: string
  /** Lo que se pinta bajo la nota, con las respuestas de la sesion */
  extraResultado?: (respuestas: Respuesta[]) => ReactNode
}) {
  const [sesion, setSesion] = useState<ItemSesion[]>(items)
  // Una sesion con tarjetas tiene su propio resultado, tambien al repetirla
  const [mixta] = useState(() => items.some(esTarjeta))
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState<number | null>(null)
  const [vista, setVista] = useState(false)
  const [contestadas, setContestadas] = useState<Contestada[]>([])
  const [fin, setFin] = useState(false)

  function empezar(nuevos: ItemSesion[]) {
    setSesion(nuevos)
    setI(0)
    setElegida(null)
    setVista(false)
    setContestadas([])
    setFin(false)
    window.scrollTo(0, 0)
  }

  if (fin) {
    const comun = {
      titulo,
      planteadas: sesion.length,
      repetir: (rep: ItemSesion[]) => empezar(barajar(rep)),
      volver,
      rotuloNuevo,
    }
    return mixta ? (
      <ResultadoMixto {...comun} contestadas={contestadas} />
    ) : (
      <Resultado
        {...comun}
        respuestas={contestadas.filter(esRespuesta)}
        extra={extraResultado?.(contestadas.filter(esRespuesta))}
      />
    )
  }

  const item = sesion[i]

  function siguiente() {
    if (i + 1 >= sesion.length) {
      setFin(true)
    } else {
      setI(i + 1)
      setElegida(null)
      setVista(false)
    }
    window.scrollTo(0, 0)
  }

  function terminar() {
    if (contestadas.length === 0) volver()
    else setFin(true)
    window.scrollTo(0, 0)
  }

  const terminarAqui = (
    <button className="btn btn-peq" onClick={terminar}>
      Terminar aquí
    </button>
  )
  const barra = (hechas: number) => (
    <div className="barra" style={{ marginTop: '0.35rem' }}>
      <i style={{ width: `${(hechas / sesion.length) * 100}%` }} />
    </div>
  )

  if (esTarjeta(item)) {
    const t = item.tarjeta
    const valorar = (resultado: ResultadoTarjeta) => {
      // Lo mismo que el repaso del tema: repaso espaciado y lista de falladas.
      registrarTarjeta(t.id, resultado)
      setContestadas((cs) => [...cs, { item, resultado }])
      siguiente()
    }
    return (
      <div className="mixto">
        <h1>{titulo}</h1>

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
            {terminarAqui}
          </div>
          {barra(i)}
        </div>

        <TarjetaGiro
          key={`t-${i}-${t.id}`}
          item={item}
          vista={vista}
          girar={() => setVista(true)}
          valorar={valorar}
        />
      </div>
    )
  }

  // Ya no es una tarjeta: las funciones de abajo no heredan el estrechamiento
  const actual: ItemMixto = item
  const p = actual.pregunta
  const respondida = elegida !== null

  function elegir(n: number) {
    if (respondida) return
    setElegida(n)
    setContestadas((cs) => [...cs, { item: actual, elegida: n }])
    // Cuenta igual que en el test del tema: mismo id, mismo registro.
    registrarPregunta(p.id, n === p.correcta)
  }

  return (
    <div className="mixto">
      <h1>{titulo}</h1>

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
          {terminarAqui}
        </div>
        {barra(i + (respondida ? 1 : 0))}
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
            <EnlaceApunte tema={item.tema} apartado={item.apartado} />
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
export function EnlaceApunte({ tema, apartado: ap }: { tema: number; apartado: string | null }) {
  return (
    <p className="mixto-enlace">
      <Link
        to={`/tema/${tema}${ap ? `?ap=${encodeURIComponent(ap)}` : ''}`}
        target="_blank"
        rel="noreferrer"
      >
        {ap ? `Ver el apartado ${ap.replace('/', ', ')} del apunte` : 'Ver el apunte del tema'}
      </Link>
    </p>
  )
}

/** Aciertos y total de cada tema, en orden. */
export function desglose<T>(cosas: T[], tema: (c: T) => number, bien: (c: T) => boolean) {
  const porTema = new Map<number, { aciertos: number; total: number }>()
  for (const c of cosas) {
    const fila = porTema.get(tema(c)) ?? { aciertos: 0, total: 0 }
    fila.total++
    if (bien(c)) fila.aciertos++
    porTema.set(tema(c), fila)
  }
  return [...porTema.entries()].sort((a, b) => a[0] - b[0])
}

/** La tabla «por tema» del resultado. */
export function TablaDesglose({
  filas,
  aciertos,
  total,
  rotuloAciertos = 'Aciertos',
}: {
  filas: [number, { aciertos: number; total: number }][]
  aciertos: number
  total: number
  rotuloAciertos?: string
}) {
  const pct = Math.round((aciertos / total) * 100)
  return (
    <div className="md-tabla">
      <table className="mixto-desglose">
        <thead>
          <tr>
            <th>Tema</th>
            <th>{rotuloAciertos}</th>
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
  )
}

/* ------------------------------------------------------------------ */

/** La pregunta fallada, con lo marcado y lo correcto. */
function PreguntaFallada({ item, elegida }: Respuesta) {
  const p = item.pregunta
  return (
    <li className="tarjeta" data-tema={item.tema}>
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
      <EnlaceApunte tema={item.tema} apartado={item.apartado} />
    </li>
  )
}

/** Acierto +1, error -1/4, sobre 10 puntos: el criterio real. */
const notaDe = (aciertos: number, total: number) =>
  Math.max(0, ((aciertos - (total - aciertos) / 4) / total) * 10)

interface PropsResultado {
  titulo: string
  planteadas: number
  repetir: (items: ItemSesion[]) => void
  volver: () => void
  rotuloNuevo: string
}

function Resultado({
  titulo,
  respuestas,
  planteadas,
  repetir,
  volver,
  rotuloNuevo,
  extra,
}: PropsResultado & { respuestas: Respuesta[]; extra?: ReactNode }) {
  const total = respuestas.length
  const aciertos = respuestas.filter(acierta).length
  const pct = Math.round((aciertos / total) * 100)
  const nota = notaDe(aciertos, total)

  const filas = desglose(respuestas, (r) => r.item.tema, acierta)
  const falladas = respuestas.filter((r) => !acierta(r))

  return (
    <div className="mixto">
      <h1>{titulo}: resultado</h1>

      <div className="tarjeta" style={{ textAlign: 'center' }}>
        <p className="mixto-nota">
          {aciertos} / {total}
        </p>
        <p className="contador" style={{ marginTop: 0 }}>
          {pct}% de aciertos · nota con penalización de 1/4: <b>{nota.toFixed(2)}</b> sobre 10
          {total < planteadas && ` · contestadas ${total} de ${planteadas}`}
        </p>
        {extra}
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
            {rotuloNuevo}
          </button>
        </div>
      </div>

      <h2>Por tema</h2>
      <TablaDesglose filas={filas} aciertos={aciertos} total={total} />

      <h2>Falladas ({falladas.length})</h2>
      {falladas.length === 0 ? (
        <p className="vacio">Ninguna. Todo bien.</p>
      ) : (
        <ul className="mixto-falladas">
          {falladas.map((r) => (
            <PreguntaFallada key={r.item.pregunta.id} {...r} />
          ))}
        </ul>
      )}
    </div>
  )
}

/** «3/5», o una raya si no hubo ninguna */
const fraccion = (bien: number, total: number) => (total ? `${bien}/${total}` : '–')

/**
 * El resultado de «Test + tarjetas»: los aciertos de test (con su nota) y las
 * tarjetas sabidas, cada cosa por su lado, y las dos por tema.
 */
function ResultadoMixto({
  titulo,
  contestadas,
  planteadas,
  repetir,
  volver,
  rotuloNuevo,
}: PropsResultado & { contestadas: Contestada[] }) {
  const preguntas = contestadas.filter(esRespuesta)
  const tarjetas = contestadas.filter(esValoracion)
  const aciertos = preguntas.filter(acierta).length
  const sabidas = tarjetas.filter(sabida).length
  const falladas = preguntas.filter((r) => !acierta(r))
  const noSabidas = tarjetas.filter((v) => !sabida(v))
  const aRepetir = falladas.length + noSabidas.length

  const test = new Map(desglose(preguntas, (r) => r.item.tema, acierta))
  const tarj = new Map(desglose(tarjetas, (v) => v.item.tema, sabida))
  const temas = [...new Set([...test.keys(), ...tarj.keys()])].sort((a, b) => a - b)
  const celda = (clase: string, f?: { aciertos: number; total: number }) => (
    <td className="num" data-clase={clase} data-bien={f?.aciertos ?? 0} data-total={f?.total ?? 0}>
      {fraccion(f?.aciertos ?? 0, f?.total ?? 0)}
    </td>
  )

  return (
    <div className="mixto">
      <h1>{titulo}: resultado</h1>

      <div className="tarjeta" style={{ textAlign: 'center' }}>
        <div className="mixto-partes">
          <div data-parte="test">
            <p className="mixto-nota" data-bien={aciertos} data-total={preguntas.length}>
              {aciertos} / {preguntas.length}
            </p>
            <p className="contador" style={{ margin: 0 }}>
              aciertos de test
              {preguntas.length > 0 && (
                <>
                  {' '}
                  · {Math.round((aciertos / preguntas.length) * 100)}% · nota con penalización de
                  1/4: <b>{notaDe(aciertos, preguntas.length).toFixed(2)}</b> sobre 10
                </>
              )}
            </p>
          </div>
          <div data-parte="tarjetas">
            <p className="mixto-nota" data-bien={sabidas} data-total={tarjetas.length}>
              {sabidas} / {tarjetas.length}
            </p>
            <p className="contador" style={{ margin: 0 }}>
              tarjetas sabidas · <span data-no-sabidas={noSabidas.length}>{noSabidas.length}</span>{' '}
              no {noSabidas.length === 1 ? 'sabida' : 'sabidas'}
            </p>
          </div>
        </div>
        {contestadas.length < planteadas && (
          <p className="contador" style={{ margin: '0.5rem 0 0' }}>
            Contestadas {contestadas.length} de {planteadas}
          </p>
        )}
        <div className="botones" style={{ justifyContent: 'center', marginTop: '1rem' }}>
          <button
            className="btn btn-pri"
            disabled={aRepetir === 0}
            onClick={() => repetir([...falladas.map((r) => r.item), ...noSabidas.map((v) => v.item)])}
          >
            Repetir solo las falladas ({aRepetir})
          </button>
          <button className="btn" onClick={() => repetir(contestadas.map((c) => c.item))}>
            Repetir el mismo test
          </button>
          <button className="btn" onClick={volver}>
            {rotuloNuevo}
          </button>
        </div>
      </div>

      <h2>Por tema</h2>
      <div className="md-tabla">
        <table className="mixto-desglose mixto-desglose-doble">
          <thead>
            <tr>
              <th>Tema</th>
              <th>Test</th>
              <th>Tarjetas</th>
            </tr>
          </thead>
          <tbody>
            {temas.map((tema) => (
              <tr key={tema} data-tema={tema}>
                <td>
                  <b>Tema {tema}</b>
                  <span className="item-meta mixto-titulo">{TITULO.get(tema)}</span>
                </td>
                {celda('test', test.get(tema))}
                {celda('tarjetas', tarj.get(tema))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              {celda('test', { aciertos, total: preguntas.length })}
              {celda('tarjetas', { aciertos: sabidas, total: tarjetas.length })}
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="contador" style={{ margin: '0.4rem 0 0' }}>
        Test: aciertos de las contestadas. Tarjetas: «Bien» o «Fácil» de las valoradas.
      </p>

      <h2>Falladas y no sabidas ({aRepetir})</h2>
      {aRepetir === 0 ? (
        <p className="vacio">Ninguna. Todo bien.</p>
      ) : (
        <ul className="mixto-falladas">
          {falladas.map((r) => (
            <PreguntaFallada key={r.item.pregunta.id} {...r} />
          ))}
          {noSabidas.map(({ item }) => (
            <li key={item.tarjeta.id} className="tarjeta" data-tema={item.tema} data-tarjeta>
              <p className="contador mixto-titulo" style={{ margin: 0 }}>
                Tema {item.tema}. {TITULO.get(item.tema)}
              </p>
              <p className="contador" style={{ margin: '0.2rem 0 0' }}>
                Tarjeta no sabida
              </p>
              <div style={{ fontWeight: 600 }}>
                <Markdown>{item.tarjeta.anverso}</Markdown>
              </div>
              <div className="mixto-buena">
                <Markdown>{item.tarjeta.reverso}</Markdown>
              </div>
              <EnlaceApunte tema={item.tema} apartado={item.apartado} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
