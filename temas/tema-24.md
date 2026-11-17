---
tema: 24
titulo: "Electrodos selectivos: Clases. Fundamentos y métodos de cálculo. Medida de la conductividad eléctrica de agua. Medida electroquímica de oxígeno disuelto en agua."
parte: Parte segunda
estado: aprobado
verificado: 2026-09-03
fuentes:
  - "UNE-EN 27888:1994, Calidad del agua. Determinación de la conductividad eléctrica (ISO 7888:1985). Edición de 14/06/1994, **EN VIGOR**, confirmada el 21/05/2008. Anuló a UNE 77039:1983 y a UNE 77039:1988 ERRATUM. — https://tienda.aenor.com/p/norma-une-en-27888-1994-n0011129"
  - "UNE-EN ISO 5814:2013, Calidad del agua. Determinación del oxígeno disuelto. Método electroquímico con sonda (ISO 5814:2012). Aprobada en marzo de 2013. — https://www.une.org/encuentra-tu-norma/busca-tu-norma/norma?c=N0050872"
  - "ISO 17289:2014, Water quality. Determination of dissolved oxygen. Optical sensor method. Se cita como ISO: sin adopción UNE confirmada (ver «Dudas»). — https://www.iso.org/standard/59515.html"
  - "Real Decreto 3/2023, de 10 de enero (BOE-A-2023-628), texto consolidado. Anexo I, parte C, tabla 3 (conductividad: valor paramétrico 2 500 µS/cm a 20 °C; valor de no aptitud 4 000) y anexo III, parte D, tabla 15 (incertidumbre de medida: conductividad 15 %, fluoruro 20 %). — https://www.boe.es/buscar/act.php?id=BOE-A-2023-628"
  - "CEM. Manual de uso de conductivímetro MU-QU-002, Centro Español de Metrología, 2004, reeditado el 25/03/2021. Publicación de pago: se cita, no se ha leído (ver «Dudas»). — https://www.cem.es/es/divulgacion/publicaciones/mu-qu-002-manual-uso-conductivimetro"
  - "TEMA 23: el fundamento potenciométrico, la ecuación de Nernst, los electrodos de referencia, el electrodo de vidrio y la calibración del pHímetro (CEM QU-003, UNE-EN ISO 10523) están desarrollados allí y aquí solo se recuerdan."
  - "ULPGC, material docente «Métodos potenciométricos» (electrodos de membrana, electrodos selectivos, ventajas y desventajas). — http://www2.ulpgc.es/hege/almacen/download/38/38799/metodos_potenciometricos.pdf"
  - "DOCUMENTACIÓN DE FABRICANTE (criterios prácticos, no normativos): Metrohm y Mettler Toledo sobre electrodos selectivos y TISAB; Hanna Instruments sobre sondas de oxígeno polarográficas y galvánicas; catálogos de patrones de conductividad de KCl (Scharlab, ITW Reagents, Hach)."
  - "BIBLIOGRAFÍA TÉCNICA (no consultable en línea): Skoog, West, Holler y Crouch, «Fundamentos de Química Analítica»; Harris, «Análisis Químico Cuantitativo». Son la referencia de los apartados 2.1 a 2.3."
---

> **Aviso de fuentes.** Este tema está **peor cubierto por norma que el 23**, y conviene saberlo desde el principio. Las **dos medidas concretas sí tienen norma UNE vigente y verificada** —conductividad (UNE-EN 27888) y oxígeno disuelto por sonda (UNE-EN ISO 5814)—, pero **los electrodos selectivos como familia no tienen una norma general**: sus clases, la ecuación de Nikolsky-Eisenman, el coeficiente de selectividad y el TISAB son **doctrina de química analítica y documentación de fabricante**. Va marcado como tal en cada apartado.

> **Reparto con el tema 23, ya acordado y aprobado.** Allí quedó **todo el fundamento potenciométrico**: qué es la potenciometría, la ecuación de Nernst y su pendiente, el potencial de unión líquida, los electrodos de referencia, el **electrodo de vidrio** completo y la calibración de pHímetros. **Aquí no se repite**: se recuerda en una línea y se remite. Este tema desarrolla **las demás clases de electrodo selectivo**, la **selectividad**, los **métodos de cálculo**, y las dos medidas del enunciado.

> **Reparto con los temas 33 y 34.** La conductividad y el oxígeno disuelto **como parámetros** —valor paramétrico, frecuencia de control, qué significan en un agua— son del **tema 33** (agua de consumo) y del **34** (residuales). Aquí solo **la técnica**. Del RD 3/2023 se toma únicamente lo que exige al método. Y el **método de Winkler** para el oxígeno es una **volumetría redox**: se desarrolló en el **tema 22** y su aplicación es del 34; aquí aparece solo para contrastarlo con la sonda.

## 1. Encuadre

Este tema junta tres cosas que comparten familia pero no norma: los **electrodos selectivos de iones** (ISE), que son la generalización del electrodo de vidrio del tema 23 a cualquier ion; la **conductividad**, que es la medida electroquímica **inespecífica** por excelencia; y el **oxígeno disuelto por sonda**, que no es potenciometría sino **amperometría** —se mide una corriente, no un potencial—.

El hilo común es que en los tres casos **el sensor va metido en la muestra y da el resultado en el sitio**: pueden hacerse a pie de río o en línea en una ETAP, **y también en el laboratorio**. El uso de campo no excluye el ensayo de laboratorio.

| Qué regula | Norma o referencia | Lógica |
| --- | --- | --- |
| Fundamento potenciométrico, Nernst, referencias, electrodo de vidrio | **Tema 23** | Ya desarrollado |
| Clases de ISE, selectividad, TISAB, métodos de cálculo | Skoog, Harris; material docente y de fabricante | **Doctrina técnica**, no norma |
| **Conductividad eléctrica del agua** | **UNE-EN 27888:1994** (ISO 7888:1985) | Ensayo normalizado |
| **Oxígeno disuelto, método electroquímico** | **UNE-EN ISO 5814:2013** (ISO 5814:2012) | Ensayo normalizado |
| Oxígeno disuelto, método óptico | **ISO 17289:2014** | Alternativa moderna |
| Oxígeno disuelto, método yodométrico (Winkler) | UNE-EN 25813 — **tema 22** | Volumetría |
| Exigencia al método en agua de consumo | **RD 3/2023**, anexo III | Reglamento estatal |

## 2. Desarrollo

### 2.1. Electrodos selectivos: concepto y clases

Un **electrodo selectivo de iones (ISE)** es un electrodo indicador **de membrana** cuyo potencial responde a la **actividad de un ion determinado**. Es la generalización del electrodo de vidrio: allí el ion era el H⁺, aquí puede ser el fluoruro, el nitrato, el amonio o el calcio.

Recordatorio del tema 23, en una línea: **los electrodos metálicos transfieren electrones y los de membrana transfieren iones**. Todo ISE necesita, enfrente, un **electrodo de referencia** (normalmente Ag/AgCl, muchas veces **de doble unión** para que su electrolito no contamine la muestra).

#### Las clases

| Clase | De qué es la membrana | Ejemplos característicos |
| --- | --- | --- |
| **De vidrio** | Vidrio de composición ajustada | **H⁺ (el electrodo de pH, tema 23)**; también Na⁺ y otros cationes monovalentes |
| **De estado sólido o cristalina** | Un monocristal o una pastilla prensada de sal poco soluble | **F⁻ (monocristal de LaF₃ dopado con europio)**; Cl⁻, Br⁻, I⁻ (haluro de plata + Ag₂S); Ag⁺ y S²⁻ (Ag₂S); CN⁻; Cu²⁺, Pb²⁺, Cd²⁺ |
| **De membrana líquida** (intercambiador iónico o portador neutro) | Matriz polimérica, normalmente **PVC**, impregnada con un **ionóforo** | **Ca²⁺**; **K⁺ (valinomicina)**; NO₃⁻; ClO₄⁻; tensioactivos |
| **Sensibles a gases** | Un **electrodo de pH** detrás de una **membrana permeable a los gases** | **NH₃**, **CO₂**, SO₂, óxidos de nitrógeno |
| **Enzimáticos (biosensores)** | Una **enzima inmovilizada** sobre un ISE | Urea (la ureasa la convierte en amonio, que sí se mide); glucosa |
| **ISFET** | Un transistor de efecto de campo sensible a iones | pH y otros; sin vidrio, robusto, muy pequeño |

Dos de ellas merecen atención aparte porque son las que más se preguntan:

- El **electrodo de fluoruro** es el ejemplo perfecto de membrana cristalina: un **monocristal de fluoruro de lantano** por el que solo migra el F⁻. Es de los más selectivos que existen.
- Los **sensibles a gases no son un tipo nuevo de membrana**: por dentro son un electrodo de pH. El gas atraviesa la membrana, cambia el pH de una fina película de electrolito y **lo que se mide es ese cambio de pH**. Conviene entenderlo así, porque explica sus interferencias.

### 2.2. Fundamentos

#### La respuesta

Es la ecuación de Nernst del tema 23, aplicada a un ion cualquiera:

> **E = K ± (59,16 / n) · log a(X)**  (a 25 °C, en mV)

- El signo es **positivo para cationes** y **negativo para aniones**.
- **n es la carga**: un ion monovalente da **59,16 mV por década** de actividad; uno **divalente**, la mitad, **29,58 mV**.
- La respuesta es **logarítmica**, así que el error relativo es el mismo en todo el intervalo. Y del tema 23: **1 mV de error ≈ 4 % en la actividad** de un monovalente, el doble en un divalente.

Y el punto que gobierna todo el apartado siguiente: **el electrodo responde a la ACTIVIDAD, no a la concentración**. Las dos solo coinciden en disolución muy diluida.

Una indicación de **cero mV no significa concentración cero**: el potencial incluye el término constante K y depende de la referencia de la celda.

#### Selectividad, que no especificidad

**Ningún electrodo es específico**: todos responden, en mayor o menor medida, a otros iones. Eso se recoge en la **ecuación de Nikolsky-Eisenman**, que es la de Nernst con un sumando por cada ion interferente, cada uno pesado por su **coeficiente de selectividad potenciométrico** K(X,Y).

Cómo se lee ese coeficiente —y es la pregunta típica:

- **Cuanto más pequeño, mejor.**
- Un coeficiente menor indica mayor preferencia por el ion principal, **en las condiciones especificadas de determinación**. La contribución real también depende de actividades y cargas: **K mayor que uno no vuelve por sí solo inutilizable cualquier matriz**, si el interferente está en cantidad suficientemente baja.
- **Para iones de igual carga en el modelo simplificado, un coeficiente de 10⁻³ requiere actividad mil veces mayor del interferente para igual contribución.** No debe generalizarse esa proporción a cargas diferentes. Fuente: **IUPAC Gold Book, potentiometric selectivity coefficient, P04791** — https://goldbook.iupac.org/terms/view/P04791

El **error alcalino** del electrodo de vidrio que se vio en el tema 23 no es más que esto: un coeficiente de selectividad frente al Na⁺ que deja de ser despreciable cuando el H⁺ escasea.

#### Lo que define a un ISE

Para expresar concentración, se distingue **a = γ·(c/c°)**: γ es el coeficiente de actividad y c° la concentración de referencia de la escala. Mantener condiciones de fuerza iónica comparables ayuda a mantener γ y relacionar señal con concentración; no significa que el electrodo deje físicamente de responder a actividad. La recta de Nernst relaciona **E con log a**, y su aplicación a log c requiere controlar esas condiciones.

En el modelo simplificado de igual carga, las contribuciones se comparan mediante **a(X) y K(X,Y)·a(Y)**. Incluso un K pequeño puede dar interferencia relevante si Y es muy abundante. Un K grande tampoco invalida por sí solo una muestra casi sin Y. El coeficiente se interpreta con las actividades y condiciones de su determinación, no como una propiedad universal desligada de la matriz. Fuente de terminología y condiciones: IUPAC Gold Book, P04791.

**Intervalo lineal** (donde se cumple Nernst), **límite de detección** (donde la recta se dobla), **tiempo de respuesta**, **intervalo de pH de trabajo** e **interferencias**.

| A favor | En contra |
| --- | --- |
| Respuesta **rápida** y **no destructiva** | El electrodo se **contamina** y su vida es limitada |
| **No importa el color ni la turbidez** de la muestra | **Interferencias** de otros iones |
| Equipos **baratos y portátiles**; medida en campo y en línea | Exactitud **moderada** frente a un método instrumental |
| Miden **actividad**, que a veces es lo que interesa | Exige **ajustar la fuerza iónica** si lo que se quiere es concentración |
| Amplísimo intervalo de concentraciones | Necesita **calibrar a menudo** |

### 2.3. Métodos de cálculo

Tres, y conviene saber cuándo se usa cada uno.

#### a) Calibración directa

Se preparan patrones del ion, se mide el potencial de cada uno y se representa **E frente al logaritmo de la concentración**. Sale una recta de pendiente ≈ 59,16/n mV, y la muestra se **interpola** en ella.

**Condición indispensable:** patrones y muestra deben tener **la misma fuerza iónica**, porque si no, el coeficiente de actividad cambia y la lectura no es comparable. De ahí lo siguiente.

#### El ajustador de fuerza iónica (ISA / TISAB)

Se añade **el mismo volumen de una disolución concentrada** a los patrones **y** a las muestras. En el caso del **fluoruro**, el TISAB hace **tres cosas a la vez**, y hay que saber las tres:

1. **Fija una fuerza iónica alta y constante** en todos: el coeficiente de actividad pasa a ser el mismo, y el electrodo **puede leerse como si midiera concentración**.
2. **Tampona el pH adecuado al método**, por ejemplo alrededor de **5 - 5,5** en la formulación citada: a pH demasiado bajo disminuye el fluoruro libre por protonación a HF y HF₂⁻; **a pH demasiado alto, el OH⁻ puede interferir**. **5,5 no es un umbral universal de interferencia**: el rango depende del sensor, concentraciones y formulación. Como ejemplo, la ficha Metrohm Combined dF ISE v4 declara rango de pH 5 a 7 para ese modelo.
3. **Acompleja los interferentes**: lleva **CDTA**, que secuestra **Al³⁺ y Fe³⁺**. Sin él, esos cationes forman complejos con el fluoruro y lo **esconden**, y el resultado sale bajo.

#### b) Adiciones patrón (adición conocida)

La comparación de adiciones de ISA/TISAB debe mantener **la proporción y condiciones indicadas por el método**; la regla de igual volumen de aditivo supone alícuotas comparables. Se tiene en cuenta la **dilución producida por el aditivo**. El fondo iónico constante no convierte un patrón mal preparado en referencia válida. Los materiales y soluciones se usan con sus especificaciones y vigencia.

Se mide la muestra, se le añade **un volumen pequeño de un patrón concentrado** y se vuelve a medir. Del **salto de potencial** y de la dilución se despeja la concentración original.

**Su ventaja es la comparación en la propia muestra.** Las adiciones patrón pueden compensar efectos multiplicativos de matriz si las condiciones se mantienen suficientemente constantes; no eliminan automáticamente todas las interferencias. Se consideran cambios de volumen, fuerza iónica, pH y especiación. Los iones interferentes ya presentes pueden seguir contribuyendo a la señal, y una complejación no controlada no desaparece por añadir patrón. Es útil cuando la matriz es compleja o no puede reproducirse en patrones externos, bajo condiciones validadas. Fuentes: **IUPAC Gold Book, measurement procedure with standard addition, 08030** (https://doi.org/10.1351/goldbook.08030) y **Metrohm, manual tiamo, principio de adiciones patrón**.

**Su inconveniente:** es más lento y hace falta conocer la **pendiente real** del electrodo, que se comprueba con dos patrones separados una década.

Después de añadir patrón, la concentración por balance de cantidades, antes de considerar actividades, es **c_final = (c_inicial·V_muestra + c_patron·V_adicion)/(V_muestra + V_adicion)**, suponiendo volúmenes aditivos. No basta sumar concentraciones ni ignorar el volumen añadido. La adición debe mezclar y equilibrarse antes de aceptar el nuevo potencial. El patrón concentrado limita el cambio de matriz y dilución, pero no elimina la necesidad de corregirlos.

La ficha **Metrohm Combined dF ISE, 8.0109.8010EN v4, apartados 5.1, 6 y 7**, pide condiciones comparables de patrones y muestras, temperatura lo más parecida posible, superficie limpia e íntegra y comprobaciones periódicas con patrón. Una desviación inaceptable obliga a revisar y renovar la curva. Sus criterios concretos son del modelo; no se trasladan sin más a todos los electrodos ni al pHímetro del tema 23.

#### c) Valoración potenciométrica con un ISE

El electrodo hace de **detector del punto final** de una volumetría, como en el tema 23. Puede ofrecer alta exactitud cuando la reacción y detección están bien definidas; una inflexión no depende de un desplazamiento constante de todo el potencial. **No es una garantía universal de superioridad**: importan interferencias, cinética, forma de curva y control del valorante.

> **Regla para el examen:** directa si la matriz es sencilla y hay muchas muestras; adiciones patrón si la matriz es complicada; valoración si se quiere exactitud.

### 2.4. Medida de la conductividad eléctrica del agua

![Célula de conductividad de dos electrodos: la constante de célula es la separación dividida por la superficie](esquema:celda-conductividad)

#### Qué se mide

La **capacidad de una disolución para conducir la corriente eléctrica**, que se debe a los **iones** que lleva disueltos. Es una medida **inespecífica**: integra contribuciones de concentración, carga y movilidad de los iones, sin identificarlos individualmente. Por eso es un **indicador práctico de la concentración de solutos ionizables**, no un recuento universal de iones ni una medida específica de cloruros.

| Magnitud | Símbolo | Relación | Unidad |
| --- | --- | --- | --- |
| Resistencia | R | La que ofrece la disolución | Ω |
| **Conductancia** | G | **G = 1 / R** | **S** (siemens) |
| **Constante de célula** | **K** | **K = l / A** (separación entre electrodos dividida por su superficie) | **cm⁻¹** |
| **Conductividad** | **κ** | **κ = G · K** | **S/m**; en la práctica **mS/m** y **µS/cm** |
| Resistividad | ρ | ρ = 1 / κ | Ω·cm |

**Equivalencia de unidades: 1 mS/m = 10 µS/cm.** La norma expresa el resultado en **S/m o submúltiplos**; los aparatos y el Real Decreto usan **µS/cm**.

> **Lo que ha caído: 1322, n.º 17.** «¿En qué ley está basada la medida de la conductividad en el agua?» Respuesta oficial: **la ley de Ohm**. Los distractores eran la **ley de Beer-Lambert** (la de la espectrofotometría, tema 25) y la **ley de Gay-Lussac** (la de los gases). La guía de Mettler Toledo lo explica así: según la ley de Ohm, la tensión aplicada a la disolución es proporcional a la corriente que pasa, **V = R · I**. El conductivímetro aplica una tensión conocida, mide la corriente y obtiene la **resistencia, R = V / I**; su inversa es la **conductancia, G = 1 / R**, y con la constante de célula se llega a la conductividad, como en la tabla de arriba. La misma guía añade que se mide con **corriente alterna**: con corriente continua los iones emigran a los electrodos y la electrólisis altera la muestra.

#### La temperatura, que aquí no es un detalle

La conductividad **crece con la temperatura**, del orden de un **2 % por cada grado**, porque los iones se mueven más deprisa. Consecuencias:

- **Todo resultado va referido a una temperatura**, y los aparatos la compensan automáticamente.
- La referencia habitual del ensayo es **25 °C**… pero el **valor paramétrico del RD 3/2023 está dado a 20 °C**. **Comparar dos conductividades sin decir a qué temperatura están referidas no significa nada**, y es una confusión fácil de provocar en un examen.

#### Calibración: la constante de célula

No se calibra el aparato contra una escala, se determina **la constante de la célula** con una **disolución patrón de KCl** de conductividad conocida:

> **K = κ(patrón) / G(medida)**

Patrones habituales, a 25 °C:

Los valores de conductividad de los patrones de la tabla corresponden a **25 °C**.

| Patrón | Conductividad a 25 °C |
| --- | --- |
| KCl **0,001 mol/L** | **147 µS/cm** |
| KCl **0,01 mol/L** | **1 413 µS/cm** |
| KCl **0,1 mol/L** | **12 880 µS/cm** |

Se elige el patrón **del mismo orden de magnitud** que las muestras. Y la constante **se vuelve a comprobar periódicamente**, porque el platinado de los electrodos se degrada con el uso y con la suciedad.

#### Las células

| Tipo | Cómo es | Cuándo |
| --- | --- | --- |
| **De dos electrodos** | Dos placas de **platino platinado** enfrentadas | Lo habitual en laboratorio. Buena en conductividades **bajas**; en las altas sufre **polarización** |
| **De cuatro electrodos** | Dos inyectan corriente y **dos miden la tensión** | Evita la polarización y la resistencia de los cables. **Intervalo mucho más amplio** |
| **Inductiva o toroidal** | Dos bobinas; **sin contacto eléctrico** con el líquido | Aguas sucias, corrosivas o que incrustan; conductividades altas; medida en línea |

Un detalle de fondo: **la medida se hace con corriente alterna**, no continua, precisamente para **no electrolizar la muestra ni polarizar los electrodos**.

**Cuidados:** electrodos limpios (una película de grasa cambia la constante), **sin burbujas** entre las placas, célula sumergida hasta su marca y sin tocar el fondo ni las paredes, y enjuagada con la propia muestra antes de medir.

#### Para qué se usa

**Interpretación y precauciones.** Conductancia G y conductividad κ no son lo mismo: la primera depende también de la geometría del montaje y la segunda se obtiene aplicando la constante. Dos células pueden dar distinta G para la misma muestra y obtener la misma κ si sus constantes se aplican correctamente. La resistencia disminuye cuando aumenta la conductancia, y resistividad y conductividad son inversas con unidades coherentes.

La compensación térmica requiere **modelo y temperatura de referencia apropiados al agua**. El 2 % por grado es orientativo, no una constante universal. En un modelo lineal declarado, **κ_ref = κ_T/[1 + α·(T − T_ref)]**, con α en fracción por grado; no se cambia solo la etiqueta de 25 a 20 °C. El tipo de compensación y el resultado medido o corregido deben identificarse.

En aguas muy poco conductoras, **el CO₂ del aire puede aumentar la lectura** al formar especies iónicas. Una célula de flujo apropiada puede limitar ese intercambio. Las burbujas adheridas pueden **aumentar resistencia y reducir conductividad aparente**; agitar no debe introducir nuevas burbujas. Incluso una sonda inductiva requiere conservación y limpieza de superficies según su diseño: ausencia de electrodos metálicos en contacto no implica inmunidad a toda incrustación. Fuente: **Mettler Toledo, A Guide to Conductivity Measurement, §§2.6, 2.7 y 3**.

Convertir conductividad a sólidos disueltos requiere **un factor empírico dependiente de la composición**, no una equivalencia universal. Una conductividad similar no identifica los mismos iones ni demuestra igual calidad de dos aguas.

Control de ETAP y de **ósmosis inversa**; vigilancia de **agua ultrapura** (que se expresa mejor como resistividad: el agua ultrapura llega a **18,2 MΩ·cm**); detección de **intrusión salina** y de **vertidos**; estimación aproximada de los **sólidos disueltos totales**; y comprobación de que una serie de muestras es homogénea.

### 2.5. Medida electroquímica del oxígeno disuelto

![Sonda de oxígeno disuelto: el oxígeno atraviesa la membrana y se reduce en el cátodo](esquema:sonda-oxigeno)

Norma: **UNE-EN ISO 5814:2013**. Y una advertencia conceptual: **esto ya no es potenciometría**. Aquí no se mide un potencial a intensidad nula, se mide **una corriente**: es **amperometría**.

#### El principio

Una **celda electroquímica aislada de la muestra por una membrana permeable a los gases**. El oxígeno **difunde** a través de la membrana, **se reduce en el cátodo**, y la **corriente** que circula es proporcional a la **presión parcial** de oxígeno en la muestra.

#### Las dos familias

| | **Polarográfica (tipo Clark)** | **Galvánica** |
| --- | --- | --- |
| Tensión | Necesita una **tensión de polarización externa** | **No la necesita**: la pareja de metales genera su propia fem |
| Cátodo | **Oro o platino** | **Plata** |
| Ánodo | **Plata** | **Plomo** o cinc |
| Puesta en marcha | Hay que **esperar a que polarice** | **Lista de inmediato** |
| Desgaste | Más estable | El **ánodo se consume** y hay que reponerlo |

En las dos: **electrolito interno** (típicamente KCl) y **membrana de PTFE** o polietileno, sujeta con una junta.

#### Lo que más se pregunta: la sonda consume oxígeno

La sonda **gasta** el oxígeno que le llega, así que si el agua está quieta se empobrece la película pegada a la membrana y **la lectura baja**. Por eso hay que **agitar la muestra o mover la sonda** (o usar una célula de flujo). **Medir en agua quieta da un resultado bajo, y bajando.**

Es justo la diferencia con el sensor óptico, que no consume oxígeno y **no necesita agitación**.

#### Unidades, calibración y correcciones

- **Unidades: mg/L de O₂** y **porcentaje de saturación**, o las dos. El método cubre de **1 % a 100 %** de saturación, y la mayoría de los equipos leen también por encima de 100 %: la **sobresaturación**.
- **Calibración:** en **aire saturado de humedad** (que equivale al 100 % de saturación) o en agua saturada de aire; el **cero**, con una disolución de **sulfito sódico**.
- **Tres correcciones**, y hay que saberlas las tres:
  1. **Temperatura**: la solubilidad del oxígeno **baja** al subir la temperatura.
  2. **Presión atmosférica o altitud**: la saturación depende de la **presión parcial** de oxígeno del aire.
  3. **Salinidad**: cuanta más sal, **menos** oxígeno se disuelve.
- **Cuidados:** membrana íntegra y sin burbujas debajo, electrolito en buen estado, y atención a los gases que también atraviesan la membrana, que pueden interferir.

Una lectura instrumental negativa no demuestra una concentración física negativa de oxígeno: se revisan cero, calibración, rango e incertidumbre. La estabilidad se acepta con el criterio del método; una pantalla que cambia lentamente no basta sin criterio definido.

#### Los tres métodos de oxígeno disuelto, en una tabla

**Condiciones de interpretación.** El porcentaje de saturación y los mg/L no son intercambiables sin conocer la concentración de saturación correspondiente a **temperatura, presión y salinidad**. Cien por ciento no significa cien mg/L. Para resultados fiables deben conservarse las condiciones de la muestra; al medir sobresaturación se evita la **pérdida de gas durante manipulación y medida** (alcance de ISO 5814:2012).

El movimiento necesario para reponer oxígeno junto a una membrana electroquímica **no equivale a airear deliberadamente la muestra**. Se mezcla o fluye según el modelo sin introducir burbujas ni modificar indebidamente su contenido. Una sonda galvánica no necesita el período de polarización externa de una Clark, pero sí preparación, equilibrio y controles apropiados. El sensor óptico no consume oxígeno, aunque flujo, homogeneidad y equilibrio térmico pueden afectar a su tiempo de respuesta. Fuentes: **YSI, DO Meter Measurement Problems? Check Out These Top Tips!** (https://ysi.com/ysi-blog/water-blogged-blog/2021/06/do-meter-measurement-problems-check-out-these-top-tips) y **Hanna, manual HI6000, Dissolved Oxygen Measurements**.

La membrana y el electrolito deben estar en estado correcto; no se interpreta una rotura como forma de acelerar la respuesta. Las especificaciones de materiales, flujo, polarización y mantenimiento son **del modelo**. Color o turbidez pueden dificultar Winkler con detección visual, pero **no obligan a elegir exclusivamente sensor óptico**: el método electroquímico ISO 5814 también es adecuado para aguas coloreadas o turbias según su alcance público.

| Método | Norma | Fundamento | Cuándo |
| --- | --- | --- | --- |
| **Yodométrico de Winkler** | UNE-EN 25813 — **tema 22** | **Volumetría redox** | Método clásico de referencia, en laboratorio |
| **Sonda electroquímica de membrana** | **UNE-EN ISO 5814:2013** | Difusión por membrana y **reducción en el cátodo** (amperometría) | **Campo y medida en continuo**. Es el del enunciado de este tema |
| **Sensor óptico (luminiscencia)** | **ISO 17289:2014** | **Extinción de la fluorescencia** por el oxígeno | No consume oxígeno ni necesita agitación; preferible en aguas **muy coloreadas o turbias** y donde el Winkler falla |

## 3. Tabla operativa

| Parámetro / analito | Técnica | Norma o referencia | Unidades | Condiciones |
| --- | --- | --- | --- | --- |
| **Conductividad** del agua | Medida con **célula de conductividad** | **UNE-EN 27888:1994** (ISO 7888:1985) | **µS/cm** o mS/m (1 mS/m = 10 µS/cm) | Todo tipo de aguas. Resultado **referido a una temperatura** (habitualmente 25 °C; el RD 3/2023 la fija **a 20 °C**). Constante de célula con **KCl**; corriente **alterna**; sin burbujas entre electrodos |
| **Constante de célula** de un conductivímetro | Medida de un patrón de conductividad conocida | Doctrina y catálogo de patrones | **cm⁻¹** | **K = κ(patrón) / G(medida)**. Patrones de KCl a 25 °C: 0,001 M → **147 µS/cm**; 0,01 M → **1 413 µS/cm**; 0,1 M → **12 880 µS/cm** |
| **Oxígeno disuelto** | **Sonda electroquímica de membrana** (amperometría) | **UNE-EN ISO 5814:2013** | **mg/L de O₂** y **% de saturación** | Membrana permeable a gases; **hay que agitar** porque la sonda consume oxígeno; calibración en **aire saturado de humedad**, cero con **sulfito**; corregir **temperatura, presión y salinidad**; campo de 1 % a 100 % y sobresaturación |
| **Oxígeno disuelto** en agua muy coloreada o turbia | **Sensor óptico** por extinción de fluorescencia | **ISO 17289:2014** | mg/L y % de saturación | No consume oxígeno: **no necesita agitación**. Alternativa cuando el Winkler no sirve |
| **Oxígeno disuelto**, método de referencia | Volumetría redox (**Winkler**) | UNE-EN 25813 — **tema 22** | mg/L de O₂ | Fijación del oxígeno y valoración del yodo liberado |
| **Fluoruro** en agua | **Electrodo selectivo** de membrana cristalina (**LaF₃**) | Doctrina y documentación de fabricante | mg/L | Con **TISAB**: fuerza iónica constante, pH **5 - 5,5** y **CDTA** para acomplejar **Al³⁺ y Fe³⁺**. Incertidumbre exigida por el RD 3/2023: **20 %** |
| **Amonio** o **CO₂** disueltos | **Electrodo selectivo sensible a gases** | Doctrina | mg/L | Por dentro es un **electrodo de pH**: el gas atraviesa la membrana y cambia el pH de la película de electrolito |
| **Calcio, potasio, nitrato** | **Electrodo selectivo de membrana líquida** (ionóforo en PVC) | Doctrina | mg/L o mmol/L | Ajustador de fuerza iónica; ojo al **coeficiente de selectividad** frente a los iones de la matriz |
| **Ion con ISE**, matriz complicada | Potenciometría por **adiciones patrón** | IUPAC 08030; documentación de fabricante | mg/L | Comparación en la propia matriz bajo condiciones controladas; **no elimina todas las interferencias** |
| Exigencia al método en agua de consumo | — | **RD 3/2023**, anexo III, parte D, tabla 15 | % del valor paramétrico | Incertidumbre de medida (k = 2): **conductividad 15 %**, **fluoruro 20 %**. Aparatos in situ **verificados y ajustados**, con la última calibración documentada (parte B.4) |

## 4. Puntos críticos para el examen

- **Un ISE es un electrodo indicador de membrana**: transfiere **iones**, no electrones. El de vidrio del pH (tema 23) es el primero y el más usado.
- **Clases: vidrio, estado sólido o cristalina, membrana líquida, sensibles a gases, enzimáticos e ISFET.**
- **El electrodo de fluoruro es de membrana cristalina: monocristal de LaF₃** dopado con europio.
- **Los electrodos sensibles a gases llevan dentro un electrodo de pH**: el gas atraviesa la membrana y lo que se mide es el cambio de pH de la película de electrolito.
- **Respuesta: 59,16 mV por década a 25 °C para un ion monovalente; 29,58 mV para uno divalente.** Positiva para cationes, negativa para aniones.
- **Los ISE responden a la ACTIVIDAD, no a la concentración.** De ahí el ajustador de fuerza iónica.
- **Selectividad, no especificidad.** Ecuación de **Nikolsky-Eisenman** y **coeficiente de selectividad**: **cuanto más pequeño, mejor**; menor que 1, prefiere el analito; mayor que 1, prefiere el interferente.
- **El TISAB del fluoruro hace tres cosas: fija la fuerza iónica, tampona el pH entre 5 y 5,5, y acompleja el Al³⁺ y el Fe³⁺ con CDTA.** Sin él, el aluminio y el hierro esconden el fluoruro y el resultado sale bajo.
- **Métodos de cálculo: calibración directa, adiciones patrón y valoración potenciométrica.** Las adiciones ayudan a compensar ciertos efectos de matriz bajo condiciones válidas; **no eliminan automáticamente todos los interferentes**.
- **La conductividad es una medida INESPECÍFICA**: indica la concentración total de solutos ionizables, no qué iones hay.
- **Constante de célula: K = l / A**, en cm⁻¹. **Conductividad = conductancia × constante de célula.**
- **1 mS/m = 10 µS/cm.**
- **La conductividad sube con la temperatura, del orden del 2 % por grado**, y por eso el resultado **siempre va referido a una temperatura**. Ensayo, habitualmente a **25 °C**; **valor paramétrico del RD 3/2023, a 20 °C**.
- **El conductivímetro se calibra con KCl**, y lo que se determina es **la constante de célula**. **KCl 0,01 mol/L → 1 413 µS/cm a 25 °C.**
- **La medida se hace con corriente alterna**, para no electrolizar la muestra ni polarizar los electrodos.
- **Célula de cuatro electrodos:** evita la polarización y amplía el intervalo. **Inductiva:** sin contacto con el líquido, para aguas sucias o corrosivas.
- **La sonda de oxígeno NO es potenciometría, es amperometría**: se mide una corriente, no un potencial.
- **El oxígeno atraviesa una membrana permeable a los gases y se reduce en el cátodo.**
- **Polarográfica (Clark): necesita tensión externa**, cátodo de oro o platino y ánodo de plata. **Galvánica: no necesita tensión**, cátodo de plata y ánodo de plomo; el ánodo se consume.
- **La sonda consume oxígeno: hay que agitar.** En agua quieta la lectura sale baja y bajando.
- **Se calibra en aire saturado de humedad (100 %)**, y el cero con **sulfito sódico**.
- **Tres correcciones: temperatura, presión atmosférica o altitud, y salinidad.**
- **Unidades del oxígeno: mg/L y % de saturación**; el método cubre del 1 % al 100 %, y los equipos leen también la **sobresaturación**.
- **El sensor óptico (ISO 17289) no consume oxígeno y no necesita agitación**: es la alternativa en aguas coloreadas o turbias.
- **Incertidumbre exigida por el RD 3/2023: conductividad 15 %, fluoruro 20 %** (k = 2).

## Reparto con los temas vecinos

| Contenido | Dónde se desarrolla |
| --- | --- |
| Potenciometría, Nernst, potencial de unión líquida, electrodos de referencia | **Tema 23** |
| **Electrodo de vidrio y medida de pH**, calibración de pHímetros | **Tema 23** |
| Valoración con indicación potenciométrica y valoradores automáticos | **Tema 23**; aquí solo se cita como tercer método de cálculo |
| **Las demás clases de ISE, selectividad, TISAB, métodos de cálculo** | **Aquí** |
| **Conductividad y oxígeno disuelto: la técnica** | **Aquí** |
| Winkler (volumetría redox) | **Tema 22** |
| Conductividad y oxígeno **como parámetros** de calidad | **Temas 33** (consumo) y **34** (residuales) |
| Toma y conservación de muestras | **Tema 36** |
| Incertidumbre, validación y calibración lineal | **Temas 38 y 39** |
| Acreditación ISO 17025 | **Tema 40** |

---

## Fuentes y verificación

- **Conductividad:** UNE-EN 27888:1994 (ISO 7888:1985). Estado comprobado en la tienda de AENOR: **En Vigor**, edición de **14/06/1994**, **confirmada el 21/05/2008**; anuló a UNE 77039:1983 y a UNE 77039:1988 ERRATUM. **No hay norma sustituta.**
- **Oxígeno disuelto:** UNE-EN ISO 5814:2013 (ISO 5814:2012), aprobada en marzo de 2013. Método óptico alternativo: ISO 17289:2014.
- **Norma legal:** RD 3/2023 (BOE-A-2023-628), texto consolidado, comprobado directamente en el BOE: conductividad con valor paramétrico **2 500 µS/cm a 20 °C** y valor de no aptitud **4 000** (anexo I, parte C, tabla 3, fila 47 y su nota 10); incertidumbres de medida de conductividad (15 %) y fluoruro (20 %) en el anexo III, parte D, tabla 15.
- **Ley de Ohm (precedente 1322 n.º 17, añadido el 16/10/2026):** Mettler Toledo, *A Guide to Conductivity Measurement. Theory and Practice of Conductivity Applications*, apartados 2.2 («Definition of Conductivity»: V = R · I, R = V / I, G = 1 / R) y 2.4 («Measuring Principle»: corriente alterna para evitar la electrólisis). Documentación de fabricante, no norma; leída en la copia en PDF que publica la Universidad de Tel Aviv (https://www.tau.ac.il/~chemlaba/Files/conductivity_guide_EN%20(2).pdf). La guía se ofrece en mt.com, «Conductivity Measurement Theory Guide».
- **Fecha de verificación:** 03/09/2026.

### Dudas y limitaciones declaradas

1. **De la UNE-EN 27888:1994 no he leído el texto**, que es de pago. Lo verificado es el **título, la edición, el estado (En Vigor), la confirmación de 2008 y las normas que anuló**. El **campo de aplicación** (todo tipo de aguas, resultado referido a una temperatura, expresión en S/m y submúltiplos) procede del resumen del alcance publicado, **no del articulado**. Mismo tratamiento que se dio a la ISO 10523 en el tema 23: útil para estudiar, **no citable como cita normativa literal**.

2. **Los valores de los patrones de KCl (147, 1 413 y 12 880 µS/cm a 25 °C) proceden de catálogos de proveedor**, no del texto de la norma. Coinciden entre varios proveedores, así que son muy fiables como dato de trabajo, pero **no como cita de la UNE-EN 27888**.

3. **El coeficiente de temperatura de «2 % por grado» es una regla práctica**, de bibliografía y de fabricante. **No es una constante normativa** y **depende de los iones presentes**: en aguas distintas cambia. Trátalo como orden de magnitud.

4. **De la UNE-EN ISO 5814:2013 tampoco he leído el texto.** Verificados el título, el año, la equivalencia con ISO 5814:2012 y el campo (concentración en mg/L y porcentaje de saturación, del 1 % al 100 %, con sobresaturación en la mayoría de los equipos). **El detalle de las sondas —polarográfica frente a galvánica, materiales de cátodo y ánodo, calibración en aire saturado, cero con sulfito— procede de documentación de fabricante**, no de la norma.

5. **Las fuentes de fabricante se contradicen en un punto de la sonda polarográfica:** una describe el cátodo como «de plástico», lo que parece un error de transcripción. He tomado la versión coherente con el resto de fuentes y con el fundamento —**cátodo de oro o platino, ánodo de plata**—, pero **no lo he podido contrastar con la norma**.

6. **La ISO 17289:2014 se cita como ISO: no he confirmado si existe adopción UNE** ni con qué año. El dato de fondo —que hay un método óptico normalizado, que no consume oxígeno y que no necesita agitación— sí está confirmado.

7. **Los electrodos selectivos no tienen norma general.** Las clases, la ecuación de Nikolsky-Eisenman, el coeficiente de selectividad y los métodos de cálculo son **doctrina de química analítica** (Skoog, Harris), que **no he podido consultar directamente**. Es contenido estable, pero la lista de clases varía algo entre autores: algunos separan «intercambiador iónico» y «portador neutro» como dos familias, y otros no cuentan el ISFET entre los ISE.

8. **La composición y el comportamiento del TISAB (acetato, cloruro sódico, CDTA; pH 5 - 5,5) proceden de documentación de fabricante.** El fundamento —fuerza iónica constante, tampón de pH y acomplejamiento de Al³⁺ y Fe³⁺— es unánime en todas las fuentes consultadas; el intervalo exacto de pH varía ligeramente según el fabricante y la formulación (TISAB II, TISAB III…).

9. **El manual del CEM sobre conductivímetros (MU-QU-002) es de pago y no lo he leído.** A diferencia del tema 23, donde el procedimiento QU-003 de calibración de pHímetros sí es gratuito, **aquí no he encontrado un procedimiento de calibración del CEM accesible** para conductivímetros ni para sondas de oxígeno. Si aparece, este apartado se puede reforzar mucho.

10. **La estimación de sólidos disueltos totales a partir de la conductividad** (multiplicar por un factor de 0,5 a 0,7) es una **regla práctica**, no un método normalizado. La menciono como uso, sin dar el factor por bueno.
