import { useSyncExternalStore } from 'react'
import { repasar, tarjetaNueva, HOY, type EstadoTarjeta, type Resultado } from './srs'

const CLAVE = 'oposicion-zgz:progreso:v1'

export interface EstadoPregunta {
  intentos: number
  aciertos: number
  fallos: number
  ultimoAcierto: boolean | null
  ultimaRespuesta: string
}

export interface Progreso {
  version: 1
  tarjetas: Record<string, EstadoTarjeta>
  preguntas: Record<string, EstadoPregunta>
  racha: { actual: number; mejor: number; ultimoDia: string | null }
  /** yyyy-mm-dd -> numero de items repasados ese dia */
  historial: Record<string, number>
}

function vacio(): Progreso {
  return {
    version: 1,
    tarjetas: {},
    preguntas: {},
    racha: { actual: 0, mejor: 0, ultimoDia: null },
    historial: {},
  }
}

// El acceso a localStorage puede lanzar (modo privado, cookies bloqueadas,
// captura de miniatura), asi que todo va envuelto y con fallback en memoria.
function leer(): Progreso {
  try {
    const bruto = localStorage.getItem(CLAVE)
    if (!bruto) return vacio()
    const datos = JSON.parse(bruto) as Progreso
    return { ...vacio(), ...datos, version: 1 }
  } catch {
    return vacio()
  }
}

let estado: Progreso = leer()
const oyentes = new Set<() => void>()

function escribir(nuevo: Progreso): void {
  estado = nuevo
  try {
    localStorage.setItem(CLAVE, JSON.stringify(nuevo))
  } catch {
    // Sin persistencia: la sesion sigue funcionando en memoria.
  }
  oyentes.forEach((fn) => fn())
}

function suscribir(fn: () => void): () => void {
  oyentes.add(fn)
  return () => oyentes.delete(fn)
}

export function useProgreso(): Progreso {
  return useSyncExternalStore(
    suscribir,
    () => estado,
    () => estado,
  )
}

export function getProgreso(): Progreso {
  return estado
}

function anotaActividad(p: Progreso): Progreso {
  const hoy = HOY()
  const historial = { ...p.historial, [hoy]: (p.historial[hoy] ?? 0) + 1 }

  if (p.racha.ultimoDia === hoy) return { ...p, historial }

  const ayer = new Date(`${hoy}T00:00:00`)
  ayer.setDate(ayer.getDate() - 1)
  const fueAyer = p.racha.ultimoDia === ayer.toISOString().slice(0, 10)
  const actual = fueAyer ? p.racha.actual + 1 : 1

  return {
    ...p,
    historial,
    racha: { actual, mejor: Math.max(actual, p.racha.mejor), ultimoDia: hoy },
  }
}

export function registrarTarjeta(id: string, resultado: Resultado): void {
  const p = estado
  const tarjetas = { ...p.tarjetas, [id]: repasar(p.tarjetas[id], resultado) }
  escribir(anotaActividad({ ...p, tarjetas }))
}

export function registrarPregunta(id: string, acierto: boolean): void {
  const p = estado
  const previo = p.preguntas[id] ?? {
    intentos: 0,
    aciertos: 0,
    fallos: 0,
    ultimoAcierto: null,
    ultimaRespuesta: '',
  }
  const preguntas = {
    ...p.preguntas,
    [id]: {
      intentos: previo.intentos + 1,
      aciertos: previo.aciertos + (acierto ? 1 : 0),
      fallos: previo.fallos + (acierto ? 0 : 1),
      ultimoAcierto: acierto,
      ultimaRespuesta: HOY(),
    },
  }
  escribir(anotaActividad({ ...p, preguntas }))
}

export function estadoTarjeta(id: string): EstadoTarjeta {
  return estado.tarjetas[id] ?? tarjetaNueva()
}

export function reiniciarTodo(): void {
  escribir(vacio())
}

export function reiniciarTema(ids: string[]): void {
  const tarjetas = { ...estado.tarjetas }
  const preguntas = { ...estado.preguntas }
  for (const id of ids) {
    delete tarjetas[id]
    delete preguntas[id]
  }
  escribir({ ...estado, tarjetas, preguntas })
}

export function exportar(): string {
  return JSON.stringify(estado, null, 2)
}

export function importar(json: string): boolean {
  try {
    const datos = JSON.parse(json) as Progreso
    if (typeof datos !== 'object' || datos === null) return false
    escribir({ ...vacio(), ...datos, version: 1 })
    return true
  } catch {
    return false
  }
}
