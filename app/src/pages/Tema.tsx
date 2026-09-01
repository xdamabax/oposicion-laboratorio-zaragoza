import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getTema, TEMAS } from '../content'
import Etiqueta from '../components/Etiqueta'
import Markdown from '../components/Markdown'
import Flashcards from '../components/Flashcards'
import Test from '../components/Test'

type Vista = 'apunte' | 'tarjetas' | 'test'
const VISTAS: Vista[] = ['apunte', 'tarjetas', 'test']
const ROTULO: Record<Vista, string> = { apunte: 'Apuntes', tarjetas: 'Tarjetas', test: 'Test' }

export default function Tema() {
  const { numero } = useParams()
  const [params, setParams] = useSearchParams()

  const n = Number(numero)
  const tema = getTema(n)

  const pedida = params.get('vista') as Vista | null
  const vista: Vista = pedida && VISTAS.includes(pedida) ? pedida : 'apunte'

  if (!tema) {
    return (
      <div className="vacio">
        <p>No existe el tema {numero}.</p>
        <Link to="/temas" className="btn">
          Ver el temario
        </Link>
      </div>
    )
  }

  const anterior = TEMAS.find((t) => t.numero === n - 1)
  const siguiente = TEMAS.find((t) => t.numero === n + 1)

  return (
    <>
      <p className="contador" style={{ marginBottom: '0.4rem' }}>
        <Link to="/temas">Temario</Link> / Tema {tema.numero}
        {tema.bloque ? ` / ${tema.bloque}` : ''}
      </p>

      <h1>
        {tema.numero}. {tema.titulo}
      </h1>
      <p className="sub">
        <Etiqueta estado={tema.estadoApunte} />
      </p>

      <div className="pestanas">
        {VISTAS.map((v) => (
          <button
            key={v}
            className={v === vista ? 'activo' : undefined}
            onClick={() => setParams(v === 'apunte' ? {} : { vista: v }, { replace: true })}
          >
            {ROTULO[v]}
            {v === 'tarjetas' && tema.repaso ? ` (${tema.repaso.flashcards.length})` : ''}
            {v === 'test' && tema.repaso ? ` (${tema.repaso.test.length})` : ''}
          </button>
        ))}
      </div>

      {vista === 'apunte' && <Apunte tema={tema} />}
      {vista === 'tarjetas' && <Flashcards tarjetas={tema.repaso?.flashcards ?? []} />}
      {vista === 'test' && <Test preguntas={tema.repaso?.test ?? []} />}

      <div className="botones" style={{ marginTop: '2.5rem', justifyContent: 'space-between' }}>
        {anterior ? (
          <Link className="btn" to={`/tema/${anterior.numero}`}>
            Tema {anterior.numero}
          </Link>
        ) : (
          <span />
        )}
        {siguiente && (
          <Link className="btn" to={`/tema/${siguiente.numero}`}>
            Tema {siguiente.numero}
          </Link>
        )}
      </div>
    </>
  )
}

function Apunte({ tema }: { tema: NonNullable<ReturnType<typeof getTema>> }) {
  if (!tema.apunte) {
    return (
      <div className="vacio">
        <p>Este tema todavia no tiene apunte.</p>
        <p className="contador">
          Se redacta buscando la norma vigente, se cita la fuente y se somete a tu revision antes de
          generar el repaso.
        </p>
      </div>
    )
  }

  const { apunte } = tema

  return (
    <article>
      {apunte.estado === 'borrador' && (
        <div className="aviso">
          <b>Borrador pendiente de tu revision.</b> Todavia no se generan tarjetas ni preguntas a
          partir de este apunte.
        </div>
      )}

      <Markdown>{apunte.cuerpo}</Markdown>

      <div className="tarjeta fuentes">
        <b>Fuentes y verificacion</b>
        {apunte.fuentes.length > 0 ? (
          <ul>
            {apunte.fuentes.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        ) : (
          <p className="contador">Sin fuentes declaradas en el frontmatter del apunte.</p>
        )}
        {apunte.verificado && <p className="contador">Verificado el {apunte.verificado}.</p>}
      </div>
    </article>
  )
}
