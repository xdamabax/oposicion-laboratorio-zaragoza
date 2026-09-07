/**
 * Piezas compartidas por los guiones de `scripts/`: encontrar Chrome, servir
 * `dist/` y localizar los temas que hay escritos.
 *
 * Las tres las necesitan tanto la exportacion a PDF como las dos baterias de
 * verificacion, y conviene que las tres hablen con la MISMA app: si el PDF se
 * genera contra `dist/` y la verificacion contra otra cosa, dejan de decir lo
 * mismo.
 */

import { existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')

const CHROMES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA ?? ''}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
]

/** Valor de `--nombre valor` en la linea de ordenes. */
export function argumento(nombre, porDefecto) {
  const i = process.argv.indexOf(`--${nombre}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : porDefecto
}

/** true si `--nombre` aparece, aunque no lleve valor. */
export function bandera(nombre) {
  return process.argv.includes(`--${nombre}`)
}

export function buscarChrome() {
  const dado = argumento('chrome')
  if (dado) return dado
  const encontrado = CHROMES.find((p) => existsSync(p))
  if (!encontrado) {
    throw new Error('No se encuentra Chrome. Indícalo con --chrome "C:/ruta/a/chrome.exe".')
  }
  return encontrado
}

/**
 * Levanta `vite preview` sobre dist/ y espera a que responda.
 *
 * Devuelve tambien `parar()`, que HAY QUE llamar: si no, el proceso queda vivo
 * y el puerto ocupado para la siguiente ejecucion.
 */
export async function servirDist(puerto) {
  if (!existsSync(join(RAIZ, 'dist', 'index.html'))) {
    throw new Error('No hay dist/. Ejecuta antes `npm run build`.')
  }

  const proc = spawn(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['run', 'preview', '--', '--port', String(puerto), '--strictPort'],
    { cwd: RAIZ, stdio: 'ignore', shell: process.platform === 'win32' },
  )

  const base = `http://localhost:${puerto}/`
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base)).ok) return { base, parar: () => proc.kill() }
    } catch {
      // todavia no escucha
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  proc.kill()
  throw new Error('El servidor de preview no respondió a tiempo.')
}

/** De donde leer la app: `--base <url>` si se da, y si no, dist/ servida aqui. */
export async function decidirBase(puerto) {
  const dada = argumento('base')
  return dada ? { base: dada, parar: () => {} } : servirDist(puerto)
}

function numerosDe(carpeta, patron) {
  const dir = join(RAIZ, carpeta)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .map((f) => patron.exec(f))
    .filter(Boolean)
    .map((m) => Number(m[1]))
    .sort((a, b) => a - b)
}

export const temasConApunte = () => numerosDe('temas', /^tema-(\d{2})\.md$/)
export const temasConRepaso = () => numerosDe('repaso', /^tema-(\d{2})\.json$/)
