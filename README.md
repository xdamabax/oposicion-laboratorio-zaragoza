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

Los temas **2, 4, 5, 8, 10, 19 y 29** no aparecen en ninguno de los seis cuestionarios analizados. (El 5 sí aparece en cuestionarios de **otras plazas** del Ayuntamiento de 2025-2026, con la misma parte común: ver su apunte.) Al presentar su apunte hay que **avisar explícitamente de cada duda o ambigüedad de fuente**, en vez de asumir el nivel de detalle habitual.

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
ExamenesAnteriores/PLANTILLAS.md  Respuestas oficiales (plantillas del Ayuntamiento), leídas por píxeles; las de nuestra plaza, también a la vista.
app/                    Web app React (Vite + TypeScript).
scripts/export-pdf.js   Exportación a HTML/PDF de un tema o del temario completo.
scripts/verificar.js    Las dos baterías de verificación de una vez.
scripts/verificar-pdf.js  Saltos de página del PDF: ningún apartado arranca huérfano al pie ni salta sin necesidad.
scripts/verificar-editor.js  Editor de descarga: el apunte sin tocar da el mismo PDF, y sus funciones.
scripts/verificar-word.js  Exportación a Word: el .docx tiene los mismos títulos, tablas, figuras y texto que el apunte.
app/src/editor/          Editor de descarga: Markdown <-> documento del editor, esquema y almacén local.
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
                                                  // cromatografo-gases | purga-y-trampa |
                                                  // fase-normal-vs-inversa | gradiente-elucion |
                                                  // cloracion-punto-ruptura |
                                                  // alcalinidad-valoracion |
                                                  // dbo-frente-a-dqo | solidos-del-agua |
                                                  // nitrogeno-total-fracciones |
                                                  // nca-metales-dureza |
                                                  // envase-camara-de-aire |
                                                  // grifo-tres-objetivos |
                                                  // corte-pm10-pm25 |
                                                  // captacion-pm-y-metales |
                                                  // dianas-veracidad-precision |
                                                  // incertidumbre-en-cuadratura |
                                                  // intervalo-de-trabajo |
                                                  // grafico-control-x |
                                                  // recta-minimos-cuadrados |
                                                  // cadena-trazabilidad |
                                                  // acreditacion-certificacion |
                                                  // ciclo-acreditacion |
                                                  // estructura-plan-igualdad |
                                                  // circuito-protocolo-acoso |
                                                  // instituciones-aragon |
                                                  // clases-competencias |
                                                  // plazos-procedimiento |
                                                  // fases-procedimiento |
                                                  // organos-zaragoza |
                                                  // umbrales-gran-poblacion |
                                                  // recursos-haciendas-locales |
                                                  // impuestos-municipales |
                                                  // clases-empleados-publicos |
                                                  // prescripcion-faltas-sanciones |
                                                  // escalas-funcion-publica-local |
                                                  // umbrales-prevencion |
                                                  // grupos-riesgo-biologico |
                                                  // cadena-transmision |
                                                  // clases-cabinas |
                                                  // microscopio-optico |
                                                  // resistencia-descontaminacion |
                                                  // binomios-esterilizacion |
                                                  // agotamiento-cuadrantes |
                                                  // siembra-profundidad-superficie |
                                                  // banco-diluciones |
                                                  // bandeja-nmp-51 |
                                                  // tincion-gram |
                                                  // gota-pendiente |
                                                  // tres-dominios |
                                                  // estructura-virus |
                                                  // ciclo-pcr |
                                                  // arbol-gramnegativos |
                                                  // control-semicuantitativo |
                                                  // recuperacion-medio |
                                                  // membrana-cca |
                                                  // tsc-mup |
                                                  // plan-tres-clases |
                                                  // nmp-moluscos
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

### Editar antes de descargar

En la pestaña **Apuntes**, **Editar antes de descargar** abre `#/editar/tema/:n`: un editor visual (TipTap) con el apunte dentro, unas opciones y una vista previa. Se puede reescribir, partir párrafos y meter saltos de línea (Mayús+Intro), subir o bajar bloques (Alt+↑/↓), quitarlos, añadir saltos de página (Ctrl+Intro) y tocar las tablas (filas y columnas). Las figuras son bloques cerrados: se mueven o se quitan, pero no se editan por dentro. Las opciones son la letra (10, 11 o 12 pt), los márgenes (estrechos, normales o anchos), qué secciones salen y si sale el recuadro de fuentes.

**Lo editado no cambia el apunte de la app**: se guarda en este navegador (localStorage, una entrada por tema y solo si hay cambios) y solo vale para descargar. «Volver al original» lo descarta. Si después se actualiza el apunte, el editor avisa de que la edición se hizo sobre una versión anterior. Al ser localStorage, las ediciones no pasan a otro navegador ni a otro dispositivo, y se pierden si se borran los datos del sitio.

**Por qué guarda Markdown y no su propio formato**: el PDF sigue saliendo de la vista de impresión de siempre (`#/imprimir/tema/:n?edicion=1`), con todas sus reglas de saltos de página. Si el apunte sin tocar vuelve del editor como un Markdown equivalente, el PDF es por fuerza el mismo; `verificar-editor.js` lo comprueba. El editor solo pesa al abrirlo: se carga aparte (unos 155 kB comprimidos).

**Descargar Word** genera un `.docx` en el propio navegador, con la librería `docx` (que solo se descarga al pulsar el botón, unos 117 kB comprimidos), a partir del MISMO Markdown que el PDF: con las mismas ediciones y opciones. Los títulos llevan los estilos de Word (el `##` del apunte es «Título 1», el `###` «Título 2»…), así que salen en el panel de navegación y sirven para un índice automático; las tablas son tablas de verdad, con la cabecera repetida en cada página y ninguna fila partida; las reglas de saltos de página de la hoja de impresión van como «conservar con el siguiente» y «conservar líneas juntas» (títulos, entradas que acaban en «:», párrafo que presenta una lista o una tabla, primeras filas de cada tabla, primer elemento de cada lista); y las figuras se dibujan con los mismos componentes que en la app y se insertan como PNG a tres veces su tamaño, con su pie. En Word los saltos los calcula Word al abrir el documento: lleva las mismas intenciones, pero decide él. Lo hace `app/src/editor/word.tsx`.

`app/src/editor/markdown.ts` hace la ida y la vuelta a través de mdast, el mismo árbol que usa react-markdown; `extensiones.tsx` define qué se puede escribir (nada que no pueda volver a Markdown: ni subrayado ni colores); `almacen.ts`, lo que se guarda.

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

`verificar-figuras.js` — **142 controles** sobre los esquemas del catálogo. Dos son genéricos y valen para cualquier figura futura: que ninguna se encoja por debajo de su tamaño natural y que **ningún rótulo se salga de su lienzo**. Los otros ciento cuarenta afirman algo comprobable sobre la geometría: que el monocromador va *después* del atomizador en absorción atómica y *antes* de la cubeta en UV-visible; que el programa del horno sube secado < calcinación < atomización y que **el pico de absorbancia cae dentro de la atomización**; que cada temperatura rotula su propio escalón; que la línea atómica es al menos 8 veces más estrecha que la banda molecular **y de la misma altura**, para que lo que se lea sea anchura y no intensidad; que el cátodo de la lámpara está **hueco de verdad** (`isPointInFill`: la cavidad vacía y la pared maciza) y que el haz sale por la ventana; que la curva de Beer arranca pegada a la ideal y se va **siempre por debajo**; que el máximo de la primera derivada y el corte de la segunda caen en el mismo punto de equivalencia; que la antorcha tiene tres tubos concéntricos con la muestra por el central y la zona de medida detrás de la bobina; que las etapas del ICP-MS van en orden y **la presión cae** a lo largo del camino; que el detector de nefelometría mira **a 90°** y el de turbidimetría **en línea**, y que el haz sale de la cubeta atenuado; que en el refractómetro el rayo **se acerca a la normal** y la línea claro/oscuro cae **en la cruz del retículo**; que en el polarímetro el plano **solo gira en el tubo** y el analizador va girado el mismo ángulo; y, en los dos esquemas de cromatografía, que el tiempo muerto va **antes** que los dos picos con cada marca sobre su propia cima, que el **supresor va entre la columna y el detector**, y que las etapas del cromatógrafo iónico van en orden; y, en los dos de cromatografía de gases, que **la columna va dentro del horno** y el inyector y el detector fuera, que las etapas van en orden, y que **el gas de purga entra por debajo del nivel del agua** mientras que **la aguja del espacio de cabeza se queda por encima** —que es justo lo que distingue las dos técnicas—; y, en los dos de cromatografía de líquidos, que **el orden de elución se invierte** entre fase normal y fase inversa, que el gradiente **sube** mientras la isocrática se queda plana, y que por eso **el último pico sale más estrecho** en el gradiente; y, en los dos del agua de consumo, que la curva de cloración **sube, baja hasta un mínimo y vuelve a subir** con la marca del punto de ruptura **puesta en ese mínimo calculado** y el cloro libre rotulado **después** de él, y que en la valoración de la alcalinidad **las dos marcas caen encima de la curva** a las alturas de pH 8,3 y 4,5 —y en ese orden— mientras **el pH solo baja**; y, en los dos de aguas residuales, que la curva de la DBO **solo sube** —el oxígeno consumido no se devuelve— con la **DQO por encima de la DBO última** y esta por encima de la DBO₅ y la marca de los cinco días **cayendo sobre la curva**, y que en el árbol de los sólidos **los suspendidos y los disueltos cuelgan los dos del total y a la misma altura** mientras **se calcina más caliente de lo que se seca**, leyendo las dos temperaturas del propio dibujo; y, en los dos del tema 35, que el corchete del **nitrógeno Kjeldahl abarca exactamente el orgánico y el amoniacal y no llega al nitrito** mientras el del **total cubre los cuatro tramos**, y que las **tres series de la NCA suben con la dureza** sin que ninguna baje, con el **zinc por encima del cobre y el cobre por encima del cadmio a cualquier dureza**; y, en los dos del tema 36, que el **nivel del agua del envase microbiológico queda por debajo de su boca mientras el fisicoquímico la alcanza** y que el **neutralizante está dentro del primero y fuera del segundo**, y que **los tres objetivos del muestreo en grifo van en orden** con la **marca del RD 3/2023 sobre el panel b)** y la **alcachofa puesta solo en el c)**; y, en los dos del tema 37, que **cada curva de corte cruza el 50 % exactamente en el diámetro que dice su rótulo** —reconstruyendo la escala logarítmica a partir de las propias marcas del eje— y que **ninguna de las dos baja**, y que en la cadena de captación el **cabezal va antes del filtro y la bomba después** mientras las **dos ramas cuelgan del filtro con la gravimetría numerada antes que la digestión**; y, en los tres del tema 38, que **cada diana es lo que dice su rótulo** —el sesgo medido como la distancia de la media de los impactos al centro y la precisión como su dispersión— con **el mismo sesgo en cada fila y la misma dispersión en cada columna**, que **uc es la hipotenusa de u(Rw) y u(sesgo)**, con ángulo recto y √(a² + b²) y no a + b, y que **las cifras escritas cuadran con las barras y con U = 2·uc**, y que **el LC está a 10/3 del LD sobre la escala del eje** con **el intervalo de trabajo arrancando en el LC** y **acabando justo donde la curva se aparta de la recta más de la tolerancia que el propio dibujo escribe**; y, en los tres del tema 39, que en el gráfico de control **el aviso está a ±2s y la acción a ±3s, simétricos**, y que **los puntos marcados fuera de control son exactamente los que señalan las dos reglas del Nordtest** aplicadas a los puntos dibujados, que **la recta dibujada es el ajuste por mínimos cuadrados de los puntos** con **el R² escrito igual al calculado** y **cada residuo del tamaño y el signo de la distancia de su punto a la recta**, y que en la cadena de trazabilidad **la incertidumbre crece eslabón a eslabón** y **cada flecha une un eslabón con el siguiente**; y, en los dos del tema 40, que **todas las flechas de «acredita» salen de ENAC y llegan a organismos de evaluación de la conformidad** mientras **la de «certifica» va de la certificadora a la empresa, sin ninguna flecha entre ENAC y la empresa**, y que en el ciclo de acreditación **el primero dura 4 años y el siguiente 5, con una reevaluación en cada uno**, y **el primer seguimiento cae antes de 12 meses sin ningún hueco de más de 18 meses en el primer ciclo ni de 24 en el siguiente**; y, en los dos del tema 2, que en la estructura del II Plan de Igualdad **cada línea dibuja tantos objetivos como dice su cifra**, con **cuatro ejes de 4, 3, 2 y 3 líneas cuyos totales suman sus cifras y 21 objetivos en total**, y que en el circuito del protocolo frente al acoso **la denuncia entra por la Asesoría Confidencial y de ella salen las tres vías** (inadmisión, informal y formal), mientras **el informal sin acuerdo pasa al Comité y solo el Comité llega a Relaciones Laborales**; y, en los dos del tema 3, que **el Justicia rinde cuentas ante las Cortes, que son quienes lo eligen**, que **al Presidente lo eligen las Cortes y lo nombra el Rey** y él nombra a los consejeros, y que en el cuadro de competencias **cada celda tiene el color de quien ejerce la función** —todo Aragón en las exclusivas, desarrollo y ejecución en las compartidas, solo la ejecución en las ejecutivas— con **las columnas en su orden y bajo su artículo (71, 75 y 77)**; y, en los dos del tema 4, que **cada plazo del procedimiento está dibujado en su intervalo legal** sobre una escala de días hábiles reconstruida con las marcas del eje —audiencia de 10 a 15, prueba de 10 a 30, información pública desde 20— con **la cifra escrita de cada fila diciendo lo mismo que su dibujo**, y que **las cinco fases van en el orden de los capítulos, cada flecha a la siguiente**, mientras **propia iniciativa, orden superior, petición razonada y denuncia cuelgan de la iniciación de oficio y ninguna de la solicitud**; y, en los dos del tema 5, que **el Alcalde y el Gobierno de Zaragoza responden ante el Pleno y nadie responde ante otro órgano**, que **el Alcalde preside el Pleno y el Gobierno y es él quien nombra a los miembros del Gobierno**, y que **cada supuesto de gran población arranca en su cifra legal** —250.000, 175.000 las capitales de provincia, sin mínimo y 75.000— sobre una escala de habitantes reconstruida con las marcas del eje, con **su cifra escrita diciendo lo mismo que su barra**, **solo c) y d) pintados como necesitados de la Asamblea Legislativa** y **la línea de Zaragoza por encima de los umbrales de a) y b)**; y, en los dos del tema 6, que **los ocho recursos del art. 2.1 van en el orden de sus letras, cada uno con su rama**, que **de los tributos propios cuelgan las tasas, las contribuciones especiales y los impuestos, y no los precios públicos**, y que entre los impuestos **el IBI, el IAE y el IVTM están pintados como obligatorios y el ICIO y el IIVTNU como potestativos**, con **el ICIO como único indirecto**; y, en los dos del tema 7, que **las cuatro clases del art. 8.2 van en su orden y cada una con su rama, mientras el personal directivo queda aparte, sin ninguna**, que **solo el personal laboral se vincula por contrato** y la llave de los funcionarios **abarca carrera e interinos y nada más**, y que **cada barra de prescripción acaba en su plazo legal** —faltas a 3 años, 2 años y 6 meses; sanciones a 3, 2 y 1— sobre una escala de meses reconstruida con las marcas del eje, **con su cifra escrita diciendo lo mismo que su barra**; y, en los dos del tema 8, que **la escala General lleva sus cinco subescalas en el orden del art. 167.2 y la habilitación nacional sus tres**, cada una con su rama, que **los agentes forestales cuelgan de Servicios Especiales y los técnicos auxiliares —con la marca de nuestra plaza— de la Técnica de Administración Especial**, y que **cada umbral de prevención está en su cifra legal** —el empresario hasta 10 trabajadores (25 con un solo centro), representantes desde 6, Comité desde 50, servicio propio con más de 500 (250 con anexo I)— **sobre una escala logarítmica reconstruida con las marcas del eje**, con su cifra escrita diciendo lo mismo que sus tramos; y, en los dos del tema 9, que en el cuadro de los grupos de riesgo **la propagación crece del grupo 2 al 4 y solo el 4 carece, en general, de profilaxis o tratamiento**, con **las filas del 1 al 4 y cada grupo exigiendo al menos su mismo nivel de contención**, y que la cadena de transmisión lleva **reservorio, salida, mecanismo, vía de entrada y huésped en orden, cada eslabón unido al siguiente**, con **exactamente las cinco vías de entrada de la guía del INSST dentro de su eslabón**; y, en los dos del tema 10, que **el aire del local entra por la abertura frontal en las cabinas de clase I y II y no en la III, estanca y con guantes**, que **solo la clase II baña la zona de trabajo con flujo descendente**, que **el aire sale por un HEPA en la I y la II y por dos en serie en la III** y **el que entra solo se filtra en la II y la III**, y que en el microscopio **la luz sube de la lámpara al ojo por el diafragma de campo, el condensador, la preparación, el objetivo y el ocular, en ese orden**, con **el aceite entre el objetivo y la preparación**, mientras **el aumento total escrito es el producto del ocular por el objetivo**, el útil **500-1000 veces la AN** y **la resolución 0,61·λ/AN, calculada con las cifras del propio dibujo**; y, en los dos del tema 11, que **las franjas de resistencia van, de arriba abajo, esporas y quistes, micobacterias y virus sin envoltura, hongos, y bacterias vegetativas y virus con envoltura**, cada una **frente a su método** (esterilización, nivel alto, medio y bajo) y con **los agentes de la guía del INSST en su caja**, y que **cada binomio del autoclave y del horno está en su temperatura y su tiempo de contacto** —115/30, 121/15, 126/10 y 134/3; 160/120, 170/60 y 180/30— **sobre una escala de tiempo logarítmica reconstruida con las marcas del eje**, con **su rótulo diciendo lo mismo que su punto**; y, en los dos del tema 12, que en la siembra por agotamiento **los cuatro cuadrantes van en orden de giro y cada estría arranca en el cuadrante anterior y sigue en el suyo**, leyendo el cuadrante de cada punto por su ángulo respecto del centro de la placa, que **las colonias disminuyen de un cuadrante al siguiente y en el último quedan aisladas**, y que en la siembra **en profundidad las colonias crecen dentro del agar y en superficie todas encima de él**, con **1 ml y agar a 45 °C en profundidad y 0,1 ml sobre agar sólido en superficie**; y, en los dos del tema 13, que en el banco de diluciones **cada tubo recibe 1 ml del recipiente anterior sobre 9 ml de diluyente** —leyendo de dónde sale y dónde cae cada flecha— con **la dilución rotulada bajo su tubo y multiplicada por diez de uno al siguiente**, que **solo se marcan como contables las placas de 10 a 300 colonias** y **la media ponderada escrita usa esas dos placas y la primera de ellas**, con **el resultado recalculado y redondeado a dos cifras significativas**, y que en la bandeja de NMP **hay 51 pocillos y cada halo de fluorescencia cae en un pocillo amarillo**, con **las cuentas escritas iguales a las del dibujo**, **la tabla igual a la de IDEXX** y **cada NMP leído con los pocillos de su grupo, sin sumar los fluorescentes a los amarillos**; y, en los dos del tema 14, que en el Gram **los cuatro reactivos van en su orden** —colorante primario, mordiente, decolorante y contraste— y que **la grampositiva, de pared más gruesa, queda violeta en los cuatro pasos mientras la gramnegativa pierde el violeta al decolorar y acaba rosa**, asignando cada célula al paso que tiene encima, y que en la gota pendiente **la gota cuelga de la cara inferior del cubre sin llegar al fondo de la excavación**, calculado sobre la propia curva, **con la vaselina uniendo cubre y porta fuera de ella**, mientras **entre porta y cubre la muestra es una película pegada a los dos vidrios**; y, en los dos del tema 15, que **del origen común salen exactamente tres ramas, a *Bacteria*, *Archaea* y *Eucarya***, con **cada grupo colocado bajo su dominio** —leyendo la columna en que cae cada rótulo— y **virus y priones fuera del árbol**, mientras **la llave de procariotas abarca *Bacteria* y *Archaea* y no *Eucarya***, y que en la estructura de los virus **el ácido nucleico queda dentro de la cápside en los dos**, comprobado punto a punto con `isPointInFill`, **solo el envuelto tiene la cápside dentro de una envoltura** y **todas sus espículas arrancan en la envoltura y apuntan hacia fuera**; y, en los dos del tema 16, que en la PCR **cada meseta está a la temperatura de su fase —95, 50 y 72 °C— leída sobre la escala reconstruida con las marcas del eje**, con **las tres fases en orden en cada ciclo** y **cada rótulo sobre su meseta**, y que en el árbol de bacilos gramnegativos **cada arista sale de la caja de su padre y llega a la de su hijo** mientras **el camino de pruebas hasta cada hoja es el perfil de esa bacteria**: *Pseudomonas* oxidasa positiva, *Proteus* ureasa positiva, *E. coli* ureasa negativa e indol positivo y *Salmonella* ureasa e indol negativos; y, en los dos del tema 17, que en el control semicuantitativo **cada placa tiene cuatro cuartos con cuatro estrías dentro de su cuarto** y **la puntuación escrita es el número de estrías que tienen colonias encima**, contado en el propio dibujo, con **el veredicto siguiendo el mínimo de 8 de 16**, y que en la recuperación del medio selectivo **cada barra mide lo que dice su recuento** sobre la escala reconstruida con las marcas del eje, **la línea del 50 % cae a la mitad de la barra del no selectivo** y **cada lote lleva el porcentaje y el veredicto que salen de las alturas**: apto desde el 50 %, se desecha por debajo; y, en los dos del tema 18, que en la membrana de agar cromogénico **cada color de colonia cuenta lo que dice la leyenda** —clasificando cada colonia por su relleno, comparado con la muestra de la leyenda— con ***E. coli* igual a las azul-violeta** y **los coliformes totales igual a rosas más azul-violeta por 100 mL, sin las incoloras**, y que en el TSC-MUP **el panel de luz UV es el mismo filtro que el de luz visible**, colonia a colonia, **cada halo fluorescente rodea una colonia** y **el recuento de *C. perfringens* son solo las colonias con halo**; y, en los dos del tema 19, que en el plan de tres clases **cada lote lleva el veredicto que dan sus cinco valores con n = 5, c = 2, m = 50 y M = 500 ufc/g** —leyendo cada valor sobre la escala logarítmica reconstruida con las marcas del eje— mientras **las líneas m y M están en 50 y 500 y las zonas cambian justo en ellas**, y que en el NMP de moluscos **cada cifra del código es el número de tubos amarillos cuya placa de TBX, justo debajo, tiene colonias azules**, con **el NMP escrito igual al de la tabla 5 × 3 para ese código** y su valoración frente a m = 230 y M = 700. Desde el tema 17, **los controles de cada tema van en su propio bloque `{ ... }`**, para que sus funciones auxiliares no choquen con las de otro tema.

El control del cromatograma merece una línea aparte, porque es de otra clase: el dibujo **escribe** un número —la resolución— que se deduce de su propia geometría, así que puede demostrarlo. El control **recalcula Rs = 2·(tR_B − tR_A)/(w_A + w_B)** sobre los tiempos y las anchuras pintados y exige que coincida con lo escrito al pie. Un cromatograma con los picos bonitos y la resolución inventada no da ningún error por sí solo, que es justo el fallo silencioso que persigue esta batería.

Los esquemas ópticos del tema 28 se apoyan además en atributos `data-pieza` dentro del SVG. Los dibujos antiguos se localizan por color y por forma, que basta cuando la pieza es única; en éstos no lo es —hay dos detectores idénticos y dos haces del mismo rojo— y **lo que el control afirma es justo cuál es cuál**, así que el dibujo lo declara en vez de dejarlo a una heurística. Es la misma idea que el `data-listo` de la vista de impresión.

`verificar-repaso.js` — **8 controles** por tema, respondiendo todas las preguntas: 3 opciones en el test y 4 en los supuestos; que **la opción que marca la app sea la del dato** y que el veredicto concuerde; que ninguna letra se lleve más del 45 % de las respuestas; que «Solo núcleo» reduzca de verdad y solo deje preguntas etiquetadas; que las figuras del apunte se pinten con caja de contenido no nula; que **el dibujo de una tarjeta no lleve escrita la respuesta de su reverso**; y que la figura que hace de pregunta lleve rótulo neutro y el nombre completo aparezca al revelar.

El control del dibujo delator es automático, sin listas escritas a mano: toma los fragmentos **en negrita** del reverso —que es lo que la tarjeta pide recordar—, descarta los que ya están en el anverso y comprueba que ninguno aparezca escrito dentro del SVG.

Los controles que no aplican a un tema (un tema de la parte común no tiene supuestos) salen como `·`, no como aprobados.

`verificar-pdf.js` (`npm run verificar:pdf -- 7 39`) — **saltos de página del PDF de apuntes**. Comprueba que ningún apartado arranque huérfano al pie de una página: un título solo, una entrada que acaba en «:» separada de lo que presenta, una tabla con la cabecera y una fila baja (de uno o dos renglones), o una lista o un párrafo con un solo renglón detrás de su título. El navegador no dice en qué página cae cada cosa, pero el PDF sí: Chrome lo genera **etiquetado** (H2, P, Table, TR, L…) y pdf.js lee el árbol página a página. No siembra nada en el DOM, porque cualquier marca movía los saltos que se querían medir, e imprime con las mismas opciones que la exportación (`OPCIONES_PDF` en `comun.js`). Con `--sin-reglas` apaga las reglas de la hoja de impresión y exige que aparezcan huérfanos: sobre los 28 temas escritos aparecen 135; con las reglas, ninguno.

El defecto contrario también se mide: un **salto innecesario**, cuando una regla empuja de más y la página acaba con un hueco en blanco donde cabía lo que abre la siguiente (todo lo que hay antes de su primer título, o el arranque mínimo de su primer bloque: dos renglones, dos elementos de lista, o la cabecera con una o dos filas). Así se encontraron, el 04/10/2026, cadenas título-párrafo-título pegadas que partían un párrafo dejando 277 pt en blanco (tema 29, «b) Capa delgada»), un recuadro de fuentes que saltaba entero y dejaba una página con 6 renglones (tema 28) y elementos de lista de varios párrafos que no se podían partir (tema 23). Con `--reglas-viejas` vuelve a las reglas de antes de ese arreglo y exige saltos innecesarios: en los 40 temas aparecen 29; con las reglas de ahora, ninguno, y `--sin-reglas` sigue sacando 166 huérfanos.

`verificar-editor.js` (`npm run verificar:editor`) — **el editor de descarga**. En cada tema abre el apunte en el editor sin tocar nada y exige que lo que manda a imprimir dé **el mismo HTML impreso y el mismo PDF** (renglón a renglón, con su posición) que el botón de siempre; con `--referencia <url>` el original se toma de otra web, por ejemplo la publicada antes de un cambio, para comparar con el PDF de ese día. También exige que abrir sin tocar no guarde nada. En el tema 20 prueba las funciones: editar (se guarda, sobrevive a recargar, sale en la descarga y **no** en la app), volver al original, mover un bloque, el salto de página (lo de detrás abre página con el salto y no sin él) y las cuatro opciones, medidas en la hoja impresa o en el PDF. Con `--sabotajes` estropea lo que sale del editor (una letra, una lista suelta que sale apretada, una figura perdida) y exige que la ida y vuelta lo vea; un sabotaje que al releerlo no cambia nada se señala como tal en lugar de pasar por «no detectado». Única licencia: una cursiva dentro de otra cursiva cuenta como una, porque el editor no puede anidarlas y se ven igual (tema 36); el PDF, que se compara exacto, lo confirma.

`verificar-word.js` (`npm run verificar:word`) — **la exportación a Word**. En cada tema pulsa «Descargar Word» en el editor sin tocar nada, abre el `.docx` (un ZIP con XML) y lo compara con `temas/tema-NN.md` leído con el mismo parser que la app: que esté bien hecho (piezas obligatorias, XML legible, cada imagen con su fichero); los mismos títulos, en orden y con su nivel; las mismas tablas, con sus filas, columnas y cabecera, la cabecera repetida y ninguna fila partible; una imagen por figura y todas con dibujo (se mide la tinta: una imagen en blanco no da ningún error); todo el texto entero y en orden; «conservar con el siguiente» en títulos, entradas y cabeceras; y cada elemento de lista con su viñeta o número, siguiendo el camino párrafo → `w:num` → `w:abstractNum` → nivel. En el tema 20 comprueba además que una edición, un salto de página y las cuatro opciones llegan al Word. Con `--sabotajes` estropea el `.docx` de ocho maneras (un título, la cabecera repetida, una figura en blanco, un párrafo, el «conservar» de una entrada, el fichero de una imagen, la viñeta de un elemento, una numeración que no existe) y exige que salte su control y ninguno más. No hay Word en el equipo: la comprobación es de estructura. Para mirarlo se pintó con `docx-preview`, que no sigue el camino de la numeración y no dibuja las viñetas; Word sí lo sigue, y el control 7 comprueba que el camino está entero.

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
