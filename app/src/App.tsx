import { NavLink, Route, Routes } from 'react-router-dom'
import Inicio from './pages/Inicio'
import Temas from './pages/Temas'
import Tema from './pages/Tema'
import Progreso from './pages/Progreso'

const clase = ({ isActive }: { isActive: boolean }) => (isActive ? 'activo' : undefined)

export default function App() {
  return (
    <>
      <header className="cabecera">
        <div className="cabecera-int">
          <NavLink to="/" className="marca">
            Auxiliar de Laboratorio
            <span>Ayuntamiento de Zaragoza</span>
          </NavLink>
          <nav className="nav">
            <NavLink to="/" end className={clase}>
              Inicio
            </NavLink>
            <NavLink to="/temas" className={clase}>
              Temario
            </NavLink>
            <NavLink to="/progreso" className={clase}>
              Progreso
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/temas" element={<Temas />} />
          <Route path="/tema/:numero" element={<Tema />} />
          <Route path="/progreso" element={<Progreso />} />
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>

      <footer className="pie">
        Proyecto de estudio personal. Convocatoria publicada en el BOPZ num. 5077, de 27 de julio de
        2026. Los apuntes citan siempre la norma y la fecha de verificacion: comprueba la vigencia
        antes del examen.
      </footer>
    </>
  )
}

function NoEncontrado() {
  return (
    <div className="vacio">
      <p>Esa pagina no existe.</p>
      <NavLink to="/" className="btn">
        Volver al inicio
      </NavLink>
    </div>
  )
}
