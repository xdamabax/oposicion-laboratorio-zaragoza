/**
 * Lo que el editor de descarga guarda en este navegador (localStorage).
 *
 * Tres cosas, por separado:
 *   - la edicion de cada tema, SOLO si tiene cambios. Es Markdown, como el
 *     apunte, y lleva la huella del original sobre el que se hizo: si el apunte
 *     se actualiza despues, el editor lo avisa;
 *   - las opciones de cada tema (letra, margenes, secciones, fuentes);
 *   - la descarga en curso: lo que hay que imprimir ahora mismo, ya con las
 *     secciones quitadas. La lee la vista de impresion (en otra pestaña, o en
 *     el marco de la vista previa), que es la misma de siempre.
 *
 * El apunte de la app no se toca nunca: estudiar sigue mostrando el original.
 * localStorage puede lanzar (modo privado, sin espacio): cada acceso va con
 * try/catch y la escritura devuelve el error para poder decirlo en pantalla.
 */

export type Letra = 10 | 11 | 12
export type Margenes = 'estrechos' | 'normales' | 'anchos'

export interface OpcionesDescarga {
  letra: Letra
  margenes: Margenes
  /** Titulos de las secciones (nivel 2) que no salen en la descarga */
  ocultas: string[]
  /** Si sale el recuadro de fuentes del final */
  fuentes: boolean
}

export const OPCIONES_POR_DEFECTO: OpcionesDescarga = { letra: 11, margenes: 'normales', ocultas: [], fuentes: true }

/** Margenes de la hoja, en mm: arriba y abajo, y a los lados. Los normales son los de siempre. */
export const MARGENES_MM: Record<Margenes, { vertical: number; lateral: number }> = {
  estrechos: { vertical: 12, lateral: 12 },
  normales: { vertical: 18, lateral: 16 },
  anchos: { vertical: 25, lateral: 25 },
}

/**
 * Cuanto texto mas cabe por renglon que en el PDF de siempre (A4 de 210 mm,
 * 11 pt, margenes normales). Escala los umbrales de Markdown.tsx que deciden
 * que parrafo ocupa un renglon y que fila de tabla es alta.
 */
export function escalaRenglon(o: Pick<OpcionesDescarga, 'letra' | 'margenes'>): number {
  const ancho = (m: Margenes) => 210 - 2 * MARGENES_MM[m].lateral
  return (ancho(o.margenes) / ancho('normales')) * (11 / o.letra)
}

export interface Edicion {
  md: string
  /** Huella del apunte original sobre el que se edito */
  base: string
  /** ISO de la ultima vez que se guardo */
  guardado: string
}

export interface Descarga {
  tema: number
  md: string
  opciones: OpcionesDescarga
}

const claveEdicion = (n: number) => `descarga:edicion:${n}`
const claveOpciones = (n: number) => `descarga:opciones:${n}`
const CLAVE_DESCARGA = 'descarga:actual'

/** Huella corta de un texto (FNV-1a de 32 bits), para saber si el original cambio. */
export function huella(texto: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return `${(h >>> 0).toString(16)}-${texto.length}`
}

function leer<T>(clave: string): T | null {
  try {
    const bruto = localStorage.getItem(clave)
    return bruto ? (JSON.parse(bruto) as T) : null
  } catch {
    return null
  }
}

/** null si se guardo; si no, el motivo, para enseñarlo. */
function escribir(clave: string, valor: unknown): string | null {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
    return null
  } catch (e) {
    return e instanceof DOMException && e.name === 'QuotaExceededError'
      ? 'el navegador no tiene más espacio para esta web'
      : 'el navegador no deja guardar (¿modo privado?)'
  }
}

function borrar(clave: string) {
  try {
    localStorage.removeItem(clave)
  } catch {
    // nada que hacer: si no se puede leer, tampoco hay nada guardado
  }
}

export const leerEdicion = (n: number) => leer<Edicion>(claveEdicion(n))
export const guardarEdicion = (n: number, e: Edicion) => escribir(claveEdicion(n), e)
export const borrarEdicion = (n: number) => borrar(claveEdicion(n))

export function leerOpciones(n: number): OpcionesDescarga {
  return { ...OPCIONES_POR_DEFECTO, ...(leer<Partial<OpcionesDescarga>>(claveOpciones(n)) ?? {}) }
}
export const guardarOpciones = (n: number, o: OpcionesDescarga) => escribir(claveOpciones(n), o)

export const leerDescarga = () => leer<Descarga>(CLAVE_DESCARGA)
export const guardarDescarga = (d: Descarga) => escribir(CLAVE_DESCARGA, d)
export const CLAVE_DE_LA_DESCARGA = CLAVE_DESCARGA

/* ---------- temario completo ---------- */

/**
 * El temario completo no tiene editor propio: junta la version de cada tema
 * (su edicion, si la hay, con las secciones que se quitaron en su editor) y
 * aqui solo se guarda lo que es del documento entero.
 */
export interface OpcionesTemario {
  letra: Letra
  margenes: Margenes
  /** Recuadro de fuentes al final de cada tema */
  fuentes: boolean
  portada: boolean
  indice: boolean
  titulo: string
  subtitulo: string
  /** Temas que no entran */
  excluidos: number[]
}

export const OPCIONES_TEMARIO_POR_DEFECTO: OpcionesTemario = {
  letra: 11,
  margenes: 'normales',
  fuentes: true,
  portada: true,
  indice: true,
  titulo: 'Técnica/o Auxiliar de Laboratorio',
  subtitulo: 'Apuntes del temario completo',
  excluidos: [],
}

export const CLAVE_TEMARIO = 'descarga:temario'

export function leerOpcionesTemario(): OpcionesTemario {
  return { ...OPCIONES_TEMARIO_POR_DEFECTO, ...(leer<Partial<OpcionesTemario>>(CLAVE_TEMARIO) ?? {}) }
}
export const guardarOpcionesTemario = (o: OpcionesTemario) => escribir(CLAVE_TEMARIO, o)

/** La version de un tema que entra en el temario completo. */
export function versionDelTema(n: number, original: string) {
  const edicion = leerEdicion(n)
  const opciones = leer<Partial<OpcionesDescarga>>(claveOpciones(n))
  return {
    md: edicion?.md ?? original,
    ocultas: opciones?.ocultas ?? [],
    editado: !!edicion,
    /** La edicion se hizo sobre un apunte que despues cambio */
    desactualizado: !!edicion && edicion.base !== huella(original),
  }
}

/* ---------- cuestionario ---------- */

export interface OpcionesCuestionario {
  letra: Letra
  margenes: Margenes
  /** Preguntas que no entran (por id). Un supuesto sin preguntas no sale. */
  excluidas: string[]
  /** Orden del primer ejercicio. Los supuestos conservan el suyo: sus preguntas se encadenan. */
  orden: 'original' | 'barajado'
  barajarOpciones: boolean
  /** Semilla del barajado: el mismo barajado en el PDF y en el Word, y al volver */
  semilla: number
  soluciones: boolean
  explicaciones: boolean
  fuentes: boolean
}

export const OPCIONES_CUESTIONARIO_POR_DEFECTO: OpcionesCuestionario = {
  letra: 11,
  margenes: 'normales',
  excluidas: [],
  orden: 'original',
  barajarOpciones: false,
  semilla: 1,
  soluciones: true,
  explicaciones: true,
  fuentes: true,
}

export const claveCuestionario = (n: number) => `descarga:cuestionario:${n}`

export function leerOpcionesCuestionario(n: number): OpcionesCuestionario {
  return { ...OPCIONES_CUESTIONARIO_POR_DEFECTO, ...(leer<Partial<OpcionesCuestionario>>(claveCuestionario(n)) ?? {}) }
}
export const guardarOpcionesCuestionario = (n: number, o: OpcionesCuestionario) => escribir(claveCuestionario(n), o)
