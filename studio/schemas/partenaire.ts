import { defineField, defineType } from 'sanity';

export const partenaire = defineType({
  name: 'partenaire',
  title: 'Partenaire',
  type: 'document',
  fields: [
    defineField({
      name: 'nom',
      title: 'Nom complet',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sigle',
      title: 'Sigle / abréviation',
      type: 'string',
      description: 'Exemple : UAI, NASA, AfAS. Affiché en pastille sur l’accueil.',
    }),
    defineField({
      name: 'description',
      title: 'Description du partenariat',
      type: 'texteBilingue',
    }),
    defineField({
      name: 'logo',
      title: 'Logo (optionnel)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'site',
      title: 'Site officiel (optionnel)',
      type: 'url',
    }),
    defineField({
      name: 'ordre',
      title: 'Ordre d’affichage',
      type: 'number',
      description: 'Petit nombre = affiché en premier.',
      initialValue: 10,
    }),
  ],
  orderings: [
    { title: 'Ordre d’affichage', name: 'ordreAsc', by: [{ field: 'ordre', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'nom', subtitle: 'sigle', media: 'logo' },
  },
});
