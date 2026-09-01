#!/usr/bin/env node
/**
 * Genera los PDF dirigiendo un Chrome sin ventana a las vistas de impresión de
 * la propia app (`#/imprimir/...`). Así la maqueta del PDF y la del botón
 * «Descargar en PDF» son exactamente la misma: no hay dos plantillas que se
 * desincronicen.
 *
 *   node scripts/export-pdf.js temario          -> todo el temario, con índice
 *   node scripts/export-pdf.js tema 20          -> apuntes de un tema
 *   node scripts/export-pdf.js test 20          -> cuestionario + soluciones
 *   node scripts/export-pdf.js todo             -> temario + un PDF por tema con apunte
 *
 * Opciones:
 *   --base <url>     De dónde leer la app. Por defecto arranca `vite preview`
 *                    sobre dist/ y lo usa. Admite también la URL publicada.
 *   --salida <dir>   Carpeta de destino (por defecto ./export).
 *   --chrome <ruta>  Ejecutable de Chrome, si no está donde se espera.
 *
 * Requiere `npm run build` previo si no se pasa --base.
 */

import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import puppeteer from 'puppeteer-core'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUERTO = 4179

const CHROMES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA ?? ''}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
]

function argumento(nombre, porDefecto) {
  const i = process.argv.indexOf(`--${nombre}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : porDefecto
}

function buscarChrome() {
  const dado = argumento('chrome')
  if (dado) return dado
  const encontrado = CHROMES.find((p) => existsSync(p))
  if (!encontrado) {
    throw new Error(
      'No se encuentra Chrome. Indícalo con --chrome "C:/ruta/a/chrome.exe".',
    )
  }
  return encontrado
}

/** Levanta `vite preview` sobre dist/ y espera a que responda. */
async function servirDist() {
  if (!existsSync(join(RAIZ, 'dist', 'index.html'))) {
    throw new Error('No hay dist/. Ejecuta antes `npm run build`.')
  }

  const proc = spawn(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['run', 'preview', '--', '--port', String(PUERTO), '--strictPort'],
    { cwd: RAIZ, stdio: 'ignore', shell: process.platform === 'win32' },
  )

  const base = `http://localhost:${PUERTO}/`
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(base)
      if (r.ok) return { base, parar: () => proc.kill() }
    } catch {
      // todavía no escucha
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  proc.kill()
  throw new Error('El servidor de preview no respondió a tiempo.')
}

const PIE = `
  <div style="width:100%;font-size:8px;font-family:system-ui,sans-serif;color:#666;
              padding:0 16mm;display:flex;justify-content:space-between;">
    <span>Técnica/o Auxiliar de Laboratorio · Ayuntamiento de Zaragoza</span>
    <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
  </div>`

async function generar(pagina, base, ruta, fichero) {
  await pagina.goto(`${base}#${ruta}`, { waitUntil: 'networkidle0', timeout: 120000 })
  // La vista marca data-listo cuando ha terminado de montarse.
  await pagina.waitForSelector('body[data-listo="1"]', { timeout: 60000 })
  await pagina.emulateMediaType('print')

  await pagina.pdf({
    path: fichero,
    format: 'A4',
    printBackground: true,
    margin: { top: '18mm', bottom: '20mm', left: '16mm', right: '16mm' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: PIE,
  })
  return fichero
}

function temasConApunte() {
  const dir = join(RAIZ, 'temas')
  return readdirSync(dir)
    .filter((f) => /^tema-\d{2}\.md$/.test(f))
    .map((f) => Number(/^tema-(\d{2})\.md$/.exec(f)[1]))
    .sort((a, b) => a - b)
}

async function main() {
  const [orden, arg] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  const salida = join(RAIZ, argumento('salida', 'export'))
  if (!existsSync(salida)) mkdirSync(salida, { recursive: true })

  const baseDada = argumento('base')
  const servidor = baseDada ? { base: baseDada, parar: () => {} } : await servirDist()

  const navegador = await puppeteer.launch({
    executablePath: buscarChrome(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })

  try {
    const pagina = await navegador.newPage()
    const trabajos = []

    if (!orden || orden === 'temario') {
      trabajos.push(['/imprimir/temario', 'temario-completo.pdf'])
    } else if (orden === 'tema') {
      if (!arg) throw new Error('Falta el número de tema: node scripts/export-pdf.js tema 20')
      trabajos.push([`/imprimir/tema/${arg}`, `tema-${String(arg).padStart(2, '0')}-apuntes.pdf`])
    } else if (orden === 'test') {
      if (!arg) throw new Error('Falta el número de tema: node scripts/export-pdf.js test 20')
      trabajos.push([`/imprimir/test/${arg}`, `tema-${String(arg).padStart(2, '0')}-test.pdf`])
    } else if (orden === 'todo') {
      trabajos.push(['/imprimir/temario', 'temario-completo.pdf'])
      for (const n of temasConApunte()) {
        const nn = String(n).padStart(2, '0')
        trabajos.push([`/imprimir/tema/${n}`, `tema-${nn}-apuntes.pdf`])
        trabajos.push([`/imprimir/test/${n}`, `tema-${nn}-test.pdf`])
      }
    } else {
      throw new Error(`Orden desconocida: ${orden}. Usa temario, tema, test o todo.`)
    }

    for (const [ruta, nombre] of trabajos) {
      const destino = join(salida, nombre)
      await generar(pagina, servidor.base, ruta, destino)
      console.log('PDF  ', destino)
    }
  } finally {
    await navegador.close()
    servidor.parar()
  }
}

main().catch((e) => {
  console.error(e.message ?? e)
  process.exit(1)
})
