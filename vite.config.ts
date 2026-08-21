import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://nazemms1.github.io/hassan-/ on GitHub Pages, so assets
// need that repository path as their base. `npm run dev` is unaffected.
export default defineConfig({
  base: '/hassan-/',
  plugins: [react()],
})
