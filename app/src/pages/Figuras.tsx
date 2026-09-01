import PictogramaGHS, {
  ALCANCE_GHS,
  CODIGOS_GHS,
  NOMBRES_GHS,
} from '../components/figuras/PictogramaGHS'
import MaterialVidrio, { NOMBRES_MATERIAL } from '../components/figuras/MaterialVidrio'
import Bureta from '../components/figuras/Bureta'
import type { TipoGHS, TipoMaterial } from '../types'

/**
 * Catalogo de figuras. Sirve para revisar de un vistazo que todos los dibujos
 * son reconocibles antes de usarlos en tarjetas y preguntas.
 */
export default function Figuras() {
  const ghs = Object.keys(NOMBRES_GHS) as TipoGHS[]
  const material = Object.keys(NOMBRES_MATERIAL) as TipoMaterial[]

  return (
    <>
      <h1>Catálogo de figuras</h1>
      <p className="sub">
        Ilustraciones que la app puede insertar en tarjetas y preguntas.
      </p>

      <h2>Pictogramas de peligro (CLP)</h2>
      <p className="contador" style={{ marginTop: '-0.4rem' }}>
        Los <b>nueve</b> pictogramas oficiales del <b>Reglamento (CE) 1272/2008</b> (CLP), anexo V,
        en su versión normalizada. Son los mismos símbolos que figuran en una etiqueta real.
      </p>
      <div className="galeria galeria-ghs">
        {ghs.map((t) => (
          <figure key={t} className="galeria-item">
            <PictogramaGHS tipo={t} tamano={104} />
            <figcaption>
              <b>{NOMBRES_GHS[t]}</b>
              <br />
              <span className="contador">
                {CODIGOS_GHS[t]} · <code>{t}</code>
              </span>
              <br />
              <span className="contador ghs-alcance">{ALCANCE_GHS[t]}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <h2>Material de vidrio</h2>
      <div className="aviso">
        A diferencia de los pictogramas, el material de vidrio y la bureta son{' '}
        <b>dibujos esquemáticos</b> propios: sirven para reconocer la silueta y para distinguir
        material aforado de graduado, no para reproducir un modelo concreto.
      </div>
      <div className="galeria">
        {material.map((t) => (
          <figure key={t} className="galeria-item">
            <MaterialVidrio tipo={t} tamano={112} />
            <figcaption>
              <b>{NOMBRES_MATERIAL[t]}</b>
              <br />
              <span className="contador">
                <code>{t}</code>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <h2>Bureta</h2>
      <p className="contador">
        El cero está arriba y la escala crece hacia abajo: se lee el volumen vertido.
      </p>
      <div className="galeria">
        {[0, 12.5, 23.4].map((v) => (
          <figure key={v} className="galeria-item">
            <Bureta lectura={v} capacidad={25} tamano={230} mostrarValor />
            <figcaption>
              <span className="contador">
                <code>{`{ tipo: 'bureta', lectura: ${v} }`}</code>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  )
}
