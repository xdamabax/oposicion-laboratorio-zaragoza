#!/usr/bin/env node
/**
 * Bateria del TEST MIXTO, contra la app ya renderizada.
 *
 *   node scripts/verificar-mixto.js
 *
 * Opciones:
 *   --base <url>     De donde leer la app (por defecto, dist/ servida aqui).
 *   --sabotajes      Autocomprobacion: rompe cada cosa a proposito y exige que
 *                    salte SU control y solo el suyo.
 *   --sabotaje <n>   Un sabotaje suelto.
 *   --chrome <ruta>  Ejecutable de Chrome.
 *
 * El sorteo es al azar, asi que cada pasada mide una sesion distinta: los
 * controles valen para cualquier sorteo, no para uno concreto. La app no dice
 * de que tema es una pregunta hasta corregirla, y aqui tampoco se le pregunta:
 * cada pregunta se identifica por su texto contra repaso/tema-NN.json.
 *
 * Cada control conduce su propia sesion en una pagina limpia, y cada sabotaje
 * solo estropea la sesion de su control: asi un sabotaje no puede tumbar otro
 * control de rebote.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

import { RAIZ, argumento, bandera, buscarChrome, decidirBase, temasConRepaso } from './comun.js'

const PUERTO = 4192

/** Temas de la sesion de test, y de la de supuestos (el 5 no tiene: no debe salir) */
const TEMAS_TEST = [3, 17, 33]
const TEMAS_SUP = [5, 12, 33]
/** Dos temas con la misma pregunta de examen (t26-q19 y t27-q22): sale una vez */
const TEMAS_DUPLICADA = [26, 27]
/** Tema no elegido del que sale la pregunta intrusa del sabotaje 1 */
const AJENO = 1
const CUANTAS = 20
const CLAVE_PROGRESO = 'oposicion-zgz:progreso:v1'
const CLAVE_SELECCION = 'oposicion-zgz:mixto:v1'

const pad = (n) => String(n).padStart(2, '0')
const dormir = (ms) => new Promise((r) => setTimeout(r, ms))

/** Sin mayusculas, tildes, puntuacion ni marcas de Markdown (un enlace deja su texto). */
const normaliza = (s) =>
  s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

/** Lo que hace a una pregunta la misma: enunciado y opciones, en su orden. */
const huella = (pregunta, opciones) => [pregunta, ...opciones].map(normaliza).join('|')

/* ------------------------------------------------------------------ */
/* El dato: cada pregunta de test y de supuesto de los 40 temas          */
/* ------------------------------------------------------------------ */

function cargarDato() {
  const todas = []
  for (const t of temasConRepaso()) {
    const d = JSON.parse(readFileSync(join(RAIZ, `repaso/tema-${pad(t)}.json`), 'utf8'))
    for (const q of d.test ?? []) todas.push({ ...q, tema: t, clase: 'test' })
    for (const s of d.supuestos ?? []) {
      for (const q of s.preguntas) todas.push({ ...q, tema: t, clase: 'supuesto', supuesto: s.id })
    }
  }
  // El apartado de lo anterior a la ampliacion: el mas concreto que lo cubre
  const hondura = (c) => c.split(/[./]/).length
  const apartadoDe = new Map()
  for (const t of temasConRepaso()) {
    const cob = JSON.parse(readFileSync(join(RAIZ, `repaso/cobertura/tema-${pad(t)}.json`), 'utf8'))
    for (const [clave, ids] of Object.entries(cob.apartados ?? {})) {
      for (const id of ids) {
        const previo = apartadoDe.get(id)
        if (!previo || hondura(clave) > hondura(previo)) apartadoDe.set(id, clave)
      }
    }
  }
  for (const q of todas) q.apartadoEsperado = q.apartado ?? apartadoDe.get(q.id) ?? apartadoDe.get(q.supuesto) ?? null

  const porTexto = new Map()
  for (const q of todas) {
    const k = `${q.clase}|${normaliza(q.pregunta)}`
    porTexto.set(k, [...(porTexto.get(k) ?? []), q])
  }
  return { todas, porTexto }
}

/**
 * Las preguntas del dato que pueden ser la que se ha leido: mismo enunciado y
 * mismas opciones (en cualquier orden: el orden lo mide su propio control).
 * Mas de una solo si el dato repite la pregunta (t26-q19 y t27-q22).
 */
function candidatas(dato, leida, clase) {
  const mismas = dato.porTexto.get(`${clase}|${normaliza(leida.pregunta)}`) ?? []
  const ops = leida.opciones.map(normaliza).sort().join('|')
  return mismas.filter((q) => q.opciones.map(normaliza).sort().join('|') === ops)
}

/** La pregunta del dato, desempatando por el tema que dice la correccion. */
function identificar(dato, leida, clase) {
  const cs = candidatas(dato, leida, clase)
  return cs.find((q) => q.tema === leida.rotulo) ?? cs[0] ?? null
}

/* ------------------------------------------------------------------ */
/* Conducir la app                                                      */
/* ------------------------------------------------------------------ */

async function abrir(nav, base, hash = '#/mixto') {
  const pag = await nav.newPage()
  // Ancho de movil: es donde mas se va a usar
  await pag.setViewport({ width: 390, height: 900 })
  await pag.goto(new URL(hash, base).href, { waitUntil: 'networkidle0' })
  await pag.evaluate(() => localStorage.clear())
  await pag.reload({ waitUntil: 'networkidle0' })
  await pag.waitForSelector('input[data-tema]', { timeout: 15000 })
  return pag
}

/** Elige tipo, temas y numero de preguntas en la pantalla de seleccion. */
async function configurar(pag, { tipo = 'test', temas, cuantas = CUANTAS }) {
  await pag.evaluate(
    async ({ tipo, temas, cuantas }) => {
      const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
      const boton = (re) => [...document.querySelectorAll('button')].find((b) => re.test(b.textContent.trim()))
      boton(tipo === 'test' ? /^Test · 3/ : /^Supuestos · 4/).click()
      await dormir(60)
      boton(/^Ninguno$/).click()
      await dormir(60)
      for (const n of temas) {
        const casilla = document.querySelector(`input[data-tema="${n}"]`)
        if (!casilla.disabled) casilla.click()
        await dormir(30)
      }
      document.querySelector(`button[data-cuantas="${cuantas}"]`).click()
      await dormir(60)
    },
    { tipo, temas, cuantas },
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
  await pag.waitForSelector('.opciones button.opcion', { timeout: 10000 })
}

/** Lo que se ve ANTES de contestar. */
const leerAntes = () => {
  const main = document.querySelector('main')
  // Fuera lo que es contenido de la pregunta: un enunciado puede citar un tema
  // («los equipos del tema 10», t10-q34) sin que eso sea la app delatandolo.
  const resto = main.cloneNode(true)
  resto.querySelectorAll('.mixto-pregunta, .opciones, .supuesto-enunciado').forEach((e) => e.remove())
  return {
    pregunta: document.querySelector('.mixto-pregunta')?.innerText ?? '',
    opciones: [...document.querySelectorAll('.opciones button.opcion span')].map((s) => s.innerText),
    enunciado: document.querySelector('.supuesto-enunciado')?.innerText ?? null,
    resto: resto.textContent,
    rotuloAntes: !!document.querySelector('.mixto-tema'),
    total: Number(/de (\d+)/.exec(document.querySelector('.mixto-cabeza .contador')?.textContent ?? '')?.[1]),
  }
}

/** Lo que se ve DESPUES de contestar. */
const leerDespues = () => ({
  marcada: [...document.querySelectorAll('.opciones button.opcion')].findIndex((b) => b.classList.contains('opcion-ok')),
  veredicto: document.querySelector('.explica b')?.textContent?.trim(),
  rotulo: Number(/Tema (\d+)\./.exec(document.querySelector('.mixto-tema')?.textContent ?? '')?.[1]) || null,
  enlace: document.querySelector('.mixto-enlace a')?.getAttribute('href') ?? null,
})

/**
 * Contesta todas las preguntas de la sesion pulsando siempre la a). Con
 * `perturbar(k, pag, leidas)` un sabotaje toca la pagina antes de leer la k;
 * con `trasContestar(k, pag)`, la correccion ya pintada.
 */
async function recorrer(pag, perturbar, trasContestar) {
  const leidas = []
  for (let k = 0; k < 400; k++) {
    if (!(await pag.$('.opciones button.opcion'))) break
    if (perturbar) await perturbar(k, pag, leidas)
    const antes = await pag.evaluate(leerAntes)
    await pag.evaluate(() => document.querySelector('.opciones button.opcion').click())
    await dormir(40)
    if (trasContestar) await trasContestar(k, pag)
    leidas.push({ ...antes, ...(await pag.evaluate(leerDespues)) })
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

const leerResultado = () => {
  const num = (td) => Number(td?.textContent?.trim())
  const nota = /(\d+)\s*\/\s*(\d+)/.exec(document.querySelector('.mixto-nota')?.textContent ?? '')
  return {
    nota: nota ? { aciertos: Number(nota[1]), total: Number(nota[2]) } : null,
    filas: [...document.querySelectorAll('.mixto-desglose tbody tr')].map((tr) => ({
      tema: Number(tr.dataset.tema),
      aciertos: num(tr.querySelector('[data-aciertos]')),
      preguntas: num(tr.querySelector('[data-preguntas]')),
    })),
    pie: {
      aciertos: num(document.querySelector('.mixto-desglose tfoot [data-aciertos]')),
      preguntas: num(document.querySelector('.mixto-desglose tfoot [data-preguntas]')),
    },
    falladas: document.querySelectorAll('.mixto-falladas > li').length,
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

/* ------------------------------------------------------------------ */
/* Los controles                                                        */
/* ------------------------------------------------------------------ */

const NOMBRES = [
  'Selección · solo salen preguntas de los temas elegidos',
  'Sesión · ninguna pregunta repetida',
  'Tema oculto · no se ve antes de contestar',
  'Recuento · el desglose por tema cuadra con el total',
  'Opciones · en el orden del dato, sin barajar',
  'Falladas · «repetir solo las falladas» trae esas y solo esas',
  'Progreso · lo contestado cuenta como en el test del tema',
  'Selección guardada · se recuerda al volver',
  'Enlace · lleva al apartado del apunte que respalda la pregunta',
]

const SABOTAJES = {
  1: 'una pregunta de un tema no elegido se cuela en la sesión',
  2: 'una pregunta sale dos veces en la misma sesión',
  3: 'el tema asoma antes de contestar',
  4: 'una fila del desglose cuenta una pregunta de más',
  5: 'dos opciones cambian de sitio',
  6: 'una acertada se cuela al repetir las falladas',
  7: 'un fallo no llega al progreso',
  8: 'la selección guardada pierde un tema',
  9: 'un enlace apunta a otro apartado',
}
const CONTROL_DE = { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [8] }

async function controles(nav, base, dato, sab) {
  const resultados = []
  const control = async (nombre, fn) => {
    try {
      resultados.push({ nombre, estado: 'ok', detalle: await fn() })
    } catch (e) {
      resultados.push({ nombre, estado: 'falla', detalle: e.message })
    }
  }
  const lista = (ns) => ns.join(', ').replace(/, (\d+)$/, ' y $1')

  /** Una sesion de test de TEMAS_TEST, contestada entera. */
  async function sesionTest(perturbar, trasContestar) {
    const pag = await abrir(nav, base)
    await configurar(pag, { temas: TEMAS_TEST })
    await empezar(pag)
    const leidas = await recorrer(pag, perturbar, trasContestar)
    return { pag, leidas }
  }

  /* 1. Solo los temas elegidos; y en supuestos, solo los que los tienen */
  await control(NOMBRES[0], async () => {
    const intrusa = async (k, pag) => {
      if (k !== 0) return
      // de otro tema y con la correcta en el mismo sitio: solo cambia de quien es
      const actual = await pag.evaluate(leerAntes)
      const real = identificar(dato, actual, 'test')
      const ajena = dato.todas.find((q) => q.clase === 'test' && q.tema === AJENO && q.correcta === real.correcta)
      await suplantar(pag, ajena.pregunta, ajena.opciones)
    }
    const { pag, leidas } = await sesionTest(sab === 1 ? intrusa : null)
    await pag.close()
    for (const [k, l] of leidas.entries()) {
      const cs = candidatas(dato, l, 'test')
      if (!cs.length) throw new Error(`la pregunta ${k + 1} («${l.pregunta.slice(0, 50)}…») no está en el test de ningún tema`)
      if (!cs.some((q) => TEMAS_TEST.includes(q.tema))) {
        throw new Error(`la pregunta ${k + 1} (${cs.map((q) => q.id).join(', ')}) es de un tema no elegido`)
      }
      if (!cs.some((q) => q.tema === l.rotulo)) {
        throw new Error(`la corrección de ${cs[0].id} dice «tema ${l.rotulo}»`)
      }
    }

    const pagS = await abrir(nav, base)
    await configurar(pagS, { tipo: 'supuestos', temas: TEMAS_SUP })
    await empezar(pagS)
    const sup = await recorrer(pagS)
    await pagS.close()
    const conSupuestos = TEMAS_SUP.filter((t) => t >= 9)
    for (const [k, l] of sup.entries()) {
      const q = identificar(dato, l, 'supuesto')
      if (!q) throw new Error(`la pregunta ${k + 1} de supuestos no está en ningún supuesto`)
      if (!conSupuestos.includes(q.tema)) throw new Error(`${q.id} es de un tema no elegido o sin supuestos`)
      if (l.opciones.length !== 4) throw new Error(`${q.id} sale con ${l.opciones.length} opciones, deben ser 4`)
      if (!l.enunciado?.trim()) throw new Error(`${q.id} sale sin el enunciado de su supuesto`)
    }
    return `${leidas.length} de test, todas de los temas ${lista(TEMAS_TEST)}; ${sup.length} de supuestos, todas de ${lista(conSupuestos)} y con su enunciado (el 5 no tiene)`
  })

  /* 2. Ninguna repetida, ni siquiera la que el dato tiene en dos temas */
  await control(NOMBRES[1], async () => {
    const repite = async (k, pag, leidas) => {
      if (k === 5) await suplantar(pag, leidas[0].pregunta, leidas[0].opciones)
    }
    const { pag, leidas } = await sesionTest(sab === 2 ? repite : null)
    await pag.close()
    const pag2 = await abrir(nav, base)
    await configurar(pag2, { temas: TEMAS_DUPLICADA, cuantas: 0 })
    await empezar(pag2)
    const todas = await recorrer(pag2)
    await pag2.close()

    const distintas = new Set(
      dato.todas.filter((q) => q.clase === 'test' && TEMAS_DUPLICADA.includes(q.tema)).map((q) => huella(q.pregunta, q.opciones)),
    ).size
    for (const [donde, ls, esperado] of [
      [`temas ${lista(TEMAS_TEST)}`, leidas, CUANTAS],
      [`temas ${lista(TEMAS_DUPLICADA)}, todas`, todas, distintas],
    ]) {
      const vistas = new Map()
      for (const [k, l] of ls.entries()) {
        const h = huella(l.pregunta, l.opciones)
        if (vistas.has(h)) throw new Error(`${donde}: la pregunta ${k + 1} repite la ${vistas.get(h) + 1}`)
        vistas.set(h, k)
      }
      if (ls.length !== esperado || ls[0]?.total !== esperado) {
        throw new Error(`${donde}: salen ${ls.length} preguntas (el contador dice ${ls[0]?.total}) y deben ser ${esperado}`)
      }
    }
    return `${leidas.length} distintas de ${CUANTAS} pedidas; y ${todas.length} de los temas ${lista(TEMAS_DUPLICADA)} con «todas», la que está en los dos una sola vez`
  })

  /* 3. El tema no asoma antes de contestar, y si despues */
  await control(NOMBRES[2], async () => {
    const pag = await abrir(nav, base)
    const titulos = await pag.evaluate(() =>
      [...document.querySelectorAll('label[title]')].map((l) => l.getAttribute('title').replace(/^\d+\.\s*/, '')),
    )
    await configurar(pag, { temas: TEMAS_TEST })
    await empezar(pag)
    const asoma = async (k, pag) => {
      if (k === 0) {
        await pag.evaluate(() => document.querySelector('.mixto-cabeza .contador').append(' · Tema 17'))
      }
    }
    const leidas = await recorrer(pag, sab === 3 ? asoma : null)
    await pag.close()
    const trozos = titulos.map((t) => normaliza(t).slice(0, 40)).filter((t) => t.length >= 20)
    for (const [k, l] of leidas.entries()) {
      if (l.rotuloAntes) throw new Error(`pregunta ${k + 1}: la línea del tema está puesta antes de contestar`)
      const m = /\btema\s*\d+/i.exec(l.resto)
      if (m) throw new Error(`pregunta ${k + 1}: antes de contestar se lee «${m[0]}»`)
      const titulo = trozos.find((t) => normaliza(l.resto).includes(t))
      if (titulo) throw new Error(`pregunta ${k + 1}: antes de contestar se lee el título «${titulo}…»`)
      if (!l.rotulo) throw new Error(`pregunta ${k + 1}: tras contestar no aparece «Tema N.»`)
    }
    return `${leidas.length} preguntas sin tema ni título a la vista antes de contestar, y con «Tema N.» al corregir`
  })

  /* 4. El desglose por tema suma el total */
  await control(NOMBRES[3], async () => {
    const { pag, leidas } = await sesionTest()
    if (sab === 4) {
      await pag.evaluate(() => {
        const td = document.querySelector('.mixto-desglose tbody [data-preguntas]')
        td.textContent = String(Number(td.textContent) + 1)
      })
    }
    const r = await pag.evaluate(leerResultado)
    await pag.close()
    const suma = (k) => r.filas.reduce((n, f) => n + f[k], 0)
    const bien = leidas.filter((l) => l.veredicto === 'Correcto.').length
    const cuadra = [
      ['preguntas en las filas', suma('preguntas'), leidas.length],
      ['preguntas del total', r.pie.preguntas, leidas.length],
      ['preguntas de la nota', r.nota?.total, leidas.length],
      ['aciertos en las filas', suma('aciertos'), bien],
      ['aciertos del total', r.pie.aciertos, bien],
      ['aciertos de la nota', r.nota?.aciertos, bien],
    ]
    for (const [que, dice, debe] of cuadra) {
      if (dice !== debe) throw new Error(`${que}: ${dice}, y se han contestado ${debe}`)
    }
    for (const f of r.filas) {
      const vistas = leidas.filter((l) => l.rotulo === f.tema).length
      if (f.preguntas !== vistas) throw new Error(`la fila del tema ${f.tema} cuenta ${f.preguntas} y se corrigieron ${vistas} de ese tema`)
      if (!TEMAS_TEST.includes(f.tema)) throw new Error(`hay fila del tema ${f.tema}, que no se eligió`)
    }
    return `${r.filas.map((f) => `tema ${f.tema}: ${f.aciertos}/${f.preguntas}`).join(' · ')} = ${r.pie.aciertos}/${r.pie.preguntas}, igual que lo contestado`
  })

  /* 5. Las opciones, en el orden del dato, y la marcada es la correcta */
  await control(NOMBRES[4], async () => {
    const cruza = async (k, pag) => {
      if (k !== 0) return
      await pag.evaluate(() => {
        const [a, b] = document.querySelectorAll('.opciones button.opcion span')
        ;[a.textContent, b.textContent] = [b.textContent, a.textContent]
      })
    }
    const { pag, leidas } = await sesionTest(sab === 5 ? cruza : null)
    await pag.close()
    for (const l of leidas) {
      const q = identificar(dato, l, 'test')
      if (!q) throw new Error(`«${l.pregunta.slice(0, 50)}…» no está en el dato`)
      const enOrden = l.opciones.map(normaliza).every((o, i) => o === normaliza(q.opciones[i]))
      if (!enOrden) throw new Error(`${q.id}: las opciones no salen en el orden del dato`)
      if (l.marcada !== q.correcta) throw new Error(`${q.id}: la app marca la ${'abcd'[l.marcada]} y el dato dice la ${'abcd'[q.correcta]}`)
      if ((l.veredicto === 'Correcto.') !== (q.correcta === 0)) throw new Error(`${q.id}: el veredicto no concuerda con la a) pulsada`)
    }
    return `${leidas.length}/${leidas.length} con las opciones en su orden y la correcta donde dice el dato`
  })

  /* 6. Repetir las falladas trae esas y ninguna mas */
  await control(NOMBRES[5], async () => {
    const { pag, leidas } = await sesionTest()
    const falladas = new Set(leidas.filter((l) => l.veredicto === 'Incorrecto.').map((l) => huella(l.pregunta, l.opciones)))
    const acertada = leidas.find((l) => l.veredicto === 'Correcto.')
    const r = await pag.evaluate(leerResultado)
    if (r.falladas !== falladas.size) throw new Error(`la lista de falladas tiene ${r.falladas} y se fallaron ${falladas.size}`)
    if (!falladas.size) throw new Error('no se ha fallado ninguna: el control no mide nada')
    await pag.evaluate(() => [...document.querySelectorAll('button')].find((b) => /^Repetir solo las falladas/.test(b.textContent)).click())
    await pag.waitForSelector('.opciones button.opcion', { timeout: 10000 })
    const cuela = async (k, pag) => {
      if (k === 0 && acertada) await suplantar(pag, acertada.pregunta, acertada.opciones)
    }
    const otra = await recorrer(pag, sab === 6 ? cuela : null)
    await pag.close()
    const traidas = otra.map((l) => huella(l.pregunta, l.opciones))
    const sobran = traidas.filter((h) => !falladas.has(h)).length
    const faltan = [...falladas].filter((h) => !traidas.includes(h)).length
    if (sobran || faltan || traidas.length !== falladas.size) {
      throw new Error(`al repetir salen ${traidas.length}: ${sobran} que no se fallaron y faltan ${faltan} de las ${falladas.size} falladas`)
    }
    return `${falladas.size} falladas de ${leidas.length}; al repetir salen esas ${falladas.size} y ninguna más`
  })

  /* 7. El progreso: mismo registro que el test del tema */
  await control(NOMBRES[6], async () => {
    const { pag, leidas } = await sesionTest()
    if (sab === 7) {
      await pag.evaluate((clave) => {
        const p = JSON.parse(localStorage.getItem(clave))
        const id = Object.keys(p.preguntas).find((k) => p.preguntas[k].fallos > 0)
        delete p.preguntas[id]
        localStorage.setItem(clave, JSON.stringify(p))
      }, CLAVE_PROGRESO)
    }
    const guardado = await pag.evaluate((clave) => JSON.parse(localStorage.getItem(clave) ?? 'null'), CLAVE_PROGRESO)
    await pag.close()
    if (!guardado?.preguntas) throw new Error('no hay progreso guardado')
    let fallos = 0
    for (const l of leidas) {
      const q = identificar(dato, l, 'test')
      const e = guardado.preguntas[q.id]
      const acierto = l.veredicto === 'Correcto.'
      if (!acierto) fallos++
      if (!e) throw new Error(`${q.id} (${acierto ? 'acertada' : 'fallada'}) no está en el progreso`)
      if (e.intentos !== 1 || e.fallos !== (acierto ? 0 : 1) || e.aciertos !== (acierto ? 1 : 0) || e.ultimoAcierto !== acierto) {
        throw new Error(`${q.id}: el progreso dice ${JSON.stringify(e)} y se ${acierto ? 'acertó' : 'falló'} una vez`)
      }
    }
    const sobran = Object.keys(guardado.preguntas).length - leidas.length
    if (sobran) throw new Error(`el progreso tiene ${sobran} preguntas que no se contestaron`)
    return `${leidas.length} contestadas, ${fallos} falladas: cada una en el progreso con su id, como en el test del tema`
  })

  /* 8. La ultima seleccion sobrevive a recargar */
  await control(NOMBRES[7], async () => {
    const pag = await abrir(nav, base)
    await configurar(pag, { temas: TEMAS_TEST, cuantas: 30 })
    if (sab === 8) {
      await pag.evaluate((clave) => {
        const s = JSON.parse(localStorage.getItem(clave))
        s.temas = s.temas.filter((n) => n !== 17)
        localStorage.setItem(clave, JSON.stringify(s))
      }, CLAVE_SELECCION)
    }
    await pag.reload({ waitUntil: 'networkidle0' })
    await pag.waitForSelector('input[data-tema]')
    const vuelta = await pag.evaluate(() => ({
      temas: [...document.querySelectorAll('input[data-tema]:checked')].map((i) => Number(i.dataset.tema)),
      cuantas: Number(document.querySelector('button[data-cuantas][aria-pressed="true"]')?.dataset.cuantas),
    }))
    await pag.close()
    if (vuelta.temas.join() !== TEMAS_TEST.join()) throw new Error(`al volver están marcados ${vuelta.temas.join(', ') || 'ninguno'}, y se eligieron ${TEMAS_TEST.join(', ')}`)
    if (vuelta.cuantas !== 30) throw new Error(`al volver el número de preguntas es ${vuelta.cuantas}, y se eligieron 30`)
    return `al recargar siguen marcados los temas ${lista(TEMAS_TEST)} y 30 preguntas`
  })

  /* 9. El enlace de la correccion lleva al apartado que respalda la pregunta */
  await control(NOMBRES[8], async () => {
    // El enlace se pinta al contestar: el sabotaje lo desvia en la pagina justo
    // despues, a un apartado que existe pero no es el suyo.
    const desvia = async (k, pag) => {
      if (k !== 0) return
      await pag.evaluate(() => {
        const a = document.querySelector('.mixto-enlace a')
        const [ruta, consulta] = a.getAttribute('href').split('?')
        const otro = new URLSearchParams(consulta ?? '').get('ap') === '1' ? '2' : '1'
        a.setAttribute('href', `${ruta}?ap=${otro}`)
      })
    }
    const { pag, leidas } = await sesionTest(null, sab === 9 ? desvia : null)
    await pag.close()
    const visor = await nav.newPage()
    await visor.setViewport({ width: 390, height: 900 })
    let sinApartado = 0
    for (const l of leidas) {
      const q = identificar(dato, l, 'test')
      const ap = new URLSearchParams(l.enlace?.split('?')[1] ?? '').get('ap')
      const tema = Number(/#\/tema\/(\d+)/.exec(l.enlace ?? '')?.[1])
      if (tema !== q.tema) throw new Error(`${q.id}: el enlace lleva al tema ${tema}`)
      if (ap !== q.apartadoEsperado) throw new Error(`${q.id}: el enlace lleva al apartado ${ap} y la respalda el ${q.apartadoEsperado}`)
      if (!ap) {
        sinApartado++
        continue
      }
      await visor.goto(new URL(l.enlace, base).href, { waitUntil: 'networkidle0' })
      await dormir(150)
      const destino = await visor.evaluate(() => {
        const h = document.querySelector('.md-apartado-destino')
        return h ? { texto: h.textContent.trim(), arriba: Math.round(h.getBoundingClientRect().top) } : null
      })
      if (!destino) throw new Error(`${q.id}: el apunte del tema ${tema} no señala el apartado ${ap}`)
      const [num, sub] = ap.split('/')
      const esEse = sub ? destino.texto.startsWith(sub) : destino.texto.split(/\.?\s/)[0] === num
      if (!esEse) throw new Error(`${q.id}: se señala «${destino.texto.slice(0, 40)}» y el apartado es el ${ap}`)
      if (destino.arriba < 0 || destino.arriba > 450) throw new Error(`${q.id}: el apartado ${ap} queda fuera de la vista (a ${destino.arriba} px)`)
    }
    // Y todos los destinos posibles, no solo los del sorteo: cada apartado al
    // que puede llevar una pregunta de test o de supuesto de los 40 temas. Tarda
    // un minuto, y los sabotajes 1 a 8 no tocan el apunte: con ellos se salta.
    const barrido = !sab || sab === 9
    const destinos = barrido
      ? [...new Set(dato.todas.filter((q) => q.apartadoEsperado).map((q) => `${q.tema}|${q.apartadoEsperado}`))]
      : []
    const perdidos = []
    for (const d of destinos) {
      const [tema, ap] = d.split('|')
      await visor.goto(new URL(`#/tema/${tema}?ap=${encodeURIComponent(ap)}`, base).href, { waitUntil: 'networkidle0' })
      const texto = await visor.evaluate(() => document.querySelector('.md-apartado-destino')?.textContent.trim() ?? null)
      const [num, sub] = ap.split('/')
      if (!texto || !(sub ? texto.startsWith(sub) : texto.split(/\.?\s/)[0] === num)) perdidos.push(`tema ${tema} §${ap}`)
    }
    await visor.close()
    if (perdidos.length) throw new Error(`${perdidos.length} apartados sin destino: ${perdidos.slice(0, 5).join(', ')}`)
    const sinAp = dato.todas.filter((q) => !q.apartadoEsperado).length
    return `${leidas.length - sinApartado} enlaces del sorteo abren su apartado, señalado y a la vista${barrido ? `; y los ${destinos.length} apartados a los que puede llevar cualquier pregunta existen` : ''}${sinAp ? ` (${sinAp} preguntas sin apartado van al apunte)` : ''}`
  })

  return resultados
}

/* ------------------------------------------------------------------ */

function pinta(resultados) {
  console.log('\n=== Test mixto ===')
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
