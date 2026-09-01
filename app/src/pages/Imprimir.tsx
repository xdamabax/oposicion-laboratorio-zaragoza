import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { TEMAS, getTema } from '../content'
import Markdown from '../components/Markdown'
import Figura from '../components/figuras/Figura'
import type { PreguntaTest, TemaVista } from '../types'

const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f']

function hoy(): string {
  return new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

/**
 * Prepara el documento para imprimir: pone el titulo (que el navegador usa como
 * nombre del PDF), marca data-listo para que el script de exportacion sepa que
 * puede capturar, y lanza el dialogo de impresion si se pidio con ?auto=1.
 */
function usePreparar(titulo: string) {
  const [params] = useSearchParams()
  const auto = params.get('auto') === '1'

  useEffect(() => {
    const previo = document.title
    document.title = titulo
    document.body.setAttribute('data-listo', '1')

    let id: number | undefined
    if (auto) id = window.setTimeout(() => window.print(), 400)

    return () => {
      document.title = previo
      document.body.removeAttribute('data-listo')
      if (id) window.clearTimeout(id)
    }
  }, [titulo, auto])
}

function Cabecera({ subtitulo }: { subtitulo: string }) {
  return (
    <div className="imp-cabecera">
      <div>
        <b>Técnica/o Auxiliar de Laboratorio</b> · Ayuntamiento de Zaragoza
        <br />
        <span>{subtitulo}</span>
      </div>
      <div className="imp-fecha">Generado el {hoy()}</div>
    </div>
  )
}

function ApunteImpreso({ tema }: { tema: TemaVista }) {
  return (
    <section className="imp-tema">
      <h1>
        Tema {tema.numero}. {tema.titulo}
      </h1>
      {tema.apunte ? (
        <>
          {tema.apunte.estado === 'borrador' && (
            <p className="imp-aviso">Borrador pendiente de revisión.</p>
          )}
          <Markdown>{tema.apunte.cuerpo}</Markdown>
          <div className="imp-fuentes">
            <b>Fuentes y verificación</b>
            <ul>
              {tema.apunte.fuentes.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {tema.apunte.verificado && <p>Verificado el {tema.apunte.verificado}.</p>}
          </div>
        </>
      ) : (
        <p className="imp-aviso">Este tema todavía no tiene apunte redactado.</p>
      )}
    </section>
  )
}

/* ---------- Un tema ---------- */

export function ImprimirTema() {
  const { numero } = useParams()
  const tema = getTema(Number(numero))
  usePreparar(tema ? `Tema ${tema.numero} - Apuntes` : 'Tema no encontrado')

  if (!tema) return <p>No existe el tema {numero}.</p>

  return (
    <div className="imp">
      <Cabecera subtitulo="Apuntes" />
      <ApunteImpreso tema={tema} />
    </div>
  )
}

/* ---------- Temario completo ---------- */

export function ImprimirTemario() {
  usePreparar('Temario completo - Apuntes')

  const conApunte = TEMAS.filter((t) => t.apunte)

  return (
    <div className="imp">
      <section className="imp-portada">
        <p className="imp-portada-sup">Oposición · Ayuntamiento de Zaragoza</p>
        <h1>Técnica/o Auxiliar de Laboratorio</h1>
        <p className="imp-portada-sub">Apuntes del temario completo</p>
        <p className="imp-portada-pie">
          40 temas · {conApunte.length} con apunte redactado
          <br />
          BOPZ núm. 170, de 27 de julio de 2026, anuncio núm. 5077
          <br />
          Generado el {hoy()}
        </p>
      </section>

      <section className="imp-indice">
        <h2>Índice</h2>
        <ol className="imp-indice-lista">
          {TEMAS.map((t) => (
            <li key={t.numero} value={t.numero}>
              <span className="imp-indice-txt">{t.titulo}</span>
              <span className="imp-indice-estado">
                {t.apunte ? (t.apunte.estado === 'aprobado' ? 'Aprobado' : 'Borrador') : '—'}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {conApunte.map((t) => (
        <ApunteImpreso key={t.numero} tema={t} />
      ))}
    </div>
  )
}

/* ---------- Test de un tema ---------- */

function PreguntaImpresa({ q, n }: { q: PreguntaTest; n: number }) {
  return (
    <li className="imp-pregunta">
      <div className="imp-enunciado">
        <b>{n}.</b> {q.pregunta}
      </div>
      {q.figura && <Figura figura={q.figura} />}
      <ol className="imp-opciones">
        {q.opciones.map((o, i) => (
          <li key={i}>
            <b>{LETRAS[i]})</b> {o}
          </li>
        ))}
      </ol>
    </li>
  )
}

export function ImprimirTest() {
  const { numero } = useParams()
  const tema = getTema(Number(numero))
  usePreparar(tema ? `Tema ${tema.numero} - Test` : 'Tema no encontrado')

  if (!tema) return <p>No existe el tema {numero}.</p>
  const repaso = tema.repaso

  if (!repaso || (repaso.test.length === 0 && repaso.supuestos.length === 0)) {
    return (
      <div className="imp">
        <Cabecera subtitulo="Test" />
        <h1>
          Tema {tema.numero}. {tema.titulo}
        </h1>
        <p className="imp-aviso">Este tema todavía no tiene preguntas generadas.</p>
      </div>
    )
  }

  // Numeracion continua: primero el test, despues los supuestos.
  let n = 0
  const numeradas = repaso.test.map((q) => ({ q, n: ++n }))
  const supuestos = repaso.supuestos.map((s) => ({
    s,
    preguntas: s.preguntas.map((q) => ({ q, n: ++n })),
  }))
  const todas = [...numeradas, ...supuestos.flatMap((x) => x.preguntas)]

  return (
    <div className="imp">
      <Cabecera subtitulo="Cuestionario para hacer en papel" />

      <h1>
        Tema {tema.numero}. {tema.titulo}
      </h1>

      <p className="imp-instrucciones">
        <b>{repaso.test.length} preguntas de tres opciones</b> (formato del primer ejercicio)
        {supuestos.length > 0 && (
          <>
            {' '}
            y <b>{supuestos.reduce((m, x) => m + x.preguntas.length, 0)} preguntas de supuesto
            práctico con cuatro opciones</b> (formato del segundo ejercicio)
          </>
        )}
        . Cada respuesta errónea descuenta 1/4 del valor de un acierto; las respuestas en blanco no
        penalizan. Las soluciones están al final del documento.
      </p>

      <h2>Primer ejercicio · preguntas de tres opciones</h2>
      <ol className="imp-preguntas">
        {numeradas.map(({ q, n: i }) => (
          <PreguntaImpresa key={q.id} q={q} n={i} />
        ))}
      </ol>

      {supuestos.map(({ s, preguntas }) => (
        <section key={s.id} className="imp-supuesto">
          <h2>Segundo ejercicio · {s.titulo}</h2>
          <div className="imp-supuesto-enunciado">
            <Markdown>{s.enunciado}</Markdown>
            {s.figura && <Figura figura={s.figura} />}
          </div>
          <ol className="imp-preguntas">
            {preguntas.map(({ q, n: i }) => (
              <PreguntaImpresa key={q.id} q={q} n={i} />
            ))}
          </ol>
        </section>
      ))}

      <section className="imp-soluciones">
        <h2>Soluciones</h2>
        <ol className="imp-lista-soluciones">
          {todas.map(({ q, n: i }) => (
            <li key={q.id}>
              <b>
                {i}. {LETRAS[q.correcta]})
              </b>{' '}
              {q.opciones[q.correcta]}
              {q.explicacion && <div className="imp-explica">{q.explicacion}</div>}
              {q.fuente && <div className="imp-fuente">{q.fuente}</div>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
