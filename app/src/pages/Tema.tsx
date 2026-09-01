import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getTema, TEMAS } from '../content'
import Etiqueta from '../components/Etiqueta'
import Markdown from '../components/Markdown'
import Flashcards from '../components/Flashcards'
import Test from '../components/Test'
import Supuestos from '../components/Supuestos'

type Vista = 'apunte' | 'tarjetas' | 'test' | 'supuestos'
const ROTULO: Record<Vista, string> = {
  apunte: 'Apuntes',
  tarjetas: 'Tarjetas',
  test: 'Test',
  supuestos: 'Supuestos',
}

export default function Tema() {
  const { numero } = useParams()
  const [params, setParams] = useSearchParams()

  const n = Number(numero)
  const tema = getTema(n)

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

  // Los supuestos son el segundo ejercicio, que solo versa sobre la parte segunda.
  const esParteSegunda = tema.numero >= 9
  const vistas: Vista[] = esParteSegunda
    ? ['apunte', 'tarjetas', 'test', 'supuestos']
    : ['apunte', 'tarjetas', 'test']

  const pedida = params.get('vista') as Vista | null
  const vista: Vista = pedida && vistas.includes(pedida) ? pedida : 'apunte'

  const anterior = TEMAS.find((t) => t.numero === n - 1)
  const siguiente = TEMAS.find((t) => t.numero === n + 1)

  const cuenta: Record<Vista, number | null> = {
    apunte: null,
    tarjetas: tema.repaso?.flashcards.length ?? null,
    test: tema.repaso?.test.length ?? null,
    supuestos: tema.repaso?.supuestos.length ?? null,
  }

  return (
    <>
      <p className="contador" style={{ marginBottom: '0.4rem' }}>
        <Link to="/temas">Temario</Link> / Tema {tema.numero}
      </p>

      <h1>
        {tema.numero}. {tema.titulo}
      </h1>
      <p className="sub">
        <Etiqueta estado={tema.estadoApunte} />{' '}
        <span className="contador">
          {esParteSegunda
            ? 'Parte segunda · entra en el primer ejercicio (3 opciones) y en los supuestos (4 opciones)'
            : 'Parte primera · entra solo en el primer ejercicio (3 opciones)'}
        </span>
      </p>

      <div className="pestanas">
        {vistas.map((v) => (
          <button
            key={v}
            className={v === vista ? 'activo' : undefined}
            onClick={() => setParams(v === 'apunte' ? {} : { vista: v }, { replace: true })}
          >
            {ROTULO[v]}
            {cuenta[v] !== null ? ` (${cuenta[v]})` : ''}
          </button>
        ))}
      </div>

      {vista === 'apunte' && <Apunte tema={tema} />}
      {vista === 'tarjetas' && <Flashcards tarjetas={tema.repaso?.flashcards ?? []} />}
      {vista === 'test' && (
        <Test
          preguntas={tema.repaso?.test ?? []}
          vacio="Todavía no hay preguntas de test para este tema. Se generan a partir del apunte una vez aprobado."
        />
      )}
      {vista === 'supuestos' && <Supuestos supuestos={tema.repaso?.supuestos ?? []} />}

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
        <p>Este tema todavía no tiene apunte.</p>
        <p className="contador">
          Se redacta buscando la norma vigente, se cita la fuente y se somete a tu revisión antes de
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
          <b>Borrador pendiente de tu revisión.</b> Todavía no se generan tarjetas ni preguntas a
          partir de este apunte.
        </div>
      )}

      <Markdown>{apunte.cuerpo}</Markdown>

      <div className="tarjeta fuentes">
        <b>Fuentes y verificación</b>
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
