#!/usr/bin/env node
/**
 * Verifica el editor de descarga (#/editar/tema/N).
 *
 *   node scripts/verificar-editor.js            -> los 40 temas
 *   node scripts/verificar-editor.js 20 23      -> esos temas
 *   --sabotajes                                 -> estropea a proposito lo que
 *                                                  sale del editor y exige que la
 *                                                  ida y vuelta lo detecte
 *   --base <url>                                -> contra la web publicada
 *   --referencia <url>                          -> el original se toma de OTRA
 *                                                  web (la publicada antes del
 *                                                  cambio): asi se compara con el
 *                                                  PDF de hoy, no solo consigo mismo
 *
 * IDA Y VUELTA, en cada tema: se abre el apunte en el editor SIN TOCAR NADA, y
 * lo que el editor manda a imprimir tiene que dar el mismo documento que el
 * boton de PDF de siempre. Se mira dos veces:
 *   - el HTML de la hoja impresa, que es exacto: cualquier diferencia en el
 *     Markdown que devuelve el editor (una lista que pierde el aire, una
 *     figura, una marca) cambia el HTML;
 *   - el PDF: el texto de cada pagina con su posicion, renglon a renglon.
 * Ademas, abrir el editor sin tocar nada no guarda ninguna edicion.
 *
 * FUNCIONES, en un tema (TEMA_FUNCIONES): editar y que se guarde en este
 * navegador sin tocar el apunte de la app; volver al original; mover un
 * bloque; salto de pagina manual; y las opciones de letra, margenes, secciones
 * y recuadro de fuentes, medidas en el PDF o en la hoja impresa.
 *
 * El HTML se compara con una sola licencia: una cursiva dentro de otra cursiva
 * (o negrita dentro de negrita) se cuenta como una. El editor no puede
 * representarlas anidadas, se ven igual, y el PDF, que si se compara exacto,
 * lo confirma. Solo pasa en el tema 36.
 */

import puppeteer from 'puppeteer-core'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { gfm } from 'micromark-extension-gfm'

import { OPCIONES_PDF, argumento, bandera, buscarChrome, decidirBase, temasConApunte } from './comun.js'

const PUERTO = 4202
const TEMA_FUNCIONES = 20
const MARCA = 'PRUEBA-DEL-EDITOR'

/* ---------- utilidades ---------- */

async function abrirEditor(ctx, base, tema) {
  const p = await ctx.newPage()
  await p.setViewport({ width: 1400, height: 1000 })
  await p.goto(`${base}#/editar/tema/${tema}`, { waitUntil: 'networkidle0', timeout: 120000 })
  await p.waitForSelector('.editor-pagina[data-listo="1"]', { timeout: 60000 })
  return p
}

async function abrirHoja(ctx, base, tema, edicion) {
  const p = await ctx.newPage()
  await p.goto(`${base}#/imprimir/tema/${tema}${edicion ? '?edicion=1' : ''}`, { waitUntil: 'networkidle0', timeout: 120000 })
  await p.waitForSelector('body[data-listo="1"]', { timeout: 60000 })
  await p.emulateMediaType('print')
  return p
}

/** El HTML del apunte impreso, con espacios normalizados y sin cursivas (o negritas) redundantes. */
const htmlDe = (p) =>
  p.evaluate(() => {
    const raiz = document.querySelector('.imp-tema').cloneNode(true)
    for (const tag of ['em', 'strong']) {
      for (const dentro of [...raiz.querySelectorAll(`${tag} ${tag}`)]) dentro.replaceWith(...dentro.childNodes)
    }
    raiz.normalize()
    // la ruta de las imagenes depende de donde se sirve la app (/assets/ en
    // local, /oposicion-laboratorio-zaragoza/assets/ en GitHub Pages)
    return raiz.innerHTML
      .replace(/src="[^"]*\/assets\//g, 'src="/assets/')
      .replace(/\s+/g, ' ')
      .replace(/> </g, '><')
  })

/**
 * El texto de cada pagina del PDF, renglon a renglon: su altura, donde empieza
 * y lo que dice (sin espacios). Por renglones y no por trozos porque Chrome
 * corta los trozos en cada cambio de etiqueta aunque no cambie nada a la vista
 * (la cursiva dentro de cursiva del tema 36); un renglon que se parte en otro
 * sitio, se mueve o cambia de texto si se ve.
 */
async function textoPDF(pdf) {
  const doc = await getDocument({ data: new Uint8Array(pdf) }).promise
  const paginas = []
  for (let n = 1; n <= doc.numPages; n++) {
    const items = (await (await doc.getPage(n)).getTextContent()).items.filter((i) => i.str.trim())
    const renglones = new Map()
    for (const i of items) {
      const y = Math.round(i.transform[5] * 2) / 2
      if (!renglones.has(y)) renglones.set(y, [])
      renglones.get(y).push({ str: i.str, x: i.transform[4] })
    }
    paginas.push(
      [...renglones.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([y, trozos]) => {
          trozos.sort((a, b) => a.x - b.x)
          return { str: trozos.map((t) => t.str).join('').replace(/\s+/g, ''), x: trozos[0].x, y }
        }),
    )
  }
  return paginas
}

function primeraDiferencia(a, b) {
  if (a.length !== b.length) return `el original tiene ${a.length} páginas y el del editor ${b.length}`
  for (let p = 0; p < a.length; p++) {
    const n = Math.max(a[p].length, b[p].length)
    for (let i = 0; i < n; i++) {
      const x = a[p][i]
      const y = b[p][i]
      const igual = x && y && x.str === y.str && Math.abs(x.x - y.x) < 0.5 && Math.abs(x.y - y.y) < 0.5
      if (!igual) {
        const d = (t) => (t ? `«${t.str.slice(0, 40)}» en (${t.x.toFixed(1)}, ${t.y.toFixed(1)})` : 'nada')
        return `p. ${p + 1}: el original tiene ${d(x)} y el del editor ${d(y)}`
      }
    }
  }
  return null
}

function primeraDiferenciaTexto(a, b) {
  if (a === b) return null
  let i = 0
  while (a[i] === b[i]) i++
  return `difiere en el carácter ${i}: original «…${a.slice(Math.max(0, i - 50), i + 40)}…», editor «…${b.slice(Math.max(0, i - 50), i + 40)}…»`
}

const leerDescarga = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('descarga:actual') || 'null'))
const escribirDescarga = (p, d) => p.evaluate((x) => localStorage.setItem('descarga:actual', JSON.stringify(x)), d)

/* ---------- sabotajes: lo que un fallo del editor podria hacerle al Markdown ---------- */

const leerMd = (md) => fromMarkdown(md, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] })
const escribirMd = (arbol) => toMarkdown(arbol, { extensions: [gfmToMarkdown()] })
const buscar = (n, pred) => {
  if (pred(n)) return n
  for (const c of n.children || []) {
    const r = buscar(c, pred)
    if (r) return r
  }
  return null
}

const SABOTAJES = {
  1: {
    que: 'cambia una letra de un párrafo',
    hacer(arbol) {
      const t = buscar(arbol, (n) => n.type === 'text' && /[a-z]/i.test(n.value))
      t.value = t.value.replace(/[a-z]/i, (c) => (c.toLowerCase() === 'x' ? 'y' : 'x'))
    },
  },
  2: {
    que: 'una lista suelta (con aire entre elementos) sale apretada',
    hacer(arbol) {
      // solo se puede apretar si cada elemento es un unico bloque: con dos
      // parrafos, Markdown la vuelve a dejar suelta y el sabotaje no haria nada
      const l = buscar(arbol, (n) => n.type === 'list' && n.spread && n.children.every((li) => li.children.length === 1))
      if (!l) return false
      l.spread = false
      for (const li of l.children) li.spread = false
    },
  },
  3: {
    que: 'se pierde una figura',
    hacer(arbol) {
      const padre = buscar(arbol, (n) => (n.children || []).some((c) => c.type === 'image'))
      if (!padre) return false
      padre.children = padre.children.filter((c) => c.type !== 'image')
    },
  },
}

/* ---------- ida y vuelta ---------- */

async function idaYVuelta(nav, base, tema, sabotaje) {
  const ctx = await nav.createBrowserContext()
  const r = []
  try {
    const ed = await abrirEditor(ctx, base, tema)
    const guardada = await ed.evaluate((n) => localStorage.getItem(`descarga:edicion:${n}`), tema)
    const estado = await ed.$eval('.ed-estado', (e) => e.textContent)
    await ed.close()
    if (!sabotaje) {
      r.push({
        nombre: 'Abrir sin tocar no guarda edición',
        ok: guardada === null && estado.startsWith('Sin cambios'),
        detalle: guardada === null ? estado : 'hay una edición guardada sin haber tocado nada',
      })
    }

    if (sabotaje) {
      const ref = await abrirHoja(ctx, base, tema, false)
      const d = await leerDescarga(ref)
      const arbol = leerMd(d.md)
      if (SABOTAJES[sabotaje].hacer(arbol) === false) return null
      const md = escribirMd(arbol)
      // Un sabotaje que no cambia nada no prueba nada: si al releerlo el arbol
      // es el mismo, se dice, en vez de darlo por «no detectado».
      const sinPos = (m) => JSON.stringify(leerMd(m), (k, v) => (k === 'position' ? undefined : v))
      if (sinPos(md) === sinPos(d.md)) return [{ nombre: 'El sabotaje no cambió nada', ok: true, detalle: 'sabotaje inerte' }]
      await escribirDescarga(ref, { ...d, md })
      await ref.close()
    }

    const orig = await abrirHoja(ctx, argumento('referencia', base), tema, false)
    const edit = await abrirHoja(ctx, base, tema, true)
    const dif = primeraDiferenciaTexto(await htmlDe(orig), await htmlDe(edit))
    r.push({ nombre: 'Ida y vuelta: mismo HTML impreso', ok: !dif, detalle: dif ?? 'idéntico' })

    const pdfA = await textoPDF(await orig.pdf(OPCIONES_PDF))
    const pdfB = await textoPDF(await edit.pdf(OPCIONES_PDF))
    const difPdf = primeraDiferencia(pdfA, pdfB)
    const renglones = pdfA.reduce((s, p) => s + p.length, 0)
    r.push({
      nombre: 'Ida y vuelta: mismo PDF',
      ok: !difPdf,
      detalle: difPdf ?? `${pdfA.length} páginas y ${renglones} renglones, iguales y en la misma posición`,
    })
  } finally {
    await ctx.close()
  }
  return r
}

/* ---------- funciones del editor ---------- */

/** Pone el cursor al final (del primer renglon) del elemento del editor que diga el selector. */
async function cursorEn(p, selector) {
  const el = await p.$(selector)
  await el.click()
  await p.keyboard.press('End')
}

// el editor guarda 400 ms despues de la ultima tecla
const guardado = () => new Promise((r) => setTimeout(r, 900))

const pulsar = (p, etiqueta) => p.click(`.ed-barra button[aria-label="${etiqueta}"]`)

async function funciones(nav, base, tema) {
  const r = []
  const ctx = await nav.createBrowserContext()
  try {
    // 1) editar: se guarda, sobrevive a recargar, sale en la descarga y NO en la app
    let ed = await abrirEditor(ctx, base, tema)
    await cursorEn(ed, '.ed-doc > p')
    await ed.keyboard.type(` ${MARCA}`)
    await guardado()
    const edicion = await ed.evaluate((n) => localStorage.getItem(`descarga:edicion:${n}`), tema)
    const estado = await ed.$eval('.ed-estado', (e) => e.textContent)
    await ed.reload({ waitUntil: 'networkidle0' })
    await ed.waitForSelector('.editor-pagina[data-listo="1"]')
    const trasRecargar = await ed.$eval('.ed-doc', (e) => e.textContent)
    const hoja = await abrirHoja(ctx, base, tema, true)
    const enHoja = await hoja.$eval('.imp-tema', (e) => e.textContent)
    await hoja.close()
    const app = await ctx.newPage()
    await app.goto(`${base}#/tema/${tema}`, { waitUntil: 'networkidle0' })
    await app.waitForSelector('.md')
    const enApp = await app.$eval('main', (e) => e.textContent)
    await app.close()
    const vale = !!edicion?.includes(MARCA) && estado.startsWith('Con tus cambios') && trasRecargar.includes(MARCA) && enHoja.includes(MARCA) && !enApp.includes(MARCA)
    r.push({
      nombre: 'Editar: se guarda en el navegador, sale en la descarga y no en la app',
      ok: vale,
      detalle: `guardada: ${!!edicion?.includes(MARCA)}, tras recargar: ${trasRecargar.includes(MARCA)}, en la descarga: ${enHoja.includes(MARCA)}, en el apunte de la app: ${enApp.includes(MARCA)}`,
    })

    // 2) volver al original
    await ed.click('.ed-pie button.btn:not(.btn-pri)')
    await ed.click('.ed-pie .btn-bad')
    await guardado()
    const tras = await ed.evaluate((n) => localStorage.getItem(`descarga:edicion:${n}`), tema)
    const docTras = await ed.$eval('.ed-doc', (e) => e.textContent)
    r.push({
      nombre: 'Volver al original: borra la edición y deja el apunte',
      ok: tras === null && !docTras.includes(MARCA),
      detalle: `edición guardada: ${tras !== null}, marca en el documento: ${docTras.includes(MARCA)}`,
    })

    // 3) mover un bloque: el primer parrafo baja un puesto
    const orden = () => ed.$$eval('.ed-doc > *', (els) => els.slice(0, 4).map((e) => e.textContent.slice(0, 30)))
    const antes = await orden()
    await cursorEn(ed, '.ed-doc > :nth-child(1)')
    await pulsar(ed, 'Bajar el bloque (Alt+↓)')
    await guardado()
    const despues = await orden()
    const d = await leerDescarga(ed)
    const enMd = d.md.indexOf(antes[1].slice(0, 15)) < d.md.indexOf(antes[0].slice(0, 15))
    r.push({
      nombre: 'Mover bloque: baja un puesto, en el editor y en la descarga',
      ok: despues[0] === antes[1] && despues[1] === antes[0] && enMd,
      detalle: `antes «${antes[0]}» / «${antes[1]}»; después «${despues[0]}» / «${despues[1]}»; en la descarga: ${enMd}`,
    })
    await pulsar(ed, 'Deshacer (Ctrl+Z)')
    await guardado()

    // 4) salto de pagina detras del primer parrafo del primer apartado: lo de
    // detras tiene que abrir pagina con el salto, y no abrirla sin el (si ya la
    // abria, la prueba no demostraria nada)
    const sel = '.ed-doc > h2 ~ p'
    const siguiente = await ed.$eval(sel, (e) => e.nextElementSibling.textContent.replace(/\s+/g, '').slice(0, 25))
    const paginaQueAbre = async () => {
      const h = await abrirHoja(ctx, base, tema, true)
      const pags = await textoPDF(await h.pdf(OPCIONES_PDF))
      await h.close()
      // lo primero del cuerpo de la pagina: el renglon mas alto por encima del pie
      return pags.findIndex((pg) => {
        const cuerpo = pg.filter((i) => i.y > 70)
        const arriba = Math.max(...cuerpo.map((i) => i.y))
        return cuerpo.some((i) => i.y === arriba && siguiente.startsWith(i.str.slice(0, 12)))
      })
    }
    const sinSalto = await paginaQueAbre()
    await cursorEn(ed, sel)
    await pulsar(ed, 'Salto de página detrás de este bloque (Ctrl+Intro)')
    await guardado()
    const md = (await leerDescarga(ed)).md
    const conSalto = await paginaQueAbre()
    r.push({
      nombre: 'Salto de página: lo de detrás empieza página',
      ok: md.includes('![](salto:pagina)') && sinSalto < 0 && conSalto > 0,
      detalle: `«${siguiente}»: sin el salto ${sinSalto < 0 ? 'no abre página' : `ya abría la p. ${sinSalto + 1}`}; con el salto ${conSalto > 0 ? `abre la p. ${conSalto + 1}` : 'no abre ninguna'}`,
    })
    await pulsar(ed, 'Deshacer (Ctrl+Z)')
    await guardado()

    // 5) opciones: letra 12, margenes anchos, sin la primera seccion, sin fuentes
    const medir = async () => {
      const hj = await abrirHoja(ctx, base, tema, true)
      const m = await hj.evaluate(() => ({
        letra: getComputedStyle(document.querySelector('.imp .md p')).fontSize,
        h2: [...document.querySelectorAll('.imp .md h2')].map((e) => e.textContent),
        fuentes: !!document.querySelector('.imp-fuentes'),
      }))
      const pg = await textoPDF(await hj.pdf({ ...OPCIONES_PDF, preferCSSPageSize: true }))
      await hj.close()
      // margen izquierdo: la x mas pequeña del cuerpo de la p. 2, en mm
      m.izquierdo = (Math.min(...pg[1].filter((i) => i.y > 70).map((i) => i.x)) / 72) * 25.4
      return m
    }
    const normal = await medir()
    await ed.select('.ed-opciones > label:nth-of-type(1) select', '12')
    await ed.select('.ed-opciones > label:nth-of-type(2) select', 'anchos')
    await ed.click('.ed-opciones > label:nth-of-type(3) input')
    await ed.click('.ed-secciones summary')
    await ed.click('.ed-secciones label:nth-of-type(1) input')
    await guardado()
    const cambiado = await medir()
    const quitada = normal.h2[0]
    // 11 pt = 14,667 px y 12 pt = 16 px
    const okLetra = Math.abs(parseFloat(normal.letra) - 14.667) < 0.01
    r.push({
      nombre: 'Opción de letra',
      ok: okLetra && Math.abs(parseFloat(cambiado.letra) - 16) < 0.01,
      detalle: `párrafo a ${normal.letra} con 11 pt y a ${cambiado.letra} con 12 pt`,
    })
    r.push({
      nombre: 'Opción de márgenes',
      ok: Math.abs(normal.izquierdo - 16) < 1 && Math.abs(cambiado.izquierdo - 25) < 1,
      detalle: `margen izquierdo del PDF: ${normal.izquierdo.toFixed(1)} mm con los normales, ${cambiado.izquierdo.toFixed(1)} mm con los anchos`,
    })
    r.push({
      nombre: 'Opción de secciones',
      ok: normal.h2.includes(quitada) && !cambiado.h2.includes(quitada) && cambiado.h2.length === normal.h2.length - 1,
      detalle: `«${quitada}»: ${normal.h2.length} apartados antes, ${cambiado.h2.length} después`,
    })
    r.push({
      nombre: 'Opción del recuadro de fuentes',
      ok: normal.fuentes && !cambiado.fuentes,
      detalle: `recuadro antes: ${normal.fuentes}, después: ${cambiado.fuentes}`,
    })
    await ed.close()
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
  const temas = pedidos.length ? pedidos : temasConApunte()
  const servidor = await decidirBase(PUERTO)
  const nav = await puppeteer.launch({ executablePath: buscarChrome(), headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] })
  let fallos = 0
  try {
    if (bandera('sabotajes')) {
      for (const tema of temas) {
        for (const [n, s] of Object.entries(SABOTAJES)) {
          const r = await idaYVuelta(nav, servidor.base, tema, Number(n))
          if (!r) {
            console.log(`·     Tema ${tema} · sabotaje ${n} (${s.que}): no aplica`)
            continue
          }
          const cazado = r.every((x) => !x.ok)
          if (!cazado) fallos++
          console.log(`${cazado ? 'OK   ' : 'FALLA'} Tema ${tema} · sabotaje ${n} (${s.que}): ${r.map((x) => `${x.nombre} ${x.ok ? 'NO lo ve' : 'lo caza'}`).join('; ')}`)
          for (const x of r) if (!x.ok) console.log(`        ${x.detalle}`)
        }
      }
    } else {
      for (const tema of temas) {
        const r = await idaYVuelta(nav, servidor.base, tema, 0)
        fallos += r.filter((x) => !x.ok).length
        pinta(`=== Tema ${tema} ===`, r)
      }
      if (temas.includes(TEMA_FUNCIONES) || pedidos.length === 0) {
        const r = await funciones(nav, servidor.base, TEMA_FUNCIONES)
        fallos += r.filter((x) => !x.ok).length
        pinta(`=== Funciones del editor (tema ${TEMA_FUNCIONES}) ===`, r)
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
