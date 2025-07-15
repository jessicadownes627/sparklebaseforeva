import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        '/icon-192.png',
        '/icon-512.png',
        '/sswelcome.png'
      ],
      manifest: {
        name: 'Talk More Tonight',
        short_name: 'TalkMore',
        description: 'Real News. Better Dates. Made for Tonight.',
        theme_color: '#ffe5ec',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ],
        screenshots: [
          {
            src: '/sswelcome.png',
            sizes: '800x600',
            type: 'image/png',
            form_factor: 'wide',
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
});
