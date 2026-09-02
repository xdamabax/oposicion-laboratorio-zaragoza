---
tema: 23
titulo: "Potenciometría: Concepto y fundamento teórico. Medida de pH. Calibración de pHímetros. Volumetrías con indicación potenciométrica: punto de equivalencia. Valoradores automáticos."
parte: Parte segunda
estado: borrador
verificado: 2026-09-03
fuentes:
  - "UNE-EN ISO 10523:2012, Calidad del agua. Determinación del pH (ISO 10523:2008). Publicada el 19/09/2012, vigente. Versión oficial en español de la EN ISO 10523:2012. — https://www.une.org/encuentra-tu-norma/busca-tu-norma/norma?c=N0049896"
  - "CEM. Procedimiento QU-003 para la calibración de pHmetros digitales. Centro Español de Metrología (Ministerio de Industria). Edición original 2008; edición digital 1, actualizada el 09/02/2022. NIPO 706-08-007-9. — https://www.cem.es/sites/default/files/qu-003_digital_0.pdf"
  - "Real Decreto 3/2023, de 10 de enero, por el que se establecen los criterios técnico-sanitarios de la calidad del agua de consumo, su control y suministro (BOE-A-2023-628), texto consolidado. Anexo I, parte C (valor paramétrico del pH); anexo III, parte B.4 (aparatos in situ) y parte D, tabla 15 (incertidumbre de medida). — https://www.boe.es/buscar/act.php?id=BOE-A-2023-628"
  - "IUPAC. R. P. Buck y otros, «Measurement of pH. Definition, standards, and procedures (IUPAC Recommendations 2002)», Pure and Applied Chemistry 74 (11), 2169-2200, 2002. Consultado el borrador de recomendaciones provisionales de 06/07/2001 (ver «Dudas»). — https://publications.iupac.org/pac/74/11/2169/index.html"
  - "UNE-EN ISO 9963-1:1996, Calidad del agua. Determinación de la alcalinidad. Parte 1: alcalinidad total y compuesta. Ya citada en el tema 22."
  - "ISO 760:1978, Determination of water. Karl Fischer method (General method). Recoge las dos variantes de detección del punto final, visual y electrométrica."
  - "DIN 19266 (disoluciones tampón de referencia para la calibración de equipos de medida de pH) y DIN 19267 (disoluciones tampón técnicas). Normas alemanas; sin adopción UNE confirmada (ver «Dudas»)."
  - "VIM. Vocabulario Internacional de Metrología (JCGM 200:2012). Es la referencia [1] del propio procedimiento QU-003. Se aplica el desarrollo hecho en el tema 21."
  - "ULPGC, material docente «Métodos potenciométricos» (electrodos de referencia e indicadores, errores del electrodo de vidrio). — http://www2.ulpgc.es/hege/almacen/download/38/38799/metodos_potenciometricos.pdf"
  - "LibreTexts en español, «Análisis Instrumental», cap. 23.1 Electrodos de referencia (potenciales del calomelanos y del Ag/AgCl a 25 °C), traducción de D. Harvey, Analytical Chemistry 2.1."
  - "DOCUMENTACIÓN DE FABRICANTE (criterios prácticos, no normativos): Hach, «pH Determination in Water, based on ISO standard 10523:2008» (DOC316.52.93083) y «Electrochemistry. Theory and Practice» (DOC182.53.90629); Metrohm, catálogo de valoradores Titrando (89045001ES)."
  - "BIBLIOGRAFÍA TÉCNICA (no consultable en línea): Skoog, West, Holler y Crouch, «Fundamentos de Química Analítica»; Harris, «Análisis Químico Cuantitativo». Son la referencia de los apartados 2.1 y 2.4."
---

> **Aviso de fuentes.** Este tema es, de los tres seguidos (21, 22 y 23), **el que mejor cubierto está por fuente oficial española**: el enunciado dice literalmente «Calibración de pHímetros» y el **Centro Español de Metrología** publica un procedimiento con ese objeto exacto, el **QU-003**, gratuito y en español. Todo el apartado 2.3 sale de ahí. Lo que no tiene norma detrás —qué es un electrodo de referencia, cómo se localiza el punto de equivalencia— es doctrina de química analítica y va marcado como tal.

> **Reparto con el tema 24.** El 24 es «Electrodos selectivos: clases, fundamentos y métodos de cálculo», más conductividad y oxígeno disuelto. El **electrodo de vidrio es, técnicamente, un electrodo selectivo de H⁺**, pero se desarrolla **aquí** porque el enunciado del 23 pide «Medida de pH». Lo que **no** se desarrolla aquí: las demás clases de electrodo selectivo (membrana líquida, cristalina, de gases), el coeficiente de selectividad, el método de adiciones patrón, la conductividad y la medida electroquímica del oxígeno.

> **Reparto con los temas 33 a 35.** El **pH como parámetro de calidad** del agua —valor paramétrico, frecuencia de control, qué hacer si se incumple— es del **tema 33**. Aquí sólo se desarrolla **la técnica**, y del Real Decreto 3/2023 se toma únicamente lo que exige **al método y al aparato** (anexo III). Mismo criterio que se aplicó en el 21, el 22, el 34 y el 35.

## 1. Encuadre

La **potenciometría** mide la diferencia de potencial de una celda electroquímica **sin que circule corriente apreciable**, y de esa medida deduce la actividad de una especie en disolución. No consume la muestra, no la destruye y el instrumento es barato: por eso la medida de pH, que es su aplicación estrella, es la determinación más frecuente de cualquier laboratorio de aguas.

El tema recorre la técnica entera en cuatro escalones: el **fundamento** (2.1), su aplicación al **pH** (2.2), la **calibración** del instrumento (2.3) y su uso como **detector del punto final** de una volumetría (2.4), manual o automatizada (2.5).

| Qué regula | Norma o referencia | Lógica |
| --- | --- | --- |
| Qué es la potenciometría, los electrodos, el punto de equivalencia | Skoog, Harris; material docente universitario | **Doctrina técnica**, no norma |
| Definición de pH, patrones y escala | **IUPAC 2002**; **DIN 19266 / 19267** | Escala y patrones |
| Cómo se mide el pH en agua | **UNE-EN ISO 10523:2012** | Ensayo normalizado |
| **Cómo se calibra un pHímetro** | **CEM, procedimiento QU-003** | **Procedimiento oficial español** |
| Qué se exige al aparato y al método en agua de consumo | **RD 3/2023**, anexo III | Norma con rango de ley |
| Vocabulario: calibrar, verificar, ajustar | **VIM** — **desarrollado en el tema 21** | Metrología general |
| Volumetría con punto final a pH fijo | **UNE-EN ISO 9963-1:1996** | Ensayo normalizado |

## 2. Desarrollo

### 2.1. Concepto y fundamento teórico

#### La celda potenciométrica

Para hacer una potenciometría hacen falta **tres cosas**:

1. Un **electrodo de referencia**, de potencial constante y conocido.
2. Un **electrodo indicador**, cuyo potencial **sí** varía con la concentración (mejor dicho, con la **actividad**) de la especie que se mide.
3. Un **medidor de potencial** de alta impedancia de entrada.

El potencial que se lee es la diferencia entre los dos, más un término parásito:

> **E(celda) = E(indicador) − E(referencia) + E(j)**

**E(j)** es el **potencial de unión líquida**: aparece siempre que dos disoluciones distintas están en contacto, porque los iones difunden a velocidades diferentes. **No se puede medir por separado**, y es uno de los límites de exactitud de toda medida de pH. Se **minimiza** con un puente de **KCl concentrado**, porque el K⁺ y el Cl⁻ tienen movilidades casi iguales y difunden a la vez.

#### La ecuación de Nernst

Es el fundamento de todo el tema. Para un electrodo indicador que responde a un ion de carga *n*:

> **E = K ± (2,303 · R · T / n · F) · log a**

donde *R* es la constante de los gases, *F* la de Faraday y *T* la temperatura absoluta. El factor entre paréntesis es la **pendiente**, y es lo único que hay que retener con números:

| Temperatura | Pendiente teórica (n = 1) |
| --- | --- |
| 0 °C | 54,20 mV por unidad de pH |
| 20 °C | 58,17 mV |
| **25 °C** | **59,16 mV** |
| 30 °C | 60,15 mV |
| 50 °C | 64,12 mV |

**59,16 mV por unidad de pH a 25 °C** es la cifra que hay que saber de memoria. Y hay que ver **que la pendiente crece con la temperatura**: no es una constante, y de ahí que los pHímetros lleven compensación térmica.

De la propia ecuación sale el **talón de Aquiles de la potenciometría directa**: un error de **1 mV** en la medida equivale a un error de 1/59,16 = 0,017 unidades logarítmicas, es decir, **casi un 4 % de error relativo** en la actividad de un ion monovalente. En medida de pH ese error es asumible (0,017 unidades); en potenciometría directa de otros iones, no tanto, y menos aún si el ion es divalente, donde el mismo milivoltio vale el doble.

#### Dos formas de usarla

| | **Potenciometría directa** | **Valoración potenciométrica** |
| --- | --- | --- |
| Qué se mide | El potencial **es** el resultado: se convierte en concentración con una curva de calibrado | El potencial sólo sirve para **localizar el punto final** |
| De qué depende la exactitud | Del comportamiento ideal del electrodo y de la calibración | De la **forma de la curva**, no del valor absoluto del potencial |
| Debilidad | Muy sensible a la deriva y al potencial de unión líquida | Más lenta; hace falta hacer la valoración entera |
| Ejemplo | **Medida de pH** | Alcalinidad, cloruros en agua turbia |

Que la valoración sea **inmune al valor absoluto** del potencial es la razón de fondo de su exactitud: da igual que el electrodo esté descalibrado unos milivoltios, porque lo que se busca es **dónde** salta, no **cuánto** vale.

#### Electrodos de referencia

Debe dar un potencial **constante, reproducible y conocido**, insensible a la composición de la muestra, y ser robusto y fácil de usar.

| Electrodo | Semirreacción | Potencial a 25 °C (frente al EEH) |
| --- | --- | --- |
| **Estándar de hidrógeno (EEH)** | 2 H⁺ + 2 e⁻ ⇌ H₂ | **0,000 V** por convenio, a cualquier temperatura. Referencia primaria; **no se usa en rutina** |
| **Calomelanos saturado (ECS)** | Hg₂Cl₂ + 2 e⁻ ⇌ 2 Hg + 2 Cl⁻ | **+0,244 V** (con KCl saturado). Con KCl 1 M, +0,280 V; con KCl 0,1 M, +0,336 V |
| **Plata / cloruro de plata** | AgCl + e⁻ ⇌ Ag + Cl⁻ | **+0,197 V** (KCl saturado); **+0,205 V** con KCl 3,5 M |

Dos consecuencias que se preguntan:

- El potencial de ambos depende de la **concentración de cloruro**: E = E° − 0,0592 · log[Cl⁻]. Por eso el electrolito de relleno es parte del instrumento y **no se puede cambiar por otro**.
- El **Ag/AgCl ha desplazado al de calomelanos** porque **no lleva mercurio** y aguanta mejor las temperaturas altas. El QU-003 lo dice así: los más utilizados son el de calomelanos y «el de plata (plata/cloruro de plata), más recientemente».

#### Electrodos indicadores

| Clase | Cómo responde | Ejemplos |
| --- | --- | --- |
| **Metálicos de primera especie** | Un metal en equilibrio con **su propio catión** | Ag/Ag⁺, Cu/Cu²⁺ |
| **Metálicos de segunda especie** | Metal recubierto de una **sal poco soluble**: responde al **anión** | **Ag/AgCl para medir Cl⁻** |
| **Redox inertes** | No participan: sólo ceden electrones al par redox de la disolución | **Platino**, oro |
| **De membrana** | El potencial nace en una **membrana** que separa dos disoluciones: transportan **iones**, no electrones | **Electrodo de vidrio** (pH); los demás, **tema 24** |

La diferencia de fondo entre los dos últimos grupos: **los metálicos transfieren electrones y los de membrana transfieren iones**.

Para medir el pH existen además otros dos electrodos indicadores, hoy históricos, que el QU-003 sí menciona y conviene reconocer:

- **Electrodo de hidrógeno:** una burbuja de H₂ sobre platino. Es el **patrón** de la medida de pH, pero es incómodo y frágil.
- **Electrodo de quinhidrona:** oro o platino en disolución saturada de quinhidrona (mezcla equimolecular de benzoquinona e hidroquinona), que forma un par redox reversible con el H⁺.

### 2.2. Medida de pH

#### La definición, y por qué obliga a calibrar

El pH se define como **menos el logaritmo decimal de la actividad del ion hidrógeno**:

> **pH = − log a(H⁺)**

Y aquí está la sutileza que da sentido al resto del tema: **la actividad de un ion aislado no es medible** por termodinámica, porque no se puede añadir un catión a una disolución sin su anión. El pH es, por tanto, una **magnitud convencional**, definida por un procedimiento acordado:

1. El **método primario** es la **celda de Harned**: una celda **sin unión líquida** (electrodo de hidrógeno y electrodo de Ag/AgCl en la misma disolución), de la que se obtiene el pH de los **patrones primarios** aplicando el convenio de Bates-Guggenheim.
2. El **pH de una muestra** se define **por comparación** con esos patrones, en la llamada escala operativa:

> **pH(X) = pH(S) − [E(X) − E(S)] / k′**

donde *k′* es la **pendiente práctica** del electrodo, obtenida con dos patrones.

La consecuencia práctica es la que hay que llevarse: **calibrar no es un trámite previo a la medida, es parte de la definición de la medida**. Un pHímetro sin calibrar no da un pH «poco exacto»: no da un pH.

#### Los patrones de pH

Los **patrones primarios** de IUPAC, con su valor a 25 °C:

| Patrón primario | pH a 25 °C |
| --- | --- |
| Hidrogenotartrato de potasio (saturado a 25 °C) | 3,557 |
| Dihidrogenocitrato de potasio 0,05 mol/kg | 3,776 |
| **Hidrogenoftalato de potasio 0,05 mol/kg** | **4,005** |
| **Fosfatos 0,025 + 0,025 mol/kg** (Na₂HPO₄ + KH₂PO₄) | **6,865** |
| Fosfatos 0,03043 + 0,008695 mol/kg | 7,413 |
| **Tetraborato disódico (bórax) 0,01 mol/kg** | **9,180** |
| Hidrogenocarbonato + carbonato de sodio 0,025 + 0,025 mol/kg | 10,012 |

En el laboratorio no se usan éstos, sino **disoluciones tampón comerciales certificadas** (los clásicos **4,01 / 7,00 / 10,01**, o 9,18 de bórax), trazables a los patrones primarios. Lo que hay que saber de ellas:

- **Llevan certificado**, con su valor, su **incertidumbre** y su **temperatura de referencia** (20 o 25 °C).
- **Su pH cambia con la temperatura**, y no poco: el tetraborato pasa de **9,464 a 0 °C** a **9,011 a 50 °C**; el ftalato apenas se mueve (4,000 → 4,050). El certificado trae la tabla; los pHímetros modernos la llevan grabada.
- Los **alcalinos se estropean con el CO₂ del aire**: son los primeros sospechosos de una calibración rara.
- Una vez usada, la porción de tampón **no se devuelve al frasco**. Lo ideal es **monodosis**.

#### El electrodo de vidrio

![Electrodo de vidrio combinado, en corte: las dos referencias de Ag/AgCl, la disolución interna, el electrolito y el diafragma](esquema:electrodo-vidrio)

Un electrodo **combinado** reúne en un solo cuerpo el electrodo indicador y el de referencia:

- Una **membrana de vidrio** especial (silicato con Li, Ba…), muy fina, en forma de **bulbo** en la punta.
- Dentro del bulbo, la **disolución interna tamponada** (típicamente KCl a pH 7) y el **hilo de Ag/AgCl** que hace de **referencia interna**.
- Alrededor, el **electrolito de referencia** (KCl 3 M o saturado, a veces saturado también en AgCl) con el hilo de **referencia externa**, que contacta con la muestra por un **diafragma** (la unión líquida): cerámico, de fibra, de manguito…
- Un **orificio de llenado**, que **hay que destapar al medir** para que el electrolito fluya hacia fuera.

**Cómo funciona.** El vidrio, hidratado, forma en ambas caras una **capa de gel** en la que los H⁺ de la disolución se intercambian con los cationes del vidrio. Como la cara interna ve un pH fijo y la externa ve el de la muestra, **la diferencia de actividades genera el potencial de membrana**, proporcional al pH. **El electrodo no transporta electrones a través del vidrio: intercambia iones en sus dos superficies.**

**Errores propios del electrodo de vidrio** —de lo más preguntable del tema:

| Error | Cuándo | En qué sentido falla |
| --- | --- | --- |
| **Error alcalino** (o **error de sodio**) | pH alto, típicamente **> 12**, y en general con mucho Na⁺ | El electrodo responde también al **Na⁺**: da un pH **más bajo** que el real (**error negativo**) |
| **Error ácido** | Disoluciones muy ácidas, por debajo de pH ≈ 0,5 | Da un pH **más alto** que el real (**error positivo**); se atribuye a la reducción de la capa hidratada |
| **Potencial de asimetría** | Siempre | Con la misma disolución a ambos lados, el potencial **no es cero**; y **deriva** con el uso y la edad del electrodo |
| **Deshidratación** de la membrana | Electrodo guardado en seco o en agua desionizada | Respuesta lenta y errática hasta que se rehidrata |
| **Diafragma obstruido** | Muestras con proteínas, grasas, precipitados | Lecturas inestables o que no llegan a estabilizarse |

El **error alcalino** se corrige en parte con **vidrios de litio y bario**, que amplían el intervalo lineal. Y el **potencial de asimetría** es justamente lo que corrige el **desplazamiento (offset)** de la calibración.

**Manejo y conservación** (criterios de fabricante, coincidentes):

- Se conserva en **KCl 3 M o saturado**, o en la disolución de conservación del fabricante; a corto plazo vale tampón pH 4 o 7.
- **Nunca en agua desionizada**: el agua lava el electrolito y arruina la referencia. Es el error de manejo más repetido.
- Si se ha secado, se **rehidrata** un par de horas; la respuesta plena tarda hasta 24 h.
- Se **enjuaga** entre disoluciones con agua desionizada y **se seca dando toques con papel**, sin frotar (frotar carga el vidrio estáticamente).
- **Burbujas** en el electrolito interno: se sacuden hacia arriba, como un termómetro clínico.
- **Cable y conector limpios y secos**: las corrientes que circulan son minúsculas.

#### El instrumento

![pHímetro: medidor de alta impedancia, electrodo combinado y vaso con el tampón o la muestra](esquema:phmetro)

El **pHímetro** es, en la definición del propio QU-003, *«un instrumento potenciométrico que incluye, dentro de su sistema de medida, un electrodo de referencia, un electrodo de respuesta al pH y un instrumento de medida de potencial»*.

El medidor tiene que ser de **altísima impedancia de entrada** porque la membrana de vidrio tiene una resistencia interna del orden de cientos de megaohmios: un voltímetro corriente cargaría la celda y falsearía la lectura.

**Compensación de temperatura (ATC).** Con una sonda de temperatura, el aparato corrige **la pendiente de Nernst** a la temperatura de trabajo. Cuidado con la trampa clásica: **la ATC corrige el instrumento, no la muestra**. El pH real de una disolución **también** cambia con la temperatura por razones químicas (el equilibrio se desplaza), y eso no lo compensa nadie: por eso **todo resultado de pH se informa con la temperatura a la que se midió**.

#### La medida en agua: UNE-EN ISO 10523:2012

| Aspecto | Lo que fija la norma |
| --- | --- |
| Aguas cubiertas | Lluvia, de consumo, minerales, de baño, superficiales, subterráneas, residuales urbanas e industriales y lodos líquidos |
| Intervalo | **pH 2 a 12** |
| Fuerza iónica | **I < 0,3 mol/kg** (equivale a conductividad **< 2 000 mS/m a 25 °C**) |
| Temperatura | **0 °C a 50 °C** |
| Electrodo | **Sólo el electrodo de vidrio**, «por su gran importancia práctica, universalidad y exactitud» |
| Resolución del aparato | **0,01 unidades de pH** o mejor **†** |
| Calibración | **Dos puntos**, con tampones que **encuadren** el pH esperado de la muestra **†** |
| Agitación | Se **agita unos segundos** y se mide **sin agitar** **†** |

> **†** Estas tres filas **no proceden del texto de la norma**, que es de pago y no he podido leer, sino de **documentación de fabricante que declara basarse en ella**. Son datos muy probables y útiles para estudiar, pero **no son citables como criterio normativo**. Mismo tratamiento que las tolerancias de bureta del tema 22. Ver duda 3.

### 2.3. Calibración de pHímetros

Todo este apartado sigue el **procedimiento QU-003 del Centro Español de Metrología**, cuyo alcance es la calibración de pHímetros digitales con campo de medida de **0 a 14 unidades de pH**.

#### Primero, el vocabulario (tema 21)

El QU-003 abre con las definiciones del **VIM**, las mismas del tema 21, y con una advertencia que es puro material de examen:

> Conviene no confundir la calibración con el **ajuste** de un sistema de medida, «a menudo llamado incorrectamente **autocalibración**».

Traducido a lo que se hace cada mañana en el laboratorio:

| Operación | Qué es | En el pHímetro |
| --- | --- | --- |
| **Ajuste** | Modificar el instrumento para que indique lo que debe | **Lo que hacen los botones con los tampones 4 y 7.** El aparato lo llama «calibrar»; **no lo es** |
| **Calibración** | Comparar con patrones y **cuantificar el error y su incertidumbre**. **No toca el aparato** | Leer los cinco tampones certificados y calcular los errores |
| **Verificación** | Declarar conforme o no conforme frente a una tolerancia | Comprobar que el error entra en el criterio del laboratorio |

Y el orden importa: **la calibración es un requisito para el ajuste**, y **después de ajustar hay que volver a calibrar**.

#### Equipos y materiales (QU-003, 5.1)

- **Disoluciones tampón con el pH certificado**, con trazabilidad e incertidumbre, de valores nominales **pH 2, pH 4, pH 7, pH 9 y pH 12**.
- **Termómetro calibrado**, con resolución de **0,1 °C**, en el intervalo de **15 a 30 °C**.
- **Agua desionizada** en frasco lavador y **papel absorbente**.
- **Vasos de precipitados de 50 a 100 mL**.

#### Operaciones previas (5.2)

1. **Identificar el instrumento** sin ambigüedad: marca, modelo, número de serie y código del laboratorio.
2. **Leer el manual**, por si trae instrucciones propias de calibración.
3. **Calentar el pHímetro** y dejarlo estabilizar el tiempo que diga el manual.
4. Poner el tampón en un **vaso limpio**, en cantidad suficiente para cubrir la parte activa del electrodo, **evitando burbujas**.
5. **Acondicionar el tampón a la temperatura de su certificado** (suele ser 20 o 25 °C). Si no es posible, **aplicar la corrección del certificado**.
6. **Medir y anotar la temperatura** del tampón con el termómetro.
7. **Revisar los electrodos**: limpios, sin depósitos por dentro ni por fuera.
8. El tampón usado **no se guarda**.

La calibración se hace **en condiciones ambientales**, recomendando **20 °C o 25 °C** porque son las temperaturas a las que suelen certificarse los tampones.

#### La secuencia (5.3.1)

> **Lectura inicial → Ajuste → Lectura después del ajuste → Calibración**

- La **lectura inicial** se hace con los tampones **pH 4 y pH 7**, y **sus datos se conservan**: son los que dicen cómo llegó el aparato.
- El **ajuste** sólo se hace **si el usuario lo autoriza**.
- Después se releen **4 y 7** para comprobar.

Ese «conservar la lectura inicial» tiene sentido metrológico: si se ajusta primero y no se anota nada, se pierde la única prueba de si el aparato estaba derivando.

#### Los puntos de calibración (5.3.2)

Se calibra **todo el campo de medida** con los cinco tampones: **pH 2, 4, 7, 9 y 12**. Para cada uno:

1. Vaso limpio y seco con el tampón; se introducen electrodo y termómetro; **se lee y se anota la temperatura**.
2. Se retiran, se **aclaran con abundante agua desionizada** y se elimina el exceso con **papel absorbente**.
3. Se repite con el siguiente tampón.

**Tres lecturas no consecutivas por tampón**, y se toma **la media de las tres**.

Y una regla de rutina diaria que conviene retener literal:

> Con independencia de la calibración periódica, **antes de cada utilización** del pHímetro debe comprobarse su correcto funcionamiento **con los tampones pH 4 y 7**.

#### Tratamiento de datos y criterio de aceptación (5.4 y 6.2)

Con las medias corregidas por temperatura se calcula la **recta de regresión** (y = a + b·x) por mínimos cuadrados, y su **coeficiente de correlación**, que **debe quedar entre 0,995 y 1,005**, salvo que el manual del aparato fije otros límites.

Si se sale de ese intervalo: **nuevo ajuste con los tampones 4 y 7 y nueva calibración**. Se registran las lecturas **antes y después** del ajuste, la temperatura de los tampones y la ambiente.

*(El criterio «0,995 a 1,005» está tomado literalmente del procedimiento. Ver «Dudas»: un coeficiente de correlación no puede pasar de 1, así que el intervalo se comporta en la práctica como un criterio sobre la **pendiente** de la recta.)*

#### Incertidumbre (6.1)

La magnitud de salida es el **error del pHímetro en cada punto**: la indicación menos el valor certificado del tampón. Sus componentes:

| Contribución | Cómo se calcula | Distribución |
| --- | --- | --- |
| **Repetibilidad** del pHímetro | Desviación típica de las 3 lecturas dividida por **√3** | Normal |
| **Incertidumbre del tampón** | **U(certificado) / 2**, porque el certificado se da al 95,45 % | Normal |
| **Resolución** del pHímetro | **resolución / √12** | Rectangular |
| **Influencia de la temperatura** sobre el patrón | Variación máxima del pH por el incremento de temperatura / **√12** | Rectangular |

La **incertidumbre expandida** se obtiene con **k = 2**, que corresponde a una probabilidad de cobertura del **95,45 %**. Puede tomarse como incertidumbre única para todo el campo **la mayor** de las obtenidas.

Dato práctico que da el propio procedimiento: **1 °C de diferencia de temperatura corresponde típicamente a una variación de 0,2 mV**. Si el certificado del tampón expresa así la corrección, se convierte a unidades de pH.

*(El desarrollo general de la incertidumbre y del ajuste por mínimos cuadrados es de los temas 38 y 39. Aquí sólo lo que aplica al pHímetro.)*

#### Periodicidad

La que indique el manual. Si no lo indica, y según el uso, **podría ser de seis meses** — y **el establecimiento del periodo es responsabilidad del usuario**.

#### Cuántos puntos: uno, dos o varios

Es la clasificación de IUPAC, y explica por qué el QU-003 pide cinco tampones:

| Calibración | En qué consiste | Incertidumbre alcanzable |
| --- | --- | --- |
| **De un punto** | Sólo determina el desplazamiento; hay que **suponer** la pendiente | **No es fiable**: la pendiente práctica puede ser hasta un 5 % menor que la teórica |
| **De dos puntos** («bracketing») | Dos tampones que **encuadran** el pH de la muestra; da desplazamiento **y** pendiente | **0,02 – 0,03** unidades de pH |
| **Multipunto** | Hasta **cinco** tampones y regresión lineal. Más de cinco **no aporta nada** | **0,01 – 0,03** unidades de pH |

Regla de elección: **el multipunto** cuando se quiere mínima incertidumbre en un intervalo amplio; **el de dos puntos** cuando la respuesta no es lineal en la zona de trabajo, eligiendo los tampones lo más cerca posible del pH de la muestra.

#### Los criterios que da el instrumento

Los pHímetros no informan del error punto a punto, sino de dos números:

- **Pendiente**, en mV/pH y en **porcentaje de la teórica** (59,16 mV/pH a 25 °C). Un electrodo que dé 58,78 mV/pH está al **99,3 %**.
- **Desplazamiento (offset)**, en mV: el potencial a pH 7, que idealmente sería 0 mV.

**Los intervalos de aceptación los pone el fabricante de cada electrodo, y no he localizado ningún criterio normativo que los fije.** En la documentación consultada aparecen, para un modelo concreto, una pendiente del **97 al 102 %** con **offset entre −30 y +30 mV**; en la práctica de laboratorio circula también un intervalo más ancho, del **95 al 105 %**. **Ninguna de las dos cifras se da aquí por buena:** las dos son **orientativas**. Lo que hay que retener es el criterio de fondo —**pendiente próxima a la teórica y offset pequeño**— y que el número exacto lo fija la **especificación del electrodo** que se esté usando o el **procedimiento del laboratorio**. Ver duda 5.

#### Lo que exige la ley española

Del **Real Decreto 3/2023**, en lo que toca al **método y al aparato** (el valor paramétrico es del tema 33):

- **Anexo III, parte B.4:** los aparatos con los que se hacen **controles en línea o in situ** deben estar **verificados y ajustados periódicamente**, y **documentada la última calibración realizada**.
- **Anexo III, parte D, tabla 15:** la **incertidumbre de medida** exigida para el pH es de **0,2**, y —a diferencia del resto de parámetros, que van en porcentaje del valor paramétrico— **se expresa en unidades de pH**. El criterio es para **k = 2**.
- **Anexo III, parte B.2:** los métodos deben estar **acreditados por UNE-EN ISO/IEC 17025** (tema 40), con la excepción de los parámetros de control operacional y de rutina si el laboratorio sólo hace esos dos tipos de análisis.

### 2.4. Volumetrías con indicación potenciométrica: punto de equivalencia

Es la misma volumetría del **tema 22**, con una sola diferencia: **el punto final no lo canta un indicador químico, lo canta el electrodo**.

| | Indicador químico (tema 22) | Indicación potenciométrica |
| --- | --- | --- |
| Qué se observa | Un **viraje de color** | Un **salto de potencial o de pH** |
| Muestra coloreada o turbia | **No sirve** | **Sirve igual** |
| Subjetividad | Depende del ojo del analista | **Objetiva**, queda registrada |
| Varios analitos | Un indicador por cada uno, si es que existe | **Varios puntos de inflexión en la misma curva** |
| Coste | Mínimo | Requiere instrumento |
| Tiempo | Rápida | Más lenta; se automatiza |

#### La curva y el punto de equivalencia

![Curva de valoración potenciométrica: el punto de equivalencia es el punto de inflexión de la sigmoide](esquema:curva-potenciometrica)

Al representar el potencial (o el pH) frente al volumen de valorante sale una **sigmoide**. El **punto de equivalencia** es el **punto de inflexión**, es decir, **el de máxima pendiente**.

Conviene volver sobre la distinción del tema 22, porque aquí se afina: el **punto de equivalencia** sigue siendo teórico, y lo que el instrumento localiza es el **punto de inflexión de la curva experimental**, que se toma como su mejor estimación. Cuanto **más brusco es el salto** —reacción más cuantitativa, analito más concentrado—, mejor coinciden.

#### Cómo se localiza

![Primera derivada: el punto de equivalencia es el máximo. Segunda derivada: es el corte con cero](esquema:derivadas-valoracion)

| Método | Qué se representa | Dónde está el punto de equivalencia |
| --- | --- | --- |
| **Gráfico directo** | E (o pH) frente a V | El **punto de inflexión**, a ojo o por el método de las paralelas |
| **Primera derivada** | **ΔE/ΔV** frente a V | En el **máximo** de la curva |
| **Segunda derivada** | **Δ²E/ΔV²** frente a V | En el **corte con cero**, donde cambia de signo |
| **Método de Gran** | Una función **lineal** del volumen | En el **corte de la recta con el eje de volúmenes** |

Los dos que hay que tener claros:

- La **segunda derivada** es el método **más preciso** de los tres primeros y el que usan los valoradores automáticos, porque un **corte con cero** se interpola mucho mejor que la posición de un máximo redondeado.
- El **método de Gran** tiene una ventaja distinta: **linealiza**, y por eso **no necesita medidas cerca del punto final**, que es justamente donde el potencial es más inestable y tarda más en equilibrarse.

En las derivadas, cada valor se atribuye al **punto medio del incremento** de volumen: ΔE/ΔV entre 12,00 y 12,10 mL se representa en 12,05.

#### Qué electrodo se usa en cada volumetría

| Clase de volumetría | Electrodo indicador |
| --- | --- |
| **Ácido-base** | **De vidrio** (es una curva de pH) |
| **Redox** | **Platino** (u oro): electrodo **inerte** |
| **Precipitación / argentometría** | **Plata metálica**, o electrodo selectivo de plata/sulfuro |
| **Complexometría** | Electrodo **selectivo del ion** que se valora |

Frente a cualquiera de ellos, el electrodo de referencia habitual es el de **Ag/AgCl**. En argentometría hay que evitar que el cloruro de la referencia se fugue a la muestra: se usa un electrodo de **doble unión**.

#### El ejemplo normalizado: la alcalinidad

La **UNE-EN ISO 9963-1:1996** determina la alcalinidad valorando con **ácido fuerte (HCl o H₂SO₄, 0,1 eq/L)** hasta **dos puntos finales de pH fijados de antemano**:

| Alcalinidad | Punto final | Indicador equivalente del método clásico |
| --- | --- | --- |
| **Compuesta** («p») | **pH 8,3** | Fenolftaleína |
| **Total** | **pH 4,5** | Naranja de metilo / rojo de metilo |

Y aquí está el matiz fino del apartado: esto **no es una valoración al punto de equivalencia**, sino **a un punto final prefijado**. El instrumento no busca ninguna inflexión: dosifica hasta que el pH alcanza el valor de consigna. Es lo que un valorador automático llama **modo SET**. Con 50 mL de muestra y valorante 0,1 eq/L el campo va aproximadamente de **0,4 a 20 mmol/L**; para alcalinidades bajas se usa más muestra y valorante más diluido.

*(La alcalinidad **como parámetro** es del **tema 33**. Aquí interesa sólo como ejemplo de indicación potenciométrica a punto final fijo.)*

### 2.5. Valoradores automáticos

![Valorador automático: bureta motorizada de pistón, frasco del valorante, electrodo indicador, agitador magnético y unidad de control](esquema:valorador-automatico)

Un **valorador automático** (o titulador) hace por sí solo las tres cosas que el analista hacía a mano: **dosificar** el valorante, **medir** la señal del electrodo y **calcular** el punto de equivalencia.

#### Partes

| Parte | Qué hace |
| --- | --- |
| **Bureta motorizada de pistón** | Sustituye a la bureta de vidrio. Un émbolo movido por **motor paso a paso** dosifica volúmenes muy pequeños y reproducibles. Cilindros intercambiables de **1, 2, 5, 10, 20 y 50 mL** |
| **Frasco del valorante y unidad intercambiable** | El cilindro va montado sobre el frasco del reactivo. Suele llevar un **chip de datos** con el reactivo, su **título**, la última determinación y la caducidad |
| **Vaso de valoración y agitador magnético** | Agitación **constante y reproducible**, imprescindible para que el electrodo lea el seno de la disolución y no una zona sin mezclar |
| **Electrodo indicador** (+ referencia, o combinado) y sonda de temperatura | La señal, en mV o en pH |
| **Unidad de control y software** | Registra la **curva completa**, calcula el punto de equivalencia (normalmente por la **segunda derivada**), guarda el método y el resultado |

#### Modos de valoración

Son terminología de fabricante, coincidente entre marcas y muy repetida:

| Modo | Nombre completo | Cómo dosifica |
| --- | --- | --- |
| **SET** | Valoración a **punto final** fijo | Dosifica hasta alcanzar un **valor prefijado** de pH o mV. Es el modo de la **alcalinidad a pH 8,3 y 4,5** |
| **MET** | Valoración **monotónica** al punto de equivalencia | Incrementos de volumen **iguales** durante toda la valoración. Sencilla y robusta |
| **DET** | Valoración **dinámica** al punto de equivalencia | El incremento **se adapta a la pendiente**: grande lejos del salto, pequeño cerca. Más rápida y con más puntos donde importan |
| **KFT** | **Karl Fischer**, volumétrica o culombimétrica | Determinación de agua; el punto final se detecta con un **doble electrodo de platino** |
| **MAT** | Manual | El operador manda la dosificación y el equipo sólo registra |

Entre adición y adición, el equipo espera a que la señal **se equilibre**: o un tiempo fijo, o hasta que la **deriva** (en mV por minuto) baje de un umbral. Es el equivalente automático de «esperar a que el color deje de volver».

#### Ventajas y límites

**A favor:** repetibilidad muy superior a la del ojo humano; la curva y el resultado quedan **registrados** (trazabilidad documental, que es lo que pide la ISO 17025 del tema 40); menor consumo de reactivo; y series desatendidas con cambiador de muestras.

**Pero:** el valorador **no exime de nada de lo anterior**. Sigue habiendo que **calibrar el electrodo** con tampones certificados, **factorizar el valorante** contra un patrón primario (el «título» del reactivo, tema 22) y **mantener limpio el diafragma**. Un valorador automático mal calibrado da resultados malos con muchos decimales y un certificado impreso.

## 3. Tabla operativa

| Parámetro / analito | Técnica | Norma o referencia | Unidades | Condiciones |
| --- | --- | --- | --- | --- |
| **pH** en agua | **Potenciometría directa** con electrodo de vidrio | **UNE-EN ISO 10523:2012** | Unidades de pH | Campo **2 a 12**; **I < 0,3 mol/kg** (κ < 2 000 mS/m a 25 °C); **0 a 50 °C**; sólo **electrodo de vidrio**. Resolución **0,01 †**; calibración de **dos puntos que encuadren** la muestra **†**; agitar unos segundos y **medir sin agitar †**; informar siempre la **temperatura** |
| **Calibración de un pHímetro** | Comparación con **tampones certificados** y cálculo del error | **CEM, procedimiento QU-003** | Unidades de pH | Tampones nominales **2, 4, 7, 9 y 12**; **3 lecturas no consecutivas** por tampón; termómetro de **0,1 °C**; recta de regresión con coeficiente entre **0,995 y 1,005**; **k = 2**; periodo orientativo **6 meses** |
| **Comprobación diaria** del pHímetro | Lectura de dos tampones | **CEM QU-003, 5.3.2** | — | Tampones **pH 4 y 7**, **antes de cada utilización** |
| **pH** en agua de consumo: exigencia al método | — | **RD 3/2023**, anexo III, parte D, tabla 15, y parte B.4 | Unidades de pH | Incertidumbre de medida **≤ 0,2 unidades de pH (k = 2)**; aparatos in situ **verificados y ajustados** periódicamente, con la **última calibración documentada**; método acreditado por **ISO 17025** |
| **Alcalinidad** compuesta y total | Volumetría **ácido-base** con **indicación potenciométrica a punto final fijo (SET)** | **UNE-EN ISO 9963-1:1996** | mmol/L | Valorante **HCl o H₂SO₄ 0,1 eq/L**; puntos finales **pH 8,3** (compuesta) y **pH 4,5** (total); con 50 mL de muestra, campo aproximado 0,4 a 20 mmol/L |
| **Cloruro** en muestra **coloreada o turbia** | **Argentometría con indicación potenciométrica** (electrodo de plata; referencia de **doble unión**) | Doctrina; para flujo continuo, **ISO 15682:2000** (detección fotométrica o **potenciométrica**) | mg/L | Alternativa al método de Mohr del tema 22, que necesita ver el viraje del cromato |
| **Especies redox** (p. ej. Fe(II) con dicromato) | Volumetría **redox** con indicación potenciométrica | Doctrina | mg/L o meq/L | Electrodo indicador **inerte de platino** frente a referencia de Ag/AgCl; punto de equivalencia por la **segunda derivada** |
| **Agua** en un producto sólido o líquido | **Karl Fischer** en valorador automático (modo **KFT**) | **ISO 760:1978** | mg/kg o % | Detección **electrométrica** del punto final con **doble electrodo de platino** |
| **Cualquier volumetría** con salto de potencial | Valoración potenciométrica automática, modo **DET** o **MET** | Doctrina y documentación de fabricante | Según el analito | Bureta de pistón, agitación magnética, criterio de **deriva** entre adiciones; el equipo calcula el punto de equivalencia |

> **†** Práctica de fabricante documentada como basada en la UNE-EN ISO 10523, **no citable como criterio normativo** (duda 3).

## 4. Puntos críticos para el examen

- **Potenciometría = medida de potencial a intensidad nula.** Hacen falta **electrodo de referencia + electrodo indicador + medidor de potencial**.
- **Pendiente de Nernst a 25 °C: 59,16 mV por unidad de pH.** Crece con la temperatura (58,17 a 20 °C; 60,15 a 30 °C).
- **El pH se define sobre la ACTIVIDAD del H⁺**, no sobre la concentración: pH = −log a(H⁺). Y como la actividad de un ion aislado no es medible, **el pH es una magnitud convencional definida por comparación con patrones**. Por eso **calibrar es parte de la medida**.
- **Patrones primarios de IUPAC a 25 °C:** ftalato **4,005**, fosfatos **6,865**, bórax **9,180**. Los de uso diario son 4,01 / 7,00 / 10,01.
- **El pH del tampón cambia con la temperatura**, y el bórax mucho (9,46 a 0 °C → 9,01 a 50 °C). Los **tampones alcalinos se contaminan con el CO₂** del aire.
- **Electrodos de referencia:** calomelanos saturado **+0,244 V**; Ag/AgCl saturado **+0,197 V**. El EEH vale **0,000 V por convenio**. El Ag/AgCl ha desplazado al calomelanos por **no llevar mercurio**.
- **El electrodo de vidrio intercambia iones, no electrones**, en la capa de gel hidratada de sus dos caras.
- **Error alcalino (o de sodio): a pH alto el electrodo responde también al Na⁺ y da un pH MÁS BAJO que el real.** El error ácido, por debajo de pH ≈ 0,5, da un pH **más alto**. Son de signo contrario.
- **Potencial de asimetría:** con la misma disolución a los dos lados el potencial no es cero, y deriva. Es lo que corrige el **offset** de la calibración.
- **El electrodo NUNCA se guarda en agua desionizada**: en KCl 3 M o saturado.
- **El medidor debe ser de alta impedancia** porque la membrana de vidrio tiene cientos de MΩ de resistencia.
- **La ATC corrige la pendiente del instrumento, no el pH real de la muestra**: por eso el resultado se informa **con su temperatura**.
- **UNE-EN ISO 10523:** pH **2 a 12**, **0 a 50 °C**, fuerza iónica **< 0,3 mol/kg** (κ < 2 000 mS/m a 25 °C) y **sólo electrodo de vidrio**. *(La resolución de 0,01, la calibración de dos puntos que encuadren la muestra y el «agitar antes, medir sin agitar» son **práctica de fabricante, no criterio normativo citable**: ver duda 3.)*
- **Lo que hacen los botones del pHímetro con los tampones 4 y 7 es un AJUSTE, no una calibración.** El VIM y el QU-003 avisan de que llamarlo «autocalibración» es incorrecto. **Calibrar es un requisito para ajustar, y después de ajustar hay que volver a calibrar.**
- **QU-003, secuencia:** lectura inicial (tampones 4 y 7) → ajuste → lectura después del ajuste → calibración con **pH 2, 4, 7, 9 y 12**, **tres lecturas no consecutivas** de cada uno.
- **Criterio del QU-003:** el coeficiente de la recta de regresión debe quedar **entre 0,995 y 1,005**; si no, se reajusta con 4 y 7 y se vuelve a calibrar. Periodo orientativo, **seis meses**, y lo fija **el usuario**.
- **Antes de cada uso** hay que comprobar el aparato con los tampones **4 y 7**.
- **Incertidumbre (k = 2, 95,45 %)** con cuatro componentes: repetibilidad (s/√3), tampón (U/2), resolución (res/√12) y temperatura (variación máxima/√12).
- **Una calibración de un solo punto no vale**: no determina pendiente y desplazamiento a la vez. Dos puntos → 0,02-0,03 de incertidumbre; multipunto (hasta **cinco**, más no aporta) → 0,01-0,03.
- **Pendiente próxima a la teórica y offset pequeño**: ése es el criterio de aceptación de una calibración. **No hay una cifra normativa localizada**: circulan el 97-102 % y el 95-105 % de los 59,16 mV/pH, y offsets del orden de ±30 mV, pero **cualquier cifra concreta es orientativa** y la fija el fabricante del electrodo o el laboratorio (duda 5).
- **RD 3/2023:** incertidumbre exigida al pH, **0,2 unidades de pH**, y es el único parámetro cuya incertidumbre **no se expresa en porcentaje**. Los aparatos in situ, **verificados y ajustados**, con la **última calibración documentada**.
- **La indicación potenciométrica sirve donde el indicador químico no**: disoluciones **coloreadas o turbias**, y mezclas con **varios puntos de equivalencia**.
- **Punto de equivalencia = punto de INFLEXIÓN de la curva** (máxima pendiente). **Primera derivada → máximo. Segunda derivada → corte con cero.** La segunda derivada es la más precisa y la que usan los valoradores.
- **Método de Gran: linealiza la curva y NO necesita medidas cerca del punto final**, que es donde el potencial es más inestable.
- **Electrodo indicador por tipo de volumetría:** vidrio (ácido-base), **platino inerte** (redox), plata (argentometría), selectivo (complexometría).
- **Alcalinidad (UNE-EN ISO 9963-1): puntos finales fijos pH 8,3 y pH 4,5.** Es una valoración **a punto final (SET)**, no al punto de equivalencia.
- **Modos del valorador automático: SET** (punto final fijo), **MET** (incrementos iguales), **DET** (incremento que se adapta a la pendiente), **KFT** (Karl Fischer). La bureta es **de pistón, motorizada**.
- **El valorador automático no exime de calibrar el electrodo ni de factorizar el valorante.**

## Reparto con los temas vecinos

| Contenido | Dónde se desarrolla |
| --- | --- |
| Vocabulario metrológico del VIM (calibrar / verificar / ajustar) | **Tema 21**, completo. Aquí, recordatorio aplicado al pHímetro |
| Balanza analítica, gravimetría | **Tema 21** |
| Material volumétrico, punto de equivalencia frente a punto final, clases de volumetría, patrón primario y factorización | **Tema 22** |
| **La indicación potenciométrica del punto final y el valorador automático** | **Aquí** |
| **Electrodo de vidrio y medida de pH** | **Aquí** (aunque el de vidrio sea un electrodo selectivo) |
| Los demás electrodos selectivos, coeficiente de selectividad, adiciones patrón, conductividad, oxígeno disuelto electroquímico | **Tema 24** |
| pH y alcalinidad **como parámetros** de calidad del agua de consumo | **Tema 33** |
| Toma y conservación de muestras para pH | **Tema 36** |
| Cálculo general de incertidumbres y validación | **Tema 38** |
| Patrones primarios, trazabilidad y calibración lineal por mínimos cuadrados | **Tema 39** |
| Acreditación ISO 17025 del método | **Tema 40** |

---

## Fuentes y verificación

- **Norma de medida:** UNE-EN ISO 10523:2012, *Calidad del agua. Determinación del pH* (ISO 10523:2008), publicada el **19/09/2012** y **vigente**.
- **Procedimiento de calibración:** **CEM QU-003**, edición digital 1 (actualización de **09/02/2022**; original de 2008), NIPO 706-08-007-9. Documento **leído íntegro**: los apartados 5.1 a 6.2 y el anexo son la fuente literal del apartado 2.3.
- **Norma legal:** Real Decreto 3/2023 (BOE-A-2023-628), **texto consolidado**, comprobado directamente en el BOE: anexo I parte C (tabla 3, fila «pH»), anexo III parte B puntos 2 y 4, y anexo III parte D con la tabla 15 y su nota 4.
- **Escala y patrones de pH:** recomendaciones de IUPAC de 2002 (ver duda 4).
- **Pendientes de Nernst:** calculadas con R = 8,314 462 618 J·mol⁻¹·K⁻¹ y F = 96 485,332 12 C·mol⁻¹, y **contrastadas** con la tabla de un fabricante (coinciden a la centésima de milivoltio en 20, 25 y 30 °C).
- **Fecha de verificación:** 03/09/2026.

### Dudas y limitaciones declaradas

1. **El criterio «coeficiente de correlación entre 0,995 y 1,005» del QU-003 está citado literalmente, y es raro.** Un coeficiente de correlación no puede ser mayor que 1, así que un límite superior de 1,005 no tiene sentido estadístico: lo que el criterio controla en la práctica es la **pendiente** de la recta de regresión (que el aparato responda 1:1). **Lo dejo tal cual porque es lo que dice la fuente oficial** y es lo que un examen podría preguntar. Si en el repaso conviene, lo formulo como «lo que exige el CEM» y no como «lo que es estadísticamente correcto».

2. **El QU-003 escribe pH = −log [H⁺]** (concentración) mientras que **IUPAC define pH = −log a(H⁺)** (actividad). No es un descuido mío: son dos fuentes que difieren, y he desarrollado la definición por actividad porque es la correcta y la que explica por qué el pH es una magnitud convencional. La del CEM es la simplificación habitual, y podría aparecer así en un enunciado.

3. **De la UNE-EN ISO 10523:2012 no he leído el texto**, que es de pago. Lo verificado es el **título, el año, el estado (vigente) y la equivalencia** con la ISO 10523:2008, más el **campo de aplicación** —tipos de agua, pH 2-12, fuerza iónica < 0,3 mol/kg (κ < 2 000 mS/m a 25 °C), 0-50 °C y que sólo se describe la medida con **electrodo de vidrio**—, que aparece coincidente en el catálogo de UNE y en varias fuentes secundarias.

   **Todo lo demás que en este apunte se asocia a esa norma NO es cita normativa.** En concreto: la **resolución de 0,01 unidades de pH**, la **calibración de dos puntos con tampones que encuadren la muestra** y el **«agitar unos segundos y medir sin agitar»** proceden de **documentación de fabricante que declara basarse en la norma**, no de su texto. Van marcados con **†** allí donde aparecen.

   Es el **mismo tratamiento que se dio a las tolerancias de bureta en el tema 22**: son datos muy probables y perfectamente útiles para estudiar, pero **no se pueden citar como «lo que exige la norma»**, ni en un examen ni en un procedimiento de laboratorio. Si en algún momento se consigue el texto, hay que contrastarlos y retirar la marca.

4. **El documento de IUPAC que he podido leer entero es el borrador de recomendaciones provisionales de 6 de julio de 2001**, no la versión publicada (Pure Appl. Chem. 74 (11), 2169-2200, 2002), que está tras un muro de pago. Los valores de la tabla de patrones primarios y los intervalos de incertidumbre de las calibraciones de uno, dos y varios puntos salen de ese borrador. Los valores de 25 °C (4,005 / 6,865 / 9,180 / 10,012) coinciden con los que se citan universalmente, pero **no los he contrastado contra el texto publicado**.

5. **No he localizado ningún criterio normativo único para la pendiente y el offset de la calibración.** Ni la UNE-EN ISO 10523 ni el procedimiento QU-003 fijan un porcentaje de pendiente admisible. En la documentación consultada aparece un **97-102 %** con offset de **−30 a +30 mV**, referido a **un modelo concreto de electrodo de un fabricante**, y en la práctica de laboratorio circula también un **95-105 %**.

   **No doy por buena ninguna de las dos cifras.** Son **orientativas** y de origen comercial: el valor aplicable es el de la **especificación del electrodo** que se esté usando, o el que fije el **procedimiento del laboratorio**. Lo que sí es sólido es el criterio de fondo —pendiente próxima a la teórica, offset pequeño— y que ambos se leen de la propia calibración. Si en un examen apareciera una cifra concreta, conviene saber que el criterio existe pero que **su valor no está normalizado**.

6. **La terminología de los modos del valorador (SET, MET, DET, KFT, MAT) es de fabricante**, no normativa. Coincide entre varias marcas, lo que la hace fiable como vocabulario de trabajo, pero un enunciado podría preguntarla en castellano llano: «dosificación **dinámica** / **monotónica** / a **punto final**».

7. **Karl Fischer:** la detección del punto final con el doble electrodo de platino se describe en unas fuentes como **bipotenciométrica** y en otras como **biamperométrica** («dead stop»). He comprobado que la ISO 760:1978 recoge las dos variantes de detección, visual y **electrométrica**, pero **no he podido fijar cuál es el término normativo** ni si la norma ha sido revisada o adoptada como UNE. En el apunte digo sólo «detección electrométrica con doble electrodo de platino», que es cierto en cualquiera de las dos versiones.

8. **Los potenciales de los electrodos de referencia varían según la fuente**: para el calomelanos saturado he encontrado **+0,2444 V** y **+0,2415 V**; para el Ag/AgCl, **+0,197 V** (KCl saturado), **+0,205 V** (3,5 M) y **+0,210 V** (3 M). No son contradicciones, sino **concentraciones y convenios distintos**. Lo que hay que retener es el orden de magnitud y que **el del calomelanos es mayor que el del Ag/AgCl**.

9. **DIN 19266 y DIN 19267** se citan como las normas de las disoluciones tampón de referencia y técnicas. He confirmado que existen y a qué se refieren cada una, pero **no si hay adopción UNE ni cuál es su edición vigente**. El dato de fondo —que los tampones comerciales son trazables a los patrones primarios— es independiente de eso.

10. **El reparto con el tema 24 lo he decidido yo**, no viene dado por el temario. He traído aquí el electrodo de vidrio entero porque el enunciado del 23 pide «Medida de pH», y he dejado para el 24 las demás clases de electrodo selectivo. Si al redactar el 24 parece mejor otra frontera, este apartado se recorta sin tocar el resto.
