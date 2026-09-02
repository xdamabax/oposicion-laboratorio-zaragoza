import type { Figura as TipoFigura } from '../../types'
import PictogramaGHS from './PictogramaGHS'
import Bureta from './Bureta'
import MaterialVidrio from './MaterialVidrio'
import Esquema from './Esquema'
import { nombreFigura, nombreNeutro } from './nombres'

/**
 * Punto unico de entrada para las figuras que declaran los apuntes y los JSON
 * de repaso. Los datos no guardan imagenes: guardan que figura quieren y con
 * que parametros, y aqui se decide que componente la dibuja.
 *
 * Toda figura sale rotulada: el nombre va en el atributo `title` del <figure>
 * (se ve al pasar el raton), en el texto alternativo del dibujo y, salvo que la
 * figura sea la propia pregunta, tambien a la vista en el pie.
 */
export default function Figura({
  figura,
  incognita = false,
}: {
  figura: TipoFigura
  /** La figura ES la pregunta: no se puede cantar la respuesta en el rotulo */
  incognita?: boolean
}) {
  const nombre = incognita ? nombreNeutro(figura) : nombreFigura(figura)
  let dibujo: React.ReactNode = null

  switch (figura.tipo) {
    case 'ghs':
      dibujo = <PictogramaGHS tipo={figura.valor} etiqueta={nombre} />
      break
    case 'bureta':
      dibujo = <Bureta lectura={figura.lectura} capacidad={figura.capacidad} etiqueta={nombre} />
      break
    case 'material':
      dibujo = <MaterialVidrio tipo={figura.valor} etiqueta={nombre} />
      break
    case 'esquema':
      dibujo = <Esquema tipo={figura.valor} etiqueta={nombre} />
      break
  }

  // El pie escrito a mano manda sobre el nombre del catalogo.
  const pie = incognita ? figura.pie : (figura.pie ?? nombre)

  return (
    <figure className="figura" title={nombre}>
      {dibujo}
      {pie && <figcaption>{pie}</figcaption>}
    </figure>
  )
}
