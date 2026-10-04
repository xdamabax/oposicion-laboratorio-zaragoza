#!/usr/bin/env node
/**
 * Verifica los SALTOS DE PAGINA del PDF de apuntes: que ningun apartado,
 * tabla o lista arranque huerfano al pie de una pagina, y que ninguno salte a
 * la siguiente sin necesidad, dejando un hueco en blanco donde cabia.
 *
 *   node scripts/verificar-pdf.js 7 39          -> temas 7 y 39
 *   node scripts/verificar-pdf.js 7 --sin-reglas
 *                                               -> prueba negativa: apaga las
 *                                                  reglas de la hoja de impresion
 *                                                  y exige que aparezcan huerfanos
 *   node scripts/verificar-pdf.js 29 --reglas-viejas
 *                                               -> prueba negativa del otro lado:
 *                                                  vuelve a las reglas de antes del
 *                                                  04/10/2026, que empujaban de mas,
 *                                                  y exige saltos innecesarios
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
 *     fila baja (de uno o dos renglones) o ninguna, y sigue en la siguiente;
 *   - una lista o un parrafo que va detras de un titulo o de una entrada y deja
 *     en su pagina una sola linea antes de seguir en la siguiente.
 *
 * Y es un salto innecesario (el defecto contrario: reglas que empujan de mas)
 * que una pagina acabe con un hueco en blanco donde cabia lo que abre la
 * siguiente:
 *   - todo lo que va antes del primer titulo de la pagina siguiente (un
 *     apartado entero, o el final de un parrafo partido): antes de un titulo
 *     siempre se puede cortar;
 *   - o el arranque minimo de su primer bloque, el que ninguna regla obliga a
 *     llevarse junto: dos renglones de un parrafo, dos elementos de una lista,
 *     o la cabecera de una tabla con su primera fila (y la segunda, si la
 *     primera es baja).
 * Se deja una holgura (HOLGURA) para margenes y alturas de linea que el PDF no
 * da exactas. Una figura no se juzga: su dibujo no es texto y no se mide.
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

/**
 * Las reglas que habia antes del 04/10/2026: cualquier primer parrafo tras un
 * titulo pegado a lo siguiente (tambien a otro titulo, en cadena), la segunda
 * fila de toda tabla pegada a la primera, los elementos de lista de varios
 * parrafos sin partir, y el recuadro de fuentes tampoco.
 */
const REGLAS_VIEJAS = `@media print {
  .md :is(h2, h3, h4) + p { break-after: avoid-page !important; page-break-after: avoid !important; }
  .md tbody tr:nth-child(2) { break-before: avoid-page !important; page-break-before: avoid !important; }
  .md li:not(:has(ul, ol)) { break-inside: avoid !important; page-break-inside: avoid !important; }
  .imp-fuentes { break-inside: avoid !important; page-break-inside: avoid !important; }
}`

/** Margen inferior de la caja de impresion, en puntos (el PDF mide en pt). */
const SUELO = (parseFloat(OPCIONES_PDF.margin.bottom) / 25.4) * 72
/** Un renglon de texto del apunte (11 pt con interlineado 1,55). */
const RENGLON = 17
/** Lo que se perdona al medir un hueco: margenes entre bloques y redondeos. */
const HOLGURA = 30
/**
 * Una fila de mas caracteres que esto ya arranca sola la tabla, y la hoja de
 * impresion no le pega la segunda. Es el FILA_ALTA de
 * app/src/components/Markdown.tsx: si cambia alli, hay que cambiarlo aqui.
 */
const FILA_ALTA = 250

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

/** Renglones y extremos de un trozo de texto (la y crece hacia arriba, como en el PDF). */
function geometria(trozos) {
  const ys = trozos.map((t) => t.y)
  return { top: Math.max(...ys), bot: Math.min(...ys), lineas: new Set(ys).size }
}

/**
 * Las unidades de un bloque que tienen texto en esta pagina: las filas de una
 * tabla (marcando las de cabecera, sin TD) o los elementos de una lista.
 */
function unidades(bloque, porId) {
  const rol = bloque.role === 'Table' ? 'TR' : bloque.role === 'L' ? 'LI' : null
  if (!rol) return []
  const out = []
  const recorrer = (nodo) => {
    for (const c of nodo.children || []) {
      if (c.role === rol) {
        const trozos = contenidos(c).flatMap((id) => porId[id] || [])
        const cabecera = rol === 'TR' && !(c.children || []).some((x) => x.role === 'TD')
        const caracteres = trozos.map((t) => t.str).join('').length
        if (trozos.length) out.push({ ...geometria(trozos), cabecera, caracteres })
      } else if (c.role && c.role !== 'L') recorrer(c)
    }
  }
  recorrer(bloque)
  return out
}

async function paginas(pdf) {
  const doc = await getDocument({ data: new Uint8Array(pdf) }).promise
  const out = []
  for (let n = 1; n <= doc.numPages; n++) {
    const pag = await doc.getPage(n)
    // texto y altura de cada contenido marcado
    const porId = {}
    let actual = null
    let suelo = Infinity
    let techo = -Infinity
    for (const it of (await pag.getTextContent({ includeMarkedContent: true })).items) {
      if (it.type === 'beginMarkedContentProps' || it.type === 'beginMarkedContent') actual = it.id ?? null
      else if (it.type === 'endMarkedContent') actual = null
      else if (actual && it.str) {
        const y = Math.round(it.transform[5])
        ;(porId[actual] ??= []).push({ y, str: it.str })
        suelo = Math.min(suelo, y)
        techo = Math.max(techo, y)
      }
    }
    const bloques = secuencia(await pag.getStructTree())
      .map((b) => {
        const trozos = contenidos(b).flatMap((id) => porId[id] || [])
        const partes = unidades(b, porId)
        const filas = partes.filter((u) => b.role === 'Table' && !u.cabecera)
        return {
          rol: b.role,
          texto: trozos.map((t) => t.str).join('').replace(/\s+/g, ' ').trim(),
          ...geometria(trozos),
          filas: filas.length,
          primeraFila: filas[0],
          unidades: partes,
        }
      })
      .filter((b) => b.texto)
    // El hueco en blanco que queda entre el ultimo renglon y el margen inferior.
    // Y si la secuencia no arranca en el renglon mas alto de la pagina, es que
    // se ha tomado la de dentro de algo partido (un elemento de lista con
    // varios bloques), y lo que abre la pagina no esta en ella.
    const enteraArriba = bloques.length > 0 && bloques[0].top >= techo
    out.push({ bloques, hueco: suelo - SUELO, enteraArriba })
  }
  return out
}

/** Alto en el papel de un tramo que va del renglon de arriba al de abajo. */
const alto = (top, bot) => top - bot + RENGLON

/** Un parrafo que la hoja de impresion pega a lo que le sigue: una entrada, o el que presenta una lista o una tabla. */
const pegado = (b, sig) => b.rol === 'P' && (b.texto.endsWith(':') || ['L', 'Table'].includes(sig?.rol))

/**
 * Hasta donde llega (la y de su ultimo renglon) lo minimo que el bloque i de
 * una pagina necesita para arrancar sin quedar huerfano, contando lo que la
 * hoja de impresion le obliga a llevarse. null si no se sabe medir (una
 * figura, una cita).
 */
function finDelArranque(bloques, i, continuacion) {
  const b = bloques[i]
  if (b.rol === 'P') {
    // De cuatro renglones en adelante se puede partir: bastan dos (orphans).
    // Si viene partido de la pagina anterior, cada renglon de mas podia
    // haberse quedado alli, salvo los dos ultimos (widows).
    if (continuacion ? b.lineas > 2 : b.lineas >= 4) return b.top - RENGLON
    // Uno corto no se parte, y si presenta algo, lo lleva consigo
    if (pegado(b, bloques[i + 1]) && bloques[i + 1] && !TITULO.test(bloques[i + 1].rol)) {
      return finDelArranque(bloques, i + 1, false)
    }
    return b.bot
  }
  if (b.rol === 'L' && b.unidades.length) {
    // dos elementos; y si no hay mas y detras va una tabla, el ultimo la presenta
    if (b.unidades.length <= 2 && bloques[i + 1]?.rol === 'Table') return finDelArranque(bloques, i + 1, false)
    return b.unidades[Math.min(1, b.unidades.length - 1)].bot
  }
  if (b.rol === 'Table' && b.unidades.length) {
    // la cabecera, la primera fila y, si esta no es alta, tambien la segunda
    const u = b.unidades
    let k = u.findIndex((x) => !x.cabecera)
    if (k < 0) return null
    if (u[k].caracteres <= FILA_ALTA && u[k + 1]) k++
    return u[k].bot
  }
  return null
}

/** Saltos que dejan al pie de una pagina un hueco donde cabia lo que abre la siguiente. */
function saltosInnecesarios(pags, corto) {
  const fallos = []
  for (let p = 0; p < pags.length - 1; p++) {
    const { hueco } = pags[p]
    const sig = pags[p + 1].bloques
    if (!sig.length || !pags[p].bloques.length || !pags[p + 1].enteraArriba) continue
    const n = p + 1
    const blanco = `quedan ${Math.round(hueco)} pt en blanco al pie de la p. ${n}`
    // 1) lo que va antes del primer titulo de la pagina siguiente
    const k = sig.findIndex((b, i) => i > 0 && TITULO.test(b.rol) && sig.slice(0, i).some((x) => !TITULO.test(x.rol)))
    if (k > 0 && !sig.slice(0, k).some((b) => b.rol === 'Figure')) {
      const necesita = alto(sig[0].top, sig[k - 1].bot)
      if (necesita + HOLGURA < hueco) {
        fallos.push(`${blanco} y lo que abre la p. ${n + 1} hasta su primer título, ${corto(sig[0].texto)}, ocupa ${Math.round(necesita)}`)
        continue
      }
    }
    // 2) el arranque minimo de su primer bloque, si no es un titulo
    const b = sig[0]
    if (TITULO.test(b.rol)) continue
    // un parrafo que empieza en minuscula viene partido de la pagina anterior
    const fin = finDelArranque(sig, 0, b.rol === 'P' && /^[a-záéíóúñü]/.test(b.texto))
    if (fin === null) continue
    const necesita = alto(b.top, fin)
    if (necesita + HOLGURA < hueco) {
      fallos.push(`${blanco} y ${corto(b.texto)}, que abre la p. ${n + 1}, podía arrancar ahí con ${Math.round(necesita)}`)
    }
  }
  return fallos
}

async function comprobar(nav, base, tema, { sinReglas, reglasViejas }) {
  const pagina = await nav.newPage()
  await pagina.goto(`${base}#/imprimir/tema/${tema}`, { waitUntil: 'networkidle0', timeout: 120000 })
  await pagina.waitForSelector('body[data-listo="1"]', { timeout: 60000 })
  await pagina.emulateMediaType('print')
  if (sinReglas) await pagina.addStyleTag({ content: SIN_REGLAS })
  if (reglasViejas) await pagina.addStyleTag({ content: REGLAS_VIEJAS })
  const pdf = await pagina.pdf({ ...OPCIONES_PDF, tagged: true })
  await pagina.close()

  const conHuecos = await paginas(pdf)
  const pags = conHuecos.map((p) => p.bloques)
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
    // una fila alta (de tres renglones o mas) ya arranca bien la tabla ella sola
    const filaBaja = ult.filas === 0 || (ult.filas === 1 && ult.primeraFila.lineas <= 2)
    if (ult.rol === 'Table' && empiezaAqui && sig.rol === 'Table' && filaBaja) {
      fallos.push(`p. ${n}: la tabla ${corto(ult.texto)} arranca con ${ult.filas ? 'una sola fila' : 'solo la cabecera'} y sigue en la p. ${n + 1}`)
      continue
    }
    const ant = esta[esta.length - 2]
    if (['L', 'P'].includes(ult.rol) && empiezaAqui && sig.rol === ult.rol && ult.lineas <= 1 && ant && (TITULO.test(ant.rol) || entrada(ant))) {
      fallos.push(`p. ${n}: ${corto(ult.texto)} arranca con una sola línea al pie y sigue en la p. ${n + 1}`)
    }
  }
  return { fallos, saltos: saltosInnecesarios(conHuecos, corto), paginas: pags.length }
}

async function main() {
  const temas = process.argv.slice(2).filter((a) => /^\d+$/.test(a))
  if (!temas.length) temas.push('7', '39')
  const modo = { sinReglas: bandera('sin-reglas'), reglasViejas: bandera('reglas-viejas') }
  const servidor = await decidirBase(PUERTO)
  const nav = await puppeteer.launch({ executablePath: buscarChrome(), headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] })
  let huerfanos = 0
  let saltos = 0
  try {
    for (const t of temas) {
      const r = await comprobar(nav, servidor.base, t, modo)
      huerfanos += r.fallos.length
      saltos += r.saltos.length
      const mal = r.fallos.length + r.saltos.length
      console.log(`${mal ? 'FALLA' : 'OK   '} Tema ${t} · ${r.paginas} páginas · ${r.fallos.length} arranque(s) huérfano(s) · ${r.saltos.length} salto(s) innecesario(s)`)
      for (const f of r.fallos) console.log(`        huérfano: ${f}`)
      for (const f of r.saltos) console.log(`        salto: ${f}`)
    }
  } finally {
    await nav.close()
    servidor.parar()
  }
  // Pruebas negativas: con las reglas rotas TIENE que saltar su control, o no mide nada
  if (modo.sinReglas) {
    console.log(huerfanos ? `\nSin las reglas aparecen ${huerfanos} huérfano(s): el control los detecta.` : '\nSin las reglas no aparece ninguno: con estos temas el control no demuestra nada.')
    process.exit(huerfanos ? 0 : 1)
  }
  if (modo.reglasViejas) {
    console.log(saltos ? `\nCon las reglas viejas aparecen ${saltos} salto(s) innecesario(s): el control los detecta.` : '\nCon las reglas viejas no aparece ninguno: con estos temas el control no demuestra nada.')
    process.exit(saltos ? 0 : 1)
  }
  const total = huerfanos + saltos
  console.log(total ? `\n${huerfanos} arranque(s) huérfano(s) y ${saltos} salto(s) innecesario(s).` : '\nNingún arranque huérfano ni salto innecesario.')
  process.exit(total ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
