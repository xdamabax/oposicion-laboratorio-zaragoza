#!/usr/bin/env node
/**
 * Bateria de regresion del repaso, CONTRA LA APP YA RENDERIZADA.
 *
 *   node scripts/verificar-repaso.js            -> todos los temas con repaso
 *   node scripts/verificar-repaso.js 26         -> solo el 26
 *   node scripts/verificar-repaso.js 25 26      -> varios
 *
 * Opciones:
 *   --base <url>     De donde leer la app (por defecto, dist/ servida aqui).
 *                    Admite la URL publicada: es lo que de verdad usa el opositor.
 *   --sabotajes      Autocomprobacion: rompe cada cosa a proposito y exige que
 *                    salte SU control y solo el suyo.
 *   --sabotaje <n>   Un sabotaje suelto.
 *   --chrome <ruta>  Ejecutable de Chrome.
 *
 * POR QUE CONDUCE LA APP Y NO VALIDA EL JSON CONTRA SI MISMO: un indice
 * `correcta` desplazado en uno produce un JSON perfectamente valido y un test
 * que ensena la respuesta equivocada. Eso solo se ve pulsando las opciones.
 * Los fallos que ha cazado esta bateria hasta hoy estan en el README.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

import { RAIZ, argumento, bandera, buscarChrome, decidirBase, temasConRepaso } from './comun.js'

const PUERTO = 4191

/**
 * Longitud minima de un fragmento en negrita del reverso para tomarlo como
 * «la respuesta de la tarjeta». Por debajo son palabras sueltas («Fuente»,
 * «Cubeta») que aparecen en cualquier dibujo sin delatar nada.
 */
const MINIMO_CLAVE = 14

const normaliza = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

/** Nombres neutros, leidos de nombres.ts para que no se desincronicen. */
function nombresNeutros() {
  const src = readFileSync(
    join(RAIZ, 'app/src/components/figuras/nombres.ts'),
    'utf8',
  )
  const cuerpo = src.slice(src.indexOf('export function nombreNeutro'))
  return new Set([...cuerpo.matchAll(/return '([^']+)'/g)].map((m) => m[1]))
}

/* ------------------------------------------------------------------ */
/* Lo que se ejecuta dentro de la pagina                                */
/* ------------------------------------------------------------------ */

/** Responde todas las preguntas visibles pulsando siempre la a). */
const recorrer = (pag, opcionDeMas = false) =>
  pag.evaluate(async (deMas) => {
    const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
    const leidas = []
    for (let vuelta = 0; vuelta < 200; vuelta++) {
      const ops = [...document.querySelectorAll('.opciones button.opcion')]
      if (!ops.length) break
      if (deMas && vuelta === 0) {
        const li = document.createElement('li')
        li.innerHTML = '<button class="opcion"><b>d)</b><span>Opción de más</span></button>'
        document.querySelector('.opciones').appendChild(li)
      }
      const nOpciones = document.querySelectorAll('.opciones button.opcion').length
      ops[0].click()
      await dormir(50)
      const marcada = [...document.querySelectorAll('.opciones button.opcion')].findIndex((b) =>
        b.classList.contains('opcion-ok'),
      )
      leidas.push({
        nOpciones,
        marcada,
        veredicto: document.querySelector('.explica b')?.textContent?.trim(),
        nucleo: !!document.querySelector('.et-nucleo'),
      })
      const siguiente = [...document.querySelectorAll('.botones button')].find((b) =>
        /Siguiente|Ver resultado/.test(b.textContent),
      )
      if (!siguiente) break
      const ultima = /Ver resultado/.test(siguiente.textContent)
      siguiente.click()
      await dormir(50)
      if (ultima) break
    }
    return leidas
  }, opcionDeMas)

/* ------------------------------------------------------------------ */

class Bateria {
  constructor(nav, base, sabotaje) {
    this.nav = nav
    this.base = base
    this.sab = sabotaje
    this.resultados = []
  }

  async control(nombre, fn) {
    try {
      const detalle = await fn()
      this.resultados.push(
        detalle === null
          ? { nombre, estado: 'n/a', detalle: 'no aplica a este tema' }
          : { nombre, estado: 'ok', detalle },
      )
    } catch (e) {
      this.resultados.push({ nombre, estado: 'falla', detalle: e.message })
    }
  }

  /** Abre un tema en la vista pedida, sin progreso guardado. */
  async abrir(tema, vista) {
    const pag = await this.nav.newPage()
    await pag.setViewport({ width: 1200, height: 1000 })
    const hash = vista ? `#/tema/${tema}?vista=${vista}` : `#/tema/${tema}`
    await pag.goto(new URL(hash, this.base).href, { waitUntil: 'networkidle0' })
    await pag.evaluate(() => localStorage.clear())
    await pag.reload({ waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 400))
    if (vista) {
      const activa = await pag.evaluate(
        () => document.querySelector('.pestanas button.activo')?.textContent?.trim(),
      )
      const rotulo = { test: 'Test', supuestos: 'Supuestos', tarjetas: 'Tarjetas' }[vista]
      if (!activa?.startsWith(rotulo)) {
        throw new Error(`no se abrió la pestaña ${vista}, sino «${activa}»`)
      }
    }
    return pag
  }
}

/* ------------------------------------------------------------------ */
/* Los ocho controles                                                   */
/* ------------------------------------------------------------------ */

async function verificarTema(nav, base, tema, sab) {
  const datos = JSON.parse(
    readFileSync(join(RAIZ, `repaso/tema-${String(tema).padStart(2, '0')}.json`), 'utf8'),
  )
  const b = new Bateria(nav, base, sab)
  const NEUTROS = nombresNeutros()
  const conFigura = (xs) => xs.filter((x) => x.figura)

  /* 1. El formato del primer ejercicio: tres opciones */
  await b.control('Test · 3 opciones por pregunta', async () => {
    if (!datos.test.length) return null
    const pag = await b.abrir(tema, 'test')
    const leidas = await recorrer(pag, sab === 1)
    await pag.close()
    if (leidas.length !== datos.test.length) {
      throw new Error(`la app muestra ${leidas.length} preguntas y el dato tiene ${datos.test.length}`)
    }
    const malas = leidas.map((l, i) => ({ i, n: l.nOpciones })).filter((x) => x.n !== 3)
    if (malas.length) {
      throw new Error(
        `${malas.length} pregunta(s) sin 3 opciones: ` +
          malas.slice(0, 4).map((m) => `#${m.i + 1} tiene ${m.n}`).join(', '),
      )
    }
    return `${leidas.length} preguntas, todas con 3 opciones`
  })

  /* 2. Lo que marca la app es lo que dice el dato */
  await b.control('Test · la opción que marca la app es la del dato', async () => {
    if (!datos.test.length) return null
    const pag = await b.abrir(tema, 'test')
    const leidas = await recorrer(pag)
    await pag.close()
    const esperado = datos.test.map((t, i) => (sab === 2 && i === 0 ? (t.correcta + 1) % 3 : t.correcta))
    const fallos = leidas
      .map((l, i) => ({ id: datos.test[i].id, app: l.marcada, dato: esperado[i] }))
      .filter((x) => x.app !== x.dato)
    if (fallos.length) {
      throw new Error(
        fallos
          .slice(0, 3)
          .map((f) => `${f.id}: la app marca la ${'abc'[f.app]} y el dato dice la ${'abc'[f.dato]}`)
          .join('; '),
      )
    }
    const incoherente = leidas.findIndex(
      (l, i) => (l.veredicto === 'Correcto.') !== (esperado[i] === 0),
    )
    if (incoherente >= 0) {
      throw new Error(`${datos.test[incoherente].id}: el veredicto no concuerda con la opción pulsada`)
    }
    return `${leidas.length}/${leidas.length} coinciden, y el veredicto concuerda en todas`
  })

  /* 3. Que no se pueda aprobar marcando siempre la misma letra */
  await b.control('Reparto · ninguna letra concentra las respuestas', () => {
    const cuenta = (qs, n) => {
      const c = new Array(n).fill(0)
      qs.forEach((q) => c[sab === 3 ? 1 : q.correcta]++)
      return c
    }
    const partes = []
    const revisa = (qs, n, donde) => {
      if (qs.length < 8) return // con menos preguntas el reparto no dice nada
      const c = cuenta(qs, n)
      partes.push(`${donde} ${c.join('/')}`)
      const total = c.reduce((a, x) => a + x, 0)
      const max = Math.max(...c)
      if (max / total > 0.45) {
        throw new Error(
          `en ${donde} la letra ${'abcd'[c.indexOf(max)]} se lleva ${max} de ${total} (${Math.round((max / total) * 100)} %)`,
        )
      }
    }
    revisa(datos.test, 3, 'test')
    revisa(datos.supuestos.flatMap((s) => s.preguntas), 4, 'supuestos')
    return partes.length ? partes.join(' · ') : null
  })

  /* 4. El segundo ejercicio: cuatro opciones, y el dato coincide */
  await b.control('Supuestos · 4 opciones y respuesta coincidente', async () => {
    if (!datos.supuestos.length) return null
    let total = 0
    for (const [n, sup] of datos.supuestos.entries()) {
      const pag = await b.abrir(tema, 'supuestos')
      await pag.evaluate((i) => document.querySelectorAll('button.item')[i].click(), n)
      await new Promise((r) => setTimeout(r, 350))
      const leidas = await recorrer(pag)
      await pag.close()
      if (leidas.length !== sup.preguntas.length) {
        throw new Error(`${sup.id}: la app muestra ${leidas.length} preguntas y el dato tiene ${sup.preguntas.length}`)
      }
      const malas = leidas.map((l, i) => ({ i, n: l.nOpciones })).filter((x) => x.n !== 4)
      if (malas.length) {
        throw new Error(`${sup.id}: la pregunta #${malas[0].i + 1} tiene ${malas[0].n} opciones, deben ser 4`)
      }
      const fallos = leidas
        .map((l, i) => ({
          id: sup.preguntas[i].id,
          app: l.marcada,
          dato: sab === 4 && n === 0 && i === 0 ? (sup.preguntas[i].correcta + 1) % 4 : sup.preguntas[i].correcta,
        }))
        .filter((x) => x.app !== x.dato)
      if (fallos.length) {
        throw new Error(
          `${fallos[0].id}: la app marca la ${'abcd'[fallos[0].app]} y el dato dice la ${'abcd'[fallos[0].dato]}`,
        )
      }
      total += leidas.length
    }
    return `${datos.supuestos.length} supuesto(s), ${total} preguntas de 4 opciones`
  })

  /* 5. El modo «Solo nucleo» tiene que filtrar de verdad */
  await b.control('Núcleo · el filtro reduce y solo deja preguntas marcadas', async () => {
    const marcadas = datos.test.filter((t) => t.nucleo).length
    if (!datos.test.length || marcadas === 0) return null
    if (marcadas === datos.test.length) {
      throw new Error(`están marcadas como núcleo las ${marcadas} preguntas: el filtro no filtra nada`)
    }
    const pag = await b.abrir(tema, 'test')
    await pag.evaluate(() => {
      ;[...document.querySelectorAll('.botones button')]
        .find((x) => x.textContent.includes('Solo núcleo'))
        .click()
    })
    await new Promise((r) => setTimeout(r, 250))
    if (sab === 5) await pag.evaluate(() => document.querySelector('.et-nucleo')?.remove())
    const leidas = await recorrer(pag)
    await pag.close()
    if (leidas.length !== marcadas) {
      throw new Error(`el filtro muestra ${leidas.length} preguntas y hay ${marcadas} marcadas`)
    }
    const sinEtiqueta = leidas.filter((l) => !l.nucleo).length
    if (sinEtiqueta) throw new Error(`${sinEtiqueta} pregunta(s) sin etiqueta «Núcleo» dentro del modo núcleo`)
    return `${datos.test.length} preguntas → el filtro deja ${leidas.length}`
  })

  /* 6. Las figuras del apunte se pintan de verdad */
  await b.control('Figuras · caja de contenido no nula en el apunte', async () => {
    const pag = await b.abrir(tema, null)
    if (sab === 6) {
      await pag.evaluate(() => {
        const s = document.querySelector('.md svg, .md img')
        if (s) {
          s.setAttribute('height', '0')
          s.style.height = '0px'
        }
      })
    }
    const medidas = await pag.evaluate(() =>
      [...document.querySelectorAll('.md .figura svg, .md .figura img')].map((el) => {
        const r = el.getBoundingClientRect()
        const e = getComputedStyle(el)
        const relleno = (a, c) => (parseFloat(a) || 0) + (parseFloat(c) || 0)
        return {
          nombre: el.querySelector?.('title')?.textContent ?? el.getAttribute('alt') ?? '(sin nombre)',
          ancho: r.width - relleno(e.paddingLeft, e.paddingRight),
          alto: r.height - relleno(e.paddingTop, e.paddingBottom),
          visible: e.visibility !== 'hidden' && e.display !== 'none' && Number(e.opacity) > 0,
        }
      }),
    )
    await pag.close()
    if (!medidas.length) return null
    const rotas = medidas.filter((m) => !(m.ancho > 0 && m.alto > 0 && m.visible))
    if (rotas.length) {
      throw new Error(rotas.map((r) => `"${r.nombre}" se pinta a ${r.ancho.toFixed(0)}×${r.alto.toFixed(0)}`).join('; '))
    }
    return `${medidas.length} figura(s), ninguna con caja nula`
  })

  /* 7. El dibujo de una tarjeta no puede llevar escrita su propia respuesta */
  await b.control('Tarjetas · el dibujo no delata el reverso', async () => {
    const tarjetas = conFigura(datos.flashcards)
    if (!tarjetas.length) return null
    const pag = await b.nav.newPage()
    await pag.goto(new URL('#/figuras', b.base).href, { waitUntil: 'networkidle0' })
    await pag.waitForSelector('.galeria-item')
    if (sab === 7) {
      await pag.evaluate(() => {
        const svg = document.querySelector('svg.figura-esquema')
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        t.textContent = 'DELATA LA RESPUESTA DE LA TARJETA'
        svg.appendChild(t)
      })
    }
    // texto de cada figura del catalogo, indexado por su clave (<code>)
    const textos = await pag.evaluate(() =>
      Object.fromEntries(
        [...document.querySelectorAll('.galeria-item')]
          .map((f) => [
            f.querySelector('code')?.textContent?.trim(),
            [...(f.querySelector('svg')?.querySelectorAll('text') ?? [])]
              .map((t) => t.textContent)
              .join(' '),
          ])
          .filter(([k]) => k),
      ),
    )
    await pag.close()

    const delatadas = []
    let revisadas = 0
    for (const tarjeta of tarjetas) {
      const clave = tarjeta.figura.valor
      const texto = textos[clave]
      if (texto === undefined) continue // pictogramas y buretas no llevan texto propio
      const dibujo = sab === 7 ? normaliza(texto + ' delata la respuesta de la tarjeta') : normaliza(texto)
      // Lo que la tarjeta pide recordar va en negrita en el reverso. Si algo de
      // eso esta ya en el ANVERSO, no lo delata nadie: forma parte de la pregunta.
      const pregunta = normaliza(tarjeta.anverso)
      const claves = [...tarjeta.reverso.matchAll(/\*\*(.+?)\*\*/g)]
        .map((m) => normaliza(m[1]))
        .filter((f) => f.length >= MINIMO_CLAVE && !pregunta.includes(f))
      const sabotada = sab === 7 && tarjeta === tarjetas[0] ? ['delata la respuesta de la tarjeta'] : []
      const dentro = [...claves, ...sabotada].filter((f) => dibujo.includes(f))
      revisadas++
      if (dentro.length) delatadas.push(`${tarjeta.id} ("${clave}") lleva escrito «${dentro[0]}»`)
    }
    if (delatadas.length) {
      throw new Error(`${delatadas.length} tarjeta(s) con la respuesta en el dibujo: ${delatadas.slice(0, 3).join('; ')}`)
    }
    return revisadas ? `${revisadas} tarjeta(s) con dibujo, ninguna lo delata` : null
  })

  /* 8. Mientras la figura ES la pregunta, el rotulo no puede cantarla */
  await b.control('Figura-pregunta · rótulo neutro, y nombre completo al revelar', async () => {
    const conF = conFigura(datos.flashcards)
    if (!conF.length) return null
    const indice = datos.flashcards.indexOf(conF[0])
    const pag = await b.abrir(tema, 'tarjetas')
    // avanzar hasta la primera tarjeta con figura (la cola respeta el orden del dato)
    for (let i = 0; i < indice; i++) {
      await pag.evaluate(() => {
        document.querySelector('.tarjeta.flash')?.click()
      })
      await new Promise((r) => setTimeout(r, 80))
      await pag.evaluate(() => {
        ;[...document.querySelectorAll('.botones button')].find((x) => /Bien/i.test(x.textContent))?.click()
      })
      await new Promise((r) => setTimeout(r, 80))
    }
    const antes = await pag.evaluate(() => {
      const f = document.querySelector('.tarjeta.flash figure.figura')
      return f ? { title: f.getAttribute('title'), pie: f.querySelector('figcaption')?.textContent ?? null } : null
    })
    if (sab === 8) {
      await pag.evaluate(() => {
        const f = document.querySelector('.tarjeta.flash figure.figura')
        f.setAttribute('title', 'Espectrómetro de absorción atómica de llama')
      })
    }
    const antesLeido = sab === 8
      ? await pag.evaluate(() => {
          const f = document.querySelector('.tarjeta.flash figure.figura')
          return { title: f.getAttribute('title'), pie: f.querySelector('figcaption')?.textContent ?? null }
        })
      : antes
    await pag.evaluate(() => document.querySelector('.tarjeta.flash').click())
    await new Promise((r) => setTimeout(r, 150))
    const despues = await pag.evaluate(() => {
      const f = document.querySelector('.tarjeta.flash figure.figura')
      return f ? { title: f.getAttribute('title'), pie: f.querySelector('figcaption')?.textContent ?? null } : null
    })
    await pag.close()
    if (!antesLeido) throw new Error(`la tarjeta ${conF[0].id} declara figura y no la pinta`)
    if (!NEUTROS.has(antesLeido.title)) {
      throw new Error(`sin girar, el rótulo dice «${antesLeido.title}» en vez de un nombre neutro`)
    }
    if (antesLeido.pie) throw new Error(`sin girar, el pie a la vista dice «${antesLeido.pie}»`)
    if (!despues || NEUTROS.has(despues.title)) {
      throw new Error('al girar la tarjeta el rótulo sigue siendo neutro: no aparece el nombre completo')
    }
    return `${conF[0].id}: «${antesLeido.title}» sin girar → «${despues.title}» al girar`
  })

  return b.resultados
}

/* ------------------------------------------------------------------ */

const SABOTAJES = {
  1: 'una cuarta opción en una pregunta del primer ejercicio',
  2: 'el índice de la respuesta correcta del test, desplazado en uno',
  3: 'todas las respuestas del test en la misma letra',
  4: 'el índice de la respuesta correcta de un supuesto, desplazado en uno',
  5: 'la etiqueta «Núcleo» retirada dentro del modo núcleo',
  6: 'una figura del apunte pintada con altura cero',
  7: 'un rótulo con la respuesta de la tarjeta, metido en su dibujo',
  8: 'el rótulo de la figura-pregunta cantando el nombre completo',
}
/**
 * Qué control(es) debe tumbar cada sabotaje, por su índice en los resultados.
 * Va como lista porque un sabotaje puede romper dos cosas acopladas de verdad;
 * lo que no se tolera es que tumbe una que no está declarada.
 */
const CONTROL_DE = { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7] }

function pinta(titulo, resultados) {
  console.log(`\n${titulo}`)
  for (const r of resultados) {
    const marca = { ok: 'OK   ', falla: 'FALLA', 'n/a': '·    ' }[r.estado]
    console.log(`${marca} ${r.nombre}`)
    console.log(`      ${r.detalle}`)
  }
}

async function main() {
  const temas = process.argv
    .slice(2)
    .filter((a) => /^\d+$/.test(a))
    .map(Number)
  const objetivo = temas.length ? temas : temasConRepaso()
  if (!objetivo.length) throw new Error('No hay ningún repaso/tema-NN.json que verificar.')

  const servidor = await decidirBase(PUERTO)
  const nav = await puppeteer.launch({
    executablePath: buscarChrome(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })

  let fallos = 0
  try {
    const sueltos = argumento('sabotaje')
    const lista = bandera('sabotajes')
      ? Object.keys(SABOTAJES).map(Number)
      : sueltos
        ? [Number(sueltos)]
        : [0]

    for (const tema of objetivo) {
      for (const sab of lista) {
        const resultados = await verificarTema(nav, servidor.base, tema, sab)
        const titulo = sab
          ? `=== Tema ${tema} · SABOTAJE ${sab}: ${SABOTAJES[sab]} ===`
          : `=== Tema ${tema} ===`

        if (!sab) {
          pinta(titulo, resultados)
          const malos = resultados.filter((r) => r.estado === 'falla')
          fallos += malos.length
          const ok = resultados.filter((r) => r.estado === 'ok').length
          const na = resultados.filter((r) => r.estado === 'n/a').length
          console.log(`\n${ok}/${ok + malos.length} controles pasan${na ? ` (${na} no aplican)` : ''}.`)
          continue
        }

        // Modo sabotaje: tienen que caer los controles declarados, y solo esos.
        const esperados = CONTROL_DE[sab]
        const nombres = (is) => is.map((i) => `«${resultados[i].nombre}»`).join(', ')
        if (esperados.every((i) => resultados[i].estado === 'n/a')) {
          console.log(`·     Tema ${tema} · sabotaje ${sab}: el control no aplica a este tema`)
          continue
        }
        const caidos = resultados.map((r, i) => (r.estado === 'falla' ? i : -1)).filter((i) => i >= 0)
        const faltan = esperados.filter((i) => !caidos.includes(i))
        const sobran = caidos.filter((i) => !esperados.includes(i))
        if (faltan.length) {
          console.log(`FALLA Tema ${tema} · sabotaje ${sab} NO detectado: ${nombres(faltan)} siguió pasando`)
          fallos++
        } else if (sobran.length) {
          console.log(`FALLA Tema ${tema} · sabotaje ${sab} tumbó de más: ${nombres(sobran)}`)
          fallos++
        } else {
          console.log(`OK    Tema ${tema} · sabotaje ${sab} (${SABOTAJES[sab]})`)
          for (const i of esperados) console.log(`        lo caza «${resultados[i].nombre}»: ${resultados[i].detalle}`)
        }
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
