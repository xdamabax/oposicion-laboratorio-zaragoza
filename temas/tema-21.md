---
tema: 21
titulo: "Análisis gravimétrico: Concepto, material y operaciones. Manejo y calibración de balanzas analíticas. Clases de determinaciones gravimétricas."
parte: Parte segunda
estado: aprobado
verificado: 2026-09-02
fuentes:
  - "VIM. Vocabulario Internacional de Metrología (JCGM 200:2012), 3.ª edición en español publicada por el Centro Español de Metrología (CEM), 2012. Definiciones de calibración (2.39), verificación (2.44), ajuste (3.11) y trazabilidad metrológica (2.41), citadas literalmente — https://www.cem.es/sites/default/files/vim-cem-2012web.pdf"
  - "Ley 32/2014, de 22 de diciembre, de Metrología (BOE-A-2014-13359). Artículo 8.1: usos que obligan al control metrológico del Estado."
  - "Real Decreto 244/2016, de 3 de junio, por el que se desarrolla la Ley 32/2014, de Metrología (BOE-A-2016-5530). Anexo VI: instrumentos de pesaje de funcionamiento no automático. Transpone la Directiva 2014/31/UE."
  - "Directiva 2014/31/UE del Parlamento Europeo y del Consejo, de 26 de febrero de 2014, sobre comercialización de instrumentos de pesaje de funcionamiento no automático (DOUE L 96, de 29/03/2014, pp. 107-148) — https://www.boe.es/doue/2014/096/L00107-00148.pdf"
  - "Orden ICT/155/2020, de 7 de febrero, por la que se regula el control metrológico del Estado de determinados instrumentos de medida (BOE-A-2020-2573), texto consolidado, última actualización de 03/10/2025. Anexo I: instrumentos de pesaje de funcionamiento no automático."
  - "UNE-EN 45501:2016, Aspectos metrológicos de los instrumentos de pesaje de funcionamiento no automático (adopta la EN 45501:2015, norma armonizada de la Directiva 2014/31/UE)."
  - "EURAMET Calibration Guide No. 18, «Guidelines on the Calibration of Non-Automatic Weighing Instruments», versión 4.0, noviembre de 2015 — https://www.euramet.org/publications-media-centre/calibration-guidelines"
  - "OIML R 111-1:2004, «Weights of classes E1, E2, F1, F2, M1, M1-2, M2, M2-3, M3. Part 1: Metrological and technical requirements», con enmienda de 2025 — https://www.oiml.org/en/files/pdf_r/r111-1-e04.pdf"
  - "UNE-EN 872:2006, Calidad del agua. Determinación de los sólidos en suspensión. Método de filtración por filtro de fibra de vidrio (adopta la EN 872:2005, que anuló la EN 872:1996)."
  - "UNE-EN 12880:2001, Caracterización de lodos. Determinación de la humedad y del contenido en materia seca."
  - "UNE-EN 12879:2001, Caracterización de lodos. Determinación de la pérdida de peso por calcinación de la materia seca."
  - "UNE-EN 12341:2024, Aire ambiente. Método gravimétrico de medida normalizado para la determinación de la concentración másica PM10 o PM2,5 (adopta la EN 12341:2023; anula la UNE-EN 12341:2015)."
  - "Real Decreto 102/2011, de 28 de enero, relativo a la mejora de la calidad del aire (BOE-A-2011-1645), modificado por el Real Decreto 39/2017: remite como método de referencia de PM10 y PM2,5 a la UNE-EN 12341:2015."
  - "Laboratorio Nacional de Referencia de Calidad del Aire (ISCIII), documento LNR 02/2015, «Principales cambios en la norma UNE-EN 12341:2015». Condiciones del cuarto de pesadas y criterios de estabilidad de masa — https://cnsa.isciii.es/documents/d/cnsa/lnr-2002_2015-pdf-1"
  - "BIBLIOGRAFÍA TÉCNICA (no consultable en línea, ver «Dudas»): Skoog, West, Holler y Crouch, «Fundamentos de Química Analítica»; Harris, «Análisis Químico Cuantitativo»; Mendham y otros, «Vogel. Análisis Químico Cuantitativo». Son la referencia de los apartados 2.1, 2.3 y 2.5."
---

> **Aviso de fuentes.** Este tema no tiene una norma que lo regule, a diferencia del 20. Se apoya en dos bloques distintos, y conviene no mezclarlos:
>
> 1. **La parte metrológica** (balanzas, pesas, calibración, verificación) **sí** tiene normativa y guías verificables, y se cita con nombre, número y año: VIM, Ley 32/2014, RD 244/2016, Orden ICT/155/2020, UNE-EN 45501, EURAMET cg-18, OIML R 111.
> 2. **La parte químico-analítica** (qué es una gravimetría, cómo precipita, qué es la coprecipitación) es **doctrina de los libros de referencia de química analítica**, no norma. Se ha redactado siguiendo el consenso de Skoog, Harris y Vogel, y así se declara en el bloque de fuentes. No lleva citas de artículo porque no las tiene.

> **Aviso de vigencia.** La Orden ICT/155/2020 está tomada de su texto consolidado a **3 de octubre de 2025**. La EURAMET cg-18 sigue en su **versión 4.0 de noviembre de 2015**, comprobado en el propio catálogo de EURAMET. Las normas UNE citadas son de pago: se ha verificado título, año y vigencia en catálogo, no el texto íntegro (ver «Dudas»).

> **Coordinación con el tema 22.** Gravimetría (21) y volumetría (22) se encadenan y comparten material, vocabulario metrológico y estructura de enunciado. El reparto que se ha seguido aquí está explicado al final, en «Reparto acordado con el tema 22».

## 1. Encuadre

El análisis gravimétrico es el método clásico de análisis cuantitativo en el que **la magnitud que se mide es la masa**. Todo lo demás del tema cuelga de eso: si el resultado depende de una pesada, el instrumento crítico es la balanza, y la balanza tiene detrás toda una cadena metrológica.

| Qué regula | Norma o referencia | Lógica |
| --- | --- | --- |
| Qué es y cómo se hace una gravimetría | Bibliografía de química analítica (Skoog, Harris, Vogel) | **Doctrina técnica**, no norma |
| Vocabulario: calibrar, verificar, ajustar | **VIM** (JCGM 200:2012), ed. española del CEM | Metrología general |
| Cómo debe comportarse una balanza | **UNE-EN 45501:2016** y RD 244/2016, anexo VI | Requisitos metrológicos |
| Cuándo hay que verificar oficialmente una balanza | **Orden ICT/155/2020**, anexo I | Control metrológico del Estado |
| Cómo se calibra una balanza | **EURAMET cg-18** v4.0 (2015) | Guía técnica de calibración |
| Con qué pesas se calibra | **OIML R 111-1:2004** | Patrones de masa |
| Métodos gravimétricos concretos | UNE-EN 872, 12880, 12879, 12341 | Ensayo normalizado |

La frontera que más se pregunta: **una balanza de laboratorio no está sujeta a control metrológico del Estado por el hecho de ser una balanza**, sino por el **uso** que se le da (apartado 2.4.7). Lo que sí necesita siempre, si el laboratorio está acreditado, es **calibración trazable** (UNE-EN ISO/IEC 17025).

## 2. Desarrollo

### 2.1. Concepto

El **análisis gravimétrico** determina la cantidad de analito **midiendo la masa** de una sustancia de composición conocida que lo contiene o que deriva de él estequiométricamente.

Sus dos rasgos característicos:

- **Es un método absoluto (o primario).** No necesita una recta de calibrado con patrones del analito: el resultado sale de una masa y de una relación estequiométrica. Por eso se ha usado históricamente para certificar patrones y validar otras técnicas.
- **Su exactitud depende de la balanza y del comportamiento del precipitado**, no de un detector. Bien hecha, una gravimetría clásica es de las técnicas más exactas que hay; mal hecha, arrastra errores que ningún cálculo corrige.

**Ventajas:** exactitud alta, instrumentación barata, no requiere patrones del analito, resultados trazables al kilogramo.
**Inconvenientes:** lenta (horas o días), poco sensible (no sirve para trazas), consume muestra abundante, muy sensible a interferencias que coprecipitan.

#### Factor gravimétrico

Es la pieza de cálculo del tema. El **factor gravimétrico (F)** convierte la masa del precipitado pesado en masa de analito:

> **F = (a · masa molar del analito) / (b · masa molar del precipitado)**

donde *a* y *b* son los coeficientes que igualan el número de átomos o moles del elemento buscado en una y otra fórmula. Después:

> **masa de analito = masa de precipitado × F**
> **% de analito = (masa de precipitado × F / masa de muestra) × 100**

| Analito buscado | Se pesa como | Factor gravimétrico |
| --- | --- | --- |
| SO₄²⁻ | BaSO₄ | M(SO₄²⁻) / M(BaSO₄) |
| Cl⁻ | AgCl | M(Cl⁻) / M(AgCl) |
| Fe | Fe₂O₃ | 2 · M(Fe) / M(Fe₂O₃) |
| Ca | CaO | M(Ca) / M(CaO) |

Fíjate en el **2** del hierro: hay dos átomos de Fe por cada fórmula de Fe₂O₃. Es el error de cálculo típico.

### 2.2. Material

En gravimetría **el volumen no es una magnitud crítica**: lo que se mide es masa. Por eso el material de vidrio que se usa es **graduado o de uso general, no aforado**. Ésta es la diferencia de fondo con el tema 22, donde el material aforado de clase A es el corazón del método.

| Material | Para qué | Nota |
| --- | --- | --- |
| ![Vaso de precipitados](material:vaso-precipitados) | Recipiente donde se precipita y se digiere | Se cubre con vidrio de reloj; nunca se pesa en él el precipitado final |
| ![Embudo](material:embudo) | Filtración por gravedad con papel de filtro | Para precipitados que luego se **calcinan** con el papel |
| ![Probeta](material:probeta) | Añadir reactivos y agua de lavado | **Graduada**: exactitud de volumen suficiente, porque el volumen no entra en el cálculo |

Material específico de la gravimetría, más allá del vidrio general:

- **Papel de filtro sin cenizas.** Deja un residuo de ceniza despreciable al calcinarlo, así que el precipitado se calcina *con* el papel. Se clasifica por velocidad de filtrado y retención (las «bandas» de los catálogos: negra o rápida para precipitados gelatinosos, azul o lenta para precipitados finos y cristalinos).
- **Crisol de Gooch.** Crisol con fondo perforado sobre el que se dispone un lecho filtrante (históricamente amianto, hoy microfibra de vidrio). Se usa con succión.
- **Crisol filtrante de placa porosa (vidrio o porcelana).** Lleva la placa incorporada, con **porosidad numerada** según el tamaño de poro. Es el más cómodo, pero **no admite calcinación a alta temperatura** si es de vidrio: sólo secado en estufa.
- **Crisoles de porcelana, sílice o platino.** Para calcinar en mufla. El platino es el de mejor comportamiento y el más caro.
- **Estufa de desecación.** Secado a temperatura moderada, típicamente 105 °C.
- **Mufla (horno de calcinación).** Calcinación a alta temperatura, típicamente 500-1000 °C según el método.
- **Desecador.** Enfría el crisol sin que recupere humedad. Lleva un **desecante** (gel de sílice, cloruro cálcico anhidro, pentóxido de fósforo). La llave se abre despacio para no arrastrar el precipitado con la entrada de aire.
- **Pinzas de crisol.** Un crisol **nunca se toca con los dedos**: la grasa y la humedad de la piel pesan.
- **Vidrio de reloj y pesasustancias.** Para pesar la muestra; el pesasustancias con tapa, si la muestra es higroscópica.
- **Varilla de vidrio con goma (policía de goma).** Para arrastrar los restos de precipitado adheridos a las paredes.

### 2.3. Operaciones

La secuencia clásica de una gravimetría por precipitación:

**1. Disolución y toma de muestra.** Se pesa la muestra en balanza analítica y se disuelve.

**2. Precipitación.** Se añade el reactivo precipitante. La regla de fondo es la de **von Weimarn**: el tamaño de partícula del precipitado depende de la **sobresaturación relativa** en el momento de la precipitación.

> **Sobresaturación relativa = (Q − S) / S**, donde *Q* es la concentración instantánea del soluto y *S* su solubilidad de equilibrio.

- **Sobresaturación relativa alta** → predomina la **nucleación** → muchísimos núcleos → precipitado **coloidal**, de partícula muy fina, difícil de filtrar.
- **Sobresaturación relativa baja** → predomina el **crecimiento de partícula** → precipitado **cristalino**, de partícula grande, fácil de filtrar y lavar.

De ahí las cuatro maniobras clásicas para bajar la sobresaturación: disolución **diluida**, adición del precipitante **lenta y con agitación**, precipitación **en caliente** (sube *S*) y control del **pH** para no precipitar de golpe. La versión refinada es la **precipitación en disolución homogénea**, en la que el precipitante se genera *in situ* poco a poco por una reacción química (por ejemplo, urea que se hidroliza al calentar y libera amoniaco).

**3. Digestión o envejecimiento.** El precipitado se deja en su aguas madres, en caliente. Las partículas pequeñas, más solubles, se redisuelven y recristalizan sobre las grandes (**maduración de Ostwald**): el precipitado se hace más grueso, más puro y más filtrable.

**4. Filtración.** Con papel sin cenizas y embudo si va a calcinarse, o con crisol filtrante si sólo va a secarse.

**5. Lavado.** Elimina las aguas madres retenidas. Se lava con un **electrolito volátil** (por ejemplo, disolución de nitrato amónico o ácido nítrico diluido), no con agua destilada pura: el agua pura puede provocar **peptización**, es decir, que el coloide coagulado vuelva a dispersarse y se escape por el filtro. Es más eficaz lavar con **muchas porciones pequeñas** que con pocas grandes.

**6. Secado o calcinación.** Se seca en estufa o se calcina en mufla, hasta transformar el precipitado en una **especie de composición conocida y estequiométrica**. No siempre coincide con lo precipitado: el hidróxido de hierro(III) hidratado se precipita como tal y se pesa como **Fe₂O₃**.

**7. Enfriamiento en desecador y pesada hasta masa constante.** El crisol caliente no se pesa nunca: el aire caliente asciende y falsea la lectura. **Masa constante** significa repetir el ciclo calentar-enfriar-pesar hasta que dos pesadas consecutivas difieran menos que la tolerancia fijada por el método.

**8. Cálculo** con el factor gravimétrico.

#### Errores propios de la gravimetría

Son la fuente de preguntas más recurrente del apartado:

| Fenómeno | Qué es | Efecto sobre el resultado |
| --- | --- | --- |
| **Coprecipitación por adsorción superficial** | Iones ajenos se pegan a la superficie del precipitado | Por exceso (pesa de más) |
| **Coprecipitación por oclusión** | Impurezas quedan **atrapadas dentro** del cristal al crecer deprisa | Por exceso |
| **Coprecipitación por inclusión isomorfa** | Un ion ajeno de tamaño y carga parecidos **sustituye** a uno propio en la red | Por exceso; es la más difícil de eliminar |
| **Postprecipitación** | Una segunda sustancia precipita **encima** del precipitado ya formado, al dejarlo reposar demasiado | Por exceso |
| **Peptización** | El coloide coagulado se redispersa al lavarlo con agua pura y atraviesa el filtro | Por defecto (pesa de menos) |
| **Pérdidas por solubilidad** | Parte del precipitado se queda disuelta en las aguas madres o en el líquido de lavado | Por defecto |

Los remedios: **digestión** (reduce oclusión y adsorción), **redisolución y reprecipitación** (la más eficaz contra la coprecipitación), **lavado con electrolito volátil** (evita la peptización) y **control del reactivo en exceso** (un exceso moderado baja la solubilidad por efecto de ion común; un exceso grande puede redisolver el precipitado por formación de complejos).

### 2.4. Balanzas analíticas: manejo y calibración

#### 2.4.1. Tipos por resolución

La **división de escala real (d)** es el intervalo entre dos indicaciones consecutivas: lo que en el catálogo se llama «legibilidad» o «resolución».

| Denominación habitual | d (división real) | Uso típico |
| --- | --- | --- |
| Balanza de precisión o granatario | 0,1 g a 1 mg | Pesadas previas, reactivos a granel |
| **Balanza analítica** | **0,1 mg** | Pesada de muestra y de precipitados |
| Semimicrobalanza | 0,01 mg | Muestras pequeñas |
| Microbalanza | 0,001 mg (1 µg) | Filtros de material particulado, trazas |

#### 2.4.2. Clases de exactitud

Los instrumentos de pesaje de funcionamiento no automático (**IPFNA**) se clasifican en cuatro clases de exactitud, según el RD 244/2016 (anexo VI) y la UNE-EN 45501:

| Clase | Denominación | Ejemplo |
| --- | --- | --- |
| **I** | Exactitud **especial** | **Balanza analítica** |
| II | Exactitud **fina** | Balanza de precisión, laboratorio general |
| III | Exactitud **media** | Báscula comercial, mostrador |
| IIII | Exactitud **ordinaria** | Básculas de baja exactitud |

Dos escalones que no son lo mismo y que se confunden en el examen:

- **d — escalón real (o división de escala real).** Lo que la balanza *muestra*.
- **e — escalón de verificación.** El escalón con el que se *evalúa metrológicamente* el instrumento y con el que se expresan los errores máximos permitidos. Es el que figura en las inscripciones reglamentarias.

En una balanza analítica típica, **e es mayor que d**: la balanza muestra más cifras de las que la metrología legal le reconoce. Tanto *d* como *e* deben tomar la forma **1 × 10^k, 2 × 10^k o 5 × 10^k** unidades de masa, con *k* entero.

El **número de escalones de verificación, n = Max / e**, mide la «finura» del instrumento y es lo que fija la clase junto con *e* y la carga mínima **Min**.

#### 2.4.3. Manejo de la balanza analítica

**Instalación:**

- Mesa **antivibratoria**, pesada y estable, en un rincón del laboratorio y no en el centro de una mesa larga.
- Lejos de puertas, ventanas, corrientes de aire, salidas de climatización y focos de calor.
- **Nivelada**: la burbuja del nivel debe quedar centrada, ajustando las patas roscadas. Es la comprobación de rutina que más se olvida.
- Ambiente de temperatura y humedad estables. La humedad muy baja favorece la carga electrostática.

**Antes de pesar:**

- Balanza **conectada permanentemente** y estabilizada térmicamente; si se ha desenchufado, hay que darle tiempo de calentamiento.
- **Ajuste** interno o externo, según el procedimiento del laboratorio, y comprobación con una pesa de control.
- **Cero** con las puertas del paravientos cerradas.

**Al pesar:**

- **Puertas cerradas** en el momento de la lectura. Es la causa número uno de lecturas inestables.
- Carga **centrada** en el plato: descentrarla introduce **error de excentricidad**.
- El objeto **a temperatura ambiente**. Un crisol caliente genera corrientes de convección y pesa **menos** de lo que debería.
- Manipular con **pinzas** o guantes, nunca con los dedos.
- Muestras **higroscópicas o volátiles**, en recipiente tapado (pesasustancias) y con la pesada lo más rápida posible.
- **Electrostática**: los plásticos y el vidrio muy seco se cargan y la lectura deriva sin estabilizarse. Se corrige con ionizador, con recipientes metálicos o subiendo la humedad ambiente.
- **Magnetismo**: las muestras ferromagnéticas interaccionan con la célula de pesada; se aíslan con un soporte no magnético.
- **Empuje del aire (flotación).** La balanza compara fuerzas dentro del aire, y el aire empuja hacia arriba tanto la muestra como la pesa. Si la densidad de la muestra difiere mucho de la de las pesas, hay un error sistemático que en trabajo de alta exactitud se corrige por cálculo. Es el motivo de que la masa «convencional» y la masa real no coincidan.
- **Tara**: la balanza descuenta el recipiente, pero **no amplía su capacidad máxima**; Max sigue contando la masa total sobre el plato.

**Limpieza:** el plato y la cámara, con pincel suave, después de cada uso. Un grano de reactivo caído en la cámara es un error sistemático permanente.

#### 2.4.4. Calibrar no es verificar, y ninguna de las dos es ajustar

Es la distinción con más rendimiento del tema, y está definida con precisión en el **VIM** (JCGM 200:2012, ed. del CEM). Literalmente:

- **Calibración (VIM 2.39):** *«operación que bajo condiciones especificadas establece, en una primera etapa, una relación entre los valores y sus incertidumbres de medida asociadas obtenidas a partir de los patrones de medida, y las correspondientes indicaciones con sus incertidumbres asociadas y, en una segunda etapa, utiliza esta información para establecer una relación que permita obtener un resultado de medida a partir de una indicación»*. Es decir: **compara con patrones y cuantifica el error y su incertidumbre**. No corrige nada por sí misma. Su producto es un **certificado de calibración**.

- **Verificación (VIM 2.44):** *«aportación de evidencia objetiva de que un elemento dado satisface los requisitos especificados»*. Es decir: **comprueba si el error cabe dentro de una tolerancia** y emite un juicio de conforme / no conforme.

- **Ajuste (VIM 3.11):** *«conjunto de operaciones realizadas sobre un sistema de medida para que proporcione indicaciones prescritas, correspondientes a valores dados de la magnitud a medir»*. Es decir: **se toca el instrumento** para corregirlo. Es lo que hace el botón «CAL» de una balanza con pesa interna.

El VIM añade dos notas que valen por sí solas como pregunta de examen:

> *«No debe confundirse el ajuste de un sistema de medida con su propia calibración, que es un requisito para el ajuste»* (nota 2 del 3.11).
> *«Después de su ajuste, generalmente un sistema de medida debe ser calibrado nuevamente»* (nota 3 del 3.11).

Y la **trazabilidad metrológica (VIM 2.41)** es *«propiedad de un resultado de medida por la cual el resultado puede relacionarse con una referencia mediante una cadena ininterrumpida y documentada de calibraciones, cada una de las cuales contribuye a la incertidumbre de medida»*.

| | Calibración | Verificación | Ajuste |
| --- | --- | --- | --- |
| Qué hace | Mide el error frente a patrones | Declara si cumple una tolerancia | Corrige la indicación |
| Resultado | Certificado con error e incertidumbre | Conforme / no conforme | Instrumento modificado |
| ¿Toca el instrumento? | **No** | No | **Sí** |
| Quién la exige | UNE-EN ISO/IEC 17025 (laboratorio acreditado) | Control metrológico del Estado | Procedimiento interno |

#### 2.4.5. Cómo se calibra una balanza: EURAMET cg-18

La referencia técnica europea es la **EURAMET Calibration Guide No. 18**, «Guidelines on the Calibration of Non-Automatic Weighing Instruments», **versión 4.0 (noviembre de 2015)**. Es el documento que usan los laboratorios de calibración acreditados. Los ensayos que contempla:

- **Repetibilidad.** Varias pesadas de la misma carga en las mismas condiciones, sin mover nada. Mide la dispersión (**precisión**), no el error.
- **Excentricidad.** La misma carga en el centro y en cuatro posiciones del plato. Mide cuánto cambia la indicación según dónde se pose la carga.
- **Errores de indicación (linealidad).** Varias cargas repartidas por todo el alcance, de cero a Max, comparadas con pesas patrón. Es lo que da la curva de error del certificado.
- **Magnitudes de influencia y correcciones**, entre ellas la **corrección por empuje del aire**.
- **Mínimo de pesada (*minimum weight*).** La carga por debajo de la cual la incertidumbre relativa se dispara y la balanza deja de ser apta para el uso previsto. Es un concepto de calibración, distinto de la carga mínima **Min** de la metrología legal.

La calibración da **error e incertidumbre**; que eso sea aceptable o no lo decide el laboratorio comparándolo con su propio **criterio de aceptación**, que fija según lo que necesita el método.

#### 2.4.6. Pesas patrón

Los patrones de masa se rigen por la recomendación **OIML R 111-1:2004** (con enmienda de 2025), que cubre valores nominales **de 1 mg a 5 000 kg** y define nueve clases de exactitud, de la más exacta a la menos:

> **E1 · E2 · F1 · F2 · M1 · M1-2 · M2 · M2-3 · M3**

En la práctica del laboratorio: las **E2** y **F1** son las que se usan con balanzas analíticas de clase I. Las pesas se manipulan **siempre con pinzas o guantes**, se guardan en su estuche y tienen su propio certificado de calibración con vigencia limitada: **una pesa sin certificado en vigor no sirve como patrón**.

#### 2.4.7. Verificación periódica: cuándo es obligatoria

El **control metrológico del Estado** no se aplica a toda balanza, sino a las que se usan para los fines del **artículo 8.1 de la Ley 32/2014**: interés público, salud, seguridad, orden público, medio ambiente, protección de los consumidores, recaudación tributaria, cálculo de aranceles y peritajes judiciales.

Cuando aplica, el régimen está en la **Orden ICT/155/2020** (texto consolidado a 03/10/2025), cuyo **anexo I** es el de los instrumentos de pesaje de funcionamiento no automático:

- La fase de instrumentos en servicio comprende la **verificación después de reparación o modificación** y la **verificación periódica**.
- La **verificación periódica de los IPFNA es cada dos años**.
- El instrumento debe seguir cumpliendo los requisitos que dieron origen a su comercialización y puesta en servicio, y conservar su clase de exactitud.
- La orden **derogó** la Orden de 27 de abril de 1999, y con ella el libro-registro de verificaciones y reparaciones.

> **Sin confirmación normativa.** Circula mucho la regla de que *«los errores máximos permitidos en servicio son el doble de los de la verificación primitiva»*. Es una regla habitual en metrología legal y aparece en material de estudio y en catálogos comerciales, pero **no la he podido localizar en el texto del RD 244/2016 ni en el de la Orden ICT/155/2020**. Este apunte **no la da por buena**: si aparece en un test de otra fuente, trátala como dato sin verificar, no como precepto citable.

En un laboratorio municipal de análisis, la consecuencia práctica: **la balanza analítica de trabajo interno se calibra** (trazabilidad, ISO 17025), y **se verifica** además si el resultado de la pesada se usa para alguno de los fines del artículo 8.1.

### 2.5. Clases de determinaciones gravimétricas

| Clase | Fundamento | Ejemplos |
| --- | --- | --- |
| **Gravimetría por precipitación** | El analito se separa como precipitado poco soluble de composición conocida, que se filtra, seca o calcina y se pesa | Sulfato como BaSO₄; cloruro como AgCl; níquel con dimetilglioxima |
| **Gravimetría por volatilización o desecación** | Se separa un componente **volátil** por calor o por reactivo químico | Humedad, materia seca, sólidos totales, pérdida por calcinación |
| **Electrogravimetría** | El analito se deposita **por electrólisis** sobre un electrodo previamente pesado | Cobre depositado sobre cátodo de platino |
| **Gravimetría por extracción** | El analito se extrae con un disolvente que después se evapora, y se pesa el residuo | Grasas y aceites, hidrocarburos |
| **Termogravimetría (TGA)** | Registro **continuo** de la masa frente a la temperatura o el tiempo | Curvas de descomposición, estudio de hidratos |

La gravimetría por volatilización se subdivide en dos, y es distinción de examen:

- **Método directo:** se **recoge y se pesa** el componente volátil, atrapándolo en un absorbente. Pesa lo que se va.
- **Método indirecto:** se pesa la muestra antes y después, y el analito se calcula **por diferencia de masa**. Pesa lo que queda. Es, con diferencia, el más habitual: todas las determinaciones de humedad, materia seca y sólidos en suspensión son indirectas.

## 3. Tabla operativa

| Parámetro / analito | Técnica | Norma o referencia | Unidades | Condiciones |
| --- | --- | --- | --- | --- |
| Sólidos en suspensión (agua bruta y residual) | Gravimetría por filtración y desecación (volatilización indirecta) | **UNE-EN 872:2006** | mg/L | Filtro de **fibra de vidrio de borosilicato sin aglomerante**; filtración a vacío o presión; secado a **105 °C ± 2 °C**; pesada hasta masa constante |
| Humedad y materia seca (lodos) | Gravimetría por desecación | **UNE-EN 12880:2001** | % o g/kg | Estufa a **105 °C** hasta que no varíe la masa; aplicable a lodos líquidos, pastosos y sólidos |
| Pérdida por calcinación de la materia seca (lodos) | Gravimetría por calcinación | **UNE-EN 12879:2001** | % de la materia seca | Se parte del residuo seco obtenido según la UNE-EN 12880; calcinación en mufla (≈ 550 °C, ver «Dudas») |
| PM10 y PM2,5 (aire ambiente) | Gravimetría sobre filtro | **UNE-EN 12341:2024**; el RD 102/2011 remite todavía a la ed. **2015** | µg/m³ | Cuarto de pesadas a **19-21 °C** y **45-50 % HR** (medias horarias); filtros manipulados **con pinzas**; acondicionamiento y doble pesada, con criterio de estabilidad de **40 µg** (filtros sin muestrear) y **60 µg** (muestreados) |
| Sulfato | Gravimetría por precipitación | Método clásico (Vogel; Standard Methods 4500-SO₄²⁻ C) | mg/L o % | Precipitación con BaCl₂ en medio ácido y en caliente; digestión; se pesa como **BaSO₄** |
| Cloruro | Gravimetría por precipitación | Método clásico (Vogel) | mg/L o % | Precipitación con AgNO₃; se pesa como **AgCl**; **protegido de la luz** (el AgCl fotodescompone) |
| Grasas y aceites | Gravimetría por extracción | Standard Methods 5520 B | mg/L | Extracción con disolvente, evaporación y pesada del residuo |
| Cenizas (muestras sólidas) | Gravimetría por calcinación | Método general de mufla | % | Calcinación en mufla; enfriado en desecador; masa constante |
| Residuo seco / sólidos totales | Gravimetría por desecación | Método general | mg/L | Evaporación a sequedad y secado a 105 °C; masa constante |

## 4. Puntos críticos para el examen

- **Calibrar ≠ verificar ≠ ajustar.** Calibrar mide el error y no toca el instrumento; verificar declara conforme o no conforme; ajustar sí modifica el instrumento. El VIM añade que la calibración es **requisito previo** del ajuste, y que tras ajustar hay que **volver a calibrar**.
- **La balanza analítica es clase I (exactitud especial).** Las cuatro clases: I especial, II fina, III media, IIII ordinaria.
- **d ≠ e.** *d* es lo que la balanza muestra; *e* es el escalón con el que se la evalúa metrológicamente. Ambos toman valores 1, 2 o 5 × 10^k.
- **Verificación periódica de los IPFNA: cada dos años** (Orden ICT/155/2020, anexo I), y sólo si el uso entra en el artículo 8.1 de la Ley 32/2014.
- **Pesas: OIML R 111-1:2004**, nueve clases de E1 a M3; E2 y F1 son las de balanza analítica.
- **Sobresaturación relativa alta → precipitado coloidal** (malo). Baja → cristalino (bueno). Las cuatro maniobras: diluido, lento, caliente, con pH controlado.
- **Digestión** = maduración de Ostwald: precipitado más grueso y más puro.
- **Lavar con electrolito volátil, nunca con agua pura**, para evitar la **peptización**.
- **El crisol caliente pesa de menos** por convección: siempre se enfría en desecador.
- **Masa constante** = dos pesadas consecutivas dentro de la tolerancia del método, no una sola pesada.
- **Coprecipitación y postprecipitación dan resultados por exceso; peptización y pérdidas por solubilidad, por defecto.**
- **Volatilización directa** (se pesa lo que se va) frente a **indirecta** (se pesa por diferencia lo que queda). Casi todo en la práctica es indirecto.
- **Factor gravimétrico**: cuidado con la estequiometría (2 · M(Fe) en Fe₂O₃).
- **105 °C** es la temperatura de secado que comparten UNE-EN 872 y UNE-EN 12880. Es un número que cae.
- **La gravimetría es un método absoluto**: no necesita recta de calibrado con patrones del analito.

## Reparto acordado con el tema 22

Los dos temas comparten enunciado casi palabra por palabra («Concepto, material y operaciones… Manejo y calibración de… Clases de…»). Para que no se dupliquen ni se dejen huecos, en este apunte se ha seguido este reparto:

| Contenido | Va en el 21 | Va en el 22 |
| --- | --- | --- |
| Vocabulario metrológico (VIM: calibrar / verificar / ajustar) | **Se desarrolla aquí**, completo | **Recordatorio breve** con referencia cruzada a este tema, no repetición |
| Trazabilidad y UNE-EN ISO/IEC 17025 | Se introduce aquí | Se reutiliza |
| Material de vidrio **no aforado** (vaso, embudo, probeta) | **Aquí** | — |
| Material **aforado** de clase A y B (matraz aforado, pipeta aforada) y su calibración por pesada | — | **Allí** |
| **Bureta**: partes, enrase, lectura del menisco, error de paralaje, tolerancias | — | **Allí, entera.** Este tema no usa ninguna figura de bureta |
| Erlenmeyer | — | **Allí** (matraz de valoración) |
| Balanza analítica | **Aquí** | Se usa allí como instrumento de la calibración del material volumétrico |
| Sólidos en suspensión como **técnica gravimétrica** | **Aquí** | — |
| Sólidos en suspensión como **parámetro de calidad del agua** | — | Tema **34** (así lo marca `ExamenesAnteriores/ANALISIS.md`) |
| Determinación de cloruro **por gravimetría** (AgCl) | **Aquí** | — |
| Determinación de cloruro **por volumetría** (Mohr, AgNO₃) | — | **Allí**, y es núcleo repetido (1233 #2, 1246 #28) |

**Puente natural entre los dos temas:** la calibración del material volumétrico del tema 22 **se hace por gravimetría** — se pesa el agua contenida o vertida y se convierte a volumen con la densidad a la temperatura de trabajo. Es decir, el tema 21 es la herramienta con la que se resuelve una parte del 22. Conviene decirlo explícitamente en los dos apuntes.

---

## Fuentes y verificación

- **Normas y guías aplicadas:** VIM (JCGM 200:2012, ed. española del CEM, 2012); Ley 32/2014 de Metrología; RD 244/2016 (anexo VI); Directiva 2014/31/UE; Orden ICT/155/2020 (anexo I); UNE-EN 45501:2016; EURAMET cg-18 v4.0 (2015); OIML R 111-1:2004 con enmienda de 2025; UNE-EN 872:2006; UNE-EN 12880:2001; UNE-EN 12879:2001; UNE-EN 12341:2024; RD 102/2011 modificado por RD 39/2017.
- **Bibliografía técnica** (apartados 2.1, 2.3 y 2.5): Skoog, West, Holler y Crouch, «Fundamentos de Química Analítica»; Harris, «Análisis Químico Cuantitativo»; Mendham y otros, «Vogel. Análisis Químico Cuantitativo».
- **Versiones:** Orden ICT/155/2020 en texto consolidado a **03/10/2025**. EURAMET cg-18 en **versión 4.0, 11/2015**, comprobada en el catálogo de guías de EURAMET el 02/09/2026. UNE-EN 12341 en su edición **2024**, que anula la de 2015.
- **Fecha de verificación:** 02/09/2026.

### Dudas y limitaciones declaradas

Este tema **no aparece en ninguno de los seis cuestionarios analizados** con pregunta identificable de gravimetría o de balanzas, así que el nivel de detalle es una estimación, no una calibración sobre precedentes. Además:

1. **La tabla numérica de clases de exactitud no se ha podido verificar.** Sé que está en el punto 2.1 de los requisitos metrológicos del apéndice I del anexo VI del RD 244/2016 (tabla 2), y que reproduce la de la Directiva 2014/31/UE. Los PDF del BOE y del DOUE no han podido extraerse en esta sesión. **Lo que sí está verificado**: los nombres de las cuatro clases (especial, fina, media, ordinaria), la existencia de *d* y *e*, y que ambos toman valores 1, 2 o 5 × 10^k. **Lo que NO he escrito por no poder verificarlo**: los valores concretos de *e*, de Min y del número de escalones *n* por clase, y la tabla de errores máximos permitidos por tramos de carga. Si quieres ese detalle, hay que consultar el anexo VI en papel o la UNE-EN 45501.

2. **La regla «EMP en servicio = el doble que en verificación primitiva» queda marcada como *sin confirmación normativa*.** Es habitual en metrología legal y aparece en material de estudio, pero no la he localizado en el texto del RD 244/2016 ni de la Orden ICT/155/2020. **No se afirma en el desarrollo**: va señalada como tal en el apartado 2.4.7, para que se reconozca si aparece en otra fuente sin darla por buena. No se ha generado ninguna tarjeta ni pregunta sobre ella.

3. **Las normas UNE citadas son de pago.** Se ha verificado en catálogo su título exacto, año de edición y vigencia, y las condiciones operativas proceden de fuentes secundarias o de documentos oficiales que las reproducen (es el caso del documento LNR 02/2015 del ISCIII para la UNE-EN 12341). No se ha leído el texto íntegro de ninguna de ellas.

4. **Los 550 °C de la UNE-EN 12879 vienen de fuente secundaria**, no del texto de la norma. Por eso van en la tabla con «≈» y con esta advertencia. Los 105 °C de la UNE-EN 872 y de la UNE-EN 12880 sí están confirmados en varias fuentes independientes.

5. **Discordancia real de vigencias en la UNE-EN 12341.** La edición vigente en AENOR es la **2024** (adopta la EN 12341:2023), pero el **RD 102/2011, modificado por el RD 39/2017, sigue remitiendo a la edición 2015**. Las condiciones del cuarto de pesadas que da la tabla operativa (19-21 °C, 45-50 % HR, criterios de 40 y 60 µg) están verificadas **para la edición 2015**; no he podido comprobar si la de 2024 las mantiene. Si en el examen preguntan «norma de referencia de PM10», la respuesta segura sigue siendo la que cita el Real Decreto.

6. **Los apartados 2.1, 2.3 y 2.5 no tienen norma detrás.** Son doctrina de química analítica y están redactados según el consenso de los tres manuales citados, que **no he podido consultar directamente en esta sesión** (no hay edición en línea de acceso libre). Es contenido estándar y estable, pero conviene contrastarlo con el libro si lo tienes a mano, sobre todo la clasificación de la coprecipitación y la nomenclatura de las bandas de papel de filtro, que varía algo entre autores y entre fabricantes.

7. **Valores típicos, no normativos.** Las resoluciones de la tabla 2.4.1 (0,1 mg para la analítica, 0,01 mg para la semimicro, 1 µg para la micro) son valores comerciales habituales, no cifras fijadas por ninguna norma. La norma clasifica por clase de exactitud, no por legibilidad.
