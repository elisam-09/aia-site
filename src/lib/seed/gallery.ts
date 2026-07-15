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

export const PHOTOS: SeedPhoto[] = [
  {
    id: 'lune-t200',
    titre: { fr: 'Lune gibbeuse au T200', en: 'Gibbous Moon through the T200' },
    image: '/placeholders/observation.svg',
    categorie: 'astrophoto',
    date: '2026-05-30',
  },
  {
    id: 'voie-lactee-assinie',
    titre: { fr: 'Voie lactée depuis Assinie', en: 'Milky Way from Assinie' },
    image: '/placeholders/astrophoto.svg',
    categorie: 'astrophoto',
    date: '2026-04-18',
  },
  {
    id: 'atelier-lycee-cocody',
    titre: { fr: 'Atelier au lycée de Cocody', en: 'Workshop at Cocody high school' },
    image: '/placeholders/ecole.svg',
    categorie: 'ecole',
    date: '2026-03-12',
  },
  {
    id: 'file-attente-eclipse',
    titre: { fr: "File d'attente, éclipse de Lune 2025", en: 'Queue, 2025 lunar eclipse' },
    image: '/placeholders/conference.svg',
    categorie: 'evenement',
    date: '2025-09-07',
  },
  {
    id: 'saturne-premiere',
    titre: { fr: 'Saturne, première lumière', en: 'Saturn, first light' },
    image: '/placeholders/astrophoto.svg',
    categorie: 'astrophoto',
    date: '2025-08-21',
  },
  {
    id: 'obs-plateau',
    titre: { fr: 'Observation publique au Plateau', en: 'Public stargazing at Plateau' },
    image: '/placeholders/observation.svg',
    categorie: 'observation',
    date: '2025-07-19',
  },
  {
    id: 'campagne-iasc',
    titre: { fr: 'Analyse IASC en salle', en: 'IASC analysis session' },
    image: '/placeholders/recherche.svg',
    categorie: 'evenement',
    date: '2025-12-06',
  },
  {
    id: 'club-abobo',
    titre: { fr: "Naissance du club d'Abobo", en: 'Birth of the Abobo club' },
    image: '/placeholders/ecole.svg',
    categorie: 'ecole',
    date: '2025-11-14',
  },
];

export function seedGallery(lang: Lang): GalleryItem[] {
  return PHOTOS.map((ph) => ({
    id: ph.id,
    titre: pick(ph.titre, lang),
    image: ph.image,
    categorie: ph.categorie,
    date: ph.date,
  }));
}
