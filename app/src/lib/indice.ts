import { TEMAS } from '../content'
import type { PreguntaTest } from '../types'

/**
 * De cada id de pregunta y tarjeta: de que tema es, de que clase, y cual es su
 * id «canonico». Lo usa la lista de falladas, que guarda ids y tiene que
 * contarlos por tema sin cargar el test mixto.
 */

export type Clase = 'test' | 'supuestos' | 'tarjetas'

/** Enunciado y opciones sin mayusculas, tildes, puntuacion ni marcas de negrita. */
export const huella = (p: PreguntaTest) =>
  [p.pregunta, ...p.opciones]
    .map((x) =>
      x
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim(),
    )
    .join('|')

interface Entrada {
  tema: number
  clase: Clase
}

const ENTRADAS = new Map<string, Entrada>()
/** Solo las que tienen gemela: id -> id de la primera igual, en el orden de los temas */
const GEMELA = new Map<string, string>()

{
  const primera = new Map<string, string>()
  for (const t of TEMAS) {
    const r = t.repaso
    if (!r) continue
    for (const f of r.flashcards) ENTRADAS.set(f.id, { tema: t.numero, clase: 'tarjetas' })
    const preguntas: [PreguntaTest, Clase][] = [
      ...r.test.map((p): [PreguntaTest, Clase] => [p, 'test']),
      ...r.supuestos.flatMap((s) => s.preguntas.map((p): [PreguntaTest, Clase] => [p, 'supuestos'])),
    ]
    for (const [p, clase] of preguntas) {
      ENTRADAS.set(p.id, { tema: t.numero, clase })
      // Una misma pregunta de examen puede estar en dos temas (t26-q19 y t27-q22)
      const h = huella(p)
      const previa = primera.get(h)
      if (previa) GEMELA.set(p.id, previa)
      else primera.set(h, p.id)
    }
  }
}

/** El id bajo el que se anota: el de la primera pregunta igual a esta. */
export const canonico = (id: string): string => GEMELA.get(id) ?? id

export const entrada = (id: string): Entrada | undefined => ENTRADAS.get(id)

export interface Pendientes {
  total: number
  /** clase -> cuantas */
  porClase: Record<Clase, number>
  /** tema -> clase -> cuantas, solo los temas con alguna */
  porTema: Map<number, Record<Clase, number>>
}

/**
 * Cuenta la lista de falladas. Un id que ya no existe en el contenido no
 * cuenta (ni sale en ningun test): se queda guardado, sin mas.
 */
export function contarPendientes(falladas: {
  preguntas: Record<string, unknown>
  tarjetas: Record<string, unknown>
}): Pendientes {
  const porClase: Record<Clase, number> = { test: 0, supuestos: 0, tarjetas: 0 }
  const porTema = new Map<number, Record<Clase, number>>()
  const anotar = (id: string, tarjeta: boolean) => {
    const e = ENTRADAS.get(id)
    if (!e || (e.clase === 'tarjetas') !== tarjeta) return
    porClase[e.clase]++
    const fila = porTema.get(e.tema) ?? { test: 0, supuestos: 0, tarjetas: 0 }
    fila[e.clase]++
    porTema.set(e.tema, fila)
  }
  for (const id of Object.keys(falladas.preguntas)) anotar(id, false)
  for (const id of Object.keys(falladas.tarjetas)) anotar(id, true)
  return {
    total: porClase.test + porClase.supuestos + porClase.tarjetas,
    porClase,
    porTema: new Map([...porTema.entries()].sort((a, b) => a[0] - b[0])),
  }
}
