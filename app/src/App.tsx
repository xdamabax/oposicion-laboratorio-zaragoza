import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Inicio from './pages/Inicio'
import Temas from './pages/Temas'
import Tema from './pages/Tema'
import Progreso from './pages/Progreso'
import Figuras from './pages/Figuras'
import { ImprimirTema, ImprimirTemario, ImprimirTest } from './pages/Imprimir'
import SelectorTema from './components/SelectorTema'

const clase = ({ isActive }: { isActive: boolean }) => (isActive ? 'activo' : undefined)

export default function App() {
  const { pathname } = useLocation()

  // Las vistas de impresion se sirven sin cabecera ni pie: el documento que
  // se ve en pantalla es exactamente el que sale por la impresora o al PDF.
  if (pathname.startsWith('/imprimir')) {
    return (
      <Routes>
        <Route path="/imprimir/tema/:numero" element={<ImprimirTema />} />
        <Route path="/imprimir/temario" element={<ImprimirTemario />} />
        <Route path="/imprimir/test/:numero" element={<ImprimirTest />} />
      </Routes>
    )
  }

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
            <NavLink to="/figuras" className={clase}>
              Figuras
            </NavLink>
            <SelectorTema />
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/temas" element={<Temas />} />
          <Route path="/tema/:numero" element={<Tema />} />
          <Route path="/progreso" element={<Progreso />} />
          <Route path="/figuras" element={<Figuras />} />
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>

      <footer className="pie">
        Proyecto de estudio personal. Convocatoria publicada en el BOPZ núm. 170, de 27 de julio de
        2026, anuncio núm. 5077. Los apuntes citan siempre la norma y la fecha de verificación:
        comprueba la vigencia antes del examen.
      </footer>
    </>
  )
}

function NoEncontrado() {
  return (
    <div className="vacio">
      <p>Esa página no existe.</p>
      <NavLink to="/" className="btn">
        Volver al inicio
      </NavLink>
    </div>
  )
}
