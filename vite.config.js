import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Las peticiones a /api se reenvían al backend Spring Boot (puerto 8080)
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
