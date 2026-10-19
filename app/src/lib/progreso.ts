import { useSyncExternalStore } from 'react'
import { repasar, tarjetaNueva, HOY, type EstadoTarjeta, type Resultado } from './srs'
import { canonico } from './indice'

const CLAVE = 'oposicion-zgz:progreso:v1'

export interface EstadoPregunta {
  intentos: number
  aciertos: number
  fallos: number
  ultimoAcierto: boolean | null
  ultimaRespuesta: string
}

/** Una entrada de la lista de falladas. */
export interface Fallada {
  /** Aciertos seguidos desde el ultimo fallo */
  racha: number
  fallos: number
  /** yyyy-mm-dd en que entro en la lista */
  desde: string
}

export interface Falladas {
  /** Test y supuestos, por id canonico (una pregunta repetida en dos temas va una vez) */
  preguntas: Record<string, Fallada>
  tarjetas: Record<string, Fallada>
}

/** Una fallada sale de la lista al acertarla estas veces seguidas, en cualquier test. */
export const ACIERTOS_PARA_SALIR = 2

export interface Progreso {
  version: 1
  tarjetas: Record<string, EstadoTarjeta>
  preguntas: Record<string, EstadoPregunta>
  racha: { actual: number; mejor: number; ultimoDia: string | null }
  /** yyyy-mm-dd -> numero de items repasados ese dia */
  historial: Record<string, number>
  falladas: Falladas
}

function vacio(): Progreso {
  return {
    version: 1,
    tarjetas: {},
    preguntas: {},
    racha: { actual: 0, mejor: 0, ultimoDia: null },
    historial: {},
    falladas: { preguntas: {}, tarjetas: {} },
  }
}

/**
 * Un progreso anterior a la lista de falladas la estrena con lo que ya se
 * sabe: las preguntas cuya ultima respuesta fue un fallo, y las tarjetas cuyo
 * ultimo repaso fue «Fallo» (el SM-2 las deja con reps a 0).
 */
function sembrarFalladas(p: Progreso): Falladas {
  const falladas: Falladas = { preguntas: {}, tarjetas: {} }
  for (const [id, e] of Object.entries(p.preguntas)) {
    if (e.ultimoAcierto !== false) continue
    const clave = canonico(id)
    const previa = falladas.preguntas[clave]
    falladas.preguntas[clave] = {
      racha: 0,
      fallos: (previa?.fallos ?? 0) + e.fallos,
      desde: e.ultimaRespuesta || HOY(),
    }
  }
  for (const [id, e] of Object.entries(p.tarjetas)) {
    if (e.reps === 0 && e.fallos > 0) {
      falladas.tarjetas[id] = { racha: 0, fallos: e.fallos, desde: e.ultimaRevision || HOY() }
    }
  }
  return falladas
}

function normalizar(datos: Partial<Progreso>): Progreso {
  const p: Progreso = { ...vacio(), ...datos, version: 1 }
  p.falladas = datos.falladas
    ? { preguntas: datos.falladas.preguntas ?? {}, tarjetas: datos.falladas.tarjetas ?? {} }
    : sembrarFalladas(p)
  return p
}

/** Anota una respuesta en una de las dos listas: un fallo entra (o reinicia la racha). */
function anotarFallada(
  lista: Record<string, Fallada>,
  id: string,
  acierto: boolean,
): Record<string, Fallada> {
  const previa = lista[id]
  if (!acierto) {
    return { ...lista, [id]: { racha: 0, fallos: (previa?.fallos ?? 0) + 1, desde: previa?.desde ?? HOY() } }
  }
  if (!previa) return lista
  if (previa.racha + 1 >= ACIERTOS_PARA_SALIR) {
    const resto = { ...lista }
    delete resto[id]
    return resto
  }
  return { ...lista, [id]: { ...previa, racha: previa.racha + 1 } }
}

// El acceso a localStorage puede lanzar (modo privado, cookies bloqueadas,
// captura de miniatura), asi que todo va envuelto y con fallback en memoria.
function leer(): Progreso {
  try {
    const bruto = localStorage.getItem(CLAVE)
    if (!bruto) return vacio()
    return normalizar(JSON.parse(bruto) as Partial<Progreso>)
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
  const falladas = {
    ...p.falladas,
    tarjetas: anotarFallada(p.falladas.tarjetas, canonico(id), resultado !== 'fallo'),
  }
  escribir(anotaActividad({ ...p, tarjetas, falladas }))
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
  const falladas = {
    ...p.falladas,
    preguntas: anotarFallada(p.falladas.preguntas, canonico(id), acierto),
  }
  escribir(anotaActividad({ ...p, preguntas, falladas }))
}

export function estadoTarjeta(id: string): EstadoTarjeta {
  return estado.tarjetas[id] ?? tarjetaNueva()
}

export function reiniciarTodo(): void {
  escribir(vacio())
}

/** Vacia la lista de falladas. El progreso y el repaso espaciado no cambian. */
export function vaciarFalladas(): void {
  escribir({ ...estado, falladas: { preguntas: {}, tarjetas: {} } })
}

export function reiniciarTema(ids: string[]): void {
  const tarjetas = { ...estado.tarjetas }
  const preguntas = { ...estado.preguntas }
  const falladas = {
    preguntas: { ...estado.falladas.preguntas },
    tarjetas: { ...estado.falladas.tarjetas },
  }
  for (const id of ids) {
    delete tarjetas[id]
    delete preguntas[id]
    delete falladas.preguntas[id]
    delete falladas.tarjetas[id]
  }
  escribir({ ...estado, tarjetas, preguntas, falladas })
}

export function exportar(): string {
  return JSON.stringify(estado, null, 2)
}

export function importar(json: string): boolean {
  try {
    const datos = JSON.parse(json) as Partial<Progreso>
    if (typeof datos !== 'object' || datos === null) return false
    escribir(normalizar(datos))
    return true
  } catch {
    return false
  }
}
