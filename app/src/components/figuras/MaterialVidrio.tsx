import type { TipoMaterial } from '../../types'

/**
 * Material de vidrio basico, esquematico. El examen suele preguntar por
 * identificacion ("¿cual de estas imagenes muestra el material adecuado
 * para...?"), asi que lo que importa es la silueta reconocible y, sobre
 * todo, si el material es aforado o graduado.
 */

export const NOMBRES_MATERIAL: Record<TipoMaterial, string> = {
  'matraz-aforado': 'Matraz aforado',
  erlenmeyer: 'Matraz Erlenmeyer',
  'pipeta-aforada': 'Pipeta aforada',
  probeta: 'Probeta graduada',
  'vaso-precipitados': 'Vaso de precipitados',
  embudo: 'Embudo',
}

function Dibujo({ tipo }: { tipo: TipoMaterial }) {
  const trazo = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinejoin: 'round' as const }

  switch (tipo) {
    case 'matraz-aforado':
      return (
        <>
          {/* cuello recto + cuerpo esferico, simetrico */}
          <path d="M43 14 v38 a28 28 0 1 0 14 0 v-38 z" {...trazo} />
          {/* linea de aforo: una sola marca en el cuello */}
          <line x1="43" y1="32" x2="57" y2="32" stroke="currentColor" strokeWidth="2.5" />
        </>
      )

    case 'erlenmeyer':
      return (
        <>
          <path d="M40 14 h20 v26 l22 76 a6 6 0 0 1 -6 8 h-52 a6 6 0 0 1 -6 -8 l22 -76 z" {...trazo} />
          <g stroke="currentColor" strokeWidth="2">
            <line x1="30" y1="104" x2="40" y2="104" />
            <line x1="33" y1="92" x2="41" y2="92" />
          </g>
        </>
      )

    case 'pipeta-aforada':
      return (
        <>
          <path
            d="M50 8 v22 a14 22 0 0 0 -14 22 a14 22 0 0 0 14 22 v46 l0 12 l0 -12"
            {...trazo}
          />
          <path d="M50 8 v22 a14 22 0 0 1 14 22 a14 22 0 0 1 -14 22 v58" {...trazo} />
          {/* aforo unico por encima del bulbo */}
          <line x1="43" y1="24" x2="57" y2="24" stroke="currentColor" strokeWidth="2.5" />
        </>
      )

    case 'probeta':
      return (
        <>
          <path d="M34 20 h32 v104 a6 6 0 0 1 -6 6 h-20 a6 6 0 0 1 -6 -6 z" {...trazo} />
          <path d="M28 130 h44" stroke="currentColor" strokeWidth="2.5" fill="none" />
          {/* graduada: muchas marcas */}
          <g stroke="currentColor" strokeWidth="1.6">
            {[36, 48, 60, 72, 84, 96, 108].map((y) => (
              <line key={y} x1="34" y1={y} x2={y % 24 === 0 ? 50 : 43} y2={y} />
            ))}
          </g>
        </>
      )

    case 'vaso-precipitados':
      return (
        <>
          <path d="M30 24 h44 v96 a8 8 0 0 1 -8 8 h-28 a8 8 0 0 1 -8 -8 z" {...trazo} />
          <path d="M74 24 l10 -4" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <g stroke="currentColor" strokeWidth="1.6">
            {[60, 78, 96].map((y) => (
              <line key={y} x1="30" y1={y} x2="44" y2={y} />
            ))}
          </g>
        </>
      )

    case 'embudo':
      return (
        <>
          <path d="M22 22 h60 l-23 52 v46 h-14 v-46 z" {...trazo} />
        </>
      )
  }
}

export default function MaterialVidrio({
  tipo,
  tamano = 130,
}: {
  tipo: TipoMaterial
  tamano?: number
}) {
  return (
    <svg
      viewBox="0 0 104 140"
      width={tamano * 0.74}
      height={tamano}
      role="img"
      aria-label={NOMBRES_MATERIAL[tipo]}
      className="figura-svg"
    >
      <title>{NOMBRES_MATERIAL[tipo]}</title>
      <Dibujo tipo={tipo} />
    </svg>
  )
}
