---
tema: 27
titulo: "Espectroscopía de Masas con Plasma Acoplado Inductivamente (ICP): fundamentos e instrumentación. Utilización en análisis de agua."
parte: Parte segunda
estado: borrador
verificado: 2026-09-07
fuentes:
  - "UNE-EN ISO 17294-2:2024, Calidad del agua. Aplicación de la espectrometría de masas con plasma acoplado inductivamente (ICP-MS). Parte 2: Determinación de elementos seleccionados incluyendo isótopos de uranio. EN VIGOR, 06/11/2024. ANULA a la UNE-EN ISO 17294-2:2017 (que a su vez sustituyó a la de 2005). Idéntica a EN ISO 17294-2:2023. — https://tienda.aenor.com/p/norma-une-en-iso-17294-2-2024-n0073648"
  - "UNE-EN ISO 17294-1:2024, Calidad del agua. Aplicación de la espectrometría de masas con plasma acoplado inductivamente (ICP-MS). Parte 1: Directrices generales. ANULA a la UNE-EN ISO 17294-1:2007 con fecha 11/12/2024. — https://tienda.aenor.com/p/norma-une-en-iso-17294-1-2007-n0039489"
  - "UNE-EN ISO 11885:2010, Calidad del agua. Determinación de elementos seleccionados por espectrometría de emisión óptica de plasma acoplado inductivamente (ICP-OES). EN VIGOR, 05/01/2010. SUSTITUYE a la UNE-EN ISO 11885:1998. Idéntica a ISO 11885:2007. — https://tienda.aenor.com/p/norma-une-en-iso-11885-2010-n0044517"
  - "UNE-EN ISO 15587-1:2002 (agua regia) y UNE-EN ISO 15587-2:2002 (ácido nítrico), Calidad del agua. Digestión para la determinación de elementos seleccionados en agua. EN VIGOR. — https://tienda.aenor.com/p/norma-une-en-iso-15587-1-2002-n0028052"
  - "Real Decreto 3/2023, de 10 de enero (BOE-A-2023-628), texto consolidado: anexo III, parte D, puntos 1 y 3; y el uranio como parámetro del anexo I. Leído literalmente. — https://www.boe.es/buscar/act.php?id=BOE-A-2023-628"
  - "Real Decreto 817/2015, de 11 de septiembre (BOE-A-2015-9806), texto consolidado, anexo III, apartado C.1. Leído literalmente. — https://www.boe.es/buscar/act.php?id=BOE-A-2015-9806"
  - "LibreTexts en español, Análisis Instrumental (LibreTextos), cap. 10.1 «Espectroscopia de emisión basada en fuentes de llama y plasma» (la antorcha, temperaturas y zonas del plasma) y cap. 11.3 «Espectrómetro de masas de plasma acoplado inductivamente» (interfase, conos, lentes iónicas, cuadrupolo, interferencias)."
  - "LibreTexts en español, Métodos Físicos en Química y Nano Ciencia (Barron), cap. 1.6 «ICP-MS para análisis de metales traza»: límites de detección comparados, rango dinámico, patrón interno y elementos no determinables."
  - "CAI de Ciencias de la Tierra y Arqueometría, Universidad Complutense de Madrid, ficha de la técnica ICP-MS. — https://cai.ucm.es/ciencias-tierra-arqueometria/tecnicas-geologicas/tecnicas/espectrometria-de-masas-con-plasma-de-acoplamiento-inductivo-icp-ms/34/"
  - "CEM, catálogo de procedimientos de calibración: comprobado que NO hay ninguno de ICP (ver «Dudas»). QU-001 es de absorción atómica, QU-002 de analizadores de gases de escape, QU-003 de pHímetros, QU-004 de HPLC y QU-005 de cromatografía de gases. — https://www.cem.es/es/divulgacion/documentos"
  - "ExamenesAnteriores/ANALISIS.md y los seis cuestionarios de esa carpeta, releídos el 07/09/2026."
---

> **NÚCLEO REPETIDO COMPROBADO, Y ES EL MÁS FUERTE DE TODO EL BLOQUE.** Ningún otro tema de los redactados hasta ahora tiene **dos preguntas** documentadas como recurrentes, casi literales entre convocatorias, más el patrón de supuesto:
>
> | Qué se pregunta | Dónde | Literal |
> | --- | --- | --- |
> | **«¿Cuál es la pieza clave de un equipo de plasma?»** → **la antorcha** | **1246 #11 y 1322 #28** | Idéntica en las dos, con los mismos distractores: «los electrodos» y «la fuente de radiación» |
> | **Qué es un plasma** → **un gas caliente, generalmente argón, parcialmente ionizado** | **1233 #10 y 1322 #29** | La cola CAMBIA: 1233 dice «…y **eléctricamente neutro**»; 1322 dice «…y **conductor**». Las dos son ciertas |
> | **ICP-MS como respuesta a «indique la técnica» para metales** | **1246 C2 #1 y #9; 1322 C2 #25, #29 y #40** | Cadmio; plomo; «Cadmio, aluminio, antimonio y cromo»; «mercurio, selenio y plomo»; y una lista de doce metales |
>
> Traducción: **la antorcha y la definición de plasma son lo más rentable del tema**, y el reflejo que hay que automatizar es **«metales en agua → ICP-MS»**.

> **Aviso de fuentes.** Aquí **no hay procedimiento del CEM**, al revés que en el tema 26. Lo he comprobado recorriendo su catálogo: el **QU-001** es de absorción atómica, el **QU-002** de analizadores de gases de escape, el **QU-003** de pHímetros, el **QU-004** de HPLC y el **QU-005** de cromatografía de gases. **No hay ninguno de ICP.** La teoría de este tema es, por tanto, **doctrina de libro**; lo que sí está verificado, y con novedades, son **las normas de agua**.

> **Novedad de vigencia que conviene tener fresca.** Las dos partes de la norma de ICP-MS **se han renovado en 2024**: la **UNE-EN ISO 17294-2:2024** anuló a la de 2017 el **6 de noviembre de 2024**, y la **UNE-EN ISO 17294-1:2024** anuló a la de 2007 el **11 de diciembre de 2024**. Citar «UNE-EN ISO 17294-2:2017» hoy es citar una norma anulada.

> **La frontera con el tema 26.** Allí, **absorción atómica**: una lámpara por elemento, una línea, una medida — **monoelemental**. Aquí, **plasma**: sin lámpara, mucha más temperatura y **todos los elementos a la vez**. Ésa es la razón de fondo por la que los supuestos responden ICP-MS cuando piden varios metales, y absorción atómica cuando piden uno solo y barato.

> **Reparto dentro del propio tema.** El enunciado dice «espectroscopía de **masas**», así que el peso va al **ICP-MS**. Pero **el plasma y la antorcha son comunes** al ICP-OES, que tiene su propia norma de agua vigente (UNE-EN ISO 11885), y ahí es donde caen las dos preguntas documentadas. Se desarrollan los dos, con el ICP-MS en detalle y el ICP-OES como hermano. **Los valores paramétricos** de los metales no están aquí: son del **33** y del **35**. La **radiactividad** del agua y el uranio como radionucleido, del **29**.

## 1. Encuadre

El **ICP** no es una técnica de medida: es una **fuente de iones**. Un plasma de argón a varios miles de grados que **atomiza e ioniza** casi cualquier elemento. Lo que se le acople detrás decide la técnica:

- Si detrás va un **espectrómetro de masas**, se mide **la masa de los iones**: **ICP-MS**.
- Si lo que se mide es **la luz que emiten** los átomos excitados en el propio plasma: **ICP-OES** (u **ICP-AES**), emisión óptica.

En un laboratorio de aguas es **la técnica de los metales**, y desplaza a la absorción atómica en cuanto hay que determinar varios a la vez o bajar a nanogramos por litro.

| Qué regula | Norma o referencia | Lógica |
| --- | --- | --- |
| Fundamento e instrumentación | LibreTexts (Harvey, Barron); ficha del CAI de la UCM | **Doctrina técnica**, sin norma ni procedimiento del CEM |
| **Directrices generales del ICP-MS** | **UNE-EN ISO 17294-1:2024** | Ensayo normalizado |
| **Elementos por ICP-MS**, incluidos isótopos de uranio | **UNE-EN ISO 17294-2:2024** | Ensayo normalizado |
| **Elementos por ICP-OES** | **UNE-EN ISO 11885:2010** | Ensayo normalizado |
| **Digestión previa** | **UNE-EN ISO 15587-1 y -2:2002** | Ensayo normalizado |
| Qué se le exige al método (consumo) | **RD 3/2023**, anexo III, parte D | Norma con rango de ley |
| Qué se le exige al método (superficiales) | **RD 817/2015**, anexo III, C.1 | Norma con rango de ley |

## 2. Desarrollo

### 2.1. Qué es un plasma

Es **pregunta documentada dos veces**, así que conviene la definición exacta:

> Un plasma es **un gas caliente, generalmente ARGÓN, parcialmente ionizado**, formado por átomos neutros, iones positivos y electrones libres.

Dos matices, porque **las dos convocatorias rematan la frase de forma distinta y las dos tienen razón**:

- Es **eléctricamente neutro** *en conjunto*: hay tantas cargas positivas como negativas (1233 #10).
- Y es **conductor**, precisamente porque tiene cargas libres (1322 #29).

No confundirlo con lo que ofrecen los distractores: **no** es un producto de combustión de un gas, **no** es un arco de corriente continua, **no** es una simple mezcla de muestra con gas inerte, y **no** es un atomizador de tubo de grafito (eso es el tema 26).

**Por qué argón:** es inerte, no forma compuestos con el analito, tiene una **energía de ionización alta** —así que ioniza a casi todos los elementos, que la tienen más baja— y no aporta líneas de emisión que estorben demasiado.

### 2.2. La antorcha, la pieza clave

![Antorcha de ICP: tres tubos concéntricos de cuarzo y la bobina de radiofrecuencia](esquema:antorcha-icp)

**«¿Cuál es la pieza clave de un equipo de plasma?» → LA ANTORCHA.** Literal en 1246 #11 y 1322 #28, con los mismos distractores: *los electrodos* y *la fuente de radiación*. Y los dos distractores enseñan algo: **en un ICP no hay electrodos** —el plasma se calienta por inducción, sin contacto— **ni fuente de radiación externa** —el plasma es la fuente—.

La antorcha son **tres tubos concéntricos de cuarzo** rodeados en su extremo por una **bobina de inducción de radiofrecuencia**:

| Tubo | Qué lleva | Para qué |
| --- | --- | --- |
| **Exterior** | Argón **tangencial**, el caudal grande | Sostiene el plasma y **aísla térmicamente el tubo de cuarzo**, que si no se fundiría |
| **Intermedio** | Argón auxiliar | Separa el plasma de la punta del tubo central |
| **Central (capilar)** | **La muestra nebulizada** en argón | Perfora el plasma por el centro y lleva el aerosol al canal central |

**Cómo se enciende y cómo se mantiene:**

1. Fluye el argón y se aplica **radiofrecuencia** a la bobina.
2. Una **chispa de una bobina Tesla** siembra los primeros electrones.
3. La corriente alterna crea un **campo magnético fluctuante** que obliga a iones y electrones a **girar en trayectoria circular**: chocan, y ese rozamiento es el que calienta. Es **calentamiento por inducción**, igual que una placa de cocina de inducción, y por eso no hacen falta electrodos.

**Temperaturas**, que es lo que hay que retener:

- **Base del plasma: hasta 10 000 K.**
- **Zona de medida: 6 000 - 8 000 K, a 15-20 mm por encima de la bobina.**

Compárese con la llama de aire-acetileno del tema 26 (2 100-2 400 °C): el ICP está **tres o cuatro veces más caliente**. De ahí salen sus dos ventajas de fondo: **descompone los compuestos refractarios** —adiós a las interferencias químicas del tipo fosfato sobre calcio— y **la enorme concentración de electrones procedente de la ionización del argón minimiza la interferencia de ionización**, que en llama obligaba a añadir cesio.

**La muestra entra igual que en absorción atómica de llama:** bomba peristáltica → **nebulizador** → **cámara de nebulización**, que se queda con las gotas gruesas → tubo central de la antorcha.

### 2.3. El ICP-MS por dentro

![ICP-MS: de la presión atmosférica del plasma al vacío del espectrómetro, a través de los dos conos](esquema:icp-ms)

El problema de ingeniería del ICP-MS es éste: **el plasma trabaja a presión atmosférica y a 7 000 K, y el espectrómetro de masas necesita alto vacío y temperatura ambiente**. Todo el diseño consiste en salvar ese salto sin perder los iones.

**El camino completo:**

**1. Nebulizador y cámara de nebulización.** Como en llama.

**2. Antorcha y plasma.** Atomiza e ioniza: los elementos salen como **iones positivos M⁺**.

**3. LA INTERFASE — es lo característico del ICP-MS.** Dos conos metálicos con un agujerito en la punta:

| Cono | Qué hace | Presión detrás |
| --- | --- | --- |
| **Cono de muestreo** (*sampler*) | Un **orificio de alfiler de ≈ 1 mm** por el que se cuela una porción del plasma | **≈ 1 torr** |
| **Cono *skimmer*** | Deja pasar una fracción todavía menor a la etapa siguiente | **≈ 10⁻⁵ torr**, ya la de trabajo del espectrómetro |

Es decir: **de 1 atmósfera a 1 torr y de ahí a 10⁻⁵ torr**, en dos saltos y en pocos centímetros. Los conos son la pieza que más sufre y la que más se limpia.

**4. Lentes iónicas.** Un juego de lentes electrostáticas que **estrecha el chorro cónico**, **separa los iones positivos de los electrones, las especies neutras y los fotones**, y **enfoca el haz** a la entrada del analizador. Si los fotones del plasma llegaran al detector, lo cegarían.

**5. Analizador de masas.** Normalmente un **cuadrupolo**: cuatro barras a las que se aplican tensiones continua y de radiofrecuencia, de modo que **solo una relación masa/carga (m/z) llega al otro extremo** en cada instante. Barriendo las tensiones se recorre el espectro.

- **Resolución del cuadrupolo: distingue masas que difieren en ± 1 m/z**, y trabaja aproximadamente **de 3 a 300 m/z**, que cubre toda la tabla periódica útil.
- Cuando hace falta más resolución se usa un analizador de **doble enfoque** (sector magnético + eléctrico).

**6. Detector: multiplicador de electrones.** Cada ion que llega desencadena una cascada de electrones. Se **cuentan iones**, y por eso la sensibilidad llega a partes por billón.

### 2.4. Interferencias del ICP-MS

Aquí las interferencias no son químicas —el plasma se las come—, sino **de masa**: otra especie pesa lo mismo que el analito.

| Tipo | Qué es | Ejemplo |
| --- | --- | --- |
| **Isobárica** | Dos elementos distintos con **isótopos del mismo número másico** | **⁴⁰Ar y ⁴⁰Ca** comparten m/z = 40 |
| **Ion poliatómico** | Una especie formada en el plasma con argón, oxígeno, nitrógeno, cloro o el propio disolvente | **⁴⁰Ar¹⁶O⁺ pesa 56 y se solapa con el ⁵⁶Fe⁺**, el isótopo más abundante del hierro |
| **De matriz** | Mucha sal o mucho ácido cambian la eficacia de nebulización y de ionización | Aguas salinas, digeridos concentrados |

**Cómo se manejan:**

- **Elegir otro isótopo** del analito, libre de solapamiento.
- **Ecuaciones de corrección**, restando la contribución del interferente medida en otra masa.
- **Igualar la matriz** de patrones y muestras, o **adición de patrón**.
- **Patrón interno**: un elemento que no está en la muestra —**el germanio** es el ejemplo del manual— **se bombea junto con la muestra antes de la nebulización**, y todo se refiere a su señal. Corrige a la vez la deriva del equipo y el efecto de matriz.
- **Diluir**: el ICP-MS no admite mucha carga de sólidos disueltos.

### 2.5. ICP-OES, el hermano que mide luz

Mismo plasma, misma antorcha, misma entrada de muestra. Lo que cambia es qué se detecta:

| | **ICP-OES (emisión óptica)** | **ICP-MS (masas)** |
| --- | --- | --- |
| Qué mide | **La luz que emiten** los átomos e iones excitados | **Los iones**, separados por m/z |
| Hace falta interfase de vacío | No | **Sí**: los dos conos |
| Límite de detección típico | **1-10 ppb** (µg/L) | **1-10 ppt** (ng/L) |
| Rango dinámico | ≈ **6** órdenes de magnitud | ≈ **8** órdenes de magnitud |
| Isótopos | No los distingue | **Sí**: es la única que los distingue |
| Norma de agua | **UNE-EN ISO 11885:2010** | **UNE-EN ISO 17294-2:2024** |

**Qué NO determina el ICP-MS:** hidrógeno, helio y la mayoría de los gases nobles, **carbono**, y los elementos **sin isótopos naturales**. Los halógenos van mal porque su energía de ionización es más alta que la del argón.

### 2.6. Frente a la absorción atómica del tema 26

| | Absorción atómica | ICP |
| --- | --- | --- |
| Fuente | **Lámpara de cátodo hueco**, una por elemento | **El propio plasma**: no hay lámpara |
| Elementos por medida | **Uno** (monoelemental) | **Muchos a la vez** (multielemental) |
| Temperatura | 2 100-3 000 °C | **6 000-10 000 K** |
| Interferencias químicas | Frecuentes (lantano, cesio) | **Casi desaparecen** |
| Interferencias propias | De fondo, ionización, químicas | **Isobáricas y poliatómicas** |
| Cuándo se elige | Uno o dos metales, presupuesto corto | **Varios metales**, o trazas muy bajas |

### 2.7. Utilización en el análisis de agua

**El paso previo es el mismo que en el tema 26**, y es pregunta documentada (1246 #25): para **metales totales** hay que **digerir** la muestra con ácido y en caliente (**UNE-EN ISO 15587-1** con agua regia o **-2** con ácido nítrico); para **metales disueltos**, filtrar a 0,45 µm y acidificar. En 1322 C2 #40 la respuesta a una lista de doce metales es, literalmente, **«digestión ácida de la muestra y posterior determinación de los metales por ICP-MS»**.

**Qué cubre la UNE-EN ISO 17294-2.** Determina un número grande de elementos —aluminio, antimonio, arsénico, bario, berilio, bismuto, boro, cadmio y muchos más— en **agua de consumo, superficial, subterránea, residual y eluatos**, y también en **digeridos** de agua, lodos y sedimentos preparados según la ISO 15587-1 o la -2. La parte **1** da las **directrices generales** de la técnica.

**El uranio tiene mención propia** en el título de la norma («incluyendo isótopos de uranio»), y no es casualidad: el uranio es **parámetro del RD 3/2023**. Su valor paramétrico es del **tema 33**; como **radionucleido**, del **29**.

**Lo que exige la ley**, igual que en los temas 25 y 26:

- **Agua de consumo (RD 3/2023, anexo III, parte D):** no se impone método. **Límite de cuantificación ≤ 30 %** del valor paramétrico e **incertidumbre (k = 2)** de la **tabla 15**. El LC y el LD han de ser **siempre inferiores al valor paramétrico**.
- **Aguas superficiales (RD 817/2015, anexo III, C.1):** métodos **validados conforme a EN ISO/IEC 17025**, **incertidumbre ≤ 50 % (k = 2)** al nivel de la norma de calidad ambiental y **LC ≤ 30 %** de esa NCA.

## 3. Tabla operativa

| Parámetro / analito | Técnica | Norma o referencia | Unidades | Condiciones |
| --- | --- | --- | --- | --- |
| **Metales en general, varios a la vez** (Al, Sb, As, Ba, Be, Bi, B, Cd, Cr, Cu, Fe, Pb, Mn, Ni, Se, Zn…) | **ICP-MS** | **UNE-EN ISO 17294-2:2024** | µg/L o ng/L | Aguas de consumo, superficiales, subterráneas, residuales y eluatos; también digeridos según ISO 15587-1/-2. **Digestión previa si es contenido total** |
| **Los mismos, a concentración más alta** | **ICP-OES** | **UNE-EN ISO 11885:2010** | mg/L o µg/L | Elementos disueltos, ligados a partículas y contenido total. Menos sensible que el ICP-MS, pero más tolerante a la matriz |
| **Directrices generales de la técnica** | ICP-MS | **UNE-EN ISO 17294-1:2024** | — | Anuló a la de 2007 el 11/12/2024 |
| **Cadmio, plomo, mercurio, selenio, arsénico, antimonio, cromo, níquel** | **ICP-MS** | UNE-EN ISO 17294-2:2024 | µg/L | Es la respuesta documentada de los supuestos: 1246 C2 #1 y #9; 1322 C2 #25, #29 y #40 |
| **Uranio** | **ICP-MS** | UNE-EN ISO 17294-2:2024 (lo cita en el título) | µg/L | Parámetro del RD 3/2023. **El valor paramétrico, tema 33**; como radionucleido, **tema 29** |
| **Un solo metal, de rutina y barato** | **Absorción atómica** (llama o cámara de grafito) | **Tema 26** | mg/L o µg/L | La absorción atómica es **monoelemental**: una lámpara por elemento |
| **Sodio, potasio, calcio y magnesio** | Cromatografía iónica de cationes (o absorción atómica de llama) | **Tema 30** / tema 26 | mg/L | En 1322 C2 #30 la respuesta ofrecida es **cromatografía iónica para cationes** |
| **Metales totales** (paso previo, no técnica) | **Digestión ácida en caliente**, sin filtrar antes | **UNE-EN ISO 15587-1** (agua regia) y **-2** (ácido nítrico) | — | Aguas con **< 20 g/L** de sólidos en suspensión y **< 5 g/L** de COT |
| **Metales disueltos** (paso previo) | **Filtración 0,45 µm** y acidificación | UNE-EN ISO 5667-3 (**tema 36**) | — | Se filtra **antes** de acidificar |
| **Exigencia legal, agua de consumo** | — | **RD 3/2023**, anexo III, D | — | **LC ≤ 30 %** del valor paramétrico e incertidumbre de la **tabla 15** |
| **Exigencia legal, aguas superficiales** | — | **RD 817/2015**, anexo III, C.1 | — | Validación **ISO/IEC 17025**, **incertidumbre ≤ 50 % (k = 2)** y **LC ≤ 30 %** de la NCA |

## 4. Puntos críticos para el examen

- **LA PIEZA CLAVE DE UN EQUIPO DE PLASMA ES LA ANTORCHA.** Pregunta literal en 1246 #11 y 1322 #28. Los distractores son «los electrodos» y «la fuente de radiación», y los dos son falsos: **en un ICP no hay electrodos ni fuente externa**.
- **UN PLASMA ES UN GAS CALIENTE, GENERALMENTE ARGÓN, PARCIALMENTE IONIZADO.** Vale rematar «y eléctricamente neutro» (1233 #10) o «y conductor» (1322 #29): **las dos colas se han usado como respuesta correcta**.
- **La antorcha son TRES TUBOS CONCÉNTRICOS DE CUARZO** más una **bobina de inducción de radiofrecuencia**. El **argón exterior es tangencial** y **aísla térmicamente el cuarzo**; la **muestra va por el tubo CENTRAL**.
- **El plasma se enciende con una chispa de bobina TESLA** y se mantiene por **inducción**: campo magnético fluctuante que hace girar iones y electrones. **Sin electrodos.**
- **Temperaturas: base hasta 10 000 K; zona de medida 6 000-8 000 K, a 15-20 mm sobre la bobina.**
- **Por qué argón:** inerte, energía de ionización alta y sin líneas que estorben.
- **El ICP casi elimina las interferencias químicas y de ionización** de la llama, por temperatura y por la enorme concentración de electrones.
- **LA INTERFASE ES LO PROPIO DEL ICP-MS: cono de MUESTREO (*sampler*, orificio de ≈ 1 mm) y cono *SKIMMER*.** Presiones: **1 atm → ≈ 1 torr → ≈ 10⁻⁵ torr**.
- **Las lentes iónicas** separan los **iones positivos** de electrones, neutros y **fotones**, y enfocan el haz.
- **Analizador: CUADRUPOLO**, resuelve **± 1 m/z** y barre de **3 a 300 m/z**. Más resolución: **doble enfoque**.
- **Detector: multiplicador de electrones.** Se **cuentan iones**.
- **Interferencias del ICP-MS: ISOBÁRICAS y POLIATÓMICAS.** ⁴⁰Ar y ⁴⁰Ca a m/z 40; **⁴⁰Ar¹⁶O⁺ sobre ⁵⁶Fe⁺**.
- **Se corrigen** eligiendo otro isótopo, con ecuaciones de corrección, igualando matriz, por adición de patrón o con **PATRÓN INTERNO** (germanio), bombeado **antes de la nebulización**.
- **ICP-MS ≈ 1-10 ppt; ICP-OES ≈ 1-10 ppb.** Rango dinámico **8 frente a 6** órdenes de magnitud. **Solo el ICP-MS distingue isótopos.**
- **El ICP-MS no determina** hidrógeno, helio, gases nobles, **carbono** ni elementos sin isótopos naturales; los halógenos, mal.
- **ICP-OES → UNE-EN ISO 11885:2010. ICP-MS → UNE-EN ISO 17294-2:2024** (parte 1, directrices generales; **parte 2**, elementos e isótopos de uranio).
- **OJO A LA VIGENCIA: las dos partes de la 17294 se renovaron en 2024** y las anteriores (2017 y 2007) **están anuladas**.
- **Metales TOTALES → digestión ácida en caliente** (UNE-EN ISO 15587-1/-2). Metales **disueltos → filtrar a 0,45 µm**.
- **Muchos metales a la vez → ICP-MS.** Uno solo y barato → absorción atómica (tema 26).
- **El RD 3/2023 no impone método**: LC ≤ 30 % del valor paramétrico e incertidumbre de la tabla 15. En superficiales, **RD 817/2015**: incertidumbre ≤ 50 % (k = 2) y LC ≤ 30 % de la NCA.

## Reparto con los temas vecinos

| Contenido | Dónde se desarrolla |
| --- | --- |
| **ICP-MS e ICP-OES: fundamento, instrumentación, interferencias y uso en agua** | **Aquí** |
| Absorción atómica, emisión de llama y fluorescencia atómica | **Tema 26** |
| Absorción molecular UV-visible | **Tema 25** |
| Turbidez, índice de refracción y polarimetría | **Tema 28** |
| **Radiactividad en agua** y el uranio como radionucleido | **Tema 29** |
| Cromatografía iónica (cationes: Na, K, Ca, Mg) | **Tema 30** |
| Espectrometría de masas **acoplada a cromatografía** (GC-MS, LC-MS) | **Temas 31 y 32** |
| Metales **como parámetro** de agua de consumo | **Tema 33** |
| Metales **como parámetro** de aguas residuales | **Tema 35** |
| Toma, envase y conservación de la muestra para metales | **Tema 36** |
| Metales en PM10 y PM2,5 | **Tema 37** |
| Validación e incertidumbre | **Tema 38** |
| Patrones, trazabilidad y calibración lineal | **Tema 39** |
| ISO 17025 y acreditación | **Tema 40** |

---

## Fuentes y verificación

- **Normas verificadas una a una en la tienda de AENOR**, comprobando código, título, año, equivalencia ISO y **estado**: **UNE-EN ISO 17294-2:2024** (en vigor; anula la de 2017, que anulaba la de 2005), **UNE-EN ISO 17294-1:2024** (consta como norma que anula a la de 2007, con fecha 11/12/2024), **UNE-EN ISO 11885:2010** (en vigor; sustituye a la de 1998) y **UNE-EN ISO 15587-1:2002**.
- **Normas legales leídas literalmente en el BOE**, texto consolidado: RD 3/2023, anexo III, parte D, y el uranio como parámetro del anexo I; RD 817/2015, anexo III, C.1.
- **Teoría:** LibreTexts en español — Análisis Instrumental 10.1 (antorcha, tubos concéntricos, chispa Tesla, temperaturas y zonas) y 11.3 (interfase, conos, presiones, lentes iónicas, cuadrupolo, interferencias isobáricas y poliatómicas); Barron 1.6 (límites de detección comparados, rango dinámico, patrón interno, elementos no determinables).
- **Catálogo del CEM recorrido** para confirmar que **no existe procedimiento de calibración de ICP**.
- **Exámenes anteriores:** los seis cuestionarios extraídos a texto y releídos; las preguntas citadas están transcritas de ellos.
- **Fecha de verificación:** 07/09/2026.

### Dudas y limitaciones declaradas

1. **De ninguna de las normas UNE citadas he leído el texto**: son de pago y AENOR prohíbe su uso en sistemas de IA. He verificado **solo los datos bibliográficos**: código, título, año, equivalencia ISO y estado. Mismo tratamiento que en los temas 23 a 26.

2. **La UNE-EN ISO 17294-1:2024 la he verificado de forma indirecta.** No he abierto su ficha: lo que he leído es la ficha de la **UNE-EN ISO 17294-1:2007**, que consta **anulada el 11/12/2024** y **nombra a la de 2024 como sustituta**. Es la propia fuente de AENOR diciéndolo, pero conviene saber que el dato viene de ahí y no de la ficha de la norma nueva.

3. **La lista de elementos de cada norma y el límite de cuantificación de la 17294-2 proceden de resúmenes del alcance**, no del articulado. El dato que suele citarse —**LC entre 0,002 y 1,0 µg/L** en agua de consumo y aguas poco contaminadas— **no lo doy en la tabla operativa** por eso.

4. **La celda de colisión/reacción no aparece en ninguna de mis fuentes.** Es un accesorio habitual del ICP-MS moderno para eliminar interferencias poliatómicas —se introduce helio o un gas reactivo antes del cuadrupolo—, pero **ni LibreTexts ni la ficha de la UCM la mencionan**, así que **no la he desarrollado** en el cuerpo del tema. Si aparece en el examen, la respuesta esperable es que sirve para **eliminar interferencias poliatómicas**.

5. **Las temperaturas del plasma varían entre fuentes.** Doy las de LibreTexts: **base hasta 10 000 K** y **zona de medida 6 000-8 000 K a 15-20 mm sobre la bobina**. Otros manuales dan 6 000-10 000 K sin más detalle. **Lo que se pregunta es el orden de magnitud**, y sobre todo que es muy superior al de una llama.

6. **El tercer tubo de la antorcha lo describo como «argón auxiliar».** LibreTexts dice literalmente «tres tubos concéntricos de cuarzo» y detalla el flujo tangencial exterior y el capilar central, **pero no nombra la función del intermedio**: eso lo pongo yo con la denominación habitual. Es un detalle menor y así queda declarado.

7. **La razón por la que los halógenos se determinan mal** —energía de ionización superior a la del argón— la tomo de la ficha del CAI de la UCM, que dice que la técnica abarca la tabla periódica «a excepción de elementos halógenos». **La explicación es mía**, no de la fuente.

8. **No tengo la plantilla de respuestas de ningún cuestionario.** Cuando digo que «la respuesta es ICP-MS» en los supuestos, lo deduzco de que las otras tres opciones son claramente inaplicables (permanganimetría o cromatografía de gases para metales, por ejemplo). En las dos preguntas de la antorcha y del plasma la deducción es segura; en los supuestos, muy probable pero no certificada.

9. **1322 C2 #30 aporta un dato que roza la duda 9 del tema 26.** Para «sodio, potasio, calcio y magnesio» la única opción sensata que se ofrece es **cromatografía iónica para cationes**. No resuelve del todo la ambigüedad del tema 26 —allí las opciones incluían potenciometría, que aquí no está—, pero **apunta a que el examinador considera la cromatografía iónica la técnica de esos cationes**. Lo dejo anotado por si conviene matizar aquella duda.

10. **El reparto entre este tema y el 26 lo he decidido yo**, y el de dentro del tema también: el enunciado dice «espectroscopía de masas», así que el ICP-MS lleva el peso y el ICP-OES entra como hermano porque tiene norma de agua vigente y porque **las dos preguntas documentadas son del plasma y de la antorcha, que son comunes a los dos**. La **espectrometría de masas acoplada a cromatografía** (GC-MS, LC-MS) no está aquí: es de los temas 31 y 32.
