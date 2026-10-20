import { TEMAS } from '../content'
import {
  CUANTAS,
  apartadoDe,
  barajar,
  leerFiltro,
  pasaNucleo,
  type Cuantas,
  type FiltroNucleo,
  type ItemMixto,
  type ItemTarjeta,
} from './mixto'
import type { Falladas } from './progreso'

export type { ItemTarjeta }

/**
 * Test de falladas: lo que se ha fallado en cualquier test (o la tarjeta
 * marcada «Fallo»), hasta acertarlo dos veces seguidas. La lista la lleva
 * lib/progreso.ts; aqui se convierte en preguntas para la sesion.
 */

export type TipoFalladas = 'test' | 'supuestos' | 'tarjetas'

/**
 * Las preguntas falladas de los temas elegidos, en el orden del dato. La lista
 * guarda el id canonico, asi que una pregunta repetida en dos temas sale una
 * vez, la del primero, como en el test mixto. Los supuestos no tienen nucleo:
 * la pagina los sortea siempre con «todas».
 */
export function preguntasFalladas(
  lista: Falladas,
  temas: number[],
  tipo: Exclude<TipoFalladas, 'tarjetas'>,
  nucleo: FiltroNucleo = 'todas',
): ItemMixto[] {
  const elegidos = new Set(temas)
  const items: ItemMixto[] = []
  for (const t of TEMAS) {
    if (!elegidos.has(t.numero) || !t.repaso) continue
    if (tipo === 'test') {
      for (const p of t.repaso.test) {
        if (lista.preguntas[p.id] && pasaNucleo(nucleo, p.nucleo)) {
          items.push({ tema: t.numero, pregunta: p, apartado: apartadoDe(p) })
        }
      }
    } else {
      for (const s of t.repaso.supuestos) {
        for (const p of s.preguntas) {
          if (lista.preguntas[p.id] && pasaNucleo(nucleo, p.nucleo)) {
            items.push({ tema: t.numero, pregunta: p, supuesto: s, apartado: apartadoDe(p, s) })
          }
        }
      }
    }
  }
  return items
}

export function tarjetasFalladas(
  lista: Falladas,
  temas: number[],
  nucleo: FiltroNucleo = 'todas',
): ItemTarjeta[] {
  const elegidos = new Set(temas)
  const items: ItemTarjeta[] = []
  for (const t of TEMAS) {
    if (!elegidos.has(t.numero) || !t.repaso) continue
    for (const f of t.repaso.flashcards) {
      if (lista.tarjetas[f.id] && pasaNucleo(nucleo, f.nucleo)) {
        items.push({ tema: t.numero, tarjeta: f, apartado: apartadoDe(f) })
      }
    }
  }
  return items
}

/** Las `cuantas` (0 = todas) sacadas al azar, ya en orden aleatorio. */
export function sortearDe<T>(items: readonly T[], cuantas: Cuantas): T[] {
  const barajadas = barajar(items)
  return cuantas === 0 ? barajadas : barajadas.slice(0, cuantas)
}

/* ---------- La ultima seleccion, en este navegador ---------- */

export interface SeleccionFalladas {
  temas: number[]
  tipo: TipoFalladas
  nucleo: FiltroNucleo
  cuantas: Cuantas
}

const CLAVE = 'oposicion-zgz:falladas:v1'

export const SELECCION_INICIAL: SeleccionFalladas = {
  temas: TEMAS.map((t) => t.numero),
  tipo: 'test',
  nucleo: 'todas',
  cuantas: 20,
}

// localStorage puede lanzar (modo privado, cookies bloqueadas): todo va envuelto.
export function leerSeleccion(): SeleccionFalladas {
  try {
    const bruto = localStorage.getItem(CLAVE)
    if (!bruto) return SELECCION_INICIAL
    const s = JSON.parse(bruto) as Partial<SeleccionFalladas>
    const validos = new Set(TEMAS.map((t) => t.numero))
    return {
      temas: Array.isArray(s.temas) ? s.temas.filter((n) => validos.has(n)) : SELECCION_INICIAL.temas,
      tipo: s.tipo === 'supuestos' || s.tipo === 'tarjetas' ? s.tipo : 'test',
      nucleo: leerFiltro(s),
      cuantas: ([0, ...CUANTAS] as number[]).includes(s.cuantas as number)
        ? (s.cuantas as Cuantas)
        : SELECCION_INICIAL.cuantas,
    }
  } catch {
    return SELECCION_INICIAL
  }
}

export function guardarSeleccion(s: SeleccionFalladas): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(s))
  } catch {
    // Sin persistencia: la seleccion vale para esta visita.
  }
}
