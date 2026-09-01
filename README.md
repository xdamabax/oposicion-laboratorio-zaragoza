# Oposición · Técnica/o Auxiliar de Laboratorio — Ayuntamiento de Zaragoza

App de estudio (apuntes + repaso) para la convocatoria publicada en el **BOPZ núm. 5077, de 27 de julio de 2026**. 40 temas: 8 comunes y 32 específicos.

## Cómo se trabaja

Tema a tema, nunca en bloque:

1. **Buscar la fuente** — norma exacta y vigente (texto consolidado del BOE/BOA/BOPZ, norma ISO, etc.).
2. **Redactar el apunte** en `temas/tema-NN.md` con `estado: borrador`.
3. **Revisión y aprobación** por parte del opositor.
4. **Solo entonces** se genera `repaso/tema-NN.json` (tarjetas + test) y el apunte pasa a `estado: aprobado`.
5. Commit y push de ese tema.

Regla de fondo: **nada de contenido de memoria del modelo**. Cada apunte declara su norma, su versión consolidada y su fecha de verificación, porque esto va a examen.

## Estructura

```
temario.md            Listado oficial de los 40 temas. Fuente de verdad de los títulos.
temas/tema-NN.md      Apuntes. Frontmatter + cuerpo markdown.
repaso/tema-NN.json   Tarjetas y preguntas, generadas del apunte ya aprobado.
app/                  Web app React (Vite + TypeScript).
scripts/export-pdf.js Exportación a HTML/PDF de un tema o del temario completo.
```

### `temario.md`

Formato que lee el parser (`app/src/content/temario.ts`):

- `## Título` abre una parte, `### Título` abre un bloque.
- Cada tema empieza por su número: `1. Enunciado exacto.` (también vale `Tema 1. …`).
- Un enunciado puede ocupar varias líneas: se concatenan hasta el siguiente número.

Los enunciados se pegan **literales del BOPZ**, sin reescribir ni resumir.

### `temas/tema-NN.md`

```yaml
---
tema: 1
titulo: Título exacto, copiado de temario.md
parte: Parte primera. Materias comunes
estado: borrador        # borrador | aprobado
verificado: 2026-09-01
fuentes:
  - Constitución Española (BOE-A-1978-31229), texto consolidado a 01/09/2026 — https://www.boe.es/…
---
```

Plantilla completa en `temas/_PLANTILLA.md`. Los ficheros que empiezan por `_` los ignora la app.

### `repaso/tema-NN.json`

Plantilla en `repaso/_PLANTILLA.json`. `correcta` es el índice 0-based dentro de `opciones`.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
npm run export:pdf         # HTML (+ PDF si hay puppeteer) de cada tema
npm run export:pdf -- --todo   # un único documento con todo el temario
```

Para PDF real: `npm i -D puppeteer`. Sin él, el script deja el HTML listo para imprimir.

## Despliegue

GitHub Actions (`.github/workflows/deploy.yml`) construye y publica en **GitHub Pages** en cada push a `main`. El `base` de Vite se toma de `VITE_BASE`, que el workflow rellena con el nombre del repositorio.

Requisito en el repo: **Settings → Pages → Source: GitHub Actions**.

## Progreso de estudio

Se guarda en `localStorage` del navegador (clave `oposicion-zgz:progreso:v1`); no hay backend ni sale nada del dispositivo. Repetición espaciada tipo SM-2 simplificada a tres botones (Fallo / Bien / Fácil), racha diaria y estadísticas de test. Exportable e importable en JSON desde la página **Progreso**.
