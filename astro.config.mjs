// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // URL provisoire — à remplacer par le domaine définitif une fois réservé (voir DEPLOIEMENT.md)
  site: 'https://aia-astronomie.vercel.app',
  integrations: [react()],
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
