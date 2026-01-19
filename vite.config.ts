import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/capture': {
        target: 'http://localhost:6485',
        changeOrigin: true,
      },
      '/screen-size': 'http://localhost:6485',
      '/mouse': 'http://localhost:6485',
      '/key': 'http://localhost:6485',
      '/clipboard': 'http://localhost:6485',
      '/shutdown': 'http://localhost:6485',
    }
  }
})
