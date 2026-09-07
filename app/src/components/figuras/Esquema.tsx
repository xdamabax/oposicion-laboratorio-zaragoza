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
  'celda-conductividad': 'Célula de conductividad y constante de célula',
  'sonda-oxigeno': 'Sonda de oxígeno disuelto de membrana',
  espectrofotometro: 'Espectrofotómetro UV-visible de haz simple',
  'ley-beer': 'Ley de Lambert-Beer: absorción en la cubeta',
  'desviacion-beer': 'Recta de calibrado y desviación de la ley de Beer',
  'linea-vs-banda': 'Línea atómica frente a banda molecular',
  'lampara-catodo-hueco': 'Lámpara de cátodo hueco',
  'absorcion-atomica': 'Espectrómetro de absorción atómica de llama',
  'horno-grafito': 'Programa de temperaturas del horno de grafito',
  'antorcha-icp': 'Antorcha de plasma acoplado inductivamente',
  'icp-ms': 'ICP-MS: del plasma al vacío, a través de los conos',
}

/** Cada esquema trae su propio lienzo: no comparten proporcion. */
const LIENZOS: Record<TipoEsquema, { ancho: number; alto: number }> = {
  'electrodo-vidrio': { ancho: 340, alto: 300 },
  phmetro: { ancho: 340, alto: 220 },
  'valorador-automatico': { ancho: 340, alto: 250 },
  'curva-potenciometrica': { ancho: 270, alto: 195 },
  'derivadas-valoracion': { ancho: 260, alto: 250 },
  'celda-conductividad': { ancho: 430, alto: 210 },
  'sonda-oxigeno': { ancho: 400, alto: 285 },
  espectrofotometro: { ancho: 490, alto: 205 },
  'ley-beer': { ancho: 400, alto: 185 },
  'desviacion-beer': { ancho: 310, alto: 215 },
  'linea-vs-banda': { ancho: 370, alto: 204 },
  'lampara-catodo-hueco': { ancho: 420, alto: 212 },
  'absorcion-atomica': { ancho: 530, alto: 215 },
  'horno-grafito': { ancho: 340, alto: 222 },
  'antorcha-icp': { ancho: 460, alto: 232 },
  'icp-ms': { ancho: 540, alto: 224 },
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

function CeldaConductividad() {
  const vaso = 'M150 44 v118 a8 8 0 0 0 8 8 h104 a8 8 0 0 0 8 -8 v-118'

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* medidor */}
      <rect x="8" y="60" width="86" height="66" rx="6" {...trazo} />
      <rect x="18" y="70" width="66" height="26" rx="3" {...trazo} />
      <text x="51" y="89" textAnchor="middle" fontSize="12" fill="currentColor">
        1413 µS/cm
      </text>
      <circle cx="30" cy="112" r="6" {...trazo} />
      <rect x="46" y="107" width="38" height="10" rx="2" {...trazo} />

      {/* cables a los dos electrodos */}
      <path d="M94 76 C 118 76, 128 34, 180 34 L180 62" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M94 104 C 124 104, 136 22, 242 22 L242 62" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* vaso con la disolucion */}
      <path d={vaso} fill={AZUL} fillOpacity="0.5" />
      <path d={vaso} {...trazo} />
      <line x1="150" y1="58" x2="270" y2="58" stroke="currentColor" strokeWidth="1.2" />

      {/* los dos electrodos planos, enfrentados */}
      <rect x="176" y="62" width="8" height="78" fill="currentColor" />
      <rect x="238" y="62" width="8" height="78" fill="currentColor" />

      {/* cota de la separacion entre placas */}
      <text x="211" y="146" textAnchor="middle" fontSize="12" fill={ROJO} fontStyle="italic">
        l
      </text>
      <g stroke={ROJO} strokeWidth="1.3">
        <line x1="184" y1="154" x2="238" y2="154" />
        <path d="M184 154 l8 -4 v8 z" fill={ROJO} stroke="none" />
        <path d="M238 154 l-8 -4 v8 z" fill={ROJO} stroke="none" />
      </g>

      <Rotulo x={280} y={80} hacia={[247, 88]} derecha lineas={['Electrodos de área A', '(platino platinado)']} />
      <Rotulo x={146} y={188} hacia={[172, 168]} lineas={['Disolución', 'patrón o muestra']} />

      <text x="280" y="140" fontSize="14" fill={ROJO} fontWeight="bold">
        K = l / A
      </text>
      <text x="280" y="156" fontSize="8.5" fill="currentColor">
        constante de célula
      </text>
      <text x="280" y="168" fontSize="8.5" fill="currentColor">
        en cm⁻¹
      </text>
    </g>
  )
}

function SondaOxigeno() {
  return (
    <g fontFamily="system-ui, sans-serif">
      {/* agua de la muestra */}
      <rect x="100" y="196" width="160" height="62" fill={AZUL} fillOpacity="0.45" />
      <line x1="100" y1="196" x2="260" y2="196" stroke="currentColor" strokeWidth="1.2" />

      {/* cuerpo de la sonda */}
      <line x1="170" y1="6" x2="170" y2="22" stroke="currentColor" strokeWidth="2" />
      <rect x="150" y="22" width="40" height="20" rx="4" {...trazo} />
      <rect x="152" y="52" width="36" height="176" fill={AZUL_CLARO} />
      <rect x="152" y="42" width="36" height="186" {...trazo} />

      {/* catodo: hilo fino con disco en la punta */}
      <line x1="170" y1="56" x2="170" y2="214" stroke="currentColor" strokeWidth="2.5" />
      <rect x="160" y="214" width="20" height="6" fill="currentColor" />

      {/* anodo: pieza mayor a un lado */}
      <rect x="156" y="90" width="8" height="80" fill="currentColor" />

      {/* membrana, sujeta con su junta */}
      <line x1="150" y1="228" x2="190" y2="228" stroke={ROJO} strokeWidth="3" />
      <circle cx="150" cy="228" r="4" {...trazo} />
      <circle cx="190" cy="228" r="4" {...trazo} />

      {/* el oxigeno atraviesa la membrana */}
      <g stroke={ROJO} strokeWidth="1.5" fill="none">
        <line x1="163" y1="250" x2="163" y2="236" />
        <path d="M163 234 l-4 7 h8 z" fill={ROJO} stroke="none" />
        <line x1="177" y1="252" x2="177" y2="236" />
        <path d="M177 234 l-4 7 h8 z" fill={ROJO} stroke="none" />
      </g>
      <text x="188" y="252" fontSize="10" fill={ROJO}>
        O₂
      </text>

      <Rotulo x={146} y={64} hacia={[168, 70]} lineas={['Cátodo', '(oro o platino)']} />
      <Rotulo x={146} y={132} hacia={[155, 132]} lineas={['Ánodo', '(plata o plomo)']} />
      <Rotulo x={198} y={100} hacia={[189, 106]} derecha lineas={['Electrolito', '(KCl)']} />
      <Rotulo x={206} y={224} hacia={[192, 228]} derecha lineas={['Membrana permeable', 'a gases (PTFE)']} />
      <Rotulo x={96} y={216} hacia={[124, 202]} lineas={['Muestra', 'de agua']} />

      <text x="8" y="276" fontSize="8.5" fill="currentColor">
        El O₂ difunde por la membrana y se reduce en el cátodo.
      </text>
    </g>
  )
}

function Espectrofotometro() {
  const Y = 115
  const rendija = (x: number) => (
    <g stroke="currentColor" strokeWidth="3" key={x}>
      <line x1={x} y1={Y - 23} x2={x} y2={Y - 8} />
      <line x1={x} y1={Y + 8} x2={x} y2={Y + 23} />
    </g>
  )

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* fuente */}
      <rect x="14" y="96" width="46" height="38" rx="4" {...trazo} />
      <path d="M26 115 h22 M30 106 v18 M42 106 v18" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <line x1="60" y1={Y} x2="96" y2={Y} stroke="currentColor" strokeWidth="2" />

      {rendija(96)}
      <line x1="96" y1={Y} x2="140" y2={Y} stroke="currentColor" strokeWidth="2" />

      {/* monocromador: la red de difraccion dispersa el haz */}
      <rect x="140" y="86" width="22" height="58" {...trazo} />
      <g stroke="currentColor" strokeWidth="1">
        {[92, 100, 108, 116, 124, 132, 138].map((y) => (
          <line key={y} x1="142" y1={y} x2="160" y2={y} />
        ))}
      </g>

      {/* de todo el abanico, solo una longitud de onda pasa la rendija de salida */}
      <g stroke="currentColor" strokeWidth="1" opacity="0.75">
        {[-31, -16, 16, 31].map((dy) => (
          <line key={dy} x1="162" y1={Y} x2="207" y2={Y + dy} />
        ))}
      </g>
      <line x1="162" y1={Y} x2="215" y2={Y} stroke={ROJO} strokeWidth="2.4" />
      {rendija(215)}

      {/* cubeta: el haz sale atenuado */}
      <line x1="215" y1={Y} x2="256" y2={Y} stroke={ROJO} strokeWidth="2.4" />
      <rect x="256" y="92" width="42" height="46" fill={AZUL} fillOpacity="0.6" />
      <rect x="256" y="92" width="42" height="46" {...trazo} />
      <line x1="256" y1={Y} x2="298" y2={Y} stroke={ROJO} strokeWidth="2.4" />
      <line x1="298" y1={Y} x2="336" y2={Y} stroke={ROJO} strokeWidth="1.1" />

      {/* detector y lectura */}
      <rect x="336" y="96" width="42" height="38" rx="4" {...trazo} />
      <path d="M348 115 a10 10 0 0 1 18 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <line x1="378" y1={Y} x2="396" y2={Y} stroke="currentColor" strokeWidth="1.4" />
      <rect x="396" y="98" width="80" height="34" rx="4" {...trazo} />
      <text x="436" y="120" textAnchor="middle" fontSize="14" fill="currentColor">
        A = 0,435
      </text>

      <g fontSize="8.5" textAnchor="middle" fill="currentColor">
        <text x="37" y="86">D₂ + W</text>
        <text x="151" y="78">red de difracción</text>
        <text x="96" y="82">rendija</text>
        <text x="215" y="82">rendija</text>
      </g>
      <text x="277" y="84" textAnchor="middle" fontSize="8.5" fill={ROJO}>
        λ seleccionada
      </text>

      <g fontSize="9.5" textAnchor="middle" fill="currentColor" fontWeight="bold">
        <text x="37" y="168">Fuente</text>
        <text x="155" y="168">Monocromador</text>
        <text x="277" y="168">Cubeta</text>
        <text x="357" y="168">Detector</text>
        <text x="436" y="168">Lectura</text>
      </g>
      <g fontSize="8" textAnchor="middle" fill="currentColor">
        <text x="37" y="180">deuterio (UV)</text>
        <text x="37" y="190">tungsteno (vis)</text>
        <text x="155" y="180">selecciona la λ</text>
        <text x="277" y="180">la muestra</text>
        <text x="357" y="180">fotomultiplicador</text>
        <text x="357" y="190">o fotodiodos</text>
        <text x="436" y="180">absorbancia</text>
      </g>
    </g>
  )
}

function LeyBeer() {
  const moleculas = [
    [152, 56],
    [186, 70],
    [216, 52],
    [164, 96],
    [200, 108],
    [226, 88],
  ]

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* haz incidente, grueso */}
      <line x1="24" y1="80" x2="128" y2="80" stroke={ROJO} strokeWidth="4" />
      <path d="M128 80 l-10 -6 v12 z" fill={ROJO} />
      <text x="24" y="66" fontSize="13" fill={ROJO}>
        I₀
      </text>

      {/* cubeta con el analito */}
      <rect x="132" y="34" width="108" height="94" fill={AZUL} fillOpacity="0.55" />
      <rect x="132" y="34" width="108" height="94" {...trazo} />
      <g fill="currentColor" opacity="0.55">
        {moleculas.map(([x, y]) => (
          <circle key={String(x) + '-' + String(y)} cx={x} cy={y} r="4" />
        ))}
      </g>

      {/* haz transmitido, mas debil */}
      <line x1="240" y1="80" x2="330" y2="80" stroke={ROJO} strokeWidth="1.6" />
      <path d="M330 80 l-9 -5 v10 z" fill={ROJO} />
      <text x="298" y="66" fontSize="13" fill={ROJO}>
        I
      </text>

      {/* cota del camino optico */}
      <g stroke="currentColor" strokeWidth="1.2">
        <line x1="132" y1="142" x2="240" y2="142" />
        <path d="M132 142 l8 -4 v8 z" fill="currentColor" stroke="none" />
        <path d="M240 142 l-8 -4 v8 z" fill="currentColor" stroke="none" />
      </g>
      <text x="186" y="158" textAnchor="middle" fontSize="10" fill="currentColor">
        b (camino óptico, cm)
      </text>
      <text x="24" y="176" fontSize="9.5" fill="currentColor">
        c = concentración · ε = absortividad molar
      </text>

      <text x="250" y="112" fontSize="15" fill={ROJO} fontWeight="bold">
        A = ε · b · c
      </text>
      <text x="250" y="130" fontSize="10" fill="currentColor">
        A = −log T = log (I₀ / I)
      </text>
      <text x="250" y="144" fontSize="10" fill="currentColor">
        T = I / I₀
      </text>
    </g>
  )
}

function DesviacionBeer() {
  const caja: Caja = { x: 44, y: 30, ancho: 230, alto: 128 }
  // La curva real ARRANCA PEGADA a la recta -- misma pendiente en el origen -- y
  // se separa hacia abajo al subir la concentracion. Es la desviacion negativa.
  const ideal = (t: number) => t
  const real = (t: number) => t - 0.3 * t ** 3
  const xLineal = caja.x + 0.4 * caja.ancho
  const yEje = caja.y + caja.alto

  return (
    <g fontFamily="system-ui, sans-serif">
      <Ejes caja={caja} rotuloY="Absorbancia" rotuloX="Concentración" />

      <path d={camino(ideal, caja)} fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="5 4" />
      <path d={camino(real, caja)} fill="none" stroke={ROJO} strokeWidth="2.4" />

      {/* tramo lineal util */}
      <g stroke="currentColor" strokeWidth="1.2">
        <line x1={caja.x} y1={yEje + 6} x2={xLineal} y2={yEje + 6} />
        <line x1={caja.x} y1={yEje + 2} x2={caja.x} y2={yEje + 10} />
        <line x1={xLineal} y1={yEje + 2} x2={xLineal} y2={yEje + 10} />
      </g>
      <text x={(caja.x + xLineal) / 2} y={yEje + 21} textAnchor="middle" fontSize="8.5" fill="currentColor">
        intervalo lineal
      </text>

      <text x={caja.x + 0.3 * caja.ancho} y={caja.y + 20} fontSize="8.5" fill="currentColor">
        ideal (A = ε·b·c)
      </text>
      <text x={caja.x + 0.58 * caja.ancho} y={caja.y + 0.72 * caja.alto} fontSize="8.5" fill={ROJO}>
        real: desviación negativa
      </text>
      <text x={caja.x + 0.58 * caja.ancho} y={caja.y + 0.72 * caja.alto + 11} fontSize="8.5" fill={ROJO}>
        a concentración alta
      </text>
    </g>
  )
}

/* ---------- Tema 26: espectroscopia atomica ---------- */

const gauss = (t: number, mu: number, sigma: number) => Math.exp(-((t - mu) ** 2) / (2 * sigma ** 2))

/**
 * La frontera con el tema 25, dibujada: la MOLECULA en disolucion da una banda
 * ancha y el ATOMO libre una linea estrecha. Las dos curvas salen de la misma
 * gaussiana y con la misma altura, para que lo unico que las distinga sea la
 * anchura, que es de lo que trata la figura.
 */
function LineaVsBanda() {
  const izq: Caja = { x: 30, y: 34, ancho: 130, alto: 96 }
  const der: Caja = { x: 216, y: 34, ancho: 130, alto: 96 }
  const banda = (t: number) => gauss(t, 0.5, 0.16)
  const linea = (t: number) => gauss(t, 0.5, 0.012)

  return (
    <g fontFamily="system-ui, sans-serif">
      <text
        x={izq.x + izq.ancho / 2}
        y="16"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="bold"
        fill="currentColor"
      >
        Molécula en disolución
      </text>
      <text
        x={der.x + der.ancho / 2}
        y="16"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="bold"
        fill="currentColor"
      >
        Átomo libre en fase gaseosa
      </text>

      <Ejes caja={izq} rotuloY="A" rotuloX="λ" />
      <Ejes caja={der} rotuloY="A" rotuloX="λ" />

      <path d={camino(banda, izq, 600)} fill="none" stroke="currentColor" strokeWidth="2" />
      <path d={camino(linea, der, 600)} fill="none" stroke={ROJO} strokeWidth="2" />

      <g fontSize="8.5" textAnchor="middle" fill="currentColor">
        <text x={izq.x + izq.ancho / 2} y="160">
          banda ancha
        </text>
        <text x={izq.x + izq.ancho / 2} y="171">
          (decenas de nm)
        </text>
        <text x={der.x + der.ancho / 2} y="160" fill={ROJO}>
          línea estrecha
        </text>
        <text x={der.x + der.ancho / 2} y="171" fill={ROJO}>
          (≈ 0,002 nm)
        </text>
      </g>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="187">
          Una fuente continua repartiría su energía por toda la banda: sobre una línea así no mediría
        </text>
        <text x="8" y="198">
          casi nada. Por eso la absorción atómica usa fuente de LÍNEAS: la lámpara de cátodo hueco.
        </text>
      </g>
    </g>
  )
}

/**
 * La lampara de catodo hueco por dentro. Lo que tiene que verse: que el catodo
 * es HUECO y esta hecho del elemento a analizar, y que la luz nace dentro de esa
 * cavidad y sale por la ventana.
 */
function LamparaCatodoHueco() {
  const gas = [
    [186, 84],
    [214, 132],
    [244, 90],
    [200, 124],
    [268, 122],
    [232, 74],
    [258, 76],
    [178, 138],
  ]

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* ampolla de vidrio */}
      <rect x="44" y="54" width="296" height="104" rx="16" {...trazo} />

      {/* ventana de cuarzo, en el extremo por el que sale el haz */}
      <rect
        x="330"
        y="70"
        width="10"
        height="72"
        fill={AZUL_CLARO}
        stroke="currentColor"
        strokeWidth="1.4"
      />

      {/* catodo hueco: cilindro abierto hacia la ventana */}
      <path
        d="M150 72 H126 A34 34 0 0 0 126 140 H150 V128 H132 A22 22 0 0 1 132 84 H150 Z"
        fill="currentColor"
        fillOpacity="0.35"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      {/* anodo */}
      <line x1="286" y1="76" x2="286" y2="136" stroke="currentColor" strokeWidth="3" />
      <circle cx="286" cy="136" r="4" fill="currentColor" />

      {/* gas inerte a baja presion */}
      <g fill="currentColor" opacity="0.4">
        {gas.map(([x, y]) => (
          <circle key={String(x) + '-' + String(y)} cx={x} cy={y} r="3" />
        ))}
      </g>

      {/* pulverizacion catodica: el ion del gas arranca atomos del catodo */}
      <line x1="182" y1="84" x2="120" y2="98" stroke="currentColor" strokeWidth="1" />
      <path d="M117 99 l9 -1 l-4 -4 z" fill="currentColor" />
      <text x="185" y="80" fontSize="8" fill="currentColor">
        Ne⁺
      </text>

      {/* el haz nace DENTRO de la cavidad y sale por la ventana */}
      <line x1="140" y1="106" x2="404" y2="106" stroke={ROJO} strokeWidth="2.6" />
      <path d="M404 106 l-10 -5 v10 z" fill={ROJO} />

      {/* patillas y polaridad */}
      <line x1="122" y1="140" x2="122" y2="170" stroke="currentColor" strokeWidth="1.6" />
      <line x1="286" y1="140" x2="286" y2="170" stroke="currentColor" strokeWidth="1.6" />
      <text x="108" y="166" fontSize="12" fill="currentColor">
        −
      </text>
      <text x="292" y="166" fontSize="12" fill="currentColor">
        +
      </text>

      <Rotulo
        x={118}
        y={26}
        hacia={[128, 74]}
        lineas={['Cátodo hueco: el metal', 'del elemento a analizar']}
      />
      <Rotulo x={302} y={30} hacia={[286, 78]} derecha lineas={['Ánodo']} />
      <Rotulo x={352} y={54} hacia={[336, 74]} derecha lineas={['Ventana', 'de cuarzo']} />

      <text x="205" y="150" textAnchor="middle" fontSize="8" fill="currentColor">
        gas inerte (Ne o Ar) a baja presión
      </text>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="190">
          Emite las líneas del propio elemento del cátodo: hace falta una lámpara por elemento.
        </text>
        <text x="8" y="203">
          Alternativa más intensa: lámpara de descarga sin electrodos (EDL).
        </text>
      </g>
    </g>
  )
}

/**
 * El espectrometro de absorcion atomica. La diferencia que hay que ver respecto
 * del de absorcion molecular del tema 25: aqui el MONOCROMADOR VA DETRAS del
 * atomizador, porque la llama emite luz propia y hay que aislar la linea al
 * final; y hay un modulador que separa lo que viene de la lampara de lo que
 * emite la llama.
 */
function AbsorcionAtomica() {
  const Y = 104

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* fuente: lampara de catodo hueco */}
      <rect x="10" y="84" width="56" height="40" rx="4" {...trazo} />
      <path
        d="M40 92 H30 A12 12 0 0 0 30 116 H40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="54" cy={Y} r="3" fill="currentColor" />
      <line x1="66" y1={Y} x2="82" y2={Y} stroke={ROJO} strokeWidth="2.6" />

      {/* modulador (chopper): trocea el haz de la lampara */}
      <circle cx="98" cy={Y} r="16" {...trazo} />
      <path d="M98 104 L98 88 A16 16 0 0 1 114 104 Z" fill="currentColor" opacity="0.55" />
      <path d="M98 104 L98 120 A16 16 0 0 1 82 104 Z" fill="currentColor" opacity="0.55" />
      <path d="M104 82 a18 18 0 0 1 10 10" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="114" y1={Y} x2="176" y2={Y} stroke={ROJO} strokeWidth="2.6" />

      {/* atomizador: llama sobre mechero de ranura */}
      <path
        d="M180 112 Q182 94 192 86 Q198 80 202 88 Q208 70 218 60 Q228 72 234 88 Q239 79 245 87 Q254 95 256 112 Z"
        fill={AZUL_CLARO}
        fillOpacity="0.85"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M196 112 L218 88 L240 112 Z" fill={AZUL} fillOpacity="0.7" stroke="none" />
      <rect x="176" y="112" width="84" height="14" {...trazo} />
      <rect x="204" y="126" width="28" height="24" {...trazo} />
      <line x1="178" y1="148" x2="200" y2="148" stroke="currentColor" strokeWidth="1.4" />
      <path d="M202 148 l-8 -3 v6 z" fill="currentColor" />
      <text x="172" y="160" textAnchor="middle" fontSize="8" fill="currentColor">
        muestra
      </text>
      <text x="218" y="52" textAnchor="middle" fontSize="8.5" fill="currentColor">
        llama aire-acetileno
      </text>

      {/* el haz sale atenuado del atomizador */}
      <line x1="176" y1={Y} x2="260" y2={Y} stroke={ROJO} strokeWidth="2.6" />
      <line x1="260" y1={Y} x2="300" y2={Y} stroke={ROJO} strokeWidth="1.2" />

      {/* monocromador, DESPUES del atomizador */}
      <rect x="300" y="76" width="24" height="56" {...trazo} />
      <g stroke="currentColor" strokeWidth="1">
        {[82, 90, 98, 106, 114, 122, 128].map((y) => (
          <line key={y} x1="302" y1={y} x2="322" y2={y} />
        ))}
      </g>
      <text x="312" y="70" textAnchor="middle" fontSize="8" fill="currentColor">
        red de difracción
      </text>
      <line x1="324" y1={Y} x2="366" y2={Y} stroke={ROJO} strokeWidth="1.2" />

      {/* detector y lectura */}
      <rect x="366" y="84" width="44" height="40" rx="4" {...trazo} />
      <path d="M378 104 a10 10 0 0 1 18 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <line x1="410" y1={Y} x2="428" y2={Y} stroke="currentColor" strokeWidth="1.4" />
      <rect x="428" y="86" width="88" height="36" rx="4" {...trazo} />
      <text x="472" y="109" textAnchor="middle" fontSize="14" fill="currentColor">
        A = 0,120
      </text>

      <g fontSize="9.5" textAnchor="middle" fill="currentColor" fontWeight="bold">
        <text x="38" y="170">
          Fuente
        </text>
        <text x="98" y="170">
          Modulador
        </text>
        <text x="218" y="170">
          Atomizador
        </text>
        <text x="312" y="170">
          Monocromador
        </text>
        <text x="388" y="170">
          Detector
        </text>
        <text x="472" y="170">
          Lectura
        </text>
      </g>
      <g fontSize="8" textAnchor="middle" fill="currentColor">
        <text x="38" y="182">
          lámpara de
        </text>
        <text x="38" y="192">
          cátodo hueco
        </text>
        <text x="98" y="182">
          chopper
        </text>
        <text x="218" y="182">
          llama u horno
        </text>
        <text x="218" y="192">
          de grafito
        </text>
        <text x="312" y="182">
          aísla la línea
        </text>
        <text x="388" y="182">
          fotomultiplicador
        </text>
        <text x="472" y="182">
          absorbancia
        </text>
      </g>

      <text x="8" y="208" fontSize="8.5" fill="currentColor">
        Ojo al orden: aquí el monocromador va DESPUÉS del atomizador; en el tema 25 iba antes de la
        cubeta.
      </text>
    </g>
  )
}

/**
 * El programa de temperaturas del horno de grafito. Lo que tiene que ensenar es
 * que LA SENAL ES UN PICO TRANSITORIO Y CAE DENTRO DE LA ATOMIZACION: no se lee
 * una senal estable como en la llama, se integra un pico.
 */
function HornoGrafito() {
  const caja: Caja = { x: 62, y: 26, ancho: 250, alto: 120 }
  const yEje = caja.y + caja.alto
  const px = (t: number) => caja.x + t * caja.ancho
  const py = (nivel: number) => yEje - nivel * caja.alto

  /** [nombre, t inicial, t final, nivel de temperatura] */
  const etapas: [string, number, number, number][] = [
    ['Secado', 0.02, 0.22, 0.05],
    ['Calcinación', 0.28, 0.52, 0.32],
    ['Atomización', 0.58, 0.74, 0.93],
    ['Limpieza', 0.8, 0.96, 0.99],
  ]

  const escalones = etapas
    .map(
      ([, t0, t1, n]) =>
        `L${px(t0).toFixed(1)} ${py(n).toFixed(1)} L${px(t1).toFixed(1)} ${py(n).toFixed(1)}`,
    )
    .join(' ')
  const programa = `M${px(0)} ${yEje} ${escalones} L${px(0.99).toFixed(1)} ${yEje}`

  /** el pico de absorbancia, centrado en la atomizacion */
  const pico = (t: number) => 0.43 * gauss(t, 0.66, 0.035)

  const marcas: [number, string][] = [
    [0.05, '≈ 110 °C'],
    [0.32, '350-1200 °C'],
    [0.93, '2000-3000 °C'],
  ]

  return (
    <g fontFamily="system-ui, sans-serif">
      <Ejes caja={caja} rotuloY="Temperatura" />

      <g fontSize="8" fill="currentColor">
        {marcas.map(([n, texto]) => (
          <g key={texto}>
            <line
              x1={caja.x - 4}
              y1={py(n)}
              x2={caja.x}
              y2={py(n)}
              stroke="currentColor"
              strokeWidth="1"
            />
            <text x={caja.x - 7} y={py(n) + 3} textAnchor="end">
              {texto}
            </text>
          </g>
        ))}
      </g>

      <path d={programa} fill="none" stroke="currentColor" strokeWidth="2" />
      <path d={camino(pico, caja, 400)} fill="none" stroke={ROJO} strokeWidth="2" />

      <g fontSize="8.5" fill={ROJO}>
        <text x="246" y="92">
          absorbancia
        </text>
        <text x="246" y="102">
          (escala aparte)
        </text>
      </g>

      <g fontSize="8" textAnchor="middle" fill="currentColor">
        {etapas.map(([nombre, t0, t1]) => (
          <text key={nombre} x={px((t0 + t1) / 2)} y={yEje + 14}>
            {nombre}
          </text>
        ))}
      </g>
      <text
        x={caja.x + caja.ancho}
        y={yEje + 28}
        textAnchor="end"
        fontSize="8.5"
        fill="currentColor"
      >
        tiempo
      </text>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="190">
          5-50 µL de muestra · 45-90 s por ciclo · atmósfera de argón
        </text>
        <text x="8" y="202">
          Tubo de grafito de 1-3 cm, calentado por resistencia eléctrica.
        </text>
        <text x="8" y="214">
          La señal es un PICO TRANSITORIO: solo aparece durante la atomización.
        </text>
      </g>
    </g>
  )
}

/* ---------- Tema 27: plasma acoplado inductivamente ---------- */

/**
 * La antorcha, que es la pieza clave y pregunta documentada dos veces.
 *
 * Lo que tiene que verse, y por eso se comprueba luego midiendo el dibujo: que
 * los tres tubos son CONCENTRICOS y que la MUESTRA entra por el central,
 * mientras los dos argones entran por las coronas de fuera.
 */
function AntorchaIcp() {
  const EJE = 120
  /** [x inicial, x final, semiancho] de cada tubo, del exterior al central */
  const tubos: [number, number, number][] = [
    [116, 300, 42],
    [132, 272, 26],
    [148, 264, 8],
  ]

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* plasma: sale por la boca de la antorcha */}
      <path
        d="M300 84 Q332 76 358 88 Q390 100 412 120 Q390 140 358 152 Q332 164 300 156 Z"
        fill={AZUL_CLARO}
        fillOpacity="0.9"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      {/* el canal central del plasma, por donde va la muestra */}
      <line x1="300" y1={EJE} x2="396" y2={EJE} stroke={ROJO} strokeWidth="3" opacity="0.75" />

      {/* los tres tubos concentricos, en seccion: cerrados por la izquierda,
          que es lo que hace que se lean como tubos y no como rayas sueltas */}
      {tubos.map(([x0, x1, semi]) => (
        <path
          key={x0}
          d={`M${x1} ${EJE - semi} H${x0} V${EJE + semi} H${x1}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      ))}

      {/* entradas de gas: las dos coronas y, en ROJO, la muestra por el centro */}
      <g stroke="currentColor" strokeWidth="1.4">
        <line x1="108" y1="86" x2="140" y2="86" />
        <line x1="108" y1="103" x2="156" y2="103" />
      </g>
      <path d="M142 86 l-8 -3 v6 z" fill="currentColor" />
      <path d="M158 103 l-8 -3 v6 z" fill="currentColor" />
      <line x1="108" y1={EJE} x2="172" y2={EJE} stroke={ROJO} strokeWidth="2.6" />
      <path d="M174 120 l-9 -4 v8 z" fill={ROJO} />

      <g fontSize="8.5" textAnchor="end" fill="currentColor">
        <text x="104" y="89">Ar tangencial</text>
        <text x="104" y="106">Ar auxiliar</text>
        <text x="104" y="123" fill={ROJO}>
          MUESTRA nebulizada
        </text>
      </g>

      {/* bobina de induccion, por fuera del tubo exterior */}
      <g fill="none" stroke="currentColor" strokeWidth="1.8">
        {[246, 264, 282].map((cx) => (
          <ellipse key={cx} cx={cx} cy={EJE} rx="6" ry="46" />
        ))}
      </g>
      <line x1="230" y1="66" x2="230" y2="74" stroke="currentColor" strokeWidth="0.8" />
      <text x="230" y="62" textAnchor="middle" fontSize="8.5" fill="currentColor">
        Bobina de radiofrecuencia
      </text>

      <text x="336" y="62" textAnchor="middle" fontSize="8.5" fill="currentColor">
        base: hasta 10 000 K
      </text>
      <line x1="336" y1="66" x2="322" y2="92" stroke="currentColor" strokeWidth="0.8" />

      {/* zona de medida: dentro del plasma y por detras de la bobina */}
      <g stroke={ROJO} strokeWidth="1.6">
        <line x1="356" y1="96" x2="356" y2="144" />
        <line x1="350" y1="96" x2="362" y2="96" />
        <line x1="350" y1="144" x2="362" y2="144" />
      </g>
      <text x="356" y="190" textAnchor="middle" fontSize="8.5" fill={ROJO}>
        zona de medida: 6 000 - 8 000 K
      </text>
      <line x1="356" y1="144" x2="356" y2="182" stroke={ROJO} strokeWidth="0.8" strokeDasharray="3 3" />

      {/* cota de la altura de observacion sobre la bobina */}
      <g stroke="currentColor" strokeWidth="1.2">
        <line x1="282" y1="172" x2="356" y2="172" />
        <path d="M282 172 l8 -4 v8 z" fill="currentColor" stroke="none" />
        <path d="M356 172 l-8 -4 v8 z" fill="currentColor" stroke="none" />
      </g>
      <text x="319" y="167" textAnchor="middle" fontSize="8" fill="currentColor">
        15-20 mm
      </text>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="210">
          Tres tubos concéntricos de cuarzo: el Ar exterior va TANGENCIAL y aísla el cuarzo.
        </text>
        <text x="8" y="222">
          Se enciende con una chispa TESLA y se mantiene por INDUCCIÓN: no hay electrodos.
        </text>
      </g>
    </g>
  )
}

/**
 * El ICP-MS entero. Lo que tiene que ensenar es EL SALTO DE PRESION: el plasma
 * trabaja a una atmosfera y el espectrometro en alto vacio, y entre los dos
 * estan los dos conos. Por eso las presiones van rotuladas y se comprueba que
 * caen a lo largo del camino.
 */
function IcpMs() {
  const EJE = 100
  const cono = (x: number, alto: number, hueco: number) => (
    <g key={x} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d={`M${x + 18} ${EJE - alto} L${x} ${EJE - hueco} L${x + 18} ${EJE - hueco} Z`} />
      <path d={`M${x + 18} ${EJE + alto} L${x} ${EJE + hueco} L${x + 18} ${EJE + hueco} Z`} />
    </g>
  )

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* nebulizador y camara */}
      <rect x="8" y="84" width="44" height="32" rx="4" {...trazo} />
      <path d="M18 100 h12 M30 94 l10 6 l-10 6" fill="none" stroke="currentColor" strokeWidth="1.4" />

      {/* antorcha y plasma */}
      <g stroke="currentColor" strokeWidth="1.6">
        <line x1="62" y1="86" x2="112" y2="86" />
        <line x1="62" y1="114" x2="112" y2="114" />
      </g>
      <path
        d="M112 82 Q136 74 152 88 Q168 100 152 112 Q136 126 112 118 Z"
        fill={AZUL_CLARO}
        fillOpacity="0.9"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      {/* el haz de iones */}
      <line x1="112" y1={EJE} x2="182" y2={EJE} stroke={ROJO} strokeWidth="3" />
      <line x1="182" y1={EJE} x2="217" y2={EJE} stroke={ROJO} strokeWidth="2" />
      <line x1="217" y1={EJE} x2="440" y2={EJE} stroke={ROJO} strokeWidth="1.3" />

      {/* la interfase: cono de muestreo y cono skimmer */}
      {cono(182, 34, 4)}
      {cono(217, 26, 3)}

      {/* lentes ionicas */}
      <g stroke="currentColor" strokeWidth="1.6">
        {[254, 270, 286].map((x) => (
          <g key={x}>
            <line x1={x} y1="78" x2={x} y2="94" />
            <line x1={x} y1="106" x2={x} y2="122" />
          </g>
        ))}
      </g>

      {/* cuadrupolo: cuatro barras */}
      <g {...trazo}>
        <rect x="320" y="74" width="100" height="10" rx="5" />
        <rect x="320" y="116" width="100" height="10" rx="5" />
        <rect x="332" y="86" width="76" height="7" rx="3.5" />
        <rect x="332" y="107" width="76" height="7" rx="3.5" />
      </g>

      {/* detector */}
      <rect x="440" y="84" width="46" height="32" rx="4" {...trazo} />
      <path d="M450 108 l10 -14 l10 8" fill="none" stroke="currentColor" strokeWidth="1.4" />

      {/* separadores de las zonas de presion */}
      <g stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6">
        <line x1="178" y1="60" x2="178" y2="140" />
        <line x1="213" y1="60" x2="213" y2="140" />
        <line x1="245" y1="60" x2="245" y2="140" />
      </g>

      <Rotulo
        x={150}
        y={38}
        hacia={[190, 70]}
        lineas={['Cono de muestreo', '(sampler), ≈ 1 mm']}
      />
      <Rotulo x={272} y={44} hacia={[228, 78]} derecha lineas={['Cono skimmer']} />

      <g fontSize="9.5" textAnchor="middle" fill="currentColor" fontWeight="bold">
        <text x="30" y="170">Nebulizador</text>
        <text x="132" y="170">Antorcha y plasma</text>
        <text x="214" y="170">Interfase</text>
        <text x="282" y="170">Lentes iónicas</text>
        <text x="370" y="170">Cuadrupolo</text>
        <text x="463" y="170">Detector</text>
      </g>
      <g fontSize="8" textAnchor="middle" fill="currentColor">
        <text x="30" y="182">y cámara</text>
        <text x="132" y="182">6 000 - 8 000 K</text>
        <text x="214" y="182">los dos conos</text>
        <text x="282" y="182">enfocan los iones</text>
        <text x="370" y="182">separa por m/z</text>
        <text x="463" y="182">cuenta iones</text>
      </g>

      <g fontSize="8.5" textAnchor="middle" fill={ROJO}>
        <text x="120" y="200">1 atm</text>
        <text x="207" y="200">≈ 1 torr</text>
        <text x="340" y="200">≈ 10⁻⁵ torr</text>
      </g>

      <text x="8" y="216" fontSize="8.5" fill="currentColor">
        El salto de presión es lo característico del ICP-MS: el plasma está a 1 atm y el espectrómetro,
        en alto vacío.
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
    case 'celda-conductividad':
      return <CeldaConductividad />
    case 'sonda-oxigeno':
      return <SondaOxigeno />
    case 'espectrofotometro':
      return <Espectrofotometro />
    case 'ley-beer':
      return <LeyBeer />
    case 'desviacion-beer':
      return <DesviacionBeer />
    case 'linea-vs-banda':
      return <LineaVsBanda />
    case 'lampara-catodo-hueco':
      return <LamparaCatodoHueco />
    case 'absorcion-atomica':
      return <AbsorcionAtomica />
    case 'horno-grafito':
      return <HornoGrafito />
    case 'antorcha-icp':
      return <AntorchaIcp />
    case 'icp-ms':
      return <IcpMs />
  }
}

export default function Esquema({
  tipo,
  tamano,
  etiqueta,
}: {
  tipo: TipoEsquema
  /**
   * Ancho en px. Por defecto, el ANCHO NATURAL del lienzo: asi una unidad del
   * dibujo es un pixel y los rotulos miden lo mismo en todos los esquemas,
   * midan lo que midan sus lienzos. Con un ancho fijo, el esquema mas ancho
   * encogia su letra hasta hacerla ilegible.
   */
  tamano?: number
  /** Nombre accesible; por defecto, el del catalogo */
  etiqueta?: string
}) {
  const { ancho, alto } = LIENZOS[tipo]
  const nombre = etiqueta ?? NOMBRES_ESQUEMA[tipo]
  const anchoFinal = tamano ?? ancho

  return (
    <svg
      viewBox={`0 0 ${ancho} ${alto}`}
      width={anchoFinal}
      height={(anchoFinal * alto) / ancho}
      role="img"
      aria-label={nombre}
      className="figura-svg figura-esquema"
    >
      <title>{nombre}</title>
      <Dibujo tipo={tipo} />
    </svg>
  )
}
