/**
 * Comprobaciones de la AMPLIACION del repaso (octubre de 2026), sobre el dato.
 *
 * No conducen la app: miran el JSON, el apunte y git. Las usa
 * `verificar-repaso.js` como sus controles 9 a 14, cada uno con su sabotaje.
 *
 *   (e) Integridad: lo que habia en BASE sigue igual, ID a ID.
 *   (b) Cita: cada tarjeta o pregunta nueva dice su apartado y su fuente; si es
 *       nucleo, dice tambien en que examen cayo.
 *   (f) Evidencia: el fragmento literal que respalda la respuesta esta, tal
 *       cual, dentro de ese apartado del apunte.
 *   (a) Reparto: las respuestas correctas, a partes iguales entre las letras.
 *   (c) Duplicados: nada nuevo que repita lo que ya habia con otras palabras.
 *   (d) Cobertura: cada apartado numerado tiene al menos una tarjeta y una
 *       pregunta.
 *
 * Que es «nuevo»: todo ID que no estaba en BASE. Que es un tema «ampliado»: el
 * que tiene `repaso/cobertura/tema-NN.json`, el mapa apartado -> IDs de lo que
 * ya habia. Reparto, duplicados y cobertura solo se exigen en los ampliados,
 * para que los demas no fallen por un criterio que todavia no se les aplica.
 */

import { existsSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

import { RAIZ } from './comun.js'

/**
 * Ultimo commit publicado antes de empezar la ampliacion: lo que habia en
 * origin/main el 15/10/2026. Contra el se mide la integridad.
 */
export const BASE = '2fec5d6'

/** Cambios aprobados sobre lo que habia en BASE: { tema, id, motivo }. */
const EXCEPCIONES = JSON.parse(readFileSync(join(RAIZ, 'scripts/excepciones-integridad.json'), 'utf8'))

/** Bajo estos umbrales dos enunciados con la misma respuesta no se toman por la misma pregunta. */
const PARECIDO_PREGUNTA = 0.6
const PARECIDO_ANVERSO = 0.6
const PARECIDO_REVERSO = 0.5
/** Una evidencia mas corta no respalda nada: «169» esta en cualquier parte. */
const MINIMO_EVIDENCIA = 30

const dos = (n) => String(n).padStart(2, '0')

const norma = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

/** El apunte sin marcas de enfasis y con los espacios colapsados: lo demas, tal cual. */
const plano = (s) => s.normalize('NFC').replace(/\*+/g, '').replace(/\s+/g, ' ').trim()

const VACIAS = new Set(
  ('de la el los las que en y a o u del por con se su sus para al lo como un una unos unas es son ' +
    'segun conforme acuerdo articulo articulos ce constitucion espanola cual cuales le les esta este ' +
    'estos estas ser sera seran').split(' '),
)
const fichas = (s) => new Set(norma(s).split(' ').filter((w) => w && !VACIAS.has(w)))
const jaccard = (a, b) => {
  const comun = [...a].filter((x) => b.has(x)).length
  return comun / (a.size + b.size - comun || 1)
}

/** Lo que identifica la respuesta: el texto correcto, y si remite a otras («las dos anteriores»), todas. */
const GENERICA = /anterior|ambas|todas las|ninguna de|ninguno/i
const respuesta = (q) => {
  const ok = q.opciones[q.correcta] ?? ''
  return GENERICA.test(ok) ? norma(q.opciones.join(' | ')) : norma(ok)
}

/* ------------------------------------------------------------------ */

export function leerApunte(tema) {
  return readFileSync(join(RAIZ, `temas/tema-${dos(tema)}.md`), 'utf8')
}

export function leerCobertura(tema) {
  const f = join(RAIZ, `repaso/cobertura/tema-${dos(tema)}.json`)
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null
}

export function leerBase(tema) {
  try {
    const txt = execFileSync('git', ['show', `${BASE}:repaso/tema-${dos(tema)}.json`], {
      cwd: RAIZ,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 64 * 1024 * 1024,
    })
    return JSON.parse(txt)
  } catch {
    return null
  }
}

/**
 * Apartados del apunte: los `##` y `###` numerados, y los `###` sin numero que
 * cuelgan de un `##` numerado (en el tema 1, «### Articulo 8.» bajo el 3 ->
 * «3/Articulo 8»). Cada uno con su texto, subapartados incluidos.
 */
export function apartados(md) {
  const lineas = md.split(/\r?\n/)
  const cab = []
  let padre = null
  lineas.forEach((l, i) => {
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(l)
    if (!m) return
    const nivel = m[1].length
    const titulo = m[2]
    const num = /^(\d+(?:\.\d+)*)\.?\s/.exec(titulo)
    let clave = null
    if (nivel === 2) {
      padre = num ? num[1] : null
      clave = padre
    } else if (num) clave = num[1]
    else if (padre) clave = `${padre}/${titulo.split('.')[0].trim()}`
    cab.push({ clave, titulo, nivel, linea: i })
  })
  return cab
    .map((c, k) => {
      const fin = cab.slice(k + 1).find((d) => d.nivel <= c.nivel)
      return { ...c, texto: lineas.slice(c.linea, fin ? fin.linea : lineas.length).join('\n') }
    })
    .filter((c) => c.clave)
}

/** El numero de un apartado, que es lo que se cita con «§»: «3/Articulo 8» -> «3». */
const numeroDe = (clave) => clave.split('/')[0]

/** Todo lo que se puede preguntar del tema, con su clase. */
function elementos(d) {
  return [
    ...d.flashcards.map((x) => ({ x, clase: 'tarjeta' })),
    ...d.test.map((x) => ({ x, clase: 'test' })),
    ...d.supuestos.flatMap((s) => s.preguntas.map((x) => ({ x, clase: 'supuesto', sup: s }))),
  ]
}

/** IDs de BASE: tarjetas, preguntas, supuestos y preguntas de supuesto. */
function idsBase(base) {
  if (!base) return new Set()
  return new Set([
    ...elementos(base).map((e) => e.x.id),
    ...base.supuestos.map((s) => s.id),
  ])
}

const canon = (v) =>
  Array.isArray(v)
    ? `[${v.map(canon).join(',')}]`
    : v && typeof v === 'object'
      ? `{${Object.keys(v)
          .sort()
          .map((k) => `${JSON.stringify(k)}:${canon(v[k])}`)
          .join(',')}}`
      : JSON.stringify(v)

/* ------------------------------------------------------------------ */
/* Los seis controles. Devuelven el detalle, null si no aplican, o lanzan. */

/**
 * (e) Lo de BASE sigue igual: mismo ID, mismo texto, mismo nucleo, todo. Una
 * excepcion aprobada solo deja cambiar los `campos` que declara.
 */
export function integridad(tema, d, base) {
  if (!base) return null
  const excepciones = new Map(EXCEPCIONES.filter((e) => e.tema === tema).map((e) => [e.id, e.campos]))
  const sin = (o, campos) => Object.fromEntries(Object.entries(o).filter(([k]) => !campos.includes(k)))
  const ahora = new Map([...elementos(d).map((e) => [e.x.id, e.x]), ...d.supuestos.map((s) => [s.id, s])])
  const problemas = []
  const viejos = [
    ...elementos(base).map((e) => e.x),
    // del supuesto se compara todo menos las preguntas, que van una a una arriba
    ...base.supuestos.map(({ preguntas, ...resto }) => ({ ...resto, preguntas: preguntas.length })),
  ]
  for (const viejo of viejos) {
    const campos = excepciones.get(viejo.id) ?? []
    const v = sin(viejo, campos)
    const nuevo = ahora.get(v.id)
    const n = nuevo && sin(nuevo, campos)
    if (!n) {
      problemas.push(`${v.id} ha desaparecido`)
      continue
    }
    const actual = typeof v.preguntas === 'number' ? { ...n, preguntas: n.preguntas.length } : n
    if (typeof v.preguntas === 'number' && actual.preguntas < v.preguntas) {
      problemas.push(`${v.id} tenía ${v.preguntas} preguntas y ahora ${actual.preguntas}`)
      continue
    }
    if (typeof v.preguntas === 'number') actual.preguntas = v.preguntas
    if (canon(actual) !== canon(v)) {
      const campos = [...new Set([...Object.keys(v), ...Object.keys(actual)])].filter(
        (k) => canon(v[k]) !== canon(actual[k]),
      )
      problemas.push(`${v.id} ha cambiado (${campos.join(', ')})`)
    }
  }
  const todos = [...elementos(d).map((e) => e.x.id), ...d.supuestos.map((s) => s.id)]
  const repetidos = todos.filter((id, i) => todos.indexOf(id) !== i)
  if (repetidos.length) problemas.push(`ID repetido: ${[...new Set(repetidos)].join(', ')}`)
  const ajenos = todos.filter((id) => !id.startsWith(`t${dos(tema)}-`))
  if (ajenos.length) problemas.push(`ID de otro tema: ${ajenos.slice(0, 3).join(', ')}`)
  if (problemas.length) throw new Error(problemas.slice(0, 4).join('; '))
  return `${viejos.length} elementos de ${BASE} intactos${excepciones.size ? ` (${excepciones.size} con excepción aprobada, solo en sus campos)` : ''}, sin IDs repetidos`
}

/** Lo que no estaba en BASE. */
export function nuevos(d, base) {
  const viejos = idsBase(base)
  return elementos(d).filter((e) => !viejos.has(e.x.id))
}

/** (b) Apartado y fuente en todo lo nuevo; si es nucleo, su precedente en PLANTILLAS.md. */
export function cita(d, base, md, plantillas) {
  const nv = nuevos(d, base)
  if (!nv.length) return null
  const claves = new Set(apartados(md).map((a) => a.clave))
  const lineas = plantillas.split(/\r?\n/)
  const malos = []
  for (const { x } of nv) {
    if (!x.apartado || !claves.has(x.apartado)) {
      malos.push(`${x.id}: apartado «${x.apartado ?? ''}» no existe en el apunte`)
      continue
    }
    if (!x.fuente || !x.fuente.includes(`§${numeroDe(x.apartado)}`)) {
      malos.push(`${x.id}: la fuente no cita el §${numeroDe(x.apartado)} del apunte`)
      continue
    }
    if (x.nucleo) {
      const p = x.precedente
      const i = p?.texto ? lineas.findIndex((l) => l.includes(p.texto)) : -1
      if (i < 0) {
        malos.push(`${x.id}: es núcleo y su precedente no está en PLANTILLAS.md`)
        continue
      }
      const cabecera = lineas.slice(0, i).reverse().find((l) => l.startsWith('#')) ?? ''
      if (!p.plantilla || !(cabecera.includes(p.plantilla) || lineas[i].includes(`| ${p.plantilla} |`))) {
        malos.push(`${x.id}: el precedente no es de la plantilla «${p.plantilla}»`)
      }
    } else if (x.precedente) {
      malos.push(`${x.id}: declara precedente y no es núcleo`)
    }
  }
  if (malos.length) throw new Error(`${malos.length} sin cita válida: ${malos.slice(0, 3).join('; ')}`)
  const nucleo = nv.filter((e) => e.x.nucleo).length
  return `${nv.length} nuevas con apartado y fuente; ${nucleo} núcleo, cada una con su examen`
}

/** (f) La evidencia literal esta tal cual dentro de su apartado. */
export function evidencia(d, base, md) {
  const nv = nuevos(d, base)
  if (!nv.length) return null
  const secciones = new Map(apartados(md).map((a) => [a.clave, plano(a.texto)]))
  const malos = []
  for (const { x } of nv) {
    const trozos = [x.evidencia].flat().filter(Boolean)
    if (!trozos.length) {
      malos.push(`${x.id}: sin evidencia`)
      continue
    }
    for (const t of trozos) {
      if (plano(t).length < MINIMO_EVIDENCIA) malos.push(`${x.id}: evidencia demasiado corta («${t}»)`)
      else if (!(secciones.get(x.apartado) ?? '').includes(plano(t))) {
        malos.push(`${x.id}: «${t.slice(0, 50)}…» no está en el §${x.apartado} del apunte`)
      }
    }
  }
  if (malos.length) throw new Error(`${malos.length} evidencia(s) sin respaldo: ${malos.slice(0, 3).join('; ')}`)
  return `${nv.length} nuevas, cada evidencia encontrada literal en su apartado`
}

/** (a) Correctas a partes iguales: como mucho 1 de diferencia entre letras, sobre el total. */
export function reparto(d) {
  const partes = []
  const revisa = (qs, n, donde) => {
    if (!qs.length) return
    const c = new Array(n).fill(0)
    qs.forEach((q) => c[q.correcta]++)
    partes.push(`${donde} ${c.join('/')}`)
    if (Math.max(...c) - Math.min(...c) > 1) {
      throw new Error(`en ${donde} las correctas van ${c.map((x, i) => `${'abcd'[i]}=${x}`).join(' ')}: más de 1 de diferencia`)
    }
  }
  revisa(d.test, 3, 'test')
  revisa(d.supuestos.flatMap((s) => s.preguntas), 4, 'supuestos')
  return partes.join(' · ')
}

/** (c) Nada nuevo repite, con otras palabras, una pregunta o tarjeta que ya este. */
export function duplicados(d, base) {
  const nv = nuevos(d, base)
  if (!nv.length) return null
  const malos = []
  const grupos = {
    test: d.test,
    supuesto: d.supuestos.flatMap((s) => s.preguntas),
    tarjeta: d.flashcards,
  }
  const vistos = new Set()
  for (const { x, clase } of nv) {
    vistos.add(x)
    for (const y of grupos[clase]) {
      if (vistos.has(y)) continue // cada pareja, una vez
      if (clase === 'tarjeta') {
        const mismaFigura = (x.figura?.valor ?? '') === (y.figura?.valor ?? '')
        const a = jaccard(fichas(x.anverso), fichas(y.anverso))
        const r = jaccard(fichas(x.reverso), fichas(y.reverso))
        if (mismaFigura && a >= PARECIDO_ANVERSO && r >= PARECIDO_REVERSO) {
          malos.push(`${x.id} ≈ ${y.id} (anverso ${a.toFixed(2)}, reverso ${r.toFixed(2)})`)
        }
      } else if (respuesta(x) === respuesta(y)) {
        const p = jaccard(fichas(x.pregunta), fichas(y.pregunta))
        if (p >= PARECIDO_PREGUNTA) malos.push(`${x.id} ≈ ${y.id} (misma respuesta, enunciado ${p.toFixed(2)})`)
      }
    }
  }
  if (malos.length) throw new Error(`${malos.length} duplicado(s): ${malos.slice(0, 3).join('; ')}`)
  return `${nv.length} nuevas comparadas con todo el tema: ninguna repite otra`
}

/** (d) Cada apartado numerado, con al menos una tarjeta y una pregunta (suyas o de sus subapartados). */
export function cobertura(d, base, md, mapa) {
  const aps = apartados(md)
  const claves = new Set(aps.map((a) => a.clave))
  const clase = new Map([
    ...elementos(d).map((e) => [e.x.id, e.clase === 'tarjeta' ? 'tarjeta' : 'pregunta']),
    ...d.supuestos.map((s) => [s.id, 'pregunta']),
  ])
  const problemas = []
  const de = new Map(aps.map((a) => [a.clave, { tarjeta: 0, pregunta: 0 }]))
  const apunta = (clave, id) => {
    if (!claves.has(clave)) return problemas.push(`el mapa cita el apartado «${clave}», que no existe`)
    if (!clase.has(id)) return problemas.push(`el mapa cita ${id}, que no existe`)
    // cuenta para el apartado y para todos sus padres
    for (const a of aps) {
      if (clave === a.clave || clave.startsWith(`${a.clave}.`) || clave.startsWith(`${a.clave}/`)) {
        de.get(a.clave)[clase.get(id)]++
      }
    }
  }
  for (const [clave, ids] of Object.entries(mapa.apartados)) ids.forEach((id) => apunta(clave, id))
  for (const { x } of nuevos(d, base)) if (x.apartado) apunta(x.apartado, x.id)
  const mapeados = new Set(Object.values(mapa.apartados).flat())
  const sinMapa = [...idsBase(base)].filter((id) => clase.has(id) && !mapeados.has(id) && !/-s\d+-/.test(id))
  if (sinMapa.length) problemas.push(`${sinMapa.length} elemento(s) de ${BASE} sin apartado en el mapa: ${sinMapa.slice(0, 4).join(', ')}`)
  const huecos = [...de].filter(([, n]) => !n.tarjeta || !n.pregunta)
  for (const [clave, n] of huecos) {
    problemas.push(`§${clave} sin ${!n.tarjeta ? 'tarjeta' : ''}${!n.tarjeta && !n.pregunta ? ' ni ' : ''}${!n.pregunta ? 'pregunta' : ''}`)
  }
  if (problemas.length) throw new Error(problemas.slice(0, 4).join('; '))
  return `${aps.length} apartados, todos con tarjeta y pregunta`
}
