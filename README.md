# Oposición · Técnica/o Auxiliar de Laboratorio — Ayuntamiento de Zaragoza

App de estudio (apuntes + repaso) para la convocatoria publicada en el **BOPZ núm. 170, de 27 de julio de 2026, anuncio núm. 5077**. 40 temas: 8 comunes y 32 específicos.

## Formato real del examen

Según las **bases generales (TRBGTL), base 7.4.C.1**, a las que remite la convocatoria. Todo lo que genera este proyecto se ajusta a esto.

| | Primer ejercicio | Segundo ejercicio |
|---|---|---|
| Tipo | Teórico y escrito | Práctico y escrito |
| Preguntas | 50 (+5 de reserva) | 5 supuestos × 5 preguntas = 25 |
| **Opciones** | **3** (a, b, c) | **4** (a, b, c, d) |
| Tiempo | 55 minutos | 35 minutos |
| Nota | 0-10, mínimo 5 | 0-10, mínimo 5 |
| Temario | **Los 40 temas** | Parte segunda (temas 9-40) |

Los dos ejercicios se hacen **el mismo día**, el segundo inmediatamente después del primero, y ambos son eliminatorios. Además hay **nota de corte**: solo pasan al segundo los 150 mejores.

**Penalización:** cada respuesta errónea descuenta **1/4** del valor de un acierto; las respuestas en blanco no penalizan. Aun así, responder siempre tiene valor esperado positivo (+1/6 de acierto con 3 opciones, +1/16 con 4), así que nunca compensa dejar una pregunta en blanco. La app lo recuerda en el inicio y en cada test.

Consecuencia para los datos: los temas 9-40 se preguntan **en los dos formatos**, así que su fichero de repaso lleva `test` (3 opciones) y `supuestos` (4 opciones). Los temas 1-8 solo llevan `test`.

## Cómo se trabaja

Tema a tema, nunca en bloque:

1. **Buscar la fuente** — norma exacta y vigente (texto consolidado del BOE/BOA/BOPZ, norma UNE/ISO, etc.).
2. **Redactar el apunte** en `temas/tema-NN.md` con `estado: borrador`.
3. **Revisión y aprobación** por parte del opositor.
4. **Solo entonces** se genera `repaso/tema-NN.json` y el apunte pasa a `estado: aprobado`.
5. Commit y push de ese tema.

Regla de fondo: **nada de contenido de memoria del modelo**. Cada apunte declara su norma, su versión y su fecha de verificación.

### Volumen orientativo por tema

Proporciones derivadas del peso real observado en los exámenes anteriores (ver `ExamenesAnteriores/ANALISIS.md`). Son **orientación, no cifra fija**: la muestra son dos exámenes de turno libre, y si un tema concreto pide más o menos, se ajusta.

| Bloque | Temas | Tarjetas | Test (3 op.) | Supuestos (4 op.) |
|---|---|---|---|---|
| Parte común | 1-8 | ~15 | ~10 | — |
| Microbiología | 9-19 | ~25 | ~15 | ~5 |
| Físico-química y seguridad | 20-32 | ~30 | ~20 | ~5 |
| Agua, aire y ISO 17025 | 33-40 | ~30 | ~20 | ~8 |

Dentro de la parte común el peso tampoco es uniforme: en los dos exámenes completos, el TREBEP dio 3-4 preguntas de 10 y la Constitución solo 1.

### Núcleo

Las tarjetas y preguntas de mayor peso real llevan `nucleo: true`. La app ofrece un modo **«Solo núcleo»** en tarjetas y en test. No se borra nada: el material completo sigue disponible como consulta, y así no se pierde el progreso guardado.

### Temas sin precedente

Los temas **2, 4, 5, 8, 10, 19 y 29** no aparecen en ninguno de los seis cuestionarios analizados. Al presentar su apunte hay que **avisar explícitamente de cada duda o ambigüedad de fuente**, en vez de asumir el nivel de detalle habitual.

## Estructura

```
temario.md              Listado oficial de los 40 temas. Fuente de verdad de los títulos.
temas/tema-NN.md        Apuntes. Frontmatter + cuerpo markdown.
repaso/tema-NN.json     Tarjetas, test y supuestos, generados del apunte ya aprobado.
ExamenesAnteriores/     Cuestionarios de convocatorias previas y su análisis.
app/                    Web app React (Vite + TypeScript).
scripts/export-pdf.js   Exportación a HTML/PDF de un tema o del temario completo.
```

Plantillas comentadas en `temas/_PLANTILLA.md` y `repaso/_PLANTILLA.json`. Los ficheros que empiezan por `_` los ignora la app.

Los apuntes de la parte segunda incluyen además una **tabla operativa** «parámetro → técnica → norma → unidades → condiciones», porque *«¿qué técnica utilizaría para analizar X?»* es el patrón de pregunta más repetido de los exámenes reales.

### Figuras

El examen usa imágenes (pictogramas de peligro, material de vidrio, lecturas de bureta). No se suben fotos: las tarjetas y preguntas **declaran** qué figura quieren y la app la dibuja en SVG.

```json
"figura": { "tipo": "ghs", "valor": "corrosivo" }   // explosivo | inflamable | comburente | gas-presion |
                                                  // corrosivo | toxico-agudo | irritante |
                                                  // peligro-salud | medioambiente
"figura": { "tipo": "bureta", "lectura": 12.5, "capacidad": 25 }
"figura": { "tipo": "material", "valor": "matraz-aforado" }
"figura": { "tipo": "esquema", "valor": "electrodo-vidrio" }  // electrodo-vidrio | phmetro |
                                                  // valorador-automatico |
                                                  // curva-potenciometrica | derivadas-valoracion
```

**Cada figura lleva su nombre.** No se escribe en el dato: sale de su propia declaración, a través de `app/src/components/figuras/nombres.ts`, que es el único sitio donde vive el catálogo de nombres. Así una figura ya escrita en un apunte o en un JSON gana el rótulo sin tocar nada, y el apunte, la tarjeta y el catálogo la llaman igual. El nombre aparece en tres sitios:

| Dónde | Qué se ve |
| --- | --- |
| `title` del `<figure>` | Al pasar el ratón, siempre |
| `<title>` y `aria-label` del SVG (o `alt` del pictograma) | Texto alternativo, siempre |
| `<figcaption>` | A la vista: el pie escrito a mano si lo hay y, si no, el nombre del catálogo |

Con una excepción: **cuando la figura ES la pregunta** (anverso de una tarjeta sin girar, pregunta de test sin responder, enunciado de un supuesto, cuestionario impreso) el rótulo no puede cantar la respuesta. En ese caso la figura se pinta con `incognita` y el nombre pasa a ser **neutro** —«Pictograma de peligro CLP», «Bureta de 25 mL»—, tanto en el pie como en el texto alternativo. Al girar la tarjeta o responder la pregunta, aparece el nombre completo.

En los apuntes, dentro de una tabla el dibujo se encoge pero **el pie se mantiene**: en una columna de siluetas parecidas (matraz, pipeta, bureta) el nombre es lo único que las distingue de un vistazo.

Componentes en `app/src/components/figuras/`. Los **esquemas** (`Esquema.tsx`) son distintos del resto: no buscan que se reconozca una silueta, sino enseñar las **partes** de un instrumento o **dónde cae** el punto de equivalencia, así que llevan rótulos dentro del dibujo, se usan a tamaño grande y sus curvas se **calculan** (sigmoide y sus dos derivadas analíticas) en vez de dibujarse a ojo. Los **nueve pictogramas CLP son los oficiales** del Reglamento (CE) 1272/2008, anexo V, en SVG (`app/src/assets/ghs/`): los mismos símbolos que figuran en una etiqueta real. La bureta y el material de vidrio sí son dibujos esquemáticos propios, pensados para reconocer la silueta y distinguir material aforado de graduado.

### Tema claro y oscuro

Botón en la barra de navegación que cicla **sistema → claro → oscuro**. La preferencia se guarda en `localStorage` (`oposicion-zgz:tema`) y el valor de partida es el del sistema operativo. En CSS, `:root` lleva la paleta clara, el bloque `prefers-color-scheme: dark` se aplica solo si el usuario no ha elegido «claro», y `:root[data-tema="oscuro"]` gana en ambos sentidos.

Los pictogramas CLP son un rombo rojo **sobre blanco** por norma, así que se dibujan siempre sobre un soporte blanco: en tema oscuro no quedan flotando ni pierden contraste el símbolo negro.

## Exportar a PDF

Hay tres documentos, y una sola maqueta para los dos caminos de salida:

| Documento | Ruta de impresión | Dónde está el botón |
|---|---|---|
| Apuntes de un tema | `#/imprimir/tema/:n` | Pestaña **Apuntes** del tema |
| Apuntes de los 40 temas, con portada e índice | `#/imprimir/temario` | Sección **Descargas** del inicio |
| Cuestionario de un tema + soluciones | `#/imprimir/test/:n` | Pestaña **Test** del tema |

El cuestionario lleva primero las preguntas del **primer ejercicio** (3 opciones), después las del **supuesto práctico** (4 opciones) con numeración continua, y al final una sección de **Soluciones** con la respuesta correcta, la explicación y la fuente de cada una. Test y supuestos van en el mismo PDF: se hacen el mismo día y en papel interesa corregirlo todo de una vez.

**Desde la app**, el botón abre la vista de impresión y lanza el diálogo del navegador, donde «Guardar como PDF» es el destino por defecto. Se hace así, y no generando el binario en JavaScript, porque el motor de impresión da texto vectorial seleccionable y paginación real, que es justo lo que las librerías de PDF en cliente hacen peor.

**Sin intervención**, `npm run export:pdf` dirige un Chrome sin ventana a esas mismas vistas:

```bash
npm run export:pdf -- temario     # temario-completo.pdf
npm run export:pdf -- tema 20     # tema-20-apuntes.pdf
npm run export:pdf -- test 20     # tema-20-test.pdf
npm run export:pdf -- todo        # temario + apuntes y test de cada tema
```

Los ficheros salen en `export/` (ignorada por git). Requiere `npm run build` previo y un Chrome instalado; con `--base <url>` puede apuntarse a la web publicada en lugar de a `dist/`, y con `--chrome <ruta>` indicarse otro ejecutable.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

## Despliegue

GitHub Actions (`.github/workflows/deploy.yml`) construye y publica en **GitHub Pages** en cada push a `main`: https://xdamabax.github.io/oposicion-laboratorio-zaragoza/

## Progreso de estudio

Se guarda en `localStorage` del navegador (clave `oposicion-zgz:progreso:v1`); no hay backend. Repetición espaciada tipo SM-2 simplificada a tres botones, racha diaria y estadísticas de test. Exportable e importable en JSON desde la página **Progreso**.
