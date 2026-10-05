/**
 * Exportacion a Word (.docx) del apunte preparado en el editor.
 *
 * Parte del MISMO Markdown que la vista de impresion (la descarga en curso, ya
 * sin las secciones ocultas), leido con el mismo parser, y lo escribe con la
 * libreria `docx`, en el propio navegador:
 *   - los titulos con los estilos de Word (Titulo 1, 2, 3...), asi salen en el
 *     panel de navegacion y en un indice automatico;
 *   - las tablas como tablas de verdad, con la fila de cabecera repetida en
 *     cada pagina y ninguna fila partida entre dos;
 *   - las reglas de la hoja de impresion contra los arranques huerfanos (ver
 *     styles.css) traducidas a «conservar con el siguiente» y «conservar
 *     lineas juntas». En Word los saltos los calcula Word al abrir: se le dan
 *     las mismas intenciones, pero decide el;
 *   - las figuras como imagen PNG a tres veces su tamaño: se dibujan con los
 *     mismos componentes que en la app y se rasterizan aqui.
 *
 * Lo comprueba scripts/verificar-word.js abriendo el .docx: mismos titulos,
 * tablas, figuras y texto que el apunte.
 */

import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  ShadingType,
  TabStopType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type ILevelsOptions,
  type IRunOptions,
} from 'docx'
import type { List, ListItem, PhrasingContent, Root, RootContent, Table as TablaMd } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

import Figura from '../components/figuras/Figura'
import { comoFigura } from '../components/Markdown'
import type { Figura as TipoFigura, TemaVista } from '../types'
import { MARGENES_MM, escalaRenglon, type OpcionesCuestionario, type OpcionesDescarga, type OpcionesTemario } from './almacen'
import type { CuestionarioPreparado, PreguntaPreparada } from './cuestionario'
import { quitarSecciones } from './secciones'
import { SALTO_PAGINA, leerMarkdown } from './markdown'

/* ---------- medidas ---------- */

const TWIP_POR_MM = 1440 / 25.4
const PX_POR_MM = 96 / 25.4
/** Las mismas que Markdown.tsx: un renglon y una fila alta, en caracteres */
const RENGLON_PDF = 90
const FILA_ALTA = 250
/** Las figuras se rasterizan a esta escala: nitidas al imprimir */
const RESOLUCION = 3

const COLOR_TEXTO = '16202C'
const COLOR_SUAVE = '5D6B7A'
const COLOR_ACENTO = '1F5F8B'
const COLOR_BORDE = 'DFE3E8'
const COLOR_FONDO = 'F0F2F5'

/** Tamaño en medios puntos, que es como los cuenta Word */
const mp = (pt: number) => Math.round(pt * 2)

/* ---------- figuras: del componente a un PNG ---------- */

interface Imagen {
  png: Uint8Array
  ancho: number
  alto: number
  pie: string
}

/** Propiedades de estilo que un SVG necesita llevar puestas para dibujarse fuera de la pagina. */
const ESTILO_SVG = [
  'fill',
  'fill-opacity',
  'fill-rule',
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'stroke-dasharray',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'opacity',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'text-anchor',
  'dominant-baseline',
  'letter-spacing',
  'paint-order',
  'visibility',
  'display',
]

/**
 * Un SVG pintado en la pagina depende de su CSS (colores con currentColor,
 * clases, variables). Para dibujarlo como imagen suelta se copia en cada
 * elemento el estilo ya calculado.
 */
function svgSuelto(svg: SVGSVGElement, ancho: number, alto: number): string {
  const copia = svg.cloneNode(true) as SVGSVGElement
  const originales = [svg, ...svg.querySelectorAll('*')]
  const copias = [copia, ...copia.querySelectorAll('*')]
  originales.forEach((el, i) => {
    const cs = getComputedStyle(el)
    const destino = copias[i] as SVGElement
    for (const p of ESTILO_SVG) destino.style.setProperty(p, cs.getPropertyValue(p))
  })
  copia.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  copia.setAttribute('width', String(ancho))
  copia.setAttribute('height', String(alto))
  copia.style.color = getComputedStyle(svg).color
  return new XMLSerializer().serializeToString(copia)
}

async function aPNG(fuente: string, ancho: number, alto: number): Promise<Uint8Array> {
  const img = new Image()
  img.src = fuente
  await img.decode()
  const lienzo = document.createElement('canvas')
  lienzo.width = Math.round(ancho * RESOLUCION)
  lienzo.height = Math.round(alto * RESOLUCION)
  const ctx = lienzo.getContext('2d')!
  // fondo blanco: es papel, y asi no la oscurece un Word en modo oscuro
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, lienzo.width, lienzo.height)
  ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height)
  const blob = await new Promise<Blob>((ok, mal) => lienzo.toBlob((b) => (b ? ok(b) : mal(new Error('canvas vacío'))), 'image/png'))
  return new Uint8Array(await blob.arrayBuffer())
}

/**
 * Dibuja las figuras con los componentes de la app, en una hoja de impresion
 * escondida del ancho del papel, y las convierte en PNG. Las de las celdas de
 * tabla, a su tamaño de celda (como en el PDF).
 */
/** Una figura que hay que dibujar. `incognita`: es la pregunta, sin rotulo que la delate (cuestionario). */
interface PeticionFigura {
  clave: string
  figura: TipoFigura
  incognita: boolean
  enTabla: boolean
}

/** Clave de una figura del Markdown: la misma figura en una celda sale a otro tamaño. */
const claveMd = (src: string, alt: string, enTabla: boolean) => `md|${src}|${alt}|${enTabla}`

async function rasterizarFiguras(pedidas: PeticionFigura[], anchoMm: number) {
  const hoja = document.createElement('div')
  hoja.className = 'imp'
  hoja.style.cssText = `position:fixed;left:-30000px;top:0;width:${anchoMm * PX_POR_MM}px;padding:0`
  const md = document.createElement('div')
  md.className = 'md'
  hoja.append(md)
  document.body.append(hoja)
  const hechas = new Map<string, Imagen>()
  try {
    for (const p of pedidas) {
      const { clave, figura } = p
      if (hechas.has(clave)) continue
      const caja = document.createElement('div')
      if (p.enTabla) caja.className = 'md-tabla'
      md.append(caja)
      const raiz = createRoot(caja)
      flushSync(() => raiz.render(<Figura figura={figura} incognita={p.incognita} />))
      await Promise.all([...caja.querySelectorAll('img')].map((i) => i.decode().catch(() => undefined)))
      const dibujo = caja.querySelector('figure svg, figure img') as SVGSVGElement | HTMLImageElement | null
      const pie = caja.querySelector('figcaption')?.textContent?.trim() ?? ''
      if (dibujo) {
        const r = dibujo.getBoundingClientRect()
        const fuente =
          dibujo instanceof HTMLImageElement
            ? dibujo.currentSrc || dibujo.src
            : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgSuelto(dibujo, r.width, r.height))}`
        hechas.set(clave, { png: await aPNG(fuente, r.width, r.height), ancho: r.width, alto: r.height, pie })
      }
      raiz.unmount()
      caja.remove()
    }
  } finally {
    hoja.remove()
  }
  return hechas
}

/* ---------- Markdown -> docx ---------- */

interface Contexto {
  /** cuanto mas texto cabe por renglon que en el PDF de siempre (umbrales de renglon y fila alta) */
  escala: number
  /** la letra elegida respecto a 11 pt (tamaños) */
  letra: number
  anchoMm: number
  figuras: Map<string, Imagen>
  /**
   * Cuantos niveles bajan los titulos del Markdown. En el apunte de un tema el
   * `##` es «Titulo 1»; en el temario completo, «Titulo 1» es cada tema y el
   * `##` pasa a «Titulo 2».
   */
  desplazamiento: number
  /** listas numeradas: una instancia por lista, para que cada una empiece de nuevo */
  numeraciones: Map<number, string>
  instancia: number
}

type Formato = Pick<IRunOptions, 'bold' | 'italics' | 'strike' | 'color' | 'size' | 'font'>

function textoRuns(nodos: PhrasingContent[], f: Formato, ctx: Contexto, enTabla: boolean): (TextRun | ImageRun | ExternalHyperlink)[] {
  return nodos.flatMap((n): (TextRun | ImageRun | ExternalHyperlink)[] => {
    switch (n.type) {
      case 'text':
        return [new TextRun({ ...f, text: n.value.replace(/\r?\n/g, ' ') })]
      case 'strong':
        return textoRuns(n.children, { ...f, bold: true }, ctx, enTabla)
      case 'emphasis':
        return textoRuns(n.children, { ...f, italics: true }, ctx, enTabla)
      case 'delete':
        return textoRuns(n.children, { ...f, strike: true }, ctx, enTabla)
      case 'inlineCode':
        return [new TextRun({ ...f, text: n.value, font: 'Consolas', shading: { type: ShadingType.CLEAR, fill: COLOR_FONDO, color: 'auto' } })]
      case 'break':
        return [new TextRun({ break: 1 })]
      case 'link':
        return [
          new ExternalHyperlink({
            link: n.url,
            children: textoRuns(n.children, f, ctx, enTabla).filter((r): r is TextRun => r instanceof TextRun),
          }),
        ]
      case 'image': {
        const img = ctx.figuras.get(claveMd(n.url, n.alt ?? '', enTabla))
        if (!img) return []
        // nunca mas ancha que la caja del papel
        const max = ctx.anchoMm * PX_POR_MM
        const k = Math.min(1, max / img.ancho)
        return [
          new ImageRun({
            type: 'png',
            data: img.png,
            transformation: { width: Math.round(img.ancho * k), height: Math.round(img.alto * k) },
            altText: { name: img.pie || n.alt || 'Figura', description: img.pie || n.alt || '', title: img.pie || n.alt || '' },
          }),
        ]
      }
      default:
        return [new TextRun({ ...f, text: toString(n) })]
    }
  })
}

const imagenesDe = (nodos: PhrasingContent[]) => nodos.filter((n) => n.type === 'image')

/** El pie de cada figura del parrafo, debajo, como en la app. */
function pies(nodos: PhrasingContent[], ctx: Contexto, enTabla: boolean, tam: number): Paragraph[] {
  return imagenesDe(nodos).flatMap((n) => {
    const img = n.type === 'image' ? ctx.figuras.get(claveMd(n.url, n.alt ?? '', enTabla)) : undefined
    return img?.pie
      ? [new Paragraph({ keepLines: true, spacing: { before: 40, after: 160 }, children: [new TextRun({ text: img.pie, italics: true, color: COLOR_SUAVE, size: mp(tam) })] })]
      : []
  })
}

/** El parrafo siguiente (en el mismo nivel) y el anterior, para las reglas de «conservar con el siguiente». */
interface Vecinos {
  antes?: RootContent
  despues?: RootContent
}

const esTitulo = (n?: RootContent) => n?.type === 'heading'

function parrafo(
  nodos: PhrasingContent[],
  ctx: Contexto,
  v: Vecinos,
  extra: ConstructorParameters<typeof Paragraph>[0] & object = {},
  f: Formato = {},
): Paragraph[] {
  const texto = toString({ type: 'paragraph', children: nodos }, { includeImageAlt: false }).trim()
  const soloFigura = nodos.length > 0 && nodos.every((n) => n.type === 'image' || (n.type === 'text' && !n.value.trim()))
  // Las reglas de styles.css, una a una:
  const conservar =
    texto.endsWith(':') || // la entrada va con lo que presenta
    v.despues?.type === 'list' || // el parrafo que presenta una lista...
    v.despues?.type === 'table' || // ...o una tabla
    soloFigura || // una figura con su pie
    (esTitulo(v.antes) && texto.length <= RENGLON_PDF * ctx.escala && !esTitulo(v.despues)) // titulo + renglon corto
  return [
    new Paragraph({
      keepNext: conservar || undefined,
      keepLines: true,
      // aire entre una tabla y el parrafo que la sigue, como en la app
      ...(v.antes?.type === 'table' ? { spacing: { before: 160 } } : {}),
      ...extra,
      children: textoRuns(nodos, f, ctx, false),
    }),
    ...pies(nodos, ctx, false, 9 * ctx.letra),
  ]
}

function bloques(nodos: RootContent[], ctx: Contexto, nivelLista = -1, f: Formato = {}, sangria = 0, cita = false): (Paragraph | Table)[] {
  return nodos.flatMap((n, i) => bloque(n, ctx, { antes: nodos[i - 1], despues: nodos[i + 1] }, nivelLista, f, sangria, cita))
}

/** Sangria y raya de color a la izquierda de una cita, como en la app. */
const SANGRIA_CITA = 280

function bloque(n: RootContent, ctx: Contexto, v: Vecinos, nivelLista: number, f: Formato, sangria: number, cita = false): (Paragraph | Table)[] {
  switch (n.type) {
    case 'heading': {
      const niveles = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6]
      return [
        new Paragraph({
          heading: niveles[Math.min(5, Math.max(0, n.depth - 2) + ctx.desplazamiento)],
          keepNext: true,
          keepLines: true,
          children: textoRuns(n.children, f, ctx, false),
        }),
      ]
    }
    case 'paragraph': {
      const [unico] = n.children
      if (n.children.length === 1 && unico.type === 'image' && unico.url === SALTO_PAGINA) {
        return [new Paragraph({ children: [new PageBreak()] })]
      }
      const izquierda = sangria + (cita ? SANGRIA_CITA : 0)
      return parrafo(
        n.children,
        ctx,
        v,
        {
          ...(izquierda ? { indent: { left: izquierda } } : {}),
          ...(cita ? { border: { left: { style: BorderStyle.SINGLE, size: 18, color: COLOR_ACENTO, space: 10 } } } : {}),
        },
        f,
      )
    }
    case 'blockquote':
      return bloques(n.children, ctx, nivelLista, { ...f, color: COLOR_SUAVE }, sangria, true)
    case 'thematicBreak':
      return [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDE, space: 1 } }, spacing: { after: 240 } })]
    case 'list':
      return lista(n, ctx, nivelLista + 1, f)
    case 'table':
      return [tabla(n, ctx)]
    default:
      return [new Paragraph({ children: [new TextRun({ ...f, text: toString(n) })] })]
  }
}

function lista(l: List, ctx: Contexto, nivel: number, f: Formato): (Paragraph | Table)[] {
  const referencia = l.ordered ? referenciaNumerada(ctx, l.start ?? 1) : 'puntos'
  const instancia = ++ctx.instancia
  const sangria = 360 * (nivel + 1)
  const unico = (li: ListItem) => li.children.length === 1 && li.children[0].type === 'paragraph'
  return l.children.flatMap((li, i) =>
    li.children.flatMap((hijo, j): (Paragraph | Table)[] => {
      if (j === 0 && hijo.type === 'paragraph') {
        // El elemento no se parte (keepLines), y el primero va con el segundo,
        // como en el PDF; uno que presenta una sublista va con ella.
        const conservar = (i === 0 && l.children.length > 1 && unico(li)) || li.children[1]?.type === 'list' || toString(hijo).trim().endsWith(':')
        return [
          new Paragraph({
            numbering: { reference: referencia, level: Math.min(nivel, 8), instance: instancia },
            keepLines: true,
            keepNext: conservar || undefined,
            spacing: { after: l.spread ? 120 : 40 },
            children: textoRuns(hijo.children, f, ctx, false),
          }),
          ...pies(hijo.children, ctx, false, 9 * ctx.letra),
        ]
      }
      if (hijo.type === 'list') return lista(hijo, ctx, nivel + 1, f)
      return bloque(hijo, ctx, { antes: li.children[j - 1], despues: li.children[j + 1] }, nivel, f, sangria)
    }),
  )
}

function referenciaNumerada(ctx: Contexto, inicio: number): string {
  if (!ctx.numeraciones.has(inicio)) ctx.numeraciones.set(inicio, `numeros-${inicio}`)
  return ctx.numeraciones.get(inicio)!
}

function niveles(numerada: boolean, inicio = 1): ILevelsOptions[] {
  const vinetas = ['•', '◦', '▪']
  return Array.from({ length: 9 }, (_, nivel) => ({
    level: nivel,
    format: numerada ? LevelFormat.DECIMAL : LevelFormat.BULLET,
    text: numerada ? `%${nivel + 1}.` : vinetas[nivel % 3],
    start: nivel === 0 ? inicio : 1,
    alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 360 * (nivel + 1), hanging: 280 } } },
  }))
}

function tabla(t: TablaMd, ctx: Contexto): Table {
  const columnas = Math.max(...t.children.map((r) => r.children.length))
  // Anchos segun lo que lleva cada columna: crecen menos que el texto (raiz
  // cuadrada), para que una columna larga no ahogue a las cortas, y nunca por
  // debajo de su palabra mas larga, que no se puede partir.
  const textos = (c: number) => t.children.map((r) => (r.children[c] ? toString(r.children[c]) : ''))
  const peso = Array.from({ length: columnas }, (_, c) => {
    const largo = Math.max(...textos(c).map((x) => x.length))
    const palabra = Math.max(0, ...textos(c).flatMap((x) => x.split(/s+/)).map((w) => w.length))
    return Math.max(palabra + 1, Math.min(60, Math.sqrt(largo) * 6), 4)
  })
  const total = peso.reduce((a, b) => a + b, 0)
  const anchoTwip = ctx.anchoMm * TWIP_POR_MM
  const tam = 10.8 * ctx.letra
  // Como .md-fila-alta: la segunda fila solo va pegada a la primera si esta es baja
  const primeraAlta = t.children[1] ? toString(t.children[1]).length > FILA_ALTA * ctx.escala : true
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: peso.map((p) => Math.round((anchoTwip * p) / total)),
    rows: t.children.map((fila, i) => {
      const cabecera = i === 0
      const pegar = i === 0 || (i === 1 && !primeraAlta)
      return new TableRow({
        tableHeader: cabecera,
        cantSplit: true,
        children: Array.from({ length: columnas }, (_, c) => {
          const celda = fila.children[c]
          const nodos = celda?.children ?? []
          return new TableCell({
            shading: cabecera ? { type: ShadingType.CLEAR, fill: COLOR_FONDO, color: 'auto' } : undefined,
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDE },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDE },
              left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDE },
              right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDE },
            },
            children: [
              new Paragraph({
                keepNext: pegar || undefined,
                keepLines: true,
                spacing: { after: 0, line: 276 },
                children: textoRuns(nodos, { bold: cabecera || undefined, size: mp(tam) }, ctx, true),
              }),
              ...pies(nodos, ctx, true, 8 * ctx.letra),
            ],
          })
        }),
      })
    }),
  })
}

/* ---------- el documento ---------- */

function hoy(): string {
  return new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

function figurasPedidas(arbol: Root): PeticionFigura[] {
  const out: PeticionFigura[] = []
  const recorrer = (n: { type: string; children?: unknown[] }, enTabla: boolean) => {
    if (n.type === 'image') {
      const img = n as unknown as { url: string; alt?: string }
      const figura = img.url === SALTO_PAGINA ? null : comoFigura(img.url, img.alt ?? '')
      if (figura) out.push({ clave: claveMd(img.url, img.alt ?? '', enTabla), figura, incognita: false, enTabla })
    }
    for (const c of (n.children ?? []) as { type: string }[]) recorrer(c, enTabla || n.type === 'table')
  }
  recorrer(arbol, false)
  return out
}

/* ---------- lo comun a los tres documentos ---------- */

/** Tamaño (pt), negrita, cursiva y raya inferior de cada nivel de titulo, de mayor a menor. */
const NIVELES_TITULO = [
  { pt: 17, borde: false, cursiva: false, antes: 240, despues: 240 },
  { pt: 13, borde: true, cursiva: false, antes: 360, despues: 120 },
  { pt: 12, borde: false, cursiva: false, antes: 280, despues: 80 },
  { pt: 11, borde: false, cursiva: false, antes: 240, despues: 60 },
  { pt: 11, borde: false, cursiva: true, antes: 200, despues: 60 },
  { pt: 11, borde: false, cursiva: true, antes: 200, despues: 60 },
  { pt: 11, borde: false, cursiva: true, antes: 200, despues: 60 },
]

interface Pagina {
  letra: number
  margenes: OpcionesDescarga['margenes']
}

async function crearContexto(o: Pagina, figuras: PeticionFigura[], desplazamiento: number): Promise<Contexto> {
  const anchoMm = 210 - 2 * MARGENES_MM[o.margenes].lateral
  return {
    escala: escalaRenglon({ letra: o.letra as OpcionesDescarga['letra'], margenes: o.margenes }),
    letra: o.letra / 11,
    anchoMm,
    figuras: await rasterizarFiguras(figuras, anchoMm),
    desplazamiento,
    numeraciones: new Map(),
    instancia: 0,
  }
}

/**
 * El documento: estilos (los titulos bajan un nivel si hay titulo de portada,
 * como en el temario), numeraciones, pagina A4 con los margenes elegidos,
 * cabecera y pie con el numero de pagina.
 */
function documento({
  ctx,
  o,
  titulo,
  descripcion,
  cabecera,
  pie,
  portada,
  hijos,
}: {
  ctx: Contexto
  o: Pagina
  titulo: string
  descripcion: string
  cabecera: string
  pie: string
  /** El temario: el estilo Titulo es la portada y cada tema es «Titulo 1» */
  portada?: boolean
  hijos: (Paragraph | Table)[]
}): Document {
  const m = MARGENES_MM[o.margenes]
  const t = (pt: number) => mp((pt * o.letra) / 11)
  const nivel = (i: number) => {
    const n = NIVELES_TITULO[Math.min(i, NIVELES_TITULO.length - 1)]
    return {
      run: { font: 'Georgia', size: t(n.pt), bold: true, italics: n.cursiva || undefined, color: COLOR_TEXTO },
      paragraph: {
        spacing: { before: n.antes, after: n.despues },
        keepNext: true,
        keepLines: true,
        ...(n.borde ? { border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC', space: 2 } } } : {}),
      },
    }
  }
  // con portada, «Titulo» es la portada (mas grande) y los titulos empiezan en el nivel 0
  const primero = portada ? 0 : 1
  const textoPie = (x: string) => new TextRun({ text: x, size: mp(8), color: COLOR_SUAVE, font: 'Calibri' })

  return new Document({
    creator: 'Técnica/o Auxiliar de Laboratorio · Ayuntamiento de Zaragoza',
    title: titulo,
    description: descripcion,
    styles: {
      default: {
        document: {
          run: { font: 'Georgia', size: t(11), color: COLOR_TEXTO, language: { value: 'es-ES' } },
          paragraph: { spacing: { after: 120, line: 312 } },
        },
        title: portada
          ? { run: { font: 'Georgia', size: t(26), bold: true, color: COLOR_TEXTO }, paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 120, after: 240 } } }
          : nivel(0),
        heading1: nivel(primero),
        heading2: nivel(primero + 1),
        heading3: nivel(primero + 2),
        heading4: nivel(primero + 3),
        heading5: nivel(primero + 4),
        heading6: nivel(primero + 5),
        hyperlink: { run: { color: COLOR_ACENTO, underline: {} } },
      },
    },
    numbering: {
      config: [
        { reference: 'puntos', levels: niveles(false) },
        ...[...ctx.numeraciones.entries()].map(([inicio, referencia]) => ({ reference: referencia, levels: niveles(true, inicio) })),
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: Math.round(210 * TWIP_POR_MM), height: Math.round(297 * TWIP_POR_MM) },
            margin: {
              top: Math.round(m.vertical * TWIP_POR_MM),
              bottom: Math.round(m.vertical * TWIP_POR_MM),
              left: Math.round(m.lateral * TWIP_POR_MM),
              right: Math.round(m.lateral * TWIP_POR_MM),
            },
          },
        },
        headers: { default: new Header({ children: [new Paragraph({ children: [textoPie(cabecera)] })] }) },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ children: [`${pie}página `, PageNumber.CURRENT, ' de ', PageNumber.TOTAL_PAGES], size: mp(8), color: COLOR_SUAVE, font: 'Calibri' })],
              }),
            ],
          }),
        },
        children: hijos,
      },
    ],
  })
}

/** El recuadro de fuentes del final de un apunte. */
function fuentesDe(apunte: NonNullable<TemaVista['apunte']>, ctx: Contexto): Paragraph[] {
  const t = (pt: number) => mp(pt * ctx.letra)
  const lista = ++ctx.instancia
  const fondo = { type: ShadingType.CLEAR, fill: 'F6F7F9', color: 'auto' } as const
  return [
    new Paragraph({
      keepNext: true,
      spacing: { before: 480, after: 80 },
      shading: fondo,
      children: [new TextRun({ text: 'Fuentes y verificación', bold: true, size: t(9.5) })],
    }),
    ...apunte.fuentes.map(
      (fuente, i) =>
        new Paragraph({
          numbering: { reference: 'puntos', level: 0, instance: lista },
          keepLines: true,
          keepNext: i === 0 && apunte.fuentes.length > 1 ? true : undefined,
          spacing: { after: 40 },
          shading: fondo,
          children: [new TextRun({ text: fuente, size: t(9.5) })],
        }),
    ),
    ...(apunte.verificado
      ? [new Paragraph({ shading: fondo, children: [new TextRun({ text: `Verificado el ${apunte.verificado}.`, size: t(9.5) })] })]
      : []),
  ]
}

const borrador = (apunte: NonNullable<TemaVista['apunte']>) =>
  apunte.estado === 'borrador'
    ? [new Paragraph({ children: [new TextRun({ text: 'Borrador pendiente de revisión.', bold: true, color: '96631A' })] })]
    : []

/** Una figura suelta (las del cuestionario), con su pie si lo tiene. */
function imagenSuelta(clave: string, ctx: Contexto): Paragraph[] {
  const img = ctx.figuras.get(clave)
  if (!img) return []
  const k = Math.min(1, (ctx.anchoMm * PX_POR_MM) / img.ancho)
  return [
    new Paragraph({
      keepNext: true,
      children: [
        new ImageRun({
          type: 'png',
          data: img.png,
          transformation: { width: Math.round(img.ancho * k), height: Math.round(img.alto * k) },
          altText: { name: img.pie || 'Figura', description: img.pie || '', title: img.pie || '' },
        }),
      ],
    }),
    ...(img.pie
      ? [new Paragraph({ keepNext: true, spacing: { after: 160 }, children: [new TextRun({ text: img.pie, italics: true, color: COLOR_SUAVE, size: mp(9 * ctx.letra) })] })]
      : []),
  ]
}

/* ---------- el apunte de un tema ---------- */

export async function generarWord({ tema, md, opciones }: { tema: TemaVista; md: string; opciones: OpcionesDescarga }): Promise<Blob> {
  const apunte = tema.apunte!
  const arbol = leerMarkdown(md)
  const ctx = await crearContexto(opciones, figurasPedidas(arbol), 0)
  const cuerpo = bloques(arbol.children, ctx)
  const hijos = [
    new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun(`Tema ${tema.numero}. ${tema.titulo}`)] }),
    ...borrador(apunte),
    ...cuerpo,
    ...(opciones.fuentes ? fuentesDe(apunte, ctx) : []),
  ]
  return Packer.toBlob(
    documento({
      ctx,
      o: opciones,
      titulo: `Tema ${tema.numero}. ${tema.titulo}`,
      descripcion: `Apuntes del tema ${tema.numero}, generados el ${hoy()}`,
      cabecera: `Técnica/o Auxiliar de Laboratorio · Ayuntamiento de Zaragoza · Apuntes · Generado el ${hoy()}`,
      pie: `Tema ${tema.numero} · `,
      hijos,
    }),
  )
}

/* ---------- el temario completo ---------- */

/**
 * Portada, indice y los temas elegidos, cada uno en su version. Cada tema es
 * «Titulo 1» y empieza pagina; sus apartados bajan un nivel. El indice es una
 * lista escrita, como en el PDF: el de Word (campo TOC) obliga a actualizarlo
 * al abrir, y el panel de navegacion ya da los temas.
 */
export async function generarWordTemario({
  temas,
  opciones,
}: {
  temas: { tema: TemaVista; md: string; ocultas: readonly string[] }[]
  opciones: OpcionesTemario
}): Promise<Blob> {
  const arboles = temas.map((x) => quitarSecciones(leerMarkdown(x.md), x.ocultas))
  const ctx = await crearContexto(opciones, arboles.flatMap(figurasPedidas), 1)
  const t = (pt: number) => mp(pt * ctx.letra)
  const hijos: (Paragraph | Table)[] = []
  // la siguiente pieza empieza pagina si ya hay algo delante
  const nuevaPagina = () => hijos.length > 0

  if (opciones.portada) {
    const centrado = (texto: string, extra: IRunOptions = {}, antes = 0) =>
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: antes, after: 120 }, children: [new TextRun({ text: texto, ...extra })] })
    hijos.push(
      centrado('OPOSICIÓN · AYUNTAMIENTO DE ZARAGOZA', { size: t(9), color: COLOR_SUAVE, font: 'Calibri' }, 2400),
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun(opciones.titulo)] }),
      centrado(opciones.subtitulo, { size: t(13), color: COLOR_SUAVE }),
      centrado(temas.length < 40 ? `${temas.length} de 40 temas` : `40 temas · ${temas.length} con apunte redactado`, { size: t(9), color: COLOR_SUAVE, font: 'Calibri' }, 1200),
      centrado('BOPZ núm. 170, de 27 de julio de 2026, anuncio núm. 5077', { size: t(9), color: COLOR_SUAVE, font: 'Calibri' }),
      centrado(`Generado el ${hoy()}`, { size: t(9), color: COLOR_SUAVE, font: 'Calibri' }),
    )
  }

  if (opciones.indice) {
    const anchoTwip = Math.round(ctx.anchoMm * TWIP_POR_MM)
    hijos.push(
      new Paragraph({ pageBreakBefore: nuevaPagina() || undefined, spacing: { after: 200 }, children: [new TextRun({ text: 'Índice', bold: true, size: t(13) })] }),
      ...temas.map(
        ({ tema }) =>
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: anchoTwip }],
            spacing: { after: 60 },
            indent: { left: 440, hanging: 440 },
            children: [
              new TextRun({ text: `${tema.numero}.\t`, size: t(10) }),
              new TextRun({ text: tema.titulo, size: t(10) }),
              new TextRun({ text: `\t${tema.apunte?.estado === 'aprobado' ? 'Aprobado' : 'Borrador'}`, size: t(8), color: COLOR_SUAVE, font: 'Calibri' }),
            ],
          }),
      ),
    )
  }

  temas.forEach(({ tema }, i) => {
    const apunte = tema.apunte!
    hijos.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: nuevaPagina() || undefined,
        children: [new TextRun(`Tema ${tema.numero}. ${tema.titulo}`)],
      }),
      ...borrador(apunte),
      ...bloques(arboles[i].children, ctx),
      ...(opciones.fuentes ? fuentesDe(apunte, ctx) : []),
    )
  })

  return Packer.toBlob(
    documento({
      ctx,
      o: opciones,
      titulo: opciones.titulo,
      descripcion: `${opciones.subtitulo}: ${temas.length} temas, generado el ${hoy()}`,
      cabecera: `Técnica/o Auxiliar de Laboratorio · Ayuntamiento de Zaragoza · Temario completo · Generado el ${hoy()}`,
      pie: '',
      portada: true,
      hijos,
    }),
  )
}

/* ---------- el cuestionario de un tema ---------- */

const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f']

/**
 * El cuestionario ya preparado (prepararCuestionario: las preguntas elegidas,
 * en su orden y con la letra correcta recalculada), el mismo que pinta el PDF.
 * Una pregunta no se parte entre paginas: su enunciado y sus opciones van
 * pegados («conservar con el siguiente»), igual que en el PDF.
 */
export async function generarWordCuestionario({
  tema,
  preparado,
  opciones,
}: {
  tema: TemaVista
  preparado: CuestionarioPreparado
  opciones: OpcionesCuestionario
}): Promise<Blob> {
  const { test, supuestos, todas } = preparado
  const enunciados = supuestos.map((s) => leerMarkdown(s.enunciado))
  const peticiones: PeticionFigura[] = [
    ...todas.filter((q) => q.figura).map((q) => ({ clave: `q|${q.id}`, figura: q.figura!, incognita: true, enTabla: false })),
    ...supuestos.filter((s) => s.figura).map((s) => ({ clave: `s|${s.id}`, figura: s.figura!, incognita: true, enTabla: false })),
    ...enunciados.flatMap(figurasPedidas),
  ]
  const ctx = await crearContexto(opciones, peticiones, 1)
  const t = (pt: number) => mp(pt * ctx.letra)
  const enSupuestos = supuestos.reduce((m, s) => m + s.preguntas.length, 0)

  const pregunta = (q: PreguntaPreparada): Paragraph[] => [
    new Paragraph({
      keepNext: true,
      keepLines: true,
      spacing: { before: 160, after: 60 },
      children: [new TextRun({ text: `${q.numero}. `, bold: true, size: t(10.5) }), new TextRun({ text: q.pregunta, size: t(10.5) })],
    }),
    ...imagenSuelta(`q|${q.id}`, ctx),
    ...q.opciones.map(
      (op, i) =>
        new Paragraph({
          keepLines: true,
          keepNext: i < q.opciones.length - 1 || undefined,
          indent: { left: 440, hanging: 300 },
          spacing: { after: 20 },
          children: [new TextRun({ text: `${LETRAS[i]}) `, bold: true, size: t(10.5) }), new TextRun({ text: op, size: t(10.5) })],
        }),
    ),
  ]

  const instrucciones = [
    test.length ? `${test.length} preguntas de tres opciones (formato del primer ejercicio)` : '',
    enSupuestos ? `${test.length ? ' y ' : ''}${enSupuestos} preguntas de supuesto práctico con cuatro opciones (formato del segundo ejercicio)` : '',
    '. Cada respuesta errónea descuenta 1/4 del valor de un acierto; las respuestas en blanco no penalizan.',
    opciones.soluciones ? ' Las soluciones están al final del documento.' : '',
  ].join('')

  const hijos: (Paragraph | Table)[] = [
    new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun(`Tema ${tema.numero}. ${tema.titulo}`)] }),
    new Paragraph({
      shading: { type: ShadingType.CLEAR, fill: 'F6F7F9', color: 'auto' },
      border: { left: { style: BorderStyle.SINGLE, size: 18, color: COLOR_ACENTO, space: 8 } },
      spacing: { after: 240 },
      children: [new TextRun({ text: instrucciones, size: t(9.5), font: 'Calibri' })],
    }),
  ]

  if (test.length) {
    hijos.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Primer ejercicio · preguntas de tres opciones')] }), ...test.flatMap(pregunta))
  }

  supuestos.forEach((s, i) => {
    hijos.push(
      new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun(`Segundo ejercicio · ${s.titulo}`)] }),
      ...bloques(enunciados[i].children, ctx),
      ...imagenSuelta(`s|${s.id}`, ctx),
      ...s.preguntas.flatMap(pregunta),
    )
  })

  if (opciones.soluciones) {
    hijos.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun('Soluciones')] }))
    for (const q of todas) {
      const explica = opciones.explicaciones && q.explicacion
      const fuente = opciones.fuentes && q.fuente
      hijos.push(
        new Paragraph({
          keepLines: true,
          keepNext: !!(explica || fuente) || undefined,
          spacing: { before: 120, after: 20 },
          children: [new TextRun({ text: `${q.numero}. ${LETRAS[q.correcta]}) `, bold: true, size: t(10) }), new TextRun({ text: q.opciones[q.correcta], size: t(10) })],
        }),
      )
      if (explica) {
        hijos.push(
          new Paragraph({
            keepLines: true,
            keepNext: !!fuente || undefined,
            indent: { left: 440 },
            spacing: { after: 20 },
            children: [new TextRun({ text: q.explicacion!, size: t(9.5), color: '333333' })],
          }),
        )
      }
      if (fuente) {
        hijos.push(
          new Paragraph({
            keepLines: true,
            indent: { left: 440 },
            children: [new TextRun({ text: q.fuente!, size: t(8.5), color: COLOR_SUAVE, font: 'Calibri' })],
          }),
        )
      }
    }
  }

  return Packer.toBlob(
    documento({
      ctx,
      o: opciones,
      titulo: `Tema ${tema.numero} · Cuestionario`,
      descripcion: `Cuestionario del tema ${tema.numero} para hacer en papel, generado el ${hoy()}`,
      cabecera: `Técnica/o Auxiliar de Laboratorio · Ayuntamiento de Zaragoza · Cuestionario para hacer en papel · Generado el ${hoy()}`,
      pie: `Tema ${tema.numero} · `,
      hijos,
    }),
  )
}
