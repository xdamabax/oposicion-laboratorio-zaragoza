/**
 * El titulo (h2/h3) del apartado `clave` dentro de un apunte ya pintado. Sigue
 * la misma regla que scripts/ampliacion.js: los `##` y `###` numerados, y los
 * `###` sin numero bajo un `##` numerado («3/Artículo 8»).
 */
export function buscarApartado(raiz: HTMLElement, clave: string): HTMLElement | null {
  let padre: string | null = null
  for (const h of raiz.querySelectorAll<HTMLElement>('h2, h3')) {
    const titulo = (h.textContent ?? '').trim()
    const num = /^(\d+(?:\.\d+)*)\.?\s/.exec(titulo)
    let actual: string | null = null
    if (h.tagName === 'H2') {
      padre = num ? num[1] : null
      actual = padre
    } else if (num) actual = num[1]
    else if (padre) actual = `${padre}/${titulo.split('.')[0].trim()}`
    if (actual === clave) return h
  }
  return null
}
