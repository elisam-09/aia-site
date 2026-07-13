// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // URL provisoire — à remplacer par le domaine définitif une fois réservé (voir DEPLOIEMENT.md)
  site: 'https://aia-astronomie.vercel.app',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr', en: 'en' },
      },
    }),
  ],
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    build: {
      // three.js est volumineux mais chargé en différé, uniquement sur l'accueil
      chunkSizeWarningLimit: 1200,
    },
  },
});
