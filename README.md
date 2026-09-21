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
5. **Pasar la batería de verificación** (`npm run verificar -- NN`). Un tema no se cierra en rojo.
6. Commit y push de ese tema, y **volver a verificar contra la web publicada**.

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

### Fuentes no oficiales de apoyo (`TEMARIO EXTRA/`)

`TEMARIO EXTRA/` contiene apuntes **de otra fuente, no oficial** (otra academia/repositorio). Su numeración y sus títulos son **suyos** y no se corresponden con nuestros 40 temas: hay dos series internas (`BIO_`, de microbiología, y `FASE_`, de química general) que pertenecen a temarios distintos del nuestro.

**Regla fija del proyecto.** Cada vez que se redacte un tema nuevo, o se revise uno ya aprobado, **antes de darlo por bueno** hay que consultar si `TEMARIO EXTRA/` tiene contenido relacionado con ese tema. Condiciones de uso:

1. **Corroborar por contenido, nunca por el número ni por el título del archivo.** Su «TEMA 5» no es nuestro tema 5. Hay que leer el archivo y decidir por lo que dice realmente. Un archivo puede cubrir varios temas nuestros y un tema nuestro puede repartirse entre varios archivos.
2. **Sirve como pista, no como fuente.** Orienta sobre qué aspectos suele cubrir el tema y qué se explica de forma más didáctica. **Nunca se vuelca directamente ni se cita como fuente** en el apunte.
3. **Todo lo que aporte se verifica contra la normativa o bibliografía real**, con el mismo rigor que se aplica a los exámenes anteriores y a cualquier otra fuente no oficial. Si no se puede verificar contra fuente real, no entra.
4. **En temas ya aprobados, solo para ampliar.** Nunca para duplicar lo que ya está cubierto. Si no aporta ningún matiz, dato o ejemplo nuevo y verificable, **el apunte no se toca**.
5. **En temas aún no redactados**, el material relacionado se archiva como apoyo en `temas/apoyo/tema-NN.md` —con cabecera de aviso y `estado: sin-verificar`— y se usa como punto de partida para ampliar la búsqueda de fuentes cuando llegue su turno, sujeto a los puntos 2 y 3. Esos ficheros **no los lee ni la app ni los scripts** (`temas/*.md` no cruza subcarpetas), comprobado con una prueba de sabotaje.

El mapeo orientativo de qué archivo corresponde a qué tema está en `TEMARIO EXTRA/MAPEO.md`, junto con los archivos que no encajan en ninguno de los 40.

## Estructura

```
temario.md              Listado oficial de los 40 temas. Fuente de verdad de los títulos.
temas/tema-NN.md        Apuntes. Frontmatter + cuerpo markdown.
temas/apoyo/tema-NN.md  Material de apoyo SIN VERIFICAR de TEMARIO EXTRA/. No es un apunte:
                        la app y los scripts solo leen temas/*.md, nunca subcarpetas.
repaso/tema-NN.json     Tarjetas, test y supuestos, generados del apunte ya aprobado.
ExamenesAnteriores/     Cuestionarios de convocatorias previas y su análisis.
app/                    Web app React (Vite + TypeScript).
scripts/export-pdf.js   Exportación a HTML/PDF de un tema o del temario completo.
scripts/verificar.js    Las dos baterías de verificación de una vez.
scripts/comun.js        Piezas compartidas: encontrar Chrome, servir dist/, listar temas.
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
                                                  // curva-potenciometrica | derivadas-valoracion |
                                                  // cromatograma | cromatografo-ionico |
                                                  // cromatografo-gases | purga-y-trampa
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

### El enlace que aparecia en el pie del PDF

**No lo escribe esta app.** Ni la portada, ni el pie, ni las fuentes llevan la direccion de la web publicada: comprobado por busqueda en el codigo y en los tres PDF generados. Lo que se veia al pie de cada pagina —y arriba el titulo y la fecha— lo dibuja **el propio navegador** cuando la casilla **«Encabezados y pies de pagina»** del dialogo de impresion esta marcada, que es como viene de fabrica. Es un ajuste del navegador, no del documento.

| Camino de salida | Lleva la URL |
| --- | --- |
| `npm run export:pdf` | **No.** El script pone su propia plantilla de pie: `Tecnica/o Auxiliar de Laboratorio · Ayuntamiento de Zaragoza` y el numero de pagina |
| Boton **Descargar en PDF** de la app | **Solo si la casilla esta marcada** |

Una pagina web **no puede apagar esa casilla**. Lo unico que la desactiva desde el documento es dejar los **margenes verticales de `@page` a cero**, y eso quitaria el margen superior e inferior de **todas las paginas menos la primera** —el relleno de un bloque no se repite al saltar de pagina—, que en un temario de casi cien hojas es peor remedio que la enfermedad. Asi que la vista de impresion muestra **un aviso en pantalla**, con la clase `no-imprimir`, que dice donde esta la casilla; el navegador recuerda la eleccion para las siguientes impresiones.

Comprobado generando el PDF en las dos posiciones de la casilla (`displayHeaderFooter` de `printToPDF` es ese mismo interruptor) y extrayendo el texto: **marcada, la URL sale en cada pagina; desmarcada, en ninguna**. Y el aviso no aparece en el PDF en ningun caso.

## Verificación

Dos baterías que **conducen la app ya construida** y miden lo que de verdad se pinta. No validan los ficheros contra sí mismos, porque los fallos que importan aquí producen datos perfectamente válidos:

- Un índice `correcta` desplazado en uno da un JSON válido y un test que **enseña la respuesta equivocada**.
- Un esquema equivocado **se pinta igual de bien** que uno correcto: la curva de desviación de Beer llegó a dibujarse arrancando *por encima* de la recta ideal, que enseña justo lo contrario de lo que hay que aprender.
- Una figura rota **no da ningún error**: se queda en blanco y el PDF parece correcto hasta que se mira.

```bash
npm run build                     # las baterías miden dist/, no el código fuente
npm run verificar                 # las dos, sobre todos los temas
npm run verificar -- 26           # solo un tema
npm run verificar -- 26 --sabotajes
npm run verificar -- --base https://xdamabax.github.io/oposicion-laboratorio-zaragoza/
```

Con `--base` se mide **la web publicada**, que es la que usa el opositor. Un arreglo no está confirmado hasta pasar ahí.

### Qué comprueba cada una

`verificar-figuras.js` — **30 controles** sobre los esquemas del catálogo. Dos son genéricos y valen para cualquier figura futura: que ninguna se encoja por debajo de su tamaño natural y que **ningún rótulo se salga de su lienzo**. Los otros veinte afirman algo comprobable sobre la geometría: que el monocromador va *después* del atomizador en absorción atómica y *antes* de la cubeta en UV-visible; que el programa del horno sube secado < calcinación < atomización y que **el pico de absorbancia cae dentro de la atomización**; que cada temperatura rotula su propio escalón; que la línea atómica es al menos 8 veces más estrecha que la banda molecular **y de la misma altura**, para que lo que se lea sea anchura y no intensidad; que el cátodo de la lámpara está **hueco de verdad** (`isPointInFill`: la cavidad vacía y la pared maciza) y que el haz sale por la ventana; que la curva de Beer arranca pegada a la ideal y se va **siempre por debajo**; que el máximo de la primera derivada y el corte de la segunda caen en el mismo punto de equivalencia; que la antorcha tiene tres tubos concéntricos con la muestra por el central y la zona de medida detrás de la bobina; que las etapas del ICP-MS van en orden y **la presión cae** a lo largo del camino; que el detector de nefelometría mira **a 90°** y el de turbidimetría **en línea**, y que el haz sale de la cubeta atenuado; que en el refractómetro el rayo **se acerca a la normal** y la línea claro/oscuro cae **en la cruz del retículo**; que en el polarímetro el plano **solo gira en el tubo** y el analizador va girado el mismo ángulo; y, en los dos esquemas de cromatografía, que el tiempo muerto va **antes** que los dos picos con cada marca sobre su propia cima, que el **supresor va entre la columna y el detector**, y que las etapas del cromatógrafo iónico van en orden; y, en los dos de cromatografía de gases, que **la columna va dentro del horno** y el inyector y el detector fuera, que las etapas van en orden, y que **el gas de purga entra por debajo del nivel del agua** mientras que **la aguja del espacio de cabeza se queda por encima** —que es justo lo que distingue las dos técnicas—.

El control del cromatograma merece una línea aparte, porque es de otra clase: el dibujo **escribe** un número —la resolución— que se deduce de su propia geometría, así que puede demostrarlo. El control **recalcula Rs = 2·(tR_B − tR_A)/(w_A + w_B)** sobre los tiempos y las anchuras pintados y exige que coincida con lo escrito al pie. Un cromatograma con los picos bonitos y la resolución inventada no da ningún error por sí solo, que es justo el fallo silencioso que persigue esta batería.

Los esquemas ópticos del tema 28 se apoyan además en atributos `data-pieza` dentro del SVG. Los dibujos antiguos se localizan por color y por forma, que basta cuando la pieza es única; en éstos no lo es —hay dos detectores idénticos y dos haces del mismo rojo— y **lo que el control afirma es justo cuál es cuál**, así que el dibujo lo declara en vez de dejarlo a una heurística. Es la misma idea que el `data-listo` de la vista de impresión.

`verificar-repaso.js` — **8 controles** por tema, respondiendo todas las preguntas: 3 opciones en el test y 4 en los supuestos; que **la opción que marca la app sea la del dato** y que el veredicto concuerde; que ninguna letra se lleve más del 45 % de las respuestas; que «Solo núcleo» reduzca de verdad y solo deje preguntas etiquetadas; que las figuras del apunte se pinten con caja de contenido no nula; que **el dibujo de una tarjeta no lleve escrita la respuesta de su reverso**; y que la figura que hace de pregunta lleve rótulo neutro y el nombre completo aparezca al revelar.

El control del dibujo delator es automático, sin listas escritas a mano: toma los fragmentos **en negrita** del reverso —que es lo que la tarjeta pide recordar—, descarta los que ya están en el anverso y comprueba que ninguno aparezca escrito dentro del SVG.

Los controles que no aplican a un tema (un tema de la parte común no tiene supuestos) salen como `·`, no como aprobados.

### Las pruebas se prueban a sí mismas

`--sabotajes` rompe cada cosa a propósito antes de medir y exige que salte **su** control y ninguno más. Es lo que impide que un control se quede en verde por vacío: la primera versión del detector de figuras rotas daba falso negativo, y tres de estos sabotajes estaban mal escritos —uno tocaba la curva equivocada, otro sacaba un rótulo del lienzo de rebote y otro encogía a la vez lo pedido y lo pintado, así que se anulaba solo—. Sin este modo no se habría visto.

Un sabotaje puede tumbar más de un control si están acoplados de verdad, y entonces se declara: aplanar el programa del horno divorcia además una etiqueta de su escalón, porque las marcas se dibujan a la altura de su meseta. Lo que no se tolera es que tumbe uno **no declarado**.

Y un recordatorio de que la batería no sustituye a mirar el dibujo: el analizador del polarímetro salió **girado al revés que su propia rejilla** —en SVG la *y* crece hacia abajo, así que la matriz de giro de toda la vida gira al contrario— y los controles de entonces lo daban por bueno, porque miraban la rejilla y no el contorno. Se vio en una captura. El arreglo fue doble: corregir el dibujo **y** añadir la comprobación del contorno, con su sabotaje (el 23) para probarla.

### Qué hacer cuando salta el control del dibujo delator

Pasó con cuatro tarjetas de los temas 23 y 24, y la salida es siempre la misma: **reformular la pregunta, nunca recortar el dibujo**. Si el esquema rotula una parte, la pregunta la da por sabida y pide lo que el dibujo *no* dice.

| Tarjeta | Antes | Ahora pide |
| --- | --- | --- |
| `t23-f18` | «Nombra las partes de este electrodo» | Por qué se llama *combinado*, para qué sirve el diafragma y qué hacer con el orificio de llenado |
| `t23-f36` | «¿Dónde está el punto de equivalencia?» | Si el punto de equivalencia y lo que localiza el instrumento son lo mismo, y de qué depende que coincidan |
| `t23-f42` | «Nombra las partes de este montaje» | Capacidades del cilindro, qué guarda el chip de datos y qué calcula la unidad de control |
| `t24-f30` | «¿En qué se basa la medida?» | A qué es proporcional la corriente y qué norma recoge el método |

Nombrar la parte en el enunciado no es un truco para callar el control: es la corrección de fondo. El rótulo deja de ser una filtración y pasa a ser el enunciado, y la negrita del reverso vuelve a marcar lo que hay que recordar. **Los `id` no cambian**, así que el progreso guardado se conserva.

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
