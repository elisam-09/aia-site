import { defineField, defineType } from 'sanity';

export const actualite = defineType({
  name: 'actualite',
  title: 'Actualité',
  type: 'document',
  fields: [
    defineField({
      name: 'titre',
      title: "Titre de l'article",
      type: 'texteBilingue',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: "Adresse de la page (générée automatiquement)",
      type: 'slug',
      description: 'Clique sur « Generate » à partir du titre. Évite de la modifier après publication.',
      options: {
        source: 'titre.fr',
        maxLength: 96,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date de publication',
      type: 'date',
      options: { dateFormat: 'DD/MM/YYYY' },
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'auteur',
      title: 'Auteur',
      type: 'string',
      description: 'Nom du membre du bureau qui signe l’article.',
      initialValue: "Le bureau de l'AIA",
    }),
    defineField({
      name: 'extrait',
      title: 'Chapeau / résumé',
      type: 'texteBilingue',
      description: 'Une ou deux phrases affichées dans la liste et en tête d’article.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: "Image de couverture",
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'corps',
      title: 'Contenu de l’article',
      type: 'blocsBilingues',
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
    select: { title: 'titre.fr', date: 'date', media: 'image', auteur: 'auteur' },
    prepare({ title, date, media, auteur }) {
      const d = date ? new Date(date).toLocaleDateString('fr-FR') : '';
      return { title: title || 'Article sans titre', subtitle: `${d} · ${auteur ?? ''}`, media };
    },
  },
});
