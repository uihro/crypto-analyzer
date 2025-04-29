import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: true,    // Показывать ошибки поверх приложения
    },
    watch: {
      usePolling: true, // Использовать поллинг для обнаружения изменений (помогает в некоторых средах)
    },
    host: true,         // Слушать на всех интерфейсах
    port: 3000,         // Использовать порт 3000
  }
})
