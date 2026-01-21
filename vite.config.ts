import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['heyahyperw2'],
    proxy: {
      '/capture': {
        target: 'http://localhost:6485',
        changeOrigin: true,
      },
      '/screen-size': { target: 'http://localhost:6485', changeOrigin: true },
      '/mouse': { target: 'http://localhost:6485', changeOrigin: true },
      '/key': { target: 'http://localhost:6485', changeOrigin: true },
      '/clipboard': { target: 'http://localhost:6485', changeOrigin: true },
      '/shutdown': { target: 'http://localhost:6485', changeOrigin: true },
    },
  },
});
