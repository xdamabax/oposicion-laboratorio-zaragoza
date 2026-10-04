import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'

import { getTema } from '../content'
import type { TemaVista } from '../types'
import { EXTENSIONES, insertarSalto, moverBloque, quitarBloque } from '../editor/extensiones'
import { docAMarkdown, markdownADoc, secciones, sinSecciones } from '../editor/markdown'
import {
  borrarEdicion,
  guardarDescarga,
  guardarEdicion,
  guardarOpciones,
  huella,
  leerEdicion,
  leerOpciones,
  type Letra,
  type Margenes,
  type OpcionesDescarga,
} from '../editor/almacen'

/**
 * Preparar la descarga de un apunte: un editor visual (TipTap) con el apunte
 * dentro, unas opciones de documento y una vista previa.
 *
 * Lo que se edita aqui NO cambia el apunte de la app: se guarda aparte, en este
 * navegador, y solo se usa para descargar. Ver editor/almacen.ts.
 *
 * El PDF sale de la vista de impresion de siempre (#/imprimir/tema/N), a la que
 * se le pasa con ?edicion=1 el Markdown que sale del editor. Sin tocar nada,
 * ese Markdown es equivalente al original y el PDF es el mismo:
 * scripts/verificar-editor.js lo comprueba en los 40 temas.
 */
export default function Editar() {
  const { numero } = useParams()
  const tema = getTema(Number(numero))

  if (!tema?.apunte) {
    return (
      <p>
        El tema {numero} no tiene apunte que editar. <Link to="/temas">Volver al temario</Link>
      </p>
    )
  }
  // key: al cambiar de tema, editor nuevo
  return <EditorTema key={tema.numero} tema={tema} cuerpo={tema.apunte.cuerpo} />
}

const ESPERA_GUARDADO = 400

function EditorTema({ tema, cuerpo }: { tema: TemaVista; cuerpo: string }) {
  const n = tema.numero
  const base = useMemo(() => huella(cuerpo), [cuerpo])
  // El original tal como vuelve del editor: si el documento da esto, no hay cambios.
  const mdOriginal = useMemo(() => docAMarkdown(markdownADoc(cuerpo)), [cuerpo])

  const [inicial] = useState(() => leerEdicion(n))
  // Huella del original sobre el que esta hecha la edicion que hay en pantalla.
  // Si no es la de ahora, el apunte se actualizo despues: se avisa.
  const [baseEdicion, setBaseEdicion] = useState(inicial?.base ?? base)
  const [opciones, setOpciones] = useState<OpcionesDescarga>(() => leerOpciones(n))
  const [estado, setEstado] = useState<{ cambios: boolean; error: string | null; hora: string } | null>(null)
  const [titulos, setTitulos] = useState<string[]>([])
  const [confirmar, setConfirmar] = useState(false)

  const editor = useEditor({
    extensions: EXTENSIONES,
    content: markdownADoc(inicial?.md ?? cuerpo),
    editorProps: { attributes: { class: 'md ed-doc', lang: 'es', spellcheck: 'true' } },
  })

  /** Guarda la edicion (si hay cambios) y la descarga en curso. */
  const guardar = useCallback(() => {
    if (!editor) return
    const json = editor.getJSON()
    const md = docAMarkdown(json)
    const cambios = md !== mdOriginal
    let error: string | null = null
    if (cambios) error = guardarEdicion(n, { md, base: baseEdicion, guardado: new Date().toISOString() })
    else borrarEdicion(n)
    error ??= guardarOpciones(n, opciones)
    error ??= guardarDescarga({ tema: n, md: docAMarkdown(sinSecciones(json, opciones.ocultas)), opciones })
    setTitulos(secciones(json))
    setEstado({ cambios, error, hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) })
  }, [editor, mdOriginal, n, baseEdicion, opciones])

  // Guardado diferido mientras se escribe; inmediato al cambiar las opciones.
  const temporizador = useRef<number | undefined>(undefined)
  useEffect(() => {
    if (!editor) return
    const alEditar = () => {
      window.clearTimeout(temporizador.current)
      temporizador.current = window.setTimeout(guardar, ESPERA_GUARDADO)
    }
    editor.on('update', alEditar)
    return () => {
      editor.off('update', alEditar)
    }
  }, [editor, guardar])
  useEffect(() => {
    guardar()
  }, [guardar])
  useEffect(() => () => window.clearTimeout(temporizador.current), [])

  const descargarPDF = () => {
    window.clearTimeout(temporizador.current)
    guardar()
    const url = `${window.location.origin}${window.location.pathname}#/imprimir/tema/${n}?edicion=1&auto=1`
    window.open(url, '_blank', 'noopener')
  }

  const volverAlOriginal = () => {
    borrarEdicion(n)
    setBaseEdicion(base)
    editor?.commands.setContent(markdownADoc(cuerpo))
    setConfirmar(false)
    guardar()
  }

  const cambiar = (o: Partial<OpcionesDescarga>) => setOpciones((x) => ({ ...x, ...o }))
  const alternarSeccion = (t: string) =>
    cambiar({ ocultas: opciones.ocultas.includes(t) ? opciones.ocultas.filter((x) => x !== t) : [...opciones.ocultas, t] })

  return (
    <div className="editor-pagina" data-listo={estado ? '1' : undefined}>
      <p className="sub">
        <Link to={`/tema/${n}`}>← Tema {n}</Link>
      </p>
      <h1>Preparar la descarga · Tema {n}</h1>
      <p className="sub">
        Lo que cambies aquí solo vale para descargar: el apunte de la app no se toca. Se guarda en este
        navegador.
      </p>

      {baseEdicion !== base && (
        <div className="aviso ed-aviso" role="alert">
          <b>El apunte original ha cambiado</b> desde que lo editaste. Lo que ves es tu versión, sin las
          novedades.{' '}
          <button className="btn" onClick={() => setBaseEdicion(base)}>
            Seguir con mi versión
          </button>{' '}
          <button className="btn" onClick={volverAlOriginal}>
            Empezar del original nuevo
          </button>
        </div>
      )}

      <section className="ed-opciones" aria-label="Opciones del documento">
        <label>
          Letra{' '}
          <select value={opciones.letra} onChange={(e) => cambiar({ letra: Number(e.target.value) as Letra })}>
            <option value={10}>10 pt</option>
            <option value={11}>11 pt (normal)</option>
            <option value={12}>12 pt</option>
          </select>
        </label>
        <label>
          Márgenes{' '}
          <select value={opciones.margenes} onChange={(e) => cambiar({ margenes: e.target.value as Margenes })}>
            <option value="estrechos">Estrechos</option>
            <option value="normales">Normales</option>
            <option value="anchos">Anchos</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={opciones.fuentes} onChange={(e) => cambiar({ fuentes: e.target.checked })} />{' '}
          Recuadro de fuentes del final
        </label>
        <details className="ed-secciones">
          <summary>
            Secciones ({titulos.length - opciones.ocultas.filter((t) => titulos.includes(t)).length} de {titulos.length})
          </summary>
          {titulos.map((t) => (
            <label key={t}>
              <input type="checkbox" checked={!opciones.ocultas.includes(t)} onChange={() => alternarSeccion(t)} /> {t}
            </label>
          ))}
        </details>
      </section>

      <div className="ed-rejilla">
        <div className="ed-columna">
          {editor && <BarraHerramientas editor={editor} />}
          <EditorContent editor={editor} className="ed-papel" />
          <p className="ed-ayuda">
            Intro: párrafo nuevo · Mayús+Intro: salto de línea · Ctrl+Intro: salto de página · Alt+↑/↓: mover el
            bloque
          </p>
        </div>
        <div className="ed-columna ed-previa">
          <p className="ed-previa-titulo">
            Vista previa <span>(sin paginar: las páginas exactas las enseña el diálogo de impresión)</span>
          </p>
          <iframe title="Vista previa del PDF" src={`#/imprimir/tema/${n}?edicion=1&vista=1`} />
        </div>
      </div>

      <div className="ed-pie">
        <span className="ed-estado" role="status">
          {estado?.error
            ? `No se ha podido guardar: ${estado.error}.`
            : estado?.cambios
              ? `Con tus cambios · guardado en este navegador a las ${estado.hora}`
              : 'Sin cambios: es el apunte original'}
        </span>
        {estado?.cambios &&
          (confirmar ? (
            <span>
              ¿Descartar todos tus cambios?{' '}
              <button className="btn btn-bad" onClick={volverAlOriginal}>
                Sí, volver al original
              </button>{' '}
              <button className="btn" onClick={() => setConfirmar(false)}>
                No
              </button>
            </span>
          ) : (
            <button className="btn" onClick={() => setConfirmar(true)}>
              Volver al original
            </button>
          ))}
        <button className="btn btn-pri" onClick={descargarPDF}>
          Descargar PDF
        </button>
      </div>
    </div>
  )
}

function BarraHerramientas({ editor }: { editor: Editor }) {
  const e = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      negrita: ed.isActive('bold'),
      cursiva: ed.isActive('italic'),
      puntos: ed.isActive('bulletList'),
      numerada: ed.isActive('orderedList'),
      tabla: ed.isActive('table'),
      nivel: ([2, 3, 4] as const).find((l) => ed.isActive('heading', { level: l })) ?? 0,
      deshacer: ed.can().undo(),
      rehacer: ed.can().redo(),
    }),
  })
  const c = () => editor.chain().focus()
  const boton = (rotulo: string, titulo: string, accion: () => unknown, activo = false, desactivado = false) => (
    <button
      type="button"
      className={activo ? 'activo' : undefined}
      title={titulo}
      aria-label={titulo}
      aria-pressed={activo || undefined}
      disabled={desactivado}
      onMouseDown={(ev) => ev.preventDefault()}
      onClick={() => accion()}
    >
      {rotulo}
    </button>
  )

  return (
    <div className="ed-barra" role="toolbar" aria-label="Formato">
      {boton('↶', 'Deshacer (Ctrl+Z)', () => c().undo().run(), false, !e.deshacer)}
      {boton('↷', 'Rehacer (Ctrl+Y)', () => c().redo().run(), false, !e.rehacer)}
      <span className="ed-sep" />
      <select
        aria-label="Tipo de bloque"
        value={e.nivel}
        onChange={(ev) => {
          const nivel = Number(ev.target.value)
          if (nivel) c().setHeading({ level: nivel as 2 | 3 | 4 }).run()
          else c().setParagraph().run()
        }}
      >
        <option value={0}>Párrafo</option>
        <option value={2}>Título 2</option>
        <option value={3}>Título 3</option>
        <option value={4}>Título 4</option>
      </select>
      {boton('N', 'Negrita (Ctrl+B)', () => c().toggleBold().run(), e.negrita)}
      {boton('C', 'Cursiva (Ctrl+I)', () => c().toggleItalic().run(), e.cursiva)}
      {boton('•', 'Lista de puntos', () => c().toggleBulletList().run(), e.puntos)}
      {boton('1.', 'Lista numerada', () => c().toggleOrderedList().run(), e.numerada)}
      <span className="ed-sep" />
      {boton('↑', 'Subir el bloque (Alt+↑)', () => moverBloque(editor, -1))}
      {boton('↓', 'Bajar el bloque (Alt+↓)', () => moverBloque(editor, 1))}
      {boton('✕', 'Quitar el bloque', () => quitarBloque(editor))}
      {boton('⤓ Salto de página', 'Salto de página detrás de este bloque (Ctrl+Intro)', () => insertarSalto(editor))}
      {e.tabla && (
        <>
          <span className="ed-sep" />
          {boton('+ fila', 'Añadir fila debajo', () => c().addRowAfter().run())}
          {boton('− fila', 'Quitar esta fila', () => c().deleteRow().run())}
          {boton('+ col.', 'Añadir columna a la derecha', () => c().addColumnAfter().run())}
          {boton('− col.', 'Quitar esta columna', () => c().deleteColumn().run())}
        </>
      )}
    </div>
  )
}
