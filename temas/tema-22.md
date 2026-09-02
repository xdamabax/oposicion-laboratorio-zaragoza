---
tema: 22
titulo: "Análisis volumétrico: Concepto, material y operaciones. Manejo y calibración de material volumétrico. Clases de volumetrías."
parte: Parte segunda
estado: aprobado
verificado: 2026-09-02
fuentes:
  - "UNE-EN ISO 4787:2021 (ratificada por UNE en febrero de 2022), Vidrio y artículos de plástico de laboratorio. Instrumentos volumétricos. Métodos para el ensayo de capacidad y para su uso. Tercera edición: anula y sustituye a la ISO 4787:2010."
  - "UNE-EN ISO 385:2005, Material de vidrio para laboratorio. Buretas (ISO 385:2005)."
  - "UNE-EN ISO 1042:1999, Material de vidrio para laboratorio. Matraces aforados con una línea de enrase."
  - "UNE-EN ISO 648, Material de vidrio para laboratorio. Pipetas aforadas de un trazo."
  - "UNE-EN ISO 835:2007, Material de vidrio para laboratorio. Pipetas graduadas."
  - "UNE-EN ISO 4788:2005, Material de vidrio para laboratorio. Probetas cilíndricas graduadas."
  - "ISO 1773, Material de vidrio para laboratorio. Matraces cónicos de cuello estrecho (Erlenmeyer)."
  - "ISO 1769, Material de vidrio para laboratorio. Código de colores de las pipetas."
  - "UNE-ISO 9297:2013, Calidad del agua. Determinación de cloruros. Valoración de nitrato de plata con cromato como indicador (método de Mohr). Referencia ISO 9297:1989."
  - "UNE-ISO 6059:2014, Calidad del agua. Determinación de la suma de calcio y magnesio. Método titrimétrico con EDTA."
  - "UNE-EN ISO 9963-1:1996, Calidad del agua. Determinación de la alcalinidad. Parte 1: alcalinidad total y compuesta."
  - "UNE-EN 25813:1994, Calidad del agua. Determinación del oxígeno disuelto. Método yodométrico (Winkler)."
  - "UNE-EN ISO 8467:1995, Calidad del agua. Determinación del índice de permanganato."
  - "UNE 77004:2002, Calidad del agua. Determinación de la demanda química de oxígeno (DQO). Método del dicromato. Equivalente a ISO 6060:1989. **ANULADA el 18/01/2024** — se cita solo como ejemplo histórico de valoración por retroceso, no como norma vigente."
  - "VIM. Vocabulario Internacional de Metrología (JCGM 200:2012), ed. española del CEM, 2012. Se aplica el desarrollo hecho en el tema 21."
  - "BIBLIOGRAFÍA TÉCNICA (no consultable en línea, ver «Dudas»): Skoog, West, Holler y Crouch, «Fundamentos de Química Analítica»; Harris, «Análisis Químico Cuantitativo»; Mendham y otros, «Vogel. Análisis Químico Cuantitativo». Son la referencia de los apartados 2.1, 2.3 y 2.5."
---

> **Aviso de fuentes.** Igual que el tema 21, éste no tiene una norma que lo regule y se apoya en dos bloques que no conviene mezclar:
>
> 1. **El material volumétrico sí está normalizado**, y con mucho detalle: UNE-EN ISO 4787 para el ensayo de capacidad y el uso, y una norma por tipo de aparato (385 buretas, 1042 matraces, 648 y 835 pipetas, 4788 probetas). Todo eso se cita con número y año.
> 2. **La química de la valoración** (punto de equivalencia, patrón primario, tipos de volumetría, Mohr / Volhard / Fajans) es **doctrina de los libros de referencia**, no norma.

> **Aviso de vigencia.** La **UNE 77004:2002**, la clásica de DQO por dicromato, **está anulada desde el 18 de enero de 2024**. Aparece en casi todo el material de estudio que circula. Aquí se usa **solo** como ejemplo de valoración por retroceso; como norma de DQO hay que ir al **tema 34** y fijar allí la vigente.

> **Coordinación con el tema 21.** El vocabulario metrológico (calibrar, verificar, ajustar) se desarrolló entero en el 21 y **aquí solo se recuerda**, en el apartado 2.4. La calibración del material volumétrico **se hace pesando agua**: es una gravimetría, así que el 21 es la herramienta con la que se resuelve este apartado.

## 1. Encuadre

El análisis volumétrico determina la cantidad de analito **midiendo el volumen** de una disolución de concentración conocida que reacciona con él. Es el reverso exacto del tema 21: allí la magnitud crítica era la masa y el volumen daba igual; aquí el volumen **es** el resultado, y de ahí que todo el material esté normalizado al detalle.

| Qué regula | Norma o referencia | Lógica |
| --- | --- | --- |
| Qué es y cómo se hace una valoración | Bibliografía de química analítica (Skoog, Harris, Vogel) | **Doctrina técnica**, no norma |
| Cómo se ensaya la capacidad y cómo se usa el material | **UNE-EN ISO 4787:2021** | Ensayo y uso |
| Cómo debe ser cada aparato | **ISO 385** (buretas), **1042** (matraces), **648** y **835** (pipetas), **4788** (probetas) | Requisitos del aparato |
| Vocabulario: calibrar, verificar, ajustar | **VIM** (JCGM 200:2012) — **desarrollado en el tema 21** | Metrología general |
| Métodos volumétricos concretos | UNE-ISO 9297, UNE-ISO 6059, UNE-EN ISO 9963-1, UNE-EN 25813, UNE-EN ISO 8467 | Ensayo normalizado |

## 2. Desarrollo

### 2.1. Concepto

**Valoración o titulación:** se añade poco a poco una disolución de concentración exactamente conocida (**disolución patrón** o **valorante**) sobre un volumen medido de muestra (**alícuota**), hasta que la reacción entre ambos se completa. Del volumen gastado y de la estequiometría sale la cantidad de analito.

#### Punto de equivalencia y punto final

Es la distinción que más se pregunta del apartado:

- **Punto de equivalencia:** el momento **teórico** en que la cantidad de valorante añadida es **estequiométricamente equivalente** a la de analito. Es un concepto, no se observa.
- **Punto final:** el momento **real** en que se detecta un cambio observable (viraje de un indicador, salto de potencial, cambio de conductividad) y se cierra la llave.

La diferencia entre ambos es el **error de valoración**, y se corrige con un **ensayo en blanco**: la misma valoración sin muestra, cuyo volumen se resta.

#### Requisitos de una reacción para servir de base a una volumetría

1. **Estequiometría conocida y única**, sin reacciones secundarias.
2. **Rápida**, para que el punto final no se retrase.
3. **Cuantitativa**, es decir, muy desplazada hacia los productos.
4. Que exista una forma de **detectar el punto final**.

#### Patrón primario

Sustancia de pureza tan alta que su disolución se prepara **por pesada directa** y su concentración se conoce sin necesidad de valorarla contra nada. Requisitos:

- **Pureza elevada y conocida**, y composición definida.
- **Estable**: no higroscópica, no eflorescente, que no se oxide con el aire ni absorba CO₂.
- **Masa molar alta**, para que el error relativo de la pesada sea pequeño.
- **Soluble** en el medio de trabajo.

Ejemplos clásicos: ftalato ácido de potasio, carbonato sódico, dicromato potásico, óxido de arsénico(III), EDTA disódico.

Lo que **no** es patrón primario se prepara de concentración aproximada y se **factoriza** (se normaliza) contra un patrón primario: es el caso del **NaOH** (absorbe CO₂ y humedad), del **HCl** y del **tiosulfato sódico**.

### 2.2. Material

Aquí sí manda el volumen, y por eso el material es **aforado y de clase**. Dos ejes de clasificación que hay que tener claros:

#### «In» y «Ex»: el tipo de ajuste

| Ajuste | Significa | Material |
| --- | --- | --- |
| **In** (TC, *to contain*, «contiene») | El volumen marcado es el que el aparato **contiene** | **Matraz aforado**, probeta |
| **Ex** (TD, *to deliver*, «vierte») | El volumen marcado es el que el aparato **vierte**, descontando la película que queda mojando la pared | **Pipeta**, **bureta** |

Por eso un matraz aforado **nunca se usa para verter** un volumen exacto, y una pipeta **no se sopla**: el fabricante ya descontó lo que queda en la punta.

#### Clases de exactitud

- **Clase A** y **clase AS**: la exactitud alta. La **S** es de *swift*, vertido rápido: son aparatos «Ex» con **tiempo de espera reducido**. En la norma nueva de pipetas aforadas (ISO 648) el tiempo de espera de la clase AS **bajó de 15 a 5 segundos**.
- **Clase B**: los límites de error son **el doble** que los de la clase A/AS.

El material de clase A/AS puede llevar **certificado de lote o individual**; el de clase B, no. La **temperatura de referencia de ajuste es 20 °C**, y va grabada en el aparato junto con la capacidad, la clase y el tipo de ajuste.

#### El material, uno a uno

| Material | Norma | Ajuste | Para qué |
| --- | --- | --- | --- |
| ![Matraz aforado](material:matraz-aforado) | **UNE-EN ISO 1042** | **In** | **Preparar** disoluciones patrón y diluciones a volumen exacto |
| ![Pipeta aforada](material:pipeta-aforada) | **UNE-EN ISO 648** | **Ex** | **Transferir** una alícuota exacta |
| ![Bureta](bureta:12.5) | **UNE-EN ISO 385** | **Ex** | **Añadir y medir** el valorante durante la valoración |
| ![Erlenmeyer](material:erlenmeyer) | **ISO 1773** | **No es material volumétrico** | Recipiente de la valoración: su forma cónica permite agitar sin salpicar |

Cuidado con el **Erlenmeyer**: es de borosilicato 3.3 y de cuello estrecho, pero **su graduación es aproximada**. No mide volumen; solo contiene la reacción. Es un error clásico tratarlo como aforado.

Completan el equipo la **pipeta graduada** (UNE-EN ISO 835, «Ex», mide volúmenes variables, menos exacta que la aforada), la **probeta** (UNE-EN ISO 4788, «In», para volúmenes no críticos) y el **soporte con pinza** para la bureta.

#### La bureta, en detalle

Es el instrumento central del tema y el que más se pregunta.

**Partes:** tubo cilíndrico graduado; **llave** o clave de cierre en la parte inferior, con macho de **PTFE** (desliza sin engrasar) o de **vidrio esmerilado**; **punta** afilada por donde sale el líquido; y el **soporte con pinza** que la mantiene vertical.

**Criterio de lectura — y aquí está la trampa:** en una bureta **el cero está arriba** y la escala **crece hacia abajo**, porque lo que se lee es el **volumen vertido**, no el que queda dentro.

**Franja de Schellbach:** una banda azul sobre fondo blanco grabada en la pared posterior. El menisco la estrangula y forma **dos puntas enfrentadas**; el punto donde se tocan marca la lectura con mucha más nitidez que el borde del menisco a simple vista.

**Tolerancias de la clase AS**, según UNE-EN ISO 385:

| Capacidad | División de escala | Límite de error |
| --- | --- | --- |
| 10 mL | 0,02 mL | ± 0,02 mL |
| 25 mL | 0,05 mL | ± 0,03 mL |
| 50 mL | 0,1 mL | ± 0,05 mL |

En clase B, el doble. Las **microburetas** (tipo Bang) bajan a 2 y 5 mL con división y error de 0,01 mL.

### 2.3. Operaciones

**1. Preparar la disolución patrón.** Si es patrón primario, por pesada directa en balanza analítica y enrase en **matraz aforado**. Si no lo es, de concentración aproximada y después **factorización** contra un patrón primario.

**2. Tomar la alícuota** con **pipeta aforada** y pasarla al **Erlenmeyer**.

**3. Preparar la bureta.** Se lava, se **ambienta** con dos o tres porciones pequeñas del propio valorante (para que el agua residual no lo diluya), se llena por encima del cero y se **purga la burbuja de aire de la punta** abriendo la llave a fondo. Una burbuja que se suelta a media valoración se contabiliza como volumen vertido que no ha reaccionado: es un error **por exceso** del volumen leído.

**4. Enrasar a cero.** Se ajusta el menisco al trazo antes de empezar.

**5. Valorar.** Se añade el valorante agitando sin parar, deprisa al principio y **gota a gota** cerca del final, hasta el viraje del indicador. Conviene lavar las paredes del Erlenmeyer con agua destilada: **no cambia el número de moles**, solo diluye.

**6. Leer.** Y repetir la valoración hasta tener réplicas concordantes.

#### Lectura correcta de la bureta

![Menisco de una bureta de 25 mL entre dos divisiones](bureta:12.35)

- **El menisco se lee por su parte inferior** (en líquidos transparentes que mojan el vidrio, como el agua), a la **altura del ojo**.
- **Error de paralaje:** si se mira desde arriba, la lectura sale **menor** de la real; desde abajo, **mayor**. Se evita poniendo el ojo al nivel del menisco. La franja de Schellbach también lo reduce.
- **Se estima una cifra más allá de la última división.** En una bureta de 25 mL, con divisiones de 0,5 mL, se aprecia hasta la **centésima**; en una de 50 mL, con divisiones de 0,1 mL, hasta **0,05 mL** aproximadamente. La cifra estimada es significativa y se anota.
- El líquido debe escurrir **sin dejar gotas** en la pared: si las deja, la bureta está sucia o engrasada y hay que lavarla.

#### El cálculo

En el punto de equivalencia, los **equivalentes** o los **moles corregidos por la estequiometría** de valorante y analito se igualan:

> **N₁ · V₁ = N₂ · V₂** (en normalidad)
> **a · M₁ · V₁ = b · M₂ · V₂** (en molaridad, con los coeficientes de la reacción)

Y si se ha tomado una alícuota de una disolución preparada en matraz aforado, hay que aplicar el **factor de dilución**: el resultado de la alícuota se multiplica por el cociente entre el volumen del matraz y el de la alícuota.

### 2.4. Manejo y calibración del material volumétrico

#### Recordatorio metrológico

Los tres términos se desarrollaron **en el tema 21, apartado 2.4.4**, con las definiciones literales del VIM. En una línea cada uno:

- **Calibrar** = medir el error frente a patrones, con su incertidumbre. **No toca el aparato.**
- **Verificar** = declarar conforme o no conforme frente a una tolerancia.
- **Ajustar** = modificar el instrumento. En material de vidrio **no cabe**: un matraz aforado no se ajusta, se calibra y se acepta o se descarta.

Ésa es la diferencia práctica con la balanza del tema 21: una balanza **sí** se ajusta; una pipeta, no.

#### Cómo se calibra: UNE-EN ISO 4787

La norma de referencia es la **UNE-EN ISO 4787:2021** (ratificada por UNE en febrero de 2022, tercera edición, anula la ISO 4787:2010). Es la norma de **ensayo de capacidad y uso** del material volumétrico de vidrio y de plástico.

**El método es gravimétrico**, y por eso este tema se apoya en el 21: se pesa el agua que el aparato contiene o vierte y se convierte esa masa en volumen. Intervienen:

- La **masa de agua** pesada, por diferencia.
- La **densidad del agua** a la temperatura del ensayo.
- La **densidad del aire** (corrección por empuje, la misma del tema 21).
- La **densidad de las pesas** de la balanza.
- El **coeficiente de dilatación cúbica** del material, para llevar el resultado a **20 °C**.

El parámetro que se evalúa es el **error de capacidad**: la diferencia entre el volumen real a la temperatura de referencia y el volumen nominal grabado.

#### Manejo y conservación

- **Nunca en estufa ni a la llama:** el calor deforma el vidrio y **descalibra** el aparato de forma permanente. El material volumétrico se seca **al aire** o con arrastre de acetona, nunca en estufa.
- **No medir líquidos calientes**: el volumen se ajustó a 20 °C.
- **Limpieza:** un vidrio limpio se moja de forma uniforme. Si el líquido deja gotas o el menisco sale irregular, hay grasa y la medida no vale.
- **Ambientar** pipeta y bureta con el líquido que van a medir.
- Sopletear o forzar la salida de una pipeta «Ex» **falsea el volumen**.

### 2.5. Clases de volumetrías

#### Por el tipo de reacción

| Clase | Reacción | Valorantes típicos | Indicadores |
| --- | --- | --- | --- |
| **Ácido-base** (neutralización) | Transferencia de protones | HCl, H₂SO₄; NaOH | Fenolftaleína, naranja de metilo, rojo de metilo |
| **Redox** | Transferencia de electrones | KMnO₄, K₂Cr₂O₇, I₂, Na₂S₂O₃ | Almidón (yodometrías), ferroína; el KMnO₄ es **autoindicador** |
| **De precipitación** (argentometría) | Formación de un sólido poco soluble | **AgNO₃** | Cromato potásico (Mohr), Fe(III) (Volhard), indicadores de adsorción (Fajans) |
| **De formación de complejos** (complexometría) | Formación de un complejo estable | **EDTA** | Negro de eriocromo T, murexida |

#### Por la forma de operar

| Tipo | En qué consiste | Cuándo se usa |
| --- | --- | --- |
| **Directa** | El valorante reacciona directamente con el analito | Lo habitual |
| **Por retroceso** (o por exceso y retorno) | Se añade un **exceso conocido** de reactivo y se valora **lo que no ha reaccionado** con un segundo valorante | Reacción lenta, sin buen indicador directo, o analito insoluble o volátil |
| **Indirecta o por desplazamiento** | El analito desplaza una cantidad equivalente de otra sustancia, y es ésa la que se valora | Yodometrías: el analito libera I₂, que se valora con tiosulfato |

> **Núcleo repetido.** *«Valoración por retroceso: se añade un exceso conocido de reactivo y se valora el que no ha reaccionado»* aparece **en las tres convocatorias analizadas** (1233 #19, 1246 #42, 1322 #12). Es de lo más rentable del tema.

#### El cloruro, caso aparte

También es **núcleo repetido**: *«agente valorante del cloruro → nitrato de plata»* (1233 #2, 1246 #28). Hay tres métodos argentométricos, y conviene distinguirlos:

| Método | Cómo | Indicador | Medio | Tipo |
| --- | --- | --- | --- | --- |
| **Mohr** | Valoración **directa** con AgNO₃ | **Cromato potásico** (K₂CrO₄): al acabarse el cloruro, forma **cromato de plata rojizo** | Neutro o ligeramente alcalino | Directa |
| **Volhard** | Se añade **exceso conocido** de AgNO₃ y se valora el sobrante con **tiocianato** (KSCN o NH₄SCN) | Ion **Fe(III)**: da complejo rojo con el SCN⁻ sobrante | **Ácido** | **Por retroceso** |
| **Fajans** | Valoración directa con AgNO₃ | **Indicador de adsorción** (fluoresceína, diclorofluoresceína), que cambia de color al adsorberse en el precipitado | Próximo a neutro | Directa |

El **método de Mohr** es el normalizado para aguas: **UNE-ISO 9297:2013**, de 5 a 150 mg/L de cloruro, ampliable hasta 400 mg/L con una bureta mayor o por dilución.

Fíjate en que **Volhard es a la vez el ejemplo de argentometría y el de valoración por retroceso**: si en el examen cae cualquiera de los dos núcleos repetidos, este método los une.

## 3. Tabla operativa

| Parámetro / analito | Técnica | Norma o referencia | Unidades | Condiciones |
| --- | --- | --- | --- | --- |
| **Cloruro** (agua) | Volumetría de **precipitación** (argentometría), método de **Mohr** | **UNE-ISO 9297:2013** | mg/L | Valorante **AgNO₃**; indicador **cromato potásico**; medio neutro o ligeramente alcalino; campo de 5 a 150 mg/L, ampliable a 400 |
| **Dureza total** (suma de Ca y Mg) | Volumetría de **complejos** (complexometría) | **UNE-ISO 6059:2014** | mg/L de CaCO₃ o mmol/L | Valorante **EDTA**, que forma complejo 1:1; indicador **negro de eriocromo T**; pH ≈ 10 tamponado |
| **Calcio** solo | Complexometría con EDTA | Método clásico | mg/L | Indicador **murexida**, a pH alto, con el magnesio precipitado como hidróxido |
| **Alcalinidad total y compuesta** | Volumetría **ácido-base** | **UNE-EN ISO 9963-1:1996** | mmol/L | Valoración con ácido hasta pH definidos; aplicable directamente hasta 20 mmol/L |
| **Oxígeno disuelto** | Volumetría **redox**, método yodométrico de **Winkler** | **UNE-EN 25813:1994** | mg/L de O₂ | Fijación del oxígeno *in situ* y valoración del yodo liberado; es una volumetría **indirecta o por desplazamiento** |
| **Índice de permanganato** (materia orgánica oxidable) | Volumetría **redox** | **UNE-EN ISO 8467:1995** | mg/L de O₂ | Oxidación con **KMnO₄**; el permanganato es **autoindicador** |
| **DQO** por dicromato | Volumetría **redox**, **por retroceso** | UNE 77004:2002 — **ANULADA el 18/01/2024**; ver tema 34 | mg/L de O₂ | Reflujo con exceso de **K₂Cr₂O₇** en medio sulfúrico y valoración del sobrante con **sulfato de hierro(II) y amonio**, indicador **ferroína** |
| **Cloruro** con interferencias o en medio ácido | Argentometría de **Volhard**, **por retroceso** | Método clásico | mg/L | Exceso conocido de **AgNO₃**, retroceso con **tiocianato**, indicador **Fe(III)**, medio ácido |
| **Capacidad de un matraz, pipeta o bureta** | **Gravimetría** (ver tema 21) | **UNE-EN ISO 4787:2021** | mL a 20 °C | Se pesa el agua contenida o vertida y se convierte a volumen con la densidad del agua, la del aire, la de las pesas y la dilatación del vidrio |

## 4. Puntos críticos para el examen

- **Punto de equivalencia (teórico) ≠ punto final (observado).** La diferencia es el error de valoración, y se corrige con un **blanco**.
- **El agente valorante del cloruro es el nitrato de plata (AgNO₃)** — núcleo repetido en dos convocatorias.
- **Valoración por retroceso: se añade un exceso conocido y se valora lo que NO ha reaccionado** — núcleo repetido en las tres convocatorias.
- **Volhard es argentometría *y* retroceso** a la vez, con tiocianato e indicador de Fe(III), en medio ácido. Mohr es directa, con cromato, en medio neutro.
- **In vs. Ex:** matraz aforado y probeta contienen; pipeta y bureta vierten. **Una pipeta no se sopla.**
- **Clase B = el doble de error que la clase A/AS.** La **S** es de vertido rápido: espera de **5 s** en pipetas aforadas AS (antes 15).
- **La bureta tiene el cero arriba** y la escala crece hacia abajo: se lee el volumen **vertido**.
- **El menisco se lee por abajo y a la altura del ojo.** Mirar desde arriba da lectura **menor**; desde abajo, **mayor**.
- **Franja de Schellbach**: dos puntas enfrentadas que se tocan en la lectura.
- **Purgar la burbuja de la punta** antes de empezar: si se suelta después, el volumen leído sale por exceso.
- **Ambientar** bureta y pipeta con el propio valorante; **lavar las paredes del Erlenmeyer con agua destilada no altera el resultado**.
- **El material volumétrico no se seca en estufa**: el calor lo descalibra.
- **El Erlenmeyer no es material volumétrico**: su graduación es aproximada.
- **Temperatura de referencia: 20 °C**, y la calibración del material volumétrico es **gravimétrica** (UNE-EN ISO 4787).
- **El material de vidrio se calibra, pero no se ajusta.** Ajustar solo cabe en un instrumento que se pueda corregir, como la balanza.
- **Patrón primario:** pureza alta, estable, masa molar alta, soluble. **NaOH no lo es** (absorbe CO₂ y humedad): hay que factorizarlo.
- **KMnO₄ es autoindicador**; en yodometrías el indicador es el **almidón**.
- Tolerancias de bureta clase AS: **25 mL → ±0,03 mL**, **50 mL → ±0,05 mL**.

## Reparto con el tema 21

Se mantiene el acordado al cerrar el tema 21:

| Contenido | Tema 21 | Tema 22 |
| --- | --- | --- |
| Vocabulario metrológico (VIM) | **Desarrollo completo** | **Recordatorio breve** (apartado 2.4) con referencia cruzada |
| Material **no aforado** (vaso, embudo, probeta como material general) | **Allí** | Se menciona de pasada |
| Material **aforado** y Erlenmeyer | — | **Aquí, completos** |
| **Bureta** (partes, enrase, menisco, paralaje, Schellbach, tolerancias) | — | **Aquí, entera** |
| Balanza analítica | **Allí** | Se usa aquí como instrumento de la calibración por pesada |
| **Cloruro** | Por gravimetría (AgCl) | **Por volumetría (Mohr, Volhard, Fajans)** |
| Calibración por pesada de material volumétrico | La técnica (gravimetría) | **La aplicación (UNE-EN ISO 4787)** |

**El puente entre los dos temas** queda explícito en el apartado 2.4: calibrar una pipeta es hacer una gravimetría.

---

## Fuentes y verificación

- **Normas aplicadas:** UNE-EN ISO 4787:2021; UNE-EN ISO 385:2005; UNE-EN ISO 1042:1999; UNE-EN ISO 648; UNE-EN ISO 835:2007; UNE-EN ISO 4788:2005; ISO 1773; ISO 1769; UNE-ISO 9297:2013; UNE-ISO 6059:2014; UNE-EN ISO 9963-1:1996; UNE-EN 25813:1994; UNE-EN ISO 8467:1995. Se cita además la UNE 77004:2002, **anulada**, marcada como tal.
- **Bibliografía técnica** (apartados 2.1, 2.3 y 2.5): Skoog, West, Holler y Crouch; Harris; Mendham y otros (Vogel).
- **Fecha de verificación:** 02/09/2026. Título, año y estado de cada norma comprobados en el catálogo de UNE / AENOR.

### Dudas y limitaciones declaradas

1. **La UNE 77004:2002 está anulada desde el 18/01/2024**, comprobado en el catálogo de UNE. Sigue apareciendo en prácticamente todo el material de estudio y en muchos procedimientos de laboratorio. **No la doy por vigente**: se cita solo como ejemplo de valoración por retroceso. **Cuál es hoy la norma de DQO hay que fijarlo al redactar el tema 34**, y no lo he hecho aquí para no adelantar contenido sin verificar.

2. **Las tolerancias de bureta proceden de un catálogo técnico de fabricante** (Brand/Blaubrand, aparatos certificados conforme a DIN EN ISO 385), **no del texto de la norma**, que es de pago. Los tres valores de la tabla (10, 25 y 50 mL en clase AS) coinciden con los que declara el fabricante para material certificado. Trátalos como muy probables, no como cita normativa.

3. **No he podido confirmar el año de la UNE-EN ISO 648** (pipetas aforadas de un trazo) en el catálogo. Sí está confirmado el dato de fondo —el tiempo de espera de la clase AS bajó de 15 a 5 s en la edición nueva—, pero procede también del catálogo del fabricante. Los años de la 385, 835, 1042, 4787 y 4788 sí están comprobados.

4. **De la UNE-EN ISO 4787:2021 he verificado título, edición, año y que anula la de 2010.** El rango de capacidades que cubre (0,1 a 10 000 mL) y el número mínimo de repeticiones (5 para calibración, 3 para verificación) que circulan en resúmenes **corresponden a la edición de 2010** y no he podido confirmarlos para la de 2021: por eso **no aparecen en el desarrollo**. La lista de magnitudes que entran en el cálculo sí es consistente en todas las fuentes consultadas.

5. **El reactivo de fijación del método de Winkler no se afirma.** Una de las fuentes consultadas lo daba como «sulfato de magnesio», lo que parece un error de transcripción por manganeso. Como no lo he podido verificar contra el texto de la UNE-EN 25813, la tabla operativa dice solo «fijación del oxígeno *in situ*». Conviene cerrarlo al redactar el tema 34 o 35.

6. **Los apartados 2.1, 2.3 y 2.5 no tienen norma detrás.** Son doctrina de química analítica (Skoog, Harris, Vogel), que **no he podido consultar directamente**. Es contenido estable, pero conviene contrastar con el libro la lista de requisitos del patrón primario y la clasificación de los indicadores, que varía algo entre autores.

7. **La ISO 1773 (Erlenmeyer) y la ISO 1769 (código de colores de pipetas) se citan sin año.** He confirmado que existen y a qué se refieren, a través de catálogos de fabricante y distribuidores, pero no su edición vigente ni si hay adopción UNE. El dato que importa para el examen —que el Erlenmeyer **no es material volumétrico**— es independiente de la edición.
