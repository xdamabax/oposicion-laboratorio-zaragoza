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

  /**
   * Color de trazo EFECTIVO. Muchos dibujos ponen el `stroke` en el <g> que
   * agrupa, no en cada linea, asi que getAttribute('stroke') devuelve null y un
   * selector por color se queda sin encontrar nada.
   */
  const trazoDe = (el) => el.getAttribute('stroke') ?? el.closest('[stroke]')?.getAttribute('stroke')

  /**
   * Piezas marcadas con `data-pieza` en el dibujo.
   *
   * Los esquemas antiguos se localizan por color y por forma, que es lo mas
   * barato cuando la pieza es unica. En los opticos no lo es: hay dos
   * detectores identicos y dos haces del mismo rojo, y lo que se afirma es
   * justo CUAL es cual. Antes que adivinarlo con heuristicas fragiles, el
   * dibujo lo dice: es la misma idea que el `data-listo` de la vista de
   * impresion.
   */
  const pieza = (svg, nombre) => {
    const el = svg.querySelector(`[data-pieza="${nombre}"]`)
    if (!el) throw new Error(`falta la pieza "${nombre}"`)
    return el
  }
  const piezas = (svg, nombre) => {
    const els = [...svg.querySelectorAll(`[data-pieza="${nombre}"]`)]
    if (!els.length) throw new Error(`no hay ninguna pieza "${nombre}"`)
    return els
  }

  const centroCaja = (el) => {
    const c = el.getBBox()
    return [c.x + c.width / 2, c.y + c.height / 2]
  }

  const num = (el, atributo) => Number(el.getAttribute(atributo))

  /** Angulo de una recta respecto de la VERTICAL, en (-90, 90]. */
  const desdeVertical = (l) => {
    const dx = num(l, 'x2') - num(l, 'x1')
    const dy = num(l, 'y2') - num(l, 'y1')
    let a = (Math.atan2(dx, dy) * 180) / Math.PI
    if (a > 90) a -= 180
    if (a <= -90) a += 180
    return a
  }

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

  if (sabotaje === 13) {
    const svg = porClave('antorcha-icp')
    const muestra = [...svg.querySelectorAll('line')].find(
      (l) => Number(l.getAttribute('x1')) === 108 && l.getAttribute('stroke') === ROJO,
    )
    // la muestra entra por la corona exterior en vez de por el tubo central
    muestra.setAttribute('y1', '86')
    muestra.setAttribute('y2', '86')
  }
  if (sabotaje === 14) {
    const svg = porClave('antorcha-icp')
    const marca = [...svg.querySelectorAll('line')].find(
      (l) =>
        trazoDe(l) === ROJO &&
        l.getAttribute('x1') === l.getAttribute('x2') &&
        !l.getAttribute('stroke-dasharray'),
    )
    // la zona de medida se pinta ANTES de la bobina, dentro de la antorcha
    marca.setAttribute('x1', '200')
    marca.setAttribute('x2', '200')
  }
  if (sabotaje === 15) {
    const svg = porClave('icp-ms')
    // el cuadrupolo se rotula al principio de la cadena
    ;[...svg.querySelectorAll('text')]
      .find((t) => t.textContent.trim() === 'Cuadrupolo')
      .setAttribute('x', '100')
  }
  if (sabotaje === 16) {
    const svg = porClave('icp-ms')
    const texto = (t) => [...svg.querySelectorAll('text')].find((e) => e.textContent.trim() === t)
    // las presiones, del revés: el vacío antes que la atmósfera
    const alta = texto('1 atm')
    const baja = texto('≈ 10⁻⁵ torr')
    const x = alta.getAttribute('x')
    alta.setAttribute('x', baja.getAttribute('x'))
    baja.setAttribute('x', x)
  }

  if (sabotaje === 17) {
    const svg = porClave('nefelometro-turbidimetro')
    const d90 = pieza(svg, 'detector-90')
    // el detector de nefelometria, puesto EN LINEA con la fuente
    d90.setAttribute('x', '420')
    d90.setAttribute('y', '52')
  }
  if (sabotaje === 18) {
    const svg = porClave('nefelometro-turbidimetro')
    // el haz sale de la cubeta igual de grueso que entro: no se ha atenuado
    pieza(svg, 'haz-transmitido').setAttribute(
      'stroke-width',
      pieza(svg, 'haz-incidente').getAttribute('stroke-width'),
    )
  }
  if (sabotaje === 19) {
    const svg = porClave('refractometro-abbe')
    // el rayo refractado se ALEJA de la normal, como si el prisma fuera menos denso
    const r = pieza(svg, 'rayo-refractado')
    r.setAttribute('x2', '196')
    r.setAttribute('y2', '118')
  }
  if (sabotaje === 20) {
    const svg = porClave('refractometro-abbe')
    // la linea claro/oscuro, descentrada respecto de la cruz del reticulo
    const f = pieza(svg, 'frontera')
    f.setAttribute('y1', '132')
    f.setAttribute('y2', '132')
  }
  if (sabotaje === 21) {
    const svg = porClave('polarimetro')
    const tubo = pieza(svg, 'tubo').getBBox()
    // el plano ya sale girado del polarizador: el giro deja de ser cosa del tubo
    for (const l of piezas(svg, 'plano')) {
      const cx = (num(l, 'x1') + num(l, 'x2')) / 2
      const cy = (num(l, 'y1') + num(l, 'y2')) / 2
      if (cx > tubo.x) continue
      const h = Math.abs(num(l, 'y2') - cy)
      l.setAttribute('x1', cx - h * 0.5)
      l.setAttribute('y1', cy - h * 0.866)
      l.setAttribute('x2', cx + h * 0.5)
      l.setAttribute('y2', cy + h * 0.866)
    }
  }
  if (sabotaje === 22) {
    const svg = porClave('polarimetro')
    // el analizador se queda vertical, sin seguir al plano
    for (const l of piezas(svg, 'analizador')) {
      const cx = (num(l, 'x1') + num(l, 'x2')) / 2
      l.setAttribute('x1', cx)
      l.setAttribute('x2', cx)
    }
  }
  if (sabotaje === 23) {
    const svg = porClave('polarimetro')
    // el fallo real: la laja, girada al reves que su propia rejilla
    const laja = pieza(svg, 'analizador-laja')
    const n = laja.getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number)
    const d = []
    for (let i = 0; i + 1 < n.length; i += 2) d.push(`${i ? 'L' : 'M'}${856 - n[i]} ${n[i + 1]}`)
    laja.setAttribute('d', `${d.join(' ')} Z`)
  }
  if (sabotaje === 24) {
    const svg = porClave('cromatograma')
    // el tiempo muerto, llevado detras del primer pico: deja de ser el primero
    const tm = pieza(svg, 'tm')
    tm.setAttribute('x1', 230)
    tm.setAttribute('x2', 230)
  }
  if (sabotaje === 25) {
    const svg = porClave('cromatograma')
    // se ensancha el pico B y no se toca el numero escrito: la cuenta deja de salir
    const w = pieza(svg, 'w-b')
    w.setAttribute('x1', num(w, 'x1') - 16)
    w.setAttribute('x2', num(w, 'x2') + 16)
  }
  if (sabotaje === 26) {
    const svg = porClave('cromatografo-ionico')
    // el rotulo de la precolumna, detras del de la columna: el orden se rompe
    const t = [...svg.querySelectorAll('text')].find((e) => e.textContent.trim() === 'Precolumna')
    if (t) t.setAttribute('x', 340)
  }
  if (sabotaje === 27) {
    const svg = porClave('cromatografo-ionico')
    // el supresor, detras del detector: quedaria midiendo con el fondo sin rebajar
    pieza(svg, 'supresor').setAttribute('x', 502)
  }
  if (sabotaje === 28) {
    const svg = porClave('purga-y-trampa')
    // el tubo de purga, subido por encima del agua: dejaria de burbujear a traves
    const t = pieza(svg, 'entrada-purga')
    t.setAttribute('y2', 74)
  }
  if (sabotaje === 29) {
    const svg = porClave('purga-y-trampa')
    // la aguja del espacio de cabeza, hundida en el agua: ya no seria espacio de cabeza
    pieza(svg, 'aguja-hs').setAttribute('y2', 140)
  }
  if (sabotaje === 30) {
    const svg = porClave('cromatografo-gases')
    // el detector, rotulado antes del inyector
    const t = [...svg.querySelectorAll('text')].find((e) => e.textContent.trim() === 'Detector')
    if (t) t.setAttribute('x', 95)
  }
  if (sabotaje === 31) {
    const svg = porClave('cromatografo-gases')
    // la columna, sacada fuera del horno
    const c = pieza(svg, 'columna')
    c.setAttribute('d', puntos(c).map(([x, y], i) => `${i ? 'L' : 'M'}${x - 170} ${y}`).join(' '))
  }
  if (sabotaje === 32) {
    const svg = porClave('fase-normal-vs-inversa')
    // los dos paneles iguales: el polar sale primero tambien en fase normal
    const c = pieza(svg, 'pico-polar-normal')
    c.setAttribute('d', puntos(c).map(([x, y], i) => `${i ? 'L' : 'M'}${x - 150} ${y}`).join(' '))
  }
  if (sabotaje === 33) {
    const svg = porClave('fase-normal-vs-inversa')
    // y al reves en el otro panel: el polar, retrasado detras del apolar
    const c = pieza(svg, 'pico-polar-inversa')
    c.setAttribute('d', puntos(c).map(([x, y], i) => `${i ? 'L' : 'M'}${x + 150} ${y}`).join(' '))
  }
  if (sabotaje === 34) {
    const svg = porClave('gradiente-elucion')
    // el gradiente, aplanado: dejaria de ser un gradiente
    pieza(svg, 'perfil-gradiente').setAttribute('y2', 72)
  }
  if (sabotaje === 35) {
    const svg = porClave('gradiente-elucion')
    // el ultimo pico del gradiente, ensanchado como el de la isocratica
    const c = pieza(svg, 'ultimo-gradiente')
    const pts = puntos(c)
    const cx = pts.reduce((m, q) => (q[1] < m[1] ? q : m), pts[0])[0]
    c.setAttribute('d', pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(cx + (x - cx) * 3.6).toFixed(1)} ${y}`).join(' '))
  }

  if (sabotaje === 36) {
    const svg = porClave('cloracion-punto-ruptura')
    // la curva ya no vuelve a subir: se queda plana desde el punto de ruptura
    const c = pieza(svg, 'curva-cloro')
    const pts = puntos(c)
    let iPico = 0
    while (iPico + 1 < pts.length && pts[iPico + 1][1] <= pts[iPico][1]) iPico++
    let iValle = iPico
    while (iValle + 1 < pts.length && pts[iValle + 1][1] >= pts[iValle][1]) iValle++
    const yValle = pts[iValle][1]
    c.setAttribute(
      'd',
      pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${i > iValle ? yValle : y}`).join(' '),
    )
  }
  if (sabotaje === 37) {
    const svg = porClave('cloracion-punto-ruptura')
    // el cloro libre, rotulado ANTES del punto de ruptura
    const t = [...svg.querySelectorAll('text')].find((e) => e.textContent.trim() === 'cloro libre')
    if (t) t.setAttribute('x', 120)
  }
  if (sabotaje === 38) {
    const svg = porClave('alcalinidad-valoracion')
    // el punto final de la fenolftaleina, despegado de la curva
    const m = pieza(svg, 'marca-fenolftaleina')
    m.setAttribute('x1', num(m, 'x1') + 42)
    m.setAttribute('x2', num(m, 'x2') + 42)
  }
  if (sabotaje === 39) {
    const svg = porClave('alcalinidad-valoracion')
    // un tramo de la curva, levantado: el pH subiria en mitad de la valoracion
    const c = pieza(svg, 'curva-alcalinidad')
    c.setAttribute(
      'd',
      puntos(c)
        .map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${x > 200 && x < 250 ? (y - 22).toFixed(1) : y}`)
        .join(' '),
    )
  }

  if (sabotaje === 40) {
    const svg = porClave('dbo-frente-a-dqo')
    // un tramo tardio de la curva, hundido: la DBO se "desconsumiria"
    const c = pieza(svg, 'curva-dbo')
    c.setAttribute(
      'd',
      puntos(c)
        .map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${x > 300 && x < 360 ? (y + 26).toFixed(1) : y}`)
        .join(' '),
    )
  }
  if (sabotaje === 41) {
    const svg = porClave('dbo-frente-a-dqo')
    // la DQO, por debajo de la DBO ultima: justo lo contrario de lo que pregunta el examen
    const l = pieza(svg, 'nivel-dqo')
    const u = num(pieza(svg, 'nivel-dbou'), 'y1')
    l.setAttribute('y1', u + 18)
    l.setAttribute('y2', u + 18)
  }
  if (sabotaje === 42) {
    const svg = porClave('solidos-del-agua')
    // los disueltos, colgados del mismo sitio que los suspendidos
    pieza(svg, 'caja-disueltos').setAttribute('y', num(pieza(svg, 'caja-suspension'), 'y') + 44)
  }
  if (sabotaje === 43) {
    const svg = porClave('solidos-del-agua')
    // las dos temperaturas, intercambiadas: se calcinaria mas frio que se seca
    const t = pieza(svg, 'rotulo-calcinacion')
    t.textContent = t.textContent.replace('550', '95')
  }

  if (sabotaje === 44) {
    const svg = porClave('nitrogeno-total-fracciones')
    // el corchete de Kjeldahl, estirado hasta tragarse el nitrito
    const c = pieza(svg, 'corchete-kjeldahl')
    const nit = pieza(svg, 'tramo-nitrito')
    const hasta = num(nit, 'x') + num(nit, 'width')
    c.setAttribute('d', c.getAttribute('d').replace(/H[\d.]+/, 'H' + hasta.toFixed(1)))
  }
  if (sabotaje === 45) {
    const svg = porClave('nitrogeno-total-fracciones')
    // el corchete del TOTAL, encogido hasta donde llega el Kjeldahl
    const c = pieza(svg, 'corchete-total')
    const am = pieza(svg, 'tramo-amoniacal')
    const hasta = num(am, 'x') + num(am, 'width')
    c.setAttribute('d', c.getAttribute('d').replace(/H[\d.]+/, 'H' + hasta.toFixed(1)))
  }
  if (sabotaje === 46) {
    const svg = porClave('nca-metales-dureza')
    // el ultimo escalon del cadmio, hundido: la NCA bajaria al endurecerse el agua
    const c = pieza(svg, 'serie-cadmio')
    const pts = puntos(c)
    const corte = pts[Math.floor(pts.length * 0.85)][0]
    c.setAttribute(
      'd',
      pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${x > corte ? (y + 24).toFixed(1) : y}`).join(' '),
    )
  }
  if (sabotaje === 47) {
    const svg = porClave('nca-metales-dureza')
    // el cadmio entero, subido por encima del cobre
    const c = pieza(svg, 'serie-cadmio')
    c.setAttribute('d', puntos(c).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${(y - 90).toFixed(1)}`).join(' '))
  }

  if (sabotaje === 48) {
    const svg = porClave('envase-camara-de-aire')
    // el frasco de microbiologia, lleno hasta la boca: adios camara de aire
    const n = pieza(svg, 'nivel-micro')
    const boca = num(pieza(svg, 'boca-micro'), 'y1')
    n.setAttribute('y1', boca)
    n.setAttribute('y2', boca)
  }
  if (sabotaje === 49) {
    const svg = porClave('envase-camara-de-aire')
    // el neutralizante, echado en el envase fisicoquimico
    const c = pieza(svg, 'neutralizante')
    c.setAttribute('cx', num(c, 'cx') + 252)
  }
  if (sabotaje === 50) {
    const svg = porClave('grifo-tres-objetivos')
    // los dos primeros objetivos, intercambiados
    const a = pieza(svg, 'titulo-a')
    const b = pieza(svg, 'titulo-b')
    const t = a.textContent
    a.textContent = b.textContent
    b.textContent = t
  }
  if (sabotaje === 51) {
    const svg = porClave('grifo-tres-objetivos')
    // la marca del real decreto, corrida al tercer objetivo
    const m = pieza(svg, 'marca-rd')
    m.setAttribute('x1', num(m, 'x1') + 180)
    m.setAttribute('x2', num(m, 'x2') + 180)
  }

  if (sabotaje === 52) {
    const svg = porClave('captacion-pm-y-metales')
    // la bomba, puesta delante del cabezal: aspirar antes de cortar el tamaño
    const cab = pieza(svg, 'etapa-cabezal')
    const bom = pieza(svg, 'etapa-bomba')
    const x = num(cab, 'x')
    cab.setAttribute('x', num(bom, 'x'))
    bom.setAttribute('x', x)
  }
  if (sabotaje === 53) {
    const svg = porClave('captacion-pm-y-metales')
    // digerir primero y pesar despues, que deja el filtro disuelto
    const a = pieza(svg, 'paso-gravimetria')
    const b = pieza(svg, 'paso-metales')
    const t = a.textContent
    a.textContent = b.textContent
    b.textContent = t
  }
  if (sabotaje === 54) {
    const svg = porClave('corte-pm10-pm25')
    // la curva de PM2,5, corrida a la izquierda: cortaria por debajo de 2,5 µm
    const c = pieza(svg, 'curva-pm25')
    let i = -1
    c.setAttribute(
      'd',
      c.getAttribute('d').replace(/-?\d+(?:\.\d+)?/g, (n) => ((i += 1) % 2 === 0 ? Number(n) - 42 : n)),
    )
  }
  if (sabotaje === 55) {
    const svg = porClave('corte-pm10-pm25')
    // un tramo de la curva de PM10 hundido: la eficiencia BAJARIA al crecer el tamaño
    const c = pieza(svg, 'curva-pm10')
    const pts = puntos(c)
    const hundidos = pts.map(([x, y], j) => [x, j > pts.length - 30 ? y + 60 : y])
    c.setAttribute('d', hundidos.map(([x, y], j) => (j ? 'L' : 'M') + x + ' ' + y).join(' '))
  }
  if (sabotaje === 56) {
    const svg = porClave('dianas-veracidad-precision')
    // los rotulos de la diana exacta y de la que falla en todo, intercambiados
    const a = pieza(svg, 'rotulo-vp')
    const b = pieza(svg, 'rotulo-si')
    const t = a.textContent
    a.textContent = b.textContent
    b.textContent = t
  }
  if (sabotaje === 57) {
    const svg = porClave('dianas-veracidad-precision')
    // la diana imprecisa y sesgada, con MAS sesgo que su vecina de fila
    const r = num(pieza(svg, 'anillo-si'), 'r')
    for (const p of piezas(svg, 'impacto-si')) p.setAttribute('cx', num(p, 'cx') + 0.3 * r)
  }
  if (sabotaje === 58) {
    const svg = porClave('incertidumbre-en-cuadratura')
    // la hipotenusa estirada hasta la SUMA de los catetos: sumar en vez de combinar
    const largo = (l) => Math.hypot(num(l, 'x2') - num(l, 'x1'), num(l, 'y2') - num(l, 'y1'))
    const suma = largo(pieza(svg, 'cateto-rw')) + largo(pieza(svg, 'cateto-sesgo'))
    const h = pieza(svg, 'hipotenusa-uc')
    const f = suma / largo(h)
    h.setAttribute('x2', num(h, 'x1') + (num(h, 'x2') - num(h, 'x1')) * f)
    h.setAttribute('y2', num(h, 'y1') + (num(h, 'y2') - num(h, 'y1')) * f)
  }
  if (sabotaje === 59) {
    const svg = porClave('incertidumbre-en-cuadratura')
    // la expandida escrita con k = 3
    pieza(svg, 'cifra-U').textContent = '9,60 %'
  }
  if (sabotaje === 60) {
    const svg = porClave('intervalo-de-trabajo')
    // el LC puesto al doble del LD, en vez de a 10/3
    const x0 = num(pieza(svg, 'recta-ideal'), 'x1')
    const xld = num(pieza(svg, 'marca-ld'), 'x1')
    const m = pieza(svg, 'marca-lc')
    m.setAttribute('x1', x0 + 2 * (xld - x0))
    m.setAttribute('x2', x0 + 2 * (xld - x0))
  }
  if (sabotaje === 61) {
    const svg = porClave('intervalo-de-trabajo')
    // el intervalo de trabajo alargado hasta la meseta
    const t = pieza(svg, 'tramo-trabajo')
    t.setAttribute('x2', num(t, 'x2') + 110)
  }
  if (sabotaje === 62) {
    const svg = porClave('grafico-control-x')
    // el limite de aviso superior puesto a 2,5 s en vez de a 2 s
    const lc = num(pieza(svg, 'linea-central'), 'y1')
    const s = (num(pieza(svg, 'accion-inf'), 'y1') - lc) / 3
    const l = pieza(svg, 'aviso-sup')
    l.setAttribute('y1', lc - 2.5 * s)
    l.setAttribute('y2', lc - 2.5 * s)
  }
  if (sabotaje === 63) {
    const svg = porClave('grafico-control-x')
    // el «dos de tres» sin marcar: se daria por bueno un valor fuera de control
    const marcados = piezas(svg, 'valor-fuera').sort((a, b) => num(a, 'cx') - num(b, 'cx'))
    marcados[marcados.length - 1].setAttribute('data-pieza', 'valor')
  }
  if (sabotaje === 64) {
    const svg = porClave('recta-minimos-cuadrados')
    // la recta inclinada a mano: ya no es la de minimos cuadrados
    const l = pieza(svg, 'recta')
    l.setAttribute('y2', num(l, 'y2') + 12)
  }
  if (sabotaje === 65) {
    const svg = porClave('recta-minimos-cuadrados')
    // un residuo dibujado con el signo cambiado
    const r = piezas(svg, 'residuo').sort((a, b) => num(a, 'x1') - num(b, 'x1'))[2]
    r.setAttribute('y2', 2 * num(r, 'y1') - num(r, 'y2'))
  }
  if (sabotaje === 66) {
    const svg = porClave('cadena-trazabilidad')
    // la incertidumbre del MRC mayor que la del patron de trabajo
    const b = piezas(svg, 'incertidumbre').sort((a, c) => num(a, 'x') - num(c, 'x'))
    const [p, q] = [b[2], b[3]]
    const [wp, wq] = [num(p, 'width'), num(q, 'width')]
    p.setAttribute('x', num(p, 'x') + wp / 2 - wq / 2)
    p.setAttribute('width', wq)
    q.setAttribute('x', num(q, 'x') + wq / 2 - wp / 2)
    q.setAttribute('width', wp)
  }
  if (sabotaje === 68) {
    const svg = porClave('acreditacion-certificacion')
    // una entidad de certificacion «acreditando» a un laboratorio
    const cert = pieza(svg, 'nodo-certificadora')
    const f = piezas(svg, 'acredita').sort((a, b) => num(a, 'x2') - num(b, 'x2'))[0]
    f.setAttribute('x1', num(cert, 'x') + num(cert, 'width') / 2)
    f.setAttribute('y1', num(cert, 'y') + num(cert, 'height'))
  }
  if (sabotaje === 69) {
    const svg = porClave('acreditacion-certificacion')
    // ENAC certificando directamente a la empresa
    const enac = pieza(svg, 'nodo-enac')
    const f = pieza(svg, 'certifica')
    f.setAttribute('x1', num(enac, 'x') + num(enac, 'width') / 2)
    f.setAttribute('y1', num(enac, 'y') + num(enac, 'height'))
  }
  if (sabotaje === 70) {
    const svg = porClave('ciclo-acreditacion')
    // el primer ciclo dibujado de 5 años, como los siguientes
    const t0 = num(pieza(svg, 'tick-0'), 'x1')
    const porMes = (num(pieza(svg, 'tick-108'), 'x1') - t0) / 108
    const l = pieza(svg, 'fin-ciclo-1')
    l.setAttribute('x1', t0 + 60 * porMes)
    l.setAttribute('x2', t0 + 60 * porMes)
  }
  if (sabotaje === 71) {
    const svg = porClave('ciclo-acreditacion')
    // el segundo seguimiento retrasado: 21 meses sin evaluacion en el primer ciclo
    const t0 = num(pieza(svg, 'tick-0'), 'x1')
    const porMes = (num(pieza(svg, 'tick-108'), 'x1') - t0) / 108
    const s = piezas(svg, 'seguimiento').sort((a, b) => num(a, 'cx') - num(b, 'cx'))[1]
    s.setAttribute('cx', num(s, 'cx') + 4 * porMes)
  }
  if (sabotaje === 72) {
    const svg = porClave('estructura-plan-igualdad')
    // la linea B.2 dibujada con un objetivo de menos
    piezas(svg, 'objetivo').sort((a, b) => num(b, 'x') - num(a, 'x'))[0].remove()
  }
  if (sabotaje === 73) {
    const svg = porClave('estructura-plan-igualdad')
    // el total del eje C, escrito con uno de mas
    const t = piezas(svg, 'total-eje').sort((a, b) => a.getBBox().y - b.getBBox().y)[2]
    t.textContent = String(Number(t.textContent) + 1)
  }
  if (sabotaje === 74) {
    const svg = porClave('circuito-protocolo-acoso')
    // la denuncia llevada directamente al Comite, saltandose la Asesoria
    const f = piezas(svg, 'flecha').sort((a, b) => num(a, 'x1') - num(b, 'x1'))[0]
    const c = pieza(svg, 'nodo-comite')
    f.setAttribute('x2', num(c, 'x'))
    f.setAttribute('y2', num(c, 'y') + num(c, 'height') / 2)
  }
  if (sabotaje === 75) {
    const svg = porClave('circuito-protocolo-acoso')
    // el informal sin acuerdo mandado a Relaciones Laborales, sin pasar por el Comite
    const inf = pieza(svg, 'nodo-informal')
    const f = piezas(svg, 'flecha').find((l) => Math.abs(num(l, 'x1') - (num(inf, 'x') + num(inf, 'width'))) < 1)
    const r = pieza(svg, 'nodo-relaciones')
    f.setAttribute('x2', num(r, 'x') + num(r, 'width') / 2)
    f.setAttribute('y2', num(r, 'y'))
  }
  if (sabotaje === 76) {
    const svg = porClave('instituciones-aragon')
    // el Justicia rindiendo cuentas ante el Gobierno en vez de ante las Cortes
    const g = pieza(svg, 'nodo-gobierno')
    const f = pieza(svg, 'rinde-cuentas')
    f.setAttribute('x2', num(g, 'x') + 10)
    f.setAttribute('y2', num(g, 'y') + 10)
  }
  if (sabotaje === 77) {
    const svg = porClave('instituciones-aragon')
    // el Presidente elegido directamente por el pueblo, sin pasar por las Cortes
    const p = pieza(svg, 'nodo-presidente')
    const pueblo = pieza(svg, 'nodo-pueblo')
    const f = piezas(svg, 'elige').find(
      (l) => num(l, 'x2') >= num(p, 'x') && num(l, 'x2') <= num(p, 'x') + num(p, 'width') && Math.abs(num(l, 'y2') - num(p, 'y')) < 2,
    )
    f.setAttribute('x1', num(pueblo, 'x') + num(pueblo, 'width') - 10)
    f.setAttribute('y1', num(pueblo, 'y') + num(pueblo, 'height'))
  }
  if (sabotaje === 78) {
    const svg = porClave('clases-competencias')
    // en las ejecutivas, el desarrollo normativo pintado como de Aragon
    const ley = pieza(svg, 'leyenda-aragon')
    const celdas = piezas(svg, 'celda').sort((a, b) => num(a, 'y') - num(b, 'y') || num(a, 'x') - num(b, 'x'))
    const c = celdas[5]
    c.setAttribute('fill', ley.getAttribute('fill'))
    c.setAttribute('fill-opacity', ley.getAttribute('fill-opacity'))
  }
  if (sabotaje === 79) {
    const svg = porClave('clases-competencias')
    // los articulos de las compartidas y las ejecutivas, cambiados de columna
    const a = piezas(svg, 'articulo').sort((p, q) => num(p, 'x') - num(q, 'x'))
    const [t1, t2] = [a[1].textContent, a[2].textContent]
    a[1].textContent = t2
    a[2].textContent = t1
  }
  if (sabotaje === 80) {
    const svg = porClave('plazos-procedimiento')
    // la audiencia alargada a 20 dias, y su cifra con ella: dibujo y rotulo de acuerdo, pero contra la ley
    const t0 = num(pieza(svg, 'tick-0'), 'x1')
    const porDia = (num(pieza(svg, 'tick-35'), 'x1') - t0) / 35
    const tramos = piezas(svg, 'tramo').sort((a, b) => num(a, 'width') - num(b, 'width'))
    const audiencia = tramos[0]
    audiencia.setAttribute('width', 10 * porDia)
    const cy = num(audiencia, 'y') + num(audiencia, 'height') / 2
    const cifra = piezas(svg, 'cifra').find((c) => {
      const b = c.getBBox()
      return Math.abs(b.y + b.height / 2 - cy) < 10
    })
    cifra.textContent = '10 a 20 días'
  }
  if (sabotaje === 81) {
    const svg = porClave('plazos-procedimiento')
    // la cifra del periodo de prueba, escrita distinta de lo que dibuja la barra
    const cifra = piezas(svg, 'cifra').find((c) => c.textContent.trim() === '10 a 30 días')
    cifra.textContent = '10 a 20 días'
  }
  if (sabotaje === 82) {
    const svg = porClave('fases-procedimiento')
    // de la iniciacion a la instruccion, saltandose la ordenacion
    const f = piezas(svg, 'fase').sort((a, b) => num(a, 'x1') - num(b, 'x1'))[0]
    f.setAttribute('x2', num(pieza(svg, 'nodo-instruccion'), 'x'))
  }
  if (sabotaje === 83) {
    const svg = porClave('fases-procedimiento')
    // la denuncia colgada de la solicitud del interesado
    const f = piezas(svg, 'via').sort((a, b) => num(b, 'y1') - num(a, 'y1'))[0]
    const s = pieza(svg, 'nodo-solicitud')
    f.setAttribute('x2', num(s, 'x') + num(s, 'width'))
    f.setAttribute('y2', num(s, 'y') + num(s, 'height') / 2)
  }
  if (sabotaje === 67) {
    const svg = porClave('cadena-trazabilidad')
    // una flecha que no llega al eslabon siguiente: la cadena se interrumpe
    const f = piezas(svg, 'flecha').sort((a, b) => num(a, 'x1') - num(b, 'x1'))[1]
    f.setAttribute('x2', num(f, 'x2') - 12)
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

  control('Antorcha · tres tubos concéntricos y la muestra por el CENTRAL', () => {
    const svg = porClave('antorcha-icp')
    // cada tubo es un path "M x1 y H x0 V y H x1"; el plasma y las flechas no lo son
    const tubos = [...svg.querySelectorAll('path')]
      .filter((p) => /^M[\d.]+ [\d.]+ H[\d.]+ V[\d.]+ H[\d.]+$/.test(p.getAttribute('d').trim()))
      .map((p) => {
        const n = p.getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number)
        return { arriba: n[1], abajo: n[3], centro: (n[1] + n[3]) / 2, semi: (n[3] - n[1]) / 2 }
      })
      .sort((a, b) => b.semi - a.semi)
    if (tubos.length !== 3) throw new Error(`se esperaban 3 tubos y hay ${tubos.length}`)

    const centros = tubos.map((t) => t.centro)
    if (Math.max(...centros) - Math.min(...centros) > 0.5) {
      throw new Error(`los tres tubos no comparten eje: centros en ${centros.join(', ')}`)
    }
    for (let i = 1; i < 3; i++) {
      if (!(tubos[i].arriba > tubos[i - 1].arriba && tubos[i].abajo < tubos[i - 1].abajo)) {
        throw new Error('los tubos no están anidados uno dentro de otro')
      }
    }

    const central = tubos[2]
    const entradas = [...svg.querySelectorAll('line')].filter(
      (l) => Number(l.getAttribute('x1')) === 108,
    )
    if (entradas.length !== 3) throw new Error(`se esperaban 3 entradas y hay ${entradas.length}`)
    const muestra = entradas.find((l) => l.getAttribute('stroke') === ROJO)
    if (!muestra) throw new Error('no encuentro la entrada de muestra')
    const y = Number(muestra.getAttribute('y1'))
    if (!(y > central.arriba && y < central.abajo)) {
      throw new Error(
        `la muestra entra a y=${y}, fuera del tubo central [${central.arriba}, ${central.abajo}]`,
      )
    }
    const gasesDentro = entradas
      .filter((l) => l !== muestra)
      .map((l) => Number(l.getAttribute('y1')))
      .filter((gy) => gy > central.arriba && gy < central.abajo)
    if (gasesDentro.length) throw new Error('un argón entra también por el tubo central')
    return `semianchos ${tubos.map((t) => t.semi).join(' > ')}, eje común en ${central.centro}, muestra a y=${y}`
  })

  control('Antorcha · la zona de medida, dentro del plasma y detrás de la bobina', () => {
    const svg = porClave('antorcha-icp')
    const espiras = [...svg.querySelectorAll('ellipse')].map((e) => Number(e.getAttribute('cx')))
    if (espiras.length !== 3) throw new Error(`se esperaban 3 espiras y hay ${espiras.length}`)
    const bobina = Math.max(...espiras)

    const marca = [...svg.querySelectorAll('line')].find(
      (l) =>
        trazoDe(l) === ROJO &&
        l.getAttribute('x1') === l.getAttribute('x2') &&
        !l.getAttribute('stroke-dasharray'),
    )
    if (!marca) throw new Error('no encuentro la marca de la zona de medida')
    const x = Number(marca.getAttribute('x1'))
    if (!(x > bobina)) {
      throw new Error(`la zona de medida (x=${x}) no queda detrás de la bobina (x=${bobina})`)
    }
    const plasma = [...svg.querySelectorAll('path')].find((p) => p.getAttribute('fill') === '#cfe6f4')
    if (!plasma) throw new Error('no encuentro el plasma')
    const caja = plasma.getBBox()
    if (!(x > caja.x && x < caja.x + caja.width)) {
      throw new Error(`la zona de medida (x=${x}) cae fuera del plasma`)
    }
    const base = centroX(svg, 'base: hasta 10 000 K')
    const zona = centroX(svg, 'zona de medida: 6 000 - 8 000 K')
    if (!(base < zona)) {
      throw new Error(`la base (x=${base.toFixed(0)}) debería quedar antes de la zona de medida (x=${zona.toFixed(0)})`)
    }
    return `bobina hasta x=${bobina}, zona en x=${x} dentro del plasma [${caja.x.toFixed(0)}, ${(caja.x + caja.width).toFixed(0)}]`
  })

  control('ICP-MS · las etapas van en orden', () =>
    enOrden(porClave('icp-ms'), [
      'Nebulizador',
      'Antorcha y plasma',
      'Interfase',
      'Lentes iónicas',
      'Cuadrupolo',
      'Detector',
    ]),
  )

  control('ICP-MS · la presión CAE a lo largo del camino', () => {
    const svg = porClave('icp-ms')
    // declaradas de MAYOR a menor presión: sus rótulos han de ir de izquierda a derecha
    const zonas = ['1 atm', '≈ 1 torr', '≈ 10⁻⁵ torr']
    const xs = zonas.map((z) => [z, centroX(svg, z)])
    for (let i = 1; i < xs.length; i++) {
      if (!(xs[i][1] > xs[i - 1][1])) {
        throw new Error(
          `«${xs[i][0]}» (x=${xs[i][1].toFixed(0)}) debería ir después de «${xs[i - 1][0]}» (x=${xs[i - 1][1].toFixed(0)}): la presión tiene que caer`,
        )
      }
    }
    return xs.map(([z, x]) => `${z}@${x.toFixed(0)}`).join(' → ')
  })

  control('Turbidez · nefelometría A 90° y turbidimetría EN LÍNEA', () => {
    const svg = porClave('nefelometro-turbidimetro')
    const [cx, cy] = centroCaja(pieza(svg, 'cubeta'))
    // el haz incidente viaja en +x: el angulo se mide contra esa direccion
    const angulo = (nombre) => {
      const [dx, dy] = centroCaja(pieza(svg, nombre))
      return (Math.atan2(dy - cy, dx - cx) * 180) / Math.PI
    }
    const linea = angulo('detector-180')
    const noventa = angulo('detector-90')
    if (Math.abs(linea) > 3) {
      throw new Error(`el detector de turbidimetría está a ${linea.toFixed(1)}°, no en línea con el haz`)
    }
    if (Math.abs(Math.abs(noventa) - 90) > 3) {
      throw new Error(
        `el detector de nefelometría está a ${noventa.toFixed(1)}° y la norma lo pone a 90°: así mediría atenuación, no dispersión`,
      )
    }
    return `turbidimetría a ${linea.toFixed(1)}° (en línea) y nefelometría a ${Math.abs(noventa).toFixed(1)}°`
  })

  control('Turbidez · el haz sale de la cubeta ATENUADO', () => {
    const svg = porClave('nefelometro-turbidimetro')
    const entra = Number(pieza(svg, 'haz-incidente').getAttribute('stroke-width'))
    const sale = Number(pieza(svg, 'haz-transmitido').getAttribute('stroke-width'))
    if (!(sale < entra * 0.8)) {
      throw new Error(
        `entra con ${entra} y sale con ${sale}: si no adelgaza, el dibujo no enseña que la suspensión atenúa el haz`,
      )
    }
    return `${entra} px al entrar y ${sale} px al salir: atenuación visible`
  })

  control('Refractómetro · el rayo SE ACERCA a la normal al entrar en el prisma', () => {
    const svg = porClave('refractometro-abbe')
    const normal = pieza(svg, 'normal')
    if (num(normal, 'x1') !== num(normal, 'x2')) throw new Error('la normal no está dibujada vertical')
    const i = Math.abs(desdeVertical(pieza(svg, 'rayo-incidente')))
    const r = Math.abs(desdeVertical(pieza(svg, 'rayo-refractado')))
    if (!(r < i)) {
      throw new Error(
        `refracción ${r.toFixed(1)}° e incidencia ${i.toFixed(1)}°: el rayo se aleja de la normal, que es lo que pasaría si el prisma fuera MENOS denso que la muestra`,
      )
    }
    if (!(i - r >= 20)) {
      throw new Error(`solo se desvía ${(i - r).toFixed(1)}°: el ángulo límite no se distingue`)
    }
    return `incidencia ${i.toFixed(1)}° → refracción ${r.toFixed(1)}° (${(i - r).toFixed(0)}° más cerca de la normal)`
  })

  control('Refractómetro · la línea claro/oscuro cae en la cruz del retículo', () => {
    const svg = porClave('refractometro-abbe')
    const ocular = pieza(svg, 'ocular')
    const cy = Number(ocular.getAttribute('cy'))
    const cx = Number(ocular.getAttribute('cx'))
    const r = Number(ocular.getAttribute('r'))
    const f = pieza(svg, 'frontera')
    if (num(f, 'y1') !== num(f, 'y2')) throw new Error('la línea de separación no está horizontal')
    const desvio = Math.abs(num(f, 'y1') - cy)
    if (desvio > 1) {
      throw new Error(
        `la línea va por y=${num(f, 'y1')} y la cruz está en y=${cy}: descentrada ${desvio.toFixed(1)} px, que es justo la lectura mal hecha`,
      )
    }
    if (num(f, 'x1') > cx - r + 1 || num(f, 'x2') < cx + r - 1) {
      throw new Error('la línea no cruza todo el campo del ocular')
    }
    return `línea en y=${num(f, 'y1')} y cruz en y=${cy}, de lado a lado del campo`
  })

  control('Polarímetro · el plano de polarización solo gira EN EL TUBO', () => {
    const svg = porClave('polarimetro')
    const tubo = pieza(svg, 'tubo').getBBox()
    const marcas = piezas(svg, 'plano').map((l) => ({
      x: (num(l, 'x1') + num(l, 'x2')) / 2,
      a: desdeVertical(l),
    }))
    const antes = marcas.filter((m) => m.x < tubo.x)
    const despues = marcas.filter((m) => m.x > tubo.x + tubo.width)
    if (!antes.length || !despues.length) throw new Error('faltan marcas del plano a un lado del tubo')

    const torcida = antes.find((m) => Math.abs(m.a) > 1)
    if (torcida) {
      throw new Error(
        `una marca anterior al tubo ya va girada ${torcida.a.toFixed(1)}°: el giro dejaría de ser cosa de la muestra`,
      )
    }
    const alfa = despues[0].a
    if (Math.abs(alfa) < 10) throw new Error(`a la salida el plano solo gira ${alfa.toFixed(1)}°: no se ve`)
    const suelta = despues.find((m) => Math.abs(m.a - alfa) > 1)
    if (suelta) {
      throw new Error(`las marcas de salida no coinciden: ${alfa.toFixed(1)}° y ${suelta.a.toFixed(1)}°`)
    }
    return `${antes.length} marcas verticales antes del tubo y ${despues.length} giradas ${alfa.toFixed(0)}° después`
  })

  control('Polarímetro · el analizador va girado el MISMO ángulo que el plano', () => {
    const svg = porClave('polarimetro')
    const tubo = pieza(svg, 'tubo').getBBox()
    const salida = piezas(svg, 'plano')
      .filter((l) => (num(l, 'x1') + num(l, 'x2')) / 2 > tubo.x + tubo.width)
      .map(desdeVertical)
    if (!salida.length) throw new Error('no hay marcas del plano a la salida del tubo')
    const alfa = salida[0]

    const rejilla = piezas(svg, 'analizador').map(desdeVertical)
    const mal = rejilla.find((a) => Math.abs(a - alfa) > 1.5)
    if (mal !== undefined) {
      throw new Error(
        `el analizador va a ${mal.toFixed(1)}° y el plano sale a ${alfa.toFixed(1)}°: así no dejaría pasar la luz`,
      )
    }

    /*
     * Y el CONTORNO de la laja, no solo su rejilla. Mirar solo la rejilla dejo
     * pasar el fallo de verdad: la laja se dibujo girada al reves -la matriz de
     * giro de toda la vida gira al contrario cuando la y crece hacia abajo- y
     * salio cruzada con sus propias lineas, con los controles en verde.
     */
    const v = pieza(svg, 'analizador-laja')
      .getAttribute('d')
      .match(/-?\d+(?:\.\d+)?/g)
      .map(Number)
    const vertices = []
    for (let i = 0; i + 1 < v.length; i += 2) vertices.push([v[i], v[i + 1]])
    if (vertices.length !== 4) throw new Error(`la laja tiene ${vertices.length} vértices y no 4`)
    // el eje de la laja es su arista mas larga
    let eje = null
    for (let i = 0; i < 4; i++) {
      const [x1, y1] = vertices[i]
      const [x2, y2] = vertices[(i + 1) % 4]
      const largo = Math.hypot(x2 - x1, y2 - y1)
      if (!eje || largo > eje.largo) eje = { largo, x1, y1, x2, y2 }
    }
    const angLaja = desdeVertical({ getAttribute: (a) => eje[a] })
    if (Math.abs(angLaja - alfa) > 1.5) {
      throw new Error(
        `la laja del analizador va a ${angLaja.toFixed(1)}° y su rejilla a ${alfa.toFixed(1)}°: está cruzada consigo misma`,
      )
    }
    return `plano a ${alfa.toFixed(1)}°, las ${rejilla.length} líneas del analizador y su laja (${angLaja.toFixed(1)}°), todo igual`
  })

  /*
   * Cromatograma. El dibujo escribe un numero -la resolucion- que se deduce de
   * su propia geometria, asi que puede demostrarlo: se recalcula Rs sobre lo
   * pintado y se exige que coincida con lo escrito. Un cromatograma con los
   * picos bonitos y la resolucion inventada no da ningun error por si solo.
   */
  control('Cromatograma · el tiempo muerto va ANTES que los dos picos, y cada marca en su cima', () => {
    const svg = porClave('cromatograma')
    const equis = (p) => {
      const l = pieza(svg, p)
      return (num(l, 'x1') + num(l, 'x2')) / 2
    }
    const [xm, xa, xb] = ['tm', 'tr-a', 'tr-b'].map(equis)
    if (!(xm < xa && xa < xb)) {
      throw new Error(
        `los tiempos van tM=${xm.toFixed(0)}, tR(A)=${xa.toFixed(0)}, tR(B)=${xb.toFixed(0)}: ` +
          `el tiempo muerto tiene que ser el PRIMERO y tR(A) anterior a tR(B)`,
      )
    }
    // y cada marca ha de caer sobre la cima de SU pico, medida en el trazado
    const cima = (p) => {
      const pts = puntos(pieza(svg, p))
      return pts.reduce((mejor, q) => (q[1] < mejor[1] ? q : mejor), pts[0])[0]
    }
    for (const [marca, pico] of [['tm', 'pico-m'], ['tr-a', 'pico-a'], ['tr-b', 'pico-b']]) {
      const dx = Math.abs(equis(marca) - cima(pico))
      if (dx > 1.5) {
        throw new Error(`la marca "${marca}" cae a ${dx.toFixed(1)} px de la cima de "${pico}"`)
      }
    }
    return `tM=${xm.toFixed(0)} < tR(A)=${xa.toFixed(0)} < tR(B)=${xb.toFixed(0)}, y las tres marcas sobre su cima`
  })

  control('Cromatograma · la resolución escrita coincide con la dibujada', () => {
    const svg = porClave('cromatograma')
    const equis = (p) => {
      const l = pieza(svg, p)
      return (num(l, 'x1') + num(l, 'x2')) / 2
    }
    const ancho = (p) => {
      const l = pieza(svg, p)
      return Math.abs(num(l, 'x2') - num(l, 'x1'))
    }
    const wa = ancho('w-a')
    const wb = ancho('w-b')
    if (!(wa > 0 && wb > 0)) throw new Error('alguna anchura de base mide cero')
    const dibujada = (2 * (equis('tr-b') - equis('tr-a'))) / (wa + wb)

    const rotulo = pieza(svg, 'rs').textContent
    const m = rotulo.match(/Rs\s*=\s*(\d+(?:[.,]\d+)?)/)
    if (!m) throw new Error(`no encuentro el valor de Rs en «${rotulo.trim().slice(0, 40)}»`)
    const escrita = Number(m[1].replace(',', '.'))

    if (Math.abs(dibujada - escrita) > 0.05) {
      throw new Error(
        `el dibujo da Rs = ${dibujada.toFixed(2)} (Δt=${(equis('tr-b') - equis('tr-a')).toFixed(0)}, ` +
          `wA=${wa.toFixed(0)}, wB=${wb.toFixed(0)}) y el rótulo dice ${escrita}`,
      )
    }
    return `dibujada ${dibujada.toFixed(2)} y escrita ${escrita}: wA=${wa.toFixed(0)}, wB=${wb.toFixed(0)}`
  })

  control('Cromatógrafo iónico · las etapas van en orden', () =>
    enOrden(porClave('cromatografo-ionico'), [
      'Eluyente',
      'Bomba',
      'Inyector',
      'Precolumna',
      'Columna',
      'Supresor',
      'Detector',
      'Registro',
    ]),
  )

  control('Cromatógrafo iónico · el supresor va ENTRE la columna y el detector', () => {
    const svg = porClave('cromatografo-ionico')
    const caja = (p) => pieza(svg, p).getBBox()
    const columna = caja('columna')
    const supresor = caja('supresor')
    const detector = caja('detector')
    if (!(supresor.x >= columna.x + columna.width)) {
      throw new Error(
        `el supresor (x=${supresor.x.toFixed(0)}) no queda después de la columna ` +
          `(acaba en ${(columna.x + columna.width).toFixed(0)}): así no rebajaría el fondo del eluyente ya separado`,
      )
    }
    if (!(supresor.x + supresor.width <= detector.x)) {
      throw new Error(
        `el supresor acaba en x=${(supresor.x + supresor.width).toFixed(0)} y el detector empieza en ` +
          `x=${detector.x.toFixed(0)}: el supresor tiene que ir ANTES del detector de conductividad`,
      )
    }
    return `columna hasta ${(columna.x + columna.width).toFixed(0)}, supresor [${supresor.x.toFixed(0)}, ${(supresor.x + supresor.width).toFixed(0)}], detector desde ${detector.x.toFixed(0)}`
  })

  /*
   * Purga y trampa frente a espacio de cabeza. Las dos aislan volatiles de un
   * agua y el examen las ofrece como opciones distintas, asi que lo unico que
   * hay que ver de un vistazo es EN QUE SE DIFERENCIAN. La diferencia es
   * geometrica -donde acaba el tubo respecto del nivel del agua- y por eso se
   * puede comprobar. Ojo con el signo: en SVG la y crece HACIA ABAJO, asi que
   * "por debajo del agua" es y MAYOR.
   */
  const puntaDe = (svg, p) => {
    const l = pieza(svg, p)
    return { x: num(l, 'x1'), arriba: Math.min(num(l, 'y1'), num(l, 'y2')), punta: Math.max(num(l, 'y1'), num(l, 'y2')) }
  }
  const nivelDe = (svg, p) => num(pieza(svg, p), 'y1')

  control('Purga y trampa · el gas entra POR DEBAJO del nivel del agua', () => {
    const svg = porClave('purga-y-trampa')
    const nivel = nivelDe(svg, 'nivel-pt')
    const tubo = puntaDe(svg, 'entrada-purga')
    if (!(tubo.punta > nivel + 5)) {
      throw new Error(
        `la punta del tubo cae en y=${tubo.punta.toFixed(0)} y el nivel del agua está en y=${nivel.toFixed(0)}: ` +
          `el gas tiene que entrar DENTRO del agua para burbujear a través de ella`,
      )
    }
    if (!(tubo.arriba < nivel)) throw new Error('el tubo de purga no viene de fuera del líquido')
    return `nivel en y=${nivel.toFixed(0)}, punta del tubo en y=${tubo.punta.toFixed(0)}: ${(tubo.punta - nivel).toFixed(0)} px sumergida`
  })

  control('Espacio de cabeza · el vapor se toma POR ENCIMA del agua', () => {
    const svg = porClave('purga-y-trampa')
    const nivel = nivelDe(svg, 'nivel-hs')
    const aguja = puntaDe(svg, 'aguja-hs')
    if (!(aguja.punta < nivel - 5)) {
      throw new Error(
        `la punta de la aguja cae en y=${aguja.punta.toFixed(0)} y el nivel del agua está en y=${nivel.toFixed(0)}: ` +
          `en espacio de cabeza la aguja NO toca el agua, toma el vapor de encima`,
      )
    }
    return `nivel en y=${nivel.toFixed(0)}, punta de la aguja en y=${aguja.punta.toFixed(0)}: ${(nivel - aguja.punta).toFixed(0)} px por encima`
  })

  control('CG · las etapas van en orden', () =>
    enOrden(porClave('cromatografo-gases'), ['Gas portador', 'Inyector', 'Horno', 'Detector', 'Registro']),
  )

  control('CG · la columna va DENTRO del horno, y el inyector y el detector FUERA', () => {
    const svg = porClave('cromatografo-gases')
    const caja = (p) => pieza(svg, p).getBBox()
    const horno = caja('horno')
    const columna = caja('columna')
    const dentro = (c) =>
      c.x >= horno.x && c.y >= horno.y && c.x + c.width <= horno.x + horno.width && c.y + c.height <= horno.y + horno.height
    if (!dentro(columna)) {
      throw new Error(
        `la columna ocupa [${columna.x.toFixed(0)}, ${(columna.x + columna.width).toFixed(0)}]×` +
          `[${columna.y.toFixed(0)}, ${(columna.y + columna.height).toFixed(0)}] y el horno ` +
          `[${horno.x.toFixed(0)}, ${(horno.x + horno.width).toFixed(0)}]×[${horno.y.toFixed(0)}, ${(horno.y + horno.height).toFixed(0)}]: ` +
          `en cromatografía de gases la columna va DENTRO del horno`,
      )
    }
    for (const p of ['inyector', 'detector']) {
      const c = caja(p)
      const solapa = c.x < horno.x + horno.width && c.x + c.width > horno.x
      if (solapa) throw new Error(`el ${p} se mete en el horno: se calienta aparte, y a otra temperatura`)
    }
    return `columna dentro del horno, e inyector y detector fuera`
  })

  /*
   * Fase normal frente a fase inversa. Lo unico que de verdad hay que entender
   * del tema 32 es que EL ORDEN DE ELUCION SE INVIERTE, asi que el dibujo lo
   * afirma y esto lo comprueba: se localiza la cima de cada pico sobre el
   * trazado -no sobre su rotulo- y se compara. Un dibujo con los dos paneles
   * iguales enseñaria justo lo contrario y no daria ningun error por si solo.
   */
  const cimaDe = (svg, p) => {
    const pts = puntos(pieza(svg, p))
    return pts.reduce((mejor, q) => (q[1] < mejor[1] ? q : mejor), pts[0])[0]
  }

  control('Fase normal · el soluto POLAR se retiene más y eluye el ÚLTIMO', () => {
    const svg = porClave('fase-normal-vs-inversa')
    const apolar = cimaDe(svg, 'pico-apolar-normal')
    const polar = cimaDe(svg, 'pico-polar-normal')
    if (!(polar > apolar)) {
      throw new Error(
        `en fase normal el pico polar cae en x=${polar.toFixed(0)} y el apolar en x=${apolar.toFixed(0)}: ` +
          `con fase estacionaria POLAR, el soluto polar es el que más se retiene`,
      )
    }
    return `apolar@${apolar.toFixed(0)} < polar@${polar.toFixed(0)}`
  })

  control('Fase inversa · el soluto POLAR eluye el PRIMERO', () => {
    const svg = porClave('fase-normal-vs-inversa')
    const polar = cimaDe(svg, 'pico-polar-inversa')
    const apolar = cimaDe(svg, 'pico-apolar-inversa')
    if (!(polar < apolar)) {
      throw new Error(
        `en fase inversa el pico polar cae en x=${polar.toFixed(0)} y el apolar en x=${apolar.toFixed(0)}: ` +
          `con fase estacionaria APOLAR, el soluto polar es el que menos se retiene`,
      )
    }
    return `polar@${polar.toFixed(0)} < apolar@${apolar.toFixed(0)}`
  })

  control('Gradiente · la composición SUBE con el tiempo y la isocrática se queda PLANA', () => {
    const svg = porClave('gradiente-elucion')
    const iso = pieza(svg, 'perfil-isocratico')
    const gra = pieza(svg, 'perfil-gradiente')
    if (Math.abs(num(iso, 'y2') - num(iso, 'y1')) > 0.5) {
      throw new Error(`el perfil isocrático no es plano: va de y=${num(iso, 'y1')} a y=${num(iso, 'y2')}`)
    }
    // la y crece HACIA ABAJO: que suba el % de disolvente fuerte es que la y BAJE
    const subida = num(gra, 'y1') - num(gra, 'y2')
    if (!(subida > 5)) {
      throw new Error(
        `el perfil del gradiente va de y=${num(gra, 'y1')} a y=${num(gra, 'y2')}: ` +
          `el porcentaje de disolvente fuerte tiene que SUBIR a lo largo de la separación`,
      )
    }
    return `isocrática plana en y=${num(iso, 'y1')}, gradiente sube ${subida.toFixed(0)} px`
  })

  control('Gradiente · el último pico sale MÁS ESTRECHO que en isocrática', () => {
    const svg = porClave('gradiente-elucion')
    const ancho = (p) => pieza(svg, p).getBBox().width
    const iso = ancho('ultimo-isocratico')
    const gra = ancho('ultimo-gradiente')
    if (!(gra < iso * 0.75)) {
      throw new Error(
        `el último pico mide ${gra.toFixed(0)} px en gradiente y ${iso.toFixed(0)} px en isocrática: ` +
          `la razón de ser del gradiente es justo que los picos tardíos NO se ensanchen`,
      )
    }
    return `último pico: ${gra.toFixed(0)} px en gradiente frente a ${iso.toFixed(0)} px en isocrática`
  })

  /*
   * Cloracion al punto de ruptura. La confusion clasica del tema 33 es creer
   * que cuanto mas cloro se echa, mas residual libre queda. La curva dice otra
   * cosa, y aqui se comprueba sobre el trazado: SUBE (se forman cloraminas),
   * BAJA hasta un minimo (se destruyen) y solo entonces VUELVE A SUBIR.
   *
   * El pico y el valle se leen de la FORMA del trazado, no de su maximo: el
   * cloro libre acaba mas alto que las cloraminas, asi que el maximo de todo el
   * dibujo es el ultimo punto y el "minimo posterior" no existiria.
   */
  const quiebre = (svg) => {
    const pts = puntos(pieza(svg, 'curva-cloro'))
    let iPico = 0
    while (iPico + 1 < pts.length && pts[iPico + 1][1] <= pts[iPico][1]) iPico++
    let iValle = iPico
    while (iValle + 1 < pts.length && pts[iValle + 1][1] >= pts[iValle][1]) iValle++
    return { pts, iPico, iValle }
  }

  control('Ruptura · sube, baja hasta un mínimo, y ahí cae la marca', () => {
    const svg = porClave('cloracion-punto-ruptura')
    const { pts, iPico, iValle } = quiebre(svg)
    // la y crece HACIA ABAJO: que el residual suba es que la y baje
    const subida = pts[0][1] - pts[iPico][1]
    const bajada = pts[iValle][1] - pts[iPico][1]
    const rebrote = pts[iValle][1] - pts[pts.length - 1][1]
    if (!(subida > 20)) throw new Error(`la curva no sube al principio: solo ${subida.toFixed(0)} px`)
    if (!(bajada > 20)) throw new Error(`la curva no baja tras el máximo: solo ${bajada.toFixed(0)} px`)
    if (!(rebrote > 20)) {
      throw new Error(
        `la curva no vuelve a subir tras el mínimo (${rebrote.toFixed(0)} px): sin ese rebrote no hay ` +
          `punto de ruptura, que es justo lo que el dibujo tiene que enseñar`,
      )
    }
    const m = num(pieza(svg, 'marca-ruptura'), 'x1')
    if (Math.abs(m - pts[iValle][0]) > 6) {
      throw new Error(
        `la marca está en x=${m.toFixed(0)} y el mínimo de la curva en x=${pts[iValle][0].toFixed(0)}: ` +
          `el punto de ruptura ES ese mínimo, no un sitio cualquiera`,
      )
    }
    return (
      `sube ${subida.toFixed(0)}, baja ${bajada.toFixed(0)} y rebrota ${rebrote.toFixed(0)} px; ` +
      `marca@${m.toFixed(0)} sobre el mínimo@${pts[iValle][0].toFixed(0)}`
    )
  })

  control('Ruptura · el cloro COMBINADO se rotula antes, y el LIBRE después', () => {
    const svg = porClave('cloracion-punto-ruptura')
    const m = num(pieza(svg, 'marca-ruptura'), 'x1')
    const combinado = centroX(svg, 'cloro combinado')
    const libre = centroX(svg, 'cloro libre')
    if (!(combinado < m && m < libre)) {
      throw new Error(
        `"cloro combinado"@${combinado.toFixed(0)} y "cloro libre"@${libre.toFixed(0)} con la ` +
          `ruptura en ${m.toFixed(0)}: el cloro libre residual solo aparece PASADO el punto de ruptura`,
      )
    }
    return `combinado@${combinado.toFixed(0)} < ruptura@${m.toFixed(0)} < libre@${libre.toFixed(0)}`
  })

  /*
   * Alcalinidad. La ISO 9963-1 valora a dos puntos finales de pH FIJOS, y el
   * dibujo lo afirma. Comprobarlo de verdad exige leer la curva: se toma la x
   * de cada marca, se busca en el trazado la altura que le corresponde y se
   * exige que sea la de su pH. Una marca puesta a ojo se cae aqui.
   */
  const alturaEn = (pts, x) => {
    for (let i = 1; i < pts.length; i++) {
      if (pts[i - 1][0] <= x && x <= pts[i][0]) {
        const f = (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0] || 1)
        return pts[i - 1][1] + f * (pts[i][1] - pts[i - 1][1])
      }
    }
    throw new Error(`x=${x.toFixed(0)} cae fuera del trazado`)
  }

  control('Alcalinidad · las dos marcas caen SOBRE la curva, en pH 8,3 y luego 4,5', () => {
    const svg = porClave('alcalinidad-valoracion')
    const pts = puntos(pieza(svg, 'curva-alcalinidad'))
    const y83 = num(pieza(svg, 'linea-83'), 'y1')
    const y45 = num(pieza(svg, 'linea-45'), 'y1')
    if (!(y83 < y45)) {
      throw new Error(`la línea de pH 8,3 (y=${y83}) no está por encima de la de pH 4,5 (y=${y45})`)
    }
    const x1 = num(pieza(svg, 'marca-fenolftaleina'), 'x1')
    const x2 = num(pieza(svg, 'marca-naranja'), 'x1')
    if (!(x1 < x2)) {
      throw new Error(
        `la fenolftaleína vira en x=${x1.toFixed(0)} y el anaranjado en x=${x2.toFixed(0)}: ` +
          `el punto final de pH 8,3 se alcanza ANTES que el de 4,5`,
      )
    }
    const pares = [
      ['fenolftaleína (8,3)', x1, y83],
      ['anaranjado (4,5)', x2, y45],
    ]
    for (const [nombre, x, y] of pares) {
      const real = alturaEn(pts, x)
      if (Math.abs(real - y) > 4) {
        throw new Error(
          `la marca de ${nombre} está en x=${x.toFixed(0)}, donde la curva pasa por y=${real.toFixed(0)} ` +
            `y no por y=${y.toFixed(0)}: el punto final es un pH FIJO, y la marca tiene que caer en él`,
        )
      }
    }
    return `8,3@x=${x1.toFixed(0)} antes que 4,5@x=${x2.toFixed(0)}, las dos sobre la curva`
  })

  control('Alcalinidad · el pH BAJA a lo largo de toda la valoración', () => {
    const svg = porClave('alcalinidad-valoracion')
    const pts = puntos(pieza(svg, 'curva-alcalinidad'))
    for (let i = 1; i < pts.length; i++) {
      // y crece hacia abajo: que el pH baje es que la y no deje de crecer
      if (pts[i][1] < pts[i - 1][1] - 0.2) {
        throw new Error(
          `entre x=${pts[i - 1][0].toFixed(0)} y x=${pts[i][0].toFixed(0)} la curva sube de ` +
            `y=${pts[i - 1][1].toFixed(0)} a y=${pts[i][1].toFixed(0)}: se está añadiendo ÁCIDO, ` +
            `el pH no puede subir`,
        )
      }
    }
    return (
      `${pts.length} puntos, el pH solo baja: ` +
      `de y=${pts[0][1].toFixed(0)} a y=${pts[pts.length - 1][1].toFixed(0)}`
    )
  })


  /*
   * DBO frente a DQO. Lo que el examen pregunta (1322 #40) es que en un agua
   * residual domestica la DQO es MAYOR que la DBO, y el dibujo tiene que poder
   * demostrarlo: la curva se calcula con la cinetica de primer orden y los tres
   * niveles son rectas cuya altura se puede comparar.
   */
  control('DBO · la curva solo SUBE: el oxígeno consumido no se devuelve', () => {
    const pts = puntos(pieza(porClave('dbo-frente-a-dqo'), 'curva-dbo'))
    for (let i = 1; i < pts.length; i++) {
      // la y crece HACIA ABAJO: consumir mas oxigeno es que la y baje
      if (pts[i][1] > pts[i - 1][1] + 0.2) {
        throw new Error(
          `entre x=${pts[i - 1][0].toFixed(0)} y x=${pts[i][0].toFixed(0)} la curva baja de ` +
            `y=${pts[i - 1][1].toFixed(0)} a y=${pts[i][1].toFixed(0)}: el oxígeno ya consumido ` +
            `no puede desconsumirse`,
        )
      }
    }
    const total = pts[0][1] - pts[pts.length - 1][1]
    if (!(total > 40)) throw new Error(`la curva apenas sube: ${total.toFixed(0)} px`)
    return `${pts.length} puntos, siempre creciente, ${total.toFixed(0)} px de subida`
  })

  control('DBO · DQO por encima de la DBO última, y la marca de los 5 días sobre la curva', () => {
    const svg = porClave('dbo-frente-a-dqo')
    const alturaDe = (pieza_) => num(pieza(svg, pieza_), 'y1')
    const dqo = alturaDe('nivel-dqo')
    const dbou = alturaDe('nivel-dbou')
    const dbo5 = alturaDe('nivel-dbo5')
    // y mas pequeña = valor mas alto
    if (!(dqo < dbou && dbou < dbo5)) {
      throw new Error(
        `las alturas son DQO y=${dqo.toFixed(0)}, DBO última y=${dbou.toFixed(0)} y ` +
          `DBO₅ y=${dbo5.toFixed(0)}: en un agua residual tiene que ser DQO > DBO última > DBO₅`,
      )
    }
    const m = pieza(svg, 'marca-5-dias')
    const pts = puntos(pieza(svg, 'curva-dbo'))
    const x = num(m, 'x1')
    let mejor = pts[0]
    for (const q of pts) if (Math.abs(q[0] - x) < Math.abs(mejor[0] - x)) mejor = q
    if (Math.abs(num(m, 'y1') - mejor[1]) > 3) {
      throw new Error(
        `la marca de los 5 días arranca en y=${num(m, 'y1').toFixed(0)} y la curva pasa por ` +
          `y=${mejor[1].toFixed(0)}: la DBO₅ ES el valor de la curva a los cinco días`,
      )
    }
    if (Math.abs(num(m, 'y1') - dbo5) > 3) {
      throw new Error(
        `la marca arranca en y=${num(m, 'y1').toFixed(0)} y la recta de la DBO₅ está en ` +
          `y=${dbo5.toFixed(0)}: tienen que coincidir`,
      )
    }
    return `DQO@${dqo.toFixed(0)} < última@${dbou.toFixed(0)} < DBO₅@${dbo5.toFixed(0)}, marca sobre la curva`
  })

  /*
   * Los solidos. El arbol afirma dos cosas comprobables: que los suspendidos y
   * los disueltos cuelgan los DOS del total y a la misma altura -son las dos
   * mitades de un mismo reparto, no una cadena-, y que la calcinacion va
   * DESPUES del secado y a MAS temperatura.
   */
  control('Sólidos · suspendidos y disueltos cuelgan los DOS del total, a la misma altura', () => {
    const svg = porClave('solidos-del-agua')
    const y = (p) => num(pieza(svg, p), 'y')
    const total = y('caja-totales')
    const susp = y('caja-suspension')
    const dis = y('caja-disueltos')
    if (Math.abs(susp - dis) > 1) {
      throw new Error(
        `"en suspensión" está en y=${susp} y "disueltos" en y=${dis}: son las DOS mitades del ` +
          `mismo reparto, así que van a la misma altura`,
      )
    }
    if (!(susp > total)) {
      throw new Error(`los hijos (y=${susp}) no cuelgan por debajo del total (y=${total})`)
    }
    const vol = y('caja-volatiles')
    const fij = y('caja-fijos')
    if (Math.abs(vol - fij) > 1 || !(vol > susp)) {
      throw new Error(
        `"volátiles" (y=${vol}) y "fijos" (y=${fij}) tienen que ir a la misma altura y por ` +
          `debajo de "en suspensión" (y=${susp})`,
      )
    }
    return `total@${total} → suspensión/disueltos@${susp} → volátiles/fijos@${vol}`
  })

  control('Sólidos · se CALCINA más caliente de lo que se seca', () => {
    const svg = porClave('solidos-del-agua')
    const grados = (texto) => {
      const m = texto.match(/(\d+)\s*°C/)
      if (!m) throw new Error(`no hay temperatura en «${texto.trim()}»`)
      return Number(m[1])
    }
    const calcina = grados(pieza(svg, 'rotulo-calcinacion').textContent)
    const seca = [...svg.querySelectorAll('text')]
      .map((t) => t.textContent)
      .filter((t) => /secar/i.test(t))
      .map(grados)[0]
    if (seca === undefined) throw new Error('no encuentro la temperatura de secado')
    if (!(calcina > seca)) {
      throw new Error(
        `el dibujo calcina a ${calcina} °C y seca a ${seca} °C: la calcinación quema la materia ` +
          `orgánica, así que va MUY por encima del secado`,
      )
    }
    return `secado ${seca} °C < calcinación ${calcina} °C`
  })


  /*
   * Las fracciones del nitrogeno. El examen ofrece «metodo Kjeldahl» como
   * respuesta al fosforo TRES veces, y quien no tenga clara la diferencia cae.
   * El dibujo afirma que Kjeldahl NO es el total, y aqui se comprueba midiendo
   * hasta donde llega cada corchete sobre los tramos que dice abarcar.
   */
  const tramoDe = (svg, nombre) => {
    const r = pieza(svg, 'tramo-' + nombre)
    return { ini: num(r, 'x'), fin: num(r, 'x') + num(r, 'width') }
  }
  const abarca = (svg, nombre) => {
    const c = pieza(svg, nombre).getBBox()
    return { ini: c.x, fin: c.x + c.width }
  }

  control('Nitrógeno · el corchete de KJELDAHL llega al amoniacal y NO MÁS', () => {
    const svg = porClave('nitrogeno-total-fracciones')
    const k = abarca(svg, 'corchete-kjeldahl')
    const org = tramoDe(svg, 'organico')
    const am = tramoDe(svg, 'amoniacal')
    const nit = tramoDe(svg, 'nitrito')
    if (Math.abs(k.ini - org.ini) > 2) {
      throw new Error(`el corchete arranca en x=${k.ini.toFixed(0)} y el N orgánico en x=${org.ini.toFixed(0)}`)
    }
    if (Math.abs(k.fin - am.fin) > 2) {
      throw new Error(
        `el corchete de Kjeldahl acaba en x=${k.fin.toFixed(0)} y el N amoniacal en ` +
          `x=${am.fin.toFixed(0)}: Kjeldahl es orgánico MÁS amoniacal, ni más ni menos`,
      )
    }
    if (k.fin >= nit.fin) {
      throw new Error(
        `el corchete de Kjeldahl llega a x=${k.fin.toFixed(0)} y se traga el N nitrito, que acaba ` +
          `en x=${nit.fin.toFixed(0)}: el nitrito y el nitrato quedan FUERA del Kjeldahl`,
      )
    }
    return `Kjeldahl [${k.ini.toFixed(0)}, ${k.fin.toFixed(0)}] = orgánico + amoniacal, sin tocar el nitrito`
  })

  control('Nitrógeno · el corchete del TOTAL cubre los cuatro tramos', () => {
    const svg = porClave('nitrogeno-total-fracciones')
    const t = abarca(svg, 'corchete-total')
    const k = abarca(svg, 'corchete-kjeldahl')
    const org = tramoDe(svg, 'organico')
    const nitrato = tramoDe(svg, 'nitrato')
    if (Math.abs(t.ini - org.ini) > 2 || Math.abs(t.fin - nitrato.fin) > 2) {
      throw new Error(
        `el corchete del total ocupa [${t.ini.toFixed(0)}, ${t.fin.toFixed(0)}] y los cuatro tramos ` +
          `van de ${org.ini.toFixed(0)} a ${nitrato.fin.toFixed(0)}`,
      )
    }
    if (!(t.fin - t.ini > k.fin - k.ini + 10)) {
      throw new Error(
        `el total mide ${(t.fin - t.ini).toFixed(0)} px y el Kjeldahl ${(k.fin - k.ini).toFixed(0)}: ` +
          `el total tiene que ser CLARAMENTE mayor, que es justo lo que el dibujo enseña`,
      )
    }
    return `total ${(t.fin - t.ini).toFixed(0)} px > Kjeldahl ${(k.fin - k.ini).toFixed(0)} px`
  })

  /*
   * La NCA de los metales frente a la dureza. El RD 817/2015 no da un numero
   * por metal: da un escalon por clase de dureza, y los escalones SUBEN. El
   * dibujo lo afirma para tres metales a la vez y aqui se comprueba sobre el
   * trazado muestreado, no sobre los rotulos.
   */
  const METALES = ['zinc', 'cobre', 'cadmio']

  control('NCA · las tres series SUBEN con la dureza: ninguna baja', () => {
    const svg = porClave('nca-metales-dureza')
    const partes = []
    for (const m of METALES) {
      const pts = puntos(pieza(svg, 'serie-' + m))
      for (let i = 1; i < pts.length; i++) {
        // la y crece HACIA ABAJO: que la NCA suba es que la y no crezca
        if (pts[i][1] > pts[i - 1][1] + 0.2) {
          throw new Error(
            `la serie del ${m} baja entre x=${pts[i - 1][0].toFixed(0)} y x=${pts[i][0].toFixed(0)}: ` +
              `la NCA no puede AFLOJARSE al ablandarse el agua, es al revés`,
          )
        }
      }
      partes.push(`${m} sube ${(pts[0][1] - pts[pts.length - 1][1]).toFixed(0)} px`)
    }
    return partes.join(' · ')
  })

  control('NCA · a cualquier dureza, el zinc va por encima del cobre y el cobre del cadmio', () => {
    const svg = porClave('nca-metales-dureza')
    const series = METALES.map((m) => puntos(pieza(svg, 'serie-' + m)))
    const n = Math.min(...series.map((p) => p.length))
    for (let i = 0; i < n; i++) {
      const [zn, cu, cd] = series.map((p) => p[i][1])
      // y mas pequeña = valor mas alto
      if (!(zn < cu && cu < cd)) {
        throw new Error(
          `en x=${series[0][i][0].toFixed(0)} las alturas son zinc y=${zn.toFixed(0)}, ` +
            `cobre y=${cu.toFixed(0)} y cadmio y=${cd.toFixed(0)}: el cadmio es el metal con la NCA ` +
            `MÁS ESTRICTA de los tres, y el zinc el más permisivo`,
        )
      }
    }
    return `${n} puntos comparados: zinc > cobre > cadmio en todos`
  })


  /*
   * Los dos envases. El RD 487/2022 dice una cosa y la contraria segun el
   * ensayo: en microbiologia "siempre debe dejarse una pequeña camara de aire
   * sobre el nivel del agua"; en los quimicos "el recipiente se debe llenar
   * completamente". El dibujo lo afirma con el nivel del agua, y aqui se mide.
   */
  control('Envases · microbiología deja CÁMARA DE AIRE y fisicoquímica se llena al ras', () => {
    const svg = porClave('envase-camara-de-aire')
    const y = (nombre) => num(pieza(svg, nombre), 'y1')
    const camara = y('nivel-micro') - y('boca-micro')
    // la y crece HACIA ABAJO: que quede camara es que el nivel esté por debajo de la boca
    if (!(camara > 8)) {
      throw new Error(
        `el agua de microbiología llega a y=${y('nivel-micro').toFixed(0)} y la boca está en ` +
          `y=${y('boca-micro').toFixed(0)}: solo ${camara.toFixed(0)} px de cámara, y el envase ` +
          `microbiológico SIEMPRE tiene que dejarla`,
      )
    }
    const raso = Math.abs(y('nivel-fq') - y('boca-fq'))
    if (!(raso < 3)) {
      throw new Error(
        `el envase fisicoquímico deja ${raso.toFixed(0)} px entre el agua y la boca: tiene que ` +
          `llenarse COMPLETAMENTE, o lo volátil se escapa a esa cámara`,
      )
    }
    return `microbiología ${camara.toFixed(0)} px de cámara · fisicoquímica al ras (${raso.toFixed(0)} px)`
  })

  control('Envases · el neutralizante va DENTRO del de microbiología, y solo de ese', () => {
    const svg = porClave('envase-camara-de-aire')
    const n = pieza(svg, 'neutralizante').getBBox()
    const cx = n.x + n.width / 2
    const micro = pieza(svg, 'nivel-micro')
    const fq = pieza(svg, 'nivel-fq')
    const dentro = (l) => cx >= num(l, 'x1') && cx <= num(l, 'x2')
    if (!dentro(micro)) {
      throw new Error(
        `el neutralizante está en x=${cx.toFixed(0)} y el envase de microbiología ocupa ` +
          `[${num(micro, 'x1')}, ${num(micro, 'x2')}]: el tiosulfato va en ESE envase`,
      )
    }
    if (dentro(fq)) {
      throw new Error(
        `el neutralizante ha caído dentro del envase fisicoquímico ([${num(fq, 'x1')}, ` +
          `${num(fq, 'x2')}]): ahí no va, y falsearía el análisis`,
      )
    }
    return `neutralizante@${cx.toFixed(0)} dentro del envase microbiológico y fuera del otro`
  })

  /*
   * Los tres objetivos del muestreo en grifo. El RD 3/2023 elige uno por su
   * letra -"con objetivo b)"- y la letra decide el procedimiento entero. El
   * dibujo tiene que poder demostrar cual senala y donde sigue la alcachofa.
   */
  control('Grifo · los tres objetivos van en orden: la RED, el GRIFO, lo que se BEBE', () =>
    enOrden(porClave('grifo-tres-objetivos'), ['a) la RED', 'b) el GRIFO', 'c) lo que se BEBE']),
  )

  control('Grifo · el RD señala el objetivo b, y solo el c conserva la alcachofa', () => {
    const svg = porClave('grifo-tres-objetivos')
    const caja = (nombre) => {
      const r = pieza(svg, nombre)
      return { ini: num(r, 'x'), fin: num(r, 'x') + num(r, 'width') }
    }
    const marca = num(pieza(svg, 'marca-rd'), 'x1')
    const b = caja('panel-b')
    if (!(marca > b.ini && marca < b.fin)) {
      throw new Error(
        `la marca del RD cae en x=${marca.toFixed(0)} y el panel b ocupa ` +
          `[${b.ini.toFixed(0)}, ${b.fin.toFixed(0)}]: el real decreto exige el objetivo B`,
      )
    }
    const alc = pieza(svg, 'alcachofa-c').getBBox()
    const acx = alc.x + alc.width / 2
    const c = caja('panel-c')
    if (!(acx > c.ini && acx < c.fin)) {
      throw new Error(`la alcachofa cae en x=${acx.toFixed(0)}, fuera del panel c`)
    }
    for (const otro of ['a', 'b']) {
      if (svg.querySelector('[data-pieza="alcachofa-' + otro + '"]')) {
        throw new Error(
          `el objetivo ${otro} también conserva la alcachofa: en los objetivos a) y b) ` +
            `el accesorio se RETIRA, y solo en el c) se deja puesto`,
        )
      }
    }
    return `marca@${marca.toFixed(0)} sobre el panel b, y la alcachofa solo en el c@${acx.toFixed(0)}`
  })


  /*
   * Las curvas de corte. El RD 102/2011 no define PM10 y PM2,5 por un techo
   * de tamaño, sino por el diametro en el que el cabezal tiene "una eficiencia
   * de corte del 50 %". El dibujo lo afirma con dos numeros escritos, 10 µm y
   * 2,5 µm, y aqui se contrasta cada numero contra el trazado: se reconstruye
   * la escala logaritmica a partir de las marcas del eje y se busca donde cruza
   * cada curva la linea del 50 %.
   */
  control('Corte PM · cada curva cruza el 50 % justo en el diámetro que dice su rótulo', () => {
    const svg = porClave('corte-pm10-pm25')
    // la escala del eje, leida de sus propias marcas: dos decadas conocidas
    const ejeX = (d) => pieza(svg, 'eje-' + d).getBBox().x + pieza(svg, 'eje-' + d).getBBox().width / 2
    const x1 = ejeX(1)
    const porDecada = ejeX(10) - x1
    if (!(porDecada > 20)) throw new Error('las marcas del eje no dejan reconstruir la escala')
    const diametroDe = (x) => Math.pow(10, (x - x1) / porDecada)

    const y50 = num(pieza(svg, 'linea-50'), 'y1')
    const leidos = []
    for (const clave of ['pm10', 'pm25']) {
      const escrito = Number(
        pieza(svg, 'cifra-' + clave).textContent.replace(/[^\d,.]/g, '').replace(',', '.'),
      )
      const pts = puntos(pieza(svg, 'curva-' + clave))
      let cruce = null
      for (let i = 1; i < pts.length; i++) {
        // la y crece hacia abajo: cruzar el 50 % es pasar de estar por debajo a estar por encima
        if (pts[i - 1][1] > y50 && pts[i][1] <= y50) {
          const t = (pts[i - 1][1] - y50) / (pts[i - 1][1] - pts[i][1])
          cruce = pts[i - 1][0] + t * (pts[i][0] - pts[i - 1][0])
          break
        }
      }
      if (cruce === null) throw new Error(`la curva de ${clave} no llega a cruzar el 50 %`)
      const medido = diametroDe(cruce)
      const error = Math.abs(medido - escrito) / escrito
      if (!(error < 0.06)) {
        throw new Error(
          `la curva de ${clave} dice "${escrito}" pero cruza el 50 % en ` +
            `${medido.toFixed(2)} µm (${(error * 100).toFixed(0)} % de desvío): el 50 % es ` +
            `justo lo que define el corte`,
        )
      }
      leidos.push(`${clave} escribe ${escrito} y corta en ${medido.toFixed(2)} µm`)
    }
    return leidos.join(' · ')
  })

  control('Corte PM · las dos curvas solo SUBEN: a mayor tamaño nunca se capta menos', () => {
    const svg = porClave('corte-pm10-pm25')
    const informe = []
    for (const clave of ['pm10', 'pm25']) {
      const pts = puntos(pieza(svg, 'curva-' + clave))
      for (let i = 1; i < pts.length; i++) {
        if (pts[i][1] > pts[i - 1][1] + 0.4) {
          throw new Error(
            `la curva de ${clave} baja entre x=${pts[i - 1][0]} y x=${pts[i][0]} ` +
              `(y pasa de ${pts[i - 1][1]} a ${pts[i][1]}): un cabezal no capta MENOS ` +
              `cuanto más grande es la partícula`,
          )
        }
      }
      informe.push(`${clave}: ${pts.length} puntos sin un solo retroceso`)
    }
    return informe.join(' · ')
  })

  /*
   * La cadena de captacion. Lo que hay que poder demostrar es el orden: el
   * cabezal selecciona ANTES de que el aire toque el filtro, y la bomba tira
   * DESPUES; y sobre ese unico filtro se hacen dos cosas que no se pueden
   * invertir, porque la digestion acida lo destruye.
   */
  control('Captación · el cabezal va ANTES del filtro y la bomba DESPUÉS', () => {
    const svg = porClave('captacion-pm-y-metales')
    const x = (nombre) => {
      const r = pieza(svg, 'etapa-' + nombre)
      return num(r, 'x') + num(r, 'width') / 2
    }
    const cabezal = x('cabezal')
    const filtro = x('filtro')
    const bomba = x('bomba')
    if (!(cabezal < filtro)) {
      throw new Error(
        `el cabezal está en x=${cabezal.toFixed(0)} y el filtro en x=${filtro.toFixed(0)}: ` +
          `si el aire llega al filtro sin pasar el cabezal, en el filtro hay TODO el polvo ` +
          `y no la fracción PM10 o PM2,5`,
      )
    }
    if (!(bomba > filtro)) {
      throw new Error(
        `la bomba está en x=${bomba.toFixed(0)}, antes del filtro (x=${filtro.toFixed(0)}): ` +
          `la bomba aspira al final de la línea`,
      )
    }
    return `cabezal@${cabezal.toFixed(0)} < filtro@${filtro.toFixed(0)} < bomba@${bomba.toFixed(0)}`
  })

  control('Captación · las dos ramas cuelgan del filtro, y se PESA antes de digerir', () => {
    const svg = porClave('captacion-pm-y-metales')
    const filtro = pieza(svg, 'etapa-filtro')
    const abajoDelFiltro = num(filtro, 'y') + num(filtro, 'height')
    for (const rama of ['gravimetria', 'metales']) {
      const r = pieza(svg, 'rama-' + rama)
      if (!(num(r, 'y') > abajoDelFiltro)) {
        throw new Error(
          `la rama de ${rama} empieza en y=${num(r, 'y')}, por encima del filtro ` +
            `(y=${abajoDelFiltro}): las dos determinaciones salen de ESE filtro`,
        )
      }
    }
    const paso = (rama) => Number(pieza(svg, 'paso-' + rama).textContent.replace(/[^\d]/g, ''))
    const pesar = paso('gravimetria')
    const digerir = paso('metales')
    if (!(pesar < digerir)) {
      throw new Error(
        `la gravimetría lleva el paso ${pesar} y los metales el ${digerir}: la digestión ácida ` +
          `disuelve el filtro, así que quien digiera primero se queda sin poder pesarlo`,
      )
    }
    return `las dos ramas por debajo de y=${abajoDelFiltro}, y pesar (${pesar}) antes de digerir (${digerir})`
  })

  /*
   * Las cuatro dianas. La veracidad y la precision se leen en los impactos:
   * el sesgo es la distancia de su MEDIA al centro, y la precision su
   * dispersion alrededor de esa media. Aqui se miden las dos cosas y se
   * contrastan con lo que dice el rotulo de cada diana.
   */
  const diana = (svg, clave) => {
    const anillo = pieza(svg, 'anillo-' + clave)
    const R = num(anillo, 'r')
    const cx = num(anillo, 'cx')
    const cy = num(anillo, 'cy')
    const imp = piezas(svg, 'impacto-' + clave).map((p) => [num(p, 'cx'), num(p, 'cy')])
    const mx = imp.reduce((a, p) => a + p[0], 0) / imp.length
    const my = imp.reduce((a, p) => a + p[1], 0) / imp.length
    const dispersion = Math.sqrt(imp.reduce((a, p) => a + (p[0] - mx) ** 2 + (p[1] - my) ** 2, 0) / imp.length) / R
    return {
      sesgo: [(mx - cx) / R, (my - cy) / R],
      modulo: Math.hypot(mx - cx, my - cy) / R,
      dispersion,
      rotulo: pieza(svg, 'rotulo-' + clave).textContent,
    }
  }
  const DIANAS = ['vp', 'vi', 'sp', 'si']

  control('Dianas · cada diana es lo que dice su rótulo: sesgo y dispersión medidos en los impactos', () => {
    const svg = porClave('dianas-veracidad-precision')
    const informe = []
    for (const clave of DIANAS) {
      const d = diana(svg, clave)
      const diceSesgo = /sesgo/i.test(d.rotulo)
      const diceImpreciso = /impreciso/i.test(d.rotulo)
      if (diceSesgo ? !(d.modulo > 0.35) : !(d.modulo < 0.1)) {
        throw new Error(
          `la diana "${d.rotulo}" tiene la media de sus impactos a ${d.modulo.toFixed(2)} R del centro: ` +
            (diceSesgo ? 'dice que tiene sesgo y está centrada' : 'dice que es veraz y está desplazada'),
        )
      }
      if (diceImpreciso ? !(d.dispersion > 0.35) : !(d.dispersion < 0.2)) {
        throw new Error(
          `la diana "${d.rotulo}" tiene una dispersión de ${d.dispersion.toFixed(2)} R: ` +
            (diceImpreciso ? 'dice que es imprecisa y los impactos están apretados' : 'dice que es precisa y los impactos están abiertos'),
        )
      }
      informe.push(`${clave}: sesgo ${d.modulo.toFixed(2)} R, dispersión ${d.dispersion.toFixed(2)} R`)
    }
    return informe.join(' · ')
  })

  control('Dianas · en cada fila el mismo sesgo y en cada columna la misma dispersión', () => {
    const svg = porClave('dianas-veracidad-precision')
    const d = Object.fromEntries(DIANAS.map((k) => [k, diana(svg, k)]))
    // filas: veraz (vp, vi) y con sesgo (sp, si). Solo cambia la precision.
    for (const [a, b] of [['vp', 'vi'], ['sp', 'si']]) {
      const delta = Math.hypot(d[a].sesgo[0] - d[b].sesgo[0], d[a].sesgo[1] - d[b].sesgo[1])
      if (!(delta < 0.05)) {
        throw new Error(
          `"${d[a].rotulo}" y "${d[b].rotulo}" están en la misma fila y su sesgo difiere en ${delta.toFixed(2)} R: ` +
            `la comparación deja de aislar la precisión`,
        )
      }
    }
    // columnas: precisa (vp, sp) e imprecisa (vi, si). Solo cambia el sesgo.
    for (const [a, b] of [['vp', 'sp'], ['vi', 'si']]) {
      const rel = Math.abs(d[a].dispersion - d[b].dispersion) / d[a].dispersion
      if (!(rel < 0.1)) {
        throw new Error(
          `"${d[a].rotulo}" y "${d[b].rotulo}" están en la misma columna y su dispersión difiere un ` +
            `${(rel * 100).toFixed(0)} %: la comparación deja de aislar el sesgo`,
        )
      }
    }
    return `filas con sesgo igual (${d.sp.modulo.toFixed(2)} R abajo) y columnas con dispersión igual (${d.vp.dispersion.toFixed(2)} y ${d.vi.dispersion.toFixed(2)} R)`
  })

  /*
   * La combinacion en cuadratura. El triangulo afirma que uc es la
   * hipotenusa de u(Rw) y u(sesgo); las barras, que las cifras escritas son
   * esas y que U = 2 uc. Se comprueban por separado: la geometria del
   * triangulo, y la coherencia de las cifras con las barras.
   */
  control('Cuadratura · uc es la hipotenusa: ángulo recto y √(a² + b²), no a + b', () => {
    const svg = porClave('incertidumbre-en-cuadratura')
    const a = pieza(svg, 'cateto-rw')
    const b = pieza(svg, 'cateto-sesgo')
    const h = pieza(svg, 'hipotenusa-uc')
    const vec = (l) => [num(l, 'x2') - num(l, 'x1'), num(l, 'y2') - num(l, 'y1')]
    const cerca = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2) < 0.6
    if (!cerca(num(a, 'x1'), num(a, 'y1'), num(b, 'x1'), num(b, 'y1'))) {
      throw new Error('los dos catetos no salen del mismo vértice')
    }
    const [ax, ay] = vec(a)
    const [bx, by] = vec(b)
    const la = Math.hypot(ax, ay)
    const lb = Math.hypot(bx, by)
    const coseno = (ax * bx + ay * by) / (la * lb)
    if (!(Math.abs(coseno) < 0.01)) {
      throw new Error(`el ángulo entre los catetos no es recto (coseno ${coseno.toFixed(3)})`)
    }
    const extremosA = [num(a, 'x2'), num(a, 'y2')]
    const extremosB = [num(b, 'x2'), num(b, 'y2')]
    const h1 = [num(h, 'x1'), num(h, 'y1')]
    const h2 = [num(h, 'x2'), num(h, 'y2')]
    const cierra =
      (cerca(...h1, ...extremosA) && cerca(...h2, ...extremosB)) ||
      (cerca(...h1, ...extremosB) && cerca(...h2, ...extremosA))
    const lh = Math.hypot(...vec(h))
    const esperado = Math.hypot(la, lb)
    if (!cierra || !(Math.abs(lh - esperado) / esperado < 0.01)) {
      throw new Error(
        `la hipotenusa mide ${lh.toFixed(1)} px y √(a² + b²) = ${esperado.toFixed(1)} px ` +
          `(a + b serían ${(la + lb).toFixed(1)}): las incertidumbres no se suman, se combinan en cuadratura`,
      )
    }
    return `catetos de ${la.toFixed(1)} y ${lb.toFixed(1)} px en ángulo recto; hipotenusa ${lh.toFixed(1)} px = √(a² + b²)`
  })

  control('Cuadratura · las cifras escritas cuadran con las barras, y U = 2 · uc', () => {
    const svg = porClave('incertidumbre-en-cuadratura')
    const cifra = (k) => Number(pieza(svg, 'cifra-' + k).textContent.replace(/[^\d,.]/g, '').replace(',', '.'))
    const ancho = (k) => num(pieza(svg, 'barra-' + k), 'width')
    const escala = ancho('rw') / cifra('rw')
    for (const k of ['sesgo', 'uc', 'U']) {
      const leido = ancho(k) / escala
      if (!(Math.abs(leido - cifra(k)) / cifra(k) < 0.02)) {
        throw new Error(`la barra de ${k} mide ${leido.toFixed(2)} % a la escala de las demás, y su cifra dice ${cifra(k)} %`)
      }
    }
    const uc = Math.hypot(cifra('rw'), cifra('sesgo'))
    if (!(Math.abs(cifra('uc') - uc) < 0.015)) {
      throw new Error(`uc escrita = ${cifra('uc')} % y √(${cifra('rw')}² + ${cifra('sesgo')}²) = ${uc.toFixed(2)} %`)
    }
    if (!(Math.abs(cifra('U') - 2 * cifra('uc')) < 0.015)) {
      throw new Error(
        `U escrita = ${cifra('U')} % y 2 · uc = ${(2 * cifra('uc')).toFixed(2)} %: con k = 2 la expandida es el doble de la combinada`,
      )
    }
    return `u(Rw) ${cifra('rw')} · u(sesgo) ${cifra('sesgo')} → uc ${cifra('uc')} → U ${cifra('U')} %, y las barras a escala`
  })

  /*
   * El intervalo de trabajo. Dos afirmaciones: el LC esta a 10/3 del LD
   * (10 s0' frente a 3 s0') y el intervalo arranca en el; y el intervalo
   * acaba donde la respuesta deja de ser proporcional, con la tolerancia que
   * el propio dibujo escribe.
   */
  control('Intervalo · el LC está a 10/3 del LD sobre el eje, y el intervalo arranca en el LC', () => {
    const svg = porClave('intervalo-de-trabajo')
    const xEje = (c) => {
      const b = pieza(svg, 'eje-' + c).getBBox()
      return b.x + b.width / 2
    }
    // escala ajustada por minimos cuadrados con las cinco marcas del eje: una
    // sola marca de un digito descentra el origen y el LD, que esta cerca, lo nota
    const marcas = [0, 20, 40, 60, 80].map((c) => [c, xEje(c)])
    const mc = marcas.reduce((a, [c]) => a + c, 0) / marcas.length
    const mx = marcas.reduce((a, [, x]) => a + x, 0) / marcas.length
    const porUnidad =
      marcas.reduce((a, [c, x]) => a + (c - mc) * (x - mx), 0) / marcas.reduce((a, [c]) => a + (c - mc) ** 2, 0)
    if (!(porUnidad > 1)) throw new Error('las marcas del eje no dejan reconstruir la escala')
    // el origen, del propio dibujo: la recta sale de c = 0. Los rotulos solo
    // confirman que es ahi (el recuadro de un texto baila unas decimas de pixel)
    const x0 = num(pieza(svg, 'recta-ideal'), 'x1')
    if (!(Math.abs(mx - porUnidad * mc - x0) < 1)) {
      throw new Error(`la recta no arranca en el 0 del eje (x=${x0} frente a ${(mx - porUnidad * mc).toFixed(1)})`)
    }
    const conc = (x) => (x - x0) / porUnidad
    const cLD = conc(num(pieza(svg, 'marca-ld'), 'x1'))
    const cLC = conc(num(pieza(svg, 'marca-lc'), 'x1'))
    const factor = (k) => Number(pieza(svg, 'factor-' + k).textContent.match(/\d+(?:,\d+)?/)[0].replace(',', '.'))
    const esperado = factor('lc') / factor('ld')
    const medido = cLC / cLD
    if (!(Math.abs(medido - esperado) / esperado < 0.03)) {
      throw new Error(
        `el LD cae en ${cLD.toFixed(2)} y el LC en ${cLC.toFixed(2)} µg/L: cociente ${medido.toFixed(2)}, ` +
          `y los rótulos dicen ${factor('lc')} s₀′ / ${factor('ld')} s₀′ = ${esperado.toFixed(2)}`,
      )
    }
    const inicio = num(pieza(svg, 'tramo-trabajo'), 'x1')
    const xLC = num(pieza(svg, 'marca-lc'), 'x1')
    if (!(Math.abs(inicio - xLC) < 1)) {
      throw new Error(`el intervalo de trabajo empieza en x=${inicio.toFixed(1)} y el LC está en x=${xLC.toFixed(1)}`)
    }
    return `LD ${cLD.toFixed(2)} y LC ${cLC.toFixed(2)} µg/L (×${medido.toFixed(2)}), y el intervalo arranca en el LC`
  })

  control('Intervalo · dentro, la curva no se aparta de la recta más de la tolerancia; justo después, sí', () => {
    const svg = porClave('intervalo-de-trabajo')
    const r = pieza(svg, 'recta-ideal')
    const [xa, ya, xb, yb] = ['x1', 'y1', 'x2', 'y2'].map((k) => num(r, k))
    const pts = puntos(pieza(svg, 'curva-respuesta'))
    const tol = Number(pieza(svg, 'tolerancia').textContent.match(/(\d+(?:,\d+)?) ?%/)[1].replace(',', '.'))
    const t = pieza(svg, 'tramo-trabajo')
    const x1 = num(t, 'x1')
    const x2 = num(t, 'x2')
    // desviacion relativa de la curva frente a la recta, en %: 1 - altura real / altura ideal
    const desvio = ([x, y]) => {
      const yIdeal = ya + ((yb - ya) * (x - xa)) / (xb - xa)
      return (1 - (ya - y) / (ya - yIdeal)) * 100
    }
    const dentro = pts.filter(([x]) => x >= x1 && x <= x2)
    const fuera = pts.filter(([x]) => x > x2 + 10 && x < x2 + 40)
    if (dentro.length < 20 || !fuera.length) throw new Error('no hay puntos de la curva suficientes a los dos lados del final')
    const peor = Math.max(...dentro.map(desvio))
    if (!(peor <= tol + 0.3)) {
      throw new Error(
        `dentro del intervalo la curva llega a apartarse un ${peor.toFixed(1)} % de la recta, ` +
          `y la tolerancia escrita es del ${tol} %: el intervalo se alarga más allá de la zona lineal`,
      )
    }
    const mejorFuera = Math.min(...fuera.map(desvio))
    if (!(mejorFuera > tol)) {
      throw new Error(
        `justo después del intervalo la curva solo se aparta un ${mejorFuera.toFixed(1)} %: el intervalo acaba antes de tiempo`,
      )
    }
    return `desvío máximo dentro ${peor.toFixed(1)} % (tolerancia ${tol} %); justo después, ya ${mejorFuera.toFixed(1)} %`
  })

  /*
   * El grafico de control X. Primero, que las lineas esten donde dicen: aviso
   * a 2s y accion a 3s, simetricos. Despues, lo importante: que los puntos
   * marcados como fuera de control sean EXACTAMENTE los que señalan las dos
   * reglas del Nordtest TR 569 (ed. 6.1), aplicadas a los puntos dibujados.
   */
  control('Gráfico de control · aviso a ±2s y acción a ±3s, simétricos alrededor de la línea central', () => {
    const svg = porClave('grafico-control-x')
    const y = (k) => num(pieza(svg, k), 'y1')
    const lc = y('linea-central')
    const d = {
      avisoSup: lc - y('aviso-sup'),
      avisoInf: y('aviso-inf') - lc,
      accionSup: lc - y('accion-sup'),
      accionInf: y('accion-inf') - lc,
    }
    if (!(Math.abs(d.avisoSup - d.avisoInf) < 0.5 && Math.abs(d.accionSup - d.accionInf) < 0.5)) {
      throw new Error(`los límites no son simétricos: aviso +${d.avisoSup.toFixed(1)}/−${d.avisoInf.toFixed(1)}, acción +${d.accionSup.toFixed(1)}/−${d.accionInf.toFixed(1)} px`)
    }
    for (const lado of ['Sup', 'Inf']) {
      const cociente = d['accion' + lado] / d['aviso' + lado]
      if (!(Math.abs(cociente - 1.5) < 0.015)) {
        throw new Error(`en el lado ${lado === 'Sup' ? 'superior' : 'inferior'} la acción está a ${cociente.toFixed(2)} veces el aviso, y 3s / 2s = 1,5`)
      }
    }
    return `aviso a ±${d.avisoSup.toFixed(1)} px y acción a ±${d.accionSup.toFixed(1)} px de la línea central (3s/2s = 1,5)`
  })

  control('Gráfico de control · los puntos marcados fuera de control son exactamente los que señalan las dos reglas', () => {
    const svg = porClave('grafico-control-x')
    const lc = num(pieza(svg, 'linea-central'), 'y1')
    // la s se lee de los limites de accion, que no dependen de la regla de aviso
    const s = (num(pieza(svg, 'accion-inf'), 'y1') - num(pieza(svg, 'accion-sup'), 'y1')) / 6
    const puntos = [
      ...piezas(svg, 'valor').map((p) => ({ p, marcado: false })),
      ...[...svg.querySelectorAll('[data-pieza="valor-fuera"]')].map((p) => ({ p, marcado: true })),
    ]
      .map(({ p, marcado }) => ({ x: num(p, 'cx'), z: (lc - num(p, 'cy')) / s, marcado }))
      .sort((a, b) => a.x - b.x)
    const enAviso = (z) => Math.abs(z) > 2 && Math.abs(z) <= 3
    const fallos = []
    puntos.forEach((q, i) => {
      const dosDeTres =
        enAviso(q.z) && [i - 1, i - 2].some((j) => j >= 0 && enAviso(puntos[j].z) && Math.sign(puntos[j].z) === Math.sign(q.z))
      const debe = Math.abs(q.z) > 3 || dosDeTres
      if (debe !== q.marcado) {
        fallos.push(
          `la serie ${i + 1} (z = ${q.z.toFixed(2)}) ` +
            (debe ? `está fuera de control${dosDeTres ? ' por la regla de dos de tres' : ''} y no se marca` : 'se marca fuera de control y no lo está'),
        )
      }
    })
    if (fallos.length) throw new Error(fallos.join('; '))
    const fuera = puntos.map((q, i) => (q.marcado ? i + 1 : null)).filter(Boolean)
    const avisoBien = puntos.map((q, i) => (enAviso(q.z) && !q.marcado ? i + 1 : null)).filter(Boolean)
    return `${puntos.length} series; fuera de control las ${fuera.join(' y ')}; en aviso pero bajo control las ${avisoBien.join(' y ')}`
  })

  /*
   * La recta de calibrado. La linea dibujada tiene que ser el ajuste por
   * minimos cuadrados de los puntos dibujados, y el R2 escrito el de esos
   * puntos (el R2 no cambia al pasar de unidades a pixeles, porque es
   * invariante a un cambio de escala de los ejes). Y cada residuo, la
   * distancia vertical de su punto a esa recta, con su signo.
   */
  const ajuste = (pts) => {
    const n = pts.length
    const sx = pts.reduce((a, [x]) => a + x, 0)
    const sy = pts.reduce((a, [, y]) => a + y, 0)
    const sxy = pts.reduce((a, [x, y]) => a + x * y, 0)
    const sxx = pts.reduce((a, [x]) => a + x * x, 0)
    const syy = pts.reduce((a, [, y]) => a + y * y, 0)
    const b = (n * sxy - sx * sy) / (n * sxx - sx * sx)
    const a = (sy - b * sx) / n
    const r = (n * sxy - sx * sy) / Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy))
    return { a, b, r2: r * r }
  }
  const puntosRecta = (svg) =>
    piezas(svg, 'punto')
      .map((p) => [num(p, 'cx'), num(p, 'cy')])
      .sort((p, q) => p[0] - q[0])

  control('Recta · la línea dibujada es el ajuste por mínimos cuadrados de los puntos, y el R² escrito es el suyo', () => {
    const svg = porClave('recta-minimos-cuadrados')
    const pts = puntosRecta(svg)
    const { a, b, r2 } = ajuste(pts)
    const l = pieza(svg, 'recta')
    for (const [kx, ky] of [['x1', 'y1'], ['x2', 'y2']]) {
      const esperado = a + b * num(l, kx)
      if (!(Math.abs(esperado - num(l, ky)) < 0.6)) {
        throw new Error(
          `en x=${num(l, kx).toFixed(0)} la recta pasa por y=${num(l, ky).toFixed(1)} y el ajuste de los puntos por ` +
            `y=${esperado.toFixed(1)}: la recta dibujada no es la de mínimos cuadrados`,
        )
      }
    }
    const escrito = Number(pieza(svg, 'r2').textContent.match(/(\d+,\d+)/)[1].replace(',', '.'))
    if (!(Math.abs(escrito - r2) < 0.0006)) {
      throw new Error(`el R² escrito es ${escrito} y el de los puntos dibujados, ${r2.toFixed(4)}`)
    }
    return `${pts.length} puntos; la recta coincide con su ajuste en los dos extremos; R² ${r2.toFixed(4)} = escrito`
  })

  control('Recta · cada residuo mide la distancia vertical de su punto a la recta, con su signo', () => {
    const svg = porClave('recta-minimos-cuadrados')
    const pts = puntosRecta(svg)
    const { a, b } = ajuste(pts)
    const res = piezas(svg, 'residuo').sort((p, q) => num(p, 'x1') - num(q, 'x1'))
    if (res.length !== pts.length) throw new Error(`hay ${pts.length} puntos y ${res.length} residuos`)
    // residuo real: positivo si el punto queda por encima de la recta (la y del svg crece hacia abajo)
    const reales = pts.map(([x, y]) => a + b * x - y)
    const dibujados = res.map((r) => num(r, 'y1') - num(r, 'y2'))
    res.forEach((r, i) => {
      if (!(Math.abs(num(r, 'x1') - pts[i][0]) < 0.6)) throw new Error(`el residuo ${i + 1} no está debajo de su punto`)
    })
    const k = dibujados.reduce((s, d, i) => s + d * reales[i], 0) / reales.reduce((s, r) => s + r * r, 0)
    if (!(k > 1)) throw new Error('los residuos no están ampliados respecto al gráfico, o van al revés')
    const tope = Math.max(...dibujados.map(Math.abs))
    dibujados.forEach((d, i) => {
      if (Math.sign(d) !== Math.sign(reales[i]) || Math.abs(d - k * reales[i]) > 0.08 * tope) {
        throw new Error(
          `el residuo del punto ${i + 1} mide ${d.toFixed(1)} px y le tocan ${(k * reales[i]).toFixed(1)} ` +
            `(el punto está ${reales[i] > 0 ? 'por encima' : 'por debajo'} de la recta)`,
        )
      }
    })
    return `${res.length} residuos proporcionales a la distancia de su punto a la recta (×${k.toFixed(1)}), con su signo`
  })

  /*
   * La cadena de trazabilidad: la incertidumbre crece eslabon a eslabon
   * (VIM 2.40, nota 1), y la cadena es ininterrumpida (VIM 2.41): cada flecha
   * sale de un eslabon y llega al siguiente.
   */
  control('Trazabilidad · la incertidumbre crece a lo largo de la cadena, eslabón a eslabón', () => {
    const svg = porClave('cadena-trazabilidad')
    const barras = piezas(svg, 'incertidumbre')
      .map((b) => ({ x: num(b, 'x') + num(b, 'width') / 2, w: num(b, 'width') }))
      .sort((p, q) => p.x - q.x)
    for (let i = 1; i < barras.length; i++) {
      if (!(barras[i].w > barras[i - 1].w * 1.1)) {
        throw new Error(
          `la incertidumbre del eslabón ${i + 1} (${barras[i].w} px) no es mayor que la del ${i} (${barras[i - 1].w} px): ` +
            `cada calibración suma incertidumbre`,
        )
      }
    }
    return barras.map((b) => b.w).join(' < ') + ' px'
  })

  control('Trazabilidad · la cadena es ininterrumpida: cada flecha une un eslabón con el siguiente', () => {
    const svg = porClave('cadena-trazabilidad')
    const cajas = piezas(svg, 'eslabon')
      .map((c) => ({ x: num(c, 'x'), w: num(c, 'width'), y: num(c, 'y'), h: num(c, 'height') }))
      .sort((p, q) => p.x - q.x)
    const flechas = piezas(svg, 'flecha').sort((p, q) => num(p, 'x1') - num(q, 'x1'))
    if (flechas.length !== cajas.length - 1) {
      throw new Error(`hay ${cajas.length} eslabones y ${flechas.length} flechas: faltan calibraciones en la cadena`)
    }
    flechas.forEach((f, i) => {
      const sale = cajas[i].x + cajas[i].w
      const llega = cajas[i + 1].x
      if (!(Math.abs(num(f, 'x1') - sale) < 1 && Math.abs(num(f, 'x2') - llega) < 3)) {
        throw new Error(
          `la flecha ${i + 1} va de x=${num(f, 'x1')} a x=${num(f, 'x2')}, y debería unir x=${sale} con x=${llega}: ` +
            `la cadena queda interrumpida`,
        )
      }
      const y = num(f, 'y1')
      if (!(y > cajas[i].y && y < cajas[i].y + cajas[i].h)) throw new Error(`la flecha ${i + 1} no sale de la caja`)
    })
    return `${cajas.length} eslabones y ${flechas.length} flechas, sin huecos`
  })

  /*
   * Quien acredita y quien certifica. Se lee de que caja sale y a que caja
   * llega cada flecha: las de «acredita» salen de ENAC y llegan a los
   * organismos de evaluacion de la conformidad; las de «certifica» salen de la
   * certificadora y llegan a la empresa, y ninguna flecha une ENAC con la
   * empresa.
   */
  const cajaDe = (svg, x, y) => {
    const dentro = [...svg.querySelectorAll('[data-pieza^="nodo-"]')].filter(
      (c) =>
        x >= num(c, 'x') - 4 &&
        x <= num(c, 'x') + num(c, 'width') + 4 &&
        y >= num(c, 'y') - 4 &&
        y <= num(c, 'y') + num(c, 'height') + 4,
    )
    return dentro.length === 1 ? dentro[0].getAttribute('data-pieza').replace('nodo-', '') : null
  }
  const extremos = (svg, f) => [cajaDe(svg, num(f, 'x1'), num(f, 'y1')), cajaDe(svg, num(f, 'x2'), num(f, 'y2'))]
  const OEC = ['laboratorio', 'certificadora', 'inspeccion']

  control('Acreditación · todas las flechas de «acredita» salen de ENAC y llegan a organismos de evaluación de la conformidad', () => {
    const svg = porClave('acreditacion-certificacion')
    const flechas = piezas(svg, 'acredita')
    const destinos = []
    for (const f of flechas) {
      const [de, a] = extremos(svg, f)
      if (de !== 'enac') {
        throw new Error(`una flecha de «acredita» sale de «${de}»: en España solo acredita ENAC`)
      }
      if (!OEC.includes(a)) {
        throw new Error(`una flecha de «acredita» llega a «${a}»: ENAC acredita a organismos de evaluación de la conformidad`)
      }
      destinos.push(a)
    }
    const faltan = OEC.filter((o) => !destinos.includes(o))
    if (faltan.length) throw new Error(`ENAC no acredita en el dibujo a: ${faltan.join(', ')}`)
    return `${flechas.length} flechas de ENAC a ${destinos.join(', ')}`
  })

  control('Certificación · la certificadora certifica a la empresa, y ninguna flecha une ENAC con la empresa', () => {
    const svg = porClave('acreditacion-certificacion')
    for (const f of piezas(svg, 'certifica')) {
      const [de, a] = extremos(svg, f)
      if (de !== 'certificadora' || a !== 'empresa') {
        throw new Error(`una flecha de «certifica» va de «${de}» a «${a}»: certifica la entidad de certificación, a la empresa`)
      }
    }
    for (const f of svg.querySelectorAll('line[data-pieza]')) {
      const [de, a] = extremos(svg, f)
      if ((de === 'enac' && a === 'empresa') || (de === 'empresa' && a === 'enac')) {
        throw new Error(`una flecha de «${f.getAttribute('data-pieza')}» une ENAC con la empresa: ENAC no certifica empresas`)
      }
    }
    return 'certificadora → empresa, y ENAC sin ninguna flecha hacia la empresa'
  })

  /*
   * El ciclo de acreditacion (PAC-ENAC, 8.1 y 8.2). La escala de meses sale de
   * las marcas del propio eje.
   */
  const mesesCiclo = (svg) => {
    const t0 = num(pieza(svg, 'tick-0'), 'x1')
    const porMes = (num(pieza(svg, 'tick-108'), 'x1') - t0) / 108
    if (!(porMes > 1)) throw new Error('las marcas del eje no dejan reconstruir la escala de meses')
    return (x) => (x - t0) / porMes
  }

  control('Ciclo · el primer ciclo dura 4 años y el siguiente 5, con una reevaluación dentro de cada uno', () => {
    const svg = porClave('ciclo-acreditacion')
    const mes = mesesCiclo(svg)
    const fin1 = mes(num(pieza(svg, 'fin-ciclo-1'), 'x1'))
    const fin2 = mes(num(pieza(svg, 'fin-ciclo-2'), 'x1'))
    if (!(Math.abs(fin1 - 48) < 0.5)) {
      throw new Error(`el primer ciclo acaba en el mes ${fin1.toFixed(1)}: tiene que durar 4 años (48 meses)`)
    }
    if (!(Math.abs(fin2 - fin1 - 60) < 0.5)) {
      throw new Error(`el segundo ciclo dura ${(fin2 - fin1).toFixed(1)} meses: los siguientes ciclos son de 5 años`)
    }
    const reev = piezas(svg, 'reevaluacion').map((r) => mes(num(r, 'cx'))).sort((a, b) => a - b)
    const en1 = reev.filter((m) => m > 0 && m < fin1)
    const en2 = reev.filter((m) => m > fin1 && m < fin2)
    if (en1.length !== 1 || en2.length !== 1) {
      throw new Error(`reevaluaciones en los meses ${reev.map((m) => m.toFixed(0)).join(', ')}: tiene que haber una dentro de cada ciclo, antes de que acabe`)
    }
    return `ciclos hasta los meses ${fin1.toFixed(0)} y ${fin2.toFixed(0)}; reevaluaciones en ${reev.map((m) => m.toFixed(0)).join(' y ')}`
  })

  control('Ciclo · primer seguimiento antes de 12 meses, y ningún hueco pasa de 18 meses en el primer ciclo ni de 24 en el siguiente', () => {
    const svg = porClave('ciclo-acreditacion')
    const mes = mesesCiclo(svg)
    const fin1 = mes(num(pieza(svg, 'fin-ciclo-1'), 'x1'))
    const inicio = mes(num(pieza(svg, 'concesion'), 'cx'))
    const evaluaciones = [...piezas(svg, 'seguimiento'), ...piezas(svg, 'reevaluacion')]
      .map((e) => mes(num(e, 'cx')))
      .sort((a, b) => a - b)
    if (!(evaluaciones[0] - inicio <= 12.2)) {
      throw new Error(`el primer seguimiento cae en el mes ${(evaluaciones[0] - inicio).toFixed(1)}: tiene que ser antes de 12 meses`)
    }
    const huecos = []
    for (let i = 1; i < evaluaciones.length; i++) {
      const hueco = evaluaciones[i] - evaluaciones[i - 1]
      const limite = evaluaciones[i] <= fin1 ? 18 : 24
      if (!(hueco <= limite + 0.2)) {
        throw new Error(
          `entre los meses ${evaluaciones[i - 1].toFixed(0)} y ${evaluaciones[i].toFixed(0)} pasan ${hueco.toFixed(1)} meses ` +
            `sin evaluación, y el máximo en ese ciclo es de ${limite}`,
        )
      }
      huecos.push(hueco.toFixed(0))
    }
    return `primer seguimiento en el mes ${(evaluaciones[0] - inicio).toFixed(0)}; huecos de ${huecos.join(', ')} meses`
  })

  /*
   * La estructura del II Plan de Igualdad municipal (apartado 8). Cada fila se
   * lee por su altura: los cuadrados de objetivo y la cifra que caen a la
   * altura de un rotulo de linea son los de esa linea.
   */
  const filasPlan = (svg) => {
    const yDe = (el) => {
      const c = el.getBBox()
      return c.y + c.height / 2
    }
    const cifras = piezas(svg, 'cifra').map((c) => ({ n: Number(c.textContent.trim()), y: yDe(c) }))
    const cuadros = piezas(svg, 'objetivo').map((q) => num(q, 'y') + num(q, 'height') / 2)
    return piezas(svg, 'linea').map((l) => {
      const y = yDe(l)
      return {
        texto: l.textContent.trim(),
        y,
        cifras: cifras.filter((c) => Math.abs(c.y - y) < 7).map((c) => c.n),
        cuadros: cuadros.filter((q) => Math.abs(q - y) < 7).length,
      }
    })
  }

  control('Plan de igualdad · cada línea dibuja tantos objetivos como dice su cifra', () => {
    const svg = porClave('estructura-plan-igualdad')
    const filas = filasPlan(svg)
    for (const f of filas) {
      if (f.cifras.length !== 1) throw new Error(`la línea «${f.texto}» tiene ${f.cifras.length} cifras a su altura`)
      if (f.cuadros !== f.cifras[0]) {
        throw new Error(`la línea «${f.texto}» dice ${f.cifras[0]} objetivos y dibuja ${f.cuadros}`)
      }
    }
    const cuadros = piezas(svg, 'objetivo').length
    const enFilas = filas.reduce((s, f) => s + f.cuadros, 0)
    if (cuadros !== enFilas) throw new Error(`${cuadros - enFilas} cuadrados de objetivo no caen a la altura de ninguna línea`)
    return `${filas.length} líneas y ${cuadros} objetivos dibujados, cada línea con los que dice`
  })

  control('Plan de igualdad · cuatro ejes de 4, 3, 2 y 3 líneas, cuyos totales suman sus cifras, y 21 objetivos en total', () => {
    const svg = porClave('estructura-plan-igualdad')
    const filas = filasPlan(svg)
    const bandas = piezas(svg, 'eje').sort((a, b) => num(a, 'y') - num(b, 'y'))
    const dentro = (b, y) => y >= num(b, 'y') && y <= num(b, 'y') + num(b, 'height')
    const reparto = []
    let suma = 0
    for (const b of bandas) {
      const eje = b.getAttribute('data-eje')
      const suyas = filas.filter((f) => dentro(b, f.y))
      const totales = piezas(svg, 'total-eje').filter((t) => {
        const c = t.getBBox()
        return dentro(b, c.y + c.height / 2)
      })
      if (totales.length !== 1) throw new Error(`el eje ${eje} tiene ${totales.length} totales escritos`)
      const cifra = suyas.reduce((s, f) => s + f.cifras[0], 0)
      const escrito = Number(totales[0].textContent.trim())
      if (escrito !== cifra) throw new Error(`el eje ${eje} dice ${escrito} objetivos y sus líneas suman ${cifra}`)
      reparto.push(suyas.length)
      suma += cifra
    }
    if (reparto.join(',') !== '4,3,2,3') {
      throw new Error(`los ejes tienen ${reparto.join(', ')} líneas: el Plan reparte sus 12 líneas en 4, 3, 2 y 3`)
    }
    const total = Number(pieza(svg, 'total').textContent.trim())
    if (total !== suma || total !== 21) {
      throw new Error(`el total escrito es ${total}, las líneas suman ${suma}, y el Plan tiene 21 objetivos específicos`)
    }
    return `ejes de ${reparto.join(', ')} líneas; ${total} objetivos específicos`
  })

  /*
   * El circuito del protocolo frente al acoso (Anexo II del II Plan, apartado
   * VIII). Se lee de que caja sale y a que caja llega cada flecha.
   */
  control('Protocolo · la denuncia entra por la Asesoría Confidencial, y de ella salen las tres vías', () => {
    const svg = porClave('circuito-protocolo-acoso')
    const tramos = piezas(svg, 'flecha').map((f) => extremos(svg, f))
    const deDenuncia = tramos.filter(([de]) => de === 'denuncia')
    if (!deDenuncia.length) throw new Error('ninguna flecha sale de la denuncia')
    for (const [, a] of deDenuncia) {
      if (a !== 'asesoria') throw new Error(`la denuncia va a «${a}»: la recibe la Asesoría Confidencial`)
    }
    const vias = tramos
      .filter(([de]) => de === 'asesoria')
      .map(([, a]) => a)
      .sort()
    if (vias.join(',') !== 'comite,inadmision,informal') {
      throw new Error(`de la Asesoría salen flechas a ${vias.join(', ') || 'ninguna parte'}: son la inadmisión, el informal y el formal`)
    }
    return 'denuncia → Asesoría Confidencial → inadmisión, informal o formal'
  })

  control('Protocolo · el informal sin acuerdo pasa al Comité, y solo el Comité llega a Relaciones Laborales', () => {
    const svg = porClave('circuito-protocolo-acoso')
    const tramos = piezas(svg, 'flecha').map((f) => extremos(svg, f))
    if (!tramos.some(([de, a]) => de === 'informal' && a === 'comite')) {
      throw new Error('el procedimiento informal sin acuerdo no pasa al Comité de Asesoramiento')
    }
    const aRelaciones = tramos.filter(([, a]) => a === 'relaciones').map(([de]) => de)
    if (!aRelaciones.length) throw new Error('ninguna flecha llega a Relaciones Laborales')
    const otro = aRelaciones.find((d) => d !== 'comite')
    if (otro) throw new Error(`a Relaciones Laborales llega una flecha desde «${otro}»: el expediente lo inicia el informe del Comité`)
    return 'informal → Comité si no hay acuerdo; Comité → Relaciones Laborales, y nadie más'
  })

  /*
   * Las instituciones de Aragon (Estatuto, arts. 32 a 60). Se lee de que caja
   * sale y a que caja llega cada flecha, como en el esquema de acreditacion.
   */
  control('Instituciones · el Justicia rinde cuentas ante las Cortes, que son quienes lo eligen', () => {
    const svg = porClave('instituciones-aragon')
    const rinde = piezas(svg, 'rinde-cuentas').map((f) => extremos(svg, f))
    if (!rinde.length) throw new Error('no hay ninguna flecha de «rinde cuentas»')
    for (const [de, a] of rinde) {
      if (de !== 'justicia' || a !== 'cortes') {
        throw new Error(`«rinde cuentas» va de «${de}» a «${a}»: el Justicia rinde cuentas de su gestión ante las Cortes (art. 59.3)`)
      }
    }
    const elige = piezas(svg, 'elige').map((f) => extremos(svg, f))
    if (!elige.some(([de, a]) => de === 'cortes' && a === 'justicia')) {
      throw new Error('ninguna flecha de «elige» va de las Cortes al Justicia (art. 41.b)')
    }
    return 'Justicia → Cortes (rinde cuentas), y Cortes → Justicia (lo eligen)'
  })

  control('Instituciones · al Presidente lo eligen las Cortes y lo nombra el Rey; a los consejeros, el Presidente', () => {
    const svg = porClave('instituciones-aragon')
    const elige = piezas(svg, 'elige').map((f) => extremos(svg, f))
    const nombra = piezas(svg, 'nombra').map((f) => extremos(svg, f))
    const alPresidente = elige.filter(([, a]) => a === 'presidente').map(([de]) => de)
    if (!alPresidente.length) throw new Error('ninguna flecha de «elige» llega al Presidente')
    const otro = alPresidente.find((de) => de !== 'cortes')
    if (otro) throw new Error(`al Presidente lo elige «${otro}»: lo eligen las Cortes, de entre sus diputados (art. 46.1)`)
    if (!elige.some(([de, a]) => de === 'pueblo' && a === 'cortes')) throw new Error('el pueblo no elige a las Cortes')
    if (!nombra.some(([de, a]) => de === 'rey' && a === 'presidente')) throw new Error('el Rey no nombra al Presidente (art. 46.1)')
    if (!nombra.some(([de, a]) => de === 'presidente' && a === 'gobierno')) {
      throw new Error('el Presidente no nombra a los miembros del Gobierno (art. 53.2)')
    }
    return 'pueblo → Cortes → Presidente, nombrado por el Rey; Presidente → Gobierno'
  })

  /*
   * Las tres clases de competencias (titulo V). La fila y la columna de cada
   * celda salen de su posicion, y quien ejerce la funcion, de su color
   * comparado con el de la leyenda.
   */
  control('Competencias · exclusivas, todo de Aragón; compartidas, desarrollo y ejecución; ejecutivas, solo la ejecución', () => {
    const svg = porClave('clases-competencias')
    const celdas = piezas(svg, 'celda')
    const ys = [...new Set(celdas.map((c) => num(c, 'y')))].sort((a, b) => a - b)
    const xs = [...new Set(celdas.map((c) => num(c, 'x')))].sort((a, b) => a - b)
    if (ys.length !== 3 || xs.length !== 3 || celdas.length !== 9) {
      throw new Error(`la tabla tiene ${celdas.length} celdas en ${ys.length} filas y ${xs.length} columnas: son 3 × 3`)
    }
    const pinta = (el) => `${el.getAttribute('fill')}|${el.getAttribute('fill-opacity')}`
    const aragon = pinta(pieza(svg, 'leyenda-aragon'))
    const estado = pinta(pieza(svg, 'leyenda-estado'))
    const ESPERADO = [
      [true, false, false],
      [true, true, false],
      [true, true, true],
    ]
    const FUNCION = ['la ley', 'el desarrollo', 'la ejecución']
    const CLASE = ['exclusivas', 'compartidas', 'ejecutivas']
    for (const c of celdas) {
      const i = ys.indexOf(num(c, 'y'))
      const j = xs.indexOf(num(c, 'x'))
      const quien = pinta(c) === aragon ? true : pinta(c) === estado ? false : null
      if (quien === null) throw new Error(`la celda de ${FUNCION[i]} en las ${CLASE[j]} no tiene el color de ninguna leyenda`)
      if (quien !== ESPERADO[i][j]) {
        throw new Error(`en las ${CLASE[j]}, ${FUNCION[i]} se ha pintado como de ${quien ? 'Aragón' : 'el Estado'}`)
      }
    }
    return 'Aragón: 3 funciones en las exclusivas, 2 en las compartidas y 1 en las ejecutivas'
  })

  control('Competencias · las columnas van en orden: exclusivas (art. 71), compartidas (art. 75) y ejecutivas (art. 77)', () => {
    const svg = porClave('clases-competencias')
    const textos = [...svg.querySelectorAll('text')]
    const x = (el) => {
      const c = el.getBBox()
      return c.x + c.width / 2
    }
    const cabeceras = ['Exclusivas', 'Compartidas', 'Ejecutivas'].map((n) => {
      const el = textos.find((t) => t.textContent.trim() === n)
      if (!el) throw new Error(`falta la cabecera «${n}»`)
      return x(el)
    })
    if (!(cabeceras[0] < cabeceras[1] && cabeceras[1] < cabeceras[2])) throw new Error('las cabeceras no van en orden de izquierda a derecha')
    const articulos = piezas(svg, 'articulo')
    const ESPERADO = ['art. 71', 'art. 75', 'art. 77']
    cabeceras.forEach((cx, j) => {
      const debajo = articulos.filter((a) => Math.abs(x(a) - cx) < 4)
      if (debajo.length !== 1) throw new Error(`la columna ${j + 1} tiene ${debajo.length} artículos bajo la cabecera`)
      const texto = debajo[0].textContent.trim()
      if (texto !== ESPERADO[j]) {
        throw new Error(`bajo «${['Exclusivas', 'Compartidas', 'Ejecutivas'][j]}» pone «${texto}» y es el ${ESPERADO[j]}`)
      }
    })
    return 'exclusivas → art. 71, compartidas → art. 75, ejecutivas → art. 77'
  })

  /*
   * Los plazos del titulo IV de la Ley 39/2015. La escala de dias sale de las
   * marcas del propio eje, y cada fila se lee por la altura de su rotulo.
   */
  const filasPlazos = (svg) => {
    const t0 = num(pieza(svg, 'tick-0'), 'x1')
    const porDia = (num(pieza(svg, 'tick-35'), 'x1') - t0) / 35
    if (!(porDia > 1)) throw new Error('las marcas del eje no dejan reconstruir la escala de días')
    const dia = (x) => (x - t0) / porDia
    const cy = (el) => {
      const b = el.getBBox()
      return b.y + b.height / 2
    }
    const cerca = (el, y) => Math.abs(cy(el) - y) < 12
    return piezas(svg, 'fila').map((r) => {
      const y = cy(r) + 4
      const de = (clave) => piezas(svg, clave).filter((el) => cerca(el, y))
      return {
        rotulo: r.textContent.trim(),
        fijos: de('fijo').map((el) => dia(num(el, 'x') + num(el, 'width') / 2)),
        tramos: de('tramo').map((el) => [dia(num(el, 'x')), dia(num(el, 'x') + num(el, 'width'))]),
        abiertos: de('abierto').map((el) => [dia(num(el, 'x')), dia(num(el, 'x') + num(el, 'width'))]),
        ampliaciones: de('ampliacion').map((el) => [dia(num(el, 'x1')), dia(num(el, 'x2'))]),
        cifras: de('cifra').map((el) => el.textContent.trim()).filter((s) => s),
      }
    })
  }
  const redondo = (v) => Math.round(v * 10) / 10

  control('Plazos · cada plazo está dibujado en su intervalo legal, en días hábiles', () => {
    const svg = porClave('plazos-procedimiento')
    const LEY = {
      'Subsanar la solicitud': { fijo: 10, ampliacion: [10, 15] },
      'Cumplir un trámite': { fijo: 10 },
      'Emitir un informe': { fijo: 10 },
      'Alegar tras actuaciones complementarias': { fijo: 7 },
      'Periodo de prueba': { tramo: [10, 30] },
      'Trámite de audiencia': { tramo: [10, 15] },
      'Información pública': { desde: 20 },
    }
    const filas = filasPlazos(svg)
    const vistas = new Set()
    for (const fl of filas) {
      const ley = LEY[fl.rotulo]
      if (!ley) throw new Error(`fila desconocida: «${fl.rotulo}»`)
      vistas.add(fl.rotulo)
      const mal = (dibujo, debe) => {
        throw new Error(`«${fl.rotulo}» está dibujado ${dibujo}, y la ley dice ${debe}`)
      }
      if (ley.fijo !== undefined) {
        if (fl.fijos.length !== 1 || Math.abs(fl.fijos[0] - ley.fijo) > 0.3) mal(`en ${fl.fijos.map(redondo).join(', ') || 'ningún día'}`, `${ley.fijo} días`)
      }
      if (ley.ampliacion) {
        const a = fl.ampliaciones[0]
        if (!a || Math.abs(a[0] - ley.ampliacion[0]) > 0.3 || Math.abs(a[1] - ley.ampliacion[1]) > 0.3) {
          mal(`con ampliación ${a ? a.map(redondo).join('-') : 'ninguna'}`, 'ampliable hasta 5 días más (art. 68.2)')
        }
      }
      if (ley.tramo) {
        const r = fl.tramos[0]
        if (!r || Math.abs(r[0] - ley.tramo[0]) > 0.3 || Math.abs(r[1] - ley.tramo[1]) > 0.3) {
          mal(`de ${r ? r.map(redondo).join(' a ') : '—'} días`, `de ${ley.tramo.join(' a ')}`)
        }
      }
      if (ley.desde !== undefined) {
        const r = fl.abiertos[0]
        if (!r || Math.abs(r[0] - ley.desde) > 0.3 || r[1] < 34.7) mal(`desde ${r ? redondo(r[0]) : '—'}`, `no menos de ${ley.desde} días y sin tope`)
      }
    }
    const faltan = Object.keys(LEY).filter((k) => !vistas.has(k))
    if (faltan.length) throw new Error(`faltan filas: ${faltan.join(', ')}`)
    return `${filas.length} plazos, cada uno en su intervalo legal`
  })

  control('Plazos · la cifra escrita en cada fila dice lo mismo que su dibujo', () => {
    const svg = porClave('plazos-procedimiento')
    for (const fl of filasPlazos(svg)) {
      if (fl.cifras.length !== 1) throw new Error(`«${fl.rotulo}» tiene ${fl.cifras.length} cifras escritas`)
      const n = (fl.cifras[0].match(/\d+/g) || []).map(Number)
      let dibujo
      if (fl.fijos.length) dibujo = [fl.fijos[0], ...fl.ampliaciones.map((a) => a[1] - a[0])]
      else if (fl.tramos.length) dibujo = fl.tramos[0]
      else dibujo = [fl.abiertos[0][0]]
      dibujo = dibujo.map((v) => Math.round(v))
      if (n.join(',') !== dibujo.join(',')) {
        throw new Error(`«${fl.rotulo}» dice «${fl.cifras[0]}» y el dibujo marca ${dibujo.join(' / ')}`)
      }
    }
    return 'cada cifra escrita coincide con su barra o su rombo'
  })

  /*
   * Las fases del titulo IV y la iniciacion de oficio. Se lee de que caja sale
   * y a que caja llega cada flecha.
   */
  const ORDEN_FASES = ['iniciacion', 'ordenacion', 'instruccion', 'finalizacion', 'ejecucion']

  control('Fases · las cinco fases van en el orden de los capítulos, y cada flecha une una con la siguiente', () => {
    const svg = porClave('fases-procedimiento')
    const cajas = ORDEN_FASES.map((c) => pieza(svg, 'nodo-' + c))
    const porX = [...cajas].sort((a, b) => num(a, 'x') - num(b, 'x')).map((c) => c.getAttribute('data-pieza').replace('nodo-', ''))
    if (porX.join() !== ORDEN_FASES.join()) throw new Error(`las fases van en el orden ${porX.join(' → ')}`)
    const tramos = piezas(svg, 'fase').map((f) => extremos(svg, f))
    if (tramos.length !== 4) throw new Error(`hay ${tramos.length} flechas entre fases y son 4`)
    for (const [de, a] of tramos) {
      const i = ORDEN_FASES.indexOf(de)
      if (i < 0 || ORDEN_FASES[i + 1] !== a) throw new Error(`una flecha va de «${de}» a «${a}»: cada fase lleva a la siguiente`)
    }
    return ORDEN_FASES.join(' → ')
  })

  control('Iniciación · propia iniciativa, orden superior, petición razonada y denuncia inician de oficio; ninguna cuelga de la solicitud', () => {
    const svg = porClave('fases-procedimiento')
    const VIAS = ['propia', 'orden', 'peticion', 'denuncia']
    const tramos = piezas(svg, 'via').map((f) => extremos(svg, f))
    for (const [de, a] of tramos) {
      if (!VIAS.includes(de)) throw new Error(`una vía de iniciación sale de «${de}»`)
      if (a !== 'oficio') throw new Error(`«${de}» lleva a «${a}»: las cuatro vías del art. 58 son de iniciación DE OFICIO`)
    }
    const origenes = tramos.map(([de]) => de).sort()
    if (origenes.join() !== [...VIAS].sort().join()) throw new Error(`llegan a «de oficio» ${origenes.join(', ')}; son las cuatro del art. 58`)
    const inicia = piezas(svg, 'inicia').map((f) => extremos(svg, f))
    for (const destino of ['oficio', 'solicitud']) {
      if (!inicia.some(([de, a]) => de === 'iniciacion' && a === destino)) throw new Error(`la iniciación no se abre en «${destino}» (art. 54)`)
    }
    return 'cuatro vías → de oficio; iniciación → de oficio o a solicitud'
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
  13: 'la muestra entrando por la corona exterior de la antorcha, no por el tubo central',
  14: 'la zona de medida pintada antes de la bobina',
  15: 'el cuadrupolo rotulado al principio de la cadena del ICP-MS',
  16: 'las presiones del ICP-MS, del revés',
  17: 'el detector de nefelometría, puesto en línea con la fuente',
  18: 'el haz saliendo de la cubeta tan grueso como entró',
  19: 'el rayo refractado, alejándose de la normal',
  20: 'la línea claro/oscuro del ocular, descentrada de la cruz',
  21: 'el plano de polarización, girado ya antes del tubo',
  22: 'el analizador, dejado vertical mientras el plano va girado',
  23: 'la laja del analizador, girada al revés que su propia rejilla',
  24: 'el tiempo muerto del cromatograma, llevado detrás del primer pico',
  25: 'la anchura del pico B, ensanchada sin tocar la resolución escrita',
  26: 'el rótulo de la precolumna, movido detrás de la columna separadora',
  27: 'el supresor, colocado después del detector de conductividad',
  28: 'el tubo de purga, subido por encima del nivel del agua',
  29: 'la aguja del espacio de cabeza, hundida en el agua',
  30: 'el rótulo del detector del CG, movido delante del inyector',
  31: 'la columna del CG, sacada fuera del horno',
  32: 'el pico polar de fase normal, adelantado delante del apolar',
  33: 'el pico polar de fase inversa, retrasado detrás del apolar',
  34: 'el perfil del gradiente, aplanado como el isocrático',
  35: 'el último pico del gradiente, ensanchado hasta el de la isocrática',
  36: 'la curva de cloración, aplanada desde el punto de ruptura',
  37: 'el rótulo del cloro libre, movido delante del punto de ruptura',
  38: 'el punto final de la fenolftaleína, despegado de la curva',
  39: 'un tramo de la curva de alcalinidad, levantado',
  40: 'un tramo de la curva de la DBO, hundido',
  41: 'la recta de la DQO, bajada por debajo de la DBO última',
  42: 'la caja de los sólidos disueltos, descolgada un nivel',
  43: 'la temperatura de calcinación, cambiada a 95 °C',
  44: 'el corchete del Kjeldahl, estirado hasta tragarse el nitrito',
  45: 'el corchete del nitrógeno total, encogido al tamaño del Kjeldahl',
  46: 'el último escalón del cadmio, hundido',
  47: 'la serie del cadmio, subida por encima del cobre',
  48: 'el envase de microbiología, llenado hasta la boca',
  49: 'el neutralizante, echado en el envase fisicoquímico',
  50: 'los objetivos a) y b) del grifo, intercambiados',
  51: 'la marca del RD 3/2023, corrida al objetivo c)',
  52: 'la bomba, puesta delante del cabezal de corte',
  53: 'digerir el filtro antes de pesarlo',
  54: 'la curva de PM2,5, corrida a diámetros menores',
  55: 'un tramo de la curva de PM10, hundido',
  56: 'los rótulos de la diana exacta y de la que falla en todo, intercambiados',
  57: 'la diana imprecisa y sesgada, con más sesgo que su vecina de fila',
  58: 'la hipotenusa estirada hasta la suma de los catetos',
  59: 'la incertidumbre expandida escrita con k = 3',
  60: 'el LC puesto al doble del LD',
  61: 'el intervalo de trabajo alargado hasta la meseta',
  62: 'el límite de aviso superior puesto a 2,5 s',
  63: 'el «dos de tres» del gráfico de control, sin marcar',
  64: 'la recta de calibrado inclinada a mano',
  65: 'un residuo dibujado con el signo cambiado',
  66: 'la incertidumbre del MRC mayor que la del patrón de trabajo',
  67: 'una flecha de la cadena de trazabilidad que no llega al eslabón siguiente',
  68: 'una entidad de certificación acreditando a un laboratorio',
  69: 'ENAC certificando directamente a la empresa',
  70: 'el primer ciclo de acreditación dibujado de 5 años',
  71: 'el segundo seguimiento retrasado hasta dejar 21 meses sin evaluación',
  72: 'la línea B.2 del Plan de Igualdad dibujada con un objetivo de menos',
  73: 'el total del eje C del Plan de Igualdad escrito con uno de más',
  74: 'la denuncia por acoso llevada directamente al Comité, sin pasar por la Asesoría',
  75: 'el informal sin acuerdo mandado a Relaciones Laborales, sin pasar por el Comité',
  76: 'el Justicia de Aragón rindiendo cuentas ante el Gobierno en vez de ante las Cortes',
  77: 'el Presidente de Aragón elegido directamente por el pueblo',
  78: 'en las competencias ejecutivas, el desarrollo normativo pintado como de Aragón',
  79: 'los artículos de las competencias compartidas y ejecutivas, cambiados de columna',
  80: 'el trámite de audiencia alargado a 20 días, dibujo y cifra de acuerdo entre sí pero no con la ley',
  81: 'la cifra del periodo de prueba escrita distinta de lo que dibuja su barra',
  82: 'de la iniciación a la instrucción, saltándose la ordenación',
  83: 'la denuncia colgada de la solicitud del interesado en vez de la iniciación de oficio',
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
  13: [12],
  14: [13],
  15: [14],
  16: [15],
  17: [16],
  18: [17],
  19: [18],
  20: [19],
  21: [20],
  22: [21],
  23: [21],
  24: [22],
  25: [23],
  26: [24],
  27: [25],
  28: [26],
  29: [27],
  30: [28],
  31: [29],
  32: [30],
  33: [31],
  34: [32],
  35: [33],
  36: [34],
  37: [35],
  38: [36],
  39: [37],
  40: [38],
  41: [39],
  42: [40],
  43: [41],
  44: [42],
  45: [43],
  46: [44],
  47: [45],
  48: [46],
  49: [47],
  50: [48],
  51: [49],
  52: [52],
  53: [53],
  54: [50],
  55: [51],
  56: [54],
  57: [55],
  58: [56],
  59: [57],
  60: [58],
  61: [59],
  62: [60],
  63: [61],
  64: [62],
  65: [63],
  66: [64],
  67: [65],
  68: [66],
  69: [67],
  70: [68],
  71: [69],
  72: [70],
  73: [71],
  74: [72],
  75: [73],
  76: [74],
  77: [75],
  78: [76],
  79: [77],
  80: [78],
  81: [79],
  82: [80],
  83: [81],
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
