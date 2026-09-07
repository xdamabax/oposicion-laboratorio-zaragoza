#!/usr/bin/env node
/**
 * Bateria de regresion de los esquemas, MIDIENDO EL DIBUJO YA RENDERIZADO.
 *
 *   node scripts/verificar-figuras.js            -> todos los controles
 *   node scripts/verificar-figuras.js --sabotajes
 *
 * Opciones:
 *   --base <url>     De donde leer la app (por defecto, dist/ servida aqui).
 *   --sabotajes      Rompe cada cosa a proposito y exige que salte SU control.
 *   --sabotaje <n>   Un sabotaje suelto.
 *   --chrome <ruta>  Ejecutable de Chrome.
 *
 * POR QUE NO BASTA CON QUE LA FIGURA "EXISTA": un esquema equivocado se pinta
 * igual de bien que uno correcto. La curva de desviacion de Beer llego a
 * dibujarse arrancando POR ENCIMA de la recta ideal, que ensena justo lo
 * contrario de lo que hay que aprender, y no habia nada que lo detectara. Cada
 * control de aqui abajo afirma algo COMPROBABLE sobre la geometria del dibujo.
 */

import puppeteer from 'puppeteer-core'

import { argumento, bandera, buscarChrome, decidirBase } from './comun.js'

const PUERTO = 4192
const ROJO = '#d3212c'

/* ------------------------------------------------------------------ */
/* Utilidades que viven dentro de la pagina                             */
/* ------------------------------------------------------------------ */

/**
 * Se inyecta en el navegador. Devuelve el resultado de cada control como
 * {nombre, estado, detalle}: la logica de medida va aqui porque necesita
 * getBBox() e isPointInFill(), que solo existen en el navegador.
 */
function medir(sabotaje, ROJO) {
  const resultados = []
  const control = (nombre, fn) => {
    try {
      resultados.push({ nombre, estado: 'ok', detalle: fn() })
    } catch (e) {
      resultados.push({ nombre, estado: 'falla', detalle: e.message })
    }
  }

  const svgs = [...document.querySelectorAll('svg.figura-esquema')]
  const clavePorSvg = new Map(
    [...document.querySelectorAll('.galeria-item')].map((f) => [
      f.querySelector('svg'),
      f.querySelector('code')?.textContent?.trim(),
    ]),
  )
  const porClave = (clave) => {
    const svg = svgs.find((s) => clavePorSvg.get(s) === clave)
    if (!svg) throw new Error(`no hay ninguna figura con la clave "${clave}"`)
    return svg
  }

  /** Puntos de un path escrito como "M x y L x y L x y ...". */
  const puntos = (path) => {
    const n = path.getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number)
    const p = []
    for (let i = 0; i + 1 < n.length; i += 2) p.push([n[i], n[i + 1]])
    return p
  }
  /** Los paths de un svg que son curvas muestreadas, no adornos. */
  const curvas = (svg, minimo = 40) =>
    [...svg.querySelectorAll('path')].map((p) => ({ el: p, pts: puntos(p) })).filter((c) => c.pts.length >= minimo)

  const centroX = (svg, texto) => {
    const t = [...svg.querySelectorAll('text')].find(
      (e) => e.textContent.replace(/\s+/g, ' ').trim() === texto,
    )
    if (!t) throw new Error(`falta el rótulo "${texto}"`)
    const c = t.getBBox()
    return c.x + c.width / 2
  }

  const enOrden = (svg, etapas) => {
    const xs = etapas.map((e) => [e, centroX(svg, e)])
    for (let i = 1; i < xs.length; i++) {
      if (!(xs[i][1] > xs[i - 1][1])) {
        throw new Error(
          `"${xs[i][0]}" (x=${xs[i][1].toFixed(0)}) no va después de "${xs[i - 1][0]}" (x=${xs[i - 1][1].toFixed(0)})`,
        )
      }
    }
    return xs.map(([n, x]) => `${n}@${x.toFixed(0)}`).join(' < ')
  }

  /**
   * Mesetas horizontales consecutivas de una escalera.
   *
   * Solo mira los trazos en currentColor: la curva roja de absorbancia tiene
   * cientos de puntos y, si entrara, se llevaria el «mas largo» y las mesetas
   * saldrian de la gaussiana.
   */
  const mesetas = (svg) => {
    const escalera = [...svg.querySelectorAll('path[stroke="currentColor"]')]
      .map(puntos)
      .sort((a, b) => b.length - a.length)[0]
    const m = []
    for (let i = 0; i + 1 < escalera.length; i++) {
      const [x0, y0] = escalera[i]
      const [x1, y1] = escalera[i + 1]
      if (Math.abs(y1 - y0) < 0.5 && x1 > x0) m.push({ y: y0, x0, x1 })
    }
    return m
  }

  /* ---- sabotajes: rompen el dibujo antes de medirlo ---- */
  if (sabotaje === 1) porClave('absorcion-atomica').querySelector('text').textContent = 'Monocromador'
  if (sabotaje === 2) {
    const svg = porClave('espectrofotometro')
    const t = [...svg.querySelectorAll('text')].find((e) => e.textContent.trim() === 'Monocromador')
    t.setAttribute('x', '340')
  }
  if (sabotaje === 3) {
    const svg = porClave('horno-grafito')
    const escalera = [...svg.querySelectorAll('path[stroke="currentColor"]')]
      .sort((a, b) => puntos(b).length - puntos(a).length)[0]
    // las etapas dejan de subir: la calcinacion se pinta mas fria que el secado
    const pts = puntos(escalera)
    escalera.setAttribute('d', pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${i >= 3 && i <= 4 ? 143 : y}`).join(' '))
  }
  if (sabotaje === 4) {
    const svg = porClave('horno-grafito')
    const rojo = [...svg.querySelectorAll('path')].find((p) => p.getAttribute('stroke') === ROJO)
    rojo.setAttribute('d', puntos(rojo).map(([x, y], i) => `${i ? 'L' : 'M'}${x - 68} ${y}`).join(' '))
  }
  if (sabotaje === 5) {
    const svg = porClave('horno-grafito')
    ;[...svg.querySelectorAll('text')].find((e) => e.textContent.includes('2000-3000')).setAttribute('y', '143')
  }
  if (sabotaje === 6) {
    const svg = porClave('linea-vs-banda')
    const rojo = [...svg.querySelectorAll('path')].find((p) => p.getAttribute('stroke') === ROJO)
    const pts = puntos(rojo)
    const x0 = pts[0][0]
    const ancho = pts[pts.length - 1][0] - x0
    const base = Math.max(...pts.map((p) => p[1]))
    const alto = base - Math.min(...pts.map((p) => p[1]))
    const g = (t) => Math.exp(-((t - 0.5) ** 2) / (2 * 0.16 ** 2))
    rojo.setAttribute(
      'd',
      pts.map((_, i, a) => `${i ? 'L' : 'M'}${x0 + (i / (a.length - 1)) * ancho} ${base - alto * g(i / (a.length - 1))}`).join(' '),
    )
  }
  if (sabotaje === 7) {
    const svg = porClave('lampara-catodo-hueco')
    const catodo = [...svg.querySelectorAll('path')].find((p) => p.getAttribute('d').startsWith('M150 72'))
    catodo.setAttribute('d', 'M150 72 H126 A34 34 0 0 0 126 140 H150 Z')
  }
  if (sabotaje === 8) {
    const svg = porClave('lampara-catodo-hueco')
    const haz = [...svg.querySelectorAll('line')].find((l) => l.getAttribute('stroke') === ROJO)
    haz.setAttribute('x2', '300')
  }
  if (sabotaje === 9) {
    const svg = porClave('desviacion-beer')
    const rojo = [...svg.querySelectorAll('path')].find((p) => p.getAttribute('stroke') === ROJO)
    // el fallo real de su dia: la curva arranca POR ENCIMA de la recta ideal
    rojo.setAttribute('d', puntos(rojo).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y - 14}`).join(' '))
  }
  if (sabotaje === 10) {
    const svg = porClave('derivadas-valoracion')
    const marcas = [...svg.querySelectorAll('line')].filter((l) => l.getAttribute('stroke') === ROJO)
    marcas.forEach((l) => {
      l.setAttribute('x1', '60')
      l.setAttribute('x2', '60')
    })
  }
  if (sabotaje === 11) {
    const svg = porClave('absorcion-atomica')
    svg.style.width = `${Number(svg.getAttribute('width')) * 0.8}px`
  }
  if (sabotaje === 12) {
    const svg = porClave('ley-beer')
    const t = svg.querySelector('text')
    t.setAttribute('x', '-60')
  }

  /* ---- controles genericos, sobre TODOS los esquemas ---- */

  control('Catálogo · todos los esquemas se ven a tamaño natural', () => {
    const malos = svgs
      .map((s) => ({
        clave: clavePorSvg.get(s),
        pedido: Number(s.getAttribute('width')),
        real: s.getBoundingClientRect().width,
      }))
      .filter((s) => s.real < s.pedido - 1)
    if (malos.length) {
      throw new Error(malos.map((m) => `"${m.clave}" pedía ${m.pedido} px y se pinta a ${m.real.toFixed(0)}`).join('; '))
    }
    return `${svgs.length} esquemas, ninguno encogido`
  })

  control('Lienzos · ningún rótulo se sale de su lienzo', () => {
    const fuera = []
    for (const svg of svgs) {
      const [, , ancho, alto] = svg.getAttribute('viewBox').split(/\s+/).map(Number)
      for (const t of svg.querySelectorAll('text')) {
        const c = t.getBBox()
        if (c.x < -1.5 || c.y < -1.5 || c.x + c.width > ancho + 1.5 || c.y + c.height > alto + 1.5) {
          fuera.push(
            `"${clavePorSvg.get(svg)}": «${t.textContent.trim().slice(0, 30)}» ocupa ` +
              `[${c.x.toFixed(0)}, ${(c.x + c.width).toFixed(0)}]×[${c.y.toFixed(0)}, ${(c.y + c.height).toFixed(0)}] ` +
              `en un lienzo de ${ancho}×${alto}`,
          )
        }
      }
    }
    if (fuera.length) throw new Error(`${fuera.length} rótulo(s) fuera del lienzo: ${fuera.slice(0, 2).join(' · ')}`)
    return `${svgs.reduce((n, s) => n + s.querySelectorAll('text').length, 0)} rótulos, todos dentro`
  })

  /* ---- controles semanticos, uno por afirmacion del dibujo ---- */

  control('AA · el monocromador va DESPUÉS del atomizador', () =>
    enOrden(porClave('absorcion-atomica'), [
      'Fuente',
      'Modulador',
      'Atomizador',
      'Monocromador',
      'Detector',
      'Lectura',
    ]),
  )

  control('UV-vis · el monocromador va ANTES de la cubeta', () => {
    const svg = porClave('espectrofotometro')
    const mono = centroX(svg, 'Monocromador')
    const cubeta = centroX(svg, 'Cubeta')
    if (!(mono < cubeta)) {
      throw new Error(
        `el monocromador (x=${mono.toFixed(0)}) debería ir antes de la cubeta (x=${cubeta.toFixed(0)})`,
      )
    }
    return `monocromador@${mono.toFixed(0)} < cubeta@${cubeta.toFixed(0)}: orden opuesto al de la absorción atómica`
  })

  control('Horno · la temperatura sube secado < calcinación < atomización', () => {
    const m = mesetas(porClave('horno-grafito'))
    if (m.length !== 4) throw new Error(`se esperaban 4 mesetas y hay ${m.length}`)
    const [secado, calc, atom, limp] = m
    if (!(secado.y > calc.y)) throw new Error('la calcinación no está por encima del secado')
    if (!(calc.y > atom.y)) throw new Error('la atomización no está por encima de la calcinación')
    if (!(limp.y <= atom.y)) throw new Error('la limpieza sale más fría que la atomización')
    return `y: secado ${secado.y} > calcinación ${calc.y} > atomización ${atom.y} ≥ limpieza ${limp.y}`
  })

  control('Horno · el pico de absorbancia cae DENTRO de la atomización', () => {
    const svg = porClave('horno-grafito')
    const atom = mesetas(svg)[2]
    const rojo = [...svg.querySelectorAll('path')].find((p) => p.getAttribute('stroke') === ROJO)
    if (!rojo) throw new Error('no hay curva de absorbancia')
    const cima = puntos(rojo).reduce((a, b) => (b[1] < a[1] ? b : a))
    if (!(cima[0] >= atom.x0 && cima[0] <= atom.x1)) {
      throw new Error(
        `la cima está en x=${cima[0].toFixed(0)} y la atomización va de ${atom.x0.toFixed(0)} a ${atom.x1.toFixed(0)}`,
      )
    }
    return `cima en x=${cima[0].toFixed(0)}, dentro de [${atom.x0.toFixed(0)}, ${atom.x1.toFixed(0)}]`
  })

  control('Horno · cada temperatura rotula su propio escalón', () => {
    const svg = porClave('horno-grafito')
    const m = mesetas(svg)
    return [
      ['≈ 110 °C', m[0]],
      ['350-1200 °C', m[1]],
      ['2000-3000 °C', m[2]],
    ]
      .map(([texto, meseta]) => {
        const t = [...svg.querySelectorAll('text')].find(
          (e) => e.textContent.replace(/\s+/g, ' ').trim() === texto,
        )
        if (!t) throw new Error(`falta la marca "${texto}"`)
        const c = t.getBBox()
        const y = c.y + c.height / 2
        if (Math.abs(y - meseta.y) > 6) {
          throw new Error(`"${texto}" está a y=${y.toFixed(0)} y su escalón a y=${meseta.y.toFixed(0)}`)
        }
        return `${texto}→${meseta.y.toFixed(0)}`
      })
      .join(' · ')
  })

  control('Línea vs. banda · la línea atómica es mucho más estrecha', () => {
    const svg = porClave('linea-vs-banda')
    const cs = curvas(svg, 100)
    if (cs.length !== 2) throw new Error(`se esperaban 2 curvas y hay ${cs.length}`)
    cs.sort((a, b) => a.pts[0][0] - b.pts[0][0])
    const medir = (pts) => {
      const base = Math.max(...pts.map((p) => p[1]))
      const cima = Math.min(...pts.map((p) => p[1]))
      const dentro = pts.filter((p) => p[1] <= (base + cima) / 2).map((p) => p[0])
      return { ancho: Math.max(...dentro) - Math.min(...dentro), altura: base - cima }
    }
    const banda = medir(cs[0].pts)
    const linea = medir(cs[1].pts)
    if (Math.abs(banda.altura - linea.altura) > 1) {
      throw new Error(
        `las dos curvas deben tener la MISMA altura (${banda.altura.toFixed(1)} vs ${linea.altura.toFixed(1)}): si no, se lee intensidad y no anchura`,
      )
    }
    const razon = banda.ancho / linea.ancho
    if (!(razon >= 8)) throw new Error(`la banda solo es ${razon.toFixed(1)}× más ancha que la línea`)
    return `anchura a media altura: banda ${banda.ancho.toFixed(1)} px, línea ${linea.ancho.toFixed(1)} px → ${razon.toFixed(0)}×, misma altura`
  })

  control('Lámpara · el cátodo es HUECO y el haz nace en su cavidad', () => {
    const svg = porClave('lampara-catodo-hueco')
    const catodo = [...svg.querySelectorAll('path')].find((p) => p.getAttribute('d').startsWith('M150 72'))
    if (!catodo) throw new Error('no encuentro el cátodo')
    const haz = [...svg.querySelectorAll('line')].find((l) => l.getAttribute('stroke') === ROJO)
    if (!haz) throw new Error('no encuentro el haz')
    const x1 = Number(haz.getAttribute('x1'))
    const y1 = Number(haz.getAttribute('y1'))
    const caja = catodo.getBBox()
    if (!(x1 >= caja.x && x1 <= caja.x + caja.width)) throw new Error(`el haz arranca en x=${x1}, fuera del cátodo`)
    if (catodo.isPointInFill(new DOMPoint(x1, y1))) {
      throw new Error('el haz arranca dentro del metal: el cátodo no tiene cavidad')
    }
    if (!catodo.isPointInFill(new DOMPoint(caja.x + 6, y1))) {
      throw new Error('el cátodo no tiene pared: no es un cilindro hueco')
    }
    return `cavidad en (${x1}, ${y1}) vacía y pared en (${(caja.x + 6).toFixed(0)}, ${y1}) maciza`
  })

  control('Lámpara · el haz sale por la ventana de cuarzo', () => {
    const svg = porClave('lampara-catodo-hueco')
    const ventana = [...svg.querySelectorAll('rect')].find((r) => r.getAttribute('fill') === '#cfe6f4')
    if (!ventana) throw new Error('no encuentro la ventana')
    const haz = [...svg.querySelectorAll('line')].find((l) => l.getAttribute('stroke') === ROJO)
    const x2 = Number(haz.getAttribute('x2'))
    const y1 = Number(haz.getAttribute('y1'))
    const v = ventana.getBBox()
    if (!(x2 > v.x + v.width)) {
      throw new Error(`el haz muere en x=${x2} y la ventana acaba en ${(v.x + v.width).toFixed(0)}: no llega a salir`)
    }
    if (!(y1 > v.y && y1 < v.y + v.height)) throw new Error('el haz no pasa por la ventana, pasa por el vidrio')
    return `haz hasta x=${x2}, atravesando la ventana [${v.x}, ${(v.x + v.width).toFixed(0)}]`
  })

  control('Desviación de Beer · la curva real arranca pegada y se va por DEBAJO', () => {
    const svg = porClave('desviacion-beer')
    const cs = curvas(svg, 40)
    const real = cs.find((c) => c.el.getAttribute('stroke') === ROJO)
    const ideal = cs.find((c) => c.el.getAttribute('stroke-dasharray') || c.el.getAttribute('strokeDasharray'))
    if (!real || !ideal) throw new Error('no distingo la curva real de la recta ideal')
    const n = Math.min(real.pts.length, ideal.pts.length)
    // en SVG, MAS y es MENOS absorbancia: «por debajo» es y mayor
    const arranque = Math.max(
      ...Array.from({ length: Math.floor(n * 0.1) }, (_, i) => Math.abs(real.pts[i][1] - ideal.pts[i][1])),
    )
    if (arranque > 2) throw new Error(`la curva real no arranca pegada a la ideal: se separa ${arranque.toFixed(1)} px ya al principio`)
    const porEncima = Array.from({ length: n }, (_, i) => ideal.pts[i][1] - real.pts[i][1]).filter((d) => d > 1)
    if (porEncima.length) {
      throw new Error(
        `la curva real se va por ENCIMA de la ideal en ${porEncima.length} punto(s): la desviación de Beer es NEGATIVA`,
      )
    }
    const final = real.pts[n - 1][1] - ideal.pts[n - 1][1]
    if (!(final > 5)) throw new Error(`al final la curva real solo queda ${final.toFixed(1)} px por debajo: no se ve la desviación`)
    return `arranca pegada (${arranque.toFixed(1)} px) y acaba ${final.toFixed(0)} px por debajo, nunca por encima`
  })

  control('Derivadas · el máximo de la 1.ª y el corte de la 2.ª caen en el mismo punto', () => {
    const svg = porClave('derivadas-valoracion')
    const marcas = [...svg.querySelectorAll('line')].filter((l) => l.getAttribute('stroke') === ROJO)
    if (marcas.length !== 2) throw new Error(`se esperaban 2 marcas del punto de equivalencia y hay ${marcas.length}`)
    const xPE = Number(marcas[0].getAttribute('x1'))
    if (Number(marcas[1].getAttribute('x1')) !== xPE) throw new Error('las dos marcas no están en la misma abscisa')
    const cs = curvas(svg, 40).sort((a, b) => a.pts[0][1] - b.pts[0][1])
    const [d1, d2] = cs
    const cima = d1.pts.reduce((a, b) => (b[1] < a[1] ? b : a))
    if (Math.abs(cima[0] - xPE) > 2) {
      throw new Error(`el máximo de la 1.ª derivada cae en x=${cima[0].toFixed(0)} y la marca está en x=${xPE}`)
    }
    const ys = d2.pts.map((p) => p[1])
    const medio = (Math.max(...ys) + Math.min(...ys)) / 2
    let corte = null
    for (let i = 1; i < d2.pts.length; i++) {
      if (d2.pts[i - 1][1] >= medio !== d2.pts[i][1] >= medio) {
        if (corte === null || Math.abs(d2.pts[i][0] - xPE) < Math.abs(corte - xPE)) corte = d2.pts[i][0]
      }
    }
    if (corte === null || Math.abs(corte - xPE) > 2) {
      throw new Error(`el corte con cero de la 2.ª derivada cae en x=${corte?.toFixed(0)} y la marca está en x=${xPE}`)
    }
    return `máximo de Δ en x=${cima[0].toFixed(0)}, corte de Δ² en x=${corte.toFixed(0)}, marca en x=${xPE}`
  })

  return resultados
}

/* ------------------------------------------------------------------ */

const SABOTAJES = {
  1: 'el monocromador de la absorción atómica, movido delante del atomizador',
  2: 'el monocromador del espectrofotómetro, movido detrás de la cubeta',
  3: 'el programa del horno, con la calcinación tan fría como el secado',
  4: 'el pico de absorbancia, desplazado a la calcinación',
  5: 'la marca de 2000-3000 °C, bajada a la altura del secado',
  6: 'la línea atómica, ensanchada hasta parecerse a la banda molecular',
  7: 'la cavidad del cátodo hueco, rellenada de metal',
  8: 'el haz de la lámpara, cortado antes de la ventana',
  9: 'la curva de Beer, levantada por encima de la recta ideal',
  10: 'las marcas del punto de equivalencia, movidas fuera de las curvas',
  11: 'un esquema del catálogo, encogido por debajo de su tamaño natural',
  12: 'un rótulo, sacado fuera del lienzo',
}
/**
 * Que control(es) debe tumbar cada sabotaje, por su indice en los resultados.
 *
 * Casi todos tumban uno. El 3 tumba DOS a proposito: las marcas de temperatura
 * se dibujan a la altura de su escalon, asi que no se puede aplanar la escalera
 * sin divorciar ademas una etiqueta de su meseta. Se declara en vez de
 * disimularlo, porque lo que importa es que no tumbe NINGUN otro.
 */
const CONTROL_DE = {
  1: [2],
  2: [3],
  3: [4, 6],
  4: [5],
  5: [6],
  6: [7],
  7: [8],
  8: [9],
  9: [10],
  10: [11],
  11: [0],
  12: [1],
}

async function main() {
  const servidor = await decidirBase(PUERTO)
  const nav = await puppeteer.launch({
    executablePath: buscarChrome(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })

  let fallos = 0
  try {
    const suelto = argumento('sabotaje')
    const lista = bandera('sabotajes')
      ? Object.keys(SABOTAJES).map(Number)
      : suelto
        ? [Number(suelto)]
        : [0]

    for (const sab of lista) {
      const pag = await nav.newPage()
      await pag.setViewport({ width: 1500, height: 1000 })
      await pag.goto(new URL('#/figuras', servidor.base).href, { waitUntil: 'networkidle0' })
      await pag.waitForSelector('svg.figura-esquema')
      const resultados = await pag.evaluate(medir, sab, ROJO)
      await pag.close()

      if (!sab) {
        console.log('\n=== Esquemas ===')
        for (const r of resultados) {
          console.log(`${r.estado === 'ok' ? 'OK   ' : 'FALLA'} ${r.nombre}`)
          console.log(`      ${r.detalle}`)
        }
        const malos = resultados.filter((r) => r.estado === 'falla').length
        fallos += malos
        console.log(`\n${resultados.length - malos}/${resultados.length} controles pasan.`)
        continue
      }

      const esperados = CONTROL_DE[sab]
      const caidos = resultados.map((r, i) => (r.estado === 'falla' ? i : -1)).filter((i) => i >= 0)
      const faltan = esperados.filter((i) => !caidos.includes(i))
      const sobran = caidos.filter((i) => !esperados.includes(i))
      const nombres = (is) => is.map((i) => `«${resultados[i].nombre}»`).join(', ')
      if (faltan.length) {
        console.log(`FALLA Sabotaje ${sab} NO fue detectado: ${nombres(faltan)} siguió pasando`)
        fallos++
      } else if (sobran.length) {
        console.log(`FALLA Sabotaje ${sab} tumbó de más: ${nombres(sobran)}`)
        fallos++
      } else {
        console.log(`OK    Sabotaje ${sab} (${SABOTAJES[sab]})`)
        for (const i of esperados) {
          console.log(`        lo caza «${resultados[i].nombre}»: ${resultados[i].detalle}`)
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
