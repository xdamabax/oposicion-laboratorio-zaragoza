#!/usr/bin/env node
/**
 * Las dos baterias de una vez. Es lo que hay que pasar antes de dar por cerrado
 * un tema.
 *
 *   npm run verificar                  -> esquemas + repaso de todos los temas
 *   npm run verificar -- 26            -> esquemas + repaso del tema 26
 *   npm run verificar -- 26 --sabotajes
 *       autocomprobacion: rompe cada cosa a proposito y exige que salte SU
 *       control y solo el suyo. Sin numero de tema tarda mucho: dale uno.
 *   npm run verificar -- --base https://xdamabax.github.io/oposicion-laboratorio-zaragoza/
 *       contra la web publicada, que es la que de verdad usa el opositor.
 *
 * Requiere `npm run build` previo si no se pasa --base.
 */

import { spawn } from 'node:child_process'
import { join } from 'node:path'

import { RAIZ } from './comun.js'

const args = process.argv.slice(2)

function ejecutar(guion) {
  return new Promise((resolve) => {
    const proc = spawn(process.execPath, [join(RAIZ, 'scripts', guion), ...args], {
      stdio: 'inherit',
    })
    proc.on('close', (codigo) => resolve(codigo ?? 1))
  })
}

const codigos = []
for (const guion of ['verificar-figuras.js', 'verificar-repaso.js']) {
  console.log(`\n\n──────── ${guion} ────────`)
  codigos.push(await ejecutar(guion))
}

const fallidos = codigos.filter((c) => c !== 0).length
console.log(
  fallidos
    ? `\n${fallidos} de 2 baterías con controles sin pasar.`
    : '\nLas dos baterías pasan.',
)
process.exit(fallidos ? 1 : 0)
