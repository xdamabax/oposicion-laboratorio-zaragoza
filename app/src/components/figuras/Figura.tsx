import type { Figura as TipoFigura } from '../../types'
import PictogramaGHS from './PictogramaGHS'
import Bureta from './Bureta'
import MaterialVidrio from './MaterialVidrio'

/**
 * Punto unico de entrada para las figuras que declaran los JSON de repaso.
 * Los datos no guardan imagenes: guardan que figura quieren y con que
 * parametros, y aqui se decide que componente la dibuja.
 */
export default function Figura({ figura }: { figura: TipoFigura }) {
  let dibujo: React.ReactNode = null

  switch (figura.tipo) {
    case 'ghs':
      dibujo = <PictogramaGHS tipo={figura.valor} />
      break
    case 'bureta':
      dibujo = <Bureta lectura={figura.lectura} capacidad={figura.capacidad} />
      break
    case 'material':
      dibujo = <MaterialVidrio tipo={figura.valor} />
      break
  }

  return (
    <figure className="figura">
      {dibujo}
      {figura.pie && <figcaption>{figura.pie}</figcaption>}
    </figure>
  )
}
