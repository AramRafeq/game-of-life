import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: '/game-of-life/', // for sake of github pages
  build: {
    outDir: 'docs' // for sake of github pages 
  }
})
