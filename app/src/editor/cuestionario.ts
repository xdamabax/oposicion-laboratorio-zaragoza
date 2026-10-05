/**
 * El cuestionario tal como sale en la descarga: que preguntas entran, en que
 * orden, con las opciones en que orden y, sobre todo, con la letra correcta
 * RECALCULADA. Lo usan el PDF (Imprimir.tsx) y el Word (word.tsx): una sola
 * funcion, para que los dos digan lo mismo.
 *
 * Las preguntas son datos con una plantilla: el indice de la opcion correcta.
 * Por eso aqui no se edita texto. Barajar las opciones mueve el indice con
 * ellas, y scripts/verificar-cuestionario.js comprueba en cada tema que cada
 * solucion sigue apuntando a la opcion que era correcta en el JSON.
 */

import type { Figura, PreguntaTest, Repaso } from '../types'
import type { OpcionesCuestionario } from './almacen'

export interface PreguntaPreparada {
  id: string
  /** Numero en el cuestionario: corrido, primero el test y luego los supuestos */
  numero: number
  pregunta: string
  opciones: string[]
  /** Indice de la correcta en ESTE orden de opciones */
  correcta: number
  explicacion?: string
  fuente?: string
  figura?: Figura
  /** No se barajan sus opciones (ver opcionesFijas) */
  fijas: boolean
}

export interface SupuestoPreparado {
  id: string
  titulo: string
  enunciado: string
  figura?: Figura
  preguntas: PreguntaPreparada[]
}

export interface CuestionarioPreparado {
  test: PreguntaPreparada[]
  supuestos: SupuestoPreparado[]
  /** Todas, en el orden de las soluciones */
  todas: PreguntaPreparada[]
}

/**
 * Una pregunta cuyas opciones no se pueden barajar: alguna opcion se refiere
 * a otras («Las dos respuestas anteriores son correctas»), o la explicacion
 * cita una letra («la b) es...»). Se peca de prudente: alguna de las que caen
 * aqui cita letras de un articulo y no de una opcion, y solo pierde el barajado.
 */
export function opcionesFijas(q: PreguntaTest): boolean {
  const serefiere = /anterior|ambas|todas las|ninguna de|(?<![\w.])\(?[abcd]\)/i
  const citaLetra = /(?<![\w.])\(?[abcd]\)|\b(opci[oó]n|respuesta|letra)\s+[«"]?[abcd]\b/i
  return q.opciones.some((o) => serefiere.test(o)) || citaLetra.test(q.explicacion ?? '')
}

/** Generador pseudoaleatorio con semilla (mulberry32): el mismo barajado cada vez. */
function azar(semilla: number) {
  let a = semilla >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function barajar<T>(lista: T[], semilla: number): T[] {
  const r = azar(semilla)
  const out = [...lista]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Semilla propia de cada pregunta: barajar una no cambia las demas. */
function semillaDe(id: string, semilla: number): number {
  let h = semilla ^ 0x9e3779b9
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 0x01000193)
  return h >>> 0
}

function preparar(q: PreguntaTest, o: OpcionesCuestionario): Omit<PreguntaPreparada, 'numero'> {
  const fijas = opcionesFijas(q)
  const orden = o.barajarOpciones && !fijas ? barajar(q.opciones.map((_, i) => i), semillaDe(q.id, o.semilla)) : q.opciones.map((_, i) => i)
  return {
    id: q.id,
    pregunta: q.pregunta,
    opciones: orden.map((i) => q.opciones[i]),
    correcta: orden.indexOf(q.correcta),
    explicacion: q.explicacion,
    fuente: q.fuente,
    figura: q.figura,
    fijas,
  }
}

export function prepararCuestionario(repaso: Repaso, o: OpcionesCuestionario): CuestionarioPreparado {
  const entra = (q: PreguntaTest) => !o.excluidas.includes(q.id)
  let n = 0
  const numerar = (q: Omit<PreguntaPreparada, 'numero'>): PreguntaPreparada => ({ ...q, numero: ++n })

  const elegidas = repaso.test.filter(entra)
  const ordenadas = o.orden === 'barajado' ? barajar(elegidas, o.semilla) : elegidas
  const test = ordenadas.map((q) => numerar(preparar(q, o)))
  const supuestos = repaso.supuestos
    .map((s) => ({ id: s.id, titulo: s.titulo, enunciado: s.enunciado, figura: s.figura, preguntas: s.preguntas.filter(entra) }))
    .filter((s) => s.preguntas.length > 0)
    .map((s) => ({ ...s, preguntas: s.preguntas.map((q) => numerar(preparar(q, o))) }))
  return { test, supuestos, todas: [...test, ...supuestos.flatMap((s) => s.preguntas)] }
}
