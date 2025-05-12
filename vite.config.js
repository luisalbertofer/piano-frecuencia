// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/piano-frecuencia/', // usa tu nombre de repositorio aquí
  plugins: [
    react(),
    tailwindcss()
  ]
})
