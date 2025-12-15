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
  // --- НАСТРОЙКИ ДЛЯ TAURI ---
  clearScreen: false,
  server: {
    port: 3000,
    strictPort: true, // Tauri ждет именно этот порт
    proxy: {
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // Tauri использует движки, которые поддерживают современные фичи
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})