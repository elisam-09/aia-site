import type { Lang } from '../../i18n/ui';
import type { GalleryItem, Localized } from '../types';
import { pick } from '../types';

interface SeedPhoto {
  id: string;
  titre: Localized;
  image: string;
  categorie: GalleryItem['categorie'];
  date?: string;
}

/** Photos réelles des activités de l'AIA (page Facebook de l'association et presse). */
export const PHOTOS: SeedPhoto[] = [
  {
    id: 'ag-2021',
    titre: {
      fr: 'Assemblée générale constitutive, février 2021',
      en: 'Founding general assembly, February 2021',
    },
    image: '/images/photos/ag-2021.webp',
    categorie: 'evenement',
    date: '2021-02-13',
  },
  {
    id: 'otma-2021',
    titre: { fr: 'On The Moon Again, juillet 2021', en: 'On The Moon Again, July 2021' },
    image: '/images/photos/otma.webp',
    categorie: 'observation',
    date: '2021-07-16',
  },
  {
    id: 'astropause-public',
    titre: { fr: 'AstroPause #1 : le public', en: 'AstroPause #1: the audience' },
    image: '/images/photos/astropause-public.webp',
    categorie: 'evenement',
    date: '2023-05-18',
  },
  {
    id: 'astropause-salle',
    titre: { fr: 'AstroPause #1 au LASMES', en: 'AstroPause #1 at LASMES' },
    image: '/images/photos/astropause-salle.webp',
    categorie: 'evenement',
    date: '2023-05-18',
  },
  {
    id: 'astrotour-2023',
    titre: { fr: 'Astro Tour Ivoire 2023', en: 'Astro Tour Ivoire 2023' },
    image: '/images/photos/fb-1.webp',
    categorie: 'ecole',
    date: '2023-11-27',
  },
  {
    id: 'blaise-pascal-2024',
    titre: {
      fr: "Journées de l'espace, Lycée Blaise Pascal",
      en: 'Space days, Lycée Blaise Pascal',
    },
    image: '/images/photos/blaise-pascal.webp',
    categorie: 'ecole',
    date: '2024-02-01',
  },
];

export function seedGallery(lang: Lang): GalleryItem[] {
  return PHOTOS.map((p) => ({
    id: p.id,
    titre: pick(p.titre, lang),
    image: p.image,
    categorie: p.categorie,
    date: p.date,
  }));
}
