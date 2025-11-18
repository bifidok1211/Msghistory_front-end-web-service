import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command }) => {

  const base = command === 'build'
    ? '/RIP_front-end/'
    : '/';

  return {
    base,
    plugins: [
      react(),
      // mkcert(),
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
          theme_color: "#E60023",
          icons: [
            { src: 'logo/logo32.png', type: 'image/png', sizes: '32x32' },
            { src: 'logo/logo192.png', type: 'image/png', sizes: '192x192', purpose: 'any maskable' },
            { src: 'logo/logo512.png', type: 'image/png', sizes: '512x512', purpose: 'any maskable' }
          ]
        }
      })
    ],

    server: {
      port: 3000,
      // https: {
      //   key: fs.readFileSync('localhost-key.pem'),
      //   cert: fs.readFileSync('localhost.pem'),
      //   ca: fs.readFileSync('rootCA.pem'),
      // },
      proxy: {
        '/api': {
          target: 'http://10.128.146.23:8090',
          changeOrigin: true,
        },
        '/img': {
          target: 'http://10.128.146.23:9000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/img/, ''),
        }
      }
    }
  }
})
