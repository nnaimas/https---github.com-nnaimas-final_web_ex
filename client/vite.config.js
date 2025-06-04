import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          const newPath = path.replace(/^\/api/, '');
          console.log('Rewriting path:', path, 'to:', newPath);
          return newPath;
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
