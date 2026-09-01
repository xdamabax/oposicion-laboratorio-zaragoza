import type { Repaso } from '../types'

const ficheros = import.meta.glob('../../../repaso/*.json', {
  import: 'default',
  eager: true,
}) as Record<string, Repaso>

export const REPASOS: Map<number, Repaso> = (() => {
  const map = new Map<number, Repaso>()

  for (const [ruta, datos] of Object.entries(ficheros)) {
    const nombre = /tema-(\d{2})\.json$/.exec(ruta)
    if (!nombre) continue // ignora _PLANTILLA.json

    const numero = Number(nombre[1])
    map.set(numero, {
      ...datos,
      tema: numero,
      flashcards: datos.flashcards ?? [],
      test: datos.test ?? [],
      supuestos: datos.supuestos ?? [],
    })
  }

  return map
})()
