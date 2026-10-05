/**
 * Quitar secciones de un apunte directamente sobre su arbol Markdown (mdast).
 *
 * El editor de un tema las quita sobre su propio documento (sinSecciones, en
 * markdown.ts). El temario completo no pasa por el editor: junta la version
 * guardada de cada tema y le quita aqui las secciones que se ocultaron en su
 * editor. Lo usan la vista de impresion (como plugin de remark) y el Word.
 *
 * Una seccion va desde su titulo de segundo nivel hasta el siguiente titulo
 * de nivel 1 o 2, y se reconoce por el texto del titulo, igual que en el
 * editor (sin el texto alternativo de las figuras).
 */

import type { Root } from 'mdast'
import { toString } from 'mdast-util-to-string'

export function quitarSecciones(arbol: Root, ocultas: readonly string[]): Root {
  if (!ocultas.length) return arbol
  let fuera = false
  arbol.children = arbol.children.filter((n) => {
    if (n.type === 'heading' && n.depth <= 2) fuera = ocultas.includes(toString(n, { includeImageAlt: false }))
    return !fuera
  })
  return arbol
}

/** Plugin de remark para react-markdown. */
export const remarkQuitarSecciones = (ocultas: readonly string[]) => () => (arbol: Root) => {
  quitarSecciones(arbol, ocultas)
}
