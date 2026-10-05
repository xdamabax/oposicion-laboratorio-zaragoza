import { useMemo } from 'react'
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Figura from './figuras/Figura'
import { remarkQuitarSecciones } from '../editor/secciones'
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
export function comoFigura(src: string, alt: string): TipoFigura | null {
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
// `salto:pagina` es el salto de pagina manual que mete el editor de descarga.
const urlTransform = (url: string) =>
  /^(ghs|bureta|material|esquema|salto):/.test(url) ? url : defaultUrlTransform(url)

/** Texto plano de un nodo del arbol que entrega react-markdown. */
type NodoHast = { type: string; value?: string; children?: NodoHast[] }
const textoDe = (n?: NodoHast): string =>
  !n ? '' : n.type === 'text' ? (n.value ?? '') : (n.children ?? []).map(textoDe).join('')

/**
 * Hasta cuantos caracteres un parrafo cabe seguro en UN renglon del PDF (A4,
 * 11 pt). Medido sobre los 40 temas impresos: el parrafo de dos renglones mas
 * corto tenia 92 caracteres.
 */
const RENGLON_PDF = 90

/**
 * Marcas para la hoja de impresion, que no puede leer el texto:
 *   - md-entrada: acaba en «:» y presenta lo que viene detras (una tabla, una
 *     lista, una formula, una cita, una figura); no se queda solo al pie.
 *   - md-breve: ocupa un solo renglon. Detras de un titulo, titulo y renglon
 *     no bastan para empezar un apartado al pie de una pagina.
 */
function clasesDeParrafo(texto: string, renglon: number): string | undefined {
  const clases = [texto.endsWith(':') && 'md-entrada', texto.length <= renglon && 'md-breve']
  return clases.filter(Boolean).join(' ') || undefined
}

/**
 * Por encima de esta longitud, una fila de tabla ocupa al menos tres renglones
 * en el PDF (medido en las 3253 filas de los 40 temas impresos: ninguna de mas
 * de 250 caracteres bajaba de tres). Una fila asi ya arranca bien la tabla sola.
 */
const FILA_ALTA = 250

/**
 * Los componentes con los umbrales de renglon escalados. `escala` es cuantas
 * veces cabe mas texto por renglon que en el PDF de siempre (A4, 11 pt,
 * margenes normales): la da el editor de descarga cuando se cambia la letra o
 * los margenes. Con 1, los numeros medidos tal cual.
 */
function crearComponentes(escala: number) {
  const renglon = RENGLON_PDF * escala
  const filaAlta = FILA_ALTA * escala
  return {
    p: ({ node, ...props }: React.ComponentProps<'p'> & { node?: NodoHast }) => (
      <p {...props} className={clasesDeParrafo(textoDe(node).trim(), renglon)} />
    ),
    tr: ({ node, ...props }: React.ComponentProps<'tr'> & { node?: NodoHast }) => (
      <tr {...props} className={textoDe(node).length > filaAlta ? 'md-fila-alta' : undefined} />
    ),
    img: ({ src, alt }: React.ComponentProps<'img'>) => {
      // el salto de pagina manual del editor de descarga
      if (src === 'salto:pagina') return <span className="md-salto-pagina" aria-hidden="true" />
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
}

const COMPONENTES = crearComponentes(1)

const SIN_PLUGINS_EXTRA = [remarkGfm]

export default function Markdown({
  children,
  escala = 1,
  ocultas,
}: {
  children: string
  escala?: number
  /** Secciones (titulos de nivel 2) que no se pintan: las del temario preparado */
  ocultas?: readonly string[]
}) {
  const componentes = useMemo(() => (escala === 1 ? COMPONENTES : crearComponentes(escala)), [escala])
  const plugins = useMemo(() => (ocultas?.length ? [remarkGfm, remarkQuitarSecciones(ocultas)] : SIN_PLUGINS_EXTRA), [ocultas])
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={plugins} components={componentes} urlTransform={urlTransform}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
