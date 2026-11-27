import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Optics India POS v2.0 - Vite Configuration
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./public/assets', import.meta.url))
    }
  },
  base: "/optical-frontend/",
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('xlsx')) return 'xlsx';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) return 'vendor-react';
          }
        }
      }
    }
  }
})
