import raw from '../../../temario.md?raw'
import type { TemaOficial } from '../types'

/**
 * Parser tolerante de temario.md. Reglas:
 *  - "## Titulo"  -> abre parte;  "### Titulo" -> abre bloque.
 *  - "1. Enunciado" o "Tema 1. Enunciado" -> abre tema.
 *  - Cualquier otra linea no vacia se concatena al enunciado del tema abierto,
 *    para soportar enunciados oficiales que ocupan varias lineas.
 */
function parseTemario(md: string): TemaOficial[] {
  const sinComentarios = md.replace(/<!--[\s\S]*?-->/g, '')
  const temas: TemaOficial[] = []
  let parte = 'Temario'
  let bloque: string | null = null
  let abierto: TemaOficial | null = null

  for (const linea of sinComentarios.split(/\r?\n/)) {
    const t = linea.trim()
    if (!t) continue

    const h3 = /^###\s+(.*)$/.exec(t)
    if (h3) {
      bloque = h3[1].trim()
      abierto = null
      continue
    }
    const h2 = /^##\s+(.*)$/.exec(t)
    if (h2) {
      parte = h2[1].trim()
      bloque = null
      abierto = null
      continue
    }
    if (t.startsWith('#')) {
      abierto = null
      continue
    }

    const inicio = /^(?:Tema\s+)?(\d{1,2})\s*[.)\u2013\u2014-]\s*(.*)$/i.exec(t)
    if (inicio) {
      const numero = Number(inicio[1])
      abierto = { numero, titulo: inicio[2].trim(), parte, bloque }
      temas.push(abierto)
      continue
    }

    if (abierto) abierto.titulo = `${abierto.titulo} ${t}`.trim()
  }

  return temas.sort((a, b) => a.numero - b.numero)
}

export const TEMARIO: TemaOficial[] = parseTemario(raw)

export const PARTES: { parte: string; bloques: { bloque: string | null; temas: TemaOficial[] }[] }[] =
  (() => {
    const out: { parte: string; bloques: { bloque: string | null; temas: TemaOficial[] }[] }[] = []
    for (const tema of TEMARIO) {
      let p = out.find((x) => x.parte === tema.parte)
      if (!p) {
        p = { parte: tema.parte, bloques: [] }
        out.push(p)
      }
      let b = p.bloques.find((x) => x.bloque === tema.bloque)
      if (!b) {
        b = { bloque: tema.bloque, temas: [] }
        p.bloques.push(b)
      }
      b.temas.push(tema)
    }
    return out
  })()

/** true mientras temario.md siga siendo el andamio sin enunciados oficiales. */
export const TEMARIO_PENDIENTE = TEMARIO.some((t) => t.titulo.includes('[PENDIENTE'))
