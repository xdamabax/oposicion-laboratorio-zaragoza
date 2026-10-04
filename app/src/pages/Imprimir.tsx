import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { TEMAS, getTema } from '../content'
import Markdown from '../components/Markdown'
import Figura from '../components/figuras/Figura'
import type { PreguntaTest, TemaVista } from '../types'
import {
  CLAVE_DE_LA_DESCARGA,
  MARGENES_MM,
  escalaRenglon,
  leerDescarga,
  type Descarga,
} from '../editor/almacen'

const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f']

function hoy(): string {
  return new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

/**
 * Espera a que todas las imagenes del documento esten cargadas y decodificadas.
 *
 * Imprimir no es como mirar la pantalla: no hay viewport, y `window.print()`
 * no espera a nada. Una imagen que todavia esta en vuelo sale en blanco en el
 * PDF sin dar ningun error, aunque en pantalla se vea bien.
 *
 * Los pictogramas ya no se piden de forma diferida (ver PictogramaGHS), pero
 * esta espera se queda: vale para cualquier imagen que se anada despues, y es
 * lo que hace que `data-listo` signifique algo. Por si acaso, se fuerza
 * tambien `eager` en lo que llegue marcado como `lazy`.
 */
function imagenesListas(): Promise<unknown> {
  const imagenes = Array.from(document.images)
  for (const img of imagenes) img.loading = 'eager'
  // Una imagen rota no debe dejar el documento sin imprimir: se ignora y sigue.
  return Promise.all(imagenes.map((img) => img.decode().catch(() => undefined)))
}

/**
 * Prepara el documento para imprimir: pone el titulo (que el navegador usa como
 * nombre del PDF), marca data-listo para que el script de exportacion sepa que
 * puede capturar, y lanza el dialogo de impresion si se pidio con ?auto=1.
 *
 * Tanto la marca como el dialogo esperan a las imagenes: data-listo significa
 * «esto ya se puede capturar tal cual», no solo «React ha montado».
 */
function usePreparar(titulo: string) {
  const [params] = useSearchParams()
  const auto = params.get('auto') === '1'

  useEffect(() => {
    const previo = document.title
    document.title = titulo

    let cancelado = false
    let id: number | undefined

    void imagenesListas().then(() => {
      if (cancelado) return
      document.body.setAttribute('data-listo', '1')
      if (auto) id = window.setTimeout(() => window.print(), 400)
    })

    return () => {
      cancelado = true
      document.title = previo
      document.body.removeAttribute('data-listo')
      if (id) window.clearTimeout(id)
    }
  }, [titulo, auto])
}

/**
 * Recordatorio del dialogo de impresion, SOLO EN PANTALLA.
 *
 * El enlace de la web publicada que sale al pie de cada pagina del PDF no lo
 * escribe esta app: lo dibuja el propio navegador cuando la casilla
 * «Encabezados y pies de pagina» esta marcada, que es como viene de fabrica.
 * Ahi pone la URL abajo y el titulo y la fecha arriba. Una pagina no puede
 * apagar esa casilla; lo unico que la desactivaria es dejar los margenes
 * verticales de @page a cero, y eso quitaria el margen de TODAS las paginas
 * menos la primera, que es peor remedio que la enfermedad.
 *
 * Asi que la instruccion se pone donde hace falta y una sola vez: el navegador
 * recuerda la eleccion para las siguientes impresiones.
 *
 * Lleva `no-imprimir`, de modo que la hoja de impresion la oculta: este aviso
 * no sale en el PDF. Comprobado generando el PDF y buscando su texto.
 */
function NotaDialogo() {
  return (
    <p className="imp-nota-dialogo no-imprimir">
      En el diálogo de impresión, abre <b>Más ajustes</b> y desmarca{' '}
      <b>Encabezados y pies de página</b>: es lo que añade la dirección de la web y la fecha a cada
      página. El navegador lo recuerda para las próximas veces. Este recuadro no se imprime.
    </p>
  )
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

/**
 * Lo que cambia la descarga preparada en el editor: el Markdown (ya sin las
 * secciones ocultas), la letra, los margenes y si sale el recuadro de fuentes.
 * Sin ella, el apunte original con las opciones de siempre.
 */
function ApunteImpreso({ tema, descarga }: { tema: TemaVista; descarga?: Descarga }) {
  const opciones = descarga?.opciones
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
          <Markdown escala={opciones ? escalaRenglon(opciones) : 1}>
            {descarga ? descarga.md : tema.apunte.cuerpo}
          </Markdown>
          {(!opciones || opciones.fuentes) && (
            <div className="imp-fuentes">
              <p className="imp-fuentes-titulo">
                <b>Fuentes y verificación</b>
              </p>
              <ul>
                {tema.apunte.fuentes.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              {tema.apunte.verificado && <p>Verificado el {tema.apunte.verificado}.</p>}
            </div>
          )}
        </>
      ) : (
        <p className="imp-aviso">Este tema todavía no tiene apunte redactado.</p>
      )}
    </section>
  )
}

/* ---------- Un tema ---------- */

/**
 * La descarga que ha preparado el editor para este tema, si se pide con
 * ?edicion=1. Se vuelve a leer cuando el editor la cambia: el evento storage
 * llega a las demas pestañas y marcos de la web, que es como se refresca la
 * vista previa sin recargar.
 */
function useDescarga(tema: number): Descarga | undefined {
  const [params] = useSearchParams()
  const pedida = params.get('edicion') === '1'
  const [descarga, setDescarga] = useState(() => (pedida ? leerDescarga() : null))

  useEffect(() => {
    if (!pedida) return
    const alCambiar = (e: StorageEvent) => {
      if (e.key === CLAVE_DE_LA_DESCARGA) setDescarga(leerDescarga())
    }
    window.addEventListener('storage', alCambiar)
    return () => window.removeEventListener('storage', alCambiar)
  }, [pedida])

  return descarga && descarga.tema === tema ? descarga : undefined
}

/**
 * Letra y margenes de la descarga. La letra escala los tamaños en pt de la hoja
 * de impresion (--imp-escala) y tambien los que van en rem (las tablas), por eso
 * toca el tamaño de letra raiz del documento: esta vista es una pestaña (o un
 * marco) aparte, no la app.
 */
function EstiloDescarga({ descarga, vista }: { descarga: Descarga; vista: boolean }) {
  const { letra, margenes } = descarga.opciones
  const m = MARGENES_MM[margenes]

  useEffect(() => {
    if (letra === 11) return
    const raiz = document.documentElement
    const previo = raiz.style.fontSize
    raiz.style.fontSize = `${(16 * letra) / 11}px`
    return () => {
      raiz.style.fontSize = previo
    }
  }, [letra])

  return (
    <style>{`
      .imp { --imp-escala: ${letra / 11}; }
      @media print { @page { margin: ${m.vertical}mm ${m.lateral}mm; } }
      ${vista ? `@media screen { .imp.imp-vista { padding: ${m.vertical}mm ${m.lateral}mm; } }` : ''}
    `}</style>
  )
}

/**
 * En la vista previa, la hoja es un A4 de verdad (210 mm) y se encoge con zoom
 * para que quepa entera en el marco, sea cual sea su ancho.
 */
function useAjustarAlMarco(activo: boolean) {
  useEffect(() => {
    if (!activo) return
    const raiz = document.documentElement
    const MM = 96 / 25.4
    const ajustar = () => {
      raiz.style.zoom = String(Math.min(1, window.innerWidth / (210 * MM + 32)))
    }
    ajustar()
    window.addEventListener('resize', ajustar)
    return () => {
      window.removeEventListener('resize', ajustar)
      raiz.style.zoom = ''
    }
  }, [activo])
}

export function ImprimirTema() {
  const { numero } = useParams()
  const [params] = useSearchParams()
  const tema = getTema(Number(numero))
  const descarga = useDescarga(Number(numero))
  // vista=1: la vista previa del editor, dentro de su marco
  const vista = params.get('vista') === '1'
  useAjustarAlMarco(vista)
  usePreparar(tema ? `Tema ${tema.numero} - Apuntes` : 'Tema no encontrado')

  if (!tema) return <p>No existe el tema {numero}.</p>

  return (
    <div className={vista ? 'imp imp-vista' : 'imp'}>
      {descarga && <EstiloDescarga descarga={descarga} vista={vista} />}
      {!vista && <NotaDialogo />}
      <Cabecera subtitulo="Apuntes" />
      <ApunteImpreso tema={tema} descarga={descarga} />
    </div>
  )
}

/* ---------- Temario completo ---------- */

export function ImprimirTemario() {
  usePreparar('Temario completo - Apuntes')

  const conApunte = TEMAS.filter((t) => t.apunte)

  return (
    <div className="imp">
      <NotaDialogo />
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
      {q.figura && <Figura figura={q.figura} incognita />}
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
        <NotaDialogo />
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
      <NotaDialogo />
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
            {s.figura && <Figura figura={s.figura} incognita />}
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
