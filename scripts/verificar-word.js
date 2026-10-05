#!/usr/bin/env node
/**
 * Verifica la exportacion a Word (.docx) del editor de descarga.
 *
 *   node scripts/verificar-word.js            -> los 40 temas
 *   node scripts/verificar-word.js 20 23      -> esos temas
 *   --sabotajes                               -> estropea el .docx a proposito y
 *                                                exige que salte SU control y
 *                                                ninguno mas
 *   --base <url>                              -> contra la web publicada
 *
 * En cada tema abre el editor sin tocar nada, pulsa «Descargar Word» y abre el
 * .docx que sale (es un ZIP con XML dentro). Lo compara con el apunte, leido
 * de temas/tema-NN.md con el mismo parser que la app:
 *   1. Word bien hecho: estan las piezas obligatorias, todo el XML se lee y
 *      cada imagen que el documento usa existe dentro del fichero;
 *   2. titulos: los mismos, en el mismo orden y con su nivel (el ## del
 *      apunte es «Titulo 1» de Word, el ### «Titulo 2»...);
 *   3. tablas: las mismas, con sus filas y columnas y la misma cabecera, que
 *      se repite en cada pagina (tblHeader), y ninguna fila se parte (cantSplit);
 *   4. figuras: una imagen por cada figura del apunte, y todas con dibujo
 *      (una imagen en blanco no da ningun error: se mide la tinta);
 *   5. texto: cada parrafo, elemento de lista y celda del apunte esta, entero
 *      y en su orden;
 *   6. conservar con el siguiente: los titulos, las entradas que acaban en «:»
 *      y la cabecera de cada tabla van con lo que les sigue;
 *   7. listas: cada elemento de lista del apunte es un parrafo de lista de
 *      Word, y su numeracion lleva a una viñeta o un numero que existe
 *      (parrafo -> w:num -> w:abstractNum -> nivel con su texto). Hay visores
 *      que no siguen ese camino y no pintan la viñeta (docx-preview); Word si.
 * En el tema 20 prueba ademas que las ediciones y las opciones llegan al Word.
 *
 * No hay Word ni LibreOffice en el equipo: la comprobacion es de estructura, no
 * de como lo pagina Word al abrirlo.
 */

import puppeteer from 'puppeteer-core'

import { bandera, buscarChrome, decidirBase, temasConApunte } from './comun.js'
import { NIVEL, SABOTAJES, abrirDocx, abrirEditor, analizarEnPagina, apunteDe, controlar, descargarWord, esperado, sabotear } from './docx.js'

const PUERTO = 4203
const TEMA_FUNCIONES = 20
const MARCA = 'PRUEBA-DEL-WORD'
const espera = (ms) => new Promise((r) => setTimeout(r, ms))

async function funciones(ctx, base, tema, analizar) {
  const r = []
  const ed = await abrirEditor(ctx, base, tema)
  const normal = await analizar(await abrirDocx(await descargarWord(ed)))

  // una edicion y un salto de pagina
  const parrafo = await ed.$('.ed-doc > h2 ~ p')
  await parrafo.click()
  await ed.keyboard.press('End')
  await ed.keyboard.type(` ${MARCA}`)
  await ed.click('.ed-barra button[aria-label="Salto de página detrás de este bloque (Ctrl+Intro)"]')
  await espera(900)
  const editado = await analizar(await abrirDocx(await descargarWord(ed)))
  const conMarca = editado.parrafos.some((p) => p.texto.includes(MARCA))
  r.push({
    nombre: 'Lo editado llega al Word (texto y salto de página)',
    ok: conMarca && editado.parrafos.some((p) => p.saltoPagina) && !normal.parrafos.some((p) => p.saltoPagina) && !normal.parrafos.some((p) => p.texto.includes(MARCA)),
    detalle: `marca: ${conMarca}; salto de página: ${editado.parrafos.some((p) => p.saltoPagina)} (antes ${normal.parrafos.some((p) => p.saltoPagina)})`,
  })

  // las opciones
  const primerTitulo = normal.parrafos.find((p) => p.estilo === 'Heading1').texto
  await ed.select('.ed-opciones > label:nth-of-type(1) select', '12')
  await ed.select('.ed-opciones > label:nth-of-type(2) select', 'anchos')
  await ed.click('.ed-opciones > label:nth-of-type(3) input')
  await ed.click('.ed-secciones summary')
  await ed.click('.ed-secciones label:nth-of-type(1) input')
  await espera(600)
  const op = await analizar(await abrirDocx(await descargarWord(ed)))
  const tw = (mm) => Math.round((mm * 1440) / 25.4)
  r.push({ nombre: 'Opción de letra en el Word', ok: normal.letra === 22 && op.letra === 24, detalle: `letra por defecto: ${normal.letra / 2} pt y ${op.letra / 2} pt` })
  r.push({
    nombre: 'Opción de márgenes en el Word',
    ok: normal.margenIzquierdo === tw(16) && op.margenIzquierdo === tw(25),
    detalle: `margen izquierdo: ${(normal.margenIzquierdo / 56.69).toFixed(1)} mm y ${(op.margenIzquierdo / 56.69).toFixed(1)} mm`,
  })
  const tiene = (x, t) => x.parrafos.some((p) => p.texto.trim() === t)
  // el recuadro, no un apartado del apunte que se llame igual (el tema 20 lo tiene)
  const recuadro = (x) => x.parrafos.some((p) => !(p.estilo in NIVEL) && p.texto.trim() === 'Fuentes y verificación')
  r.push({
    nombre: 'Opción de secciones en el Word',
    ok: tiene(normal, primerTitulo) && !tiene(op, primerTitulo),
    detalle: `«${primerTitulo}»: antes ${tiene(normal, primerTitulo)}, después ${tiene(op, primerTitulo)}`,
  })
  r.push({
    nombre: 'Opción del recuadro de fuentes en el Word',
    ok: recuadro(normal) && !recuadro(op),
    detalle: `recuadro antes: ${recuadro(normal)}, después: ${recuadro(op)}`,
  })
  await ed.close()
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
  const mesa = await nav.newPage()
  await mesa.goto(servidor.base, { waitUntil: 'networkidle0' })
  const analizar = (docx) => mesa.evaluate(analizarEnPagina, docx)
  let fallos = 0
  try {
    for (const tema of temas) {
      const ctx = await nav.createBrowserContext()
      try {
        const ed = await abrirEditor(ctx, servidor.base, tema)
        const docx = await abrirDocx(await descargarWord(ed))
        await ed.close()
        const e = esperado([{ md: apunteDe(tema) }])
        if (!bandera('sabotajes')) {
          const r = controlar(await analizar(docx), e, docx)
          fallos += r.filter((x) => !x.ok).length
          pinta(`=== Tema ${tema} ===`, r)
          continue
        }
        for (const [n, s] of Object.entries(SABOTAJES)) {
          const roto = await sabotear(mesa, Number(n), docx, e)
          if (!roto) {
            console.log(`·     Tema ${tema} · sabotaje ${n} (${s.que}): no aplica`)
            continue
          }
          const r = controlar(await analizar(roto), e, roto)
          const caidos = r.map((x, i) => (x.ok ? -1 : i)).filter((i) => i >= 0)
          const faltan = s.tumba.filter((i) => !caidos.includes(i))
          const sobran = caidos.filter((i) => !s.tumba.includes(i))
          const bien = !faltan.length && !sobran.length
          if (!bien) fallos++
          console.log(
            `${bien ? 'OK   ' : 'FALLA'} Tema ${tema} · sabotaje ${n} (${s.que}): ${
              faltan.length ? `NO lo ve ${faltan.map((i) => `«${r[i].nombre}»`).join(', ')}` : sobran.length ? `tumba de más ${sobran.map((i) => `«${r[i].nombre}»`).join(', ')}` : `lo caza ${s.tumba.map((i) => `«${r[i].nombre}»: ${r[i].detalle}`).join('; ')}`
            }`,
          )
        }
      } finally {
        await ctx.close()
      }
    }
    if (!bandera('sabotajes') && (temas.includes(TEMA_FUNCIONES) || !pedidos.length)) {
      const ctx = await nav.createBrowserContext()
      try {
        const r = await funciones(ctx, servidor.base, TEMA_FUNCIONES, analizar)
        fallos += r.filter((x) => !x.ok).length
        pinta(`=== Ediciones y opciones en el Word (tema ${TEMA_FUNCIONES}) ===`, r)
      } finally {
        await ctx.close()
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
