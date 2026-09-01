# Análisis de los exámenes anteriores

Análisis de los seis cuestionarios de esta carpeta, hecho el **1 de septiembre de 2026**. Es la base de las decisiones de formato y volumen del proyecto.

## Muestra

| Ref. | Proceso | Fecha | 1.er ejercicio | 2.º ejercicio |
|---|---|---|---|---|
| **1246** | **Turno libre** (el comparable) | 28/11/2024 | 50 preg. · 3 opciones · +5 reserva | 25 preg. · 4 opciones · 5 supuestos |
| 1322 | Concurso-oposición EET (1 plaza) | 09/04/2024 | 40 preg. · 3 opciones · +5 reserva | 40 preg. · 4 opciones · 4 supuestos |
| 1233 | Lista de espera extraordinaria | 03/10/2023 | 20 preg. · 3 opciones · +3 reserva | 20 preg. · 4 opciones · 4 supuestos |

Solo **1246 es turno libre ordinario**, el mismo tipo de proceso que 2026.

## Formato

Fijado en las bases generales (TRBGTL), base 7.4.C.1. Resumido en el README.

Lo esencial: **primer ejercicio a 3 opciones sobre los 40 temas** (no solo sobre la parte común: en 1246 las preguntas 11 a 50 eran de la parte segunda, todas a 3 opciones), **segundo ejercicio a 4 opciones** en supuestos. Penalización de 1/4 por error en ambos.

## Reparto por bloques

| Bloque | 1246 (50 preg.) | 1322 (40 preg.) |
|---|---|---|
| Parte primera (1-8) | 10 (20 %) | 10 (25 %) |
| Microbiología (9-19) | 9 (18 %) | 9 (22,5 %) |
| Seguridad y físico-química (20-32) | 18 (36 %) | 17 (42,5 %) |
| Agua, aire e ISO 17025 (33-40) | 13 (26 %) | 4 (10 %) |

Dos conclusiones:

1. **La parte común es un bloque fijo de 10 preguntas**, independientemente de que el examen tenga 40 o 50.
2. **Por tema, el reparto es casi uniforme** (~1,3 preguntas/tema en físico-química, ~0,8 en microbiología, ~1,1 en el bloque 33-40). Físico-química parece dominar solo porque tiene 13 temas de los 32. No hay evidencia de que un bloque «caiga más» por tema.

Dentro de la parte común el reparto sí es desigual: TREBEP 3-4 preguntas, Estatuto de Aragón 2-3, Haciendas Locales 1-3, LBRL 1 y **Constitución 1**.

## Nivel de detalle

**Parte común: literal y por artículo.** Ocho o nueve de cada diez preguntas empiezan *«De acuerdo con el artículo X de [norma]…»* y piden el dato exacto: plazos, cifras, denominaciones.

**Parte específica: cero artículos, conocimiento operativo.** Qué técnica para qué analito, qué medio de cultivo, temperaturas y tiempos, unidades, normas UNE/ISO por su número, y cálculos numéricos (ufc/mL, NMP con dilución, pH, molaridad, R²).

Datos exactos que sí exigen: autoclave 121 °C / 30 min · <100 colonias en filtro de 47 mm · UV 195-380 nm · *Legionella* a 36 °C durante 44±4 h · *E. coli* en ufc/100 mL · dureza en mg/L de CaCO₃.

**Preguntas con imagen:** ~20-25 % del segundo ejercicio (pictogramas de peligro, material de vidrio, lecturas de bureta, gráficos de exactitud/precisión) y alguna en el primero. De ahí los componentes SVG de `app/src/components/figuras/`.

## Núcleo repetido entre convocatorias

Preguntas que aparecen **casi literales en más de una convocatoria**. Son el material de mayor probabilidad del proyecto. **Al redactar el tema correspondiente, marcarlas `nucleo: true`.**

| Pregunta | Aparece en | Tema donde marcarla |
|---|---|---|
| Pieza clave de un equipo de plasma → la antorcha | 1246 #11, 1322 #28 | 27 |
| Qué es un plasma → gas caliente, generalmente argón, parcialmente ionizado | 1233 #10, 1322 #29 | 27 |
| UNF (unidades nefelométricas de formacina) → turbidez | 1246 #13, 1322 #30 | 28 |
| Qué es la cromatografía → separación entre fase móvil y estacionaria | 1246 #14, 1322 #31 | 30 |
| La columna cromatográfica → separa (no cuantifica ni detecta) | 1246 #15, 1322 #32 | 30 |
| Anchura de picos y resolución → a menor anchura, mejor resolución | 1246 #16, 1322 #33 | 30 |
| Precolumna en HPLC para alargar la vida de la columna | 1246 #17, 1322 #34 | 32 |
| Detector de conductividad en HPLC → compuestos iónicos | 1246 #18, 1322 #35 | 30 y 32 |
| Definición de sólidos en suspensión | 1246 #20, 1322 #37 | 34 |
| Definición de DQO (dicromato) | 1246 #21, 1322 #38, 1233 #7 | 34 |
| Dureza del agua → sales de calcio y magnesio | 1246 #22, 1322 #39 | 33 |
| PM → materia particulada | 1246 #24, 1322 R1 | 37 |
| Agente valorante del cloruro → nitrato de plata | 1233 #2, 1246 #28 | 22 |
| Materia orgánica en agua → método del permanganato | 1233 #3, 1246 #29 | 33 |
| Microcontaminante orgánico → GC o LC con detector de masas | 1233 #5, 1246 #30 | 30-32 |
| Valoración por retroceso (exceso conocido y se valora lo no reaccionado) | 1233 #19, 1246 #42, 1322 #12 | 22 |
| Ley de Lambert-Beer | 1233 #8, 1322 #11 | 25 |
| El Justicia rinde cuentas ante las Cortes de Aragón (art. 59.3 EAAr) | 1246 #2, 1322 #4 | 3 |

**Plantillas fijas del segundo ejercicio.** Aparecen en las tres convocatorias, cambiando solo los analitos. Valen por sí solas ~10 de las 25 preguntas del segundo ejercicio:

- *«En una muestra de agua de consumo se quiere determinar [5 parámetros]. Indique en cada caso la técnica»* → temas 25-33.
- *«En una muestra de agua residual: sólidos en suspensión, DQO, DBO₅, nitrógeno total y fósforo total»* → temas 34-35.

## Temas sin precedente

No aparecen en ninguno de los seis cuestionarios:

| Tema | Nota |
|---|---|
| **2** — Igualdad efectiva + Plan de Igualdad municipal | El Plan del Ayuntamiento no es normativa estatal; hay que localizarlo |
| **4** — LPAC | Tema denso, cero precedente |
| **5** — Ley de régimen especial de Zaragoza | — |
| **8** — Empleados públicos EELL + PRL | — |
| **10** — Equipo básico de microbiología I | — |
| **19** — Análisis bacteriológico de **alimentos** | Toda la microbiología de los exámenes es de agua |
| **29** — Radiactividad en agua | — |

Al revés: **la LBRL (Ley 7/1985) aparece en los tres exámenes y no tiene tema propio en el temario de 2026**. La sustituyen el tema 5 y el tema 8, que probablemente ocuparán ese hueco.

## Límites

Tres convocatorias, y solo una es turno libre ordinario. El temario de aquellos exámenes **no es el de 2026**, así que el mapeo tema a tema es aproximado, sobre todo en la parte común. Las preguntas con imagen no se pueden extraer del PDF, así que los bloques que se apoyan en imagen están infracontados.

## Fuentes

- [Bases generales de turno libre del Ayuntamiento de Zaragoza (TRBGTL)](https://www.zaragoza.es/contenidos/oferta/bases_turno_libre.pdf)
- [BOPZ núm. 170, de 27/07/2026, anuncio 5077](https://bop.dpz.es/BOPZ/UploadServlet?ruta=Boletines%5C2026%5C170%5Cbop.pdf)
- Cuestionarios de esta carpeta, publicados en su día en `zaragoza.es`.
