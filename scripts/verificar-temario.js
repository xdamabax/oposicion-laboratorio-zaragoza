#!/usr/bin/env node
/**
 * Verifica el temario completo preparado (#/editar/temario): PDF y Word.
 *
 *   node scripts/verificar-temario.js
 *   --referencia <url>   el temario «de hoy» se toma de otra web (la publicada
 *                        antes del cambio); por defecto, la misma
 *   --base <url>         contra la web publicada
 *   --sabotajes          estropea a proposito y exige que salte SU control
 *   --sabotaje <nombre>  solo ese (tema, letra, ajuste, 1-8, pagina, portada)
 *
 * IDA Y VUELTA. Sin preparar nada, la vista preparada (?edicion=1) tiene que
 * dar el mismo HTML impreso y el mismo PDF (renglon a renglon) que el temario
 * de siempre. Y el PDF no se encoge: la letra mas frecuente es la del apunte
 * (si algo se sale del papel, Chrome reduce el documento entero; asi salia el
 * temario completo, a 7,5 pt, hasta el 05/10/2026).
 *
 * PREPARADO. Con una edicion guardada en el tema 20 (un parrafo de mas), una
 * seccion quitada en el editor del tema 23, el tema 5 fuera, otro titulo de
 * portada, sin recuadros de fuentes y letra de 12 pt, la hoja impresa tiene
 * que reflejar cada cosa, y los demas temas decir exactamente lo mismo que en
 * el temario de siempre.
 *
 * WORD. El .docx del panel, sin preparar y preparado, tiene los mismos titulos
 * (cada tema es «Titulo 1» y sus apartados bajan un nivel), tablas, figuras,
 * texto y listas que los apuntes que junta (los controles de un apunte, ver
 * verificar-word.js), cada tema empieza pagina, el indice lista los temas que
 * entran y la portada trae todas sus lineas (la del BOPZ incluida), las mismas
 * que la portada de la hoja impresa, que sale del mismo sitio.
 */

import puppeteer from 'puppeteer-core'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

import { OPCIONES_PDF, argumento, bandera, buscarChrome, decidirBase } from './comun.js'
import { NIVEL, SABOTAJES, abrirConGancho, abrirDocx, analizarEnPagina, apunteDe, controlar, descargarWord, esperado, sabotear } from './docx.js'

const PUERTO = 4206
const MARCA = 'PÁRRAFO-DE-PRUEBA-DEL-TEMARIO'
const FUERA = 5
const EDITADO = 20
const RECORTADO = 23
const TITULO = 'TÍTULO-DE-PRUEBA'

/* ---------- utilidades ---------- */

async function abrirHoja(ctx, base, edicion) {
  const p = await ctx.newPage()
  await p.goto(`${base}#/imprimir/temario${edicion ? '?edicion=1' : ''}`, { waitUntil: 'networkidle0', timeout: 300000 })
  await p.waitForSelector('body[data-listo="1"]', { timeout: 300000 })
  await p.emulateMediaType('print')
  return p
}

/** El HTML impreso, sin el <style> de la descarga y con las rutas de imagen igualadas. */
const htmlDe = (p) =>
  p.evaluate(() => {
    const raiz = document.querySelector('.imp').cloneNode(true)
    for (const s of raiz.querySelectorAll('style')) s.remove()
    raiz.normalize()
    return raiz.innerHTML
      .replace(/src="[^"]*\/assets\//g, 'src="/assets/')
      .replace(/\s+/g, ' ')
      .replace(/> </g, '><')
  })

/** El texto de cada pagina del PDF, renglon a renglon (ver verificar-editor.js). */
/** Lo que deshace el ajuste al papel (como --sin-ajuste de verificar-pdf.js). */
const SIN_AJUSTE = `@media print {
  .imp a, .md table.md-tabla-ancha th, .md table.md-tabla-ancha td { overflow-wrap: normal !important; hyphens: manual !important; }
}`

/** La letra mas frecuente del ultimo PDF leido, en pt. */
let letraFrecuente = 0

async function textoPDF(pdf) {
  const doc = await getDocument({ data: new Uint8Array(pdf) }).promise
  const paginas = []
  const letras = new Map()
  for (let n = 1; n <= doc.numPages; n++) {
    const items = (await (await doc.getPage(n)).getTextContent()).items.filter((i) => i.str.trim())
    for (const i of items) {
      const t = Math.round(Math.hypot(i.transform[0], i.transform[1]) * 10) / 10
      letras.set(t, (letras.get(t) ?? 0) + i.str.length)
    }
    const renglones = new Map()
    for (const i of items) {
      const y = Math.round(i.transform[5] * 2) / 2
      if (!renglones.has(y)) renglones.set(y, [])
      renglones.get(y).push({ str: i.str, x: i.transform[4] })
    }
    paginas.push(
      [...renglones.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([y, t]) => {
          t.sort((a, b) => a.x - b.x)
          return { str: t.map((x) => x.str).join('').replace(/\s+/g, ''), x: t[0].x, y }
        }),
    )
  }
  letraFrecuente = [...letras.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0
  return paginas
}

function primeraDiferencia(a, b) {
  if (a.length !== b.length) return `el de siempre tiene ${a.length} páginas y el preparado ${b.length}`
  for (let p = 0; p < a.length; p++) {
    for (let i = 0; i < Math.max(a[p].length, b[p].length); i++) {
      const x = a[p][i]
      const y = b[p][i]
      if (!(x && y && x.str === y.str && Math.abs(x.x - y.x) < 0.5 && Math.abs(x.y - y.y) < 0.5)) {
        const d = (t) => (t ? `«${t.str.slice(0, 40)}» en (${t.x.toFixed(1)}, ${t.y.toFixed(1)})` : 'nada')
        return `p. ${p + 1}: el de siempre tiene ${d(x)} y el preparado ${d(y)}`
      }
    }
  }
  return null
}

function primeraDiferenciaTexto(a, b) {
  if (a === b) return null
  let i = 0
  while (a[i] === b[i]) i++
  return `difiere en el carácter ${i}: de siempre «…${a.slice(Math.max(0, i - 50), i + 40)}…», preparado «…${b.slice(Math.max(0, i - 50), i + 40)}…»`
}

/** Por tema: su titulo, su texto y sus apartados, de la hoja impresa. */
const temasDe = (p) =>
  p.evaluate(() =>
    [...document.querySelectorAll('.imp-tema')].map((s) => ({
      titulo: s.querySelector('h1').textContent.trim(),
      texto: s.textContent.replace(/\s+/g, ' ').trim(),
      h2: [...s.querySelectorAll('.md h2')].map((h) => h.textContent.trim()),
      fuentes: !!s.querySelector('.imp-fuentes'),
    })),
  )

/** Lo que se guarda para el caso preparado: lo mismo que harian el editor de cada tema y el panel. */
function preparar(tema23) {
  const primerH2 = tema23.match(/^## (.+)$/m)[1].replace(/\*\*/g, '').trim()
  return {
    [`descarga:edicion:${EDITADO}`]: JSON.stringify({ md: `${apunteDe(EDITADO)}\n\n${MARCA}\n`, base: 'x', guardado: new Date().toISOString() }),
    [`descarga:opciones:${RECORTADO}`]: JSON.stringify({ ocultas: [primerH2] }),
    'descarga:temario': JSON.stringify({ excluidos: [FUERA], titulo: TITULO, fuentes: false, letra: 12 }),
    _quitada: primerH2,
  }
}

async function guardar(ctx, base, claves) {
  const p = await ctx.newPage()
  await p.goto(`${base}#/`, { waitUntil: 'networkidle0' })
  await p.evaluate((c) => {
    for (const [k, v] of Object.entries(c)) if (!k.startsWith('_')) localStorage.setItem(k, v)
  }, claves)
  await p.close()
}

/* ---------- controles ---------- */

async function idaYVuelta(nav, base, ref, sabotaje) {
  const ctx = await nav.createBrowserContext()
  try {
    const orig = await abrirHoja(ctx, ref, false)
    const prep = await abrirHoja(ctx, base, true)
    if (sabotaje === 'tema') await prep.evaluate(() => document.querySelectorAll('.imp-tema')[17].remove())
    if (sabotaje === 'ajuste') await prep.addStyleTag({ content: SIN_AJUSTE })
    if (sabotaje === 'letra') {
      await prep.evaluate(() => {
        const p = document.querySelectorAll('.imp-tema .md p')[300]
        p.firstChild.textContent = p.firstChild.textContent.replace(/[a-z]/i, (c) => (c === 'x' ? 'y' : 'x'))
      })
    }
    const dif = primeraDiferenciaTexto(await htmlDe(orig), await htmlDe(prep))
    const a = await textoPDF(await orig.pdf(OPCIONES_PDF))
    const b = await textoPDF(await prep.pdf(OPCIONES_PDF))
    const letra = letraFrecuente
    const difPdf = primeraDiferencia(a, b)
    return [
      { nombre: 'Ida y vuelta: mismo HTML impreso que el temario de siempre', ok: !dif, detalle: dif ?? 'idéntico' },
      {
        nombre: 'Ida y vuelta: mismo PDF que el temario de siempre',
        ok: !difPdf,
        detalle: difPdf ?? `${a.length} páginas y ${a.reduce((s, p) => s + p.length, 0)} renglones, iguales y en la misma posición`,
      },
      {
        // 11 pt en el texto y 10,8 en las tablas: por debajo, encogido
        nombre: 'El PDF del temario no se encoge',
        ok: letra >= 10.5,
        detalle: `letra más frecuente: ${letra} pt${letra < 10.5 ? ' (ENCOGIDO: algo se sale del papel)' : ''}`,
      },
    ]
  } finally {
    await ctx.close()
  }
}

async function preparado(nav, base, ref) {
  const ctx = await nav.createBrowserContext()
  try {
    const claves = preparar(apunteDe(RECORTADO))
    const orig = await abrirHoja(ctx, ref, false)
    const antes = await temasDe(orig)
    await guardar(ctx, base, claves)
    const prep = await abrirHoja(ctx, base, true)
    const despues = await temasDe(prep)
    const hoja = await prep.evaluate(() => ({
      portada: document.querySelector('.imp-portada h1')?.textContent,
      indice: [...document.querySelectorAll('.imp-indice-lista li')].map((l) => Number(l.getAttribute('value'))),
      letra: getComputedStyle(document.querySelector('.imp .md p')).fontSize,
    }))
    const r = []
    const es = (t, n) => t.titulo.startsWith(`Tema ${n}.`)
    r.push({
      nombre: 'Temas: entra cada uno menos el excluido, también en el índice',
      ok: despues.length === antes.length - 1 && !despues.some((t) => es(t, FUERA)) && hoja.indice.length === antes.length - 1 && !hoja.indice.includes(FUERA),
      detalle: `${despues.length} temas (antes ${antes.length}); índice con ${hoja.indice.length}; tema ${FUERA}: ${despues.some((t) => es(t, FUERA)) ? 'está' : 'fuera'}`,
    })
    const t20 = despues.find((t) => es(t, EDITADO))
    r.push({ nombre: `La edición del tema ${EDITADO} entra en el temario`, ok: !!t20?.texto.includes(MARCA), detalle: `marca: ${!!t20?.texto.includes(MARCA)}` })
    const a23 = antes.find((t) => es(t, RECORTADO))
    const d23 = despues.find((t) => es(t, RECORTADO))
    r.push({
      nombre: `La sección quitada en el editor del tema ${RECORTADO} no sale`,
      ok: a23.h2.includes(claves._quitada) && !d23.h2.includes(claves._quitada) && d23.h2.length === a23.h2.length - 1,
      detalle: `«${claves._quitada}»: ${a23.h2.length} apartados antes, ${d23.h2.length} después`,
    })
    // los demas temas: el mismo texto, salvo el recuadro de fuentes, que aqui se quito
    const sinFuentes = (t) => t.texto.replace(/Fuentes y verificación.*$/, '')
    const otros = antes.filter((t) => ![FUERA, EDITADO, RECORTADO].some((n) => es(t, n)))
    const cambiado = otros.find((t) => sinFuentes(t) !== sinFuentes(despues.find((d) => d.titulo === t.titulo) ?? { texto: '' }))
    r.push({
      nombre: 'Los demás temas dicen exactamente lo mismo',
      ok: !cambiado,
      detalle: cambiado ? `cambia «${cambiado.titulo.slice(0, 50)}»` : `${otros.length} temas sin tocar, con el mismo texto`,
    })
    r.push({
      nombre: 'Opciones del documento: portada, fuentes y letra',
      ok: hoja.portada === TITULO && !despues.some((t) => t.fuentes) && Math.abs(parseFloat(hoja.letra) - 16) < 0.01,
      detalle: `portada «${hoja.portada}»; recuadros de fuentes: ${despues.filter((t) => t.fuentes).length}; párrafo a ${hoja.letra}`,
    })
    return { r, claves }
  } finally {
    await ctx.close()
  }
}

/**
 * Las lineas de la portada de la hoja impresa, en orden: antetitulo, titulo,
 * subtitulo y las del pie (cuantos temas, el BOPZ y la fecha), cada una aparte.
 */
const portadaDe = (p) =>
  p.evaluate(() => {
    const sec = document.querySelector('.imp-portada')
    if (!sec) return []
    const lineas = []
    for (const el of sec.children) {
      if (el.classList.contains('imp-portada-pie')) {
        // el pie va en un parrafo con <br>: cada trozo es una linea
        let actual = ''
        for (const n of el.childNodes) {
          if (n.nodeName === 'BR') {
            lineas.push(actual)
            actual = ''
          } else actual += n.textContent
        }
        lineas.push(actual)
      } else lineas.push(el.textContent)
    }
    return lineas.map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean)
  })

/** Para comparar: sin mayusculas (el antetitulo va en versalitas por CSS) ni espacios de mas. */
const normal = (t) => t.replace(/\s+/g, ' ').trim().toLowerCase()

/** Lo propio del temario en el Word: cada tema empieza pagina, el indice lista los que entran y la portada esta entera. */
function controlesTemario(a, numeros, portada) {
  const temas = a.parrafos.filter((p) => p.estilo === 'Heading1')
  const sinPagina = temas.filter((p) => !p.nuevaPagina)
  // el indice: las entradas «N. titulo» seguidas que hay tras el rotulo, hasta la
  // primera que no lo es (no hasta el primer tema: si faltara su titulo, el
  // indice se tragaria el texto del tema)
  const i = a.parrafos.findIndex((p) => p.texto.trim() === 'Índice')
  const indice = []
  for (let k = i + 1; i >= 0 && k < a.parrafos.length; k++) {
    const m = a.parrafos[k].texto.match(/^(\d+)\./)
    if (!m || a.parrafos[k].estilo) break
    indice.push(Number(m[1]))
  }
  return [
    {
      nombre: 'Word: cada tema empieza página',
      ok: temas.length === numeros.length && !sinPagina.length,
      detalle: sinPagina.length ? `${sinPagina.length} tema(s) sin salto, p. ej. «${sinPagina[0].texto.slice(0, 40)}»` : `${temas.length} temas, todos en página nueva`,
    },
    {
      nombre: 'Word: el índice lista los temas que entran',
      ok: indice.join(',') === numeros.join(','),
      detalle: indice.join(',') === numeros.join(',') ? `${indice.length} entradas` : `índice ${indice.join(',').slice(0, 60)}`,
    },
    controlPortada(a, portada),
  ]
}

/**
 * La portada del Word: los parrafos que van antes del rotulo «Índice» (o del
 * primer tema, si no hay indice) tienen que ser, en orden, las lineas de la
 * portada de la hoja impresa. Asi no puede desaparecer ninguna (la del BOPZ,
 * por ejemplo) sin que se note: el control «Texto» solo mira los apuntes.
 */
function controlPortada(a, portada) {
  const fin = a.parrafos.findIndex((p) => p.texto.trim() === 'Índice' || p.estilo === 'Heading1')
  const delWord = a.parrafos.slice(0, fin < 0 ? 0 : fin).map((p) => normal(p.texto)).filter(Boolean)
  const esperadas = portada.map(normal)
  const falta = esperadas.find((l, i) => delWord[i] !== l)
  const ok = esperadas.length > 0 && !falta && delWord.length === esperadas.length
  return {
    nombre: 'Word: la portada, entera (con el BOPZ)',
    ok,
    detalle: ok
      ? `${esperadas.length} líneas, las mismas que en el PDF`
      : falta
        ? `falta o cambia «${falta.slice(0, 60)}»`
        : `el Word tiene ${delWord.length} líneas de portada y el PDF ${esperadas.length}`,
  }
}

async function word(nav, base, mesa, claves, sabotaje) {
  const ctx = await nav.createBrowserContext()
  try {
    // los titulos de los temas, de la hoja impresa de siempre
    const h = await abrirHoja(ctx, base, false)
    const titulos = await h.evaluate(() => [...document.querySelectorAll('.imp-tema > h1')].map((x) => x.textContent.replace(/\s+/g, ' ').trim()))
    let portada = await portadaDe(h)
    await h.close()
    if (claves) {
      await guardar(ctx, base, claves)
      const hp = await abrirHoja(ctx, base, true)
      portada = await portadaDe(hp)
      await hp.close()
    }
    const panel = await abrirConGancho(ctx, `${base}#/editar/temario`)
    let docx = await abrirDocx(await descargarWord(panel))
    await panel.close()

    const numeros = titulos.map((t) => Number(t.match(/^Tema (\d+)\./)[1])).filter((n) => !claves || n !== FUERA)
    const md = (n) => (claves && n === EDITADO ? `${apunteDe(n)}\n\n${MARCA}\n` : apunteDe(n))
    const e = esperado(
      numeros.map((n) => ({ md: md(n), titulo: titulos.find((t) => t.startsWith(`Tema ${n}.`)), ocultas: claves && n === RECORTADO ? [claves._quitada] : [] })),
      1,
    )
    if (sabotaje === 'portada') {
      // se borra el parrafo de la portada que trae el BOPZ
      const xml = docx.partes['word/document.xml']
      const sinBopz = xml.replace(/<w:p>(?:(?!<w:p>)[\s\S])*?BOPZ núm\. 170[\s\S]*?<\/w:p>/, '')
      if (sinBopz === xml) throw new Error('el sabotaje de la portada no encuentra la línea del BOPZ')
      docx = { ...docx, partes: { ...docx.partes, 'word/document.xml': sinBopz } }
    } else if (sabotaje === 'pagina') {
      docx = {
        ...docx,
        partes: {
          ...docx.partes,
          'word/document.xml': docx.partes['word/document.xml'].replace(/(<w:pStyle w:val="Heading1"\/>)([\s\S]*?)<w:pageBreakBefore\/>/, '$1$2'),
        },
      }
    } else if (sabotaje) {
      docx = await sabotear(mesa, sabotaje, docx, e)
      if (!docx) return null
    }
    const a = await mesa.evaluate(analizarEnPagina, docx)
    const r = [...controlar(a, e, docx), ...controlesTemario(a, numeros, portada)]
    if (claves) {
      const letra = a.letra
      const recuadros = a.parrafos.filter((p) => !(p.estilo in NIVEL) && !p.lista && p.texto.trim() === 'Fuentes y verificación').length
      const portada = a.parrafos.find((p) => p.estilo === 'Title')?.texto
      r.push({
        nombre: 'Word: las opciones del documento',
        ok: letra === 24 && recuadros === 0 && portada === TITULO,
        detalle: `letra ${letra / 2} pt; recuadros de fuentes ${recuadros}; portada «${portada}»`,
      })
    }
    return r
  } finally {
    await ctx.close()
  }
}

/* ---------- principal ---------- */

function pinta(titulo, resultados) {
  console.log(`\n${titulo}`)
  for (const x of resultados) {
    console.log(`${x.ok ? 'OK   ' : 'FALLA'} ${x.nombre}`)
    console.log(`      ${x.detalle}`)
  }
}

async function main() {
  const servidor = await decidirBase(PUERTO)
  const base = servidor.base
  const ref = argumento('referencia', base)
  const nav = await puppeteer.launch({ executablePath: buscarChrome(), headless: 'new', protocolTimeout: 900000, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
  const mesa = await nav.newPage()
  await mesa.goto(base, { waitUntil: 'networkidle0' })
  let fallos = 0
  try {
    if (!bandera('sabotajes')) {
      const iv = await idaYVuelta(nav, base, ref)
      pinta('=== Ida y vuelta (sin preparar nada) ===', iv)
      const { r: pr, claves } = await preparado(nav, base, ref)
      pinta('=== Temario preparado ===', pr)
      const w0 = await word(nav, base, mesa, null)
      pinta('=== Word sin preparar ===', w0)
      const w1 = await word(nav, base, mesa, claves)
      pinta('=== Word preparado ===', w1)
      fallos = [...iv, ...pr, ...w0, ...w1].filter((x) => !x.ok).length
    } else {
      // la ida y vuelta: quitar un tema o cambiar una letra lo tiene que ver
      const hoja = {
        tema: { que: 'se pierde un tema', tumba: [0, 1] },
        letra: { que: 'cambia una letra', tumba: [0, 1] },
        // el HTML es el mismo (solo cambia la hoja de estilo); el PDF, no
        ajuste: { que: 'una tabla se sale del papel', tumba: [1, 2] },
      }
      // --sabotaje <nombre>: solo ese (el temario es grande: asi cabe en tandas cortas)
      const solo = argumento('sabotaje')
      for (const [n, s] of Object.entries(hoja).filter(([n]) => !solo || solo === n)) {
        const r = await idaYVuelta(nav, base, ref, n)
        const caidos = r.map((x, i) => (x.ok ? -1 : i)).filter((i) => i >= 0)
        const bien = s.tumba.every((i) => caidos.includes(i)) && caidos.every((i) => s.tumba.includes(i))
        if (!bien) fallos++
        console.log(`${bien ? 'OK   ' : 'FALLA'} sabotaje «${s.que}»: ${r.map((x) => `${x.nombre} ${x.ok ? 'pasa' : 'cae'}`).join('; ')}`)
      }
      // el Word: los sabotajes de un apunte, y uno propio (un tema sin salto de pagina)
      // En el temario, el primer titulo es el de un tema: perderlo quita tambien su salto de pagina (acoplados de verdad)
      const tumba = { ...SABOTAJES, 1: { ...SABOTAJES[1], tumba: [1, 7] }, pagina: { que: 'un tema no empieza página', tumba: [7] }, portada: { que: 'se borra la línea del BOPZ de la portada', tumba: [9] } }
      for (const [n, s] of Object.entries(tumba).filter(([n]) => !solo || solo === n)) {
        const r = await word(nav, base, mesa, null, ['pagina', 'portada'].includes(n) ? n : Number(n))
        if (!r) {
          console.log(`·     Word · sabotaje ${n} (${s.que}): no aplica`)
          continue
        }
        const caidos = r.map((x, i) => (x.ok ? -1 : i)).filter((i) => i >= 0)
        const faltan = s.tumba.filter((i) => !caidos.includes(i))
        const sobran = caidos.filter((i) => !s.tumba.includes(i))
        const bien = !faltan.length && !sobran.length
        if (!bien) fallos++
        console.log(
          `${bien ? 'OK   ' : 'FALLA'} Word · sabotaje ${n} (${s.que}): ${faltan.length ? `NO lo ve ${faltan.map((i) => `«${r[i].nombre}»`).join(', ')}` : sobran.length ? `tumba de más ${sobran.map((i) => `«${r[i].nombre}»: ${r[i].detalle}`).join(', ')}` : `lo caza ${s.tumba.map((i) => `«${r[i].nombre}»`).join(', ')}`}`,
        )
      }
    }
  } finally {
    await nav.close()
    servidor.parar()
  }
  console.log(fallos ? `\n${fallos} control(es) sin pasar.` : '\nTodo pasa.')
  process.exit(fallos ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
