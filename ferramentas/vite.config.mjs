// Configuração do Vite. Fica junto das dependências em disco local (%LOCALAPPDATA%\NeuroBaby-deps),
// porque o Google Drive (J:) não suporta a pasta node_modules. O código continua no Drive.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DEPS = join(dirname(fileURLToPath(import.meta.url)), 'node_modules')
const ROOT = process.env.NEUROBABY_ROOT
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
const dep = (nome) => join(DEPS, nome)

export default defineConfig({
  root: ROOT,
  base: './',
  envDir: ROOT,
  cacheDir: join(DEPS, '.vite'),
  plugins: [react()],
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  resolve: {
    alias: [
      { find: /^react-dom(\/.*)?$/, replacement: dep('react-dom') + '$1' },
      { find: /^react(\/.*)?$/, replacement: dep('react') + '$1' },
      { find: /^lucide-react$/, replacement: dep('lucide-react') },
    ],
  },
  server: { host: true, port: Number(process.env.PORT) || 5180, fs: { allow: [ROOT, DEPS] } },
  preview: { host: true, port: 5181 },
  build: { outDir: join(ROOT, 'dist'), emptyOutDir: true },
})
