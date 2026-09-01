import type { Apunte } from '../types'

const ficheros = import.meta.glob('../../../temas/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * Frontmatter minimo y propio (clave: valor + listas "- item").
 * Evita arrastrar un parser YAML completo para cuatro campos controlados por nosotros.
 */
function parseFrontmatter(md: string): { datos: Record<string, string | string[]>; cuerpo: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(md)
  if (!m) return { datos: {}, cuerpo: md }

  const datos: Record<string, string | string[]> = {}
  let claveLista: string | null = null

  for (const linea of m[1].split(/\r?\n/)) {
    if (!linea.trim()) continue

    const item = /^\s*-\s+(.*)$/.exec(linea)
    if (item && claveLista) {
      ;(datos[claveLista] as string[]).push(limpia(item[1]))
      continue
    }

    const par = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(linea)
    if (!par) continue

    const [, clave, valor] = par
    if (valor.trim() === '') {
      claveLista = clave
      datos[clave] = []
    } else {
      claveLista = null
      datos[clave] = limpia(valor)
    }
  }

  return { datos, cuerpo: m[2] }
}

function limpia(v: string): string {
  return v.trim().replace(/^["']|["']$/g, '')
}

function texto(v: string | string[] | undefined): string | null {
  if (typeof v === 'string') return v
  return null
}

export const APUNTES: Map<number, Apunte> = (() => {
  const map = new Map<number, Apunte>()

  for (const [ruta, contenido] of Object.entries(ficheros)) {
    const nombre = /tema-(\d{2})\.md$/.exec(ruta)
    if (!nombre) continue // ignora _PLANTILLA.md y cualquier otro fichero suelto

    const numero = Number(nombre[1])
    const { datos, cuerpo } = parseFrontmatter(contenido)
    const estado = texto(datos.estado) === 'aprobado' ? 'aprobado' : 'borrador'

    map.set(numero, {
      numero,
      titulo: texto(datos.titulo) ?? `Tema ${numero}`,
      parte: texto(datos.parte) ?? '',
      estado,
      verificado: texto(datos.verificado),
      fuentes: Array.isArray(datos.fuentes) ? datos.fuentes : [],
      cuerpo: cuerpo.trim(),
    })
  }

  return map
})()
