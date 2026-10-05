#!/usr/bin/env node
/**
 * Verifica el cuestionario preparado (#/editar/test/N): PDF y Word.
 *
 *   node scripts/verificar-cuestionario.js            -> los 40 temas
 *   node scripts/verificar-cuestionario.js 20 23      -> esos temas
 *   --referencia <url>   el cuestionario «de hoy» se toma de otra web
 *   --base <url>         contra la web publicada
 *   --sabotajes          estropea a proposito y exige que salte SU control
 *
 * En cada tema, ocho controles:
 *   0-1. ida y vuelta: sin preparar nada, la vista preparada (?edicion=1) da el
 *        mismo HTML impreso y el mismo PDF que el cuestionario de siempre;
 *   2-3. coherencia del PDF, sin preparar y BARAJADO (preguntas y opciones,
 *        con dos preguntas fuera): las preguntas que tocan y ninguna mas,
 *        numeradas seguidas; cada una con sus mismas opciones; cada solucion
 *        apuntando, con su letra, a la opcion que era la correcta EN EL JSON;
 *        las preguntas cuyas opciones se refieren a otras, sin barajar; las de
 *        un supuesto, en su orden; y el barajado barajando de verdad;
 *   4.   Word bien hecho, con una imagen con dibujo por cada figura;
 *   5-6. la misma coherencia en el Word, sin preparar y barajado;
 *   7.   en el Word ninguna pregunta se parte: enunciado y opciones van con
 *        «conservar con el siguiente» hasta la ultima opcion.
 * Y en el tema 20, las funciones del panel: quitar una pregunta, barajar,
 * barajar de nuevo, quitar las soluciones y la letra.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

import { OPCIONES_PDF, RAIZ, argumento, bandera, buscarChrome, decidirBase, temasConRepaso } from './comun.js'
import { abrirConGancho, abrirDocx, analizarEnPagina, descargarWord, sabotear } from './docx.js'

const PUERTO = 4210
const TEMA_FUNCIONES = 20
const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f']
const n2 = (t) => String(t).padStart(2, '0')
const limpio = (t) => t.replace(/\s+/g, ' ').trim()

const repasoDe = (tema) => JSON.parse(readFileSync(join(RAIZ, 'repaso', `tema-${n2(tema)}.json`), 'utf8'))

/** La configuracion barajada del control: preguntas y opciones, con dos preguntas fuera. */
const barajadoDe = (repaso) => ({
  orden: 'barajado',
  barajarOpciones: true,
  semilla: 20261005,
  excluidas: [repaso.test[1]?.id, repaso.test[3]?.id].filter(Boolean),
})

/* ---------- leer el cuestionario: de la hoja impresa y del Word ---------- */

const deLaHoja = (p) =>
  p.evaluate(() => {
    const preguntas = [...document.querySelectorAll('.imp-pregunta')].map((li) => {
      const enunciado = li.querySelector('.imp-enunciado').textContent.replace(/\s+/g, ' ').trim()
      const m = enunciado.match(/^(\d+)\.\s*(.*)$/)
      return {
        numero: Number(m[1]),
        pregunta: m[2],
        opciones: [...li.querySelectorAll('.imp-opciones > li')].map((o) => o.textContent.replace(/\s+/g, ' ').trim().replace(/^[a-f]\)\s*/, '')),
        supuesto: li.closest('.imp-supuesto')?.querySelector('h2')?.textContent ?? null,
        figura: !!li.querySelector('figure'),
      }
    })
    const soluciones = [...document.querySelectorAll('.imp-lista-soluciones > li')].map((li) => {
      const b = li.querySelector('b').textContent.replace(/\s+/g, ' ').trim()
      const m = b.match(/^(\d+)\.\s*([a-f])\)$/)
      const texto = [...li.childNodes].filter((n) => n.nodeType === 3 || (n.nodeType === 1 && n.tagName !== 'B' && n.tagName !== 'DIV')).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim()
      return { numero: Number(m?.[1]), letra: m?.[2], texto }
    })
    return { preguntas, soluciones }
  })

/** Del Word: «N. enunciado», luego «a) ...»; y tras el titulo «Soluciones», «N. x) texto». */
function delWord(a) {
  const preguntas = []
  const soluciones = []
  let enSoluciones = false
  let supuesto = null
  for (const p of a.parrafos) {
    const t = p.texto.replace(/\s+/g, ' ').trim()
    if (p.estilo === 'Heading1') {
      enSoluciones = t === 'Soluciones'
      supuesto = t.startsWith('Segundo ejercicio') ? t : null
      continue
    }
    if (enSoluciones) {
      const m = t.match(/^(\d+)\.\s*([a-f])\)\s*(.*)$/)
      if (m) soluciones.push({ numero: Number(m[1]), letra: m[2], texto: m[3] })
      continue
    }
    const op = t.match(/^([a-f])\)\s*(.*)$/)
    if (op && preguntas.length && !p.enTabla) {
      preguntas[preguntas.length - 1].opciones.push(op[2])
      preguntas[preguntas.length - 1].parrafos.push(p)
      continue
    }
    const q = t.match(/^(\d+)\.\s+(.*)$/)
    if (q && !p.lista && !p.enTabla && p.conservaPropio) preguntas.push({ numero: Number(q[1]), pregunta: q[2], opciones: [], supuesto, parrafos: [p] })
  }
  return { preguntas, soluciones }
}

/**
 * La coherencia de un cuestionario leido (del PDF o del Word) con su JSON y
 * la configuracion: lo que entra, la numeracion, las opciones y las soluciones.
 */
function coherencia(leido, repaso, conf, conSoluciones = true) {
  const todas = [...repaso.test.map((q) => ({ q, sup: null })), ...repaso.supuestos.flatMap((s) => s.preguntas.map((q) => ({ q, sup: s.titulo })))]
  const entran = todas.filter(({ q }) => !(conf.excluidas ?? []).includes(q.id))
  const clave = (pregunta, opciones) => `${limpio(pregunta)}|${[...opciones].map(limpio).sort().join('|')}`
  const porClave = new Map()
  for (const x of entran) porClave.set(clave(x.q.pregunta, x.q.opciones), [...(porClave.get(clave(x.q.pregunta, x.q.opciones)) ?? []), x])
  const fallos = []
  const { preguntas, soluciones } = leido

  if (preguntas.length !== entran.length) fallos.push(`hay ${preguntas.length} preguntas y tendrían que ser ${entran.length}`)
  preguntas.forEach((p, i) => {
    if (p.numero !== i + 1) fallos.push(`la ${i + 1}.ª va numerada ${p.numero}`)
  })
  let barajadas = 0
  let movidas = 0
  const ordenSupuesto = {}
  preguntas.forEach((p, i) => {
    const candidatas = porClave.get(clave(p.pregunta, p.opciones))
    if (!candidatas?.length) {
      fallos.push(`la ${p.numero} («${p.pregunta.slice(0, 40)}») no es ninguna de las que entran, o sus opciones no son las suyas`)
      return
    }
    const { q, sup } = candidatas.shift()
    if (p.opciones.map(limpio).join('|') !== q.opciones.map(limpio).join('|')) barajadas++
    if (/anterior|ambas|todas las|ninguna de/i.test(q.opciones.join(' ')) && p.opciones.map(limpio).join('|') !== q.opciones.map(limpio).join('|')) {
      fallos.push(`la ${p.numero} tiene opciones que se refieren a otras y se han barajado`)
    }
    const posicion = repaso.test.indexOf(q)
    if (posicion >= 0 && posicion !== i) movidas++
    if (sup) {
      const anterior = ordenSupuesto[sup] ?? -1
      const pos = repaso.supuestos.find((s) => s.titulo === sup).preguntas.indexOf(q)
      if (pos < anterior) fallos.push(`las preguntas del supuesto «${sup}» cambian de orden`)
      ordenSupuesto[sup] = pos
    }
    if (!conSoluciones) return
    const s = soluciones.find((x) => x.numero === p.numero)
    const correcta = limpio(q.opciones[q.correcta])
    if (!s) fallos.push(`la ${p.numero} no tiene solución`)
    else if (limpio(p.opciones[LETRAS.indexOf(s.letra)] ?? '') !== correcta || limpio(s.texto) !== correcta) {
      fallos.push(`la solución de la ${p.numero} es «${s.letra}) ${s.texto.slice(0, 30)}» y la correcta es «${correcta.slice(0, 30)}»`)
    }
  })
  if (conSoluciones && soluciones.length !== preguntas.length) fallos.push(`${soluciones.length} soluciones para ${preguntas.length} preguntas`)
  if (conf.barajarOpciones && barajadas === 0) fallos.push('se pidió barajar las opciones y ninguna cambió de orden')
  if (conf.orden === 'barajado' && repaso.test.length > 3 && movidas === 0) fallos.push('se pidió barajar las preguntas y ninguna cambió de sitio')
  return { fallos, preguntas: preguntas.length, barajadas, movidas }
}

const resumen = (c, que) =>
  c.fallos.length ? `${c.fallos.length} fallo(s): ${c.fallos[0]}` : `${c.preguntas} preguntas${que ? `; ${c.movidas} cambian de sitio y ${c.barajadas} con las opciones barajadas` : ''}, cada solución en su opción correcta`

/* ---------- PDF: ida y vuelta ---------- */

async function hoja(ctx, base, tema, edicion) {
  const p = await ctx.newPage()
  await p.goto(`${base}#/imprimir/test/${tema}${edicion ? '?edicion=1' : ''}`, { waitUntil: 'networkidle0', timeout: 120000 })
  await p.waitForSelector('body[data-listo="1"]', { timeout: 60000 })
  await p.emulateMediaType('print')
  return p
}

const htmlDe = (p) =>
  p.evaluate(() => {
    const raiz = document.querySelector('.imp').cloneNode(true)
    for (const s of raiz.querySelectorAll('style')) s.remove()
    raiz.normalize()
    return raiz.innerHTML.replace(/src="[^"]*\/assets\//g, 'src="/assets/').replace(/\s+/g, ' ').replace(/> </g, '><')
  })

async function renglones(pdf) {
  const doc = await getDocument({ data: new Uint8Array(pdf) }).promise
  const out = []
  for (let n = 1; n <= doc.numPages; n++) {
    const items = (await (await doc.getPage(n)).getTextContent()).items.filter((i) => i.str.trim())
    const r = new Map()
    for (const i of items) {
      const y = Math.round(i.transform[5] * 2) / 2
      if (!r.has(y)) r.set(y, [])
      r.get(y).push({ str: i.str, x: i.transform[4] })
    }
    out.push([...r.entries()].sort((a, b) => b[0] - a[0]).map(([y, t]) => `${y}|${t.sort((a, b) => a.x - b.x)[0].x.toFixed(1)}|${t.map((x) => x.str).join('').replace(/\s+/g, '')}`))
  }
  return out
}

function diferencia(a, b) {
  if (a.length !== b.length) return `el de siempre tiene ${a.length} páginas y el preparado ${b.length}`
  for (let p = 0; p < a.length; p++) {
    for (let i = 0; i < Math.max(a[p].length, b[p].length); i++) {
      if (a[p][i] !== b[p][i]) return `p. ${p + 1}: «${(a[p][i] ?? 'nada').slice(0, 60)}» frente a «${(b[p][i] ?? 'nada').slice(0, 60)}»`
    }
  }
  return null
}

/* ---------- un tema ---------- */

async function guardarConf(ctx, base, tema, conf) {
  const p = await ctx.newPage()
  await p.goto(`${base}#/`, { waitUntil: 'networkidle0' })
  await p.evaluate((k, v) => localStorage.setItem(k, v), `descarga:cuestionario:${tema}`, JSON.stringify(conf))
  await p.close()
}

async function wordDe(ctx, base, tema, mesa, sabotaje) {
  const panel = await abrirConGancho(ctx, `${base}#/editar/test/${tema}`)
  const docx = await abrirDocx(await descargarWord(panel))
  await panel.close()
  const final = sabotaje ? ((await sabotaje(docx)) ?? docx) : docx
  return { docx: final, a: await mesa.evaluate(analizarEnPagina, final) }
}

/** Sabotajes: cada uno estropea una cosa y declara que control tiene que caer. */
const SABOTAJES = {
  1: { que: 'cambia una letra de la hoja preparada', tumba: [0, 1] },
  2: { que: 'una solución del PDF apunta a otra letra', tumba: [2] },
  3: { que: 'en el PDF barajado, la opción correcta cambia de sitio sin su solución', tumba: [3] },
  4: { que: 'se pierde una pregunta del PDF barajado', tumba: [3] },
  5: { que: 'una figura del Word en blanco', tumba: [4] },
  6: { que: 'una solución del Word apunta a otra letra', tumba: [5] },
  7: { que: 'se pierde una opción en el Word barajado', tumba: [6] },
  8: { que: 'una pregunta del Word se puede partir', tumba: [7] },
}

async function verificarTema(nav, base, ref, tema, mesa, sab = 0) {
  const repaso = repasoDe(tema)
  const conf = barajadoDe(repaso)
  const r = []
  const ctx = await nav.createBrowserContext()
  try {
    // 0-1: ida y vuelta, sin preparar nada
    const orig = await hoja(ctx, ref, tema, false)
    const prep = await hoja(ctx, base, tema, true)
    if (sab === 1) {
      await prep.evaluate(() => {
        const e = document.querySelectorAll('.imp-enunciado')[0]
        e.lastChild.textContent = e.lastChild.textContent.replace(/[a-z]/i, (c) => (c === 'x' ? 'y' : 'x'))
      })
    }
    const h1 = await htmlDe(orig)
    const h2 = await htmlDe(prep)
    let i = 0
    while (h1[i] === h2[i] && i < h1.length) i++
    r.push({ nombre: 'Ida y vuelta: mismo HTML impreso', ok: h1 === h2, detalle: h1 === h2 ? 'idéntico' : `difiere en el carácter ${i}: «…${h1.slice(Math.max(0, i - 40), i + 40)}…»` })
    const a = await renglones(await orig.pdf(OPCIONES_PDF))
    const b = await renglones(await prep.pdf(OPCIONES_PDF))
    const dp = diferencia(a, b)
    r.push({ nombre: 'Ida y vuelta: mismo PDF', ok: !dp, detalle: dp ?? `${a.length} páginas, iguales renglón a renglón` })
    await orig.close()
    await prep.close()

    // 2: coherencia del PDF sin preparar
    const sinPrep = await hoja(ctx, base, tema, true)
    if (sab === 2) {
      await sinPrep.evaluate(() => {
        const b = document.querySelector('.imp-lista-soluciones > li b')
        b.textContent = b.textContent.replace(/([a-f])\)/, (m, l) => `${l === 'a' ? 'b' : 'a'})`)
      })
    }
    const c0 = coherencia(await deLaHoja(sinPrep), repaso, {})
    r.push({ nombre: 'PDF sin preparar: preguntas, opciones y soluciones', ok: !c0.fallos.length, detalle: resumen(c0, false) })
    await sinPrep.close()

    // 3: coherencia del PDF barajado
    await guardarConf(ctx, base, tema, conf)
    const baraj = await hoja(ctx, base, tema, true)
    if (sab === 3) {
      // la opcion CORRECTA de la primera pregunta cambia de sitio con otra: si se
      // cambiaran dos incorrectas, la solucion seguiria siendo buena y el
      // sabotaje no romperia nada
      await baraj.evaluate(() => {
        const letra = document.querySelector('.imp-lista-soluciones > li b').textContent.match(/([a-f])\)/)[1]
        const i = 'abcdef'.indexOf(letra)
        const ops = document.querySelectorAll('.imp-pregunta')[0].querySelectorAll('.imp-opciones > li')
        const [x, y] = [ops[i].lastChild, ops[(i + 1) % ops.length].lastChild]
        const t = x.textContent
        x.textContent = y.textContent
        y.textContent = t
      })
    }
    if (sab === 4) await baraj.evaluate(() => document.querySelectorAll('.imp-pregunta')[2].remove())
    const c1 = coherencia(await deLaHoja(baraj), repaso, conf)
    r.push({ nombre: 'PDF barajado: preguntas, opciones y soluciones', ok: !c1.fallos.length, detalle: resumen(c1, true) })
    await baraj.close()

    // 4-7: el Word, sin preparar y barajado
    await guardarConf(ctx, base, tema, {})
    const w0 = await wordDe(ctx, base, tema, mesa, async (docx) => {
      // la figura en blanco: el mismo sabotaje que en el Word de un apunte
      if (sab === 5) return sabotear(mesa, 3, docx)
      if (sab === 6) {
        docx.partes['word/document.xml'] = docx.partes['word/document.xml'].replace(/(<w:t[^>]*>Soluciones<\/w:t>[\s\S]*?<w:t[^>]*>\d+\. )([a-f])(\) <\/w:t>)/, (m, x, l, y) => `${x}${l === 'a' ? 'b' : 'a'}${y}`)
      }
      if (sab === 8) {
        // quita el «conservar con el siguiente» de la primera opcion que lo lleva
        docx.partes['word/document.xml'] = docx.partes['word/document.xml'].replace(/<w:keepNext\/>(<w:keepLines\/><w:spacing w:after="20"\/><w:ind)/, '$1')
      }
    })
    const nFiguras = [...repaso.test, ...repaso.supuestos.flatMap((s) => s.preguntas)].filter((q) => q.figura).length + repaso.supuestos.filter((s) => s.figura).length
    const enunciadoFig = repaso.supuestos.reduce((m, s) => m + (s.enunciado.match(/!\[[^\]]*\]\((?!salto:)/g) || []).length, 0)
    const usadas = w0.a.parrafos.flatMap((p) => p.dibujos)
    const vacias = usadas.filter((d) => !d || !w0.a.medios[d] || w0.a.medios[d].tinta < 0.005)
    const okWord = !w0.a.malformadas.length && usadas.length === nFiguras + enunciadoFig && !vacias.length
    r.push({
      nombre: 'Word bien hecho, con una imagen con dibujo por figura',
      ok: okWord,
      detalle: w0.a.malformadas.length ? `XML ilegible: ${w0.a.malformadas.join(', ')}` : usadas.length !== nFiguras + enunciadoFig ? `${usadas.length} imágenes para ${nFiguras + enunciadoFig} figuras` : vacias.length ? `${vacias.length} imagen(es) sin dibujo o sin fichero` : `${usadas.length} imágenes con dibujo`,
    })
    const lw0 = delWord(w0.a)
    const cw0 = coherencia(lw0, repaso, {})
    r.push({ nombre: 'Word sin preparar: preguntas, opciones y soluciones', ok: !cw0.fallos.length, detalle: resumen(cw0, false) })

    await guardarConf(ctx, base, tema, conf)
    const w1 = await wordDe(ctx, base, tema, mesa, (docx) => {
      if (sab === 7) {
        // quita el parrafo de la segunda opcion de la primera pregunta (el que empieza por «b) »)
        docx.partes['word/document.xml'] = docx.partes['word/document.xml'].replace(/<w:p>(?:(?!<w:p>)[\s\S])*?<w:t[^>]*>b\) <\/w:t>[\s\S]*?<\/w:p>/, '')
      }
    })
    const cw1 = coherencia(delWord(w1.a), repaso, conf)
    r.push({ nombre: 'Word barajado: preguntas, opciones y soluciones', ok: !cw1.fallos.length, detalle: resumen(cw1, true) })

    // 7: en el Word ninguna pregunta se parte
    const partibles = lw0.preguntas.filter((q) => q.parrafos.slice(0, -1).some((p) => !p.conservaPropio))
    r.push({
      nombre: 'Word: ninguna pregunta se parte entre páginas',
      ok: !partibles.length && lw0.preguntas.length > 0,
      detalle: partibles.length ? `${partibles.length} pregunta(s) partibles, p. ej. la ${partibles[0].numero}` : `${lw0.preguntas.length} preguntas pegadas de enunciado a última opción`,
    })
  } finally {
    await ctx.close()
  }
  return r
}

/* ---------- funciones del panel ---------- */

async function funciones(nav, base) {
  const tema = TEMA_FUNCIONES
  const r = []
  const ctx = await nav.createBrowserContext()
  try {
    const panel = await ctx.newPage()
    await panel.setViewport({ width: 1400, height: 1000 })
    await panel.goto(`${base}#/editar/test/${tema}`, { waitUntil: 'networkidle0' })
    await panel.waitForSelector('.editor-pagina[data-listo="1"]')
    const espera = () => new Promise((x) => setTimeout(x, 500))
    const leer = async () => {
      const h = await hoja(ctx, base, tema, true)
      const l = await deLaHoja(h)
      const extra = await h.evaluate(() => ({ soluciones: !!document.querySelector('.imp-soluciones'), letra: getComputedStyle(document.querySelector('.imp-enunciado')).fontSize }))
      await h.close()
      return { ...l, ...extra }
    }
    const antes = await leer()

    await panel.click('.prep-lista .prep-fila:nth-child(1) input')
    await espera()
    const sinUna = await leer()
    r.push({
      nombre: 'Quitar una pregunta',
      ok: sinUna.preguntas.length === antes.preguntas.length - 1 && sinUna.preguntas[0].pregunta !== antes.preguntas[0].pregunta && sinUna.preguntas[0].numero === 1,
      detalle: `${antes.preguntas.length} → ${sinUna.preguntas.length} preguntas; la nueva 1.ª: «${sinUna.preguntas[0].pregunta.slice(0, 40)}»`,
    })

    await panel.select('.ed-opciones > label:nth-of-type(3) select', 'barajado')
    await espera()
    const baraj = await leer()
    const [nuevo] = await panel.$$('xpath/.//button[normalize-space()="Barajar de nuevo"]')
    await nuevo.click()
    await espera()
    const otra = await leer()
    const orden = (x) => x.preguntas.map((q) => q.pregunta).join('|')
    r.push({
      nombre: 'Barajar y barajar de nuevo',
      ok: orden(baraj) !== orden(sinUna) && orden(otra) !== orden(baraj) && otra.preguntas.length === sinUna.preguntas.length,
      detalle: `primera pregunta: «${sinUna.preguntas[0].pregunta.slice(0, 25)}» → «${baraj.preguntas[0].pregunta.slice(0, 25)}» → «${otra.preguntas[0].pregunta.slice(0, 25)}»`,
    })

    await panel.click('.ed-opciones > label:nth-of-type(5) input')
    await panel.select('.ed-opciones > label:nth-of-type(1) select', '12')
    await espera()
    const sinSol = await leer()
    r.push({
      nombre: 'Sin soluciones y letra de 12 pt',
      // el enunciado va a 10,5 pt: con 12 pt de letra, 10,5 × 12/11 pt = 15,27 px
      ok: antes.soluciones && !sinSol.soluciones && Math.abs(parseFloat(sinSol.letra) - (10.5 * 12) / 11 * (4 / 3)) < 0.01,
      detalle: `soluciones: ${antes.soluciones} → ${sinSol.soluciones}; enunciado a ${antes.letra} → ${sinSol.letra}`,
    })
    await panel.close()
  } finally {
    await ctx.close()
  }
  return r
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
  const pedidos = process.argv.slice(2).filter((a) => /^\d+$/.test(a)).map(Number)
  const temas = pedidos.length ? pedidos : temasConRepaso()
  const servidor = await decidirBase(PUERTO)
  const base = servidor.base
  const ref = argumento('referencia', base)
  const nav = await puppeteer.launch({ executablePath: buscarChrome(), headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
  const mesa = await nav.newPage()
  await mesa.goto(base, { waitUntil: 'networkidle0' })
  let fallos = 0
  try {
    for (const tema of temas) {
      if (!bandera('sabotajes')) {
        const r = await verificarTema(nav, base, ref, tema, mesa)
        fallos += r.filter((x) => !x.ok).length
        pinta(`=== Tema ${tema} ===`, r)
        continue
      }
      const repaso = repasoDe(tema)
      const conFiguras = [...repaso.test, ...repaso.supuestos.flatMap((s) => s.preguntas), ...repaso.supuestos].some((q) => q.figura)
      for (const [n, s] of Object.entries(SABOTAJES)) {
        if (n === '5' && !conFiguras) {
          console.log(`·     Tema ${tema} · sabotaje ${n} (${s.que}): no aplica, el tema no tiene figuras en el cuestionario`)
          continue
        }
        const r = await verificarTema(nav, base, ref, tema, mesa, Number(n))
        const caidos = r.map((x, i) => (x.ok ? -1 : i)).filter((i) => i >= 0)
        const faltan = s.tumba.filter((i) => !caidos.includes(i))
        const sobran = caidos.filter((i) => !s.tumba.includes(i))
        const bien = !faltan.length && !sobran.length
        if (!bien) fallos++
        console.log(
          `${bien ? 'OK   ' : 'FALLA'} Tema ${tema} · sabotaje ${n} (${s.que}): ${faltan.length ? `NO lo ve ${faltan.map((i) => `«${r[i].nombre}»`).join(', ')}` : sobran.length ? `tumba de más ${sobran.map((i) => `«${r[i].nombre}»: ${r[i].detalle}`).join('; ')}` : `lo caza ${s.tumba.map((i) => `«${r[i].nombre}»: ${r[i].detalle}`).join('; ')}`}`,
        )
      }
    }
    if (!bandera('sabotajes') && (temas.includes(TEMA_FUNCIONES) || !pedidos.length)) {
      const r = await funciones(nav, base)
      fallos += r.filter((x) => !x.ok).length
      pinta(`=== Funciones del panel (tema ${TEMA_FUNCIONES}) ===`, r)
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

