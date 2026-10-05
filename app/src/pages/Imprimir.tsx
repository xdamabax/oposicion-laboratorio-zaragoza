import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { TEMAS, getTema } from '../content'
import Markdown from '../components/Markdown'
import Figura from '../components/figuras/Figura'
import type { TemaVista } from '../types'
import {
  CLAVE_DE_LA_DESCARGA,
  MARGENES_MM,
  OPCIONES_CUESTIONARIO_POR_DEFECTO,
  claveCuestionario,
  escalaRenglon,
  leerDescarga,
  leerOpcionesCuestionario,
  leerOpcionesTemario,
  versionDelTema,
  type Letra,
  type Margenes,
} from '../editor/almacen'
import { prepararCuestionario, type PreguntaPreparada } from '../editor/cuestionario'

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
 * Ninguna tabla mas ancha que el papel. Si algo se sale de la caja de
 * impresion, Chrome no lo corta: ENCOGE EL DOCUMENTO ENTERO hasta que quepa.
 * Asi salian a 7,5 pt en vez de 11 los PDF de los temas 15, 18, 19, 28 y 31
 * (una tabla de muchas columnas) y el temario completo entero. Aqui se mide el
 * ancho minimo de cada tabla (el de su palabra mas larga por columna) y, solo
 * si no cabe, se le pone .md-tabla-ancha, que deja partir las palabras de sus
 * celdas (styles.css). A las que caben no se les toca nada: dejar partir las de
 * todas cambiaria el reparto de columnas de todas.
 *
 * Se repite en cada pintado (la vista previa cambia sin recargar), y en dos
 * pasadas, primero todas a su minimo y luego leer todos los anchos, para no
 * recalcular la pagina una vez por tabla: el temario tiene 568.
 */
function useTablasAnchas(anchoMm: number) {
  useLayoutEffect(() => {
    const tablas = [...document.querySelectorAll<HTMLTableElement>('.imp .md table')]
    for (const t of tablas) {
      t.classList.remove('md-tabla-ancha')
      t.style.width = 'min-content'
    }
    const anchos = tablas.map((t) => t.getBoundingClientRect().width)
    const caja = (anchoMm * 96) / 25.4
    tablas.forEach((t, i) => {
      t.style.width = ''
      if (anchos[i] > caja + 1) t.classList.add('md-tabla-ancha')
    })
  })
}

/** El ancho de la caja de impresion, en mm, con unos margenes dados. */
const anchoCaja = (margenes: Margenes) => 210 - 2 * MARGENES_MM[margenes].lateral

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
 * Un apunte en la hoja de impresion. Sin nada mas, el original con las
 * opciones de siempre. El editor de un tema le pasa su Markdown (ya sin las
 * secciones ocultas); el temario completo, la version de cada tema y las
 * secciones que hay que quitarle.
 */
function ApunteImpreso({
  tema,
  md,
  ocultas,
  fuentes = true,
  escala = 1,
}: {
  tema: TemaVista
  md?: string
  ocultas?: readonly string[]
  fuentes?: boolean
  escala?: number
}) {
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
          <Markdown escala={escala} ocultas={ocultas}>
            {md ?? tema.apunte.cuerpo}
          </Markdown>
          {fuentes && (
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

/* ---------- lo comun a las descargas preparadas ---------- */

/** ?edicion=1: imprimir lo preparado en el editor o en el panel. vista=1: dentro del marco de la vista previa. */
function useModo() {
  const [params] = useSearchParams()
  return { edicion: params.get('edicion') === '1', vista: params.get('vista') === '1' }
}

/**
 * Lee lo guardado y lo vuelve a leer cuando cambia. El evento storage llega a
 * las demas pestañas y marcos de la web, que es como se refresca la vista
 * previa sin recargar. `relevante` decide que claves le importan a esta vista.
 */
function useAlmacen<T>(activo: boolean, leer: () => T, relevante: (clave: string) => boolean): T | null {
  const [valor, setValor] = useState(() => (activo ? leer() : null))
  const ultimos = useRef({ leer, relevante })
  ultimos.current = { leer, relevante }
  useEffect(() => {
    if (!activo) return
    const alCambiar = (e: StorageEvent) => {
      if (e.key === null || ultimos.current.relevante(e.key)) setValor(ultimos.current.leer())
    }
    window.addEventListener('storage', alCambiar)
    return () => window.removeEventListener('storage', alCambiar)
  }, [activo])
  return valor
}

/**
 * Letra y margenes de la descarga. La letra escala los tamaños en pt de la hoja
 * de impresion (--imp-escala) y tambien los que van en rem (las tablas), por eso
 * toca el tamaño de letra raiz del documento: esta vista es una pestaña (o un
 * marco) aparte, no la app.
 */
function EstiloDescarga({ letra, margenes, vista }: { letra: Letra; margenes: Margenes; vista: boolean }) {
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

/* ---------- Un tema ---------- */

export function ImprimirTema() {
  const { numero } = useParams()
  const tema = getTema(Number(numero))
  const { edicion, vista } = useModo()
  // la descarga que ha preparado el editor para este tema
  const leida = useAlmacen(edicion, leerDescarga, (k) => k === CLAVE_DE_LA_DESCARGA)
  const descarga = leida && leida.tema === Number(numero) ? leida : undefined
  useAjustarAlMarco(vista)
  useTablasAnchas(anchoCaja(descarga?.opciones.margenes ?? 'normales'))
  usePreparar(tema ? `Tema ${tema.numero} - Apuntes` : 'Tema no encontrado')

  if (!tema) return <p>No existe el tema {numero}.</p>

  return (
    <div className={vista ? 'imp imp-vista' : 'imp'}>
      {descarga && (
        <EstiloDescarga letra={descarga.opciones.letra} margenes={descarga.opciones.margenes} vista={vista} />
      )}
      {!vista && <NotaDialogo />}
      <Cabecera subtitulo="Apuntes" />
      <ApunteImpreso
        tema={tema}
        md={descarga?.md}
        fuentes={descarga ? descarga.opciones.fuentes : true}
        escala={descarga ? escalaRenglon(descarga.opciones) : 1}
      />
    </div>
  )
}

/* ---------- Temario completo ---------- */

/**
 * Con ?edicion=1, el temario preparado en su panel: los temas elegidos, cada
 * uno en su version (su edicion, si la hay, menos las secciones ocultas en su
 * editor), y portada, indice, letra, margenes y fuentes del documento entero.
 */
export function ImprimirTemario() {
  const { edicion, vista } = useModo()
  const opciones = useAlmacen(edicion, leerOpcionesTemario, (k) => k.startsWith('descarga:'))
  useAjustarAlMarco(vista)
  useTablasAnchas(anchoCaja(opciones?.margenes ?? 'normales'))
  usePreparar('Temario completo - Apuntes')

  const conApunte = TEMAS.filter((t) => t.apunte)
  const elegidos = opciones ? conApunte.filter((t) => !opciones.excluidos.includes(t.numero)) : conApunte
  // el indice de siempre lista los 40; el preparado, solo los que entran
  const enIndice = opciones ? elegidos : TEMAS
  const escala = opciones ? escalaRenglon(opciones) : 1

  return (
    <div className={vista ? 'imp imp-vista' : 'imp'}>
      {opciones && <EstiloDescarga letra={opciones.letra} margenes={opciones.margenes} vista={vista} />}
      {!vista && <NotaDialogo />}
      {(!opciones || opciones.portada) && (
        <section className="imp-portada">
          <p className="imp-portada-sup">Oposición · Ayuntamiento de Zaragoza</p>
          <h1>{opciones ? opciones.titulo : 'Técnica/o Auxiliar de Laboratorio'}</h1>
          <p className="imp-portada-sub">{opciones ? opciones.subtitulo : 'Apuntes del temario completo'}</p>
          <p className="imp-portada-pie">
            {opciones && elegidos.length < conApunte.length
              ? `${elegidos.length} de 40 temas`
              : `40 temas · ${conApunte.length} con apunte redactado`}
            <br />
            BOPZ núm. 170, de 27 de julio de 2026, anuncio núm. 5077
            <br />
            Generado el {hoy()}
          </p>
        </section>
      )}

      {(!opciones || opciones.indice) && (
        <section className="imp-indice">
          <h2>Índice</h2>
          <ol className="imp-indice-lista">
            {enIndice.map((t) => (
              <li key={t.numero} value={t.numero}>
                <span className="imp-indice-txt">{t.titulo}</span>
                <span className="imp-indice-estado">
                  {t.apunte ? (t.apunte.estado === 'aprobado' ? 'Aprobado' : 'Borrador') : '—'}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {elegidos.map((t) => {
        if (!opciones) return <ApunteImpreso key={t.numero} tema={t} />
        const v = versionDelTema(t.numero, t.apunte!.cuerpo)
        return (
          <ApunteImpreso key={t.numero} tema={t} md={v.md} ocultas={v.ocultas} fuentes={opciones.fuentes} escala={escala} />
        )
      })}
    </div>
  )
}

/* ---------- Test de un tema ---------- */

function PreguntaImpresa({ q }: { q: PreguntaPreparada }) {
  return (
    <li className="imp-pregunta">
      <div className="imp-enunciado">
        <b>{q.numero}.</b> {q.pregunta}
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

/**
 * El cuestionario sale siempre de prepararCuestionario (editor/cuestionario.ts):
 * con las opciones de siempre, todas las preguntas en su orden; con ?edicion=1,
 * lo elegido en su panel (preguntas, orden, opciones barajadas con la letra
 * correcta recalculada, soluciones...). El Word usa la misma funcion.
 */
export function ImprimirTest() {
  const { numero } = useParams()
  const tema = getTema(Number(numero))
  const { edicion, vista } = useModo()
  const n = Number(numero)
  const guardadas = useAlmacen(edicion, () => leerOpcionesCuestionario(n), (k) => k === claveCuestionario(n))
  const o = guardadas ?? OPCIONES_CUESTIONARIO_POR_DEFECTO
  useAjustarAlMarco(vista)
  useTablasAnchas(anchoCaja(o.margenes))
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

  const { test, supuestos, todas } = prepararCuestionario(repaso, o)
  const enSupuestos = supuestos.reduce((m, x) => m + x.preguntas.length, 0)
  // Sin preparar, el texto de siempre. Preparado, el primer ejercicio solo si queda alguna pregunta.
  const conTest = !guardadas || test.length > 0

  return (
    <div className={vista ? 'imp imp-vista' : 'imp'}>
      {guardadas && <EstiloDescarga letra={o.letra} margenes={o.margenes} vista={vista} />}
      {!vista && <NotaDialogo />}
      <Cabecera subtitulo="Cuestionario para hacer en papel" />

      <h1>
        Tema {tema.numero}. {tema.titulo}
      </h1>

      <p className="imp-instrucciones">
        {conTest && (
          <>
            <b>{test.length} preguntas de tres opciones</b> (formato del primer ejercicio)
          </>
        )}
        {supuestos.length > 0 && (
          <>
            {conTest ? (
              <>
                {' '}
                y{' '}
              </>
            ) : null}
            <b>{enSupuestos} preguntas de supuesto
            práctico con cuatro opciones</b> (formato del segundo ejercicio)
          </>
        )}
        . Cada respuesta errónea descuenta 1/4 del valor de un acierto; las respuestas en blanco no
        penalizan.{o.soluciones ? ' Las soluciones están al final del documento.' : ''}
      </p>

      {conTest && (
        <>
          <h2>Primer ejercicio · preguntas de tres opciones</h2>
          <ol className="imp-preguntas">
            {test.map((q) => (
              <PreguntaImpresa key={q.id} q={q} />
            ))}
          </ol>
        </>
      )}

      {supuestos.map((s) => (
        <section key={s.id} className="imp-supuesto">
          <h2>Segundo ejercicio · {s.titulo}</h2>
          <div className="imp-supuesto-enunciado">
            <Markdown>{s.enunciado}</Markdown>
            {s.figura && <Figura figura={s.figura} incognita />}
          </div>
          <ol className="imp-preguntas">
            {s.preguntas.map((q) => (
              <PreguntaImpresa key={q.id} q={q} />
            ))}
          </ol>
        </section>
      ))}

      {o.soluciones && (
        <section className="imp-soluciones">
          <h2>Soluciones</h2>
          <ol className="imp-lista-soluciones">
            {todas.map((q) => (
              <li key={q.id}>
                <b>
                  {q.numero}. {LETRAS[q.correcta]})
                </b>{' '}
                {q.opciones[q.correcta]}
                {o.explicaciones && q.explicacion && <div className="imp-explica">{q.explicacion}</div>}
                {o.fuentes && q.fuente && <div className="imp-fuente">{q.fuente}</div>}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
