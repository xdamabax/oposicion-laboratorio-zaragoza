import { Link } from 'react-router-dom'
import { TEMAS, TEMARIO_PENDIENTE, TOTAL_PREGUNTAS, TOTAL_TARJETAS } from '../content'
import { useProgreso } from '../lib/progreso'
import { tocaHoy } from '../lib/srs'

export default function Inicio() {
  const progreso = useProgreso()

  const aprobados = TEMAS.filter((t) => t.estadoApunte === 'aprobado').length
  const conRepaso = TEMAS.filter((t) => (t.repaso?.flashcards.length ?? 0) > 0)

  const pendientesHoy = conRepaso.reduce(
    (n, t) => n + (t.repaso?.flashcards.filter((f) => tocaHoy(progreso.tarjetas[f.id])).length ?? 0),
    0,
  )

  const siguienteTema = conRepaso.find((t) =>
    t.repaso?.flashcards.some((f) => tocaHoy(progreso.tarjetas[f.id])),
  )

  return (
    <>
      <h1>Tecnica/o Auxiliar de Laboratorio</h1>
      <p className="sub">
        Ayuntamiento de Zaragoza. 40 temas: 8 comunes y 32 especificos.
      </p>

      {TEMARIO_PENDIENTE && (
        <div className="aviso">
          <b>Falta el temario oficial.</b> Los titulos de <code>temario.md</code> son un andamio con
          40 huecos. Pega los enunciados literales del BOPZ num. 5077 y la navegacion se rellena
          sola: no hay ningun titulo inventado en el repositorio.
        </div>
      )}

      <div className="rejilla rejilla-3">
        <div className="tarjeta dato">
          <b>
            {aprobados}
            <small style={{ fontSize: '1rem', color: 'var(--muted)' }}> / {TEMAS.length}</small>
          </b>
          <small>Apuntes aprobados</small>
        </div>
        <div className="tarjeta dato">
          <b>{progreso.racha.actual}</b>
          <small>Dias de racha (mejor: {progreso.racha.mejor})</small>
        </div>
        <div className="tarjeta dato">
          <b>{pendientesHoy}</b>
          <small>Tarjetas para repasar hoy</small>
        </div>
      </div>

      <h2>Empezar</h2>
      <div className="botones">
        {siguienteTema ? (
          <Link className="btn btn-pri" to={`/tema/${siguienteTema.numero}?vista=tarjetas`}>
            Repasar el tema {siguienteTema.numero}
          </Link>
        ) : (
          <Link className="btn btn-pri" to="/temas">
            Ver el temario
          </Link>
        )}
        <Link className="btn" to="/temas">
          Los 40 temas
        </Link>
        <Link className="btn" to="/progreso">
          Mi progreso
        </Link>
      </div>

      <h2>Estado del material</h2>
      <div className="rejilla rejilla-2">
        <div className="tarjeta">
          <p style={{ margin: 0 }}>
            <b>{TOTAL_TARJETAS}</b> tarjetas y <b>{TOTAL_PREGUNTAS}</b> preguntas de test en total.
          </p>
          <p className="contador" style={{ margin: '0.35rem 0 0' }}>
            Se generan tema a tema, solo despues de que apruebes el apunte correspondiente.
          </p>
        </div>
        <div className="tarjeta">
          <p style={{ margin: 0 }}>
            El progreso se guarda en <b>localStorage</b> de este navegador.
          </p>
          <p className="contador" style={{ margin: '0.35rem 0 0' }}>
            No sale del dispositivo. Puedes exportarlo e importarlo desde la pagina de progreso.
          </p>
        </div>
      </div>
    </>
  )
}
