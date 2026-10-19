#!/usr/bin/env node
/**
 * Bateria del TEST DE FALLADAS, contra la app ya renderizada.
 *
 *   node scripts/verificar-falladas.js
 *
 * Opciones:
 *   --base <url>     De donde leer la app (por defecto, dist/ servida aqui).
 *   --sabotajes      Autocomprobacion: rompe cada cosa a proposito y exige que
 *                    salte SU control y solo el suyo.
 *   --sabotaje <n>   Un sabotaje suelto.
 *   --chrome <ruta>  Ejecutable de Chrome.
 *
 * La lista se llena como la llena el opositor: fallando de verdad en el test
 * del tema, en los supuestos, en el test mixto y en las tarjetas. Cada pregunta
 * se identifica por su texto contra repaso/tema-NN.json, y se contesta bien o
 * mal a proposito segun lo que diga el dato.
 *
 * Cada control conduce su propia sesion en una pagina limpia, y cada sabotaje
 * solo estropea la sesion de su control.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

import { RAIZ, argumento, bandera, buscarChrome, decidirBase, temasConRepaso } from './comun.js'

const PUERTO = 4193
const CLAVE = 'oposicion-zgz:progreso:v1'
/** La misma pregunta de examen en dos temas: en la lista va una vez */
const GEMELAS = ['t26-q19', 't27-q22']

const pad = (n) => String(n).padStart(2, '0')
const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
const lista = (ns) => ns.join(', ').replace(/, ([^,]+)$/, ' y $1')

/** Sin mayusculas, tildes, puntuacion ni marcas de Markdown (un enlace deja su texto). */
const normaliza = (s) =>
  s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const huella = (pregunta, opciones) => [pregunta, ...opciones].map(normaliza).join('|')

/* ------------------------------------------------------------------ */
/* El dato                                                              */
/* ------------------------------------------------------------------ */

function cargarDato() {
  const preguntas = []
  const tarjetas = []
  const porTema = new Map()
  for (const t of temasConRepaso()) {
    const d = JSON.parse(readFileSync(join(RAIZ, `repaso/tema-${pad(t)}.json`), 'utf8'))
    porTema.set(t, d)
    for (const q of d.test ?? []) preguntas.push({ ...q, tema: t, clase: 'test' })
    for (const s of d.supuestos ?? []) {
      for (const q of s.preguntas) preguntas.push({ ...q, tema: t, clase: 'supuesto', supuesto: s })
    }
    for (const f of d.flashcards ?? []) tarjetas.push({ ...f, tema: t })
  }
  // El id canonico: el de la primera pregunta igual, en el orden de los temas
  const primera = new Map()
  for (const q of preguntas) {
    const h = huella(q.pregunta, q.opciones)
    q.canonico = primera.get(h) ?? q.id
    if (!primera.has(h)) primera.set(h, q.id)
  }
  const porId = new Map([...preguntas, ...tarjetas].map((x) => [x.id, x]))
  return { preguntas, tarjetas, porTema, porId }
}

/** La pregunta del dato que se esta viendo: mismo enunciado y mismas opciones. */
function identificar(dato, leida) {
  const ops = leida.opciones.map(normaliza).sort().join('|')
  const cs = dato.preguntas.filter(
    (q) => normaliza(q.pregunta) === normaliza(leida.pregunta) && q.opciones.map(normaliza).sort().join('|') === ops,
  )
  return cs.find((q) => q.tema === leida.rotulo) ?? cs[0] ?? null
}

const identificarTarjeta = (dato, anverso) => dato.tarjetas.find((t) => normaliza(t.anverso) === normaliza(anverso)) ?? null

/* ------------------------------------------------------------------ */
/* Conducir la app                                                      */
/* ------------------------------------------------------------------ */

/** Una pagina nueva, con el almacen vacio salvo que se diga lo contrario. */
async function abrir(nav, base, hash = '#/falladas', { limpia = true, antes } = {}) {
  const pag = await nav.newPage()
  await pag.setViewport({ width: 390, height: 900 })
  pag.errores = []
  pag.on('pageerror', (e) => pag.errores.push(e.message))
  // «Failed to load resource» no dice cual: se apunta la respuesta, con su direccion
  pag.on('console', (m) => m.type() === 'error' && !/^Failed to load resource/.test(m.text()) && pag.errores.push(m.text()))
  // (la app no tiene favicon desde siempre: ese 404 no es de esta funcion)
  pag.on('response', (r) => r.status() >= 400 && !r.url().endsWith('/favicon.ico') && pag.errores.push(`${r.status()} ${r.url()}`))
  if (antes) await antes(pag)
  await pag.goto(new URL(hash, base).href, { waitUntil: 'networkidle0' })
  if (limpia) {
    await pag.evaluate(() => localStorage.clear())
    await pag.reload({ waitUntil: 'networkidle0' })
  }
  return pag
}

/**
 * Va a una pantalla recargando la pagina, para leer del almacen. Con
 * `recargar: false` navega dentro de la app, como un enlace: lo que haya en
 * memoria sigue ahi.
 */
async function ir(pag, base, hash, { recargar = true } = {}) {
  if (!recargar) {
    await pag.evaluate((h) => (location.hash = h), hash.slice(1))
    await dormir(200)
    return
  }
  await pag.goto(new URL(hash, base).href, { waitUntil: 'networkidle0' })
  // goto a otro hash de la misma app no recarga: se fuerza
  await pag.reload({ waitUntil: 'networkidle0' })
}

const leerLista = (pag) =>
  pag.evaluate((clave) => JSON.parse(localStorage.getItem(clave) ?? 'null')?.falladas ?? null, CLAVE)

const escribirAlmacen = (pag, fn, arg) =>
  pag.evaluate(
    (clave, cuerpo, arg) => {
      const p = JSON.parse(localStorage.getItem(clave)) ?? {
        version: 1,
        preguntas: {},
        tarjetas: {},
        racha: { actual: 0, mejor: 0, ultimoDia: null },
        historial: {},
      }
      new Function('p', 'arg', cuerpo)(p, arg)
      localStorage.setItem(clave, JSON.stringify(p))
    },
    CLAVE,
    fn,
    arg,
  )

/** El indice de la opcion a pulsar: la correcta o una que no lo es. */
const indice = (q, como) => (como === 'bien' ? q.correcta : (q.correcta + 1) % q.opciones.length)

/**
 * El test de un tema (o un supuesto suyo), en el orden del dato: `plan[k]` es
 * 'bien' o 'mal' para la pregunta k. Comprueba que la que se ve es la del dato.
 */
async function contestarTema(pag, base, dato, tema, plan, supuesto = null) {
  if (supuesto === null) {
    await ir(pag, base, `#/tema/${tema}?vista=test`)
  } else {
    await ir(pag, base, `#/tema/${tema}?vista=supuestos`)
    await pag.evaluate((n) => document.querySelectorAll('.lista button.item')[n].click(), supuesto)
  }
  await pag.waitForSelector('.opciones button.opcion')
  const d = dato.porTema.get(tema)
  const qs = supuesto === null ? d.test : d.supuestos[supuesto].preguntas
  const hechas = []
  for (const [k, como] of plan.entries()) {
    const q = qs[k]
    const vista = await pag.evaluate(() => [...document.querySelectorAll('.opciones button.opcion span')].map((s) => s.innerText))
    if (vista.map(normaliza).join('|') !== q.opciones.map(normaliza).join('|')) {
      throw new Error(`tema ${tema}: la pregunta ${k + 1} no es ${q.id}`)
    }
    if (como) {
      await pag.evaluate((n) => document.querySelectorAll('.opciones button.opcion')[n].click(), indice(q, como))
      hechas.push({ id: q.id, canonico: dato.porId.get(q.id).canonico, como })
    } else {
      // sin contestar no se puede pasar: se acierta
      await pag.evaluate((n) => document.querySelectorAll('.opciones button.opcion')[n].click(), q.correcta)
    }
    await dormir(40)
    await pag.evaluate(() => [...document.querySelectorAll('.botones button')].find((b) => /Siguiente|Ver resultado/.test(b.textContent))?.click())
    await dormir(40)
  }
  return hechas
}

/** Las tarjetas de un tema, en su orden: `plan[k]` es 'Fallo', 'Bien' o 'Fácil'. */
async function repasarTema(pag, base, dato, tema, plan, opciones) {
  await ir(pag, base, `#/tema/${tema}?vista=tarjetas`, opciones)
  await pag.waitForSelector('.tarjeta.flash')
  const hechas = []
  for (const boton of plan) {
    const anverso = await pag.evaluate(() => document.querySelector('.flash-a').innerText)
    const t = identificarTarjeta(dato, anverso)
    if (!t || t.tema !== tema) throw new Error(`tema ${tema}: la tarjeta «${anverso.slice(0, 40)}» no es del tema`)
    await pag.evaluate(() => document.querySelector('.tarjeta.flash').click())
    await dormir(40)
    await pag.evaluate((b) => [...document.querySelectorAll('.botones button')].find((x) => x.textContent.trim() === b).click(), boton)
    await dormir(40)
    hechas.push({ id: t.id, boton })
  }
  return hechas
}

/** La pantalla de seleccion de falladas, ya pintada (o el aviso de vacia). */
async function irFalladas(pag, base, opciones) {
  await ir(pag, base, '#/falladas', opciones)
  await pag.waitForSelector('.mixto-panel, .falladas-vacia', { timeout: 15000 })
}

/** Elige tipo, temas (array o 'todos') y numero en la seleccion de falladas. */
async function configurar(pag, { tipo = 'test', temas = 'todos', cuantas = 0 }) {
  await pag.evaluate(
    async ({ tipo, temas, cuantas }) => {
      const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
      const boton = (re) => [...document.querySelectorAll('button')].find((b) => re.test(b.textContent.trim()))
      document.querySelector(`button[data-tipo="${tipo}"]`).click()
      await dormir(60)
      boton(temas === 'todos' ? /^Todos$/ : /^Ninguno$/).click()
      await dormir(60)
      if (temas !== 'todos') {
        for (const n of temas) {
          const casilla = document.querySelector(`input[data-tema="${n}"]`)
          if (!casilla.disabled) casilla.click()
          await dormir(30)
        }
      }
      document.querySelector(`button[data-cuantas="${cuantas}"]`).click()
      await dormir(60)
    },
    { tipo, temas, cuantas },
  )
}

async function empezar(pag, selector = '.opciones button.opcion') {
  const ok = await pag.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((b) => /^Empezar/.test(b.textContent.trim()))
    if (!b || b.disabled) return false
    b.click()
    return true
  })
  if (!ok) throw new Error('el botón «Empezar» no está o está desactivado')
  await pag.waitForSelector(selector, { timeout: 10000 })
}

/** Lo que se ve ANTES de contestar. */
const leerAntes = () => {
  const main = document.querySelector('main')
  const resto = main.cloneNode(true)
  resto.querySelectorAll('.mixto-pregunta, .opciones, .supuesto-enunciado').forEach((e) => e.remove())
  return {
    pregunta: document.querySelector('.mixto-pregunta')?.innerText ?? '',
    opciones: [...document.querySelectorAll('.opciones button.opcion span')].map((s) => s.innerText),
    enunciado: document.querySelector('.supuesto-enunciado')?.innerText ?? null,
    resto: resto.textContent,
    rotuloAntes: !!document.querySelector('.mixto-tema'),
    titulo: document.querySelector('main h1')?.textContent ?? '',
  }
}

/** Lo que se ve DESPUES de contestar. */
const leerDespues = () => ({
  marcada: [...document.querySelectorAll('.opciones button.opcion')].findIndex((b) => b.classList.contains('opcion-ok')),
  veredicto: document.querySelector('.explica b')?.textContent?.trim(),
  rotulo: Number(/Tema (\d+)\./.exec(document.querySelector('.mixto-tema')?.textContent ?? '')?.[1]) || null,
  explicacion: document.querySelector('.explica .md')?.innerText ?? null,
  fuente: document.querySelector('.explica .mixto-fuente')?.innerText ?? null,
  enlace: document.querySelector('.mixto-enlace a')?.getAttribute('href') ?? null,
})

/**
 * Contesta la sesion de preguntas entera. `decide(q, k)` dice 'bien' o 'mal'
 * para cada pregunta del dato; `perturbar(k, pag, leidas)` toca la pagina antes
 * de leer la k.
 */
async function recorrer(pag, dato, decide, perturbar) {
  const leidas = []
  for (let k = 0; k < 400; k++) {
    if (!(await pag.$('.opciones button.opcion'))) break
    if (perturbar) await perturbar(k, pag, leidas)
    const antes = await pag.evaluate(leerAntes)
    const q = identificar(dato, antes)
    if (!q) throw new Error(`la pregunta ${k + 1} («${antes.pregunta.slice(0, 50)}…») no está en el dato`)
    const como = decide(q, k)
    // se pulsa por su texto: si la pagina estuviera desordenada, se pulsa lo que se ve
    const texto = normaliza(q.opciones[indice(q, como)])
    await pag.evaluate((t) => {
      const norm = (s) => s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, ' ').trim()
      const bs = [...document.querySelectorAll('.opciones button.opcion')]
      ;(bs.find((b) => norm(b.querySelector('span').innerText) === t) ?? bs[0]).click()
    }, texto)
    await dormir(40)
    leidas.push({ ...antes, ...(await pag.evaluate(leerDespues)), q, como })
    const ultima = await pag.evaluate(() => {
      const b = [...document.querySelectorAll('.botones button')].find((b) => /Siguiente|Ver resultado/.test(b.textContent))
      if (!b) return true
      const u = /Ver resultado/.test(b.textContent)
      b.click()
      return u
    })
    await dormir(40)
    if (ultima) break
  }
  return leidas
}

/** La sesion de tarjetas falladas entera: `decide(t)` da el boton. */
async function recorrerTarjetas(pag, dato, decide) {
  const vistas = []
  for (let k = 0; k < 400; k++) {
    if (!(await pag.$('.tarjeta.flash'))) break
    const anverso = await pag.evaluate(() => document.querySelector('.flash-a').innerText)
    const t = identificarTarjeta(dato, anverso)
    if (!t) throw new Error(`la tarjeta «${anverso.slice(0, 40)}» no está en el dato`)
    const temaAntes = await pag.evaluate(() => !!document.querySelector('.mixto-tema'))
    await pag.evaluate(() => document.querySelector('.tarjeta.flash').click())
    await dormir(40)
    const rotulo = await pag.evaluate(() => Number(/Tema (\d+)\./.exec(document.querySelector('.mixto-tema')?.textContent ?? '')?.[1]) || null)
    const boton = decide(t)
    await pag.evaluate((b) => [...document.querySelectorAll('.botones button')].find((x) => x.textContent.trim() === b).click(), boton)
    await dormir(50)
    vistas.push({ t, boton, temaAntes, rotulo })
  }
  return vistas
}

/** Lo que dice la pantalla de seleccion (o de lista vacia). */
const leerSeleccion = () => ({
  vacia: !!document.querySelector('.falladas-vacia'),
  total: Number(document.querySelector('.falladas-resumen')?.dataset.total ?? 0),
  tipos: Object.fromEntries(
    [...document.querySelectorAll('button[data-tipo]')].map((b) => [b.dataset.tipo, Number(/\((\d+)\)\s*$/.exec(b.textContent)?.[1])]),
  ),
  chips: Object.fromEntries(
    [...document.querySelectorAll('.falladas-n')].map((s) => [s.closest('label').querySelector('input').dataset.tema, Number(s.dataset.cuenta)]),
  ),
  filas: [...document.querySelectorAll('.falladas-pendientes tbody tr')].map((tr) => ({
    tema: Number(tr.dataset.tema),
    test: Number(tr.querySelector('[data-clase="test"]').textContent) || 0,
    supuestos: Number(tr.querySelector('[data-clase="supuestos"]').textContent) || 0,
    tarjetas: Number(tr.querySelector('[data-clase="tarjetas"]').textContent) || 0,
  })),
  empezar: (() => {
    const b = [...document.querySelectorAll('button')].find((b) => /^Empezar/.test(b.textContent.trim()))
    return b ? { activo: !b.disabled, n: Number(/\((\d+)/.exec(b.textContent)?.[1]) } : null
  })(),
})

const leerResultado = () => {
  const num = (td) => Number(td?.textContent?.trim())
  const nota = /(\d+)\s*\/\s*(\d+)/.exec(document.querySelector('.mixto-nota')?.textContent ?? '')
  return {
    titulo: document.querySelector('main h1')?.textContent ?? '',
    nota: nota ? { aciertos: Number(nota[1]), total: Number(nota[2]) } : null,
    puntos: /nota con penalización de 1\/4:\s*([\d.]+)/.exec(document.querySelector('main')?.textContent ?? '')?.[1] ?? null,
    filas: [...document.querySelectorAll('.mixto-desglose tbody tr')].map((tr) => ({
      tema: Number(tr.dataset.tema),
      aciertos: num(tr.querySelector('[data-aciertos]')),
      preguntas: num(tr.querySelector('[data-preguntas]')),
    })),
    quedan: Number(document.querySelector('[data-quedan]')?.textContent ?? NaN),
  }
}

/** Pone en la pagina otra pregunta: su enunciado y sus opciones, en su orden. */
const suplantar = (pag, pregunta, opciones) =>
  pag.evaluate(
    ({ pregunta, opciones }) => {
      const caja = document.querySelector('.mixto-pregunta')
      caja.replaceChildren(Object.assign(document.createElement('p'), { textContent: pregunta }))
      document.querySelectorAll('.opciones button.opcion span').forEach((s, i) => (s.textContent = opciones[i]))
    },
    { pregunta, opciones },
  )

/** Compara las claves de una lista con las esperadas. */
function mismasClaves(que, tiene, debe) {
  const t = Object.keys(tiene ?? {}).sort()
  const d = [...new Set(debe)].sort()
  const sobran = t.filter((x) => !d.includes(x))
  const faltan = d.filter((x) => !t.includes(x))
  if (sobran.length || faltan.length) {
    throw new Error(`${que}: sobran ${sobran.join(', ') || 'ninguna'}; faltan ${faltan.join(', ') || 'ninguna'}`)
  }
}

/* ------------------------------------------------------------------ */
/* Los controles                                                        */
/* ------------------------------------------------------------------ */

const NOMBRES = [
  'Entrada · solo entran las falladas',
  'Sin duplicados · cada pregunta una vez en la lista y en la sesión',
  'Salida · dos aciertos seguidos la sacan; un fallo reinicia la cuenta',
  'Persistencia · la lista sobrevive a recargar y a cerrar la pestaña',
  'Filtro · solo salen los temas elegidos, y cuantas se piden',
  'Lista vacía · aviso claro, botón al test mixto y nada roto',
  'Vaciar · pide confirmación y no vuelve al recargar',
  'Corrección · como en el mixto: tema oculto, opciones en su orden, nota y desglose',
]

const SABOTAJES = {
  1: 'una pregunta acertada entra en la lista',
  2: 'una pregunta sale dos veces en la sesión de falladas',
  3: 'un fallo no reinicia la cuenta de aciertos seguidos',
  4: 'la lista no llega a guardarse en el navegador',
  5: 'una fallada de un tema no elegido se cuela en la sesión',
  6: 'falta el botón al test mixto con la lista vacía',
  7: 'la lista vaciada vuelve al recargar',
  8: 'dos opciones cambian de sitio',
}
const CONTROL_DE = { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7] }

async function controles(nav, base, dato, sab) {
  const resultados = []
  const control = async (nombre, fn) => {
    try {
      resultados.push({ nombre, estado: 'ok', detalle: await fn() })
    } catch (e) {
      resultados.push({ nombre, estado: 'falla', detalle: e.message })
    }
  }
  const sinErrores = (pag, donde) => {
    if (pag.errores.length) throw new Error(`${donde}: errores en la página: ${pag.errores.slice(0, 2).join(' | ')}`)
  }

  /* 1. Solo entran las falladas: del test del tema, de los supuestos, del mixto y de las tarjetas */
  await control(NOMBRES[0], async () => {
    const pag = await abrir(nav, base)
    const enTema = await contestarTema(pag, base, dato, 3, ['mal', 'bien', 'mal', 'bien', 'bien', 'mal'])
    const enSup = await contestarTema(pag, base, dato, 12, ['bien', 'mal', 'bien'], 0)

    // el test mixto, pulsando siempre la a): se falla lo que no es a)
    await ir(pag, base, '#/mixto')
    await pag.waitForSelector('input[data-tema]')
    await pag.evaluate(async () => {
      const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
      ;[...document.querySelectorAll('button')].find((b) => /^Test · 3/.test(b.textContent.trim())).click()
      await dormir(60)
      ;[...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Ninguno').click()
      await dormir(60)
      document.querySelector('input[data-tema="17"]').click()
      await dormir(60)
      document.querySelector('button[data-cuantas="10"]').click()
      await dormir(60)
    })
    await empezar(pag)
    const enMixto = await recorrer(pag, dato, (q) => (q.correcta === 0 ? 'bien' : 'mal'))

    const enTarjetas = await repasarTema(pag, base, dato, 5, ['Fallo', 'Bien', 'Fácil'])

    if (sab === 1) {
      const acertada = enTema.find((h) => h.como === 'bien').canonico
      await escribirAlmacen(pag, `p.falladas.preguntas[arg] = { racha: 0, fallos: 1, desde: '2026-10-19' }`, acertada)
    }

    const debe = [...enTema, ...enSup].filter((h) => h.como === 'mal').map((h) => h.canonico)
    debe.push(...enMixto.filter((l) => l.como === 'mal').map((l) => l.q.canonico))
    const debeTarjetas = enTarjetas.filter((h) => h.boton === 'Fallo').map((h) => h.id)
    const guardada = await leerLista(pag)
    mismasClaves('la lista de preguntas', guardada?.preguntas, debe)
    mismasClaves('la lista de tarjetas', guardada?.tarjetas, debeTarjetas)

    // y lo que se ve: la pagina de falladas y el Inicio
    await irFalladas(pag, base)
    const sel = await pag.evaluate(leerSeleccion)
    const total = debe.length + debeTarjetas.length
    if (sel.total !== total) throw new Error(`la página de falladas dice ${sel.total} pendientes y son ${total}`)
    await ir(pag, base, '#/')
    const inicio = await pag.evaluate(() => Number(document.querySelector('.inicio-falladas')?.dataset.total))
    if (inicio !== total) throw new Error(`Inicio dice ${inicio} falladas y son ${total}`)
    sinErrores(pag, 'al llenar la lista')
    await pag.close()

    // Un progreso de antes de la lista la estrena con lo ya fallado, y solo con eso
    const vieja = await abrir(nav, base)
    const [mal, bien] = dato.porTema.get(3).test
    const [tMal, tBien] = dato.porTema.get(4).flashcards
    await vieja.evaluate(
      (clave, v) => localStorage.setItem(clave, JSON.stringify(v)),
      CLAVE,
      {
        version: 1,
        preguntas: {
          [mal.id]: { intentos: 2, aciertos: 1, fallos: 1, ultimoAcierto: false, ultimaRespuesta: '2026-10-10' },
          [bien.id]: { intentos: 2, aciertos: 1, fallos: 1, ultimoAcierto: true, ultimaRespuesta: '2026-10-10' },
        },
        tarjetas: {
          [tMal.id]: { reps: 0, aciertos: 1, fallos: 1, facilidad: 2.3, intervalo: 0, proximaRevision: '2026-10-10', ultimaRevision: '2026-10-10' },
          [tBien.id]: { reps: 1, aciertos: 1, fallos: 1, facilidad: 2.3, intervalo: 1, proximaRevision: '2026-10-11', ultimaRevision: '2026-10-10' },
        },
        racha: { actual: 0, mejor: 1, ultimoDia: '2026-10-10' },
        historial: {},
      },
    )
    await irFalladas(vieja, base)
    const sembrada = await vieja.evaluate(leerSeleccion)
    await vieja.close()
    if (sembrada.total !== 2 || sembrada.tipos.test !== 1 || sembrada.tipos.tarjetas !== 1) {
      throw new Error(`un progreso anterior estrena la lista con ${sembrada.total} (test ${sembrada.tipos.test}, tarjetas ${sembrada.tipos.tarjetas}) y deben ser 1 pregunta y 1 tarjeta`)
    }
    return `${debe.length} preguntas falladas (tema ${enTema.filter((h) => h.como === 'mal').length}, supuestos ${enSup.filter((h) => h.como === 'mal').length}, mixto ${enMixto.filter((l) => l.como === 'mal').length}) y ${debeTarjetas.length} tarjeta en la lista; ninguna acertada; la página y el Inicio dicen ${total}; un progreso de antes entra con su pregunta y su tarjeta falladas, nada más`
  })

  /* 2. Sin duplicados: la misma pregunta fallada dos veces, y la que esta en dos temas */
  await control(NOMBRES[1], async () => {
    const pag = await abrir(nav, base)
    await contestarTema(pag, base, dato, 3, ['mal'])
    await contestarTema(pag, base, dato, 3, ['mal'])
    const posicion = (id) => {
      const q = dato.porId.get(id)
      return dato.porTema.get(q.tema).test.findIndex((x) => x.id === id)
    }
    for (const id of GEMELAS) {
      const q = dato.porId.get(id)
      const plan = Array(posicion(id)).fill(null).concat('mal')
      await contestarTema(pag, base, dato, q.tema, plan)
    }
    const guardada = await leerLista(pag)
    const primera = dato.porTema.get(3).test[0].id
    mismasClaves('la lista', guardada?.preguntas, [primera, GEMELAS[0]])
    if (guardada.preguntas[primera].fallos !== 2) throw new Error(`${primera}, fallada dos veces, dice ${guardada.preguntas[primera].fallos} fallos`)
    if (guardada.preguntas[GEMELAS[0]].fallos !== 2) throw new Error(`${GEMELAS.join(' y ')} (la misma) dicen ${guardada.preguntas[GEMELAS[0]].fallos} fallos y son 2`)

    await irFalladas(pag, base)
    const sel = await pag.evaluate(leerSeleccion)
    if (sel.total !== 2) throw new Error(`la página dice ${sel.total} pendientes y son 2`)
    await configurar(pag, { cuantas: 0 })
    await empezar(pag)
    const repite = async (k, pag, leidas) => {
      if (k === 1) await suplantar(pag, leidas[0].pregunta, leidas[0].opciones)
    }
    const leidas = await recorrer(pag, dato, () => 'mal', sab === 2 ? repite : null)
    await pag.close()
    const vistas = new Set(leidas.map((l) => huella(l.pregunta, l.opciones)))
    if (vistas.size !== leidas.length) throw new Error(`en la sesión sale ${leidas.length - vistas.size} pregunta repetida`)
    if (leidas.length !== 2) throw new Error(`en la sesión salen ${leidas.length} preguntas y son 2`)
    return `fallada dos veces, ${primera} está una vez (2 fallos); ${GEMELAS.join(' y ')}, la misma en dos temas, una sola entrada; la sesión las saca una vez cada una`
  })

  /* 3. La regla de salida: dos aciertos seguidos, en cualquier test; un fallo vuelve a cero */
  await control(NOMBRES[2], async () => {
    const pag = await abrir(nav, base)
    const [A, B, C] = dato.porTema.get(3).test.map((q) => q.id)
    await contestarTema(pag, base, dato, 3, ['mal', 'mal', 'mal'])
    const sesion = async (plan) => {
      await irFalladas(pag, base)
      await configurar(pag, { cuantas: 0 })
      await empezar(pag)
      return recorrer(pag, dato, (q) => plan[q.id])
    }
    const comprobar = async (cuando, debe) => {
      const l = (await leerLista(pag)).preguntas
      for (const [id, racha] of Object.entries(debe)) {
        if (racha === null) {
          if (l[id]) throw new Error(`${cuando}: ${id} debía haber salido y sigue (racha ${l[id].racha})`)
        } else if (!l[id]) throw new Error(`${cuando}: ${id} ha salido y debía seguir con ${racha} acierto(s) seguidos`)
        else if (l[id].racha !== racha) throw new Error(`${cuando}: ${id} lleva ${l[id].racha} aciertos seguidos y son ${racha}`)
      }
    }
    await comprobar('tras fallarlas', { [A]: 0, [B]: 0, [C]: 0 })
    await sesion({ [A]: 'bien', [B]: 'bien', [C]: 'mal' })
    const quedan1 = (await pag.evaluate(leerResultado)).quedan
    await comprobar('tras la 1.ª sesión', { [A]: 1, [B]: 1, [C]: 0 })
    if (quedan1 !== 3) throw new Error(`tras la 1.ª sesión el resultado dice que quedan ${quedan1} y son 3`)
    await sesion({ [A]: 'bien', [B]: 'mal', [C]: 'bien' })
    if (sab === 3) await escribirAlmacen(pag, `p.falladas.preguntas[arg].racha = 1`, B)
    await comprobar('tras la 2.ª sesión', { [A]: null, [B]: 0, [C]: 1 })
    // «o en cualquier test»: el del tema tambien cuenta
    await contestarTema(pag, base, dato, 3, ['bien', 'bien', 'bien'])
    await comprobar('tras acertarlas en el test del tema', { [A]: null, [B]: 1, [C]: null })
    mismasClaves('la lista al final', (await leerLista(pag)).preguntas, [B])

    // Las tarjetas, con sus botones: «Bien» y «Fácil» aciertan, «Fallo» reinicia
    const [T] = await repasarTema(pag, base, dato, 5, ['Fallo'])
    const pasos = [
      ['Bien', 1],
      ['Fallo', 0],
      ['Fácil', 1],
      ['Bien', null],
    ]
    for (const [boton, racha] of pasos) {
      await irFalladas(pag, base)
      await configurar(pag, { tipo: 'tarjetas', cuantas: 0 })
      await empezar(pag, '.tarjeta.flash')
      const vistas = await recorrerTarjetas(pag, dato, () => boton)
      if (vistas.length !== 1 || vistas[0].t.id !== T.id) throw new Error(`la sesión de tarjetas saca ${vistas.map((v) => v.t.id).join(', ')} y debía sacar ${T.id}`)
      const l = (await leerLista(pag)).tarjetas
      if (racha === null ? l[T.id] : l[T.id]?.racha !== racha) {
        throw new Error(`tarjeta ${T.id} tras «${boton}»: ${l[T.id] ? `racha ${l[T.id].racha}` : 'fuera'}, y debía ${racha === null ? 'salir' : `llevar ${racha}`}`)
      }
    }
    await irFalladas(pag, base)
    const sel = await pag.evaluate(leerSeleccion)
    sinErrores(pag, 'en las sesiones')
    await pag.close()
    if (sel.total !== 1 || sel.tipos.tarjetas !== 0) throw new Error(`al final la página dice ${sel.total} pendientes (tarjetas ${sel.tipos.tarjetas}) y es 1 pregunta`)
    return `${A}: bien, bien → sale; ${B}: bien, mal, bien → sigue con 1; ${C}: mal, bien, bien en el test del tema → sale; tarjeta ${T.id}: Bien, Fallo, Fácil, Bien → sale`
  })

  /* 4. La lista vive en el navegador: recargar y abrir otra pestaña */
  await control(NOMBRES[3], async () => {
    // El sabotaje tira las escrituras del progreso: la app sigue en memoria
    const antes =
      sab === 4
        ? (pag) =>
            pag.evaluateOnNewDocument((clave) => {
              const original = Storage.prototype.setItem
              Storage.prototype.setItem = function (k, v) {
                if (k !== clave) original.call(this, k, v)
              }
            }, CLAVE)
        : null
    const pag = await abrir(nav, base, '#/falladas', { antes })
    // Todo dentro de la app, sin recargar: la lista se lee primero de memoria
    const enMemoria = { recargar: false }
    const hechas = await contestarTema(pag, base, dato, 17, ['mal', 'mal', 'bien', 'mal'])
    await repasarTema(pag, base, dato, 9, ['Fallo', 'Fallo'], enMemoria)
    await irFalladas(pag, base, enMemoria)
    const antesDeRecargar = await pag.evaluate(leerSeleccion)
    // una de ellas, acertada una vez en el test de falladas: la racha tambien se guarda
    await configurar(pag, { cuantas: 0 })
    await empezar(pag)
    const primera = hechas[0].id
    await recorrer(pag, dato, (q) => (q.id === primera ? 'bien' : 'mal'))

    await irFalladas(pag, base)
    const recargada = await pag.evaluate(leerSeleccion)
    await pag.close()
    const otra = await abrir(nav, base, '#/falladas', { limpia: false })
    await otra.waitForSelector('.mixto-panel, .falladas-vacia')
    const enOtra = await otra.evaluate(leerSeleccion)
    const guardada = await leerLista(otra)
    await otra.close()
    const esperado = { total: 5, test: 3, tarjetas: 2 }
    for (const [donde, s] of [
      ['antes de recargar', antesDeRecargar],
      ['al recargar', recargada],
      ['en otra pestaña', enOtra],
    ]) {
      if (s.total !== esperado.total || s.tipos.test !== esperado.test || s.tipos.tarjetas !== esperado.tarjetas) {
        throw new Error(`${donde}: ${s.total} pendientes (test ${s.tipos.test}, tarjetas ${s.tipos.tarjetas}) y son ${esperado.total} (3 y 2)`)
      }
    }
    if (guardada?.preguntas?.[primera]?.racha !== 1) throw new Error(`en otra pestaña ${primera} no conserva su acierto (racha ${guardada?.preguntas?.[primera]?.racha})`)
    return `3 preguntas y 2 tarjetas antes de recargar, al recargar y en otra pestaña; y ${primera} conserva su acierto`
  })

  /* 5. El filtro por temas y el numero de preguntas */
  await control(NOMBRES[4], async () => {
    const pag = await abrir(nav, base)
    const temas = [3, 17, 33]
    for (const t of temas) await contestarTema(pag, base, dato, t, ['mal', 'mal', 'mal', 'mal'])
    await irFalladas(pag, base)
    const sel = await pag.evaluate(leerSeleccion)
    for (const t of temas) {
      if (sel.chips[t] !== 4) throw new Error(`la casilla del tema ${t} dice ${sel.chips[t]} y son 4`)
      const fila = sel.filas.find((f) => f.tema === t)
      if (fila?.test !== 4) throw new Error(`la fila del tema ${t} dice ${fila?.test} de test y son 4`)
    }
    if (Object.keys(sel.chips).length !== 3 || sel.filas.length !== 3) throw new Error(`hay casillas o filas con falladas de temas que no las tienen`)

    // por casillas: 17 y 33, «todas»
    await configurar(pag, { temas: [17, 33], cuantas: 0 })
    const elegidas = await pag.evaluate(leerSeleccion)
    if (elegidas.empezar?.n !== 8) throw new Error(`con los temas 17 y 33 el botón ofrece ${elegidas.empezar?.n} y son 8`)
    await empezar(pag)
    const intrusa = dato.porTema.get(3).test[0]
    const cuela = async (k, pag) => {
      if (k === 0) await suplantar(pag, intrusa.pregunta, intrusa.opciones)
    }
    const leidas = await recorrer(pag, dato, () => 'mal', sab === 5 ? cuela : null)
    for (const l of leidas) {
      if (![17, 33].includes(l.q.tema)) throw new Error(`sale ${l.q.id}, del tema ${l.q.tema}, con solo 17 y 33 elegidos`)
    }
    if (leidas.length !== 8) throw new Error(`con 17 y 33 salen ${leidas.length} y son 8`)

    // por rango: del 15 al 40, «solo estos», y 10 preguntas (solo hay 8: salen 8)
    await irFalladas(pag, base)
    await pag.evaluate(async () => {
      const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
      const pon = (el, v) => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, v)
        el.dispatchEvent(new Event('input', { bubbles: true }))
      }
      pon(document.querySelector('input[aria-label="Primer tema del rango"]'), '15')
      pon(document.querySelector('input[aria-label="Último tema del rango"]'), '40')
      await dormir(60)
      ;[...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Solo estos').click()
      await dormir(60)
      document.querySelector('button[data-cuantas="10"]').click()
      await dormir(60)
    })
    const marcadas = await pag.evaluate(() => [...document.querySelectorAll('input[data-tema]:checked')].map((i) => Number(i.dataset.tema)))
    if (marcadas.join() !== '17,33') throw new Error(`el rango 15-40 deja marcadas ${marcadas.join(', ') || 'ninguna'} y son 17 y 33`)
    const rango = await pag.evaluate(leerSeleccion)
    if (rango.empezar?.n !== 8) throw new Error(`con 10 pedidas y 8 en el rango, el botón ofrece ${rango.empezar?.n}`)

    // todos, 10: salen 10 de las 12
    await configurar(pag, { cuantas: 10 })
    await empezar(pag)
    const diez = await recorrer(pag, dato, () => 'bien')
    await pag.close()
    if (diez.length !== 10) throw new Error(`con todos y 10 pedidas salen ${diez.length}`)
    return `casillas y tabla con 4 en los temas ${lista(temas.map(String))}; con 17 y 33 salen sus 8 y ninguna del 3; el rango 15-40 marca 17 y 33; con 10 pedidas de 12, salen 10`
  })

  /* 6. Con la lista vacia: aviso, boton al mixto y nada roto */
  await control(NOMBRES[5], async () => {
    const pag = await abrir(nav, base)
    await irFalladas(pag, base)
    if (sab === 6) await pag.evaluate(() => document.querySelector('.falladas-vacia a')?.remove())
    const vacia = await pag.evaluate(() => ({
      aviso: document.querySelector('.falladas-vacia')?.innerText ?? '',
      panel: !!document.querySelector('.mixto-panel'),
      empezar: [...document.querySelectorAll('button')].some((b) => /^Empezar/.test(b.textContent.trim())),
      boton: [...document.querySelectorAll('.falladas-vacia a')].find((a) => /test mixto/i.test(a.textContent))?.getAttribute('href') ?? null,
      insignia: !!document.querySelector('.nav-n'),
    }))
    if (!/No tienes falladas pendientes/.test(vacia.aviso)) throw new Error('con la lista vacía no sale el aviso')
    if (vacia.panel || vacia.empezar) throw new Error('con la lista vacía se ofrece empezar un test')
    if (vacia.boton !== '#/mixto') throw new Error(`con la lista vacía no hay botón al test mixto (${vacia.boton})`)
    if (vacia.insignia) throw new Error('el menú muestra un número de falladas con la lista vacía')
    await pag.evaluate(() => [...document.querySelectorAll('.falladas-vacia a')].find((a) => /test mixto/i.test(a.textContent)).click())
    await pag.waitForSelector('input[data-tema]', { timeout: 10000 })
    if (!(await pag.evaluate(() => location.hash === '#/mixto'))) throw new Error('el botón no lleva al test mixto')

    await ir(pag, base, '#/')
    const inicio = await pag.evaluate(() => document.querySelector('.inicio-falladas')?.textContent ?? '')
    if (!/Ninguna fallada pendiente/.test(inicio)) throw new Error(`Inicio con la lista vacía dice «${inicio.slice(0, 60)}»`)

    // Lo que hay en la lista ya no existe en el contenido: cuenta como vacia
    await escribirAlmacen(pag, `p.falladas = { preguntas: { 'tXX-q99': { racha: 0, fallos: 1, desde: '2026-10-01' } }, tarjetas: {} }`)
    await irFalladas(pag, base)
    const huerfana = await pag.evaluate(() => !!document.querySelector('.falladas-vacia'))
    if (!huerfana) throw new Error('una entrada que ya no existe en el contenido cuenta como fallada')

    // Hay falladas de test, pero ninguna tarjeta: el tipo tarjetas no deja empezar
    await contestarTema(pag, base, dato, 3, ['mal'])
    await irFalladas(pag, base)
    await configurar(pag, { tipo: 'tarjetas' })
    const sinTarjetas = await pag.evaluate(() => ({
      aviso: document.querySelector('.mixto-elegidos')?.textContent ?? '',
      activo: !([...document.querySelectorAll('button')].find((b) => /^Empezar/.test(b.textContent.trim()))?.disabled ?? true),
    }))
    if (sinTarjetas.activo) throw new Error('sin tarjetas falladas, «Empezar» sigue activo')
    if (!/No hay tarjetas falladas/.test(sinTarjetas.aviso)) throw new Error(`sin tarjetas falladas dice «${sinTarjetas.aviso}»`)
    sinErrores(pag, 'con la lista vacía')
    await pag.close()
    return 'aviso claro, sin test que empezar, botón que lleva al mixto, Inicio sin falladas; una entrada huérfana no cuenta; sin tarjetas falladas no deja empezar; ningún error en la página'
  })

  /* 7. Vaciar la lista: con confirmacion, y para siempre */
  await control(NOMBRES[6], async () => {
    const pag = await abrir(nav, base)
    await contestarTema(pag, base, dato, 3, ['mal', 'mal'])
    await repasarTema(pag, base, dato, 5, ['Fallo'])
    await irFalladas(pag, base)
    const pulsa = (re) =>
      pag.evaluate((src) => {
        const b = [...document.querySelectorAll('button')].find((b) => new RegExp(src).test(b.textContent.trim()))
        if (!b) throw new Error(`no hay botón ${src}`)
        b.click()
      }, re.source)
    await pulsa(/^Vaciar la lista$/)
    await dormir(60)
    const pregunta = await pag.evaluate(() => document.querySelector('.falladas-vaciar')?.innerText ?? '')
    if (!/¿Vaciar la lista\?/.test(pregunta)) throw new Error('«Vaciar la lista» no pide confirmación')
    if (Object.keys((await leerLista(pag)).preguntas).length !== 2) throw new Error('la lista se vacía antes de confirmar')
    await pulsa(/^Cancelar$/)
    await dormir(60)
    if (Object.keys((await leerLista(pag)).preguntas).length !== 2) throw new Error('«Cancelar» vacía la lista')
    const antes = await pag.evaluate((clave) => JSON.parse(localStorage.getItem(clave)), CLAVE)
    await pulsa(/^Vaciar la lista$/)
    await dormir(60)
    await pulsa(/^Sí, vaciar la lista$/)
    await dormir(80)
    if (!(await pag.evaluate(() => !!document.querySelector('.falladas-vacia')))) throw new Error('tras vaciar no sale el aviso de lista vacía')
    if (sab === 7) await escribirAlmacen(pag, `p.falladas = arg`, antes.falladas)
    await irFalladas(pag, base)
    const despues = await pag.evaluate((clave) => JSON.parse(localStorage.getItem(clave)), CLAVE)
    const vacia = await pag.evaluate(() => !!document.querySelector('.falladas-vacia'))
    await pag.close()
    if (!vacia) throw new Error('al recargar, la lista vaciada vuelve')
    if (Object.keys(despues.preguntas).length !== Object.keys(antes.preguntas).length) throw new Error('vaciar la lista ha borrado progreso de preguntas')
    if (JSON.stringify(despues.tarjetas) !== JSON.stringify(antes.tarjetas)) throw new Error('vaciar la lista ha tocado el repaso espaciado de las tarjetas')
    return 'pide confirmación; «Cancelar» la deja; «Sí, vaciar» la vacía, sigue vacía al recargar, y el progreso y el repaso espaciado no cambian'
  })

  /* 8. La pantalla y la correccion, como en el mixto */
  await control(NOMBRES[7], async () => {
    const pag = await abrir(nav, base)
    await contestarTema(pag, base, dato, 3, ['mal', 'mal', 'mal'])
    await contestarTema(pag, base, dato, 17, ['mal', 'mal', 'mal'])
    await contestarTema(pag, base, dato, 12, ['mal', 'mal'], 0)
    await irFalladas(pag, base)
    const nombres = await pag.evaluate(() =>
      [...document.querySelectorAll('label[title]')].map((l) => l.getAttribute('title').replace(/^\d+\.\s*/, '')),
    )
    await configurar(pag, { cuantas: 0 })
    await empezar(pag)
    const cruza = async (k, pag) => {
      if (k !== 0) return
      await pag.evaluate(() => {
        const [a, b] = document.querySelectorAll('.opciones button.opcion span')
        ;[a.textContent, b.textContent] = [b.textContent, a.textContent]
      })
    }
    // alterna: bien, mal, bien... para que la nota tenga de las dos
    const leidas = await recorrer(pag, dato, (q, k) => (k % 2 ? 'mal' : 'bien'), sab === 8 ? cruza : null)
    const r = await pag.evaluate(leerResultado)

    const trozos = nombres.map((t) => normaliza(t).slice(0, 40)).filter((t) => t.length >= 20)
    for (const [k, l] of leidas.entries()) {
      const q = l.q
      if (l.rotuloAntes || /\btema\s*\d+/i.test(l.resto)) throw new Error(`pregunta ${k + 1}: el tema se ve antes de contestar`)
      const titulo = trozos.find((t) => normaliza(l.resto).includes(t))
      if (titulo) throw new Error(`pregunta ${k + 1}: antes de contestar se lee el título «${titulo}…»`)
      if (!l.opciones.map(normaliza).every((o, i) => o === normaliza(q.opciones[i]))) throw new Error(`${q.id}: las opciones no salen en el orden del dato`)
      if (l.marcada !== q.correcta) throw new Error(`${q.id}: la app marca la ${'abcd'[l.marcada]} y el dato dice la ${'abcd'[q.correcta]}`)
      if ((l.veredicto === 'Correcto.') !== (l.como === 'bien')) throw new Error(`${q.id}: el veredicto no concuerda con lo pulsado`)
      if (l.rotulo !== q.tema) throw new Error(`${q.id}: la corrección dice tema ${l.rotulo}`)
      if (q.explicacion && !l.explicacion) throw new Error(`${q.id}: falta la explicación`)
      if (q.fuente && !l.fuente) throw new Error(`${q.id}: falta la fuente`)
      if (!new RegExp(`^#/tema/${q.tema}(\\?ap=|$)`).test(l.enlace ?? '')) throw new Error(`${q.id}: el enlace al apunte es «${l.enlace}»`)
      if (q.clase === 'supuesto' && !l.enunciado?.trim()) throw new Error(`${q.id}: sale sin el enunciado de su supuesto`)
      if (!/Test de falladas/.test(l.titulo)) throw new Error(`pregunta ${k + 1}: la pantalla no dice «Test de falladas»`)
    }
    // en la sesion de test no salen los supuestos (van aparte, como en el mixto)
    if (leidas.some((l) => l.q.clase !== 'test')) throw new Error('en la sesión de test salen preguntas de supuestos')
    if (leidas.length !== 6) throw new Error(`salen ${leidas.length} de test y son 6`)

    const bien = leidas.filter((l) => l.como === 'bien').length
    const mal = leidas.length - bien
    const nota = Math.max(0, ((bien - mal / 4) / leidas.length) * 10).toFixed(2)
    if (r.nota?.aciertos !== bien || r.nota?.total !== leidas.length) throw new Error(`la nota dice ${r.nota?.aciertos}/${r.nota?.total} y son ${bien}/${leidas.length}`)
    if (r.puntos !== nota) throw new Error(`la nota con penalización dice ${r.puntos} y es ${nota}`)
    for (const f of r.filas) {
      const del = leidas.filter((l) => l.q.tema === f.tema)
      if (f.preguntas !== del.length || f.aciertos !== del.filter((l) => l.como === 'bien').length) {
        throw new Error(`la fila del tema ${f.tema} dice ${f.aciertos}/${f.preguntas} y son ${del.filter((l) => l.como === 'bien').length}/${del.length}`)
      }
    }
    if (r.filas.reduce((n, f) => n + f.preguntas, 0) !== leidas.length) throw new Error('el desglose no suma el total')

    // los supuestos, aparte: con su enunciado y cuatro opciones
    await irFalladas(pag, base)
    await configurar(pag, { tipo: 'supuestos', cuantas: 0 })
    await empezar(pag)
    const sup = await recorrer(pag, dato, () => 'bien')
    sinErrores(pag, 'en la sesión')
    await pag.close()
    if (sup.length !== 2 || sup.some((l) => l.q.clase !== 'supuesto' || l.opciones.length !== 4 || !l.enunciado)) {
      throw new Error(`la sesión de supuestos saca ${sup.length} (deben ser 2, con enunciado y 4 opciones)`)
    }
    return `${leidas.length} de test sin tema a la vista hasta contestar, opciones en su orden, explicación, fuente y enlace; nota ${bien}/${leidas.length} = ${nota} con la penalización; desglose ${r.filas.map((f) => `tema ${f.tema}: ${f.aciertos}/${f.preguntas}`).join(' · ')}; y 2 de supuestos con su enunciado`
  })

  return resultados
}

/* ------------------------------------------------------------------ */

function pinta(resultados) {
  console.log('\n=== Test de falladas ===')
  for (const r of resultados) {
    const marca = r.estado === 'ok' ? 'OK   ' : 'FALLA'
    console.log(`${marca} ${r.nombre}\n        ${r.detalle}`)
  }
}

async function main() {
  const dato = cargarDato()
  const servidor = await decidirBase(PUERTO)
  const nav = await puppeteer.launch({
    executablePath: buscarChrome(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })

  let fallos = 0
  try {
    const suelto = argumento('sabotaje')
    const lista = bandera('sabotajes') ? Object.keys(SABOTAJES).map(Number) : suelto ? [Number(suelto)] : [0]

    for (const sab of lista) {
      const resultados = await controles(nav, servidor.base, dato, sab)
      if (!sab) {
        pinta(resultados)
        const malos = resultados.filter((r) => r.estado === 'falla').length
        fallos += malos
        console.log(`\n${resultados.length - malos}/${resultados.length} controles pasan.`)
        continue
      }
      // Modo sabotaje: tiene que caer su control, y solo ese.
      const esperados = CONTROL_DE[sab]
      const nombres = (is) => is.map((i) => `«${resultados[i].nombre}»`).join(', ')
      const caidos = resultados.map((r, i) => (r.estado === 'falla' ? i : -1)).filter((i) => i >= 0)
      const faltan = esperados.filter((i) => !caidos.includes(i))
      const sobran = caidos.filter((i) => !esperados.includes(i))
      if (faltan.length) {
        console.log(`FALLA sabotaje ${sab} NO detectado: ${nombres(faltan)} siguió pasando`)
        fallos++
      } else if (sobran.length) {
        console.log(`FALLA sabotaje ${sab} tumbó de más: ${nombres(sobran)} (${sobran.map((i) => resultados[i].detalle).join('; ')})`)
        fallos++
      } else {
        console.log(`OK    sabotaje ${sab} (${SABOTAJES[sab]})`)
        for (const i of esperados) console.log(`        lo caza «${resultados[i].nombre}»: ${resultados[i].detalle}`)
      }
    }
  } finally {
    await nav.close()
    servidor.parar()
  }

  if (fallos) throw new Error(`${fallos} control(es) sin pasar.`)
}

main().catch((e) => {
  console.error(e.message ?? e)
  process.exit(1)
})
