import { useSyncExternalStore } from 'react'

export type Tema = 'sistema' | 'claro' | 'oscuro'

const CLAVE = 'oposicion-zgz:tema'

function leer(): Tema {
  try {
    const v = localStorage.getItem(CLAVE)
    if (v === 'claro' || v === 'oscuro' || v === 'sistema') return v
  } catch {
    // localStorage puede lanzar (modo privado, cookies bloqueadas).
  }
  return 'sistema'
}

let actual: Tema = leer()
const oyentes = new Set<() => void>()

/**
 * El CSS resuelve el tema asi:
 *   - sin atributo  -> manda la preferencia del sistema (prefers-color-scheme)
 *   - data-tema="claro" u "oscuro" -> manda la eleccion del usuario
 */
function aplicar(t: Tema): void {
  const raiz = document.documentElement
  if (t === 'sistema') raiz.removeAttribute('data-tema')
  else raiz.setAttribute('data-tema', t)
}

/** Se llama una vez antes del primer render para evitar el parpadeo. */
export function iniciarTema(): void {
  aplicar(actual)
}

export function setTema(t: Tema): void {
  actual = t
  aplicar(t)
  try {
    localStorage.setItem(CLAVE, t)
  } catch {
    // Sin persistencia: el tema vale para esta sesion.
  }
  oyentes.forEach((fn) => fn())
}

export function useTema(): Tema {
  return useSyncExternalStore(
    (fn) => {
      oyentes.add(fn)
      return () => oyentes.delete(fn)
    },
    () => actual,
    () => actual,
  )
}

/** Lo que se esta viendo de hecho, resolviendo 'sistema'. */
export function temaEfectivo(t: Tema): 'claro' | 'oscuro' {
  if (t !== 'sistema') return t
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
  } catch {
    return 'claro'
  }
}
