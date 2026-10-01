---
tema: 13
titulo: "Técnicas de recuento de microorganismos mediante cultivo. Concentración. Dilución. Número Más Probable."
parte: Parte segunda
estado: aprobado
verificado: 2026-10-01
fuentes:
  - "Standing Committee of Analysts (Reino Unido): «The Microbiology of Water and Associated Materials (2017) — Practices and Procedures for Laboratories», apartados 5.4 (contadores de colonias), 5.23-5.24 (homogeneizadores y siembra en espiral), 7.2 (preparación de muestras y diluciones, NMP en tubos, filtración por membrana, ventajas y límites) y 7.3 (exactitud: dilución, NMP, confirmación de colonias)."
  - "Standing Committee of Analysts: «The Microbiology of Drinking Water (2016) — Part 4», coliformes y E. coli: método C (NMP en tubos múltiples) y método D (NMP con sustrato definido en bandeja de 51 pocillos, con su tabla del apéndice D1)."
  - "Standing Committee of Analysts: «The Microbiology of Drinking Water (2020) — Part 7», recuento de heterótrofos: volúmenes, placas de 10 a 300 colonias, reglas de lectura y cálculo."
  - "Standing Committee of Analysts: «The determination of Legionella bacteria in waters and other environmental samples (2020) — Part 2 — Culture methods»: concentración por filtración, elución y centrifugación, cálculo en ufc/L, incubación y método NMP de L. pneumophila."
  - "EPA (EE. UU.), Method 1103.2 (2023), E. coli por filtración en membrana: apartados 11 y 13 y apéndice B (reglas de recuento y cálculo por 100 mL)."
  - "FDA (EE. UU.), Bacteriological Analytical Manual, apéndice 2 (agosto de 2023): «Most Probable Number from Serial Dilutions»."
  - "ANMAT (Argentina), «Análisis microbiológico de los alimentos. Metodología analítica oficial», vol. III: recuento de aerobios mesófilos según ISO 4833-1:2013, y su anexo 3, cálculo y expresión de resultados según ISO 7218:2007."
  - "IDEXX: tabla del NMP de la bandeja Quanti-Tray de 51 pocillos (la misma que adjunta el 1322, 2.º ejercicio)."
  - "Resúmenes oficiales de las normas ISO 8199:2018, ISO 9308-1:2014, ISO 9308-2:2012, ISO 11731:2017 e ISO 7218:2024, en el catálogo de la Asociación Suiza de Normalización (SNV)."
  - "ExamenesAnteriores/PLANTILLAS.md y las páginas renderizadas de los cuestionarios: 1246 #31 y #40; 1233, 2.ª prueba, #14; 1322 #25 y #26; 1322, 2.º ejercicio, #13 y #16-19."
  - "Ficha de apoyo temas/apoyo/tema-13.md (TEMARIO EXTRA), usada solo como guion; ninguna afirmación sale de ella."
---

## Lo que ya ha caído

**Es un tema de cálculo.** Casi todo lo que se ha preguntado es una cuenta con una trampa preparada en las opciones:

| Examen | Lo que pedía | Respuesta oficial | La trampa |
| --- | --- | --- | --- |
| **1246 #40** | Se siembran **100 µL** de muestra sin diluir y salen **97 colonias**: ¿ufc/mL? | **c) 9,7 × 10²** | 9,7 × 10³ y 9,7 × 10¹: equivocarse en el factor del volumen |
| **1233, 2.ª prueba, #14** | Dilución **1:100** y NMP de **14,5**: ¿resultado final? | **b) 1450** | 145, 0,15 y 14 500 |
| **1322, 2.º ejercicio, #16** | Bandeja de **51 pocillos**: **23 amarillos** y 11 amarillos y fluorescentes. ¿NMP de **coliformes**? | **a) 30,6** | 23 (el número de pocillos, no el NMP) y **34 (sumar 23 + 11)** |
| **1322, 2.º ejercicio, #17** | La misma bandeja: ¿NMP de ***E. coli***? | **b) 12,4** | 11 (los pocillos) y 30,6 (el de coliformes) |
| **1322, 2.º ejercicio, #18** | Filtración en CCA: **20 colonias rosas** (oxidasa negativas) y **15 azul oscuro a violeta**. ¿Coliformes? | **d) 35** | 20: olvidar que *E. coli* también es coliforme |
| **1322, 2.º ejercicio, #19** | Las mismas placas: ¿***E. coli***? | **c) 15** | 35 y 20 |
| **1246 #31** | Colonias como máximo en un filtro de membrana de 47 mm | **c) 80** | 100 y 120 (corrección de ANALISIS.md) |
| **1322, 2.º ejercicio, #13** | Unidades de *E. coli* en el agua de consumo | **c) ufc/100 mL** | ufc/L, ufc/500 mL, ufc/10 mL |

**Y con la concentración de *Legionella***, que se desarrolla en el tema 18:

| Examen | Lo que pedía | Respuesta oficial |
| --- | --- | --- |
| 1322 #25 | Método de referencia para *Legionella* en agua | **c) El cultivo de la UNE-EN ISO 11731:2017** (no el NMP con Legiolert, ni la PCR) |
| 1322 #26 | Incubación de las placas de *Legionella* a 36 °C | **c) 10 días** (corrección de ANALISIS.md; los distractores eran 1 día y 44 ± 4 h) |

Las lecciones:

- **Hay que saber dividir por el volumen sembrado y multiplicar por la dilución**, sin perder un cero.
- **El NMP no se lee contando pocillos o tubos:** se busca en la tabla.
- **En el agua, *E. coli* forma parte de los coliformes:** los pocillos fluorescentes ya son amarillos, y las colonias violetas también cuentan como coliformes. No se suman dos veces ni se olvidan.

---

## 1. Encuadre

| Materia | Tema |
| --- | --- |
| Medios de cultivo y técnicas de siembra (profundidad, superficie, agotamiento) | **12** |
| **Recuento**: diluciones, cálculo en placa, filtración por membrana, concentración y NMP | **13** |
| Validación, incertidumbre y control de calidad de los recuentos | **17** |
| Los métodos concretos del agua (*E. coli*, coliformes, enterococos, *Legionella*…) | **18** |
| Toma de muestras y preparación de los alimentos | **19** |

La norma general del agua es la **UNE-EN ISO 8199** (2018): fija las manipulaciones comunes a todas las técnicas de cultivo (preparación de muestras, medios, material) y **describe las técnicas de detección y recuento por cultivo y los criterios para elegir cada una**. **Excluye las técnicas que no cultivan**, como la PCR. En los alimentos, el equivalente es la **ISO 7218** (2024).

---

## 2. Qué se cuenta y en qué unidades

**Unidad formadora de colonias (ufc):** lo que da una colonia. Puede ser **una célula o un grupo de células** que no se separaron al mezclar. Por eso se habla de ufc y no de bacterias.

**Número más probable (NMP):** una **estimación estadística** de la concentración a partir de cuántos tubos o pocillos dan positivo. No sale de contar colonias, sino de una **tabla de probabilidades**.

| Recuento | Unidad habitual |
| --- | --- |
| Heterótrofos (colonias a 22 °C y 37 °C), alimentos | **ufc/mL** o **ufc/g** |
| *E. coli*, coliformes, enterococos en el agua | **ufc/100 mL** (1322, 2.º ejercicio, #13) |
| NMP en el agua | **NMP/100 mL** |
| *Legionella* | **ufc/L** |

**Las técnicas de recuento por cultivo:**

| Técnica | Cómo | Dónde encaja |
| --- | --- | --- |
| **Recuento en placa** | En profundidad (1 mL) o en superficie (0,1 mL), de la muestra o de sus diluciones | Heterótrofos, alimentos (apartado 4) |
| **Filtración por membrana** | Se filtra un volumen y la membrana se cultiva | Aguas limpias: la técnica más usada (apartado 5) |
| **Número más probable** | Varios tubos o pocillos con medio líquido | Aguas turbias, lodos, alimentos con partículas (apartado 7) |

---

## 3. Dilución

### 3.1. Para qué

Para que **el número de colonias quede dentro del intervalo que se puede contar con fiabilidad**. Una muestra muy contaminada da placas incontables. Diluida, da una placa con 10-300 colonias.

### 3.2. Diluciones decimales

![Banco de diluciones decimales](esquema:banco-diluciones)

- **1 volumen de muestra en 9 de diluyente** = dilución **1/10** (**10⁻¹**). Por ejemplo, 1 mL en 9 mL, o 10 mL en 90 mL.
- **1 mL en 99 mL** = **1/100** (10⁻²) de una vez.
- Se repite en serie: de la 10⁻¹ se toma 1 mL a otros 9 mL y sale la 10⁻²; luego la 10⁻³, etc.

**Cómo se hace** (guía británica):

1. **Agitar la muestra**, invirtiendo el frasco rápidamente varias veces. Por eso el frasco debe tener una **cámara de aire**.
2. **Tubos o frascos con el diluyente estéril** medido, por ejemplo 9 o 90 mL. Si vienen esterilizados y llenos, se comprueba el volumen, porque pueden perder diluyente al esterilizarlos o al guardarlos: **los que no tengan el volumen correcto se desechan**.
3. Transferir 1 volumen de muestra a 9 de diluyente, sujetando el tapón en la mano **sin tocar su interior ni la boca**.
4. **Pipeta estéril nueva en cada paso.**
5. **Mezclar bien cada dilución antes de preparar la siguiente.**
6. Preparar **volumen suficiente** de cada dilución para todos los ensayos.

**Cuántas diluciones:** en muestras ambientales, **al menos dos**. Si la muestra no se ha analizado antes y no se sabe cuántos microorganismos lleva, **tres**. La EPA recomienda **al menos tres** volúmenes o diluciones en la filtración.

**Diluyentes:**

| Uso | Diluyente |
| --- | --- |
| Diluciones de agua y lodos (guía británica) | **Solución de Ringer a un cuarto** o **diluyente de máxima recuperación** |
| Filtración (EPA) | **Agua de dilución tamponada con fosfato** |
| **Bandeja del NMP con sustrato definido** (Colilert) | **Agua destilada o desionizada estéril. No sirven las soluciones tamponadas**, que alteran el ensayo |

### 3.3. Alimentos y otras muestras sólidas

Según la ISO 6887-1, citada en la metodología oficial de la ANMAT:

- **Suspensión inicial:** se pesan **x g** de muestra (**como mínimo 10 g**) y se añaden **9x mL** de diluyente: dilución **1/10**. Se **homogeneiza de 1 a 3 minutos**, según el alimento.
- El diluyente, **a temperatura ambiente**, para no dañar a los microorganismos con un cambio brusco.
- Luego, 1 mL de la suspensión inicial a 9 mL de diluyente: **10⁻²**. Se mezcla **5-10 segundos** con agitador. **La pipeta no se mete más de 1 cm** en la suspensión.
- **Plazos:** desde la suspensión inicial, **30 minutos como máximo** para empezar las diluciones y **45 minutos** hasta que el inóculo toca el medio.

**Homogeneizadores:**

- La **batidora**, con cuchillas en la base del vaso.
- El **homogeneizador peristáltico (Stomacher)**: la muestra se masajea en una **bolsa de plástico**, típicamente **1-3 minutos**. La guía británica lo cita para los lodos; en los alimentos se usa igual.

### 3.4. El factor de dilución

**El resultado de una dilución se multiplica por el inverso de la dilución:**

- **NMP de 14,5 en la dilución 1:100 → 14,5 × 100 = 1450** (1233, 2.ª prueba, #14).
- 32 colonias en 1 mL de la dilución 10⁻³ → 32 × 1000 = **32 000 ufc/mL**, es decir, **3,2 × 10⁴**.

**La dilución introduce variabilidad.** Con una dilución 1:10, encontrar 10 microorganismos da una estimación de 100 por 100 mL, con un intervalo de confianza del 95 % de **50 a 180**. Esa variación pesa poco frente a la que ya tiene el agua de origen. **Los intervalos de confianza no se escriben en el informe**: se tomarían por una afirmación sobre el agua.

---

## 4. Recuento en placa

Las técnicas de siembra se explican en el tema 12. Aquí, cómo se cuentan y cómo se calcula.

### 4.1. Volumen y placas contables

- **Agua tratada:** se siembra **1 mL** de la muestra sin diluir, en profundidad. En superficie se usa **0,1 mL**.
- **Agua contaminada:** una serie de diluciones.
- **Se cuentan las placas con 10 a 300 colonias.** Se usa lupa o contador para no perder las colonias pequeñas.
- **Si todas pasan de 300**, el resultado es **«más de 300»** referido a la dilución más alta.
- **No se escribe «incontable»** sin más explicación.

### 4.2. Cómo se cuentan

**Cuentan como una sola ufc** (guía británica):

- una **cadena** de colonias que parece salir de un solo grumo que se deshizo;
- un **crecimiento extendido** que forma una película en el fondo de la placa;
- una colonia que crece en la **película de agua** del borde o de la superficie.

**Crecimiento invasor** (ISO 4833-1):

- si cubre **menos de un cuarto** de la placa, se cuentan las colonias del resto y se extrapola a la placa entera;
- si cubre **más de un cuarto**, la placa se rechaza.

**Con más de 300 colonias bien separadas** se puede estimar con una **cuadrícula** (por ejemplo, la de Quebec):

- se cuentan **al menos 5 cuadros** grandes elegidos al azar;
- la suma se multiplica por el número de cuadros de la placa entre el de cuadros contados;
- **el resultado es solo una estimación** y se dice así.

**Lectura:**

- **Si no se pueden contar enseguida**, las placas se guardan **a 5 ± 3 °C un máximo de 24 horas** y se atemperan antes de leerlas, porque la condensación estorba.
- **Contadores de colonias:**
  - **manuales**, con superficie iluminada, cuadrícula, lupa y marcador; se comprueban al menos una vez al año con una placa de puntos conocidos (por ejemplo, de 25 a 75);
  - **automáticos**, por análisis de imagen; se ajustan para no contar burbujas ni defectos del agar.

### 4.3. El cálculo

**Recuento (ufc/mL) = colonias ÷ volumen sembrado (mL), multiplicado por el inverso de la dilución.**

| Siembra | Colonias | Cálculo | Resultado |
| --- | --- | --- | --- |
| 1 mL sin diluir | 150 | 150 ÷ 1 | **150 ufc/mL** |
| **0,1 mL sin diluir** | **97** | 97 ÷ 0,1 | **970 = 9,7 × 10² ufc/mL** (1246 #40) |
| 1 mL de la 10⁻² | 45 | 45 ÷ 1 × 100 | **4500 = 4,5 × 10³ ufc/mL** |
| 0,1 mL de la 10⁻³ | 28 | 28 ÷ 0,1 × 1000 | **280 000 = 2,8 × 10⁵ ufc/mL** |

**Truco del 0,1 mL:** cada colonia vale **10 ufc/mL**. Con 100 µL, 97 colonias son 970, no 97 ni 9700.

### 4.4. Dos diluciones consecutivas (ISO 7218)

Cuando cuentan dos diluciones seguidas, la ISO 7218:2007 (en la metodología oficial de la ANMAT) calcula una **media ponderada**:

**N = ΣC ÷ (V × 1,1 × d)**

- **ΣC:** suma de las colonias de las dos placas, **al menos una con 10 colonias o más**;
- **V:** volumen sembrado en cada placa, en mL;
- **d:** la **primera** dilución elegida, la menos diluida;
- **1,1:** porque la segunda placa pesa una décima parte que la primera.

**Ejemplo:** 168 colonias en la 10⁻² y 14 en la 10⁻³, sembrando 1 mL.

N = (168 + 14) ÷ (1 × 1,1 × 10⁻²) = 182 ÷ 0,011 = 16 545 → **1,7 × 10⁴ ufc/mL o g**.

**Redondeo:** a **dos cifras significativas**. Si la tercera es 5 o más, la segunda sube una unidad. Se expresa como un número entre 1,0 y 9,9 por la potencia de 10.

**Recuentos bajos y altos:**

| Situación | Cómo se expresa | Ejemplo con la 10⁻¹ |
| --- | --- | --- |
| Placa con **4 a 9** colonias | **Número estimado** | — |
| Placa con **1 a 3** colonias | Hay microorganismos, pero **menos de 4/d** | **< 40 ufc/g** |
| **Ninguna** colonia | **Menos de 1/d** | **< 10 ufc/g** |
| Todas con **más de 300** | **Más de 300/d**, con la dilución más alta | Con la 10⁻³: **> 3 × 10⁵** |

### 4.5. Siembra en espiral

Un aparato deposita la muestra sobre una placa que gira, **en espiral de Arquímedes**, con un volumen que **disminuye de forma logarítmica** del centro al borde. El volumen de cada sector está calibrado: se cuentan las colonias de un sector y se dividen por su volumen. **Ahorra diluciones intermedias.**

---

## 5. Filtración por membrana

### 5.1. Por qué concentra

**Toda la muestra filtrada deja sus bacterias en la membrana.** Con 100 mL de agua, las colonias de la membrana son las de 100 mL. Es, a la vez, **una técnica de recuento y una de concentración** (apartado 6).

**Material y técnica:**

- **Membranas:**
  - de **47 mm** y **0,45 µm**; de **0,2 µm** para *Legionella*, *Campylobacter* y *Vibrio*;
  - de **90 o 142 mm** para volúmenes grandes, como 500 mL de agua de río;
  - **con cuadrícula**, que facilita el recuento; no deben inhibir ni favorecer el crecimiento a lo largo de las líneas;
  - **estériles, de un solo uso** y dentro de su caducidad.
- **Equipo:** **base porosa, embudo** (a veces graduado) y **vacío**.
- **Embudos:** entre muestras se pueden desinfectar en **agua destilada hirviendo al menos 1 minuto**, o usar uno estéril nuevo.
  - **El agua hirviendo no basta si se buscan esporas**, por ejemplo de *Clostridium perfringens*.
  - Las muestras contaminadas se filtran **aparte o después** de las limpias, y **de la dilución más alta a la más baja**.
- **Volúmenes pequeños** (menos de 20 mL): se añaden antes **20-30 mL de tampón estéril** al embudo, para que las bacterias **se repartan por toda la membrana**. Después se **enjuagan las paredes del embudo** al menos dos veces.
- **La membrana se coloca cara arriba** sobre el medio selectivo y diferencial, **sin burbujas** debajo.

### 5.2. Cuántas colonias

**El volumen se elige para que en la membrana crezcan entre 20 y 80 colonias** del microorganismo buscado (EPA, 1246 #31). **Por encima de 80 el recuento pierde exactitud.**

El resumen oficial de la **UNE-EN ISO 9308-1** (*E. coli* y coliformes en agar CCA) dice que el método es **especialmente adecuado para aguas que den menos de 100 colonias en total** en el medio: agua de consumo, de piscina desinfectada, de salida de potabilizadora. Esas 100 son el **total de colonias**; las **80** son las del **microorganismo diana**.

### 5.3. El cálculo

**Recuento por 100 mL = colonias ÷ volumen filtrado (mL) × 100**

**Reglas de la EPA**, con un intervalo válido de 20-80:

| Caso | Ejemplo | Resultado |
| --- | --- | --- |
| **Una membrana en el intervalo** | 40 colonias en 5 mL | 40 ÷ 5 × 100 = **800 ufc/100 mL** |
| **Réplicas** | 24 y 36 colonias en 100 mL cada una | Media: **30 ufc/100 mL** |
| **Dos volúmenes válidos** | 75 en 10 mL y 30 en 1 mL | 750 y 3000 → media **1875 ufc/100 mL** |
| **Todas por debajo** | 17, 1 y 0 en 100, 10 y 1 mL | La más cercana: **17 ufc/100 mL** |
| Todas por debajo, con cálculo | 18 en 10 mL | **Estimado: 180 ufc/100 mL** |
| **Todas a cero** | 0 en 25, 10 y 2 mL | Como si hubiera 1 en el volumen mayor: **< 4 ufc/100 mL** |
| **Todas por encima** | 150 en 0,3 mL y 110 en 0,01 mL | Con el **menor volumen**: **estimado 1,1 × 10⁶ ufc/100 mL** |

### 5.4. Colonias de dos colores: *E. coli* y coliformes

**En el agua, *E. coli* forma parte de los coliformes.** La guía británica define los coliformes como enterobacterias que crecen a 37 °C y tienen **β-galactosidasa**, e incluye el género ***Escherichia***.

En el **agar CCA**:

- las colonias **rosas a rojas**, **oxidasa negativas**, son **coliformes que no son *E. coli***;
- las colonias **azul oscuro a violeta** son ***E. coli***, que tiene las dos enzimas;
- por tanto, **coliformes = rosas oxidasa negativas + azul-violeta**.

**1322, 2.º ejercicio, #18 y #19:** 20 rosas y 15 violetas en 100 mL → **coliformes 35 ufc/100 mL**; ***E. coli* 15 ufc/100 mL**.

**Cepas que se escapan:** las ***E. coli* sin β-glucuronidasa**, como **O157**, **no salen como *E. coli***, sino como coliformes.

### 5.5. Confirmar parte de las colonias

Si de **N** colonias sospechosas se prueban **n** y se confirman **x**:

**Recuento confirmado = x × N ÷ n**

Ejemplo: 50 colonias, se prueban 10 y se confirman 5 → 5 × 50 ÷ 10 = **25**.

- Con **menos de 10 colonias** sospechosas se suelen **confirmar todas**.
- **En aguas tratadas**, se confirman tantas como sea posible.
- **Las colonias se eligen al azar** y representando los distintos aspectos.

### 5.6. Ventajas y límites frente al NMP

| Filtración por membrana | NMP en tubos |
| --- | --- |
| **Más rápida**: coliformes y *E. coli* presuntivos en **18 horas**, con colonias ya aisladas para confirmar | Más lenta: lectura a 24 y 48 horas, y luego confirmación |
| **Menos trabajo, menos medio y menos vidrio** | Muchos tubos |
| **Menos falsos positivos** | Algunos medios dan falsos positivos |
| **No sirve con aguas turbias**: la membrana **se atasca** y el depósito puede **inhibir** el crecimiento | **Ideal para aguas turbias, con sedimento y lodos** |
| Mal resultado con **pocas dianas entre muchas no diana** | Más sensible para **números muy bajos** |

**En aguas limpias y ambientales, la filtración es la técnica más usada.**

---

## 6. Concentración

**Para qué:** cuando el microorganismo está en **números muy bajos**, hay que examinar un volumen grande y reducirlo a uno pequeño que se pueda sembrar. Es el caso típico de ***Legionella***, que **rara vez supera el 1 % de la flora** del agua.

### 6.1. Técnicas

| Técnica | Cómo | Cuándo |
| --- | --- | --- |
| **Filtración y siembra directa de la membrana** | La membrana va directamente al agar | Pocas bacterias interferentes. Detecta **1 ufc por volumen filtrado** |
| **Filtración y elución** | Lo retenido en la membrana se **resuspende** en un volumen pequeño (**5-10 mL**), que se siembra | El método habitual de *Legionella* |
| **Centrifugación** | **6000 g, 10 min** o **3000 g, 30 min**, a **15-25 °C**. Se retira el sobrenadante y se resuspende el sedimento | Aguas que **no se pueden filtrar**: turbias, coloidales, con aceites. **Recupera bastante menos que la filtración** |
| **Separación inmunomagnética** | **Perlas paramagnéticas recubiertas de un anticuerpo** que capturan al diana; un imán las separa | Por ejemplo, ***E. coli* O157:H7** tras enriquecimiento |

**Formas de eluir la membrana:**

- **ultrasonidos**, con la membrana cubierta de diluyente en baño ultrasónico; es la más habitual;
- **agitación**, al menos 2 minutos, con o sin perlas de vidrio;
- **frotado** en una bolsa de Stomacher;
- **raspado** con un rascador estéril;
- **vórtex**, cortando la membrana si hace falta.

**Membranas para eluir:** de **policarbonato o polietersulfona**, de **0,2 µm**.

### 6.2. El factor de concentración

- **Volumen ideal de muestra: 1000 mL.**
- **El concentrado final debe representar una concentración de 100 a 1000 veces** el volumen original. Por ejemplo, **1000 mL → 10 mL = 100 veces**.
- La concentración debe permitir **detectar al menos 100 ufc por litro**: es el nivel de alerta británico.
- **Cada paso de concentración pierde parte de las bacterias.** Se pueden encadenar varios para bajar el límite, pero **la recuperación total empeora**.
- **Sin concentrar**, sembrando directamente un volumen pequeño (**no más de 0,5 mL**), solo se detectan concentraciones altas.

**El cálculo en ufc por litro:**

**ufc/L = colonias × (1000 ÷ A) × (B ÷ V)**

- **A:** volumen de muestra concentrado (mL);
- **B:** volumen del concentrado (mL);
- **V:** volumen del concentrado sembrado (mL).

**Ejemplos** (guía británica):

| Colonias | A | B | V | Cálculo | Resultado |
| --- | --- | --- | --- | --- | --- |
| 45 | 1000 mL | 10 mL | 0,5 mL | 45 × 1 × 20 | **900 ufc/L** |
| 21 | 500 mL | 10 mL | 0,1 mL | 21 × 2 × 100 | **4200 ufc/L** |

### 6.3. *Legionella*: lo que enlaza con el tema 18

- **El método de referencia es el cultivo de la UNE-EN ISO 11731:2017** (1322 #25). Sirve para todo tipo de aguas y para biopelículas y sedimentos.
- La ISO 11731 tiene **tres variantes**:
  - **siembra directa** de la muestra;
  - **filtración y membrana directa** sobre el agar;
  - **filtración y elución**.
- **Una parte del concentrado se trata con ácido y otra con calor**, para frenar a la flora acompañante, y se siembran las tres: **sin tratar, ácida y calentada**. Se da el recuento de la placa con **más colonias confirmadas**.
- **Incubación: 36 ± 1 °C durante 10 días** (1322 #26), en **atmósfera húmeda**, revisando las placas cada 2-3 días; por ejemplo, **los días 3, 7 y 10**.
- **No todas las especies de *Legionella* son cultivables.** El método no las recupera todas.

---

## 7. Número más probable

### 7.1. El fundamento

**Se diluye la muestra hasta que unos tubos reciben algún microorganismo y otros no.** Cada tubo con al menos uno **crece y cambia** (color, gas, fluorescencia); los demás no.

**Con cuántos tubos son positivos en cada volumen**, una **tabla de probabilidades** da la concentración que hace **más probable** ese resultado: el NMP.

**Supuestos** (manual de la FDA):

- los microorganismos están **repartidos al azar** y **no forman grumos**; de ahí la importancia de **mezclar bien**;
- **todo tubo con al menos uno vivo da crecimiento** visible;
- los tubos son **independientes**.

**Consecuencias:**

- **Solo cuenta microorganismos viables.**
- **Necesita tubos positivos y negativos.** Si todos son positivos, el resultado es **«mayor que»** el máximo de la tabla; si todos son negativos, **«menor que»** el mínimo.
- **No es un valor exacto.** Con pocos tubos hay un **«intervalo más probable»** de valores casi igual de probables. Cuantos más tubos, más preciso: por eso las bandejas de **50 pocillos o más** estiman mejor y en un intervalo mayor.
- Las tablas **omiten las combinaciones improbables**, que hacen sospechar un error o una contaminación.

**Es especialmente útil** con **concentraciones bajas** y en muestras con **partículas que estorban el recuento de colonias**: aguas turbias, lodos, leche y alimentos.

### 7.2. Tubos múltiples en el agua

El método británico de coliformes y *E. coli* usa **caldo de glutamato modificado con minerales**, con **púrpura de bromocresol**: el ácido de la lactosa lo vira **de púrpura a amarillo**.

| Calidad del agua | Serie | Volumen total |
| --- | --- | --- |
| **Buena** | **1 × 50 mL + 5 × 10 mL** | 100 mL |
| **Dudosa o desconocida** | **1 × 50 + 5 × 10 + 5 × 1 mL** (**11 tubos**) | **105 mL** |
| **Contaminada** | **5 × 10 + 5 × 1 + 5 × 0,1 mL** (**15 tubos**) | 55,5 mL |
| **Muy contaminada** | Diluciones de **1/100, 1/1000** o más | — |

- **Los volúmenes de 50 y 10 mL se añaden a un volumen igual de medio de doble concentración.** Los de 1 mL o menos, a **5 mL de medio de concentración simple**.
- **Incubación a 37 °C:** se lee a las **24 horas** y otra vez a las **48 horas**. **Amarillo = positivo.** **Crecimiento sin cambio de color = negativo.**
- **Confirmación:** los positivos se resiembran. **Coliformes:** lactosa a 37 °C y **oxidasa negativa**. ***E. coli*:** además, lactosa a **44 °C** e **indol**.
- **Ejemplo:** en la serie de 15 tubos, **3, 2 y 0** positivos → la tabla da **13 por 100 mL**.

### 7.3. Tubos en alimentos y cambio de escala

El manual de la FDA tabula series de **3, 5, 8 o 10 tubos** por dilución, con **tres diluciones decimales** de **0,1, 0,01 y 0,001 g** de muestra por tubo.

- Ejemplo: **3 tubos por dilución**, resultado **3-1-0** → **43 NMP/g**.
- **Si los inóculos son 10 veces menores** (0,01, 0,001 y 0,0001 g), **el NMP de la tabla se multiplica por 10**: **430 NMP/g**.
- Es la misma idea que el **factor de dilución** del apartado 3.4.

### 7.4. NMP con sustrato definido: la bandeja de 51 pocillos

Es el método de la **UNE-EN ISO 9308-2** (coliformes y *E. coli* por NMP). Según su resumen oficial:

- **sirve para todo tipo de aguas**, incluso con **mucha materia en suspensión** y **mucha flora heterótrofa**;
- **no sirve para coliformes en agua de mar**;
- **da un resultado confirmado**, sin pruebas posteriores.

![Bandeja de NMP de 51 pocillos](esquema:bandeja-nmp-51)

**Cómo se hace** (guía británica, con Colilert-18 y Quanti-Tray como ejemplo):

1. **100 mL de muestra** (o de su dilución) en un **frasco estéril con antiespumante**.
2. Se añade un **sobre de medio** y se agita suavemente hasta disolver.
3. Se vierte en la **bandeja** y se **sella en caliente**: quedan **51 pocillos**.
4. **No más de 2 horas** entre inocular e incubar. **Nada de sol directo**: hidroliza los sustratos y da **falsos positivos**.
5. **Incubar a 37 °C entre 18 y 22 horas**, con los pocillos hacia abajo.
6. **Leer:**
   - **pocillos amarillos** = **coliformes**: la **β-galactosidasa** rompe el ONPG;
   - **pocillos amarillos y con fluorescencia azul-blanca bajo luz UV de 365-366 nm** = ***E. coli***: la **β-glucuronidasa** rompe el MUG.

   Se comparan con el **comparador** del fabricante.
7. **Buscar en la tabla** el NMP por 100 mL que corresponde a cada número de pocillos.

**Límites:**

- la **turbidez** puede tapar el color;
- **muchas *Aeromonas*** pueden dar falsos positivos;
- las diluciones, con **agua destilada estéril, nunca tamponada**.

**La tabla de 51 pocillos** (IDEXX, la que adjuntó el examen):

| Pocillos positivos | 0 | 1 | 5 | 10 | 11 | 20 | 23 | 30 | 40 | 50 | 51 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **NMP/100 mL** | **< 1** | 1,0 | 5,3 | 11,1 | **12,4** | 25,4 | **30,6** | 45,3 | 78,2 | 200,5 | **> 200,5** |

**Cómo se resuelve el 1322, 2.º ejercicio, #16 y #17:**

| Paso | Coliformes | *E. coli* |
| --- | --- | --- |
| **Qué pocillos cuentan** | **Todos los amarillos: 23**. Los 11 fluorescentes **ya son amarillos y están dentro** de los 23 | **Solo los fluorescentes: 11** |
| **Qué se busca en la tabla** | 23 → **30,6 NMP/100 mL** | 11 → **12,4 NMP/100 mL** |
| **Errores que el examen ofrecía** | 23 (el número de pocillos) y **34 (23 + 11)** | 11 (el número de pocillos) y 30,6 |

**Con dilución:** si los 100 mL eran de la muestra diluida 1:10, el NMP de la tabla **se multiplica por 10**.

### 7.5. El NMP de *Legionella pneumophila*

Existe un sistema comercial de NMP para ***L. pneumophila*** (**Legiolert**):

- bandeja de **96 pocillos**;
- **39 °C durante 7 días**;
- positivos por **color marrón o turbidez**.

**No es el método de referencia:** el de referencia es el **cultivo de la ISO 11731** (1322 #25).

---

## 8. Cuadro de cifras

| Cifra | Dónde |
| --- | --- |
| **1 + 9 = 1/10**; 1 + 99 = 1/100; 10 + 90 = 1/10 | Diluciones |
| **≥ 2 diluciones**; **3** si no se conoce la muestra | Diluciones |
| Alimentos: **≥ 10 g + 9 partes** de diluyente; homogeneizar **1-3 min**; **≤ 30 min** hasta diluir y **≤ 45 min** hasta sembrar | Alimentos |
| Placas válidas: **10-300 colonias**; si todas > 300, **«más de 300»** | Recuento en placa |
| **0,1 mL**: cada colonia, **10 ufc/mL** (97 → 9,7 × 10²) | Recuento en placa |
| ISO 7218: **N = ΣC ÷ (V × 1,1 × d)**; **dos cifras significativas** | Dos diluciones |
| Sin colonias: **< 1/d**; 1-3 colonias: **< 4/d** | Recuentos bajos |
| Placas sin leer: **5 ± 3 °C, ≤ 24 h** | Lectura |
| Membrana **47 mm, 0,45 µm** (0,2 µm *Legionella*) | Filtración |
| **20-80 colonias**, tope **80**; la ISO 9308-1, **< 100 colonias en total** | Filtración |
| **ufc/100 mL = colonias ÷ mL filtrados × 100** | Filtración |
| Todas a cero: **< 100 ÷ volumen mayor** (25 mL → < 4) | Filtración |
| Confirmación: **x × N ÷ n** | Filtración |
| Concentrado **100-1000 veces**; muestra ideal **1000 mL** | Concentración |
| Centrifugación **6000 g 10 min** o **3000 g 30 min** | Concentración |
| ***Legionella***: **ufc/L**; **36 ± 1 °C, 10 días** | Concentración |
| Tubos: **11 tubos = 105 mL**; **15 tubos** para aguas contaminadas | NMP |
| Tubos: **37 °C**, lectura a **24 y 48 h** | NMP |
| Bandeja: **51 pocillos**; **37 °C, 18-22 h**; **≤ 2 h** hasta incubar; **UV 365-366 nm** | NMP |
| Bandeja: **23 → 30,6**; **11 → 12,4**; **0 → < 1**; **51 → > 200,5** | NMP |
| Legiolert: **96 pocillos, 39 °C, 7 días** | NMP |

---

## 9. Puntos críticos para el examen

1. **ufc/mL = colonias ÷ mL sembrados × inverso de la dilución.** Con **100 µL**, 97 colonias son **9,7 × 10²** (1246 #40).
2. **Factor de dilución:** NMP 14,5 en la 1:100 → **1450** (1233, 2.ª prueba, #14).
3. **Las diluciones decimales son 1 + 9**, con **pipeta nueva** y **mezclando cada una** antes de la siguiente. **Ringer a un cuarto** o **diluyente de máxima recuperación**.
4. **Placas: 10-300 colonias.** **Membrana: 20-80, tope 80** (1246 #31).
5. **Filtración: ufc/100 mL = colonias ÷ volumen × 100.** Es la técnica más usada en aguas limpias; **no sirve con aguas turbias**.
6. **NMP: tubos o pocillos positivos y negativos, y una tabla.** Útil con **pocas bacterias** y en **aguas turbias, lodos y alimentos**. **No es un valor exacto.**
7. **Bandeja de 51 pocillos:** **amarillo = coliformes** (β-galactosidasa); **amarillo + fluorescencia UV = *E. coli*** (β-glucuronidasa). **Los fluorescentes ya están entre los amarillos: no se suman.** 23 → **30,6**; 11 → **12,4** (1322, 2.º ejercicio, #16-17).
8. **En CCA, coliformes = rosas oxidasa negativas + violetas.** 20 + 15 = **35**; *E. coli* = **15** (1322, 2.º ejercicio, #18-19).
9. ***E. coli* en agua: ufc/100 mL** (1322, 2.º ejercicio, #13). *Legionella*: **ufc/L**.
10. **Concentración:** **filtración** (la de más recuperación), **elución**, **centrifugación** (para aguas que no filtran) o **separación inmunomagnética**. Factor **100-1000**.
11. ***Legionella*: cultivo de la ISO 11731** (1322 #25), **36 °C durante 10 días** (1322 #26).
12. **Media ponderada ISO 7218: N = ΣC ÷ (V × 1,1 × d)**, redondeada a dos cifras significativas.

---

## Dudas declaradas

1. **Las normas ISO son de pago y no se han leído.** De la **8199**, la **9308-1**, la **9308-2**, la **11731** y la **7218** se han consultado solo sus **resúmenes oficiales**. Los procedimientos salen de los **métodos británicos**, de la **EPA**, de la **FDA** y de la **metodología oficial argentina**, que las siguen o las citan.
2. **La fórmula N = ΣC ÷ (V × 1,1 × d)** es de la **ISO 7218:2007**, tal como la reproduce la ANMAT, y aparece en la **ISO 4833-1:2013**. La **ISO 7218 se revisó en junio de 2024**. Según la nota de un proveedor de laboratorio, que **no es fuente citable**, la nueva edición cambia la expresión de resultados. No se ha podido comprobar en la norma: **se mantiene la fórmula de 2007** porque es la que reproduce la metodología oficial consultada.
3. **Los intervalos de recuento no son iguales en todas partes:**
   - **10-300** colonias por placa: método británico de heterótrofos e ISO 4833-1;
   - **30-300**: placas de control de la EPA;
   - **20-80** por membrana: EPA y respuesta del 1246 #31.

   Se enseña el de cada técnica según la fuente que lo da.
4. **Colores del CCA** (1322, 2.º ejercicio, #18-19):
   - **Los colores** salen de la **plantilla oficial** y de las opciones del examen, como en el tema 12.
   - **Que *E. coli* cuenta como coliforme** está comprobado en la definición británica de coliformes, que incluye el género *Escherichia* y la β-galactosidasa.
   - **La regla exacta de recuento** de la ISO 9308-1 no se ha leído.
5. **Tabla de 51 pocillos:**
   - **Los valores con decimales son los de IDEXX**, comprobados a la vista en su tabla y en la que adjuntó el examen: son idénticas.
   - **La guía británica redondea a enteros**: 31 pocillos dan 48 en su tabla y 47,8 en la del fabricante.
   - En el examen manda la tabla adjunta.
6. **Tablas de tubos:** solo se han usado los **ejemplos que el propio texto de la fuente resuelve**: 3-2-0 → 13/100 mL y 3-1-0 → 43/g. Las tablas completas no se transcriben: al extraer el texto, sus columnas salían desalineadas.
7. **Lo que no se trata:**
   - los **recuentos que no cultivan**: cámara de Neubauer, citometría, ATP, PCR. La ISO 8199 los excluye del recuento por cultivo;
   - la **concentración de virus y protozoos**;
   - la **regla de la FDA para elegir tres diluciones** entre más de tres.
8. **Ficha de apoyo (BIO_04).** Solo cubre la homogeneización, con el Stomacher, y la dilución de alimentos. Las dos cosas se han tomado de la ANMAT y de la guía británica. Nada del apunte sale de ella.

---

## Fuentes y verificación

- **Guía británica de laboratorios de aguas (2017):** apartados 7.2 y 7.3 **leídos enteros**; 5.4, 5.12, 5.23-5.24 y 5.29.
- **Métodos británicos de agua de consumo:**
  - **parte 4 (2016)**, métodos C y D y apéndice D1;
  - **parte 7 (2020)**, lectura y cálculo de heterótrofos.
- **Método británico de *Legionella* (2020):** principios, concentración, elución, centrifugación, cálculo, incubación y método NMP.
- **EPA, método 1103.2 (2023):** apartados 11 y 13 y **apéndice B completo**.
- **FDA, BAM, apéndice 2 (2023):** fundamento, supuestos, uso de tablas y conversión de unidades.
- **ANMAT, vol. III:** recuento de aerobios mesófilos (ISO 4833-1) y **anexo 3** (ISO 7218:2007).
- **IDEXX:** tabla de 51 pocillos, **a la vista** en la página renderizada.
- **SNV (Suiza):** resúmenes oficiales de las ISO 8199, 9308-1, 9308-2, 11731 y 7218.
- **Exámenes:**
  - plantillas definitivas de 1233 y 1322 y provisional de 1246 (PLANTILLAS.md);
  - preguntas **renderizadas y leídas a la vista**: 1246 #40, 1233 2.ª #14 y 1322 2.º #13-19, con su tabla adjunta.
- **ANALISIS.md:**
  - la corrección de las **80 colonias** se aplica en el apartado 5.2;
  - la de ***Legionella* a 36 °C durante 10 días**, en el apartado 6.3, con el método británico que la confirma.
- **Fecha de verificación:** 1 de octubre de 2026.
