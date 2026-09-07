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

import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

import { RAIZ, argumento, buscarChrome, decidirBase, temasConApunte } from './comun.js'

const PUERTO = 4179

const PIE = `
  <div style="width:100%;font-size:8px;font-family:system-ui,sans-serif;color:#666;
              padding:0 16mm;display:flex;justify-content:space-between;">
    <span>Técnica/o Auxiliar de Laboratorio · Ayuntamiento de Zaragoza</span>
    <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
  </div>`

/**
 * Comprueba que cada imagen va a salir de verdad en el papel.
 *
 * No basta con que el DOM la haya montado, ni siquiera con que haya cargado:
 * una imagen puede tener naturalWidth > 0 y pintarse con altura cero, o quedar
 * oculta por una regla de la hoja de impresion. Una figura en blanco no da
 * ningun error, asi que el PDF parece correcto hasta que se mira. Se mide en
 * medio print, que es el que produce el PDF, y se exige las cuatro cosas:
 * cargada, decodificada, con caja pintada y visible.
 */
async function imagenesRotas(pagina) {
  return pagina.evaluate(() =>
    Array.from(document.images)
      .map((img) => {
        const estilo = getComputedStyle(img)
        // La caja de CONTENIDO. Ni getBoundingClientRect() ni la altura
        // computada valen: con box-sizing border-box y el padding de
        // .figura-ghs, una figura de contenido nulo sigue midiendo 4 px.
        const relleno = (a, b) => (parseFloat(a) || 0) + (parseFloat(b) || 0)
        const ancho = img.clientWidth - relleno(estilo.paddingLeft, estilo.paddingRight)
        const alto = img.clientHeight - relleno(estilo.paddingTop, estilo.paddingBottom)
        return {
          nombre: img.alt || img.currentSrc || '(imagen sin alt)',
          cargada: img.complete && img.naturalWidth > 0 && img.naturalHeight > 0,
          pintada: ancho > 0 && alto > 0,
          visible:
            estilo.visibility !== 'hidden' &&
            estilo.display !== 'none' &&
            Number(estilo.opacity) > 0,
        }
      })
      .filter((i) => !i.cargada || !i.pintada || !i.visible)
      .map((i) => `${i.nombre} [${!i.cargada ? 'no carga' : !i.pintada ? 'caja 0' : 'oculta'}]`),
  )
}

async function generar(pagina, base, ruta, fichero) {
  await pagina.goto(`${base}#${ruta}`, { waitUntil: 'networkidle0', timeout: 120000 })
  // La vista marca data-listo cuando ha montado Y ha cargado sus imagenes.
  await pagina.waitForSelector('body[data-listo="1"]', { timeout: 60000 })
  await pagina.emulateMediaType('print')

  const rotas = await imagenesRotas(pagina)
  if (rotas.length > 0) {
    console.warn(`AVISO  ${ruta}: ${rotas.length} imagen(es) no saldran en el PDF:`)
    for (const r of rotas) console.warn(`         - ${r}`)
  }

  await pagina.pdf({
    path: fichero,
    format: 'A4',
    printBackground: true,
    margin: { top: '18mm', bottom: '20mm', left: '16mm', right: '16mm' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: PIE,
  })
  return rotas.length
}

async function main() {
  const [orden, arg] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  const salida = join(RAIZ, argumento('salida', 'export'))
  if (!existsSync(salida)) mkdirSync(salida, { recursive: true })

  const servidor = await decidirBase(PUERTO)

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

    let rotas = 0
    for (const [ruta, nombre] of trabajos) {
      const destino = join(salida, nombre)
      rotas += await generar(pagina, servidor.base, ruta, destino)
      console.log('PDF  ', destino)
    }

    // El PDF se genera igual, pero no se da por bueno: un fallo de figura es
    // silencioso y hay que verlo en el codigo de salida, no solo en pantalla.
    if (rotas > 0) {
      throw new Error(`${rotas} imagen(es) no han salido en los PDF generados (ver AVISO arriba).`)
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
