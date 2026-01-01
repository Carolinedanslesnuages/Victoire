import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Victoire',
        short_name: 'Victoire',
        description: 'Combien puis-je dépenser aujourd’hui ?',
        lang: 'fr',
        theme_color: '#2f6f5e',
        background_color: '#f6f4ef',
        display: 'standalone',
        start_url: './',
        scope: './',
