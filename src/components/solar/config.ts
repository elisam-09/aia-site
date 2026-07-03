/**
 * Table de config astre → rubrique, validée le 2026-07-03.
 * Source de vérité partagée par la scène 3D (R3F) et le fallback 2D.
 * Distances et tailles non réalistes : composées pour la lisibilité.
 */
import type { Lang } from '../../i18n/ui';
import { routes } from '../../i18n/ui';

export interface CelestialBody {
  id: string;
  /** Étiquette affichée au survol, par langue */
  label: Record<Lang, string>;
  /** Destination par langue */
  route: Record<Lang, string>;
  /** Couleur stylisée (pas de textures téléchargées : perf) */
  color: string;
  /** Rayon relatif de l'astre dans la scène */
  size: number;
  /** Rayon de l'orbite (0 = au centre) */
  orbit: number;
  /** Durée d'une révolution en secondes (animation) */
  period: number;
  /** Angle de départ en radians (aussi utilisé par le fallback 2D) */
  phase: number;
  ring?: boolean;
  /** La Terre porte seule les accents du drapeau ivoirien */
  ivorian?: boolean;
}

export const SUN: CelestialBody = {
  id: 'soleil',
  label: { fr: 'Accueil — le Manifeste', en: 'Home — the Manifesto' },
  route: { fr: routes.home.fr, en: routes.home.en },
  color: '#FFC46B',
  size: 2.6,
  orbit: 0,
  period: 0,
  phase: 0,
};

export const PLANETS: CelestialBody[] = [
  {
    id: 'mercure',
    label: { fr: 'Qui sommes-nous', en: 'About us' },
    route: { fr: routes.about.fr, en: routes.about.en },
    color: '#B9AEB9',
    size: 0.42,
    orbit: 4.6,
    period: 26,
    phase: 0.8,
  },
  {
    id: 'venus',
    label: { fr: 'Actualités', en: 'News' },
    route: { fr: routes.news.fr, en: routes.news.en },
    color: '#E8C48A',
    size: 0.62,
    orbit: 6.2,
    period: 40,
    phase: 2.4,
  },
  {
    id: 'terre',
    label: { fr: "Rejoindre l'AIA", en: 'Join AIA' },
    route: { fr: routes.join.fr, en: routes.join.en },
    color: '#5F9ED6',
    size: 0.66,
    orbit: 8.0,
    period: 58,
    phase: 4.4,
    ivorian: true,
  },
  {
    id: 'mars',
    label: { fr: 'Nos activités', en: 'Our activities' },
    route: { fr: routes.activities.fr, en: routes.activities.en },
    color: '#D98559',
    size: 0.52,
    orbit: 9.8,
    period: 76,
    phase: 5.6,
  },
  {
    id: 'jupiter',
    label: { fr: 'Événements', en: 'Events' },
    route: { fr: routes.events.fr, en: routes.events.en },
    color: '#D9A066',
    size: 1.35,
    orbit: 13.4,
    period: 110,
    phase: 1.6,
  },
  {
    id: 'saturne',
    label: { fr: 'Galerie', en: 'Gallery' },
    route: { fr: routes.gallery.fr, en: routes.gallery.en },
    color: '#E3C08A',
    size: 1.15,
    orbit: 16.4,
    period: 150,
    phase: 3.3,
    ring: true,
  },
  {
    id: 'uranus',
    label: { fr: 'Support', en: 'Support' },
    route: { fr: routes.support.fr, en: routes.support.en },
    color: '#9AD1D4',
    size: 0.85,
    orbit: 19.0,
    period: 200,
    phase: 5.1,
  },
  {
    id: 'neptune',
    label: { fr: 'Partenaires', en: 'Partners' },
    route: { fr: routes.partners.fr, en: routes.partners.en },
    color: '#6B8CDE',
    size: 0.82,
    orbit: 21.4,
    period: 260,
    phase: 0.4,
  },
];

export const MOON: CelestialBody = {
  id: 'lune',
  label: { fr: 'Contact', en: 'Contact' },
  route: { fr: routes.contact.fr, en: routes.contact.en },
  color: '#CEC9CE',
  size: 0.22,
  orbit: 1.25, // autour de la Terre
  period: 9,
  phase: 1.1,
};

/** Ceinture d'astéroïdes : entre Mars et Jupiter — ancre vers la recherche (6 découvertes 2022). */
export const BELT = {
  id: 'ceinture',
  label: {
    fr: "Recherche d'astéroïdes — 6 découvertes en 2022",
    en: 'Asteroid search — 6 discoveries in 2022',
  } as Record<Lang, string>,
  route: {
    fr: routes.activities.fr + '#recherche-asteroides',
    en: routes.activities.en + '#asteroid-search',
  } as Record<Lang, string>,
  inner: 11.0,
  outer: 12.2,
  count: 420,
  highlights: 6, // les 6 astéroïdes de l'AIA, plus brillants
};

export const ALL_NAV_BODIES: CelestialBody[] = [SUN, ...PLANETS, MOON];
