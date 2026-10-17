import { TEMAS } from '../content'
import type { PreguntaTest, Supuesto } from '../types'

/**
 * Test mixto: preguntas de varios temas a la vez, al azar y sin decir de cual
 * es cada una hasta corregirla.
 *
 * Se barajan las PREGUNTAS, nunca sus opciones: hay opciones que se refieren a
 * otras («a) y b) son correctas», «ninguna de las anteriores») y el reparto de
 * letras correctas de cada tema esta compensado a mano.
 */

export type TipoMixto = 'test' | 'supuestos'

export interface ItemMixto {
  tema: number
  pregunta: PreguntaTest
  /** En los supuestos, el caso al que pertenece: su enunciado se pinta encima */
  supuesto?: Supuesto
  /** Apartado del apunte que la respalda («2.1», «3/Artículo 8»), si se sabe */
  apartado: string | null
}

/** Primer tema con supuestos: el segundo ejercicio solo versa sobre la parte segunda. */
export const PRIMER_TEMA_SUPUESTOS = 9

export const CUANTAS = [10, 20, 30, 50] as const
/** 0 = todas las disponibles */
export type Cuantas = (typeof CUANTAS)[number] | 0

/* ---------- Apartado del apunte ---------- */

type Cobertura = { apartados: Record<string, string[]> }

const coberturas = import.meta.glob('../../../repaso/cobertura/tema-*.json', {
  import: 'default',
  eager: true,
}) as Record<string, Cobertura>

/**
 * id -> apartado, para lo que ya existia antes de la ampliacion (lo nuevo lo
 * declara en su campo `apartado`). Si un id cubre varios apartados se queda el
 * mas concreto: «2.1» antes que «2».
 */
const APARTADO_DE: Map<string, string> = (() => {
  const mapa = new Map<string, string>()
  const hondura = (clave: string) => clave.split(/[./]/).length
  for (const cob of Object.values(coberturas)) {
    for (const [clave, ids] of Object.entries(cob.apartados ?? {})) {
      for (const id of ids) {
        const previo = mapa.get(id)
        if (!previo || hondura(clave) > hondura(previo)) mapa.set(id, clave)
      }
    }
  }
  return mapa
})()

function apartadoDe(p: PreguntaTest, s?: Supuesto): string | null {
  // Las preguntas de un supuesto anterior a la ampliacion las cubre el supuesto entero.
  return p.apartado ?? APARTADO_DE.get(p.id) ?? (s ? APARTADO_DE.get(s.id) : undefined) ?? null
}

/* ---------- Lo que se puede sortear ---------- */

export function temasConTipo(tipo: TipoMixto): number[] {
  return TEMAS.filter((t) =>
    tipo === 'test'
      ? (t.repaso?.test.length ?? 0) > 0
      : t.numero >= PRIMER_TEMA_SUPUESTOS && (t.repaso?.supuestos.length ?? 0) > 0,
  ).map((t) => t.numero)
}

/** Enunciado y opciones sin mayusculas, tildes, puntuacion ni marcas de negrita. */
const huella = (p: PreguntaTest) =>
  [p.pregunta, ...p.opciones]
    .map((x) =>
      x
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim(),
    )
    .join('|')

/**
 * Todas las preguntas de los temas elegidos, en el orden del dato. Una misma
 * pregunta de examen puede estar en dos temas (t26-q19 y t27-q22, que solo
 * difieren en los puntos finales): en una sesion sale una vez, la del primero.
 */
export function disponibles(temas: number[], tipo: TipoMixto, soloNucleo: boolean): ItemMixto[] {
  const elegidos = new Set(temas)
  const vistas = new Set<string>()
  const items: ItemMixto[] = []
  const anadir = (item: ItemMixto) => {
    const h = huella(item.pregunta)
    if (vistas.has(h)) return
    vistas.add(h)
    items.push(item)
  }
  for (const t of TEMAS) {
    if (!elegidos.has(t.numero) || !t.repaso) continue
    if (tipo === 'test') {
      for (const p of t.repaso.test) {
        if (soloNucleo && !p.nucleo) continue
        anadir({ tema: t.numero, pregunta: p, apartado: apartadoDe(p) })
      }
    } else if (t.numero >= PRIMER_TEMA_SUPUESTOS) {
      for (const s of t.repaso.supuestos) {
        for (const p of s.preguntas) {
          if (soloNucleo && !p.nucleo) continue
          anadir({ tema: t.numero, pregunta: p, supuesto: s, apartado: apartadoDe(p, s) })
        }
      }
    }
  }
  return items
}

/** Fisher-Yates sobre una copia. */
export function barajar<T>(lista: readonly T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

/** Las `cuantas` (0 = todas) sacadas al azar, ya en orden aleatorio. */
export function sortear(items: readonly ItemMixto[], cuantas: Cuantas): ItemMixto[] {
  const barajadas = barajar(items)
  return cuantas === 0 ? barajadas : barajadas.slice(0, cuantas)
}

/* ---------- La ultima seleccion, en este navegador ---------- */

export interface SeleccionMixto {
  temas: number[]
  tipo: TipoMixto
  soloNucleo: boolean
  cuantas: Cuantas
}

const CLAVE = 'oposicion-zgz:mixto:v1'

export const SELECCION_INICIAL: SeleccionMixto = {
  temas: TEMAS.map((t) => t.numero),
  tipo: 'test',
  soloNucleo: false,
  cuantas: 20,
}

// localStorage puede lanzar (modo privado, cookies bloqueadas): todo va envuelto.
export function leerSeleccion(): SeleccionMixto {
  try {
    const bruto = localStorage.getItem(CLAVE)
    if (!bruto) return SELECCION_INICIAL
    const s = JSON.parse(bruto) as Partial<SeleccionMixto>
    const validos = new Set(TEMAS.map((t) => t.numero))
    return {
      temas: Array.isArray(s.temas) ? s.temas.filter((n) => validos.has(n)) : SELECCION_INICIAL.temas,
      tipo: s.tipo === 'supuestos' ? 'supuestos' : 'test',
      soloNucleo: s.soloNucleo === true,
      cuantas: ([0, ...CUANTAS] as number[]).includes(s.cuantas as number)
        ? (s.cuantas as Cuantas)
        : SELECCION_INICIAL.cuantas,
    }
  } catch {
    return SELECCION_INICIAL
  }
}

export function guardarSeleccion(s: SeleccionMixto): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(s))
  } catch {
    // Sin persistencia: la seleccion vale para esta visita.
  }
}
