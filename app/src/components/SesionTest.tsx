import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { TEMAS } from '../content'
import Markdown from './Markdown'
import Figura from './figuras/Figura'
import AvisoPenalizacion from './AvisoPenalizacion'
import { registrarPregunta } from '../lib/progreso'
import { barajar, type ItemMixto } from '../lib/mixto'

/**
 * La sesion de preguntas sueltas de varios temas y su resultado: la del test
 * mixto y la del test de falladas, que se corrigen igual.
 */

const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f']
export const TITULO = new Map(TEMAS.map((t) => [t.numero, t.titulo]))

export interface Respuesta {
  item: ItemMixto
  elegida: number
}

const acierta = (r: Respuesta) => r.elegida === r.item.pregunta.correcta

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
  items: ItemMixto[]
  volver: () => void
  /** Boton del resultado que vuelve a la seleccion */
  rotuloNuevo: string
  /** Lo que se pinta bajo la nota, con las respuestas de la sesion */
  extraResultado?: (respuestas: Respuesta[]) => ReactNode
}) {
  const [sesion, setSesion] = useState<ItemMixto[]>(items)
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState<number | null>(null)
  const [respuestas, setRespuestas] = useState<Respuesta[]>([])
  const [fin, setFin] = useState(false)

  function empezar(nuevos: ItemMixto[]) {
    setSesion(nuevos)
    setI(0)
    setElegida(null)
    setRespuestas([])
    setFin(false)
    window.scrollTo(0, 0)
  }

  if (fin) {
    return (
      <Resultado
        titulo={titulo}
        respuestas={respuestas}
        planteadas={sesion.length}
        repetir={(rep) => empezar(barajar(rep))}
        volver={volver}
        rotuloNuevo={rotuloNuevo}
        extra={extraResultado?.(respuestas)}
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
    if (i + 1 >= sesion.length) {
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

function Resultado({
  titulo,
  respuestas,
  planteadas,
  repetir,
  volver,
  rotuloNuevo,
  extra,
}: {
  titulo: string
  respuestas: Respuesta[]
  planteadas: number
  repetir: (items: ItemMixto[]) => void
  volver: () => void
  rotuloNuevo: string
  extra?: ReactNode
}) {
  const total = respuestas.length
  const aciertos = respuestas.filter(acierta).length
  const errores = total - aciertos
  const pct = Math.round((aciertos / total) * 100)
  // El criterio real: acierto +1, error -1/4, sobre 10 puntos.
  const nota = Math.max(0, ((aciertos - errores / 4) / total) * 10)

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
                <EnlaceApunte tema={item.tema} apartado={item.apartado} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
