---
tema: 38
titulo: "Validación de procedimientos analíticos: definición, rango de validación, criterios de validación, sistemática de validación, cálculos de incertidumbres."
parte: Parte segunda
estado: aprobado
verificado: 2026-09-25
fuentes:
  - "VIM. Vocabulario Internacional de Metrología (JCGM 200:2012), 3.ª edición en español del Centro Español de Metrología, 2012. LEÍDO LITERALMENTE: exactitud (2.13), veracidad (2.14), precisión (2.15), error (2.16), error sistemático (2.17), sesgo (2.18), error aleatorio (2.19), repetibilidad, precisión intermedia y reproducibilidad con sus condiciones (2.20 a 2.25), incertidumbre (2.26), evaluaciones tipo A y tipo B (2.28, 2.29), incertidumbre típica, combinada, objetivo y expandida (2.30 a 2.35), intervalo, probabilidad y factor de cobertura (2.36 a 2.38), verificación (2.44), validación (2.45), intervalo de medida (4.7), sensibilidad (4.12), selectividad (4.13) y límite de detección (4.18). — https://www.cem.es/sites/default/files/vim-cem-2012web.pdf"
  - "GUM. Evaluación de datos de medición. Guía para la expresión de la incertidumbre de medida (JCGM 100:2008), edición digital en español del CEM, NIPO 706-10-001-0. LEÍDO en lo pertinente: definiciones 2.3.1 a 2.3.6, la hipótesis de corrección de efectos sistemáticos (3.2.4), las evaluaciones tipo B con distribución normal, rectangular y triangular (4.3.4 a 4.3.9), la regla de no contar dos veces (4.3.10), la incertidumbre expandida (6.2.1, 6.3.3) y el número de cifras (7.2.6). — https://www.cem.es/sites/default/files/gum20digital1202010.pdf"
  - "Guía Eurachem «La adecuación al uso de los métodos analíticos. Una guía de laboratorio para la validación de métodos y temas relacionados», 1.ª edición española (2016) de la 2.ª inglesa (2014), Eurolab España, P. P. Morillas y colaboradores. LEÍDA en las secciones 2 a 8: definiciones, validación frente a verificación, cuándo validar, plan e informe de validación, herramientas, las ocho características de desempeño con sus Referencias Rápidas, y el uso de los datos de validación en el control de calidad. — https://www.eurachem.org/images/stories/Guides/pdf/MV_guide_2nd_ed_ES.pdf"
  - "Eurachem Guide «The Fitness for Purpose of Analytical Methods», 3.ª edición inglesa, 2025 (H. Cantwell, ed.). VIGENTE; sin traducción española publicada a la fecha. LEÍDA para comprobar qué ha cambiado respecto a la de 2014: la remisión a las cláusulas 7.2.1.5, 7.2.2.1, 7.2.2.2 y 7.2.2.4 de la ISO/IEC 17025:2017, las definiciones de la tabla 1, la lista de características de la tabla 2 y los factores 3 y 10 del LOD y el LOQ, que se mantienen. — https://www.eurachem.org/images/stories/Guides/pdf/MV_guide_3rd_ed_V1_EN.pdf"
  - "Guía Eurachem/CITAC CG 4 «Cuantificación de la incertidumbre en medidas analíticas» (QUAM), 1.ª edición española de la 3.ª inglesa (2012). LEÍDA: el proceso de cuatro pasos (sección 4), la conversión a incertidumbre típica (8.1), las reglas de combinación (8.2), la incertidumbre expandida y la elección de k (8.3), el umbral de un tercio para despreciar componentes (7.2.2) y el informe del resultado (9.4, 9.5 y 9.7). — https://www.eurachem.org/images/stories/Guides/pdf/QUAM2012_P1_ES.pdf"
  - "Nordtest NT TR 537, «Handbook for calculation of measurement uncertainty in environmental laboratories», edición 4, aprobada en noviembre de 2017. LEÍDO: la escalera de errores (2.3), el modelo u(Rw) + u(sesgo) (sección 3), el ejemplo resuelto del amonio por EN ISO 11732 (3.2 y 3.3), la incertidumbre absoluta frente a relativa (sección 4) y el cálculo de u(sesgo) con uno o varios MRC (sección 6). — http://nordtest.info/images/documents/nt-technical-reports/NT_TR_537_edition4_English_Handbook_for_calculation_of_measurement_uncertainty_in_environmental_laboratories.pdf"
  - "ISO 11352:2025, Water quality — Estimation of measurement uncertainty based on validation and quality control data, edición 2, septiembre de 2025. ANULA a la ISO 11352:2012 (anulada el 01/09/2025, según la ficha de AENOR). No he encontrado adopción UNE. Se cita por su ALCANCE, leído en la ficha pública: se basa principalmente en el Nordtest TR 537. — https://www.iso.org/standard/86833.html"
  - "Real Decreto 3/2023, de 10 de enero, de calidad del agua de consumo (BOE-A-2023-628), texto consolidado. LEÍDO LITERALMENTE: artículo 20; disposición adicional octava (plazos de acreditación); anexo III, parte B (acreditación por la UNE-EN ISO/IEC 17025), parte D completa (definiciones de LD y LC, el 30 % del valor paramétrico, la tabla 15 con sus nueve notas y la obligación de notificar U, LC y LD en SINAC) y PARTE E ÍNTEGRA (validación de métodos físico-químicos y microbiológicos, contenido del procedimiento y asignación de la incertidumbre al método). — https://www.boe.es/buscar/act.php?id=BOE-A-2023-628"
  - "Real Decreto 817/2015, de 11 de septiembre, de seguimiento y evaluación del estado de las aguas superficiales (BOE-A-2015-9806), texto consolidado. LEÍDO: artículo 3, definiciones 23 (incertidumbre de medida), 25 (límite de cuantificación) y 26 (límite de detección), a las que remite el RD 3/2023; y el anexo III, apartado C: métodos validados conforme a la ISO/IEC 17025, incertidumbre ≤ 50 % (k = 2) y LC ≤ 30 % de la NCA, cálculo de medias con resultados < LC y demostración de capacidad con ensayos de aptitud y materiales de referencia. — https://www.boe.es/buscar/act.php?id=BOE-A-2015-9806"
  - "ENAC, CGA-ENAC-LEC Rev. 12, abril de 2024, «Criterios generales para la acreditación de laboratorios de ensayo y calibración según norma UNE-EN ISO/IEC 17025:2017». LEÍDO ENTERO (7 págs.): de su anexo I salen, en castellano y entre comillas, la cláusula 7.2.1.5 de la norma, las definiciones de método normalizado, interno basado en normalizado y desarrollado por el laboratorio, y la exigencia de validación completa para estos últimos. — https://www.enac.es/documents/7020/b7e24234-daba-4a62-9652-76eb7e96db30"
  - "UNE-EN ISO/IEC 17025:2017 (versión corregida el 09/05/2018), Requisitos generales para la competencia de los laboratorios de ensayo y calibración. VIGENTE; edición de 20/12/2017; anula a la de 2005. Comprobado en el buscador de UNE. Leído el extracto público de AENOR (índice y capítulos 1 y 2); el articulado es de pago. — https://www.une.org/encuentra-tu-norma/busca-tu-norma/norma?c=N0059467"
  - "ExamenesAnteriores/ y los seis cuestionarios, extraídos a texto y barridos el 25/09/2026 con «validación», «incertidumbre», «exactitud», «precisión», «repetibilidad», «sesgo», «recuperación», «límite de detección», «cuantificación», «linealidad» y «robustez». De ahí sale, TRANSCRITA con sus tres opciones, la única pregunta directa del tema (1246, primer ejercicio, #19), y la pregunta del material de referencia de la auditoría ISO 17025 (1322, segundo ejercicio, supuesto 1, #10)."
  - "TEMARIO EXTRA/MAPEO.md: el tema 38 figura como «sin nada». Comprobado de nuevo por búsqueda en el propio mapeo; no hay ficha de apoyo."
---

> **UNA PREGUNTA DIRECTA, Y UNA SEGUNDA DENTRO DE UN SUPUESTO DE AUDITORÍA.** En los seis cuestionarios hay **poco de este tema**, pero lo que hay es muy limpio:
>
> | Dónde | Enunciado literal | Respuesta |
> | --- | --- | --- |
> | **1246, primer ejercicio, #19** | *«Para el cálculo de la incertidumbre de un método analítico necesitamos conocer los siguientes parámetros:»* | **a) Exactitud y Precisión** |
> | **1322, segundo ejercicio, supuesto 1, #10** | *«¿Cuál de los siguientes es un material de referencia válido para utilizarlo en una determinación solicitada de agua de consumo solicitada en la auditoría?»* | **b) Un material de referencia de agua de consumo con una concentración de 5 mg/l de analito** |
>
> Distractores de la #19: *«Límite de Detección y Límite de Cuantificación»* y *«Sensibilidad y Selectividad»*. Los dos son características de validación **reales**, que es lo que los hace peligrosos, pero **no entran en el cálculo de la incertidumbre**. Lo que entra es la **precisión** (el error aleatorio) y la **veracidad** (el error sistemático, el sesgo): eso es exactamente el modelo de los laboratorios de aguas, **uc = √(u(Rw)² + u(sesgo)²)**, desarrollado en el apartado 2.6.
>
> Distractores de la #10: el mismo material **en agua desionizada** (matriz equivocada) y uno de agua de consumo **por debajo del límite de detección** (no se puede medir). La regla es de la Guía Eurachem: *«preferiblemente un MRC con la misma matriz y en concentraciones del analito similares a las muestras reales»*.
>
> El supuesto 1 de 1322 **entero** va de un laboratorio que prepara **una auditoría de acreditación ISO 17025**. De sus diez preguntas, esta es la de validación; las demás son de pictogramas, disoluciones, calibración (R²) y la propia norma, y están repartidas en sus temas.

> **EL HALLAZGO DEL TEMA: el RD 3/2023 trae la lista de validación hecha, en castellano y con rango de ley.** El anexo III, **parte E**, se titula *«Validación de métodos microbiológicos y físico-químicos»* y enumera **diez parámetros** para los físico-químicos: **selectividad, rango de trabajo, linealidad, sensibilidad, límite de detección, límite de cuantificación, robustez, precisión, veracidad (sesgo) e incertidumbre**. Es la lista que mejor encaja con la palabra «criterios» del enunciado, y la que más probablemente maneje un tribunal de un laboratorio de aguas municipal. Está transcrita en el apartado 2.3.

> **UN AVISO SOBRE LA PALABRA «EXACTITUD».** En el lenguaje del VIM, **la exactitud no es una cosa distinta de la precisión: la incluye.** *«El término "exactitud de medida" no debe utilizarse en lugar de veracidad de medida, al igual que el término "precisión de medida" tampoco debe utilizarse en lugar de "exactitud de medida", ya que esta última incluye ambos conceptos»* (VIM 2.13, nota 2). La pregunta 1246 #19 usa «exactitud» en el sentido antiguo, como sinónimo de **veracidad**. **No cambia la respuesta**, pero conviene saber que, dicho con rigor, lo que se necesita es **veracidad y precisión**.

> **REPARTO CON LOS TEMAS VECINOS, Y CON EL 39 Y EL 40.** Los temas 23 a 35 remiten todos aquí para «validación e incertidumbre». Y el enunciado solapa con los dos siguientes. El reparto que he decidido es este:
>
> | Contenido | Dónde |
> | --- | --- |
> | **Qué es validar**, validación frente a verificación, cuándo hay que hacerlo | **Aquí** |
> | **Las características de desempeño** (selectividad, LD, LC, rango, linealidad, sensibilidad, veracidad, precisión, robustez) y **cómo se evalúa cada una** | **Aquí** |
> | **Los criterios de aceptación legales**: LC ≤ 30 % del valor paramétrico y la tabla 15 de incertidumbres | **Aquí**, con los valores de cada parámetro en el **tema 33** |
> | **El cálculo general de la incertidumbre**: tipos A y B, distribuciones, combinación, expandida, enfoque de validación y control de calidad | **Aquí** |
> | La incertidumbre **concreta de la calibración de un pHímetro** (CEM QU-003) | **Tema 23**, que ya la desarrolla |
> | **Calibrar, verificar y ajustar** un instrumento; la **trazabilidad** (VIM 2.39, 2.41, 2.44) | **Tema 21** y **tema 39** |
> | **Patrones primarios, materiales de referencia** (cómo se producen y certifican) y **trazabilidad** | **Tema 39** |
> | **La recta de calibrado por mínimos cuadrados**: pendiente, ordenada, **R²** y residuales, con las dos preguntas de examen sobre R² (1233 #18 y 1322 C2 #3) | **Tema 39** |
> | **El control de calidad en rutina**: gráficos de control, límites de aviso y de acción, ensayos de aptitud | **Tema 39** |
> | **La ISO/IEC 17025 como norma**, **ENAC**, la acreditación, las auditorías y las no conformidades | **Tema 40** |
> | La **validación de medios de cultivo** (productividad, selectividad, especificidad; 1233 #14) | **Temas de microbiología** |
>
> La frontera con el 39 es **la de la línea de tiempo**: la validación demuestra **una vez**, antes de usar el método, que sirve; el control de calidad del 39 demuestra **cada día** que sigue sirviendo. Aquí se nombra el control de calidad solo en lo que la validación le entrega (sus números); cómo se lleva, es del 39.

---

## 1. Encuadre

Un laboratorio no vende números: vende **decisiones** que se toman con esos números. *«Si el resultado de un análisis no genera confianza, entonces tiene poco valor y el análisis puede mejor no llevarse a cabo»* (Eurachem, 3.2). La validación es la forma de **demostrar por escrito** que un método da resultados en los que se puede confiar **para lo que se van a usar**.

La definición que manda es la del **VIM**, y conviene leerla literal porque tiene dentro una trampa:

> **Validación (VIM 2.45):** *«verificación de que los requisitos especificados son adecuados para un uso previsto»*.
>
> **Verificación (VIM 2.44):** *«aportación de evidencia objetiva de que un elemento dado satisface los requisitos especificados»*.

Es decir: **toda validación es una verificación, pero no toda verificación es una validación** (lo dice el propio VIM, 2.44, nota 5). La diferencia está en **tres palabras: «para un uso previsto»**. Verificar es comprobar que se cumple una especificación; validar es comprobar, además, que **esa especificación es la que hace falta para el uso**.

La ISO/IEC 17025:2017 **no define los términos por su cuenta: remite al VIM** (Eurachem 3.ª ed., tabla 1, nota b). La ISO 9000 los define con otras palabras, pero con la misma idea: *«confirmación, a través de la aportación de evidencia objetiva, de que se han cumplido los requisitos para un uso o aplicación específico previsto»*.

| Qué regula | Norma o referencia | Lógica |
| --- | --- | --- |
| **Vocabulario**: validación, exactitud, precisión, incertidumbre… | **VIM** (JCGM 200:2012, ed. CEM) | Metrología general |
| **Cuándo** validar o verificar, y qué registrar | **UNE-EN ISO/IEC 17025:2017**, cláusula **7.2** | Norma de acreditación (**tema 40**) |
| **Cómo** validar un método químico | **Guía Eurachem** (2016 en español; 3.ª ed. inglesa de 2025) | Guía técnica de referencia |
| **Qué exige la ley** en agua de consumo | **RD 3/2023**, art. 20 y **anexo III, partes B, D y E** | Norma con rango de ley |
| **Qué exige la ley** en aguas superficiales | **RD 817/2015**, **anexo III, apartado C** | Norma con rango de ley |
| **Cómo se calcula** la incertidumbre | **GUM** (JCGM 100:2008, ed. CEM) y **guía QUAM** | Doctrina metrológica |
| **Cómo se calcula** en un laboratorio de aguas, con datos de validación y control | **Nordtest TR 537** e **ISO 11352:2025** | Enfoque práctico |
| **Cómo evalúa ENAC** la validez de un método | **CGA-ENAC-LEC**, anexo I | Criterio de la entidad acreditadora |

**Por qué importa para esta plaza:** el RD 3/2023 **obliga** a los laboratorios de agua de consumo a tener **acreditados por la UNE-EN ISO/IEC 17025** los métodos de los parámetros que analizan (anexo III, parte B.2), y **mientras un método no esté acreditado, a tenerlo validado y documentado conforme a la parte E** (parte B.3). Y la acreditación exige, a su vez, validar o verificar cada método. **La validación no es un trámite académico: es una condición legal para que el resultado valga.**

---

## 2. Desarrollo

### 2.1. Definición: qué es validar, y cuándo hay que hacerlo

#### Validar, verificar, calibrar

Tres palabras que se confunden y que el examen puede enfrentar:

| | Qué comprueba | Sobre qué | Ejemplo |
| --- | --- | --- | --- |
| **Calibrar** (VIM 2.39) | La relación entre lo que marca el instrumento y el valor del patrón, **con su incertidumbre** | Un **instrumento** | Calibrar la balanza con pesas patrón (**tema 21**) |
| **Verificar** (VIM 2.44) | Que algo **cumple unos requisitos especificados** | Un instrumento, un material o un **método ya validado** | Comprobar que el laboratorio alcanza la repetibilidad que publica una norma UNE |
| **Validar** (VIM 2.45) | Que esos requisitos son **los adecuados para el uso previsto**, y que se cumplen | Un **método** | Demostrar que un método desarrollado en casa mide nitratos en agua de consumo con la incertidumbre que exige el RD |

#### Cuándo se valida y cuándo basta con verificar

La **ISO/IEC 17025:2017** distingue dos casos, y la Guía Eurachem lo resume así:

- **Se VALIDA** (cláusula **7.2.2.1**): los **métodos no normalizados**, los **desarrollados por el laboratorio** y los **normalizados utilizados fuera de su alcance previsto o modificados de otra forma**. *(Traducción mía del texto inglés que transcribe la Guía Eurachem de 2025; la redacción española exacta de la UNE no la he leído, ver «Dudas».)*
- **Se VERIFICA** (cláusula **7.2.1.5**), que ENAC transcribe literalmente en castellano: ***«el laboratorio debe verificar que puede llevar a cabo apropiadamente los métodos antes de utilizarlos, asegurando que se pueda lograr el desempeño requerido. Se deben conservar registros de la verificación. Si el método es modificado por el organismo que lo publicó, la verificación se debe repetir en la extensión necesaria»***. Es el caso de un **método normalizado** (una norma UNE, ISO, EN) **usado dentro de su alcance**: la validación ya la hizo el organismo que lo publicó, normalmente con un **estudio colaborativo** entre muchos laboratorios; lo que el laboratorio tiene que demostrar es que **él** sabe aplicarlo.

ENAC (CGA-ENAC-LEC, anexo I) lo ordena en **tres clases de método**:

| Clase de método (ENAC) | Qué exige ENAC |
| --- | --- |
| **Normalizado**: publicado en normas UNE, EN, ISO… o por organizaciones técnicas reconocidas | **Verificación** (7.2.1.5) |
| **Interno basado en un normalizado**: un procedimiento propio *«claramente basado»* en una norma | **Verificación** (7.2.1.5): su validez *«se justifica por referencia al método normalizado»* |
| **Desarrollado por el laboratorio** | ***«Validación completa conforme a la cláusula 7.2.2»***, con evidencias que *«deberán demostrar de manera indiscutible la validez del método»* |

Y tres situaciones más que **obligan a volver a validar o verificar**:

- **Cambios en un método ya validado** (cláusula **7.2.2.2**): hay que determinar su influencia y, si afectan a la validación original, **validar de nuevo**.
- **Cambios importantes en el laboratorio**: *«el uso de un equipo nuevo (pero similar), traslado de equipos, etc.»* → **verificación** (Eurachem 4.2).
- **Demostrar que dos métodos son equivalentes**, por ejemplo uno nuevo frente a uno normalizado → **validación** (Eurachem 4.1).

> **Un dato de ENAC que puede sorprender:** *«una vez transcurrido un año desde la aprobación de una nueva revisión de un método normalizado, ENAC considerará que el método ha perdido a todos los efectos su condición de tal»* (CGA-ENAC-LEC, nota 3 del anexo I). Es decir: si la norma se revisa y el laboratorio no se actualiza en un año, **su método deja de ser «normalizado»** a efectos de acreditación.

#### Qué hay que dejar escrito

La validación **termina en un documento**, y la ley dice qué tiene que contener. El RD 3/2023 (anexo III, parte E.1): ***«El laboratorio debe registrar los resultados obtenidos, el procedimiento utilizado para la validación y una declaración sobre la aptitud del método para el uso previsto.»*** La ISO/IEC 17025 exige lo mismo en su cláusula **7.2.2.4**, y la Guía Eurachem lo subraya: *«lo más importante, debe realizarse una declaración sobre la adecuación al uso del método»*.

**Tres cosas, por tanto: los resultados, el procedimiento de validación y la DECLARACIÓN DE APTITUD.** Una validación sin la frase final «el método es apto para…» está incompleta.

### 2.2. El vocabulario de la calidad de un resultado

Antes de los criterios, las palabras. Son **pocas**, están **definidas con precisión** en el VIM, y el examen juega con ellas.

![Veracidad y precisión: cuatro dianas](esquema:dianas-veracidad-precision)

| Término | Definición del VIM (literal) | Qué error describe | Cómo se expresa |
| --- | --- | --- | --- |
| **Exactitud** (2.13) | *«proximidad entre un valor medido y un valor verdadero de un mensurando»* | **El error total** | **No es una magnitud y no se expresa numéricamente** |
| **Veracidad** (2.14) | *«proximidad entre la media de un número infinito de valores medidos repetidos y un valor de referencia»* | **El error sistemático** | Con el **sesgo** |
| **Precisión** (2.15) | *«proximidad entre las indicaciones o los valores medidos obtenidos en mediciones repetidas de un mismo objeto, o de objetos similares, bajo condiciones especificadas»* | **El error aleatorio** | Con una **desviación típica, varianza o coeficiente de variación** |
| **Sesgo** (2.18) | *«valor estimado de un error sistemático»* | — | En unidades o en % |
| **Incertidumbre** (2.26) | *«parámetro no negativo que caracteriza la dispersión de los valores atribuidos a un mensurando, a partir de la información que se utiliza»* | **Todo lo anterior junto**, en un solo número | **± U**, con su factor de cobertura |

Tres ideas que hay que llevarse de la tabla:

1. **La veracidad NO depende del error aleatorio, y la precisión NO depende del sistemático.** El VIM lo dice expresamente: la veracidad *«está inversamente relacionada con el error sistemático, pero no está relacionada con el error aleatorio»* (2.14, nota 2). Por eso las cuatro dianas: se puede ser muy preciso y estar sistemáticamente desviado (arriba a la derecha), o estar centrado de media y ser muy disperso (abajo a la izquierda).
2. **La exactitud incluye las dos.** Un método **exacto** es **veraz Y preciso**. *«Con frecuencia, "precisión de medida" se utiliza, erróneamente, en lugar de exactitud de medida»* (2.15, nota 4).
3. **La precisión se mide en unas condiciones que hay que decir.** No existe «la precisión» a secas.

#### Las tres condiciones de precisión

| | Condición (VIM) | Lo que cambia | Lo que no cambia | Da la variación… |
| --- | --- | --- | --- | --- |
| **Repetibilidad** (2.20, 2.21) | *«…el mismo procedimiento de medida, los mismos operadores, el mismo sistema de medida, las mismas condiciones de operación y el mismo lugar… en un periodo corto de tiempo»* | **Nada** | Todo | **Mínima** |
| **Precisión intermedia** (2.22, 2.23) | *«…el mismo procedimiento de medición, el mismo lugar… durante un periodo amplio de tiempo»*, con *«nuevas calibraciones, patrones, operadores y sistemas de medida»* | Días, analistas, equipos, calibraciones | **El laboratorio** | **Intermedia** |
| **Reproducibilidad** (2.24, 2.25) | *«…diferentes lugares, operadores, sistemas de medida…»* | **El laboratorio** | El método (normalmente) | **Máxima** |

Sinónimos que aparecen en la bibliografía: la repetibilidad es la precisión **intra-serie** o **intra-ensayo**; la precisión intermedia es la **inter-serie**, **inter-ensayo** o **«reproducibilidad dentro del laboratorio»**, y en el Nordtest se escribe **s(Rw)** (*within-laboratory reproducibility*). **Es la que interesa para la incertidumbre**, porque es la que recoge toda la variación que el laboratorio va a tener en su rutina.

#### Error e incertidumbre no son lo mismo

- El **error** es *«la diferencia entre un valor medido de una magnitud y un valor de referencia»* (VIM 2.16): **es un número con signo**, y en general **desconocido**, porque el valor verdadero no se conoce.
- La **incertidumbre** es un **parámetro no negativo** que dice **cuánto podría valer ese error**: *«La incertidumbre de medida nos dice qué tamaño podría tener el error»* (Nordtest, 2.4). **Se estima; no se corrige.**

La Guía Eurachem dibuja la relación en su figura 4, y la resumo aquí:

| Tipo de error | Descripción cualitativa | Medida cuantitativa |
| --- | --- | --- |
| Error **sistemático** | **Veracidad** | **Sesgo** |
| Error **aleatorio** | **Precisión** | **s, RSD…** en condiciones especificadas |
| Error **total** | **Exactitud** | **Incertidumbre** |

### 2.3. Criterios de validación: las características de desempeño

«Criterios de validación», en la práctica, son **dos cosas**: **qué características** se estudian y **qué valor** tienen que alcanzar. Aquí van las primeras; los valores exigidos, en el 2.4.

**La lista del RD 3/2023** (anexo III, parte E.2.a), literal:

> *«Los parámetros que pueden caracterizar la validación de un método de análisis físico-químico son: 1.º Selectividad; 2.º Rango de trabajo; 3.º Linealidad; 4.º Sensibilidad; 5.º Límite de detección; 6.º Límite de cuantificación; 7.º Robustez; 8.º Precisión; 9.º Veracidad (sesgo); 10.º Incertidumbre.»*
>
> *«b) En función del método, el laboratorio deberá evaluar todos estos parámetros o bien una parte de ellos en su validación.»*

**La lista de la Guía Eurachem** (tabla 2) es la misma salvo dos matices: junta **rango y linealidad** en «intervalo de trabajo», y advierte que **la incertidumbre, en sentido estricto, no es una característica del método**: *«no es una característica del desempeño de un procedimiento de medida particular pero sí de los resultados obtenidos al usar dicho procedimiento»*. La 3.ª edición (2025) añade que **la función de calibración no es una característica de desempeño**, sino un **requisito previo** para evaluar las demás.

Y el propio RD, en su parte E.1.a, deja claro cuáles son **las tres imprescindibles**: *«debiendo evaluarse parámetros como **veracidad, precisión e incertidumbre de medida**»*.

#### 1. Selectividad

- **Definición (VIM 4.13):** la propiedad por la que el sistema *«proporciona valores medidos para uno o varios mensurandos, que son independientes de otros mensurandos o de otras magnitudes existentes en el fenómeno, cuerpo o sustancia en estudio»*. Dicho en corto (Eurachem, 6.1.1): *«el grado en el que un método puede ser utilizado para determinar analitos particulares en mezclas o matrices sin interferencias de otros componentes de comportamiento similar»*.
- **Selectividad o especificidad:** la IUPAC recomienda **selectividad**; el sector farmacéutico usa «especificidad». Es el mismo criterio que ya se fijó en el **tema 24** para los electrodos selectivos.
- **Los dos efectos de una interferencia** (Eurachem 6.1.2), que merecen saberse porque se ven en la recta de calibrado:

| Efecto | Qué hace | En la recta de calibrado |
| --- | --- | --- |
| **Proporcional** («rotacional») | La matriz aumenta o reduce la señal **en proporción** a ella | Cambia la **PENDIENTE**, no la ordenada |
| **Traslacional** («fijo», de fondo o de línea base) | Un interferente da **su propia señal**, haya o no analito | Cambia la **ORDENADA en el origen**, no la pendiente |

> **Y la consecuencia práctica:** *«El método de adiciones estándar solo permite corregir los efectos proporcionales.»* Un fondo constante **no** lo corrige.

- **Cómo se evalúa:** analizando muestras a las que se **añaden a propósito los interferentes probables**, o comparando con **otros métodos independientes**. Para métodos normalizados usados dentro de su alcance, **normalmente ya la estudió el organismo que los publicó**.

#### 2. Límite de detección (LD) y 3. Límite de cuantificación (LC)

Las definiciones que valen en España son **las del RD 3/2023**, que copian las del artículo 3 del RD 817/2015:

> **Límite de detección:** *«en una determinación analítica, valor de concentración o señal de salida por encima del cual se puede afirmar, con un nivel declarado de confianza, que una muestra es diferente de una muestra en blanco, entendiéndose por blanco aquella disolución que no contiene el analito de interés.»*
>
> **Límite de cuantificación:** *«en una determinación analítica, múltiplo constante del límite de detección que se puede determinar con un grado aceptable de exactitud y precisión. El límite de cuantificación se puede calcular utilizando un patrón o muestra adecuada y se puede obtener del punto de calibración más bajo en la curva de calibración, excluido el valor del blanco.»*
>
> Y la exigencia: *«El LC deberá ser siempre inferior al valor paramétrico o valor de referencia»*, y lo mismo el LD.

La diferencia en una frase: **por encima del LD se puede decir «hay»; por encima del LC se puede decir «cuánto hay»**. Entre los dos, el analito **se detecta pero no se cuantifica** con garantías.

**Cómo se calculan** (Guía Eurachem, Referencias Rápidas 2 y 3):

| | Fórmula | De dónde sale |
| --- | --- | --- |
| **LD** | **LD = 3 · s₀′** | Aproximación de validación; el criterio riguroso es el de la IUPAC con α = β = 0,05 |
| **LC** | **LC = k_Q · s₀′**, con **k_Q = 10** por defecto | k_Q = 10 equivale a una **RSD del 10 %** en el LC; a veces se usan **5 o 6** (RSD del **20 %** y del **17 %**) |

- **s₀** es la desviación típica de **10 réplicas** (entre 6 y 15) de **blancos de muestra** o de muestras con **concentración muy baja**, pasadas por **el procedimiento completo**.
- **s₀′** es esa misma s₀ corregida: se divide por **√n** si en rutina se promedian n réplicas, y se multiplica por **√(1/n + 1/n_b)** si cada resultado se corrige con n_b blancos. Ejemplo de Eurachem: con s₀ = 1 mg/kg, una réplica y un blanco, **s₀′ = 1 · √2 = 1,4 mg/kg**.
- **Del instrumento o del método:** si la desviación se saca de blancos inyectados **directamente en el instrumento**, sin pasar por la preparación, sale el **LD del instrumento**. El que sirve para la validación es el **LD del método**.
- **Con la desviación en unidades de señal**, el LD es la concentración que corresponde a **la señal del blanco más 3 s₀′** (Eurachem, RR2, nota 3).
- **Lo que NO es el LD:** *«No debe utilizarse el término "sensibilidad" en lugar de "límite de detección"»* (VIM 4.18, nota 3). Y *«no debe confundirse el límite inferior de un intervalo de medida con el límite de detección»* (VIM 4.7, nota 2): **el intervalo de trabajo empieza en el LC**.
- **El LD es una estimación que varía:** incluso con 10 réplicas, *«la estimación de LOD/LOQ obtenida durante la validación debería ser tomada como un valor indicativo»* (Eurachem 6.2.5.1).

> **Para radiactividad es otra cosa:** los límites de detección de la tabla 14 del RD 3/2023 se calculan con la **UNE-EN ISO 11929**, no con la regla de 3s. Está en el **tema 29**.

#### 4. Rango (intervalo) de trabajo y 5. Linealidad

Es la palabra del enunciado: **«rango de validación»**. La Guía Eurachem lo define así (6.3.1):

> *«El 'intervalo de trabajo' es el intervalo en el cual el método proporciona resultados con una incertidumbre aceptable. **El extremo inferior del intervalo de trabajo está determinado por el límite de cuantificación, LOQ. El extremo superior** del intervalo de trabajo está definido por las concentraciones a las cuales se observan anomalías significativas en la sensibilidad analítica. Un ejemplo de esto es el efecto meseta a altos valores de absorbancia en la espectroscopia UV/VIS.»*

El VIM lo llama **intervalo de medida** (4.7), con dos sinónimos admitidos: **«rango de medida»** o **«campo de medida»**.

![Del LD al final de la recta: el intervalo de trabajo](esquema:intervalo-de-trabajo)

**Cómo se evalúa** (Eurachem, Referencia Rápida 5):

1. **Un blanco y patrones a 6-10 concentraciones espaciadas uniformemente**, cubriendo el intervalo esperado **con un margen del ±10 % o incluso ±20 %**: para un intervalo de 1 a 100 mg/L, de **0,8 a 120 mg/L**. Se mira la curva **a ojo** para localizar el tramo lineal.
2. **Dentro del tramo lineal, 2-3 réplicas a 6-10 concentraciones.** Se calcula la regresión y **se dibujan los residuales**: *«La distribución aleatoria de residuales en torno a cero confirma la linealidad. Las tendencias sistemáticas indican la no linealidad»*.
3. **Con muestras reales o materiales de referencia pasados por todo el procedimiento**, para evaluar el **intervalo del método** (no solo el del instrumento).

Tres matices que se preguntan bien:

- **Hay dos intervalos** (Eurachem 6.3.3): el **del instrumento**, en la concentración que entra al aparato (mg/L de extracto), y el **del método**, en la concentración de la muestra (mg/kg de suelo, por ejemplo). Si hay dilución, extracción o digestión, **no coinciden**.
- **Se establece para cada matriz**, porque las interferencias pueden producir respuestas no lineales.
- **Si la curva no es recta, se puede usar otra función**, pero *«no se recomienda el uso de funciones superiores a las cuadráticas»*. Y si la desviación típica crece con la concentración, **regresión ponderada**. Y *«es peligroso eliminar un valor atípico sin verificarlo primero»*.

> **Cómo se calcula la recta** (mínimos cuadrados, pendiente, ordenada, **R²**) es del **tema 39**. Aquí basta con saber que **un R² alto no demuestra por sí solo la linealidad**: lo que la demuestra es que **los residuales no tengan tendencia**.

#### 6. Sensibilidad

- **Definición (VIM 4.12):** *«cociente entre la variación de una indicación de un sistema de medida y la variación correspondiente del valor de la magnitud medida»*. **Es la pendiente de la curva de respuesta.**
- Eurachem recomienda llamarla **«sensibilidad analítica»** para no confundirla con la «sensibilidad diagnóstica» de los laboratorios clínicos, y avisa de que **no es una característica muy importante**. Sirve sobre todo para **comprobar el instrumento** contra un valor teórico: la pendiente **nernstiana de 59 mV por unidad de pH** de un electrodo de vidrio (**tema 23**) o la absorbancia prevista por **Lambert-Beer** (**tema 25**).
- **Sensibilidad no es límite de detección.** Un método puede tener mucha pendiente y un LD malo si el blanco es muy ruidoso.

#### 7. Veracidad (sesgo)

La veracidad **no se puede medir** —haría falta un número infinito de medidas—, pero se evalúa **con el sesgo**: la diferencia entre la media de los resultados y un **valor de referencia** fiable (Eurachem 6.5.2). Hay **tres formas** de conseguir ese valor de referencia:

| Vía | Qué se hace | Cómo se expresa | Su límite |
| --- | --- | --- | --- |
| **a) Material de referencia** (mejor **certificado**, MRC) | Analizarlo **10 veces** y comparar la media con el valor certificado | **b = x̄ − x_ref**; **b(%) = (x̄ − x_ref)/x_ref · 100**; o recuperación aparente **R(%) = x̄/x_ref · 100** | Hay pocos MRC, y **el MRC debe ser de la misma matriz y concentración parecida** |
| **b) Recuperación de adiciones** | Añadir una cantidad conocida de analito a la muestra (o a un blanco de matriz) y medir las dos | **R′(%) = (x̄′ − x̄)/x_adición · 100** | **Da una estimación optimista**: el analito añadido está menos «agarrado» a la matriz que el natural |
| **c) Comparación con otro método** | Medir las mismas muestras por el método candidato y por uno de referencia (o por el que se va a sustituir) | Igual que a), con la media del otro método | Si el otro método tiene sesgo, **no da la veracidad absoluta** |

Tres reglas de la Guía Eurachem que dan preguntas:

- *«La evaluación del sesgo requiere de un valor de referencia fiable, **preferiblemente un MRC con la misma matriz y en concentraciones del analito similares a las muestras reales**»* (5.4.5). **Es exactamente la respuesta de 1322 C2 #10**: agua de consumo, 5 mg/L; no agua desionizada, y no por debajo del LD.
- *«Un MR usado para la calibración **no debería utilizarse para evaluar el sesgo**»* (6.5.2). Cada material, **para un solo fin**.
- **MR frente a MRC:** el MR puede ser *«cualquier material empleado como valor de referencia»*, estable y homogéneo; el **MRC** lleva además un **certificado** con su valor, su **incertidumbre** y su **trazabilidad metrológica** (cómo se producen y certifican: **tema 39**).

**El sesgo tiene dos capas** (Eurachem, figura 5): el **sesgo del método** (inherente a él, lo tenga quien lo tenga) y el **sesgo del laboratorio** (el que añade cada laboratorio). **Un laboratorio aislado solo puede medir la suma.** En los métodos **empíricos** —los definidos por su propio procedimiento, como la DBO₅ (**tema 34**)— **el sesgo del método es cero por definición**.

#### 8. Precisión

- Se estudia en **repetibilidad** y en **precisión intermedia** (el laboratorio solo puede medir la reproducibilidad participando en un estudio entre laboratorios).
- **Cuántas réplicas:** **6-15 por material**, y **independientes**: cada réplica repite **todo** el procedimiento, preparación incluida (Eurachem 6.6.2.1).
- **Con qué:** materiales representativos de las muestras **en matriz y concentración**, homogéneos y estables, pero **no hace falta que sean MRC**.
- **A varias concentraciones**, porque la precisión depende de ella: cerca del LD, la desviación típica es casi constante; lejos, **crece con la concentración**, y entonces se expresa mejor como **RSD** (desviación típica relativa, o coeficiente de variación), que se mantiene aproximadamente constante.
- **Diseño eficiente:** duplicados en **8-15 días distintos** con **ANOVA** de un factor dan a la vez la repetibilidad (varianza dentro de grupos) y la precisión intermedia (raíz cuadrada de la suma de las dos varianzas) (Eurachem 6.6.4).

**El límite de repetibilidad (r)** es un número que da mucho juego (Eurachem 6.6.3):

> **r = √2 · t · s_r ≈ 2,8 · s_r**
>
> Es la diferencia máxima que cabe esperar, con un 95 % de confianza, **entre dos resultados de la misma muestra** obtenidos en condiciones de repetibilidad. El **√2** está porque es **una diferencia entre dos medidas**, y **t** es la t de Student, que con muchos grados de libertad y al 95 % vale **≈ 2**: √2 · 2 = 2,83. El **límite de reproducibilidad R** se calcula igual con s_R.

Las normas UNE que llevan estudio colaborativo **publican r y R**, y es con ellas con las que el laboratorio **verifica** que alcanza la precisión del método.

#### 9. Robustez

- **Definición** (Eurachem 6.8.1, citando al sector farmacéutico): *«una medida de su capacidad para permanecer no afectado por pequeñas variaciones premeditadas de los parámetros del método»*.
- **Cómo se evalúa:** cambiando **a propósito y un poco** las condiciones críticas (temperatura, pH, tiempo de extracción, caudal…) y viendo cuánto cambia el resultado. Con **diseños de experimentos**: con el de **Plackett-Burman** se estudian **7 factores en 8 experimentos**.
- **Para qué sirve:** para saber **qué variables hay que controlar estrictamente**, y escribir sus **tolerancias** en el procedimiento (el ejemplo de Eurachem es la ISO 11732 del amonio: *«NH₄Cl secado hasta masa constante a 105 ± 2 °C»*).
- **Cuándo NO hace falta:** en un método normalizado usado dentro de su alcance, **la robustez ya se estudió al normalizarlo**.
- **Terminología:** la 3.ª edición de Eurachem (2025) prefiere el término de la IUPAC, ***ruggedness***, y reserva *robustness* para otros usos; en español la ISO/IEC 17025 y el RD dicen **robustez**. **Es lo mismo.**

#### 10. Incertidumbre

Es la característica que **resume todas las demás** en un solo número, y la que el RD exige con valores concretos. Tiene su propio apartado, el **2.6**.

### 2.4. Criterios de aceptación: cuánto es «suficiente»

Evaluar una característica no basta: hay que **compararla con un requisito**. Ese requisito se fija **antes** de validar, a partir del **uso previsto**. El VIM tiene nombre para el de la incertidumbre: **incertidumbre objetivo** (2.34), *«especificada como un límite superior y elegida en base al uso previsto de los resultados de medida»*.

En un laboratorio de aguas, **el requisito lo pone la ley**:

#### Agua de consumo: RD 3/2023, anexo III, parte D

> *«…el método de análisis utilizado será capaz, como mínimo, de medir concentraciones iguales al valor paramétrico o al valor de referencia con un **límite de cuantificación igual o inferior al 30 % del valor paramétrico** pertinente… y una incertidumbre de medida como se especifica en el Tabla 15.»*
>
> *«El criterio de rendimiento para la incertidumbre de medición **(k = 2)** es el porcentaje del valor paramétrico indicado en la tabla o cualquier valor más estricto. La incertidumbre de medición **se estimará al nivel del valor paramétrico** o valor de referencia, a menos que se especifique lo contrario.»*
>
> ***«La incertidumbre de medida establecida en la tabla siguiente no se utilizará como tolerancia adicional a los valores paramétricos establecidos en el anexo I.»***

Algunos valores de la **tabla 15**, para ver el orden de magnitud (la lista por parámetro, con sus técnicas, está en el **tema 33**):

| Parámetro | Incertidumbre máxima (k = 2), % del valor paramétrico |
| --- | --- |
| Nitrato, nitrito… | **15 %** y **20 %** |
| Cloruro, sulfato, sodio, calcio, conductividad, **alcalinidad** | **15 %** |
| Cloro libre residual | **25 %** |
| **Amonio**, **dureza**, trihalometanos, benceno | **40 %** |
| **Turbidez** | **30 %**, estimada **al nivel de 1 UNF** (nota 9) |
| **Oxidabilidad**, **PFAS**, bisfenol A, **benzo(a)pireno** | **50 %** (el B(a)P, *«hasta 60 %»* si no se alcanza con la mejor técnica) |
| **Plaguicidas** | **30 %**, pero *«podrán permitirse valores más elevados, de hasta el 80 %»* con algunos |
| **pH** | **0,2 unidades de pH**: el **único** que no va en porcentaje (nota 4) |

Y dos obligaciones de cierre de la parte D: los laboratorios **deben notificar en SINAC** sus acreditaciones, **la incertidumbre, el límite de cuantificación y el límite de detección de cada método**.

#### Aguas superficiales: RD 817/2015, anexo III, apartado C

El otro real decreto de aguas pone **un criterio único para todo**, más sencillo de recordar:

> *«Todos los métodos de análisis aplicados se basarán en una **incertidumbre de medida del 50 % o menos (k=2)** estimada al nivel de las NCAs y un **límite de cuantificación igual o inferior a un valor del 30 % de las NCA** pertinentes.»*

Y resuelve un problema práctico que el examen puede plantear: **cómo se promedian los resultados por debajo del LC**. *«Los resultados de la medición se fijarán en **la mitad del valor del límite de cuantificación**»*, salvo en los parámetros que son **sumas** de un grupo, donde se fijan **en cero**.

| | Agua de consumo (RD 3/2023) | Aguas superficiales (RD 817/2015) |
| --- | --- | --- |
| Límite de cuantificación | **≤ 30 % del valor paramétrico** | **≤ 30 % de la NCA** |
| Incertidumbre (k = 2) | **La de la tabla 15**, parámetro a parámetro (15-50 %; pH en unidades) | **≤ 50 %**, igual para todos |
| Dónde se estima | Al nivel del **valor paramétrico** | Al nivel de la **NCA** |
| Si no hay método que cumpla | *«Las mejores técnicas disponibles que no conlleven costos excesivos»* | Lo mismo: *«mejores técnicas disponibles que no acarreen costes desproporcionados»* |

#### Cuando no hay ley

Si no hay requisito legal, **lo fija el laboratorio con el cliente**. En la práctica, dice Eurachem, se suele fijar **a partir de lo que se sabe que el método puede dar**: los datos de precisión de la norma, los resultados de ensayos de aptitud o modelos como la **función de Horwitz**. Y el Nordtest da una regla de andar por casa: sin otro requisito, **una incertidumbre expandida objetivo del orden del doble de la reproducibilidad, U ≈ 2·s_R**.

### 2.5. Sistemática de validación

#### El proceso

La Guía Eurachem lo dibuja como un bucle (figura 1):

1. **Necesidad del cliente** → **establecer los requisitos analíticos** (qué analito, qué nivel, qué matriz, qué incertidumbre).
2. **Identificar un método existente** o desarrollar uno nuevo. *«Hay que tener en cuenta que algunas normas legales obligan a seguir determinados métodos.»*
3. **Documentar el procedimiento.** *«Este procedimiento documentado es el que se toma para la validación formal del método.»* No se valida un borrador.
4. **Evaluar su desempeño** con los experimentos de las características.
5. **¿Es adecuado al uso?** → **Sí**: informe de validación y uso del método. **No**: seguir desarrollando, o **revisar los requisitos**; si no es posible ninguna de las dos, **el método no se puede usar**.

El RD 3/2023 lo dice en su propia prosa (parte E.1): la validación *«comprende un conjunto de **pruebas sistemáticas y programadas** que tenga en cuenta **todas las etapas del análisis de rutina**, incluyendo preparación (extracción, pre-concentración, etc.)»*, y debe confirmar que el método funciona *«en todo el rango de concentraciones habituales y en las matrices de análisis a analizar»*.

#### Qué debe contener el procedimiento del método (RD 3/2023, parte E.1.c)

La ley da un **contenido tipo** de once puntos. Lo transcribo porque es una lista cerrada que se presta a pregunta:

> *«1.º Identificación apropiada; 2.º Alcance; 3.º Descripción del tipo de muestra a ensayar; 4.º Parámetros y rangos a determinar; 5.º Aparatos y equipos, incluyendo las especificaciones técnicas; 6.º Patrones y materiales de referencia necesarios; 7.º Condiciones ambientales requeridas y cualquier período de estabilización necesario; 8.º Descripción del procedimiento…; 9.º Criterios o requisitos de aceptación/rechazo; 10.º Datos que deban registrarse y método de análisis y presentación; 11.º Incertidumbre o procedimiento para estimar la incertidumbre.»*

#### El plan y el informe de validación

La Guía Eurachem (5.3) propone un modelo que **combina plan e informe** en un solo documento:

| Sección | Qué lleva |
| --- | --- |
| **Título** | Qué método, cuándo, quién validó; su estado (norma, desarrollo interno…), el analito, el **mensurando**, la unidad, el tipo de muestra y el **uso previsto** |
| **Planificación** | El **propósito** (validación completa, verificación de un normalizado, ampliación de alcance…) y **qué características se van a evaluar, con qué requisitos** |
| **Características de desempeño** | **Una sección por característica**: qué es, qué se exige, qué experimento se hace, cómo se evalúa, **resultado y conclusión** |
| **Resumen** | Todo lo anterior, las consecuencias para el **control de calidad** interno y externo, y ***la declaración sobre la adecuación al uso*** |

#### Las herramientas

| Herramienta | Para qué sirve en la validación |
| --- | --- |
| **Blanco de reactivos** | Ver si los reactivos dan señal; aplicado a todo el procedimiento se llama **blanco de ensayo** |
| **Blanco de muestra** (de matriz) | Matriz **sin analito**: la mejor estimación de las interferencias reales, y de s₀ para el **LD y el LC** |
| **Muestras de rutina** | Precisión en condiciones reales |
| **Muestras fortificadas** (con adición) | **Recuperación**, y el efecto de interferentes añadidos |
| **MR y MRC** | **Veracidad** (sesgo) y calibración, **cada uno para un solo fin** |
| **Estadística** | Pruebas de significación, regresión, ANOVA |

#### Cuánto hay que validar: la extensión

*«La validación es siempre un equilibrio entre costos, riesgos y posibilidades técnicas»* (Eurachem 5.2). No todas las características se estudian siempre:

| Situación | Qué se hace | Qué características, típicamente |
| --- | --- | --- |
| **Método desarrollado por el laboratorio** | **Validación completa** | **Todas**: selectividad, LD, LC, intervalo y linealidad, sensibilidad, veracidad, precisión, **robustez** e incertidumbre |
| **Normalizado fuera de su alcance, o modificado** | **Validación** de lo que cambia | Las afectadas por el cambio: si es una matriz nueva, selectividad, veracidad, precisión e intervalo **en esa matriz** |
| **Normalizado dentro de su alcance** | **Verificación** | **Precisión y veracidad** (*«habitualmente, es suficiente… obtener la repetibilidad indicada y comprobar si hay algún sesgo»*, Eurachem 7), más LD/LC e incertidumbre cuando el uso lo pide. **Ni robustez ni selectividad**: ya las estudió el organismo que la publicó |
| **Equipo nuevo, traslado** | **Verificación** | Las que el cambio puede afectar |

El RD 3/2023 lo deja igual de abierto: *«La amplitud del proceso de validación depende de varios factores, tales como la naturaleza del método (cualitativo o cuantitativo), la existencia de normas internacionales o el establecimiento de matrices equivalentes.»*

#### Y después de validar

La validación demuestra que el método funciona **el día que se valida**. Para demostrar que **sigue** funcionando está el **control de calidad**, que es del **tema 39**. Lo único que hay que saber aquí es **qué le entrega la validación**: la **precisión intermedia**, con la que se fijan los **límites del gráfico de control** (aviso a **±2s**, acción a **±3s**), y el orden de magnitud de un control razonable, **en torno al 5 % de las muestras (una de cada 20)**, según Eurachem (8.2).

#### Validación microbiológica y de kits (RD 3/2023, parte E.3 y parte F)

El mismo anexo trae una parte para microbiología que conviene tener a mano (el desarrollo es de los temas de microbiología):

- **Métodos cualitativos** («de investigación»: presencia/ausencia) → **como mínimo, el límite de detección**; y si hace falta, **sensibilidad, especificidad, falsos positivos, falsos negativos, eficiencia o selectividad**.
- **Métodos cuantitativos** («de detección y recuento») → **estudios de recuperación y precisión** en todo el rango de trabajo, con niveles según la técnica: **incorporación en placa, reparto (extensión) en placa o filtración en membrana**.
- **La incertidumbre en microbiología se limita a los métodos de recuento.** *«No es de aplicación a métodos cualitativos ni NMP.»*
- **Kits** (parte F): el laboratorio **debe exigir al fabricante** la información de validación del kit: rango de medida, LD y LC **con estudios en matriz**, especificidad, selectividad, sensibilidad, precisión, recuperación, linealidad, robustez, variabilidad **inter e intra-lote**, el protocolo de validación y sus limitaciones.

### 2.6. Cálculo de incertidumbres

#### Qué es, y por qué se calcula

> **Incertidumbre de medida (VIM 2.26):** *«parámetro no negativo que caracteriza la dispersión de los valores atribuidos a un mensurando, a partir de la información que se utiliza»*. El RD 3/2023 y el RD 817/2015 la definen con las mismas palabras.

Un resultado **sin incertidumbre está incompleto**: no se puede comparar con otro laboratorio ni con un límite legal. Por eso la ISO/IEC 17025 exige evaluarla (cláusula **7.6**) y el RD exige **notificarla en SINAC** por cada método.

#### Tipo A y tipo B

La primera clasificación **no es por el origen del error, sino por cómo se evalúa**:

| | Definición (VIM) | Ejemplos |
| --- | --- | --- |
| **Evaluación tipo A** (2.28) | *«mediante un análisis estadístico de los valores medidos obtenidos bajo condiciones de medida definidas»* | La **desviación típica** de réplicas: la repetibilidad, la precisión intermedia de una muestra de control |
| **Evaluación tipo B** (2.29) | *«de manera distinta a una evaluación tipo A»* | Los ejemplos del propio VIM: **valores publicados**, **el valor de un material de referencia certificado**, **un certificado de calibración**, **la deriva**, **la clase de exactitud** de un instrumento verificado, **la experiencia personal** |

**Las dos valen lo mismo** una vez convertidas a desviación típica. Tipo A no quiere decir «más fiable».

#### Paso 1 de todo cálculo: convertir cada componente en incertidumbre típica

**Incertidumbre típica (VIM 2.30):** *«incertidumbre de medida expresada como una desviación típica»*. Antes de combinar nada, **todo** se pasa a desviación típica (QUAM 8.1). Las reglas:

| Lo que se tiene | Qué se supone | Incertidumbre típica u | Ejemplo |
| --- | --- | --- | --- |
| Una **desviación típica** de réplicas | — | **u = s** (y **s/√n** si el resultado es la media de n) | Tipo A |
| Una **U con su k** (un certificado) | Normal | **u = U / k** | Certificado de un MRC: **11,5 ± 0,5 (k = 2)** → u = **0,25** |
| Un intervalo **al 95 %** sin k | Normal | **u = a / 1,96** (a / 2 en la práctica) | Balanza **±0,2 mg al 95 %** → u = 0,1 mg |
| Límites **±a** sin más información, y los extremos **son tan probables** como el centro | **Rectangular** | **u = a / √3** | Matraz de 10 mL **±0,2 mL** → u = **0,12 mL** |
| Límites **±a**, pero los extremos **son raros** | **Triangular** | **u = a / √6** | El mismo matraz, si el control interno muestra que los extremos son infrecuentes → u = **0,08 mL** |
| La **resolución** de un indicador digital | Rectangular de anchura total = res | **u = res / √12** | La aplicada al pHímetro en el **tema 23** |

(Los ejemplos del matraz y de la balanza son los de la guía **QUAM**, 8.1; el del certificado, del **Nordtest**, 6.1. Las fórmulas, de la **GUM**, 4.3.)

**La rectangular es la más conservadora** (da la u más grande de las tres) y por eso es la que se usa **cuando no se sabe nada** de cómo se reparten los valores dentro de los límites.

#### Paso 2: combinarlas, EN CUADRATURA

**Incertidumbre típica combinada (VIM 2.31, GUM 2.3.4):** la que se obtiene de las incertidumbres de las magnitudes de entrada, *«igual a la raíz cuadrada positiva de una suma de términos, siendo éstos las varianzas o covarianzas de esas otras magnitudes»*.

Las dos reglas prácticas de la guía **QUAM** (8.2.6) cubren casi todos los casos:

| Si el resultado es… | Se combinan… | Fórmula |
| --- | --- | --- |
| **Una suma o resta** (y = p + q − r) | Las incertidumbres **ABSOLUTAS**, en cuadratura | **u(y) = √(u(p)² + u(q)² + u(r)²)** |
| **Un producto o cociente** (y = p · q / r) | Las incertidumbres **RELATIVAS**, en cuadratura | **u(y)/y = √((u(p)/p)² + (u(q)/q)² + (u(r)/r)²)** |

![Las incertidumbres se suman en cuadratura: uc es la hipotenusa](esquema:incertidumbre-en-cuadratura)

**En cuadratura, no sumando.** Es la idea más importante del cálculo: las incertidumbres **no se suman aritméticamente**, se suman **como los catetos de un triángulo rectángulo**, y la combinada es **la hipotenusa**. La razón es que errores independientes **a veces se compensan**: sumarlos directamente supondría que todos van siempre a la vez en el peor sentido. Tres consecuencias:

- **La combinada siempre es menor que la suma** de las componentes, y **mayor que la mayor** de ellas.
- **Manda la componente más grande.** Por eso *«aquellos que son menores de un tercio del total no necesitan ser evaluados en detalle»* (QUAM 7.2.2): uno que sea un tercio del mayor aporta **menos de un 6 %** a la combinada.
- **Si dos magnitudes están correlacionadas**, hay que añadir las **covarianzas** (VIM 2.31, nota). Y *«es importante no contabilizar dos veces las mismas componentes de incertidumbre»* (GUM 4.3.10): si la repetibilidad ya recoge un efecto, no se suma otra vez.

#### Paso 3: expandirla

**Incertidumbre expandida (VIM 2.35):** *«producto de una incertidumbre típica combinada y un factor mayor que uno»*. Ese factor es el **factor de cobertura, k** (VIM 2.38).

> **U = k · uc**
>
> - **k = 2** → intervalo con una probabilidad de cobertura de **aproximadamente el 95 %** (exactamente **95,45 %** para una distribución normal).
> - **k = 3** → **aproximadamente el 99 %** (GUM 6.3.3).
> - Si la combinada **depende sobre todo de una componente con pocos datos (menos de 6 grados de libertad)**, k se toma de la **t de Student**. Ejemplo de la QUAM: 5 pesadas (4 grados de libertad) → **k = 2,8**.

**En España, por ley, k = 2**: el RD 3/2023 da la tabla 15 con **k = 2**, y el RD 817/2015 su 50 % también. **Con una excepción que es una trampa de examen:** para **radionucleidos**, la nota 2 de la tabla 14 del RD 3/2023 manda expresar la incertidumbre *«con un factor de expansión del **1,96**»*.

#### Los dos caminos para llegar a uc

**Camino 1 — Modelizar el método, componente a componente** («de abajo arriba», GUM y QUAM). Los **cuatro pasos** de la QUAM (sección 4):

1. **Especificar el mensurando**: qué se mide y la **ecuación** que lo relaciona con las magnitudes de entrada.
2. **Identificar las fuentes** de incertidumbre. La herramienta es el **diagrama de causa y efecto** (**espina de pescado** o **diagrama de Ishikawa**).
3. **Cuantificar** cada componente y **convertirla en incertidumbre típica**.
4. **Combinar** y **expandir**.

Es el camino de los **laboratorios de calibración**, y el del pHímetro en el **tema 23**. Su defecto, según el Nordtest: *«se ha demostrado que en muchos casos este enfoque subestima la incertidumbre»*, porque es difícil no dejarse ninguna fuente.

**Camino 2 — Usar los datos de validación y de control de calidad** («de arriba abajo»). Es el camino de los **laboratorios de ensayo**, y el de la **ISO 11352:2025**, específica de **análisis de agua**, que se basa **principalmente en el Nordtest TR 537**. Toda la incertidumbre se resume en **dos componentes**:

> **uc = √( u(Rw)² + u(sesgo)² )**
>
> - **u(Rw)**: la **precisión intermedia** del laboratorio (*within-laboratory reproducibility*), sacada de una **muestra de control** medida durante mucho tiempo —**preferiblemente al menos un año**— que pase por **todo el procedimiento**. Recoge el **error aleatorio**.
> - **u(sesgo)**: el **error sistemático** del método y del laboratorio, sacado de **MRC**, de **ensayos de aptitud** o de **recuperaciones**: **u(sesgo) = √(RMS_sesgo² + u(C_ref)²)**, donde **RMS_sesgo** es la media cuadrática de los sesgos observados y **u(C_ref)** la incertidumbre de los valores de referencia.

**Es exactamente la respuesta de 1246 #19:** para el cálculo de la incertidumbre de un método se necesitan **la precisión** —u(Rw)— y **la exactitud en el sentido de veracidad** —u(sesgo)—.

El Nordtest lo explica con una **escalera de cuatro peldaños** de error, y cada peldaño suma incertidumbre:

| Peldaño | Error | Lo recoge |
| --- | --- | --- |
| 1 | **Sesgo del método** (sistemático) | **u(sesgo)** |
| 2 | **Sesgo del laboratorio** (sistemático) | **u(sesgo)** |
| 3 | **Variación de un día a otro** (aleatorio) | **u(Rw)** |
| 4 | **Repetibilidad** (aleatorio) | **u(Rw)** |

Y un **tercer camino**, más corto: si el laboratorio aplica una norma con estudio colaborativo, tiene un sesgo pequeño y su precisión es comparable a la publicada, **la desviación típica de reproducibilidad s_R de la norma sirve como incertidumbre típica combinada** (Eurachem 6.7; ISO 21748).

> **Un aviso del Nordtest que se entiende con números:** la incertidumbre expandida calculada así sale **entre 2 y 5 veces mayor** que la simple s(Rw) del control interno. No es que el laboratorio haya empeorado: es que ahora **se está contando también el sesgo** y multiplicando por k.

#### Dos cálculos resueltos, con los números del Nordtest

**Ejemplo 1 — Amonio en agua por EN ISO 11732 (Nordtest 3.2):**

| Paso | Dato | Cálculo | Resultado |
| --- | --- | --- | --- |
| u(Rw) | Muestra de control de 200 µg/L con **límites de control (2s) de ±3,34 %** | 3,34 / 2 | **1,67 %** |
| u(sesgo) | Seis ensayos de aptitud: sesgos de +2,5; +2,7; +1,9; +1,4; +1,8 y +2,9 %. **RMS_sesgo = 2,26 %**; **u(C_ref) = 1,52 %** | √(2,26² + 1,52²) | **2,73 %** |
| uc | — | √(1,67² + 2,73²) | **3,20 %** |
| U | k = 2 | 2 · 3,20 | **6,40 % → se informa ±7 %** |

**Ejemplo 2 — El sesgo con un único MRC (Nordtest 6.1).** Valor certificado **11,5 ± 0,5** (95 %); media del laboratorio **11,9**, con s = 2,2 % en **12** medidas:

| Componente | Cálculo | Valor |
| --- | --- | --- |
| u(C_ref) | (0,5 / 2) / 11,5 · 100 | **2,16 %** |
| Sesgo | (11,9 − 11,5) / 11,5 · 100 | **3,48 %** |
| u(sesgo) | √(3,48² + (2,2/√12)² + 2,16²) | **4,1 %** |

Con un solo MRC la fórmula lleva **un término más**, la desviación típica de las medidas del MRC dividida por √n.

#### Incertidumbre absoluta o relativa

Cerca del LD, la incertidumbre es **casi constante en unidades** (µg/L); a concentraciones altas, **casi constante en porcentaje**. Por eso el Nordtest (sección 4) propone **partir el intervalo de trabajo**: incertidumbre **absoluta** en el tramo bajo y **relativa** en el alto. Y para el **pH, siempre absoluta**, que es justo lo que hace el RD 3/2023 (0,2 unidades de pH).

El RD 3/2023 da la misma idea con otras palabras (parte E.4, *«Asignación de la incertidumbre al método»*): se calcula la incertidumbre expandida en **distintos niveles, incluyendo el límite de cuantificación**, y en las matrices de estudio, y luego:

> *«a) Establecer **diferentes valores de incertidumbre del método según el nivel de concentración** en caso que sean muy diferentes;*
>
> *b) Tomar como incertidumbre del método **la más desfavorable** evaluada en los niveles de concentración estudiados. Este criterio penaliza los niveles de concentración con incertidumbres menores.»*

#### Cómo se escribe el resultado

- **Resultado ± U, con unidades, y diciendo k y la probabilidad de cobertura.** El modelo de la QUAM (9.4): *«Nitrógeno total: (3,52 ± 0,14) g/100 g — la incertidumbre informada es una incertidumbre expandida calculada usando un factor de cobertura de 2, lo que da un nivel de confianza de aproximadamente el 95 %»*.
- **U con una o, como mucho, dos cifras significativas** (GUM 7.2.6; QUAM 9.5), y **el resultado redondeado a la misma posición decimal que U**. El Nordtest redondea **hacia arriba** (6,40 % → 7 %), *«aunque debe prevalecer el sentido común»*.
- **La incertidumbre NO es un margen a favor**: en agua de consumo, *«no se utilizará como tolerancia adicional a los valores paramétricos»* (RD 3/2023, parte D.3). Cómo se decide si un resultado cumple un límite —la **regla de decisión**— es un asunto de la ISO/IEC 17025 (cláusula 7.1.3) y de ENAC (**tema 40**).

---

## 3. Tabla operativa

**Cada característica de validación, en una línea:**

| Característica | Qué mide | Cómo se evalúa | Cálculo o criterio | Referencia |
| --- | --- | --- | --- | --- |
| **Selectividad** | Que la señal sea solo del analito | Muestras con **interferentes añadidos**; comparación con métodos independientes | Proporcional → pendiente; traslacional → ordenada. **Adiciones estándar solo corrige el proporcional** | VIM 4.13; Eurachem 6.1 |
| **Límite de detección** | Lo mínimo que se distingue del blanco | **10 réplicas** (6-15) de blancos de muestra o muestras de nivel bajo, por **todo** el procedimiento | **LD = 3 · s₀′** | RD 3/2023 parte D; VIM 4.18; Eurachem RR2 |
| **Límite de cuantificación** | Lo mínimo que se mide con exactitud aceptable | Las mismas 10 réplicas | **LC = 10 · s₀′** (RSD del 10 %). **LC ≤ 30 % del valor paramétrico** (consumo) o de la **NCA** (superficiales) | RD 3/2023 parte D; RD 817/2015 anexo III C; Eurachem RR3 |
| **Rango de trabajo** | Entre qué concentraciones el resultado vale | Patrones a **6-10 niveles**, **±10-20 %** más allá del intervalo esperado | **Del LC** al punto donde **la sensibilidad deja de ser constante** | Eurachem 6.3; VIM 4.7 |
| **Linealidad** | Que la respuesta sea proporcional | **2-3 réplicas a 6-10 niveles**; regresión y **residuales** | Residuales **aleatorios en torno a cero**; como mucho, función **cuadrática** | Eurachem RR5 |
| **Sensibilidad** | Cuánto cambia la señal por unidad de concentración | La **pendiente** de la recta | Comparar con un valor teórico (**59 mV/pH**, Lambert-Beer) | VIM 4.12; Eurachem 6.4 |
| **Veracidad** | Error sistemático | **MRC** (misma matriz, concentración similar), **recuperación de adiciones** o **comparación con otro método**, 10 réplicas | **b = x̄ − x_ref**; **R′(%) = (x̄′ − x̄)/x_adición · 100** | Eurachem 6.5, RR6 |
| **Precisión** | Error aleatorio | **6-15 réplicas** independientes, en **repetibilidad** y en **precisión intermedia**; ANOVA | **s, RSD**; límite de repetibilidad **r ≈ 2,8 · s_r** | VIM 2.15-2.25; Eurachem 6.6 |
| **Robustez** | Estabilidad ante pequeños cambios | Cambios **deliberados** de las condiciones; **Plackett-Burman**: **7 factores en 8 ensayos** | Tolerancias escritas en el procedimiento. **No se exige en un normalizado dentro de alcance** | Eurachem 6.8 |
| **Incertidumbre** | Todo junto, en un número | Datos de validación y control de calidad | **uc = √(u(Rw)² + u(sesgo)²)**; **U = 2 · uc**; ≤ tabla 15 (consumo) o **≤ 50 %** (superficiales) | RD 3/2023 tabla 15; RD 817/2015; Nordtest; ISO 11352 |

**Los números del cálculo de incertidumbre:**

| Dato | Valor |
| --- | --- |
| Rectangular (límites ±a, sin más información) | **u = a/√3** |
| Triangular (extremos improbables) | **u = a/√6** |
| Resolución de un indicador digital | **u = res/√12** |
| Certificado con U y k | **u = U/k** |
| Intervalo al 95 % | **u = a/1,96** |
| k = 2 | **≈ 95 %** (95,45 % en una normal) |
| k = 3 | **≈ 99 %** |
| Radionucleidos, RD 3/2023 (tabla 14, nota 2) | **k = 1,96** |
| Componentes despreciables | Las **menores de un tercio** de la mayor |
| Cifras de U | **Una o dos** significativas |

---

## 4. Puntos críticos para el examen

**1. Para calcular la incertidumbre de un método se necesitan la EXACTITUD (veracidad, sesgo) y la PRECISIÓN** (1246 #19). **No** el LD y el LC, **ni** la sensibilidad y la selectividad.

**2. Validar es verificar que los requisitos son adecuados PARA UN USO PREVISTO** (VIM 2.45). Toda validación es una verificación; no al revés.

**3. Se VALIDA** un método **no normalizado**, **desarrollado por el laboratorio**, o **normalizado usado fuera de su alcance o modificado**. **Se VERIFICA** un método **normalizado dentro de su alcance** (ISO/IEC 17025, 7.2.2.1 y 7.2.1.5).

**4. La validación termina con una DECLARACIÓN DE APTITUD para el uso previsto** (RD 3/2023, parte E; ISO/IEC 17025, 7.2.2.4).

**5. Exactitud = veracidad + precisión.** La **veracidad** va con el **error sistemático** y se mide con el **sesgo**; la **precisión** va con el **aleatorio** y se mide con la **desviación típica**. La exactitud **no se expresa numéricamente**.

**6. Repetibilidad < precisión intermedia < reproducibilidad.** Lo que cambia: **nada** / **días, analistas y equipos** / **el laboratorio**.

**7. Los diez parámetros del RD 3/2023** (anexo III, parte E.2): selectividad, rango de trabajo, linealidad, sensibilidad, LD, LC, robustez, precisión, veracidad (sesgo) e incertidumbre. **Los tres imprescindibles: veracidad, precisión e incertidumbre.**

**8. LD = 3 s₀′ y LC = 10 s₀′**, con **10 réplicas** de blancos por todo el procedimiento. **El intervalo de trabajo empieza en el LC, no en el LD.**

**9. LC ≤ 30 % del valor paramétrico**, y la **incertidumbre (k = 2) de la tabla 15**, estimada **al nivel del valor paramétrico** y **nunca como tolerancia adicional** (RD 3/2023). En **aguas superficiales**: **U ≤ 50 %** y **LC ≤ 30 % de la NCA** (RD 817/2015).

**10. El MRC para la veracidad: MISMA MATRIZ y CONCENTRACIÓN PARECIDA** a las muestras (1322 C2 #10). Y **el MR de la calibración no sirve para el sesgo**.

**11. La recuperación de adiciones da una estimación OPTIMISTA** del sesgo: lo añadido está menos ligado a la matriz que lo natural.

**12. Sensibilidad es la PENDIENTE**, no el límite de detección.

**13. Las incertidumbres se combinan EN CUADRATURA** (raíz de la suma de cuadrados), **nunca sumándolas**. Sumas → absolutas; productos y cocientes → **relativas**.

**14. Rectangular a/√3; triangular a/√6; U = k · uc con k = 2 ≈ 95 %.** Los **radionucleidos**, con **k = 1,96**.

**15. Tipo A = estadística de réplicas; tipo B = cualquier otra cosa** (certificados, tolerancias, experiencia). No es una clasificación por la fiabilidad.

**16. Límite de repetibilidad r ≈ 2,8 · s_r**: la diferencia máxima esperable, al 95 %, entre dos resultados de la misma muestra.

**17. Robustez: cambios pequeños y deliberados**; con Plackett-Burman, **7 factores en 8 experimentos**. **No hace falta en un normalizado usado dentro de su alcance.**

**18. Las adiciones estándar corrigen el efecto PROPORCIONAL (pendiente), no el de fondo (ordenada).**

**19. La incertidumbre microbiológica solo se estima en los métodos de RECUENTO**; no en cualitativos **ni en NMP** (RD 3/2023, parte E.3).

---

## Reparto con los temas vecinos

| Contenido | Dónde |
| --- | --- |
| Calibrar, verificar y ajustar un instrumento; balanza y pesas patrón | Tema 21 |
| Incertidumbre de la calibración de un pHímetro (QU-003) | Tema 23 |
| Selectividad de los electrodos (coeficiente de Nikolsky) | Tema 24 |
| Lambert-Beer y sus desviaciones (el final del tramo lineal) | Tema 25 |
| Límites de detección de radionucleidos (UNE-EN ISO 11929) | Tema 29 |
| Resolución cromatográfica y materiales de referencia en cromatografía | Temas 30 a 32 |
| Valores paramétricos y la tabla 15 parámetro a parámetro | Tema 33 |
| Métodos empíricos (DBO₅), vertidos | Tema 34 |
| Objetivos de calidad de los datos en aire (25 %, 40 %, 50 %) | Tema 37 |
| **Patrones primarios, materiales de referencia, trazabilidad, calibración lineal, R², control de calidad y ensayos de aptitud** | **Tema 39** |
| **ISO/IEC 17025, ENAC, acreditación, auditorías, no conformidades, regla de decisión** | **Tema 40** |

---

## Fuentes y verificación

- **VIM, edición española del CEM, leído literalmente** en las veintitrés entradas que se citan: todas las definiciones entrecomilladas del apartado 2.2 y las de validación, verificación, selectividad, sensibilidad, intervalo de medida y límite de detección son **transcripción** del PDF oficial.
- **GUM, edición digital del CEM (JCGM 100:2008)**: leídos 2.3.1 a 2.3.6, 3.2.4, 4.3.4 a 4.3.10, 6.2.1, 6.3.3 y 7.2.6. De ahí las fórmulas a/√3 y a/√6 (ecuaciones 7 y 9b) y el «aproximadamente el 95 por ciento» de k = 2.
- **Guía Eurachem de validación, edición española de 2016**, leída en sus secciones 2 a 8; y **3.ª edición inglesa de 2025**, leída para comprobar las cláusulas de la ISO/IEC 17025:2017 que cita y que **los factores 3 y 10 del LD y el LC no han cambiado**. Todas las fórmulas del apartado 2.3 (b, b%, R, R′, s₀′, r = 2,8 s_r) están tomadas de ahí.
- **QUAM (Eurachem/CITAC), edición española**: los cuatro pasos, las reglas de conversión y de combinación y los ejemplos numéricos del matraz, la balanza y la pesada con k = 2,8.
- **Nordtest TR 537, edición 4 (2017)**: el modelo u(Rw) + u(sesgo), la escalera de errores y los **dos ejemplos numéricos**, que he recalculado: √(1,67² + 2,73²) = 3,20 y √(3,48² + (2,2/√12)² + 2,16²) = 4,14.
- **RD 3/2023, texto consolidado del BOE**, leído literalmente en el artículo 20, la disposición adicional octava y el anexo III, partes B, D (con la tabla 15 completa y sus notas) y **E íntegra**. Las cifras de la tabla 15 de este apunte están **copiadas de ella**; los valores paramétricos de nitrato (50 mg/L), cloruro y sulfato (250 mg/L) que usan los supuestos, del anexo I.
- **RD 817/2015, texto consolidado del BOE** (última actualización publicada el 11/01/2023): definiciones 23, 25 y 26 del artículo 3 y el apartado C del anexo III, transcritos.
- **ENAC, CGA-ENAC-LEC Rev. 12 (abril de 2024)**, leído entero; de su anexo I sale la cláusula 7.2.1.5 **en castellano literal**.
- **UNE-EN ISO/IEC 17025:2017**: estado **vigente** comprobado en el buscador de UNE el 25/09/2026.
- **ISO 11352**: comprobado en la ficha de AENOR que la edición de 2012 está **anulada desde el 01/09/2025**, y en la de ISO que la vigente es la **ISO 11352:2025**, edición 2.
- **Exámenes anteriores:** los seis cuestionarios extraídos a texto y barridos con doce palabras clave del tema. **Dos preguntas** encajan (1246 #19 y 1322 C2 #10), transcritas con sus opciones. Las dos de **R²** (1233 #18 y 1322 C2 #3) **se dejan para el tema 39**, que es el de la calibración por mínimos cuadrados.
- **`TEMARIO EXTRA/`:** el mapeo da el tema 38 como «sin nada»; no hay ficha de apoyo.
- **Figuras:** las tres de este tema (`dianas-veracidad-precision`, `incertidumbre-en-cuadratura` e `intervalo-de-trabajo`) se han añadido al catálogo con **seis controles nuevos** en `verificar-figuras.js` y **seis sabotajes** que los prueban. Los de las dianas **miden el centroide y la dispersión de los impactos** y comprueban que cada diana es **lo que dice su rótulo**, y que **las dos de la misma fila tienen el mismo sesgo y las dos de la misma columna la misma dispersión**; los de la cuadratura, que **el ángulo es recto y la hipotenusa mide √(a² + b²)**, y que **las cifras escritas cuadran con las barras y con U = 2·uc**; los del intervalo, que **el LC está a 10/3 del LD sobre la escala del eje** y **el intervalo arranca en el LC**, y que **la curva no se aparta de la recta más de lo tolerado dentro del intervalo y sí fuera**.
- **Fecha de verificación:** 25/09/2026.

### Dudas y limitaciones declaradas

1. **El articulado de la UNE-EN ISO/IEC 17025:2017 no lo he leído**: es de pago, y el extracto público de AENOR llega solo al capítulo 2. De la cláusula **7.2.1.5** doy el texto **literal en castellano** porque lo transcribe ENAC. De las cláusulas **7.2.2.1, 7.2.2.2 y 7.2.2.4** doy el **contenido**, tomado de la Guía Eurachem de 2025 (en inglés); **la redacción exacta de la versión española puede diferir**. Tampoco he podido comprobar la lista de características de la **nota de la cláusula 7.2.2.3**, que por eso no cito.

2. **La 3.ª edición de la Guía Eurachem (2025) no está traducida.** He estudiado sobre la española de 2016 y he comprobado en la inglesa de 2025 que **lo que este apunte usa no ha cambiado** (definiciones, cláusulas, factores 3 y 10, Plackett-Burman). La 2025 **quita el análisis cualitativo** (remite a una guía aparte) y **añade el muestreo**; ninguna de las dos cosas afecta a lo que aquí se afirma.

3. **La ISO 11352:2025 no la he leído**: de pago y sin adopción UNE encontrada. Lo que el apunte dice de su contenido es **su propio alcance publicado** (que se basa principalmente en el Nordtest TR 537); **el cálculo está tomado del Nordtest**, que es de acceso libre.

4. **Los factores 3 y 10 del LD y el LC son una convención**, no una ley. El RD 3/2023 **define** el LD y el LC pero **no da fórmula**; la IUPAC y la ISO 11843 tienen tratamientos más rigurosos, y hay sectores que usan k_Q = 5 o 6. **Si el examen pregunta «LD = 3s», es la respuesta estándar**; si da otra fórmula, hay que leer bien.

5. **«Rango de validación»** no es un término definido en ninguna de las fuentes. Lo interpreto como el **intervalo de trabajo** (Eurachem) o **rango de trabajo** (RD 3/2023), que es lo único que encaja. Si el tribunal lo entendiera como «**el alcance de la validación**» (qué matrices, qué niveles, qué características), eso está en el apartado 2.5, «Cuánto hay que validar».

6. **El criterio del 5 % de la figura del intervalo de trabajo es ilustrativo.** La Guía Eurachem define el final del intervalo como el punto donde aparecen *«anomalías significativas en la sensibilidad»*, **sin dar una cifra**; la tolerancia la fija cada laboratorio. La uso en la figura para que el dibujo tenga algo comprobable.

7. **El ≈ 5 % de muestras de control** y los límites **±2s / ±3s** son **recomendaciones de la Guía Eurachem**, no requisitos legales. Se desarrollan en el tema 39.

8. **La tabla de «cuánto hay que validar» del apartado 2.5 es una ordenación mía** hecha con las reglas de Eurachem (4.1, 4.2, 5.2, 6.1.3, 6.8.2 y 7) y del RD. Ninguna fuente la da en forma de tabla. En particular, **qué características se verifican en un método normalizado lo decide el laboratorio** (y lo evalúa ENAC); lo que doy es lo **habitual**.

9. **El límite de repetibilidad, con cuidado al copiarlo.** Al extraer a texto las dos ediciones de Eurachem, la ecuación 5 sale como «r = 2 × t × s_r», **porque se pierde el signo de raíz**. La fórmula es **r = √2 · t · s_r**: es la única que, con t ≈ 2, da el **2,8** de la ecuación 6 que la sigue (2 · 2 daría 4). Si se encuentra escrita sin la raíz en algún temario, es ese error.

10. **La vigencia del CGA-ENAC-LEC Rev. 12 (abril de 2024)** es la del documento que sirve hoy el enlace de ENAC; no he podido consultar el listado de revisiones de la web de ENAC para confirmar que no haya una posterior.

11. **No tengo la plantilla de respuestas de ningún cuestionario.** En 1246 #19 y en 1322 C2 #10 la deducción es segura y la respalda literalmente la bibliografía (el modelo del Nordtest y la regla del MRC de Eurachem), pero **son deducciones razonadas, no plantilla oficial**.

12. **Aprobación.** El tema se ha redactado, generado y cerrado **de una sola vez**, con **autorización previa y expresa del opositor** para saltarse el paso 3 del flujo del README, igual que los temas 29 a 37.
