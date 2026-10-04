/**
 * Ida y vuelta entre el Markdown de los apuntes y el documento del editor
 * (el JSON de TipTap/ProseMirror).
 *
 * Por que el editor guarda Markdown y no su propio JSON: el PDF sale de la
 * vista de impresion de siempre, que pinta Markdown con el mismo componente
 * que la app (Markdown.tsx). Si el apunte sin tocar vuelve del editor como un
 * Markdown equivalente, el PDF es por fuerza el de antes, con todas las reglas
 * de saltos de pagina. Lo comprueba scripts/verificar-editor.js imprimiendo
 * los dos y comparandolos.
 *
 * Los dos sentidos pasan por mdast, el arbol que ya usa react-markdown por
 * dentro: se lee con el mismo parser (micromark + GFM) y se escribe con
 * mdast-util-to-markdown, que sabe escapar lo que haga falta.
 */

import type { JSONContent } from '@tiptap/core'
import type {
  BlockContent,
  Blockquote,
  Heading,
  List,
  ListItem,
  Paragraph,
  PhrasingContent,
  Root,
  RootContent,
  Table,
  TableCell,
  TableRow,
} from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { toMarkdown } from 'mdast-util-to-markdown'
import { gfm } from 'micromark-extension-gfm'

/** Salto de pagina manual: una "imagen" con esquema propio, como las figuras. */
export const SALTO_PAGINA = 'salto:pagina'

type Marca = { type: string; attrs?: Record<string, unknown> }

/* ---------- Markdown -> documento ---------- */

export function leerMarkdown(md: string): Root {
  return fromMarkdown(md, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] })
}

export function markdownADoc(md: string): JSONContent {
  return { type: 'doc', content: bloques(leerMarkdown(md).children) }
}

function bloques(nodos: RootContent[]): JSONContent[] {
  return nodos.flatMap((n) => {
    const b = bloque(n)
    return b ? [b] : []
  })
}

function bloque(n: RootContent): JSONContent | null {
  switch (n.type) {
    case 'heading':
      return { type: 'heading', attrs: { level: n.depth }, content: enLinea(n.children) }
    case 'paragraph': {
      // un parrafo que solo trae el salto de pagina es el salto
      const [unico] = n.children
      if (n.children.length === 1 && unico.type === 'image' && unico.url === SALTO_PAGINA) {
        return { type: 'saltoPagina' }
      }
      return { type: 'paragraph', content: enLinea(n.children) }
    }
    case 'blockquote':
      return { type: 'blockquote', content: bloques(n.children) }
    case 'thematicBreak':
      return { type: 'horizontalRule' }
    case 'list':
      return {
        type: n.ordered ? 'orderedList' : 'bulletList',
        attrs: n.ordered ? { start: n.start ?? 1, suelta: !!n.spread } : { suelta: !!n.spread },
        content: n.children.map((li) => ({
          type: 'listItem',
          attrs: { suelta: !!li.spread },
          content: bloques(li.children),
        })),
      }
    case 'table':
      return {
        type: 'table',
        attrs: { alineacion: n.align ?? [] },
        content: n.children.map((fila, i) => ({
          type: 'tableRow',
          content: fila.children.map((celda) => ({
            type: i === 0 ? 'tableHeader' : 'tableCell',
            content: [{ type: 'paragraph', content: enLinea(celda.children) }],
          })),
        })),
      }
    default:
      // Los apuntes no usan nada mas (ni HTML, ni codigo, ni notas al pie:
      // inventariado sobre los 40 temas). Si apareciera, se conserva como texto.
      return { type: 'paragraph', content: texto(toMarkdown({ type: "root", children: [n] } as Root, { extensions: [gfmToMarkdown()] }).trim(), []) }
  }
}

function texto(t: string, marcas: Marca[]): JSONContent[] {
  // ProseMirror no admite nodos de texto vacios. Un salto de linea suelto
  // dentro de un parrafo se pinta como un espacio: se guarda como tal.
  const limpio = t.replace(/\r?\n/g, ' ')
  if (!limpio) return []
  return [marcas.length ? { type: 'text', text: limpio, marks: marcas } : { type: 'text', text: limpio }]
}

function enLinea(nodos: PhrasingContent[], marcas: Marca[] = []): JSONContent[] {
  return nodos.flatMap((n): JSONContent[] => {
    switch (n.type) {
      case 'text':
        return texto(n.value, marcas)
      case 'strong':
        return enLinea(n.children, [...marcas, { type: 'bold' }])
      case 'emphasis':
        return enLinea(n.children, [...marcas, { type: 'italic' }])
      case 'delete':
        return enLinea(n.children, [...marcas, { type: 'strike' }])
      case 'inlineCode':
        return texto(n.value, [...marcas, { type: 'code' }])
      case 'link':
        return enLinea(n.children, [...marcas, { type: 'link', attrs: { href: n.url, title: n.title ?? null } }])
      case 'break':
        return [{ type: 'hardBreak' }]
      case 'image':
        return [{ type: 'figura', attrs: { src: n.url, alt: n.alt ?? '', title: n.title ?? null } }]
      default:
        return texto(toMarkdown({ type: 'paragraph', children: [n] }, { extensions: [gfmToMarkdown()] }).trim(), marcas)
    }
  })
}

/* ---------- documento -> Markdown ---------- */

export function docAMdast(doc: JSONContent): Root {
  return { type: 'root', children: (doc.content ?? []).map(aBloque) as RootContent[] }
}

export function docAMarkdown(doc: JSONContent): string {
  return toMarkdown(docAMdast(doc), {
    extensions: [gfmToMarkdown({ tablePipeAlign: false })],
    bullet: '-',
    emphasis: '*',
    strong: '*',
    listItemIndent: 'one',
  })
}

const hijos = (n: JSONContent) => n.content ?? []

function aBloque(n: JSONContent): BlockContent | Table {
  switch (n.type) {
    case 'heading':
      return { type: 'heading', depth: (n.attrs?.level ?? 2) as Heading['depth'], children: aEnLinea(hijos(n)) }
    case 'blockquote':
      return { type: 'blockquote', children: hijos(n).map(aBloque) as Blockquote['children'] }
    case 'horizontalRule':
      return { type: 'thematicBreak' }
    case 'saltoPagina':
      return { type: 'paragraph', children: [{ type: 'image', url: SALTO_PAGINA, alt: '' }] }
    case 'bulletList':
    case 'orderedList': {
      const ordenada = n.type === 'orderedList'
      const lista: List = {
        type: 'list',
        ordered: ordenada,
        start: ordenada ? Number(n.attrs?.start ?? 1) : null,
        spread: !!n.attrs?.suelta,
        children: hijos(n).map(
          (li): ListItem => ({
            type: 'listItem',
            spread: !!li.attrs?.suelta,
            checked: null,
            children: hijos(li).map(aBloque) as ListItem['children'],
          }),
        ),
      }
      return lista
    }
    case 'table':
      return {
        type: 'table',
        align: (n.attrs?.alineacion as Table['align']) ?? [],
        children: hijos(n).map(
          (fila): TableRow => ({
            type: 'tableRow',
            children: hijos(fila).map(
              (celda): TableCell => ({
                type: 'tableCell',
                // En GFM una celda es una sola linea: si en el editor se
                // partio en varios parrafos, se unen con un espacio.
                children: hijos(celda).flatMap((p, i) => [
                  ...(i ? [{ type: 'text', value: ' ' } as PhrasingContent] : []),
                  ...aEnLinea(hijos(p)).map((x) => (x.type === 'break' ? ({ type: 'text', value: ' ' } as PhrasingContent) : x)),
                ]),
              }),
            ),
          }),
        ),
      }
    case 'paragraph':
    default:
      return { type: 'paragraph', children: aEnLinea(hijos(n)) } as Paragraph
  }
}

/** Orden en que se anidan las marcas cuando abarcan el mismo tramo. */
const PRIORIDAD = ['link', 'italic', 'bold', 'strike']

const clave = (m: Marca) => (m.type === 'link' ? `link ${String(m.attrs?.href)} ${String(m.attrs?.title ?? '')}` : m.type)

/**
 * El documento guarda el texto como tramos planos con marcas; Markdown, como
 * un arbol (negrita dentro de cursiva...). Se reconstruye el arbol abriendo en
 * cada punto la marca que mas tramos seguidos abarca: asi «*a **b** c*» vuelve
 * a ser una cursiva con una negrita dentro, y no tres trozos sueltos.
 */
function aEnLinea(nodos: JSONContent[], abiertas: string[] = []): PhrasingContent[] {
  const out: PhrasingContent[] = []
  const marcasDe = (n: JSONContent) =>
    ((n.marks ?? []) as Marca[]).filter((m) => m.type !== 'code' && !abiertas.includes(clave(m)))
  let i = 0
  while (i < nodos.length) {
    const n = nodos[i]
    const pendientes = marcasDe(n)
    if (!pendientes.length) {
      out.push(hoja(n))
      i++
      continue
    }
    // la marca que mas lejos llega desde aqui; a igualdad, la de mas prioridad
    let mejor = pendientes[0]
    let hasta = -1
    for (const m of [...pendientes].sort((a, b) => PRIORIDAD.indexOf(a.type) - PRIORIDAD.indexOf(b.type))) {
      let j = i
      while (j + 1 < nodos.length && marcasDe(nodos[j + 1]).some((x) => clave(x) === clave(m))) j++
      if (j > hasta) {
        mejor = m
        hasta = j
      }
    }
    const dentro = aEnLinea(nodos.slice(i, hasta + 1), [...abiertas, clave(mejor)])
    out.push(envolver(mejor, dentro))
    i = hasta + 1
  }
  return out
}

function envolver(m: Marca, hijosEnLinea: PhrasingContent[]): PhrasingContent {
  switch (m.type) {
    case 'bold':
      return { type: 'strong', children: hijosEnLinea }
    case 'italic':
      return { type: 'emphasis', children: hijosEnLinea }
    case 'strike':
      return { type: 'delete', children: hijosEnLinea }
    case 'link':
      return {
        type: 'link',
        url: String(m.attrs?.href ?? ''),
        title: (m.attrs?.title as string | null) ?? null,
        children: hijosEnLinea as never,
      }
    default:
      return { type: 'emphasis', children: hijosEnLinea }
  }
}

function hoja(n: JSONContent): PhrasingContent {
  if (n.type === 'hardBreak') return { type: 'break' }
  if (n.type === 'figura') {
    return { type: 'image', url: String(n.attrs?.src ?? ''), alt: String(n.attrs?.alt ?? ''), title: (n.attrs?.title as string | null) ?? null }
  }
  const esCodigo = ((n.marks ?? []) as Marca[]).some((m) => m.type === 'code')
  return esCodigo ? { type: 'inlineCode', value: n.text ?? '' } : { type: 'text', value: n.text ?? '' }
}

/* ---------- secciones ---------- */

const textoPlano = (n: JSONContent): string =>
  n.type === 'text' ? (n.text ?? '') : (n.content ?? []).map(textoPlano).join('')

/** Los titulos de segundo nivel del documento, que son sus secciones. */
export function secciones(doc: JSONContent): string[] {
  return (doc.content ?? []).filter((n) => n.type === 'heading' && n.attrs?.level === 2).map(textoPlano)
}

/**
 * El documento sin las secciones ocultas: cada una va desde su titulo de
 * segundo nivel hasta el siguiente titulo de nivel 1 o 2.
 */
export function sinSecciones(doc: JSONContent, ocultas: string[]): JSONContent {
  if (!ocultas.length) return doc
  let fuera = false
  const content = (doc.content ?? []).filter((n) => {
    if (n.type === 'heading' && Number(n.attrs?.level) <= 2) fuera = ocultas.includes(textoPlano(n))
    return !fuera
  })
  return { ...doc, content }
}
