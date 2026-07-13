import type { StructureResolver } from 'sanity/structure';

/**
 * Menu latéral du back-office, en français, avec des icônes parlantes.
 * On regroupe pour que le bureau s'y retrouve d'un coup d'œil.
 */
export const structureFR: StructureResolver = (S) =>
  S.list()
    .title('Contenu du site')
    .items([
      S.listItem()
        .title('📅 Événements')
        .schemaType('evenement')
        .child(S.documentTypeList('evenement').title('Événements')),
      S.listItem()
        .title('📰 Actualités (blog)')
        .schemaType('actualite')
        .child(S.documentTypeList('actualite').title('Actualités')),
      S.listItem()
        .title('🖼️ Galerie photos')
        .schemaType('photoGalerie')
        .child(S.documentTypeList('photoGalerie').title('Galerie')),
      S.divider(),
      S.listItem()
        .title('🛍️ Produits (Support)')
        .schemaType('produit')
        .child(S.documentTypeList('produit').title('Produits')),
      S.listItem()
        .title('🤝 Partenaires')
        .schemaType('partenaire')
        .child(S.documentTypeList('partenaire').title('Partenaires')),
      S.listItem()
        .title('👤 Membres du bureau')
        .schemaType('membre')
        .child(S.documentTypeList('membre').title('Membres du bureau')),
    ]);
