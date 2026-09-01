import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PARTES, TEMAS } from '../content'
import Etiqueta from '../components/Etiqueta'

export default function Temas() {
  const [filtro, setFiltro] = useState('')

  const q = filtro.trim().toLowerCase()
  const coincide = (numero: number) => {
    if (!q) return true
    const t = TEMAS.find((x) => x.numero === numero)
    if (!t) return false
    return `${t.numero} ${t.titulo}`.toLowerCase().includes(q)
  }

  return (
    <>
      <h1>Temario</h1>
      <p className="sub">40 temas. Toca uno para ver sus apuntes y su repaso.</p>

      <input
        className="btn"
        style={{ width: '100%', marginBottom: '1rem', cursor: 'text' }}
        type="search"
        placeholder="Buscar por numero o texto del tema"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {PARTES.map((parte) => {
        const visibles = parte.bloques.filter((b) => b.temas.some((t) => coincide(t.numero)))
        if (visibles.length === 0) return null

        return (
          <section key={parte.parte}>
            <h2>{parte.parte}</h2>
            {visibles.map((bloque) => (
              <div key={bloque.bloque ?? 'sin-bloque'}>
                {bloque.bloque && <p className="bloque-titulo">{bloque.bloque}</p>}
                <ul className="lista">
                  {bloque.temas
                    .filter((t) => coincide(t.numero))
                    .map((t) => {
                      const vista = TEMAS.find((x) => x.numero === t.numero)!
                      const nTarjetas = vista.repaso?.flashcards.length ?? 0
                      const nTest = vista.repaso?.test.length ?? 0

                      return (
                        <li key={t.numero}>
                          <Link className="item" to={`/tema/${t.numero}`}>
                            <span className="item-num">{t.numero}</span>
                            <span className="item-txt">
                              {t.titulo}
                              <br />
                              <span className="item-meta">
                                {nTarjetas + nTest === 0
                                  ? 'Sin repaso todavia'
                                  : `${nTarjetas} tarjetas / ${nTest} preguntas`}
                              </span>
                            </span>
                            <Etiqueta estado={vista.estadoApunte} />
                          </Link>
                        </li>
                      )
                    })}
                </ul>
              </div>
            ))}
          </section>
        )
      })}
    </>
  )
}
