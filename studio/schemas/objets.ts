import { defineField, defineType } from 'sanity';

/**
 * Champ texte court bilingue : une case Français, une case Anglais.
 * Le Français est obligatoire ; l'Anglais est optionnel (repli sur le FR si vide).
 */
export const texteBilingue = defineType({
  name: 'texteBilingue',
  title: 'Texte (FR / EN)',
  type: 'object',
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'en',
      title: 'English (optionnel)',
      type: 'string',
    }),
  ],
});

/**
 * Contenu riche bilingue (pour le corps des actualités) :
 * un éditeur de texte formaté par langue.
 */
export const blocsBilingues = defineType({
  name: 'blocsBilingues',
  title: 'Contenu (FR / EN)',
  type: 'object',
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'en',
      title: 'English (optionnel)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
});
