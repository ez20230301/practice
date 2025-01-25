import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/v1': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        secure: false,
        headers: {
          'Origin': 'https://api.deepseek.com'
        }
      }
    }
  }
})