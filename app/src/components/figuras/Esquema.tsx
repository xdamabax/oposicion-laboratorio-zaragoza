import type { TipoEsquema } from '../../types'

/**
 * Esquemas de instrumento y de curva, dibujados a mano en SVG.
 *
 * Se separan del material de vidrio porque cumplen otra funcion: aqui no se
 * trata de reconocer una silueta, sino de ver las PARTES y como se relacionan
 * (que hay dentro de un electrodo, donde cae el punto de equivalencia). Por eso
 * llevan rotulos dentro del dibujo y no se encogen tanto como el resto.
 */

export const NOMBRES_ESQUEMA: Record<TipoEsquema, string> = {
  'electrodo-vidrio': 'Electrodo de vidrio combinado',
  phmetro: 'pHímetro con electrodo y vaso de medida',
  'valorador-automatico': 'Valorador automático',
  'curva-potenciometrica': 'Curva de valoración potenciométrica',
  'derivadas-valoracion': 'Primera y segunda derivada de la curva',
}

/** Cada esquema trae su propio lienzo: no comparten proporcion. */
const LIENZOS: Record<TipoEsquema, { ancho: number; alto: number }> = {
  'electrodo-vidrio': { ancho: 340, alto: 300 },
  phmetro: { ancho: 340, alto: 220 },
  'valorador-automatico': { ancho: 340, alto: 250 },
  'curva-potenciometrica': { ancho: 270, alto: 195 },
  'derivadas-valoracion': { ancho: 260, alto: 250 },
}

const AZUL = '#9ecbe8'
const AZUL_CLARO = '#cfe6f4'
const ROJO = '#d3212c'

const trazo = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinejoin: 'round' as const,
}

/** Rotulo de una o dos lineas con su linea de guia hasta la pieza. */
function Rotulo({
  x,
  y,
  hacia,
  lineas,
  derecha = false,
}: {
  x: number
  y: number
  /** Punto de la pieza al que apunta la guia */
  hacia: [number, number]
  lineas: string[]
  /** true: el texto va a la derecha del dibujo */
  derecha?: boolean
}) {
  const anclaX = derecha ? x + 3 : x - 3

  return (
    <g fill="currentColor" fontSize="8.5" fontFamily="system-ui, sans-serif">
      <line x1={x} y1={y - 3} x2={hacia[0]} y2={hacia[1]} stroke="currentColor" strokeWidth="0.8" />
      <text x={anclaX} y={y} textAnchor={derecha ? 'start' : 'end'}>
        {lineas.map((linea, i) => (
          <tspan key={linea} x={anclaX} dy={i === 0 ? 0 : 10}>
            {linea}
          </tspan>
        ))}
      </text>
    </g>
  )
}

/* ---------- Curvas: se calculan, no se dibujan a ojo ---------- */

/** Posicion del punto de equivalencia, en fraccion del eje x. */
const CENTRO = 0.55
/** Lo brusco que es el salto. */
const ANCHO_SALTO = 0.045

const sigmoide = (t: number) => 1 / (1 + Math.exp(-(t - CENTRO) / ANCHO_SALTO))

/** Derivadas analiticas de la sigmoide, normalizadas a 1 en su maximo. */
const derivada1 = (t: number) => {
  const f = sigmoide(t)
  return 4 * f * (1 - f)
}
const derivada2 = (t: number) => {
  const f = sigmoide(t)
  // 6*raiz(3) normaliza el pico a 1
  return 6 * Math.sqrt(3) * f * (1 - f) * (1 - 2 * f)
}

interface Caja {
  x: number
  y: number
  ancho: number
  alto: number
}

function camino(f: (t: number) => number, caja: Caja, puntos = 90) {
  const d: string[] = []
  for (let i = 0; i <= puntos; i++) {
    const t = i / puntos
    const x = caja.x + t * caja.ancho
    const y = caja.y + caja.alto - f(t) * caja.alto
    d.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return d.join(' ')
}

function Ejes({ caja, rotuloY, rotuloX }: { caja: Caja; rotuloY: string; rotuloX?: string }) {
  return (
    <g fontFamily="system-ui, sans-serif">
      <path
        d={`M${caja.x} ${caja.y} v${caja.alto} h${caja.ancho}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <text x={caja.x} y={caja.y - 6} fontSize="8.5" textAnchor="start" fill="currentColor">
        {rotuloY}
      </text>
      {rotuloX && (
        <text
          x={caja.x + caja.ancho}
          y={caja.y + caja.alto + 15}
          fontSize="8.5"
          textAnchor="end"
          fill="currentColor"
        >
          {rotuloX}
        </text>
      )}
    </g>
  )
}

/* ---------- Los dibujos ---------- */

function ElectrodoVidrio() {
  return (
    <>
      {/* cable y cabezal */}
      <line x1="170" y1="4" x2="170" y2="20" stroke="currentColor" strokeWidth="2" />
      <rect x="160" y="20" width="20" height="10" {...trazo} />
      <rect x="152" y="30" width="36" height="22" rx="4" {...trazo} />

      {/* electrolito de referencia: la corona entre los dos tubos */}
      <rect x="153" y="78" width="34" height="150" fill={AZUL_CLARO} />
      {/* disolucion interna: tubo central y bulbo */}
      <rect x="163" y="86" width="14" height="148" fill={AZUL} />
      <circle cx="170" cy="252" r="20" fill={AZUL} />

      {/* cuerpo exterior, bulbo y tubo interior */}
      <rect x="152" y="52" width="36" height="182" {...trazo} />
      <circle cx="170" cy="252" r="20" {...trazo} />
      <rect x="163" y="64" width="14" height="170" {...trazo} />

      {/* orificio de llenado del electrolito */}
      <path d="M188 66 h10 v12 h-10" {...trazo} />

      {/* hilo de referencia externa, en la corona */}
      <line x1="157" y1="70" x2="157" y2="205" stroke="currentColor" strokeWidth="2.5" />
      <rect x="154.5" y="185" width="5" height="20" fill="currentColor" />

      {/* hilo de referencia interna, en el tubo central */}
      <line x1="170" y1="70" x2="170" y2="240" stroke="currentColor" strokeWidth="2.5" />
      <rect x="167" y="220" width="6" height="20" fill="currentColor" />

      {/* diafragma */}
      <rect x="187" y="212" width="7" height="12" fill="currentColor" />

      <Rotulo
        x={146}
        y={92}
        hacia={[153, 100]}
        lineas={['Electrolito de referencia', '(KCl 3 M o saturado)']}
      />
      <Rotulo x={146} y={170} hacia={[156, 172]} lineas={['Referencia externa', 'Ag/AgCl']} />
      <Rotulo x={140} y={268} hacia={[152, 258]} lineas={['Membrana de vidrio', 'sensible al pH']} />

      <Rotulo x={198} y={70} hacia={[196, 72]} derecha lineas={['Orificio de llenado']} />
      <Rotulo
        x={198}
        y={130}
        hacia={[178, 136]}
        derecha
        lineas={['Disolución interna', 'tamponada (pH 7)']}
      />
      <Rotulo
        x={198}
        y={186}
        hacia={[172, 190]}
        derecha
        lineas={['Referencia interna', 'Ag/AgCl']}
      />
      <Rotulo x={198} y={226} hacia={[194, 218]} derecha lineas={['Diafragma', '(unión líquida)']} />
    </>
  )
}

function Phmetro() {
  const vaso = 'M216 132 v62 a6 6 0 0 0 6 6 h48 a6 6 0 0 0 6 -6 v-62'

  return (
    <>
      {/* soporte y pinza */}
      <rect x="180" y="200" width="126" height="10" rx="3" {...trazo} />
      <line x1="212" y1="200" x2="212" y2="30" stroke="currentColor" strokeWidth="3" />
      <rect x="212" y="48" width="26" height="9" {...trazo} />

      {/* aparato */}
      <rect x="6" y="76" width="120" height="86" rx="7" {...trazo} />
      <rect x="18" y="88" width="96" height="34" rx="3" {...trazo} />
      <text
        x="66"
        y="113"
        textAnchor="middle"
        fontSize="17"
        fontFamily="system-ui, sans-serif"
        fill="currentColor"
      >
        7,00 pH
      </text>
      <g {...trazo}>
        <rect x="22" y="134" width="24" height="14" rx="3" />
        <rect x="54" y="134" width="24" height="14" rx="3" />
        <rect x="86" y="134" width="24" height="14" rx="3" />
      </g>

      {/* cable del electrodo al medidor */}
      <path
        d="M240 42 C 226 14, 116 20, 100 68"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      {/* electrodo */}
      <rect x="233" y="42" width="14" height="112" {...trazo} />
      <circle cx="240" cy="160" r="7" fill={AZUL} />
      <circle cx="240" cy="160" r="7" {...trazo} />

      {/* vaso con el tampon o la muestra */}
      <path d={vaso} fill={AZUL} fillOpacity="0.55" />
      <path d={vaso} {...trazo} />
      <line x1="216" y1="144" x2="276" y2="144" stroke="currentColor" strokeWidth="1.2" />

      <Rotulo x={210} y={100} hacia={[232, 102]} lineas={['Electrodo', 'combinado']} />
      <Rotulo x={280} y={178} hacia={[277, 174]} derecha lineas={['Tampón', 'o muestra']} />
      <Rotulo x={6} y={182} hacia={[40, 163]} derecha lineas={['Medidor de alta impedancia']} />
    </>
  )
}

function ValoradorAutomatico() {
  const vaso = 'M226 146 v58 a7 7 0 0 0 7 7 h56 a7 7 0 0 0 7 -7 v-58'

  return (
    <>
      {/* cable del electrodo al control: por encima, para no cruzar el montaje */}
      <path
        d="M274 118 C 312 110, 316 16, 262 16 L124 16 C 104 16, 100 34, 100 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      {/* unidad de control */}
      <rect x="8" y="60" width="92" height="112" rx="7" {...trazo} />
      <rect x="20" y="72" width="68" height="34" rx="3" {...trazo} />
      <path d="M26 100 L44 96 L52 80 L82 74" fill="none" stroke={ROJO} strokeWidth="1.8" />
      <circle cx="36" cy="136" r="10" {...trazo} />
      <g {...trazo}>
        <rect x="56" y="128" width="32" height="10" rx="2" />
        <rect x="56" y="146" width="32" height="10" rx="2" />
      </g>

      {/* bureta de piston: cilindro, valorante y embolo */}
      <rect x="150" y="36" width="28" height="44" fill={AZUL} />
      <rect x="150" y="30" width="28" height="94" {...trazo} />
      <rect x="148" y="80" width="32" height="9" fill="currentColor" />
      <line x1="164" y1="89" x2="164" y2="122" stroke="currentColor" strokeWidth="2.5" />

      {/* unidad intercambiable sobre el frasco del reactivo */}
      <path d="M136 124 h56 v40 a6 6 0 0 1 -6 6 h-44 a6 6 0 0 1 -6 -6 z" {...trazo} />
      <line x1="136" y1="138" x2="192" y2="138" stroke="currentColor" strokeWidth="1.2" />

      {/* tubo de dosificacion hasta el vaso */}
      <path
        d="M192 132 C 224 132, 224 110, 256 110 L256 142"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      {/* vaso de valoracion con la barra agitadora */}
      <path d={vaso} fill={AZUL} fillOpacity="0.55" />
      <path d={vaso} {...trazo} />
      <ellipse cx="261" cy="200" rx="14" ry="4" fill="currentColor" />

      {/* electrodo sumergido */}
      <rect x="268" y="118" width="12" height="72" {...trazo} />
      <circle cx="274" cy="194" r="6" {...trazo} />

      {/* agitador magnetico */}
      <rect x="216" y="211" width="90" height="16" rx="4" {...trazo} />
      <circle cx="296" cy="219" r="4" {...trazo} />

      <Rotulo x={146} y={48} hacia={[149, 52]} lineas={['Bureta motorizada', 'de pistón']} />
      <Rotulo x={130} y={190} hacia={[152, 172]} derecha lineas={['Frasco del valorante']} />
      <Rotulo x={286} y={128} hacia={[281, 134]} derecha lineas={['Electrodo', 'indicador']} />
      <Rotulo x={208} y={244} hacia={[250, 228]} derecha lineas={['Agitador magnético']} />
      <Rotulo x={8} y={190} hacia={[40, 173]} derecha lineas={['Control y registro', 'de la curva']} />
    </>
  )
}

function CurvaPotenciometrica() {
  const caja: Caja = { x: 34, y: 26, ancho: 206, alto: 128 }
  const xPE = caja.x + CENTRO * caja.ancho
  const yPE = caja.y + caja.alto / 2

  return (
    <g fontFamily="system-ui, sans-serif">
      <Ejes caja={caja} rotuloY="E (mV) o pH" rotuloX="V de valorante (mL)" />
      <path d={camino(sigmoide, caja)} fill="none" stroke="currentColor" strokeWidth="2.2" />

      <g stroke={ROJO} strokeWidth="1.2" strokeDasharray="4 3">
        <line x1={xPE} y1={caja.y + caja.alto} x2={xPE} y2={yPE} />
        <line x1={caja.x} y1={yPE} x2={xPE} y2={yPE} />
      </g>
      <circle cx={xPE} cy={yPE} r="4" fill={ROJO} />
      <text x={xPE + 8} y={yPE - 7} fontSize="9" fill={ROJO}>
        Punto de equivalencia
      </text>
      <text x={xPE + 8} y={yPE + 5} fontSize="8" fill={ROJO}>
        (punto de inflexión)
      </text>
      <text x={xPE} y={caja.y + caja.alto + 15} fontSize="8.5" textAnchor="middle" fill={ROJO}>
        V(eq)
      </text>
    </g>
  )
}

function DerivadasValoracion() {
  const uno: Caja = { x: 34, y: 24, ancho: 200, alto: 74 }
  const dos: Caja = { x: 34, y: 146, ancho: 200, alto: 74 }
  const xPE = uno.x + CENTRO * uno.ancho
  // la segunda derivada va de -1 a 1: su cero cae a media altura
  const ceroDos = dos.y + dos.alto / 2

  return (
    <g fontFamily="system-ui, sans-serif">
      <Ejes caja={uno} rotuloY="ΔE/ΔV" />
      <path d={camino(derivada1, uno)} fill="none" stroke="currentColor" strokeWidth="2.2" />
      <line
        x1={xPE}
        y1={uno.y + uno.alto}
        x2={xPE}
        y2={uno.y}
        stroke={ROJO}
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />
      <circle cx={xPE} cy={uno.y} r="4" fill={ROJO} />
      <text x={xPE + 8} y={uno.y + 11} fontSize="8.5" fill={ROJO}>
        máximo
      </text>

      <Ejes caja={dos} rotuloY="Δ²E/ΔV²" rotuloX="V de valorante (mL)" />
      <line
        x1={dos.x}
        y1={ceroDos}
        x2={dos.x + dos.ancho}
        y2={ceroDos}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <path
        d={camino((t) => (derivada2(t) + 1) / 2, dos)}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <line
        x1={xPE}
        y1={dos.y + dos.alto}
        x2={xPE}
        y2={dos.y}
        stroke={ROJO}
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />
      <circle cx={xPE} cy={ceroDos} r="4" fill={ROJO} />
      <text x={xPE + 8} y={ceroDos - 7} fontSize="8.5" fill={ROJO}>
        corte con cero
      </text>
    </g>
  )
}

function Dibujo({ tipo }: { tipo: TipoEsquema }) {
  switch (tipo) {
    case 'electrodo-vidrio':
      return <ElectrodoVidrio />
    case 'phmetro':
      return <Phmetro />
    case 'valorador-automatico':
      return <ValoradorAutomatico />
    case 'curva-potenciometrica':
      return <CurvaPotenciometrica />
    case 'derivadas-valoracion':
      return <DerivadasValoracion />
  }
}

export default function Esquema({
  tipo,
  tamano = 300,
  etiqueta,
}: {
  tipo: TipoEsquema
  /** Ancho en px; el alto sale de la proporcion del lienzo */
  tamano?: number
  /** Nombre accesible; por defecto, el del catalogo */
  etiqueta?: string
}) {
  const { ancho, alto } = LIENZOS[tipo]
  const nombre = etiqueta ?? NOMBRES_ESQUEMA[tipo]

  return (
    <svg
      viewBox={`0 0 ${ancho} ${alto}`}
      width={tamano}
      height={(tamano * alto) / ancho}
      role="img"
      aria-label={nombre}
      className="figura-svg figura-esquema"
    >
      <title>{nombre}</title>
      <Dibujo tipo={tipo} />
    </svg>
  )
}
