export interface TemaOficial {
  /** Numero de tema, 1..40 */
  numero: number
  /** Enunciado literal tal y como aparece en temario.md */
  titulo: string
  /** Parte del temario ("Parte primera") */
  parte: string
  /** Bloque dentro de la parte, si lo hay */
  bloque: string | null
}

export type EstadoApunte = 'sin-apunte' | 'borrador' | 'aprobado'

export interface Apunte {
  numero: number
  titulo: string
  parte: string
  estado: Exclude<EstadoApunte, 'sin-apunte'>
  verificado: string | null
  fuentes: string[]
  /** Cuerpo markdown sin el frontmatter */
  cuerpo: string
}

/* ---------- Figuras ---------- */

export type TipoGHS =
  | 'explosivo'
  | 'inflamable'
  | 'comburente'
  | 'gas-presion'
  | 'corrosivo'
  | 'toxico-agudo'
  | 'irritante'
  | 'peligro-salud'
  | 'medioambiente'

export type TipoMaterial =
  | 'matraz-aforado'
  | 'erlenmeyer'
  | 'pipeta-aforada'
  | 'probeta'
  | 'vaso-precipitados'
  | 'embudo'

/**
 * Figura dibujada por la app. Los JSON de repaso no llevan imagenes sueltas:
 * declaran que figura quieren y con que parametros, y la app la dibuja en SVG.
 */
export type Figura =
  | { tipo: 'ghs'; valor: TipoGHS; pie?: string }
  | { tipo: 'bureta'; lectura: number; capacidad?: number; pie?: string }
  | { tipo: 'material'; valor: TipoMaterial; pie?: string }

/* ---------- Repaso ---------- */

export interface Flashcard {
  id: string
  anverso: string
  reverso: string
  fuente?: string
  etiquetas?: string[]
  /** Alta probabilidad segun los examenes anteriores analizados */
  nucleo?: boolean
  figura?: Figura
}

export interface PreguntaTest {
  id: string
  pregunta: string
  /** 3 opciones en el primer ejercicio; 4 en los supuestos del segundo */
  opciones: string[]
  /** Indice 0-based dentro de `opciones` */
  correcta: number
  explicacion?: string
  fuente?: string
  nucleo?: boolean
  figura?: Figura
}

/** Caso practico del segundo ejercicio: enunciado comun + 5 preguntas de 4 opciones. */
export interface Supuesto {
  id: string
  titulo: string
  enunciado: string
  figura?: Figura
  preguntas: PreguntaTest[]
}

export interface Repaso {
  tema: number
  titulo: string
  generadoDe?: string
  apunteAprobado?: boolean
  fechaGeneracion?: string
  formatoTest?: { ejercicio: string; opcionesPorPregunta: number; fundamento?: string }
  flashcards: Flashcard[]
  /** Primer ejercicio: 3 opciones */
  test: PreguntaTest[]
  /** Segundo ejercicio: supuestos teorico-practicos, 4 opciones */
  supuestos: Supuesto[]
}

/** Vista unificada que consume la UI */
export interface TemaVista {
  numero: number
  titulo: string
  parte: string
  bloque: string | null
  estadoApunte: EstadoApunte
  apunte: Apunte | null
  repaso: Repaso | null
}
