---
tema: 26
titulo: "Espectroscopía atómica: Espectroscopía de absorción atómica: fundamentos e instrumentación. Utilización de la espectroscopía atómica en análisis de agua."
parte: Parte segunda
estado: borrador
verificado: 2026-09-07
fuentes:
  - "CEM, «Procedimiento QU-001 para la calibración de equipos de espectrofotometría de absorción atómica», edición digital 1, Centro Español de Metrología (Ministerio de Industria, Turismo y Comercio), 48 págs. LEÍDO ÍNTEGRO. — https://www.cem.es/sites/default/files/qu-001_digital_0.pdf"
  - "INSST, método MTA/MA-025/A16, «Determinación de metales y sus compuestos iónicos en aire. Método de captación en filtro / espectrofotometría de absorción atómica con llama», Madrid, diciembre 2016, NIPO 272-16-059-7. LEÍDO ÍNTEGRO. Es de aire, no de agua: se usa aquí solo por su tabla 1 de condiciones instrumentales y su apartado 8.4 de interferencias. — https://www.insst.es/documents/94886/359043/MA_025_A16.pdf"
  - "UNE-EN ISO 15586:2004, Calidad del agua. Determinación de elementos traza por espectrometría de absorción atómica con cámara de grafito (ISO 15586:2003). EN VIGOR, edición de 18/06/2004. — https://tienda.aenor.com/p/norma-une-en-iso-15586-2004-n0031534"
  - "UNE-EN ISO 12846:2012, Calidad del agua. Determinación de mercurio. Método por espectrometría de absorción atómica (AAS) con y sin enriquecimiento. EN VIGOR, 31/10/2012. ANULA Y SUSTITUYE a UNE-EN 12338:1999 y UNE-EN 1483:2007. — https://tienda.aenor.com/p/norma-une-en-iso-12846-2012-n0050161"
  - "UNE-EN ISO 7980:2000, Calidad del agua. Determinación del calcio y del magnesio. Método por espectrometría de absorción atómica (ISO 7980:1986). EN VIGOR. — https://tienda.aenor.com/p/norma-une-en-iso-7980-2000-n0023712"
  - "UNE-EN ISO 5961:1995, Calidad del agua. Determinación de cadmio por espectrometría de absorción atómica (ISO 5961:1994). EN VIGOR, edición de 19/12/1995. — https://tienda.aenor.com/p/norma-une-en-iso-5961-1995-n0013549"
  - "UNE-EN ISO 17852:2008, Calidad del agua. Determinación de mercurio. Método por espectrometría de fluorescencia atómica (ISO 17852:2006). — https://tienda.aenor.com/p/norma-une-en-iso-17852-2008-n0041487"
  - "UNE-EN ISO 15587-1:2002 (digestión con agua regia) y UNE-EN ISO 15587-2:2002 (digestión con ácido nítrico), Calidad del agua. Digestión para la determinación de elementos seleccionados en agua. EN VIGOR, 28/11/2002. — https://tienda.aenor.com/p/norma-une-en-iso-15587-1-2002-n0028052"
  - "UNE-EN ISO 11969:1997, Calidad del agua. Determinación de arsénico. Método por espectrometría de absorción atómica (técnica de hidruros). **ANULADA el 18/09/2014**, sin norma sustituta indicada en el catálogo. — https://tienda.aenor.com/p/norma-une-en-iso-11969-1997-n0014130"
  - "ISO 8288:1986 (Co, Ni, Cu, Zn, Cd y Pb por absorción atómica de llama) e ISO 9965:1993 (selenio por hidruros): citadas como normas ISO. NO he encontrado adopción UNE de ninguna de las dos (ver «Dudas»)."
  - "Real Decreto 3/2023, de 10 de enero (BOE-A-2023-628), texto consolidado, anexo III, parte D, puntos 1 y 3. Leído literalmente. — https://www.boe.es/buscar/act.php?id=BOE-A-2023-628"
  - "Real Decreto 817/2015, de 11 de septiembre (BOE-A-2015-9806), texto consolidado, anexo III, apartado C.1, y artículo 3.25. Leído literalmente. — https://www.boe.es/buscar/act.php?id=BOE-A-2015-9806"
  - "LibreTexts en español, Química Analítica 2.1 (traducción de D. Harvey), cap. 10.4 «Espectroscopia de Absorción Atómica» y 10.7 «Espectroscopia de Emisión Atómica»; y Análisis Instrumental (LibreTextos), cap. 9.2 «Instrumentación de absorción atómica». Son la fuente de las temperaturas de llama, el programa del horno, las anchuras de línea y la clasificación de interferencias."
  - "ExamenesAnteriores/ANALISIS.md y los seis cuestionarios de esa carpeta, releídos el 07/09/2026 para localizar las preguntas de este tema."
---

> **PRECEDENTE EN LOS EXÁMENES: sí, y más de lo que parecía.** Al redactar el 25 di por hecho que el 26 no tenía precedente documentado. Al releer los cuestionarios he encontrado cuatro rastros, y el más valioso está escondido en una pregunta de otro tema:
>
> | Qué aparece | Dónde | Peso |
> | --- | --- | --- |
> | **«Una técnica de análisis basada en la absorción de radiación electromagnética por partículas atómicas»** — la definición de absorción atómica, **como distractor c) de la pregunta «la cromatografía es…»** | **1246 #14 y 1322 #31**, literal en las dos | **Repetida entre convocatorias.** Y en la misma pregunta, el distractor b) («intensidad de radiación emitida por átomos excitados») es la definición de **emisión atómica** |
> | **Fuente de radiación en absorción atómica** → lámparas de **cátodo hueco** y de **descarga sin electrodos** | 1233 R2 (reserva) | Una aparición, pero directa al tema |
> | **Metales totales: digestión ácida y en caliente + filtración** antes de la técnica instrumental | 1246 #25; y en 1322 #40 la respuesta es «digestión ácida… y determinación por ICP-MS» | Dos convocatorias |
> | Las **variantes de absorción atómica** (llama, cámara de grafito, generación de hidruros) como opciones del supuesto «indique la técnica» | 1233 C2 #3-5, 1246 C2 #3-5, 1322 C2 #38-40 | **Las tres convocatorias** |
>
> Conclusión operativa: lo más rentable de este tema no es la instrumentación fina, sino **saber cuándo se elige cada variante de absorción atómica y cuándo no** —porque en el supuesto aparecen sobre todo como respuestas *falsas*— y **la digestión previa**.

> **Aviso de fuentes: aquí sí hay documento oficial español.** En el tema 25 quedó declarado que **no existe procedimiento del CEM para espectrofotómetros UV-visible**. Aquí sí: el **QU-001 del Centro Español de Metrología** es exactamente de absorción atómica, es gratuito y lo he leído entero. De él salen las **partes del equipo** (apartado 4.1), el **fundamento** (4.2.1) y toda la operativa de **calibración** (5.2 y 5.3), citados por su apartado. El resto de la teoría —temperaturas de llama, programa del horno, anchuras de línea— es doctrina de libro, sin norma.

> **La frontera con el tema 25, cerrada.** Allí absorbe **la molécula** en disolución y da **bandas anchas**; aquí absorbe **el átomo libre** en fase gaseosa y da **líneas estrechas**. No es un matiz descriptivo: de ahí salen **las cinco diferencias de instrumento y de uso** del apartado 2.2, incluida la que más se confunde —**dónde va el monocromador**—. Todo lo que sea absorción molecular UV-visible se queda en el 25.

> **Reparto con el 27 y con los temas de agua.** El **ICP** (masas y emisión) es del **tema 27**, entero, aunque en la práctica compita con la absorción atómica para los mismos metales: aquí solo se dice **cuándo se elige uno u otro**. Los **valores paramétricos y las frecuencias de control** de los metales no están aquí: son del **33** (consumo) y del **35** (residuales). La **toma y conservación de muestras**, del **36**.

## 1. Encuadre

La **espectroscopía atómica** mide la radiación que absorben, emiten o reemiten **átomos libres en estado gaseoso**. Su objeto es siempre **el elemento**, no el compuesto: da igual en qué forma química esté el plomo en el agua; lo que se mide es plomo.

Es, con el ICP del tema 27, **la familia de técnicas de los metales**. En un laboratorio de aguas cubre desde la dureza (calcio y magnesio, en mg/L) hasta los metales pesados en traza (cadmio o mercurio, en µg/L o ng/L).

| Qué regula | Norma o referencia | Lógica |
| --- | --- | --- |
| Fundamento, partes del equipo y **calibración** | **CEM, procedimiento QU-001** | **Documento oficial español**, no norma de obligado cumplimiento |
| Temperaturas, programa del horno, interferencias | Harvey / LibreTexts; INSST **MTA/MA-025/A16** | **Doctrina técnica** y método oficial (de aire) |
| **Elementos traza** en agua, cámara de grafito | **UNE-EN ISO 15586:2004** | Ensayo normalizado |
| **Mercurio** | **UNE-EN ISO 12846:2012** (AAS) · **UNE-EN ISO 17852:2008** (fluorescencia) | Ensayo normalizado |
| **Calcio y magnesio** | **UNE-EN ISO 7980:2000** | Ensayo normalizado |
| **Cadmio** | **UNE-EN ISO 5961:1995** | Ensayo normalizado |
| **Digestión previa** | **UNE-EN ISO 15587-1 y -2:2002** | Ensayo normalizado |
| Qué se le exige al método (consumo) | **RD 3/2023**, anexo III, parte D | Norma con rango de ley |
| Qué se le exige al método (superficiales) | **RD 817/2015**, anexo III, C.1 | Norma con rango de ley |

## 2. Desarrollo

### 2.1. Las tres espectroscopías atómicas

Sobre los mismos átomos libres caben tres medidas distintas:

| Técnica | Qué mide | Hace falta lámpara | Dónde se estudia |
| --- | --- | --- | --- |
| **Absorción atómica (AAS o EAA)** | La **radiación que absorben** los átomos en estado fundamental | **Sí**, una por elemento | **Este tema** |
| **Emisión atómica (AES)** | La **radiación que emiten** los átomos previamente excitados | **No**: la fuente es la propia llama o plasma | Fotometría de llama, aquí; **ICP-OES, tema 27** |
| **Fluorescencia atómica (AFS)** | La radiación que los átomos **reemiten** tras absorber | Sí | Aquí, de pasada (mercurio) |

Dos avisos de examen:

- **«Intensidad de radiación emitida por átomos excitados» = emisión**, no absorción. Es la confusión que las convocatorias 1246 y 1322 usan como distractor, con esas palabras exactas.
- La **fotometría de llama** (emisión) es lo barato y clásico para **sodio, potasio y litio**, que se excitan con poca energía y emiten con fuerza. El ICP es lo mismo llevado a 6 000-10 000 K, y por eso da mejores límites de detección y menos interferencias (tema 27).

### 2.2. Fundamento: por qué el átomo cambia el instrumento entero

El CEM lo define así (QU-001, apartado 4.2.1), y conviene retener la frase:

> «La Espectrofotometría de Absorción Atómica se basa en la **absorción selectiva de radiación luminosa a una longitud de onda determinada por parte de los átomos (o iones simples) en estado gaseoso** de los distintos elementos… Dado que la absorción atómica se rige teóricamente por la **ley de Beer-Lambert**…»

Es decir: **la ley es la misma del tema 25, A = ε · b · c**, y la cuantificación se hace igual, por interpolación en una recta de calibrado. Lo que cambia es todo lo demás.

![La molécula en disolución da una banda ancha; el átomo libre da una línea estrecha](esquema:linea-vs-banda)

Una molécula en disolución tiene, además de niveles electrónicos, niveles vibracionales y rotacionales, y el disolvente la rodea: por eso su absorción se ensancha hasta ser una **banda de decenas de nanómetros**. Un átomo libre en fase gaseosa no tiene ni vibración ni rotación ni disolvente: su absorción es una **línea de ≈ 0,002 nm**, ensanchada solo por efecto **Doppler** y por **presión**.

De esa única diferencia salen **las cinco consecuencias del tema**:

| | Absorción molecular (tema 25) | Absorción atómica (tema 26) |
| --- | --- | --- |
| **1. La muestra** | Disolución en una **cubeta** | Hay que **ATOMIZAR**: llevar el analito a átomos libres gaseosos |
| **2. La fuente** | **Continua**: deuterio y tungsteno | De **LÍNEAS**: lámpara de cátodo hueco del propio elemento |
| **3. El monocromador** | **ANTES** de la cubeta | **DESPUÉS** del atomizador |
| **4. La selectividad** | Baja: las bandas se solapan, hace falta un reactivo cromogénico | **Muy alta**: las líneas casi no se solapan |
| **5. Qué se determina** | Una **especie química** (fosfato, nitrito, cloro libre) | Un **ELEMENTO**, sea cual sea su forma química |

**Por qué la fuente no puede ser continua.** Si se ilumina con una lámpara continua, el monocromador deja pasar una banda de ≈ 1 nm, unas **1 000 veces más ancha que la línea de absorción**. Los átomos solo se comen la fracción minúscula que cae en su línea: la potencia que entra y la que sale son prácticamente iguales, la transmitancia sale ≈ 100 % y **la absorbancia, ≈ 0**. La solución de Walsh fue **iluminar con la propia línea del elemento**: una lámpara cuyo cátodo está hecho de ese metal emite exactamente las líneas que ese metal absorbe.

**Por qué el monocromador va detrás.** El atomizador **emite luz propia** —la llama brilla, y los átomos excitados emiten en la misma línea—. Si el monocromador fuera delante, esa emisión llegaría entera al detector y se sumaría a la señal. Poniéndolo detrás, aísla la línea justo antes de medir. Y aun así hace falta un segundo truco: **la modulación**.

### 2.3. Instrumentación

![Espectrómetro de absorción atómica de llama: fuente, modulador, atomizador, monocromador, detector y lectura](esquema:absorcion-atomica)

El CEM (QU-001, 4.1) ordena el equipo en seis bloques. Merece la pena tener presente su lista, porque es la de un documento oficial:

| Bloque (QU-001) | Qué incluye |
| --- | --- |
| **4.1.1 Sistema neumático** | Gas **combustible** (acetileno; menos, hidrógeno, propano, butano), gas **oxidante** (**aire** u **óxido nitroso**), gas de **purga y enfriamiento** en electrotérmica (**argón**), gas de **arrastre** en vapor frío (argón), reguladores de presión y caudal |
| **4.1.2 Introducción de muestra** | **Aspiración y nebulización**; inyección manual o automática en la cámara; generadores de **vapor frío** (mercurio) y de **hidruros** (arsénico, selenio, antimonio, estaño); inyectores de flujo segmentado (**FIAS**) |
| **4.1.3 Cámara y fuente de atomización** | Mechero de llama **aire-acetileno** o **óxido nitroso-acetileno**; **cámara de grafito** con tubo (con o sin **plataforma L'vov**), calentamiento longitudinal o transversal, gas inerte y refrigeración por agua |
| **4.1.4 Sistema óptico** | **Lámparas de cátodo hueco** (monoelementales) y **de descarga sin electrodos** (multielementales); **rendija regulable**; selector de longitud de onda; **monocromador**; **fotomultiplicador**; **corrector de fondo** (lámpara de **deuterio** o efecto **Zeeman**); cámara para vapor frío |
| **4.1.5 Gestión de la señal** | **Amplificador logarítmico** (convierte la transmitancia en absorbancia), convertidor analógico/digital, amortiguación del ruido |
| **4.1.6 Registro** | Registrador potenciométrico o sistema informatizado |

#### La fuente: lámpara de cátodo hueco

![Lámpara de cátodo hueco: el cátodo es del elemento y el haz sale por la ventana de cuarzo](esquema:lampara-catodo-hueco)

Un **cátodo hueco fabricado con el metal a analizar** y un **ánodo**, dentro de una ampolla con **gas inerte (neón o argón) a baja presión** y una **ventana de cuarzo**. Al aplicar tensión, el gas se ioniza; los iones bombardean el cátodo y **arrancan átomos del metal** (pulverización catódica); esos átomos se excitan y **emiten el espectro de líneas de ese elemento**.

Consecuencia práctica que se pregunta: **hace falta una lámpara por elemento**. Hay lámparas multielemento, pero traen su propio problema —dos líneas de emisión próximas de elementos distintos— y son la causa típica de la interferencia espectral (MTA/MA-025, 8.4.1). La alternativa más intensa es la **lámpara de descarga sin electrodos (EDL)**, sobre todo para elementos volátiles.

#### El modulador (chopper)

Un disco troceador delante de la lámpara. Bloquea el haz alternativamente, de modo que el detector mide **primero solo lo que emite la llama** y luego **la llama más la lámpara**. La diferencia es lo que de verdad viene de la fuente. Sin modulación, la emisión propia del atomizador se leería como señal.

#### El atomizador, que es donde está la decisión

Convertir el analito en átomos libres exige tres pasos: **desolvatar → volatilizar → disociar**. Hay cuatro maneras de hacerlo, y **elegir la correcta es lo que preguntan los supuestos**:

**a) Llama (FAAS).** La muestra se **aspira** por un capilar, se **nebuliza** con el gas a presión y pasa a una **cámara de premezcla**, donde solo la niebla más fina sigue adelante: **hasta el 95 % de la muestra no llega a la llama** y se va por el desagüe. El **mechero de ranura** da un camino óptico largo y una llama estable.

| Llama | Temperatura | Para qué |
| --- | --- | --- |
| **Aire-acetileno** | **2 100 - 2 400 °C** | La normal: casi todos los metales (Cd, Cu, Zn, Ni, Pb, Fe, Mn, Co, Ag, Ca, Mg…) |
| **Óxido nitroso-acetileno** | **2 600 - 2 800 °C** | Elementos **refractarios**, que forman óxidos estables: **aluminio**, **molibdeno**, silicio, titanio, vanadio, boro |

Además, la llama se regula: **oxidante (azul)**, pobre en combustible, es la habitual; **reductora (amarilla o roja)** para cromo, aluminio y molibdeno (MTA/MA-025, tabla 1).

**b) Cámara de grafito o atomización electrotérmica (GFAAS o ETAAS).**

![Programa de temperaturas del horno de grafito, con el pico de absorbancia en la atomización](esquema:horno-grafito)

Un **tubo de grafito de 1-3 cm de largo y 3-8 mm de diámetro** que se calienta por resistencia eléctrica en atmósfera de argón. Se inyectan **5-50 µL** y se ejecuta un programa de temperaturas:

| Etapa | Temperatura | Qué hace |
| --- | --- | --- |
| **Secado** | ≈ **110 °C** | Evapora el disolvente |
| **Calcinación** (ceniza, pirólisis) | **350 - 1 200 °C** | Destruye la materia orgánica y elimina la matriz |
| **Atomización** | **2 000 - 3 000 °C** | Libera los átomos: **aquí aparece la señal** |
| Limpieza | Por encima de la atomización | Elimina el efecto memoria |

El ciclo entero dura **45-90 s**. Como todo el analito se atomiza de golpe dentro de un tubo cerrado, la concentración de átomos en fase vapor es **unas 1 000 veces mayor que en la llama**: de ahí la sensibilidad. A cambio:

- **La señal no es una lectura estable, sino un PICO TRANSITORIO** que se mide por altura o por integración de área (QU-001, 5.3.1). En llama, se aspira y se espera a lectura estable.
- **Peor precisión**, porque cuesta reproducir el contacto de la gota con el tubo.
- Más interferencias de fondo, así que **la corrección de fondo es prácticamente obligatoria**.
- Se usan **modificadores de matriz** —nitrato de **paladio**, de **magnesio**, de **lantano**— para que el analito aguante la calcinación sin perderse (QU-001, 5.1).
- La **plataforma L'vov** dentro del tubo retrasa la atomización hasta que el gas está caliente y estable.
- Hay que **intercalar blancos** entre patrones para eliminar el **efecto memoria** (QU-001, 5.3.5).

**c) Vapor frío (CVAAS): solo mercurio.** El mercurio se reduce a **Hg⁰ elemental** con **cloruro de estaño (II)** o borohidruro sódico, y es **volátil a temperatura ambiente**: un gas de arrastre lo lleva a una **célula de observación sin calentar**, y se mide a **253,7 nm**. **No hay llama ni horno**, de ahí el nombre. Es el único metal que se hace así.

**d) Generación de hidruros (HGAAS).** Con **borohidruro sódico (NaBH₄)** en medio ácido, unos pocos elementos forman **hidruros volátiles** que se arrastran a una célula calentada donde se descomponen: **As, Se, Sb, Bi, Ge, Sn, Te y Pb**. Separa el analito de la matriz y multiplica la sensibilidad.

> **Trampa de examen.** La generación de hidruros **solo vale para los elementos que forman hidruros volátiles**. «Sodio por absorción atómica con generación de hidruros» o «calcio por generación de hidruros» son **falsos**, y aparecen literalmente como opción en los supuestos de 1233 y 1246.

#### Sistema óptico, detección y corrección de fondo

Tras el atomizador, **monocromador** (red de difracción, con **rendija regulable**) y **fotomultiplicador**. La rendija se elige según el elemento: estrecha aísla mejor la línea, ancha deja pasar más luz.

**La corrección de fondo** merece apartado propio porque es lo que distingue una lectura buena de una inflada. La absorción **inespecífica o de fondo** no la produce el analito, sino partículas que desvían el haz y **especies moleculares** formadas en el atomizador; **se nota sobre todo por debajo de 250 nm** (MTA/MA-025, 8.4.2). Dos sistemas, los dos citados por el CEM (4.1.4):

- **Lámpara de deuterio**: mide alternativamente con la lámpara de cátodo hueco (analito + fondo) y con una lámpara continua de D₂ (solo fondo, porque la línea del analito es despreciable frente a la banda ancha) y **resta**.
- **Efecto Zeeman**: un campo magnético desdobla la línea; comparando las componentes se separa el fondo. Es el más fino, y el habitual en cámara de grafito.

### 2.4. Interferencias

Clasificación del método oficial MTA/MA-025/A16 (apartado 8.4), con los ejemplos numéricos de Harvey:

| Tipo | Qué pasa | Cómo se corrige |
| --- | --- | --- |
| **Espectrales** | Un átomo distinto del que se mide absorbe parte de la radiación. Es **raro**, y se da sobre todo con **lámpara multielemento** con dos líneas próximas | Usar **lámpara monoelemento** o **cambiar de longitud de onda** |
| **De absorción inespecífica o de fondo** | Partículas que desvían el haz y **especies moleculares** que absorben. **Notable por debajo de 250 nm** | **Corrector de fondo**: **deuterio** o **Zeeman** |
| **De ionización** | El elemento se **ioniza** en la llama y deja de absorber como átomo. Típico de alcalinos y alcalinotérreos, y peor cuanto más caliente la llama | Añadir a muestras y patrones la sal de un metal alcalino: **1 000 µg de cesio por mL** (también se usa potasio) |
| **Químicas** | El analito forma un **compuesto estable y poco volátil** y no llega a atomizarse. El caso clásico: **fosfato sobre el calcio**. Harvey da el número: 100 ppm de Al³⁺ sobre 5 ppm de Ca²⁺ bajan la absorbancia **de 0,50 a 0,14** | **Llama más caliente**; **agente liberador** que se queda con el interferente (**1 000 µg de lantano por mL**; también estroncio); **agente protector** que forma un complejo volátil con el analito (**EDTA**) |
| **De matriz o físicas** | La muestra y los patrones tienen distinta viscosidad, tensión superficial o carga salina, y no se nebulizan igual | **Igualar las matrices** de patrones y muestras; si no se puede, **adición de patrón** |

**La regla de fondo, que el CEM repite dos veces:** patrones y muestras deben recibir **el mismo tratamiento** y tener **la matriz lo más parecida posible**. Cuando eso no es posible, se cuantifica por **adición de patrón**: se mide la muestra y alícuotas de la propia muestra fortificadas con cantidades conocidas, y se trabaja con la diferencia de absorbancias.

### 2.5. Calibración del equipo (CEM QU-001)

Este apartado es el que tiene fuente oficial más sólida, y es también el que da los datos concretos.

**Qué se calibra.** No los componentes por separado —el CEM dice expresamente que eso es impracticable para el usuario—, sino el **sistema completo**, mediante su **función de respuesta (la recta de calibrado)**, **para cada elemento** y **en unas condiciones experimentales fijadas** (QU-001, 4.2.2).

**Antes de empezar** (QU-001, 5.2):

- Temperatura ambiente entre **15 °C y 30 °C**.
- **15-30 minutos** de calentamiento del equipo tras conectarlo.
- Comprobar reservas de gases, mechero correcto, tubo de grafito sin envejecer, extracción de aire conectada.
- Material volumétrico **clase A**, lavado previamente con **ácido nítrico 0,1 mol/L**.
- Especificar por escrito: elemento, **longitud de onda**, **amplitud de rendija**, modo de trabajo, gases y caudales, tipo de mechero, patrones y modificadores de matriz.
- Seleccionar la lámpara, comprobar su **alineamiento**, fijar su **intensidad de corriente** y hacer el **ajuste fino de la longitud de onda** buscando la máxima energía.

**Los patrones** (QU-001, 5.1): materiales de referencia **trazables**, que se venden típicamente a **1 000 mg/L** y hay que diluir. Agua **doblemente desionizada exenta de metales** y ácidos exentos de metales.

**La recta** (QU-001, 5.3):

- **Como mínimo 3 patrones, y es más aconsejable de 5 a 7**, abarcando todo el rango del elemento.
- Se analiza un **blanco** —el mismo disolvente y los mismos reactivos que las muestras— y se **ajusta el cero**.
- Se verifica con un **patrón intermedio de absorbancia conocida**; si no sale, se reajusta el mechero, la energía y la ganancia.
- Recomendable **lectura múltiple** de cada patrón (por ejemplo, por triplicado) y promediar.
- **La calibración se repite antes de cada sesión de análisis**, y siempre que se toque un ajuste.

**La sensibilidad se expresa como concentración característica** (o **masa característica**): la concentración o masa del analito que da una absorbancia determinada, **fijada generalmente en 0,0044 unidades de absorbancia** (QU-001, 5.3.6). Es el número que trae el manual de cada equipo para cada elemento y sirve para comprobar que el aparato está en forma.

### 2.6. Utilización en el análisis de agua

**Primero: qué se va a medir, «total» o «disuelto».** Es la decisión previa a cualquier técnica, y la que preguntó 1246 #25:

- **Metales disueltos**: se **filtra** la muestra (0,45 µm) y se acidifica.
- **Metales totales**: **no se filtra**; hay que **DIGERIR** la muestra —ácido, en caliente— para liberar el metal ocluido en las partículas y en la materia orgánica. **UNE-EN ISO 15587-1** (agua regia) y **-2** (ácido nítrico), aplicables a aguas con menos de **20 g/L** de sólidos en suspensión y menos de **5 g/L** de carbono orgánico total.

Sin digestión, un agua residual da resultados bajos y no comparables. La toma y la conservación —envase, acidificación, plazo— son del **tema 36**.

**Segundo: qué variante.** El criterio práctico es la concentración esperada frente al límite que hay que alcanzar:

| Situación | Variante |
| --- | --- |
| Metales mayoritarios, **mg/L** (Ca, Mg, Na, K, Fe, Mn, Zn, Cu) | **Llama (FAAS)**: rápida, barata, robusta |
| Metales **traza**, µg/L (Cd, Pb, Ni, Cr, As, Se) | **Cámara de grafito (GFAAS)** |
| **Mercurio** | **Vapor frío (CVAAS)**, o fluorescencia atómica si hacen falta ng/L |
| **As, Se, Sb** | **Generación de hidruros**, o cámara de grafito |
| **Muchos elementos a la vez** en la misma muestra | **ICP-OES o ICP-MS** (tema 27): la absorción atómica es **monoelemental**, una lámpara y una medida por elemento |

Esa última fila explica por qué en 1246 la respuesta a «análisis de cadmio» fue **ICP-MS** y no absorción atómica: para un laboratorio que analiza doce metales en cada muestra, el ICP los da de una pasada.

**Tercero: qué exige la ley.** Igual que en el tema 25, **no se impone método**:

- **Agua de consumo (RD 3/2023, anexo III, parte D).** El método debe poder medir el valor paramétrico con un **límite de cuantificación ≤ 30 %** del valor paramétrico y con la **incertidumbre (k = 2)** que fija la **tabla 15**. La norma añade que **el LC y el LD deben ser siempre inferiores al valor paramétrico**, y que la incertidumbre de la tabla **no se puede usar como tolerancia adicional** sobre el valor paramétrico.
- **Aguas superficiales (RD 817/2015, anexo III, C.1).** Los métodos deben estar **validados y documentados conforme a EN ISO/IEC 17025**, con **incertidumbre de medida ≤ 50 % (k = 2)** estimada al nivel de la norma de calidad ambiental y **límite de cuantificación ≤ 30 %** de esa NCA. Y una regla de cálculo que conviene conocer: los resultados **inferiores al límite de cuantificación se sustituyen por la mitad del LC** para calcular medias, salvo en parámetros que son suma de un grupo, donde se fijan en **cero**.

## 3. Tabla operativa

| Parámetro / analito | Técnica | Norma o referencia | Unidades | Condiciones |
| --- | --- | --- | --- | --- |
| **Elementos traza en general** (Ag, Al, As, Cd, Co, Cr, Cu, Fe, Mn, Mo, Ni, Pb, Sb, Se, Tl, V, Zn) | **EAA con cámara de grafito (GFAAS)** | **UNE-EN ISO 15586:2004** | µg/L | Aguas superficiales, subterráneas, de consumo y residuales. Inyección de **5-50 µL**; **modificador de matriz**; **corrección de fondo**; señal en **pico transitorio** |
| **Cadmio** | EAA (llama para mg/L; **cámara de grafito** para traza) | **UNE-EN ISO 5961:1995** · UNE-EN ISO 15586 | µg/L | **228,8 nm**, llama aire-acetileno oxidante (azul) |
| **Plomo** | EAA, normalmente **cámara de grafito** | UNE-EN ISO 15586 | µg/L | **283,3 nm**, llama aire-acetileno oxidante |
| **Cobalto, níquel, cobre, cinc** | **EAA de llama (FAAS)** | **ISO 8288:1986** (ver «Dudas») · UNE-EN ISO 15586 si es traza | mg/L o µg/L | Aire-acetileno oxidante: Co **240,7**, Ni **232,0**, Cu **324,8**, Zn **213,9 nm** |
| **Hierro y manganeso** | **EAA de llama** | UNE-EN ISO 15586 si es traza | mg/L | Fe **248,3 nm**, Mn **279,5 nm**, aire-acetileno oxidante |
| **Cromo** | EAA de llama o cámara de grafito | UNE-EN ISO 15586 | mg/L o µg/L | **357,9 nm**, llama aire-acetileno **reductora (amarilla)**. Mide **cromo total**: el **Cr(VI)** se distingue por colorimetría con difenilcarbazida (**tema 25**) |
| **Calcio y magnesio** (base de la **dureza**) | **EAA de llama** | **UNE-EN ISO 7980:2000** | mg/L de Ca y de Mg | Interferencia clásica del **fosfato y el aluminio** sobre el calcio: se añade **lantano** (1 000 µg/mL) como agente liberador y **cesio** como supresor de ionización. La dureza **como parámetro** es del **tema 33** |
| **Sodio y potasio** | EAA de llama o **fotometría de emisión de llama** | ISO 9964 (ver «Dudas») | mg/L | **No se hacen por generación de hidruros**: no forman hidruros volátiles |
| **Aluminio** | EAA de llama con **óxido nitroso-acetileno**, o cámara de grafito | UNE-EN ISO 15586 | mg/L o µg/L | **309,3 nm**, llama **N₂O-C₂H₂ reductora (roja)**: es refractario. Por colorimetría se hace con **eriocromocianina R** (tema 25) |
| **Mercurio** | **EAA de vapor frío (CVAAS)**, con o sin enriquecimiento por amalgama | **UNE-EN ISO 12846:2012** | µg/L o ng/L | **253,7 nm**. Reducción a **Hg⁰** con **SnCl₂** o NaBH₄; **sin llama ni horno**; célula de observación **sin calentar** |
| **Mercurio** (alternativa más sensible) | **Espectrometría de fluorescencia atómica (AFS)** | **UNE-EN ISO 17852:2008** | ng/L | Aguas de consumo, superficiales, subterráneas y de lluvia; residuales tras digestión |
| **Arsénico, selenio, antimonio** | EAA con **generación de hidruros**, o cámara de grafito | **UNE-EN ISO 11969:1997 está ANULADA** (18/09/2014) · ISO 9965 para Se (ver «Dudas») · UNE-EN ISO 15586 | µg/L | Hidruro volátil con **NaBH₄** en medio ácido y célula calentada |
| **Metales totales** (paso previo, no técnica) | **Digestión ácida en caliente**, sin filtrar antes | **UNE-EN ISO 15587-1** (agua regia) y **-2** (ácido nítrico) | — | Aguas con **< 20 g/L** de sólidos en suspensión y **< 5 g/L** de COT |
| **Metales disueltos** (paso previo) | **Filtración 0,45 µm** y acidificación | UNE-EN ISO 5667-3 (**tema 36**) | — | Se filtra **antes** de acidificar |
| **Multielemental**, muchos metales por muestra | **ICP-OES / ICP-MS** | **Tema 27** | µg/L o ng/L | La absorción atómica es **monoelemental**; el ICP mide muchos a la vez |
| **Calibración del equipo** | Recta de calibrado por elemento | **CEM, procedimiento QU-001** | — | **Mín. 3 patrones, mejor 5-7**; blanco y ajuste del cero; verificación con patrón intermedio; **antes de cada sesión** |
| **Exigencia legal, agua de consumo** | — | **RD 3/2023**, anexo III, D | — | **LC ≤ 30 %** del valor paramétrico e **incertidumbre de la tabla 15** |
| **Exigencia legal, aguas superficiales** | — | **RD 817/2015**, anexo III, C.1 | — | Validación conforme a **ISO/IEC 17025**, **incertidumbre ≤ 50 % (k = 2)** y **LC ≤ 30 %** de la NCA |

## 4. Puntos críticos para el examen

- **Absorción atómica = absorción de radiación electromagnética por partículas ATÓMICAS.** **Emisión atómica = intensidad de radiación emitida por átomos EXCITADOS.** Son las dos frases que las convocatorias 1246 y 1322 usan literalmente.
- **La fuente son lámparas de CÁTODO HUECO y de DESCARGA SIN ELECTRODOS.** No de deuterio (eso es el UV del tema 25) y **no continuas**. Pregunta documentada: 1233 R2.
- **Una lámpara por elemento**: la absorción atómica es **monoelemental**.
- **Por qué no vale una fuente continua:** la línea atómica mide ≈ **0,002 nm** y la banda que deja pasar un monocromador ≈ **1 nm**, unas 1 000 veces más: la absorbancia saldría casi nula.
- **La línea se ensancha por efecto Doppler y por presión.**
- **EL MONOCROMADOR VA DESPUÉS DEL ATOMIZADOR**, al revés que en el tema 25. Porque la llama emite luz propia.
- **El modulador (chopper)** sirve para descontar la **emisión propia de la llama**.
- **Se cumple la ley de Lambert-Beer**, y se cuantifica por **recta de calibrado**, igual que en absorción molecular.
- **Atomizar = desolvatar + volatilizar + disociar.**
- **Llama aire-acetileno: 2 100-2 400 °C.** **Llama óxido nitroso-acetileno: 2 600-2 800 °C**, para **refractarios** (aluminio, molibdeno, silicio, titanio, vanadio, boro).
- En llama, **hasta el 95 % de la muestra no llega a la llama**: se va por el desagüe de la cámara de premezcla.
- **Horno de grafito: secado ≈ 110 °C → calcinación 350-1 200 °C → atomización 2 000-3 000 °C** (+ limpieza). **5-50 µL**, ciclo de **45-90 s**, tubo de **1-3 cm**, atmósfera de **argón**.
- **La señal de la cámara de grafito es un PICO TRANSITORIO** (altura o área); la de llama, una **lectura estable**.
- La cámara de grafito da **≈ 1 000 veces más** concentración de átomos en fase vapor que la llama, pero **peor precisión**.
- **VAPOR FRÍO = MERCURIO**, y solo mercurio. Reducción a **Hg⁰** con **SnCl₂**; **sin llama**; **253,7 nm**.
- **HIDRUROS = As, Se, Sb, Bi, Ge, Sn, Te, Pb**, con **NaBH₄**. **Nunca para sodio, calcio o magnesio**: es la trampa de los supuestos de 1233 y 1246.
- **Interferencias:** espectrales, de **fondo (inespecíficas)**, de **ionización** y **químicas**.
- **Ionización → sal de metal alcalino, 1 000 µg de CESIO/mL.** **Químicas → 1 000 µg de LANTANO/mL** (agente liberador); también estroncio; el **agente protector** típico es el **EDTA**.
- **La absorción de fondo se nota sobre todo por debajo de 250 nm.**
- **Corrección de fondo: lámpara de DEUTERIO o efecto ZEEMAN.** (Aquí el deuterio no es la fuente: es el corrector.)
- **Adición de patrón** cuando la matriz de la muestra no se puede reproducir en los patrones.
- **Concentración (o masa) característica: la que da una absorbancia de 0,0044.** Es la medida de sensibilidad del equipo.
- **Calibración: mínimo 3 patrones, mejor 5-7**, **antes de cada sesión**; patrones comerciales de **1 000 mg/L** que se diluyen; material **clase A** lavado con **HNO₃ 0,1 mol/L**; **15-30 min** de calentamiento; ambiente **15-30 °C**.
- **Metales TOTALES → digestión ácida en caliente, sin filtrar antes.** Metales **disueltos → filtrar a 0,45 µm**. Pregunta documentada: 1246 #25.
- **UNE-EN ISO 15586** → elementos traza por **cámara de grafito**. **UNE-EN ISO 12846** → **mercurio** por AAS. **UNE-EN ISO 7980** → **calcio y magnesio**. **UNE-EN ISO 5961** → **cadmio**. **UNE-EN ISO 15587-1/-2** → **digestión**.
- **La UNE-EN ISO 11969 (arsénico por hidruros) está ANULADA** desde el 18/09/2014.
- **El RD 3/2023 no impone método**: **LC ≤ 30 %** del valor paramétrico e incertidumbre de la **tabla 15**. En superficiales, **RD 817/2015**: **incertidumbre ≤ 50 % (k = 2)** y **LC ≤ 30 %** de la NCA.
- **Muchos metales a la vez → ICP** (tema 27), no absorción atómica.

## Reparto con los temas vecinos

| Contenido | Dónde se desarrolla |
| --- | --- |
| **Absorción atómica: fundamento, instrumentación, interferencias, calibración y uso en agua** | **Aquí** |
| Emisión atómica de llama y fluorescencia atómica | **Aquí**, lo justo |
| Absorción **molecular** UV-visible (bandas anchas, reactivo cromogénico) | **Tema 25** |
| **ICP-OES e ICP-MS** | **Tema 27** |
| Turbidez, índice de refracción y polarimetría | **Tema 28** |
| Cromatografía iónica (cationes: Na, K, Ca, Mg) | **Tema 30** |
| **Dureza** y demás parámetros de agua de consumo | **Tema 33** |
| **Metales** en aguas residuales, como parámetro | **Tema 35** |
| Toma, envase y conservación de la muestra para metales | **Tema 36** |
| Metales en PM10 y PM2,5 (aire) | **Tema 37** |
| Validación, rango, incertidumbre | **Tema 38** |
| Patrones, trazabilidad y **calibración lineal por mínimos cuadrados** | **Tema 39** |
| ISO 17025 y acreditación | **Tema 40** |

---

## Fuentes y verificación

- **Documento oficial leído íntegro:** **CEM, procedimiento QU-001** (48 páginas), descargado del sitio del Centro Español de Metrología. De él salen, citados por apartado: partes del equipo (4.1), fundamento (4.2.1), criterio de calibración global (4.2.2), materiales y patrones (5.1), operaciones previas (5.2), recta de calibrado y concentración característica (5.3).
- **Método oficial leído íntegro:** **INSST, MTA/MA-025/A16**. Tabla 1 (longitudes de onda y condiciones de llama de 12 elementos) y apartado 8.4 (interferencias). **Es un método de aire, no de agua**; se usa solo por sus condiciones instrumentales, que son las de la técnica.
- **Normas UNE verificadas una a una en la tienda de AENOR**, comprobando código, título, año, equivalencia ISO y **estado**: UNE-EN ISO 15586:2004 (en vigor), UNE-EN ISO 12846:2012 (en vigor; anula UNE-EN 12338:1999 y UNE-EN 1483:2007), UNE-EN ISO 7980:2000 (en vigor), UNE-EN ISO 5961:1995 (en vigor), UNE-EN ISO 17852:2008, UNE-EN ISO 15587-1:2002 (en vigor) y **UNE-EN ISO 11969:1997 (ANULADA el 18/09/2014)**.
- **Normas legales leídas literalmente en el BOE**, texto consolidado: RD 3/2023, anexo III, parte D, puntos 1 y 3; RD 817/2015, anexo III, apartado C.1, y artículo 3.25.
- **Exámenes anteriores:** los seis cuestionarios de `ExamenesAnteriores/` extraídos a texto y releídos para localizar las preguntas de este tema.
- **Fecha de verificación:** 07/09/2026.

### Dudas y limitaciones declaradas

1. **De ninguna de las normas UNE citadas he leído el texto**: son de pago, y AENOR prohíbe expresamente su uso en sistemas de IA. He verificado **solo los datos bibliográficos**: código, título, año, equivalencia ISO y estado. **Los reactivos, longitudes de onda y rangos que aparecen en la tabla operativa NO salen de las normas**, sino del MTA/MA-025 del INSST (que sí he leído) y de fuentes secundarias. Mismo tratamiento que en los temas 23, 24 y 25.

2. **Las longitudes de onda de la tabla operativa proceden de un método de AIRE, no de agua.** La tabla 1 del MTA/MA-025/A16 da Cd 228,8 · Zn 213,9 · Co 240,7 · Cu 324,8 · Cr 357,9 · Fe 248,3 · Mn 279,5 · Ni 232,0 · Ag 328,1 · Pb 283,3 · Al 309,3 · Mo 313,3 nm, con sus condiciones de llama. La línea analítica es una propiedad del elemento, así que es la misma en agua; pero **la norma de agua puede prescribir otra línea o otra llama, y eso no lo he podido comprobar**.

3. **Los 253,7 nm del mercurio y los 589,0 / 766,5 nm del sodio y el potasio no están en el MTA/MA-025.** Los 253,7 nm los he encontrado en varias fuentes secundarias coincidentes y los doy por buenos; **las de sodio y potasio no las incluyo en la tabla** precisamente porque no las he verificado.

4. **ISO 8288:1986 (Co, Ni, Cu, Zn, Cd y Pb por llama) e ISO 9965:1993 (selenio por hidruros): no he encontrado adopción UNE.** El catálogo de UNE las lista como **normas ISO**, no como normas españolas. La ISO 8288 aparece como confirmada en 2023. **No debe decirse «la UNE-EN ISO 8288»**: es ISO a secas.

5. **La UNE-EN ISO 11969 (arsénico por hidruros) está anulada y la ficha de AENOR no indica norma sustituta.** Lo lógico es que su hueco lo cubran la UNE-EN ISO 15586 (cámara de grafito) y la UNE-EN ISO 17294-2 (ICP-MS, tema 27), **pero eso lo deduzco yo, no lo dice la ficha**.

6. **La cuarta etapa del horno de grafito (limpieza) no está en mi fuente.** Harvey describe **tres**: secado, calcinación y atomización, con el ciclo completo en 45-90 s. La etapa de **limpieza** es práctica corriente y la cita indirectamente el CEM al hablar del **efecto memoria** (5.3.5), pero **no he verificado su temperatura**, y por eso en la figura aparece sin cifra.

7. **Las temperaturas de llama varían entre fuentes.** Doy las de Harvey (**aire-acetileno 2 100-2 400 °C**, **óxido nitroso-acetileno 2 600-2 800 °C**). Otros manuales dan 2 300 y 2 950 °C. **La cifra exacta no es el dato**: lo que se pregunta es cuál es más caliente y para qué sirve.

8. **La anchura de línea de ≈ 0,002 nm y la razón de 1 000 frente a la fuente continua** son de LibreTexts (Análisis Instrumental, 9.2 y Harvey 10.4). **No es un dato normativo** y en la bibliografía se dan valores entre 0,001 y 0,005 nm.

9. **En el supuesto 1 de 1233 y de 1246 no tengo la plantilla de respuestas.** Las preguntas «Análisis de Sodio» (1233) y «Análisis de Calcio» (1246) ofrecen las mismas cuatro opciones: *absorción atómica con generación de hidruros / potenciometría / cromatografía iónica / cromatografía de gases*. **Ninguna es «absorción atómica de llama», que es la respuesta de manual.** Lo único que puedo afirmar con seguridad es que **la opción de hidruros es falsa** para sodio y calcio. Entre potenciometría (electrodo selectivo, tema 24) y cromatografía iónica de cationes (tema 30) **no me pronuncio**: las dos son técnicas reales para esos iones.

10. **Que el ICP sea preferible cuando hay muchos metales es criterio operativo, no normativo.** Lo sostiene el hecho de que en 1246 la respuesta a «análisis de cadmio» fuera ICP-MS y en 1322 la de «análisis de metales: Hg, As, Sb, Se, Cd, Cu, Cr, Ni, Pb, Fe, Mn y Zn» fuera «digestión ácida y determinación por ICP-MS», pero **no hay norma que lo imponga**: la UNE-EN ISO 15586 sigue vigente para esos mismos elementos.

11. **La filtración a 0,45 µm para «metales disueltos» es práctica de laboratorio.** El corte exacto y el orden respecto de la acidificación los fija la UNE-EN ISO 5667-3, cuya **edición vigente es la de 2024** (sustituye a la de 2019) y **que no he leído**. Ese detalle es del **tema 36**.

12. **El reparto con el tema 27 lo he decidido yo.** Aquí queda toda la absorción atómica y una mención de la emisión de llama y la fluorescencia; el ICP entero se va al 27. Si al redactar el 27 conviene mover algo —por ejemplo, la digestión previa, que es común a las dos familias—, se recorta de aquí sin tocar el resto.
