import { TEMAS } from '../content'
import { huella } from './indice'
import type { Flashcard, PreguntaTest, Supuesto } from '../types'

/**
 * Test mixto: preguntas de varios temas a la vez, al azar y sin decir de cual
 * es cada una hasta corregirla.
 *
 * Se barajan las PREGUNTAS, nunca sus opciones: hay opciones que se refieren a
 * otras («a) y b) son correctas», «ninguna de las anteriores») y el reparto de
 * letras correctas de cada tema esta compensado a mano.
 */

/** «mixta»: preguntas de test y tarjetas de repaso en la misma sesion */
export type TipoMixto = 'test' | 'supuestos' | 'mixta' | 'tarjetas'

/** Que hacer con lo marcado como nucleo: todo, solo eso, o todo menos eso. */
export type FiltroNucleo = 'todas' | 'solo' | 'sin'

export const pasaNucleo = (filtro: FiltroNucleo, nucleo: boolean | undefined): boolean =>
  filtro === 'todas' || (filtro === 'solo') === !!nucleo

export interface ItemMixto {
  tema: number
  pregunta: PreguntaTest
  /** En los supuestos, el caso al que pertenece: su enunciado se pinta encima */
  supuesto?: Supuesto
  /** Apartado del apunte que la respalda («2.1», «3/Artículo 8»), si se sabe */
  apartado: string | null
}

/** Una tarjeta de repaso dentro de una sesion: se gira y se valora como en el repaso. */
export interface ItemTarjeta {
  tema: number
  tarjeta: Flashcard
  apartado: string | null
}

export type ItemSesion = ItemMixto | ItemTarjeta

export const esTarjeta = (item: ItemSesion): item is ItemTarjeta => 'tarjeta' in item

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

export function apartadoDe(p: { id: string; apartado?: string }, s?: Supuesto): string | null {
  // Las preguntas de un supuesto anterior a la ampliacion las cubre el supuesto entero.
  return p.apartado ?? APARTADO_DE.get(p.id) ?? (s ? APARTADO_DE.get(s.id) : undefined) ?? null
}

/* ---------- Lo que se puede sortear ---------- */

export function temasConTipo(tipo: TipoMixto): number[] {
  return TEMAS.filter((t) =>
    tipo === 'test'
      ? (t.repaso?.test.length ?? 0) > 0
      : tipo === 'mixta'
        ? (t.repaso?.test.length ?? 0) + (t.repaso?.flashcards.length ?? 0) > 0
        : tipo === 'tarjetas'
          ? (t.repaso?.flashcards.length ?? 0) > 0
          : t.numero >= PRIMER_TEMA_SUPUESTOS && (t.repaso?.supuestos.length ?? 0) > 0,
  ).map((t) => t.numero)
}

/**
 * Todo lo de los temas elegidos que pasa el filtro de nucleo, en el orden del
 * dato. Una misma pregunta de examen puede estar en dos temas (t26-q19 y
 * t27-q22, que solo difieren en los puntos finales): en una sesion sale una
 * vez, la del primero. En la sesion mixta, las tarjetas de cada tema van tras
 * sus preguntas: el sorteo ya las mezcla. Los supuestos no tienen nucleo:
 * la pagina los sortea siempre con «todas».
 */
export function disponibles(temas: number[], tipo: TipoMixto, filtro: FiltroNucleo): ItemSesion[] {
  const elegidos = new Set(temas)
  const vistas = new Set<string>()
  const items: ItemSesion[] = []
  const anadir = (item: ItemMixto) => {
    if (!pasaNucleo(filtro, item.pregunta.nucleo)) return
    const h = huella(item.pregunta)
    if (vistas.has(h)) return
    vistas.add(h)
    items.push(item)
  }
  for (const t of TEMAS) {
    if (!elegidos.has(t.numero) || !t.repaso) continue
    if (tipo === 'test' || tipo === 'mixta') {
      for (const p of t.repaso.test) anadir({ tema: t.numero, pregunta: p, apartado: apartadoDe(p) })
    }
    if (tipo === 'mixta' || tipo === 'tarjetas') {
      for (const f of t.repaso.flashcards) {
        if (pasaNucleo(filtro, f.nucleo)) items.push({ tema: t.numero, tarjeta: f, apartado: apartadoDe(f) })
      }
    }
    if (tipo === 'supuestos' && t.numero >= PRIMER_TEMA_SUPUESTOS) {
      for (const s of t.repaso.supuestos) {
        for (const p of s.preguntas) {
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
export function sortear<T>(items: readonly T[], cuantas: Cuantas): T[] {
  const barajadas = barajar(items)
  return cuantas === 0 ? barajadas : barajadas.slice(0, cuantas)
}

/* ---------- La ultima seleccion, en este navegador ---------- */

export interface SeleccionMixto {
  temas: number[]
  tipo: TipoMixto
  nucleo: FiltroNucleo
  cuantas: Cuantas
}

const FILTROS: FiltroNucleo[] = ['todas', 'solo', 'sin']

/** El filtro guardado; una seleccion de antes del selector traia `soloNucleo`. */
export function leerFiltro(s: { nucleo?: unknown; soloNucleo?: unknown }): FiltroNucleo {
  if (FILTROS.includes(s.nucleo as FiltroNucleo)) return s.nucleo as FiltroNucleo
  return s.soloNucleo === true ? 'solo' : 'todas'
}

const CLAVE = 'oposicion-zgz:mixto:v1'

export const SELECCION_INICIAL: SeleccionMixto = {
  temas: TEMAS.map((t) => t.numero),
  tipo: 'test',
  nucleo: 'todas',
  cuantas: 20,
}

// localStorage puede lanzar (modo privado, cookies bloqueadas): todo va envuelto.
export function leerSeleccion(): SeleccionMixto {
  try {
    const bruto = localStorage.getItem(CLAVE)
    if (!bruto) return SELECCION_INICIAL
    const s = JSON.parse(bruto) as Partial<SeleccionMixto> & { soloNucleo?: unknown }
    const validos = new Set(TEMAS.map((t) => t.numero))
    return {
      temas: Array.isArray(s.temas) ? s.temas.filter((n) => validos.has(n)) : SELECCION_INICIAL.temas,
      tipo: s.tipo === 'supuestos' || s.tipo === 'mixta' || s.tipo === 'tarjetas' ? s.tipo : 'test',
      nucleo: leerFiltro(s),
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
