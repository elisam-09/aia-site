import { defineField, defineType } from 'sanity';

export const membre = defineType({
  name: 'membre',
  title: 'Membre du bureau',
  type: 'document',
  fields: [
    defineField({
      name: 'nom',
      title: 'Nom et prénom',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'role',
      title: 'Fonction',
      type: 'texteBilingue',
      description: 'Exemple : Présidente, Responsable observations…',
    }),
    defineField({
      name: 'bio',
      title: 'Courte biographie (optionnel)',
      type: 'texteBilingue',
    }),
    defineField({
      name: 'photo',
      title: 'Photo (optionnel)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ordre',
      title: 'Ordre d’affichage',
      type: 'number',
      description: 'Petit nombre = affiché en premier (ex. la présidence).',
      initialValue: 10,
    }),
  ],
  orderings: [
    { title: 'Ordre d’affichage', name: 'ordreAsc', by: [{ field: 'ordre', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'nom', subtitle: 'role.fr', media: 'photo' },
  },
});
