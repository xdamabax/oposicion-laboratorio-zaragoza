import { TEMARIO, PARTES, TEMARIO_PENDIENTE } from './temario'
import { APUNTES } from './apuntes'
import { REPASOS } from './repaso'
import type { TemaVista } from '../types'

export { PARTES, TEMARIO_PENDIENTE }

export const TEMAS: TemaVista[] = TEMARIO.map((t) => {
  const apunte = APUNTES.get(t.numero) ?? null
  const repaso = REPASOS.get(t.numero) ?? null
  return {
    numero: t.numero,
    titulo: t.titulo,
    parte: t.parte,
    bloque: t.bloque,
    estadoApunte: apunte ? apunte.estado : 'sin-apunte',
    apunte,
    repaso,
  }
})

export function getTema(numero: number): TemaVista | undefined {
  return TEMAS.find((t) => t.numero === numero)
}

export const TOTAL_TARJETAS = TEMAS.reduce((n, t) => n + (t.repaso?.flashcards.length ?? 0), 0)
export const TOTAL_PREGUNTAS = TEMAS.reduce(
  (n, t) =>
    n +
    (t.repaso?.test.length ?? 0) +
    (t.repaso?.supuestos.reduce((m, s) => m + s.preguntas.length, 0) ?? 0),
  0,
)
export const TOTAL_NUCLEO = TEMAS.reduce(
  (n, t) => n + (t.repaso?.flashcards.filter((f) => f.nucleo).length ?? 0),
  0,
)
