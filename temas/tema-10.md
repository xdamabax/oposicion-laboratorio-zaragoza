---
tema: 10
titulo: "Equipo básico del laboratorio de microbiología I: Microscopios. Estufas y baños de incubación. Centrífugas. Cabinas de seguridad."
parte: Parte segunda
estado: aprobado
verificado: 2026-09-30
fuentes:
  - "INSST, NTP 1202 (2024): «Exposición a agentes biológicos. Equipos de seguridad: cabinas de seguridad biológica». Resume la norma UNE-EN 12469:2001 y la NSF/ANSI 49. https://www.insst.es/documentacion/colecciones-tecnicas/ntp-notas-tecnicas-de-prevencion/37-serie-ntp-numeros-1191-a-1214-ano-2024/ntp-1202-exposicion-a-agentes-biologicos-equipos-de-seguridad-cabinas-de-seguridad-biologica-2024"
  - "INSST: Guía técnica de agentes biológicos, actualización de 2024: cabinas de seguridad frente a cabinas de flujo laminar, y equipos de seguridad del laboratorio (apéndice 8)."
  - "Real Decreto 664/1997, anexo IV (tema 9): cuándo exige cabina cada nivel de contención."
  - "Standing Committee of Analysts (Reino Unido): «The Microbiology of Water and Associated Materials (2017) — Practices and Procedures for Laboratories», apartados 5.3 (centrífugas), 5.13 (estufas), 5.16 (microscopios), 5.18 (atmósferas modificadas), 5.21 (cabinas), 5.26 (termómetros) y 5.30 (baños)."
  - "Eurachem: «Accreditation for Microbiological Laboratories», 3.ª ed. (2023), apartado 9 y anexos F (verificación) y G (mantenimiento de equipos)."
  - "M. Abramowitz, «Microscope Basics and Beyond», Olympus, ed. revisada de 2003; Nikon MicroscopyU, páginas de apertura numérica, resolución y aumento útil."
  - "OpenStax, «Microbiology» (2016), apartado 2.3, «Instruments of Microscopy»: tipos de microscopio."
  - "OMS, Laboratory Biosafety Manual: 2.ª ed. revisada (2003), uso de centrífugas y rotura de tubos; 4.ª ed. (2020), apartado de centrífugas."
  - "ExamenesAnteriores/PLANTILLAS.md y cuestionarios de otras plazas del Ayuntamiento, barridos el 30/09/2026."
  - "Ficha de apoyo temas/apoyo/tema-10.md (TEMARIO EXTRA), usada solo como guion; ninguna afirmación sale de ella."
---

## Lo que ya ha caído

**Directamente, nada.** El tema 10 es uno de los **temas sin precedente** del README. El barrido del 30/09/2026 de todos los cuestionarios, los nuestros y los de otras plazas del Ayuntamiento, no encuentra **ninguna pregunta de microscopio, estufa, baño, centrífuga ni cabina** como equipo.

**De refilón, sí**, en preguntas cuya materia es de otros temas:

| Examen | Lo que pedía | Respuesta oficial | Qué tiene de este tema |
| --- | --- | --- | --- |
| **1233, 2.º ejercicio, #15** | Condiciones de incubación de *Clostridium perfringens* en aguas | **a) A 44 °C, en anaerobiosis** | Una estufa por encima de 40 °C y una atmósfera sin oxígeno (apartado 3) |
| **1322 #26** | Placas de *Legionella* a 36 °C: ¿cuánto tiempo? | **c) 10 días** | Las incubaciones largas exigen controlar la desecación de las placas. **No son 44 ± 4 h**: ese era el distractor (corrección de ANALISIS.md) |
| **1246 #20 y 1322 #37** | Sólidos en suspensión: separados por **filtración o centrifugación** | (tema 34) | La centrifugación del método de referencia se da **en g** (2 800-3 200 g), no en rpm (apartado 4) |
| **1322, 2.º ejercicio, #5** | Nivel de contención para *Legionella* | **b) tipo 2** (tema 9) | En el nivel 2, la **cabina** se usa cuando se generan aerosoles (apartado 5) |

Al no haber precedente, el nivel de detalle es una estimación: se ha priorizado lo que tiene **cifra y fuente**, que es lo que suele convertirse en pregunta.

---

## 1. Encuadre

Este tema cubre **cuatro equipos**: qué son, cómo funcionan, cómo se usan con seguridad y cómo se comprueban.

**Reparto con los temas vecinos:**

| Materia | Tema |
| --- | --- |
| Riesgo biológico, grupos y niveles de contención | **9** |
| Hornos, **autoclaves**, esterilización y desinfección | **11** |
| El **examen microscópico**: observación en fresco y **tinciones** | **14** |
| El **control de equipos** como parte del control de calidad | **17** (aquí solo lo básico) |

---

## 2. El microscopio

### 2.1. Partes del microscopio óptico compuesto

El microscopio compuesto amplía en **dos etapas**. El **objetivo** forma una imagen real aumentada, la imagen intermedia, y el **ocular** la vuelve a aumentar.

| Parte | Función |
| --- | --- |
| **Base y brazo (estativo)** | Estabilidad. En la base van la **lámpara**, su **reóstato**, que regula la intensidad, y el **diafragma de campo** |
| **Platina** | Soporte de la preparación, con **pinzas** y mandos **X-Y** para moverla sin subirla ni bajarla |
| **Tornillos macrométrico y micrométrico** | Suben o bajan la platina: el **macrométrico** en pasos grandes, el **micrométrico** en pasos finos |
| **Condensador** | Bajo la platina. **Concentra la luz sobre la muestra**. Lleva el **diafragma de apertura** (iris) y dos tornillos para **centrarlo** |
| **Revólver** | Sostiene los objetivos y los lleva al eje óptico al girar |
| **Objetivos** | La primera ampliación, habitualmente de **4× a 100×** |
| **Tubo de observación** | Monocular, binocular o trinocular (este, con salida para cámara) |
| **Oculares** | La segunda ampliación, normalmente **10×**. Uno puede llevar un **retículo** para contar o medir |

![El microscopio óptico: camino de la luz y cifras](esquema:microscopio-optico)

**Lo que va grabado en el objetivo:**

- el **aumento** (10×, 40×...);
- la **apertura numérica (AN)**;
- el **grosor de cubreobjetos** para el que está corregido, normalmente **0,17 mm**;
- la **corrección**: **acromático** (el más sencillo; si no pone nada, lo es), **fluorita** o **apocromático** (la mejor), y **plan** si da el campo plano;
- **OIL, HI u OEL** si es **de inmersión en aceite**. Si no lo pone, es un objetivo **en seco**.

**Código de colores del aumento** (anillo del objetivo): **rojo** 4-5×, **amarillo** 10×, **verde** 16-20×, **azul claro** 40-50×, **azul oscuro** 60-63×, **blanco** 100×. Un segundo anillo, **negro**, indica **inmersión en aceite**.

**Objetivos parafocales:** los de una misma serie enfocan casi en el mismo plano, así que al girar el revólver **solo hace falta retocar con el micrométrico**.

### 2.2. Aumento

> **Aumento total = aumento del ocular × aumento del objetivo.**
>
> Ejemplo: ocular 10× y objetivo 40× dan **400×**. Con el objetivo de inmersión de 100×, **1000×**.

- Las **bacterias** se ven hacia los **400×**. Los **virus**, no: están por debajo del límite de resolución del microscopio óptico.
- La mayoría de los microscopios ópticos llegan a **1000×**, y unos pocos a **1500×**.

### 2.3. Resolución y apertura numérica

**Resolución (poder resolutivo):** la capacidad de **separar dos puntos muy próximos** y verlos como distintos. Es la **distancia mínima *d*** entre dos puntos que aún se ven separados: **cuanto menor *d*, mejor resolución**.

| Fórmula | Qué dice |
| --- | --- |
| **AN = n · sen α** | *n* es el índice de refracción del medio entre la muestra y el objetivo; α, el semiángulo del cono de luz que entra en el objetivo |
| ***d* = 0,61 · λ / AN** (Rayleigh) | Con λ = 550 nm (luz verde) y AN = 1,25: ***d* ≈ 268 nm** |
| ***d* = λ / (2 · AN)** (Abbe) | La misma idea con otra constante (0,5 en vez de 0,61) |

**Consecuencias:**

- **Más AN, mejor resolución.** **Menor longitud de onda, mejor resolución**: el azul resuelve más que el rojo.
- La AN del sistema depende también del **condensador**: su AN debe **igualar, sin superar,** la del objetivo.
- **Límites prácticos de la AN:** **0,95 en seco**, **1,2 con agua** y **1,4 con aceite**.
- **Límite teórico de resolución** del microscopio óptico con luz blanca: **0,20-0,25 µm**.

**El aceite de inmersión:**

- Tiene un índice de refracción de **1,515, el mismo que el vidrio**, así que la luz pasa del portaobjetos al objetivo **sin desviarse**.
- Con aire entre medias (n ≈ 1), la luz se refracta y se pierde. El aceite **aumenta la AN** y con ella la resolución.
- **Solo se usa con el objetivo de inmersión**, normalmente el de **100×**.

**Aumento útil y aumento vacío:**

- El **aumento útil** va de **500 a 1000 veces la AN** del objetivo. Con AN 1,25, de 625× a 1250×.
- Por encima, el aumento es **«vacío»**: la imagen se hace más grande, pero **no muestra más detalle**.

### 2.4. Iluminación de Köhler

Es el ajuste que da una **iluminación brillante y uniforme** del campo. Pasos, según la guía británica de laboratorios de aguas:

1. Con un objetivo de poco aumento (5× o 10×), enfocar la muestra.
2. **Cerrar el diafragma de campo** y **enfocar el condensador** hasta ver nítido el borde del diafragma.
3. **Centrar el condensador** con sus dos tornillos.
4. **Abrir el diafragma de campo** hasta que su borde quede justo fuera del campo visual.
5. Ajustar el **diafragma de apertura** del condensador para el **contraste**.

Una vez ajustado, **el contraste se regula con el diafragma de apertura y la intensidad con el reóstato**, no subiendo o bajando el condensador.

### 2.5. Tipos de microscopio

| Tipo | Cómo funciona | Para qué |
| --- | --- | --- |
| **Campo claro** | La luz atraviesa la muestra: **imagen oscura sobre fondo claro** | El más usado. Preparaciones **teñidas** (tinción de Gram, tema 14) |
| **Campo oscuro** | Un **disco opaco** en el condensador deja un **cono hueco de luz**. Solo llega al objetivo la luz que desvía la muestra: **objetos brillantes sobre fondo oscuro** | Organismos **vivos sin teñir** y muy finos, como las espiroquetas (*Treponema pallidum*) |
| **Contraste de fases** | Un **anillo** en el condensador y una **placa de fase** en el objetivo convierten diferencias de índice de refracción en diferencias de **claro y oscuro** | Células **vivas sin teñir**. Se ven bien las **endosporas** |
| **Contraste diferencial (DIC, Nomarski)** | Luz polarizada dividida en dos haces que se recombinan: imagen de aspecto **tridimensional** | Estructuras de muestras vivas sin teñir. En aguas, examinar ooquistes de ***Cryptosporidium*** con el objetivo de 100× |
| **Fluorescencia** | Luz de **excitación de onda corta** (UV o azul) que los **fluorocromos** reemiten con onda más larga. Un **filtro barrera** elimina la de excitación: **colores brillantes sobre fondo oscuro**. Lámpara de mercurio, de xenón o LED | Identificar patógenos. **Inmunofluorescencia**: anticuerpos marcados que tiñen, por ejemplo, ***Cryptosporidium*** en aguas |
| **Confocal** | Un **láser** barre planos a distintas profundidades y el ordenador reconstruye la imagen en **3D** | Muestras gruesas, como las **biopelículas** |
| **Estereoscópico (lupa)** | Poco aumento y visión en relieve | Examinar **colonias** en placa |
| **Electrónico de transmisión (MET/TEM)** | **Haz de electrones**, λ ≈ 0,005 nm, enfocado con **lentes magnéticas**. Atraviesa **cortes ultrafinos (20-100 nm)** en **vacío** | Estructura **interna** de la célula |
| **Electrónico de barrido (MEB/SEM)** | Los electrones que rebotan en la **superficie**, recubierta de metal (oro): imagen **tridimensional** de la superficie | **Superficie** de células y objetos |

**Del óptico al electrónico:**

- El microscopio electrónico da imágenes nítidas de hasta **100 000×**, y algunos llegan a **2 000 000×**.
- **No sirve para material vivo**, por la preparación que exige: vacío y deshidratación.

### 2.6. Uso y cuidado

**Al usarlo:**

- Enfocar con el **macrométrico** solo con los objetivos de **4× y 10×**. Con los de **40× y 100×**, **solo el micrométrico**, para no chocar el objetivo contra el portaobjetos.
- **El aceite solo con el objetivo de inmersión.** Hay que **limpiarlo al terminar**, y también el que haya pasado por error a otro objetivo.
- Limpiar las lentes **solo con papel de óptica**.
- Al terminar, **tapar el microscopio con su funda**.

**Medir tamaños:**

- Se usa un **retículo** en el ocular, calibrado con un **micrómetro objetivo**: **1 mm dividido en 100 partes de 10 µm** cada una.
- Se calibra **para cada objetivo**. Con el de 10× suele salir **1 división = 10 µm**; con el de 100×, **1 µm**.
- Se recalibra periódicamente, por ejemplo **una vez al año**.

**Controles y mantenimiento (Eurachem, 2023):**

- **Comprobar la alineación** a diario o **en cada uso**.
- **Revisión completa** por un servicio técnico **una vez al año**.
- **Lámparas de UV** del microscopio de fluorescencia: se **registran sus horas de uso**, y al cambiarlas se usan **guantes y gafas**, porque pueden **estallar**.

---

## 3. Estufas y baños de incubación

### 3.1. Qué controla la incubación

**Temperatura, tiempo y atmósfera.** En los equipos de atmósfera controlada, además, la **humedad** y el **CO₂**. En incubaciones largas, hay que vigilar también que las placas **no se sequen**.

Las temperaturas más habituales en el laboratorio de aguas:

- **22 °C**, que suele exigir estufa **refrigerada**;
- **36-37 °C**;
- **44 °C**, en el límite superior. Es la de *C. perfringens*, en anaerobiosis (1233, 2.º ejercicio, #15).

Cada método fija su temperatura, su tolerancia y su tiempo. Por ejemplo, las placas de *Legionella* van a **36 °C durante 10 días** (1322 #26). Los métodos son de los temas 18 y 19.

### 3.2. La estufa de cultivo (incubador)

**Qué es:** un **armario aislado con temperatura controlada** por termostato.

**Cómo está construida:**

- Puede calentar **sin ventilador**, por convección natural, o **con ventilador**, que **reparte la temperatura de forma más uniforme**.
- El interior es de **material fácil de limpiar**, como el **acero inoxidable**.
- Una **puerta interior de vidrio** o metacrilato deja ver el contenido **sin que se escape el calor**.
- Si la temperatura del local es **cercana a la de consigna, o mayor**, la estufa necesita **refrigeración además de calefacción**. Es el caso típico de la estufa a **22 °C**.
- No debe colocarse en **corrientes de aire, al sol** ni donde la temperatura ambiente fluctúe.
- **Estufas de ciclo:** pasan de una temperatura a otra, por ejemplo **de 30 °C a 44 °C**. La subida debe completarse **en 30 minutos**, y ese tiempo **cuenta como parte de la incubación a la temperatura alta**.

**Tolerancias y termómetros** (guía británica de laboratorios de aguas, 2017):

| Temperatura de la estufa | Fluctuación máxima admitida | Precisión del termómetro |
| --- | --- | --- |
| **20-40 °C** (por ejemplo, 22 o 37 °C) | **± 1 °C** | ± 0,5 °C sirve; **± 0,2 °C** es mejor, y ± 0,1 °C para el control oficial del agua de consumo |
| **40 °C o más** (por ejemplo, 44 °C) | **± 0,5 °C** | **± 0,1 °C** |

**Termómetros y registro de temperatura:**

- El termómetro se mete en un **frasco con un líquido inerte**: **glicerol, parafina líquida o propilenglicol**. Así la lectura **no cambia al abrir la puerta**.
- Los termómetros de **mercurio y de tolueno** están **prohibidos** por seguridad, según la guía Eurachem.
- Se recomiendan los **registradores de datos** o la **monitorización continua con alarma**.
- Como mínimo se leen **dos veces al día**: **al empezar la jornada**, antes de sacar cultivos, y **al acabarla** o al meter muestras.
- **El indicador del propio equipo solo vale si se ha verificado.**

**Cómo se carga:**

- **Sin sobrecargar la estufa:** la forma de cargarla cambia el reparto del calor.
- **No apilar más de seis placas de Petri.**
- Hay que hacer un **perfil de temperatura**: varios termómetros en distintos puntos durante un tiempo, por ejemplo **24 horas**.
- Las **zonas demasiado frías o calientes** se señalan y **no se usan**.
- El perfil se repite **periódicamente**, al **cambiar la estufa de sitio** y **tras una reparación**.

**Limpieza:** agua templada y **desinfectante**, por ejemplo **hipoclorito diluido**, que **no debe dejar residuo**. Conviene alternar dos desinfectantes. La guía Eurachem sugiere **una vez al mes**, y siempre **tras un derrame de cultivo**.

### 3.3. Otras atmósferas

- **Anaerobiosis:**
  - En **jarras herméticas** con **sobres generadores** que **eliminan el oxígeno y producen CO₂**. La reacción desprende calor y puede condensar agua.
  - Se mete primero el material y el **indicador de anaerobiosis**, y **después** se abre el sobre.
  - **El sobre tiene que corresponder al volumen de la jarra.**
  - Para muchas placas hay **cabinas y estufas de anaerobiosis**.
- **Microaerofilia:** **5-7 % de O₂ y alrededor del 10 % de CO₂**, con sobres propios. Por ejemplo, para ***Campylobacter***.
- **Estufas de CO₂:** controlan además el gas y la humedad.

La atmósfera se comprueba con el **indicador**, **en cada uso**. También puede comprobarse con dos **cultivos control**: uno aerobio y otro anaerobio o microaerófilo.

### 3.4. Baños de incubación (baños termostáticos)

**Qué son:**

- Una cubeta de agua con **resistencia, termostato** y un **agitador o bomba de circulación**.
- Suelen llevar **tapa inclinada** para **reducir la evaporación**.

**Para qué se usan:** para **incubar ciertos cultivos** y para **mantener fundido el agar** hasta verterlo.

**Cómo se usan:**

- Con **agua destilada o desionizada**, **siempre agitada o en circulación**.
- Encendidos **solo con el agua a su nivel**.
- **El contenido de tubos y frascos debe quedar por debajo del nivel del agua**, con **gradillas** que eviten que entre agua o que se vuelquen.
- La temperatura se lee **al empezar y al acabar la jornada**, con un termómetro calibrado. El indicador del baño **solo orienta**, salvo que se haya verificado.
- **Un derrame contamina el agua**: se atiende **inmediatamente**.

**Limpieza:**

- **Vaciar, limpiar y desinfectar**, por ejemplo con **etanol al 70 % o 2-propanol**, y rellenar.
- La guía Eurachem sugiere hacerlo **cada mes**, o **cada 6 meses si el agua lleva biocida**.
- Si no se usa, se guarda **vacío y limpio**.

### 3.5. Frío

La nevera y el congelador no están en el enunciado, pero se controlan igual:

- **frigorífico**: **5 ± 3 °C**;
- **congelador**: **−20 ± 5 °C**;
- **ultracongelador**: **−70 ± 10 °C** o menos.

---

## 4. Centrífugas

### 4.1. Qué hacen y qué tipos hay

La centrífuga **separa sustancias de distinta densidad por la fuerza centrífuga**. En microbiología sirve para **separar los microorganismos del líquido** que los contiene, por ejemplo para **concentrarlos**.

| Tipo | Rasgos |
| --- | --- |
| **De sobremesa** | Las de uso general en microbiología. Entre **200 y 6000 rpm** |
| **Microcentrífuga** | Para **tubos Eppendorf**. Se usa, por ejemplo, en los análisis de ***Cryptosporidium* y *Giardia*** |
| **Refrigerada** | Controla además la **temperatura** |
| **Ultracentrífuga** | Velocidades muy altas, **con vacío** en la cámara. Lleva un **filtro HEPA entre la centrífuga y la bomba de vacío** |

**Rotores:**

- **Basculantes:** las **cubetas** cuelgan de un soporte y se inclinan al girar.
- **De ángulo fijo:** los tubos van **inclinados** en el propio rotor. Con ellos hay que **no llenar de más** los tubos, porque pueden **gotear**.

### 4.2. Fuerza centrífuga relativa (FCR)

La separación **no depende de las rpm, sino de la fuerza**, y la fuerza depende también del **radio**. Por eso los métodos la dan **en múltiplos de g**:

> **FCR (× g) = 1,118 × 10⁻⁵ × r × N²**
>
> *r*: radio en **cm**, desde el eje hasta el fondo del tubo. *N*: velocidad en **rpm**.

**De dónde sale la constante:** FCR = ω²·r / g, con ω = 2π·N/60. Entonces (2π/60)² / 980,665 cm/s² = **1,118 × 10⁻⁵**.

| Cambio | Efecto sobre la FCR |
| --- | --- |
| **Doblar las rpm** | **× 4** (depende del **cuadrado** de la velocidad) |
| **Doblar el radio** | **× 2** |
| **Ejemplo:** r = 10 cm y 3000 rpm | 1,118 × 10⁻⁵ × 10 × 3000² ≈ **1006 × g** |

El método de referencia de los **sólidos en suspensión** centrifuga **5 min a 2 800-3 200 g** (tema 34).

### 4.3. Uso seguro

La centrifugación **genera aerosoles** (tema 9). Normas del *Manual de bioseguridad en el laboratorio* de la OMS:

**Tubos:**

- **De plástico** o de vidrio **de pared gruesa**, revisados antes de usarlos.
- **Siempre tapados**, a ser posible **con rosca**.
- **Llenos al mismo nivel**, y sin pasar del que indique el fabricante.

**Equilibrado:**

- **Cubetas y portacubetas emparejados por peso**, con los tubos **en posiciones opuestas**.
- Para equilibrar cubetas vacías: **agua destilada o alcohol (propanol al 70 %)**. **Nunca suero salino ni hipoclorito**, porque **corroen** el metal.

**Cubetas de seguridad (con tapa hermética) o rotores sellados:**

- Si la centrífuga las tiene, **hay que usarlas**, y revisar sus juntas.
- El manual de 2003 las hace **obligatorias para los grupos de riesgo 3 y 4**.
- Se **cargan, equilibran, cierran y abren dentro de una cabina de seguridad biológica**.
- Poner la centrífuga dentro de una cabina de clase I o II **no protege**: las partículas salen **demasiado rápidas** para que las retenga el flujo de aire. La protección la dan **la buena técnica y los tubos bien tapados**.

**Revisión y limpieza:**

- **A diario:** el interior de la cámara (manchas a la altura del rotor), y rotores y cubetas (**corrosión y grietas finas**).
- **Tras cada uso:** **descontaminar** cubetas, rotor y cámara. Las cubetas se guardan **boca abajo** para que escurran.

**Si se rompe un tubo en una centrífuga sin cubetas herméticas:**

1. Si se rompe **con la centrífuga en marcha**, **apagar el motor y dejarla cerrada 30 minutos**, para que se depositen los aerosoles. Si se descubre **al parar**, **cerrar la tapa enseguida y esperar 30 minutos**.
2. **Avisar al responsable de bioseguridad.**
3. Trabajar con **guantes gruesos**, y recoger los vidrios con **pinzas**.
4. Tubos rotos, vidrios, cubetas, portacubetas y rotor, en **desinfectante no corrosivo durante 24 h**, o al **autoclave**. Los tubos intactos, en otro recipiente con desinfectante, **60 minutos**.
5. Pasar desinfectante por la cámara, **dejarlo toda la noche** y repasar.

Si la rotura es **dentro de una cubeta de seguridad**, se abre en la cabina, se deja la tapa floja y **se autoclava la cubeta**.

**Control (Eurachem y guía británica):**

- **Velocidad con un tacómetro calibrado e independiente, una vez al año**, si la velocidad es crítica para el método. También se verifican el tiempo y la temperatura si el método depende de ellos.
- **Revisión técnica anual.**
- **Limpieza y desinfección en cada uso.**

---

## 5. Cabinas de seguridad biológica

### 5.1. Qué son

**Recintos cerrados, con circulación forzada de aire**, que **impiden que los bioaerosoles pasen al ambiente de trabajo**:

- Son la **barrera física primaria**, el **principal elemento de contención** del laboratorio.
- Las define la norma **UNE-EN 12469:2001**.
- Llevan **filtros HEPA**, filtros absolutos de clase **H14 o superior** (UNE-EN 1822-1). Retienen el **99,995 %** de las partículas del tamaño más difícil de retener, **0,3 µm**.
- Deben tener **indicadores del flujo de aire y alarmas**: si falla la corriente o el ventilador, las diferencias de presión que dirigen el aire se pierden enseguida.

**No son lo mismo que una cabina de flujo laminar:**

| | Cabina de seguridad biológica | Cabina de flujo laminar |
| --- | --- | --- |
| Protege al **producto** | Solo la II y la III | **Sí**: es su función |
| Protege a la **persona y al ambiente** | **Sí** | **No**. En la **horizontal**, el aire, tras barrer la muestra, **sale hacia el operador** |
| ¿Para agentes infecciosos? | **Sí** | **No**, ni con efectos tóxicos o alérgicos |

**Una cabina de flujo laminar no es de seguridad biológica.**

### 5.2. Las tres clases (UNE-EN 12469)

![Las tres clases de cabina de seguridad biológica](esquema:clases-cabinas)

| | Clase I | Clase II | Clase III |
| --- | --- | --- | --- |
| **Frente** | Abertura frontal | Frontal, con cierre corredizo o con bisagras | **Guantes** sellados al frente: **totalmente cerrada** |
| **Protege a** | **Persona y ambiente** | **Persona, ambiente y producto** | **Persona, ambiente y producto** (frente a contaminación externa) |
| **Entrada del aire del local por el frente** | Sí | Sí | **No** |
| **Velocidad de entrada** | **0,7-1 m/s** | **≥ 0,38 m/s** | **≥ 0,7 m/s con un guante quitado** |
| **Flujo laminar descendente** | No | **Sí, 0,25-0,4 m/s** | No: el aire es **turbulento** |
| **Aire introducido filtrado** | No | Sí | Sí |
| **Aire extraído** | Por **un HEPA**, a la sala o al exterior | Por **HEPA**, a la sala o al exterior, según el tipo | Por **dos HEPA en serie**, al exterior por conducto |
| **Recirculación** | Expulsa **todo** el aire | Según el tipo, **recircula una parte** o expulsa todo | Expulsa **todo** el aire |

**Detalles por clase:**

- **Clase I:**
  - Trabaja a **presión negativa**. El aire del local entra por la abertura y forma una **barrera de aire**.
  - **No protege el producto.**
  - **Más de 1 m/s de entrada es peor**, porque crea **turbulencias** y retornos.
- **Clase II:**
  - El aire entra por la abertura, pasa por **rejillas delanteras y traseras** a un **pleno a presión negativa**, y desde ahí:
    - una parte **se expulsa**;
    - el resto **se recircula** por un HEPA y **baja en flujo laminar** sobre la superficie.
  - A **6-18 cm** de altura, el flujo se divide entre la rejilla frontal y la trasera.
  - **Todas las zonas por donde pasa aire contaminado están a presión negativa.**
- **Clase III:**
  - **Presión negativa de al menos 200 Pa.**
  - Los materiales entran y salen por una **caja de paso** o un **tanque de inmersión química**, o por un **autoclave de doble puerta**.
  - Da la **máxima protección**, incluida la protección **por contacto**, y es la de los agentes del **grupo 4**.
  - Protege el producto de la contaminación externa, pero **no de la cruzada**, porque el aire interior es turbulento.

**Tipos de la clase II.** La UNE-EN 12469 no los distingue; la norma estadounidense **NSF/ANSI 49** define cinco:

| Tipo | Velocidad de entrada | Aire recirculado / expulsado |
| --- | --- | --- |
| **A1** | 0,38 m/s | 70 % / 30 % |
| **A2** | 0,51 m/s | 70 % / 30 %. **Equivale a la clase II de la UNE-EN 12469; es la más vendida** |
| **B1** | 0,51 m/s | < 50 % / > 50 % |
| **B2** | 0,51 m/s | **Expulsa el 100 %** al exterior |
| **C1** | 0,51 m/s | < 50 % / > 50 %. Admite cualquier forma de extracción |

**Aisladores** (NTP 1203): recintos cerrados con una contención **parecida a la de la clase III**. Se diseñan a medida para tareas concretas y **no se ajustan a ninguna norma internacional** de ensayo.

### 5.3. Cuál elegir

**Criterios:** el **grupo de riesgo** del agente, si se transmite **por el aire o por contacto**, la **cantidad** de material y si se generan **bioaerosoles**.

| Situación | Cabina |
| --- | --- |
| Agentes de los **grupos 1 y 2** | Puede valer la **clase I**. El grupo 2 se trabaja **sobre todo en clase II** |
| Agentes del **grupo 3** | **Clase II** o **III** |
| Agentes del **grupo 4** | **Clase III**. También la II, con **trajes especiales de presión positiva** |
| **Productos químicos volátiles** | **El HEPA no retiene gases ni vapores**: hay que añadir otros filtros y **expulsar al exterior** |

**Qué dice el RD 664/1997, anexo IV (tema 9):**

- **nivel 2:** cabina «**cuando proceda**»;
- **nivel 3:** «**sí, cuando la infección se propague por el aire**»;
- **nivel 4:** **siempre**.

La guía del INSST pide, en el **nivel 2**, cabina de **clase I o, preferiblemente, II** para las técnicas que generan aerosoles.

**Con la cabina se siguen llevando los EPI** que diga la evaluación de riesgos.

### 5.4. Instalación, certificación y mantenimiento

**Dónde ponerla:**

- **Lejos de corrientes**: puertas, ventanas, zonas de paso, rejillas del aire acondicionado, otras cabinas, corrientes por diferencias de temperatura.
- Dejar **30 cm detrás y a los lados** y **45 cm por encima**, para el mantenimiento.

**Los ensayos de la UNE-EN 12469:**

| Ensayo | Cuándo | Qué incluye |
| --- | --- | --- |
| **Examen de tipo** | Una vez, **el fabricante** | Retención en la abertura frontal, **estanqueidad de la carcasa** y filtros. En la clase II, además, protección del producto y contaminación cruzada |
| **Ensayo de instalación** | Tras la **puesta en servicio**, o si cambia la instalación o su entorno | Los mismos, **salvo la estanqueidad de la carcasa** |
| **Mantenimiento de rutina** | A **intervalos regulares** | Los mismos, **salvo la estanqueidad de la carcasa** |

**Certificación:**

- Las cabinas conformes a la norma llevan **marcado CE**.
- **Personal técnico cualificado** certifica **al instalarlas** y después **al menos una vez al año**, además de **tras un cambio de sitio o una reparación**.
- La certificación comprueba:
  - la **integridad** de la cabina y las **fugas de los filtros HEPA**;
  - el **perfil de velocidad descendente** y la **velocidad en la abertura frontal**;
  - la **presión negativa**;
  - las **alarmas** y los **interbloqueos**.
- Cada cabina tiene su **manual** y una **ficha de mantenimiento** a la vista.

**La guía Eurachem añade:**

- **control microbiológico semanal**;
- **comprobación del flujo de aire en cada uso**;
- **revisión completa anual**.

### 5.5. Cómo se trabaja en ella (NTP 1202)

**Antes:**

- **Apagar la lámpara UV**, encender la luz y el ventilador, y comprobar que **las rejillas están libres**.
- **Dejarla funcionar 5-10 minutos.**
- Lavarse manos y antebrazos y ponerse los **EPI**.
- **Desinfectar la superficie**, por ejemplo con **alcohol al 70 %**.
- **No meter materiales que suelten partículas:** **papel, madera, lápices, tapones de algodón**.
- Colocar todo ordenado, **de la zona limpia a la contaminada**, con el recipiente de residuos dentro.
- **Dejar que el aire barra 3-5 minutos** antes de empezar.
- **No poner nada encima de la cabina.**

**Durante:**

- **Movimientos lentos.** Meter las manos despacio.
- Trabajar **al menos a 10 cm detrás de la rejilla frontal**, y **a 5-10 cm de la superficie**, lejos de los bordes. Las operaciones más contaminantes, **hacia el fondo**.
- **No tapar las rejillas.**
- Trabajar sobre **paños absorbentes empapados en desinfectante**.
- **Evitar las llamas**: el mechero **altera el flujo y daña el filtro**. En su lugar, **asas desechables** o **microincineradores**, colocados **al fondo**.
- Tras meter material nuevo, **esperar 2-3 minutos**. Cuanto más material dentro, **más turbulencias**.
- **Una sola persona** trabajando en la cabina.

**Después:**

- Dejar que el aire siga circulando **unos minutos**.
- **Desinfectar el material antes de sacarlo**, y retirar los residuos.
- Apagar, **cerrar la abertura frontal** y **encender la lámpara UV**, si la hay.
- **La cabina no es un almacén.**

**Descontaminación:**

- **Desinfección y limpieza tras cada uso.**
- **Descontaminación por gas o vapor**, normalmente con **peróxido de hidrógeno vaporizado**, que hace **personal competente**:
  - **antes de moverla** de sitio;
  - al **cambiar de agente** de trabajo;
  - tras un **derrame** que llegue a partes inaccesibles;
  - **antes de los ensayos de los filtros** y de **cambiarlos**.

---

## 6. Control y mantenimiento, en una tabla

Resumen de los anexos F y G de la guía Eurachem (2023). El control de equipos se desarrolla en el **tema 17**.

| Equipo | Comprobación | Mantenimiento |
| --- | --- | --- |
| **Estufas y baños** | Límites de estabilidad y **homogeneidad** al principio y tras reparación o traslado; **temperatura a diario o en cada uso** | Estufas: **limpiar y desinfectar cada mes**. Baños: **vaciar, limpiar, desinfectar y rellenar cada mes**, o cada 6 meses con biocida |
| **Jarras y estufas de anaerobiosis** | **Indicador en cada uso** | Limpiar y desinfectar la jarra **tras cada uso** |
| **Centrífugas** | **Tacómetro calibrado, anual** | **Revisión anual**; **limpiar y desinfectar en cada uso** |
| **Cabinas de seguridad** | Rendimiento al principio, **anual** y tras reparación o traslado; **control microbiológico semanal**; **flujo en cada uso** | **Revisión completa anual** |
| **Cabinas de flujo laminar** | Rendimiento al principio y tras cambios; **placas de esterilidad semanales** | Revisión anual |
| **Microscopios** | **Alineación a diario o en cada uso** | **Revisión completa anual** |

---

## 7. Cuadro de cifras

| Cifra | Dónde |
| --- | --- |
| **Aumento total = ocular × objetivo**; 10 × 100 = **1000×** | Microscopio |
| **AN = n · sen α**; ***d* = 0,61 λ / AN** | Resolución |
| AN máxima: **0,95 en seco, 1,2 en agua, 1,4 en aceite** | Objetivos |
| Aceite de inmersión: **n = 1,515**, como el vidrio | Objetivo de 100× |
| Límite de resolución óptica: **0,20-0,25 µm** | Microscopio óptico |
| **Aumento útil = 500-1000 × AN** | Por encima, aumento vacío |
| Cubreobjetos: **0,17 mm** | Objetivos |
| Micrómetro objetivo: **1 mm en 100 divisiones de 10 µm** | Calibración |
| Estufa de **20-40 °C: ± 1 °C**; de **40 °C o más: ± 0,5 °C** | Guía británica, 2017 |
| **No más de 6 placas** por pila | Estufa |
| Estufa de ciclo: subida **en 30 min** | De 30 a 44 °C |
| Microaerofilia: **5-7 % O₂, ~10 % CO₂** | *Campylobacter* |
| Nevera **5 ± 3 °C**; congelador **−20 ± 5 °C** | Frío |
| **FCR = 1,118 × 10⁻⁵ · r · N²** (r en cm, N en rpm) | Centrífuga |
| **Doble de rpm = cuatro veces la FCR** | Centrífuga |
| Centrífuga de sobremesa: **200-6000 rpm** | Centrífuga |
| Rotura de tubo: **esperar 30 min**; desinfectante **24 h**; tubos intactos, **60 min** | OMS |
| HEPA **H14: 99,995 %** a **0,3 µm** | Cabinas |
| Entrada: **I 0,7-1 m/s**; **II ≥ 0,38 m/s**; **III ≥ 0,7 m/s** con un guante quitado | NTP 1202 |
| Descendente (clase II): **0,25-0,4 m/s** | NTP 1202 |
| Clase III: **≥ 200 Pa** de presión negativa | NTP 1202 |
| Cabina: arrancar **5-10 min**, barrido **3-5 min**, esperar **2-3 min** tras meter material | NTP 1202 |
| Trabajar **≥ 10 cm** tras la rejilla y a **5-10 cm** de la superficie | NTP 1202 |
| Instalación: **30 cm** detrás y a los lados, **45 cm** encima | NTP 1202 |
| Certificación de la cabina: **al menos anual** | NTP 1202 |

---

## 8. Puntos críticos para el examen

1. **Aumento total = ocular × objetivo.** El de **100×** es el de **inmersión**, y con ocular de 10× da **1000×**.
2. **La resolución depende de la AN y de λ, no del aumento.** Por encima de 1000 × AN el aumento es **vacío**.
3. **El aceite de inmersión (n = 1,515) iguala el índice del vidrio y sube la AN.** Solo con el objetivo de inmersión, y se limpia al acabar.
4. Con los objetivos de **40× y 100×**, **solo el micrométrico**.
5. **Campo oscuro**, **contraste de fases** y **DIC**: muestras **vivas sin teñir**. **Fluorescencia**: fluorocromos e **inmunofluorescencia** (*Cryptosporidium*). **Electrónico**: no sirve para material vivo; el **MET** ve el interior y el **MEB** la superficie.
6. **Estufa: ± 1 °C hasta 40 °C y ± 0,5 °C por encima.** Termómetro en **glicerol**, **dos lecturas al día**, perfil de temperatura, **no más de 6 placas** por pila.
7. La estufa a **22 °C necesita refrigeración.** Los **baños**, con **agua destilada agitada** y el contenido **por debajo del nivel**.
8. **FCR en g, no en rpm**: **1,118 × 10⁻⁵ · r · N²**. Doblar las rpm cuadruplica la fuerza.
9. **Centrífuga:** **equilibrar** con tubos opuestos e iguales, **tubos tapados**, **cubetas de seguridad abiertas en cabina**. Si se rompe un tubo, **30 minutos cerrada**.
10. **Cabina de flujo laminar ≠ cabina de seguridad biológica**: la primera **solo protege el producto**.
11. **Clase I:** persona y ambiente. **Clase II:** además el producto, con **flujo laminar descendente**. **Clase III:** estanca, con **guantes** y **dos HEPA en serie** a la salida, para el **grupo 4**.
12. **HEPA:** retiene partículas, **no gases ni vapores**. **Sin mechero en la cabina**: asas desechables o microincinerador.

---

## Dudas declaradas

1. **Tema sin precedente.** Ningún examen analizado ha preguntado estos equipos. El nivel de detalle es una estimación, y se ha priorizado lo que tiene cifra y fuente citable.
2. **Norma UNE-EN 12469:2001 no consultada directamente**, porque es de pago. Las cifras de las cabinas (velocidades, 200 Pa, ensayos) están tomadas de la **NTP 1202 del INSST (2024)**, que la resume. Los **tipos A1 a C1** son de la norma estadounidense **NSF/ANSI 49**, también citada por la NTP. En la tabla 2 de la NTP, las velocidades se han **leído a la vista en la página renderizada**, porque la extracción de texto las descolocaba.
3. **Tolerancias de estufas y baños.** Las cifras (± 1 °C, ± 0,5 °C, 6 placas, 30 minutos en las estufas de ciclo) son de la guía británica de laboratorios de aguas (**Standing Committee of Analysts, 2017**). Las normas ISO 7218 e ISO 8199, que tratan lo mismo, son de pago y **no se han consultado**. Cada método analítico fija además su propia temperatura y su tolerancia.
4. **Centrífugas.** Las normas de uso y el protocolo de rotura (**30 minutos**, **24 h**, **60 minutos**) se han leído en el *Laboratory Biosafety Manual* de la **OMS, 2.ª edición revisada (2003)**. La 3.ª edición en español (2005) no se ha podido descargar para cotejarla. La 4.ª edición (2020) confirma el equilibrado y el uso obligado de las cubetas de seguridad cuando existen. **La obligación para los grupos 3 y 4 es del texto de 2003.**
5. **La constante de la FCR** se ha **deducido**: (2π/60)² / 980,665 = 1,118 × 10⁻⁵. Algunos textos la redondean a 1,12 × 10⁻⁵ y dan fórmulas equivalentes con el diámetro o con el radio en mm.
6. **Rotores basculantes y de ángulo fijo.** La OMS los menciona («portacubetas» y *angle head rotors*) sin describirlos. La descripción del apunte es la general del equipo.
7. **Ficha de apoyo (BIO_05).** Afirma que la «temperatura fisiológica» de incubación es **35-37 °C**. **No se ha encontrado fuente** que lo formule así, y **no se incluye**: el apunte da las temperaturas de trabajo de los laboratorios de aguas.

---

## Fuentes y verificación

- **Cabinas:**
  - **NTP 1202 del INSST (2024)**, leída **entera**; la tabla 2, a la vista en la página renderizada;
  - **Guía técnica del INSST (2024)** para la diferencia entre cabina de seguridad y de flujo laminar y para el apéndice 8;
  - **RD 664/1997, anexo IV**.
- **Estufas, baños, centrífugas y microscopio, uso y control:**
  - **SCA (2017)**, apartados 5.3, 5.13, 5.16, 5.18, 5.21, 5.22, 5.26 y 5.30;
  - **Eurachem (2023)**, apartado 9 y anexos F y G.
- **Óptica del microscopio:**
  - **Abramowitz, *Microscope Basics and Beyond*** (Olympus, 2003): partes, inscripciones y código de colores de los objetivos, aceite de 1,515, fórmulas de resolución, AN máximas, aumento útil y límite de 0,20-0,25 µm;
  - **Nikon MicroscopyU**, contrastado: AN = n · sen α, *d* = 0,61 λ / AN, aumento útil 500-1000 × AN.
- **Tipos de microscopio:** **OpenStax Microbiology**, apartado 2.3.
- **Centrífugas, seguridad:** **OMS**, ediciones de 2003 y 2020.
- **Exámenes:** barrido de todos los cuestionarios con plantilla y sin ella, el 30/09/2026. Las plantillas citadas son las de **PLANTILLAS.md**.
- **ANALISIS.md:** su corrección de *Legionella* (**10 días**, no 44 ± 4 h) se aplica en «Lo que ya ha caído». La del filtro de membrana (**80 colonias**) no toca este tema.
- **Fecha de verificación:** 30 de septiembre de 2026.
