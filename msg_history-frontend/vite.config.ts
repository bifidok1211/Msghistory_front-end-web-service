// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: true },
        manifest: {
          name: "История пересылки поста",
          short_name: "Msg-history",
          description: "Сервис для анализа поста.",
          start_url: ".",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#ffffff",
          icons: [
            { src: 'logo/logo32.png', type: 'image/png', sizes: '32x32' },
            { src: 'logo/logo192.png', type: 'image/png', sizes: '192x192', purpose: 'any maskable' },
            { src: 'logo/logo512.png', type: 'image/png', sizes: '512x512', purpose: 'any maskable' }
          ]
        }
      })
  ],
  base: '/RIP_front-end/',
  server: {
    port: 3000, // Указываем порт для фронтенда
    proxy: {
      // Проксируем запросы /api на ваш бэкенд
      '/api': {
        target: 'http://localhost:8090', // Адрес нашего Go-сервиса
        changeOrigin: true, // Необходимо для виртуальных хостов
      },
    },
  },
})