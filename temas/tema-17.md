---
tema: 17
titulo: "El control de calidad en el laboratorio de microbiología. Control de medios. Control de técnicas. Utilización de materiales de referencia. Control de equipos."
parte: Parte segunda
estado: aprobado
verificado: 2026-10-02
fuentes:
  - "Standing Committee of Analysts (Reino Unido): «The Microbiology of Water and Associated Materials (2017) — Practices and Procedures for Laboratories». LEÍDOS: 4.2 (vigilancia ambiental), 5.2 (balanzas), 5.20 (pipetas), 5.26 (termómetros), 6.10 (control de medios: pH, control microbiano, cultivos de referencia, pruebas cualitativas, semicuantitativas y cuantitativas, con las figuras 6.10.1 a 6.10.5 vistas renderizando las páginas 50 y 51 del PDF) y 8 (control interno cualitativo y cuantitativo, gráficos, submuestras duplicadas, índice de dispersión y evaluación externa)."
  - "Eurachem, «Accreditation for Microbiological Laboratories», 3.ª edición (2023), editores B. Magnusson y K. C. Tsimillis. LEÍDOS: 8 (reactivos, medios, materiales y cultivos de referencia), 9 (trazabilidad: calibración y verificación, termómetros, estufas, autoclaves, balanzas, material volumétrico, termocicladores), 10 (verificación y validación de métodos), 12 (incertidumbre), 13 (control interno y ensayos de aptitud) y anexos E (calibraciones) y F (verificaciones)."
  - "US EPA, Method 1103.2 «Escherichia coli in Water by Membrane Filtration Using mTEC», EPA-821-R-23-009 (septiembre de 2023). LEÍDOS: 9 (control de calidad: IPR, OPR, controles positivo y negativo, verificación de colonias, esterilidad de filtros y medios, blancos, variabilidad entre analistas) y 10 (calibración: estufas, termómetros, neveras, pHmetro, balanzas)."
  - "Real Decreto 3/2023, de 10 de enero (agua de consumo): anexo III, parte B (acreditación UNE-EN ISO/IEC 17025 de los métodos), disposición adicional octava (plazos) y anexo III, parte E (validación de métodos; contenido de un procedimiento)."
  - "Para enlazar: temas 10 y 11 (estufas, termómetros, autoclaves e indicadores), 12 (conservación de cepas), 38 (validación e incertidumbre), 39 (gráficos de control X y reglas del Nordtest TR 569) y 40 (ISO 17025 y ENAC)."
  - "ExamenesAnteriores/PLANTILLAS.md: sin preguntas directas de este tema; las cercanas son 1246 #27 y 1322 C2 #6 (ISO 17025 y ENAC, tema 40) y 1322 C2 #10 (material de referencia, anulada, tema 38)."
---

## Lo que ya ha caído

**Nada directo.** En los tres exámenes (1233, 1246 y 1322) **no hay ninguna pregunta** sobre el control de medios, de técnicas o de equipos **en microbiología**. Las más cercanas son de los temas de calidad físico-química:

| Examen | Lo que pedía | Respuesta oficial | Tema |
| --- | --- | --- | --- |
| **1246 #27** | Quién evalúa en España el cumplimiento de la **ISO 17025** | **b) ENAC** | 40 |
| **1322 C2 #6** | Qué es la **ISO 17025** | **b) La norma de los laboratorios de ensayo y calibración** para demostrar su competencia | 40 |
| **1322 C2 #10** | Qué **material de referencia** vale para una determinación en agua de consumo | **Anulada** por el tribunal (en la provisional: el de **la misma matriz** y concentración parecida) | 38 |

Las lecciones:

- **Las preguntas de calidad del tribunal van a lo general:** la norma, quién acredita y cómo se elige un material de referencia. Aquí se aplican al laboratorio de microbiología.
- Lo previsible de este tema: **controles positivo, negativo y blanco**, **qué se controla en un medio** (esterilidad, productividad, selectividad, pH), **cepas de referencia** y **calibración frente a verificación**.

---

## 1. Encuadre

El **control de calidad** es el conjunto de comprobaciones que demuestran que **un resultado es fiable**. En microbiología tiene dos particularidades:

1. **El «patrón» está vivo.** Un medio, un reactivo o una técnica se comprueban con **microorganismos de control** que hay que conservar sin que cambien.
2. **Los recuentos varían mucho por azar.** Dos submuestras del mismo agua dan recuentos distintos aunque todo se haya hecho bien (tema 13, distribución de Poisson). Por eso los límites de control se fijan con **más datos** que en química, y la guía británica prefiere hablar de **«gráficos de orientación»** y de **líneas de respuesta**: un punto fuera indica que algo **probablemente** va mal, y obliga a investigar.

Dónde está el resto:

- **Tema 10:** estufas y termómetros (tolerancias de temperatura).
- **Tema 11:** autoclave e **indicadores** químicos y biológicos.
- **Tema 12:** preparación de medios y **conservación de cepas**.
- **Tema 38:** validación e **incertidumbre**.
- **Tema 39:** **gráfico de control X** (Nordtest) y trazabilidad.
- **Tema 40:** **ISO 17025**, acreditación y **ENAC**.

---

## 2. El sistema de calidad

La guía británica enumera lo que incluye un programa de calidad en microbiología:

- demostrar que **cada medio o reactivo preparado sirve**;
- usar **materiales de referencia cuantitativos** como muestras simuladas;
- participar en **evaluaciones externas** que prueban **todo el proceso**;
- **comprobar los equipos**.

Y añade: hace falta **combinar el control interno y el externo**.

| | Control **interno** | Control **externo** |
| --- | --- | --- |
| Quién | El propio laboratorio, **a diario** | Un **organizador independiente** |
| Con qué | Controles positivo, negativo y blanco; materiales de referencia; duplicados; gráficos | Muestras que reparte el organizador (**ensayos de aptitud** o **intercomparaciones**) |
| Qué demuestra | Que **hoy** el método funciona igual que siempre | Que el laboratorio **da lo mismo que los demás** y que el valor asignado |

**En el agua de consumo, el RD 3/2023 obliga a acreditar los métodos por la UNE-EN ISO/IEC 17025** (anexo III, parte B; tema 40). Se exceptúan los **análisis operacionales y de rutina** si el laboratorio solo hace esos. Los plazos dependen del volumen (disposición adicional octava):

| Laboratorio | Acreditación antes de |
| --- | --- |
| Más de **5000 muestras al año** | **2 de enero de 2024** |
| Entre **300 y 5000 muestras al año** | **2 de enero de 2028** |
| **La toma de muestras** (salvo análisis operacionales y de rutina) | **2 de enero de 2030** |

Mientras un método no esté acreditado, el laboratorio debe tenerlo **validado y documentado** según el **anexo III, parte E**. Esa parte E pide evaluar **veracidad, precisión e incertidumbre**, y lista lo que debe tener un procedimiento escrito: identificación, alcance, tipo de muestra, parámetros, equipos, **patrones y materiales de referencia**, condiciones ambientales, **verificaciones antes de empezar**, **calibración de los equipos**, registro, seguridad, **criterios de aceptación y rechazo** e incertidumbre.

---

## 3. Control de medios

**Lo que hay que demostrar de un medio** (guía británica, 6.10; Eurachem, 8.2):

| Propiedad | Pregunta | Cómo |
| --- | --- | --- |
| **Esterilidad** | ¿Está libre de contaminantes? | Se **incuba sin sembrar**: no debe crecer nada |
| **Productividad** (recuperación) | ¿Crece bien el microorganismo buscado? | Se siembra el **diana** y se mide cuánto crece |
| **Selectividad** (inhibición) | ¿Frena a los que no se buscan? | Se siembra un **no diana**: no crece o crece poco |
| **Especificidad** (características) | ¿Da el diana su **aspecto típico**? | Color, halo, fluorescencia… **anotados** |
| **Propiedades físicas** | pH, volumen, aspecto | Medida directa |

Los procedimientos detallados están en la **ISO 11133**, la norma de referencia del control de medios. **No se ha leído su texto**, que es de pago: lo que sigue sale de las dos guías que la aplican.

### 3.1. Lotes, registros y cuarentena

- **Cada lote preparado se identifica**, normalmente con un **número de lote**, y se etiqueta con ese número y su **fecha de caducidad**.
- En el registro del lote se anotan **los lotes de sus componentes**; si el medio es comercial, **el lote del fabricante**.
- **Si se añaden suplementos después de esterilizar**, cada frasco puede tener que tratarse como **un lote distinto**.
- Se guardan los **datos de la esterilización** (por ejemplo, la gráfica de temperatura del autoclave) y las **firmas** de quien lo preparó.
- **El medio recién hecho queda en cuarentena**, si es posible, **hasta que se demuestra que sirve**.
- **Un lote nuevo de medio deshidratado**, sobre todo de otro proveedor y para un medio selectivo, conviene compararlo con **el lote en uso** antes de usarlo en rutina.

### 3.2. Controles físicos

- **pH:** se mide en una alícuota de **cada medio**. La tolerancia típica es **± 0,2 unidades**. **Si está fuera, el medio se desecha**: **el pH no se ajusta después de esterilizar**, porque se podría contaminar.
- **Medio deshidratado:** el frasco bien cerrado. Si el polvo está **apelmazado, agrietado o ha cambiado de color**, **no se usa**.
- **Agua de preparación:** destilada, desionizada o de ósmosis inversa, **sin sustancias bactericidas, inhibidoras o interferentes**.
- **Caducidad:** la vida útil del medio preparado, **en sus condiciones de conservación**, se **determina y se verifica**.
- **Conservación:** salvo que el método diga otra cosa, los medios listos para usar van a la **nevera a 5 ± 3 °C**.

### 3.3. Las tres formas de controlar el crecimiento

**Cualitativa: ¿crece o no?** Se siembra el diana y se puntúa a ojo: **0 = no crece; 1 = crece poco; 2 = crece bien**. Sirve, por ejemplo, para medios comprados listos para usar con certificado del fabricante. La figura de la guía es *Salmonella* en agar **XLD** con puntuación **2**.

**Semicuantitativa: estrías en cuatro cuartos.**

![Control semicuantitativo de un medio: 16 estrías y un mínimo de 8](esquema:control-semicuantitativo)

- La placa se divide en **cuatro cuartos**.
- Cada cuarto se siembra desde un **cultivo en caldo** con un **asa de 1 µL**, y se hacen **cuatro estrías sin recargar ni flamear el asa**. Salen **16 líneas**.
- La guía lo llama **siembra y dilución**: como el asa no se recarga, cada estría **diluye el inóculo**. Un medio que crece bien da colonias **hasta en las últimas estrías**; uno pobre deja de darlas antes.
- **Cada línea con crecimiento puntúa 1**: el máximo es **16**.
- El laboratorio fija un **mínimo**, por ejemplo **8 de 16**, para dar el medio por bueno. **El control de esterilidad debe dar 0.**
- Es el control **ideal para medios líquidos y no selectivos**. Ejemplo de la guía: el **caldo lauril sulfato de membrana** se siembra, se incuba **18 h a 37 °C** y se pasa a un **agar nutritivo** para puntuarlo.
- Las figuras de la guía: ***E. coli* en MacConkey** con puntuación **16** (crece en las 16 estrías) y con puntuación **2** (casi nada).

**Cuantitativa: ¿cuántos crecen?**

![Control cuantitativo de un medio selectivo: recuperación de al menos el 50 %](esquema:recuperacion-medio)

- Se siembra una **suspensión con un número conocido** de células, **en superficie** o **por filtración de membrana**, y se cuentan las colonias.
- **Los medios selectivos se controlan así.** Se compara el recuento en el **medio selectivo** con el del **medio no selectivo**: si llega **al menos al 50 %** (o al objetivo que fije el laboratorio), **el medio vale**; si queda **por debajo, se desecha**.
- **Alternativa de la ISO 11133: la ratio de productividad (PR)**, que compara **el lote en prueba** con **un lote ya validado**. En medios selectivos como el **GVPC para *Legionella***, la guía exige **PR = 0,7** (un **70 %** de recuperación).
- **También debe fijarse un límite superior** de recuperación o de PR. **La guía no da su valor.**
- **Los medios nutritivos** (no selectivos) **no necesitan control cuantitativo**, pero sí se controlan **de forma semicuantitativa**.
- **No diana:** en el control cuantitativo, el no diana **no debe crecer**.
- **La suspensión de control debe ser estable.** Puede ser un **material de referencia comercial** o un **cultivo en caldo** incubado siempre igual y guardado a **5 ± 3 °C** (por ejemplo, un fin de semana), de modo que todas las células estén en **fase estacionaria** y el número no cambie.

### 3.4. Medios comprados listos para usar

- **También hay que evaluarlos antes de usarlos** (Eurachem, 8.3): recuperación del diana, inhibición del no diana y propiedades físicas y bioquímicas.
- **Si el fabricante tiene un sistema de calidad reconocido (ISO 9000) y controla sus medios según la ISO 11133**, al laboratorio le basta con **revisar su certificado**, hacer **pruebas iniciales con cada fabricante nuevo** y seguir el **control interno**.
- El fabricante debe dar al menos: **composición**, **vida útil**, **conservación**, **control de esterilidad**, **crecimiento de los organismos de control con su referencia de colección**, **controles físicos** y **fecha de la especificación**. Y debe **avisar si cambia** la especificación.
- **Cada lote recibido** viene con la **prueba de que cumple**.

### 3.5. Reactivos

- **Cada lote de un reactivo crítico** se comprueba **antes de usarlo y durante su vida útil**, con **organismos de control positivo y negativo** procedentes de **colecciones reconocidas** (Eurachem, 8.1).
- **Etiqueta:** identidad, concentración, conservación, **fecha de apertura**, fecha de preparación y **caducidad**. **Quién lo preparó** debe constar en los registros.
- Ejemplo de la EPA para la **oxidasa**: control positivo ***Pseudomonas aeruginosa***, control negativo ***E. coli*** (tema 16).

---

## 4. Materiales de referencia y cultivos de referencia

### 4.1. Para qué sirven

Según Eurachem (8.5), los **materiales de referencia** aportan **trazabilidad** y sirven para:

- demostrar la **exactitud** de los resultados;
- **calibrar** equipos;
- **vigilar** el funcionamiento del laboratorio;
- **validar** métodos y **compararlos**;
- demostrar la **calidad de los medios**;
- demostrar que los **kits** funcionan igual siempre.

**Si es posible, con la misma matriz** que las muestras (la regla del tema 38). Se recomienda comprarlos a productores **acreditados por la ISO 17034** (la norma de los **productores de materiales de referencia**, tema 39).

### 4.2. Cultivos (cepas) de referencia

- **Origen:** **colecciones nacionales o internacionales reconocidas**. La guía británica cita la **NCTC** (*National Collection of Type Cultures*) y la **NCIMB**. La EPA usa cepas de la **ATCC** (por ejemplo, *E. coli* ATCC 11775).
- **Si no hay cepas trazables a mano**, valen **derivados comerciales trazables** a ellas, **si el laboratorio demuestra que son equivalentes**. **Pero solo como cultivos de trabajo.**
- Llegan **liofilizadas en ampollas** o en formatos como **Lenticules** o **Vitroids**. Se **reconstituyen** con caldo estéril, siguiendo al proveedor.

**La cadena de subcultivos** (Eurachem, 8.6; tema 12):

| Paso | Qué es | Regla |
| --- | --- | --- |
| **Cepa de referencia** | La de la colección | **Se subcultiva una sola vez** |
| **Reservas de referencia** | Alícuotas idénticas de ese único subcultivo | **Congeladas o liofilizadas**. Se comprueban **pureza y pruebas bioquímicas**. **Una vez descongeladas, no se vuelven a congelar** |
| **Cultivos de trabajo** | **Subcultivo primario** de una reserva | **No se subcultivan** salvo que el método lo pida o se demuestre que no cambian. **Nunca sustituyen a las reservas** |

**Por qué tan pocos subcultivos:** cada resiembra es un riesgo de **contaminación**, y **algunas propiedades bioquímicas cambian** con los cultivos repetidos.

**Conservación de las reservas** (guía británica):

- **Liofilizadas** en ampollas: varias, para años.
- En **perlas**, **por debajo de −20 °C**: se saca una perla y el vial vuelve al frío enseguida.
- En **nitrógeno líquido** o en un congelador de **−150 °C**, con **crioprotector**.

**Después de conservarlas**, se comprueba que están **puras** y que **conservan los caracteres** por los que se eligieron. Ejemplo: ***E. coli* sigue fermentando la lactosa a 37 y a 44 °C**.

### 4.3. Materiales de referencia cuantitativos

- Preparados **comerciales** con un **número conocido** de microorganismos, en formatos estables: **Lenticules**, **Vitroids**, **BioBalls** (los cita la EPA).
- **El proveedor da la media y los límites de confianza**, y eso es clave: en un medio selectivo el recuento «verdadero» no se conoce.
- **El laboratorio debe comprobar que el material da esos valores «en sus manos».**
- **Contar sin conocer** la media y la varianza del material, si es posible.

### 4.4. Muestras naturales y aislados propios

- **Aguas naturales con el microorganismo buscado** también sirven de control. **Son un reto más real**, porque traen **competidores**. Pero **no se sabe cuántos hay**: el control puede «fallar» simplemente porque no había.
- Las **cepas aisladas de muestras reales**, a veces con caracteres raros, sirven para el control y la **formación**. Se conservan como las de referencia.

---

## 5. Control de técnicas

### 5.1. Controles positivo, negativo y blanco

**Definiciones** (guía británica, 8.1):

| Control | Qué contiene | Resultado correcto |
| --- | --- | --- |
| **Positivo** | El **microorganismo diana** | **Colonias típicas** o reacciones positivas, en el aislamiento **y en la confirmación** |
| **Negativo** | Un **no diana** | **No crece**, **no da reacción positiva** o da **colonias atípicas** |
| **Blanco** | Una muestra **estéril** | **Nada.** Comprueba que **el procedimiento no contamina** |

**Cuándo:**

- **En cada tanda** de muestras incubada, **en cada estufa** usada y, si es práctico, **por cada analista**.
- Se procesan **exactamente igual** que las muestras y **en su misma tanda**.
- **Todas las pruebas de confirmación** llevan control **positivo, negativo y blanco**.
- **Organismos de control:** de **primera generación** desde una colección nacional, o materiales comerciales. Se rehidratan con **diluyente de máxima recuperación**.

**Un ejemplo completo: el método EPA 1103.2 (*E. coli* por filtración en mTEC)**, en **cada día de análisis**:

| Control | Cómo |
| --- | --- |
| **Positivo** | Filtrar una suspensión diluida de ***E. coli*** |
| **Negativo** | Filtrar ***Enterococcus faecalis***; su viabilidad se comprueba en un medio **no selectivo** |
| **Esterilidad del filtro** | Un filtro sobre **TSA**, **24 ± 2 h a 35 °C**: no debe crecer nada |
| **Blanco de método** | Filtrar **50 mL de tampón estéril** y ponerlo en **mTEC**: nada de diana |
| **Blanco de filtración** | **50 mL de tampón** filtrados **antes de las muestras**, sobre TSA: tampón y equipo **estériles** |
| **Esterilidad de los medios** | Incubar una placa o tubo **de cada lote** de cada medio |

Además, **con cada lote nuevo** de medio o reactivo, sus controles positivo y negativo.

### 5.2. Control cuantitativo con materiales de referencia

Los controles positivo y negativo dicen si **algo crece**; no si se **cuenta bien**. Para eso, la guía británica propone dos caminos: **materiales de referencia** y **submuestras duplicadas**.

**Con un material de referencia**, se procesa con las muestras y su recuento se lleva a un **gráfico de Shewhart** (o «gráfico de orientación»):

- **Para construirlo:** al menos **20 resultados** (**2 al día durante 10 días**), y **60** para unos valores robustos. **En microbiología pueden hacer falta más.**
- **Los recuentos se pueden transformar** (raíz cuadrada o logaritmo) para que se acerquen a la **distribución normal**.
- **Líneas de respuesta:** **media ± 2s** (equivalen al **aviso**) y **media ± 3s** (a la **acción**). **Ajustadas a la experiencia:** en *Legionella*, con mucha variabilidad, son más útiles los gráficos de **porcentaje de recuperación**.
- **Se revisan la media y los límites al menos una vez al año.**

**Cuándo se investiga** (guía británica, 8.2.1):

1. **Un recuento fuera de un límite de acción.**
2. **Dos de tres recuentos seguidos fuera de un límite de aviso**, **en el mismo lado o en lados distintos** de la media.
3. **Nueve recuentos seguidos del mismo lado** de la media.
4. **Seis recuentos seguidos que suben o bajan sin parar.**

**Ojo con el tema 39:** el Nordtest TR 569 pide, en su regla de «dos de tres», que estén **en el mismo lado**. **La guía británica admite lados distintos.** Y sus reglas de tendencia (9 y 6) **no coinciden** con las de la edición 4 del Nordtest (7 y 10 de 11).

**Una señal de alarma al revés:** un gráfico **sin variación** (todos los recuentos casi iguales) puede indicar **sesgo del operador**, que cuenta «lo que espera».

### 5.3. Submuestras duplicadas e índice de dispersión

- Una muestra **con el diana** se divide en **dos submuestras**, que se analizan en la tanda **como muestras independientes**, en **posiciones al azar** en la estufa y, si se puede, **sin que el analista sepa que van juntas**.
- **Por el azar del reparto**, la diferencia puede ser grande: **si la primera da 5, el intervalo de confianza del 95 % de la segunda es de 0 a 14**.
- Por definición, **un 5 % de las veces** (1 de cada 20) la segunda caerá **fuera** del intervalo. **Si pasa más del 5 % de las veces, se investiga.**
- **Si las submuestras se parecen demasiado**, también se sospecha **sesgo del operador**.

**Índice de dispersión:**

> **D² = (x₁ − x₂)² / (x₁ + x₂)**

- Se compara con la **ji cuadrado con 1 grado de libertad**: **3,841** (p = 0,05, como un aviso, ≈ 2s) y **6,635** (p = 0,01, como una acción, ≈ 3s).
- **Más de un 5 % de valores por encima de 3,841** indica problemas de **repetibilidad**.
- La **suma de D²** en periodos largos (10-30 resultados, 2-4 semanas) informa de la **reproducibilidad**.
- Ejemplo: x₁ = 30 y x₂ = 18 → D² = 144 / 48 = **3,0**: por debajo de 3,841, **aceptable**.

### 5.4. El recuento de colonias y su verificación

- **Contar entre dos analistas** es parte del control interno (Eurachem, 13.1).
- **Criterio de la EPA:** una vez al mes, **los recuentos de dos analistas** sobre la misma placa positiva deben coincidir **dentro de un 10 %**. **Con un solo analista**, cuenta dos veces la misma membrana: **dentro de un 5 %**.
- **Los contadores automáticos de colonias** se comprueban con **materiales de referencia** de valor conocido (guía británica) y **una vez al año frente al recuento manual** (Eurachem, anexo F).
- **Verificar colonias:** la EPA pide confirmar **10 colonias típicas y 10 atípicas al mes**, o **1 típica y 1 atípica del 10 % de las muestras positivas**, lo que sea mayor. Sirve para detectar **errores** o **cambios en el agua**.

### 5.5. Recuperación inicial y continua (EPA)

- **IPR (precisión y recuperación inicial):** antes de usar el método con muestras reales, **4 muestras de tampón estéril** se **inoculan** con *E. coli* y se calcula la **recuperación media** y su **desviación estándar relativa**. Si cumplen los criterios, se puede empezar.
- **OPR (precisión y recuperación continua):** **una muestra inoculada cada 20 muestras o una por semana**, lo que sea más frecuente. **Si falla, se busca el problema** en cada paso del método.
- Los resultados se llevan a un **gráfico**, y la **exactitud** se expresa como **R ± 2sᵣ**.

### 5.6. Verificar y validar métodos

| | Cuándo | Qué se hace |
| --- | --- | --- |
| **Verificación** | **Método normalizado** (ISO, UNE…) que el laboratorio **adopta** | Demostrar que **en su laboratorio** el método rinde como dice la norma (ISO/IEC 17025, 7.2.1.5) |
| **Validación** | Método **no normalizado**: **desarrollado** por el laboratorio, **sacado de la bibliografía o del fabricante**, o normalizado **usado fuera de su alcance** | Demostrar que **sirve para el uso previsto** (ISO/IEC 17025, 7.2.2.1) |

**Parámetros de un método microbiológico** (Eurachem, 10):

- **Cualitativos** (detectado / no detectado): **sensibilidad**, **especificidad**, tasas de **falsos positivos y negativos**, **selectividad**, **efecto matriz** y **límite de detección**.
- **Cuantitativos** (recuentos): **sensibilidad**, **especificidad**, **falsos positivos y negativos**, **selectividad**, **eficiencia**, **repetibilidad**, **reproducibilidad intralaboratorio**, **incertidumbre del recuento** y **límite de determinación**.
- **A diferencia de la química**, también en los recuentos se calculan **verdaderos y falsos positivos y negativos**: hay que confirmar las colonias.

**Normas para el agua:** **ISO 13843** (características de los métodos de recuento) e **ISO 29201** (variabilidad e incertidumbre). Para la verificación de un recuento en agua, Eurachem propone, entre otras cosas, **inocular al menos 5 muestras**, analizar **3 muestras en 10 réplicas** y **recontar 30 placas** o tubos para la incertidumbre de la lectura.

**Kits comerciales:** el laboratorio guarda sus **datos de validación**, mejor si los ha **evaluado un tercero** (Eurachem cita **AFNOR**, **NordVal**, **MicroVal** y **AOAC**), y **los verifica**. Si no hay datos de validación aplicables, **la validación le toca al laboratorio**.

### 5.7. La incertidumbre de un recuento

**El tema 38 la desarrolla.** Lo propio de microbiología (Eurachem, 12):

- Normas: **ISO 29201** para el **agua** e **ISO 19036** para los **alimentos**.
- Componentes: la **distribucional** (el azar de Poisson), la **técnica** (pipeteo, pesada, diluciones, lectura), la de **confirmación** y la de **matriz**.
- **El muestreo suele ser la mayor contribución.**

### 5.8. Control externo: ensayos de aptitud

- **La participación es obligatoria si existe un esquema adecuado** (Eurachem, 13.2). Si no, **intercomparaciones** con un número suficiente de laboratorios y un protocolo documentado.
- Normas: **ISO 22117** (ensayos de aptitud en microbiología) e **ISO/IEC 17043** (**proveedores** de ensayos de aptitud: se recomiendan los **acreditados** por ella).
- **La muestra se trata exactamente como una de rutina.**
- El proveedor da la **media, la mediana**, el **valor asignado** y, a veces, una **puntuación z**. El laboratorio la representa en **gráficos** para ver si sus resultados se separan **siempre hacia el mismo lado** de la mediana.

### 5.9. Vigilancia ambiental del laboratorio

- Objetivo: que el ambiente **no contamine las muestras** y **proteja al personal**; y comprobar que **la limpieza y la desinfección funcionan** (guía británica, 4.2).
- Técnicas: **muestreadores de aire**, **placas de sedimentación**, **placas de contacto** e **hisopos de superficie**, con medios **selectivos y no selectivos**.
- Las placas usadas para vigilar **también se controlan** antes de usarlas.
- **Frecuencia orientativa** (Eurachem, anexo F): **recuento total y mohos, semanal**; **patógenos, dos veces al año**.
- **No sustituye a la técnica aséptica**: la verifica.

---

## 6. Control de equipos

### 6.1. Calibración y verificación

| | **Calibración** | **Verificación** |
| --- | --- | --- |
| Qué es | Comparar el equipo con un **patrón trazable** al SI, **en todo su intervalo** | Comprobar que **sigue cumpliendo** las especificaciones |
| Quién | Preferiblemente un **laboratorio de calibración acreditado**; las calibraciones internas, dentro de lo que permite **ILAC P10** | El propio laboratorio |
| Cuándo | **Antes de usar** el equipo por primera vez y luego **periódicamente** | **Antes de usar** el equipo, a diario o en cada uso, y **después de cada reparación, modificación o traslado** |

**La frecuencia la justifican la experiencia y el análisis de riesgos.** Las tablas de Eurachem son **orientativas**.

**Calibraciones** (Eurachem, anexo E):

| Equipo | Frecuencia |
| --- | --- |
| **Termómetros de referencia** | Calibración **cada 5 años**; **comprobación anual en el punto de hielo** |
| **Termopares de referencia** | Calibración **cada 3 años**; comprobación anual |
| **Termómetros de trabajo** | **Anual los 3 primeros años**; después, menos si funcionan bien |
| **Balanzas** | **Anual los 3 primeros años**, en todo su intervalo |
| **Pesas de calibración** | **Cada 5 años** |
| **Pesas de comprobación** | **Cada 3 años** |
| **Material volumétrico de vidrio** | **Anual** (gravimetría), salvo que tenga certificado |
| **Pipetas automáticas, higrómetros, analizadores de gases** | **Anual** |
| **pHmetros** | **Anual**, con **tampones trazables** |
| **Autoclaves** | **Sensores de temperatura y presión, anual** |

**Verificaciones** (Eurachem, anexo F):

| Equipo | Qué | Frecuencia |
| --- | --- | --- |
| **Estufas, baños, neveras, congeladores** | **Estabilidad y homogeneidad** de la temperatura | Al principio y **tras reparación o traslado** |
| | **Vigilar la temperatura** | **Al menos a diario** o en continuo |
| **Autoclaves** | **Temperatura y tiempo** | **Cada uso** o en continuo |
| **Cabinas de seguridad** | Rendimiento; **control microbiológico**; **flujo de aire** | **Anual**; **semanal**; **cada uso** |
| **pHmetro** | Con un **tampón que no se usó para calibrar** | **Diario** o cada uso |
| **Balanzas** | Con una **pesa de comprobación** | **Diario** o cada uso |
| **Desionizadores y ósmosis inversa** | **Conductividad**; **contaminación microbiana** | **Semanal**; **mensual** |
| **Diluidores gravimétricos** | Peso dispensado y razón de dilución | **Diario** |
| **Dispensadores de medios** | Volumen dispensado | **Tras cada ajuste** |
| **Microscopios** | Alineación | **Diario** o cada uso |
| **Centrífugas** | Con un **tacómetro** calibrado, si la velocidad es crítica | **Anual** |
| **Temporizadores** | Si son críticos | **Anual** |
| **Termocicladores (PCR)** | Temperatura, rampas y tiempos | Al principio y **diario o semanal** |

### 6.2. Balanzas

- **Las de uso general** (granatario): exactitud de **± 0,01 g**. **Las analíticas** (menos de 1 g): **± 0,001 g**, y a veces **± 0,0001 g** (guía británica).
- **En una superficie nivelada**, sin vibraciones, corrientes ni cambios de temperatura.
- **Pesas calibradas trazables, al menos una vez al año**; **pesas de trabajo, a diario o semanalmente**.
- Tras **mantenimiento, traslado o un golpe**, se vuelve a comprobar. **Una balanza fuera de tolerancia no se usa** hasta recalibrarla.

### 6.3. Pipetas y material volumétrico

- **Se calibran por gravimetría:** se pesa el agua dispensada, **corrigiendo la densidad por la temperatura**.
- **Diez pesadas repetidas** por volumen; se calcula la media, la desviación estándar, el **coeficiente de variación** y la **inexactitud** (sesgo).
- **Criterio de la guía británica:** **CV < 1 %** y **sesgo < 2 %**, o **< 1 %** si es crítico (por ejemplo, para preparar un patrón).
- **ISO 8655-1** (citada por Eurachem), pipetas de pistón de **0,1 a 5 mL**: **sesgo máximo 0,8 %** y **desviación estándar máxima 0,3 %**.
- Una pipeta nueva **se calibra antes de usarla**; luego, **comprobaciones intermedias** a diario o semanalmente.
- **Con puntas con filtro**, para no contaminar el pistón; y la pipeta **en su soporte, no tumbada**.
- **Material de vidrio con certificado:** no necesita verificación, pero **si se esteriliza en horno se comprueba** de vez en cuando.

### 6.4. Termómetros y temperatura

**El tema 10 tiene las tolerancias de las estufas** (± 1 °C entre 20 y 40 °C; ± 0,5 °C a 40 °C o más).

- **Cadena de trazabilidad:** **termómetro certificado** → calibra el **de referencia** del laboratorio → calibra los **de trabajo** (tema 39).
- **Termómetros de mercurio y de tolueno: prohibidos** por seguridad (Eurachem, 9.2). Se recomiendan los **registradores de datos**.
- **EPA:** temperatura de las estufas **dos veces al día**, con **al menos 4 horas** entre lecturas; termómetros comprobados **al menos una vez al año** contra uno certificado; **neveras, a diario**.

### 6.5. pHmetro

- **Calibrar antes de cada uso** con **dos tampones** que abarquen el intervalo (EPA: pH 4, 7 o 10).
- **Verificar** con un **tampón distinto de los de la calibración** (Eurachem).

### 6.6. Autoclaves, estufas y cabinas

- **Autoclave:** debe cumplir **tiempo, presión y temperatura**. **Una olla a presión con solo un manómetro no vale.** Sensores calibrados; **temporizadores verificados**; sondas **dentro de la carga**; **indicadores químicos y biológicos** (tema 11).
- **Estufas:** **estabilidad y homogeneidad** de la temperatura, también según **cómo se apilan las placas** (tema 10).
- **Cabinas:** **anual** y tras reparación o traslado; **control microbiológico semanal** (tema 10).

---

## 7. Cuadro de cifras

| Cifra | Dónde |
| --- | --- |
| pH del medio: **± 0,2**; **nunca se ajusta tras esterilizar** | Medios |
| Medios listos para usar: **5 ± 3 °C** | Medios |
| Control cualitativo: **0, 1, 2** | Medios |
| Semicuantitativo: **4 cuartos × 4 estrías = 16**; asa de **1 µL**; mínimo **8**; esterilidad **0** | Medios |
| Cuantitativo: selectivo **≥ 50 %** del no selectivo; **PR 0,7** en GVPC | Medios |
| Cepa de referencia: **un solo subcultivo** | Referencia |
| Perlas **< −20 °C**; ultracongelador **−150 °C** | Referencia |
| Gráfico: **20 resultados** (2 × 10 días); **60** robustos; **± 2s / ± 3s**; revisión **anual** | Técnicas |
| Reglas: **1** fuera de acción; **2 de 3** fuera de aviso; **9** del mismo lado; **6** en tendencia | Técnicas |
| Duplicados: primera **5** → segunda **0-14**; fuera **> 5 %** → investigar | Técnicas |
| **D² = (x₁ − x₂)² / (x₁ + x₂)**; límites **3,841** y **6,635** | Técnicas |
| Analistas: **< 10 %** entre dos; **< 5 %** el mismo | Técnicas (EPA) |
| Verificar **10 típicas y 10 atípicas** al mes | Técnicas (EPA) |
| OPR: **1 cada 20 muestras o 1 a la semana** | Técnicas (EPA) |
| Blancos: **50 mL** de tampón estéril | Técnicas (EPA) |
| RD 3/2023: **> 5000** muestras/año → **2024**; **300-5000** → **2028** | Calidad |
| Balanza: **± 0,01 g** general; **± 0,001 / 0,0001 g** analítica | Equipos |
| Pipetas: **10 pesadas**; **CV < 1 %**, **sesgo < 2 %**; ISO 8655: **0,8 % y 0,3 %** | Equipos |
| Termómetros de referencia: **5 años**; termopares de referencia: **3 años** | Equipos |
| Pesas de calibración **5 años**; de comprobación **3 años** | Equipos |
| Agua purificada: conductividad **semanal**, microbiología **mensual** | Equipos |
| Estufas (EPA): **2 lecturas al día**, separadas **≥ 4 h** | Equipos |

---

## 8. Puntos críticos para el examen

1. **Controles de cada tanda:** **positivo** (diana, colonias típicas), **negativo** (no diana, no crece o atípico) y **blanco** (estéril, nada). En **cada tanda, cada estufa y cada analista**, y en **toda confirmación**.
2. **Un medio se controla en:** **esterilidad**, **productividad**, **selectividad**, **especificidad** (aspecto típico) y **pH**. Norma: **ISO 11133**.
3. **pH ± 0,2.** Si no cumple, **se desecha**: **no se ajusta después de esterilizar**.
4. **Semicuantitativo:** **16 estrías**, mínimo **8**; **ideal para medios líquidos y no selectivos**. **Cuantitativo:** selectivo **≥ 50 %** del no selectivo; **PR** de la ISO 11133.
5. **Lotes:** número, caducidad, **cuarentena** hasta demostrar que sirve; **medio deshidratado apelmazado, no se usa**.
6. **Cepas de referencia:** de **colecciones reconocidas**; **un solo subcultivo** para las reservas; los cultivos de trabajo **no reemplazan a las reservas**; **una reserva descongelada no se recongela**.
7. **Materiales de referencia:** exactitud, calibración, validación, **calidad de medios**; productores **ISO 17034**; **misma matriz** si se puede.
8. **Gráficos:** **± 2s aviso, ± 3s acción**; **datos transformados** (log o raíz); **un gráfico sin variación = sesgo del operador**.
9. **Duplicados:** el azar da diferencias grandes; **D²** frente a **3,841 / 6,635**.
10. **Ensayos de aptitud:** **obligatorios si existen**; proveedores **ISO/IEC 17043**; **la muestra, como una de rutina**.
11. **Calibración** (contra patrón trazable, periódica) **≠ verificación** (comprobación de uso, diaria, y **tras reparación o traslado**).
12. **Termómetros de mercurio prohibidos** (Eurachem 2023); **pHmetro**, verificar con un tampón **distinto** de los de calibrar; **balanza**, con **pesa de comprobación** a diario.

---

## Dudas declaradas

1. **ISO 11133, ISO 13843, ISO 29201, ISO 22117 e ISO 8655 no se han leído:** son de pago. Sus criterios (PR, cepas de control de cada medio, número de réplicas) salen de **cómo los citan** la guía británica y Eurachem.
2. **La PR mínima general de la ISO 11133.** La guía británica da **0,7 para el GVPC** «en algunas circunstancias», y el **50 %** de recuperación como ejemplo para los selectivos. **No se ha podido comprobar el valor general de la norma** ni el **límite superior**, que la guía pide fijar sin dar su cifra.
3. **Los termómetros de mercurio.** La guía británica de **2017** aún los describe (con funda protectora); **Eurachem 2023 los prohíbe** por seguridad. El apunte sigue a Eurachem, **la fuente más reciente**.
4. **Las reglas de los gráficos difieren entre guías** (británica, Nordtest edición 4 y edición 6.1; tema 39). **Ninguna es «la» regla oficial española**: en el examen conviene reconocer **± 2s aviso / ± 3s acción** y la idea de **tendencias**.
5. **Las cifras de la EPA** (10 % entre analistas, 10 colonias al mes, OPR cada 20 muestras) son de **un método estadounidense concreto**. Se dan como **ejemplo** de un plan de control, no como obligación en España.
6. **El RD 3/2023 se ha leído en su redacción inicial.** No se ha comprobado si los plazos de acreditación han cambiado después.
7. **No hay ficha de apoyo** para este tema, ni preguntas de examen directas.

---

## Fuentes y verificación

- **Guía británica de laboratorios de aguas (SCA 2017):** 4.2, 5.2, 5.20, 5.26, **6.10 entero** (con las figuras de las placas vistas en el PDF) y **8 entero**.
- **Eurachem 2023:** 8, 9, 10, 12, 13 y **anexos E y F**.
- **EPA 1103.2 (2023):** apartados 9 y 10.
- **RD 3/2023:** anexo III, partes B y E, y disposición adicional octava.
- **Exámenes:** plantillas de 1233, 1246 y 1322: sin preguntas directas.
- **Fecha de verificación:** 2 de octubre de 2026.
