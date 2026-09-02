/**
 * Bureta con una lectura marcada.
 *
 * Ojo al criterio de lectura, que es lo que suelen preguntar: en una bureta el
 * cero esta ARRIBA y la escala crece hacia abajo, porque se lee el volumen
 * vertido, no el que queda. El liquido ocupa desde el menisco hacia abajo.
 */

const Y_CERO = 34
const Y_FONDO = 210

export default function Bureta({
  lectura,
  capacidad = 25,
  mostrarValor = false,
  tamano = 200,
  etiqueta,
}: {
  /** Volumen vertido que marca el menisco, en mL */
  lectura: number
  /** Capacidad nominal de la bureta, en mL */
  capacidad?: number
  /** Si es false (por defecto) se marca el menisco pero no se escribe el valor */
  mostrarValor?: boolean
  tamano?: number
  /** Nombre accesible; por defecto, capacidad y lectura */
  etiqueta?: string
}) {
  const escala = (Y_FONDO - Y_CERO) / capacidad
  const y = (mL: number) => Y_CERO + mL * escala
  const yMenisco = y(Math.min(Math.max(lectura, 0), capacidad))

  // Marca menor cada 0,5 mL y rotulada cada 5 mL en buretas de 25; se adapta
  // a otras capacidades para que no se amontonen los numeros.
  const pasoMenor = capacidad <= 10 ? 0.2 : capacidad <= 25 ? 0.5 : 1
  const pasoRotulo = capacidad <= 10 ? 1 : 5

  const marcas: { mL: number; rotula: boolean }[] = []
  for (let v = 0; v <= capacidad + 1e-9; v += pasoMenor) {
    const mL = Math.round(v * 100) / 100
    marcas.push({ mL, rotula: Math.abs(mL % pasoRotulo) < 1e-9 })
  }

  const nombre = etiqueta ?? `Bureta de ${capacidad} mL con el menisco en ${lectura} mL`

  return (
    <svg
      viewBox="0 0 130 268"
      width={tamano * 0.49}
      height={tamano}
      role="img"
      aria-label={nombre}
      className="figura-svg"
    >
      <title>{nombre}</title>

      {/* liquido: del menisco hacia abajo */}
      <rect x="45" y={yMenisco} width="22" height={Y_FONDO - yMenisco} fill="#9ecbe8" />
      <path d={`M45 ${Y_FONDO} h22 l-4 10 h-14 z`} fill="#9ecbe8" />

      {/* cuerpo */}
      <rect
        x="45"
        y="24"
        width="22"
        height={Y_FONDO - 24}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d={`M45 ${Y_FONDO} h22 l-4 10 h-14 z`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* llave y punta */}
      <circle cx="56" cy="226" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="65" y1="226" x2="78" y2="226" stroke="currentColor" strokeWidth="4" />
      <path d="M53 235 h6 l-1.5 22 h-3 z" fill="currentColor" />

      {/* graduaciones */}
      <g stroke="currentColor" strokeWidth="1">
        {marcas.map(({ mL, rotula }) => (
          <line key={mL} x1="45" y1={y(mL)} x2={rotula ? 60 : 52} y2={y(mL)} />
        ))}
      </g>
      <g fill="currentColor" fontSize="9" textAnchor="end" fontFamily="system-ui, sans-serif">
        {marcas
          .filter((m) => m.rotula)
          .map(({ mL }) => (
            <text key={mL} x="42" y={y(mL) + 3}>
              {mL}
            </text>
          ))}
      </g>

      {/* menisco marcado */}
      <path
        d={`M45 ${yMenisco} q11 5 22 0`}
        fill="none"
        stroke="#d3212c"
        strokeWidth="2.5"
      />
      <g stroke="#d3212c" strokeWidth="2">
        <line x1="70" y1={yMenisco} x2="86" y2={yMenisco} />
        <path d={`M70 ${yMenisco} l7 -4 v8 z`} fill="#d3212c" stroke="none" />
      </g>
      {mostrarValor && (
        <text
          x="90"
          y={yMenisco + 4}
          fill="#d3212c"
          fontSize="11"
          fontFamily="system-ui, sans-serif"
        >
          {lectura} mL
        </text>
      )}
    </svg>
  )
}
