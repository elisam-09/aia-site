import { defineField, defineType } from 'sanity';

export const photoGalerie = defineType({
  name: 'photoGalerie',
  title: 'Photo de la galerie',
  type: 'document',
  fields: [
    defineField({
      name: 'titre',
      title: 'Légende',
      type: 'texteBilingue',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'categorie',
      title: 'Catégorie',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Astrophotographie', value: 'astrophoto' },
          { title: 'Observation publique', value: 'observation' },
          { title: 'Événement', value: 'evenement' },
          { title: 'École / club', value: 'ecole' },
        ],
      },
      initialValue: 'observation',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date de la prise de vue (optionnel)',
      type: 'date',
      options: { dateFormat: 'DD/MM/YYYY' },
    }),
  ],
  preview: {
    select: { title: 'titre.fr', media: 'image', categorie: 'categorie' },
    prepare({ title, media, categorie }) {
      return { title: title || 'Photo', subtitle: categorie, media };
    },
  },
});
