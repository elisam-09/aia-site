import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { structureFR } from './structure';

/**
 * Back-office de l'AIA.
 * Renseigne projectId ci-dessous (ou la variable SANITY_STUDIO_PROJECT_ID) après
 * avoir créé ton projet sur sanity.io — voir DEPLOIEMENT.md.
 */
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'REMPLACE_MOI';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'aia',
  title: "AIA — Espace de gestion du site",
  projectId,
  dataset,

  plugins: [
    structureTool({ title: 'Contenu', structure: structureFR }),
    visionTool({ title: 'Requêtes (avancé)' }),
  ],

  schema: {
    types: schemaTypes,
  },
});
