import type { TipoGHS } from '../../types'

/**
 * Pictogramas de peligro del SGA/CLP, dibujados en SVG dentro de la app.
 *
 * Son representaciones ESQUEMATICAS con fines de estudio: reproducen la forma
 * (rombo rojo sobre fondo blanco) y el simbolo reconocible de cada clase, pero
 * no son la reproduccion exacta de los simbolos normalizados del Reglamento
 * (CE) 1272/2008. Para identificar el pictograma en el examen basta con esto;
 * para trabajar con etiquetas reales, usa siempre la etiqueta original.
 */

export const NOMBRES_GHS: Record<TipoGHS, string> = {
  inflamable: 'Inflamable',
  comburente: 'Comburente',
  'gas-presion': 'Gas a presión',
  corrosivo: 'Corrosivo',
  'toxico-agudo': 'Toxicidad aguda',
  irritante: 'Irritante / nocivo',
  'peligro-salud': 'Peligro grave para la salud',
  medioambiente: 'Peligro para el medio ambiente',
}

/** Codigo de indicacion de peligro con el que suele identificarse cada rombo. */
export const CODIGOS_GHS: Record<TipoGHS, string> = {
  inflamable: 'GHS02',
  comburente: 'GHS03',
  'gas-presion': 'GHS04',
  corrosivo: 'GHS05',
  'toxico-agudo': 'GHS06',
  irritante: 'GHS07',
  'peligro-salud': 'GHS08',
  medioambiente: 'GHS09',
}

/** Estrella de n puntas usada en el pictograma de peligro para la salud. */
function estrella(cx: number, cy: number, puntas: number, rExt: number, rInt: number): string {
  const p: string[] = []
  for (let i = 0; i < puntas * 2; i++) {
    const r = i % 2 === 0 ? rExt : rInt
    const a = (Math.PI / puntas) * i - Math.PI / 2
    p.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`)
  }
  return p.join(' ')
}

const LLAMA_GRANDE =
  'M50 24 C55 34 63 40 63 50 C63 60 57 68 50 68 C43 68 37 60 37 50 C37 44 40 41 44 37 C45 43 48 45 49 42 C51 36 48 29 50 24 Z'

const LLAMA_PEQUENA =
  'M50 20 C53 26 59 30 59 36 C59 42 55 46 50 46 C45 46 41 42 41 36 C41 32 43 30 46 27 C47 31 49 32 50 30 C51 26 49 23 50 20 Z'

function Simbolo({ tipo }: { tipo: TipoGHS }) {
  switch (tipo) {
    case 'inflamable':
      return (
        <>
          <path d={LLAMA_GRANDE} />
          <rect x="30" y="71" width="40" height="4" rx="1" />
        </>
      )

    case 'comburente':
      return (
        <>
          <path d={LLAMA_PEQUENA} />
          <circle cx="50" cy="62" r="13" />
          <rect x="30" y="79" width="40" height="4" rx="1" />
        </>
      )

    case 'gas-presion':
      return (
        <g transform="rotate(-12 50 50)">
          <rect x="41" y="30" width="18" height="44" rx="9" />
          <rect x="46" y="23" width="8" height="9" />
          <rect x="43" y="19" width="14" height="5" rx="2" />
          <rect x="41" y="44" width="18" height="3" fill="#fff" />
        </g>
      )

    case 'corrosivo':
      return (
        <>
          {/* superficie corroida, a la izquierda */}
          <path d="M20 64 h10 l3 5 l3 -5 h9 v7 h-25 z" />
          <g transform="rotate(-30 30 40)">
            <rect x="25" y="24" width="9" height="21" rx="2" />
          </g>
          <circle cx="30" cy="54" r="2" />
          <circle cx="33" cy="59" r="1.6" />
          {/* mano, a la derecha */}
          <path d="M55 63 c0 -4 3 -6 7 -6 h13 c3 0 5 2 5 5 v5 c0 3 -2 5 -5 5 h-15 c-3 0 -5 -2 -5 -5 z" />
          <path d="M55 63 l-6 -5 l3 -4 l7 4 z" />
          <g transform="rotate(-30 62 40)">
            <rect x="57" y="24" width="9" height="21" rx="2" />
          </g>
          <circle cx="62" cy="52" r="2" />
          <circle cx="65" cy="57" r="1.6" />
        </>
      )

    case 'toxico-agudo':
      return (
        <>
          <g stroke="#000" strokeWidth="7" strokeLinecap="round">
            <line x1="29" y1="70" x2="71" y2="42" />
            <line x1="29" y1="42" x2="71" y2="70" />
          </g>
          <circle cx="29" cy="42" r="4" />
          <circle cx="71" cy="42" r="4" />
          <circle cx="29" cy="70" r="4" />
          <circle cx="71" cy="70" r="4" />
          {/* halo blanco para despegar la calavera de los huesos */}
          <circle cx="50" cy="46" r="20" fill="#fff" />
          <circle cx="50" cy="43" r="16" />
          <path d="M41 54 h18 v7 c0 3 -2 5 -5 5 h-8 c-3 0 -5 -2 -5 -5 z" />
          <circle cx="44" cy="42" r="4.6" fill="#fff" />
          <circle cx="56" cy="42" r="4.6" fill="#fff" />
          <path d="M50 47 l3.2 6 h-6.4 z" fill="#fff" />
          <g stroke="#fff" strokeWidth="1.6">
            <line x1="46" y1="57" x2="46" y2="63" />
            <line x1="50" y1="57" x2="50" y2="63" />
            <line x1="54" y1="57" x2="54" y2="63" />
          </g>
        </>
      )

    case 'irritante':
      return (
        <>
          <path d="M45 25 h10 l-2 32 h-6 z" />
          <circle cx="50" cy="67" r="5" />
        </>
      )

    case 'peligro-salud':
      return (
        <>
          <circle cx="50" cy="33" r="7" />
          <path d="M36 74 v-14 c0 -7 6 -12 14 -12 s14 5 14 12 v14 z" />
          <polygon points={estrella(50, 61, 8, 13, 5)} fill="#fff" />
        </>
      )

    case 'medioambiente':
      return (
        <>
          {/* linea de agua */}
          <path
            d="M22 55 q6 -5 12 0 t12 0 t12 0 t12 0 t12 0"
            fill="none"
            stroke="#000"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* arbol seco, inclinado */}
          <path d="M31 53 l3 -28 l5 1 l-3 27 z" />
          <g stroke="#000" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <line x1="35" y1="33" x2="25" y2="26" />
            <line x1="36" y1="29" x2="45" y2="23" />
            <line x1="34" y1="40" x2="26" y2="36" />
          </g>
          {/* pez muerto */}
          <path d="M48 68 c8 -9 21 -9 29 0 c-8 9 -21 9 -29 0 z" />
          <path d="M48 68 l-10 -8 v16 z" />
          <g stroke="#fff" strokeWidth="2" strokeLinecap="round">
            <line x1="65" y1="64" x2="70" y2="69" />
            <line x1="70" y1="64" x2="65" y2="69" />
          </g>
        </>
      )
  }
}

export default function PictogramaGHS({
  tipo,
  tamano = 120,
}: {
  tipo: TipoGHS
  tamano?: number
}) {
  const etiqueta = `Pictograma ${CODIGOS_GHS[tipo]}: ${NOMBRES_GHS[tipo]}`

  return (
    <svg
      viewBox="0 0 100 100"
      width={tamano}
      height={tamano}
      role="img"
      aria-label={etiqueta}
      className="figura-svg"
    >
      <title>{etiqueta}</title>
      <polygon points="50,3 97,50 50,97 3,50" fill="#fff" stroke="#d3212c" strokeWidth="8" />
      <g fill="#000">
        <Simbolo tipo={tipo} />
      </g>
    </svg>
  )
}
