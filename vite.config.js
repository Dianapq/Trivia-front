import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const config = {
    plugins: [react()]
  }

  // Solo activa el proxy si estás en desarrollo
  if (mode === 'development') {
    config.server = {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        }
      }
    }
  }

  return config
})

