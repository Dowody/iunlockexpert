import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/iunlockexpert/home',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0', // or your local IP, e.g. '192.168.1.100'
    port: 5175,      // any free port you want to use
  },
})