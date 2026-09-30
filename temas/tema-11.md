---
tema: 11
titulo: "Equipo básico del laboratorio de microbiología II: Hornos y autoclaves. Esterilización. Desinfección. Tratamiento de materiales contaminados. Preparación del material para cultivo."
parte: Parte segunda
estado: aprobado
verificado: 2026-09-30
fuentes:
  - "INSST: Guía técnica de agentes biológicos, actualización de 2024: apéndice 4 (gestión de residuos sanitarios) y apéndice 5 (procedimientos de descontaminación). La tabla 2 de germicidas y la figura 1 se han leído a la vista en las páginas renderizadas."
  - "OMS, Laboratory Biosafety Manual, 2.ª ed. revisada (2003): capítulo 14 (desinfección y esterilización) y manejo de residuos."
  - "Standing Committee of Analysts (Reino Unido): «The Microbiology of Water and Associated Materials (2017) — Practices and Procedures for Laboratories», apartados 4.3, 5.1, 5.5, 5.6, 5.8, 5.9, 5.10, 5.25, 5.28, 6.6 y 6.7."
  - "Ministerio de Sanidad: «Unidad central de esterilización. Estándares y recomendaciones» (2011), apartado 3.8, control de la esterilización."
  - "Decreto 29/1995, de 21 de febrero, de la Diputación General de Aragón, de gestión de los residuos sanitarios, con las modificaciones del Decreto 52/1998 (texto actualizado del Gobierno de Aragón). Vigente según aragon.es, consultado el 30/09/2026."
  - "25 Pa. Code § 252.404 (Pensilvania, EE. UU.), control de calidad de los laboratorios de microbiología de aguas: tiempos de autoclave por tipo de material."
  - "OpenStax, «Microbiology» (2016), apartados 13.1 y 13.2: terminología, valor D, autoclave, filtración y radiaciones."
  - "ExamenesAnteriores/PLANTILLAS.md y cuestionarios de otras plazas. Plantillas de 1521 y 1736 leídas por píxeles el 30/09/2026."
  - "Ficha de apoyo temas/apoyo/tema-11.md (TEMARIO EXTRA), usada solo como guion; ninguna afirmación sale de ella."
---

## Lo que ya ha caído

**Nuestra plaza lo ha preguntado dos veces, y las dos por el autoclave:**

| Examen | Lo que pedía | Respuesta oficial |
| --- | --- | --- |
| **1322 #19** | Para esterilizar **por calor húmedo** se utiliza… | **b) Autoclave** (los distractores eran el **horno Pasteur**, que es calor seco, y el baño de ultrasonidos) |
| **1246 #33** | Descontaminar el material del laboratorio de microbiología por autoclavado | **b) Como mínimo 30 minutos a 121 °C** (plantilla provisional; los distractores, 60 y 10 minutos) |

**Otras plazas del Ayuntamiento:**

| Examen | Lo que pedía | Respuesta |
| --- | --- | --- |
| **1736 #21** (con plantilla) | Dónde se recogen los residuos cortantes o punzantes | **c) Contenedores rígidos, impermeables y a prueba de perforaciones** |
| **1521 #15** (con plantilla) | Inconveniente del hipoclorito, la cloramina T y el dicloroisocianurato como productos de limpieza | **a) Se inactivan en presencia de materia orgánica** |
| 1486 #11 (sin plantilla) | Principal objetivo de la desinfección del agua | **Destruir o inactivar los microorganismos patógenos**, no la totalidad de los organismos, que sería esterilizar |
| 1521 #42 (con plantilla) | Tipo de biocida de los desinfectantes del vaso de una piscina | **c) Tipo 2**, «desinfectantes utilizados en los ámbitos de la vida privada y de la salud pública». Es de piscinas: aquí basta saber qué es un biocida |

Las respuestas de 1736 y 1521 se han leído por píxeles en sus plantillas. Como control del lector, la 1736 #44 sale «a», igual que la plantilla ya transcrita.

**La lección:** el autoclave es la pieza central, con sus **cifras**: **121 °C**, **15 minutos** para esterilizar una carga limpia y **30 minutos como mínimo** para **descontaminar** material contaminado.

---

## 1. Conceptos

| Término | Definición (Guía técnica del INSST, 2024) |
| --- | --- |
| **Limpieza** | Eliminación **mecánica por arrastre** de restos orgánicos e inorgánicos, con **detergentes** o limpiadores enzimáticos. Es **requisito previo imprescindible** de la desinfección y de la esterilización |
| **Descontaminación** | Eliminación, inactivación o destrucción de microorganismos para hacer algo **seguro** de manipular, usar o eliminar. Se consigue **limpiando, desinfectando o esterilizando**, según el grado buscado |
| **Desinfección** | Proceso físico o químico que destruye microorganismos, **pero no las esporas bacterianas** |
| **Esterilización** | Proceso físico, químico o mixto que destruye **todas las formas** de microorganismos viables, **incluidas las esporas** |
| **Desinfectante** | Agente que destruye o inhibe microorganismos en fase vegetativa, pero no las esporas. Se aplica **solo sobre objetos o superficies inanimados** |
| **Antiséptico** | Sustancia que destruye o inhibe microorganismos y se aplica **sobre tejidos vivos** sin lesionarlos |
| **Germicida** | Todo agente que destruye microorganismos. Incluye **antisépticos y desinfectantes** |
| **Biocida** | Sustancia o mezcla que destruye, contrarresta, neutraliza o controla organismos nocivos **por medios que no sean la mera acción física o mecánica** |

**La esterilidad es una probabilidad.** Nunca se puede asegurar que no quede nada. Un producto se considera **estéril** cuando la probabilidad de encontrar una unidad contaminada es **≤ 10⁻⁶**: una por cada millón.

**Otros términos:**

- **-cida y -stático.** Un tratamiento **-cida** mata (bactericida, fungicida, viricida). Uno **-stático** solo **detiene el crecimiento** (bacteriostático).
- **Valor D (tiempo de reducción decimal).** El tiempo que tarda un tratamiento en matar el **90 %** de la población, es decir, en **reducirla un logaritmo**. Como la muerte microbiana es **logarítmica**, una carga inicial mayor necesita más tiempo.

**Cómo se elige el método.** Primero, por el uso del objeto:

| Objeto | Contacto | Qué necesita |
| --- | --- | --- |
| **Crítico** | Tejidos estériles o sangre | **Esterilización** |
| **Semicrítico** | **Mucosas** o piel no intacta | **Desinfección de nivel alto** |
| **No crítico** | **Piel intacta** | Limpieza o desinfección de bajo nivel |

Cuentan también la **resistencia del microorganismo**, la **compatibilidad del material** y la **peligrosidad** del agente para las personas y el ambiente. **El material del laboratorio de microbiología** (pipetas, placas, medios) **se esteriliza**, y es **el método de descontaminación de los residuos**.

![Resistencia de los microorganismos y método que basta](esquema:resistencia-descontaminacion)

**Orden de resistencia**, de más a menos:

1. **esporas bacterianas** y **quistes de protozoos** (*Giardia*, *Cryptosporidium*);
2. **micobacterias** y **virus sin envoltura**;
3. **hongos**;
4. **bacterias vegetativas** y **virus con envoltura**.

Los **priones** son aún más resistentes y tienen tratamiento propio (apartado 4.5).

---

## 2. Esterilización

### 2.1. Calor húmedo: el autoclave

**Principio:**

- **Vapor de agua saturado, a presión y sin aire.**
- El calor húmedo **penetra mejor que el seco** y es **el método más eficaz y fiable**.
- La presión permite pasar de 100 °C. **Lo que mata las esporas es la temperatura alcanzada, no la presión en sí.**
- A 121 °C el autoclave trabaja a unos **15-20 psi**, cerca de **una atmósfera por encima de la atmosférica**.

**Tiempos de contacto mínimos** (Guía técnica del INSST):

| Temperatura | 115 °C | **121 °C** | 126 °C | **134 °C** |
| --- | --- | --- | --- | --- |
| Tiempo de contacto | 30 min | **15 min** | 10 min | **3 min** |

![Temperatura y tiempo de esterilización: vapor y calor seco](esquema:binomios-esterilizacion)

**Tiempo de contacto no es lo mismo que el ciclo entero.** El tiempo empieza **cuando toda la carga está a la temperatura**, no cuando la alcanza la cámara. El ciclo tiene cinco fases:

1. calentamiento;
2. **purga del aire** con vapor libre;
3. subida hasta la temperatura;
4. **mantenimiento**;
5. **enfriamiento**.

**Tipos de autoclave:**

| Tipo | Cómo saca el aire | Uso |
| --- | --- | --- |
| **De desplazamiento por gravedad** | El vapor empuja el aire, más pesado, **hacia abajo** y fuera | **121 °C, 15 min**. Materiales limpios **no porosos y sin envolver**, **medios** y **descontaminación de residuos**. No sirve para tubos largos ni cargas porosas |
| **De prevacío** | Una bomba **extrae el aire antes** de meter el vapor | Hasta **134 °C, 3 min**. Ideal para cargas **porosas** y envueltas, pero **no para líquidos**, por el vacío |
| **Olla a presión** | Calienta agua en la base y expulsa el aire por arriba | Solo si no hay otra cosa. **No es aceptable la que solo tiene manómetro** (Eurachem) |

**Ciclos habituales en el laboratorio de aguas** (guía británica, 2017):

- **Medios de cultivo:** muchos, **121 °C durante 15 min**; otros, **115 °C durante 10 min**. Se sigue la ficha del fabricante: calentar de más **degrada** los nutrientes y los agentes selectivos, y **un medio no se autoclava dos veces**.
- **Tolerancias típicas:** **± 3 °C** y **± 3 minutos** en un ciclo de 15 minutos.
- **Material contaminado para descontaminar:** **121 °C, como mínimo 30 minutos** (1246 #33). Es más que para esterilizar material limpio, porque la carga es grande y el vapor tarda en penetrarla.

**Cómo se carga y se usa:**

- **No sobrecargar**, y dejar que el vapor **circule** entre los objetos.
- **No autoclavar juntos el material contaminado y los medios.**
- **Tapones y roscas flojos**, un **cuarto de vuelta** en los frascos de rosca. Con el tapón apretado, **el frasco puede estallar**.
- **Frascos no llenos del todo.**
- Bolsas y recipientes que **dejen pasar el vapor**.
- **Nunca autoclavar soluciones con alcohol**: los frascos que lo llevan se etiquetan para que no acaben en el autoclave por error (OMS).

**Al abrirlo:**

- **Esperar a que la cámara baje de 80 °C**. Si no tiene enclavamiento, cerrar antes la llave de vapor.
- Ojo: **el contenido puede seguir por encima de esa temperatura**, y los líquidos **sobrecalentados** pueden hervir de golpe.
- Abrir **con guantes térmicos y pantalla facial**.

**Lo que lleva y lo que se revisa:**

- Al menos una **válvula de seguridad**, purga, regulador de temperatura, **temporizador, sonda y registrador**.
- Es un **aparato a presión**: **inspección anual** de seguridad.
- El filtro del desagüe de la cámara se limpia **a diario**.

### 2.2. Calor seco: el horno (horno Pasteur)

**Aire caliente, a temperaturas altas y durante más tiempo** que el vapor. **Tiempos de contacto** según la Guía técnica del INSST:

| Temperatura | 160-169 °C | 170-179 °C | 180-190 °C |
| --- | --- | --- | --- |
| Tiempo de contacto | 120 min | 60 min | 30 min |

**Para qué sirve:**

- **Material de vidrio y de metal**, limpio y seco.
- **Líquidos no acuosos** que el vapor no atraviesa: **aceites, grasas, parafinas, glicerol**, cremas.
- Lo que el vapor **dañaría**.

**Para qué no:** para lo que **no aguanta más de 160 °C**. Tampoco para descontaminar residuos: la OMS **desaconseja el calor seco** para eso, por su **variabilidad**.

**Cómo se trabaja:**

- El material entra **limpio**.
- Se protege en **portapipetas o envuelto** en papel de aluminio o papel kraft.
- Se deja **enfriar dentro del horno**.
- El horno lleva termostato, **registro de temperatura** y temporizador, y cada carga se anota.
- Hay **tubos indicadores** que cambian de color si se alcanzó la temperatura.
- **Guantes de protección térmica.**

**Calor seco directo:**

- **Flamear el asa** de siembra al rojo es calor seco por incineración, pero **salpica y genera aerosoles**. Mejor **asas desechables** o un **microincinerador**. **Nunca mechero en la cabina de seguridad** (tema 10).
- La **incineración** destruye todo. Es el destino final de muchos residuos (apartado 5).

### 2.3. Esterilización química a baja temperatura

Para el material **sensible al calor y al vapor**.

| Método | Rasgos |
| --- | --- |
| **Óxido de etileno** | Su inconveniente principal es que es **tóxico**: irrita piel y mucosas, afecta al sistema nervioso y es **cancerígeno de categoría 1B**. El ciclo dura **8-12 horas**, sobre todo por la **aireación** posterior |
| **Peróxido de hidrógeno en gas plasma** | El plasma se forma con radiofrecuencia o microondas. Deja **oxígeno y agua**: **no necesita aireación**. Unos **75 min** a **37-44 °C** |
| **Líquidos por inmersión** (glutaraldehído, ácido peracético) | **Último recurso**: son difíciles de controlar, el material se **recontamina** al aclarar y secar, y **no se puede almacenar** estéril |

### 2.4. Radiaciones y filtración

**Radiación ionizante (rayos gamma, ⁶⁰Co):**

- **Esteriliza** material sensible al calor y **atraviesa envases**.
- Así se esterilizan las **placas de Petri y asas desechables de plástico**, además de antibióticos, vacunas o alimentos.

**Radiación ultravioleta:**

- Es **desinfección, no esterilización**.
- Actúa sobre todo entre **240 y 280 nm**: destruye el ADN formando **dímeros de timina**.
- **Penetra poco**: no atraviesa el vidrio ni el plástico, y la frenan la suciedad y la **distancia**.
- Sirve para el **aire** y las **superficies**: lámparas de las cabinas, cabinas de UV para **desinfectar embudos de filtración** entre usos.
- Según la guía británica, las cabinas de UV inactivan coliformes, *E. coli* y enterococos, pero con **las esporas de *Clostridium perfringens*** hacen falta condiciones más exigentes, y hay que **verificarlo**. Las lámparas se cambian **cada año**.

**Filtración:**

- **Separa** los microorganismos, sin matarlos.
- Para **líquidos termolábiles**, como soluciones de **antibióticos** o **vitaminas**, se usan membranas de **0,2 µm**, más pequeñas que una bacteria media, de 1 µm. **No retienen los virus.**
- Para el **aire**, filtros **HEPA** (tema 10).

---

## 3. Control de la esterilización

**Todo proceso de esterilización se controla con tres tipos de indicador** (Ministerio de Sanidad):

| Indicador | Qué es | Qué dice |
| --- | --- | --- |
| **Físico** | Termómetro, manómetro, reloj y **registro** del propio equipo, más sondas externas (termopares) | Que el equipo alcanzó los parámetros. **Útil, pero no basta**: no ve lo que pasa dentro de una carga grande o sucia |
| **Químico** | Tintas que **cambian de color**. Seis clases, de la **I** (indicador de proceso, como la **cinta testigo**) a la **VI** (emuladores) | Que el paquete **pasó por el proceso**. La cinta **no garantiza la esterilidad**: no mide el tiempo |
| **Biológico** | **Esporas muy resistentes**, que tienen que **morir todas** | **El único que demuestra la esterilización** |

**Indicadores biológicos:**

| Proceso | Espora | Incubación | Frecuencia |
| --- | --- | --- | --- |
| **Vapor** (y plasma o formaldehído) | ***Geobacillus stearothermophilus***, antes *Bacillus stearothermophilus* | **55 °C** | **Semanal**, tras una reparación, y con cargas de implantes |
| **Óxido de etileno** | ***Bacillus atrophaeus***, antes *B. subtilis* | **37 °C** | **En cada ciclo** |

- Hoy se usan **viales autocontenidos**: se rompe la cápsula de caldo sobre las esporas y, **si crecen, el indicador de pH cambia de color**. Se leen en **24-48 h**; los de lectura rápida, antes, por **fluorescencia**.
- El indicador va en el **centro** de un paquete de prueba, **en el peor punto de la carga**.

**Prueba de Bowie-Dick:**

- Comprueba que el autoclave **de prevacío saca todo el aire** y el vapor penetra de forma rápida y uniforme.
- Se hace **a diario, antes del primer ciclo**, y **tras una avería o reparación**.
- Si sale mal, **se repite**. Si se confirma, **se para el equipo** y se avisa a mantenimiento.

**Validación del autoclave:**

- Los **ciclos y las configuraciones de carga se validan al principio** y tras reparaciones, con **termopares** en varios puntos.
- **Cada ciclo** queda **registrado**, con su temperatura, su tiempo y su contenido.

---

## 4. Desinfección

### 4.1. Niveles

| Nivel | Qué destruye | No destruye | Uso |
| --- | --- | --- | --- |
| **Alto** | **Todas las formas vegetativas** | Las esporas (salvo en tiempos largos, en los que algunos son esterilizantes). Tiempos cortos, **10-30 min** | **Instrumentos** semicríticos, **no superficies** |
| **Medio (intermedio)** | Bacterias vegetativas, **bacilos de la tuberculosis**, virus lipídicos, algunos no lipídicos y la mayoría de los hongos | Esporas | **Superficies de trabajo** |
| **Bajo** | Bacterias vegetativas (**no** el bacilo de la tuberculosis), virus lipídicos, algunos no lipídicos y algunos hongos | Esporas y micobacterias | Superficies y objetos no críticos |

**Qué influye en la eficacia:**

- la **cantidad y el lugar** de los microorganismos, y si forman **biopelículas**;
- su **resistencia**;
- la **materia orgánica** presente, que **inactiva** los desinfectantes y **protege** a los microbios;
- la **concentración**, la **temperatura** y el **tiempo de contacto**;
- el **pH** y la **dureza del agua** con que se diluye.

**El procedimiento tiene tres pasos:**

1. **limpiar** antes;
2. aplicar el desinfectante **en su concentración, temperatura y tiempo**;
3. **aclarar** los restos.

**La desinfección química no sustituye a la esterilización** ni debe ser una rutina sin objetivo. Además, hay que **tener un método para verificar** su eficacia.

### 4.2. Desinfección por agentes físicos

- **Térmica:** agua caliente a **70 °C durante 30 minutos**. Destruye los patógenos, **no las esporas**.
- **Hervir** no garantiza matar todo, pero sirve como **desinfección mínima** cuando no hay otra cosa. Se usa, por ejemplo, para **desinfectar embudos de filtración** entre usos.
- **Radiación UV:** apartado 2.4.
- **Microondas** a **2450 MHz**: el factor crítico es **el calor** que producen.

### 4.3. Los germicidas químicos

Tabla 2 de la Guía técnica del INSST:

| Agente | Concentración y tiempo | Uso | Lo que hay que saber |
| --- | --- | --- | --- |
| **Hipoclorito sódico (lejía)** | **1000 ppm (0,1 %), 10 min**: nivel alto. **5000 ppm (0,5 %), 5 min**: esporicida. **500-1000 ppm, 30 min**: ambiental | Superficies, derrames, material sin metal | **Se inactiva rápidamente con la materia orgánica** (1521 #15). Es **muy inestable**: renovar las diluciones **a diario**. **Corroe** metales. **Con ácidos o amonio libera cloro o cloraminas**; con formaldehído forma un **cancerígeno** |
| **Alcohol etílico** | **60-95 %, 2 min** | **Antiséptico**; superficies y equipos | Se inactiva con materia orgánica. **Inflamable**. Endurece gomas. **No destruye esporas** |
| **Glutaraldehído** | **2 % (20 °C), 20 min**. **Esporicida: 10 h** | Nivel alto, instrumentos **sensibles al calor** | Hay que **activarlo** (alcalinizarlo). **Estable 14 días**. Coagula la sangre y fija tejidos, así que hay que limpiar antes. **Irritante y sensibilizante**: cubeta tapada y extracción |
| **Ortoftalaldehído** | **0,55 %, 10 min** | Nivel alto | Mancha piel y ropa. Estable 14 días |
| **Peróxido de hidrógeno** | **6-7,5 %, 30 min** | Nivel alto; **esterilizante químico** | Irritante. Ataca metales, gomas y plásticos |
| **Ácido peracético** | **0,35 %, 5 min** (10 min para esterilizar) | Nivel alto; esterilizante químico | Diluciones inestables, **unas 24 h** |
| **Formaldehído** | **8 %**; esporicida en 18 h | Muy limitado | **Cancerígeno** (H350). Se usa sobre todo para **fumigar locales** |
| **Yodo y yodóforos** | Soluciones alcohólicas al 1 % | **Antisépticos** | Se inactivan con materia orgánica. **Tiñen**. Poco aptos como desinfectantes |
| **Compuestos fenólicos** | 20 min | Superficies y material no poroso | **En desuso** |
| **Amonio cuaternario** | — | **Nivel bajo** y detergente | Inactivados por la materia orgánica y los **detergentes aniónicos**. **Pueden crecer bacterias** en sus soluciones |

**La lejía en la práctica** (OMS):

- Desinfectante general de laboratorio: **1 g/L** de cloro activo (**0,1 %**).
- Para **derrames** y con mucha materia orgánica: **5 g/L** (**0,5 %**).
- La lejía doméstica, de **50 g/L**, se diluye **1:50** para 1 g/L y **1:10** para 5 g/L.
- **Nunca se mezcla con ácidos**, por el gas cloro, y **se usa con ventilación**.

**El alcohol en la práctica** (OMS):

- Es más eficaz hacia el **70 %** que puro.
- Contacto: **3 minutos o más** en superficies y **10 segundos** en la piel.
- **No deja residuo.**

### 4.4. Desinfección de locales

Solo suele hacer falta en **niveles de contención 3 y 4**: tras un derrame grave, antes de sacar equipos grandes o antes de trabajos de mantenimiento.

- **Fumigación con formaldehído**, generado al calentar **paraformaldehído**:
  - local **sellado**;
  - **21 °C o más** y **70 % de humedad relativa**;
  - contacto de **al menos 6 horas** según el INSST, **8 horas** según la OMS;
  - **neutralización con carbonato o bicarbonato amónico** y ventilación.

  Es **muy peligroso**: se trabaja **en parejas** y con protección respiratoria.
- **Peróxido de hidrógeno vaporizado:**
  - es el **sustituto más seguro**: se descompone en oxígeno y agua y **no necesita aireación**;
  - **no es compatible con la celulosa** y puede **corroer la electrónica**;
  - su eficacia se comprueba con **tiras de esporas**.

### 4.5. Priones

**Resisten** los métodos convencionales, físicos y químicos.

- Lo que no se va a reutilizar se **incinera por encima de 800 °C**.
- Lo reutilizable se limpia a fondo y después:
  - **hipoclorito sódico al 2 % (20 000 ppm) durante 1 hora**;
  - o **hidróxido sódico 2N** durante 1 hora;
  - o **autoclave de prevacío a 134-138 °C durante 18 minutos**.
- **No usar alcohol ni aldehídos**, porque **fijan las proteínas** y estabilizan los priones.
- La **radiación** es **ineficaz** contra ellos.

---

## 5. Tratamiento de materiales contaminados

### 5.1. El principio

**Todo material infeccioso se descontamina, se autoclava o se incinera dentro del laboratorio** (OMS). **El autoclave de vapor es el método preferente** de descontaminación.

**Categorías de la OMS:**

| Material | Qué se hace |
| --- | --- |
| **No contaminado** | Se reutiliza, se recicla o va a la basura general |
| **Objetos cortantes y punzantes contaminados** | Contenedor **resistente a la perforación**, con tapa; se tratan como infecciosos |
| **Contaminado reutilizable** | **Se autoclava primero y se lava después**. **No se limpia antes** de autoclavarlo |
| **Contaminado desechable** | En **bolsas autoclavables** estancas: se autoclava y se elimina |
| **Para incineración directa** | Si hay incinerador bajo control del laboratorio |

**Objetos cortantes y punzantes:**

- **Contenedores rígidos, impermeables y a prueba de perforaciones** (1736 #21).
- **Nunca se llenan del todo**: hasta el **80 %** según el INSST, las **tres cuartas partes** según la OMS.
- **Las agujas no se reencapuchan** ni se separan de la jeringa.

**En cada puesto de trabajo:**

- **Recipientes con desinfectante preparado cada día**, en los que el material queda **en contacto completo**, sin burbujas.
- Después, el desinfectante y los recipientes **se autoclavan**.

**En un laboratorio de aguas** (guía británica): salvo que trabaje con muestras clínicas o con agentes del **grupo 3**, suele bastar con **autoclavar** los residuos y eliminarlos embolsados. En Aragón manda además el decreto del apartado siguiente.

### 5.2. Los residuos sanitarios en Aragón (Decreto 29/1995)

**Se aplica a los centros sanitarios** y también a los **centros de investigación, análisis y experimentación y a los laboratorios que manipulen agentes biológicos** (art. 3).

**Grupos (art. 2):**

| Grupo | Qué es |
| --- | --- |
| **I. Asimilables a urbanos** | Sin contaminación específica: papel, cartón, oficinas, cocina |
| **II. Sanitarios no específicos** | Material de curas, yesos, ropa y material de un solo uso **manchado de sangre o secreciones**. Precauciones **solo dentro** del centro |
| **III. Sanitarios específicos o de riesgo** | **Infecciosos**, **cortantes y punzantes**, **cultivos y reservas de agentes infecciosos**, restos de animales infectados, **más de 100 mL** de sangre o líquidos corporales, restos anatómicos humanos |
| **IV. Cadáveres y restos humanos de entidad** | Policía sanitaria mortuoria |
| **V. Químicos** | Residuos peligrosos por su contaminación química |
| **VI. Citostáticos** | Restos de citostáticos y lo que ha estado en contacto con ellos |
| **VII. Radiactivos** | Los retira **ENRESA** |

**Los cultivos de un laboratorio de microbiología son del grupo III.**

**Envases, etiquetas y plazos (arts. 5 a 8 y 11):**

| Qué | Cómo |
| --- | --- |
| **Grupo II** | **Bolsas verdes** de polietileno, de **galga 69**, dentro de otras verdes de galga 200. **Sin rótulo** |
| **Grupo III** | Envases **rígidos o semirrígidos**, estos de **60 litros como máximo**, o **bolsas de galga 400 o más** y **80 litros como máximo**. **Color rojo** y rótulo **«Residuos de riesgo»** |
| **Cortantes y punzantes** | Envases de **libre sustentación**, **resistentes a la perforación**, opacos e impermeables. Se meten **enseguida** |
| **Citostáticos** | Rótulo **«Material contaminado químicamente. Citostáticos»** |
| **Mezclas** | **Prohibido mezclar grupos**, salvo meter el II con el III. Entonces todo se trata **como grupo III** |
| **Transporte interno** | Al almacén **cada 12 horas como máximo** |
| **Almacén central** | **72 horas como máximo**. **Una semana** si está **refrigerado por debajo de 4 °C**. Los **cortantes, un mes** |
| **Tratamiento del grupo III** | **Esterilización en autoclave de vacío** (vacío, vapor saturado, vacío), con las bolsas **rotas en el primer vacío**, llenado **por debajo de dos tercios** y **registro** de vacío, temperatura y tiempo en cada ciclo. **Se esteriliza con sus envases antes de ir al vertedero** |
| **Documentos** | **Documento de control y seguimiento**, que se guarda **5 años**, y **declaración anual antes del 1 de marzo** |

**En la clasificación estatal** (Ley 7/2022 y lista europea de residuos), un residuo es peligroso por **«HP 9, infeccioso»** si contiene microorganismos viables, o sus toxinas, que causan enfermedad:

- **18 01 03\***: residuos cuya recogida y eliminación **exigen requisitos especiales para prevenir infecciones**. Es **peligroso**, y lo marca el asterisco.
- **18 01 04**: residuos que **no los exigen**, como vendajes, ropa o pañales.

---

## 6. Preparación del material para cultivo

**El material de vidrio:**

- **Sin grietas ni desconchones**, **limpio** y **libre de sustancias inhibidoras**: un resto de detergente o de cloro puede **impedir el crecimiento** que se quiere contar.
- Se lava con **detergente**, se **aclara** a fondo y se **seca**. Los lavavajillas de laboratorio pueden incluir un **aclarado con agua purificada** o un aclarado ácido o alcalino.
- Los **lavavajillas de laboratorio** no sirven para el **material volumétrico calibrado**, por el estrés térmico.
- La limpieza se comprueba **a la vista**, y con **pH** si hubo un aclarado ácido o alcalino.
- Las normas estadounidenses de laboratorios de aguas piden además una **prueba de residuos inhibidores** con cada lote nuevo de detergente, y una **comprobación mensual del pH** con **azul de bromotimol**.
- **El material volumétrico calibrado nunca se esteriliza por calor**, porque **pierde la calibración** (tema 22).

**Envolver y esterilizar:**

- Las **pipetas**, en **portapipetas** (latas).
- Lo demás, envuelto en **papel kraft** o **papel de aluminio**, dejando que **el vapor llegue** al material.
- Se esteriliza en **autoclave** o, el vidrio y el metal, en **horno**.
- **Los embudos de filtración** se esterilizan **antes de cada uso** en autoclave, o se desinfectan entre usos hirviéndolos, con vapor o con UV. También hay **unidades estériles de un solo uso**.

**Guardar:** protegido del **polvo** y de roturas, para que siga estéril hasta usarlo.

**El plástico estéril de un solo uso** es una alternativa aceptable:

- **Placas de Petri** de plástico, esterilizadas por radiación, que **se usan una vez, se autoclavan y se desechan**.
- Las **de vidrio** se reutilizan: **esterilizar, lavar y volver a esterilizar**.
- Tamaños: **50-60 mm** para la **filtración por membrana**; **90 mm** para recuentos, resiembras y confirmaciones.

**Los medios** (tema 12):

- Se esterilizan **en las 2 horas siguientes a su preparación**.
- Con los **tapones aflojados**.
- **Sin volver a autoclavarlos** para fundirlos: se funden en baño de agua hirviendo, con vapor o en microondas a baja potencia.

---

## 7. Cuadro de cifras

| Cifra | Dónde |
| --- | --- |
| **121 °C, 15 min**; 134 °C, 3 min; 126 °C, 10 min; 115 °C, 30 min | Autoclave, tiempo de contacto (INSST) |
| **121 °C, 30 min como mínimo** | Descontaminación de material contaminado (1246 #33) |
| Medios: **121 °C 15 min** o **115 °C 10 min**; tolerancia **± 3 °C, ± 3 min** | Guía británica |
| **160 °C 120 min; 170 °C 60 min; 180 °C 30 min** | Calor seco (INSST) |
| Abrir el autoclave **por debajo de 80 °C** | OMS |
| Autoclave a 121 °C: **15-20 psi** | Presión |
| Esterilidad: probabilidad **≤ 10⁻⁶** | INSST |
| **Valor D**: muere el **90 %** | Cinética |
| Óxido de etileno: ciclo de **8-12 h**; plasma: **75 min a 37-44 °C** | Baja temperatura |
| UV: **240-280 nm** | Desinfección |
| Filtración de líquidos: **0,2 µm** | Esterilización por filtración |
| *G. stearothermophilus*: vapor, **55 °C**, **semanal**; *B. atrophaeus*: óxido de etileno, **37 °C**, **cada ciclo** | Indicadores biológicos |
| Bowie-Dick: **a diario**, antes del primer ciclo | Autoclave de prevacío |
| Hipoclorito: **1 g/L** general; **5 g/L** derrames (OMS). **1000 ppm 10 min**; **5000 ppm 5 min** esporicida (INSST) | Lejía |
| Alcohol: **60-95 %, 2 min** (INSST); óptimo **~70 %** (OMS) | Alcohol |
| Glutaraldehído **2 %, 20 min**; esporicida **10 h**; estable **14 días** | Nivel alto |
| Térmica: **70 °C, 30 min** | Desinfección |
| Formaldehído en locales: **≥ 21 °C, 70 % HR** | Fumigación |
| Priones: **> 800 °C**; hipoclorito **2 %, 1 h**; **134-138 °C, 18 min** | Priones |
| Cortantes: llenar hasta el **80 %** | Contenedores |
| Aragón: transporte interno **≤ 12 h**; almacén **72 h** (1 semana a < 4 °C; cortantes 1 mes); documentos **5 años**; declaración antes del **1 de marzo** | Decreto 29/1995 |
| Grupo III: envases **rojos**, rígidos **≤ 60 L**, bolsas **galga ≥ 400, ≤ 80 L**; grupo II: bolsas **verdes galga 69** | Decreto 29/1995 |
| Medios: esterilizar en **≤ 2 h** | Preparación |
| Placas: **50-60 mm** filtración; **90 mm** recuentos | Preparación |

---

## 8. Puntos críticos para el examen

1. **Calor húmedo = autoclave; calor seco = horno Pasteur** (1322 #19).
2. **Autoclave: 121 °C, 15 minutos** para esterilizar. **Para descontaminar material contaminado, 30 minutos como mínimo** (1246 #33).
3. **Esterilización destruye también las esporas; desinfección no.** El antiséptico es para tejidos vivos; el desinfectante, para objetos.
4. **Lo que mata es la temperatura del vapor, no la presión.** Prevacío: 134 °C, porosos, **no líquidos**.
5. **Tapones flojos, no sobrecargar, no mezclar medios con material contaminado, no autoclavar alcohol.** Abrir por debajo de 80 °C, con guantes y visor.
6. **Horno: 160 °C 2 h, 170 °C 1 h, 180 °C 30 min.** Para vidrio, metal y aceites; no para lo que no aguante 160 °C.
7. **Controles:** físico, químico (la cinta **no garantiza la esterilidad**) y **biológico con *Geobacillus stearothermophilus*** para el vapor. **Bowie-Dick a diario** en el prevacío.
8. **Resistencia:** esporas > micobacterias y virus sin envoltura > hongos > bacterias vegetativas y virus con envoltura. Los priones, aparte.
9. **El hipoclorito se inactiva con la materia orgánica** (1521 #15), es inestable y **no se mezcla con ácidos ni con amoniaco**.
10. **Limpiar antes de desinfectar o esterilizar**, salvo el material infeccioso reutilizable, que **se autoclava antes de lavarlo**.
11. **Cortantes en contenedores rígidos, impermeables y a prueba de perforaciones** (1736 #21), llenos hasta el 80 % como mucho.
12. **Aragón:** los cultivos son **grupo III**, en **envase rojo**, con **«Residuos de riesgo»**, almacén **72 h** como máximo y tratamiento en **autoclave de vacío**.

---

## Dudas declaradas

1. **Los 30 minutos del 1246 #33.** La respuesta oficial es de una **plantilla provisional**. Las guías del INSST y de la OMS dan **15 minutos a 121 °C** para esterilizar una carga bien colocada, y no fijan un tiempo específico para residuos. La única fuente encontrada con la cifra de **30 minutos para material contaminado** es una norma estadounidense de laboratorios de aguas (25 Pa. Code § 252.404, derivada del manual de certificación de la EPA). El apunte da los 30 minutos como respuesta de examen y explica por qué es más largo.
2. **Discrepancias de tiempos entre fuentes.** El apunte sigue siempre la **guía del INSST**:
   - a **115 °C**: 30 min según el INSST, **25 min** según la OMS;
   - en el **calor seco**: el INSST da la tabla del apunte; la OMS, «160 °C o más durante 2-4 h»; la guía británica, 160-180 °C «normalmente una hora»; la norma estadounidense, 170-180 °C durante 2 h;
   - en la **fumigación con formaldehído**: 6 horas según el INSST y 8 según la OMS.
3. **Micobacterias en la figura de resistencias.** La figura 1 de la guía del INSST las coloca en la franja de la **desinfección de nivel alto**, pero su propia definición del **nivel medio** dice que este ya destruye **los bacilos de la tuberculosis**. La figura del apunte reproduce la de la guía, y la tabla de niveles, sus definiciones.
4. **La presión del autoclave** (15-20 psi) está tomada de OpenStax. No se ha encontrado en las fuentes españolas consultadas. Las normas de los esterilizadores (UNE-EN 285, UNE-EN 13060, UNE-EN ISO 17665 y 11140, ISO 11138) son **de pago** y no se han leído: solo se citan a través del documento del Ministerio.
5. **Decreto aragonés 29/1995.** La página del Gobierno de Aragón lo da como **vigente**, con la modificación de 1998. Es anterior a la Ley 7/2022 y cita leyes ya derogadas, como la 20/1986. Un plan autonómico nuevo (GIRAPEC 2025-2030) está en tramitación y podría cambiar la gestión.
6. **Tipos de biocida (1521 #42).** Esa pregunta es de piscinas. El nombre «desinfectantes utilizados en los ámbitos de la vida privada y de la salud pública» es el que usa el RD 742/2013. El Reglamento (UE) 528/2012 **no se ha consultado** para comprobar la denominación actual del tipo 2.
7. **Ficha de apoyo (BIO_03).** No cita ninguna norma. Nada del apunte sale de ella.

---

## Fuentes y verificación

- **Guía técnica del INSST (2024):**
  - apéndices 4 y 5, **leídos enteros**;
  - la tabla 2 (germicidas) y la figura 1 (resistencias), **a la vista** en las páginas renderizadas, porque el texto extraído las descolocaba.
- **OMS (2003):** capítulo 14 y apartado de residuos.
- **Guía británica de laboratorios de aguas (2017):** autoclave, horno, filtración, mecheros, vidrio, lavavajillas, hervidores, cabinas de UV, esterilización de medios y placas.
- **Ministerio de Sanidad (2011):** control de la esterilización.
- **Decreto 29/1995:** texto actualizado del Gobierno de Aragón, arts. 1 a 18. La vigencia se ha comprobado en aragon.es.
- **Exámenes:** plantillas de 1246 y 1322 (PLANTILLAS.md); 1736 y 1521 leídas por píxeles, con la 1736 #44 como control.
- **ANALISIS.md:** su corrección del filtro de membrana (**80 colonias**) no toca este tema; se aplicará en los temas 13 y 18.
- **Fecha de verificación:** 30 de septiembre de 2026.
