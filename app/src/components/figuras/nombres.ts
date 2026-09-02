import type { Figura } from '../../types'
import { CODIGOS_GHS, NOMBRES_GHS } from './PictogramaGHS'
import { NOMBRES_MATERIAL } from './MaterialVidrio'
import { NOMBRES_ESQUEMA } from './Esquema'

/**
 * El nombre de cada figura, deducido de su propia declaracion.
 *
 * Los datos no guardan el nombre: guardan que figura quieren ({ tipo, valor }),
 * y el nombre sale de aqui. Asi una figura ya escrita en un apunte o en un JSON
 * gana el rotulo sin tocar el dato, y el catalogo, el apunte y la tarjeta la
 * llaman siempre igual.
 */

/** Numero con coma decimal, como se escribe en castellano. */
const conComa = (n: number) => String(n).replace('.', ',')

/** Capacidad por defecto de la bureta; la misma que asume el dibujo. */
const CAPACIDAD_BURETA = 25

export function nombreFigura(figura: Figura): string {
  switch (figura.tipo) {
    case 'ghs':
      return `${CODIGOS_GHS[figura.valor]} · ${NOMBRES_GHS[figura.valor]}`
    case 'material':
      return NOMBRES_MATERIAL[figura.valor]
    case 'esquema':
      return NOMBRES_ESQUEMA[figura.valor]
    case 'bureta':
      return `Bureta de ${conComa(figura.capacidad ?? CAPACIDAD_BURETA)} mL, menisco en ${conComa(
        figura.lectura,
      )} mL`
  }
}

/**
 * Nombre neutro, para cuando la figura ES la pregunta.
 *
 * Dice de que clase de figura se trata, pero no la respuesta: si la tarjeta
 * pregunta que pictograma es, el rotulo no puede decir "Corrosivo" ni en el
 * pie ni en el texto alternativo.
 */
export function nombreNeutro(figura: Figura): string {
  switch (figura.tipo) {
    case 'ghs':
      return 'Pictograma de peligro CLP'
    case 'material':
      return 'Material de laboratorio'
    case 'esquema':
      return 'Esquema de instrumento o de curva'
    case 'bureta':
      // la capacidad se lee en el propio dibujo; la lectura es la respuesta
      return `Bureta de ${conComa(figura.capacidad ?? CAPACIDAD_BURETA)} mL`
  }
}
