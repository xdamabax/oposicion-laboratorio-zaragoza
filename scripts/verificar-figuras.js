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
