import { defineField, defineType } from 'sanity';

export const evenement = defineType({
  name: 'evenement',
  title: 'Événement',
  type: 'document',
  fields: [
    defineField({
      name: 'titre',
      title: "Titre de l'événement",
      type: 'texteBilingue',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'Les événements passés basculent automatiquement dans les archives.',
      options: { dateFormat: 'DD/MM/YYYY' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heure',
      title: 'Heure (optionnel)',
      type: 'string',
      description: 'Exemple : 19:00',
    }),
    defineField({
      name: 'lieu',
      title: 'Lieu',
      type: 'string',
      description: 'Exemple : Esplanade du Plateau, Abidjan',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'texteBilingue',
    }),
    defineField({
      name: 'image',
      title: 'Image (optionnel)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'lien',
      title: "Lien d'inscription (optionnel)",
      type: 'url',
    }),
  ],
  orderings: [
    {
      title: 'Date (plus récent d’abord)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'titre.fr', date: 'date', media: 'image', lieu: 'lieu' },
    prepare({ title, date, media, lieu }) {
      const d = date ? new Date(date).toLocaleDateString('fr-FR') : 'Sans date';
      return { title: title || 'Événement sans titre', subtitle: `${d} · ${lieu ?? ''}`, media };
    },
  },
});
