import type { Lang } from '../../i18n/ui';
import type { EventItem, Localized } from '../types';
import { pick } from '../types';

interface SeedEvent {
  id: string;
  titre: Localized;
  date: string;
  heure?: string;
  lieu: string;
  description: Localized;
  image?: string;
  lien?: string;
}

/**
 * Événements réels de l'AIA (sources : page Facebook de l'AIA, IRD, L'Astronomie Afrique,
 * AfricaPSS). Aucun événement à venir n'est inventé : le bureau les annonce via /admin.
 */
export const EVENTS: SeedEvent[] = [
  {
    id: 'campagne-asteroides-2026',
    titre: { fr: "Campagne d'astéroïdes 2026/2027", en: '2026/2027 asteroid campaign' },
    date: '2026-09-07',
    lieu: 'En ligne · Science citoyenne',
    description: {
      fr: "Du 7 septembre au 2 octobre : une nouvelle campagne de recherche avec des élèves et bénévoles. Résultats préliminaires publiés début octobre, dont une découverte préliminaire au Lycée français Blaise Pascal.",
      en: '7 September to 2 October: a new search campaign with students and volunteers. Preliminary results published in early October, including a preliminary discovery at the Lycée français Blaise Pascal.',
    },
    image: '/images/photos/orion.webp',
  },
  {
    id: 'asteroid-day-2024',
    titre: { fr: 'Asteroid Day', en: 'Asteroid Day' },
    date: '2024-06-30',
    lieu: 'LASMES · Université Félix Houphouët-Boigny',
    description: {
      fr: 'Conférences au LASMES à l’occasion de la journée mondiale des astéroïdes.',
      en: 'Lectures at LASMES for the international day of asteroids.',
    },
    image: '/placeholders/recherche.svg',
  },
  {
    id: 'journees-espace-blaise-pascal',
    titre: {
      fr: "Journées de l'espace · Lycée Blaise Pascal",
      en: 'Space days · Lycée Blaise Pascal',
    },
    date: '2024-02-01',
    lieu: 'Abidjan · Lycée français Blaise Pascal',
    description: {
      fr: "Initiation à l'astronomie et observation du ciel avec les télescopes de l'AIA, lors de l'inauguration du club d'astronomie du lycée.",
      en: 'An introduction to astronomy and stargazing with AIA’s telescopes, at the opening of the school’s astronomy club.',
    },
    image: '/images/photos/blaise-pascal.webp',
  },
  {
    id: 'astro-tour-ivoire-2023',
    titre: { fr: 'Astro Tour Ivoire', en: 'Astro Tour Ivoire' },
    date: '2023-11-27',
    lieu: 'Abidjan · Yamoussoukro · Korhogo · Bouaké',
    description: {
      fr: "Du 27 novembre au 8 décembre : quatre villes, neuf dates. Ateliers, formations d'enseignants, observations et conférences gratuits pour tous, avec SpaceBus France et l'IRD. Quinze scientifiques, dix Ivoiriens et cinq Français.",
      en: '27 November to 8 December: four cities, nine dates. Free workshops, teacher training, stargazing and lectures for all, with SpaceBus France and IRD. Fifteen scientists, ten Ivorian and five French.',
    },
    image: '/images/photos/fb-1.webp',
    lien: 'https://www.ird.fr/astrotour-lastronomie-pour-toutes-en-cote-divoire',
  },
  {
    id: 'astropause-1',
    titre: { fr: 'AstroPause #1', en: 'AstroPause #1' },
    date: '2023-05-18',
    lieu: 'LASMES · Université Félix Houphouët-Boigny',
    description: {
      fr: "« Communication satellite, Terre et reconquête de l'espace » : présentation de l'AIA et conférences sur l'agence spatiale ivoirienne et les satellites. Une cinquantaine de participants.",
      en: '“Satellite communication, Earth and the reconquest of space”: AIA presentation and talks on the Ivorian space agency and satellites. Some fifty participants.',
    },
    image: '/images/photos/astropause-public.webp',
    lien: 'https://lastronomieafrique.com/lastropause-de-lassociation-ivoirienne-dastronomie-aia-la-cote-divoire-et-le-defi-de-la-conquete-spatiale/',
  },
  {
    id: 'cafe-des-savoirs-2023',
    titre: {
      fr: 'Café des Savoirs · « Il n’y a pas de planète B »',
      en: 'Café des Savoirs · “There is no planet B”',
    },
    date: '2023-01-26',
    lieu: 'Institut Français de Côte d’Ivoire',
    description: {
      fr: "Invitée de l'Institut Français de Côte d'Ivoire, l'AIA a animé un débat sur l'avenir de la Terre.",
      en: 'As guest of the Institut Français de Côte d’Ivoire, AIA led a debate on the future of the Earth.',
    },
    image: '/placeholders/conference.svg',
  },
  {
    id: 'on-the-moon-again-2021',
    titre: { fr: 'On The Moon Again', en: 'On The Moon Again' },
    date: '2021-07-16',
    lieu: 'Abidjan · Université Félix Houphouët-Boigny',
    description: {
      fr: "Du 16 au 18 juillet : trois jours d'observation de la Lune à l'Université Félix Houphouët-Boigny, avec l'opération internationale On The Moon Again.",
      en: '16 to 18 July: three days of Moon observation at Félix Houphouët-Boigny University, as part of the international On The Moon Again operation.',
    },
    image: '/images/photos/otma.webp',
  },
  {
    id: 'naissance-aia-2021',
    titre: { fr: "Naissance de l'AIA", en: 'AIA is born' },
    date: '2021-02-13',
    lieu: 'Abidjan-Cocody',
    description: {
      fr: "Assemblée générale constitutive à l'Université Félix Houphouët-Boigny : le Dr Aziz Diaby est élu premier président.",
      en: 'Founding general assembly at Félix Houphouët-Boigny University: Dr Aziz Diaby is elected first president.',
    },
    image: '/images/photos/ag-2021.webp',
  },
];

export function seedEvents(lang: Lang): EventItem[] {
  const aujourdhui = new Date().toISOString().slice(0, 10);
  return EVENTS.map((e) => ({
    id: e.id,
    titre: pick(e.titre, lang),
    date: e.date,
    heure: e.heure,
    lieu: e.lieu,
    description: pick(e.description, lang),
    image: e.image,
    lien: e.lien,
    passe: e.date < aujourdhui,
  }));
}
