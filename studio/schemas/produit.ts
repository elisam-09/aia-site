import { defineField, defineType } from 'sanity';

export const produit = defineType({
  name: 'produit',
  title: 'Produit (Support)',
  type: 'document',
  description: 'Vitrine uniquement : aucune vente en ligne. Les visiteurs commandent via la page Contact.',
  fields: [
    defineField({
      name: 'nom',
      title: 'Nom du produit',
      type: 'texteBilingue',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'texteBilingue',
    }),
    defineField({
      name: 'image',
      title: 'Photo du produit',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'prix',
      title: 'Prix indicatif',
      type: 'string',
      description: 'Exemple : 7 000 FCFA. Aucun paiement n’est traité sur le site.',
    }),
    defineField({
      name: 'dispo',
      title: 'Disponible',
      type: 'boolean',
      description: 'Décoche pour afficher « Bientôt de retour ».',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'nom.fr', media: 'image', prix: 'prix', dispo: 'dispo' },
    prepare({ title, media, prix, dispo }) {
      return {
        title: title || 'Produit',
        subtitle: `${prix ?? ''}${dispo === false ? ' · indisponible' : ''}`,
        media,
      };
    },
  },
});
