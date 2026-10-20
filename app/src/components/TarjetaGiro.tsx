import Markdown from './Markdown'
import Figura from './figuras/Figura'
import { EnlaceApunte, TITULO } from './SesionTest'
import type { ItemTarjeta } from '../lib/mixto'
import type { Resultado } from '../lib/srs'

/**
 * Una tarjeta de repaso dentro de una sesion de varios temas: se pulsa para
 * girarla y se valora con los botones del repaso normal. Como en el test, el
 * tema no se ve hasta darle la vuelta. Quien la usa registra la valoracion.
 */
export default function TarjetaGiro({
  item,
  vista,
  girar,
  valorar,
}: {
  item: ItemTarjeta
  vista: boolean
  girar: () => void
  valorar: (r: Resultado) => void
}) {
  const t = item.tarjeta
  return (
    <>
      <div
        className="tarjeta flash"
        onClick={girar}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            girar()
          }
        }}
      >
        <div className="flash-a">
          <Markdown>{t.anverso}</Markdown>
        </div>

        {t.figura && <Figura figura={t.figura} incognita={!vista} />}

        {vista ? (
          <div className="flash-b">
            <Markdown>{t.reverso}</Markdown>
            <p className="mixto-tema">
              Tema {item.tema}. {TITULO.get(item.tema)}
            </p>
            {t.fuente && <p className="flash-pista mixto-fuente">Fuente: {t.fuente}</p>}
            <EnlaceApunte tema={item.tema} apartado={item.apartado} />
          </div>
        ) : (
          <p className="flash-pista">Pulsa para ver la respuesta</p>
        )}
      </div>

      {vista && (
        <div className="botones" style={{ marginTop: '0.75rem', justifyContent: 'center' }}>
          <button className="btn btn-bad" onClick={() => valorar('fallo')}>
            Fallo
          </button>
          <button className="btn" onClick={() => valorar('bien')}>
            Bien
          </button>
          <button className="btn btn-ok" onClick={() => valorar('facil')}>
            Fácil
          </button>
        </div>
      )}
    </>
  )
}
