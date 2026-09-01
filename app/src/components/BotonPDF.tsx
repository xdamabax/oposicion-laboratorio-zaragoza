/**
 * Abre la vista de impresion en una pestaña nueva y lanza el diálogo de
 * impresión, donde «Guardar como PDF» es el destino por defecto en Windows,
 * macOS, Android e iOS.
 *
 * Se hace así, y no generando el binario en el navegador, porque el motor de
 * impresión del navegador da texto vectorial seleccionable, tablas paginadas y
 * tipografía correcta, que es justo lo que una librería de PDF en cliente hace
 * peor. Para generar los ficheros sin intervención hay `npm run export:pdf`,
 * que dirige un Chrome sin ventana a estas mismas vistas.
 */
export default function BotonPDF({
  ruta,
  children,
  primario = false,
}: {
  /** Ruta de impresión, p. ej. "/imprimir/tema/20" */
  ruta: string
  children: React.ReactNode
  primario?: boolean
}) {
  const destino = `${window.location.origin}${window.location.pathname}#${ruta}?auto=1`

  return (
    <a
      className={primario ? 'btn btn-pri no-imprimir' : 'btn no-imprimir'}
      href={destino}
      target="_blank"
      rel="noreferrer"
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v12M8 11l4 4 4-4M4 19h16" />
      </svg>
      {children}
    </a>
  )
}
