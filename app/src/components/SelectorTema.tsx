import { setTema, temaEfectivo, useTema, type Tema } from '../lib/tema'

const SIGUIENTE: Record<Tema, Tema> = {
  sistema: 'claro',
  claro: 'oscuro',
  oscuro: 'sistema',
}

const ROTULO: Record<Tema, string> = {
  sistema: 'Tema: el del sistema',
  claro: 'Tema: claro',
  oscuro: 'Tema: oscuro',
}

function Icono({ tema }: { tema: Tema }) {
  if (tema === 'sistema') {
    // Monitor: "el que diga el sistema operativo"
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    )
  }
  if (tema === 'claro') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
    </svg>
  )
}

/**
 * Un solo boton que cicla sistema -> claro -> oscuro. Tres estados en vez de
 * dos porque "seguir al sistema" es una opcion util y es el valor de partida.
 */
export default function SelectorTema() {
  const tema = useTema()
  const efectivo = temaEfectivo(tema)

  return (
    <button
      type="button"
      className="btn-tema"
      onClick={() => setTema(SIGUIENTE[tema])}
      title={`${ROTULO[tema]}${tema === 'sistema' ? ` (ahora ${efectivo})` : ''}. Pulsa para cambiar.`}
      aria-label={ROTULO[tema]}
    >
      <Icono tema={tema} />
    </button>
  )
}
