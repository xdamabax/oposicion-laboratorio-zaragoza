/**
 * Abrir y comprobar un .docx de la app: lo comparten verificar-word.js (el
 * apunte de un tema), verificar-temario.js y verificar-cuestionario.js.
 *
 * Un .docx es un ZIP con XML. Se abre con JSZip y se analiza en el navegador
 * (DOMParser para el XML, canvas para medir la tinta de las imagenes). Los
 * controles de un apunte (controlar) y sus sabotajes estan explicados en
 * verificar-word.js.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import JSZip from 'jszip'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { gfm } from 'micromark-extension-gfm'
import { toString } from 'mdast-util-to-string'

import { RAIZ } from './comun.js'

export const sinEspacios = (t) => t.replace(/\s+/g, '')

/* ---------- lo que deberia tener: el o los apuntes ---------- */

/** El cuerpo de un apunte, sin el frontmatter. */
export function apunteDe(tema) {
  return readFileSync(join(RAIZ, 'temas', `tema-${String(tema).padStart(2, '0')}.md`), 'utf8').replace(/^---[\s\S]*?\n---\r?\n?/, '')
}

const leerMd = (md) => fromMarkdown(md, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] })

/**
 * Quita secciones como app/src/editor/secciones.ts (desde un titulo de nivel 2
 * con ese texto hasta el siguiente de nivel 1 o 2). Copiado aqui porque aquel es
 * TypeScript de la app; si cambia alli, cambia aqui.
 */
function quitarSecciones(arbol, ocultas) {
  let fuera = false
  arbol.children = arbol.children.filter((n) => {
    if (n.type === 'heading' && n.depth <= 2) fuera = ocultas.includes(toString(n, { includeImageAlt: false }))
    return !fuera
  })
  return arbol
}

/**
 * Lo que tiene que haber en el Word, leido del Markdown con el mismo parser que
 * la app. `documentos` son uno o varios apuntes; si llevan `titulo` (el
 * temario), ese titulo es un «Titulo 1» y sus apartados bajan `desplazamiento`
 * niveles.
 */
export function esperado(documentos, desplazamiento = 0) {
  const titulos = []
  const tablas = []
  const bloques = []
  let figuras = 0
  let elementos = 0
  const texto = (n) => sinEspacios(toString(n, { includeImageAlt: false }))
  const recorrer = (n) => {
    if (n.type === 'heading') titulos.push({ nivel: Math.max(1, n.depth - 1) + desplazamiento, texto: toString(n).replace(/\s+/g, ' ').trim() })
    if (n.type === 'image' && n.url !== 'salto:pagina') figuras++
    if (n.type === 'listItem' && n.children[0]?.type === 'paragraph') elementos++
    if (n.type === 'paragraph' && texto(n)) bloques.push(texto(n))
    if (n.type === 'table') {
      tablas.push({ filas: n.children.length, columnas: Math.max(...n.children.map((r) => r.children.length)), cabecera: n.children[0].children.map(texto).join('|') })
      for (const fila of n.children)
        for (const c of fila.children) {
          if (texto(c)) bloques.push(texto(c))
          figuras += c.children.filter((x) => x.type === 'image').length
        }
      return
    }
    for (const c of n.children || []) recorrer(c)
  }
  for (const d of documentos) {
    if (d.titulo) titulos.push({ nivel: 1, texto: d.titulo })
    recorrer(quitarSecciones(leerMd(d.md), d.ocultas ?? []))
  }
  return { titulos, tablas, figuras, bloques, elementos }
}

/* ---------- lo que tiene: el .docx ---------- */

/** Se analiza en el navegador, que tiene DOMParser y canvas para medir la tinta de las imagenes. */
export function analizarEnPagina({ partes, medios }) {
  const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
  const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
  const malformadas = []
  const leer = (nombre) => {
    const d = new DOMParser().parseFromString(partes[nombre], 'application/xml')
    if (d.getElementsByTagName('parsererror').length) malformadas.push(nombre)
    return d
  }
  for (const nombre of Object.keys(partes)) leer(nombre)
  const doc = leer('word/document.xml')
  const estilos = leer('word/styles.xml')
  const rels = leer('word/_rels/document.xml.rels')
  // numeracion: w:num -> w:abstractNum -> el texto de cada nivel
  const numeracion = partes['word/numbering.xml'] ? leer('word/numbering.xml') : null
  const abstractos = {}
  const nums = {}
  if (numeracion) {
    for (const a of numeracion.getElementsByTagNameNS(W, 'abstractNum')) {
      const niveles = {}
      for (const l of a.getElementsByTagNameNS(W, 'lvl')) {
        const t = l.getElementsByTagNameNS(W, 'lvlText')[0]
        niveles[l.getAttributeNS(W, 'ilvl') ?? l.getAttribute('w:ilvl')] = t ? (t.getAttributeNS(W, 'val') ?? t.getAttribute('w:val')) : ''
      }
      abstractos[a.getAttributeNS(W, 'abstractNumId') ?? a.getAttribute('w:abstractNumId')] = niveles
    }
    for (const n of numeracion.getElementsByTagNameNS(W, 'num')) {
      const ref = n.getElementsByTagNameNS(W, 'abstractNumId')[0]
      nums[n.getAttributeNS(W, 'numId') ?? n.getAttribute('w:numId')] = ref ? (ref.getAttributeNS(W, 'val') ?? ref.getAttribute('w:val')) : null
    }
  }

  const destinoDe = {}
  for (const r of rels.getElementsByTagName('Relationship')) destinoDe[r.getAttribute('Id')] = 'word/' + r.getAttribute('Target').replace(/^\/?word\//, '')

  const hijo = (el, nombre) => [...el.childNodes].find((c) => c.localName === nombre)
  const val = (el) => el?.getAttributeNS(W, 'val') ?? el?.getAttribute('w:val')
  // estilos que ya llevan «conservar con el siguiente»
  const estiloConserva = new Set()
  for (const s of estilos.getElementsByTagNameNS(W, 'style')) {
    const ppr = hijo(s, 'pPr')
    if (ppr && hijo(ppr, 'keepNext')) estiloConserva.add(s.getAttributeNS(W, 'styleId') ?? s.getAttribute('w:styleId'))
  }
  const enTabla = (el) => {
    for (let p = el.parentNode; p; p = p.parentNode) if (p.localName === 'tbl') return true
    return false
  }
  const parrafos = [...doc.getElementsByTagNameNS(W, 'p')].map((p) => {
    const ppr = hijo(p, 'pPr')
    const estilo = ppr ? val(hijo(ppr, 'pStyle')) : undefined
    const numPr = ppr && hijo(ppr, 'numPr')
    const numId = numPr ? val(hijo(numPr, 'numId')) : null
    const ilvl = numPr ? val(hijo(numPr, 'ilvl')) ?? '0' : null
    return {
      estilo,
      lista: numPr ? { numId, ilvl, marca: abstractos[nums[numId]]?.[ilvl] ?? null } : null,
      texto: [...p.getElementsByTagNameNS(W, 't')].map((t) => t.textContent).join(''),
      conserva: !!(ppr && hijo(ppr, 'keepNext')) || estiloConserva.has(estilo),
      // solo el «conservar» puesto en el propio parrafo (el de su estilo aparte)
      conservaPropio: !!(ppr && hijo(ppr, 'keepNext')),
      nuevaPagina: !!(ppr && hijo(ppr, 'pageBreakBefore')),
      enTabla: enTabla(p),
      dibujos: [...p.getElementsByTagNameNS(W, 'drawing')].map((d) => {
        const blip = d.getElementsByTagNameNS('http://schemas.openxmlformats.org/drawingml/2006/main', 'blip')[0]
        return blip ? destinoDe[blip.getAttributeNS(R, 'embed') ?? blip.getAttribute('r:embed')] : undefined
      }),
      saltoPagina: [...p.getElementsByTagNameNS(W, 'br')].some((b) => val(b) === 'page' || b.getAttribute('w:type') === 'page'),
    }
  })
  const tablas = [...doc.getElementsByTagNameNS(W, 'tbl')].map((t) => {
    const filas = [...t.childNodes].filter((c) => c.localName === 'tr')
    const trPr = (f) => hijo(f, 'trPr')
    const celdas = (f) => [...f.childNodes].filter((c) => c.localName === 'tc')
    const textoCelda = (c) => [...c.getElementsByTagNameNS(W, 't')].map((x) => x.textContent).join('').replace(/\s+/g, '')
    return {
      filas: filas.length,
      columnas: Math.max(...filas.map((f) => celdas(f).length)),
      cabecera: celdas(filas[0]).map(textoCelda).join('|'),
      cabeceraRepetida: !!(trPr(filas[0]) && hijo(trPr(filas[0]), 'tblHeader')),
      filasPartibles: filas.filter((f) => !(trPr(f) && hijo(trPr(f), 'cantSplit'))).length,
      cabeceraConserva: [...filas[0].getElementsByTagNameNS(W, 'p')].every((p) => {
        const ppr = hijo(p, 'pPr')
        return !!(ppr && hijo(ppr, 'keepNext'))
      }),
    }
  })
  const docDefaults = estilos.getElementsByTagNameNS(W, 'docDefaults')[0]
  const sz = docDefaults?.getElementsByTagNameNS(W, 'sz')[0]
  const pgMar = doc.getElementsByTagNameNS(W, 'pgMar')[0]

  // la tinta de cada imagen: fraccion de pixeles que no son blancos
  const tinta = async (b64) => {
    const img = new Image()
    img.src = `data:image/png;base64,${b64}`
    await img.decode()
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    const ctx = c.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const { data } = ctx.getImageData(0, 0, c.width, c.height)
    let n = 0
    for (let i = 0; i < data.length; i += 4) if (data[i + 3] > 0 && data[i] + data[i + 1] + data[i + 2] < 720) n++
    return { ancho: c.width, alto: c.height, tinta: n / (data.length / 4) }
  }
  return Promise.all(Object.entries(medios).map(async ([k, b64]) => [k, await tinta(b64)])).then((m) => ({
    malformadas,
    parrafos,
    tablas,
    medios: Object.fromEntries(m),
    letra: sz ? Number(val(sz)) : null,
    margenIzquierdo: pgMar ? Number(pgMar.getAttributeNS(W, 'left') ?? pgMar.getAttribute('w:left')) : null,
  }))
}

export async function abrirDocx(buffer) {
  const zip = await JSZip.loadAsync(buffer)
  const partes = {}
  const medios = {}
  for (const nombre of Object.keys(zip.files)) {
    if (/\.(xml|rels)$/.test(nombre)) partes[nombre] = await zip.file(nombre).async('string')
    else if (/^word\/media\/.+\.png$/.test(nombre)) medios[nombre] = await zip.file(nombre).async('base64')
  }
  return { partes, medios }
}

/* ---------- los controles ---------- */

export const NIVEL = { Heading1: 1, Heading2: 2, Heading3: 3, Heading4: 4, Heading5: 5, Heading6: 6 }

export function controlar(a, e, docx) {
  const r = []
  const obligatorias = ['[Content_Types].xml', 'word/document.xml', 'word/styles.xml', 'word/_rels/document.xml.rels']
  const faltan = obligatorias.filter((p) => !(p in docx.partes))
  const usadas = a.parrafos.flatMap((p) => p.dibujos)
  const sinFichero = usadas.filter((d) => !d || !(d in a.medios))
  r.push({
    nombre: 'Word bien hecho: piezas, XML legible e imágenes dentro',
    ok: !faltan.length && !a.malformadas.length && !sinFichero.length,
    detalle: faltan.length ? `faltan ${faltan.join(', ')}` : a.malformadas.length ? `XML ilegible: ${a.malformadas.join(', ')}` : sinFichero.length ? `${sinFichero.length} imagen(es) sin su fichero` : `${Object.keys(docx.partes).length} piezas XML y ${Object.keys(a.medios).length} imágenes`,
  })

  const titulos = a.parrafos.filter((p) => p.estilo in NIVEL).map((p) => ({ nivel: NIVEL[p.estilo], texto: p.texto.replace(/\s+/g, ' ').trim() }))
  let difT = null
  for (let i = 0; i < Math.max(titulos.length, e.titulos.length) && !difT; i++) {
    const x = e.titulos[i]
    const y = titulos[i]
    if (!x || !y || x.nivel !== y.nivel || x.texto !== y.texto) difT = `el ${i + 1}.º: apunte ${x ? `«${x.texto}» (nivel ${x.nivel})` : 'nada'}, Word ${y ? `«${y.texto}» (nivel ${y.nivel})` : 'nada'}`
  }
  r.push({ nombre: 'Títulos: los mismos, en orden y con su nivel', ok: !difT, detalle: difT ?? `${titulos.length} títulos con los estilos de Word` })

  let difTab = a.tablas.length !== e.tablas.length ? `el apunte tiene ${e.tablas.length} tablas y el Word ${a.tablas.length}` : null
  for (let i = 0; i < e.tablas.length && !difTab; i++) {
    const x = e.tablas[i]
    const y = a.tablas[i]
    if (x.filas !== y.filas || x.columnas !== y.columnas) difTab = `tabla ${i + 1}: ${x.filas}×${x.columnas} en el apunte y ${y.filas}×${y.columnas} en el Word`
    else if (x.cabecera !== y.cabecera) difTab = `tabla ${i + 1}: otra cabecera («${y.cabecera.slice(0, 50)}»)`
    else if (!y.cabeceraRepetida) difTab = `tabla ${i + 1}: la cabecera no se repite en cada página`
    else if (y.filasPartibles) difTab = `tabla ${i + 1}: ${y.filasPartibles} fila(s) se pueden partir entre páginas`
  }
  const filas = a.tablas.reduce((s, t) => s + t.filas, 0)
  r.push({ nombre: 'Tablas: las mismas, cabecera repetida y filas sin partir', ok: !difTab, detalle: difTab ?? `${a.tablas.length} tablas y ${filas} filas` })

  const vacias = usadas.filter((d) => d && a.medios[d] && (a.medios[d].tinta < 0.005 || a.medios[d].ancho < 30))
  const okFig = usadas.length === e.figuras && !vacias.length && !sinFichero.length
  r.push({
    nombre: 'Figuras: una imagen por figura, todas con dibujo',
    ok: okFig,
    detalle:
      usadas.length !== e.figuras
        ? `el apunte tiene ${e.figuras} figuras y el Word ${usadas.length} imágenes`
        : sinFichero.length
          ? `${sinFichero.length} imagen(es) sin fichero`
          : vacias.length
            ? `${vacias.length} imagen(es) en blanco: ${vacias.join(', ')}`
            : `${usadas.length} imágenes; la que menos tinta tiene, ${(Math.min(1, ...usadas.map((d) => a.medios[d].tinta)) * 100).toFixed(1)} %`,
  })

  // texto: cada bloque del apunte, en orden, entre los parrafos del Word
  const delWord = a.parrafos.filter((p) => !(p.estilo in NIVEL) && p.estilo !== 'Title').map((p) => sinEspacios(p.texto))
  let j = 0
  let perdido = null
  for (const b of e.bloques) {
    const k = delWord.indexOf(b, j)
    if (k < 0) {
      perdido = b
      break
    }
    j = k + 1
  }
  r.push({ nombre: 'Texto: todo el apunte, entero y en orden', ok: !perdido, detalle: perdido ? `falta o está fuera de sitio «${perdido.slice(0, 60)}»` : `${e.bloques.length} párrafos y celdas` })

  const sueltos = [
    ...a.parrafos.filter((p) => p.estilo in NIVEL && !p.conserva).map((p) => `título «${p.texto.slice(0, 40)}»`),
    ...a.parrafos.filter((p, i) => !p.enTabla && !(p.estilo in NIVEL) && p.texto.trim().endsWith(':') && !p.conserva && i < a.parrafos.length - 1).map((p) => `entrada «${p.texto.slice(0, 40)}»`),
    ...a.tablas.filter((t) => !t.cabeceraConserva).map((t) => `cabecera «${t.cabecera.slice(0, 40)}»`),
  ]
  r.push({ nombre: 'Conservar con el siguiente: títulos, entradas y cabeceras', ok: !sueltos.length, detalle: sueltos.length ? `${sueltos.length} sin conservar, p. ej. ${sueltos[0]}` : 'todos' })

  // listas del apunte: sin las de los recuadros de fuentes (uno por tema en el
  // temario), que van desde su rotulo hasta el siguiente titulo
  let enRecuadro = false
  const delApunte = a.parrafos.filter((p) => {
    if (p.estilo in NIVEL || p.estilo === 'Title') enRecuadro = false
    else if (!p.lista && p.texto.trim() === 'Fuentes y verificación') enRecuadro = true
    return p.lista && !enRecuadro
  })
  const sinMarca = delApunte.filter((p) => !p.lista.marca)
  r.push({
    nombre: 'Listas: cada elemento con su viñeta o número',
    ok: delApunte.length === e.elementos && !sinMarca.length,
    detalle:
      delApunte.length !== e.elementos
        ? `el apunte tiene ${e.elementos} elementos de lista y el Word ${delApunte.length}`
        : sinMarca.length
          ? `${sinMarca.length} sin viñeta ni número, p. ej. «${sinMarca[0].texto.slice(0, 40)}»`
          : `${delApunte.length} elementos, con ${[...new Set(delApunte.map((p) => p.lista.marca))].join(' ')}`,
  })
  return r
}

/* ---------- sabotajes: se estropea el .docx ya generado ---------- */

const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

/** Cada sabotaje se hace en el navegador sobre el XML, y dice que controles tiene que tumbar (por indice). */
export const SABOTAJES = {
  1: { que: 'se pierde un título', tumba: [1] },
  2: { que: 'una tabla sin cabecera repetida', tumba: [2] },
  3: { que: 'una figura en blanco', tumba: [3] },
  4: { que: 'se pierde un párrafo de texto', tumba: [4] },
  5: { que: 'una entrada que acaba en «:» sin «conservar con el siguiente»', tumba: [5] },
  6: { que: 'falta el fichero de una imagen', tumba: [0, 3] },
  7: { que: 'un elemento de lista pierde su viñeta', tumba: [6] },
  8: { que: 'una lista apunta a una numeración que no existe', tumba: [6] },
}

function sabotearEnPagina({ n, documento, W, bloques }) {
  const d = new DOMParser().parseFromString(documento, 'application/xml')
  const hijo = (el, nombre) => [...el.childNodes].find((c) => c.localName === nombre)
  const ps = [...d.getElementsByTagNameNS(W, 'p')]
  const estilo = (p) => {
    const ppr = hijo(p, 'pPr')
    const s = ppr && hijo(ppr, 'pStyle')
    return s ? s.getAttribute('w:val') : ''
  }
  const texto = (p) => [...p.getElementsByTagNameNS(W, 't')].map((t) => t.textContent).join('')
  const enTabla = (el) => {
    for (let x = el.parentNode; x; x = x.parentNode) if (x.localName === 'tbl') return true
    return false
  }
  if (n === 1) ps.find((p) => /^Heading\d$/.test(estilo(p))).remove()
  if (n === 2) {
    const th = d.getElementsByTagNameNS(W, 'tblHeader')[0]
    if (!th) return null
    th.remove()
  }
  if (n === 4) {
    // Un parrafo del APUNTE: uno de los bloques que espera el control «Texto», y
    // que salga una sola vez (si se repitiera, el control lo encontraria mas
    // abajo y el sabotaje no romperia nada). No vale «el primer parrafo largo»:
    // en el temario ese es una linea de la portada, que no es texto del apunte.
    if (!bloques) throw new Error('el sabotaje 4 necesita los bloques esperados')
    const veces = new Map()
    for (const b of bloques) veces.set(b, (veces.get(b) ?? 0) + 1)
    const plano = (p) => texto(p).replace(/\s+/g, '')
    const p = ps.find((x) => !estilo(x) && !enTabla(x) && !texto(x).trim().endsWith(':') && veces.get(plano(x)) === 1 && ps.filter((y) => plano(y) === plano(x)).length === 1)
    if (!p) return null
    p.remove()
  }
  if (n === 5) {
    const p = ps.find((x) => !estilo(x) && !enTabla(x) && texto(x).trim().endsWith(':') && hijo(hijo(x, 'pPr') ?? x, 'keepNext'))
    if (!p) return null
    hijo(hijo(p, 'pPr'), 'keepNext').remove()
  }
  if (n === 7 || n === 8) {
    const p = ps.find((x) => hijo(x, 'pPr') && hijo(hijo(x, 'pPr'), 'numPr'))
    if (!p) return null
    const numPr = hijo(hijo(p, 'pPr'), 'numPr')
    if (n === 7) numPr.remove()
    else hijo(numPr, 'numId').setAttributeNS(W, 'w:val', '9999')
  }
  return new XMLSerializer().serializeToString(d)
}

/** `esperado`: lo que espera controlar (el sabotaje 4 elige su parrafo entre sus bloques). */
export async function sabotear(pagina, n, docx, esperado) {
  const copia = { partes: { ...docx.partes }, medios: { ...docx.medios } }
  const primera = Object.keys(copia.medios)[0]
  if (n === 3 || n === 6) {
    if (!primera) return null
    if (n === 6) delete copia.medios[primera]
    else {
      // un PNG blanco del mismo tamaño
      copia.medios[primera] = await pagina.evaluate(async (b64) => {
        const img = new Image()
        img.src = `data:image/png;base64,${b64}`
        await img.decode()
        const c = document.createElement('canvas')
        c.width = img.naturalWidth
        c.height = img.naturalHeight
        const ctx = c.getContext('2d')
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, c.width, c.height)
        return c.toDataURL('image/png').split(',')[1]
      }, copia.medios[primera])
    }
    return copia
  }
  const doc = await pagina.evaluate(sabotearEnPagina, { n, documento: copia.partes['word/document.xml'], W: W_NS, bloques: esperado?.bloques })
  if (doc === null) return null
  copia.partes['word/document.xml'] = doc
  return copia
}

/* ---------- conducir el editor ---------- */

export async function abrirEditor(ctx, base, tema) {
  return abrirConGancho(ctx, `${base}#/editar/tema/${tema}`)
}

/** Abre una pagina de la app quedandose con el .docx que entregue a la descarga. */
export async function abrirConGancho(ctx, url) {
  const p = await ctx.newPage()
  await p.setViewport({ width: 1400, height: 1000 })
  // se queda con el .docx que el editor pasa a la descarga (no hace falta disco)
  await p.evaluateOnNewDocument(() => {
    const original = URL.createObjectURL.bind(URL)
    URL.createObjectURL = (b) => {
      if (b instanceof Blob && b.type.includes('wordprocessingml')) window.__word = b
      return original(b)
    }
  })
  await p.goto(url, { waitUntil: 'networkidle0', timeout: 120000 })
  await p.waitForSelector('.editor-pagina[data-listo="1"]', { timeout: 60000 })
  return p
}

export async function descargarWord(p) {
  await p.evaluate(() => {
    window.__word = undefined
  })
  const [boton] = await p.$$('xpath/.//button[normalize-space()="Descargar Word"]')
  await boton.click()
  await p.waitForFunction(() => window.__word, { timeout: 600000 })
  const b64 = await p.evaluate(
    () =>
      new Promise((ok) => {
        const fr = new FileReader()
        fr.onload = () => ok(String(fr.result).split(',')[1])
        fr.readAsDataURL(window.__word)
      }),
  )
  return Buffer.from(b64, 'base64')
}

