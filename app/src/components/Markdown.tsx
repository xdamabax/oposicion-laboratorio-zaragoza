import ReactMarkdown, { defaultUrlTransform } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Figura from './figuras/Figura'
import type { Figura as TipoFigura, TipoEsquema, TipoGHS, TipoMaterial } from '../types'

/**
 * Un apunte puede insertar una figura con la sintaxis normal de imagen de
 * markdown, usando un esquema propio en lugar de una URL:
 *
 *   ![Corrosivo](ghs:corrosivo)
 *   ![Bureta](bureta:12.5)        ![Bureta de 50](bureta:12.5/50)
 *   ![Matraz aforado](material:matraz-aforado)
 *   ![Electrodo de vidrio](esquema:electrodo-vidrio)
 *
 * Asi el markdown sigue siendo markdown (y se exporta a PDF sin romperse),
 * pero en la app lo dibuja el componente correspondiente.
 */
function comoFigura(src: string, alt: string): TipoFigura | null {
  const pie = alt || undefined

  const ghs = /^ghs:(.+)$/.exec(src)
  if (ghs) return { tipo: 'ghs', valor: ghs[1] as TipoGHS, pie }

  const material = /^material:(.+)$/.exec(src)
  if (material) return { tipo: 'material', valor: material[1] as TipoMaterial, pie }

  const esquema = /^esquema:(.+)$/.exec(src)
  if (esquema) return { tipo: 'esquema', valor: esquema[1] as TipoEsquema, pie }

  const bureta = /^bureta:([\d.]+)(?:\/([\d.]+))?$/.exec(src)
  if (bureta) {
    return {
      tipo: 'bureta',
      lectura: Number(bureta[1]),
      capacidad: bureta[2] ? Number(bureta[2]) : undefined,
      pie,
    }
  }

  return null
}

// react-markdown sanea las URL y se comeria nuestros esquemas propios.
const urlTransform = (url: string) =>
  /^(ghs|bureta|material|esquema):/.test(url) ? url : defaultUrlTransform(url)

const componentes = {
  img: ({ src, alt }: React.ComponentProps<'img'>) => {
    const figura = typeof src === 'string' ? comoFigura(src, alt ?? '') : null
    if (figura) return <Figura figura={figura} />
    return <img src={src} alt={alt ?? ''} />
  },
  // Las tablas de normativa suelen ser anchas: van dentro de su propio scroll.
  table: (props: React.ComponentProps<'table'>) => (
    <div className="md-tabla">
      <table {...props} />
    </div>
  ),
  a: (props: React.ComponentProps<'a'>) => <a {...props} target="_blank" rel="noreferrer" />,
}

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={componentes} urlTransform={urlTransform}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
