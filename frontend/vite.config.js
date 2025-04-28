import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server :{
    proxy:{
      '/api' :{
        target: 'http://localhost:5000',
        secure:false,
      },
    },
  },
  plugins: [react()],
  build: {
    outDir: '../backend/client/dist', // Ensure this matches your backend’s expected path
  }
})

