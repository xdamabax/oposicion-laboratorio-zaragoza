#!/usr/bin/env node
/**
 * Exporta apuntes a HTML listo para imprimir y, si hay puppeteer instalado, a PDF.
 *
 *   node scripts/export-pdf.js            -> todos los temas con apunte
 *   node scripts/export-pdf.js 1          -> solo el tema 1
 *   node scripts/export-pdf.js 1 4 9      -> temas sueltos
 *   node scripts/export-pdf.js --todo     -> un unico PDF con el temario completo
 *
 * Puppeteer no es dependencia del proyecto para no engordar el npm ci del deploy.
 * Si no esta, el script deja el HTML y te dice como imprimirlo.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR_TEMAS = join(RAIZ, 'temas')
const DIR_SALIDA = join(RAIZ, 'export')

function parseFrontmatter(md) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(md)
  if (!m) return { datos: {}, cuerpo: md }

  const datos = {}
  let claveLista = null

  for (const linea of m[1].split(/\r?\n/)) {
    if (!linea.trim()) continue

    const item = /^\s*-\s+(.*)$/.exec(linea)
    if (item && claveLista) {
      datos[claveLista].push(item[1].trim().replace(/^["']|["']$/g, ''))
      continue
    }

    const par = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(linea)
    if (!par) continue

    if (par[2].trim() === '') {
      claveLista = par[1]
      datos[par[1]] = []
    } else {
      claveLista = null
      datos[par[1]] = par[2].trim().replace(/^["']|["']$/g, '')
    }
  }

  return { datos, cuerpo: m[2] }
}

function cargarTemas(numeros) {
  const ficheros = readdirSync(DIR_TEMAS)
    .filter((f) => /^tema-\d{2}\.md$/.test(f))
    .sort()

  return ficheros
    .map((f) => {
      const numero = Number(/^tema-(\d{2})\.md$/.exec(f)[1])
      const { datos, cuerpo } = parseFrontmatter(readFileSync(join(DIR_TEMAS, f), 'utf8'))
      return { numero, datos, cuerpo }
    })
    .filter((t) => numeros.length === 0 || numeros.includes(t.numero))
}

const CSS = `
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; font-size: 11pt; line-height: 1.55;
         color: #16202c; margin: 0; }
  h1 { font-size: 18pt; margin: 0 0 .2em; page-break-after: avoid; }
  h2 { font-size: 13pt; margin: 1.6em 0 .4em; page-break-after: avoid;
       border-bottom: 1px solid #ccc; padding-bottom: .15em; }
  h3 { font-size: 11.5pt; margin: 1.1em 0 .3em; page-break-after: avoid; }
  p, li { orphans: 3; widows: 3; }
  table { border-collapse: collapse; width: 100%; font-size: 9.5pt; margin: .8em 0;
          page-break-inside: avoid; }
  th, td { border: 1px solid #bbb; padding: 4px 7px; text-align: left; vertical-align: top; }
  th { background: #f0f2f5; }
  code { background: #f0f2f5; padding: .05em .3em; border-radius: 3px; font-size: .9em; }
  blockquote { margin: .8em 0; padding: .1em 1em; border-left: 3px solid #1f5f8b; color: #444; }
  .cab { color: #5d6b7a; font-size: 9pt; text-transform: uppercase; letter-spacing: .06em;
         margin: 0 0 .3em; }
  .fuentes { margin-top: 2em; padding: .8em 1em; background: #f6f7f9; border: 1px solid #ddd;
             font-size: 9.5pt; page-break-inside: avoid; }
  .tema + .tema { page-break-before: always; }
`

function render(temas, titulo) {
  const secciones = temas
    .map((t) => {
      const fuentes = Array.isArray(t.datos.fuentes) ? t.datos.fuentes : []
      return `
        <section class="tema">
          <p class="cab">${escapa(t.datos.parte ?? '')}</p>
          <h1>${t.numero}. ${escapa(t.datos.titulo ?? '')}</h1>
          ${marked.parse(t.cuerpo)}
          <div class="fuentes">
            <b>Fuentes y verificacion</b>
            <ul>${fuentes.map((f) => `<li>${escapa(f)}</li>`).join('')}</ul>
            ${t.datos.verificado ? `<p>Verificado el ${escapa(t.datos.verificado)}.</p>` : ''}
          </div>
        </section>`
    })
    .join('\n')

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>${escapa(titulo)}</title>
<style>${CSS}</style></head><body>${secciones}</body></html>`
}

function escapa(s) {
  return String(s).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
  )
}

async function main() {
  const args = process.argv.slice(2)
  const unico = args.includes('--todo')
  const numeros = args.filter((a) => /^\d+$/.test(a)).map(Number)

  const temas = cargarTemas(numeros)
  if (temas.length === 0) {
    console.error('No hay apuntes que exportar en temas/. Redacta primero algun tema-NN.md.')
    process.exit(1)
  }

  if (!existsSync(DIR_SALIDA)) mkdirSync(DIR_SALIDA, { recursive: true })

  const lotes = unico
    ? [{ nombre: 'temario-completo', temas, titulo: 'Temario completo' }]
    : temas.map((t) => ({
        nombre: `tema-${String(t.numero).padStart(2, '0')}`,
        temas: [t],
        titulo: `Tema ${t.numero}`,
      }))

  let navegador = null
  try {
    const { default: puppeteer } = await import('puppeteer')
    navegador = await puppeteer.launch()
  } catch {
    console.warn('[aviso] puppeteer no esta instalado: solo se genera el HTML.')
    console.warn('        Instalalo con  npm i -D puppeteer  o abre el HTML e imprime a PDF.')
  }

  for (const lote of lotes) {
    const html = render(lote.temas, lote.titulo)
    const rutaHtml = join(DIR_SALIDA, `${lote.nombre}.html`)
    writeFileSync(rutaHtml, html, 'utf8')
    console.log(`HTML  ${rutaHtml}`)

    if (navegador) {
      const pagina = await navegador.newPage()
      await pagina.setContent(html, { waitUntil: 'load' })
      const rutaPdf = join(DIR_SALIDA, `${lote.nombre}.pdf`)
      await pagina.pdf({ path: rutaPdf, format: 'A4', printBackground: true })
      await pagina.close()
      console.log(`PDF   ${rutaPdf}`)
    }
  }

  if (navegador) await navegador.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
