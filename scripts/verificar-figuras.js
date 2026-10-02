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
  if (sabotaje === 84) {
    const svg = porClave('organos-zaragoza')
    // el Gobierno de Zaragoza respondiendo ante el Alcalde en vez de ante el Pleno
    const g = pieza(svg, 'nodo-gobierno')
    const a = pieza(svg, 'nodo-alcalde')
    const f = piezas(svg, 'responde').find((l) => Math.abs(num(l, 'y1') - num(g, 'y')) < 2 && num(l, 'x1') >= num(g, 'x'))
    f.setAttribute('x2', num(a, 'x') + num(a, 'width'))
    f.setAttribute('y2', num(a, 'y') + 6)
  }
  if (sabotaje === 85) {
    const svg = porClave('organos-zaragoza')
    // los miembros del Gobierno de Zaragoza nombrados por el Pleno
    const g = pieza(svg, 'nodo-gobierno')
    const p = pieza(svg, 'nodo-pleno')
    const f = piezas(svg, 'nombra').find((l) => Math.abs(num(l, 'x2') - num(g, 'x')) < 2)
    f.setAttribute('x1', num(p, 'x') + num(p, 'width'))
    f.setAttribute('y1', num(p, 'y') + 10)
  }
  if (sabotaje === 86) {
    const svg = porClave('umbrales-gran-poblacion')
    // la capital de provincia rebajada a 150.000, con su cifra: dibujo y rotulo de acuerdo, pero contra la ley
    const ticks = piezas(svg, 'tick').sort((a, b) => num(a, 'data-valor') - num(b, 'data-valor'))
    const x0 = num(ticks[0], 'x1')
    const porHab = (num(ticks[ticks.length - 1], 'x1') - x0) / num(ticks[ticks.length - 1], 'data-valor')
    const b = svg.querySelector('[data-pieza="supuesto"][data-letra="b"]')
    const fin = num(b, 'x') + num(b, 'width')
    b.setAttribute('x', x0 + 150000 * porHab)
    b.setAttribute('width', fin - (x0 + 150000 * porHab))
    svg.querySelector('[data-pieza="cifra"][data-letra="b"]').textContent = 'más de 150.000'
  }
  if (sabotaje === 87) {
    const svg = porClave('umbrales-gran-poblacion')
    // el supuesto d) pintado como si bastara la poblacion, sin decision de la Asamblea
    const ley = pieza(svg, 'leyenda-directo')
    const d = svg.querySelector('[data-pieza="supuesto"][data-letra="d"]')
    d.setAttribute('fill', ley.getAttribute('fill'))
    d.setAttribute('fill-opacity', ley.getAttribute('fill-opacity'))
  }
  if (sabotaje === 88) {
    const svg = porClave('umbrales-gran-poblacion')
    // la cifra del supuesto a) escrita distinta de donde arranca su barra
    svg.querySelector('[data-pieza="cifra"][data-letra="a"]').textContent = 'más de 300.000'
  }
  if (sabotaje === 89) {
    const svg = porClave('umbrales-gran-poblacion')
    // Zaragoza llevada a 160.000 habitantes, con su cifra: por debajo de los dos umbrales automaticos
    const ticks = piezas(svg, 'tick').sort((a, b) => num(a, 'data-valor') - num(b, 'data-valor'))
    const x0 = num(ticks[0], 'x1')
    const porHab = (num(ticks[ticks.length - 1], 'x1') - x0) / num(ticks[ticks.length - 1], 'data-valor')
    const z = pieza(svg, 'zaragoza')
    z.setAttribute('x1', x0 + 160000 * porHab)
    z.setAttribute('x2', x0 + 160000 * porHab)
    pieza(svg, 'cifra-zaragoza').textContent = 'Zaragoza: 160.000'
  }
  if (sabotaje === 90) {
    const svg = porClave('recursos-haciendas-locales')
    // las subvenciones y los precios publicos, cambiados de sitio: el orden a) - h) se rompe
    const t = [...svg.querySelectorAll('text')]
    const d = t.find((x) => x.textContent.trim().startsWith('d)'))
    const e = t.find((x) => x.textContent.trim().startsWith('e)'))
    const yd = d.getAttribute('y')
    d.setAttribute('y', e.getAttribute('y'))
    e.setAttribute('y', yd)
  }
  if (sabotaje === 91) {
    const svg = porClave('recursos-haciendas-locales')
    // los precios publicos colgados de los tributos propios, en lugar de las tasas
    const p = pieza(svg, 'nodo-precios')
    const r = piezas(svg, 'rama-clase').find((l) => l.getAttribute('data-a') === 'tasas')
    r.setAttribute('x2', num(p, 'x') + num(p, 'width'))
    r.setAttribute('y2', num(p, 'y') + num(p, 'height') / 2)
  }
  if (sabotaje === 92) {
    const svg = porClave('impuestos-municipales')
    // el IVTM pintado como potestativo
    const ley = pieza(svg, 'leyenda-potestativo')
    const r = svg.querySelector('[data-pieza="impuesto"][data-clave="ivtm"]')
    r.setAttribute('fill', ley.getAttribute('fill'))
    r.setAttribute('fill-opacity', ley.getAttribute('fill-opacity'))
  }
  if (sabotaje === 93) {
    const svg = porClave('impuestos-municipales')
    // el IIVTNU rotulado como indirecto
    svg.querySelector('[data-pieza="naturaleza"][data-clave="iivtnu"]').textContent = 'indirecto'
  }
  if (sabotaje === 94) {
    const svg = porClave('clases-empleados-publicos')
    // el personal directivo colgado de «empleados publicos» como una quinta clase
    const d = pieza(svg, 'directivo')
    const r = piezas(svg, 'rama')[0].cloneNode()
    r.setAttribute('x2', num(d, 'x') + num(d, 'width') / 2)
    r.setAttribute('y2', num(d, 'y'))
    svg.appendChild(r)
  }
  if (sabotaje === 95) {
    const svg = porClave('clases-empleados-publicos')
    // la llave de los funcionarios estirada hasta el personal laboral
    const c = svg.querySelector('[data-pieza="clase"][data-letra="c"]')
    const ll = pieza(svg, 'grupo-funcionarios')
    const n = ll.getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number)
    const x2 = num(c, 'x') + num(c, 'width')
    ll.setAttribute('d', `M${n[0]} ${n[1]} L${n[2]} ${n[3]} L${x2} ${n[5]} L${x2} ${n[7]}`)
  }
  if (sabotaje === 96) {
    const svg = porClave('prescripcion-faltas-sanciones')
    // la sancion leve acortada a seis meses, con su cifra: dibujo y rotulo de acuerdo, pero contra la ley
    const ticks = piezas(svg, 'tick').sort((a, b) => num(a, 'data-valor') - num(b, 'data-valor'))
    const x0 = num(ticks[0], 'x1')
    const porMes = (num(ticks[ticks.length - 1], 'x1') - x0) / num(ticks[ticks.length - 1], 'data-valor')
    svg.querySelector('[data-pieza="barra"][data-grado="leve"][data-tipo="sancion"]').setAttribute('width', 6 * porMes)
    svg.querySelector('[data-pieza="cifra"][data-grado="leve"][data-tipo="sancion"]').textContent = '6 meses'
  }
  if (sabotaje === 97) {
    const svg = porClave('prescripcion-faltas-sanciones')
    // la cifra de la falta grave escrita distinta de lo que dibuja su barra
    svg.querySelector('[data-pieza="cifra"][data-grado="grave"][data-tipo="falta"]').textContent = '3 años'
  }
  if (sabotaje === 98) {
    const svg = porClave('escalas-funcion-publica-local')
    // la Administrativa y la Auxiliar de Administracion General, cambiadas de orden
    const a = svg.querySelector('[data-pieza="subescala"][data-escala="general"][data-clave="administrativa"]')
    const b = svg.querySelector('[data-pieza="subescala"][data-escala="general"][data-clave="auxiliar"]')
    const ya = a.getAttribute('y')
    a.setAttribute('y', b.getAttribute('y'))
    b.setAttribute('y', ya)
  }
  if (sabotaje === 99) {
    const svg = porClave('escalas-funcion-publica-local')
    // los agentes forestales y medioambientales, metidos en la Subescala Tecnica
    const t = piezas(svg, 'clase').find((x) => x.textContent.trim().startsWith('Agentes forestales'))
    const tec = svg.querySelector('[data-pieza="subescala"][data-escala="especial"][data-clave="tecnica"]')
    t.setAttribute('y', num(tec, 'y') + 20)
  }
  if (sabotaje === 100) {
    const svg = porClave('umbrales-prevencion')
    // el servicio de prevencion propio obligatorio desde 250, con su cifra: dibujo y rotulo de acuerdo, pero contra la norma
    const ticks = piezas(svg, 'tick').sort((a, b) => num(a, 'data-valor') - num(b, 'data-valor'))
    const x0 = num(ticks[0], 'x1')
    const porDec = (num(ticks[ticks.length - 1], 'x1') - x0) / Math.log10(num(ticks[ticks.length - 1], 'data-valor'))
    const r = svg.querySelector('[data-pieza="tramo"][data-clave="propio"][data-tipo="principal"]')
    const fin = num(r, 'x') + num(r, 'width')
    r.setAttribute('x', x0 + Math.log10(250) * porDec)
    r.setAttribute('width', fin - (x0 + Math.log10(250) * porDec))
    svg.querySelector('[data-pieza="tramo"][data-clave="propio"][data-tipo="condicionado"]').remove()
    svg.querySelector('[data-pieza="cifra"][data-clave="propio"]').textContent = 'más de 250'
  }
  if (sabotaje === 101) {
    const svg = porClave('umbrales-prevencion')
    // la cifra del Comite de Seguridad y Salud escrita distinta de donde arranca su tramo
    svg.querySelector('[data-pieza="cifra"][data-clave="comite"]').textContent = 'desde 100'
  }
  if (sabotaje === 102) {
    const svg = porClave('grupos-riesgo-biologico')
    // el grupo 3 pintado sin profilaxis ni tratamiento, como si fuera del 4
    svg.querySelector('[data-pieza="celda"][data-grupo="3"][data-criterio="profilaxis"]').textContent = 'generalmente no'
  }
  if (sabotaje === 103) {
    const svg = porClave('grupos-riesgo-biologico')
    // el grupo 3 manipulado en nivel de contencion 2
    svg.querySelector('[data-pieza="celda"][data-grupo="3"][data-criterio="contencion"]').textContent = 'nivel 2'
  }
  if (sabotaje === 104) {
    const svg = porClave('cadena-transmision')
    // de la salida a la via de entrada, saltandose el mecanismo de transmision
    const s = svg.querySelector('[data-pieza="eslabon"][data-clave="salida"]')
    const v = svg.querySelector('[data-pieza="eslabon"][data-clave="via"]')
    // el enlace que sale del borde derecho de la salida
    const l = piezas(svg, 'enlace').find((e) => Math.abs(num(e, 'x1') - (num(s, 'x') + num(s, 'width'))) < 1)
    l.setAttribute('x2', num(v, 'x'))
  }
  if (sabotaje === 105) {
    const svg = porClave('cadena-transmision')
    // la via parenteral, quitada de la lista
    piezas(svg, 'via-entrada').find((t) => t.textContent.trim().startsWith('parenteral')).remove()
  }
  if (sabotaje === 106) {
    const svg = porClave('clases-cabinas')
    // un flujo descendente laminar metido en la clase I, como si protegiera el producto
    const d = svg.querySelector('[data-pieza="flujo"][data-clase="II"][data-tipo="descendente"]')
    const copia = d.cloneNode(true)
    copia.setAttribute('data-clase', 'I')
    copia.setAttribute('x1', num(d, 'x1') - 190)
    copia.setAttribute('x2', num(d, 'x2') - 190)
    d.parentNode.appendChild(copia)
  }
  if (sabotaje === 107) {
    const svg = porClave('clases-cabinas')
    // la clase III con un solo HEPA de salida, en vez de dos en serie
    svg.querySelectorAll('[data-pieza="hepa"][data-clase="III"][data-uso="extraccion"]')[1].remove()
  }
  if (sabotaje === 108) {
    const svg = porClave('microscopio-optico')
    // el condensador subido por encima de la platina
    svg.querySelector('[data-pieza="elemento"][data-clave="condensador"]').setAttribute('y', 150)
  }
  if (sabotaje === 109) {
    const svg = porClave('microscopio-optico')
    // el aumento total escrito como si fuera solo el del objetivo
    svg.querySelector('[data-pieza="cifra"][data-clave="total"]').textContent = 'Aumento total: 10 × 100 = 100×'
  }
  if (sabotaje === 110) {
    const svg = porClave('resistencia-descontaminacion')
    // los hongos subidos por encima de las micobacterias
    const h = svg.querySelector('[data-pieza="banda"][data-clave="hongos"]')
    const m = svg.querySelector('[data-pieza="banda"][data-clave="micobacterias"]')
    const yh = num(h, 'y')
    h.setAttribute('y', num(m, 'y'))
    m.setAttribute('y', yh)
  }
  if (sabotaje === 111) {
    const svg = porClave('resistencia-descontaminacion')
    // el hipoclorito rebajado a desinfectante de nivel bajo
    const t = piezas(svg, 'agente').find((a) => a.textContent.trim() === 'hipocloritos')
    const bajo = svg.querySelector('[data-pieza="metodo"][data-clave="bajo"]')
    t.setAttribute('y', num(bajo, 'y') + 38)
  }
  if (sabotaje === 112) {
    const svg = porClave('binomios-esterilizacion')
    // el autoclave a 121 °C con 20 minutos, dibujo y rotulo de acuerdo entre si pero no con la guia
    const x20 = num(svg.querySelector('[data-pieza="tick-x"][data-valor="20"]'), 'x1')
    const p = svg.querySelector('[data-pieza="punto"][data-clave="v121"]')
    const r = svg.querySelector('[data-pieza="rotulo"][data-clave="v121"]')
    p.setAttribute('cx', x20)
    r.setAttribute('x', x20 + 7)
    r.textContent = '121 °C · 20 min'
  }
  if (sabotaje === 113) {
    const svg = porClave('binomios-esterilizacion')
    // el rotulo del horno a 170 °C escrito con otro tiempo del que dibuja su punto
    svg.querySelector('[data-pieza="rotulo"][data-clave="s170"]').textContent = '170 °C · 30 min'
  }
  if (sabotaje === 114) {
    const svg = porClave('agotamiento-cuadrantes')
    // la estria del tercer cuadrante arrancando en el primero, saltandose el segundo
    const p = pieza(svg, 'placa')
    const e = svg.querySelector('[data-pieza="estria"][data-cuadrante="3"]')
    e.setAttribute('d', e.getAttribute('d').replace(/^M [\d.-]+ [\d.-]+/, `M ${num(p, 'cx') + 50} ${num(p, 'cy') - 50}`))
  }
  if (sabotaje === 115) {
    const svg = porClave('agotamiento-cuadrantes')
    // cuatro colonias de mas en el ultimo cuadrante, que deja de tener menos que el anterior
    const p = pieza(svg, 'placa')
    const base = piezas(svg, 'colonia').find((c) => num(c, 'cx') < num(p, 'cx') - 40 && num(c, 'cy') < num(p, 'cy') - 40)
    for (const [dx, dy] of [[10, 0], [-10, 0], [0, 10], [0, -10]]) {
      const c = base.cloneNode(true)
      c.setAttribute('cx', num(base, 'cx') + dx)
      c.setAttribute('cy', num(base, 'cy') + dy)
      base.parentNode.appendChild(c)
    }
  }
  if (sabotaje === 116) {
    const svg = porClave('siembra-profundidad-superficie')
    // una colonia de la siembra en superficie hundida dentro del agar
    const agar = svg.querySelector('[data-pieza="agar"][data-tecnica="superficie"]')
    const c = svg.querySelector('[data-pieza="colonia"][data-tecnica="superficie"]')
    c.setAttribute('cy', num(agar, 'y') + 14)
  }
  if (sabotaje === 117) {
    const svg = porClave('siembra-profundidad-superficie')
    // los volumenes cambiados: 0,1 ml en profundidad y 1 ml en superficie
    const a = svg.querySelector('[data-pieza="volumen"][data-tecnica="profundidad"]')
    const b = svg.querySelector('[data-pieza="volumen"][data-tecnica="superficie"]')
    const t = a.textContent
    a.textContent = b.textContent
    b.textContent = t
  }
  if (sabotaje === 118) {
    const svg = porClave('banco-diluciones')
    // la transferencia al tercer tubo sale del primero, saltandose el segundo
    const t1 = svg.querySelector('[data-pieza="tubo"][data-exponente="1"]')
    const tr = svg.querySelector('[data-pieza="transferencia"][data-hasta="3"]')
    tr.setAttribute('d', tr.getAttribute('d').replace(/^M [\d.-]+/, `M ${num(t1, 'x') + 12}`))
  }
  if (sabotaje === 119) {
    const svg = porClave('banco-diluciones')
    // la placa de una sola colonia marcada como contable
    svg.querySelector('[data-pieza="placa"][data-exponente="4"]').setAttribute('stroke', ROJO)
  }
  if (sabotaje === 120) {
    const svg = porClave('bandeja-nmp-51')
    // un halo de fluorescencia movido a un pocillo que no es amarillo
    const blanco = [...svg.querySelectorAll('[data-pieza="pocillo"]')].find((p) => p.getAttribute('fill') === '#f4f1e6')
    const h = svg.querySelector('[data-pieza="halo"]')
    h.setAttribute('cx', num(blanco, 'x') + 12)
    h.setAttribute('cy', num(blanco, 'y') + 13)
  }
  if (sabotaje === 121) {
    const svg = porClave('bandeja-nmp-51')
    // el NMP de coliformes buscado con 23 + 11 = 34 pocillos
    const r = svg.querySelector('[data-pieza="resultado"][data-grupo="coliformes"]')
    r.textContent = r.textContent.replace('30,6', '56,0')
  }
  if (sabotaje === 122) {
    const svg = porClave('tincion-gram')
    // el decolorante antes que el lugol: se intercambian los rotulos de los pasos 2 y 3
    const a = svg.querySelector('[data-pieza="paso"][data-orden="2"]')
    const b = svg.querySelector('[data-pieza="paso"][data-orden="3"]')
    const t = a.textContent
    a.textContent = b.textContent
    b.textContent = t
  }
  if (sabotaje === 123) {
    const svg = porClave('tincion-gram')
    // la gramnegativa sigue violeta despues del decolorante
    svg.querySelector('[data-pieza="celula"][data-paso="3"][data-pared="negativa"]').setAttribute('fill', '#6a3d9a')
  }
  if (sabotaje === 124) {
    const svg = porClave('gota-pendiente')
    // la gota, el doble de alta, llega al fondo de la excavacion
    const g = svg.querySelector('[data-pieza="gota"]')
    g.setAttribute('d', g.getAttribute('d').replace('A 19 12', 'A 19 24'))
  }
  if (sabotaje === 125) {
    const svg = porClave('gota-pendiente')
    // el cubre de la preparacion entre porta y cubre, levantado: la pelicula ya no lo toca
    svg.querySelector('[data-pieza="cubre"][data-panel="fresco"]').setAttribute('y', 70)
  }
  if (sabotaje === 126) {
    const svg = porClave('tres-dominios')
    // las cianobacterias colocadas bajo Eucarya, como si fueran algas
    const euc = svg.querySelector('[data-pieza="nodo"][data-dominio="Eucarya"]')
    const c = [...svg.querySelectorAll('[data-pieza="grupo"]')].find((g) => g.textContent.trim() === 'Cianobacterias')
    c.setAttribute('x', num(euc, 'cx'))
    c.setAttribute('y', 190)
  }
  if (sabotaje === 127) {
    const svg = porClave('tres-dominios')
    // la llave de procariotas alargada hasta abarcar Eucarya
    const l = svg.querySelector('[data-pieza="llave"][data-texto="Procariotas"]')
    l.setAttribute('d', l.getAttribute('d').replace(/L 270 214 L 270 208/, 'L 400 214 L 400 208'))
  }
  if (sabotaje === 128) {
    const svg = porClave('estructura-virus')
    // el acido nucleico del virus desnudo sacado de su capside
    const an = svg.querySelector('[data-pieza="acido-nucleico"][data-virion="desnudo"]')
    an.setAttribute('d', an.getAttribute('d').replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${Number(x) + 120} ${y}`))
  }
  if (sabotaje === 129) {
    const svg = porClave('estructura-virus')
    // una espicula girada hacia el interior de la envoltura
    const env = svg.querySelector('[data-pieza="envoltura"]')
    const e = svg.querySelector('[data-pieza="espicula"]')
    const [cx, cy] = [num(env, 'cx'), num(env, 'cy')]
    e.setAttribute('x2', 2 * num(e, 'x1') - num(e, 'x2'))
    e.setAttribute('y2', 2 * num(e, 'y1') - num(e, 'y2'))
    void cx
    void cy
  }
  if (sabotaje === 130) {
    const svg = porClave('ciclo-pcr')
    // la hibridacion del primer ciclo subida a la temperatura de la elongacion
    const h = svg.querySelector('[data-pieza="meseta"][data-ciclo="1"][data-fase="hibridacion"]')
    const e = svg.querySelector('[data-pieza="meseta"][data-ciclo="1"][data-fase="elongacion"]')
    h.setAttribute('y1', e.getAttribute('y1'))
    h.setAttribute('y2', e.getAttribute('y2'))
  }
  if (sabotaje === 131) {
    const svg = porClave('ciclo-pcr')
    // los rotulos de hibridacion y elongacion intercambiados
    const a = svg.querySelector('[data-pieza="fase"][data-fase="hibridacion"]')
    const b = svg.querySelector('[data-pieza="fase"][data-fase="elongacion"]')
    const t = a.textContent
    a.textContent = b.textContent
    b.textContent = t
  }
  if (sabotaje === 132) {
    const svg = porClave('arbol-gramnegativos')
    // la arista de Proteus sale directamente de la raiz, saltandose las enterobacterias
    const raiz = svg.querySelector('[data-pieza="nodo"][data-id="raiz"]')
    const a = svg.querySelector('[data-pieza="arista"][data-arista="proteus"]')
    a.setAttribute('x1', num(raiz, 'x') + num(raiz, 'width') / 2)
    a.setAttribute('y1', num(raiz, 'y') + num(raiz, 'height'))
  }
  if (sabotaje === 133) {
    const svg = porClave('arbol-gramnegativos')
    // Salmonella pintada como ureasa positiva: los rotulos de Proteus y Salmonella intercambiados
    const a = svg.querySelector('[data-pieza="rotulo-arista"][data-arista="proteus"]')
    const b = svg.querySelector('[data-pieza="rotulo-arista"][data-arista="salmonella"]')
    const t = a.textContent
    a.textContent = b.textContent
    b.textContent = t
  }
  if (sabotaje === 134) {
    const svg = porClave('control-semicuantitativo')
    // tres estrias de la placa buena se quedan sin colonias, pero la puntuacion sigue diciendo 14
    for (const q of ['1', '2', '3']) {
      const e = svg.querySelector(`[data-pieza="estria"][data-placa="buena"][data-cuarto="${q}"][data-orden="1"]`)
      const [x1, y1, x2, y2] = ['x1', 'y1', 'x2', 'y2'].map((a) => num(e, a))
      for (const c of [...svg.querySelectorAll('[data-pieza="colonia"][data-placa="buena"]')]) {
        const [cx, cy] = [num(c, 'cx'), num(c, 'cy')]
        const cruz = Math.abs((x2 - x1) * (cy - y1) - (y2 - y1) * (cx - x1)) / Math.hypot(x2 - x1, y2 - y1)
        if (cruz < 2.5 && cx >= Math.min(x1, x2) - 3 && cx <= Math.max(x1, x2) + 3) c.remove()
      }
    }
  }
  if (sabotaje === 135) {
    const svg = porClave('control-semicuantitativo')
    // la placa mala (5 de 16) dada por buena
    svg.querySelector('[data-pieza="veredicto"][data-placa="mala"]').textContent = 'apto: llega al mínimo'
  }
  if (sabotaje === 136) {
    const svg = porClave('recuperacion-medio')
    // la linea del 50 % subida al 60 % del no selectivo
    const u = svg.querySelector('[data-pieza="umbral"]')
    const b = svg.querySelector('[data-pieza="barra"][data-medio="no-selectivo"]')
    const y = num(b, 'y') + 0.4 * num(b, 'height')
    u.setAttribute('y1', y)
    u.setAttribute('y2', y)
  }
  if (sabotaje === 137) {
    const svg = porClave('recuperacion-medio')
    // el lote C (39 %) dado por apto
    svg.querySelector('[data-pieza="veredicto"][data-medio="lote-c"]').textContent = 'apto'
  }
  if (sabotaje === 138) {
    const svg = porClave('membrana-cca')
    // una colonia azul-violeta (E. coli) pintada de rosa: la leyenda y el resultado de E. coli no cambian
    const rosa = svg.querySelector('[data-pieza="muestra"][data-color="rosa"]').getAttribute('fill')
    const violeta = svg.querySelector('[data-pieza="muestra"][data-color="violeta"]').getAttribute('fill')
    const k = [...svg.querySelectorAll('[data-pieza="colonia"]')].find((c) => c.getAttribute('fill') === violeta)
    k.setAttribute('fill', rosa)
  }
  if (sabotaje === 139) {
    const svg = porClave('membrana-cca')
    // los coliformes totales contados solo con las rosas, olvidando que E. coli es coliforme
    const t = svg.querySelector('[data-pieza="resultado"][data-parametro="coliformes"]')
    t.textContent = 'Coliformes totales: 8 ufc/100 mL'
  }
  if (sabotaje === 140) {
    const svg = porClave('tsc-mup')
    // un halo fluorescente pintado en un hueco del filtro, sin colonia debajo
    const h = svg.querySelector('[data-pieza="halo"]').cloneNode()
    const m = svg.querySelector('[data-pieza="membrana"][data-panel="uv"]')
    h.setAttribute('cx', num(m, 'cx') + 50)
    h.setAttribute('cy', num(m, 'cy') - 10)
    svg.querySelector('[data-pieza="halo"]').parentNode.appendChild(h)
  }
  if (sabotaje === 141) {
    const svg = porClave('tsc-mup')
    // todas las colonias negras contadas como C. perfringens, sin mirar la fluorescencia
    svg.querySelector('[data-pieza="recuento"]').textContent = '6 con halo: C. perfringens 6 ufc/100 mL'
  }
  if (sabotaje === 142) {
    const svg = porClave('plan-tres-clases')
    // en el lote B (aceptable), el valor de 30 ufc/g subido a 800, por encima de M, sin cambiar el veredicto
    const m = [...svg.querySelectorAll('[data-pieza="marca"]')].map((e) => [num(e, 'x1'), Math.log10(num(e, 'data-valor'))]).sort((a, b) => a[0] - b[0])
    const [[xa, la], [xb, lb]] = [m[0], m[m.length - 1]]
    const xDe = (v) => xa + ((Math.log10(v) - la) * (xb - xa)) / (lb - la)
    const p = [...svg.querySelectorAll('[data-pieza="valor"][data-lote="B"]')].find((c) => Math.abs(num(c, 'cx') - xDe(30)) < 1)
    p.setAttribute('cx', xDe(800))
  }
  if (sabotaje === 143) {
    const svg = porClave('plan-tres-clases')
    // la línea M desplazada a 1000 ufc/g
    const mil = num(svg.querySelector('[data-pieza="marca"][data-valor="1000"]'), 'x1')
    const l = svg.querySelector('[data-pieza="limite"][data-limite="M"]')
    l.setAttribute('x1', mil)
    l.setAttribute('x2', mil)
  }
  if (sabotaje === 144) {
    const svg = porClave('nmp-moluscos')
    // un tubo de la fila de 0,1 g con colonias crema en el TBX contado como positivo (placa pintada de azul)
    const azul = svg.querySelector('[data-pieza="leyenda"][data-clase="azul"]').getAttribute('fill')
    const crema = svg.querySelector('[data-pieza="leyenda"][data-clase="crema"]').getAttribute('fill')
    const tubos = [...svg.querySelectorAll('[data-pieza="tubo"][data-dilucion="0.1"]')]
    const placas = [...svg.querySelectorAll('[data-pieza="placa-tbx"]')].filter((q) => q.getAttribute('fill') === crema)
    const p = placas.find((q) => tubos.some((t) => Math.abs(num(q, 'cx') - (num(t, 'x') + num(t, 'width') / 2)) < 2 && num(q, 'cy') > num(t, 'y') && num(q, 'cy') - num(t, 'y') < 80))
    p.setAttribute('fill', azul)
  }
  if (sabotaje === 145) {
    const svg = porClave('nmp-moluscos')
    // el NMP escrito no es el del código: 330, que es el de 5-1-0
    svg.querySelector('[data-pieza="nmp"]').textContent = 'NMP = 330 por 100 g'
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

  /*
   * Los organos de gobierno de Zaragoza (Ley 10/2017, arts. 8 a 14). Se lee de
   * que caja sale y a que caja llega cada flecha, como en las instituciones de
   * Aragon.
   */
  control('Zaragoza · el Alcalde y el Gobierno de Zaragoza responden ante el Pleno, y nadie responde ante otro órgano', () => {
    const svg = porClave('organos-zaragoza')
    const responde = piezas(svg, 'responde').map((f) => extremos(svg, f))
    for (const [de, a] of responde) {
      if (a !== 'pleno') throw new Error(`«${de}» responde ante «${a}»: el Alcalde y el Gobierno responden ante el Pleno (arts. 12.1 y 13.3)`)
    }
    const quien = responde.map(([de]) => de).sort()
    if (quien.join() !== 'alcalde,gobierno') throw new Error(`responden ante el Pleno: ${quien.join(', ') || 'nadie'}; son el Alcalde y el Gobierno`)
    return 'Alcalde → Pleno y Gobierno de Zaragoza → Pleno'
  })

  control('Zaragoza · el Alcalde preside el Pleno y el Gobierno, y es él quien nombra a los miembros del Gobierno', () => {
    const svg = porClave('organos-zaragoza')
    const preside = piezas(svg, 'preside').map((f) => extremos(svg, f))
    for (const [de, a] of preside) {
      if (de !== 'alcalde') throw new Error(`«${de}» preside «${a}»: los preside el Alcalde (art. 12.1.d)`)
    }
    for (const org of ['pleno', 'gobierno']) {
      if (!preside.some(([, a]) => a === org)) throw new Error(`nadie preside «${org}» en el dibujo`)
    }
    const alGobierno = piezas(svg, 'nombra')
      .map((f) => extremos(svg, f))
      .filter(([, a]) => a === 'gobierno')
    if (!alGobierno.length) throw new Error('ninguna flecha de «nombra» llega al Gobierno de Zaragoza')
    const otro = alGobierno.find(([de]) => de !== 'alcalde')
    if (otro) throw new Error(`a los miembros del Gobierno los nombra «${otro[0]}»: los nombra y separa libremente el Alcalde (art. 13.2)`)
    return 'Alcalde → preside Pleno y Gobierno; Alcalde → nombra y separa al Gobierno'
  })

  /*
   * Los supuestos del art. 121.1 LBRL. La escala sale de las marcas del eje, que
   * llevan su valor; cada barra se lee donde empieza y cada cifra escrita se
   * compara con la ley y con su barra. Quien decide, por el color frente a la
   * leyenda.
   */
  const escalaHab = (svg) => {
    const ticks = piezas(svg, 'tick')
      .map((t) => [num(t, 'x1'), num(t, 'data-valor')])
      .sort((a, b) => a[1] - b[1])
    if (ticks.length < 2) throw new Error('el eje no tiene marcas suficientes')
    const [xa, va] = ticks[0]
    const [xb, vb] = ticks[ticks.length - 1]
    for (const [x, v] of ticks) {
      const esperado = xa + ((v - va) / (vb - va)) * (xb - xa)
      if (Math.abs(x - esperado) > 0.5) throw new Error(`la marca de ${v} no está en su sitio: la escala no es lineal`)
    }
    return (x) => va + ((x - xa) / (xb - xa)) * (vb - va)
  }
  const cifraHab = (texto) => {
    const t = texto.replace(/\s+/g, ' ').trim()
    if (/sin m[ií]nimo/i.test(t)) return 0
    const m = t.match(/\d{1,3}(?:\.\d{3})+|\d+/)
    if (!m) throw new Error(`la cifra «${t}» no se puede leer`)
    return Number(m[0].replace(/\./g, ''))
  }

  control('Gran población · cada supuesto arranca en su cifra legal (250.000, 175.000, sin mínimo y 75.000) y su rótulo dice lo mismo', () => {
    const svg = porClave('umbrales-gran-poblacion')
    const hab = escalaHab(svg)
    const LEY = { a: 250000, b: 175000, c: 0, d: 75000 }
    const barras = piezas(svg, 'supuesto')
    if (barras.length !== 4) throw new Error(`hay ${barras.length} supuestos y el art. 121.1 tiene 4`)
    const leidos = []
    for (const barra of barras) {
      const letra = barra.getAttribute('data-letra')
      if (!(letra in LEY)) throw new Error(`supuesto desconocido: «${letra}»`)
      const desde = hab(num(barra, 'x'))
      if (Math.abs(desde - LEY[letra]) > 2000) {
        throw new Error(`el supuesto ${letra}) arranca en ${Math.round(desde)} habitantes, y la ley dice ${LEY[letra]}`)
      }
      const cifra = svg.querySelector(`[data-pieza="cifra"][data-letra="${letra}"]`)
      if (!cifra) throw new Error(`el supuesto ${letra}) no tiene cifra escrita`)
      const escrita = cifraHab(cifra.textContent)
      if (Math.abs(escrita - desde) > 2000) {
        throw new Error(`el supuesto ${letra}) dice «${cifra.textContent.trim()}» y su barra arranca en ${Math.round(desde)}`)
      }
      leidos.push(`${letra}) ${escrita}`)
    }
    return leidos.sort().join(' · ')
  })

  control('Gran población · a) y b) bastan por sí solos, c) y d) exigen decisión de la Asamblea, y Zaragoza supera a) y b)', () => {
    const svg = porClave('umbrales-gran-poblacion')
    const pinta = (el) => `${el.getAttribute('fill')}|${el.getAttribute('fill-opacity')}`
    const directo = pinta(pieza(svg, 'leyenda-directo'))
    const cortes = pinta(pieza(svg, 'leyenda-cortes'))
    const ESPERADO = { a: false, b: false, c: true, d: true }
    const barra = {}
    for (const b of piezas(svg, 'supuesto')) {
      const letra = b.getAttribute('data-letra')
      barra[letra] = b
      const necesita = pinta(b) === cortes ? true : pinta(b) === directo ? false : null
      if (necesita === null) throw new Error(`el supuesto ${letra}) no tiene el color de ninguna leyenda`)
      if (necesita !== ESPERADO[letra]) {
        throw new Error(
          `el supuesto ${letra}) está pintado como ${necesita ? 'necesitado de la Asamblea' : 'automático'}: ` +
            'solo c) y d) exigen que lo decida la Asamblea Legislativa a iniciativa del ayuntamiento (art. 121.1)',
        )
      }
    }
    const hab = escalaHab(svg)
    const z = hab(num(pieza(svg, 'zaragoza'), 'x1'))
    const escrita = cifraHab(pieza(svg, 'cifra-zaragoza').textContent)
    if (Math.abs(escrita - z) > 2000) throw new Error(`Zaragoza dice ${escrita} y su línea está en ${Math.round(z)}`)
    for (const letra of ['a', 'b']) {
      const desde = hab(num(barra[letra], 'x'))
      if (!(z > desde)) throw new Error(`Zaragoza (${Math.round(z)}) no supera el umbral del supuesto ${letra}) (${Math.round(desde)})`)
    }
    return `a) y b) automáticos, c) y d) con Asamblea; Zaragoza en ${Math.round(z)}, por encima de a) y de b)`
  })

  /*
   * Los recursos de las entidades locales (art. 2.1 TRLRHL). El orden se lee por
   * la altura de las etiquetas a) a h); de que caja sale y a que caja llega cada
   * rama, por sus extremos, como en los demas diagramas de cajas.
   */
  const dentroDe = (el, x, y) => {
    const b = el.getBBox()
    return x >= b.x - 3 && x <= b.x + b.width + 3 && y >= b.y - 3 && y <= b.y + b.height + 3
  }
  control('Recursos · los ocho recursos del art. 2.1 van en el orden a) a h), y cada uno recibe su rama', () => {
    const svg = porClave('recursos-haciendas-locales')
    const etiquetas = [...svg.querySelectorAll('text')]
      .filter((t) => /^[a-h]\) /.test(t.textContent.trim()))
      .map((t) => ({ t, b: t.getBBox() }))
      .sort((p, q) => p.b.y - q.b.y)
    const letras = etiquetas.map((e) => e.t.textContent.trim()[0]).join('')
    if (letras !== 'abcdefgh') throw new Error(`las etiquetas van en el orden ${letras.split('').join(', ')}: el art. 2.1 las enumera de la a) a la h)`)
    const ramas = piezas(svg, 'rama-recurso')
    for (const { t, b } of etiquetas) {
      const cx = b.x + 2
      const cy = b.y + b.height / 2
      const caja = [...svg.querySelectorAll('[data-pieza^="nodo-"]')].find((c) => dentroDe(c, cx, cy))
      if (!caja) throw new Error(`«${t.textContent.trim()}» no está dentro de ninguna caja`)
      const llega = ramas.some((r) => dentroDe(caja, num(r, 'x2'), num(r, 'y2')))
      if (!llega) throw new Error(`ninguna rama llega a «${t.textContent.trim()}»`)
    }
    return 'a, b, c, d, e, f, g, h; ocho ramas, una por recurso'
  })

  control('Recursos · de los tributos propios cuelgan tasas, contribuciones especiales e impuestos, y no los precios públicos', () => {
    const svg = porClave('recursos-haciendas-locales')
    const trib = pieza(svg, 'nodo-tributos')
    const destinos = piezas(svg, 'rama-clase').map((r) => {
      if (!dentroDe(trib, num(r, 'x1'), num(r, 'y1'))) throw new Error('una rama de clase no sale de los tributos propios')
      const caja = [...svg.querySelectorAll('[data-pieza^="nodo-"]')].find((c) => c !== trib && dentroDe(c, num(r, 'x2'), num(r, 'y2')))
      return caja ? caja.getAttribute('data-pieza').replace('nodo-', '') : null
    })
    if (destinos.includes('precios')) throw new Error('los precios públicos cuelgan de los tributos propios, y no son tributos (art. 2.1.e)')
    const esperado = ['contribuciones', 'impuestos', 'tasas']
    if ([...destinos].sort().join() !== esperado.join()) throw new Error(`de los tributos propios cuelgan ${destinos.join(', ')}; son tasas, contribuciones especiales e impuestos`)
    return 'tributos propios → tasas, contribuciones especiales, impuestos'
  })

  /*
   * Los impuestos municipales (art. 59). Cada caja se identifica por la sigla
   * escrita dentro; obligatorio o potestativo, por el color frente a la leyenda;
   * directo o indirecto, por el rotulo de su naturaleza.
   */
  const impuestos = (svg) =>
    piezas(svg, 'impuesto').map((r) => {
      const sigla = [...svg.querySelectorAll('text')].find((t) => {
        const b = t.getBBox()
        return /^[A-Z]{3,6}$/.test(t.textContent.trim()) && dentroDe(r, b.x + b.width / 2, b.y + b.height / 2)
      })
      const nat = piezas(svg, 'naturaleza').find((t) => {
        const b = t.getBBox()
        return dentroDe(r, b.x + b.width / 2, b.y + b.height / 2)
      })
      return { r, sigla: sigla ? sigla.textContent.trim() : null, nat: nat ? nat.textContent.trim() : null }
    })
  control('Impuestos · IBI, IAE e IVTM pintados como obligatorios, e ICIO e IIVTNU como potestativos (art. 59)', () => {
    const svg = porClave('impuestos-municipales')
    const pinta = (el) => `${el.getAttribute('fill')}|${el.getAttribute('fill-opacity')}`
    const ob = pinta(pieza(svg, 'leyenda-obligatorio'))
    const po = pinta(pieza(svg, 'leyenda-potestativo'))
    const ESPERADO = { IBI: true, IAE: true, IVTM: true, ICIO: false, IIVTNU: false }
    const vistos = []
    for (const { r, sigla } of impuestos(svg)) {
      if (!(sigla in ESPERADO)) throw new Error(`una caja lleva la sigla «${sigla}»`)
      const es = pinta(r) === ob ? true : pinta(r) === po ? false : null
      if (es === null) throw new Error(`el ${sigla} no tiene el color de ninguna leyenda`)
      if (es !== ESPERADO[sigla]) throw new Error(`el ${sigla} está pintado como ${es ? 'obligatorio' : 'potestativo'}, y el art. 59 dice lo contrario`)
      vistos.push(sigla)
    }
    if (vistos.length !== 5) throw new Error(`hay ${vistos.length} impuestos y son cinco`)
    return 'exigirán: IBI, IAE, IVTM · podrán establecer: ICIO, IIVTNU'
  })

  control('Impuestos · el ICIO es el único indirecto; los otros cuatro, directos', () => {
    const svg = porClave('impuestos-municipales')
    for (const { sigla, nat } of impuestos(svg)) {
      if (!nat) throw new Error(`el ${sigla} no tiene rotulada su naturaleza`)
      const indirecto = /indirecto/.test(nat)
      if (indirecto !== (sigla === 'ICIO')) throw new Error(`el ${sigla} figura como «${nat}»: solo el ICIO es indirecto (art. 100.1)`)
    }
    return 'ICIO indirecto; IBI, IAE, IVTM e IIVTNU directos'
  })

  /*
   * Las clases de empleados publicos (art. 8.2 TREBEP). El orden se lee por la
   * x de las cajas y su letra por el rotulo que llevan dentro; de donde sale y
   * adonde llega cada rama, por sus extremos.
   */
  control('Clases · las cuatro clases del art. 8.2 van en el orden a) a d), cada una con su rama, y el personal directivo sin ninguna', () => {
    const svg = porClave('clases-empleados-publicos')
    const raiz = pieza(svg, 'nodo-empleados')
    const cajas = piezas(svg, 'clase').sort((a, b) => num(a, 'x') - num(b, 'x'))
    const letras = cajas.map((c) => {
      const t = [...svg.querySelectorAll('text')].find((x) => {
        const b = x.getBBox()
        return /^[a-d]\) /.test(x.textContent.trim()) && dentroDe(c, b.x + 2, b.y + b.height / 2)
      })
      if (!t) throw new Error('una caja de clase no lleva letra')
      return t.textContent.trim()[0]
    })
    if (letras.join('') !== 'abcd') throw new Error(`las clases van en el orden ${letras.join(', ')}: el art. 8.2 las enumera de la a) a la d)`)
    const ramas = piezas(svg, 'rama')
    for (const r of ramas) {
      if (!dentroDe(raiz, num(r, 'x1'), num(r, 'y1'))) throw new Error('una rama no sale de «empleados públicos»')
    }
    const directivo = pieza(svg, 'directivo')
    if (ramas.some((r) => dentroDe(directivo, num(r, 'x2'), num(r, 'y2')))) {
      throw new Error('el personal directivo cuelga de «empleados públicos» como una clase más, y el art. 8.2 no lo enumera')
    }
    cajas.forEach((c, i) => {
      if (!ramas.some((r) => dentroDe(c, num(r, 'x2'), num(r, 'y2')))) throw new Error(`ninguna rama llega a la clase ${letras[i]})`)
    })
    return 'a, b, c, d con su rama; el directivo, aparte'
  })

  control('Clases · solo el personal laboral se vincula por contrato, y la llave de los funcionarios abarca carrera e interinos', () => {
    const svg = porClave('clases-empleados-publicos')
    for (const v of piezas(svg, 'vinculo')) {
      const letra = v.getAttribute('data-letra')
      const contrato = /contrato/.test(v.textContent)
      const nombramiento = /nombramiento/.test(v.textContent)
      if (letra === 'c' && !contrato) throw new Error(`el personal laboral figura con «${v.textContent.trim()}»: se vincula por contrato de trabajo (art. 11.1)`)
      if (letra !== 'c' && (contrato || !nombramiento)) throw new Error(`la clase ${letra}) figura con «${v.textContent.trim()}»: carrera, interinos y eventuales entran por nombramiento`)
    }
    const caja = (l) => svg.querySelector(`[data-pieza="clase"][data-letra="${l}"]`)
    const llave = pieza(svg, 'grupo-funcionarios').getBBox()
    const cubre = (l) => {
      const c = caja(l)
      return llave.x <= num(c, 'x') + 2 && llave.x + llave.width >= num(c, 'x') + num(c, 'width') - 2
    }
    const toca = (l) => {
      const c = caja(l)
      return llave.x + llave.width > num(c, 'x') + 2 && llave.x < num(c, 'x') + num(c, 'width') - 2
    }
    if (!cubre('a') || !cubre('b')) throw new Error('la llave de los funcionarios no abarca a los de carrera y a los interinos')
    if (toca('c') || toca('d')) throw new Error('la llave de los funcionarios se extiende sobre el personal laboral o el eventual, que no son funcionarios')
    return 'contrato solo en c); la llave cubre a) y b)'
  })

  /*
   * La prescripcion del art. 97 TREBEP. La escala se reconstruye con las marcas
   * del eje (data-valor en meses); cada barra se lee por donde acaba.
   */
  const barrasPrescripcion = (svg) => {
    const ticks = piezas(svg, 'tick').sort((a, b) => num(a, 'data-valor') - num(b, 'data-valor'))
    const x0 = num(ticks[0], 'x1')
    const ult = ticks[ticks.length - 1]
    const porMes = (num(ult, 'x1') - x0) / num(ult, 'data-valor')
    return piezas(svg, 'barra').map((b) => ({
      grado: b.getAttribute('data-grado'),
      tipo: b.getAttribute('data-tipo'),
      desde: (num(b, 'x') - x0) / porMes,
      meses: (num(b, 'x') + num(b, 'width') - x0) / porMes,
      cifra: svg.querySelector(`[data-pieza="cifra"][data-grado="${b.getAttribute('data-grado')}"][data-tipo="${b.getAttribute('data-tipo')}"]`),
    }))
  }
  control('Prescripción · cada barra acaba en su plazo legal, leído en la escala del eje (art. 97.1)', () => {
    const svg = porClave('prescripcion-faltas-sanciones')
    const LEY = { 'muy-grave': { falta: 36, sancion: 36 }, grave: { falta: 24, sancion: 24 }, leve: { falta: 6, sancion: 12 } }
    const barras = barrasPrescripcion(svg)
    if (barras.length !== 6) throw new Error(`hay ${barras.length} barras y son seis: falta y sanción de cada gravedad`)
    for (const b of barras) {
      const debe = LEY[b.grado]?.[b.tipo]
      if (debe === undefined) throw new Error(`barra desconocida: ${b.grado}/${b.tipo}`)
      if (Math.abs(b.desde) > 0.2) throw new Error(`la barra ${b.tipo} ${b.grado} no arranca en cero`)
      if (Math.abs(b.meses - debe) > 0.2) {
        throw new Error(`la ${b.tipo === 'falta' ? 'falta' : 'sanción'} ${b.grado} prescribe en el dibujo a los ${Math.round(b.meses)} meses, y la ley dice ${debe}`)
      }
    }
    return 'muy graves 36/36, graves 24/24, leves 6/12 meses (falta/sanción)'
  })

  control('Prescripción · la cifra escrita de cada barra dice lo mismo que su dibujo', () => {
    const svg = porClave('prescripcion-faltas-sanciones')
    for (const b of barrasPrescripcion(svg)) {
      if (!b.cifra) throw new Error(`la barra ${b.tipo} ${b.grado} no lleva cifra`)
      const t = b.cifra.textContent.trim()
      const m = t.match(/(\d+)\s*(año|mes)/)
      if (!m) throw new Error(`cifra ilegible: «${t}»`)
      const meses = Number(m[1]) * (m[2] === 'año' ? 12 : 1)
      if (Math.abs(meses - b.meses) > 0.2) throw new Error(`la ${b.tipo === 'falta' ? 'falta' : 'sanción'} ${b.grado} dice «${t}» y su barra acaba en ${Math.round(b.meses)} meses`)
    }
    return 'cada cifra coincide con su barra'
  })

  /*
   * Escalas de la funcion publica local. Cada subescala se identifica por su
   * escala y su clave; el orden se lee por la altura de las cajas, y las ramas
   * por el primer y el ultimo punto de su trazo.
   */
  const puntosDe = (el) => el.getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number)
  control('Escalas · la General con sus cinco subescalas en el orden del art. 167.2, la habilitación nacional con las tres del 92 bis.2, y cada una con su rama', () => {
    const svg = porClave('escalas-funcion-publica-local')
    const ORDEN = {
      habilitacion: ['secretaria', 'intervencion-tesoreria', 'secretaria-intervencion'],
      general: ['tecnica', 'gestion', 'administrativa', 'auxiliar', 'subalterna'],
      especial: ['tecnica', 'servicios-especiales'],
    }
    const ramas = piezas(svg, 'rama')
    for (const [escala, orden] of Object.entries(ORDEN)) {
      const caja = svg.querySelector(`[data-pieza="escala"][data-clave="${escala}"]`)
      if (!caja) throw new Error(`falta la escala ${escala}`)
      const subs = [...svg.querySelectorAll(`[data-pieza="subescala"][data-escala="${escala}"]`)].sort((a, b) => num(a, 'y') - num(b, 'y'))
      const vistas = subs.map((s) => s.getAttribute('data-clave'))
      if (vistas.join() !== orden.join()) throw new Error(`la escala ${escala} tiene las subescalas ${vistas.join(', ')}, y son ${orden.join(', ')} en ese orden`)
      for (const s of subs) {
        const llega = ramas.some((r) => {
          const p = puntosDe(r)
          return dentroDe(caja, p[0], p[1]) && dentroDe(s, p[p.length - 2], p[p.length - 1])
        })
        if (!llega) throw new Error(`ninguna rama une la escala ${escala} con su subescala ${s.getAttribute('data-clave')}`)
      }
    }
    return 'habilitación 3, General 5 en orden, Especial 2; cada una con su rama'
  })

  control('Escalas · los agentes forestales van en Servicios Especiales, los técnicos auxiliares en la Técnica de Administración Especial, y ahí está nuestra plaza', () => {
    const svg = porClave('escalas-funcion-publica-local')
    const sub = (e, c) => svg.querySelector(`[data-pieza="subescala"][data-escala="${e}"][data-clave="${c}"]`)
    const dondeEsta = (texto) => {
      const t = piezas(svg, 'clase').find((x) => x.textContent.trim() === texto)
      if (!t) throw new Error(`no aparece la clase «${texto}»`)
      const b = t.getBBox()
      const caja = [...svg.querySelectorAll('[data-pieza="subescala"]')].find((s) => dentroDe(s, b.x + 2, b.y + b.height / 2))
      return { t, b, caja }
    }
    const forestales = dondeEsta('Agentes forestales y medioambientales')
    if (forestales.caja !== sub('especial', 'servicios-especiales')) throw new Error('los agentes forestales y medioambientales no están en Servicios Especiales (art. 172.2.e TRRL)')
    const aux = dondeEsta('Técnicos auxiliares')
    if (aux.caja !== sub('especial', 'tecnica')) throw new Error('los técnicos auxiliares no están en la Subescala Técnica de Administración Especial (art. 171)')
    const tag = pieza(svg, 'nuestra-plaza').getBBox()
    const cy = tag.y + tag.height / 2
    if (!dentroDe(aux.caja, tag.x + tag.width / 2, cy) || Math.abs(cy - (aux.b.y + aux.b.height / 2)) > 6) {
      throw new Error('la marca de nuestra plaza no está en la línea de los técnicos auxiliares de Administración Especial')
    }
    return 'forestales en Servicios Especiales; técnicos auxiliares, con nuestra plaza, en la Técnica de AE'
  })

  /*
   * Umbrales de prevencion sobre escala LOGARITMICA: la escala se reconstruye
   * con dos marcas del eje y cada tramo se lee por sus extremos.
   */
  const tramosPrevencion = (svg) => {
    const ticks = piezas(svg, 'tick').sort((a, b) => num(a, 'data-valor') - num(b, 'data-valor'))
    const [t0, t1] = [ticks[0], ticks[ticks.length - 1]]
    const l0 = Math.log10(num(t0, 'data-valor'))
    const l1 = Math.log10(num(t1, 'data-valor'))
    const valor = (x) => 10 ** (l0 + ((x - num(t0, 'x1')) / (num(t1, 'x1') - num(t0, 'x1'))) * (l1 - l0))
    return piezas(svg, 'tramo').map((r) => ({
      clave: r.getAttribute('data-clave'),
      tipo: r.getAttribute('data-tipo'),
      desde: valor(num(r, 'x')),
      hasta: valor(num(r, 'x') + num(r, 'width')),
    }))
  }
  const cerca = (a, b) => Math.abs(Math.log10(a) - Math.log10(b)) < 0.01
  control('Prevención · cada umbral está en su cifra legal, leído en la escala logarítmica del eje', () => {
    const svg = porClave('umbrales-prevencion')
    const LEY = {
      empresario: { principal: [1, 10], condicionado: [10, 25] },
      representantes: { principal: [6, null] },
      comite: { principal: [50, null] },
      propio: { principal: [500, null], condicionado: [250, 500] },
    }
    const vistos = new Set()
    for (const t of tramosPrevencion(svg)) {
      const ley = LEY[t.clave]?.[t.tipo]
      if (!ley) throw new Error(`tramo inesperado: ${t.clave}/${t.tipo}`)
      vistos.add(t.clave + t.tipo)
      if (!cerca(t.desde, ley[0])) throw new Error(`«${t.clave}» (${t.tipo}) arranca en ${Math.round(t.desde)} trabajadores, y la norma dice ${ley[0]}`)
      if (ley[1] !== null && !cerca(t.hasta, ley[1])) throw new Error(`«${t.clave}» (${t.tipo}) acaba en ${Math.round(t.hasta)}, y la norma dice ${ley[1]}`)
      if (ley[1] === null && t.hasta < 3000) throw new Error(`«${t.clave}» no llega al final del eje y no tiene tope`)
    }
    const faltan = Object.entries(LEY).flatMap(([c, v]) => Object.keys(v).map((k) => c + k)).filter((k) => !vistos.has(k))
    if (faltan.length) throw new Error(`faltan tramos: ${faltan.join(', ')}`)
    return 'empresario hasta 10 (25), representantes desde 6, Comité desde 50, servicio propio desde 500 (250)'
  })

  control('Prevención · la cifra escrita de cada fila dice lo mismo que sus tramos', () => {
    const svg = porClave('umbrales-prevencion')
    const tramos = tramosPrevencion(svg)
    for (const c of piezas(svg, 'cifra')) {
      const clave = c.getAttribute('data-clave')
      const n = (c.textContent.match(/\d+/g) || []).map(Number)
      const suyos = tramos.filter((t) => t.clave === clave)
      const dibujo = new Set()
      for (const t of suyos) {
        dibujo.add(Math.round(t.desde))
        if (t.hasta < 3000) dibujo.add(Math.round(t.hasta))
      }
      dibujo.delete(1)
      const escritas = n.filter((v) => v !== 1)
      if ([...dibujo].sort((a, b) => a - b).join() !== [...new Set(escritas)].sort((a, b) => a - b).join()) {
        throw new Error(`«${clave}» dice «${c.textContent.trim()}» y sus tramos marcan ${[...dibujo].join(', ')}`)
      }
    }
    return 'cada cifra coincide con sus tramos'
  })

  /*
   * Grupos de agentes biologicos (art. 3 RD 664/1997). Cada celda se lee por su
   * grupo y su criterio; el orden de las filas, por la altura de su rotulo.
   */
  const celdaGrupo = (svg, g, c) => {
    const t = svg.querySelector(`[data-pieza="celda"][data-grupo="${g}"][data-criterio="${c}"]`)
    if (!t) throw new Error(`falta la celda del grupo ${g}, ${c}`)
    return t.textContent.trim()
  }
  control('Grupos · la propagación crece del grupo 2 al 4, y solo el 4 carece, en general, de profilaxis o tratamiento (art. 3.1)', () => {
    const svg = porClave('grupos-riesgo-biologico')
    const prop = [2, 3, 4].map((g) => celdaGrupo(svg, g, 'propagacion'))
    const esperado = ['poco probable', 'con riesgo', 'muchas probabilidades']
    if (prop.join('|') !== esperado.join('|')) throw new Error(`la propagación va ${prop.join(' → ')}, y el art. 3.1 dice ${esperado.join(' → ')}`)
    for (const g of [2, 3, 4]) {
      const p = celdaGrupo(svg, g, 'profilaxis')
      const sin = /no$/.test(p)
      if (sin !== (g === 4)) throw new Error(`el grupo ${g} figura con profilaxis «${p}»: solo el grupo 4 carece, en general, de profilaxis o tratamiento eficaz`)
    }
    return 'propagación poco probable → con riesgo → muchas probabilidades; sin profilaxis solo el 4'
  })

  control('Grupos · las filas van del 1 al 4 y cada grupo exige al menos su mismo nivel de contención (art. 15.1.b)', () => {
    const svg = porClave('grupos-riesgo-biologico')
    const orden = piezas(svg, 'grupo').sort((a, b) => num(a, 'y') - num(b, 'y')).map((t) => t.getAttribute('data-grupo'))
    if (orden.join('') !== '1234') throw new Error(`las filas van en el orden ${orden.join(', ')}`)
    for (const g of [2, 3, 4]) {
      const c = celdaGrupo(svg, g, 'contencion')
      const n = Number((c.match(/\d/) || [])[0])
      if (n !== g) throw new Error(`el grupo ${g} figura con «${c}», y el art. 15.1.b exige por lo menos el nivel ${g}`)
    }
    if (/\d/.test(celdaGrupo(svg, 1, 'contencion'))) throw new Error('el grupo 1 figura con un nivel de contención, y el anexo IV empieza en el 2')
    return 'grupos 1-4 en orden; contención 2, 3 y 4'
  })

  /*
   * La cadena de transmision (Guia tecnica del INSST). El orden de los
   * eslabones se lee por su x; cada enlace, por sus extremos.
   */
  control('Cadena · reservorio, salida, mecanismo, vía de entrada y huésped, en orden y cada eslabón unido al siguiente', () => {
    const svg = porClave('cadena-transmision')
    const esl = piezas(svg, 'eslabon').sort((a, b) => num(a, 'x') - num(b, 'x'))
    const orden = esl.map((e) => e.getAttribute('data-clave'))
    const LEY = ['reservorio', 'salida', 'mecanismo', 'via', 'huesped']
    if (orden.join() !== LEY.join()) throw new Error(`los eslabones van en el orden ${orden.join(', ')}`)
    const enlaces = piezas(svg, 'enlace')
    for (let i = 0; i < esl.length - 1; i++) {
      const ok = enlaces.some((l) => dentroDe(esl[i], num(l, 'x1'), num(l, 'y1')) && dentroDe(esl[i + 1], num(l, 'x2'), num(l, 'y2')))
      if (!ok) throw new Error(`ningún enlace une «${orden[i]}» con «${orden[i + 1]}»`)
    }
    return 'cinco eslabones en orden, cuatro enlaces'
  })

  control('Cadena · la vía de entrada lista exactamente las cinco vías de la guía, dentro de su eslabón', () => {
    const svg = porClave('cadena-transmision')
    const caja = svg.querySelector('[data-pieza="eslabon"][data-clave="via"]')
    const dentro = piezas(svg, 'via-entrada').filter((t) => {
      const b = t.getBBox()
      return dentroDe(caja, b.x + 2, b.y + b.height / 2)
    })
    const vias = dentro.map((t) => t.textContent.trim().split(' ')[0].replace(/,$/, ''))
    const LEY = ['respiratoria', 'dérmica', 'mucosas', 'parenteral', 'digestiva']
    const faltan = LEY.filter((v) => !vias.includes(v))
    if (faltan.length || vias.length !== 5) throw new Error(`en la vía de entrada figuran ${vias.join(', ') || 'ninguna'}; faltan ${faltan.join(', ') || '—'}`)
    return 'respiratoria, dérmica, mucosas, parenteral y digestiva'
  })

  /*
   * Las tres clases de cabina de seguridad biologica (NTP 1202, UNE-EN 12469).
   * Cada flujo dice su clase y su tipo; de donde sale y adonde llega se lee por
   * sus extremos frente a la caja de su cabina, y cada filtro, por su posicion.
   */
  const cabinaDe = (svg, c) => svg.querySelector(`[data-pieza="cabina"][data-clase="${c}"]`)
  const flujosDe = (svg, c, tipo) => [...svg.querySelectorAll(`[data-pieza="flujo"][data-clase="${c}"][data-tipo="${tipo}"]`)]
  control('Cabinas · el aire del local entra por la abertura frontal en la I y la II, la III es estanca con guantes, y solo la II baña la zona de trabajo con aire descendente', () => {
    const svg = porClave('clases-cabinas')
    for (const c of ['I', 'II', 'III']) {
      const caja = cabinaDe(svg, c)
      const abierta = c !== 'III'
      const entra = flujosDe(svg, c, 'entrada-frontal').some((l) => !dentroDe(caja, num(l, 'x1'), num(l, 'y1')) && dentroDe(caja, num(l, 'x2'), num(l, 'y2')))
      if (entra !== abierta) throw new Error(abierta ? `en la clase ${c} el aire del local no entra por la abertura frontal` : 'la clase III aparece con entrada frontal, y es estanca')
      const guantes = svg.querySelectorAll(`[data-pieza="guante"][data-clase="${c}"]`).length
      if (guantes > 0 === abierta) throw new Error(abierta ? `la clase ${c} aparece con guantes` : 'la clase III aparece sin guantes')
      const desc = flujosDe(svg, c, 'descendente').filter((l) => num(l, 'y2') > num(l, 'y1') && dentroDe(caja, num(l, 'x1'), num(l, 'y1')) && dentroDe(caja, num(l, 'x2'), num(l, 'y2')))
      if (desc.length > 0 !== (c === 'II')) throw new Error(c === 'II' ? 'la clase II no tiene flujo descendente sobre la zona de trabajo' : `la clase ${c} aparece con flujo descendente laminar, que en la NTP 1202 solo tiene la II`)
    }
    return 'entrada frontal en la I y la II; la III, estanca y con guantes; descendente solo en la II'
  })

  control('Cabinas · el aire sale por un HEPA en la I y la II y por dos en serie en la III, y el que entra solo se filtra en la II y la III', () => {
    const svg = porClave('clases-cabinas')
    const LEY = { I: [1, 0], II: [1, 1], III: [2, 1] }
    const filtros = (c, uso) =>
      [...svg.querySelectorAll(`[data-pieza="hepa"][data-clase="${c}"][data-uso="${uso}"]`)].filter((r) => {
        const b = r.getBBox()
        return dentroDe(cabinaDe(svg, c), b.x + b.width / 2, b.y + b.height / 2)
      })
    for (const [c, [sal, ent]] of Object.entries(LEY)) {
      const e = filtros(c, 'extraccion').length
      const i = filtros(c, 'impulsion').length
      if (e !== sal || i !== ent) throw new Error(`la clase ${c} tiene ${e} HEPA de salida y ${i} de entrada; la NTP 1202 dice ${sal} y ${ent}`)
    }
    const [a, b] = filtros('III', 'extraccion').map((r) => r.getBBox()).sort((p, q) => p.y - q.y)
    const comun = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
    if (comun < 0.8 * Math.min(a.width, b.width) || b.y < a.y + a.height - 0.5) throw new Error('los dos HEPA de salida de la clase III no están en serie, uno tras otro')
    const h = filtros('III', 'impulsion')[0].getBBox()
    const cruza = flujosDe(svg, 'III', 'entrada-filtrada').some((l) => num(l, 'x1') > h.x + h.width && num(l, 'x2') < h.x && num(l, 'y1') >= h.y && num(l, 'y1') <= h.y + h.height)
    if (!cruza) throw new Error('en la clase III el aire no entra a través de su HEPA')
    return 'salida por 1, 1 y 2 HEPA en serie; entrada filtrada en la II y la III'
  })

  /*
   * El microscopio optico. El orden se lee por la altura de cada pieza; el haz,
   * por su x frente a la caja de cada una. Las cifras se leen de los rotulos.
   */
  control('Microscopio · la luz sube de la lámpara al ojo por el diafragma de campo, el condensador, la preparación, el objetivo y el ocular, en ese orden, con el aceite entre el objetivo y la preparación', () => {
    const svg = porClave('microscopio-optico')
    const els = piezas(svg, 'elemento')
      .map((e) => ({ c: e.getAttribute('data-clave'), b: e.getBBox() }))
      .filter((e) => e.c !== 'tubo')
      .sort((p, q) => q.b.y + q.b.height / 2 - (p.b.y + p.b.height / 2))
    const orden = els.map((e) => e.c)
    const LUZ = ['lampara', 'diafragma-campo', 'condensador', 'platina', 'objetivo', 'ocular']
    if (orden.join() !== LUZ.join()) throw new Error(`de abajo arriba van ${orden.join(', ')}`)
    const haz = pieza(svg, 'haz')
    const x = num(haz, 'x1')
    const y0 = Math.min(num(haz, 'y1'), num(haz, 'y2'))
    const y1 = Math.max(num(haz, 'y1'), num(haz, 'y2'))
    for (const e of els) {
      if (x < e.b.x || x > e.b.x + e.b.width || e.b.y + e.b.height < y0 || e.b.y > y1) throw new Error(`el haz no atraviesa ${e.c}`)
    }
    const ac = pieza(svg, 'aceite').getBBox()
    const obj = els.find((e) => e.c === 'objetivo').b
    const pl = els.find((e) => e.c === 'platina').b
    const ya = ac.y + ac.height / 2
    if (!(ya > obj.y + obj.height && ya < pl.y)) throw new Error('el aceite no está entre el objetivo y la preparación')
    return 'lámpara → diafragma de campo → condensador → preparación → objetivo → ocular; el haz los atraviesa todos'
  })

  control('Microscopio · el aumento total es ocular × objetivo, el útil 500-1000 × AN, la resolución 0,61·λ/AN, y una AN mayor que 0,95 lleva aceite', () => {
    const svg = porClave('microscopio-optico')
    const n = (t) => Number(t.replace(',', '.'))
    const rot = (c) => svg.querySelector(`[data-pieza="rotulo"][data-clave="${c}"]`).textContent
    const cifra = (c) => svg.querySelector(`[data-pieza="cifra"][data-clave="${c}"]`).textContent.trim()
    const oc = n(rot('ocular').match(/(\d+)×/)[1])
    const objT = rot('objetivo')
    const ob = n(objT.match(/(\d+)×/)[1])
    const an = n(objT.match(/AN (\d+,\d+)/)[1])
    const m = cifra('total').match(/(\d+) × (\d+) = (\d+)×/)
    if (!m || n(m[1]) !== oc || n(m[2]) !== ob || n(m[3]) !== oc * ob) throw new Error(`el aumento total dice «${cifra('total')}», y un ocular de ${oc}× por un objetivo de ${ob}× dan ${oc * ob}×`)
    const u = cifra('util').match(/= (\d+)-(\d+)×/)
    if (!u || n(u[1]) !== 500 * an || n(u[2]) !== 1000 * an) throw new Error(`el aumento útil dice «${cifra('util')}», y con AN ${an} es ${500 * an}-${1000 * an}×`)
    const r = cifra('resolucion').match(/0,61 · (\d+) \/ (\d+,\d+) ≈ (\d+) nm/)
    if (!r) throw new Error(`no se lee la resolución en «${cifra('resolucion')}»`)
    if (n(r[2]) !== an) throw new Error(`la resolución usa AN ${r[2]}, y el objetivo es de AN ${an}`)
    const d = (0.61 * n(r[1])) / an
    if (Math.abs(d - n(r[3])) > 1) throw new Error(`0,61 · ${r[1]} / ${r[2]} = ${d.toFixed(0)} nm, y el esquema escribe ${r[3]}`)
    if (an > 0.95 && !/aceite/.test(objT)) throw new Error(`un objetivo de AN ${an} no puede trabajar en seco`)
    return `${oc} × ${ob} = ${oc * ob}×; útil ${500 * an}-${1000 * an}×; d = ${d.toFixed(0)} nm`
  })

  /*
   * Resistencia a la descontaminacion (Guia tecnica del INSST, apendice 5,
   * figura 1). El orden de las franjas se lee por su altura; a que metodo
   * pertenece cada agente, por la caja en que cae su rotulo.
   */
  control('Resistencia · de arriba abajo, esporas y quistes, micobacterias y virus sin envoltura, hongos, y bacterias vegetativas y virus con envoltura, cada franja frente a su método y con la resistencia creciendo hacia arriba', () => {
    const svg = porClave('resistencia-descontaminacion')
    const bandas = piezas(svg, 'banda').sort((a, b) => num(a, 'y') - num(b, 'y'))
    const orden = bandas.map((b) => b.getAttribute('data-clave'))
    const GUIA = ['esporas', 'micobacterias', 'hongos', 'bacterias']
    if (orden.join() !== GUIA.join()) throw new Error(`de arriba abajo van ${orden.join(', ')}`)
    const metodos = piezas(svg, 'metodo').sort((a, b) => num(a, 'y') - num(b, 'y'))
    const NIVEL = ['esterilizacion', 'alto', 'medio', 'bajo']
    metodos.forEach((m, i) => {
      if (m.getAttribute('data-clave') !== NIVEL[i]) throw new Error(`el método ${i + 1}.º es «${m.getAttribute('data-clave')}»`)
      const cy = num(m, 'y') + num(m, 'height') / 2
      const b = bandas[i]
      if (cy < num(b, 'y') || cy > num(b, 'y') + num(b, 'height')) throw new Error(`«${NIVEL[i]}» no está frente a la franja «${orden[i]}»`)
    })
    const f = pieza(svg, 'resistencia')
    if (!(num(f, 'y2') < num(f, 'y1'))) throw new Error('la flecha de la resistencia no apunta hacia arriba')
    return 'esporas → micobacterias → hongos → bacterias; esterilización, alto, medio y bajo'
  })

  control('Resistencia · cada método lista los agentes de la guía: vapor y óxido de etileno esterilizan, el glutaraldehído es de nivel alto, alcoholes e hipocloritos de medio, y fenólicos y amonio cuaternario de bajo', () => {
    const svg = porClave('resistencia-descontaminacion')
    const GUIA = {
      esterilizacion: ['vapor de agua', 'óxido de etileno', 'peróxido de hidrógeno (plasma)', 'ácido peracético'],
      alto: ['peróxido de hidrógeno', 'glutaraldehído', 'formaldehído', 'ácido peracético'],
      medio: ['alcoholes', 'hipocloritos', 'yodo y yodóforos'],
      bajo: ['compuestos fenólicos', 'amonio cuaternario'],
    }
    const cajas = piezas(svg, 'metodo')
    const dentro = {}
    for (const a of piezas(svg, 'agente')) {
      const b = a.getBBox()
      const caja = cajas.find((c) => dentroDe(c, b.x + 2, b.y + b.height / 2))
      if (!caja) throw new Error(`«${a.textContent.trim()}» no está dentro de ningún método`)
      const k = caja.getAttribute('data-clave')
      ;(dentro[k] = dentro[k] || []).push(a.textContent.trim())
    }
    for (const [k, lista] of Object.entries(GUIA)) {
      const hay = (dentro[k] || []).slice().sort().join(', ')
      if (hay !== lista.slice().sort().join(', ')) throw new Error(`en «${k}» figuran ${hay || 'ninguno'}; la guía pone ${lista.join(', ')}`)
    }
    return 'cuatro métodos con los agentes de la guía'
  })

  /*
   * Binomios de esterilizacion (Guia tecnica del INSST, apendice 5). La escala
   * de tiempo, logaritmica, y la de temperatura se reconstruyen con las marcas
   * de los ejes; cada punto se lee en ellas.
   */
  const leerBinomios = (svg) => {
    const tx = piezas(svg, 'tick-x').map((t) => [Math.log10(num(t, 'data-valor')), num(t, 'x1')]).sort((a, b) => a[0] - b[0])
    const ty = piezas(svg, 'tick-y').map((t) => [num(t, 'data-valor'), num(t, 'y1')]).sort((a, b) => a[0] - b[0])
    const [lx0, x0] = tx[0]
    const [lx1, x1] = tx[tx.length - 1]
    const [T0, y0] = ty[0]
    const [T1, y1] = ty[ty.length - 1]
    return piezas(svg, 'punto').map((p) => ({
      clave: p.getAttribute('data-clave'),
      t: 10 ** (lx0 + ((num(p, 'cx') - x0) / (x1 - x0)) * (lx1 - lx0)),
      T: T0 + ((num(p, 'cy') - y0) / (y1 - y0)) * (T1 - T0),
      x: num(p, 'cx'),
      y: num(p, 'cy'),
    }))
  }
  control('Binomios · cada punto está en el binomio temperatura-tiempo de la guía del INSST, leído sobre los ejes reconstruidos con sus marcas', () => {
    const svg = porClave('binomios-esterilizacion')
    const GUIA = { v115: [115, 30], v121: [121, 15], v126: [126, 10], v134: [134, 3], s160: [160, 120], s170: [170, 60], s180: [180, 30] }
    const pts = leerBinomios(svg)
    if (pts.length !== 7) throw new Error(`hay ${pts.length} puntos, y la guía da siete binomios`)
    for (const p of pts) {
      const [T, t] = GUIA[p.clave]
      if (Math.abs(p.T - T) > 0.5 || Math.abs(p.t - t) / t > 0.03) throw new Error(`«${p.clave}» está en ${p.T.toFixed(1)} °C y ${p.t.toFixed(1)} min, y la guía dice ${T} °C y ${t} min`)
    }
    return 'vapor 115/30, 121/15, 126/10, 134/3; calor seco 160/120, 170/60, 180/30'
  })

  control('Binomios · cada rótulo, junto a su punto, dice la temperatura y el tiempo que dibuja', () => {
    const svg = porClave('binomios-esterilizacion')
    for (const p of leerBinomios(svg)) {
      const r = svg.querySelector(`[data-pieza="rotulo"][data-clave="${p.clave}"]`)
      const m = r.textContent.match(/(\d+) °C · (\d+) min/)
      if (!m) throw new Error(`no se lee el rótulo de «${p.clave}»`)
      if (Math.abs(Number(m[1]) - p.T) > 0.5 || Math.abs(Number(m[2]) - p.t) / p.t > 0.03) throw new Error(`el rótulo dice «${r.textContent.trim()}» y su punto dibuja ${p.T.toFixed(0)} °C y ${p.t.toFixed(0)} min`)
      const b = r.getBBox()
      if (Math.hypot(b.x - p.x, b.y + b.height - p.y) > 25) throw new Error(`el rótulo de «${p.clave}» no está junto a su punto`)
    }
    return 'los siete rótulos coinciden con sus puntos'
  })

  /*
   * Siembra por agotamiento en cuatro cuadrantes (CDC). El cuadrante de cada
   * punto se lee por su angulo respecto del centro de la placa: el 1 arriba a
   * la derecha y, girando en el sentido de las agujas del reloj, el 2, el 3 y
   * el 4.
   */
  const sectorDe = (p, x, y) => {
    const a = (Math.atan2(y - num(p, 'cy'), x - num(p, 'cx')) * 180) / Math.PI
    return Math.floor((((a + 90) % 360) + 360) % 360 / 90)
  }
  control('Agotamiento · los cuatro cuadrantes van en orden de giro, y cada estría arranca en el cuadrante anterior y sigue en el suyo', () => {
    const svg = porClave('agotamiento-cuadrantes')
    const p = pieza(svg, 'placa')
    for (const t of piezas(svg, 'numero')) {
      const b = t.getBBox()
      const k = Number(t.getAttribute('data-cuadrante'))
      if (sectorDe(p, b.x + b.width / 2, b.y + b.height / 2) !== k - 1) throw new Error(`el rótulo ${k} no está en su cuadrante`)
    }
    const estrias = piezas(svg, 'estria').sort((a, b) => num(a, 'data-cuadrante') - num(b, 'data-cuadrante'))
    if (estrias.length !== 4) throw new Error(`hay ${estrias.length} estrías`)
    estrias.forEach((e, i) => {
      const pts = puntos(e)
      const resto = i === 0 ? pts : pts.slice(1)
      if (i > 0 && sectorDe(p, ...pts[0]) !== i - 1) throw new Error(`la estría del cuadrante ${i + 1} no arranca en el cuadrante ${i}, sino en el ${sectorDe(p, ...pts[0]) + 1}`)
      if (resto.some(([x, y]) => sectorDe(p, x, y) !== i)) throw new Error(`la estría del cuadrante ${i + 1} se sale de su cuadrante`)
    })
    return 'cuatro estrías; cada una entra desde el cuadrante anterior'
  })

  control('Agotamiento · las colonias disminuyen de un cuadrante al siguiente, y en el último quedan aisladas', () => {
    const svg = porClave('agotamiento-cuadrantes')
    const p = pieza(svg, 'placa')
    const cols = piezas(svg, 'colonia').map((c) => ({ x: num(c, 'cx'), y: num(c, 'cy'), r: num(c, 'r'), k: sectorDe(p, num(c, 'cx'), num(c, 'cy')) }))
    const n = [0, 1, 2, 3].map((k) => cols.filter((c) => c.k === k).length)
    for (let k = 1; k < 4; k++) if (!(n[k] < n[k - 1])) throw new Error(`hay ${n.join(', ')} colonias por cuadrante: no disminuyen`)
    const ult = cols.filter((c) => c.k === 3)
    for (let i = 0; i < ult.length; i++)
      for (let j = i + 1; j < ult.length; j++)
        if (Math.hypot(ult[i].x - ult[j].x, ult[i].y - ult[j].y) < 4 * ult[i].r) throw new Error('en el último cuadrante hay colonias que no están aisladas')
    return `${n.join(' > ')} colonias; las del cuarto, aisladas`
  })

  /*
   * Siembra en profundidad y en superficie. Se lee donde crecen las colonias
   * respecto de la capa de agar, y los volumenes y la temperatura escritos.
   */
  control('Siembra · en profundidad las colonias crecen dentro del agar, y en superficie, todas encima de él', () => {
    const svg = porClave('siembra-profundidad-superficie')
    const capa = (t) => {
      const a = svg.querySelector(`[data-pieza="agar"][data-tecnica="${t}"]`)
      return [num(a, 'y'), num(a, 'y') + num(a, 'height')]
    }
    const [s0, f0] = capa('profundidad')
    const hondas = piezas(svg, 'colonia').filter((c) => c.getAttribute('data-tecnica') === 'profundidad')
    if (hondas.some((c) => !(num(c, 'cy') > s0 + 1 && num(c, 'cy') < f0 - 1))) throw new Error('en profundidad hay colonias fuera del agar')
    if (hondas.filter((c) => num(c, 'cy') > s0 + (f0 - s0) / 3).length < hondas.length / 2) throw new Error('en profundidad las colonias no se reparten por el espesor del agar')
    const [s1] = capa('superficie')
    const arriba = piezas(svg, 'colonia').filter((c) => c.getAttribute('data-tecnica') === 'superficie')
    const mal = arriba.filter((c) => Math.abs(num(c, 'cy') + num(c, 'ry') - s1) > 1.5)
    if (mal.length) throw new Error(`en superficie hay ${mal.length} colonia(s) que no están sobre el agar`)
    return `${hondas.length} colonias dentro del agar; ${arriba.length} sobre él`
  })

  control('Siembra · en profundidad se siembra 1 ml y se vierte el agar fundido a 45 °C; en superficie, 0,1 ml sobre el agar ya sólido', () => {
    const svg = porClave('siembra-profundidad-superficie')
    const vol = (t) => svg.querySelector(`[data-pieza="volumen"][data-tecnica="${t}"]`).textContent
    const pasos = (t) => piezas(svg, 'paso').filter((p) => p.getAttribute('data-tecnica') === t).map((p) => p.textContent).join(' | ')
    if (!/:\s*1 ml/.test(vol('profundidad'))) throw new Error(`en profundidad el volumen dice «${vol('profundidad').trim()}»`)
    if (!/0,1 ml/.test(vol('superficie'))) throw new Error(`en superficie el volumen dice «${vol('superficie').trim()}»`)
    if (!/45 °C/.test(pasos('profundidad')) || !/placa vacía/.test(pasos('profundidad'))) throw new Error('en profundidad falta la muestra en la placa vacía o el agar a 45 °C')
    if (!/sólido/.test(pasos('superficie'))) throw new Error('en superficie falta que el agar ya esté sólido')
    return '1 ml y agar a 45 °C en profundidad; 0,1 ml sobre agar sólido en superficie'
  })

  /*
   * Banco de diluciones. Se leen los tubos por su posicion: cada transferencia
   * tiene que salir del recipiente anterior y caer en el suyo, con 1 ml sobre
   * 9 ml, y la dilucion rotulada bajo cada tubo tiene que ser la del anterior
   * por diez.
   */
  const SUPERINDICE = '⁰¹²³⁴⁵⁶⁷⁸⁹'
  const deSuper = (t) => Number([...t].map((c) => SUPERINDICE.indexOf(c)).join(''))
  const aSuper = (n) => [...String(n)].map((c) => SUPERINDICE[c]).join('')
  control('Diluciones · cada tubo recibe 1 ml del anterior sobre 9 ml de diluyente, y la dilución se multiplica por diez de tubo en tubo', () => {
    const svg = porClave('banco-diluciones')
    const tubos = piezas(svg, 'tubo').sort((a, b) => num(a, 'x') - num(b, 'x'))
    const frasco = pieza(svg, 'frasco').getBBox()
    const cajas = [[frasco.x, frasco.x + frasco.width], ...tubos.map((t) => [num(t, 'x'), num(t, 'x') + num(t, 'width')])]
    const dentro = (x, [a, b]) => x >= a - 1 && x <= b + 1
    tubos.forEach((t, i) => {
      const k = i + 1
      if (num(t, 'data-exponente') !== k) throw new Error(`el tubo ${k} por la izquierda dice ser el 10⁻${num(t, 'data-exponente')}`)
      const rot = svg.querySelector(`[data-pieza="dilucion"][data-exponente="${k}"]`)
      const [cx] = centroCaja(rot)
      if (!dentro(cx, cajas[k])) throw new Error(`el rótulo de la dilución ${k} no está bajo su tubo`)
      const m = rot.textContent.match(/^10⁻([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/)
      if (!m || deSuper(m[1]) !== k) throw new Error(`bajo el tubo ${k} pone «${rot.textContent}»`)
      const dil = svg.querySelector(`[data-pieza="diluyente"][data-exponente="${k}"]`)
      if (!/^9 ml$/.test(dil.textContent.trim())) throw new Error(`el tubo ${k} lleva «${dil.textContent}» de diluyente`)
      const tr = svg.querySelector(`[data-pieza="transferencia"][data-hasta="${k}"]`)
      const pts = puntos(tr)
      const [x0] = pts[0]
      const [x1] = pts[pts.length - 1]
      if (!dentro(x0, cajas[k - 1])) throw new Error(`la transferencia al tubo ${k} no sale del recipiente anterior`)
      if (!dentro(x1, cajas[k])) throw new Error(`la transferencia al tubo ${k} no cae en su tubo`)
      const v = svg.querySelector(`[data-pieza="volumen-transferido"][data-hasta="${k}"]`)
      if (!/^1 ml$/.test(v.textContent.trim())) throw new Error(`al tubo ${k} se transfiere «${v.textContent}»`)
    })
    return `${tubos.length} tubos de 10⁻¹ a 10⁻${aSuper(tubos.length)}; cada uno, 1 ml del anterior sobre 9 ml`
  })

  control('Diluciones · solo se marcan las placas de 10 a 300 colonias, y la media ponderada usa esas dos y la primera de ellas', () => {
    const svg = porClave('banco-diluciones')
    const placas = piezas(svg, 'placa').sort((a, b) => num(a, 'cx') - num(b, 'cx'))
    const tubos = piezas(svg, 'tubo').sort((a, b) => num(a, 'x') - num(b, 'x'))
    const datos = placas.map((p, i) => {
      const k = num(p, 'data-exponente')
      const t = tubos[i]
      if (Math.abs(num(p, 'cx') - (num(t, 'x') + num(t, 'width') / 2)) > 2) throw new Error(`la placa ${k} no está bajo su tubo`)
      const texto = svg.querySelector(`[data-pieza="recuento"][data-exponente="${k}"]`).textContent
      const n = /^>/.test(texto.trim()) ? Infinity : Number(texto.match(/\d+/)[0])
      const dibujadas = piezas(svg, 'colonia').filter((c) => num(c, 'data-exponente') === k).length
      const roja = trazoDe(p) === ROJO
      return { k, n, dibujadas, roja }
    })
    for (const d of datos) {
      const debe = d.n >= 10 && d.n <= 300
      if (d.roja !== debe) throw new Error(`la placa de la 10⁻${aSuper(d.k)} (${d.n} colonia${d.n === 1 ? "" : "s"}) ${d.roja ? 'está' : 'no está'} marcada como contable`)
      if (d.n <= 30 && d.dibujadas !== d.n) throw new Error(`la placa de la 10⁻${aSuper(d.k)} dice ${d.n} colonias y dibuja ${d.dibujadas}`)
    }
    for (let i = 1; i < datos.length; i++) if (!(datos[i].dibujadas < datos[i - 1].dibujadas)) throw new Error('las colonias dibujadas no disminuyen al diluir')
    const validas = datos.filter((d) => d.roja)
    const calc = pieza(svg, 'calculo').textContent
    const suma = calc.match(/\((\d+) \+ (\d+)\)/)
    if (!suma || Number(suma[1]) !== validas[0]?.n || Number(suma[2]) !== validas[1]?.n) throw new Error(`el cálculo suma «${suma?.[0]}» y las placas contables son ${validas.map((d) => d.n).join(' y ')}`)
    const d = calc.match(/1,1 × 10⁻([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/)
    if (!d || deSuper(d[1]) !== validas[0].k) throw new Error('el cálculo no divide por la primera dilución contable')
    const N = (validas[0].n + validas[1].n) / (1.1 * 10 ** -validas[0].k)
    const e = Math.floor(Math.log10(N))
    const esperado = (Math.round(N / 10 ** (e - 1)) / 10).toFixed(1).replace('.', ',') + ' × 10' + [...String(e)].map((c) => SUPERINDICE[c]).join('')
    if (!calc.includes('≈ ' + esperado)) throw new Error(`el resultado escrito no es ${esperado}`)
    return `contables las de ${validas.map((v) => `10⁻${aSuper(v.k)}`).join(' y ')}; N ≈ ${esperado}`
  })

  /*
   * Bandeja de NMP de 51 pocillos. Se cuentan los pocillos por su color, y los
   * halos de fluorescencia por el pocillo en que caen. La tabla se contrasta con
   * la de IDEXX (la misma que adjunto el examen 1322).
   */
  const IDEXX_51 = { 10: '11,1', 11: '12,4', 12: '13,7', 22: '28,8', 23: '30,6', 24: '32,4' }
  const leerBandeja = (svg) => {
    const pocillos = piezas(svg, 'pocillo')
    const amarillos = pocillos.filter((p) => p.getAttribute('fill') !== '#f4f1e6')
    const halos = piezas(svg, 'halo')
    const deHalo = halos.map((h) =>
      pocillos.find((p) => num(h, 'cx') > num(p, 'x') && num(h, 'cx') < num(p, 'x') + num(p, 'width') && num(h, 'cy') > num(p, 'y') && num(h, 'cy') < num(p, 'y') + num(p, 'height')),
    )
    return { pocillos, amarillos, halos, deHalo }
  }
  control('Bandeja NMP · 51 pocillos, cada fluorescente es también amarillo, y las cuentas escritas son las del dibujo', () => {
    const svg = porClave('bandeja-nmp-51')
    const { pocillos, amarillos, halos, deHalo } = leerBandeja(svg)
    if (pocillos.length !== 51) throw new Error(`la bandeja tiene ${pocillos.length} pocillos`)
    if (deHalo.some((p) => !p)) throw new Error('hay un halo de fluorescencia fuera de los pocillos')
    const malos = deHalo.filter((p) => !amarillos.includes(p)).length
    if (malos) throw new Error(`${malos} pocillo(s) fluorescentes no son amarillos`)
    const cuenta = (g) => Number(svg.querySelector(`[data-pieza="cuenta"][data-grupo="${g}"]`).textContent.match(/(\d+)\s*$/)[1])
    if (cuenta('amarillos') !== amarillos.length) throw new Error(`el rótulo dice ${cuenta('amarillos')} amarillos y hay ${amarillos.length}`)
    if (cuenta('fluorescentes') !== halos.length) throw new Error(`el rótulo dice ${cuenta('fluorescentes')} fluorescentes y hay ${halos.length}`)
    return `51 pocillos: ${amarillos.length} amarillos, y ${halos.length} de ellos fluorescentes`
  })

  control('Bandeja NMP · la tabla es la de IDEXX, y cada NMP se lee con los pocillos de su grupo, sin sumar los fluorescentes a los amarillos', () => {
    const svg = porClave('bandeja-nmp-51')
    const { amarillos, halos } = leerBandeja(svg)
    const filas = Object.fromEntries(
      piezas(svg, 'fila-tabla').map((f) => {
        const n = num(f, 'data-pocillos')
        const v = f.textContent.match(/→\s*([\d,]+)/)[1]
        if (IDEXX_51[n] !== v) throw new Error(`la tabla dice ${n} → ${v}; la de IDEXX, ${IDEXX_51[n]}`)
        return [n, v]
      }),
    )
    const res = (g) => svg.querySelector(`[data-pieza="resultado"][data-grupo="${g}"]`).textContent.match(/([\d,]+) NMP/)[1]
    if (!filas[amarillos.length] || !filas[halos.length]) throw new Error('la tabla no trae las filas de los pocillos contados')
    if (res('coliformes') !== filas[amarillos.length]) throw new Error(`coliformes: escribe ${res('coliformes')} y con ${amarillos.length} amarillos la tabla da ${filas[amarillos.length]}`)
    if (res('ecoli') !== filas[halos.length]) throw new Error(`E. coli: escribe ${res('ecoli')} y con ${halos.length} fluorescentes la tabla da ${filas[halos.length]}`)
    return `coliformes ${amarillos.length} → ${res('coliformes')}; E. coli ${halos.length} → ${res('ecoli')} NMP/100 ml`
  })

  /*
   * Tincion de Gram. Cada celula se asigna al paso cuyo rotulo tiene encima
   * (el mas cercano en horizontal), y se lee su color y el grosor de su pared.
   */
  const GRAM_VIOLETA = '#6a3d9a'
  const GRAM_ROSA = '#e8879e'
  const pasosGram = (svg) => piezas(svg, 'paso').sort((a, b) => num(a, 'x') - num(b, 'x'))
  control('Gram · los reactivos van en su orden: colorante primario, mordiente, decolorante y contraste', () => {
    const svg = porClave('tincion-gram')
    const pasos = pasosGram(svg).map((p) => p.textContent)
    const esperado = [
      [/cristal violeta/i, /primario/i],
      [/lugol/i, /mordiente/i],
      [/alcohol|acetona|etanol/i, /decolorante/i],
      [/safranina/i, /contraste/i],
    ]
    if (pasos.length !== 4) throw new Error(`hay ${pasos.length} pasos`)
    esperado.forEach(([reactivo, papel], i) => {
      if (!reactivo.test(pasos[i]) || !papel.test(pasos[i])) throw new Error(`el paso ${i + 1} por la izquierda dice «${pasos[i]}»`)
    })
    return 'cristal violeta → lugol → decolorante → safranina'
  })

  control('Gram · la grampositiva, de pared gruesa, queda violeta en los cuatro pasos; la gramnegativa pierde el violeta al decolorar y acaba rosa', () => {
    const svg = porClave('tincion-gram')
    const xs = pasosGram(svg).map((p) => num(p, 'x'))
    const paso = (c) => {
      const cx = num(c, 'x') + num(c, 'width') / 2
      return xs.reduce((m, x, i) => (Math.abs(x - cx) < Math.abs(xs[m] - cx) ? i : m), 0)
    }
    const color = (c) => {
      const f = c.getAttribute('fill')
      return f === GRAM_VIOLETA ? 'violeta' : f === GRAM_ROSA ? 'rosa' : f === 'none' ? 'incolora' : f
    }
    const fila = (pared) => {
      const cs = piezas(svg, 'celula').filter((c) => c.getAttribute('data-pared') === pared)
      const r = new Array(4).fill(null)
      for (const c of cs) r[paso(c)] = color(c)
      return { colores: r, grosor: Math.min(...cs.map((c) => num(c, 'stroke-width'))) }
    }
    const pos = fila('positiva')
    const neg = fila('negativa')
    const debePos = ['violeta', 'violeta', 'violeta', 'violeta']
    const debeNeg = ['violeta', 'violeta', 'incolora', 'rosa']
    debePos.forEach((d, i) => {
      if (pos.colores[i] !== d) throw new Error(`tras el paso ${i + 1}, la grampositiva está ${pos.colores[i]}`)
    })
    debeNeg.forEach((d, i) => {
      if (neg.colores[i] !== d) throw new Error(`tras el paso ${i + 1}, la gramnegativa está ${neg.colores[i]}`)
    })
    if (!(pos.grosor > 2 * neg.grosor)) throw new Error('la pared de la grampositiva no se dibuja más gruesa que la de la gramnegativa')
    return `grampositiva ${pos.colores.join(' → ')}; gramnegativa ${neg.colores.join(' → ')}`
  })

  /*
   * Gota pendiente. El fondo de la excavacion se calcula en la propia curva
   * (punto medio de la cuadratica); la gota se mide con su caja.
   */
  control('Gota pendiente · la gota cuelga del cubre dentro de la excavación sin tocar el fondo, y la vaselina sella fuera de ella', () => {
    const svg = porClave('gota-pendiente')
    const [[x0, y0], [, yc], [x1, y1]] = puntos(pieza(svg, 'excavacion'))
    const fondo = 0.25 * y0 + 0.5 * yc + 0.25 * y1
    const cubre = svg.querySelector('[data-pieza="cubre"][data-panel="gota"]')
    const bajoCubre = num(cubre, 'y') + num(cubre, 'height')
    if (!(bajoCubre <= y0 + 0.5)) throw new Error('el cubre no está encima del porta')
    const g = pieza(svg, 'gota').getBBox()
    if (Math.abs(g.y - bajoCubre) > 0.6) throw new Error('la gota no cuelga de la cara inferior del cubre')
    if (!(g.y + g.height < fondo - 2)) throw new Error(`la gota llega a ${(g.y + g.height).toFixed(1)} y el fondo de la excavación está en ${fondo.toFixed(1)}`)
    if (!(g.x > x0 && g.x + g.width < x1)) throw new Error('la gota se sale de la excavación')
    for (const v of piezas(svg, 'vaselina')) {
      const vx0 = num(v, 'x')
      const vx1 = vx0 + num(v, 'width')
      if (Math.abs(num(v, 'y') - bajoCubre) > 0.6 || Math.abs(num(v, 'y') + num(v, 'height') - y0) > 0.6) throw new Error('la vaselina no une el cubre con el porta')
      if (!(vx1 <= x0 || vx0 >= x1)) throw new Error('la vaselina está dentro de la excavación')
    }
    return `gota de ${bajoCubre.toFixed(0)} a ${(g.y + g.height).toFixed(0)}; fondo en ${fondo.toFixed(0)}; vaselina fuera`
  })

  control('Gota pendiente · entre porta y cubre la muestra es una película pegada a los dos vidrios, y las dos preparaciones se miran a ×400', () => {
    const svg = porClave('gota-pendiente')
    const cubre = svg.querySelector('[data-pieza="cubre"][data-panel="fresco"]')
    const porta = svg.querySelector('[data-pieza="porta"][data-panel="fresco"]')
    const p = pieza(svg, 'pelicula')
    const arriba = num(p, 'y')
    const abajo = arriba + num(p, 'height')
    if (Math.abs(arriba - (num(cubre, 'y') + num(cubre, 'height'))) > 0.6) throw new Error('la película no toca el cubre')
    if (Math.abs(abajo - num(porta, 'y')) > 0.6) throw new Error('la película no toca el porta')
    if (num(p, 'height') > 4) throw new Error('la película es demasiado gruesa')
    if (!/×400/.test(pieza(svg, 'lectura').textContent)) throw new Error('no dice a qué aumento se examina')
    return 'película entre los dos vidrios; lectura a ×400'
  })

  /*
   * Los tres dominios. Cada grupo se asigna a la columna en que cae su centro:
   * la del nodo de dominio mas cercano en horizontal o, si cae dentro, la caja
   * de los acelulares. La asignacion esperada sale del apunte (Woese, 1990).
   */
  const GRUPO_DOMINIO = {
    Bacterias: 'Bacteria', Cianobacterias: 'Bacteria',
    'Metanógenas': 'Archaea', 'Termófilas extremas': 'Archaea',
    Hongos: 'Eucarya', Protozoos: 'Eucarya', Algas: 'Eucarya', Helmintos: 'Eucarya', Plantas: 'Eucarya', Animales: 'Eucarya',
    Virus: 'acelular', Priones: 'acelular',
  }
  const leerDominios = (svg) => {
    const nodos = piezas(svg, 'nodo').map((n) => ({ id: n.getAttribute('data-dominio'), x: num(n, 'cx'), y: num(n, 'cy') }))
    const caja = pieza(svg, 'acelular')
    const enCaja = (x, y) => x > num(caja, 'x') && x < num(caja, 'x') + num(caja, 'width') && y > num(caja, 'y') && y < num(caja, 'y') + num(caja, 'height')
    return { nodos, caja, enCaja }
  }
  control('Dominios · tres ramas del origen común a Bacteria, Archaea y Eucarya, y cada grupo bajo su dominio', () => {
    const svg = porClave('tres-dominios')
    const { nodos, enCaja } = leerDominios(svg)
    const ramas = piezas(svg, 'rama')
    if (ramas.length !== 3 || nodos.length !== 3) throw new Error(`hay ${ramas.length} ramas y ${nodos.length} dominios`)
    const raiz = [num(ramas[0], 'x1'), num(ramas[0], 'y1')]
    for (const r of ramas) {
      if (num(r, 'x1') !== raiz[0] || num(r, 'y1') !== raiz[1]) throw new Error('las ramas no salen del mismo origen')
      if (!nodos.some((n) => Math.abs(n.x - num(r, 'x2')) < 1 && Math.abs(n.y - num(r, 'y2')) < 1)) throw new Error('una rama no llega a su dominio')
    }
    const ids = nodos.map((n) => n.id).sort().join(',')
    if (ids !== 'Archaea,Bacteria,Eucarya') throw new Error(`los dominios son ${ids}`)
    for (const n of nodos) {
      const t = svg.querySelector(`[data-pieza="dominio"][data-dominio="${n.id}"]`)
      if (t.textContent.trim() !== n.id || Math.abs(centroCaja(t)[0] - n.x) > 2) throw new Error(`el rótulo del dominio ${n.id} no está bajo su nodo`)
    }
    const mal = []
    for (const g of piezas(svg, 'grupo')) {
      const nombre = g.textContent.trim()
      const [x, y] = centroCaja(g)
      const donde = enCaja(x, y) ? 'acelular' : nodos.reduce((m, n) => (Math.abs(n.x - x) < Math.abs(m.x - x) ? n : m)).id
      if (GRUPO_DOMINIO[nombre] !== donde) mal.push(`${nombre} en ${donde}`)
    }
    if (mal.length) throw new Error(`grupos fuera de su sitio: ${mal.join('; ')}`)
    return `${piezas(svg, 'grupo').length} grupos, cada uno bajo su dominio`
  })

  control('Dominios · virus y priones quedan fuera del árbol, y la llave de procariotas abarca Bacteria y Archaea, no Eucarya', () => {
    const svg = porClave('tres-dominios')
    const { nodos, enCaja } = leerDominios(svg)
    for (const r of piezas(svg, 'rama')) if (enCaja(num(r, 'x2'), num(r, 'y2'))) throw new Error('una rama del árbol llega a los acelulares')
    const acel = piezas(svg, 'grupo').filter((g) => enCaja(...centroCaja(g))).map((g) => g.textContent.trim()).sort().join(',')
    if (acel !== 'Priones,Virus') throw new Error(`en la caja de acelulares hay: ${acel}`)
    const x = (id) => nodos.find((n) => n.id === id).x
    const abarca = (texto) => {
      const [[x1], , , [x2]] = puntos(svg.querySelector(`[data-pieza="llave"][data-texto="${texto}"]`))
      return ['Bacteria', 'Archaea', 'Eucarya'].filter((id) => x(id) >= Math.min(x1, x2) && x(id) <= Math.max(x1, x2)).join(',')
    }
    if (abarca('Procariotas') !== 'Bacteria,Archaea') throw new Error(`la llave de procariotas abarca ${abarca('Procariotas')}`)
    if (abarca('Eucariotas') !== 'Eucarya') throw new Error(`la llave de eucariotas abarca ${abarca('Eucariotas')}`)
    return 'virus y priones fuera; procariotas = Bacteria + Archaea; eucariotas = Eucarya'
  })

  /*
   * Estructura de los virus. Se mide sobre el dibujo: el acido nucleico dentro
   * de su capside, la capside dentro de la envoltura y las espiculas pegadas a
   * la envoltura y hacia fuera.
   */
  const enPoligono = (poligono, x, y) => {
    const p = poligono.ownerSVGElement.createSVGPoint()
    p.x = x
    p.y = y
    return poligono.isPointInFill(p)
  }
  control('Virus · en los dos el ácido nucleico está dentro de la cápside, y solo el envuelto tiene la cápside dentro de una envoltura', () => {
    const svg = porClave('estructura-virus')
    for (const id of ['desnudo', 'envuelto']) {
      const cap = svg.querySelector(`[data-pieza="capside"][data-virion="${id}"]`)
      const an = svg.querySelector(`[data-pieza="acido-nucleico"][data-virion="${id}"]`)
      const fuera = puntos(an).filter(([x, y]) => !enPoligono(cap, x, y)).length
      if (fuera) throw new Error(`en el virus ${id}, ${fuera} punto(s) del ácido nucleico quedan fuera de la cápside`)
    }
    const env = piezas(svg, 'envoltura')
    if (env.length !== 1) throw new Error(`hay ${env.length} envolturas`)
    const [cx, cy, r] = [num(env[0], 'cx'), num(env[0], 'cy'), num(env[0], 'r')]
    const capE = svg.querySelector('[data-pieza="capside"][data-virion="envuelto"]').getBBox()
    if (Math.hypot(capE.x + capE.width / 2 - cx, capE.y + capE.height / 2 - cy) > 2 || Math.max(capE.width, capE.height) / 2 > r - 4) throw new Error('la cápside del virus envuelto no está dentro de su envoltura')
    const capD = svg.querySelector('[data-pieza="capside"][data-virion="desnudo"]').getBBox()
    if (Math.hypot(capD.x + capD.width / 2 - cx, capD.y + capD.height / 2 - cy) < r + capD.width / 2) throw new Error('el virus desnudo está dentro de una envoltura')
    return 'ácido nucleico dentro de la cápside en los dos; envoltura solo en el envuelto'
  })

  control('Virus · las espículas de glicoproteína arrancan en la envoltura y apuntan hacia fuera', () => {
    const svg = porClave('estructura-virus')
    const env = pieza(svg, 'envoltura')
    const [cx, cy, r] = [num(env, 'cx'), num(env, 'cy'), num(env, 'r')]
    const es = piezas(svg, 'espicula')
    for (const e of es) {
      const d1 = Math.hypot(num(e, 'x1') - cx, num(e, 'y1') - cy)
      const d2 = Math.hypot(num(e, 'x2') - cx, num(e, 'y2') - cy)
      if (Math.abs(d1 - r) > 1.5) throw new Error('una espícula no arranca en la envoltura')
      if (!(d2 > d1 + 4)) throw new Error('una espícula apunta hacia dentro')
    }
    return `${es.length} espículas sobre la envoltura, todas hacia fuera`
  })

  /*
   * Ciclo de PCR. La escala de temperatura se reconstruye con las marcas del
   * eje (dos marcas bastan para la recta y -> °C); cada meseta se lee a su
   * altura y se ordena por su posicion horizontal dentro de su ciclo.
   */
  const escalaPcr = (svg) => {
    const m = piezas(svg, 'marca').map((e) => [num(e, 'y1'), num(e, 'data-valor')]).sort((a, b) => a[0] - b[0])
    const [[ya, ta], [yb, tb]] = [m[0], m[m.length - 1]]
    return (y) => ta + ((y - ya) * (tb - ta)) / (yb - ya)
  }
  const PCR_T = { desnaturalizacion: 95, hibridacion: 50, elongacion: 72 }
  control('PCR · cada meseta está a la temperatura de su fase (95, 50 y 72 °C), leída en la escala del eje', () => {
    const svg = porClave('ciclo-pcr')
    const aT = escalaPcr(svg)
    const mesetas = piezas(svg, 'meseta')
    if (mesetas.length !== 6) throw new Error(`hay ${mesetas.length} mesetas`)
    for (const m of mesetas) {
      const t = aT(num(m, 'y1'))
      const fase = m.getAttribute('data-fase')
      if (Math.abs(t - PCR_T[fase]) > 2) throw new Error(`la ${fase} del ciclo ${m.getAttribute('data-ciclo')} está a ${t.toFixed(0)} °C`)
    }
    return 'desnaturalización a 95, hibridación a 50 y elongación a 72 °C en los dos ciclos'
  })

  control('PCR · en cada ciclo van en orden desnaturalización, hibridación y elongación, y cada rótulo está sobre su meseta', () => {
    const svg = porClave('ciclo-pcr')
    const orden = ['desnaturalizacion', 'hibridacion', 'elongacion']
    for (const c of ['1', '2']) {
      const ms = piezas(svg, 'meseta').filter((m) => m.getAttribute('data-ciclo') === c).sort((a, b) => num(a, 'x1') - num(b, 'x1'))
      const leido = ms.map((m) => m.getAttribute('data-fase')).join(',')
      if (leido !== orden.join(',')) throw new Error(`el ciclo ${c} va en orden ${leido}`)
    }
    for (const r of piezas(svg, 'fase')) {
      const fase = r.getAttribute('data-fase')
      const m = svg.querySelector(`[data-pieza="meseta"][data-ciclo="1"][data-fase="${fase}"]`)
      const [cx] = centroCaja(r)
      if (cx < num(m, 'x1') || cx > num(m, 'x2')) throw new Error(`el rótulo «${r.textContent}» no está sobre su meseta`)
      const esperado = { desnaturalizacion: /desnaturaliz/i, hibridacion: /hibridaci/i, elongacion: /elongaci/i }[fase]
      if (!esperado.test(r.textContent)) throw new Error(`la meseta de ${fase} lleva el rótulo «${r.textContent}»`)
    }
    return 'desnaturalización → hibridación → elongación, con cada rótulo sobre su meseta'
  })

  /*
   * Arbol de bacilos gramnegativos. Cada arista se lee por sus extremos: sale
   * de la caja del padre y llega a la del hijo. El camino de rotulos de la raiz
   * a cada hoja se contrasta con el perfil que da el apunte (UKHSA).
   */
  const ARBOL_PADRE = { pseudomonas: 'raiz', enterobacterias: 'raiz', proteus: 'enterobacterias', ecoli: 'enterobacterias', salmonella: 'enterobacterias' }
  const PERFIL = {
    pseudomonas: ['oxidasa +'],
    proteus: ['oxidasa −', 'ureasa +'],
    ecoli: ['oxidasa −', 'ureasa −', 'indol +'],
    salmonella: ['oxidasa −', 'ureasa −', 'indol −'],
  }
  const nodoEn = (svg, x, y) =>
    piezas(svg, 'nodo').find((n) => x >= num(n, 'x') - 1 && x <= num(n, 'x') + num(n, 'width') + 1 && y >= num(n, 'y') - 1 && y <= num(n, 'y') + num(n, 'height') + 1)
  control('Árbol · cada arista une un nodo con su padre: la oxidasa sale del bacilo gramnegativo y la ureasa y el indol, de las enterobacterias', () => {
    const svg = porClave('arbol-gramnegativos')
    const llegan = {}
    for (const a of piezas(svg, 'arista')) {
      const de = nodoEn(svg, num(a, 'x1'), num(a, 'y1'))
      const al = nodoEn(svg, num(a, 'x2'), num(a, 'y2'))
      if (!de || !al) throw new Error('una arista no empieza o no acaba en una caja')
      const hijo = al.getAttribute('data-id')
      llegan[hijo] = (llegan[hijo] ?? []).concat(de.getAttribute('data-id'))
    }
    for (const [hijo, padre] of Object.entries(ARBOL_PADRE)) {
      const p = llegan[hijo] ?? []
      if (p.length !== 1 || p[0] !== padre) throw new Error(`a ${hijo} llega(n) ${p.join(', ') || 'ninguna'} en vez de ${padre}`)
    }
    if (llegan.raiz) throw new Error('llega una arista a la raíz')
    return 'cinco aristas, cada una desde su padre'
  })

  control('Árbol · el camino de pruebas hasta cada bacteria es su perfil: Pseudomonas oxidasa +, enterobacterias −; Proteus ureasa +; Salmonella ureasa e indol −', () => {
    const svg = porClave('arbol-gramnegativos')
    const rotulo = (hijo) => svg.querySelector(`[data-pieza="rotulo-arista"][data-arista="${hijo}"]`).textContent.toLowerCase().split(',').map((t) => t.trim().replace(/\s+/g, ' '))
    const mal = []
    for (const [hoja, perfil] of Object.entries(PERFIL)) {
      const camino = []
      let n = hoja
      while (n !== 'raiz') {
        camino.unshift(...rotulo(n))
        n = ARBOL_PADRE[n]
      }
      if (camino.join('|') !== perfil.join('|')) mal.push(`${hoja}: ${camino.join(', ')}`)
    }
    if (mal.length) throw new Error(`caminos que no son el perfil: ${mal.join('; ')}`)
    return 'Pseudomonas, Proteus, E. coli y Salmonella con su perfil de oxidasa, ureasa e indol'
  })

  /*
   * Tema 17. A partir de aqui, los controles de cada tema van DENTRO DE SU
   * PROPIO BLOQUE { ... }: sus funciones auxiliares quedan en el ambito del
   * bloque y no pueden chocar con las de otro tema (ya chocaron dentroDe en el
   * 15 y cajaDe en el 16, con «Identifier has already been declared»).
   */
  {
    /*
     * Control semicuantitativo. La puntuacion se cuenta en el dibujo: una
     * estria puntua si tiene encima al menos una colonia (a menos de 2,5 px del
     * segmento). Cada estria debe caer en su cuarto: el signo de sus extremos
     * respecto del centro de la placa es el del cuarto.
     */
    const SEMI_SIGNO = { 1: [1, -1], 2: [-1, -1], 3: [-1, 1], 4: [1, 1] }
    const semiDistancia = (px, py, e) => {
      const [x1, y1, x2, y2] = ['x1', 'y1', 'x2', 'y2'].map((a) => num(e, a))
      const dx = x2 - x1
      const dy = y2 - y1
      const f = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)))
      return Math.hypot(px - (x1 + f * dx), py - (y1 + f * dy))
    }
    const semiPuntos = (svg, placa) => {
      const es = piezas(svg, 'estria').filter((e) => e.getAttribute('data-placa') === placa)
      const cs = piezas(svg, 'colonia').filter((c) => c.getAttribute('data-placa') === placa)
      return { es, n: es.filter((e) => cs.some((c) => semiDistancia(num(c, 'cx'), num(c, 'cy'), e) < 2.5)).length }
    }
    control('Semicuantitativo · cada placa tiene 4 cuartos con 4 estrías dentro de su cuarto, y la puntuación escrita es el número de estrías con colonias', () => {
      const svg = porClave('control-semicuantitativo')
      const leidas = []
      for (const placa of ['buena', 'mala']) {
        const disco = svg.querySelector(`[data-pieza="placa"][data-placa="${placa}"]`)
        const [cx, cy, r] = ['cx', 'cy', 'r'].map((a) => num(disco, a))
        const { es, n } = semiPuntos(svg, placa)
        if (es.length !== 16) throw new Error(`la placa ${placa} tiene ${es.length} estrías`)
        for (const q of [1, 2, 3, 4]) {
          const deq = es.filter((e) => e.getAttribute('data-cuarto') === String(q))
          if (deq.length !== 4) throw new Error(`el cuarto ${q} de la placa ${placa} tiene ${deq.length} estrías`)
          const [sx, sy] = SEMI_SIGNO[q]
          for (const e of deq)
            for (const [x, y] of [[num(e, 'x1'), num(e, 'y1')], [num(e, 'x2'), num(e, 'y2')]]) {
              if (Math.sign(x - cx) !== sx || Math.sign(y - cy) !== sy) throw new Error(`una estría del cuarto ${q} (placa ${placa}) se sale de su cuarto`)
              if (Math.hypot(x - cx, y - cy) > r) throw new Error(`una estría del cuarto ${q} (placa ${placa}) se sale de la placa`)
            }
        }
        const texto = svg.querySelector(`[data-pieza="puntuacion"][data-placa="${placa}"]`).textContent
        const escrita = Number(texto.match(/(\d+)\s*\/\s*16/)?.[1])
        if (escrita !== n) throw new Error(`la placa ${placa} dice «${texto}», pero tiene colonias en ${n} estrías`)
        leidas.push(`${placa} ${n}/16`)
      }
      return `16 estrías por placa en sus cuartos; puntuaciones contadas: ${leidas.join(', ')}`
    })

    control('Semicuantitativo · el veredicto sigue el mínimo de 8 de la guía: apto si las estrías con colonias llegan a 8, se desecha si no', () => {
      const svg = porClave('control-semicuantitativo')
      const minimo = num(pieza(svg, 'minimo'), 'data-valor')
      if (minimo !== 8) throw new Error(`el mínimo dibujado es ${minimo}, no 8`)
      const leidos = []
      for (const placa of ['buena', 'mala']) {
        const { n } = semiPuntos(svg, placa)
        const v = svg.querySelector(`[data-pieza="veredicto"][data-placa="${placa}"]`).textContent
        const esperado = n >= minimo ? /^apto/i : /desecha/i
        if (!esperado.test(v)) throw new Error(`la placa ${placa} (${n}/16) dice «${v}»`)
        leidos.push(`${n}/16 → ${v.split(':')[0]}`)
      }
      return leidos.join('; ')
    })

    /*
     * Recuperacion de un medio selectivo. La escala sale de las marcas del eje;
     * cada barra se lee por su altura y se compara con su recuento escrito. El
     * porcentaje y el veredicto de cada lote se calculan con las alturas, no con
     * los textos.
     */
    const recEscala = (svg) => {
      const m = piezas(svg, 'marca').map((e) => [num(e, 'y1'), num(e, 'data-valor')]).sort((a, b) => a[0] - b[0])
      const [[ya, va], [yb, vb]] = [m[0], m[m.length - 1]]
      return (y) => va + ((y - ya) * (vb - va)) / (yb - ya)
    }
    const recValor = (svg, medio) => {
      const aV = recEscala(svg)
      const b = svg.querySelector(`[data-pieza="barra"][data-medio="${medio}"]`)
      return aV(num(b, 'y')) - aV(num(b, 'y') + num(b, 'height'))
    }
    const REC_LOTES = ['lote-a', 'lote-b', 'lote-c']
    control('Recuperación · cada barra mide lo que dice su recuento, y la línea del 50 % está a la mitad de la barra del no selectivo', () => {
      const svg = porClave('recuperacion-medio')
      const aV = recEscala(svg)
      for (const medio of ['no-selectivo', ...REC_LOTES]) {
        const v = recValor(svg, medio)
        const texto = svg.querySelector(`[data-pieza="recuento"][data-medio="${medio}"]`).textContent
        const escrito = Number(texto.match(/\d+/)[0])
        if (Math.abs(v - escrito) > 1) throw new Error(`la barra de ${medio} mide ${v.toFixed(0)} ufc y dice «${texto}»`)
      }
      const ref = recValor(svg, 'no-selectivo')
      const u = aV(num(pieza(svg, 'umbral'), 'y1'))
      if (Math.abs(u - ref / 2) > 1) throw new Error(`la línea del 50 % está en ${u.toFixed(0)} ufc, y la mitad del no selectivo es ${(ref / 2).toFixed(0)}`)
      return `barras a escala; la línea del 50 % en ${u.toFixed(0)} ufc, mitad de ${ref.toFixed(0)}`
    })

    control('Recuperación · cada lote lleva su porcentaje del no selectivo y su veredicto: apto desde el 50 %, se desecha por debajo', () => {
      const svg = porClave('recuperacion-medio')
      const ref = recValor(svg, 'no-selectivo')
      const leidos = []
      for (const medio of REC_LOTES) {
        const pct = (100 * recValor(svg, medio)) / ref
        const tp = svg.querySelector(`[data-pieza="porcentaje"][data-medio="${medio}"]`).textContent
        if (Math.abs(Number(tp.match(/\d+/)[0]) - pct) > 1) throw new Error(`${medio} recupera un ${pct.toFixed(0)} % y dice «${tp}»`)
        const v = svg.querySelector(`[data-pieza="veredicto"][data-medio="${medio}"]`).textContent
        const esperado = pct >= 50 ? /^apto/i : /desecha/i
        if (!esperado.test(v)) throw new Error(`${medio} recupera un ${pct.toFixed(0)} % y dice «${v}»`)
        leidos.push(`${medio} ${pct.toFixed(0)} % → ${v}`)
      }
      return leidos.join('; ')
    })
  }

  /* Tema 18: controles en su propio bloque, como desde el tema 17. */
  {
    /*
     * Membrana en CCA. Cada colonia se clasifica por su relleno, comparado con
     * el de las muestras de la leyenda; las cuentas y los resultados por 100 mL
     * se recalculan con el volumen filtrado escrito en el dibujo.
     */
    const ccaClases = (svg) => {
      const muestras = piezas(svg, 'muestra').map((m) => [m.getAttribute('data-color'), m.getAttribute('fill')])
      const cuenta = Object.fromEntries(muestras.map(([c]) => [c, 0]))
      const R = num(pieza(svg, 'membrana'), 'r')
      const [mx, my] = [num(pieza(svg, 'membrana'), 'cx'), num(pieza(svg, 'membrana'), 'cy')]
      for (const k of piezas(svg, 'colonia')) {
        const m = muestras.find(([, f]) => f === k.getAttribute('fill'))
        if (!m) throw new Error(`una colonia tiene un color (${k.getAttribute('fill')}) que no está en la leyenda`)
        if (Math.hypot(num(k, 'cx') - mx, num(k, 'cy') - my) > R) throw new Error('una colonia cae fuera de la membrana')
        cuenta[m[0]]++
      }
      return cuenta
    }
    const ccaNumero = (svg, sel) => Number(svg.querySelector(sel).textContent.match(/(\d+(?:[.,]\d+)?)/)[1].replace(',', '.'))
    control('CCA · cada color de colonia cuenta lo que dice la leyenda, y E. coli son solo las azul-violeta', () => {
      const svg = porClave('membrana-cca')
      const c = ccaClases(svg)
      for (const color of Object.keys(c)) {
        const escrito = ccaNumero(svg, `[data-pieza="cuenta"][data-color="${color}"]`)
        if (escrito !== c[color]) throw new Error(`la leyenda dice ${escrito} ${color} y hay ${c[color]}`)
      }
      const vol = num(pieza(svg, 'volumen'), 'data-valor')
      const ecoli = ccaNumero(svg, '[data-pieza="resultado"][data-parametro="ecoli"]')
      if (Math.abs(ecoli - (c.violeta * 100) / vol) > 1e-6) throw new Error(`E. coli escrito ${ecoli}, y las violeta dan ${(c.violeta * 100) / vol}`)
      return `rosas ${c.rosa}, violeta ${c.violeta}, incoloras ${c.incolora}; E. coli ${ecoli} ufc/100 mL`
    })

    control('CCA · los coliformes totales son rosas + azul-violeta por 100 mL, sin las incoloras', () => {
      const svg = porClave('membrana-cca')
      const c = ccaClases(svg)
      const vol = num(pieza(svg, 'volumen'), 'data-valor')
      const colif = ccaNumero(svg, '[data-pieza="resultado"][data-parametro="coliformes"]')
      const debe = ((c.rosa + c.violeta) * 100) / vol
      if (Math.abs(colif - debe) > 1e-6) throw new Error(`coliformes escritos ${colif}, y rosas + violeta dan ${debe}`)
      return `${c.rosa} + ${c.violeta} = ${debe} ufc/100 mL`
    })

    /*
     * TSC-MUP. Las colonias de los dos paneles se comparan por su posicion
     * respecto del centro de su membrana; una colonia tiene halo si hay un
     * halo centrado en ella (a menos de 1,5 px).
     */
    const tscRelativas = (svg, panel, nombre) => {
      const m = svg.querySelector(`[data-pieza="membrana"][data-panel="${panel}"]`)
      return piezas(svg, nombre).map((k) => ({ el: k, x: num(k, 'cx') - num(m, 'cx'), y: num(k, 'cy') - num(m, 'cy') }))
    }
    const tscConHalo = (svg) => {
      const halos = piezas(svg, 'halo')
      return tscRelativas(svg, 'uv', 'colonia-uv').filter((c) => halos.some((h) => Math.hypot(num(h, 'cx') - num(c.el, 'cx'), num(h, 'cy') - num(c.el, 'cy')) < 1.5))
    }
    control('TSC-MUP · el panel UV es el mismo filtro que el visible, y cada halo rodea una colonia', () => {
      const svg = porClave('tsc-mup')
      const vis = tscRelativas(svg, 'visible', 'colonia-visible')
      const uv = tscRelativas(svg, 'uv', 'colonia-uv')
      if (vis.length !== uv.length) throw new Error(`${vis.length} colonias con luz visible y ${uv.length} con UV`)
      for (const c of uv) if (!vis.some((v) => Math.hypot(v.x - c.x, v.y - c.y) < 1)) throw new Error('una colonia del panel UV no está en el visible')
      for (const h of piezas(svg, 'halo')) {
        const sobre = uv.some((c) => Math.hypot(num(h, 'cx') - num(c.el, 'cx'), num(h, 'cy') - num(c.el, 'cy')) < 1.5)
        if (!sobre) throw new Error('hay un halo fluorescente que no rodea ninguna colonia')
      }
      return `${uv.length} colonias en los mismos sitios; ${piezas(svg, 'halo').length} halos, todos sobre una colonia`
    })

    control('TSC-MUP · el recuento de C. perfringens son las colonias con halo, y las presuntivas, todas las negras o grises', () => {
      const svg = porClave('tsc-mup')
      const n = tscConHalo(svg).length
      const t = pieza(svg, 'recuento').textContent
      const escritos = (t.match(/\d+/g) ?? []).map(Number)
      const vol = num(pieza(svg, 'recuento'), 'data-volumen')
      if (escritos[0] !== n || escritos[1] !== (n * 100) / vol) throw new Error(`el recuento dice «${t}», y hay ${n} colonias con halo en ${vol} mL`)
      const pres = Number(pieza(svg, 'presuntivas').textContent.match(/\d+/)[0])
      const vis = piezas(svg, 'colonia-visible').length
      if (pres !== vis) throw new Error(`dice ${pres} presuntivas y hay ${vis} colonias`)
      return `${vis} presuntivas; ${n} con halo → ${(n * 100) / vol} ufc/100 mL`
    })
  }

  /* Tema 19: controles en su propio bloque, como desde el tema 17. */
  {
    /*
     * Plan de tres clases. La escala logaritmica se reconstruye con dos marcas
     * del eje; cada punto se lee como un valor en ufc/g. El veredicto se
     * calcula con los limites del Reglamento (n = 5, c = 2, m = 50, M = 500),
     * no con las lineas dibujadas: esas las vigila el segundo control.
     */
    const planEscala = (svg) => {
      const m = piezas(svg, 'marca').map((e) => [num(e, 'x1'), Math.log10(num(e, 'data-valor'))]).sort((a, b) => a[0] - b[0])
      const [[xa, la], [xb, lb]] = [m[0], m[m.length - 1]]
      return (x) => 10 ** (la + ((x - xa) * (lb - la)) / (xb - xa))
    }
    const PLAN = { n: 5, c: 2, m: 50, M: 500 }
    const planVeredicto = (vals) => {
      if (vals.some((v) => v > PLAN.M)) return 'insatisfactorio'
      const entre = vals.filter((v) => v > PLAN.m).length
      if (entre > PLAN.c) return 'insatisfactorio'
      return entre ? 'aceptable' : 'satisfactorio'
    }
    control('Plan de tres clases · cada lote lleva el veredicto que dan sus cinco valores con n = 5, c = 2, m = 50 y M = 500 ufc/g', () => {
      const svg = porClave('plan-tres-clases')
      const aV = planEscala(svg)
      const leidos = []
      for (const v of piezas(svg, 'veredicto')) {
        const lote = v.getAttribute('data-lote')
        const vals = piezas(svg, 'valor').filter((p) => p.getAttribute('data-lote') === lote).map((p) => aV(num(p, 'cx')))
        if (vals.length !== PLAN.n) throw new Error(`el lote ${lote} tiene ${vals.length} valores`)
        const debe = planVeredicto(vals)
        if (v.textContent.trim().toLowerCase() !== debe) throw new Error(`el lote ${lote} (${vals.map((x) => x.toFixed(0)).join(', ')}) dice «${v.textContent}» y le corresponde «${debe}»`)
        leidos.push(`${lote} ${debe}`)
      }
      return leidos.join('; ')
    })

    control('Plan de tres clases · las líneas m y M están en 50 y 500 ufc/g de la escala logarítmica, y las zonas cambian justo en ellas', () => {
      const svg = porClave('plan-tres-clases')
      const aV = planEscala(svg)
      const lin = Object.fromEntries(piezas(svg, 'limite').map((l) => [l.getAttribute('data-limite'), num(l, 'x1')]))
      for (const [k, debe] of [['m', PLAN.m], ['M', PLAN.M]]) {
        const v = aV(lin[k])
        if (Math.abs(v / debe - 1) > 0.03) throw new Error(`la línea ${k} está en ${v.toFixed(0)} ufc/g, no en ${debe}`)
      }
      const z = Object.fromEntries(piezas(svg, 'zona').map((r) => [r.getAttribute('data-zona'), [num(r, 'x'), num(r, 'x') + num(r, 'width')]]))
      const cerca = (a, b) => Math.abs(a - b) < 0.6
      if (!cerca(z.satisfactorio[1], lin.m) || !cerca(z.intermedia[0], lin.m)) throw new Error('la zona satisfactoria no acaba en m')
      if (!cerca(z.intermedia[1], lin.M) || !cerca(z.insatisfactorio[0], lin.M)) throw new Error('la zona intermedia no acaba en M')
      return `m en ${aV(lin.m).toFixed(0)} y M en ${aV(lin.M).toFixed(0)} ufc/g; las zonas cambian en las líneas`
    })

    /*
     * NMP de moluscos. Cada placa de TBX se asigna al tubo que tiene justo
     * encima (misma columna). Un tubo es positivo si es amarillo y su placa
     * es azul; los colores se comparan con los de la leyenda del propio
     * dibujo (piezas leyenda, por su clase).
     */
    const MOL_TABLA = { '5-0-0': 230, '5-1-0': 330, '5-2-0': 490, '5-2-1': 700, '5-3-0': 790, '5-3-1': 1100, '4-0-0': 130, '5-0-1': 310, '5-1-1': 460, '4-1-0': 170, '4-2-0': 220 }
    const molColores = (svg) => {
      const de = (clase) => svg.querySelector(`[data-pieza="leyenda"][data-clase="${clase}"]`).getAttribute('fill')
      return { amarillo: de('amarillo'), azul: de('azul') }
    }
    const molCodigo = (svg) => {
      const { amarillo, azul } = molColores(svg)
      const placas = piezas(svg, 'placa-tbx')
      return ['1', '0.1', '0.01']
        .map((d) => {
          const tubos = piezas(svg, 'tubo').filter((t) => t.getAttribute('data-dilucion') === d)
          if (tubos.length !== 5) throw new Error(`la dilución ${d} tiene ${tubos.length} tubos`)
          return tubos.filter((t) => {
            if (t.getAttribute('fill') !== amarillo) return false
            const cx = num(t, 'x') + num(t, 'width') / 2
            const bajo = num(t, 'y') + num(t, 'height')
            const p = placas.find((q) => Math.abs(num(q, 'cx') - cx) < 2 && num(q, 'cy') > bajo && num(q, 'cy') - bajo < 30)
            return p && p.getAttribute('fill') === azul
          }).length
        })
        .join('-')
    }
    control('NMP de moluscos · cada cifra del código es el número de tubos amarillos con colonias azules en el TBX de esa cantidad', () => {
      const svg = porClave('nmp-moluscos')
      const leido = molCodigo(svg)
      const escrito = pieza(svg, 'codigo').textContent.match(/\d-\d-\d/)?.[0]
      if (escrito !== leido) throw new Error(`el dibujo da ${leido} y el código escrito es ${escrito}`)
      return `código ${leido}, contado tubo a tubo`
    })

    control('NMP de moluscos · el NMP escrito es el de la tabla 5 × 3 para su código, y su valoración frente a m = 230 y M = 700', () => {
      const svg = porClave('nmp-moluscos')
      const codigo = pieza(svg, 'codigo').textContent.match(/\d-\d-\d/)?.[0]
      const debe = MOL_TABLA[codigo]
      if (debe === undefined) throw new Error(`el código ${codigo} no está en la tabla del verificador`)
      const nmp = Number(pieza(svg, 'nmp').textContent.match(/\d+/)[0])
      if (nmp !== debe) throw new Error(`el código ${codigo} da ${debe} NMP/100 g y el dibujo dice ${nmp}`)
      const val = pieza(svg, 'valoracion').textContent
      const esperado = nmp <= 230 ? /≤ *m|hasta m/i : nmp <= 700 ? /entre m/i : /> *M|supera M/i
      if (!esperado.test(val)) throw new Error(`${nmp} NMP/100 g se valora «${val}»`)
      return `${codigo} → ${nmp} NMP/100 g, entre m y M`
    })
  }

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
  84: 'el Gobierno de Zaragoza respondiendo ante el Alcalde en vez de ante el Pleno',
  85: 'los miembros del Gobierno de Zaragoza nombrados por el Pleno',
  86: 'la capital de provincia rebajada a 150.000 habitantes, dibujo y cifra de acuerdo entre sí pero no con la ley',
  87: 'el supuesto d) de gran población pintado como automático, sin decisión de la Asamblea',
  88: 'la cifra del supuesto a) de gran población escrita distinta de donde arranca su barra',
  89: 'Zaragoza llevada a 160.000 habitantes, por debajo de los dos umbrales automáticos',
  90: 'las subvenciones y los precios públicos, cambiados de sitio en la lista del art. 2.1',
  91: 'los precios públicos colgados de los tributos propios',
  92: 'el IVTM pintado como impuesto potestativo',
  93: 'el IIVTNU rotulado como impuesto indirecto',
  94: 'el personal directivo colgado de los empleados públicos como una quinta clase',
  95: 'la llave de los funcionarios estirada hasta el personal laboral',
  96: 'la sanción por falta leve acortada a seis meses, dibujo y cifra de acuerdo entre sí pero no con la ley',
  97: 'la cifra de la falta grave escrita distinta de lo que dibuja su barra',
  98: 'la Administrativa y la Auxiliar de Administración General, cambiadas de orden',
  99: 'los agentes forestales y medioambientales, metidos en la Subescala Técnica',
  100: 'el servicio de prevención propio obligatorio desde 250, dibujo y cifra de acuerdo entre sí pero no con la norma',
  101: 'la cifra del Comité de Seguridad y Salud escrita distinta de donde arranca su tramo',
  102: 'el grupo 3 pintado sin profilaxis ni tratamiento, como si fuera del 4',
  103: 'el grupo 3 manipulado en nivel de contención 2',
  104: 'de la salida a la vía de entrada, saltándose el mecanismo de transmisión',
  105: 'la vía parenteral, quitada de la lista de vías de entrada',
  106: 'un flujo descendente laminar metido en la clase I',
  107: 'la clase III con un solo HEPA de salida, en vez de dos en serie',
  108: 'el condensador subido por encima de la platina',
  109: 'el aumento total escrito como si fuera solo el del objetivo',
  110: 'los hongos subidos por encima de las micobacterias',
  111: 'el hipoclorito rebajado a desinfectante de nivel bajo',
  112: 'el autoclave a 121 °C con 20 minutos, dibujo y rótulo de acuerdo entre sí pero no con la guía',
  113: 'el rótulo del horno a 170 °C escrito con otro tiempo del que dibuja su punto',
  114: 'la estría del tercer cuadrante arrancando en el primero, saltándose el segundo',
  115: 'cuatro colonias de más en el último cuadrante, que deja de tener menos que el anterior',
  116: 'una colonia de la siembra en superficie hundida dentro del agar',
  117: 'los volúmenes cambiados: 0,1 ml en profundidad y 1 ml en superficie',
  118: 'la transferencia al tercer tubo sale del primero, saltándose el segundo',
  119: 'la placa de una sola colonia marcada como contable',
  120: 'un halo de fluorescencia movido a un pocillo que no es amarillo',
  121: 'el NMP de coliformes buscado con 23 + 11 = 34 pocillos',
  122: 'el decolorante antes que el lugol: rótulos de los pasos 2 y 3 intercambiados',
  123: 'la gramnegativa sigue violeta después del decolorante',
  124: 'la gota, el doble de alta, llega al fondo de la excavación',
  125: 'el cubre de la preparación entre porta y cubre, levantado',
  126: 'las cianobacterias colocadas bajo Eucarya, como si fueran algas',
  127: 'la llave de procariotas alargada hasta abarcar Eucarya',
  128: 'el ácido nucleico del virus desnudo sacado de su cápside',
  129: 'una espícula girada hacia el interior de la envoltura',
  130: 'la hibridación del primer ciclo subida a la temperatura de la elongación',
  131: 'los rótulos de hibridación y elongación intercambiados',
  132: 'la arista de Proteus sale de la raíz, saltándose las enterobacterias',
  133: 'Salmonella pintada como ureasa positiva',
  134: 'tres estrías de la placa buena sin colonias, con la puntuación sin cambiar',
  135: 'la placa de 5 de 16 dada por apta',
  136: 'la línea del 50 % subida al 60 % del no selectivo',
  137: 'el lote C, con un 39 %, dado por apto',
  138: 'una colonia azul-violeta (E. coli) pintada de rosa, sin cambiar la leyenda',
  139: 'los coliformes totales contados solo con las rosas',
  140: 'un halo fluorescente pintado en un hueco sin colonia',
  141: 'todas las colonias negras contadas como C. perfringens, sin mirar la fluorescencia',
  142: 'un valor del lote aceptable subido por encima de M sin cambiar el veredicto',
  143: 'la línea M desplazada a 1000 ufc/g',
  144: 'un tubo con colonias crema en el TBX contado como positivo',
  145: 'el NMP escrito no es el de su código en la tabla 5 × 3',
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
  84: [82],
  85: [83],
  86: [84],
  87: [85],
  88: [84],
  89: [85],
  90: [86],
  91: [87],
  92: [88],
  93: [89],
  94: [90],
  95: [91],
  96: [92],
  97: [93],
  98: [94],
  99: [95],
  100: [96],
  101: [97],
  102: [98],
  103: [99],
  104: [100],
  105: [101],
  106: [102],
  107: [103],
  108: [104],
  109: [105],
  110: [106],
  111: [107],
  112: [108],
  113: [109],
  114: [110],
  115: [111],
  116: [112],
  117: [113],
  118: [114],
  119: [115],
  120: [116],
  121: [117],
  122: [118],
  123: [119],
  124: [120],
  125: [121],
  126: [122],
  127: [123],
  128: [124],
  129: [125],
  130: [126],
  131: [127],
  132: [128],
  133: [129],
  134: [130],
  135: [131],
  136: [132],
  137: [133],
  138: [134],
  139: [135],
  140: [136],
  141: [137],
  142: [138],
  143: [139],
  144: [140],
  145: [141],
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
