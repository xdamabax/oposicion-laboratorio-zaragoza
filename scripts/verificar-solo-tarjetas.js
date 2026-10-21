#!/usr/bin/env node
/**
 * Contra la app renderizada, sin importar su propia funcion de filtrado.
 * Lee los datos originales como oraculo independiente; NO los modifica.
 * Requiere npm run build previo para pruebas locales.
 *
 * --base <url>       app publicada (por defecto dist/ en un servidor propio)
 * --control 1,2,3    tanda pequeña de controles
 * --sabotajes        controles sanos y luego sus pruebas negativas
 * --sabotaje <n>     un control sano y su prueba negativa
 * --chrome <ruta>   navegador de pruebas
 *
 * Cada negativo debe fallar con SU codigo, no por timeout ni otro error.
 * Cada control usa un contexto desechable a 375 px, cerrado incluso al fallar.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import puppeteer from 'puppeteer-core'
import { RAIZ, argumento, bandera, buscarChrome, decidirBase, temasConRepaso } from './comun.js'

const CLAVE = 'oposicion-zgz:progreso:v1'
const SELECCION = 'oposicion-zgz:mixto:v1'
const TEMAS = [3, 17, 33]
const CICLO = ['Fallo', 'Bien', 'Fácil']
const SEMBRADO = {
  reps: 2, aciertos: 2, fallos: 0, facilidad: 2.5, intervalo: 3,
  proximaRevision: '2026-01-01', ultimaRevision: '2025-12-29',
}
const dormir = (ms = 35) => new Promise((r) => setTimeout(r, ms))
const normaliza = (s) => s
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/^\s*(\d+[.)]|[-*+])\s+/gm, '')
  .toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
  .replace(/[^a-z0-9]+/g, ' ').trim()
const exige = (ok, codigo, detalle) => {
  if (!ok) throw new Error(`[${codigo}] ${detalle}`)
}
const vacio = () => ({
  version: 1, tarjetas: {}, preguntas: {},
  racha: { actual: 0, mejor: 0, ultimoDia: null },
  historial: {}, falladas: { preguntas: {}, tarjetas: {} },
})

function cargar() {
  const tarjetas = []
  for (const tema of temasConRepaso()) {
    const n = String(tema).padStart(2, '0')
    const repaso = JSON.parse(readFileSync(join(RAIZ, 'repaso', `tema-${n}.json`), 'utf8'))
    const cobertura = JSON.parse(readFileSync(join(RAIZ, 'repaso/cobertura', `tema-${n}.json`), 'utf8'))
    for (const f of repaso.flashcards) {
      const apartados = Object.entries(cobertura.apartados ?? {})
        .filter(([, ids]) => ids.includes(f.id)).map(([ap]) => ap)
        .sort((a, b) => b.split(/[./]/).length - a.split(/[./]/).length)
      tarjetas.push({ ...f, tema, apartadoEsperado: f.apartado ?? apartados[0] ?? null })
    }
  }
  return tarjetas
}
const DATO = cargar()
const esperado = (temas, nucleo = 'todas') => DATO.filter((f) =>
  temas.includes(f.tema) && (nucleo === 'todas' || (nucleo === 'solo') === !!f.nucleo))

async function abrir(ctx, base, hash = '#/mixto', progreso = null) {
  const pag = await ctx.newPage()
  pag.errores = []
  pag.on('pageerror', (e) => pag.errores.push(e.message))
  await pag.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true })
  await pag.goto(new URL(hash, base).href, { waitUntil: 'networkidle0' })
  await pag.evaluate((clave, p) => {
    localStorage.clear()
    if (p) localStorage.setItem(clave, JSON.stringify(p))
  }, CLAVE, progreso)
  await pag.reload({ waitUntil: 'networkidle0' })
  return pag
}

async function pulsar(pag, patron) {
  const ok = await pag.evaluate((patron) => {
    const b = [...document.querySelectorAll('button')].find((b) => new RegExp(patron).test(b.textContent.trim()))
    if (!b || b.disabled) return false
    b.click()
    return true
  }, patron)
  exige(ok, 'INTERFAZ', `no se puede pulsar ${patron}`)
  await dormir()
}

async function configurar(pag, { temas = TEMAS, nucleo = 'todas', cuantas = 20 } = {}) {
  await pag.waitForSelector('input[data-tema]')
  await pulsar(pag, '^Solo tarjetas$')
  await pulsar(pag, '^Ninguno$')
  for (const n of temas) {
    await pag.evaluate((n) => document.querySelector(`input[data-tema="${n}"]`).click(), n)
    await dormir()
  }
  await pag.evaluate((n) => document.querySelector(`button[data-nucleo="${n}"]`).click(), nucleo)
  await dormir()
  await pag.evaluate((n) => document.querySelector(`button[data-cuantas="${n}"]`).click(), cuantas)
  await dormir()
}

async function sinDesborde(pag, donde) {
  const m = await pag.evaluate(() => ({
    ancho: window.innerWidth, documento: document.documentElement.scrollWidth, cuerpo: document.body.scrollWidth,
    fuera: [...document.querySelectorAll('main *')].reverse().filter((e) => e.getBoundingClientRect().right > 376)
      .slice(0, 5).map((e) => ({ tag: e.tagName, clase: e.className, texto: e.textContent.slice(0, 80), ancho: e.getBoundingClientRect().width })),
  }))
  exige(m.ancho === 375 && m.documento <= 376 && m.cuerpo <= 376,
    'MOVIL', `${donde}: desborde a 375 px: ${JSON.stringify(m)}`)
  exige(!pag.errores.length, 'INTERFAZ', `errores en ${donde}: ${pag.errores.join('; ')}`)
}

async function empezar(pag) {
  await sinDesborde(pag, 'seleccion')
  await pulsar(pag, '^Empezar')
  await pag.waitForSelector('.tarjeta.flash')
}

async function suplantar(pag, f) {
  await pag.evaluate(({ anverso, reverso, tema }) => {
    document.querySelector('.flash-a').textContent = anverso
    document.querySelector('.flash-b > .md').textContent = reverso
    document.querySelector('.mixto-tema').textContent = `Tema ${tema}. Intrusa de prueba`
  }, f)
}

/** Identifica por contenido visible, no por el rotulo de tema de la app. */
function identificar(l) {
  const candidatas = DATO.filter((f) => normaliza(f.anverso) === normaliza(l.anverso))
  const f = candidatas.find((f) => normaliza(f.reverso) === normaliza(l.reverso))
  exige(f, 'DATO', `no se identifica: ${l.anverso.slice(0, 100)}; candidatas ${candidatas.map((f) => f.id)}; reverso ${normaliza(l.reverso)}`)
  return f
}

async function recorrer(pag, { antes, despues, valorar = (n) => CICLO[n % 3] } = {}) {
  const leidas = []
  for (let n = 0; n < 1000; n++) {
    if (await pag.$('.mixto-nota')) return leidas
    exige(!(await pag.$('.opciones')), 'SOLO_TARJETAS', 'ha salido una pregunta en Solo tarjetas')
    await pag.waitForSelector('.tarjeta.flash')
    if (antes) await antes(pag, n)
    await sinDesborde(pag, 'anverso')
    const previa = await pag.evaluate(() => {
      const resto = document.querySelector('main').cloneNode(true)
      resto.querySelectorAll('.flash-a').forEach((e) => e.remove())
      return {
        texto: resto.textContent,
        tema: !!document.querySelector('.mixto-tema'),
        enlace: !!document.querySelector('.mixto-enlace'),
        reverso: !!document.querySelector('.flash-b'),
        valoraciones: [...document.querySelectorAll('button')].some((b) => ['Fallo', 'Bien', 'Fácil'].includes(b.textContent.trim())),
      }
    })
    await pag.$eval('.tarjeta.flash', (e) => e.click())
    await pag.waitForSelector('.flash-b')
    if (despues) await despues(pag, n, leidas)
    await sinDesborde(pag, 'reverso')
    const l = await pag.evaluate(() => ({
      anverso: document.querySelector('.flash-a').innerText,
      reverso: document.querySelector('.flash-b > .md').innerText,
      tema: Number(/Tema (\d+)\./.exec(document.querySelector('.mixto-tema')?.textContent)?.[1]),
      enlace: document.querySelector('.mixto-enlace a')?.getAttribute('href'),
    }))
    const boton = valorar(n)
    leidas.push({ ...l, previa, boton, f: identificar(l) })
    await pulsar(pag, `^${boton}$`)
  }
  throw new Error('[SESION] no termina tras 1000 tarjetas')
}

async function sesion(ctx, base, opciones = {}, recorrido = {}) {
  const pag = await abrir(ctx, base, '#/mixto', opciones.progreso)
  await configurar(pag, opciones)
  const titulos = await pag.$$eval('label[title]', (es) => es.map((e) => e.title.replace(/^\d+\.\s*/, '')))
  await empezar(pag)
  const leidas = await recorrer(pag, recorrido)
  await sinDesborde(pag, 'resultado')
  return { pag, leidas, titulos }
}
const progresoDe = (pag) => pag.evaluate((k) => JSON.parse(localStorage.getItem(k)), CLAVE)

const CONTROLES = [
  {
    nombre: 'Temas elegidos y solo tarjetas', codigo: 'TEMAS',
    sabotaje: 'una tarjeta real de otro tema sustituye a la primera',
    async medir(ctx, base, sab) {
      const { leidas } = await sesion(ctx, base, {}, {
        despues: sab ? async (p, n) => { if (!n) await suplantar(p, esperado([1])[0]) } : null,
      })
      exige(leidas.length === 20, 'CANTIDAD', `salen ${leidas.length}, no 20`)
      for (const l of leidas) exige(TEMAS.includes(l.f.tema), 'TEMAS', `${l.f.id}: tema ${l.f.tema} no elegido`)
      return '20 tarjetas, ninguna pregunta, todas de los temas 3, 17 y 33'
    },
  },
  {
    nombre: 'Solo núcleo / Sin núcleo', codigo: 'NUCLEO',
    sabotaje: 'una tarjeta núcleo se cuela en Sin núcleo',
    async medir(ctx, base, sab) {
      for (const nucleo of ['sin', 'solo']) {
        const { pag, leidas } = await sesion(ctx, base, { temas: [17, 33], nucleo, cuantas: 0 }, {
          despues: sab && nucleo === 'sin'
            ? async (p, n) => { if (!n) await suplantar(p, esperado([17], 'solo')[0]) } : null,
        })
        exige(leidas.length === esperado([17, 33], nucleo).length, 'CANTIDAD', `${nucleo}: faltan tarjetas`)
        for (const l of leidas) exige((nucleo === 'solo') === !!l.f.nucleo, 'NUCLEO', `${l.f.id} incumple ${nucleo}`)
        await pag.close()
      }
      return 'ambos filtros comprobados con todas sus tarjetas, no solo una muestra'
    },
  },
  {
    nombre: 'Contadores, cantidades y selección vacía', codigo: 'CONTADOR',
    sabotaje: 'el número de disponibles aumenta en uno',
    async medir(ctx, base, sab) {
      const pag = await abrir(ctx, base)
      for (const temas of [TEMAS, [17], []]) for (const nucleo of ['todas', 'solo', 'sin']) {
        for (const cuantas of [10, 20, 30, 50, 0]) {
          await configurar(pag, { temas, nucleo, cuantas })
          if (sab) await pag.$eval('.mixto-disponibles', (e) => {
            e.textContent = e.textContent.replace(/^\d+/, (n) => Number(n) + 1)
          })
          const r = await pag.evaluate(() => {
            const inicio = [...document.querySelectorAll('button')].find((b) => /^Empezar/.test(b.textContent))
            return {
              disponibles: Number(/^\d+/.exec(document.querySelector('.mixto-disponibles').textContent)?.[0]),
              todas: Number(/\((\d+)\)/.exec(document.querySelector('button[data-cuantas="0"]').textContent)?.[1]),
              filtros: Object.fromEntries([...document.querySelectorAll('[data-nucleo]')].map((b) =>
                [b.dataset.nucleo, Number(/\((\d+)\)/.exec(b.textContent)?.[1])])),
              inicio: inicio.textContent, desactivado: inicio.disabled,
            }
          })
          const total = esperado(temas, nucleo).length
          const salen = cuantas ? Math.min(cuantas, total) : total
          exige(r.disponibles === total && r.todas === total, 'CONTADOR', `${temas}/${nucleo}: ${r.disponibles}/${r.todas}, deben ser ${total}`)
          for (const f of ['todas', 'solo', 'sin']) exige(r.filtros[f] === esperado(temas, f).length, 'CONTADOR', `botón ${f}: cuenta incorrecta`)
          exige(r.inicio === `Empezar (${salen} ${salen === 1 ? 'tarjeta' : 'tarjetas'})`
            && r.desactivado === (total === 0), 'CONTADOR', `inicio incorrecto: ${r.inicio}`)
        }
      }
      for (const cuantas of [10, 20, 30, 50, 0]) {
        await configurar(pag, { temas: [3], cuantas })
        await empezar(pag)
        const ls = await recorrer(pag, { valorar: () => 'Bien' })
        exige(ls.length === (cuantas ? Math.min(cuantas, esperado([3]).length) : esperado([3]).length),
          'CONTADOR', `cantidad real incorrecta para ${cuantas}`)
        await pulsar(pag, '^Nuevo test mixto$')
      }
      return '45 combinaciones, selección vacía desactivada y 5 cantidades en sesiones reales'
    },
  },
  {
    nombre: 'Sorteo sin repeticiones', codigo: 'REPETIDA',
    sabotaje: 'la segunda tarjeta repite el contenido de la primera',
    async medir(ctx, base, sab) {
      const rondas = []
      for (let i = 0; i < 2; i++) {
        const { pag, leidas } = await sesion(ctx, base, { temas: [3, 17], cuantas: 0 }, {
          despues: sab && !i ? async (p, n, ls) => { if (n === 1) await suplantar(p, ls[0].f) } : null,
        })
        const ids = leidas.map((l) => l.f.id)
        exige(new Set(ids).size === ids.length, 'REPETIDA', 'hay una tarjeta repetida en la sesión')
        exige(isDeepStrictEqual([...ids].sort(), esperado([3, 17]).map((f) => f.id).sort()), 'SORTEO', 'se pierden o añaden tarjetas')
        rondas.push(ids)
        await pag.close()
      }
      exige(!isDeepStrictEqual(...rondas), 'SORTEO', 'dos sorteos completos tienen el mismo orden')
      return `${rondas[0].length} tarjetas únicas en cada ronda; mismo conjunto y distinto orden`
    },
  },
  {
    nombre: 'SM-2 idéntico al repaso normal', codigo: 'SM2',
    sabotaje: 'se intercambian las etiquetas Bien y Fácil',
    async medir(ctx, base, sab) {
      const delTema = esperado([17])
      const inicial = vacio()
      for (const f of delTema) inicial.tarjetas[f.id] = { ...SEMBRADO }
      const { pag, leidas } = await sesion(ctx, base, { temas: [17], progreso: inicial, cuantas: 10 }, {
        despues: sab ? async (p, n) => {
          if (n !== 1) return
          await p.evaluate(() => {
            const bs = [...document.querySelectorAll('button')]
            const bien = bs.find((b) => b.textContent.trim() === 'Bien')
            const facil = bs.find((b) => b.textContent.trim() === 'Fácil')
            ;[bien.textContent, facil.textContent] = [facil.textContent, bien.textContent]
          })
        } : null,
      })
      const tras = await progresoDe(pag)
      const valoradas = new Set(leidas.map((l) => l.f.id))
      for (const f of delTema) if (!valoradas.has(f.id)) exige(
        isDeepStrictEqual(tras.tarjetas[f.id], SEMBRADO), 'SM2', `${f.id}: cambió sin ser valorada`)
      for (const boton of CICLO) {
        const l = leidas.find((l) => l.boton === boton)
        const semilla = vacio()
        for (const f of delTema) semilla.tarjetas[f.id] = {
          ...SEMBRADO, proximaRevision: f.id === l.f.id ? SEMBRADO.proximaRevision : '2099-12-31',
        }
        const normal = await abrir(ctx, base, '#/tema/17?vista=tarjetas', semilla)
        await normal.waitForSelector('.tarjeta.flash')
        const anverso = await normal.$eval('.flash-a', (e) => e.innerText)
        exige(normaliza(anverso) === normaliza(l.f.anverso), 'SM2', `el repaso normal no empieza por ${l.f.id}`)
        await normal.$eval('.tarjeta.flash', (e) => e.click())
        await pulsar(normal, `^${boton}$`)
        const ref = (await progresoDe(normal)).tarjetas[l.f.id]
        const actual = tras.tarjetas[l.f.id]
        exige(isDeepStrictEqual(Object.keys(actual).sort(), Object.keys(ref).sort()), 'SM2', 'campos de estado distintos')
        for (const campo of Object.keys(ref)) exige(actual[campo] === ref[campo], 'SM2',
          `${l.f.id}, ${boton}, ${campo}: Solo tarjetas=${actual[campo]}, normal=${ref[campo]}`)
        exige(!isDeepStrictEqual(actual, SEMBRADO), 'SM2', 'la valoración no actualiza el estado')
        await normal.close()
      }
      return 'Fallo/Bien/Fácil: misma tarjeta y estado inicial, todos los campos idénticos; no valoradas intactas'
    },
  },
  {
    nombre: 'Fallo entra en Test de falladas → Tarjetas', codigo: 'FALLADAS',
    sabotaje: 'se elimina del almacén una tarjeta valorada Fallo',
    async medir(ctx, base, sab) {
      const { pag, leidas } = await sesion(ctx, base)
      const fallos = leidas.filter((l) => l.boton === 'Fallo').map((l) => l.f.id).sort()
      if (sab) await pag.evaluate((k, id) => {
        const p = JSON.parse(localStorage.getItem(k))
        delete p.falladas.tarjetas[id]
        localStorage.setItem(k, JSON.stringify(p))
      }, CLAVE, fallos[0])
      const p = await progresoDe(pag)
      exige(isDeepStrictEqual(Object.keys(p.falladas.tarjetas).sort(), fallos), 'FALLADAS', 'la lista no coincide con las tarjetas Fallo')
      await pag.goto(new URL('#/falladas', base).href, { waitUntil: 'networkidle0' })
      await pag.reload({ waitUntil: 'networkidle0' })
      await pag.waitForSelector('button[data-tipo="tarjetas"]')
      const n = await pag.$eval('button[data-tipo="tarjetas"]', (b) => Number(/\((\d+)\)/.exec(b.textContent)?.[1]))
      exige(n === fallos.length, 'FALLADAS', `Tarjetas cuenta ${n}, deben ser ${fallos.length}`)
      return `${fallos.length} Fallo en el almacén y en el apartado de tarjetas de falladas; ninguna sabida`
    },
  },
  {
    nombre: 'Tema oculto hasta girar y enlace al apartado', codigo: 'OCULTO',
    sabotaje: 'el encabezado revela el tema antes de girar',
    async medir(ctx, base, sab) {
      const { leidas, titulos } = await sesion(ctx, base, {}, {
        antes: sab ? async (p, n) => {
          if (!n) await p.$eval('.mixto-cabeza .contador', (e) => e.append(' · Tema 17'))
        } : null,
      })
      for (const l of leidas) {
        exige(!l.previa.tema && !l.previa.enlace && !l.previa.reverso && !l.previa.valoraciones
          && !/\btema\s*\d+/i.test(l.previa.texto), 'OCULTO', `${l.f.id}: se revela tema/respuesta antes del giro`)
        const asoma = titulos.map((t) => normaliza(t).slice(0, 40))
          .find((t) => t.length >= 20 && normaliza(l.previa.texto).includes(t))
        exige(!asoma, 'OCULTO', `${l.f.id}: se revela el título ${asoma} antes del giro`)
        exige(l.tema === l.f.tema, 'ENLACE', `${l.f.id}: tema tras el giro incorrecto`)
        const destino = new URL(l.enlace, base)
        const [ruta, parametros = ''] = destino.hash.slice(1).split('?')
        exige(ruta === `/tema/${l.f.tema}`, 'ENLACE', `${l.f.id}: enlace al tema incorrecto`)
        exige(new URLSearchParams(parametros).get('ap') === l.f.apartadoEsperado,
          'ENLACE', `${l.f.id}: apartado incorrecto`)
      }
      return `${leidas.length} anversos sin tema/enlace/reverso; tras el giro, tema y apartado correctos`
    },
  },
  {
    nombre: 'Resultado por tema y repetir solo las no sabidas', codigo: 'REPETIR',
    sabotaje: 'una tarjeta sabida se cuela en la repetición',
    async medir(ctx, base, sab) {
      const { pag, leidas } = await sesion(ctx, base)
      const buenas = leidas.filter((l) => l.boton !== 'Fallo')
      const malas = leidas.filter((l) => l.boton === 'Fallo')
      const r = await pag.evaluate(() => {
        const c = (el, a) => Number(el?.getAttribute(a))
        const nota = document.querySelector('[data-parte="tarjetas"] .mixto-nota')
        return {
          bien: c(nota, 'data-bien'), total: c(nota, 'data-total'),
          malas: c(document.querySelector('span[data-no-sabidas]'), 'data-no-sabidas'),
          test: !!document.querySelector('[data-parte="test"], td[data-clase="test"]'),
          filas: [...document.querySelectorAll('.mixto-desglose tbody tr')].map((tr) => ({
            tema: Number(tr.dataset.tema),
            bien: c(tr.querySelector('[data-clase="tarjetas"]'), 'data-bien'),
            total: c(tr.querySelector('[data-clase="tarjetas"]'), 'data-total'),
            malas: c(tr.querySelector('[data-no-sabidas]'), 'data-no-sabidas'),
          })),
          pie: {
            bien: c(document.querySelector('tfoot [data-clase="tarjetas"]'), 'data-bien'),
            total: c(document.querySelector('tfoot [data-clase="tarjetas"]'), 'data-total'),
            malas: c(document.querySelector('tfoot [data-no-sabidas]'), 'data-no-sabidas'),
          },
          lista: document.querySelectorAll('.mixto-falladas li[data-tarjeta]').length,
        }
      })
      exige(r.bien === buenas.length && r.total === leidas.length && r.malas === malas.length
        && r.lista === malas.length && !r.test, 'RESULTADO', `resumen incorrecto: ${JSON.stringify(r)}`)
      for (const f of [...r.filas, { ...r.pie, tema: null }]) {
        const ls = f.tema ? leidas.filter((l) => l.f.tema === f.tema) : leidas
        exige(f.total === ls.length && f.bien === ls.filter((l) => l.boton !== 'Fallo').length
          && f.malas === ls.filter((l) => l.boton === 'Fallo').length, 'RESULTADO', `desglose incorrecto: ${JSON.stringify(f)}`)
      }
      exige(r.filas.length === new Set(leidas.map((l) => l.f.tema)).size, 'RESULTADO', 'faltan o sobran temas')
      await pulsar(pag, '^Repetir solo las no sabidas')
      const repetidas = await recorrer(pag, {
        valorar: () => 'Bien',
        despues: sab ? async (p, n) => { if (!n) await suplantar(p, buenas[0].f) } : null,
      })
      exige(isDeepStrictEqual(repetidas.map((l) => l.f.id).sort(), malas.map((l) => l.f.id).sort()),
        'REPETIR', 'al repetir faltan no sabidas o se cuelan sabidas')
      const desactivado = await pag.evaluate(() => [...document.querySelectorAll('button')]
        .find((b) => /^Repetir solo las no sabidas/.test(b.textContent))?.disabled)
      exige(desactivado === true, 'REPETIR', 'tras saberlas todas el botón debería estar desactivado')
      await sinDesborde(pag, 'resultado de la repetición')
      return `sabidas ${buenas.length}, no sabidas ${malas.length}; desglose exacto y repetición exclusiva sin desbordes`
    },
  },
  {
    nombre: 'Selección persistida y móvil 375 px', codigo: 'PERSISTENCIA',
    sabotaje: 'se pierde Solo tarjetas al recargar',
    async medir(ctx, base, sab) {
      const pag = await abrir(ctx, base)
      await configurar(pag, { temas: [17, 33], nucleo: 'sin', cuantas: 50 })
      if (sab) await pag.evaluate((k) => {
        const s = JSON.parse(localStorage.getItem(k))
        s.tipo = 'test'
        localStorage.setItem(k, JSON.stringify(s))
      }, SELECCION)
      await pag.reload({ waitUntil: 'networkidle0' })
      const guardada = await pag.evaluate((k) => ({
        s: JSON.parse(localStorage.getItem(k)),
        temas: [...document.querySelectorAll('input[data-tema]:checked')].map((e) => Number(e.dataset.tema)),
        tipo: [...document.querySelectorAll('button[aria-pressed="true"]')].some((e) => e.textContent === 'Solo tarjetas'),
        nucleo: document.querySelector('[data-nucleo="sin"]')?.getAttribute('aria-pressed'),
        cuantas: document.querySelector('[data-cuantas="50"]')?.getAttribute('aria-pressed'),
      }), SELECCION)
      exige(isDeepStrictEqual(guardada.s, { temas: [17, 33], tipo: 'tarjetas', nucleo: 'sin', cuantas: 50 })
        && isDeepStrictEqual(guardada.temas, [17, 33]) && guardada.tipo
        && guardada.nucleo === 'true' && guardada.cuantas === 'true',
      'PERSISTENCIA', `no se restaura la selección: ${JSON.stringify(guardada)}`)
      await sinDesborde(pag, 'seleccion restaurada')
      await pulsar(pag, '^Todos$')
      let n = await pag.$$eval('input[data-tema]:checked', (es) => es.length)
      exige(n === temasConRepaso().length, 'SELECCION', `Todos marca ${n} temas`)
      await pulsar(pag, '^Ninguno$')
      n = await pag.$$eval('input[data-tema]:checked', (es) => es.length)
      exige(n === 0, 'SELECCION', 'Ninguno no vacía la selección')
      await pulsar(pag, '^Solo estos$') // rango inicial 9-20
      const temas = await pag.$$eval('input[data-tema]:checked', (es) => es.map((e) => Number(e.dataset.tema)))
      exige(isDeepStrictEqual(temas, Array.from({ length: 12 }, (_, i) => i + 9)), 'SELECCION', 'el rango 9-20 no se aplica')
      await sinDesborde(pag, 'rango')
      return 'tipo, temas, núcleo y cantidad restaurados; Todos/Ninguno/rango funcionan a 375 px'
    },
  },
]

async function ejecutar(nav, base, numero, sab) {
  const ctx = await nav.createBrowserContext()
  try {
    return { ok: true, detalle: await CONTROLES[numero - 1].medir(ctx, base, sab) }
  } catch (e) {
    return { ok: false, detalle: e.message }
  } finally {
    await ctx.close()
  }
}

async function main() {
  const servidor = await decidirBase(4195)
  let nav
  let fallos = 0
  try {
    nav = await puppeteer.launch({ executablePath: buscarChrome(), headless: true })
    const suelto = argumento('sabotaje')
    const seleccion = argumento('control')
    const todos = CONTROLES.map((_, i) => i + 1)
    const numeros = suelto ? [Number(suelto)] : seleccion ? seleccion.split(',').map(Number) : todos
    exige(numeros.every((n) => Number.isInteger(n) && n >= 1 && n <= CONTROLES.length), 'ARGUMENTOS', 'control/sabotaje fuera de rango')
    console.log(`\n=== Solo tarjetas · ${servidor.base} · móvil 375 px ===`)
    for (const n of numeros) {
      const r = await ejecutar(nav, servidor.base, n, false)
      console.log(`${r.ok ? 'OK   ' : 'FALLA'} ${n}. ${CONTROLES[n - 1].nombre}\n        ${r.detalle}`)
      if (!r.ok) fallos++
    }
    if (bandera('sabotajes') || suelto) for (const n of numeros) {
      const r = await ejecutar(nav, servidor.base, n, true)
      const c = CONTROLES[n - 1]
      const bien = !r.ok && r.detalle.startsWith(`[${c.codigo}]`)
      console.log(`${bien ? 'OK   ' : 'FALLA'} sabotaje ${n}: ${c.sabotaje}\n        ${r.detalle}`)
      if (!bien) fallos++
    }
  } finally {
    if (nav) await nav.close()
    servidor.parar()
  }
  if (fallos) throw new Error(`${fallos} control(es)/sabotaje(s) sin pasar.`)
  console.log('\nTodos los controles solicitados pasan.')
}
main().catch((e) => { console.error(e.message); process.exitCode = 1 })
