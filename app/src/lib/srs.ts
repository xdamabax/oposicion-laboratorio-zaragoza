export type Resultado = 'fallo' | 'bien' | 'facil'

export interface EstadoTarjeta {
  reps: number
  aciertos: number
  fallos: number
  /** Factor de facilidad estilo SM-2 */
  facilidad: number
  /** Intervalo en dias hasta la proxima revision */
  intervalo: number
  /** ISO yyyy-mm-dd */
  proximaRevision: string
  ultimaRevision: string
}

export const HOY = (): string => new Date().toISOString().slice(0, 10)

export function sumaDias(iso: string, dias: number): string {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}

export function tarjetaNueva(): EstadoTarjeta {
  return {
    reps: 0,
    aciertos: 0,
    fallos: 0,
    facilidad: 2.5,
    intervalo: 0,
    proximaRevision: HOY(),
    ultimaRevision: '',
  }
}

/** Repeticion espaciada SM-2 simplificada a tres botones. */
export function repasar(previo: EstadoTarjeta | undefined, resultado: Resultado): EstadoTarjeta {
  const e = previo ?? tarjetaNueva()
  const hoy = HOY()

  let { reps, facilidad, intervalo } = e

  if (resultado === 'fallo') {
    reps = 0
    facilidad = Math.max(1.3, facilidad - 0.2)
    intervalo = 0
  } else if (resultado === 'bien') {
    reps += 1
    intervalo = reps === 1 ? 1 : reps === 2 ? 3 : Math.max(1, Math.round(intervalo * facilidad))
  } else {
    reps += 1
    facilidad = Math.min(3.2, facilidad + 0.15)
    intervalo = reps === 1 ? 3 : Math.max(2, Math.round(intervalo * facilidad * 1.3))
  }

  return {
    reps,
    facilidad,
    intervalo,
    aciertos: e.aciertos + (resultado === 'fallo' ? 0 : 1),
    fallos: e.fallos + (resultado === 'fallo' ? 1 : 0),
    proximaRevision: sumaDias(hoy, intervalo),
    ultimaRevision: hoy,
  }
}

export function tocaHoy(e: EstadoTarjeta | undefined): boolean {
  if (!e) return true
  return e.proximaRevision <= HOY()
}

/** 0..1. Una tarjeta se considera consolidada a partir de un intervalo de 21 dias. */
export function dominio(e: EstadoTarjeta | undefined): number {
  if (!e || e.reps === 0) return 0
  return Math.min(1, e.intervalo / 21)
}
