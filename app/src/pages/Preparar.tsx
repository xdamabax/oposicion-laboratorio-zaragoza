import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { TEMAS, getTema } from '../content'
import {
  guardarOpcionesCuestionario,
  guardarOpcionesTemario,
  leerOpcionesCuestionario,
  leerOpcionesTemario,
  versionDelTema,
  type Letra,
  type Margenes,
  type OpcionesCuestionario,
  type OpcionesTemario,
} from '../editor/almacen'
import { opcionesFijas, prepararCuestionario } from '../editor/cuestionario'

/**
 * Los paneles para preparar el temario completo y el cuestionario de un tema.
 *
 * No son editores de texto:
 *   - el temario JUNTA la version de cada tema, que se edita en su propio
 *     editor (#/editar/tema/N); aqui se elige que temas entran y lo que es del
 *     documento entero (portada, indice, letra, margenes, fuentes);
 *   - el cuestionario son datos con plantilla (la opcion correcta de cada
 *     pregunta): se eligen preguntas, orden y que sale, pero no se reescribe
 *     texto, para que ninguna solucion pueda quedar apuntando a otra opcion.
 * Las dos descargas salen de las vistas de impresion de siempre con ?edicion=1,
 * y el Word de las mismas funciones (editor/word.tsx).
 */

/* ---------- piezas comunes ---------- */

function useGuardado<T>(inicial: () => T, guardar: (o: T) => string | null) {
  const [opciones, setOpciones] = useState<T>(inicial)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    setError(guardar(opciones))
    // guardar es estable por pagina; basta con las opciones
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opciones])
  const cambiar = (o: Partial<T>) => setOpciones((x) => ({ ...x, ...o }))
  return { opciones, cambiar, error }
}

function OpcionesHoja({ letra, margenes, cambiar }: { letra: Letra; margenes: Margenes; cambiar: (o: { letra?: Letra; margenes?: Margenes }) => void }) {
  return (
    <>
      <label>
        Letra{' '}
        <select value={letra} onChange={(e) => cambiar({ letra: Number(e.target.value) as Letra })}>
          <option value={10}>10 pt</option>
          <option value={11}>11 pt (normal)</option>
          <option value={12}>12 pt</option>
        </select>
      </label>
      <label>
        Márgenes{' '}
        <select value={margenes} onChange={(e) => cambiar({ margenes: e.target.value as Margenes })}>
          <option value="estrechos">Estrechos</option>
          <option value="normales">Normales</option>
          <option value="anchos">Anchos</option>
        </select>
      </label>
    </>
  )
}

function VistaPrevia({ ruta, pesada = false }: { ruta: string; pesada?: boolean }) {
  // la del temario completo son 40 temas: se pinta solo si se pide
  const [ver, setVer] = useState(!pesada)
  return (
    <div className="ed-columna ed-previa">
      <p className="ed-previa-titulo">
        Vista previa <span>(sin paginar: las páginas exactas las enseña el diálogo de impresión)</span>
      </p>
      {ver ? (
        <iframe title="Vista previa del PDF" src={`#${ruta}${ruta.includes('?') ? '&' : '?'}edicion=1&vista=1`} />
      ) : (
        <button className="btn" onClick={() => setVer(true)}>
          Mostrar la vista previa (son los 40 temas: tarda unos segundos)
        </button>
      )}
    </div>
  )
}

function descargarBlob(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  document.body.append(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60000)
}

function abrirPDF(ruta: string) {
  window.open(`${window.location.origin}${window.location.pathname}#${ruta}?edicion=1&auto=1`, '_blank', 'noopener')
}

/** Pie con el estado y los dos botones de descarga. */
function Pie({ resumen, error, pdf, word }: { resumen: string; error: string | null; pdf: () => void; word: () => Promise<Blob | void> }) {
  const [estado, setEstado] = useState<'listo' | 'generando' | string>('listo')
  const generar = async () => {
    setEstado('generando')
    try {
      await word()
      setEstado('listo')
    } catch (e) {
      setEstado(`No se ha podido generar el Word: ${e instanceof Error ? e.message : String(e)}`)
    }
  }
  return (
    <div className="ed-pie">
      <span className="ed-estado" role="status">
        {error ? `No se ha podido guardar: ${error}.` : resumen}
      </span>
      {estado !== 'listo' && estado !== 'generando' && (
        <span className="ed-estado-error" role="alert">
          {estado}
        </span>
      )}
      <button className="btn" onClick={generar} disabled={estado === 'generando'}>
        {estado === 'generando' ? 'Generando el Word…' : 'Descargar Word'}
      </button>
      <button className="btn btn-pri" onClick={pdf}>
        Descargar PDF
      </button>
    </div>
  )
}

/* ---------- temario completo ---------- */

export function PrepararTemario() {
  const { opciones: o, cambiar, error } = useGuardado<OpcionesTemario>(leerOpcionesTemario, guardarOpcionesTemario)
  // la version de cada tema se lee al entrar: se edita en otra pagina
  const { temas, versiones } = useMemo(() => {
    const conApunte = TEMAS.filter((t) => t.apunte)
    return { temas: conApunte, versiones: new Map(conApunte.map((t) => [t.numero, versionDelTema(t.numero, t.apunte!.cuerpo)])) }
  }, [])
  const entra = (n: number) => !o.excluidos.includes(n)
  const elegidos = temas.filter((t) => entra(t.numero))
  const editados = temas.filter((t) => versiones.get(t.numero)!.editado).length

  const word = async () => {
    const { generarWordTemario } = await import('../editor/word')
    const blob = await generarWordTemario({
      temas: elegidos.map((t) => ({ tema: t, ...versiones.get(t.numero)! })),
      opciones: o,
    })
    descargarBlob(blob, 'Temario completo - Apuntes.docx')
  }

  return (
    <div className="editor-pagina" data-listo="1">
      <p className="sub">
        <Link to="/">← Inicio</Link>
      </p>
      <h1>Preparar el temario completo</h1>
      <p className="sub">
        Junta la versión de cada tema: si lo has editado, con tus cambios y sin las secciones que quitaste
        en su editor; si no, el apunte original. Para cambiar el texto de un tema, entra en su editor.
      </p>

      <section className="ed-opciones" aria-label="Opciones del documento">
        <OpcionesHoja letra={o.letra} margenes={o.margenes} cambiar={cambiar} />
        <label>
          <input type="checkbox" checked={o.portada} onChange={(e) => cambiar({ portada: e.target.checked })} /> Portada
        </label>
        <label>
          <input type="checkbox" checked={o.indice} onChange={(e) => cambiar({ indice: e.target.checked })} /> Índice
        </label>
        <label>
          <input type="checkbox" checked={o.fuentes} onChange={(e) => cambiar({ fuentes: e.target.checked })} /> Recuadros
          de fuentes
        </label>
        {o.portada && (
          <div className="prep-portada">
            <label>
              Título de la portada <input type="text" value={o.titulo} onChange={(e) => cambiar({ titulo: e.target.value })} />
            </label>
            <label>
              Subtítulo <input type="text" value={o.subtitulo} onChange={(e) => cambiar({ subtitulo: e.target.value })} />
            </label>
          </div>
        )}
      </section>

      <div className="ed-rejilla">
        <div className="ed-columna">
          <div className="prep-cabecera">
            <b>
              Temas ({elegidos.length} de {temas.length})
            </b>
            <button className="btn" onClick={() => cambiar({ excluidos: [] })}>
              Todos
            </button>
            <button className="btn" onClick={() => cambiar({ excluidos: temas.map((t) => t.numero) })}>
              Ninguno
            </button>
          </div>
          <ul className="prep-lista" aria-label="Temas del temario">
            {temas.map((t) => {
              const v = versiones.get(t.numero)!
              return (
                <li key={t.numero} className="prep-fila">
                  <label>
                    <input
                      type="checkbox"
                      checked={entra(t.numero)}
                      onChange={() =>
                        cambiar({ excluidos: entra(t.numero) ? [...o.excluidos, t.numero] : o.excluidos.filter((x) => x !== t.numero) })
                      }
                    />{' '}
                    <b>{t.numero}.</b> {t.titulo}
                  </label>
                  <span className="prep-estado">
                    {v.editado ? 'Con tus cambios' : 'Original'}
                    {v.ocultas.length > 0 && ` · ${v.ocultas.length} sección(es) quitada(s)`}
                    {v.desactualizado && ' · hecha sobre una versión anterior del apunte'}{' '}
                    <Link to={`/editar/tema/${t.numero}`}>Editar</Link>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
        <VistaPrevia ruta="/imprimir/temario" pesada />
      </div>

      <Pie
        resumen={`${elegidos.length} temas · ${editados} con tus cambios`}
        error={error}
        pdf={() => abrirPDF('/imprimir/temario')}
        word={word}
      />
    </div>
  )
}

/* ---------- cuestionario de un tema ---------- */

export function PrepararTest() {
  const { numero } = useParams()
  const tema = getTema(Number(numero))
  if (!tema?.repaso) {
    return (
      <p>
        El tema {numero} no tiene preguntas. <Link to="/temas">Volver al temario</Link>
      </p>
    )
  }
  return <PanelCuestionario key={tema.numero} numero={tema.numero} />
}

function PanelCuestionario({ numero: n }: { numero: number }) {
  const tema = getTema(n)!
  const repaso = tema.repaso!
  const { opciones: o, cambiar, error } = useGuardado<OpcionesCuestionario>(
    () => leerOpcionesCuestionario(n),
    (x) => guardarOpcionesCuestionario(n, x),
  )
  const preparado = useMemo(() => prepararCuestionario(repaso, o), [repaso, o])
  const entra = (id: string) => !o.excluidas.includes(id)
  const alternar = (ids: string[], dentro: boolean) =>
    cambiar({ excluidas: dentro ? [...new Set([...o.excluidas, ...ids])] : o.excluidas.filter((x) => !ids.includes(x)) })
  const todas = [...repaso.test, ...repaso.supuestos.flatMap((s) => s.preguntas)]
  const fijas = todas.filter(opcionesFijas).length

  const word = async () => {
    const { generarWordCuestionario } = await import('../editor/word')
    const blob = await generarWordCuestionario({ tema, preparado, opciones: o })
    descargarBlob(blob, `Tema ${String(n).padStart(2, '0')} - Cuestionario.docx`)
  }

  const fila = (id: string, texto: string) => (
    <li key={id} className="prep-fila">
      <label>
        <input type="checkbox" checked={entra(id)} onChange={() => alternar([id], entra(id))} /> {texto}
      </label>
    </li>
  )

  return (
    <div className="editor-pagina" data-listo="1">
      <p className="sub">
        <Link to={`/tema/${n}?vista=test`}>← Tema {n}</Link>
      </p>
      <h1>Preparar el cuestionario · Tema {n}</h1>
      <p className="sub">
        Elige qué preguntas entran, en qué orden y qué sale en las soluciones. El texto de las preguntas no se
        edita: cada una lleva su respuesta correcta, y al barajar las opciones la letra de la solución se
        recalcula con ellas.
      </p>

      <section className="ed-opciones" aria-label="Opciones del cuestionario">
        <OpcionesHoja letra={o.letra} margenes={o.margenes} cambiar={cambiar} />
        <label>
          Orden{' '}
          <select value={o.orden} onChange={(e) => cambiar({ orden: e.target.value as OpcionesCuestionario['orden'] })}>
            <option value="original">El del tema</option>
            <option value="barajado">Barajado</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={o.barajarOpciones} onChange={(e) => cambiar({ barajarOpciones: e.target.checked })} />{' '}
          Barajar las opciones
        </label>
        {(o.orden === 'barajado' || o.barajarOpciones) && (
          <button className="btn" onClick={() => cambiar({ semilla: Math.floor(Math.random() * 2 ** 31) + 1 })}>
            Barajar de nuevo
          </button>
        )}
        <label>
          <input type="checkbox" checked={o.soluciones} onChange={(e) => cambiar({ soluciones: e.target.checked })} />{' '}
          Soluciones al final
        </label>
        <label>
          <input
            type="checkbox"
            checked={o.explicaciones}
            disabled={!o.soluciones}
            onChange={(e) => cambiar({ explicaciones: e.target.checked })}
          />{' '}
          con su explicación
        </label>
        <label>
          <input type="checkbox" checked={o.fuentes} disabled={!o.soluciones} onChange={(e) => cambiar({ fuentes: e.target.checked })} />{' '}
          y su fuente
        </label>
        {o.barajarOpciones && fijas > 0 && (
          <p className="prep-nota">
            {fijas} de las {todas.length} preguntas conservan el orden de sus opciones: una opción se refiere a
            otras («las dos anteriores…») o la explicación cita una letra.
          </p>
        )}
      </section>

      <div className="ed-rejilla">
        <div className="ed-columna">
          {repaso.test.length > 0 && (
            <>
              <div className="prep-cabecera">
                <b>
                  Primer ejercicio ({repaso.test.filter((q) => entra(q.id)).length} de {repaso.test.length})
                </b>
                <button className="btn" onClick={() => alternar(repaso.test.map((q) => q.id), false)}>
                  Todas
                </button>
                <button className="btn" onClick={() => alternar(repaso.test.map((q) => q.id), true)}>
                  Ninguna
                </button>
              </div>
              <ul className="prep-lista" aria-label="Preguntas del primer ejercicio">
                {repaso.test.map((q, i) => (
                  fila(q.id, `${i + 1}. ${q.pregunta}`)
                ))}
              </ul>
            </>
          )}
          {repaso.supuestos.map((s) => {
            const ids = s.preguntas.map((q) => q.id)
            const dentro = ids.filter(entra).length
            return (
              <div key={s.id}>
                <div className="prep-cabecera">
                  <label>
                    <input type="checkbox" checked={dentro > 0} onChange={() => alternar(ids, dentro > 0)} />{' '}
                    <b>
                      Supuesto · {s.titulo} ({dentro} de {ids.length})
                    </b>
                  </label>
                </div>
                <ul className="prep-lista prep-lista-corta" aria-label={`Preguntas del supuesto ${s.titulo}`}>
                  {s.preguntas.map((q, i) => (
                    fila(q.id, `${i + 1}. ${q.pregunta}`)
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
        <VistaPrevia ruta={`/imprimir/test/${n}`} />
      </div>

      <Pie
        resumen={`${preparado.todas.length} preguntas${o.orden === 'barajado' ? ' · orden barajado' : ''}${o.barajarOpciones ? ' · opciones barajadas' : ''}`}
        error={error}
        pdf={() => abrirPDF(`/imprimir/test/${n}`)}
        word={word}
      />
    </div>
  )
}
