import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En GitHub Pages (proyecto) la app cuelga de /<nombre-repo>/.
// El workflow de deploy pasa VITE_BASE; en local se usa '/'.
const base = process.env.VITE_BASE ?? '/'

export default defineConfig({
  root: 'app',
  base,
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    // El contenido (temario.md, temas/, repaso/) vive fuera de app/
    fs: { allow: ['..'] },
  },
})
