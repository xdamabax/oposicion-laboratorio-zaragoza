---
tema: 12
titulo: "Medios de cultivo. Componentes básicos y preparación. Técnicas de siembra. Técnicas de aislamiento. Conservación de cepas."
parte: Parte segunda
estado: aprobado
verificado: 2026-10-01
fuentes:
  - "Standing Committee of Analysts (Reino Unido): «The Microbiology of Water and Associated Materials (2017) — Practices and Procedures for Laboratories», apartado 6 (medios de cultivo: tipos, componentes, agar, almacenamiento, preparación, agua, esterilización, vertido, filtración de suplementos, control de calidad, cultivos de referencia) y apartado 7.2."
  - "Standing Committee of Analysts: «The Microbiology of Drinking Water (2020) — Part 7», recuento de bacterias heterótrofas por siembra en profundidad y en superficie. Partes 5 (enterococos) y 6 (clostridios sulfitorreductores) para la composición de sus medios."
  - "Eurachem: «Accreditation for Microbiological Laboratories», 3.ª ed. (2023), apartado 8.6, anexo B (cultivos de referencia) y glosario."
  - "CDC (EE. UU.), programa formativo de microbiología: «Basic Culture Media and Isolation Techniques — 4 Quadrant Streak», transcripción del vídeo."
  - "OpenStax, «Microbiology» (2016): 9.1 (recuento en placa), 9.6 (medios de cultivo) y 13.2 (refrigeración, congelación y liofilización)."
  - "EPA (EE. UU.), Method 1103.2 (2023), E. coli por filtración en membrana: intervalo de 20-80 colonias por filtro."
  - "ExamenesAnteriores/PLANTILLAS.md: 1233 (1.ª y 2.ª prueba), 1246 y 1322 (1.º y 2.º ejercicio)."
  - "Ficha de apoyo temas/apoyo/tema-12.md (TEMARIO EXTRA), usada solo como guion; ninguna afirmación sale de ella."
---

## Lo que ya ha caído

**Es de los temas más preguntados de la microbiología.** Directamente, en nuestra plaza:

| Examen | Lo que pedía | Respuesta oficial |
| --- | --- | --- |
| **1322 #21** | Medios que permiten crecer al microorganismo diana e **inhiben** a los demás | **a) Medios selectivos** (distractores: reductores, complejos) |
| **1322 #27** | El método más usado para obtener un **cultivo puro** | **c) La siembra por agotamiento** (distractores: en superficie con asa de Digralsky, por vertido) |
| **1233, 2.ª prueba, #11** | El **recuento de colonias a 22 °C** en agua se hace por… | **a) Siembra en profundidad** (distractores: en superficie, filtración, agotamiento) |
| **1322, 2.º ejercicio, #12** | Los medios para ***E. coli*** contienen… | **a) Un sustrato para la β-galactosidasa y otro para la β-glucuronidasa** |
| **1233 #14** | La **especificidad** de un medio de cultivo | **b) Que los microorganismos no diana no presentan las mismas características visuales que los diana** |

**Con los medios concretos del agua**, que se desarrollan en el tema 18:

| Examen | Lo que pedía | Respuesta oficial |
| --- | --- | --- |
| 1233, 2.ª prueba, #12 | Medio para **enterococos** | **d) Slanetz y Bartley** |
| 1233, 2.ª prueba, #13 | Color de *E. coli* en **agar CCA** | **a) De azul oscuro a violeta** |
| 1246 #39 | Colonias **verdes o azules** en **agar CN** | **b) *Pseudomonas aeruginosa*** |
| 1246 #31 | Colonias esperadas en un filtro de membrana de 47 mm | **c) 80 colonias** (**no 100**, que es el distractor: corrección de ANALISIS.md) |

Las lecciones:

- **Hay que saber la clasificación de los medios**: selectivo, diferencial, de enriquecimiento.
- **Hay que distinguir las técnicas de siembra y para qué sirve cada una**: la de agotamiento, para aislar; la de profundidad, para contar heterótrofos.
- **Conviene reconocer los agentes selectivos típicos.** Las opciones falsas del 1322 #12 son en sí un catálogo: azida y tetrazolio, metabisulfito y cicloserina, cetrimida y ácido nalidíxico.

---

## 1. Encuadre

| Materia | Tema |
| --- | --- |
| Esterilización del material y de los medios en autoclave | **11** |
| Recuento: diluciones, filtración por membrana y número más probable | **13** |
| Tinciones y examen microscópico | **14** |
| Identificación bioquímica, serológica y genética | **16** |
| **Control de calidad de los medios** (norma UNE-EN ISO 11133) | **17**. Aquí solo lo básico |
| Los métodos concretos del agua: medios, temperaturas, confirmaciones | **18** |

---

## 2. Qué es un medio de cultivo y cómo se clasifica

**Medio de cultivo:** preparado que aporta los **nutrientes** y las condiciones para que los microorganismos crezcan en el laboratorio.

**Formatos en que se compra** (guía británica):

- **completo**, deshidratado en polvo;
- **incompleto**, al que se añade un **suplemento**, como un antibiótico;
- **ingredientes sueltos**, para preparar el medio;
- **suplementos**, que **mejoran el crecimiento** (sangre de caballo), sirven **para diagnóstico** (urea) o **hacen selectivo** el medio (kanamicina);
- **listo para usar**, en tubos, frascos o placas.

### 2.1. Por su consistencia

| Tipo | Agar | Uso |
| --- | --- | --- |
| **Líquido (caldo)** | Sin agar | Crecimiento general, enriquecimiento, tubos del NMP |
| **Sólido** | **1,2-1,5 %** | Placas: colonias que se cuentan, se distinguen y se aíslan |
| **Semisólido** | **0,7-0,8 %** | Por ejemplo, ensayos con bacteriófagos |

### 2.2. Por su composición

- **Químicamente definido:** se conoce **la composición exacta** y la cantidad de cada componente.
- **Complejo:** lleva **extractos y digeridos** de levadura, carne o plantas, así que su composición exacta **no se conoce** y varía. Ejemplos: el **caldo nutritivo**, el caldo de triptona y soja (TSB) y el de infusión de cerebro y corazón.

### 2.3. Por su función

| Tipo | Qué hace | Ejemplo |
| --- | --- | --- |
| **General (no selectivo)** | Deja crecer a la mayoría de las bacterias | **Agar o caldo nutritivo**, TSB, **agar de extracto de levadura** para heterótrofos |
| **Enriquecido** | Añade factores de crecimiento, vitaminas y nutrientes para los **microorganismos exigentes** | Con **sangre** |
| **Selectivo** | **Deja crecer al microorganismo diana e inhibe a los no diana** (1322 #21) | **Agar MacConkey**: las **sales biliares** y el **cristal violeta** inhiben a muchas grampositivas |
| **Diferencial** | Permite **distinguir** microorganismos por una característica fisiológica o bioquímica, por el color de la colonia o del medio | **MacConkey**: las que fermentan la **lactosa** dan **colonias rosas**, por el indicador **rojo neutro** |
| **De enriquecimiento** | Normalmente **líquido**: frena a los no diana y, al final de la incubación, **el diana supera en número** a los demás | **Caldo Rappaport** para ***Salmonella*** |

**Un medio puede ser selectivo y diferencial a la vez**, como el **agar XLD** para *Salmonella* o el MacConkey. Así son casi todos los medios del laboratorio de aguas.

**Enriquecido no es lo mismo que de enriquecimiento:**

- el **enriquecido** añade nutrientes para que crezcan los **exigentes**;
- el **de enriquecimiento** favorece al diana frente a los **competidores**.

### 2.4. Agentes selectivos y diferenciales del laboratorio de aguas

| Medio | Selectivo por | Diferencial por | Diana |
| --- | --- | --- | --- |
| **Agar de enterococos (mEA), tipo Slanetz y Bartley** | **Azida sódica**, que inhibe a los coliformes y a la mayoría de los gramnegativos | **Cloruro de trifeniltetrazolio (TTC)**: se reduce a **formazán rojo**, y dan **colonias rojas, granates o rosas** | **Enterococos** (1233, 2.ª prueba, #12) |
| **Agar triptosa sulfito cicloserina (TSC)** | **D-cicloserina** | **Metabisulfito sódico**: la reducción del sulfito da **colonias negras** | **Clostridios sulfitorreductores** y *C. perfringens* |
| **Agar cromogénico de coliformes (CCA)** | — | **Sustratos cromogénicos** de la **β-galactosidasa** y la **β-glucuronidasa** | ***E. coli*: de azul oscuro a violeta**; coliformes: rosa a rojo (1233, 2.ª prueba, #13; 1322, 2.º ejercicio, #12) |
| **Agar CN** | **Cetrimida** y **ácido nalidíxico** | Pigmento | ***Pseudomonas aeruginosa*: colonias verdes o azules** (1246 #39) |

Los medios del agua se diseñan para **recuperar microorganismos estresados**: por eso su control de calidad es tan importante (apartado 4.4).

---

## 3. Componentes básicos

Casi todos los medios de rutina aportan **carbono, nitrógeno, vitaminas y minerales**.

| Componente | Qué es y qué aporta |
| --- | --- |
| **Peptonas** | **Extracto acuoso o digestión enzimática de carne**. Aportan nitrógeno y aminoácidos |
| **Triptona** | **Digestión enzimática de la caseína**. Es **rica en triptófano**, precursor del **indol** (la prueba de confirmación de *E. coli*) |
| **Extracto de levadura** | **Hidrólisis ácida de levadura**. Aporta vitaminas y factores de crecimiento |
| **Extracto de carne** e **hidrolizado de caseína** | Nutrientes complejos |
| **Peptona micológica** | Peptona especial para **hongos** |
| **Agar** | **Polisacárido extraído de algas**. Solidifica el medio (apartado 3.1) |
| **Cloruro sódico** | Equilibrio osmótico. Lo lleva, por ejemplo, el caldo nutritivo |
| **Azúcares e indicadores de pH** | La **lactosa** con un indicador (rojo neutro, rojo de fenol) delata la **fermentación**, porque el ácido cambia el color |
| **Agentes selectivos** | Sales biliares, cristal violeta, **azida**, **antibióticos**, lauril sulfato sódico |
| **Sustratos cromogénicos o fluorogénicos** | Revelan una enzima concreta por el color o la fluorescencia |
| **Agua** | **Destilada, desionizada o de ósmosis inversa** (apartado 3.2) |

**Dos medios de ejemplo:**

- **Caldo nutritivo:** extracto de carne 1 g, extracto de levadura 2 g, peptona 5 g, NaCl 5 g, agua 1 L; **pH 7,4 ± 0,2** ya estéril.
- **Agar de extracto de levadura** (recuento de heterótrofos): extracto de levadura 3 g, peptona 5 g, **agar 12 g**, agua 1 L; **pH 7,2 ± 0,2**.

### 3.1. El agar

- Se usa entre el **1,2 y el 1,5 %**. Con un agar más puro basta el **1 %**, y las placas salen más claras.
- **Solo se disuelve del todo al llevarlo a ebullición**, y **gelifica hacia los 42 °C** al enfriarse.
- Esa diferencia es la que permite **mezclarlo con la muestra a 45 °C** sin que cuaje (siembra en profundidad).
- Si no se disuelve o no se mezcla bien, el gel queda **blando**: puede **caerse al invertir la placa** o quedar con grumos.

### 3.2. El agua

**El agua del grifo no se usa nunca**, por dos razones:

- sus iones de calcio o fosfato **enturbian o precipitan** el medio;
- puede llevar **cloro** o **metales tóxicos**, como el cobre de las tuberías, que **inhiben** el crecimiento.

**El agua para medios debe cumplir tres condiciones:**

- **sin metales tóxicos ni cloro**;
- **conductividad baja**, idealmente **menos de 10 µS/cm**;
- **pocos microorganismos**: recuento a 22 °C idealmente **por debajo de 1000 ufc/mL**, y **nunca por encima de 10 000**.

---

## 4. Preparación

### 4.1. Almacenar el medio deshidratado

- En **lugar fresco y seco**, con la fecha de **recepción** y la de **apertura** en la etiqueta. Al abrirlo, el laboratorio le asigna su propia **fecha de caducidad**.
- Los polvos son **higroscópicos**: el envase se **cierra bien**.
- **Si el medio se apelmaza o cambia de color, se desecha**, aunque no haya caducado.

### 4.2. Preparar y esterilizar

1. **Pesar** el medio y añadir el volumen de **agua destilada o desionizada**. Los polvos con agentes selectivos se manejan con **protección respiratoria**.
2. **Ajustar el pH antes de esterilizar**, con HCl o NaOH (por ejemplo, 1 M). **Después de esterilizar no se ajusta**, por el riesgo de contaminarlo. El autoclave puede **bajar el pH**, por ejemplo al descomponer la lactosa. Por eso a veces se sube **0,2-0,4 unidades** antes, para que el pH final quede en su valor.
3. **Disolver del todo.** El polvo sin disolver **se carameliza** en el fondo. **Los medios con agar se llevan a ebullición antes de repartirlos**: el agar sin disolver se va al fondo y no se reparte bien.
4. **Repartir** en frascos llenos **como mucho a dos tercios**, por ejemplo 300 mL en un frasco de 500. **No más de 500 mL** por frasco de un litro: los volúmenes grandes tardan en calentarse y pueden no esterilizarse bien.
5. **Esterilizar en las 2 horas siguientes** a la preparación (tema 11):
   - 121 °C 15 min, o 115 °C 10 min, según el medio;
   - con los **tapones aflojados**;
   - **sin reautoclavar**.

   Algunos medios muy selectivos solo se llevan a ebullición.
6. **Los suplementos termolábiles** (antibióticos, algunos azúcares) se esterilizan **por filtración a 0,2 µm**, con filtro de jeringa hasta unos 100 mL, y se añaden al medio **ya enfriado a unos 50 °C**.

### 4.3. Verter las placas y guardarlas

- **Enfriar el agar a unos 50 °C**, en estufa o en baño, antes de verterlo. **Más caliente, condensa demasiado** en la placa. Tampoco se deja mucho tiempo a 50 °C, porque se degrada.
- Verter sobre una **superficie plana, limpia y desinfectada**:
  - **20-25 mL** en las placas de **90 mm**;
  - **unos 10 mL** en las de **50-60 mm**;
  - espesor de **3 a 7 mm**. Con menos, el medio **se seca**.
- **Dejar solidificar, invertir** la placa y **guardarla a 5 ± 3 °C**, protegida de la desecación. Se etiqueta con el **medio, el lote y la caducidad**.
- **Ni al sol ni más de 2 horas en la mesa:** la luz forma **peróxidos** que inhiben el crecimiento. Se guardan **a oscuras**.
- **Secarlas antes de usarlas:** **2 horas a temperatura ambiente**, no más de 25 °C, o **30 minutos a 37 °C**. La película de agua de la superficie hace que las bacterias **crezcan en velo** por toda la placa y **no se puedan aislar colonias**.
- **Desechar** las placas que se hayan **adelgazado, oscurecido o despegado**, o que tengan signos de contaminación.

### 4.4. Control de cada lote

Lo básico; el desarrollo es del tema 17:

- Cada lote tiene **número de lote**, registro de su preparación y de su esterilización, y queda **en cuarentena** hasta que se demuestra que sirve.
- **pH** de cada lote: dentro de la tolerancia del método, normalmente **± 0,2**. Si no, se desecha.
- **Esterilidad**, **crecimiento** del microorganismo diana con su **aspecto típico**, y **selectividad** frente a los no diana.
- **Control cuantitativo:**
  - la **recuperación** en el medio selectivo debe ser **al menos el 50 %** de la obtenida en uno no selectivo;
  - o se usa la **ratio de productividad** de la ISO 11133: para el GVPC de *Legionella*, **0,7**.

**Las tres características de la ISO 11133**, que son las tres opciones del **1233 #14**:

| Característica | Definición |
| --- | --- |
| **Productividad** | La **tasa de recuperación** de un microorganismo **diana** a partir del medio, en condiciones definidas |
| **Selectividad** | El **grado de inhibición** de un microorganismo **no diana** en un medio selectivo |
| **Especificidad** | La demostración de que los **no diana no presentan las mismas características visuales** que los diana |

---

## 5. Técnicas de siembra

**Todo con técnica aséptica.** Con el tapón en la mano, sin tocar el interior del tapón ni la boca del frasco, y **una pipeta estéril nueva en cada paso**.

Las **diluciones decimales**, 1 volumen de muestra en 9 de diluyente, se hacen con **solución de Ringer a un cuarto** o con **diluyente de máxima recuperación**. Son del tema 13.

![Siembra en profundidad y en superficie](esquema:siembra-profundidad-superficie)

### 5.1. En profundidad (placa vertida)

1. **1 mL** de la muestra, o de su dilución, **en la placa vacía y estéril**, por duplicado y empezando por la más diluida.
2. Encima, **15-20 mL de agar fundido a 45 ± 1 °C**:
   - el agar se mantiene a esa temperatura **4 horas como máximo**;
   - se vierte **en los 120 minutos** siguientes a pipetear la muestra, un plazo validado solo para el agar de extracto de levadura. Para los demás son **20 minutos**.
3. **Mezclar** con movimientos circulares suaves, en un sentido y en el otro, **unos 10 segundos**, sin mojar la tapa.
4. **Dejar solidificar** e **incubar la placa invertida**.

**Las colonias crecen en todo el espesor del agar.**

- **Es la técnica del recuento de heterótrofos a 22 °C** en el agua (1233, 2.ª prueba, #11). Con agar de extracto de levadura se incuba **a 22 °C durante 68 ± 4 h** y **a 37 °C durante 44 ± 4 h**.
- **Inconveniente:** el agar caliente puede producir un **estrés térmico** a las bacterias.

### 5.2. En superficie (extensión)

1. Placa con el agar **ya sólido y seco**.
2. **0,1 mL** de la muestra o de su dilución, por duplicado.
3. **Extender** con una **varilla acodada estéril** de vidrio o plástico (el **asa de Digralsky**), o girando la placa con la varilla quieta.
4. **Dejar que se absorba** e **incubar invertida**.

**Las colonias crecen todas en la superficie.** Con 0,1 mL, **cada colonia equivale a 10 ufc por mililitro**: 97 colonias son 9,7 × 10² ufc/mL (1246 #40, tema 13).

**En las dos técnicas:**

- **Se cuentan las placas con entre 10 y 300 colonias.**
- Si todas tienen más de 300, el resultado es **«más de 300»** en la dilución más alta.
- Se usa lupa o contador para no perder las colonias muy pequeñas.

### 5.3. Por agotamiento en estría

Es la técnica para **aislar** (apartado 6).

![Siembra por agotamiento en cuatro cuadrantes](esquema:agotamiento-cuadrantes)

**Cómo se hace** (procedimiento de los CDC):

1. Rotular la **base** de la placa.
2. Con asa estéril, tomar **una colonia**, sin tocar otras zonas de la placa de origen.
3. Sembrar el **primer cuadrante** con estrías juntas.
4. **Esterilizar el asa** o, si es de plástico, **cambiarla**. **Girar la placa un cuarto de vuelta.**
5. Sembrar el **segundo cuadrante** entrando **unas cuatro veces** en el borde del primero, y **sin volver a él**.
6. En el **tercero**, lo mismo, entrando **dos o tres veces** en el segundo.
7. En el **cuarto**, estrías que se van haciendo más cortas.
8. Incubar según el método.

**En el último cuadrante quedan colonias aisladas**, y cada una procede, en principio, de **una sola célula**.

### 5.4. En medio líquido

Se inocula el caldo con **asa** o con **pipeta**. Es la base de los **tubos del número más probable** y de los **caldos de enriquecimiento** (tema 13).

### 5.5. Filtración por membrana

**Cómo se hace:**

- Un volumen conocido de agua se filtra por una **membrana de 47 mm** y **0,45 µm**; de **0,2 µm** para *Legionella* o *Campylobacter*.
- La membrana se coloca **cara arriba sobre un medio selectivo y diferencial**, en agar o en una almohadilla empapada de caldo.
- Resultado: **ufc por 100 mL**.

**El volumen se elige para que en el filtro crezcan entre 20 y 80 colonias. Por encima de 80, el recuento pierde exactitud** (1246 #31; los distractores eran 100 y 120). Es la cifra corregida en ANALISIS.md. El método es del tema 13.

---

## 6. Técnicas de aislamiento

**El objetivo es un cultivo puro:** **un solo tipo de colonia**, descendiente de una sola célula.

- **Siembra por agotamiento** en placa: **el método más usado para obtener un cultivo puro** (1322 #27). **Una colonia aislada, resembrada, da un cultivo puro.**
- **Medios selectivos y de enriquecimiento:** favorecen al diana cuando es una minoría entre otros microorganismos.
- **Diluciones** y siembra en superficie o en profundidad: con la dilución adecuada, las colonias salen **separadas**.
- **Resiembra (subcultivo):** una colonia aislada se pasa a otra placa o a un caldo para purificarla o para las pruebas de confirmación.
- **Comprobar la pureza:** colonias **todas iguales** en forma y color. Un cultivo mixto muestra varios tipos.

**Placas mal secadas:** el crecimiento invasor tapa la placa, **no se aíslan colonias** y hay que volver a resembrar, lo que retrasa el resultado.

---

## 7. Conservación de cepas

Las cepas se guardan sobre todo para el **control de calidad**: comprobar los medios, validar métodos y vigilar el funcionamiento del laboratorio.

**La cadena de los cultivos de referencia** (Eurachem, 2023, e ISO 11133):

| Eslabón | Qué es |
| --- | --- |
| **Cepa de referencia** | La que viene **directamente de una colección reconocida**, miembro de la WFCC o de la ECCO; por ejemplo, las colecciones británicas NCTC o NCIMB |
| **Reservas de referencia** | Cultivos idénticos, obtenidos **subcultivando una sola vez** la cepa de referencia. Se guardan en **alícuotas congeladas o liofilizadas** |
| **Cultivos de trabajo** | **Subcultivos primarios** de una reserva, para el uso diario |

**Reglas de la cadena:**

- La cepa de referencia **se subcultiva una sola vez** para hacer las reservas, comprobando en paralelo la **pureza** y las pruebas bioquímicas.
- **Una reserva descongelada no se vuelve a congelar.**
- **Los cultivos de trabajo no se subcultivan**, salvo que lo pida el método o se demuestre que no cambian.
- **Nunca sustituyen a las reservas.**
- Los **derivados comerciales** de las cepas de referencia **solo sirven como cultivos de trabajo**.

**Métodos de conservación:**

| Método | Cómo | Para qué |
| --- | --- | --- |
| **Resiembras en medio fresco y refrigeración** | Cultivo en caldo o en placa a **5 ± 3 °C** (una nevera está entre 0 y 7 °C) | **Corto plazo**. El frío **frena** el metabolismo, no lo detiene |
| **Congelación** | A **−20 °C** o, mejor, a **−70 °C** o menos (ultracongelador) | Medio y largo plazo |
| **Perlas criogénicas** | Viales con perlas inoculadas, **por debajo de −20 °C**. Se saca **una perla** con pinzas o asa estériles y el vial **vuelve al frío enseguida** | Reservas de uso frecuente |
| **Nitrógeno líquido** | En un medio con **crioprotector**, a **−196 °C**, o en ultracongelador a **−150 °C** | **Largo plazo** |
| **Liofilización** | Congelación rápida y **vacío**: el agua se va **por sublimación**. Ampollas **selladas** que se guardan **a temperatura ambiente** si están bien envasadas | **Largo plazo**, y para **enviar** cepas |

- Para **reactivar** un liofilizado se añade un poco de **caldo estéril**, se resuspende y se siembra en agar nutritivo.
- **Tras cualquier almacenamiento hay que comprobar la pureza** y que la cepa **conserva sus características**; por ejemplo, que *E. coli* sigue fermentando la lactosa a 37 y a 44 °C.

---

## 8. Cuadro de cifras

| Cifra | Dónde |
| --- | --- |
| Agar **1,2-1,5 %** (1 % si es muy puro); semisólido **0,7-0,8 %** | Medios |
| El agar **se disuelve al hervir** y **gelifica hacia los 42 °C** | Agar |
| Agua para medios: **< 10 µS/cm**; recuento **< 1000 ufc/mL** (nunca > 10 000) | Agua |
| pH típico: **7,2-7,4 ± 0,2**; ajustar **antes** de esterilizar | Preparación |
| Frascos llenos **como mucho a 2/3**; **≤ 500 mL** por frasco de 1 L | Preparación |
| Esterilizar en **≤ 2 h**; 121 °C 15 min o 115 °C 10 min | Preparación |
| Suplementos: **filtración a 0,2 µm**; se añaden a **~50 °C** | Preparación |
| Verter a **~50 °C**; **20-25 mL** en placas de 90 mm; **~10 mL** en 50-60 mm; **3-7 mm** de espesor | Placas |
| Guardar a **5 ± 3 °C**, invertidas y a oscuras; **≤ 2 h** en la mesa | Placas |
| Secar **2 h a ≤ 25 °C** o **30 min a 37 °C** | Placas |
| Recuperación del medio selectivo **≥ 50 %**; productividad del GVPC **≥ 0,7** | Control |
| Profundidad: **1 mL** + **15-20 mL** de agar a **45 ± 1 °C** (≤ 4 h fundido; verter en ≤ 120 min) | Siembra |
| Superficie: **0,1 mL** → cada colonia, **10 ufc/mL** | Siembra |
| Placas válidas: **10-300 colonias** | Recuento |
| Heterótrofos: **22 °C 68 ± 4 h** y **37 °C 44 ± 4 h** | Recuento en agua |
| Filtro de **47 mm**, **0,45 µm** (0,2 µm para *Legionella*); **20-80 colonias**, límite **80** | Filtración |
| Conservación: **5 ± 3 °C**; **−20 °C**; **−70 °C**; **−150 °C**; nitrógeno **−196 °C**; liofilización a temperatura ambiente | Cepas |

---

## 9. Puntos críticos para el examen

1. **Selectivo = deja crecer al diana e inhibe a los demás** (1322 #21). **Diferencial = distingue por el color.** **De enriquecimiento = líquido que deja al diana en mayoría.** **Enriquecido = con nutrientes para los exigentes.**
2. **Cultivo puro → siembra por agotamiento** (1322 #27). Una colonia aislada, resembrada.
3. **Recuento de colonias a 22 °C → siembra en profundidad** (1233, 2.ª prueba, #11): 1 mL en placa vacía y agar a 45 °C.
4. **En superficie: 0,1 mL** sobre agar seco, con el **asa de Digralsky**; cada colonia, 10 ufc/mL.
5. **Se cuentan las placas con 10-300 colonias**; **en filtro de membrana, 20-80, con 80 como tope** (1246 #31).
6. **Medios de *E. coli*: sustratos de β-galactosidasa y β-glucuronidasa** (1322, 2.º ejercicio, #12). En CCA, *E. coli* **azul oscuro a violeta** y coliformes rosas.
7. **Enterococos: Slanetz y Bartley** (azida y TTC → colonias rojas). **Clostridios: TSC** (cicloserina y sulfito → negras). ***Pseudomonas*: CN** (cetrimida y nalidíxico → verdes o azules).
8. **Componentes:** peptonas, **triptona (triptófano → indol)**, extracto de levadura, **agar (algas, gelifica a 42 °C)**, agua destilada, indicadores de pH y agentes selectivos.
9. **El pH se ajusta antes de esterilizar, nunca después.** Nunca agua del grifo.
10. **Las placas se secan antes de sembrar**, se guardan **invertidas a 5 ± 3 °C** y a oscuras.
11. **Especificidad** = los no diana no se parecen a los diana. **Selectividad** = cuánto se inhibe a los no diana. **Productividad** = cuánto se recupera del diana (1233 #14).
12. **Conservación:** la cepa de referencia **se subcultiva una sola vez**; reservas **congeladas o liofilizadas**; **lo descongelado no se recongela**; y hay que **comprobar la pureza** después.

---

## Dudas declaradas

1. **Los 80 colonias del 1246 #31.** La respuesta oficial es de una **plantilla provisional**. La fuente encontrada es el **método 1103.2 de la EPA (2023)**, que da el intervalo **20-80** y un límite superior de 80 colonias por filtro. La norma española de referencia, la UNE-EN ISO 8199, es de pago y **no se ha consultado**.
2. **Agares CCA y CN.** El color de *E. coli* y de los coliformes en CCA, la **cetrimida y el ácido nalidíxico** del CN y el color de *Pseudomonas* están tomados de las **plantillas oficiales** y de las opciones de examen. Sus normas (UNE-EN ISO 9308-1 y UNE-EN ISO 16266) son de pago. Se desarrollan en el **tema 18**. Los medios mEA y TSC sí se han comprobado en los métodos británicos.
3. **ISO 11133.** Las tres definiciones de productividad, selectividad y especificidad salen de las **opciones de la 1233 #14**, que reproducen la norma, y de la guía británica, que la cita. La norma, de pago, no se ha leído.
4. **Lo que no se trata:**
   - la siembra **en picadura** y **en pico de flauta** (tubos inclinados);
   - los **medios de transporte**;
   - la afirmación de la ficha de apoyo de que la **solución salina** es el diluyente más adecuado. Las fuentes consultadas usan **Ringer a un cuarto** y el diluyente de máxima recuperación.

   No se ha encontrado una fuente fiable y gratuita que lo cubra, y se deja para cuando aparezca.
5. **«Asa de Digralsky».** Es el nombre que usa el examen (1322 #27). Las fuentes lo describen como **varilla acodada estéril** de vidrio o plástico.
6. **El plazo de 120 minutos** entre pipetear la muestra y verter el agar está **validado solo para el agar de extracto de levadura**; para el resto, la guía británica fija 20 minutos.
7. **Ficha de apoyo (BIO_02).** No cita fuentes y cubre solo la siembra y el aislamiento. Nada del apunte sale de ella.

---

## Fuentes y verificación

- **Guía británica de laboratorios de aguas (2017):** apartado 6, **leído entero**, y apartado 7.2.
- **Método británico de heterótrofos (2020):** siembra en profundidad y en superficie, incubaciones y recuento.
- **Métodos británicos de enterococos y de clostridios:** composición y fundamento de mEA y TSC.
- **Eurachem (2023):** cultivos de referencia; la figura B.1, **a la vista** en la página renderizada.
- **CDC:** procedimiento de siembra en cuatro cuadrantes.
- **OpenStax Microbiology:** clasificación de los medios, recuento en placa, frío y liofilización.
- **EPA, método 1103.2 (2023):** 20-80 colonias por filtro.
- **Exámenes:** plantillas definitivas de 1233 y 1322 y provisional de 1246 (PLANTILLAS.md).
- **ANALISIS.md:** su corrección (**80 colonias**, no 100) se aplica en el apartado 5.5 y en la pregunta del test. La de *Legionella* (**10 días**) no toca este tema.
- **Fecha de verificación:** 1 de octubre de 2026.
