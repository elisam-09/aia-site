import type { Lang } from '../../i18n/ui';
import type { Localized, Product } from '../types';
import { pick } from '../types';

interface SeedProduct {
  id: string;
  nom: Localized;
  description: Localized;
  image: string;
  prix: string;
  dispo: boolean;
}

export const PRODUCTS: SeedProduct[] = [
  {
    id: 'tshirt-regarde-plus-haut',
    nom: { fr: 'T-shirt « Regarde plus haut »', en: '“Look higher” T-shirt' },
    description: {
      fr: 'Coton épais, sérigraphie du logo AIA dans le dos et devise sur le cœur. Tailles S à XXL.',
      en: 'Heavy cotton, AIA logo screen-printed on the back, motto on the chest. Sizes S to XXL.',
    },
    image: '/placeholders/tshirt.svg',
    prix: '7 000 FCFA',
    dispo: true,
  },
  {
    id: 'pack-stickers-mission',
    nom: { fr: 'Pack stickers « Mission »', en: '“Mission” sticker pack' },
    description: {
      fr: "Dix autocollants vinyle : badge AIA, planètes, télescope et l'astéroïde porte-bonheur.",
      en: 'Ten vinyl stickers: AIA badge, planets, telescope and the lucky asteroid.',
    },
    image: '/placeholders/stickers.svg',
    prix: '2 000 FCFA',
    dispo: true,
  },
  {
    id: 'poster-ciel-abidjan',
    nom: { fr: "Poster « Le ciel d'Abidjan »", en: '“The Abidjan sky” poster' },
    description: {
      fr: "Carte du ciel vue depuis Abidjan (5°21′ N), constellations des deux hémisphères. Format A2, papier mat.",
      en: 'Sky map as seen from Abidjan (5°21′ N), constellations from both hemispheres. A2 size, matte paper.',
    },
    image: '/placeholders/poster.svg',
    prix: '5 000 FCFA',
    dispo: true,
  },
  {
    id: 'casquette-aia',
    nom: { fr: 'Casquette AIA', en: 'AIA cap' },
    description: {
      fr: 'Broderie du badge sur casquette aubergine. Protège du soleil en attendant la nuit.',
      en: 'Embroidered badge on an aubergine cap. Keeps the Sun off while you wait for the night.',
    },
    image: '/placeholders/casquette.svg',
    prix: '6 000 FCFA',
    dispo: false,
  },
];

export function seedProducts(lang: Lang): Product[] {
  return PRODUCTS.map((pr) => ({
    id: pr.id,
    nom: pick(pr.nom, lang),
    description: pick(pr.description, lang),
    image: pr.image,
    prix: pr.prix,
    dispo: pr.dispo,
  }));
}
