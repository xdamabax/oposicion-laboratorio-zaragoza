---
tema: 25
titulo: "Espectrofotometría de absorción molecular: Concepto. Leyes de absorción de la luz. Instrumentación visible-ultravioleta. Fuentes comunes de error. Utilización de la espectrofotometría molecular en análisis de agua."
parte: Parte segunda
estado: aprobado
verificado: 2026-09-03
fuentes:
  - "UNE-EN ISO 6878:2005, Calidad del agua. Determinación del fósforo. Método espectrométrico con molibdato de amonio (ISO 6878:2004). Campo de 0,005 a 0,8 mg/L sin dilución. — https://www.une.org/encuentra-tu-norma/busca-tu-norma/norma?c=N0032755"
  - "UNE-EN 26777:1994, Calidad del agua. Determinación de nitrito. Método de espectrometría de absorción molecular (ISO 6777:1984). — https://www.une.org/encuentra-tu-norma/busca-tu-norma/norma?c=N0011090"
  - "UNE-EN ISO 7393-2:2019, Calidad del agua. Determinación del cloro libre y del cloro total. Parte 2: Método colorimétrico con N,N-dialquil-1,4-fenilendiamina (DPD) para control de rutina. ANULA Y SUSTITUYE a la UNE-EN ISO 7393-2:2000. — https://tienda.aenor.com/p/norma-une-en-iso-7393-2-2019-n0061582"
  - "UNE-EN ISO 7887:2012, Calidad del agua. Examen y determinación del color (ISO 7887:2011). Describe cuatro métodos, A a D. — https://www.une.org/encuentra-tu-norma/busca-tu-norma/norma/?c=N0049776"
  - "ISO 7150-1:1984, Water quality. Determination of ammonium. Part 1: Manual spectrometric method (azul de indofenol). Sin adopción UNE confirmada y en revisión en ISO (ver «Dudas»)."
  - "ISO 6332, Water quality. Determination of iron. Spectrometric method using 1,10-phenanthroline. Y UNE-EN 903 para agentes de superficie aniónicos por el método del azul de metileno. Citadas sin año confirmado (ver «Dudas»)."
  - "Real Decreto 3/2023, de 10 de enero (BOE-A-2023-628), texto consolidado, anexo III, parte D: para los parámetros físico-químicos NO se impone método, solo criterios de rendimiento (límite de cuantificación ≤ 30 % del valor paramétrico e incertidumbre de la tabla 15). — https://www.boe.es/buscar/act.php?id=BOE-A-2023-628"
  - "LibreTexts en español, «Análisis Instrumental», cap. 13.2 Ley de Beer-Lambert (transmitancia, absorbancia, aditividad y limitaciones), traducción de D. Harvey, Analytical Chemistry 2.1."
  - "INM de Colombia, «Guía de calibración de espectrofotómetros UV-Vis» (M-06-F-01), y documentación de laboratorios de calibración acreditados: patrones de holmio, didimio y filtros de densidad óptica neutra."
  - "BIBLIOGRAFÍA TÉCNICA (no consultable en línea): Skoog, West, Holler y Crouch, «Fundamentos de Química Analítica» y «Principios de Análisis Instrumental»; Harris, «Análisis Químico Cuantitativo». Son la referencia de los apartados 2.1 a 2.4."
---

> **NÚCLEO REPETIDO COMPROBADO.** Éste es el primer tema desde el 22 que tiene una pregunta **documentada como recurrente** en los exámenes anteriores: la **ley de Lambert-Beer**, en **1233 #8 y 1322 #11**. El apartado 2.2 es, por tanto, lo más rentable de todo el tema, y va desarrollado con ese peso.

> **Aviso de fuentes.** El bloque de teoría —concepto, leyes, instrumentación, errores— **no tiene norma**: es doctrina de química analítica. Lo que sí tiene norma, y verificada, es **cada método concreto de análisis de agua**: fósforo (UNE-EN ISO 6878), nitrito (UNE-EN 26777), cloro (UNE-EN ISO 7393-2), color (UNE-EN ISO 7887). Y un dato que conviene tener claro: **el Real Decreto 3/2023 NO impone método** para los parámetros físico-químicos, solo **criterios de rendimiento**.

> **Reparto con los temas 33 a 35.** Aquí se desarrolla **la técnica y el método**: qué reactivo forma el color, a qué longitud de onda se mide, qué norma lo recoge. El **parámetro** —qué significa en un agua, su valor paramétrico, su frecuencia de control— es del **tema 33** (agua de consumo: cloro, amonio, nitritos, oxidabilidad, dureza, alcalinidad) y de los **34 y 35** (residuales). Mismo criterio que en los temas 21 a 24.

> **Reparto con los temas 26 a 32.** Aquí, **solo absorción molecular UV-visible**. La **absorción atómica** es del **26**; el **ICP**, del **27**; la **turbidez, el índice de refracción y la polarimetría**, del **28**; y la **cromatografía**, de los **30 a 32**. La diferencia de fondo con el 26 es que aquí absorbe **la molécula** (bandas anchas) y allí absorbe **el átomo libre** (líneas estrechas).

## 1. Encuadre

La espectrofotometría de absorción molecular mide **cuánta luz absorbe una disolución** a una longitud de onda dada, y de ahí deduce la concentración del analito. Es, con diferencia, **la técnica instrumental más usada en un laboratorio de aguas**: el equipo es barato, la medida es rápida y casi cualquier ion se puede convertir en un compuesto coloreado que absorba.

De ahí que sea también la respuesta más repetida al patrón de pregunta *«¿qué técnica utilizaría para determinar X?»* del segundo ejercicio.

| Qué regula | Norma o referencia | Lógica |
| --- | --- | --- |
| Concepto, leyes de absorción, instrumentación y errores | Skoog, Harris; material docente universitario | **Doctrina técnica**, no norma |
| **Fósforo / fosfato** | **UNE-EN ISO 6878:2005** | Ensayo normalizado |
| **Nitrito** | **UNE-EN 26777:1994** | Ensayo normalizado |
| **Cloro libre y total** | **UNE-EN ISO 7393-2:2019** | Ensayo normalizado |
| **Color** | **UNE-EN ISO 7887:2012** | Ensayo normalizado |
| Amonio, hierro, detergentes aniónicos | ISO 7150-1; ISO 6332; UNE-EN 903 | Ensayo normalizado (ver «Dudas») |
| Qué se le exige al método en agua de consumo | **RD 3/2023**, anexo III, parte D | Norma con rango de ley |

## 2. Desarrollo

### 2.1. Concepto

Cuando la radiación atraviesa una disolución, parte se **absorbe**. En la región **ultravioleta-visible** esa absorción se debe a **transiciones electrónicas**: un electrón de la molécula pasa a un nivel de energía superior, y para hacerlo toma del haz un fotón de la energía justa.

| Región | Intervalo aproximado |
| --- | --- |
| **Ultravioleta** (el que se usa, «UV próximo») | **190 - 380 nm** |
| **Visible** | **380 - 780 nm** |

Como las moléculas en disolución tienen además niveles vibracionales y rotacionales, lo que se obtiene no son líneas sino **bandas anchas**. Ésa es la diferencia visual con la absorción atómica del tema 26, donde el átomo libre da **líneas estrechas**.

**El espectro de absorción** es la representación de la absorbancia frente a la longitud de onda. De él se saca la **λ máxima (λmáx)**, que es donde se mide siempre, por dos razones:

1. Es donde la **sensibilidad** es mayor (mayor absortividad).
2. Es donde la curva es **más plana**, así que un pequeño error en la longitud de onda apenas cambia la lectura.

**El color que vemos es el complementario del que se absorbe:** una disolución que absorbe en el azul (≈ 435 nm) se ve amarilla. Por eso a los métodos del visible se les llama **colorimétricos**, y de ahí que se les añada un **reactivo cromogénico** al analito incoloro.

### 2.2. Leyes de absorción de la luz

Es el apartado con **núcleo repetido comprobado**.

![Ley de Lambert-Beer: el haz entra con intensidad I₀ y sale atenuado a I tras atravesar la cubeta](esquema:ley-beer)

#### Transmitancia y absorbancia

| Magnitud | Definición | Rango |
| --- | --- | --- |
| **Transmitancia (T)** | **T = I / I₀**: la fracción de luz que atraviesa la muestra | 0 a 1 (o 0 a 100 % en %T) |
| **Absorbancia (A)** | **A = − log T = log (I₀ / I)** | 0 a ∞ (en la práctica, 0 a 2) |

Son inversas: **a más absorbancia, menos transmitancia**. Y la relación es **logarítmica**, no lineal: T = 10 % equivale a A = 1; T = 1 % equivale a A = 2.

#### Las dos leyes y su combinación

- **Ley de Lambert** (o de Bouguer): la absorbancia es proporcional al **espesor** atravesado.
- **Ley de Beer**: la absorbancia es proporcional a la **concentración**.

Combinadas dan **la ley de Lambert-Beer**, que es la ecuación del tema:

> **A = ε · b · c**

| Término | Qué es | Unidades |
| --- | --- | --- |
| **A** | Absorbancia | **Adimensional** |
| **ε** | **Absortividad molar**: lo que absorbe esa especie a esa λ | **L · mol⁻¹ · cm⁻¹** |
| **b** | **Camino óptico**: el espesor de la cubeta | **cm** (lo normal, 1 cm) |
| **c** | Concentración | **mol/L** |

Si la concentración se expresa en **g/L**, el coeficiente se llama simplemente **absortividad (a)** y sus unidades son L·g⁻¹·cm⁻¹.

Dos consecuencias que se preguntan:

- **ε depende de la longitud de onda** y de la especie, no de la concentración. Es una constante característica.
- **Las absorbancias son ADITIVAS**: en una mezcla, la absorbancia total es la suma de las de cada componente, siempre que no interaccionen. Sobre esto se apoya el análisis de mezclas a varias longitudes de onda.

#### El intervalo de trabajo

La absorbancia no se mide igual de bien en todo el rango. El **error fotométrico relativo** pasa por un **mínimo en torno a A ≈ 0,4** (una transmitancia de ≈ 37 %), y crece mucho tanto para absorbancias muy bajas como muy altas.

En la práctica, **se trabaja entre A = 0,1 y A = 1**, aproximadamente. Si la muestra sale por encima, **se diluye**; si sale por debajo, se concentra o se usa una cubeta de mayor camino óptico.

#### Desviaciones de la ley de Beer

![Recta de calibrado: la curva real coincide con la ideal a baja concentración y se separa hacia abajo al subir](esquema:desviacion-beer)

La ley se cumple **solo en un intervalo**, y las desviaciones son casi siempre **negativas** (la absorbancia medida es **menor** que la esperada). Se agrupan en tres clases:

| Clase | Causa | Cómo se maneja |
| --- | --- | --- |
| **Reales** | A concentraciones altas las partículas de analito **interaccionan** y cambia el **índice de refracción**, que altera ε. Es una limitación de la propia ley, no del método | **Diluir**: trabajar en disolución diluida |
| **Químicas** | El analito **se disocia, se asocia o reacciona con el disolvente**, y la especie que absorbe deja de ser la misma. Típico de ácidos y bases débiles y de complejos | **Tamponar** patrones y muestras al mismo pH, y controlar la composición |
| **Instrumentales** | **Radiación policromática**: el haz no es perfectamente monocromático, y si ε varía en esa banda la absorbancia sale menor. **Luz parásita** (radiación que llega al detector sin pasar por la muestra): produce desviación negativa a absorbancias altas | Rendija estrecha; medir en el **máximo** del pico, donde ε varía poco; equipo bien mantenido |

**La regla mnemotécnica del apartado:** *reales, químicas e instrumentales*, y las tres tiran de la curva **hacia abajo**.

### 2.3. Instrumentación visible-ultravioleta

![Espectrofotómetro UV-visible de haz simple: fuente, monocromador, cubeta, detector y lectura](esquema:espectrofotometro)

El camino de la luz es siempre el mismo: **fuente → selector de longitud de onda → muestra → detector → lectura**.

#### Fuentes

| Fuente | Región | Nota |
| --- | --- | --- |
| **Lámpara de deuterio (D₂)** | **Ultravioleta**, ≈ 190 - 380 nm | Emisión continua; es la que obliga a usar cuarzo |
| **Lámpara de tungsteno o tungsteno-halógena (W)** | **Visible e infrarrojo próximo**, ≈ 320 - 1 100 nm | Es un filamento incandescente |
| Lámpara de xenón (pulsada) | Todo el UV-visible | En equipos compactos y de campo |

Un espectrofotómetro **UV-visible** lleva **las dos primeras**, y conmuta de una a otra en torno a los 350 nm.

#### Selector de longitud de onda

Aquí está la distinción de nombres que conviene fijar:

| Instrumento | Cómo selecciona la λ | Consecuencia |
| --- | --- | --- |
| **Fotómetro** o **colorímetro** | Con un **filtro** | Banda ancha, solo unas pocas λ fijas. Barato y robusto: es lo típico del equipo de campo |
| **Espectrofotómetro** | Con un **monocromador** | Cualquier λ, banda estrecha, y permite **barrer el espectro** |

El **monocromador** tiene: **rendija de entrada**, **elemento dispersante** —hoy casi siempre una **red de difracción**, antes un prisma— y **rendija de salida**. De todo el abanico de longitudes de onda que sale del elemento dispersante, **solo pasa la que la rendija de salida deja pasar**.

El **ancho de banda espectral** depende de la anchura de las rendijas: rendija estrecha, banda estrecha y mejor cumplimiento de la ley de Beer, pero menos luz y más ruido.

#### Cubetas

Es de lo que más se pregunta, porque es un error de trabajo muy común:

| Material | Se puede usar en |
| --- | --- |
| **Plástico** | Solo **visible** |
| **Vidrio** | Solo **visible**: el vidrio **absorbe el ultravioleta** |
| **Cuarzo (sílice fundida)** | **Ultravioleta y visible**: es obligatorio por debajo de ≈ 340 nm |

El camino óptico habitual es de **1 cm**. Las cubetas tienen **dos caras ópticas pulidas** —las que atraviesa el haz— y dos **esmeriladas**: se sujetan **por las esmeriladas**, y las ópticas no se tocan con los dedos.

#### Detectores

**Fototubo**, **fotomultiplicador** (muy sensible, el clásico), **fotodiodo de silicio** y **agrupación o array de fotodiodos**.

#### Configuraciones

| Configuración | Cómo funciona | Ventaja |
| --- | --- | --- |
| **Haz simple** | Un solo camino óptico: primero se mide el blanco, luego la muestra | El más barato. Sensible a la **deriva** de la lámpara entre las dos medidas |
| **Doble haz** | El haz se divide entre la muestra y la referencia y se comparan continuamente | **Compensa la deriva** de fuente y detector; permite **barrer el espectro** cómodamente |
| **Array de fotodiodos (DAD)** | La muestra se ilumina con **luz policromática** y la dispersión ocurre **DESPUÉS**: cada diodo recoge una λ | Registra **todo el espectro a la vez**, en menos de un segundo |

Ojo al detalle del **array de diodos**, que es contraintuitivo: **la muestra recibe todas las longitudes de onda y el monocromador va detrás**, al revés que en los otros dos.

### 2.4. Fuentes comunes de error

| Error | Qué lo produce | Cómo se evita |
| --- | --- | --- |
| **Cubeta sucia, rayada o con huellas** | Dispersión y absorción que no son de la muestra | Limpiar; sujetar por las **caras esmeriladas**; enjuagar con la propia disolución |
| **Cubeta mal orientada o cubetas no emparejadas** | Cada cubeta tiene su pequeño error propio | Usar **siempre la misma orientación** (muchas llevan marca) y cubetas emparejadas |
| **Burbujas o partículas en el haz** | Dispersan la luz: absorbancia falsa por exceso | Llenar con cuidado, golpear suavemente, dejar reposar |
| **Blanco inadecuado** | El blanco debe llevar **todos los reactivos menos el analito** | Preparar el blanco con la misma matriz y los mismos reactivos |
| **Muestra turbia o coloreada de origen** | La **turbidez dispersa** la luz y se lee como absorbancia | **Filtrar o centrifugar**; usar un blanco de la propia muestra |
| **Trabajar fuera del intervalo lineal** | Por encima de A ≈ 1 la desviación es grande | **Diluir** la muestra y volver a medir |
| **Longitud de onda mal ajustada** | La escala se descalibra con el tiempo | Medir en **λmáx**; verificar la escala con patrones de **holmio** o **didimio** |
| **Luz parásita** | Imperfecciones del monocromador y radiación difusa | Verificar con disoluciones de corte; desviación negativa a A altas |
| **Deriva de la lámpara** | La fuente no es estable en frío | **Dejar estabilizar** el equipo; usar **doble haz** |
| **Tiempo y temperatura del color** | Muchas reacciones necesitan un tiempo de desarrollo y el color luego se degrada | **Respetar el tiempo del método** en patrones y muestras por igual |
| **Interferencias químicas** | Otras especies reaccionan con el cromógeno o absorben a esa λ | Enmascarar, separar o cambiar de λ |

#### Verificación del equipo

Sin norma española específica que lo regule (ver «Dudas»), la práctica de laboratorio comprueba cuatro cosas:

| Qué se verifica | Con qué |
| --- | --- |
| **Escala de longitudes de onda** | **Filtro u óxido de holmio** (bandas entre ≈ 240 y 650 nm) y **filtro de didimio** (≈ 380 a 900 nm) |
| **Escala fotométrica (absorbancia)** | **Filtros de densidad óptica neutra** certificados; clásicamente, disoluciones de **dicromato potásico** |
| **Luz parásita** | Disoluciones de corte, que deben dar absorbancia muy alta |
| **Línea base y ruido** | Barrido con la cubeta vacía o con el blanco |

### 2.5. Utilización en el análisis de agua

Casi ningún ion de interés absorbe por sí mismo en el visible. La estrategia es siempre la misma: **añadir un reactivo cromogénico** que reaccione con el analito y forme un compuesto **coloreado y estable**, y medir ese color.

**Lo que se le pide al reactivo:** que la reacción sea **selectiva**, **estequiométrica** y **rápida**, y que el producto tenga una **absortividad alta** y sea **estable** el tiempo suficiente para medirlo.

**El procedimiento tipo**, común a casi todos los métodos normalizados:

1. Toma de alícuota y, si hace falta, **filtración** o **digestión** previa.
2. Adición de reactivos en orden y en las condiciones de pH que fije el método.
3. **Espera del tiempo de desarrollo del color**, el mismo para patrones y muestras.
4. Medida frente al **blanco de reactivos** a la λ del método.
5. Interpolación en la **recta de calibrado** construida con patrones tratados igual que las muestras.

Todo esto está también detrás de los **kits de cubeta precintada** y de los **fotómetros de campo**: cambia el formato, no el fundamento.

**Un caso aparte, sin reactivo:** el **nitrato** puede medirse **directamente en el ultravioleta**, porque absorbe hacia **220 nm**; se corrige la interferencia de la materia orgánica con una segunda lectura en torno a 275 nm.

**Lo que exige la ley.** El **RD 3/2023 no impone método** para los parámetros físico-químicos: exige que el que se use sea capaz de medir el valor paramétrico con un **límite de cuantificación ≤ 30 %** de ese valor y con la **incertidumbre** de su tabla 15. Es decir: **la norma UNE es la forma habitual de cumplirlo, no una obligación en sí misma**.

## 3. Tabla operativa

| Parámetro / analito | Técnica | Norma o referencia | Unidades | Condiciones |
| --- | --- | --- | --- | --- |
| **Fósforo y ortofosfato** | Espectrofotometría de absorción molecular, **azul de molibdeno** | **UNE-EN ISO 6878:2005** | mg/L de P | Complejo de **antimonio-fosfomolibdato** reducido con **ácido ascórbico**; medida a **880 nm** (o 700 nm); campo de **0,005 a 0,8 mg/L** sin dilución. El **fósforo total** exige **digestión** previa |
| **Nitrito** | Absorción molecular, colorante **azoico** | **UNE-EN 26777:1994** (ISO 6777:1984) | mg/L de NO₂⁻ o de N | **Sulfanilamida** + **NED** en medio ácido (pH ≈ 1,9); color rosa medido en torno a **540 nm**. Aplicable a aguas potables, brutas y residuales |
| **Cloro libre y cloro total** | Colorimetría con **DPD** | **UNE-EN ISO 7393-2:2019** | mg/L de Cl₂ | El DPD da color **rojo**; se mide en fotómetro o por comparación visual con escala. **Cloro libre primero**, y el total tras añadir yoduro. Medida **inmediata y en campo**: el cloro se pierde |
| **Amonio** | Absorción molecular, **azul de indofenol** | **ISO 7150-1:1984** (ver «Dudas») | mg/L de NH₄⁺ o de N | Reacción con **fenol e hipoclorito** catalizada por **nitroprusiato**; desarrollo de color **lento** (del orden de una hora). Solo en disoluciones **claras** |
| **Color** | Examen y determinación del color | **UNE-EN ISO 7887:2012** | mg/L de Pt (escala Pt-Co) o m⁻¹ | Cuatro métodos, **A a D**. El **color verdadero** se mide **tras filtrar**; el aparente, sin filtrar |
| **Hierro** | Absorción molecular con **1,10-fenantrolina** | ISO 6332 (ver «Dudas») | mg/L de Fe | El hierro se **reduce a Fe(II)** (hidroxilamina) y forma un complejo **rojo-anaranjado** a pH ≈ 3; medida en torno a 510 nm |
| **Agentes de superficie aniónicos** (detergentes) | Absorción molecular, **azul de metileno** | UNE-EN 903 (ver «Dudas») | mg/L de LAS | Formación de un par iónico que se **extrae con cloroformo** y se mide el color azul |
| **Cromo (VI)** | Absorción molecular con **difenilcarbazida** | Método clásico | mg/L de Cr(VI) | Color **violeta** en medio ácido. Distingue Cr(VI) del cromo total |
| **Nitrato** | **Absorción directa en el ultravioleta** | Método clásico | mg/L de NO₃⁻ | Lectura a **≈ 220 nm** con corrección de materia orgánica a **≈ 275 nm**. **Exige cubeta de cuarzo** |
| **Cualquiera de los anteriores** en agua de consumo | — | **RD 3/2023**, anexo III, parte D | — | **No se impone el método**: se exige **LC ≤ 30 %** del valor paramétrico y la **incertidumbre** de la tabla 15 |

## 4. Puntos críticos para el examen

- **LEY DE LAMBERT-BEER: A = ε · b · c.** Es el núcleo repetido del tema. **A** adimensional, **ε** en L·mol⁻¹·cm⁻¹, **b** en cm, **c** en mol/L.
- **A = − log T = log (I₀ / I)**, y **T = I / I₀**. La relación es **logarítmica**: T = 10 % → A = 1; T = 1 % → A = 2.
- **Ley de Lambert = espesor. Ley de Beer = concentración.** Juntas, la de Lambert-Beer.
- **ε depende de la longitud de onda y de la especie**, no de la concentración.
- **Las absorbancias son aditivas** en una mezcla.
- **Se mide siempre en λmáx**: máxima sensibilidad y máxima planitud de la curva.
- **El color que se ve es el complementario del que se absorbe.**
- **Se trabaja entre A = 0,1 y A = 1**; el error fotométrico relativo es mínimo hacia **A ≈ 0,4**. Si sale más, **se diluye**.
- **Desviaciones de Beer: reales, químicas e instrumentales**, y casi siempre **negativas**. Las químicas se combaten **tamponando**; las instrumentales son **radiación policromática** y **luz parásita**.
- **Fuente de UV: lámpara de DEUTERIO** (≈ 190-380 nm). **Fuente de visible: TUNGSTENO** (≈ 320-1 100 nm).
- **Fotómetro = filtro. Espectrofotómetro = monocromador.**
- El monocromador es **rendija de entrada + red de difracción + rendija de salida**. Rendija estrecha: mejor cumplimiento de Beer, menos luz.
- **CUBETA DE CUARZO para el ultravioleta**; el vidrio y el plástico **solo valen en el visible**. Camino óptico habitual, **1 cm**. Se sujeta por las **caras esmeriladas**.
- **Doble haz: compensa la deriva** de la lámpara. **Array de diodos: la dispersión va DESPUÉS de la muestra** y registra todo el espectro a la vez.
- **La turbidez dispersa la luz y se lee como absorbancia**: hay que filtrar o centrifugar.
- **El blanco lleva todos los reactivos menos el analito.**
- **Verificación:** longitud de onda con **holmio** o **didimio**; escala fotométrica con **filtros de densidad neutra** o dicromato.
- **Fósforo → azul de molibdeno, UNE-EN ISO 6878, 880 nm.**
- **Nitrito → sulfanilamida + NED, UNE-EN 26777, ≈ 540 nm.**
- **Cloro → DPD, UNE-EN ISO 7393-2:2019** (que anula la de 2000). Se mide **in situ**.
- **Amonio → azul de indofenol.** **Hierro → 1,10-fenantrolina.** **Cromo(VI) → difenilcarbazida.** **Detergentes aniónicos → azul de metileno.**
- **Nitrato → absorción directa a 220 nm**, con corrección a 275 nm y **cubeta de cuarzo**.
- **El RD 3/2023 NO impone método** para los parámetros físico-químicos: solo **límite de cuantificación ≤ 30 %** del valor paramétrico e **incertidumbre** de la tabla 15.

## Reparto con los temas vecinos

| Contenido | Dónde se desarrolla |
| --- | --- |
| **Absorción molecular UV-visible: concepto, leyes, instrumentación, errores y métodos** | **Aquí** |
| Absorción **atómica** (el átomo libre, líneas estrechas) | **Tema 26** |
| **ICP** | **Tema 27** |
| **Turbidez**, índice de refracción y polarimetría | **Tema 28** |
| Cromatografía iónica, de gases y de líquidos | **Temas 30, 31 y 32** |
| Cloro, amonio, nitritos, oxidabilidad **como parámetros** | **Tema 33** |
| Fósforo total y nitrógeno total en residuales | **Tema 35** |
| Toma y conservación de muestras | **Tema 36** |
| Validación, incertidumbre y **calibración lineal por mínimos cuadrados** | **Temas 38 y 39** |
| Acreditación ISO 17025 | **Tema 40** |

---

## Fuentes y verificación

- **Normas verificadas** en el catálogo de UNE y en la tienda de AENOR: UNE-EN ISO 6878:2005; UNE-EN 26777:1994; **UNE-EN ISO 7393-2:2019**, que **anula y sustituye a la de 2000**; UNE-EN ISO 7887:2012.
- **Norma legal:** RD 3/2023 (BOE-A-2023-628), texto consolidado, comprobado directamente en el BOE: anexo III, parte D, punto 1.
- **Teoría:** LibreTexts en español (traducción de Harvey, *Analytical Chemistry 2.1*) para transmitancia, absorbancia, aditividad y las tres clases de desviación.
- **Fecha de verificación:** 03/09/2026.

### Dudas y limitaciones declaradas

1. **De ninguna de las normas UNE citadas he leído el texto**: son de pago. He verificado **título, año, equivalencia ISO y estado**. Los **reactivos, longitudes de onda y campos de medida** de la tabla operativa proceden de **resúmenes del alcance y de fuentes secundarias**, no del articulado. Mismo tratamiento que en los temas 23 y 24: son datos muy probables y útiles para estudiar, pero **no citables como «lo que dice la norma»**.

2. **La ISO 7150-1:1984 (amonio, azul de indofenol) aparece en ISO como «en revisión»**, y **no he confirmado que exista adopción UNE**. La longitud de onda que suele citarse para el indofenol (en torno a 655 nm) **no la he verificado**, y por eso no aparece en la tabla operativa.

3. **La ISO 6332 (hierro, fenantrolina) y la UNE-EN 903 (detergentes aniónicos) se citan sin año confirmado.** He comprobado que existen y a qué se refieren, no su edición vigente. Las longitudes de onda que doy para ellas son de uso común, no de la norma.

4. **El intervalo de trabajo de absorbancia (0,1 a 1) y el mínimo de error fotométrico en torno a A ≈ 0,4 son doctrina de los libros**, no criterio normativo. El valor exacto del mínimo que suele citarse es **A = 0,434 (T = 36,8 %)**, deducido del análisis del error de la escala de transmitancia; lo doy redondeado porque **no he podido contrastarlo con el texto original** y porque el dato útil es el intervalo, no el punto.

5. **La cifra a partir de la cual deja de cumplirse la ley de Beer varía entre fuentes.** Unas dan **0,01 M** y otras **10⁻³ M** (esta última referida solo al efecto del índice de refracción). **No fijo ninguna**: lo que hay que retener es que la ley vale **en disolución diluida** y que la comprobación práctica es la propia recta de calibrado.

6. **Los patrones de verificación (holmio, didimio, filtros de densidad óptica neutra) proceden de guías de laboratorios de calibración acreditados y de la guía del INM de Colombia**, no de una norma española ni europea. Los intervalos que doy (holmio ≈ 240-650 nm, didimio ≈ 380-900 nm) son de esas fuentes.

7. **No existe procedimiento del CEM para espectrofotómetros UV-visible**, y lo he comprobado: el **QU-001** del CEM es de **espectrofotometría de absorción atómica** (que es el tema 26) y el **OP-003** es de **espectrorradiómetros**, que es otro instrumento. A diferencia del tema 23, donde el QU-003 cubría exactamente la calibración de pHímetros, **aquí no hay fuente oficial española equivalente**.

8. **El RD 3/2023 no impone método para los parámetros físico-químicos.** Esto lo he verificado en el texto consolidado y es importante para no afirmar de más: decir que «el método oficial del nitrito es la UNE-EN 26777» es **inexacto**. Lo exacto es que la norma UNE es la forma habitual de cumplir los criterios de rendimiento que sí impone el Real Decreto.

9. **De la UNE-EN ISO 7887 he tomado la edición de 2012** (ISO 7887:2011) como vigente, según el catálogo de UNE. La tienda de AENOR lista además una edición de **1995**; **no he confirmado expresamente que esté anulada**, aunque lo lógico es que la de 2012 la sustituya.

10. **El reparto con los temas 26 a 28 y 30 a 32 lo he decidido yo**, como en los casos anteriores. Aquí queda solo la absorción molecular UV-visible. Si al redactar el 26 conviene mover algo —por ejemplo, el tratamiento común de la recta de calibrado—, este apartado se recorta sin tocar el resto.
