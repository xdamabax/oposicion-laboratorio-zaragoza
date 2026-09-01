import type { EstadoApunte } from '../types'

const TEXTO: Record<EstadoApunte, string> = {
  aprobado: 'Aprobado',
  borrador: 'Borrador',
  'sin-apunte': 'Sin apunte',
}

const CLASE: Record<EstadoApunte, string> = {
  aprobado: 'et-aprobado',
  borrador: 'et-borrador',
  'sin-apunte': 'et-vacio',
}

export default function Etiqueta({ estado }: { estado: EstadoApunte }) {
  return <span className={`etiqueta ${CLASE[estado]}`}>{TEXTO[estado]}</span>
}
