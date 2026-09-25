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
  'nefelometro-turbidimetro': 'Medida de la turbidez: nefelometría a 90° y turbidimetría en línea',
  'refractometro-abbe': 'Refractómetro de Abbe: ángulo límite y campo del ocular',
  polarimetro: 'Polarímetro: el plano de polarización gira en el tubo',
  cromatograma: 'Cromatograma: tiempos de retención, anchura de pico y resolución',
  'cromatografo-ionico': 'Cromatógrafo iónico: del eluyente al detector de conductividad',
  'cromatografo-gases': 'Cromatógrafo de gases: la columna va dentro del horno',
  'purga-y-trampa': 'Purga y trampa frente a espacio de cabeza',
  'fase-normal-vs-inversa': 'Fase normal frente a fase inversa: el orden de elución se invierte',
  'gradiente-elucion': 'Elución isocrática frente a elución en gradiente',
  'cloracion-punto-ruptura': 'Curva de cloración al punto de ruptura',
  'alcalinidad-valoracion': 'Valoración de la alcalinidad: los dos puntos finales',
  'dbo-frente-a-dqo': 'Curva de la DBO frente a la DQO',
  'solidos-del-agua': 'Los sólidos de un agua, separados por filtración y por calcinación',
  'nitrogeno-total-fracciones': 'Las fracciones del nitrógeno: Kjeldahl no es el total',
  'nca-metales-dureza': 'La NCA de los metales sube con la dureza del agua',
  'envase-camara-de-aire': 'El envase de microbiología deja cámara de aire; el fisicoquímico, no',
  'grifo-tres-objetivos': 'Los tres objetivos del muestreo en grifo',
  'corte-pm10-pm25': 'Las curvas de corte de PM10 y PM2,5: el 50 % de eficiencia',
  'captacion-pm-y-metales': 'Del cabezal al ICP-MS: un filtro, dos determinaciones',
  'dianas-veracidad-precision': 'Veracidad y precisión: cuatro dianas',
  'incertidumbre-en-cuadratura': 'Las incertidumbres se suman en cuadratura: uc es la hipotenusa',
  'intervalo-de-trabajo': 'Del LD al final de la recta: el intervalo de trabajo',
  'grafico-control-x': 'Gráfico de control X: aviso a ±2s, acción a ±3s',
  'recta-minimos-cuadrados': 'La recta de calibrado por mínimos cuadrados, con sus residuos',
  'cadena-trazabilidad': 'La cadena de trazabilidad: la incertidumbre crece en cada eslabón',
  'acreditacion-certificacion': 'Quién acredita y quién certifica',
  'ciclo-acreditacion': 'El ciclo de acreditación: 4 años el primero, 5 los siguientes',
  'estructura-plan-igualdad': 'El II Plan de Igualdad municipal: ejes, líneas y objetivos',
  'circuito-protocolo-acoso': 'El circuito de una denuncia en el protocolo frente al acoso',
  'instituciones-aragon': 'Las instituciones de Aragón y cómo se relacionan',
  'clases-competencias': 'Las tres clases de competencias: quién legisla y quién ejecuta',
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
  'nefelometro-turbidimetro': { ancho: 500, alto: 268 },
  'refractometro-abbe': { ancho: 470, alto: 250 },
  polarimetro: { ancho: 520, alto: 232 },
  cromatograma: { ancho: 470, alto: 250 },
  'cromatografo-ionico': { ancho: 580, alto: 228 },
  'cromatografo-gases': { ancho: 580, alto: 250 },
  'purga-y-trampa': { ancho: 540, alto: 236 },
  'fase-normal-vs-inversa': { ancho: 540, alto: 252 },
  'gradiente-elucion': { ancho: 540, alto: 240 },
  'cloracion-punto-ruptura': { ancho: 500, alto: 284 },
  'alcalinidad-valoracion': { ancho: 490, alto: 282 },
  'dbo-frente-a-dqo': { ancho: 510, alto: 290 },
  'solidos-del-agua': { ancho: 560, alto: 300 },
  'nitrogeno-total-fracciones': { ancho: 540, alto: 268 },
  'nca-metales-dureza': { ancho: 530, alto: 292 },
  'envase-camara-de-aire': { ancho: 520, alto: 292 },
  'grifo-tres-objetivos': { ancho: 570, alto: 300 },
  'corte-pm10-pm25': { ancho: 520, alto: 312 },
  'captacion-pm-y-metales': { ancho: 580, alto: 300 },
  'dianas-veracidad-precision': { ancho: 540, alto: 342 },
  'incertidumbre-en-cuadratura': { ancho: 560, alto: 300 },
  'intervalo-de-trabajo': { ancho: 540, alto: 322 },
  'grafico-control-x': { ancho: 560, alto: 322 },
  'recta-minimos-cuadrados': { ancho: 540, alto: 372 },
  'cadena-trazabilidad': { ancho: 580, alto: 272 },
  'acreditacion-certificacion': { ancho: 580, alto: 350 },
  'ciclo-acreditacion': { ancho: 580, alto: 262 },
  'estructura-plan-igualdad': { ancho: 580, alto: 360 },
  'circuito-protocolo-acoso': { ancho: 580, alto: 352 },
  'instituciones-aragon': { ancho: 580, alto: 398 },
  'clases-competencias': { ancho: 580, alto: 306 },
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

/**
 * La medida de la turbidez, con LAS DOS GEOMETRIAS EN EL MISMO DIBUJO.
 *
 * Es lo unico que hay que retener del asunto, y es lo que preguntan: misma
 * fuente, misma cubeta y DOS detectores. El que mira A 90 GRADOS recoge la luz
 * dispersada -nefelometria, unidades UNF/FNU-; el que esta EN LINEA mide cuanto
 * se ha atenuado el haz -turbidimetria, unidades FAU-. Los `data-pieza` los lee
 * la bateria para medir los dos angulos y comprobar que el haz sale mas fino
 * del que entro: una figura que pusiera el detector de nefelometria en linea se
 * pintaria igual de bien y ensenaria lo contrario.
 */
function NefelometroTurbidimetro() {
  const EJE = 70
  const CX = 200
  const particulas: [number, number][] = [
    [182, 54],
    [206, 62],
    [190, 82],
    [216, 88],
    [222, 50],
  ]
  // la luz se dispersa en TODAS direcciones: es lo que justifica las dos geometrias
  const difusos = [-142, -108, -62, -28, 28, 62, 118, 152]

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* fuente */}
      <rect x="10" y="52" width="48" height="36" rx="4" {...trazo} />
      <path
        d="M24 60 l14 10 l-14 10 z M42 58 v24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      {/* haz incidente, grueso */}
      <line
        data-pieza="haz-incidente"
        x1="58"
        y1={EJE}
        x2="168"
        y2={EJE}
        stroke={ROJO}
        strokeWidth="3.4"
      />

      {/* cubeta con las particulas en suspension */}
      <rect
        data-pieza="cubeta"
        x="168"
        y="40"
        width="64"
        height="60"
        fill={AZUL}
        fillOpacity="0.5"
      />
      <rect x="168" y="40" width="64" height="60" {...trazo} />
      <g fill="currentColor" opacity="0.75">
        {particulas.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" />
        ))}
      </g>

      {/* luz dispersada en todas direcciones, tenue */}
      <g stroke={ROJO} strokeWidth="0.9" opacity="0.45">
        {difusos.map((g) => {
          const r = (g * Math.PI) / 180
          return (
            <line
              key={g}
              x1={CX}
              y1={EJE}
              x2={CX + 40 * Math.cos(r)}
              y2={EJE + 40 * Math.sin(r)}
            />
          )
        })}
      </g>

      {/* haz transmitido: sale ATENUADO */}
      <line
        data-pieza="haz-transmitido"
        x1="232"
        y1={EJE}
        x2="344"
        y2={EJE}
        stroke={ROJO}
        strokeWidth="1.2"
      />
      <rect data-pieza="detector-180" x="344" y="52" width="58" height="36" rx="4" {...trazo} />
      <path d="M356 80 l10 -14 l10 8" fill="none" stroke="currentColor" strokeWidth="1.4" />

      {/* rama de 90 grados */}
      <line
        data-pieza="haz-dispersado"
        x1={CX}
        y1="100"
        x2={CX}
        y2="158"
        stroke={ROJO}
        strokeWidth="1.6"
      />
      <path d={`M${CX} 160 l-4 -9 h8 z`} fill={ROJO} />
      <rect data-pieza="detector-90" x="171" y="160" width="58" height="36" rx="4" {...trazo} />
      <path d="M183 188 l10 -14 l10 8" fill="none" stroke="currentColor" strokeWidth="1.4" />

      {/* el angulo recto, que es el dato de la norma */}
      <path
        d={`M${CX + 50} ${EJE} A50 50 0 0 1 ${CX} ${EJE + 50}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <text x={CX + 54} y={EJE + 44} fontSize="8.5" fill="currentColor">
        90°
      </text>

      <text x={CX} y="32" textAnchor="middle" fontSize="8.5" fill="currentColor">
        Cubeta con la muestra
      </text>

      <g fontSize="9.5" textAnchor="middle" fill="currentColor" fontWeight="bold">
        <text x="34" y="112">Fuente</text>
        <text x="373" y="112">Turbidimetría</text>
        <text x={CX} y="214">Nefelometría</text>
      </g>
      <g fontSize="8" textAnchor="middle" fill="currentColor">
        <text x="34" y="124">LED 860 ± 60 nm</text>
        <text x="373" y="124">detector EN LÍNEA</text>
        <text x="373" y="134">mide la atenuación</text>
        <text x="373" y="144">FAU · aguas turbias</text>
        <text x={CX} y="226">detector A 90°</text>
        <text x={CX} y="236">mide la luz dispersada</text>
        <text x={CX} y="246">FNU = UNF · aguas claras</text>
      </g>

      <text x="8" y="262" fontSize="8.5" fill="currentColor">
        Misma fuente y misma cubeta: lo que cambia es DÓNDE se pone el detector.
      </text>
    </g>
  )
}

/**
 * El refractometro de Abbe. Ensena las dos cosas que hay que entender:
 *
 *  1. La luz pasa de la muestra al prisma, MAS denso, asi que el rayo SE ACERCA
 *     a la normal. El rayo rasante marca el angulo limite, y de ahi sale n.
 *  2. Lo que se ve por el ocular es una linea de separacion claro/oscuro, que
 *     hay que centrar en la cruz del reticulo ANTES de leer.
 *
 * Las dos son afirmaciones medibles, y las dos se miden: un dibujo con el rayo
 * alejandose de la normal, o con la linea descentrada, ensena lo contrario.
 */
function RefractometroAbbe() {
  const P: [number, number] = [120, 106]
  const CRITICO: [number, number] = [159, 182]
  const OC = { cx: 386, cy: 110, r: 52 }

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* prisma de iluminacion, con la cara inferior MATE */}
      <rect x="40" y="34" width="160" height="64" fill={AZUL_CLARO} fillOpacity="0.45" />
      <rect x="40" y="34" width="160" height="64" {...trazo} />
      <path
        d={`M40 98 ${Array.from({ length: 13 }, () => 'l6 -5 l6 5').join(' ')}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      />

      {/* pelicula de muestra entre los dos prismas */}
      <rect x="40" y="98" width="160" height="8" fill={AZUL} fillOpacity="0.85" />

      {/* prisma de refraccion, pulido */}
      <rect x="40" y="106" width="160" height="76" fill={AZUL_CLARO} fillOpacity="0.25" />
      <rect x="40" y="106" width="160" height="76" {...trazo} />

      {/*
        A la derecha del rayo limite no llega luz. Se marca RAYANDO la zona, no
        oscureciendola: un relleno oscuro se ve claro sobre el tema oscuro y el
        dibujo ensenaria lo contrario segun el tema del usuario.
      */}
      <g stroke="currentColor" strokeWidth="0.7" opacity="0.5">
        {Array.from({ length: 12 }, (_, i) => {
          const y = 112 + i * 6
          return <line key={y} x1={P[0] + ((y - P[1]) * 39) / 76} y1={y} x2="200" y2={y} />
        })}
      </g>

      {/* normal al plano de separacion */}
      <line
        data-pieza="normal"
        x1="120"
        y1="70"
        x2="120"
        y2="188"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeDasharray="4 3"
      />

      {/* rayo rasante dentro de la muestra y rayo limite dentro del prisma */}
      <line
        data-pieza="rayo-incidente"
        x1="48"
        y1="102"
        x2={P[0]}
        y2={P[1]}
        stroke={ROJO}
        strokeWidth="2.2"
      />
      <line
        data-pieza="rayo-refractado"
        x1={P[0]}
        y1={P[1]}
        x2={CRITICO[0]}
        y2={CRITICO[1]}
        stroke={ROJO}
        strokeWidth="2.2"
      />
      {/* los demas rayos caen SIEMPRE dentro del angulo limite */}
      <g stroke={ROJO} strokeWidth="0.9" opacity="0.5">
        {[10, 18, 26].map((g) => {
          const r = (g * Math.PI) / 180
          return (
            <line
              key={g}
              x1={P[0]}
              y1={P[1]}
              x2={P[0] + 74 * Math.sin(r)}
              y2={P[1] + 74 * Math.cos(r)}
            />
          )
        })}
      </g>

      <path d="M120 130 A24 24 0 0 0 131 150" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <line x1="116" y1="148" x2="126" y2="142" stroke="currentColor" strokeWidth="0.8" />

      <g fontSize="8.5" fill="currentColor">
        <text x="124" y="78">normal</text>
        <text x="46" y="88">i → 90° (rasante)</text>
        <text x="114" y="151" textAnchor="end">
          ángulo límite
        </text>
        <text x="204" y="104">película de muestra</text>
      </g>
      <line x1="204" y1="137" x2="186" y2="141" stroke="currentColor" strokeWidth="0.8" />
      <text x="206" y="140" fontSize="8" fill="currentColor">
        sombra: aquí no llega ningún rayo
      </text>

      {/* campo del ocular: mitad clara, mitad rayada, y la cruz del reticulo */}
      <path
        d={`M${OC.cx - OC.r} ${OC.cy} A${OC.r} ${OC.r} 0 0 1 ${OC.cx + OC.r} ${OC.cy} Z`}
        fill={AZUL_CLARO}
        fillOpacity="0.75"
      />
      <g stroke="currentColor" strokeWidth="0.7" opacity="0.5">
        {Array.from({ length: 8 }, (_, i) => {
          const y = OC.cy + 6 + i * 6
          const semi = Math.sqrt(OC.r * OC.r - (y - OC.cy) ** 2)
          return <line key={y} x1={OC.cx - semi} y1={y} x2={OC.cx + semi} y2={y} />
        })}
      </g>
      <circle data-pieza="ocular" cx={OC.cx} cy={OC.cy} r={OC.r} {...trazo} />
      <g stroke="currentColor" strokeWidth="1.2">
        <line x1={OC.cx - 36} y1={OC.cy - 36} x2={OC.cx + 36} y2={OC.cy + 36} />
        <line x1={OC.cx + 36} y1={OC.cy - 36} x2={OC.cx - 36} y2={OC.cy + 36} />
      </g>
      <line
        data-pieza="frontera"
        x1={OC.cx - OC.r}
        y1={OC.cy}
        x2={OC.cx + OC.r}
        y2={OC.cy}
        stroke={ROJO}
        strokeWidth="2.2"
      />

      <g fontSize="8" textAnchor="middle" fill="currentColor">
        <text x={OC.cx} y={OC.cy - 26}>claro</text>
        <text x={OC.cx} y={OC.cy + 34}>oscuro</text>
      </g>

      <g fontSize="9.5" textAnchor="middle" fill="currentColor" fontWeight="bold">
        <text x="120" y="26">Prisma de iluminación (mate)</text>
        <text x="120" y="200">Prisma de refracción (pulido)</text>
        <text x={OC.cx} y="186">Campo del ocular</text>
      </g>
      <g fontSize="8" textAnchor="middle" fill="currentColor">
        <text x={OC.cx} y="198">se centra la línea en la cruz</text>
        <text x={OC.cx} y="208">y se lee el índice nD a 20 °C</text>
      </g>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="230">
          La luz pasa de la muestra al prisma, más denso: el rayo SE ACERCA a la normal.
        </text>
        <text x="8" y="242">
          Con luz blanca, el compensador de Amici devuelve el valor de la línea D del sodio.
        </text>
      </g>
    </g>
  )
}

/**
 * El polarimetro. Lo que tiene que quedar claro es DONDE gira el plano: la luz
 * sale natural, el POLARIZADOR la deja vibrando en un solo plano, y el plano
 * sigue igual hasta que atraviesa EL TUBO; alli, y solo alli, la sustancia
 * quiral lo gira un angulo alfa, que es lo que el ANALIZADOR tiene que girar
 * para volver a dejar pasar la luz.
 *
 * La bateria comprueba las dos cosas: que ninguna marca anterior al tubo este
 * girada, y que el analizador lleve girado el mismo angulo que el plano de
 * salida.
 */
function Polarimetro() {
  const EJE = 88
  const ALFA = 30
  const rad = (g: number) => (g * Math.PI) / 180

  /** Marca del plano de vibracion: vertical si t = 0, girada t grados si no. */
  const plano = (x: number, t: number, h = 16) => {
    const dx = h * Math.sin(rad(t))
    const dy = h * Math.cos(rad(t))
    return (
      <line
        key={`${x}-${t}`}
        data-pieza="plano"
        x1={x - dx}
        y1={EJE - dy}
        x2={x + dx}
        y2={EJE + dy}
        stroke={ROJO}
        strokeWidth="2"
      />
    )
  }

  /*
   * Analizador: la misma laja del polarizador, con sus vertices ya girados.
   *
   * OJO AL SIGNO. En SVG la y crece hacia ABAJO, asi que la matriz de giro
   * "de toda la vida" gira al reves de como lo hacen las marcas del plano, y la
   * laja sale cruzada con su propia rejilla. Paso comprobado: la primera
   * version tenia ese fallo y los controles la daban por buena, porque miraban
   * la rejilla y no el contorno. Ahora se mira tambien el contorno.
   */
  const AX = 428
  const gira = (dx: number, dy: number): [number, number] => [
    AX + dx * Math.cos(rad(ALFA)) + dy * Math.sin(rad(ALFA)),
    EJE - dx * Math.sin(rad(ALFA)) + dy * Math.cos(rad(ALFA)),
  ]
  const laja = [gira(-8, -36), gira(8, -36), gira(8, 36), gira(-8, 36)]

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* lampara de sodio */}
      <rect x="14" y="70" width="48" height="36" rx="4" {...trazo} />
      <path d="M26 88 h10 M36 80 q8 8 0 16" fill="none" stroke="currentColor" strokeWidth="1.4" />

      {/* luz natural: vibra en todos los planos */}
      <line x1="62" y1={EJE} x2="96" y2={EJE} stroke={ROJO} strokeWidth="1.2" />
      <g stroke={ROJO} strokeWidth="1.5">
        {[74, 86].map((x) =>
          [0, 45, 90, 135].map((g) => (
            <line
              key={`${x}-${g}`}
              x1={x - 9 * Math.sin(rad(g))}
              y1={EJE - 9 * Math.cos(rad(g))}
              x2={x + 9 * Math.sin(rad(g))}
              y2={EJE + 9 * Math.cos(rad(g))}
            />
          )),
        )}
      </g>

      {/* polarizador */}
      <rect x="96" y="52" width="16" height="72" fill={AZUL_CLARO} fillOpacity="0.8" />
      <rect x="96" y="52" width="16" height="72" {...trazo} />
      <g stroke="currentColor" strokeWidth="0.9">
        {[99, 103, 107, 111].map((x) => (
          <line key={x} x1={x} y1="54" x2={x} y2="122" />
        ))}
      </g>

      {/* luz polarizada en un plano: vertical hasta el tubo */}
      <line x1="112" y1={EJE} x2="206" y2={EJE} stroke={ROJO} strokeWidth="1.2" />
      {[132, 160, 188].map((x) => plano(x, 0))}

      {/* tubo portamuestras */}
      <rect
        data-pieza="tubo"
        x="206"
        y="64"
        width="138"
        height="48"
        fill={AZUL}
        fillOpacity="0.35"
      />
      <rect x="206" y="64" width="138" height="48" {...trazo} />
      <line x1="206" y1={EJE} x2="344" y2={EJE} stroke={ROJO} strokeWidth="2" />
      <g stroke="currentColor" strokeWidth="1.2">
        <line x1="206" y1="128" x2="344" y2="128" />
        <path d="M206 128 l8 -4 v8 z" fill="currentColor" stroke="none" />
        <path d="M344 128 l-8 -4 v8 z" fill="currentColor" stroke="none" />
      </g>
      <text x="275" y="142" textAnchor="middle" fontSize="8" fill="currentColor">
        1 dm (100 mm)
      </text>

      {/* a la salida, el plano va girado alfa */}
      <line x1="344" y1={EJE} x2="402" y2={EJE} stroke={ROJO} strokeWidth="1.2" />
      {[364, 390].map((x) => plano(x, ALFA))}

      {/* el angulo girado, medido sobre la marca de la izquierda */}
      <path
        d={`M364 ${EJE - 24} A24 24 0 0 1 376 ${EJE - 20.8}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <text x="378" y="62" fontSize="9" fill={ROJO}>
        α
      </text>

      {/* analizador */}
      <path
        data-pieza="analizador-laja"
        d={`M${laja[0][0]} ${laja[0][1]} L${laja[1][0]} ${laja[1][1]} L${laja[2][0]} ${laja[2][1]} L${laja[3][0]} ${laja[3][1]} Z`}
        fill={AZUL_CLARO}
        fillOpacity="0.8"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <g stroke="currentColor" strokeWidth="0.9">
        {[-5, -1.7, 1.7, 5].map((s) => {
          const cx = AX + s * Math.cos(rad(ALFA))
          const cy = EJE - s * Math.sin(rad(ALFA))
          const dx = 30 * Math.sin(rad(ALFA))
          const dy = 30 * Math.cos(rad(ALFA))
          return (
            <line
              key={s}
              data-pieza="analizador"
              x1={cx - dx}
              y1={cy - dy}
              x2={cx + dx}
              y2={cy + dy}
            />
          )
        })}
      </g>

      {/* detector y lectura */}
      <line x1="454" y1={EJE} x2="458" y2={EJE} stroke={ROJO} strokeWidth="1.2" />
      <rect x="458" y="70" width="56" height="36" rx="4" {...trazo} />
      <text x="486" y="93" textAnchor="middle" fontSize="11" fill="currentColor">
        +13,2°
      </text>

      <g fontSize="9.5" textAnchor="middle" fill="currentColor" fontWeight="bold">
        <text x="38" y="168">Fuente</text>
        <text x="104" y="168">Polarizador</text>
        <text x="275" y="168">Tubo de muestra</text>
        <text x={AX} y="168">Analizador</text>
        <text x="486" y="168">Detector</text>
      </g>
      <g fontSize="8" textAnchor="middle" fill="currentColor">
        <text x="38" y="180">Na · 589,3 nm</text>
        <text x="104" y="180">prisma de Nicol</text>
        <text x="275" y="180">aquí gira el plano</text>
        <text x={AX} y="180">girado α</text>
        <text x="486" y="180">lectura de α</text>
      </g>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="204">
          Solo giran el plano las sustancias QUIRALES (ópticamente activas).
        </text>
        <text x="8" y="216">
          [α] = α / (l · c), con l en dm y c en g/mL, a 20 °C y en la línea D del sodio.
        </text>
      </g>
    </g>
  )
}

/* ---------- Tema 30: cromatografia ---------- */

/**
 * Cromatograma con lo que de verdad se mide en el: el tiempo muerto, los dos
 * tiempos de retencion, las dos anchuras de pico y la resolucion que sale de
 * ellos.
 *
 * LOS PICOS SE CALCULAN, no se dibujan a ojo: son gaussianas muestreadas, y la
 * anchura de base w = 4σ es la que resulta de prolongar las tangentes de los
 * puntos de inflexion hasta la linea base, que es como la define el manual. Asi
 * el dibujo puede DEMOSTRAR su propia aritmetica: el control de la bateria
 * recalcula Rs = 2·(tR_B − tR_A)/(w_A + w_B) sobre la geometria pintada y exige
 * que coincida con el numero escrito al pie. Un cromatograma con los picos
 * bonitos y la resolucion inventada es justo el fallo silencioso que el
 * proyecto persigue.
 */
function datosCromatograma() {
  const BASE = 170
  const gauss = (c: number, sigma: number, h: number) => {
    const pts: string[] = []
    for (let x = c - 3.2 * sigma; x <= c + 3.2 * sigma; x += 1) {
      const y = BASE - h * Math.exp(-((x - c) ** 2) / (2 * sigma * sigma))
      pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    return pts.join(' ')
  }
  // sigma en px; la anchura de base es 4σ
  const A = { c: 190, sigma: 12, h: 104 }
  const B = { c: 271, sigma: 15, h: 76 }
  const M = { c: 76, sigma: 4.5, h: 26 }
  return { BASE, gauss, A, B, M }
}

function Cromatograma() {
  const { BASE, gauss, A, B, M } = datosCromatograma()
  const wA = 4 * A.sigma
  const wB = 4 * B.sigma
  const rs = (2 * (B.c - A.c)) / (wA + wB)

  /** Doble flecha horizontal que mide una anchura de base. */
  const medida = (pieza: string, x1: number, x2: number, y: number) => (
    <g stroke="currentColor" strokeWidth="1.1">
      <line data-pieza={pieza} x1={x1} y1={y} x2={x2} y2={y} />
      <path d={`M${x1 + 5} ${y - 3.5} L${x1} ${y} L${x1 + 5} ${y + 3.5}`} fill="none" />
      <path d={`M${x2 - 5} ${y - 3.5} L${x2} ${y} L${x2 - 5} ${y + 3.5}`} fill="none" />
    </g>
  )

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* ejes */}
      <g stroke="currentColor" strokeWidth="1.6">
        <line x1="46" y1="26" x2="46" y2={BASE} />
        <line x1="46" y1={BASE} x2="446" y2={BASE} />
      </g>
      <text x="44" y="16" fontSize="8.5" fill="currentColor">
        respuesta del detector
      </text>
      <text x="446" y={BASE + 13} fontSize="8.5" fill="currentColor" textAnchor="end">
        tiempo
      </text>

      {/* los tres picos, calculados */}
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <path data-pieza="pico-m" d={gauss(M.c, M.sigma, M.h)} />
        <path data-pieza="pico-a" d={gauss(A.c, A.sigma, A.h)} />
        <path data-pieza="pico-b" d={gauss(B.c, B.sigma, B.h)} />
      </g>

      {/* marcas verticales de los tiempos, cada una hasta su propia cima */}
      <g stroke={ROJO} strokeWidth="1.1" strokeDasharray="3 3">
        <line data-pieza="tm" x1={M.c} y1={BASE - M.h} x2={M.c} y2={BASE} />
        <line data-pieza="tr-a" x1={A.c} y1={BASE - A.h} x2={A.c} y2={BASE} />
        <line data-pieza="tr-b" x1={B.c} y1={BASE - B.h} x2={B.c} y2={BASE} />
      </g>

      {/* anchuras de base: tangentes de los puntos de inflexion hasta la base */}
      <g stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 2" opacity="0.75">
        <line x1={A.c - 2 * A.sigma} y1={BASE} x2={A.c - A.sigma} y2={BASE - A.h * 0.607} />
        <line x1={A.c + 2 * A.sigma} y1={BASE} x2={A.c + A.sigma} y2={BASE - A.h * 0.607} />
        <line x1={B.c - 2 * B.sigma} y1={BASE} x2={B.c - B.sigma} y2={BASE - B.h * 0.607} />
        <line x1={B.c + 2 * B.sigma} y1={BASE} x2={B.c + B.sigma} y2={BASE - B.h * 0.607} />
      </g>
      {medida('w-a', A.c - 2 * A.sigma, A.c + 2 * A.sigma, 186)}
      {medida('w-b', B.c - 2 * B.sigma, B.c + 2 * B.sigma, 186)}

      {/* rotulos de tiempo, sobre cada cima para no chocar con las anchuras */}
      <g fontSize="9" fill={ROJO} textAnchor="middle">
        <text x={M.c} y={BASE - M.h - 7}>
          tM
        </text>
        <text x={A.c} y={BASE - A.h - 7}>
          tR(A)
        </text>
        <text x={B.c} y={BASE - B.h - 7}>
          tR(B)
        </text>
      </g>
      <text x={M.c + 10} y={BASE - M.h - 18} fontSize="8" fill="currentColor" textAnchor="middle">
        no retenidos
      </text>

      <g fontSize="9" fill="currentColor" textAnchor="middle">
        <text x={A.c} y="200">
          wA
        </text>
        <text x={B.c} y="200">
          wB
        </text>
      </g>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="222">
Resolución: Rs = 2 · [tR(B) − tR(A)] / (wA + wB). A MENOR anchura de pico, MAYOR resolución.
        </text>
        <text x="8" y="240" data-pieza="rs">
          {`Aquí Rs = ${rs.toFixed(1).replace(".", ",")}, el valor a partir del cual la separación de dos picos se considera completa.`}
        </text>
      </g>
      {/* el numero escrito sale del propio dibujo, y la bateria lo recalcula */}
    </g>
  )
}

/**
 * Cromatografo ionico, de izquierda a derecha.
 *
 * Lo que el dibujo AFIRMA, y la bateria comprueba, es que el SUPRESOR va entre
 * la columna separadora y el detector: ese es su sitio y su razon de ser
 * -rebajar la conductividad del eluyente antes de medir-, y ponerlo en
 * cualquier otro punto de la cadena lo deja sin sentido.
 */
function CromatografoIonico() {
  const EJE = 88
  const ETAPAS: { pieza: string; x: number; w: number; nombre: string; pie: string }[] = [
    { pieza: 'eluyente', x: 8, w: 52, nombre: 'Eluyente', pie: 'depósito' },
    { pieza: 'bomba', x: 76, w: 48, nombre: 'Bomba', pie: 'alta presión' },
    { pieza: 'inyector', x: 140, w: 54, nombre: 'Inyector', pie: 'bucle de muestra' },
    { pieza: 'precolumna', x: 210, w: 48, nombre: 'Precolumna', pie: 'protege' },
    { pieza: 'columna', x: 274, w: 74, nombre: 'Columna', pie: 'intercambio iónico' },
    { pieza: 'supresor', x: 364, w: 56, nombre: 'Supresor', pie: 'baja el fondo' },
    { pieza: 'detector', x: 436, w: 58, nombre: 'Detector', pie: 'conductividad' },
    { pieza: 'registro', x: 510, w: 60, nombre: 'Registro', pie: 'cromatograma' },
  ]

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* la linea de flujo, por detras de las cajas */}
      <line x1="8" y1={EJE} x2="570" y2={EJE} stroke={AZUL} strokeWidth="3" />

      {ETAPAS.map((e) => (
        <rect
          key={e.pieza}
          data-pieza={e.pieza}
          x={e.x}
          y={EJE - 22}
          width={e.w}
          height="44"
          rx="5"
          fill={e.pieza === 'supresor' ? AZUL_CLARO : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
        />
      ))}

      {/* algunos detalles que distinguen las piezas */}
      {/* nivel de liquido en el deposito de eluyente */}
      <path d="M14 96 h40" fill="none" stroke={AZUL} strokeWidth="2.4" />
      <path d="M86 78 h12 M98 72 l10 6 l-10 6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="167" cy={EJE} r="11" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <g stroke="currentColor" strokeWidth="1.1">
        {[286, 296, 306, 316, 326, 336].map((x) => (
          <line key={x} x1={x} y1={EJE - 14} x2={x} y2={EJE + 14} />
        ))}
        {/* la precolumna es una columna corta: el mismo relleno, menos lecho */}
        {[224, 234, 244].map((x) => (
          <line key={x} x1={x} y1={EJE - 9} x2={x} y2={EJE + 9} />
        ))}
      </g>
      {/* membrana del supresor, en rojo para que se lea sobre su propio relleno */}
      <g stroke={ROJO} strokeWidth="1.4">
        <line x1="378" y1={EJE - 11} x2="378" y2={EJE + 11} />
        <line x1="406" y1={EJE - 11} x2="406" y2={EJE + 11} />
      </g>
      <path
        d="M446 96 l10 -16 l8 10 l10 -18"
        fill="none"
        stroke={ROJO}
        strokeWidth="1.4"
      />
      <path
        d="M520 96 q8 -20 14 0 q6 -14 12 0"
        fill="none"
        stroke={ROJO}
        strokeWidth="1.4"
      />

      <g fontSize="9.5" textAnchor="middle" fill="currentColor" fontWeight="bold">
        {ETAPAS.map((e) => (
          <text key={e.pieza} x={e.x + e.w / 2} y="142">
            {e.nombre}
          </text>
        ))}
      </g>
      <g fontSize="7.5" textAnchor="middle" fill="currentColor">
        {ETAPAS.map((e) => (
          <text key={e.pieza} x={e.x + e.w / 2} y="154">
            {e.pie}
          </text>
        ))}
      </g>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="182">
          El SUPRESOR va entre la columna y el detector: cambia los iones del eluyente por agua o por
          un ácido débil,
        </text>
        <text x="8" y="194">
          de modo que baja la conductividad de fondo y deja ver la del analito. Sin él haría falta
          eluyente muy diluido
        </text>
        <text x="8" y="206">
          (cromatografía iónica de columna única). Aniones: resina de amina cuaternaria. Cationes:
          resina sulfónica.
        </text>
      </g>
    </g>
  )
}

/* ---------- Tema 31: cromatografia de gases ---------- */

/**
 * Cromatografo de gases.
 *
 * Lo que el dibujo AFIRMA, y la bateria comprueba, es que la COLUMNA va DENTRO
 * del HORNO y que el inyector y el detector se quedan FUERA. No es un detalle
 * de adorno: la separacion en cromatografia de gases se gobierna con la
 * temperatura de la columna -isoterma o con rampa- y por eso la columna vive en
 * un horno termostatado, mientras que el inyector y el detector se calientan
 * por su cuenta y a otra temperatura.
 */
function CromatografoGases() {
  const EJE = 100
  const HORNO = { x: 196, y: 44, w: 196, h: 112 }

  /** La columna capilar, enrollada: espiral muestreada, no dibujada a ojo. */
  const espiral = () => {
    const pts: string[] = []
    for (let t = 0; t <= 6 * Math.PI; t += 0.1) {
      const r = 8 + (t / (6 * Math.PI)) * 30
      pts.push(`${pts.length ? 'L' : 'M'}${(294 + 1.6 * r * Math.cos(t)).toFixed(1)} ${(EJE + r * Math.sin(t)).toFixed(1)}`)
    }
    return pts.join(' ')
  }

  const ETAPAS = [
    { x: 48, nombre: 'Gas portador', pie: 'He, Ar o N₂' },
    { x: 143, nombre: 'Inyector', pie: 'split / splitless' },
    { x: 294, nombre: 'Horno', pie: 'rampa de temperatura' },
    { x: 447, nombre: 'Detector', pie: 'FID, ECD, TCD, MS' },
    { x: 531, nombre: 'Registro', pie: 'cromatograma' },
  ]

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* la linea de gas, por detras de todo */}
      <g stroke={AZUL} strokeWidth="3">
        <line x1="66" y1={EJE} x2={HORNO.x} y2={EJE} />
        <line x1={HORNO.x + HORNO.w} y1={EJE} x2="566" y2={EJE} />
      </g>

      {/* botella de gas portador con su regulador */}
      <rect data-pieza="gas" x="30" y="60" width="36" height="80" rx="6" {...trazo} />
      <line x1="48" y1="60" x2="48" y2="50" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="48" cy="46" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />

      {/* inyector caliente, con su jeringa y su septo */}
      <rect data-pieza="inyector" x="118" y="64" width="50" height="72" rx="5" {...trazo} />
      <g stroke="currentColor" strokeWidth="1.4" fill="none">
        <line x1="143" y1="34" x2="143" y2="64" />
        <rect x="135" y="18" width="16" height="16" rx="2" />
        <line x1="128" y1="64" x2="158" y2="64" strokeWidth="2.6" />
      </g>

      {/* horno termostatado: la columna vive aqui dentro */}
      <rect
        data-pieza="horno"
        x={HORNO.x}
        y={HORNO.y}
        width={HORNO.w}
        height={HORNO.h}
        rx="6"
        fill={AZUL_CLARO}
        fillOpacity="0.55"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="5 3"
      />
      <path data-pieza="columna" d={espiral()} fill="none" stroke={ROJO} strokeWidth="1.8" />

      {/* detector caliente y registro */}
      <rect data-pieza="detector" x="422" y="64" width="50" height="72" rx="5" {...trazo} />
      <path d="M430 118 l10 -18 l9 12 l11 -20" fill="none" stroke={ROJO} strokeWidth="1.4" />
      <rect data-pieza="registro" x="496" y="70" width="70" height="60" rx="5" {...trazo} />
      <path d="M506 114 q10 -26 18 0 q7 -18 14 0 q6 -10 12 0" fill="none" stroke={ROJO} strokeWidth="1.4" />

      <g fontSize="9.5" textAnchor="middle" fill="currentColor" fontWeight="bold">
        {ETAPAS.map((e) => (
          <text key={e.nombre} x={e.x} y="180">
            {e.nombre}
          </text>
        ))}
      </g>
      <g fontSize="7.5" textAnchor="middle" fill="currentColor">
        {ETAPAS.map((e) => (
          <text key={e.nombre} x={e.x} y="192">
            {e.pie}
          </text>
        ))}
      </g>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="212">
          La COLUMNA va dentro del HORNO, porque en cromatografía de gases la separación se gobierna
          con la temperatura:
        </text>
        <text x="8" y="224">
          isoterma, o con rampa cuando los solutos tienen puntos de ebullición muy distintos. El
          inyector y el detector están
        </text>
        <text x="8" y="236">
          fuera del horno y se calientan aparte. La fase móvil es un gas inerte y su única función es
          transportar el analito.
        </text>
      </g>
    </g>
  )
}

/**
 * Purga y trampa frente a espacio de cabeza.
 *
 * Las dos aislan compuestos volatiles de un agua, y el examen las ofrece como
 * opciones distintas, asi que lo que hay que ver de un vistazo es EN QUE SE
 * DIFERENCIAN. La diferencia es geometrica y el dibujo la afirma:
 *
 *   - en PURGA Y TRAMPA el gas entra POR DEBAJO del nivel del agua y burbujea
 *     a traves de la muestra, arrastrando los volatiles;
 *   - en ESPACIO DE CABEZA no se toca el agua: la jeringa toma vapor POR
 *     ENCIMA, del aire que se ha equilibrado con ella.
 *
 * Son dos controles de la bateria, uno por panel.
 */
function PurgaYTrampa() {
  const FONDO = 152
  const NIVEL_PT = 88
  const NIVEL_HS = 112

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* ---------- panel izquierdo: purga y trampa ---------- */}
      <text x="14" y="18" fontSize="10" fontWeight="bold" fill="currentColor">
        Purga y trampa
      </text>

      {/* vial con la muestra */}
      <rect x="24" y="58" width="58" height={FONDO - 58} rx="3" {...trazo} />
      <rect x="25" y={NIVEL_PT} width="56" height={FONDO - NIVEL_PT - 1} fill={AZUL_CLARO} fillOpacity="0.85" />
      <line data-pieza="nivel-pt" x1="25" y1={NIVEL_PT} x2="81" y2={NIVEL_PT} stroke={AZUL} strokeWidth="2" />
      <text x="86" y={NIVEL_PT + 4} fontSize="7.5" fill="currentColor">
        agua
      </text>

      {/* el gas de purga BAJA hasta el fondo, por debajo del nivel */}
      <line data-pieza="entrada-purga" x1="40" y1="44" x2="40" y2="140" stroke={ROJO} strokeWidth="1.8" />
      <path d="M36 70 l4 6 l4 -6" fill="none" stroke={ROJO} strokeWidth="1.5" />
      <text x="14" y="38" fontSize="7.5" fill={ROJO}>
        gas inerte
      </text>
      <g fill="none" stroke="currentColor" strokeWidth="1.1">
        {[[50, 128], [57, 116], [49, 105], [58, 96]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.2" />
        ))}
      </g>

      {/* salida de los volatiles hacia la trampa */}
      <path d="M66 58 L66 48 L112 48" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M106 44 l6 4 l-6 4" fill="none" stroke="currentColor" strokeWidth="1.4" />

      {/* la trampa con su adsorbente */}
      <text x="149" y="26" fontSize="7.5" textAnchor="middle" fill="currentColor">
        adsorbente (Tenax)
      </text>
      <rect data-pieza="trampa" x="118" y="34" width="62" height="28" rx="3" {...trazo} />
      <g stroke="currentColor" strokeWidth="1">
        {[128, 138, 148, 158, 168].map((x) => (
          <line key={x} x1={x} y1="38" x2={x} y2="58" />
        ))}
      </g>
      <text x="149" y="76" fontSize="7.5" textAnchor="middle" fill={ROJO}>
        desorción
      </text>
      <text x="149" y="86" fontSize="7.5" textAnchor="middle" fill={ROJO}>
        térmica
      </text>

      {/* salida al cromatografo */}
      <path d="M180 48 L214 48 L214 104" fill="none" stroke={ROJO} strokeWidth="1.5" />
      <path d="M210 98 l4 6 l4 -6" fill="none" stroke={ROJO} strokeWidth="1.5" />
      <text x="220" y="106" fontSize="8" fill={ROJO}>
        al CG
      </text>

      <text x="14" y="176" fontSize="8" fill="currentColor">
        El gas inerte entra POR DEBAJO del nivel y burbujea a través
      </text>
      <text x="14" y="187" fontSize="8" fill="currentColor">
        del agua. Concentra hasta 1000 veces. UNE-EN ISO 15680.
      </text>

      {/* ---------- separador ---------- */}
      <line x1="266" y1="14" x2="266" y2="194" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />

      {/* ---------- panel derecho: espacio de cabeza ---------- */}
      <text x="290" y="18" fontSize="10" fontWeight="bold" fill="currentColor">
        Espacio de cabeza
      </text>

      <rect x="330" y="58" width="58" height={FONDO - 58} rx="3" {...trazo} />
      <rect x="331" y={NIVEL_HS} width="56" height={FONDO - NIVEL_HS - 1} fill={AZUL_CLARO} fillOpacity="0.85" />
      <line data-pieza="nivel-hs" x1="331" y1={NIVEL_HS} x2="387" y2={NIVEL_HS} stroke={AZUL} strokeWidth="2" />
      <text x="392" y={NIVEL_HS + 4} fontSize="7.5" fill="currentColor">
        agua
      </text>
      <text x="392" y="86" fontSize="7.5" fill="currentColor">
        vapor
      </text>

      {/* tapon con septo: el vial va CERRADO */}
      <rect x="326" y="50" width="66" height="10" rx="2" fill={AZUL_CLARO} stroke="currentColor" strokeWidth="1.4" />

      {/* la jeringa toma vapor POR ENCIMA del agua */}
      <rect x="344" y="26" width="16" height="16" rx="2" fill="none" stroke={ROJO} strokeWidth="1.4" />
      <line data-pieza="aguja-hs" x1="352" y1="42" x2="352" y2="96" stroke={ROJO} strokeWidth="1.8" />
      <path d="M348 90 l4 6 l4 -6" fill="none" stroke={ROJO} strokeWidth="1.5" />

      <text x="290" y="176" fontSize="8" fill="currentColor">
        No se toca el agua: se deja equilibrar y la jeringa toma
      </text>
      <text x="290" y="187" fontSize="8" fill="currentColor">
        vapor POR ENCIMA. UNE-EN ISO 11423-1 (benceno).
      </text>

      <text x="14" y="212" fontSize="8.5" fill="currentColor">
        Las dos aíslan volátiles de un agua sin inyectarla: en cromatografía de gases todo lo que entra
        debe ser volátil.
      </text>
      <text x="14" y="228" fontSize="8.5" fill="currentColor">
        La purga y trampa concentra mucho más; el espacio de cabeza es más simple y no arrastra espuma
        ni agua.
      </text>
    </g>
  )
}

/* ---------- Tema 32: cromatografia de liquidos ---------- */

/** Gaussiana muestreada sobre una linea base. Se calcula, no se dibuja a ojo. */
function gaussiana(base: number, c: number, sigma: number, h: number) {
  const pts: string[] = []
  for (let x = c - 3.2 * sigma; x <= c + 3.2 * sigma; x += 1) {
    const y = base - h * Math.exp(-((x - c) ** 2) / (2 * sigma * sigma))
    pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

/**
 * Fase normal frente a fase inversa.
 *
 * Lo que el dibujo AFIRMA, y la bateria comprueba, es que EL ORDEN DE ELUCION
 * SE INVIERTE entre las dos: en fase normal la estacionaria es polar y el
 * soluto POLAR sale el ULTIMO; en fase inversa la estacionaria es apolar y el
 * soluto POLAR sale el PRIMERO. Es el concepto central del tema y lo unico que
 * de verdad hay que entender para no confundirlas, asi que el dibujo se pinta
 * de modo que pueda demostrarlo: dos controles, uno por panel, que localizan la
 * cima de cada pico sobre el trazado y comparan.
 */
function FaseNormalVsInversa() {
  const BASE = 152

  const panel = (
    x0: number,
    titulo: string,
    estacionaria: string,
    movil: string,
    primero: { pieza: string; c: number; sigma: number; h: number; rotulo: string },
    segundo: { pieza: string; c: number; sigma: number; h: number; rotulo: string },
  ) => (
    <g key={titulo}>
      <text x={x0} y="18" fontSize="10" fontWeight="bold" fill="currentColor">
        {titulo}
      </text>

      {/* la columna, con su relleno */}
      <rect x={x0 + 4} y="30" width="208" height="20" rx="4" {...trazo} />
      <g stroke="currentColor" strokeWidth="1">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={i} x1={x0 + 22 + i * 24} y1="32" x2={x0 + 22 + i * 24} y2="48" />
        ))}
      </g>
      <text x={x0 + 4} y="64" fontSize="7.5" fill="currentColor">
        {estacionaria}
      </text>
      <text x={x0 + 4} y="75" fontSize="7.5" fill={AZUL}>
        {movil}
      </text>

      {/* ejes del cromatograma */}
      <g stroke="currentColor" strokeWidth="1.4">
        <line x1={x0 + 4} y1="88" x2={x0 + 4} y2={BASE} />
        <line x1={x0 + 4} y1={BASE} x2={x0 + 214} y2={BASE} />
      </g>
      <text x={x0 + 214} y={BASE + 12} fontSize="7.5" textAnchor="end" fill="currentColor">
        tiempo
      </text>

      {/* los dos picos, calculados */}
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <path data-pieza={primero.pieza} d={gaussiana(BASE, primero.c, primero.sigma, primero.h)} />
        <path data-pieza={segundo.pieza} d={gaussiana(BASE, segundo.c, segundo.sigma, segundo.h)} />
      </g>
      <text x={primero.c} y={BASE - primero.h - 6} fontSize="8.5" textAnchor="middle" fill={ROJO}>
        {primero.rotulo}
      </text>
      <text x={segundo.c} y={BASE - segundo.h - 6} fontSize="8.5" textAnchor="middle" fill={ROJO}>
        {segundo.rotulo}
      </text>
    </g>
  )

  return (
    <g fontFamily="system-ui, sans-serif">
      {panel(
        14,
        'Fase NORMAL',
        'estacionaria POLAR: sílice, ciano, diol, NH₂',
        'móvil NO POLAR: hexano',
        { pieza: 'pico-apolar-normal', c: 78, sigma: 9, h: 54, rotulo: 'apolar' },
        { pieza: 'pico-polar-normal', c: 186, sigma: 11, h: 62, rotulo: 'POLAR' },
      )}

      <line x1="266" y1="10" x2="266" y2="176" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />

      {panel(
        284,
        'Fase INVERSA',
        'estacionaria NO POLAR: C8, C18',
        'móvil POLAR: agua, metanol, acetonitrilo',
        { pieza: 'pico-polar-inversa', c: 348, sigma: 9, h: 62, rotulo: 'POLAR' },
        { pieza: 'pico-apolar-inversa', c: 456, sigma: 11, h: 54, rotulo: 'apolar' },
      )}

      <g fontSize="8.5" fill="currentColor">
        <text x="14" y="200">
          EL ORDEN DE ELUCIÓN SE INVIERTE. En fase normal el soluto polar se retiene más y sale el
          último; en fase inversa
        </text>
        <text x="14" y="214">
          sale el primero. La fase inversa es, con diferencia, la más usada: es la de los HAP, los
          plaguicidas y los fármacos.
        </text>
        <text x="14" y="232">
          La sílice se hidroliza en medio básico, así que el pH de la fase móvil debe mantenerse por
          debajo de 7,5.
        </text>
        <text x="14" y="246">
          En fase inversa, subir la polaridad de la fase móvil ALARGA la retención; bajarla, la acorta.
        </text>
      </g>
    </g>
  )
}

/**
 * Elucion isocratica frente a elucion en gradiente.
 *
 * El dibujo AFIRMA dos cosas comprobables: que en el gradiente la proporcion de
 * disolvente fuerte SUBE con el tiempo mientras que en la isocratica se queda
 * plana, y que por eso EL ULTIMO PICO SALE MAS ESTRECHO en el gradiente. Es el
 * mismo problema -y la misma solucion- que la rampa de temperatura del tema 31:
 * la composicion que separa bien lo que eluye pronto deja lo que eluye tarde en
 * picos anchos, bajos y a destiempo.
 */
function GradienteElucion() {
  const BASE = 168

  const picos = (
    lista: { c: number; sigma: number; h: number; pieza?: string }[],
  ) => (
    <g fill="none" stroke="currentColor" strokeWidth="1.6">
      {lista.map((p) => (
        <path key={p.c} data-pieza={p.pieza} d={gaussiana(BASE, p.c, p.sigma, p.h)} />
      ))}
    </g>
  )

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* ---------- panel izquierdo: isocratica ---------- */}
      <text x="14" y="18" fontSize="10" fontWeight="bold" fill="currentColor">
        Elución ISOCRÁTICA
      </text>
      <text x="24" y="32" fontSize="7.5" fill={AZUL}>
        % disolvente fuerte
      </text>
      <g stroke="currentColor" strokeWidth="1.1">
        <line x1="24" y1="38" x2="24" y2="78" />
        <line x1="24" y1="78" x2="242" y2="78" />
      </g>
      <line data-pieza="perfil-isocratico" x1="28" y1="62" x2="238" y2="62" stroke={ROJO} strokeWidth="2" />

      <g stroke="currentColor" strokeWidth="1.4">
        <line x1="24" y1="92" x2="24" y2={BASE} />
        <line x1="24" y1={BASE} x2="248" y2={BASE} />
      </g>
      {picos([
        { c: 52, sigma: 4.5, h: 62 },
        { c: 82, sigma: 6.5, h: 50 },
        { c: 132, sigma: 11, h: 34 },
        { c: 206, sigma: 19, h: 20, pieza: 'ultimo-isocratico' },
      ])}
      <text x="248" y={BASE + 12} fontSize="7.5" textAnchor="end" fill="currentColor">
        tiempo
      </text>

      {/* ---------- separador ---------- */}
      <line x1="266" y1="10" x2="266" y2="192" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />

      {/* ---------- panel derecho: gradiente ---------- */}
      <text x="284" y="18" fontSize="10" fontWeight="bold" fill="currentColor">
        Elución en GRADIENTE
      </text>
      <text x="294" y="32" fontSize="7.5" fill={AZUL}>
        % disolvente fuerte
      </text>
      <g stroke="currentColor" strokeWidth="1.1">
        <line x1="294" y1="38" x2="294" y2="78" />
        <line x1="294" y1="78" x2="512" y2="78" />
      </g>
      <line data-pieza="perfil-gradiente" x1="298" y1="72" x2="508" y2="42" stroke={ROJO} strokeWidth="2" />

      <g stroke="currentColor" strokeWidth="1.4">
        <line x1="294" y1="92" x2="294" y2={BASE} />
        <line x1="294" y1={BASE} x2="518" y2={BASE} />
      </g>
      {picos([
        { c: 322, sigma: 4.5, h: 62 },
        { c: 356, sigma: 4.8, h: 56 },
        { c: 396, sigma: 5.2, h: 50 },
        { c: 442, sigma: 5.6, h: 46, pieza: 'ultimo-gradiente' },
      ])}
      <text x="518" y={BASE + 12} fontSize="7.5" textAnchor="end" fill="currentColor">
        tiempo
      </text>

      <g fontSize="8.5" fill="currentColor">
        <text x="14" y="204">
          Con composición fija, la fuerza que resuelve los primeros picos deja los últimos anchos,
          bajos y muy tardíos.
        </text>
        <text x="14" y="218">
          Subiendo el disolvente fuerte a lo largo de la separación, los picos tardíos salen ESTRECHOS
          y repartidos.
        </text>
        <text x="14" y="232">
          Es el equivalente líquido de la rampa de temperatura del horno en cromatografía de gases.
        </text>
      </g>
    </g>
  )
}

/* ---------- Tema 33: parametros del agua de consumo ---------- */

/**
 * Curva de cloracion al punto de ruptura.
 *
 * Lo que el dibujo AFIRMA, y la bateria comprueba, es la forma: el residual
 * SUBE mientras se forman cloraminas, BAJA hasta un minimo -el punto de
 * ruptura- cuando esas cloraminas se destruyen, y VUELVE A SUBIR. Y que el
 * CLORO LIBRE residual solo aparece DESPUES del punto de ruptura, que es lo
 * unico que hay que entender para no confundir cloro libre con cloro combinado.
 *
 * La curva se calcula por tramos, no se traza a ojo, y la marca del punto de
 * ruptura se coloca en el minimo que resulta de ese calculo.
 */
function CloracionPuntoRuptura() {
  const X0 = 50
  const ANCHO = 390
  const BASE = 180
  const H = 70

  /** Residual en unidades arbitrarias, por tramos. */
  const residual = (u: number) => {
    if (u <= 0.12) return 0
    if (u <= 0.42) return (u - 0.12) / 0.3
    if (u <= 0.62) return 1 - (0.88 * (u - 0.42)) / 0.2
    return 0.12 + (1.35 * (u - 0.62)) / 0.38
  }

  const pts: [number, number][] = []
  for (let i = 0; i <= 200; i++) {
    const u = i / 200
    pts.push([X0 + u * ANCHO, BASE - residual(u) * H])
  }
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')

  /*
   * El punto de ruptura se BUSCA sobre la curva ya muestreada, no se escribe a
   * mano: es el valle, o sea el primer punto en el que la curva deja de bajar
   * despues de haber dejado de subir. Ojo, que el maximo de todo el trazado es
   * el final -el cloro libre acaba mas alto que las cloraminas-, asi que
   * buscarlo por el maximo global pondria la marca en el sitio equivocado.
   */
  let iPico = 0
  while (iPico + 1 < pts.length && pts[iPico + 1][1] <= pts[iPico][1]) iPico++
  let iValle = iPico
  while (iValle + 1 < pts.length && pts[iValle + 1][1] >= pts[iValle][1]) iValle++
  const xRuptura = pts[iValle][0]
  const yRuptura = pts[iValle][1]

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* ejes */}
      <g stroke="currentColor" strokeWidth="1.6">
        <line x1={X0} y1="34" x2={X0} y2={BASE} />
        <line x1={X0} y1={BASE} x2="452" y2={BASE} />
      </g>
      <text x={X0} y="26" fontSize="8" fill="currentColor">
        cloro residual (mg/L)
      </text>
      <text x="452" y={BASE + 13} fontSize="8" textAnchor="end" fill="currentColor">
        cloro añadido (mg/L)
      </text>

      <path data-pieza="curva-cloro" d={d} fill="none" stroke={ROJO} strokeWidth="1.8" />

      {/* la marca del punto de ruptura, en el minimo calculado */}
      <line
        data-pieza="marca-ruptura"
        x1={xRuptura}
        y1={yRuptura}
        x2={xRuptura}
        y2={BASE}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />
      <text x={xRuptura} y={BASE + 24} fontSize="8.5" textAnchor="middle" fontWeight="bold" fill="currentColor">
        punto de ruptura
      </text>

      {/* separadores de zona */}
      <g stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5">
        <line x1={X0 + 0.12 * ANCHO} y1="40" x2={X0 + 0.12 * ANCHO} y2={BASE} />
        <line x1={X0 + 0.42 * ANCHO} y1="40" x2={X0 + 0.42 * ANCHO} y2={BASE} />
      </g>

      <g fontSize="8.5" textAnchor="middle" fill="currentColor">
        <text x={X0 + 0.06 * ANCHO} y="50">
          demanda
        </text>
        <text x={X0 + 0.27 * ANCHO} y="50">
          cloro combinado
        </text>
        <text x={X0 + 0.82 * ANCHO} y="50">
          cloro libre
        </text>
      </g>
      <g fontSize="7.5" textAnchor="middle" fill="currentColor">
        <text x={X0 + 0.06 * ANCHO} y="60">
          inmediata
        </text>
        <text x={X0 + 0.27 * ANCHO} y="60">
          (cloraminas)
        </text>
        <text x={X0 + 0.82 * ANCHO} y="60">
          residual
        </text>
      </g>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="226">
          El cloro se gasta primero en oxidar hierro, manganeso, sulfuros y materia orgánica.
        </text>
        <text x="8" y="239">
          Luego reacciona con el amonio y forma CLORAMINAS: es el cloro combinado, y sube.
        </text>
        <text x="8" y="252">
          Pasado el máximo el cloro destruye esas cloraminas y el residual cae al PUNTO DE RUPTURA.
        </text>
        <text x="8" y="265">
          Solo después aparece CLORO LIBRE residual, que es el que de verdad desinfecta.
        </text>
      </g>
    </g>
  )
}

/**
 * Valoracion de la alcalinidad, con sus dos puntos finales.
 *
 * La ISO 9963-1 valora con acido a puntos finales de pH FIJOS -8,3 y 4,5-,
 * visual o potenciometricamente. El dibujo lo AFIRMA y puede demostrarlo: la
 * curva se calcula, se busca NUMERICAMENTE donde cruza cada pH, y ahi se
 * colocan las dos marcas. El control recalcula esos cruces sobre el trazado y
 * exige que las marcas caigan encima.
 */
function AlcalinidadValoracion() {
  const X0 = 62
  const ANCHO = 368
  const BASE = 180
  /** pH 10 arriba, pH 3 abajo: 20 px por unidad de pH. */
  const yDe = (ph: number) => BASE - (ph - 3) * 20

  const sig = (t: number, c: number, w: number) => 1 / (1 + Math.exp(-(t - c) / w))
  const phDe = (t: number) => 9.8 - 3.3 * sig(t, 0.28, 0.045) - 3.3 * sig(t, 0.62, 0.045)

  const pts: [number, number][] = []
  for (let i = 0; i <= 240; i++) {
    const t = i / 240
    pts.push([X0 + t * ANCHO, yDe(phDe(t))])
  }
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')

  /** Donde la curva calculada cruza un pH dado, por interpolacion. */
  const cruce = (ph: number) => {
    for (let i = 1; i < pts.length; i++) {
      const a = phDe((i - 1) / 240)
      const b = phDe(i / 240)
      if (a >= ph && b <= ph) {
        const f = (a - ph) / (a - b)
        return pts[i - 1][0] + f * (pts[i][0] - pts[i - 1][0])
      }
    }
    return X0
  }
  const v1 = cruce(8.3)
  const v2 = cruce(4.5)

  const referencia = (pieza: string, ph: number, rotulo: string) => (
    <g key={pieza}>
      <line
        data-pieza={pieza}
        x1={X0}
        y1={yDe(ph)}
        x2="440"
        y2={yDe(ph)}
        stroke={AZUL}
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />
      <text x="444" y={yDe(ph) + 3} fontSize="8" fill={AZUL}>
        {rotulo}
      </text>
    </g>
  )

  return (
    <g fontFamily="system-ui, sans-serif">
      <g stroke="currentColor" strokeWidth="1.6">
        <line x1={X0} y1="34" x2={X0} y2={BASE} />
        <line x1={X0} y1={BASE} x2="440" y2={BASE} />
      </g>
      <text x="8" y="30" fontSize="8" fill="currentColor">
        pH
      </text>
      <text x="440" y={BASE + 13} fontSize="8" textAnchor="end" fill="currentColor">
        volumen de ácido añadido
      </text>

      {referencia('linea-83', 8.3, 'pH 8,3')}
      {referencia('linea-45', 4.5, 'pH 4,5')}

      <path data-pieza="curva-alcalinidad" d={d} fill="none" stroke={ROJO} strokeWidth="1.8" />

      <g stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3">
        <line data-pieza="marca-fenolftaleina" x1={v1} y1={yDe(8.3)} x2={v1} y2={BASE} />
        <line data-pieza="marca-naranja" x1={v2} y1={yDe(4.5)} x2={v2} y2={BASE} />
      </g>
      <g fontSize="8.5" textAnchor="middle" fill="currentColor" fontWeight="bold">
        <text x={v1} y={BASE + 25}>
          V₁ · TA
        </text>
        <text x={v2} y={BASE + 25}>
          V₂ · TAC
        </text>
      </g>
      <g fontSize="7.5" textAnchor="middle" fill="currentColor">
        <text x={v1} y={BASE + 35}>
          fenolftaleína
        </text>
        <text x={v2} y={BASE + 35}>
          anaranjado de metilo
        </text>
      </g>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="238">
          La UNE-EN ISO 9963-1 valora con ácido a DOS puntos finales de pH FIJO: 8,3 y 4,5.
        </text>
        <text x="8" y="251">
          Hasta 8,3 se neutraliza el hidróxido y el carbonato solo pasa a BICARBONATO.
        </text>
        <text x="8" y="264">
          Hasta 4,5 se neutraliza también todo el bicarbonato: es la alcalinidad TOTAL.
        </text>
      </g>
    </g>
  )
}


/* ---------- Tema 34: aguas residuales ---------- */

/**
 * La curva de la DBO en el tiempo, con la DQO por encima.
 *
 * Lo que el dibujo AFIRMA es lo que el examen pregunta (1322 #40): en un agua
 * residual domestica la DQO es MAYOR que la DBO. Y lo ensena con la razon: la
 * DBO solo cuenta lo BIODEGRADABLE, y ademas a los cinco dias la reaccion aun
 * no ha terminado, asi que la DBO5 se queda por debajo de la DBO ULTIMA.
 *
 * La curva no se traza a ojo: es la cinetica de primer orden
 * DBO(t) = DBOu * (1 - e^(-k t)), muestreada punto a punto con k = 0,23 /dia,
 * que es lo que hace que a los cinco dias se haya consumido el 68 %.
 */
function DboFrenteADqo() {
  const X0 = 58
  const ANCHO = 392
  const BASE = 196
  const DIAS = 20
  /** mg/L por pixel: la DQO, que es el techo del dibujo, cae en y = 46 */
  const DQO = 400
  const DBO_U = 250
  const K = 0.23
  const yDe = (v: number) => BASE - (v / DQO) * (BASE - 46)
  const xDe = (d: number) => X0 + (d / DIAS) * ANCHO

  const pts: [number, number][] = []
  for (let i = 0; i <= 200; i++) {
    const d = (i / 200) * DIAS
    pts.push([xDe(d), yDe(DBO_U * (1 - Math.exp(-K * d)))])
  }
  const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')

  const dbo5 = DBO_U * (1 - Math.exp(-K * 5))
  const nivel = (pieza: string, v: number, color: string, rotulo: string) => (
    <g key={pieza}>
      <line
        data-pieza={pieza}
        x1={X0}
        y1={yDe(v)}
        x2="462"
        y2={yDe(v)}
        stroke={color}
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />
      <text x="466" y={yDe(v) + 3} fontSize="8" fill={color}>
        {rotulo}
      </text>
    </g>
  )

  return (
    <g fontFamily="system-ui, sans-serif">
      <g stroke="currentColor" strokeWidth="1.6">
        <line x1={X0} y1="38" x2={X0} y2={BASE} />
        <line x1={X0} y1={BASE} x2="462" y2={BASE} />
      </g>
      <text x="8" y="32" fontSize="8" fill="currentColor">
        oxígeno consumido (mg/L)
      </text>
      <text x="462" y={BASE + 26} fontSize="8" textAnchor="end" fill="currentColor">
        días de incubación a 20 °C
      </text>

      {nivel('nivel-dqo', DQO, ROJO, 'DQO')}
      {nivel('nivel-dbou', DBO_U, AZUL, 'DBO última')}
      {nivel('nivel-dbo5', dbo5, AZUL, 'DBO₅')}

      <path data-pieza="curva-dbo" d={path} fill="none" stroke="currentColor" strokeWidth="1.8" />

      {/* la marca del quinto dia, puesta sobre la curva calculada */}
      <line
        data-pieza="marca-5-dias"
        x1={xDe(5)}
        y1={yDe(dbo5)}
        x2={xDe(5)}
        y2={BASE}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />
      <text x={xDe(5)} y={BASE + 25} fontSize="8.5" textAnchor="middle" fontWeight="bold" fill="currentColor">
        5 días
      </text>

      {/* marcas del eje de tiempo */}
      <g fontSize="7.5" textAnchor="middle" fill="currentColor">
        {[0, 10, 15, 20].map((d) => (
          <text key={d} x={xDe(d)} y={BASE + 12}>
            {d}
          </text>
        ))}
      </g>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="240">
          La DQO oxida con dicromato TODO lo oxidable, biodegradable o no. La DBO solo cuenta lo que
        </text>
        <text x="8" y="253">
          las bacterias son capaces de comerse, y por eso siempre sale por debajo.
        </text>
        <text x="8" y="266">
          Y a los cinco días la reacción aún no ha terminado: la DBO₅ es solo una PARTE de la última.
        </text>
        <text x="8" y="279">
          Su cociente, DBO₅/DQO, es la medida clásica de lo biodegradable que es un agua.
        </text>
      </g>
    </g>
  )
}

/**
 * Los solidos de un agua, separados por dos operaciones.
 *
 * El arbol no se dibuja a mano: se declara como datos y las cajas se COLOCAN
 * por calculo, de modo que los hijos cuelgan siempre por debajo de su padre y
 * a la misma altura entre si. Lo que el dibujo afirma, y la bateria comprueba,
 * es el reparto -el FILTRO separa suspendidos de disueltos- y que la
 * CALCINACION va despues del secado y a mas temperatura.
 */
function SolidosDelAgua() {
  const NIVEL = [46, 116, 186]
  const ALTO = 34
  const caja = (pieza: string, x: number, ancho: number, fila: number, titulo: string, pie?: string) => (
    <g key={pieza}>
      <rect
        data-pieza={pieza}
        x={x}
        y={NIVEL[fila]}
        width={ancho}
        height={ALTO}
        rx="4"
        fill={AZUL}
        fillOpacity={fila === 0 ? 0.55 : 0.35}
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <text
        x={x + ancho / 2}
        y={NIVEL[fila] + (pie ? 14 : 21)}
        fontSize="8.5"
        textAnchor="middle"
        fontWeight="bold"
        fill="currentColor"
      >
        {titulo}
      </text>
      {pie ? (
        <text x={x + ancho / 2} y={NIVEL[fila] + 26} fontSize="7.5" textAnchor="middle" fill="currentColor">
          {pie}
        </text>
      ) : null}
    </g>
  )

  /** Enlace de padre a hijo, calculado de las dos cajas. */
  const enlace = (x1: number, fila1: number, x2: number, fila2: number) => {
    const y1 = NIVEL[fila1] + ALTO
    const y2 = NIVEL[fila2]
    const ym = (y1 + y2) / 2
    const d = ['M', x1, ' ', y1, ' V', ym, ' H', x2, ' V', y2].join('')
    return <path d={d} fill="none" stroke="currentColor" strokeWidth="1.2" />
  }

  return (
    <g fontFamily="system-ui, sans-serif">
      {caja('caja-totales', 190, 180, 0, 'SÓLIDOS TOTALES', 'residuo al evaporar y secar a 105 °C')}

      {enlace(280, 0, 108, 1)}
      {enlace(280, 0, 452, 1)}
      <text data-pieza="rotulo-filtro" x="288" y="93" fontSize="8.5" fontWeight="bold" fill={ROJO}>
        FILTRO de fibra de vidrio
      </text>

      {caja('caja-suspension', 28, 160, 1, 'EN SUSPENSIÓN', 'lo que QUEDA en el filtro')}
      {caja('caja-disueltos', 372, 160, 1, 'DISUELTOS', 'lo que PASA por el filtro')}

      {enlace(108, 1, 60, 2)}
      {enlace(108, 1, 196, 2)}
      <text data-pieza="rotulo-calcinacion" x="116" y="163" fontSize="8.5" fontWeight="bold" fill={ROJO}>
        CALCINACIÓN a 550 °C
      </text>

      {caja('caja-volatiles', 10, 100, 2, 'VOLÁTILES', 'se van al calcinar')}
      {caja('caja-fijos', 146, 100, 2, 'FIJOS', 'ceniza que queda')}

      <g fontSize="8.5" fill="currentColor">
        <text x="300" y="196">
          Y aparte, los SEDIMENTABLES:
        </text>
        <text x="300" y="209">
          los que decantan en un cono Imhoff
        </text>
        <text x="300" y="222">
          en una hora, medidos en mL/L.
        </text>
      </g>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="252">
          Dos operaciones y nada más: el FILTRO parte los totales en suspensión y disueltos; la CALCINACIÓN
        </text>
        <text x="8" y="265">
          parte cada mitad en volátiles y fijos. Los volátiles se toman como medida de la materia orgánica.
        </text>
        <text x="8" y="278">
          El RD 509/1996 llama «total de sólidos en suspensión» a los de la izquierda: 35 mg/L en el efluente.
        </text>
      </g>
    </g>
  )
}


/* ---------- Tema 35: nitrogeno, fosforo y metales ---------- */

/**
 * Las fracciones del nitrogeno.
 *
 * Lo que el dibujo AFIRMA, y la bateria comprueba, es lo que el examen usa
 * como distractor tres veces: el nitrogeno KJELDAHL no es el nitrogeno TOTAL.
 * Kjeldahl solo llega al organico y al amoniacal; el total anade ademas el
 * nitrito y el nitrato, tal como los define el RD 509/1996 en la nota 2 de su
 * cuadro 2.
 *
 * Los tramos no se colocan a mano: se declaran como proporciones y las
 * anchuras se CALCULAN, de modo que los dos corchetes abarcan exactamente los
 * tramos que les tocan.
 */
function NitrogenoTotalFracciones() {
  const X0 = 40
  const ANCHO = 448
  const Y = 74
  const ALTO = 40
  /** Peso relativo de cada fraccion; el reparto es ilustrativo, no un dato. */
  const TRAMOS = [
    { clave: 'organico', titulo: 'N orgánico', peso: 0.34, tono: 0.62 },
    { clave: 'amoniacal', titulo: 'N amoniacal', peso: 0.3, tono: 0.44 },
    { clave: 'nitrito', titulo: 'N nitrito', peso: 0.12, tono: 0.26 },
    { clave: 'nitrato', titulo: 'N nitrato', peso: 0.24, tono: 0.12 },
  ]
  let x = X0
  const cajas = TRAMOS.map((tr) => {
    const w = tr.peso * ANCHO
    const caja = { ...tr, x, w }
    x += w
    return caja
  })
  /** Hasta donde llega el Kjeldahl: organico + amoniacal, calculado. */
  const finKjeldahl = cajas[1].x + cajas[1].w
  const finTotal = cajas[3].x + cajas[3].w

  const corchete = (pieza: string, x1: number, x2: number, y: number, rotulo: string, color: string) => {
    const d = ['M', x1, ' ', y + 8, ' V', y, ' H', x2, ' V', y + 8].join('')
    return (
      <g key={pieza}>
        <path data-pieza={pieza} d={d} fill="none" stroke={color} strokeWidth="1.6" />
        <text x={(x1 + x2) / 2} y={y - 5} fontSize="9" textAnchor="middle" fontWeight="bold" fill={color}>
          {rotulo}
        </text>
      </g>
    )
  }

  return (
    <g fontFamily="system-ui, sans-serif">
      {cajas.map((c) => (
        <g key={c.clave}>
          <rect
            data-pieza={'tramo-' + c.clave}
            x={c.x}
            y={Y}
            width={c.w}
            height={ALTO}
            fill={AZUL}
            fillOpacity={c.tono}
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <text x={c.x + c.w / 2} y={Y + 24} fontSize="8.5" textAnchor="middle" fill="currentColor">
            {c.titulo}
          </text>
        </g>
      ))}

      {corchete('corchete-kjeldahl', X0, finKjeldahl, Y - 16, 'NITRÓGENO KJELDAHL', ROJO)}
      {corchete('corchete-total', X0, finTotal, Y + ALTO + 30, 'NITRÓGENO TOTAL', AZUL)}

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="176">
          El RD 509/1996 lo define en la nota 2 de su cuadro 2: «nitrógeno total equivalente a la suma de
        </text>
        <text x="8" y="189">
          nitrógeno Kjeldahl total (N orgánico y amoniacal), nitrógeno en forma de nitrato y nitrógeno en
        </text>
        <text x="8" y="202">
          forma de nitrito».
        </text>
        <text x="8" y="224">
          Por eso KJELDAHL NO ES EL TOTAL: se deja fuera las formas ya oxidadas. Y por eso el examen puede
        </text>
        <text x="8" y="237">
          ofrecer «método Kjeldahl» como respuesta al fósforo y colarla: es de nitrógeno, y ni siquiera de todo.
        </text>
        <text x="8" y="259">
          Medirlo de una vez, sin trocear, es lo que hace la combustión oxidativa: todo acaba en óxidos de nitrógeno.
        </text>
      </g>
    </g>
  )
}

/**
 * La NCA de los metales sube con la dureza del agua.
 *
 * El RD 817/2015 no da UN numero por metal: da un escalon por CLASE DE DUREZA
 * para el cadmio (anexo IV, cinco clases) y para el cobre y el zinc (anexo V,
 * cuatro clases). Cuanto mas dura es el agua, MAS metal se tolera, porque el
 * calcio compite con el metal y le baja la biodisponibilidad.
 *
 * El eje vertical es LOGARITMICO porque hay que meter en el mismo dibujo
 * 0,08 y 500 µg/L. Los escalones se calculan de los valores, no se trazan.
 */
function NcaMetalesDureza() {
  const X0 = 52
  const ANCHO = 372
  const BASE = 192
  const CIMA = 44
  /** Decadas representadas: de 0,01 a 1000 µg/L. */
  const LOG_MIN = -2
  const LOG_MAX = 3
  const yDe = (v: number) => BASE - ((Math.log10(v) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (BASE - CIMA)
  /** Dureza en mg/L CaCO3, en escala logaritmica de 5 a 400. */
  const DUR_MIN = Math.log10(5)
  const DUR_MAX = Math.log10(400)
  const xDe = (d: number) => X0 + ((Math.log10(d) - DUR_MIN) / (DUR_MAX - DUR_MIN)) * ANCHO

  /** [dureza a la que empieza el escalon, NCA-MA en µg/L] */
  const SERIES = [
    {
      clave: 'zinc',
      titulo: 'Zinc',
      color: AZUL,
      pasos: [[5, 30], [10, 200], [50, 300], [100, 500]],
    },
    {
      clave: 'cobre',
      titulo: 'Cobre',
      color: 'currentColor',
      pasos: [[5, 5], [10, 22], [50, 40], [100, 120]],
    },
    {
      clave: 'cadmio',
      titulo: 'Cadmio',
      color: ROJO,
      pasos: [[5, 0.08], [40, 0.08], [50, 0.09], [100, 0.15], [200, 0.25]],
    },
  ]

  /** Escalera en puntos: se muestrea la funcion escalon, no se dibuja a mano. */
  const trazo = (pasos: number[][]) => {
    const pts: [number, number][] = []
    for (let i = 0; i <= 160; i++) {
      const d = Math.pow(10, DUR_MIN + (i / 160) * (DUR_MAX - DUR_MIN))
      let v = pasos[0][1]
      for (const [desde, valor] of pasos) if (d >= desde) v = valor
      pts.push([xDe(d), yDe(v)])
    }
    return pts.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join(' ')
  }

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* rejilla de decadas */}
      <g stroke="currentColor" strokeWidth="0.6" opacity="0.35" strokeDasharray="2 3">
        {[0.01, 0.1, 1, 10, 100, 1000].map((v) => (
          <line key={v} x1={X0} y1={yDe(v)} x2={X0 + ANCHO} y2={yDe(v)} />
        ))}
      </g>
      <g fontSize="7.5" textAnchor="end" fill="currentColor">
        {[0.01, 0.1, 1, 10, 100, 1000].map((v) => (
          <text key={v} x={X0 - 4} y={yDe(v) + 3}>
            {String(v).replace('.', ',')}
          </text>
        ))}
      </g>

      <g stroke="currentColor" strokeWidth="1.6">
        <line x1={X0} y1={CIMA - 6} x2={X0} y2={BASE} />
        <line x1={X0} y1={BASE} x2={X0 + ANCHO} y2={BASE} />
      </g>
      <text x="8" y="36" fontSize="8" fill="currentColor">
        NCA-MA (µg/L)
      </text>
      <text x={X0 + ANCHO} y={BASE + 26} fontSize="8" textAnchor="end" fill="currentColor">
        dureza del agua (mg/L de CaCO₃)
      </text>

      <g fontSize="7.5" textAnchor="middle" fill="currentColor">
        {[10, 50, 100, 200].map((d) => (
          <text key={d} x={xDe(d)} y={BASE + 12}>
            {d}
          </text>
        ))}
      </g>

      {SERIES.map((s) => (
        <g key={s.clave}>
          <path
            data-pieza={'serie-' + s.clave}
            d={trazo(s.pasos)}
            fill="none"
            stroke={s.color}
            strokeWidth="1.8"
          />
          <text
            x={X0 + ANCHO + 4}
            y={yDe(s.pasos[s.pasos.length - 1][1]) + 3}
            fontSize="8"
            fill={s.color}
          >
            {s.titulo}
          </text>
        </g>
      ))}

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="232">
          Tres metales cuya norma de calidad ambiental NO es un número, sino un escalón por clase de dureza:
        </text>
        <text x="8" y="245">
          el cadmio en el anexo IV (cinco clases) y el cobre y el zinc en el anexo V (cuatro).
        </text>
        <text x="8" y="262">
          Cuanto más DURA es el agua, MÁS metal se tolera. No es indulgencia: el calcio y el magnesio compiten
        </text>
        <text x="8" y="275">
          con el metal y le bajan la BIODISPONIBILIDAD, que es lo que de verdad hace daño al medio.
        </text>
      </g>
    </g>
  )
}


/* ---------- Tema 36: toma de muestras ---------- */

/**
 * Los dos envases, y lo unico que de verdad los separa.
 *
 * El examen lo pregunta por el volumen y por el llenado (1246 C2 #14): la
 * muestra de MICROBIOLOGIA se toma en envase esteril, con neutralizante, y
 * SIEMPRE dejando una camara de aire; la FISICOQUIMICA se llena por completo,
 * sin camara. Lo dice el RD 487/2022 en su anexo VI, partes A.1 y B.1.
 *
 * El dibujo lo AFIRMA con geometria: el nivel del agua del frasco de la
 * izquierda queda por DEBAJO de su boca, y el de la derecha la alcanza. Y el
 * neutralizante esta DENTRO del primero y fuera del segundo.
 */
function EnvaseCamaraDeAire() {
  const BOTE = { ancho: 96, alto: 116, cuello: 24 }
  const bote = (x: number, y: number) => {
    const { ancho, alto, cuello } = BOTE
    const cx = x + ancho / 2
    return [
      'M' + (cx - cuello / 2) + ' ' + y,
      'V' + (y + 16),
      'L' + x + ' ' + (y + 34),
      'V' + (y + alto),
      'H' + (x + ancho),
      'V' + (y + 34),
      'L' + (cx + cuello / 2) + ' ' + (y + 16),
      'V' + y,
      'Z',
    ].join(' ')
  }

  const X1 = 48
  const X2 = 300
  const Y = 56
  /** La boca del frasco: hasta donde PODRIA llegar el agua. */
  const BOCA = Y + 34
  /** Microbiologia: el agua se queda por debajo. Fisicoquimica: la alcanza. */
  const NIVEL_MICRO = BOCA + 26
  const NIVEL_FQ = BOCA

  const agua = (x: number, nivel: number) => (
    <rect
      x={x + 1}
      y={nivel}
      width={BOTE.ancho - 2}
      height={Y + BOTE.alto - nivel - 1}
      fill={AZUL}
      fillOpacity="0.7"
    />
  )

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* --- microbiologia --- */}
      <text x={X1 + BOTE.ancho / 2} y="34" fontSize="9" textAnchor="middle" fontWeight="bold" fill={ROJO}>
        MICROBIOLOGÍA
      </text>
      {agua(X1, NIVEL_MICRO)}
      <path d={bote(X1, Y)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <line
        data-pieza="nivel-micro"
        x1={X1}
        y1={NIVEL_MICRO}
        x2={X1 + BOTE.ancho}
        y2={NIVEL_MICRO}
        stroke={AZUL}
        strokeWidth="2"
      />
      <line
        data-pieza="boca-micro"
        x1={X1}
        y1={BOCA}
        x2={X1 + BOTE.ancho}
        y2={BOCA}
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="3 3"
      />
      <g stroke={ROJO} strokeWidth="1.2">
        <line x1={X1 + BOTE.ancho + 8} y1={BOCA} x2={X1 + BOTE.ancho + 8} y2={NIVEL_MICRO} />
      </g>
      <text x={X1 + BOTE.ancho + 13} y={(BOCA + NIVEL_MICRO) / 2 + 3} fontSize="8.5" fontWeight="bold" fill={ROJO}>
        cámara de aire
      </text>
      <circle
        data-pieza="neutralizante"
        cx={X1 + BOTE.ancho / 2}
        cy={Y + BOTE.alto - 18}
        r="9"
        fill={ROJO}
        fillOpacity="0.85"
      />
      <text x={X1 + BOTE.ancho / 2} y="196" fontSize="8" textAnchor="middle" fill={ROJO}>
        tiosulfato o neutralizante
      </text>
      <text x={X1 + BOTE.ancho / 2} y="207" fontSize="8" textAnchor="middle" fill={ROJO}>
        del biocida
      </text>
      <text x={X1 + BOTE.ancho / 2} y="221" fontSize="8" textAnchor="middle" fill="currentColor">
        envase ESTÉRIL
      </text>

      {/* --- fisicoquimica --- */}
      <text x={X2 + BOTE.ancho / 2} y="34" fontSize="9" textAnchor="middle" fontWeight="bold" fill={AZUL}>
        FISICOQUÍMICA y COV
      </text>
      {agua(X2, NIVEL_FQ)}
      <path d={bote(X2, Y)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <line
        data-pieza="nivel-fq"
        x1={X2}
        y1={NIVEL_FQ}
        x2={X2 + BOTE.ancho}
        y2={NIVEL_FQ}
        stroke={AZUL}
        strokeWidth="2"
      />
      <line
        data-pieza="boca-fq"
        x1={X2}
        y1={BOCA}
        x2={X2 + BOTE.ancho}
        y2={BOCA}
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="3 3"
      />
      <text x={X2 + BOTE.ancho + 10} y={BOCA + 3} fontSize="8.5" fontWeight="bold" fill={AZUL}>
        lleno al ras
      </text>
      <text x={X2 + BOTE.ancho / 2} y="196" fontSize="8" textAnchor="middle" fill={AZUL}>
        sin cámara de aire:
      </text>
      <text x={X2 + BOTE.ancho / 2} y="207" fontSize="8" textAnchor="middle" fill={AZUL}>
        lo volátil se escaparía
      </text>
      <text x={X2 + BOTE.ancho / 2} y="221" fontSize="8" textAnchor="middle" fill="currentColor">
        envase LIMPIO
      </text>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="248">
          RD 487/2022, anexo VI: en microbiología «siempre debe dejarse una pequeña cámara de aire sobre el
        </text>
        <text x="8" y="261">
          nivel del agua»; en los ensayos químicos «el recipiente se debe llenar completamente y cerrar de
        </text>
        <text x="8" y="274">
          forma que no quede una cámara de aire por encima de la muestra».
        </text>
        <text x="8" y="287">
          Una sirve para homogeneizar antes de sembrar; la otra, para que no se pierda nada por evaporación.
        </text>
      </g>
    </g>
  )
}

/**
 * Los tres objetivos del muestreo en grifo (UNE-EN ISO 19458).
 *
 * El RD 3/2023 no dice "tomese una muestra": dice que el muestreo
 * microbiologico en el grifo del usuario se haga "con objetivo b)". Y los tres
 * objetivos llevan a TRES procedimientos distintos, que es lo que el dibujo
 * afirma:
 *
 *   a) la RED   -> se flamea el grifo y se deja correr hasta temperatura estable
 *   b) el GRIFO -> se quita la alcachofa, se desinfecta y se corre lo minimo
 *   c) lo que se BEBE -> ni se desinfecta ni se quita nada
 *
 * Y el dibujo tiene que poder demostrar cual senala el RD y donde sigue puesta
 * la alcachofa.
 */
function GrifoTresObjetivos() {
  const PANELES = [
    {
      clave: 'a',
      titulo: 'a) la RED',
      pie: ['grifo próximo al conducto', 'principal, FLAMEADO, y correr', 'hasta temperatura constante'],
      accesorio: false,
    },
    {
      clave: 'b',
      titulo: 'b) el GRIFO',
      pie: ['se RETIRA la alcachofa, se', 'desinfecta y se deja correr', 'lo mínimo'],
      accesorio: false,
    },
    {
      clave: 'c',
      titulo: 'c) lo que se BEBE',
      pie: ['NI se desinfecta NI se retira', 'nada: se busca justo lo que', 'llega al consumidor'],
      accesorio: true,
    },
  ]
  const ANCHO = 176
  const X0 = 6
  const Y = 44
  const ALTO = 128

  return (
    <g fontFamily="system-ui, sans-serif">
      {PANELES.map((p, i) => {
        const x = X0 + i * (ANCHO + 4)
        const cx = x + ANCHO / 2
        const esB = p.clave === 'b'
        return (
          <g key={p.clave}>
            <rect
              data-pieza={'panel-' + p.clave}
              x={x}
              y={Y}
              width={ANCHO}
              height={ALTO}
              rx="4"
              fill={esB ? AZUL : 'none'}
              fillOpacity={esB ? 0.18 : 0}
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <text
              data-pieza={'titulo-' + p.clave}
              x={cx}
              y={Y + 16}
              fontSize="9"
              textAnchor="middle"
              fontWeight="bold"
              fill="currentColor"
            >
              {p.titulo}
            </text>

            {/* el grifo */}
            <g stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round">
              <path d={'M' + (cx - 34) + ' ' + (Y + 40) + ' h22 v-12'} />
              <path d={'M' + (cx - 12) + ' ' + (Y + 28) + ' h26'} />
              <path d={'M' + (cx + 14) + ' ' + (Y + 28) + ' v22'} />
            </g>
            {p.accesorio ? (
              <rect
                data-pieza={'alcachofa-' + p.clave}
                x={cx + 8}
                y={Y + 50}
                width="12"
                height="7"
                rx="2"
                fill={ROJO}
                fillOpacity="0.85"
                stroke="currentColor"
                strokeWidth="0.8"
              />
            ) : null}
            {/* el chorro */}
            <line
              x1={cx + 14}
              y1={Y + (p.accesorio ? 58 : 50)}
              x2={cx + 14}
              y2={Y + 78}
              stroke={AZUL}
              strokeWidth="3"
            />

            <g fontSize="7.5" textAnchor="middle" fill="currentColor">
              {p.pie.map((linea, j) => (
                <text key={j} x={cx} y={Y + 94 + j * 11}>
                  {linea}
                </text>
              ))}
            </g>
          </g>
        )
      })}

      {/* la marca del real decreto, sobre el objetivo que elige */}
      <g>
        <line
          data-pieza="marca-rd"
          x1={X0 + (ANCHO + 4) + ANCHO / 2}
          y1="38"
          x2={X0 + (ANCHO + 4) + ANCHO / 2}
          y2="26"
          stroke={ROJO}
          strokeWidth="1.6"
        />
        <text
          x={X0 + (ANCHO + 4) + ANCHO / 2}
          y="21"
          fontSize="8.5"
          textAnchor="middle"
          fontWeight="bold"
          fill={ROJO}
        >
          el que exige el RD 3/2023
        </text>
      </g>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="196">
          El anexo III del RD 3/2023 no dice «tómese una muestra»: dice que el muestreo microbiológico en el
        </text>
        <text x="8" y="209">
          grifo del usuario se haga con arreglo a la UNE-EN ISO 19458 «con objetivo b)».
        </text>
        <text x="8" y="227">
          Y esa letra decide el procedimiento entero. Con el objetivo a) se busca la red y hay que borrar el
        </text>
        <text x="8" y="240">
          grifo del resultado. Con el c) se busca lo contrario: lo que de verdad sale, con su alcachofa sucia
        </text>
        <text x="8" y="253">
          incluida, y por eso es el que se usa cuando se investiga un brote.
        </text>
        <text x="8" y="271">
          Tres objetivos, tres procedimientos y tres resultados distintos DEL MISMO GRIFO.
        </text>
      </g>
    </g>
  )
}


/* ---------- Tema 37: aire y contaminacion atmosferica ---------- */

/**
 * Las curvas de corte de PM10 y PM2,5.
 *
 * El RD 102/2011 no define las particulas por su tamaño a secas: las define
 * por el cabezal, "para un diametro aerodinamico de 10 µm -o 2,5- con una
 * EFICIENCIA DE CORTE DEL 50 %". Es decir, el 10 y el 2,5 no son un techo:
 * son el punto en el que el captador deja pasar justo la mitad.
 *
 * Las curvas se calculan, no se trazan: E(d) = 1 / (1 + (d/d50)^-s), que vale
 * exactamente 0,5 en d = d50 por construccion. El control lo busca despues
 * sobre el trazado muestreado y lo compara con el numero escrito en el rotulo.
 */
function CortePm10Pm25() {
  const X0 = 56
  const ANCHO = 384
  const BASE = 196
  const CIMA = 52
  /** Diametro aerodinamico, escala logaritmica de 0,4 a 40 µm. */
  const D_MIN = Math.log10(0.4)
  const D_MAX = Math.log10(40)
  const xDe = (d: number) => X0 + ((Math.log10(d) - D_MIN) / (D_MAX - D_MIN)) * ANCHO
  const yDe = (e: number) => BASE - (e / 100) * (BASE - CIMA)

  /** Eficiencia de captacion, en %: sigmoide logistica en log(d). */
  const eficiencia = (d: number, d50: number, s: number) => 100 / (1 + Math.pow(d / d50, -s))

  const traza = (d50: number, s: number) => {
    const pts: [number, number][] = []
    for (let i = 0; i <= 220; i++) {
      const d = Math.pow(10, D_MIN + (i / 220) * (D_MAX - D_MIN))
      pts.push([xDe(d), yDe(eficiencia(d, d50, s))])
    }
    return pts.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join(' ')
  }

  const marca = (pieza: string, d50: number, color: string, rotulo: string, dy: number) => (
    <g key={pieza}>
      <line
        data-pieza={'marca-' + pieza}
        x1={xDe(d50)}
        y1={yDe(50)}
        x2={xDe(d50)}
        y2={BASE}
        stroke={color}
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />
      <text
        data-pieza={'cifra-' + pieza}
        x={xDe(d50)}
        y={BASE + dy}
        fontSize="8.5"
        textAnchor="middle"
        fontWeight="bold"
        fill={color}
      >
        {rotulo}
      </text>
    </g>
  )

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* la linea del 50 %, que es la que define todo */}
      <line
        data-pieza="linea-50"
        x1={X0}
        y1={yDe(50)}
        x2={X0 + ANCHO}
        y2={yDe(50)}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 3"
        opacity="0.7"
      />
      <text x={X0 + ANCHO + 4} y={yDe(50) + 3} fontSize="8" fontWeight="bold" fill="currentColor">
        50 %
      </text>

      <g stroke="currentColor" strokeWidth="1.6">
        <line x1={X0} y1={CIMA - 8} x2={X0} y2={BASE} />
        <line x1={X0} y1={BASE} x2={X0 + ANCHO} y2={BASE} />
      </g>
      <text x="8" y="36" fontSize="8" fill="currentColor">
        eficiencia de captación (%)
      </text>
      <text x={X0 + ANCHO} y={BASE + 41} fontSize="8" textAnchor="end" fill="currentColor">
        diámetro aerodinámico (µm)
      </text>

      <g fontSize="7.5" textAnchor="middle" fill="currentColor">
        {[0.5, 1, 5, 10, 20].map((d) => (
          <text key={d} data-pieza={'eje-' + d} x={xDe(d)} y={BASE + 12}>
            {String(d).replace('.', ',')}
          </text>
        ))}
      </g>

      <path data-pieza="curva-pm10" d={traza(10, 6)} fill="none" stroke={AZUL} strokeWidth="1.9" />
      <path data-pieza="curva-pm25" d={traza(2.5, 6)} fill="none" stroke={ROJO} strokeWidth="1.9" />

      {marca('pm25', 2.5, ROJO, '2,5 µm', 25)}
      {marca('pm10', 10, AZUL, '10 µm', 25)}

      <text data-pieza="rotulo-pm25" x={xDe(3.6)} y={CIMA - 10} fontSize="9" fontWeight="bold" fill={ROJO}>
        PM2,5
      </text>
      <text data-pieza="rotulo-pm10" x={xDe(14)} y={CIMA - 10} fontSize="9" fontWeight="bold" fill={AZUL}>
        PM10
      </text>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="259">
          El 10 y el 2,5 NO son un techo: son el diámetro en el que el cabezal deja pasar justo la MITAD de
        </text>
        <text x="8" y="272">
          las partículas. Por encima captura menos; por debajo, casi todas.
        </text>
        <text x="8" y="290">
          Y de ahí sale lo que de verdad hay que entender: la PM2,5 está DENTRO de la PM10. No son dos
        </text>
        <text x="8" y="303">
          contaminantes distintos, sino dos cortes del mismo polvo, y el fino siempre es una parte del grueso.
        </text>
      </g>
    </g>
  )
}

/**
 * Del cabezal al ICP-MS: un solo filtro, dos determinaciones.
 *
 * Es lo que une las dos mitades del enunciado del tema 37. El aire entra por
 * un CABEZAL de corte, deja las particulas en un FILTRO y sale por la BOMBA.
 * Y ese mismo filtro sirve para dos cosas, en un orden que no se puede
 * invertir: primero se PESA -gravimetria, que es no destructiva- y solo
 * despues se DIGIERE con acido para medir los metales por ICP-MS.
 *
 * El dibujo lo afirma con el orden de las piezas y con los numeros de paso, y
 * la bateria lo comprueba sobre la geometria.
 */
function CaptacionPmYMetales() {
  const Y = 52
  const ALTO = 46
  const ETAPAS = [
    { clave: 'cabezal', x: 26, ancho: 126, titulo: 'CABEZAL de corte', pie: 'PM10 o PM2,5' },
    { clave: 'filtro', x: 176, ancho: 110, titulo: 'FILTRO', pie: 'fibra de vidrio o cuarzo' },
    { clave: 'bomba', x: 310, ancho: 122, titulo: 'BOMBA', pie: 'caudal constante' },
  ]
  const RAMAS = [
    {
      clave: 'gravimetria',
      x: 34,
      ancho: 214,
      paso: 1,
      titulo: 'GRAVIMETRÍA',
      color: AZUL,
      pie: ['acondicionar y PESAR el filtro', 'antes y después: la diferencia', 'es la concentración másica'],
    },
    {
      clave: 'metales',
      x: 286,
      ancho: 214,
      paso: 2,
      titulo: 'METALES',
      color: ROJO,
      pie: ['DIGESTIÓN ácida del filtro y', 'medida por ICP-MS de', 'Pb, Cd, As y Ni'],
    },
  ]
  const Y_RAMA = 160
  const ALTO_RAMA = 62
  const filtro = ETAPAS[1]
  const cxFiltro = filtro.x + filtro.ancho / 2

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* la cadena de captacion */}
      {ETAPAS.map((e, i) => (
        <g key={e.clave}>
          <rect
            data-pieza={'etapa-' + e.clave}
            x={e.x}
            y={Y}
            width={e.ancho}
            height={ALTO}
            rx="4"
            fill={AZUL}
            fillOpacity={e.clave === 'filtro' ? 0.5 : 0.22}
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <text x={e.x + e.ancho / 2} y={Y + 20} fontSize="8.5" textAnchor="middle" fontWeight="bold" fill="currentColor">
            {e.titulo}
          </text>
          <text x={e.x + e.ancho / 2} y={Y + 33} fontSize="7.5" textAnchor="middle" fill="currentColor">
            {e.pie}
          </text>
          {i < ETAPAS.length - 1 ? (
            <g stroke="currentColor" strokeWidth="1.6" fill="none">
              <path
                d={'M' + (e.x + e.ancho) + ' ' + (Y + ALTO / 2) + ' h' + (ETAPAS[i + 1].x - e.x - e.ancho - 6)}
              />
              <path
                d={
                  'M' + (ETAPAS[i + 1].x - 6) + ' ' + (Y + ALTO / 2 - 4) +
                  ' l6 4 l-6 4'
                }
              />
            </g>
          ) : null}
        </g>
      ))}
      <text x="26" y="34" fontSize="8" fill="currentColor">
        entra el aire →
      </text>
      <text x="432" y="34" fontSize="8" textAnchor="end" fill="currentColor">
        → sale el aire
      </text>

      {/* las dos ramas, que cuelgan del filtro */}
      {RAMAS.map((r) => {
        const cx = r.x + r.ancho / 2
        const ym = (Y + ALTO + Y_RAMA) / 2
        return (
          <g key={r.clave}>
            <path
              d={'M' + cxFiltro + ' ' + (Y + ALTO) + ' V' + ym + ' H' + cx + ' V' + Y_RAMA}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <rect
              data-pieza={'rama-' + r.clave}
              x={r.x}
              y={Y_RAMA}
              width={r.ancho}
              height={ALTO_RAMA}
              rx="4"
              fill={r.color}
              fillOpacity="0.16"
              stroke={r.color}
              strokeWidth="1.2"
            />
            <text
              data-pieza={'paso-' + r.clave}
              x={r.x + 12}
              y={Y_RAMA + 16}
              fontSize="10"
              fontWeight="bold"
              fill={r.color}
            >
              {r.paso + '.'}
            </text>
            <text x={cx + 8} y={Y_RAMA + 16} fontSize="9" textAnchor="middle" fontWeight="bold" fill={r.color}>
              {r.titulo}
            </text>
            <g fontSize="7.5" textAnchor="middle" fill="currentColor">
              {r.pie.map((linea, j) => (
                <text key={j} x={cx} y={Y_RAMA + 31 + j * 11}>
                  {linea}
                </text>
              ))}
            </g>
          </g>
        )
      })}

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="246">
          El orden NO se puede invertir: la gravimetría es no destructiva y la digestión disuelve el filtro
        </text>
        <text x="8" y="259">
          entero. Quien digiera primero se queda sin poder pesar.
        </text>
        <text x="8" y="277">
          Un solo captador y un solo filtro dan, por tanto, las dos mitades del enunciado: la masa de PM10 o
        </text>
        <text x="8" y="290">
          PM2,5 y el contenido de metales de esa misma fracción.
        </text>
      </g>
    </g>
  )
}

/* ---------- Tema 38: validacion e incertidumbre ---------- */

/**
 * Veracidad y precision: las cuatro dianas.
 *
 * El centro de cada diana es el valor de referencia. La VERACIDAD se lee en
 * donde cae la media de los impactos (el sesgo); la PRECISION, en cuanto se
 * separan entre si. Son independientes, y por eso hay cuatro combinaciones.
 *
 * Los impactos no se colocan a ojo: salen de dos patrones simetricos (uno
 * apretado y uno abierto) cuya media es exactamente el centro, desplazados por
 * un mismo sesgo en la fila de abajo. Asi las dos dianas de una fila tienen el
 * mismo sesgo y las dos de una columna la misma dispersion, y el control lo
 * comprueba midiendo los impactos.
 */
function DianasVeracidadPrecision() {
  const R = 46
  const COLUMNAS = [190, 380]
  const FILAS = [100, 232]
  /** Sesgo de la fila de abajo, en fracciones de R (x, y; la y crece hacia abajo). */
  const SESGO: [number, number] = [0.42, -0.36]

  /** Ocho impactos en pares opuestos: su media es exactamente (0, 0). */
  const patron = (r1: number, r2: number, giro: number) =>
    Array.from({ length: 8 }, (_, i) => {
      const a = ((i * 45 + giro) * Math.PI) / 180
      const r = i % 2 === 0 ? r1 : r2
      return [r * Math.cos(a), r * Math.sin(a)] as [number, number]
    })
  const APRETADO = patron(0.07, 0.13, 10)
  const ABIERTO = patron(0.42, 0.58, 25)

  const DIANAS = [
    { clave: 'vp', col: 0, fila: 0, rotulo: 'veraz y preciso = EXACTO', impactos: APRETADO, sesgo: false },
    { clave: 'vi', col: 1, fila: 0, rotulo: 'veraz, pero impreciso', impactos: ABIERTO, sesgo: false },
    { clave: 'sp', col: 0, fila: 1, rotulo: 'preciso, pero con sesgo', impactos: APRETADO, sesgo: true },
    { clave: 'si', col: 1, fila: 1, rotulo: 'con sesgo e impreciso', impactos: ABIERTO, sesgo: true },
  ]

  return (
    <g fontFamily="system-ui, sans-serif">
      {DIANAS.map((d) => {
        const cx = COLUMNAS[d.col]
        const cy = FILAS[d.fila]
        const [bx, by] = d.sesgo ? SESGO : [0, 0]
        return (
          <g key={d.clave}>
            <circle data-pieza={'anillo-' + d.clave} cx={cx} cy={cy} r={R} fill={AZUL_CLARO} fillOpacity="0.5" stroke="currentColor" strokeWidth="1.2" />
            <circle cx={cx} cy={cy} r={(R * 2) / 3} fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
            <circle cx={cx} cy={cy} r={R / 3} fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
            <circle data-pieza={'centro-' + d.clave} cx={cx} cy={cy} r="2.2" fill="currentColor" />
            {d.impactos.map(([x, y], i) => (
              <circle
                key={i}
                data-pieza={'impacto-' + d.clave}
                cx={(cx + (x + bx) * R).toFixed(2)}
                cy={(cy + (y + by) * R).toFixed(2)}
                r="3.2"
                fill={ROJO}
                stroke="#fff"
                strokeWidth="0.6"
              />
            ))}
            <text
              data-pieza={'rotulo-' + d.clave}
              x={cx}
              y={cy + R + 16}
              fontSize="9"
              textAnchor="middle"
              fontWeight="bold"
              fill="currentColor"
            >
              {d.rotulo}
            </text>
          </g>
        )
      })}

      {/* el centro, señalado en la diana de abajo, que es la que lo deja ver */}
      <line
        x1="78"
        y1={FILAS[1] - 3}
        x2={COLUMNAS[0] - 4}
        y2={FILAS[1]}
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <g fontSize="8.5" fill="currentColor">
        <text x="8" y={FILAS[1] - 14}>el centro =</text>
        <text x="8" y={FILAS[1] - 3}>valor de</text>
        <text x="8" y={FILAS[1] + 8}>referencia</text>
        <text x="8" y="318">
          VERACIDAD: dónde cae la MEDIA de los impactos respecto del centro. Se cuantifica con el sesgo.
        </text>
        <text x="8" y="331">
          PRECISIÓN: cuánto se separan los impactos ENTRE SÍ, caigan donde caigan. Se cuantifica con s.
        </text>
      </g>
    </g>
  )
}

/**
 * Las incertidumbres se suman en cuadratura: uc es la hipotenusa.
 *
 * Numeros del ejemplo resuelto del Nordtest TR 537 (amonio por EN ISO 11732):
 * u(Rw) = 1,67 %, u(sesgo) = 2,73 %, uc = 3,20 %, U = 2 uc = 6,40 %.
 *
 * El triangulo se construye con los dos catetos y la hipotenusa se CALCULA
 * como el segmento que une sus extremos; las barras usan la misma escala. El
 * control mide el angulo recto y la longitud de la hipotenusa, y contrasta las
 * cifras escritas con las barras.
 */
function IncertidumbreEnCuadratura() {
  const ESCALA = 40 // px por punto porcentual
  const U_RW = 1.67
  const U_SESGO = 2.73
  const UC = Math.sqrt(U_RW ** 2 + U_SESGO ** 2)
  const U = 2 * UC
  const coma = (n: number) => n.toFixed(2).replace('.', ',') + ' %'

  // triangulo: angulo recto abajo a la izquierda
  const VX = 70
  const VY = 205
  const hx = VX + U_RW * ESCALA
  const vy = VY - U_SESGO * ESCALA

  const X0 = 300
  const BARRAS = [
    { clave: 'rw', y: 52, valor: U_RW, rotulo: 'u(Rw)', color: AZUL },
    { clave: 'sesgo', y: 82, valor: U_SESGO, rotulo: 'u(sesgo)', color: AZUL },
    { clave: 'uc', y: 112, valor: UC, rotulo: 'uc', color: ROJO },
    { clave: 'U', y: 182, valor: U, rotulo: 'U = 2·uc', color: ROJO },
  ]

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* el triangulo rectangulo */}
      <line data-pieza="cateto-rw" x1={VX} y1={VY} x2={hx} y2={VY} stroke={AZUL} strokeWidth="4" strokeLinecap="round" />
      <line data-pieza="cateto-sesgo" x1={VX} y1={VY} x2={VX} y2={vy} stroke={AZUL} strokeWidth="4" strokeLinecap="round" />
      <line data-pieza="hipotenusa-uc" x1={hx} y1={VY} x2={VX} y2={vy} stroke={ROJO} strokeWidth="3" strokeLinecap="round" />
      <path d={`M${VX + 9} ${VY} V${VY - 9} H${VX}`} fill="none" stroke="currentColor" strokeWidth="1" />
      <g fontSize="9" fontWeight="bold" fill="currentColor">
        <text x={(VX + hx) / 2} y={VY + 15} textAnchor="middle">
          u(Rw)
        </text>
        <text x={VX - 6} y={(VY + vy) / 2} textAnchor="end">
          u(sesgo)
        </text>
        <text x={(VX + hx) / 2 + 10} y={(VY + vy) / 2 - 4} fill={ROJO}>
          uc
        </text>
      </g>
      <text x="8" y="34" fontSize="8.5" fill="currentColor">
        precisión y veracidad, como catetos
      </text>

      {/* las barras, a la misma escala */}
      {BARRAS.map((b) => (
        <g key={b.clave}>
          <rect
            data-pieza={'barra-' + b.clave}
            x={X0}
            y={b.y}
            width={(b.valor * ESCALA).toFixed(2)}
            height="18"
            fill={b.color}
            fillOpacity={b.color === ROJO ? 0.28 : 0.55}
            stroke={b.color}
            strokeWidth="1"
          />
          <text x={X0 - 6} y={b.y + 12.5} fontSize="9" textAnchor="end" fontWeight="bold" fill="currentColor">
            {b.rotulo}
          </text>
          <text
            data-pieza={'cifra-' + b.clave}
            x={X0 + b.valor * ESCALA - 4}
            y={b.y + 12.5}
            fontSize="8.5"
            textAnchor="end"
            fill="currentColor"
          >
            {coma(b.valor)}
          </text>
        </g>
      ))}
      {/* la suma directa, que es lo que NO se hace */}
      <rect
        x={X0}
        y="142"
        width={((U_RW + U_SESGO) * ESCALA).toFixed(2)}
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 3"
        opacity="0.8"
      />
      <text x={X0 - 6} y="154.5" fontSize="8.5" textAnchor="end" fill="currentColor">
        suma directa
      </text>
      <text x={X0 + (U_RW + U_SESGO) * ESCALA + 5} y="154.5" fontSize="8.5" fill="currentColor">
        {coma(U_RW + U_SESGO) + ' ✗'}
      </text>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="240">
          Las componentes se combinan como los catetos de un triángulo rectángulo:
        </text>
        <text x="8" y="253">
          uc = √(u(Rw)² + u(sesgo)²) = √(1,67² + 2,73²). Nunca 1,67 + 2,73: los errores independientes se compensan en parte.
        </text>
        <text x="8" y="271">
          La expandida, con k = 2 (≈ 95 %): U = 2 · 3,20 = 6,40 % → se informa ± 7 %.
        </text>
        <text x="8" y="289">
          Datos: amonio en agua por EN ISO 11732, ejemplo resuelto del Nordtest TR 537.
        </text>
      </g>
    </g>
  )
}

/**
 * Del LD al final de la recta: el intervalo de trabajo.
 *
 * La curva de respuesta se CALCULA: S(c) = c / (1 + (c/K)^p)^(1/p), que sale
 * de la recta S = c sin separarse al principio y se aplana hacia la meseta K.
 * El intervalo de trabajo va del LC (10 s0') hasta el punto en que la curva se
 * aparta de la recta la tolerancia elegida, y ese punto tambien se calcula.
 *
 * El control reconstruye la escala del eje con sus propias marcas, comprueba
 * que el LC esta a 10/3 del LD y que el intervalo empieza en el, y mide la
 * desviacion de la curva frente a la recta dentro y fuera del intervalo.
 */
function IntervaloDeTrabajo() {
  const X0 = 60
  const ANCHO = 420
  const C_MAX = 80
  const BASE = 214
  const CIMA = 40
  const S_MAX = 64
  const xDe = (c: number) => X0 + (c / C_MAX) * ANCHO
  const yDe = (s: number) => BASE - (s / S_MAX) * (BASE - CIMA)

  const K = 60
  const P = 6
  const respuesta = (c: number) => c / Math.pow(1 + Math.pow(c / K, P), 1 / P)

  /** s0' del blanco, y los dos limites que salen de el. */
  const S0 = 1.2
  const LD = 3 * S0
  const LC = 10 * S0
  /** Tolerancia de linealidad del ejemplo, y donde se alcanza (se despeja de la curva). */
  const TOL = 5
  const C_FIN = K * Math.pow(Math.pow(1 / (1 - TOL / 100), P) - 1, 1 / P)

  const curva = Array.from({ length: 241 }, (_, i) => {
    const c = (i / 240) * C_MAX
    return (i ? 'L' : 'M') + xDe(c).toFixed(2) + ' ' + yDe(respuesta(c)).toFixed(2)
  }).join(' ')

  const Y_TRAMO = BASE + 44

  return (
    <g fontFamily="system-ui, sans-serif">
      <g stroke="currentColor" strokeWidth="1.6">
        <line x1={X0} y1={CIMA - 8} x2={X0} y2={BASE} />
        <line x1={X0} y1={BASE} x2={X0 + ANCHO} y2={BASE} />
      </g>
      <text x="8" y="24" fontSize="8" fill="currentColor">
        señal del instrumento
      </text>
      <text x={X0 + ANCHO} y={BASE + 25} fontSize="8" textAnchor="end" fill="currentColor">
        concentración (µg/L)
      </text>
      <g fontSize="7.5" textAnchor="middle" fill="currentColor">
        {[0, 20, 40, 60, 80].map((c) => (
          <text key={c} data-pieza={'eje-' + c} x={xDe(c)} y={BASE + 11}>
            {c}
          </text>
        ))}
      </g>

      {/* la recta que se esperaria, y la respuesta real */}
      <line
        data-pieza="recta-ideal"
        x1={xDe(0)}
        y1={yDe(0)}
        x2={xDe(S_MAX)}
        y2={yDe(S_MAX)}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 3"
        opacity="0.7"
      />
      <path data-pieza="curva-respuesta" d={curva} fill="none" stroke={ROJO} strokeWidth="2" />

      {/* LD y LC */}
      {[
        { clave: 'ld', c: LD, rotulo: 'LD', factor: '3 s₀′', dy: 0 },
        { clave: 'lc', c: LC, rotulo: 'LC', factor: '10 s₀′', dy: 0 },
      ].map((m) => (
        <g key={m.clave}>
          <line
            data-pieza={'marca-' + m.clave}
            x1={xDe(m.c)}
            y1={BASE - 60}
            x2={xDe(m.c)}
            y2={BASE}
            stroke={m.clave === 'lc' ? ROJO : 'currentColor'}
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />
          <text x={xDe(m.c)} y={BASE - 74} fontSize="9" fontWeight="bold" textAnchor="middle" fill="currentColor">
            {m.rotulo}
          </text>
          <text
            data-pieza={'factor-' + m.clave}
            x={xDe(m.c)}
            y={BASE - 64}
            fontSize="7.5"
            textAnchor="middle"
            fill="currentColor"
          >
            {m.factor}
          </text>
        </g>
      ))}

      {/* el intervalo de trabajo */}
      <g stroke={ROJO} strokeWidth="1.6">
        <line data-pieza="tramo-trabajo" x1={xDe(LC)} y1={Y_TRAMO} x2={xDe(C_FIN)} y2={Y_TRAMO} />
        <line x1={xDe(LC)} y1={Y_TRAMO - 5} x2={xDe(LC)} y2={Y_TRAMO + 5} />
        <line x1={xDe(C_FIN)} y1={Y_TRAMO - 5} x2={xDe(C_FIN)} y2={Y_TRAMO + 5} />
      </g>
      <text
        x={(xDe(LC) + xDe(C_FIN)) / 2}
        y={Y_TRAMO - 6}
        fontSize="9"
        fontWeight="bold"
        textAnchor="middle"
        fill={ROJO}
      >
        INTERVALO DE TRABAJO
      </text>
      <text x={xDe(C_FIN) + 8} y={Y_TRAMO + 3} fontSize="8" fill="currentColor">
        aquí la curva ya se separa de la recta
      </text>
      <text x={xDe(70)} y={yDe(48)} fontSize="8" textAnchor="middle" fill="currentColor">
        meseta: la sensibilidad cae
      </text>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="286">
          Empieza en el LC, no en el LD: entre los dos el analito se detecta, pero no se cuantifica con garantías.
        </text>
        <text data-pieza="tolerancia" x="8" y="299">
          Acaba donde la respuesta deja de ser proporcional. En este ejemplo, cuando se aparta un 5 % de la recta
        </text>
        <text x="8" y="312">
          (la tolerancia la fija el laboratorio). Por encima, se diluye la muestra y se vuelve a medir.
        </text>
      </g>
    </g>
  )
}

/* ---------- Tema 39: control de calidad, patrones y calibracion ---------- */

/**
 * Grafico de control X, con las dos reglas del Nordtest TR 569 (ed. 6.1).
 *
 * Los valores se dan en unidades de s respecto de la linea central. Hay dos
 * situaciones fuera de control -un valor mas alla de 3s y un «dos de tres»
 * entre 2s y 3s del mismo lado- y dos valores en zona de aviso que NO lo son.
 * Cuales se marcan en rojo lo decide la propia regla, aplicada aqui; el
 * control la vuelve a aplicar sobre los puntos dibujados y exige que coincida.
 */
function GraficoControlX() {
  const X0 = 64
  const PASO = 18
  const LC = 150
  const S = 22
  const Z = [0.3, -0.8, 1.2, -0.5, -2.4, -0.9, 0.6, 1.5, -0.2, 3.4, 0.8, -1.1, 0.4, -0.6, 1.0, -1.4, 0.2, 2.3, 1.1, 2.5, -0.3, 0.9, -1.2, 0.5]
  const xDe = (i: number) => X0 + 10 + i * PASO
  const yDe = (z: number) => LC - z * S
  const enAviso = (z: number) => Math.abs(z) > 2 && Math.abs(z) <= 3
  const fuera = Z.map((z, i) => {
    if (Math.abs(z) > 3) return true
    if (!enAviso(z)) return false
    return [i - 1, i - 2].some((j) => j >= 0 && enAviso(Z[j]) && Math.sign(Z[j]) === Math.sign(z))
  })
  const X1 = X0
  const X2 = xDe(Z.length - 1) + 12
  const LINEAS = [
    { clave: 'accion-sup', z: 3, rotulo: '+3s  acción' },
    { clave: 'aviso-sup', z: 2, rotulo: '+2s  aviso' },
    { clave: 'linea-central', z: 0, rotulo: 'línea central' },
    { clave: 'aviso-inf', z: -2, rotulo: '−2s  aviso' },
    { clave: 'accion-inf', z: -3, rotulo: '−3s  acción' },
  ]
  const ruta = Z.map((z, i) => (i ? 'L' : 'M') + xDe(i) + ' ' + yDe(z).toFixed(1)).join(' ')

  return (
    <g fontFamily="system-ui, sans-serif">
      {LINEAS.map((l) => (
        <g key={l.clave}>
          <line
            data-pieza={l.clave}
            x1={X1}
            y1={yDe(l.z)}
            x2={X2}
            y2={yDe(l.z)}
            stroke={Math.abs(l.z) === 3 ? ROJO : 'currentColor'}
            strokeWidth={l.z === 0 ? 1.4 : 1.1}
            strokeDasharray={Math.abs(l.z) === 2 ? '5 3' : undefined}
            opacity={l.z === 0 ? 0.9 : 0.8}
          />
          <text x={X2 + 5} y={yDe(l.z) + 3} fontSize="8" fill={Math.abs(l.z) === 3 ? ROJO : 'currentColor'}>
            {l.rotulo}
          </text>
        </g>
      ))}
      <line x1={X1} y1={yDe(3.6)} x2={X1} y2={yDe(-3.6)} stroke="currentColor" strokeWidth="1.4" />
      <text x="8" y="26" fontSize="8" fill="currentColor">
        valor de control
      </text>
      <text x={X2} y={yDe(-3.6) + 14} fontSize="8" textAnchor="end" fill="currentColor">
        serie analítica →
      </text>

      <path d={ruta} fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      {Z.map((z, i) => (
        <circle
          key={i}
          data-pieza={fuera[i] ? 'valor-fuera' : 'valor'}
          cx={xDe(i)}
          cy={yDe(z).toFixed(2)}
          r={fuera[i] ? 4.2 : 3}
          fill={fuera[i] ? ROJO : AZUL}
          stroke={fuera[i] ? '#fff' : 'currentColor'}
          strokeWidth="0.7"
        />
      ))}

      {/* las tres situaciones que hay que saber leer */}
      <g fontSize="7.5" fill="currentColor">
        <text x={xDe(9) + 7} y={yDe(3.4) + 3}>
          fuera de ±3s
        </text>
        <text x={xDe(19) + 7} y={yDe(2.5) - 4}>
          dos de tres
        </text>
        <text x={xDe(4) + 7} y={yDe(-2.4) + 3}>
          entre aviso y acción, pero bajo control
        </text>
      </g>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="282">
          FUERA DE CONTROL si un valor pasa de ±3s, o si está entre 2s y 3s y otro de los dos anteriores también,
        </text>
        <text x="8" y="295">
          del mismo lado. Entonces no se informa y se reanaliza todo desde el último control correcto.
        </text>
        <text x="8" y="313">
          Un valor suelto entre aviso y acción, con los dos anteriores dentro, sigue BAJO CONTROL.
        </text>
      </g>
    </g>
  )
}

/**
 * La recta de calibrado por minimos cuadrados, con los datos del supuesto 1
 * de 1322 (1, 2, 5 y 10 mg/L; 0,05, 0,10, 0,24 y 0,50 de absorbancia).
 *
 * La pendiente, la ordenada y el R2 se CALCULAN aqui con las formulas de los
 * minimos cuadrados, y los residuos se dibujan ampliados en un panel aparte.
 * El control recalcula el ajuste a partir de los puntos dibujados.
 */
function RectaMinimosCuadrados() {
  const DATOS: [number, number][] = [
    [1, 0.05],
    [2, 0.1],
    [5, 0.24],
    [10, 0.5],
  ]
  const n = DATOS.length
  const sx = DATOS.reduce((a, [x]) => a + x, 0)
  const sy = DATOS.reduce((a, [, y]) => a + y, 0)
  const sxy = DATOS.reduce((a, [x, y]) => a + x * y, 0)
  const sxx = DATOS.reduce((a, [x]) => a + x * x, 0)
  const syy = DATOS.reduce((a, [, y]) => a + y * y, 0)
  const b = (n * sxy - sx * sy) / (n * sxx - sx * sx)
  const a = (sy - b * sx) / n
  const r = (n * sxy - sx * sy) / Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy))

  const X0 = 70
  const ANCHO = 400
  const C_MAX = 11
  const BASE = 214
  const CIMA = 44
  const A_MAX = 0.55
  const xDe = (c: number) => X0 + (c / C_MAX) * ANCHO
  const yDe = (v: number) => BASE - (v / A_MAX) * (BASE - CIMA)
  const coma = (v: number, d: number) => v.toFixed(d).replace('.', ',').replace('-', '−')

  /** Panel de residuos: cero en Y_RES, ampliados AMPLIA veces respecto al grafico de arriba. */
  const Y_RES = 290
  const AMPLIA = 8
  const pxPorAbs = (BASE - CIMA) / A_MAX

  return (
    <g fontFamily="system-ui, sans-serif">
      <g stroke="currentColor" strokeWidth="1.5">
        <line x1={X0} y1={CIMA - 10} x2={X0} y2={BASE} />
        <line x1={X0} y1={BASE} x2={X0 + ANCHO} y2={BASE} />
      </g>
      <text x="8" y="28" fontSize="8" fill="currentColor">
        absorbancia
      </text>
      <text x={X0 + ANCHO} y={BASE + 24} fontSize="8" textAnchor="end" fill="currentColor">
        concentración del patrón (mg/L)
      </text>
      <g fontSize="7.5" textAnchor="middle" fill="currentColor">
        {[0, 2, 4, 6, 8, 10].map((c) => (
          <text key={c} x={xDe(c)} y={BASE + 11}>
            {c}
          </text>
        ))}
      </g>
      <g fontSize="7.5" textAnchor="end" fill="currentColor">
        {[0.1, 0.2, 0.3, 0.4, 0.5].map((v) => (
          <text key={v} x={X0 - 4} y={yDe(v) + 3}>
            {coma(v, 1)}
          </text>
        ))}
      </g>

      <line
        data-pieza="recta"
        x1={xDe(0)}
        y1={yDe(a).toFixed(2)}
        x2={xDe(C_MAX)}
        y2={yDe(a + b * C_MAX).toFixed(2)}
        stroke={ROJO}
        strokeWidth="1.8"
      />
      {DATOS.map(([x, y]) => (
        <circle
          key={x}
          data-pieza="punto"
          cx={xDe(x).toFixed(2)}
          cy={yDe(y).toFixed(2)}
          r="3.6"
          fill={AZUL}
          stroke="currentColor"
          strokeWidth="0.8"
        />
      ))}
      <g fontSize="9" fontWeight="bold" fill={ROJO}>
        <text data-pieza="ecuacion" x={xDe(0.6)} y={CIMA + 4}>
          {'A = ' + coma(b, 4) + ' · c ' + (a < 0 ? '− ' : '+ ') + coma(Math.abs(a), 4)}
        </text>
        <text data-pieza="r2" x={xDe(0.6)} y={CIMA + 18}>
          {'R² = ' + coma(r * r, 4)}
        </text>
      </g>

      {/* los residuos */}
      <line x1={X0} y1={Y_RES} x2={X0 + ANCHO} y2={Y_RES} stroke="currentColor" strokeWidth="1" />
      <text x="8" y={Y_RES - 26} fontSize="8" fill="currentColor">
        residuos
      </text>
      <text x="8" y={Y_RES - 16} fontSize="8" fill="currentColor">
        (×{AMPLIA})
      </text>
      {DATOS.map(([x, y]) => {
        const residuo = y - (a + b * x)
        return (
          <line
            key={x}
            data-pieza="residuo"
            x1={xDe(x).toFixed(2)}
            y1={Y_RES}
            x2={xDe(x).toFixed(2)}
            y2={(Y_RES - residuo * pxPorAbs * AMPLIA).toFixed(2)}
            stroke={AZUL}
            strokeWidth="5"
          />
        )
      })}

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="330">
          La recta hace mínima la suma de los cuadrados de los residuos: la distancia VERTICAL de cada punto a la recta.
        </text>
        <text x="8" y="343">
          Que el R² esté cerca de 1 no basta: lo que demuestra que es una recta es que los residuos salgan
        </text>
        <text x="8" y="356">
          al azar, unos arriba y otros abajo, sin dibujar una curva. Datos: supuesto 1 del examen de 1322.
        </text>
      </g>
    </g>
  )
}

/**
 * La cadena de trazabilidad: del SI al resultado de la muestra.
 *
 * Cada flecha es una calibracion, y el VIM (2.40, nota 1) dice que la
 * incertidumbre "va aumentando necesariamente a lo largo de la secuencia".
 * Las barras son ilustrativas: lo que el dibujo afirma, y el control mide, es
 * que crecen eslabon a eslabon y que ninguna flecha deja un hueco.
 */
function CadenaTrazabilidad() {
  const X0 = 6
  const ANCHO = 98
  const HUECO = 20
  const Y = 58
  const ALTO = 64
  const ESLABONES = [
    { titulo: 'SI', pie: ['kilogramo, mol'], barra: 5 },
    { titulo: 'Patrón nacional', pie: ['CEM u otro instituto', 'nacional de metrología'], barra: 14 },
    { titulo: 'MRC', pie: ['de un productor', 'conforme a ISO 17034'], barra: 28 },
    { titulo: 'Patrón de trabajo', pie: ['disoluciones de la', 'recta, cada día'], barra: 48 },
    { titulo: 'Resultado', pie: ['de la muestra'], barra: 78 },
  ]
  const xDe = (i: number) => X0 + i * (ANCHO + HUECO)
  const Y_BARRA = 158

  return (
    <g fontFamily="system-ui, sans-serif">
      <text x={X0} y="30" fontSize="8.5" fontWeight="bold" fill="currentColor">
        cada flecha es una CALIBRACIÓN documentada
      </text>
      {ESLABONES.map((e, i) => (
        <g key={e.titulo}>
          <rect
            data-pieza="eslabon"
            x={xDe(i)}
            y={Y}
            width={ANCHO}
            height={ALTO}
            rx="5"
            fill={i === ESLABONES.length - 1 ? ROJO : AZUL}
            fillOpacity={i === ESLABONES.length - 1 ? 0.2 : 0.3}
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <text x={xDe(i) + ANCHO / 2} y={Y + 20} fontSize="9" fontWeight="bold" textAnchor="middle" fill="currentColor">
            {e.titulo}
          </text>
          {e.pie.map((l, j) => (
            <text key={l} x={xDe(i) + ANCHO / 2} y={Y + 36 + j * 10} fontSize="7.5" textAnchor="middle" fill="currentColor">
              {l}
            </text>
          ))}
          {i < ESLABONES.length - 1 ? (
            <g stroke="currentColor" strokeWidth="1.6" fill="none">
              <line
                data-pieza="flecha"
                x1={xDe(i) + ANCHO}
                y1={Y + ALTO / 2}
                x2={xDe(i + 1) - 1}
                y2={Y + ALTO / 2}
              />
              <path d={`M${xDe(i + 1) - 6} ${Y + ALTO / 2 - 4} l6 4 l-6 4`} />
            </g>
          ) : null}
          <rect
            data-pieza="incertidumbre"
            x={xDe(i) + ANCHO / 2 - e.barra / 2}
            y={Y_BARRA}
            width={e.barra}
            height="14"
            fill={ROJO}
            fillOpacity="0.35"
            stroke={ROJO}
            strokeWidth="1"
          />
        </g>
      ))}
      <text x={X0} y={Y_BARRA - 10} fontSize="8" fill="currentColor">
        incertidumbre (esquema: crece en cada eslabón; no está a escala)
      </text>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="212">
          La trazabilidad es una propiedad del RESULTADO: poder relacionarlo con una referencia mediante una cadena
        </text>
        <text x="8" y="225">
          ininterrumpida y documentada de calibraciones, cada una de las cuales suma incertidumbre (VIM 2.41).
        </text>
        <text x="8" y="243">
          Si falta un eslabón documentado, no hay trazabilidad. Y aunque la cadena esté completa, la trazabilidad
        </text>
        <text x="8" y="256">
          no garantiza por sí sola que el resultado sea bueno: es necesaria, no suficiente (VIM 2.41, nota 5).
        </text>
      </g>
    </g>
  )
}

/* ---------- Tema 40: acreditacion ---------- */

/**
 * Quien acredita y quien certifica.
 *
 * ENAC ACREDITA a los organismos de evaluacion de la conformidad
 * (laboratorios, entidades de certificacion, entidades de inspeccion); la
 * entidad de certificacion CERTIFICA a la empresa; el laboratorio ENSAYA e
 * informa a su cliente. Ninguna flecha une ENAC con la empresa: es la
 * confusion que explota la pregunta 1246 #27. El control lee de que caja sale
 * y a que caja llega cada flecha.
 */
function AcreditacionCertificacion() {
  type Caja = { clave: string; x: number; y: number; ancho: number; alto: number; titulo: string; pie: string; color: string }
  const ENAC: Caja = { clave: 'enac', x: 215, y: 36, ancho: 150, alto: 46, titulo: 'ENAC', pie: 'único organismo nacional', color: ROJO }
  const MEDIO: Caja[] = [
    { clave: 'laboratorio', x: 18, y: 150, ancho: 160, alto: 46, titulo: 'Laboratorio', pie: 'UNE-EN ISO/IEC 17025', color: AZUL },
    { clave: 'certificadora', x: 210, y: 150, ancho: 160, alto: 46, titulo: 'Entidad de certificación', pie: 'UNE-EN ISO/IEC 17021-1', color: AZUL },
    { clave: 'inspeccion', x: 402, y: 150, ancho: 160, alto: 46, titulo: 'Entidad de inspección', pie: 'UNE-EN ISO/IEC 17020', color: AZUL },
  ]
  const ABAJO: Caja[] = [
    { clave: 'cliente', x: 18, y: 250, ancho: 160, alto: 46, titulo: 'Cliente del laboratorio', pie: 'recibe el informe de ensayo', color: AZUL_CLARO },
    { clave: 'empresa', x: 210, y: 250, ancho: 160, alto: 46, titulo: 'Empresa', pie: 'certificada ISO 9001', color: AZUL_CLARO },
  ]
  const centroX = (c: Caja) => c.x + c.ancho / 2
  const caja = (c: Caja) => (
    <g key={c.clave}>
      <rect
        data-pieza={'nodo-' + c.clave}
        x={c.x}
        y={c.y}
        width={c.ancho}
        height={c.alto}
        rx="5"
        fill={c.color}
        fillOpacity={c.color === ROJO ? 0.22 : 0.35}
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <text x={centroX(c)} y={c.y + 19} fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="currentColor">
        {c.titulo}
      </text>
      <text x={centroX(c)} y={c.y + 34} fontSize="7.5" textAnchor="middle" fill="currentColor">
        {c.pie}
      </text>
    </g>
  )
  /** Flecha de una caja a otra: sale del borde inferior y llega al superior. */
  const flecha = (tipo: string, de: Caja, a: Caja, dx = 0) => {
    const x1 = centroX(de) + dx
    const y1 = de.y + de.alto
    const x2 = centroX(a)
    const y2 = a.y
    const ang = Math.atan2(y2 - y1, x2 - x1)
    const punta = (s: number) => `${x2 - 7 * Math.cos(ang + s)} ${y2 - 7 * Math.sin(ang + s)}`
    return (
      <g key={tipo + a.clave} stroke={tipo === 'acredita' ? ROJO : 'currentColor'} strokeWidth="1.6" fill="none">
        <line data-pieza={tipo} x1={x1.toFixed(1)} y1={y1} x2={x2.toFixed(1)} y2={y2} />
        <path d={`M${punta(0.45)} L${x2} ${y2} L${punta(-0.45)}`} />
      </g>
    )
  }
  const lab = MEDIO[0]
  const cert = MEDIO[1]

  return (
    <g fontFamily="system-ui, sans-serif">
      {[ENAC, ...MEDIO, ...ABAJO].map(caja)}
      {MEDIO.map((m, i) => flecha('acredita', ENAC, m, (i - 1) * 40))}
      {flecha('certifica', cert, ABAJO[1])}
      {flecha('informa', lab, ABAJO[0])}

      <g fontSize="8.5" fontWeight="bold">
        <text x="120" y="118" fill={ROJO}>
          ACREDITA
        </text>
        <text x={centroX(cert) + 6} y="228" fill="currentColor">
          CERTIFICA
        </text>
        <text x={centroX(lab) + 6} y="228" fill="currentColor">
          ENSAYA E INFORMA
        </text>
      </g>
      <text x="452" y="100" fontSize="8" fill="currentColor">
        organismos de evaluación
      </text>
      <text x="452" y="111" fontSize="8" fill="currentColor">
        de la conformidad
      </text>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="322">
          ENAC acredita a quien evalúa; no certifica empresas. La certificadora certifica; no acredita laboratorios.
        </text>
        <text x="8" y="336">
          Y las normas no las hace ninguno de ellos: las hace UNE, la Asociación Española de Normalización.
        </text>
      </g>
    </g>
  )
}

/**
 * El ciclo de acreditacion de ENAC (PAC-ENAC Rev. 7, apartado 8).
 *
 * Primer ciclo de 4 años desde la acreditacion y ciclos siguientes de 5.
 * Seguimientos: el primero antes de 12 meses; despues, nunca mas de 18 meses
 * entre evaluaciones en el primer ciclo ni de 24 en los siguientes. Y una
 * reevaluacion antes de que acabe cada ciclo. Las fechas del ejemplo cumplen
 * todas las reglas, y el control las comprueba sobre el dibujo.
 */
function CicloAcreditacion() {
  const X0 = 40
  const ANCHO = 500
  const MESES = 108
  const xDe = (m: number) => X0 + (m / MESES) * ANCHO
  const Y = 120
  const FIN_1 = 48
  const EVENTOS = [
    { m: 0, tipo: 'concesion', rotulo: 'acreditación' },
    { m: 11, tipo: 'seguimiento', rotulo: 'S' },
    { m: 28, tipo: 'seguimiento', rotulo: 'S' },
    { m: 44, tipo: 'reevaluacion', rotulo: 'R' },
    { m: 66, tipo: 'seguimiento', rotulo: 'S' },
    { m: 88, tipo: 'seguimiento', rotulo: 'S' },
    { m: 104, tipo: 'reevaluacion', rotulo: 'R' },
  ]

  return (
    <g fontFamily="system-ui, sans-serif">
      {/* los dos ciclos */}
      <rect data-pieza="ciclo-1" x={xDe(0)} y={Y - 42} width={xDe(FIN_1) - xDe(0)} height="60" fill={AZUL} fillOpacity="0.22" />
      <rect data-pieza="ciclo-2" x={xDe(FIN_1)} y={Y - 42} width={xDe(MESES) - xDe(FIN_1)} height="60" fill={AZUL_CLARO} fillOpacity="0.3" />
      <line data-pieza="fin-ciclo-1" x1={xDe(FIN_1)} y1={Y - 48} x2={xDe(FIN_1)} y2={Y + 24} stroke={ROJO} strokeWidth="1.4" strokeDasharray="4 3" />
      <line data-pieza="fin-ciclo-2" x1={xDe(MESES)} y1={Y - 48} x2={xDe(MESES)} y2={Y + 24} stroke={ROJO} strokeWidth="1.4" strokeDasharray="4 3" />
      <g fontSize="9" fontWeight="bold" textAnchor="middle" fill="currentColor">
        <text x={(xDe(0) + xDe(FIN_1)) / 2} y={Y - 50}>
          1.er ciclo: 4 años
        </text>
        <text x={(xDe(FIN_1) + xDe(MESES)) / 2} y={Y - 50}>
          2.º ciclo y siguientes: 5 años
        </text>
      </g>

      {/* el eje de meses */}
      <line x1={xDe(0)} y1={Y + 24} x2={xDe(MESES)} y2={Y + 24} stroke="currentColor" strokeWidth="1.4" />
      {Array.from({ length: 10 }, (_, i) => i * 12).map((m) => (
        <g key={m}>
          <line data-pieza={'tick-' + m} x1={xDe(m)} y1={Y + 24} x2={xDe(m)} y2={Y + 29} stroke="currentColor" strokeWidth="1" />
          <text x={xDe(m)} y={Y + 40} fontSize="7.5" textAnchor="middle" fill="currentColor">
            {m}
          </text>
        </g>
      ))}
      <text x={xDe(MESES)} y={Y + 54} fontSize="8" textAnchor="end" fill="currentColor">
        meses desde la acreditación
      </text>

      {/* las evaluaciones */}
      {EVENTOS.map((e) => (
        <g key={e.m}>
          <circle
            data-pieza={e.tipo}
            cx={xDe(e.m)}
            cy={Y}
            r={e.tipo === 'seguimiento' ? 5 : 6.5}
            fill={e.tipo === 'seguimiento' ? AZUL : ROJO}
            stroke="currentColor"
            strokeWidth="1"
          />
          <text x={xDe(e.m)} y={Y - 12} fontSize="8" fontWeight="bold" textAnchor="middle" fill="currentColor">
            {e.tipo === 'concesion' ? '' : e.rotulo}
          </text>
        </g>
      ))}
      <text x={xDe(0) + 4} y={Y + 14} fontSize="7.5" fill="currentColor">
        acreditación
      </text>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="202">
          S = seguimiento: el primero antes de 12 meses; después, nunca más de 18 meses entre evaluaciones en el
        </text>
        <text x="8" y="215">
          primer ciclo, ni de 24 en los siguientes. R = reevaluación de la norma entera, antes de que acabe el ciclo.
        </text>
        <text x="8" y="233">
          La renovación se pide firmada 4 meses antes de la reevaluación; si no, la acreditación se extingue.
        </text>
        <text x="8" y="246">
          Y entre medias, visitas de control si hay cambios, mal uso de la marca o una reclamación.
        </text>
      </g>
    </g>
  )
}

/**
 * La estructura del II Plan de Igualdad para empleadas y empleados del
 * Ayuntamiento de Zaragoza (apartado 8): cuatro ejes, doce lineas de actuacion
 * y veintiun objetivos especificos, uno por cuadrado. Se dibujan los objetivos
 * y no las acciones porque en estos coinciden el texto del Plan y sus tablas;
 * en las acciones no (el texto dice 44 y las tablas numeran 43).
 */
function EstructuraPlanIgualdad() {
  const EJES = [
    {
      letra: 'A',
      nombre: ['Cultura de la', 'organización'],
      lineas: [
        { codigo: 'A.1', nombre: 'Comunicación y sensibilización', objetivos: 2 },
        { codigo: 'A.2', nombre: 'Participación y negociación', objetivos: 2 },
        { codigo: 'A.3', nombre: 'Formación', objetivos: 2 },
        { codigo: 'A.4', nombre: 'Estructura y órganos de seguimiento', objetivos: 1 },
      ],
    },
    {
      letra: 'B',
      nombre: ['Gestión de', 'recursos humanos'],
      lineas: [
        { codigo: 'B.1', nombre: 'Acceso', objetivos: 2 },
        { codigo: 'B.2', nombre: 'Plantilla, RPT y promoción', objetivos: 3 },
        { codigo: 'B.3', nombre: 'Retribuciones', objetivos: 2 },
      ],
    },
    {
      letra: 'C',
      nombre: ['Conciliación y', 'corresponsabilidad'],
      lineas: [
        { codigo: 'C.1', nombre: 'Conciliación', objetivos: 2 },
        { codigo: 'C.2', nombre: 'Corresponsabilidad', objetivos: 1 },
      ],
    },
    {
      letra: 'D',
      nombre: ['Prevención, salud', 'laboral y acoso'],
      lineas: [
        { codigo: 'D.1', nombre: 'Prevención y salud laboral', objetivos: 2 },
        { codigo: 'D.2', nombre: 'Clima laboral', objetivos: 1 },
        { codigo: 'D.3', nombre: 'Protección frente al acoso', objetivos: 1 },
      ],
    },
  ]
  const FILA = 19
  const HUECO = 8
  const Y0 = 34
  const X_CUADROS = 404
  let y = Y0
  const bandas = EJES.map((e) => {
    const alto = e.lineas.length * FILA + 8
    const banda = { ...e, y, alto }
    y += alto + HUECO
    return banda
  })
  const total = EJES.reduce((s, e) => s + e.lineas.reduce((t, l) => t + l.objetivos, 0), 0)

  return (
    <g fontFamily="system-ui, sans-serif">
      <g fontSize="8" fontWeight="bold" fill="currentColor">
        <text x="12" y="24">
          EJE
        </text>
        <text x="154" y="24">
          LÍNEA DE ACTUACIÓN
        </text>
        <text x={X_CUADROS} y="24">
          OBJETIVOS ESPECÍFICOS
        </text>
        <text x="568" y="24" textAnchor="end">
          POR EJE
        </text>
      </g>
      {bandas.map((b) => {
        const suma = b.lineas.reduce((t, l) => t + l.objetivos, 0)
        return (
          <g key={b.letra}>
            <rect
              data-pieza="eje"
              data-eje={b.letra}
              x="6"
              y={b.y}
              width="568"
              height={b.alto}
              rx="5"
              fill={AZUL_CLARO}
              fillOpacity="0.45"
              stroke="currentColor"
              strokeWidth="1"
            />
            <text x="14" y={b.y + 17} fontSize="13" fontWeight="bold" fill={ROJO}>
              {b.letra}
            </text>
            <text x="32" y={b.y + 13} fontSize="8.5" fontWeight="bold" fill="currentColor">
              {b.nombre[0]}
            </text>
            <text x="32" y={b.y + 24} fontSize="8.5" fontWeight="bold" fill="currentColor">
              {b.nombre[1]}
            </text>
            {b.lineas.map((l, i) => {
              const yc = b.y + 4 + i * FILA + FILA / 2
              return (
                <g key={l.codigo}>
                  <text data-pieza="linea" x="154" y={yc + 3} fontSize="8.5" fill="currentColor">
                    <tspan fontWeight="bold">{l.codigo}</tspan> {l.nombre}
                  </text>
                  {Array.from({ length: l.objetivos }, (_, k) => (
                    <rect
                      key={k}
                      data-pieza="objetivo"
                      x={X_CUADROS + k * 17}
                      y={yc - 6}
                      width="12"
                      height="12"
                      rx="2"
                      fill={AZUL}
                      stroke="currentColor"
                      strokeWidth="0.9"
                    />
                  ))}
                  <text data-pieza="cifra" x={X_CUADROS + 64} y={yc + 3} fontSize="9" fill="currentColor">
                    {l.objetivos}
                  </text>
                </g>
              )
            })}
            <text data-pieza="total-eje" x="562" y={b.y + b.alto / 2 + 4} fontSize="11" fontWeight="bold" textAnchor="end" fill="currentColor">
              {suma}
            </text>
          </g>
        )
      })}
      <g fontSize="8.5" fill="currentColor">
        <text x="8" y={y + 12}>
          Cada eje tiene un objetivo general; cada línea, sus objetivos específicos; y de cada uno cuelgan
        </text>
        <text x="8" y={y + 25}>
          acciones con plazo, responsables e indicadores.
        </text>
        <text x="568" y={y + 25} fontSize="10" fontWeight="bold" textAnchor="end">
          total: <tspan data-pieza="total">{total}</tspan>
        </text>
      </g>
    </g>
  )
}

/**
 * El circuito del Protocolo del Ayuntamiento de Zaragoza frente al acoso
 * sexual, por razon de sexo y por orientacion sexual (Anexo II del II Plan,
 * apartado VIII). La denuncia entra por la Asesoria Confidencial, que la
 * inadmite, abre el procedimiento informal o pasa al formal; el formal lo
 * lleva el Comite de Asesoramiento, y su informe de valoracion inicia el
 * expediente que resuelve Relaciones Laborales.
 */
function CircuitoProtocoloAcoso() {
  type Caja = { clave: string; x: number; y: number; titulo: string; pie: string; color: string }
  const ANCHO_CAJA = 156
  const ALTO_CAJA = 46
  const C: Record<string, Caja> = {
    denuncia: { clave: 'denuncia', x: 18, y: 24, titulo: 'Denuncia', pie: 'verbal o escrita; no anónima', color: AZUL_CLARO },
    asesoria: { clave: 'asesoria', x: 212, y: 24, titulo: 'Asesoría Confidencial', pie: 'análisis inicial', color: ROJO },
    inadmision: { clave: 'inadmision', x: 18, y: 134, titulo: 'No se admite a trámite', pie: 'fuera del ámbito del protocolo', color: AZUL_CLARO },
    informal: { clave: 'informal', x: 212, y: 134, titulo: 'Procedimiento informal', pie: 'busca resolverlo sin expediente', color: AZUL },
    comite: { clave: 'comite', x: 414, y: 134, titulo: 'Procedimiento formal', pie: 'Comité de Asesoramiento', color: AZUL },
    acuerdo: { clave: 'acuerdo', x: 212, y: 244, titulo: 'Se resuelve', pie: 'con acuerdo de las partes', color: AZUL_CLARO },
    relaciones: { clave: 'relaciones', x: 414, y: 244, titulo: 'Relaciones Laborales', pie: 'expediente y medidas', color: AZUL_CLARO },
  }
  const caja = (c: Caja) => (
    <g key={c.clave}>
      <rect
        data-pieza={'nodo-' + c.clave}
        x={c.x}
        y={c.y}
        width={ANCHO_CAJA}
        height={ALTO_CAJA}
        rx="5"
        fill={c.color}
        fillOpacity={c.color === ROJO ? 0.22 : 0.4}
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <text x={c.x + ANCHO_CAJA / 2} y={c.y + 19} fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="currentColor">
        {c.titulo}
      </text>
      <text x={c.x + ANCHO_CAJA / 2} y={c.y + 34} fontSize="7.5" textAnchor="middle" fill="currentColor">
        {c.pie}
      </text>
    </g>
  )
  const abajo = (c: Caja) => [c.x + ANCHO_CAJA / 2, c.y + ALTO_CAJA]
  const arriba = (c: Caja) => [c.x + ANCHO_CAJA / 2, c.y]
  const derecha = (c: Caja) => [c.x + ANCHO_CAJA, c.y + ALTO_CAJA / 2]
  const izquierda = (c: Caja) => [c.x, c.y + ALTO_CAJA / 2]
  const flecha = (clave: string, [x1, y1]: number[], [x2, y2]: number[]) => {
    const ang = Math.atan2(y2 - y1, x2 - x1)
    const punta = (s: number) => `${(x2 - 7 * Math.cos(ang + s)).toFixed(1)} ${(y2 - 7 * Math.sin(ang + s)).toFixed(1)}`
    return (
      <g key={clave} stroke="currentColor" strokeWidth="1.6" fill="none">
        <line data-pieza="flecha" x1={x1.toFixed(1)} y1={y1} x2={x2.toFixed(1)} y2={y2} />
        <path d={`M${punta(0.45)} L${x2} ${y2} L${punta(-0.45)}`} />
      </g>
    )
  }

  return (
    <g fontFamily="system-ui, sans-serif">
      {Object.values(C).map(caja)}
      {flecha('entra', derecha(C.denuncia), izquierda(C.asesoria))}
      {flecha('inadmite', abajo(C.asesoria), arriba(C.inadmision))}
      {flecha('informal', abajo(C.asesoria), arriba(C.informal))}
      {flecha('formal', abajo(C.asesoria), arriba(C.comite))}
      {flecha('resuelve', abajo(C.informal), arriba(C.acuerdo))}
      {flecha('sin-acuerdo', derecha(C.informal), izquierda(C.comite))}
      {flecha('informe', abajo(C.comite), arriba(C.relaciones))}

      <g fontSize="8" fill="currentColor">
        <text x={(derecha(C.informal)[0] + izquierda(C.comite)[0]) / 2} y={derecha(C.informal)[1] - 5} fontSize="7.5" textAnchor="middle">
          sin acuerdo
        </text>
        <text x={abajo(C.comite)[0] - 6} y="214" textAnchor="end">
          informe de valoración
        </text>
        <text x={abajo(C.comite)[0] - 6} y="225" textAnchor="end">
          = expediente informativo
        </text>
        <text x="386" y="36">
          también puede presentarse
        </text>
        <text x="386" y="47">
          en el Servicio de Prevención
        </text>
        <text x="386" y="58">
          y Salud Laboral
        </text>
      </g>

      <g fontSize="8.5" fill="currentColor">
        <text x="8" y="316">
          Garantías: confidencialidad (cada denuncia, con un código numérico), respeto, diligencia y celeridad,
        </text>
        <text x="8" y="329">
          imparcialidad y prohibición de represalias. Contra la resolución del Comité caben alegaciones.
        </text>
        <text x="8" y="342">
          Si hay riesgo, se proponen medidas cautelares a Relaciones Laborales, como separar a las personas.
        </text>
      </g>
    </g>
  )
}

/**
 * Las cuatro instituciones de la Comunidad Autonoma (Estatuto de Autonomia de
 * Aragon, art. 32) y como se relacionan: el pueblo elige las Cortes (art. 37);
 * las Cortes eligen al Presidente (art. 46.1) y al Justicia (art. 41.b); el Rey
 * nombra al Presidente (art. 46.1); el Presidente nombra a los consejeros
 * (art. 53.2); el Gobierno responde ante las Cortes (art. 53.3), y el Justicia
 * les rinde cuentas (art. 59.3).
 */
function InstitucionesAragon() {
  type Caja = { clave: string; x: number; y: number; titulo: string; pie: string; color: string }
  const AN = 156
  const AL = 46
  const C: Record<string, Caja> = {
    pueblo: { clave: 'pueblo', x: 212, y: 14, titulo: 'Pueblo aragonés', pie: 'sufragio universal', color: AZUL_CLARO },
    cortes: { clave: 'cortes', x: 212, y: 112, titulo: 'Cortes de Aragón', pie: 'unicamerales', color: ROJO },
    justicia: { clave: 'justicia', x: 18, y: 232, titulo: 'El Justicia de Aragón', pie: 'derechos, Estatuto y ordenamiento', color: AZUL },
    presidente: { clave: 'presidente', x: 212, y: 232, titulo: 'Presidente', pie: 'uno de los diputados', color: AZUL },
    gobierno: { clave: 'gobierno', x: 406, y: 232, titulo: 'Gobierno de Aragón', pie: 'o Diputación General', color: AZUL },
    rey: { clave: 'rey', x: 212, y: 338, titulo: 'El Rey', pie: 'nombramiento', color: AZUL_CLARO },
  }
  const caja = (c: Caja) => (
    <g key={c.clave}>
      <rect
        data-pieza={'nodo-' + c.clave}
        x={c.x}
        y={c.y}
        width={AN}
        height={AL}
        rx="5"
        fill={c.color}
        fillOpacity={c.color === ROJO ? 0.22 : 0.4}
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <text x={c.x + AN / 2} y={c.y + 19} fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="currentColor">
        {c.titulo}
      </text>
      <text x={c.x + AN / 2} y={c.y + 34} fontSize="7.5" textAnchor="middle" fill="currentColor">
        {c.pie}
      </text>
    </g>
  )
  const flecha = (tipo: string, clave: string, [x1, y1]: number[], [x2, y2]: number[]) => {
    const ang = Math.atan2(y2 - y1, x2 - x1)
    const punta = (s: number) => `${(x2 - 7 * Math.cos(ang + s)).toFixed(1)} ${(y2 - 7 * Math.sin(ang + s)).toFixed(1)}`
    const color = tipo === 'rinde-cuentas' || tipo === 'responde' ? ROJO : 'currentColor'
    return (
      <g key={clave} stroke={color} strokeWidth="1.6" fill="none" strokeDasharray={tipo === 'responde' ? '5 3' : undefined}>
        <line data-pieza={tipo} x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)} />
        <path d={`M${punta(0.45)} L${x2.toFixed(1)} ${y2.toFixed(1)} L${punta(-0.45)}`} strokeDasharray="none" />
      </g>
    )
  }
  const { pueblo, cortes, justicia, presidente, gobierno, rey } = C

  return (
    <g fontFamily="system-ui, sans-serif">
      {Object.values(C).map(caja)}
      {flecha('elige', 'pueblo-cortes', [pueblo.x + AN / 2, pueblo.y + AL], [cortes.x + AN / 2, cortes.y])}
      {flecha('elige', 'cortes-presidente', [cortes.x + AN / 2, cortes.y + AL], [presidente.x + AN / 2, presidente.y])}
      {flecha('elige', 'cortes-justicia', [cortes.x + 14, cortes.y + AL], [justicia.x + 132, justicia.y])}
      {flecha('rinde-cuentas', 'justicia-cortes', [justicia.x + 42, justicia.y], [cortes.x, cortes.y + 13])}
      {flecha('nombra', 'rey-presidente', [rey.x + AN / 2, rey.y], [presidente.x + AN / 2, presidente.y + AL])}
      {flecha('nombra', 'presidente-gobierno', [presidente.x + AN, presidente.y + AL / 2], [gobierno.x, gobierno.y + AL / 2])}
      {flecha('responde', 'gobierno-cortes', [gobierno.x + 70, gobierno.y], [cortes.x + AN, cortes.y + 26])}

      <g fontSize="8" fill="currentColor">
        <text x={cortes.x + AN / 2 + 6} y="92">
          elige cada 4 años
        </text>
        <text x={cortes.x + AN / 2 + 6} y="204">
          elige, de entre sus miembros
        </text>
        <text x="186" y="212">
          elige
        </text>
        <text x={presidente.x + AN / 2 + 6} y="310">
          nombra
        </text>
        <text x={(presidente.x + AN + gobierno.x) / 2} y={presidente.y + AL / 2 - 6} textAnchor="middle" fontSize="7.5">
          nombra
        </text>
        <text x={gobierno.x + AN / 2} y={gobierno.y + AL + 14} textAnchor="middle" fontSize="7.5">
          (el Presidente nombra y separa
        </text>
        <text x={gobierno.x + AN / 2} y={gobierno.y + AL + 24} textAnchor="middle" fontSize="7.5">
          a los consejeros)
        </text>
      </g>
      <g fontSize="8" fontWeight="bold" fill={ROJO}>
        <text x="100" y="186" textAnchor="end">
          rinde cuentas
        </text>
        <text x="452" y="170">
          responde
        </text>
        <text x="452" y="180">
          políticamente
        </text>
      </g>
    </g>
  )
}

/**
 * Las tres clases de competencias del Estatuto de Aragon (titulo V): que
 * funciones ejerce la Comunidad Autonoma y cuales se reserva el Estado en cada
 * una. Exclusivas (art. 71): legislativa, reglamentaria y ejecutiva, todo de
 * Aragon. Compartidas (art. 75): el Estado dicta las bases en normas con rango
 * de ley; Aragon, el desarrollo legislativo y la ejecucion. Ejecutivas
 * (art. 77): la legislacion es del Estado y Aragon ejecuta, con reglamentos
 * solo para organizar sus propios servicios.
 */
function ClasesCompetencias() {
  const COLUMNAS = [
    { nombre: 'Exclusivas', articulo: 'art. 71' },
    { nombre: 'Compartidas', articulo: 'art. 75' },
    { nombre: 'Ejecutivas', articulo: 'art. 77' },
  ]
  const FILAS = ['La ley: régimen general o bases', 'El desarrollo: leyes y reglamentos', 'La ejecución: gestión y actos']
  // quien ejerce cada funcion (fila) en cada clase (columna)
  const DE_ARAGON = [
    [true, false, false],
    [true, true, false],
    [true, true, true],
  ]
  const X0 = 196
  const ANCHO = 122
  const HUECO = 8
  const Y0 = 64
  const ALTO = 50
  const color = (aragon: boolean) => (aragon ? ROJO : AZUL)

  return (
    <g fontFamily="system-ui, sans-serif">
      {COLUMNAS.map((c, j) => (
        <g key={c.nombre}>
          <text x={X0 + j * (ANCHO + HUECO) + ANCHO / 2} y="30" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="currentColor">
            {c.nombre}
          </text>
          <text data-pieza="articulo" x={X0 + j * (ANCHO + HUECO) + ANCHO / 2} y="46" fontSize="8.5" textAnchor="middle" fill="currentColor">
            {c.articulo}
          </text>
        </g>
      ))}
      {FILAS.map((f, i) => (
        <g key={f}>
          <text x="10" y={Y0 + i * (ALTO + HUECO) + ALTO / 2 + 3} fontSize="8.5" fill="currentColor">
            {f}
          </text>
          {COLUMNAS.map((c, j) => {
            const aragon = DE_ARAGON[i][j]
            return (
              <g key={c.nombre}>
                <rect
                  data-pieza="celda"
                  data-fila={i}
                  data-col={j}
                  x={X0 + j * (ANCHO + HUECO)}
                  y={Y0 + i * (ALTO + HUECO)}
                  width={ANCHO}
                  height={ALTO}
                  rx="4"
                  fill={color(aragon)}
                  fillOpacity={aragon ? 0.3 : 0.45}
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <text
                  x={X0 + j * (ANCHO + HUECO) + ANCHO / 2}
                  y={Y0 + i * (ALTO + HUECO) + ALTO / 2 + 4}
                  fontSize="9.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="currentColor"
                >
                  {aragon ? 'Aragón' : 'Estado'}
                </text>
              </g>
            )
          })}
        </g>
      ))}
      <g fontSize="8.5" fill="currentColor">
        <rect data-pieza="leyenda-aragon" x="10" y="248" width="14" height="10" fill={ROJO} fillOpacity="0.3" stroke="currentColor" strokeWidth="0.8" />
        <text x="30" y="257">
          la ejerce la Comunidad Autónoma
        </text>
        <rect data-pieza="leyenda-estado" x="210" y="248" width="14" height="10" fill={AZUL} fillOpacity="0.45" stroke="currentColor" strokeWidth="0.8" />
        <text x="230" y="257">
          se la reserva el Estado
        </text>
        <text x="10" y="280">
          En las ejecutivas, Aragón puede dictar reglamentos, pero solo para organizar sus propios servicios.
        </text>
        <text x="10" y="294">
          Y las exclusivas, siempre respetando los arts. 140 y 149.1 de la Constitución (art. 71).
        </text>
      </g>
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
    case 'nefelometro-turbidimetro':
      return <NefelometroTurbidimetro />
    case 'refractometro-abbe':
      return <RefractometroAbbe />
    case 'polarimetro':
      return <Polarimetro />
    case 'icp-ms':
      return <IcpMs />
    case 'cromatograma':
      return <Cromatograma />
    case 'cromatografo-ionico':
      return <CromatografoIonico />
    case 'cromatografo-gases':
      return <CromatografoGases />
    case 'purga-y-trampa':
      return <PurgaYTrampa />
    case 'fase-normal-vs-inversa':
      return <FaseNormalVsInversa />
    case 'gradiente-elucion':
      return <GradienteElucion />
    case 'cloracion-punto-ruptura':
      return <CloracionPuntoRuptura />
    case 'alcalinidad-valoracion':
      return <AlcalinidadValoracion />
    case 'dbo-frente-a-dqo':
      return <DboFrenteADqo />
    case 'solidos-del-agua':
      return <SolidosDelAgua />
    case 'nitrogeno-total-fracciones':
      return <NitrogenoTotalFracciones />
    case 'nca-metales-dureza':
      return <NcaMetalesDureza />
    case 'envase-camara-de-aire':
      return <EnvaseCamaraDeAire />
    case 'grifo-tres-objetivos':
      return <GrifoTresObjetivos />
    case 'corte-pm10-pm25':
      return <CortePm10Pm25 />
    case 'captacion-pm-y-metales':
      return <CaptacionPmYMetales />
    case 'dianas-veracidad-precision':
      return <DianasVeracidadPrecision />
    case 'incertidumbre-en-cuadratura':
      return <IncertidumbreEnCuadratura />
    case 'intervalo-de-trabajo':
      return <IntervaloDeTrabajo />
    case 'grafico-control-x':
      return <GraficoControlX />
    case 'recta-minimos-cuadrados':
      return <RectaMinimosCuadrados />
    case 'cadena-trazabilidad':
      return <CadenaTrazabilidad />
    case 'acreditacion-certificacion':
      return <AcreditacionCertificacion />
    case 'ciclo-acreditacion':
      return <CicloAcreditacion />
    case 'estructura-plan-igualdad':
      return <EstructuraPlanIgualdad />
    case 'circuito-protocolo-acoso':
      return <CircuitoProtocoloAcoso />
    case 'instituciones-aragon':
      return <InstitucionesAragon />
    case 'clases-competencias':
      return <ClasesCompetencias />
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
