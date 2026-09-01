export interface TemaOficial {
  /** Numero de tema, 1..40 */
  numero: number
  /** Enunciado literal tal y como aparece en temario.md */
  titulo: string
  /** Parte del temario ("Parte primera. Materias comunes") */
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

export interface Flashcard {
  id: string
  anverso: string
  reverso: string
  fuente?: string
  etiquetas?: string[]
}

export interface PreguntaTest {
  id: string
  pregunta: string
  opciones: string[]
  /** Indice 0-based dentro de `opciones` */
  correcta: number
  explicacion?: string
  fuente?: string
}

export interface Repaso {
  tema: number
  titulo: string
  generadoDe?: string
  apunteAprobado?: boolean
  fechaGeneracion?: string
  flashcards: Flashcard[]
  test: PreguntaTest[]
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
