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
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type ILevelsOptions,
  type INumberingOptions,
  type IRunOptions,
} from 'docx'
import type { List, ListItem, PhrasingContent, Root, RootContent, Table as TablaMd } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

import Figura from '../components/figuras/Figura'
import { comoFigura } from '../components/Markdown'
import type { TemaVista } from '../types'
import { MARGENES_MM, escalaRenglon, type OpcionesDescarga } from './almacen'
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
async function rasterizarFiguras(pedidas: { src: string; alt: string; enTabla: boolean }[], anchoMm: number) {
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
      const clave = `${p.src}|${p.alt}|${p.enTabla}`
      if (hechas.has(clave)) continue
      const figura = comoFigura(p.src, p.alt)
      if (!figura) continue
      const caja = document.createElement('div')
      if (p.enTabla) caja.className = 'md-tabla'
      md.append(caja)
      const raiz = createRoot(caja)
      flushSync(() => raiz.render(<Figura figura={figura} />))
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
        const img = ctx.figuras.get(`${n.url}|${n.alt ?? ''}|${enTabla}`)
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
    const img = n.type === 'image' ? ctx.figuras.get(`${n.url}|${n.alt ?? ''}|${enTabla}`) : undefined
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
      const niveles = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5]
      return [
        new Paragraph({
          heading: niveles[n.depth - 1],
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

function figurasPedidas(arbol: Root) {
  const out: { src: string; alt: string; enTabla: boolean }[] = []
  const recorrer = (n: { type: string; children?: unknown[] }, enTabla: boolean) => {
    if (n.type === 'image') {
      const img = n as unknown as { url: string; alt?: string }
      if (img.url !== SALTO_PAGINA) out.push({ src: img.url, alt: img.alt ?? '', enTabla })
    }
    for (const c of (n.children ?? []) as { type: string }[]) recorrer(c, enTabla || n.type === 'table')
  }
  recorrer(arbol, false)
  return out
}

export async function generarWord({ tema, md, opciones }: { tema: TemaVista; md: string; opciones: OpcionesDescarga }): Promise<Blob> {
  const apunte = tema.apunte!
  const m = MARGENES_MM[opciones.margenes]
  const anchoMm = 210 - 2 * m.lateral
  const escala = opciones.letra / 11
  const arbol = leerMarkdown(md)

  const ctx: Contexto = {
    escala: escalaRenglon(opciones),
    letra: escala,
    anchoMm,
    figuras: await rasterizarFiguras(figurasPedidas(arbol), anchoMm),
    numeraciones: new Map(),
    instancia: 0,
  }
  const t = (pt: number) => mp(pt * escala)

  const cuerpo = bloques(arbol.children, ctx)
  const listaFuentes = ++ctx.instancia

  const fuentes: Paragraph[] = opciones.fuentes
    ? [
        new Paragraph({
          keepNext: true,
          spacing: { before: 480, after: 80 },
          shading: { type: ShadingType.CLEAR, fill: 'F6F7F9', color: 'auto' },
          children: [new TextRun({ text: 'Fuentes y verificación', bold: true, size: t(9.5) })],
        }),
        ...apunte.fuentes.map(
          (fuente, i) =>
            new Paragraph({
              numbering: { reference: 'puntos', level: 0, instance: listaFuentes },
              keepLines: true,
              keepNext: i === 0 && apunte.fuentes.length > 1 ? true : undefined,
              spacing: { after: 40 },
              shading: { type: ShadingType.CLEAR, fill: 'F6F7F9', color: 'auto' },
              children: [new TextRun({ text: fuente, size: t(9.5) })],
            }),
        ),
        ...(apunte.verificado
          ? [
              new Paragraph({
                shading: { type: ShadingType.CLEAR, fill: 'F6F7F9', color: 'auto' },
                children: [new TextRun({ text: `Verificado el ${apunte.verificado}.`, size: t(9.5) })],
              }),
            ]
          : []),
      ]
    : []

  const numbering: INumberingOptions = {
    config: [
      { reference: 'puntos', levels: niveles(false) },
      ...[...ctx.numeraciones.entries()].map(([inicio, referencia]) => ({ reference: referencia, levels: niveles(true, inicio) })),
    ],
  }

  const pie = (texto: string) => new TextRun({ text: texto, size: mp(8), color: COLOR_SUAVE, font: 'Calibri' })

  const doc = new Document({
    creator: 'Técnica/o Auxiliar de Laboratorio · Ayuntamiento de Zaragoza',
    title: `Tema ${tema.numero}. ${tema.titulo}`,
    description: `Apuntes del tema ${tema.numero}, generados el ${hoy()}`,
    styles: {
      default: {
        document: {
          run: { font: 'Georgia', size: t(11), color: COLOR_TEXTO, language: { value: 'es-ES' } },
          paragraph: { spacing: { after: 120, line: 312 } },
        },
        title: { run: { font: 'Georgia', size: t(17), bold: true, color: COLOR_TEXTO }, paragraph: { spacing: { after: 240 }, keepNext: true } },
        heading1: {
          run: { font: 'Georgia', size: t(13), bold: true, color: COLOR_TEXTO },
          paragraph: { spacing: { before: 360, after: 120 }, keepNext: true, keepLines: true, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC', space: 2 } } },
        },
        heading2: { run: { font: 'Georgia', size: t(12), bold: true, color: COLOR_TEXTO }, paragraph: { spacing: { before: 280, after: 80 }, keepNext: true, keepLines: true } },
        heading3: { run: { font: 'Georgia', size: t(11), bold: true, color: COLOR_TEXTO }, paragraph: { spacing: { before: 240, after: 60 }, keepNext: true, keepLines: true } },
        heading4: { run: { font: 'Georgia', size: t(11), bold: true, italics: true, color: COLOR_TEXTO }, paragraph: { spacing: { before: 200, after: 60 }, keepNext: true, keepLines: true } },
        hyperlink: { run: { color: COLOR_ACENTO, underline: {} } },
      },
    },
    numbering,
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
        headers: {
          default: new Header({
            children: [new Paragraph({ children: [pie(`Técnica/o Auxiliar de Laboratorio · Ayuntamiento de Zaragoza · Apuntes · Generado el ${hoy()}`)] })],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ children: [`Tema ${tema.numero} · página `, PageNumber.CURRENT, ' de ', PageNumber.TOTAL_PAGES], size: mp(8), color: COLOR_SUAVE, font: 'Calibri' })],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun(`Tema ${tema.numero}. ${tema.titulo}`)] }),
          ...(apunte.estado === 'borrador'
            ? [new Paragraph({ children: [new TextRun({ text: 'Borrador pendiente de revisión.', bold: true, color: '96631A' })] })]
            : []),
          ...cuerpo,
          ...fuentes,
        ],
      },
    ],
  })

  return Packer.toBlob(doc)
}
