# Oposición · Técnica/o Auxiliar de Laboratorio — Ayuntamiento de Zaragoza

App de estudio (apuntes + repaso) para la convocatoria publicada en el **BOPZ núm. 170, de 27 de julio de 2026, anuncio núm. 5077**. 40 temas: 8 comunes y 32 específicos.

## Formato real del examen

Según las **bases generales (TRBGTL), base 7.4.C.1**, a las que remite la convocatoria. Todo lo que genera este proyecto se ajusta a esto.

| | Primer ejercicio | Segundo ejercicio |
|---|---|---|
| Tipo | Teórico y escrito | Práctico y escrito |
| Preguntas | 50 (+5 de reserva) | 5 supuestos × 5 preguntas = 25 |
| **Opciones** | **3** (a, b, c) | **4** (a, b, c, d) |
| Tiempo | 55 minutos | 35 minutos |
| Nota | 0-10, mínimo 5 | 0-10, mínimo 5 |
| Temario | **Los 40 temas** | Parte segunda (temas 9-40) |

Los dos ejercicios se hacen **el mismo día**, el segundo inmediatamente después del primero, y ambos son eliminatorios. Además hay **nota de corte**: solo pasan al segundo los 150 mejores.

**Penalización:** cada respuesta errónea descuenta **1/4** del valor de un acierto; las respuestas en blanco no penalizan. Aun así, responder siempre tiene valor esperado positivo (+1/6 de acierto con 3 opciones, +1/16 con 4), así que nunca compensa dejar una pregunta en blanco. La app lo recuerda en el inicio y en cada test.

Consecuencia para los datos: los temas 9-40 se preguntan **en los dos formatos**, así que su fichero de repaso lleva `test` (3 opciones) y `supuestos` (4 opciones). Los temas 1-8 solo llevan `test`.

## Cómo se trabaja

Tema a tema, nunca en bloque:

1. **Buscar la fuente** — norma exacta y vigente (texto consolidado del BOE/BOA/BOPZ, norma UNE/ISO, etc.).
2. **Redactar el apunte** en `temas/tema-NN.md` con `estado: borrador`.
3. **Revisión y aprobación** por parte del opositor.
4. **Solo entonces** se genera `repaso/tema-NN.json` y el apunte pasa a `estado: aprobado`.
5. Commit y push de ese tema.

Regla de fondo: **nada de contenido de memoria del modelo**. Cada apunte declara su norma, su versión y su fecha de verificación.

### Volumen orientativo por tema

Proporciones derivadas del peso real observado en los exámenes anteriores (ver `ExamenesAnteriores/ANALISIS.md`). Son **orientación, no cifra fija**: la muestra son dos exámenes de turno libre, y si un tema concreto pide más o menos, se ajusta.

| Bloque | Temas | Tarjetas | Test (3 op.) | Supuestos (4 op.) |
|---|---|---|---|---|
| Parte común | 1-8 | ~15 | ~10 | — |
| Microbiología | 9-19 | ~25 | ~15 | ~5 |
| Físico-química y seguridad | 20-32 | ~30 | ~20 | ~5 |
| Agua, aire y ISO 17025 | 33-40 | ~30 | ~20 | ~8 |

Dentro de la parte común el peso tampoco es uniforme: en los dos exámenes completos, el TREBEP dio 3-4 preguntas de 10 y la Constitución solo 1.

### Núcleo

Las tarjetas y preguntas de mayor peso real llevan `nucleo: true`. La app ofrece un modo **«Solo núcleo»** en tarjetas y en test. No se borra nada: el material completo sigue disponible como consulta, y así no se pierde el progreso guardado.

### Temas sin precedente

Los temas **2, 4, 5, 8, 10, 19 y 29** no aparecen en ninguno de los seis cuestionarios analizados. Al presentar su apunte hay que **avisar explícitamente de cada duda o ambigüedad de fuente**, en vez de asumir el nivel de detalle habitual.

## Estructura

```
temario.md              Listado oficial de los 40 temas. Fuente de verdad de los títulos.
temas/tema-NN.md        Apuntes. Frontmatter + cuerpo markdown.
repaso/tema-NN.json     Tarjetas, test y supuestos, generados del apunte ya aprobado.
ExamenesAnteriores/     Cuestionarios de convocatorias previas y su análisis.
app/                    Web app React (Vite + TypeScript).
scripts/export-pdf.js   Exportación a HTML/PDF de un tema o del temario completo.
```

Plantillas comentadas en `temas/_PLANTILLA.md` y `repaso/_PLANTILLA.json`. Los ficheros que empiezan por `_` los ignora la app.

Los apuntes de la parte segunda incluyen además una **tabla operativa** «parámetro → técnica → norma → unidades → condiciones», porque *«¿qué técnica utilizaría para analizar X?»* es el patrón de pregunta más repetido de los exámenes reales.

### Figuras

El examen usa imágenes (pictogramas de peligro, material de vidrio, lecturas de bureta). No se suben fotos: las tarjetas y preguntas **declaran** qué figura quieren y la app la dibuja en SVG.

```json
"figura": { "tipo": "ghs", "valor": "corrosivo" }
"figura": { "tipo": "bureta", "lectura": 12.5, "capacidad": 25 }
"figura": { "tipo": "material", "valor": "matraz-aforado" }
```

Componentes en `app/src/components/figuras/`. Los pictogramas son **representaciones esquemáticas** con fines de estudio, no reproducciones exactas de los símbolos normalizados del Reglamento (CE) 1272/2008.

## Desarrollo

```bash
npm install
npm run dev                    # http://localhost:5173
npm run build                  # genera dist/
npm run export:pdf             # HTML (+ PDF si hay puppeteer) de cada tema
npm run export:pdf -- --todo   # un único documento con todo el temario
```

## Despliegue

GitHub Actions (`.github/workflows/deploy.yml`) construye y publica en **GitHub Pages** en cada push a `main`: https://xdamabax.github.io/oposicion-laboratorio-zaragoza/

## Progreso de estudio

Se guarda en `localStorage` del navegador (clave `oposicion-zgz:progreso:v1`); no hay backend. Repetición espaciada tipo SM-2 simplificada a tres botones, racha diaria y estadísticas de test. Exportable e importable en JSON desde la página **Progreso**.
