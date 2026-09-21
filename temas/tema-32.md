---
tema: 32
titulo: "Cromatografía de líquidos: instrumentación. Utilización de la cromatografía de líquidos en análisis de agua."
parte: Parte segunda
estado: aprobado
verificado: 2026-09-21
fuentes:
  - "CEM, «Procedimiento QU-004 para la calibración de equipos de cromatografía de líquidos de alta resolución (HPLC)», edición digital 1, Centro Español de Metrología (Ministerio de Industria, Turismo y Comercio), 48 págs. LEÍDO ÍNTEGRO. De él salen los SEIS componentes del cromatógrafo de líquidos y los CUATRO tipos de cromatografía líquida (4.2), las definiciones de resolución con el criterio Rs > 1,5 y de tiempo de retención (apartado 3), y toda la operativa de calibración por interpolación entre dos puntos (4.4 y 5.1 a 5.3). — https://www.cem.es/sites/default/files/qu-004_digital_0.pdf"
  - "UNE-EN ISO 17993:2004, Calidad del agua. Determinación de 15 hidrocarburos aromáticos policíclicos (PAH) en agua mediante HPLC con detección por fluorescencia tras extracción líquido-líquido (ISO 17993:2002). EN VIGOR, edición de 03/09/2004, versión confirmada el 21/05/2008. CTN 77/SC 1 Agua. — https://www.une.org/encuentra-tu-norma/busca-tu-norma/norma?c=N0031903"
  - "UNE-EN ISO 11369:1998, Calidad del agua. Determinación de ciertos agentes para el tratamiento de las plantas. Método por cromatografía líquida de alta resolución (HPLC) con detección UV tras extracción sólido-líquido (ISO 11369:1997). EN VIGOR, edición de 30/06/1998, versión confirmada el 21/05/2008. — https://www.une.org/encuentra-tu-norma/busca-tu-norma/norma?c=N0014080"
  - "ISO, catálogo público del comité ISO/TC 147/SC 2 «Physical, chemical and biochemical methods»: código, título y ESTADO de las normas de cromatografía de líquidos en agua (17993, 11369, 7981-1 y -2, 20179, 22104, 21675, 25101, 16308, 21458, 21676, 13646, 22478, 19620, 24384 y 21253-1). Consultado el 21/09/2026. — https://www.iso.org/committee/52846.html"
  - "Real Decreto 3/2023, de 10 de enero (BOE-A-2023-628), texto consolidado. LEÍDO LITERALMENTE: anexo I parte B, tabla 2 (benzo(a)pireno, bisfenol A, microcistina-LR, plaguicidas, ∑4 HPA, ∑20 PFAS) con sus notas 5, 8, 9, 13, 14, 15 y 16; anexo III parte D, tabla 15; anexo IV completo (lista de observación nacional, tabla 16); y la disposición transitoria sobre el calendario de los PFAS. — https://www.boe.es/buscar/act.php?id=BOE-A-2023-628"
  - "Real Decreto 817/2015, de 11 de septiembre (BOE-A-2015-9806), texto consolidado, anexo III, apartado C.1. Leído literalmente. — https://www.boe.es/buscar/act.php?id=BOE-A-2015-9806"
  - "LibreTexts en español, Análisis Instrumental (LibreTextos), cap. 28 «Cromatografía líquida de alto rendimiento»: §28.1 (alcance y los cuatro modos), §28.2 (ensanchamiento extracolumna), §28.3 (columnas analíticas, capilares y monolíticas, columnas de guarda, bombas, inyector de bucle y todos los detectores con sus límites de detección), §28.4 (fase normal y fase inversa, fases unidas, índice de polaridad, elución isocrática y en gradiente) y §28.7 (exclusión por tamaño). LEÍDOS. — https://espanol.libretexts.org/Bookshelves/Quimica/Qu%C3%ADmica_Anal%C3%ADtica/An%C3%A1lisis_Instrumental_(LibreTextos)"
  - "ExamenesAnteriores/ANALISIS.md y los seis cuestionarios de esa carpeta, extraídos a texto y releídos el 21/09/2026. De ahí salen las preguntas del primer ejercicio, las dos respuestas documentadas del benzo(a)pireno y los siete distractores."
---

> **ESTE TEMA TIENE EL PATRÓN INVERSO AL 30 Y AL 31: POCOS ACIERTOS Y MUCHOS DISTRACTORES.** La cromatografía líquida es **la opción falsa favorita del examinador**: aparece siete veces como respuesta equivocada y solo dos como correcta. Saber **cuándo NO es** vale aquí tanto como saber cuándo sí.
>
> **Lo que SÍ es cromatografía de líquidos:**
>
> | Qué piden | Dónde | Respuesta |
> | --- | --- | --- |
> | **Benzo(a)pireno** | **1233 C2 #2** | **Cromatografía de líquidos con detector de FLUORESCENCIA** |
> | **Benzo(a)pireno** | **1322 C2 #24** | **Cromatografía líquida y detección por FLUORESCENCIA** |
> | Identificar un microcontaminante orgánico | 1233 #5, 1246 #30 | Cromatografía de gases **o de líquidos** con detector de masas |
>
> **Y lo que NO lo es, aunque se ofrezca:**
>
> | Qué piden | Dónde | La opción falsa | Lo correcto |
> | --- | --- | --- | --- |
> | Plomo y cadmio | 1233 C2 #1, 1246 C2 #1 | «Cromatografía HPLC» | **ICP-MS** (tema 27) |
> | Turbidez | 1246 C2 #2 | «CL con detector de fluorescencia» | **Turbidimetría** (tema 28) |
> | DQO | 1233 C2 #7, 1246 C2 #7 | «CL con detector de fluorescencia» | **Digestión ácida y volumetría** (tema 34) |
> | Cd, Al, Sb y Cr | 1322 C2 #25 | «Cromatografía líquida» | **ICP-MS** |
> | Nitrógeno total | 1322 C2 #35 | «Cromatografía líquida» | **Combustión oxidativa / quimioluminiscencia** (tema 35) |
> | Grasas | 1322 C2 #37 | «Cromatografía líquida» | **Extracción con hexano y pesada** (tema 35) |
> | Cloruros | 1322 C2 #39 | «Cromatografía líquida con detector de diodos» | **Cromatografía iónica de aniones** (tema 30) |
> | Metales (doce) | 1322 C2 #40 | «HPLC para su separación» | **Digestión ácida e ICP-MS** |
>
> **La regla que resuelve las nueve: la cromatografía de líquidos es para compuestos ORGÁNICOS que NO son volátiles o que no aguantan el calor.** Ni metales, ni iones inorgánicos, ni parámetros globales.

> **DOS PREGUNTAS DEL PRIMER EJERCICIO QUE SON LITERALMENTE «EN HPLC», Y DÓNDE ESTÁN.** El **ANALISIS.md** las asigna a este tema, y el enunciado del examen dice «cromatografía líquida (HPLC)»:
>
> | Qué se pregunta | Dónde | Respuesta |
> | --- | --- | --- |
> | Qué va **antes de la columna analítica** para alargar su vida | **1246 #17**, **1322 #34** | Una **PRECOLUMNA** |
> | Para qué compuestos es el **detector de conductividad** | **1246 #18**, **1322 #35** | **Compuestos IÓNICOS** |
>
> **Las dos se introdujeron en el tema 30**, porque la cromatografía iónica **es** cromatografía de líquidos y el detector de conductividad es justamente el suyo. **Aquí tienen su casa**: se desarrollan dentro de la instrumentación del HPLC, que es lo que este tema pide. No es duplicar: allí entraron como piezas del cromatógrafo iónico y aquí entran como piezas del cromatógrafo de líquidos en general.

> **REPARTO CON EL 30 Y EL 31, TAL COMO QUEDÓ DECIDIDO.** Los **fundamentos generales** —fases, tR, tM, factor de retención, selectividad, platos teóricos, van Deemter, resolución, tipos de cromatografía— **viven en el tema 30** y **aquí no se repiten**: se recuerdan en cuatro líneas y se remite.
>
> | Contenido | Dónde |
> | --- | --- |
> | Fundamentos y tipos de cromatografía; **cromatografía iónica completa** | **Tema 30** |
> | Lo propio del **GAS**: gas portador, split/splitless, columnas capilares, horno y rampa, FID/ECD/TCD/MS, purga y trampa, espacio de cabeza. **THM, COV y plaguicidas por CG** | **Tema 31** |
> | **Lo propio del HPLC: bomba de alta presión, inyector de bucle, precolumna, columnas de sílice, FASE NORMAL E INVERSA, elución en GRADIENTE, detectores UV/DAD, fluorescencia, electroquímicos, índice de refracción y MS.** Y su uso en agua: **HAP y benzo(a)pireno, plaguicidas polares, microcistinas, PFAS, fármacos** | **Aquí** |

> **AVISO DE FUENTES.** El **QU-004 del Centro Español de Metrología** es **exactamente** de cromatógrafos de líquidos, es gratuito y lo he leído entero: ya sostuvo el tema 30 y aquí vuelve, esta vez para lo que le es propio. De las **normas UNE/ISO no he leído el articulado** —son de pago—: he verificado **código, título oficial en español, año, equivalencia y estado** en el buscador gratuito de UNE y en el catálogo público del ISO. El detalle instrumental fino —tamaños de partícula, límites de detección de cada detector, química de las fases unidas— es **doctrina de libro**, tomada de LibreTexts.

## 1. Encuadre

La cromatografía de líquidos es **la técnica de los compuestos orgánicos que la cromatografía de gases no puede tocar**: los **no volátiles**, los **termolábiles** y los de **masa molecular alta**. Ésa es la frontera entre el tema 31 y éste, y de ella salen casi todas las respuestas.

Y hay una diferencia de fondo que explica su riqueza. LibreTexts lo dice bien: en cromatografía de gases **la fase móvil solo transporta**, y la separación la deciden el punto de ebullición y la fase estacionaria. En cromatografía de líquidos, en cambio, **la separación depende de cómo se reparte el soluto entre las DOS fases**, y las dos se pueden cambiar. Por eso el HPLC no es una técnica, sino **una familia**.

| Qué regula | Norma o referencia | Lógica |
| --- | --- | --- |
| **Componentes del equipo, tipos de cromatografía líquida y calibración** | **CEM, procedimiento QU-004** | **Documento oficial español**, no norma de obligado cumplimiento |
| Instrumentación de detalle y teoría | LibreTexts, *Análisis Instrumental*, cap. 28 | Doctrina de libro |
| **15 HAP por HPLC con detección de fluorescencia** | **UNE-EN ISO 17993:2004** | Ensayo normalizado |
| **Plaguicidas por HPLC con detección UV** | **UNE-EN ISO 11369:1998** | Ensayo normalizado |
| **Microcistinas** | **ISO 20179:2005** (HPLC-UV) y **ISO 22104:2021** (LC-MS/MS) | Ensayo normalizado |
| **PFAS** | **ISO 21675:2019** (LC-MS/MS) e **ISO 25101:2009** (PFOS y PFOA) | Ensayo normalizado |
| Valores paramétricos y lista de observación | **RD 3/2023**, anexos I, III y IV | Norma con rango de ley |
| Qué se le exige al método (superficiales) | **RD 817/2015**, anexo III, C.1 | Norma con rango de ley |

## 2. Desarrollo

### 2.1. Lo que hay que traer del tema 30, en cuatro líneas

La cromatografía **separa** repartiendo los componentes entre una **fase móvil** y una **fase estacionaria**. **La columna separa**, el detector detecta y el integrador cuantifica. El **tiempo de retención identifica** y **el área del pico cuantifica**. Y la calidad de la separación se mide con la **resolución**, **Rs = 2·[tR(B) − tR(A)] / (wA + wB)**, que el CEM exige **superior a 1,5**.

**Todo lo demás —factor de retención, selectividad, platos teóricos, van Deemter— es del tema 30.**

### 2.2. Los cuatro modos y los seis componentes

**Los cuatro tipos de cromatografía de líquidos, en la lista del CEM (QU-004, 4.2):**

| Modo | En qué se basa | Dónde se desarrolla |
| --- | --- | --- |
| **Cromatografía de REPARTO** | El reparto del soluto entre la fase móvil y una película líquida unida al soporte. **Es, con diferencia, la más usada** | **Aquí**, §2.5 |
| **Cromatografía de ADSORCIÓN** (líquido-sólido) | La adsorción del soluto sobre el propio relleno sólido | Aquí, de pasada |
| **Cromatografía IÓNICA** | El intercambio iónico con una resina de grupos fijos | **Tema 30** |
| **Cromatografía de EXCLUSIÓN POR TAMAÑOS** o en geles | El tamaño del soluto: **los grandes salen antes**, porque no entran en el poro | Tema 30, §2.5 |

Y el CEM añade la regla de elección: *«se elige cada tipo a utilizar en función de las **características químicas del analito** a determinar»*.

**Los seis componentes principales de un cromatógrafo de líquidos (QU-004, 4.2):**

1. **Líquidos portadores y sistemas para el tratamiento de los disolventes.**
2. **Sistemas de bombeo.**
3. **Sistema de inyección de la muestra.**
4. **Columnas.**
5. **Detectores.**
6. **Sistema de procesamiento de señal y tratamiento de datos.**

**Son SEIS, no cinco como en gases.** La diferencia es el primer bloque: aquí la fase móvil hay que **desgasificarla, filtrarla y mezclarla**, y eso es un subsistema entero. En gases sale de una botella.

![Cromatógrafo iónico: la misma cadena que un HPLC, con el supresor de más](esquema:cromatografo-ionico)

**Ese dibujo es del tema 30, y viene a cuento:** el cromatógrafo iónico **ES un cromatógrafo de líquidos**. **Quítale el supresor y cámbiale el detector de conductividad por uno de UV o de fluorescencia, y tienes el equipo de este tema.** Todo lo demás —depósito, bomba, inyector de bucle, precolumna, columna, registro— es idéntico.

### 2.3. Bomba, disolventes e inyección

**a) Tratamiento de los disolventes.** Antes de usar la fase móvil hay que:

- **Desgasificarla**, con **bomba de vacío** o **burbujeando helio**, que tiene baja solubilidad. Motivo: la presión cae **de varios cientos de atmósferas a la atmosférica** al salir de la columna, y **los gases disueltos (N₂, O₂) se liberan como burbujas que interfieren en la respuesta del detector**.
- **Filtrarla**, porque las partículas **obstruyen el tubo y la columna**.

**b) La bomba.** Empujar un líquido por una columna empaquetada exige **presiones superiores a varios cientos de atmósferas**. Las bombas de pistón crean un **flujo pulsante** que mete ruido en el cromatograma, y se corrige de dos maneras:

- **Dos pistones desfasados** —bomba de trabajo y bomba equilibradora—, que además, enviando a una **cámara de mezcla**, permiten **preparar la fase móvil binaria** cambiando la velocidad relativa de las dos. **Ése es el mecanismo del gradiente.**
- Un **amortiguador de pulsos**: una cámara con fluido compresible y diafragma que mantiene el caudal mientras el pistón se retira.

También cabe una **válvula dosificadora de disolvente** delante de una sola bomba, que conecta dos o más depósitos y decide cuánto se toma de cada uno en cada ciclo.

**c) Inyector de bucle.** A esa presión **no se puede pinchar un septo** con jeringa, como en gases. Se usa una **válvula de bucle** con dos posiciones:

- **Carga:** el **bucle de muestra** queda **aislado de la fase móvil y abierto a la atmósfera**; se llena con jeringa —de capacidad varias veces mayor que el bucle— y el exceso sale por el desagüe.
- **Inyección:** la válvula gira y **la fase móvil pasa por el bucle** y arrastra su contenido a la columna.

Bucles **de 0,5 µL a 5 mL**. La ventaja es la reproducibilidad: **el volumen lo fija el bucle**, no el pulso de la mano.

**d) PRECOLUMNA (columna de guarda).** Es **pregunta literal** (1246 #17, 1322 #34), y aquí está su sitio.

**Los dos problemas que resuelve:**

1. Los solutos que **se unen irreversiblemente** a la fase estacionaria, que **degradan el rendimiento** de la columna al restar fase estacionaria disponible.
2. El **material particulado** inyectado con la muestra, que **obstruye** la columna.

**Cómo es:** el **mismo relleno y la misma fase estacionaria** que la columna analítica, pero **mucho más corta y más barata** —del orden de **7,5 mm** y **una décima parte del precio**—. **Es sacrificial: se reemplaza con regularidad.** Los distractores del examen —«microcolumna» y «termostato»— no protegen nada.

### 2.4. Las columnas

| Tipo | Cómo es | Eficiencia |
| --- | --- | --- |
| **Analítica** (la habitual) | Tubo de **acero inoxidable**, **2,1-4,6 mm** de diámetro interno y **30-300 mm** de longitud, empaquetado con **partículas porosas de sílice de 3-10 µm** | **40 000-60 000 platos/m**. Una de 25 cm con 50 000 platos/m tiene **12 500 platos** |
| **Capilar** | **Sílice fundida**, **44-200 µm** de diámetro interno y **50-250 mm** de longitud | Hasta **250 000 platos**. Usa menos disolvente y **diluye menos la muestra**, así que da **señales mayores** |
| **Monolítica** | El soporte sólido es **una sola varilla porosa** formada en un molde y recubierta de PTFE o resina | Eficiencia de capilar empaquetada **con caudales más rápidos** |

**El compromiso que hay que entender —y que es el gran límite del HPLC—** es la **contrapresión**: el empaquetamiento de partículas más pequeñas deja **espacios intersticiales más pequeños**, y

> **reducir el tamaño de partícula a la MITAD aumenta la eficiencia solo × 1,4, pero multiplica la contrapresión × 4.**

Como los tubos y racores tienen límite de presión, más contrapresión obliga a **bajar el caudal** y, por tanto, a **alargar el análisis**. La columna monolítica es precisamente la salida a ese callejón.

### 2.5. Fase normal y fase inversa

![Fase normal frente a fase inversa: el orden de elución se invierte](esquema:fase-normal-vs-inversa)

**Es el concepto central del tema**, y se resume en una línea: **el orden de elución se invierte**.

| | **Fase NORMAL** | **FASE INVERSA** |
| --- | --- | --- |
| **Fase estacionaria** | **POLAR** | **NO POLAR** |
| **Fase móvil** | **NO polar** o de baja polaridad | **POLAR** |
| **Quién se retiene más** | El soluto **más POLAR**: eluye **el último** | El soluto **menos polar**: el **polar eluye el PRIMERO** |
| Ejemplos de R en el silano | **Ciano** (−C₂H₄CN), **diol**, **amino** (−C₃H₆NH₂) | **C8** (n-octilo) y **C18** (n-octadecilo) |
| Fase móvil típica | Hexano y disolventes apolares | **Disolución acuosa tamponada**, **metanol**, **acetonitrilo** |
| Cómo se alarga la retención | **BAJANDO** la polaridad de la fase móvil | **SUBIENDO** la polaridad de la fase móvil |

**Y la que se usa es la INVERSA**, con mucha diferencia: es la de los HAP, los plaguicidas y los fármacos.

**Por qué se llama «inversa» a la más común** —que desconcierta a todo el mundo— es una cuestión de **precedencia histórica**: el primer experimento de cromatografía, el de Tswett, usó **columna polar de carbonato de calcio y fase móvil apolar de éter de petróleo**. Eso se quedó con el nombre de «normal», y lo que vino después, con el de «inversa».

**Cómo se fabrica la fase estacionaria.** Es una **película líquida sobre partículas de sílice porosas**, pero, como puede ser parcialmente soluble en la fase móvil, **sangraría de la columna**. Por eso **se une covalentemente**:

- Se hace reaccionar la sílice con un **organoclorosilano Si(CH₃)₂RCl**, donde **R es el grupo que decide la polaridad**.
- Los **−SiOH que quedan sin reaccionar** se convierten con **Si(CH₃)₃Cl** en −SiOSi(CH₃)₃, para que no adsorban solutos por su cuenta. A esas columnas se las llama **«terminalmente rematadas»** (*end-capped*).

**Un límite operativo que se pregunta solo: el pH de la fase móvil debe ser INFERIOR A 7,5**, porque **el sustrato de sílice se hidroliza en disoluciones básicas**.

**El índice de polaridad (P′)** ayuda a elegir la fase móvil: valores mayores, disolventes más polares. Y mezclando dos disolventes miscibles se obtiene una polaridad intermedia, que es exactamente la **media ponderada por las fracciones de volumen**:

> **P′_AB = Φ_A · P′_A + Φ_B · P′_B**

### 2.6. Elución isocrática y elución en gradiente

![Elución isocrática frente a elución en gradiente](esquema:gradiente-elucion)

**Isocrática** es una separación con **fase móvil de composición fija**. Y tiene un problema que ya conocemos del tema 31, porque es **el mismo** que el del horno isotermo en gases:

> Una fuerza de fase móvil **apropiada para resolver los solutos que eluyen pronto** conduce a **tiempos de retención inaceptablemente largos** para los que eluyen tarde. Y optimizarla para los tardíos **deja mal separados los primeros**.

**La solución es cambiar la composición de la fase móvil a medida que avanza la separación: la ELUCIÓN EN GRADIENTE.**

**En fase inversa, que es lo habitual:** se empieza con una **fase móvil más POLAR** y se va haciendo **menos polar** —es decir, subiendo el porcentaje de disolvente orgánico fuerte, metanol o acetonitrilo—. Resultado: **los picos tardíos salen estrechos y repartidos** en vez de anchos, bajos y a destiempo.

**El paralelismo con el tema 31 conviene tenerlo en la cabeza:**

| | Cromatografía de gases | Cromatografía de líquidos |
| --- | --- | --- |
| Modo simple | **Isotermo** | **Isocrático** |
| Modo con programa | **Rampa de temperatura** | **Elución en gradiente** |
| Qué se cambia | La **temperatura del horno** | La **composición de la fase móvil** |

**Y una consecuencia instrumental:** el **detector de índice de refracción NO sirve en elución en gradiente**, a menos que los componentes de la fase móvil tengan índices de refracción idénticos —que es tanto como decir nunca—.

### 2.7. Los detectores

| Detector | Qué mide | Límite de detección | Cuándo |
| --- | --- | --- | --- |
| **UV/Visible** | **Absorbancia** del eluyente en una **celda de flujo** de **1-10 µL** y camino óptico **0,2-1 cm** | **100 pg - 1 ng** | El más popular. **La fase móvil NO puede absorber** a la longitud de onda que se quiere medir |
| **Matriz de diodos (DAD)** | Lo mismo, pero **todo el espectro a la vez** | Igual | Da un **cromatograma tridimensional**: absorbancia frente a longitud de onda **y** tiempo |
| **FLUORESCENCIA** | La emisión del analito excitado, en un espectrofluorímetro con celda de flujo | **1-10 pg** | **El más sensible de los ópticos.** Solo sirve si el analito **es fluorescente**: HAP, benzo(a)pireno |
| **Electroquímicos** | **Amperometría**, voltamperometría, culombimetría y **CONDUCTIVIDAD** | **10 pg - 1 ng** (amperométrico) | La amperometría, para lo que **se oxida o se reduce**; la **conductividad, para COMPUESTOS IÓNICOS** (tema 30) |
| **Índice de refracción** | El cambio de índice de refracción de la fase móvil | **0,1 - 1 µg** (malo) | **Casi universal**, pero poco sensible, y **NO vale en gradiente** |
| **Espectrómetro de masas** | La relación **m/z** de los iones | **0,1 - 1 ng**, hasta **1-10 pg** | El único que **identifica**. Barrido de iones totales → **universal**; iones seleccionados → **selectivo** |

**Tres cosas que se preguntan:**

1. **El detector de conductividad es el de los COMPUESTOS IÓNICOS** (1246 #18, 1322 #35). Los distractores describen a sus vecinos: «compuestos con capacidad de oxidarse o reducirse» es el **amperométrico**; «compuestos fluorescentes», el de **fluorescencia**.
2. **El benzo(a)pireno se mide con FLUORESCENCIA** (1233 C2 #2, 1322 C2 #24). Es un hidrocarburo aromático policíclico, y **los HAP son fluorescentes**: por eso la norma se llama *«HPLC con detección por fluorescencia»*.
3. **El «detector de diodos»** que aparece en 1322 C2 #39 es el **DAD**, y su gracia es que registra **todo el espectro UV en cada instante**, lo que permite **comprobar la pureza del pico**.

**Y una diferencia técnica con el GC-MS que conviene saber:** *«la interfaz entre la HPLC y el espectrómetro de masas es **técnicamente más difícil** que en un GC-MS, debido a la incompatibilidad de una fase móvil LÍQUIDA con el requerimiento de alto vacío del espectrómetro»*. Un gas entra en el vacío sin más; un líquido hay que evaporarlo y retirarlo.

### 2.8. Un problema propio del HPLC: el ensanchamiento extracolumna

En cromatografía de gases hay **poca distancia** entre el inyector y la columna, y entre la columna y el detector. En un HPLC, en cambio, **hacen falta tubos de conexión**, y en ellos **no hay fase estacionaria**: el soluto viaja **más lento junto a la pared y más rápido en el centro**, y la banda se ensancha sin que la columna tenga culpa.

**Se minimiza con tres medidas:** tubos **lo más cortos posible**, de **diámetro interno más pequeño**, y **caudales más bajos**.

Es una contribución a la altura de plato que **se suma a las tres de van Deemter** del tema 30.

### 2.9. Calibración del equipo (CEM, QU-004)

El CEM calibra el cromatógrafo de líquidos **por interpolación entre dos puntos**, y su marcha es material directamente examinable:

**Condiciones y material:**

- Se calibra **siempre en el laboratorio**, entre **18 °C y 28 °C**, sin condiciones ambientales particulares, salvo lo que diga el manual. *«Determinados detectores pueden requerir un control de las variaciones de temperatura más severas.»*
- **Pipetas y matraces aforados clase A**; **micropipetas** con repetibilidad y exactitud **de al menos el 2 %**; **balanza analítica con resolución de 0,1 mg**.
- **Disolventes de calidad cromatográfica**; si hace falta agua, **ultrapura o químicamente pura**.
- **Materiales de referencia certificados** que cubran el rango esperado, con **la relación entre las dos disoluciones no mayor de 10**, y **dentro del periodo de caducidad**.

**El proceso (5.3):** seleccionar los **parámetros instrumentales** —temperatura del inyector y de la columna, **longitud de onda del detector**, caudal bombeado, volumen de inyección—; fijar el **procesamiento de la señal** (área o altura, integración, umbral); **acondicionar con un blanco** y comprobar que **no da señal**; analizar las dos disoluciones patrón; y **comprobar el cromatograma**:

1. **Los picos aparecen en los tiempos de retención esperados.**
2. **La resolución de la columna entre picos es siempre superior a 1,5.**
3. **La forma de los picos es adecuada, sin colas ni artefactos.**
4. **La ventana de integración es la adecuada.**

### 2.10. Utilización en el análisis de agua

**a) HAP y benzo(a)pireno: la aplicación estrella.**

**UNE-EN ISO 17993:2004**, *«Determinación de **15 hidrocarburos aromáticos policíclicos (PAH)** en agua mediante **HPLC con detección por FLUORESCENCIA** tras **extracción líquido-líquido**»*. Es la norma detrás de la respuesta documentada dos veces.

Alternativa para seis HAP: **ISO 7981-2:2005** (HPLC con fluorescencia). Ojo, que la **parte 1** de esa misma norma es **cromatografía en capa fina de alta resolución**, no HPLC.

**Los valores del RD 3/2023, y aquí está la trampa:**

| Parámetro | Valor paramétrico | Incertidumbre |
| --- | --- | --- |
| **Benzo(a)pireno** | **0,010 µg/L** | **50 %** |
| **∑4 Hidrocarburos Policíclicos Aromáticos (HPA)** | **0,10 µg/L** | **40 %** |

**EL BENZO(a)PIRENO NO ESTÁ EN LA ∑4.** Tiene **valor propio**, y **diez veces más estricto** que el sumatorio. La ∑4 la forman **benzo(b)fluoranteno, benzo(ghi)perileno, benzo(k)fluoranteno e indeno(1,2,3-cd)pireno**.

**b) Plaguicidas polares.** **UNE-EN ISO 11369:1998**, *«Determinación de ciertos **agentes para el tratamiento de las plantas**. Método por **HPLC con detección UV** tras **extracción sólido-líquido**»*. Es la vía de los plaguicidas que **no aguantan la cromatografía de gases**: los polares, los iónicos y los termolábiles. Para el **glifosato y el AMPA**, que son el caso extremo, hay norma propia: **ISO 21458** (HPLC con detección fluorimétrica) e **ISO 16308** (HPLC-MS/MS).

Valores: **plaguicida individual 0,10 µg/L** —o **< 0,03 µg/L** si está prohibido, con **LD siempre inferior a 0,03 µg/L**— y **∑n plaguicidas totales 0,50 µg/L**, con **incertidumbre del 30 %**.

**c) Microcistinas.** **Microcistina-LR: 1,0 µg/L**, con incertidumbre del **30 %**, y **solo se controla «cuando el origen del agua sea total o parcialmente de embalse o lago o laguna»** (nota 5). Normas: **ISO 20179:2005** (extracción en fase sólida y **HPLC-UV**) e **ISO 22104:2021** (**LC-MS/MS**). Y un detalle del anexo II: **si la microcistina-LR supera 1 µg/L, se controlará clorofila a**.

**d) PFAS: el parámetro nuevo y el que más calendario tiene.**

- **∑20 PFAS: 0,10 µg/L**, con incertidumbre del **50 %**. La norma define el grupo: sustancias que contienen *«un resto perfluoroalquilo con **tres o más carbonos** […] o un resto de perfluoroalquiléter con **dos o más carbonos**»*.
- **Antes del 2 de enero de 2024** había que controlar **4 PFAS** —**PFOA, PFOS, PFNA y PFHxS**— con **valor paramétrico de 0,07 µg/L cada uno** y **límite de detección siempre inferior a 0,07 µg/L**.
- **Calendario:** esos 4 PFAS, **controlar antes del 2/1/2024 y cumplir antes del 2/1/2025**; la **∑20 PFAS, controlar antes del 2/1/2025 y cumplir antes del 2/1/2026**. **Hoy, por tanto, la ∑20 está plenamente en vigor.**

Norma: **ISO 21675:2019**, *«Determinación de sustancias perfluoroalquiladas y polifluoroalquiladas (PFAS) en agua. Método usando **extracción en fase sólida y cromatografía líquida-espectrometría de masas en tándem (LC-MS/MS)**»*. Y para PFOS y PFOA en concreto, **ISO 25101:2009**.

**e) Bisfenol A: 2,5 µg/L**, con incertidumbre del **50 %**. Es uno de los **parámetros nuevos** del RD 3/2023, con el mismo calendario que los 4 PFAS: **controlar antes del 2/1/2024, cumplir antes del 2/1/2025**.

**f) La LISTA DE OBSERVACIÓN nacional (anexo IV, tabla 16).** Es, en la práctica, **una lista de LC-MS/MS**: cuatro contaminantes a nivel de **nanogramos por litro**.

| N.º | Contaminante | Valor de referencia | Límite de cuantificación |
| --- | --- | --- | --- |
| 68 | **17β-Estradiol** | **1 ng/L** | < 1 ng/L |
| 69 | **Nonilfenol** | **300 ng/L** | < 300 ng/L |
| 70 | **Azitromicina** | **100 ng/L** | < 100 ng/L |
| 71 | **Diclofenaco** | **100 ng/L** | < 100 ng/L |

**Frecuencia:** a la salida del tratamiento o depósito de cabecera, **al menos una vez al cuatrimestre** en zonas de abastecimiento **tipo 4, 5 y 6**, y **una vez al año** en las de **tipo 2 y 3**.

**Un antibiótico y un antiinflamatorio a 100 ng/L** solo se llegan a medir por **LC-MS/MS**: es la norma **ISO 21676:2018** (principios activos farmacéuticos) y, para el estradiol, la **ISO 13646:2025** (estrógenos por SPE y LC-MS/MS).

Y el cierre del anexo: *«**los microplásticos** se incluirán en la lista cuando la Comisión Europea adopte una **metodología normalizada** para medirlos en agua de consumo»*.

**g) Lo que el RD exige al método.** **No impone técnica**: **LC ≤ 30 %** del valor paramétrico, **LC y LD siempre inferiores al valor paramétrico**, e **incertidumbre de la tabla 15**. En **aguas superficiales** (RD 817/2015, anexo III, C.1): métodos **validados conforme a EN ISO/IEC 17025**, **incertidumbre ≤ 50 % (k = 2)** y **LC ≤ 30 %** de la norma de calidad ambiental.

## 3. Tabla operativa

| Parámetro / analito | Técnica | Norma o referencia | Unidades | Condiciones |
| --- | --- | --- | --- | --- |
| **Benzo(a)pireno** | **HPLC con detector de FLUORESCENCIA**, tras extracción líquido-líquido | **UNE-EN ISO 17993:2004** (15 HAP) | µg/L | **VP 0,010 µg/L**, incertidumbre **50 %**. **Es la respuesta documentada** en 1233 C2 #2 y 1322 C2 #24. **No entra en la ∑4 HPA** |
| **∑4 HPA** (benzo(b)fluoranteno, benzo(ghi)perileno, benzo(k)fluoranteno, indeno(1,2,3-cd)pireno) | HPLC con fluorescencia | UNE-EN ISO 17993; **ISO 7981-2** (6 HAP) | µg/L | **VP 0,10 µg/L**, incertidumbre **40 %** |
| **Plaguicidas polares, iónicos o termolábiles** | **HPLC con detección UV**, tras extracción sólido-líquido | **UNE-EN ISO 11369:1998** | µg/L | **VP 0,10 individual y 0,50 ∑n.** Los **volátiles y termoestables** van por **cromatografía de gases** (tema 31) |
| **Glifosato y AMPA** | **HPLC con detección fluorimétrica** o **HPLC-MS/MS** | **ISO 21458:2008**; **ISO 16308:2014** | µg/L | El caso extremo de plaguicida polar: no se puede hacer por gases sin derivatizar |
| **Microcistina-LR** | **SPE y HPLC-UV**, o **LC-MS/MS** | **ISO 20179:2005**; **ISO 22104:2021** | µg/L | **VP 1,0 µg/L**, incertidumbre **30 %**. **Solo si el origen es embalse, lago o laguna**. Si supera 1 µg/L, **se controla clorofila a** |
| **∑20 PFAS** | **SPE y LC-MS/MS** | **ISO 21675:2019**; **ISO 25101:2009** (PFOS y PFOA) | µg/L | **VP 0,10 µg/L**, incertidumbre **50 %**. Los **4 PFAS** (PFOA, PFOS, PFNA, PFHxS) a **0,07 µg/L** cada uno, con **LD < 0,07** |
| **Bisfenol A** | HPLC, habitualmente con MS/MS o fluorescencia | RD 3/2023, anexo I parte B | µg/L | **VP 2,5 µg/L**, incertidumbre **50 %**. Parámetro **nuevo** del RD 3/2023 |
| **Lista de observación: 17β-estradiol, nonilfenol, azitromicina, diclofenaco** | **SPE y LC-MS/MS** | **ISO 21676:2018** (fármacos); **ISO 13646:2025** (estrógenos); RD 3/2023, anexo IV | **ng/L** | **1 · 300 · 100 · 100 ng/L.** Cuatrimestral en ZA 4, 5 y 6; anual en ZA 2 y 3 |
| **Identificar un microcontaminante orgánico** | **CG o CL con DETECTOR DE MASAS** | 1233 #5; 1246 #30 | — | Solo el **espectro** dice **qué es** |
| **Especiación**: As(III)/As(V), Cr(VI)/Cr(III) | **HPLC acoplada** (a ICP-MS en el caso del cromo) | **ISO/TS 19620:2018**; **ISO 24384:2024** | µg/L | La cromatografía separa **las especies**; el ICP-MS cuantifica el elemento |
| **Compuestos volátiles y termoestables** | **NO es HPLC**: cromatografía de gases | **Tema 31** | — | THM, COV, organoclorados |
| **Aniones y cationes inorgánicos** | **NO es HPLC de reparto**: cromatografía iónica | **Tema 30** | — | Distractor en 1322 C2 #39 («con detector de diodos») |
| **Metales** | **NO es HPLC**: ICP-MS o absorción atómica | **Temas 26 y 27** | — | Distractor en 1233 C2 #1, 1246 C2 #1, 1322 C2 #25 y #40 |
| **Turbidez, DQO, nitrógeno total, grasas** | **NO es cromatografía** | Temas 28, 34 y 35 | — | Distractores en 1246 C2 #2 y #7, 1233 C2 #7, 1322 C2 #35 y #37 |
| **Calibración del cromatógrafo** | Interpolación entre dos puntos, con MRC | **CEM, QU-004** | — | 18-28 °C; material **clase A**; **Rs > 1,5**; picos **sin colas**; relación entre patrones **≤ 10** |
| **Exigencia legal, agua de consumo** | — | **RD 3/2023**, anexo III, D | — | **No impone método.** **LC ≤ 30 %** del valor paramétrico e incertidumbre de la **tabla 15** |

## 4. Puntos críticos para el examen

- **BENZO(a)PIRENO → CROMATOGRAFÍA DE LÍQUIDOS CON DETECTOR DE FLUORESCENCIA.** Documentado dos veces (1233 C2 #2, 1322 C2 #24). Es un HAP, y **los HAP son fluorescentes**.
- **EL BENZO(a)PIRENO TIENE VALOR PROPIO, 0,010 µg/L, Y NO ENTRA EN LA ∑4 HPA** (0,10 µg/L). Diez veces más estricto.
- **LA ∑4 HPA la forman benzo(b)fluoranteno, benzo(ghi)perileno, benzo(k)fluoranteno e indeno(1,2,3-cd)pireno.**
- **ANTES DE LA COLUMNA ANALÍTICA VA UNA PRECOLUMNA** (1246 #17, 1322 #34): mismo relleno, mucho más corta y barata, **sacrificial**. Resuelve **solutos que se unen irreversiblemente** y **material particulado**.
- **EL DETECTOR DE CONDUCTIVIDAD ES EL DE LOS COMPUESTOS IÓNICOS** (1246 #18, 1322 #35).
- **LOS SEIS COMPONENTES (CEM): líquidos portadores y tratamiento de disolventes · sistemas de bombeo · sistema de inyección · columnas · detectores · sistema de procesamiento de señal y tratamiento de datos.** **Seis**, frente a los **cinco** de gases: la diferencia es el tratamiento de los disolventes.
- **LOS CUATRO TIPOS DE CROMATOGRAFÍA LÍQUIDA (CEM): reparto · adsorción · IÓNICA · exclusión por tamaños o en geles.**
- **FASE NORMAL: estacionaria POLAR y móvil NO polar. El soluto POLAR se retiene más y sale el ÚLTIMO.**
- **FASE INVERSA: estacionaria NO POLAR (C8, C18) y móvil POLAR (agua tamponada, metanol, acetonitrilo). El soluto POLAR sale el PRIMERO.** **Es la más usada, con diferencia.**
- **EL ORDEN DE ELUCIÓN SE INVIERTE entre las dos.** Y para alargar la retención: en **fase normal**, **bajar** la polaridad de la fase móvil; en **fase inversa**, **subirla**.
- **El pH de la fase móvil debe ser INFERIOR A 7,5**, porque **la sílice se hidroliza en medio básico**.
- **Las fases estacionarias se UNEN covalentemente** haciendo reaccionar la sílice con un **organoclorosilano Si(CH₃)₂RCl**; los −SiOH sobrantes se **rematan** con Si(CH₃)₃Cl (*end-capping*).
- **ISOCRÁTICA = composición fija. GRADIENTE = la composición cambia durante la separación.** En fase inversa se empieza **más polar** y se va **haciendo menos polar**.
- **El gradiente resuelve el mismo problema que la rampa de temperatura en gases**: lo que separa bien lo que eluye pronto deja lo tardío en picos anchos y a destiempo.
- **El gradiente lo hacen dos bombas desfasadas que envían a una CÁMARA DE MEZCLA**, o una válvula dosificadora delante de una sola bomba.
- **LA FASE MÓVIL SE DESGASIFICA Y SE FILTRA**: las burbujas estropean la señal del detector y las partículas obstruyen la columna.
- **El inyector es de BUCLE** (0,5 µL a 5 mL), porque a varios cientos de atmósferas no se puede pinchar un septo.
- **Columna analítica: acero inoxidable, 2,1-4,6 mm de diámetro, 30-300 mm de longitud, partículas de sílice de 3-10 µm, 40 000-60 000 platos/m.**
- **Reducir el tamaño de partícula a la MITAD sube la eficiencia × 1,4 pero la CONTRAPRESIÓN × 4.** La **columna monolítica** —una sola varilla porosa— es la salida a ese compromiso.
- **DETECTOR DE FLUORESCENCIA: el más sensible de los ópticos, 1-10 pg.** Solo sirve si el analito **es fluorescente**.
- **DETECTOR UV/VIS: el más popular, 100 pg - 1 ng.** Limitación: **la fase móvil no puede absorber** a esa longitud de onda. Celda de flujo de **1-10 µL**.
- **DETECTOR DE DIODOS (DAD): registra TODO el espectro en cada instante** y da un **cromatograma tridimensional**; permite **comprobar la pureza del pico**.
- **DETECTOR DE ÍNDICE DE REFRACCIÓN: casi universal pero poco sensible (0,1-1 µg), y NO SIRVE EN ELUCIÓN EN GRADIENTE.**
- **La interfaz LC-MS es más difícil que la GC-MS**, por la incompatibilidad de una fase móvil **líquida** con el **alto vacío** del espectrómetro.
- **ENSANCHAMIENTO EXTRACOLUMNA:** propio del HPLC, por los **tubos de conexión** sin fase estacionaria. Se minimiza con tubos **cortos**, de **diámetro pequeño** y **caudales bajos**.
- **HAP → UNE-EN ISO 17993 (HPLC con FLUORESCENCIA). Plaguicidas → UNE-EN ISO 11369 (HPLC con UV).**
- **Microcistina-LR: 1,0 µg/L, solo si el origen es EMBALSE, LAGO O LAGUNA.** Si se supera, **se controla clorofila a**.
- **∑20 PFAS: 0,10 µg/L.** Los **4 PFAS** (PFOA, PFOS, PFNA, PFHxS) a **0,07 µg/L** cada uno, con **LD < 0,07 µg/L**. Se determinan por **LC-MS/MS**.
- **Bisfenol A: 2,5 µg/L.**
- **LISTA DE OBSERVACIÓN (anexo IV): 17β-estradiol 1 ng/L · nonilfenol 300 ng/L · azitromicina 100 ng/L · diclofenaco 100 ng/L.** Cuatrimestral en ZA 4, 5 y 6; anual en ZA 2 y 3. **Los microplásticos entrarán cuando la Comisión adopte metodología normalizada.**
- **CUIDADO CON LOS DISTRACTORES: la cromatografía líquida es la respuesta FALSA más ofrecida del segundo ejercicio** —siete veces—. Si el analito es un **metal**, un **ion inorgánico** o un **parámetro global** (turbidez, DQO, nitrógeno total, grasas), **no es HPLC**.

## Reparto con los temas vecinos

| Contenido | Dónde se desarrolla |
| --- | --- |
| **Cromatografía de líquidos: instrumentación completa y uso en agua** | **Aquí** |
| **Fundamentos y tipos de cromatografía; cromatografía iónica** | **Tema 30** |
| **Cromatografía de gases: THM, COV y plaguicidas volátiles** | **Tema 31** |
| Espectrofotometría molecular UV-visible (la base del detector UV) | Tema 25 |
| Metales por absorción atómica e **ICP-MS** | Temas 26 y 27 |
| Turbidez | Tema 28 |
| Amonio, nitritos, oxidabilidad, dureza y alcalinidad | Tema 33 |
| **DQO, DBO y sólidos en suspensión** | **Tema 34** |
| **Nitrógeno total, fósforo total y grasas** | **Tema 35** |
| Toma de muestra y conservación | Tema 36 |
| Validación e incertidumbre | Tema 38 |
| Patrones, materiales de referencia y calibración lineal | Tema 39 |
| ISO/IEC 17025 y acreditación | Tema 40 |

---

## Fuentes y verificación

- **CEM, procedimiento QU-004, leído íntegro** (el mismo que sostuvo el tema 30, aquí usado para lo que le es propio): los **seis componentes** del cromatógrafo de líquidos y los **cuatro tipos** de cromatografía líquida (4.2), las definiciones de **resolución con el criterio Rs > 1,5** y de **tiempo de retención** (apartado 3), el **material y las condiciones de calibración** (5.1 y 5.2) y los **pasos del proceso** con sus cuatro criterios de comprobación del cromatograma (5.3).
- **Normas verificadas en el buscador gratuito de UNE**, comprobando código, **título oficial en español**, fecha de edición, **estado**, comité (**CTN 77/SC 1 Agua**) y equivalencia internacional: **UNE-EN ISO 17993:2004** y **UNE-EN ISO 11369:1998**, las dos **en vigor** y confirmadas en 2008.
- **Estado de las ISO comprobado en el catálogo público del comité ISO/TC 147/SC 2**: **ISO 17993:2002**, **ISO 11369:1997**, **ISO 7981-1 y -2:2005**, **ISO 20179:2005**, **ISO 21675:2019**, **ISO 25101:2009**, **ISO 16308:2014**, **ISO 21458:2008**, **ISO 21676:2018**, **ISO 22478:2006**, **ISO/TS 19620:2018** e **ISO 21253-1:2019** constan en estado **90.93** (confirmadas, vigentes); **ISO 22104:2021** en 90.20 y **ISO 13646:2025** e **ISO 24384:2024** en 60.60 (recién publicadas).
- **Textos legales leídos literalmente en el BOE**, texto consolidado: **RD 3/2023**, anexo I parte B (tabla 2 y notas 5, 8, 9, 13, 14, 15 y 16), anexo II parte B.3 (clorofila a), anexo III parte D (tabla 15), **anexo IV completo** con la tabla 16 de la lista de observación, y la **disposición transitoria** con el calendario de los PFAS y del bisfenol A; y **RD 817/2015**, anexo III, C.1.
- **Teoría:** LibreTexts en español, *Análisis Instrumental* — §28.1 (por qué el HPLC es una familia y no una técnica), §28.2 (ensanchamiento extracolumna), §28.3 (columnas analíticas, capilares y monolíticas con sus dimensiones y eficiencias, contrapresión, columnas de guarda, bombas y amortiguador de pulsos, inyector de bucle, y todos los detectores con sus límites de detección), §28.4 (fase normal y fase inversa, organoclorosilanos y *end-capping*, pH < 7,5, índice de polaridad, elución isocrática y en gradiente) y §28.7.
- **Exámenes anteriores:** los **seis** cuestionarios extraídos a texto y releídos. Las dos respuestas documentadas del benzo(a)pireno, las dos preguntas del primer ejercicio y **los siete distractores** están **transcritos de ellos**, con su numeración.
- **`TEMARIO EXTRA/`:** consultado antes de redactar, según la regla fija del proyecto. `MAPEO.md` da el tema 32 como **«sin nada»** y lo justifica con una búsqueda directa en los 21 archivos: **cero apariciones de «cromatografía»**. No aporta nada y no se ha usado.
- **Figuras:** las dos de este tema (`fase-normal-vs-inversa` y `gradiente-elucion`) se han añadido al catálogo con **cuatro controles nuevos** en `verificar-figuras.js` y **cuatro sabotajes** que los prueban. Los de la primera comprueban que **el orden de elución se invierte** entre los dos paneles, localizando la cima de cada pico sobre el trazado; los de la segunda, que **el gradiente sube y la isocrática se queda plana** y que **el último pico sale más estrecho** en el gradiente. Se reutiliza además el esquema `cromatografo-ionico` del tema 30, a propósito: es un cromatógrafo de líquidos.
- **Fecha de verificación:** 21/09/2026.

### Dudas y limitaciones declaradas

1. **De ninguna norma UNE o ISO he leído el articulado.** Son de pago. He verificado **código, título, año, equivalencia y estado** en fuentes gratuitas y oficiales. Todo lo que este apunte dice sobre **cómo se hace un método** viene del **CEM** o de **LibreTexts**.

2. **La asignación técnica → parámetro es mía en varios casos, y conviene saber cuáles.** Está **verificado en el título de la norma** que los HAP van por **HPLC-fluorescencia** (ISO 17993), los plaguicidas por **HPLC-UV** (ISO 11369), las microcistinas por **HPLC-UV o LC-MS/MS** y los PFAS por **LC-MS/MS**. En cambio, que el **bisfenol A** se determine por HPLC **lo pongo yo**: el RD no fija método y **no he localizado una norma ISO de bisfenol A en agua** en el catálogo del SC 2. Es lo que se hace en la práctica, pero queda declarado.

3. **Que el benzo(a)pireno se mida por HPLC-fluorescencia es lo que responde el examen y lo que dice la norma**, pero **no es la única vía**: la **ISO 28540** determina 16 HAP por **cromatografía de gases con espectrometría de masas**, y está vigente. Si el examen ofreciera las dos, la respuesta documentada es la de fluorescencia.

4. **No tengo la plantilla de respuestas de ningún cuestionario.** En el benzo(a)pireno la deducción es segura —las otras opciones eran gravimetría, volumetría y turbidimetría, o ICP-MS y cámara de grafito—. En la precolumna y el detector de conductividad también. Los **siete distractores** los identifico por descarte razonado, no por plantilla.

5. **El reparto con el 30 y el 31 lo decidí al redactar el 30** y aquí se respeta, con una consecuencia que dejo dicha: **la precolumna y el detector de conductividad aparecen en dos temas**. En el 30 como piezas del cromatógrafo iónico —que es donde el detector de conductividad tiene sentido— y aquí como piezas del HPLC en general, que es lo que pide este enunciado. **No es un descuido: es deliberado**, y el **ANALISIS.md** asigna las dos preguntas precisamente a este tema.

6. **Los límites de detección de los detectores son de LibreTexts y son órdenes de magnitud**, no especificaciones. Sirven para ordenarlos entre sí —fluorescencia mejor que UV, y el índice de refracción el peor—, que es lo que se pregunta.

7. **Reutilizo el esquema `cromatografo-ionico` del tema 30 para ilustrar la cadena del HPLC.** Es deliberado y está explicado en el cuerpo: la cadena es la misma **menos el supresor**, y el detector cambia. Pero **el dibujo sigue rotulado como cromatógrafo iónico**, así que hay que leer el pie: no es un esquema de HPLC genérico.

8. **La afirmación de que «la fase inversa es la más usada» es de LibreTexts**, que dice literalmente *«de los dos modos, la cromatografía de partición en fase inversa es la más común»*. Que sea «la de los HAP, los plaguicidas y los fármacos» **lo añado yo**, aunque se deduce de que las tres normas citadas usan fase inversa con agua y disolvente orgánico.

9. **La lista de observación cambia.** La tabla 16 es la vigente **a la entrada en vigor** del RD 3/2023, y el propio anexo dice que *«se irán incluyendo contaminantes»*. Los cuatro valores que doy son los del texto consolidado que he leído hoy; **hay que rehacer esta parte si el Ministerio la actualiza**.

10. **Aprobación.** El tema se ha redactado, generado y cerrado **de una sola vez**, con **autorización previa y expresa del opositor** para saltarse el paso 3 del flujo del README, igual que los temas 29, 30 y 31.
