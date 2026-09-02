import type { TipoGHS } from '../../types'

import explosivo from '../../assets/ghs/explosivo.svg'
import inflamable from '../../assets/ghs/inflamable.svg'
import comburente from '../../assets/ghs/comburente.svg'
import gasPresion from '../../assets/ghs/gas-presion.svg'
import corrosivo from '../../assets/ghs/corrosivo.svg'
import toxicoAgudo from '../../assets/ghs/toxico-agudo.svg'
import irritante from '../../assets/ghs/irritante.svg'
import peligroSalud from '../../assets/ghs/peligro-salud.svg'
import medioambiente from '../../assets/ghs/medioambiente.svg'

/**
 * Los nueve pictogramas de peligro del sistema CLP, en su version oficial
 * (Reglamento (CE) 1272/2008, anexo V). Son los SVG normalizados, no dibujos
 * propios: lo que se ve aqui es lo mismo que se ve en una etiqueta real.
 */

const IMAGENES: Record<TipoGHS, string> = {
  explosivo,
  inflamable,
  comburente,
  'gas-presion': gasPresion,
  corrosivo,
  'toxico-agudo': toxicoAgudo,
  irritante,
  'peligro-salud': peligroSalud,
  medioambiente,
}

export const NOMBRES_GHS: Record<TipoGHS, string> = {
  explosivo: 'Explosivo',
  inflamable: 'Inflamable',
  comburente: 'Comburente',
  'gas-presion': 'Gas a presión',
  corrosivo: 'Corrosivo',
  'toxico-agudo': 'Toxicidad aguda',
  irritante: 'Irritante / nocivo',
  'peligro-salud': 'Peligro grave para la salud',
  medioambiente: 'Peligro para el medio ambiente',
}

export const CODIGOS_GHS: Record<TipoGHS, string> = {
  explosivo: 'GHS01',
  inflamable: 'GHS02',
  comburente: 'GHS03',
  'gas-presion': 'GHS04',
  corrosivo: 'GHS05',
  'toxico-agudo': 'GHS06',
  irritante: 'GHS07',
  'peligro-salud': 'GHS08',
  medioambiente: 'GHS09',
}

/** Clases de peligro que cubre cada rombo, para el reverso de las tarjetas. */
export const ALCANCE_GHS: Record<TipoGHS, string> = {
  explosivo: 'Explosivos, autorreactivos y peróxidos orgánicos de los tipos A y B.',
  inflamable:
    'Gases, aerosoles, líquidos y sólidos inflamables; sustancias pirofóricas, autocalentables y que desprenden gases inflamables en contacto con el agua.',
  comburente: 'Gases, líquidos y sólidos comburentes.',
  'gas-presion': 'Gases comprimidos, licuados, licuados refrigerados y disueltos.',
  corrosivo: 'Corrosión cutánea, lesiones oculares graves y corrosivos para los metales.',
  'toxico-agudo': 'Toxicidad aguda por vía oral, cutánea o inhalatoria, categorías 1 a 3.',
  irritante:
    'Toxicidad aguda categoría 4, irritación cutánea u ocular, sensibilización cutánea, toxicidad específica en órganos por exposición única (categoría 3) y peligro para la capa de ozono.',
  'peligro-salud':
    'Sensibilización respiratoria, mutagenicidad, carcinogenicidad, toxicidad para la reproducción, toxicidad específica en órganos y peligro por aspiración.',
  medioambiente: 'Peligro para el medio ambiente acuático, agudo y crónico.',
}

export default function PictogramaGHS({
  tipo,
  tamano = 120,
  etiqueta,
}: {
  tipo: TipoGHS
  tamano?: number
  /** Nombre accesible; por defecto, el codigo y el nombre del pictograma */
  etiqueta?: string
}) {
  return (
    <img
      src={IMAGENES[tipo]}
      width={tamano}
      height={tamano}
      alt={etiqueta ?? `Pictograma ${CODIGOS_GHS[tipo]}: ${NOMBRES_GHS[tipo]}`}
      className="figura-ghs"
      // Sin loading="lazy" a proposito. Son nueve SVG de pocos kB, cacheados,
      // y la carga diferida no se pide nunca cuando no hay viewport: al
      // imprimir salian en blanco. Lo que se ahorraba no compensa.
      decoding="async"
    />
  )
}
