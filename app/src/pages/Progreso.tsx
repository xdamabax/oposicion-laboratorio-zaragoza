import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { TEMAS } from '../content'
import { exportar, importar, reiniciarTodo, useProgreso } from '../lib/progreso'
import { dominio, tocaHoy } from '../lib/srs'

export default function Progreso() {
  const progreso = useProgreso()
  const fichero = useRef<HTMLInputElement>(null)
  const [confirmarBorrado, setConfirmarBorrado] = useState(false)

  const conRepaso = TEMAS.filter((t) => (t.repaso?.flashcards.length ?? 0) > 0)

  const filas = conRepaso.map((t) => {
    const cards = t.repaso!.flashcards
    const media = cards.reduce((s, c) => s + dominio(progreso.tarjetas[c.id]), 0) / cards.length
    const hoy = cards.filter((c) => tocaHoy(progreso.tarjetas[c.id])).length
    return { tema: t, pct: Math.round(media * 100), hoy, total: cards.length }
  })

  const preguntas = Object.values(progreso.preguntas)
  const intentos = preguntas.reduce((n, p) => n + p.intentos, 0)
  const aciertos = preguntas.reduce((n, p) => n + p.aciertos, 0)

  const fallonas = TEMAS.flatMap((t) => t.repaso?.test ?? [])
    .map((p) => ({ p, e: progreso.preguntas[p.id] }))
    .filter((x) => x.e && x.e.fallos > 0)
    .sort((a, b) => b.e!.fallos - a.e!.fallos)
    .slice(0, 8)

  function descargar() {
    const blob = new Blob([exportar()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `progreso-oposicion-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function subir(f: File) {
    const ok = importar(await f.text())
    if (!ok) console.warn('[progreso] El fichero no es un progreso valido')
  }

  return (
    <>
      <h1>Progreso</h1>
      <p className="sub">Guardado solo en este navegador (localStorage).</p>

      <div className="rejilla rejilla-3">
        <div className="tarjeta dato">
          <b>{progreso.racha.actual}</b>
          <small>Racha actual (mejor: {progreso.racha.mejor})</small>
        </div>
        <div className="tarjeta dato">
          <b>{Object.keys(progreso.tarjetas).length}</b>
          <small>Tarjetas trabajadas</small>
        </div>
        <div className="tarjeta dato">
          <b>{intentos === 0 ? '--' : `${Math.round((aciertos / intentos) * 100)}%`}</b>
          <small>Aciertos en test ({intentos} respuestas)</small>
        </div>
      </div>

      <h2>Por tema</h2>
      {filas.length === 0 ? (
        <p className="vacio">
          Aun no hay repaso generado. <Link to="/temas">Empieza por el temario.</Link>
        </p>
      ) : (
        <ul className="lista">
          {filas.map(({ tema, pct, hoy, total }) => (
            <li key={tema.numero}>
              <Link className="item" to={`/tema/${tema.numero}?vista=tarjetas`}>
                <span className="item-num">{tema.numero}</span>
                <span className="item-txt">
                  {tema.titulo}
                  <div className="barra" style={{ marginTop: '0.35rem' }}>
                    <i style={{ width: `${pct}%` }} />
                  </div>
                  <span className="item-meta">
                    {pct}% consolidado / {hoy} de {total} tocan hoy
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {fallonas.length > 0 && (
        <>
          <h2>Preguntas que mas fallas</h2>
          <ul className="lista">
            {fallonas.map(({ p, e }) => (
              <li key={p.id} className="tarjeta">
                <p style={{ margin: 0, fontSize: '0.92rem' }}>{p.pregunta}</p>
                <p className="contador" style={{ margin: '0.3rem 0 0' }}>
                  {e!.fallos} fallos de {e!.intentos} intentos
                </p>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Datos</h2>
      <div className="botones">
        <button className="btn" onClick={descargar}>
          Exportar progreso
        </button>
        <button className="btn" onClick={() => fichero.current?.click()}>
          Importar progreso
        </button>
        <input
          ref={fichero}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void subir(f)
            e.target.value = ''
          }}
        />
        <button
          className="btn btn-bad"
          onClick={() => {
            if (!confirmarBorrado) {
              setConfirmarBorrado(true)
              return
            }
            reiniciarTodo()
            setConfirmarBorrado(false)
          }}
        >
          {confirmarBorrado ? 'Confirmar: borrar de verdad' : 'Borrar todo el progreso'}
        </button>
        {confirmarBorrado && (
          <button className="btn" onClick={() => setConfirmarBorrado(false)}>
            Cancelar
          </button>
        )}
      </div>
    </>
  )
}
