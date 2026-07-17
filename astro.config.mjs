// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // URL provisoire — à remplacer par le domaine définitif une fois réservé (voir DEPLOIEMENT.md)
  site: 'https://aia-astronomie.vercel.app',
  // Mode serveur : nécessaire pour la connexion, le portail admin et la base de données.
  // Les pages publiques restent rendues à la volée depuis la base (mise à jour instantanée).
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  // La vérification d'origine intégrée d'Astro compare Origin au Host — ce qui casse
  // dès qu'on est derrière un proxy/tunnel qui réécrit le Host (Cloudflare, Hostinger…).
  // La défense CSRF reste assurée par le cookie de session en SameSite=Lax.
  security: { checkOrigin: false },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr', en: 'en' },
      },
      // On n'expose pas le portail d'administration aux moteurs de recherche
      filter: (page) => !page.includes('/admin'),
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
    ssr: {
      // Modules natifs : à ne pas empaqueter par Vite, on les charge tels quels côté Node
      external: ['better-sqlite3', 'sharp'],
    },
  },
});
