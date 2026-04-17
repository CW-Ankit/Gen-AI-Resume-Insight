import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on the current mode (e.g., development or production)
  // process.cwd() tells Vite to look in the root folder for .env
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Any request starting with /api will be sent to your backend
        '/api': {
          target: env.VITE_BACKEND_URL, 
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
