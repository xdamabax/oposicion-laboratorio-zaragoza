#!/usr/bin/env node
/**
 * Verifica los SALTOS DE PAGINA del PDF de apuntes: que ningun apartado,
 * tabla o lista arranque huerfano al pie de una pagina.
 *
 *   node scripts/verificar-pdf.js 7 39          -> temas 7 y 39
 *   node scripts/verificar-pdf.js 7 --sin-reglas
 *                                               -> prueba negativa: apaga las
 *                                                  reglas de la hoja de impresion
 *                                                  y exige que aparezcan huerfanos
 *   --base <url>                                -> contra la web publicada
 *
 * Como mide: el navegador no dice en que pagina cae cada cosa, pero el PDF si.
 * Chrome genera el PDF ETIQUETADO, con su arbol de estructura (H2, P, Table,
 * TR, L...), y pdf.js lo lee pagina a pagina junto con la altura de cada
 * texto. No se toca el DOM: cualquier marca sembrada en la pagina movia los
 * saltos que se querian medir. Se imprime con las MISMAS opciones que la
 * exportacion (OPCIONES_PDF).
 *
 * Mirando lo ultimo de cada pagina y lo primero de la siguiente, es huerfano:
 *   - un titulo (H1-H6) que es lo ultimo de su pagina;
 *   - una entrada que acaba en «:» y es lo ultimo de su pagina (un parrafo, o
 *     un elemento de lista que presenta una sublista), cuando lo que presenta
 *     empieza en la siguiente;
 *   - una tabla que EMPIEZA en una pagina (no es lo primero de ella) con una
 *     fila o ninguna, y sigue en la siguiente;
 *   - una lista o un parrafo que va detras de un titulo o de una entrada y deja
 *     en su pagina una sola linea antes de seguir en la siguiente.
 */

import puppeteer from 'puppeteer-core'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

import { OPCIONES_PDF, bandera, buscarChrome, decidirBase } from './comun.js'

const PUERTO = 4193
const BLOQUES = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'Table', 'L', 'Figure', 'BlockQuote'])
const TITULO = /^H[1-6]$/

/** Reglas de la hoja de impresion que evitan los arranques huerfanos, anuladas. */
const SIN_REGLAS = `@media print {
  .md h1, .md h2, .md h3, .md h4, .md p, .md li, .md tr, .md .md-tabla, .md li > ul > li, .md li > ol > li, .md .md-entrada, .md h2 + p, .md h3 + p, .md h4 + p, .md ul, .md ol {
    break-after: auto !important; page-break-after: auto !important;
    break-before: auto !important; page-break-before: auto !important;
  }
  .md li { break-inside: auto !important; page-break-inside: auto !important; }
}`

/** Los ids de contenido marcado que cuelgan de un nodo del arbol. */
const contenidos = (n, out = []) => {
  for (const c of n.children || []) {
    if (c.type === 'content') out.push(c.id)
    else contenidos(c, out)
  }
  return out
}

/** La secuencia de bloques de una pagina: el nodo con mas hijos que son bloques. */
function secuencia(raiz) {
  let mejor = null
  const recorrer = (n) => {
    const b = (n.children || []).filter((c) => BLOQUES.has(c.role))
    if (!mejor || b.length > mejor.length) mejor = b
    for (const c of n.children || []) if (c.role) recorrer(c)
  }
  recorrer(raiz)
  return mejor || []
}

/** Filas de cuerpo (con alguna TD) de una tabla que tienen texto en esta pagina. */
function contarFilas(tabla, porId) {
  let n = 0
  const recorrer = (nodo) => {
    for (const c of nodo.children || []) {
      if (c.role === 'TR') {
        const tieneTd = (c.children || []).some((x) => x.role === 'TD')
        if (tieneTd && contenidos(c).some((id) => porId[id])) n++
      } else if (c.role) recorrer(c)
    }
  }
  recorrer(tabla)
  return n
}

async function paginas(pdf) {
  const doc = await getDocument({ data: new Uint8Array(pdf) }).promise
  const out = []
  for (let n = 1; n <= doc.numPages; n++) {
    const pag = await doc.getPage(n)
    // texto y altura de cada contenido marcado
    const porId = {}
    let actual = null
    for (const it of (await pag.getTextContent({ includeMarkedContent: true })).items) {
      if (it.type === 'beginMarkedContentProps' || it.type === 'beginMarkedContent') actual = it.id ?? null
      else if (it.type === 'endMarkedContent') actual = null
      else if (actual && it.str) (porId[actual] ??= []).push({ y: Math.round(it.transform[5]), str: it.str })
    }
    const bloques = secuencia(await pag.getStructTree())
      .map((b) => {
        const trozos = contenidos(b).flatMap((id) => porId[id] || [])
        return {
          rol: b.role,
          texto: trozos.map((t) => t.str).join('').replace(/\s+/g, ' ').trim(),
          lineas: new Set(trozos.map((t) => t.y)).size,
          filas: b.role === 'Table' ? contarFilas(b, porId) : 0,
        }
      })
      .filter((b) => b.texto)
    out.push(bloques)
  }
  return out
}

async function comprobar(nav, base, tema, sinReglas) {
  const pagina = await nav.newPage()
  await pagina.goto(`${base}#/imprimir/tema/${tema}`, { waitUntil: 'networkidle0', timeout: 120000 })
  await pagina.waitForSelector('body[data-listo="1"]', { timeout: 60000 })
  await pagina.emulateMediaType('print')
  if (sinReglas) await pagina.addStyleTag({ content: SIN_REGLAS })
  const pdf = await pagina.pdf({ ...OPCIONES_PDF, tagged: true })
  await pagina.close()

  const pags = await paginas(pdf)
  const fallos = []
  const corto = (t) => `«${t.slice(0, 50)}${t.length > 50 ? '…' : ''}»`
  const entrada = (b) => b && b.rol === 'P' && b.texto.endsWith(':')
  for (let p = 0; p < pags.length - 1; p++) {
    const esta = pags[p]
    const ult = esta[esta.length - 1]
    const sig = pags[p + 1][0]
    if (!ult || !sig) continue
    const n = p + 1
    if (TITULO.test(ult.rol)) {
      fallos.push(`p. ${n}: el título ${corto(ult.texto)} se queda solo al pie`)
      continue
    }
    // No es una entrada una URL partida en «https:», ni un renglon cortado a mitad
    // de frase que casualmente acaba en «:» y sigue en minuscula en la pagina siguiente.
    const siguePartido = /^[a-záéíóúñü]/.test(sig.texto)
    if (ult.texto.endsWith(':') && !/https?:$/.test(ult.texto) && !siguePartido) {
      fallos.push(`p. ${n}: la entrada ${corto(ult.texto)}, que acaba en «…${ult.texto.slice(-40)}», se queda al pie y lo que presenta empieza en la p. ${n + 1}`)
      continue
    }
    // lo ultimo de la pagina EMPIEZA en ella si no es lo primero
    const empiezaAqui = esta.length > 1
    if (ult.rol === 'Table' && empiezaAqui && sig.rol === 'Table' && ult.filas <= 1) {
      fallos.push(`p. ${n}: la tabla ${corto(ult.texto)} arranca con ${ult.filas ? 'una sola fila' : 'solo la cabecera'} y sigue en la p. ${n + 1}`)
      continue
    }
    const ant = esta[esta.length - 2]
    if (['L', 'P'].includes(ult.rol) && empiezaAqui && sig.rol === ult.rol && ult.lineas <= 1 && ant && (TITULO.test(ant.rol) || entrada(ant))) {
      fallos.push(`p. ${n}: ${corto(ult.texto)} arranca con una sola línea al pie y sigue en la p. ${n + 1}`)
    }
  }
  return { fallos, paginas: pags.length }
}

async function main() {
  const temas = process.argv.slice(2).filter((a) => /^\d+$/.test(a))
  if (!temas.length) temas.push('7', '39')
  const sinReglas = bandera('sin-reglas')
  const servidor = await decidirBase(PUERTO)
  const nav = await puppeteer.launch({ executablePath: buscarChrome(), headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] })
  let total = 0
  try {
    for (const t of temas) {
      const { fallos, paginas } = await comprobar(nav, servidor.base, t, sinReglas)
      total += fallos.length
      console.log(`${fallos.length ? 'FALLA' : 'OK   '} Tema ${t} · ${paginas} páginas · ${fallos.length} arranque(s) huérfano(s)`)
      for (const f of fallos) console.log(`        ${f}`)
    }
  } finally {
    await nav.close()
    servidor.parar()
  }
  if (sinReglas) {
    // Prueba negativa: sin las reglas TIENE que haber huerfanos, o el control no mide nada
    console.log(total ? `\nSin las reglas aparecen ${total} huérfano(s): el control los detecta.` : '\nSin las reglas no aparece ninguno: con estos temas el control no demuestra nada.')
    process.exit(total ? 0 : 1)
  }
  console.log(total ? `\n${total} arranque(s) huérfano(s).` : '\nNingún arranque huérfano.')
  process.exit(total ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
