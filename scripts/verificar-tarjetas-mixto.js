#!/usr/bin/env node
/**
 * Bateria del FILTRO DE NUCLEO (test mixto y test de falladas) y de la sesion
 * «TEST + TARJETAS» del test mixto, contra la app ya renderizada.
 *
 *   node scripts/verificar-tarjetas-mixto.js
 *
 * Opciones:
 *   --base <url>     De donde leer la app (por defecto, dist/ servida aqui).
 *   --sabotajes      Autocomprobacion: rompe cada cosa a proposito y exige que
 *                    salte SU control y solo el suyo.
 *   --sabotaje <n>   Un sabotaje suelto.
 *   --chrome <ruta>  Ejecutable de Chrome.
 *
 * Como en la bateria del mixto, el sorteo es al azar y cada control conduce su
 * propia sesion en una pagina limpia. La app no dice de que tema es nada hasta
 * corregirlo o girarlo, y aqui tampoco se le pregunta: cada pregunta se
 * identifica por su texto y cada tarjeta por su anverso (y su reverso, si hay
 * dos anversos iguales) contra repaso/tema-NN.json.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

import { RAIZ, argumento, bandera, buscarChrome, decidirBase, temasConRepaso } from './comun.js'

const PUERTO = 4194

/** Temas de las sesiones «Test + tarjetas» */
const TEMAS_MIXTA = [3, 17, 33]
/** Temas de las sesiones con filtro de nucleo */
const TEMAS_NUCLEO = [17, 33]
/** Los de la pregunta repetida en dos temas (t26-q19 y t27-q22), nucleo en los dos */
const TEMAS_DUPLICADA = [26, 27]
/** Temas cuyo contador se cuadra: con la repetida y con uno sin supuestos */
const TEMAS_CONTADOR = [3, 17, 26, 27, 33]
/** Tema del repaso espaciado: todas sus tarjetas parten de un estado sembrado */
const TEMA_SM2 = 17
/** Tema no elegido del que sale la tarjeta intrusa del sabotaje 3 */
const AJENO = 1
const CUANTAS = 20
const CLAVE_PROGRESO = 'oposicion-zgz:progreso:v1'
/** Valoraciones de las tarjetas de una sesion, por turno */
const CICLO = ['Fallo', 'Bien', 'Fácil']
const RESULTADO = { Fallo: 'fallo', Bien: 'bien', Fácil: 'facil' }
/** Estado de partida de las tarjetas del control del repaso espaciado */
const SEMBRADO = {
  reps: 2,
  aciertos: 2,
  fallos: 0,
  facilidad: 2.5,
  intervalo: 3,
  proximaRevision: '2026-01-01',
  ultimaRevision: '2025-12-29',
}
const LEJOS = '2099-12-31'

const pad = (n) => String(n).padStart(2, '0')
const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
const lista = (ns) => ns.join(', ').replace(/, ([^,]+)$/, ' y $1')

/** Sin mayusculas, tildes, puntuacion ni marcas de Markdown (un enlace deja su texto). */
const normaliza = (s) =>
  s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*(\d+\.|[-*+])\s+/gm, '')
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
  for (const t of temasConRepaso()) {
    const d = JSON.parse(readFileSync(join(RAIZ, `repaso/tema-${pad(t)}.json`), 'utf8'))
    for (const q of d.test ?? []) preguntas.push({ ...q, tema: t, clase: 'test' })
    for (const s of d.supuestos ?? []) {
      for (const q of s.preguntas) preguntas.push({ ...q, tema: t, clase: 'supuesto' })
    }
    for (const f of d.flashcards ?? []) tarjetas.push({ ...f, tema: t })
  }
  const porTexto = new Map()
  for (const q of preguntas) {
    const k = `${q.clase}|${normaliza(q.pregunta)}`
    porTexto.set(k, [...(porTexto.get(k) ?? []), q])
  }
  const porAnverso = new Map()
  for (const f of tarjetas) {
    const k = normaliza(f.anverso)
    porAnverso.set(k, [...(porAnverso.get(k) ?? []), f])
  }
  return { preguntas, tarjetas, porTexto, porAnverso }
}

/** Lo que la app deberia ofrecer: las mismas reglas que lib/mixto.ts, sobre el dato. */
function esperado(dato, temas, tipo, filtro) {
  const pasa = (x) => filtro === 'todas' || (filtro === 'solo') === !!x.nucleo
  const elegidos = new Set(temas)
  const vistas = new Set()
  let preguntas = 0
  let tarjetas = 0
  for (const t of temasConRepaso()) {
    if (!elegidos.has(t)) continue
    const clase = tipo === 'supuestos' ? 'supuesto' : 'test'
    if (tipo !== 'supuestos' || t >= 9) {
      for (const q of dato.preguntas) {
        if (q.tema !== t || q.clase !== clase || !pasa(q)) continue
        const h = huella(q.pregunta, q.opciones)
        if (vistas.has(h)) continue
        vistas.add(h)
        preguntas++
      }
    }
    if (tipo === 'mixta') tarjetas += dato.tarjetas.filter((f) => f.tema === t && pasa(f)).length
  }
  return { preguntas, tarjetas, total: preguntas + tarjetas }
}

function candidatas(dato, leida) {
  const mismas = dato.porTexto.get(`test|${normaliza(leida.pregunta)}`) ?? []
  const ops = leida.opciones.map(normaliza).sort().join('|')
  return mismas.filter((q) => q.opciones.map(normaliza).sort().join('|') === ops)
}

/** La pregunta del dato, desempatando por el tema que dice la correccion. */
function identificarPregunta(dato, leida) {
  const cs = candidatas(dato, leida)
  return cs.find((q) => q.tema === leida.rotulo) ?? cs[0] ?? null
}

/**
 * La tarjeta del dato: por su anverso; si hay varias con el mismo (las de
 * pictogramas del tema 20), por el reverso que se vio al girarla.
 */
function identificarTarjeta(dato, leida) {
  const cs = dato.porAnverso.get(normaliza(leida.anverso)) ?? []
  if (cs.length <= 1) return cs[0] ?? null
  const visto = normaliza(leida.reverso ?? '')
  const palabras = (s) => new Set(normaliza(s).split(' '))
  const vistas = palabras(visto)
  const puntos = (f) => (normaliza(f.reverso) === visto ? 1e6 : [...palabras(f.reverso)].filter((p) => vistas.has(p)).length)
  return [...cs].sort((a, b) => puntos(b) - puntos(a))[0]
}

const identificar = (dato, l) => (l.clase === 'tarjeta' ? identificarTarjeta(dato, l) : identificarPregunta(dato, l))
/** Una clave por elemento: el id de la tarjeta o la huella de la pregunta */
const claveDe = (dato, l) => {
  if (l.clase === 'tarjeta') return `t|${identificarTarjeta(dato, l)?.id ?? normaliza(l.anverso)}`
  return `p|${huella(l.pregunta, l.opciones)}`
}

/* ------------------------------------------------------------------ */
/* Conducir la app                                                      */
/* ------------------------------------------------------------------ */

/** Una pagina nueva con el almacen vacio, o con el progreso que se le de. */
async function abrir(nav, base, hash = '#/mixto', progreso = null) {
  const pag = await nav.newPage()
  // Ancho de movil: es donde mas se va a usar
  await pag.setViewport({ width: 390, height: 900 })
  pag.errores = []
  pag.on('pageerror', (e) => pag.errores.push(e.message))
  await pag.goto(new URL(hash, base).href, { waitUntil: 'networkidle0' })
  await pag.evaluate(
    (clave, p) => {
      localStorage.clear()
      if (p) localStorage.setItem(clave, JSON.stringify(p))
    },
    CLAVE_PROGRESO,
    progreso,
  )
  await pag.reload({ waitUntil: 'networkidle0' })
  return pag
}

const ROTULO_TIPO = { test: '^Test · 3', supuestos: '^Supuestos · 4', mixta: '^Test \\+ tarjetas' }

/** Elige tipo, temas, filtro de nucleo y numero en la seleccion del mixto. */
async function configurar(pag, { tipo = 'mixta', temas, nucleo = 'todas', cuantas = CUANTAS }) {
  await pag.waitForSelector('input[data-tema]', { timeout: 15000 })
  await pag.evaluate(
    async ({ rotulo, temas, nucleo, cuantas }) => {
      const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
      const boton = (re) => [...document.querySelectorAll('button')].find((b) => re.test(b.textContent.trim()))
      boton(new RegExp(rotulo)).click()
      await dormir(60)
      boton(/^Ninguno$/).click()
      await dormir(60)
      for (const n of temas) {
        const casilla = document.querySelector(`input[data-tema="${n}"]`)
        if (!casilla.disabled) casilla.click()
        await dormir(30)
      }
      const filtro = document.querySelector(`button[data-nucleo="${nucleo}"]`)
      if (!filtro.disabled) filtro.click()
      await dormir(60)
      document.querySelector(`button[data-cuantas="${cuantas}"]`).click()
      await dormir(60)
    },
    { rotulo: ROTULO_TIPO[tipo], temas, nucleo, cuantas },
  )
}

async function empezar(pag) {
  const ok = await pag.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((b) => /^Empezar/.test(b.textContent.trim()))
    if (!b || b.disabled) return false
    b.click()
    return true
  })
  if (!ok) throw new Error('el botón «Empezar» no está o está desactivado')
  await pag.waitForSelector('.opciones button.opcion, .tarjeta.flash', { timeout: 10000 })
}

/** Lo que se ve antes de contestar la pregunta o girar la tarjeta. */
const leerAntes = () => {
  const main = document.querySelector('main')
  // Fuera lo que es contenido: un enunciado puede citar un tema sin que eso
  // sea la app delatandolo.
  const resto = main.cloneNode(true)
  resto.querySelectorAll('.mixto-pregunta, .opciones, .supuesto-enunciado, .flash-a').forEach((e) => e.remove())
  const tarjeta = !!document.querySelector('.tarjeta.flash')
  return {
    clase: tarjeta ? 'tarjeta' : 'pregunta',
    pregunta: document.querySelector('.mixto-pregunta')?.innerText ?? '',
    opciones: [...document.querySelectorAll('.opciones button.opcion span')].map((s) => s.innerText),
    anverso: document.querySelector('.flash-a')?.innerText ?? '',
    resto: resto.textContent,
    rotuloAntes: !!document.querySelector('.mixto-tema'),
    reversoAntes: !!document.querySelector('.flash-b'),
    total: Number(/de (\d+)/.exec(document.querySelector('.mixto-cabeza .contador')?.textContent ?? '')?.[1]),
  }
}

const leerDespues = () => ({
  veredicto: document.querySelector('.explica b')?.textContent?.trim() ?? null,
  reverso: document.querySelector('.flash-b > .md')?.innerText ?? null,
  rotulo: Number(/Tema (\d+)\./.exec(document.querySelector('.mixto-tema')?.textContent ?? '')?.[1]) || null,
})

/**
 * Recorre la sesion entera: las preguntas se contestan con la a); las tarjetas
 * se giran y se valoran segun `valorar(n)` (n = cuantas tarjetas van), por
 * defecto en CICLO. `perturbar(k, pag, leidas, clase)` toca la pagina antes de
 * leer el elemento k; `antesDeValorar(n, pag, boton)`, la tarjeta ya girada.
 */
async function recorrer(pag, { perturbar, valorar = (n) => CICLO[n % 3], antesDeValorar } = {}) {
  const leidas = []
  let n = 0
  for (let k = 0; k < 500; k++) {
    const clase = await pag.evaluate(() =>
      document.querySelector('.tarjeta.flash') ? 'tarjeta' : document.querySelector('.opciones button.opcion') ? 'pregunta' : null,
    )
    if (!clase) break
    if (perturbar) await perturbar(k, pag, leidas, clase)
    const antes = await pag.evaluate(leerAntes)
    if (clase === 'pregunta') {
      await pag.evaluate(() => document.querySelector('.opciones button.opcion').click())
      await dormir(40)
      leidas.push({ ...antes, ...(await pag.evaluate(leerDespues)) })
      await pag.evaluate(() => [...document.querySelectorAll('.botones button')].find((b) => /^(Siguiente|Ver resultado)$/.test(b.textContent.trim()))?.click())
    } else {
      await pag.evaluate(() => document.querySelector('.tarjeta.flash').click())
      await dormir(40)
      const despues = await pag.evaluate(leerDespues)
      const boton = valorar(n)
      if (antesDeValorar) await antesDeValorar(n, pag, boton)
      const pulsado = await pag.evaluate(
        (b) => {
          const x = [...document.querySelectorAll('.botones button')].find((x) => x.textContent.trim() === b)
          x?.click()
          return !!x
        },
        boton,
      )
      if (!pulsado) throw new Error(`la tarjeta ${n + 1} no tiene botón «${boton}» al girarla`)
      leidas.push({ ...antes, ...despues, boton })
      n++
    }
    await dormir(50)
  }
  return leidas
}

const leerProgreso = (pag) => pag.evaluate((clave) => JSON.parse(localStorage.getItem(clave) ?? 'null'), CLAVE_PROGRESO)

/** Cambia la pregunta que se ve por otra: su enunciado y sus opciones. */
const suplantarPregunta = (pag, q) =>
  pag.evaluate(
    ({ pregunta, opciones }) => {
      document.querySelector('.mixto-pregunta').replaceChildren(Object.assign(document.createElement('p'), { textContent: pregunta }))
      document.querySelectorAll('.opciones button.opcion span').forEach((s, i) => (s.textContent = opciones[i]))
    },
    { pregunta: q.pregunta, opciones: q.opciones },
  )

/** Cambia el anverso de la tarjeta que se ve por otro. */
const suplantarAnverso = (pag, anverso) =>
  pag.evaluate((a) => {
    document.querySelector('.flash-a').replaceChildren(Object.assign(document.createElement('p'), { textContent: a }))
  }, anverso)

/** Una sesion «Test + tarjetas» contestada entera, en una pagina limpia (o con progreso). */
async function sesionMixta(nav, base, { temas = TEMAS_MIXTA, nucleo = 'todas', cuantas = CUANTAS, progreso = null, ...opciones } = {}) {
  const pag = await abrir(nav, base, '#/mixto', progreso)
  await configurar(pag, { tipo: 'mixta', temas, nucleo, cuantas })
  await empezar(pag)
  const leidas = await recorrer(pag, opciones)
  return { pag, leidas }
}

/** Un progreso con esta lista de falladas y nada mas */
const conFalladas = (preguntas, tarjetas) => {
  const entrada = { racha: 0, fallos: 1, desde: '2026-10-01' }
  return {
    version: 1,
    tarjetas: {},
    preguntas: {},
    racha: { actual: 0, mejor: 0, ultimoDia: null },
    historial: {},
    falladas: {
      preguntas: Object.fromEntries(preguntas.map((id) => [id, entrada])),
      tarjetas: Object.fromEntries(tarjetas.map((id) => [id, entrada])),
    },
  }
}

/**
 * La lista de falladas sembrada: de un tema con de todo, 4 preguntas de test
 * nucleo y 4 no, 4 tarjetas nucleo y 4 no, y 2 preguntas de supuesto.
 */
function semillaFalladas(dato) {
  for (const t of temasConRepaso().filter((n) => n >= 9)) {
    const test = dato.preguntas.filter((q) => q.tema === t && q.clase === 'test' && !['t26-q19', 't27-q22'].includes(q.id))
    const tarj = dato.tarjetas.filter((f) => f.tema === t)
    const sup = dato.preguntas.filter((q) => q.tema === t && q.clase === 'supuesto')
    const tn = test.filter((q) => q.nucleo)
    const tf = test.filter((q) => !q.nucleo)
    const fn = tarj.filter((f) => f.nucleo)
    const ff = tarj.filter((f) => !f.nucleo)
    if (tn.length < 4 || tf.length < 4 || fn.length < 4 || ff.length < 4 || sup.length < 2) continue
    const preguntas = [...tn.slice(0, 4), ...tf.slice(0, 4), ...sup.slice(0, 2)]
    const tarjetas = [...fn.slice(0, 4), ...ff.slice(0, 4)]
    return { tema: t, preguntas, tarjetas, progreso: conFalladas(preguntas.map((q) => q.id), tarjetas.map((f) => f.id)) }
  }
  throw new Error('ningún tema tiene de todo para sembrar la lista de falladas')
}

/** Lo que dice la seleccion: cuentas del selector, el marcado y la linea de disponibles. */
const leerContador = () => {
  const botones = Object.fromEntries(
    [...document.querySelectorAll('button[data-nucleo]')].map((b) => [
      b.dataset.nucleo,
      { n: Number(/\((\d+)\)/.exec(b.textContent)?.[1]), desactivado: b.disabled, marcado: b.getAttribute('aria-pressed') === 'true' },
    ]),
  )
  const linea = document.querySelector('.mixto-disponibles')?.textContent ?? ''
  const nums = (linea.match(/\d+/g) ?? []).map(Number)
  return {
    botones,
    linea,
    nums,
    todas: Number(/\((\d+)\)/.exec(document.querySelector('button[data-cuantas="0"]')?.textContent ?? '')?.[1]),
    casilla: !!document.querySelector('.mixto-panel input[type="checkbox"]:not([data-tema])'),
  }
}

/* ------------------------------------------------------------------ */
/* Los controles                                                        */
/* ------------------------------------------------------------------ */

const NOMBRES = [
  'Núcleo · «Sin núcleo» no trae nada núcleo y «Solo núcleo» solo núcleo',
  'Contador · lo disponible cuadra con cada filtro',
  'Test + tarjetas · salen los dos tipos, y solo de los temas elegidos',
  'Sin duplicados · ni preguntas ni tarjetas repetidas en la sesión',
  'Repaso espaciado · valorar en la sesión mixta deja la tarjeta igual que el repaso normal',
  'Fallo · las tarjetas no sabidas entran en la lista de falladas',
  'Tema oculto · no se ve antes de contestar ni de girar',
  'Resultado · test y tarjetas por separado, y «repetir solo las falladas» trae las no sabidas',
]

const SABOTAJES = {
  1: 'una pregunta núcleo se cuela en una sesión «Sin núcleo»',
  2: 'el contador de disponibles cuenta una de más',
  3: 'una tarjeta de un tema no elegido se cuela en la sesión',
  4: 'una tarjeta sale dos veces en la misma sesión',
  5: 'los botones «Bien» y «Fácil» de una tarjeta están cambiados',
  6: 'una tarjeta no sabida no llega a la lista de falladas',
  7: 'el tema asoma antes de girar una tarjeta',
  8: 'una tarjeta sabida (o una pregunta acertada) se cuela al repetir las falladas',
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
  const tarjetasDe = (ls) => ls.filter((l) => l.clase === 'tarjeta')
  const preguntasDe = (ls) => ls.filter((l) => l.clase === 'pregunta')

  /* 1. El filtro de nucleo, en el mixto y en las falladas */
  await control(NOMBRES[0], async () => {
    let colada = false
    const cuela = async (k, pag, leidas, clase) => {
      if (colada || clase !== 'pregunta') return
      const intrusa = dato.preguntas.find((q) => q.clase === 'test' && q.nucleo && TEMAS_NUCLEO.includes(q.tema))
      await suplantarPregunta(pag, intrusa)
      colada = true
    }
    const partes = []
    for (const nucleo of ['sin', 'solo']) {
      const { pag, leidas } = await sesionMixta(nav, base, {
        temas: TEMAS_NUCLEO,
        nucleo,
        cuantas: 30,
        perturbar: sab === 1 && nucleo === 'sin' ? cuela : null,
      })
      sinErrores(pag, `mixto «${nucleo}»`)
      await pag.close()
      if (!tarjetasDe(leidas).length || !preguntasDe(leidas).length) {
        throw new Error(`mixto «${nucleo}»: salen ${preguntasDe(leidas).length} preguntas y ${tarjetasDe(leidas).length} tarjetas; el control necesita las dos`)
      }
      for (const [k, l] of leidas.entries()) {
        const x = identificar(dato, l)
        if (!x) throw new Error(`mixto «${nucleo}»: el elemento ${k + 1} no está en el dato`)
        if (nucleo === 'sin' && x.nucleo) throw new Error(`mixto «Sin núcleo»: sale ${x.id}, que es núcleo`)
        if (nucleo === 'solo' && !x.nucleo) throw new Error(`mixto «Solo núcleo»: sale ${x.id}, que no es núcleo`)
      }
      partes.push(`mixto «${nucleo}»: ${preguntasDe(leidas).length} preguntas y ${tarjetasDe(leidas).length} tarjetas`)
    }

    // Test de falladas: lista sembrada con nucleo y sin nucleo
    const semilla = semillaFalladas(dato)
    for (const [tipo, nucleo] of [['test', 'solo'], ['test', 'sin'], ['tarjetas', 'solo'], ['tarjetas', 'sin']]) {
      const pag = await abrir(nav, base, '#/falladas', semilla.progreso)
      await pag.waitForSelector('.mixto-panel')
      await pag.evaluate(
        async ({ tipo, nucleo }) => {
          const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
          document.querySelector(`button[data-tipo="${tipo}"]`).click()
          await dormir(60)
          document.querySelector(`button[data-nucleo="${nucleo}"]`).click()
          await dormir(60)
          document.querySelector('button[data-cuantas="0"]').click()
          await dormir(60)
        },
        { tipo, nucleo },
      )
      await empezar(pag)
      const leidas = await recorrer(pag, { valorar: () => 'Bien' })
      sinErrores(pag, `falladas ${tipo} «${nucleo}»`)
      await pag.close()
      const debe = (tipo === 'test' ? semilla.preguntas.filter((q) => q.clase === 'test') : semilla.tarjetas).filter((x) =>
        nucleo === 'solo' ? x.nucleo : !x.nucleo,
      )
      const vistos = leidas.map((l) => identificar(dato, l)?.id)
      const fuera = vistos.filter((id) => !debe.some((x) => x.id === id))
      if (fuera.length || vistos.length !== debe.length) {
        throw new Error(`falladas ${tipo} «${nucleo}»: salen ${vistos.length} (${fuera.length} que no tocan: ${fuera.slice(0, 3).join(', ')}) y deben ser ${debe.length}`)
      }
    }
    partes.push(`falladas (tema ${semilla.tema}): test y tarjetas con «Solo núcleo» y «Sin núcleo», 4 de cada y las que tocan`)
    return partes.join('; ')
  })

  /* 2. El contador, con cada tipo y cada filtro */
  await control(NOMBRES[1], async () => {
    const pag = await abrir(nav, base, '#/mixto')
    const hechas = []
    for (const tipo of ['test', 'mixta', 'supuestos']) {
      for (const nucleo of ['todas', 'solo', 'sin']) {
        await configurar(pag, { tipo, temas: TEMAS_CONTADOR, nucleo, cuantas: CUANTAS })
        if (sab === 2 && tipo === 'test' && nucleo === 'sin') {
          await pag.evaluate(() => {
            const p = document.querySelector('.mixto-disponibles')
            p.textContent = p.textContent.replace(/\d+/, (n) => String(Number(n) + 1))
          })
        }
        const c = await pag.evaluate(leerContador)
        const donde = `${tipo} «${nucleo}»`
        if (c.casilla) throw new Error('sigue la casilla «Solo núcleo»')
        const filtro = tipo === 'supuestos' ? 'todas' : nucleo
        const cuentas = Object.fromEntries(['todas', 'solo', 'sin'].map((f) => [f, esperado(dato, TEMAS_CONTADOR, tipo, f)]))
        for (const f of ['todas', 'solo', 'sin']) {
          if (c.botones[f]?.n !== cuentas[f].total) throw new Error(`${donde}: el botón «${f}» dice ${c.botones[f]?.n} y hay ${cuentas[f].total}`)
          if (c.botones[f].desactivado !== (tipo === 'supuestos')) throw new Error(`${donde}: el botón «${f}» ${c.botones[f].desactivado ? 'está' : 'no está'} desactivado`)
          if (c.botones[f].marcado !== (f === filtro)) throw new Error(`${donde}: el marcado no es «${filtro}»`)
        }
        const debe = cuentas[filtro]
        if (c.nums[0] !== debe.total) throw new Error(`${donde}: «${c.linea.trim()}» y hay ${debe.total}`)
        if (tipo === 'mixta' && (c.nums[1] !== debe.preguntas || c.nums[2] !== debe.tarjetas)) {
          throw new Error(`${donde}: «${c.linea.trim()}» y son ${debe.preguntas} preguntas y ${debe.tarjetas} tarjetas`)
        }
        if (c.todas !== debe.total) throw new Error(`${donde}: el botón «Todas» del número dice ${c.todas} y hay ${debe.total}`)
        if (tipo !== 'supuestos') hechas.push(`${donde} ${debe.total}`)
        else if (nucleo === 'todas') hechas.push(`supuestos ${debe.total} (Solo núcleo 0, selector desactivado)`)
      }
    }
    sinErrores(pag, 'contador del mixto')
    await pag.close()

    // Y en el test de falladas, sobre una lista sembrada
    const semilla = semillaFalladas(dato)
    const pagF = await abrir(nav, base, '#/falladas', semilla.progreso)
    await pagF.waitForSelector('.mixto-panel')
    const de = (clase, f) =>
      (clase === 'tarjetas' ? semilla.tarjetas : semilla.preguntas.filter((q) => q.clase === clase)).filter(
        (x) => f === 'todas' || (f === 'solo') === !!x.nucleo,
      ).length
    for (const tipo of ['test', 'supuestos', 'tarjetas']) {
      for (const nucleo of ['todas', 'solo', 'sin']) {
        await pagF.evaluate(
          async ({ tipo, nucleo }) => {
            const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
            document.querySelector(`button[data-tipo="${tipo}"]`).click()
            await dormir(60)
            const b = document.querySelector(`button[data-nucleo="${nucleo}"]`)
            if (!b.disabled) b.click()
            await dormir(60)
          },
          { tipo, nucleo },
        )
        const c = await pagF.evaluate(leerContador)
        const clase = tipo === 'supuestos' ? 'supuesto' : tipo
        const filtro = tipo === 'supuestos' ? 'todas' : nucleo
        const donde = `falladas ${tipo} «${nucleo}»`
        for (const f of ['todas', 'solo', 'sin']) {
          if (c.botones[f]?.n !== de(clase, f)) throw new Error(`${donde}: el botón «${f}» dice ${c.botones[f]?.n} y hay ${de(clase, f)}`)
          if (c.botones[f].desactivado !== (tipo === 'supuestos')) throw new Error(`${donde}: el botón «${f}» ${c.botones[f].desactivado ? 'está' : 'no está'} desactivado`)
          if (c.botones[f].marcado !== (f === filtro)) throw new Error(`${donde}: el marcado no es «${filtro}»`)
        }
        if (c.nums[0] !== de(clase, filtro)) throw new Error(`${donde}: «${c.linea.trim()}» y hay ${de(clase, filtro)}`)
        if (c.todas !== de(clase, filtro)) throw new Error(`${donde}: el botón «Todas» del número dice ${c.todas}`)
      }
    }
    sinErrores(pagF, 'contador de falladas')
    await pagF.close()
    return `mixto, temas ${lista(TEMAS_CONTADOR)}: ${hechas.join(' · ')}; y las falladas sembradas, en sus 9 combinaciones`
  })

  /* 3. Los dos tipos, y solo de los temas elegidos */
  await control(NOMBRES[2], async () => {
    let colada = false
    const cuela = async (k, pag, leidas, clase) => {
      if (colada || clase !== 'tarjeta') return
      await suplantarAnverso(pag, dato.tarjetas.find((f) => f.tema === AJENO).anverso)
      colada = true
    }
    const { pag, leidas } = await sesionMixta(nav, base, { perturbar: sab === 3 ? cuela : null })
    sinErrores(pag, 'sesión mixta')
    await pag.close()
    const tarjetas = tarjetasDe(leidas)
    const preguntas = preguntasDe(leidas)
    if (!tarjetas.length || !preguntas.length) throw new Error(`salen ${preguntas.length} preguntas y ${tarjetas.length} tarjetas: falta un tipo`)
    if (leidas.length !== CUANTAS || leidas[0].total !== CUANTAS) throw new Error(`salen ${leidas.length} (el contador dice ${leidas[0].total}) y se pidieron ${CUANTAS}`)
    for (const [k, l] of leidas.entries()) {
      const x = identificar(dato, l)
      if (!x) throw new Error(`el elemento ${k + 1} (${l.clase}) no está en el dato`)
      if (!TEMAS_MIXTA.includes(x.tema)) throw new Error(`sale ${x.id}, del tema ${x.tema}, que no se eligió`)
      if (l.rotulo !== x.tema) throw new Error(`${x.id} dice «Tema ${l.rotulo}» al corregir`)
      if (l.clase === 'pregunta' && l.opciones.length !== 3) throw new Error(`${x.id} sale con ${l.opciones.length} opciones`)
    }
    return `${preguntas.length} preguntas de test y ${tarjetas.length} tarjetas, todas de los temas ${lista(TEMAS_MIXTA)}`
  })

  /* 4. Ningun elemento repetido */
  await control(NOMBRES[3], async () => {
    let n = 0
    let primera = null
    const repite = async (k, pag, leidas, clase) => {
      if (clase !== 'tarjeta') return
      if (n === 0) primera = await pag.evaluate(() => document.querySelector('.flash-a').innerText)
      if (n === 3) await suplantarAnverso(pag, primera)
      n++
    }
    const comprobar = (donde, leidas, debe) => {
      const vistas = new Map()
      for (const [k, l] of leidas.entries()) {
        const c = claveDe(dato, l)
        if (vistas.has(c)) throw new Error(`${donde}: el elemento ${k + 1} repite el ${vistas.get(c) + 1}`)
        vistas.set(c, k)
      }
      if (leidas.length !== debe || leidas[0]?.total !== debe) throw new Error(`${donde}: salen ${leidas.length} (el contador dice ${leidas[0]?.total}) y deben ser ${debe}`)
    }
    const a = await sesionMixta(nav, base, { perturbar: sab === 4 ? repite : null })
    await a.pag.close()
    comprobar(`temas ${lista(TEMAS_MIXTA)}`, a.leidas, CUANTAS)
    const b = await sesionMixta(nav, base, { temas: TEMAS_DUPLICADA, nucleo: 'solo', cuantas: 0 })
    sinErrores(b.pag, 'sesión con todas')
    await b.pag.close()
    const debe = esperado(dato, TEMAS_DUPLICADA, 'mixta', 'solo')
    comprobar(`temas ${lista(TEMAS_DUPLICADA)} núcleo, todas`, b.leidas, debe.total)
    return `${CUANTAS} distintos de ${CUANTAS}; y los ${debe.total} núcleo de los temas ${lista(TEMAS_DUPLICADA)} (${debe.preguntas} preguntas, ${debe.tarjetas} tarjetas), la pregunta que está en los dos una sola vez`
  })

  /* 5. El repaso espaciado: igual que valorar la misma tarjeta en el repaso del tema */
  await control(NOMBRES[4], async () => {
    const delTema = dato.tarjetas.filter((f) => f.tema === TEMA_SM2)
    const progreso = conFalladas([], [])
    for (const f of delTema) progreso.tarjetas[f.id] = { ...SEMBRADO }
    let cambiada = false
    const cruza = async (n, pag, boton) => {
      if (cambiada || boton !== 'Bien') return
      await pag.evaluate(() => {
        const bs = [...document.querySelectorAll('.botones button')]
        const bien = bs.find((b) => b.textContent.trim() === 'Bien')
        const facil = bs.find((b) => b.textContent.trim() === 'Fácil')
        ;[bien.textContent, facil.textContent] = [facil.textContent, bien.textContent]
      })
      cambiada = true
    }
    const { pag, leidas } = await sesionMixta(nav, base, {
      temas: [TEMA_SM2],
      progreso,
      antesDeValorar: sab === 5 ? cruza : null,
    })
    const tras = await leerProgreso(pag)
    sinErrores(pag, 'sesión mixta')
    await pag.close()
    const valoradas = tarjetasDe(leidas).map((l) => ({ ...l, id: identificarTarjeta(dato, l)?.id }))
    if (valoradas.some((v) => !v.id)) throw new Error('una tarjeta de la sesión no está en el dato')
    // Las no valoradas siguen como se sembraron
    const ids = new Set(valoradas.map((v) => v.id))
    for (const f of delTema) {
      if (!ids.has(f.id) && JSON.stringify(tras.tarjetas[f.id]) !== JSON.stringify(SEMBRADO)) throw new Error(`${f.id} no se valoró y su repaso cambió`)
    }
    const muestra = CICLO.map((b) => valoradas.find((v) => v.boton === b)).filter(Boolean)
    if (muestra.length < 3) throw new Error(`solo salen ${valoradas.length} tarjetas: hacen falta las tres valoraciones`)
    const hechas = []
    for (const v of muestra) {
      // El repaso del tema con solo esa tarjeta pendiente hoy y el mismo punto de partida
      const solo = conFalladas([], [])
      for (const f of delTema) solo.tarjetas[f.id] = { ...SEMBRADO, proximaRevision: f.id === v.id ? SEMBRADO.proximaRevision : LEJOS }
      const normal = await abrir(nav, base, `#/tema/${TEMA_SM2}?vista=tarjetas`, solo)
      await normal.waitForSelector('.tarjeta.flash', { timeout: 15000 })
      const anverso = await normal.evaluate(() => document.querySelector('.flash-a').innerText)
      if (normaliza(anverso) !== normaliza(dato.tarjetas.find((f) => f.id === v.id).anverso)) {
        throw new Error(`el repaso del tema no empieza por ${v.id}`)
      }
      await normal.evaluate(() => document.querySelector('.tarjeta.flash').click())
      await dormir(60)
      await normal.evaluate((b) => [...document.querySelectorAll('.botones button')].find((x) => x.textContent.trim() === b).click(), v.boton)
      await dormir(100)
      const ref = (await leerProgreso(normal)).tarjetas[v.id]
      await normal.close()
      const mixto = tras.tarjetas[v.id]
      if (JSON.stringify(mixto) === JSON.stringify(SEMBRADO)) throw new Error(`${v.id} («${v.boton}») no cambió su repaso`)
      for (const campo of Object.keys(SEMBRADO)) {
        if (mixto?.[campo] !== ref?.[campo]) {
          throw new Error(`${v.id} con «${v.boton}»: en la sesión mixta ${campo} = ${mixto?.[campo]}, en el repaso del tema ${ref?.[campo]}`)
        }
      }
      hechas.push(`${v.boton} → intervalo ${ref.intervalo}, facilidad ${ref.facilidad.toFixed(2)}`)
    }
    return `${valoradas.length} tarjetas valoradas; ${hechas.join(' · ')}: igual campo a campo que en el repaso del tema, y las no valoradas, intactas`
  })

  /* 6. Las no sabidas, a la lista de falladas */
  await control(NOMBRES[5], async () => {
    const { pag, leidas } = await sesionMixta(nav, base)
    if (sab === 6) {
      await pag.evaluate((clave) => {
        const p = JSON.parse(localStorage.getItem(clave))
        delete p.falladas.tarjetas[Object.keys(p.falladas.tarjetas)[0]]
        localStorage.setItem(clave, JSON.stringify(p))
      }, CLAVE_PROGRESO)
    }
    const p = await leerProgreso(pag)
    const valoradas = tarjetasDe(leidas).map((l) => ({ ...l, id: identificarTarjeta(dato, l)?.id }))
    const fallo = valoradas.filter((v) => v.boton === 'Fallo').map((v) => v.id)
    if (!fallo.length) throw new Error('ninguna tarjeta marcada «Fallo»: el control no mide nada')
    const enLista = Object.keys(p?.falladas?.tarjetas ?? {})
    for (const id of fallo) {
      const e = p.falladas.tarjetas[id]
      if (!e) throw new Error(`${id}, marcada «Fallo», no está en la lista de falladas`)
      if (e.racha !== 0 || e.fallos !== 1) throw new Error(`${id}: la lista dice ${JSON.stringify(e)}`)
    }
    const sobran = enLista.filter((id) => !fallo.includes(id))
    if (sobran.length) throw new Error(`en la lista hay ${sobran.length} tarjetas que no se marcaron «Fallo»: ${sobran.join(', ')}`)
    // Y la pagina de falladas las cuenta
    await pag.goto(new URL('#/falladas', base).href, { waitUntil: 'networkidle0' })
    await pag.reload({ waitUntil: 'networkidle0' })
    await pag.waitForSelector('.mixto-panel', { timeout: 15000 })
    const boton = await pag.evaluate(() => Number(/\((\d+)\)/.exec(document.querySelector('button[data-tipo="tarjetas"]')?.textContent ?? '')?.[1]))
    sinErrores(pag, 'falladas')
    await pag.close()
    if (boton !== fallo.length) throw new Error(`el test de falladas dice ${boton} tarjetas y se marcaron ${fallo.length} «Fallo»`)
    return `${fallo.length} de ${valoradas.length} tarjetas marcadas «Fallo», las ${fallo.length} en la lista (y en el test de falladas); ninguna sabida`
  })

  /* 7. El tema, oculto hasta contestar o girar */
  await control(NOMBRES[6], async () => {
    const pag = await abrir(nav, base, '#/mixto')
    await pag.waitForSelector('input[data-tema]')
    const titulos = await pag.evaluate(() =>
      [...document.querySelectorAll('label[title]')].map((l) => l.getAttribute('title').replace(/^\d+\.\s*/, '')),
    )
    await configurar(pag, { tipo: 'mixta', temas: TEMAS_MIXTA })
    await empezar(pag)
    let hecho = false
    const asoma = async (k, pag, leidas, clase) => {
      if (hecho || clase !== 'tarjeta') return
      await pag.evaluate(() => document.querySelector('.mixto-cabeza .contador').append(' · Tema 17'))
      hecho = true
    }
    const leidas = await recorrer(pag, { perturbar: sab === 7 ? asoma : null })
    sinErrores(pag, 'sesión mixta')
    await pag.close()
    const trozos = titulos.map((t) => normaliza(t).slice(0, 40)).filter((t) => t.length >= 20)
    for (const [k, l] of leidas.entries()) {
      const que = `${l.clase} ${k + 1}`
      if (l.rotuloAntes) throw new Error(`${que}: la línea del tema está puesta antes de ${l.clase === 'tarjeta' ? 'girarla' : 'contestar'}`)
      if (l.reversoAntes) throw new Error(`${que}: el reverso se ve sin girarla`)
      const m = /\btema\s*\d+/i.exec(l.resto)
      if (m) throw new Error(`${que}: antes de ${l.clase === 'tarjeta' ? 'girarla' : 'contestar'} se lee «${m[0]}»`)
      const titulo = trozos.find((t) => normaliza(l.resto).includes(t))
      if (titulo) throw new Error(`${que}: antes se lee el título «${titulo}…»`)
      if (!l.rotulo) throw new Error(`${que}: después no aparece «Tema N.»`)
    }
    return `${preguntasDe(leidas).length} preguntas y ${tarjetasDe(leidas).length} tarjetas sin tema, título ni reverso a la vista antes de contestar o girar, y con «Tema N.» después`
  })

  /* 8. El resultado por separado, y repetir las falladas con las no sabidas */
  await control(NOMBRES[7], async () => {
    const { pag, leidas } = await sesionMixta(nav, base)
    const r = await pag.evaluate(() => {
      const num = (el, a) => Number(el?.getAttribute(a))
      const parte = (p) => document.querySelector(`[data-parte="${p}"] .mixto-nota`)
      const celdas = (tr) =>
        Object.fromEntries(
          [...tr.querySelectorAll('td[data-clase]')].map((td) => [td.dataset.clase, { bien: num(td, 'data-bien'), total: num(td, 'data-total') }]),
        )
      return {
        test: { bien: num(parte('test'), 'data-bien'), total: num(parte('test'), 'data-total') },
        tarjetas: { bien: num(parte('tarjetas'), 'data-bien'), total: num(parte('tarjetas'), 'data-total') },
        noSabidas: num(document.querySelector('[data-no-sabidas]'), 'data-no-sabidas'),
        filas: [...document.querySelectorAll('.mixto-desglose tbody tr')].map((tr) => ({ tema: Number(tr.dataset.tema), ...celdas(tr) })),
        pie: celdas(document.querySelector('.mixto-desglose tfoot tr')),
        lista: document.querySelectorAll('.mixto-falladas > li').length,
        listaTarjetas: document.querySelectorAll('.mixto-falladas > li[data-tarjeta]').length,
        repetir: [...document.querySelectorAll('button')].find((b) => /^Repetir solo las falladas/.test(b.textContent))?.textContent ?? '',
      }
    })
    const ps = preguntasDe(leidas)
    const ts = tarjetasDe(leidas)
    const bien = ps.filter((l) => l.veredicto === 'Correcto.')
    const malas = ps.filter((l) => l.veredicto !== 'Correcto.')
    const sabidas = ts.filter((l) => l.boton !== 'Fallo')
    const noSabidas = ts.filter((l) => l.boton === 'Fallo')
    const cuadra = [
      ['aciertos de test', r.test.bien, bien.length],
      ['preguntas de test', r.test.total, ps.length],
      ['tarjetas sabidas', r.tarjetas.bien, sabidas.length],
      ['tarjetas valoradas', r.tarjetas.total, ts.length],
      ['no sabidas', r.noSabidas, noSabidas.length],
      ['aciertos de test del total', r.pie.test?.bien, bien.length],
      ['tarjetas sabidas del total', r.pie.tarjetas?.bien, sabidas.length],
      ['preguntas en las filas', r.filas.reduce((n, f) => n + f.test.total, 0), ps.length],
      ['tarjetas en las filas', r.filas.reduce((n, f) => n + f.tarjetas.total, 0), ts.length],
      ['falladas y no sabidas en la lista', r.lista, malas.length + noSabidas.length],
      ['no sabidas en la lista', r.listaTarjetas, noSabidas.length],
      ['número del botón de repetir', Number(/\((\d+)\)/.exec(r.repetir)?.[1]), malas.length + noSabidas.length],
    ]
    for (const [que, dice, debe] of cuadra) if (dice !== debe) throw new Error(`${que}: el resultado dice ${dice} y son ${debe}`)
    for (const f of r.filas) {
      const deTema = (ls) => ls.filter((l) => l.rotulo === f.tema)
      const filaDebe = {
        test: [deTema(bien).length, deTema(ps).length],
        tarjetas: [deTema(sabidas).length, deTema(ts).length],
      }
      for (const c of ['test', 'tarjetas']) {
        if (f[c].bien !== filaDebe[c][0] || f[c].total !== filaDebe[c][1]) {
          throw new Error(`tema ${f.tema}, ${c}: la fila dice ${f[c].bien}/${f[c].total} y son ${filaDebe[c].join('/')}`)
        }
      }
    }
    if (!noSabidas.length || !sabidas.length) throw new Error('hacen falta tarjetas sabidas y no sabidas para medir el repetir')

    // Repetir: las falladas y las no sabidas, y nada mas
    const debe = new Set([...malas, ...noSabidas].map((l) => claveDe(dato, l)))
    await pag.evaluate(() => [...document.querySelectorAll('button')].find((b) => /^Repetir solo las falladas/.test(b.textContent)).click())
    await pag.waitForSelector('.opciones button.opcion, .tarjeta.flash', { timeout: 10000 })
    let colada = false
    const cuela = async (k, pag, ls, clase) => {
      if (colada) return
      if (clase === 'tarjeta') {
        await suplantarAnverso(pag, sabidas[0].anverso)
        colada = true
      } else if (bien.length) {
        await suplantarPregunta(pag, { pregunta: bien[0].pregunta, opciones: bien[0].opciones })
        colada = true
      }
    }
    const otra = await recorrer(pag, { perturbar: sab === 8 ? cuela : null, valorar: () => 'Bien' })
    sinErrores(pag, 'sesión mixta')
    await pag.close()
    const traidas = otra.map((l) => claveDe(dato, l))
    const sobran = traidas.filter((c) => !debe.has(c)).length
    const faltan = [...debe].filter((c) => !traidas.includes(c)).length
    if (sobran || faltan || traidas.length !== debe.size) {
      throw new Error(`al repetir salen ${traidas.length}: ${sobran} que no tocan y faltan ${faltan} de ${debe.size}`)
    }
    return `test ${bien.length}/${ps.length} y tarjetas ${sabidas.length}/${ts.length} (${noSabidas.length} no sabidas), igual por tema; al repetir salen las ${malas.length} falladas y las ${noSabidas.length} no sabidas, nada más`
  })

  return resultados
}

/* ------------------------------------------------------------------ */

function pinta(resultados) {
  console.log('\n=== Filtro de núcleo y Test + tarjetas ===')
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
