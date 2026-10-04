/**
 * El esquema del editor: lo que se puede escribir en un apunte, ni mas ni
 * menos. Cada pieza tiene que poder volver a Markdown (ver markdown.ts), asi
 * que no hay subrayado, ni colores, ni bloques de codigo: los apuntes no los
 * usan y la app no sabria pintarlos.
 */

import { Extension, Node, mergeAttributes, type Editor } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewProps } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import type { Node as NodoPM } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'

import Figura from '../components/figuras/Figura'
import { comoFigura } from '../components/Markdown'

/**
 * Lista suelta o apretada: en Markdown, una linea en blanco entre elementos
 * hace que cada uno vaya en su propio parrafo, con mas aire. No se ve en el
 * editor, pero se conserva para que el PDF no cambie.
 */
const suelta = {
  suelta: {
    default: false,
    parseHTML: () => false,
    renderHTML: () => ({}),
  },
}

const ListaPuntos = BulletList.extend({ addAttributes: () => suelta })
const ListaNumerada = OrderedList.extend({
  addAttributes() {
    return { ...this.parent?.(), ...suelta }
  },
})
const Elemento = ListItem.extend({ addAttributes: () => suelta })

/** La alineacion de las columnas de una tabla GFM, para devolverla igual. */
const Tabla = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alineacion: { default: [], parseHTML: () => [], renderHTML: () => ({}) },
    }
  },
})

function VistaFigura({ node, selected }: ReactNodeViewProps) {
  const src = String(node.attrs.src ?? '')
  const figura = comoFigura(src, String(node.attrs.alt ?? ''))
  return (
    <NodeViewWrapper as="span" className={`ed-figura${selected ? ' ed-sel' : ''}`} data-src={src}>
      {figura ? <Figura figura={figura} /> : <span className="ed-figura-rota">[figura: {src}]</span>}
    </NodeViewWrapper>
  )
}

/**
 * Una figura del apunte (`![pie](esquema:clave)`). Es un bloque cerrado: se
 * mueve o se quita entera, pero no se edita por dentro. Va en linea porque
 * algunas viven dentro de una celda de tabla (los pictogramas del tema 20).
 */
const FiguraNodo = Node.create({
  name: 'figura',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes: () => ({ src: { default: '' }, alt: { default: '' }, title: { default: null } }),
  parseHTML: () => [{ tag: 'span[data-figura]' }],
  renderHTML: ({ HTMLAttributes }) => ['span', mergeAttributes(HTMLAttributes, { 'data-figura': '' })],
  addNodeView: () => ReactNodeViewRenderer(VistaFigura),
})

/** Salto de pagina manual: en el PDF, lo que va detras empieza pagina nueva. */
const SaltoPagina = Node.create({
  name: 'saltoPagina',
  group: 'block',
  atom: true,
  selectable: true,
  parseHTML: () => [{ tag: 'div[data-salto]' }],
  renderHTML: () => ['div', { 'data-salto': '', class: 'ed-salto' }, 'Salto de página'],
})

/* ---------- mover bloques ---------- */

/**
 * El bloque que se mueve con «subir» y «bajar»: el elemento de lista en que
 * esta el cursor, o si no, el bloque de primer nivel (parrafo, titulo, tabla,
 * figura, lista entera...).
 */
function bloqueActual(editor: Editor): { pos: number; nodo: NodoPM; padre: NodoPM; indice: number } | null {
  const { selection } = editor.state
  const $d = selection.$from
  for (let d = $d.depth; d >= 1; d--) {
    const nodo = $d.node(d)
    const padre = $d.node(d - 1)
    if (nodo.type.name === 'listItem' || d === 1) {
      return { pos: $d.before(d), nodo, padre, indice: $d.index(d - 1) }
    }
  }
  // un bloque cerrado seleccionado entero (una figura de bloque, un salto)
  const sel = selection as unknown as { node?: NodoPM }
  if (sel.node && selection.$from.depth === 0) {
    return { pos: selection.from, nodo: sel.node, padre: editor.state.doc, indice: selection.$from.index(0) }
  }
  return null
}

export function moverBloque(editor: Editor, sentido: -1 | 1): boolean {
  const b = bloqueActual(editor)
  if (!b) return false
  const vecino = b.indice + sentido
  if (vecino < 0 || vecino >= b.padre.childCount) return false
  const otro = b.padre.child(vecino)
  const { tr, selection } = editor.state
  const offset = selection.from - b.pos
  tr.delete(b.pos, b.pos + b.nodo.nodeSize)
  const destino = sentido === 1 ? b.pos + otro.nodeSize : b.pos - otro.nodeSize
  tr.insert(destino, b.nodo)
  tr.setSelection(TextSelection.near(tr.doc.resolve(Math.min(destino + offset, tr.doc.content.size))))
  editor.view.dispatch(tr.scrollIntoView())
  return true
}

/** Quita el bloque en que esta el cursor (o lo seleccionado, si es un bloque cerrado). */
export function quitarBloque(editor: Editor): boolean {
  const b = bloqueActual(editor)
  if (!b) return false
  const { tr } = editor.state
  tr.delete(b.pos, b.pos + b.nodo.nodeSize)
  editor.view.dispatch(tr.scrollIntoView())
  return true
}

/** Inserta un salto de pagina detras del bloque de primer nivel en que esta el cursor. */
export function insertarSalto(editor: Editor): boolean {
  const $d = editor.state.selection.$from
  const tras = $d.depth >= 1 ? $d.after(1) : editor.state.selection.to
  return editor.chain().insertContentAt(tras, { type: 'saltoPagina' }).run()
}

const Atajos = Extension.create({
  name: 'atajosApunte',
  addKeyboardShortcuts() {
    return {
      'Alt-ArrowUp': () => moverBloque(this.editor, -1),
      'Alt-ArrowDown': () => moverBloque(this.editor, 1),
      'Mod-Enter': () => insertarSalto(this.editor),
    }
  },
})

export const EXTENSIONES = [
  StarterKit.configure({
    codeBlock: false,
    underline: false,
    trailingNode: false,
    bulletList: false,
    orderedList: false,
    listItem: false,
    heading: { levels: [1, 2, 3, 4, 5, 6] },
    link: { openOnClick: false, autolink: false, linkOnPaste: false },
  }),
  ListaPuntos,
  ListaNumerada,
  Elemento,
  Tabla.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
  FiguraNodo,
  SaltoPagina,
  Atajos,
]
