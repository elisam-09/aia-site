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
}

export const EVENTS: SeedEvent[] = [
  {
    id: 'obs-lune-juillet',
    titre: {
      fr: 'Observation publique : la Lune au télescope',
      en: 'Public stargazing: the Moon through the telescope',
    },
    date: '2026-07-25',
    heure: '19:00',
    lieu: 'Esplanade du Plateau, Abidjan',
    description: {
      fr: "Cratères, mers et terminateur : viens voir la Lune gibbeuse comme tu ne l'as jamais vue. Télescopes fournis, entrée libre, en famille.",
      en: 'Craters, maria and the terminator: come see the gibbous Moon like never before. Telescopes provided, free entry, family friendly.',
    },
    image: '/placeholders/observation.svg',
  },
  {
    id: 'perseides-2026',
    titre: {
      fr: 'Nuit des étoiles filantes — Perséides 2026',
      en: 'Shooting-star night — Perseids 2026',
    },
    date: '2026-08-12',
    heure: '21:00',
    lieu: 'Plage de Grand-Bassam',
    description: {
      fr: 'Le pic des Perséides sur la plage, loin des lumières de la ville. Prévois une natte, on s’occupe du ciel.',
      en: 'The Perseid peak on the beach, far from city lights. Bring a mat — we take care of the sky.',
    },
    image: '/placeholders/astrophoto.svg',
  },
  {
    id: 'astropause-7',
    titre: {
      fr: 'AstroPause #7 : « Vivre et travailler dans l’espace »',
      en: 'AstroPause #7: “Living and working in space”',
    },
    date: '2026-09-18',
    heure: '15:00',
    lieu: 'Amphithéâtre, UFR SSMT, Université Félix Houphouët-Boigny',
    description: {
      fr: 'Notre cycle de conférences reprend : stations spatiales, missions longues et corps humain en apesanteur, avec session de questions ouvertes.',
      en: 'Our lecture series is back: space stations, long missions and the human body in weightlessness, with an open Q&A.',
    },
    image: '/placeholders/conference.svg',
  },
  {
    id: 'tournee-yopougon',
    titre: {
      fr: 'Tournée scolaire : lycées de Yopougon',
      en: 'School tour: Yopougon high schools',
    },
    date: '2026-03-14',
    lieu: 'Yopougon, Abidjan',
    description: {
      fr: 'Trois établissements, six classes, un planétarium mobile et beaucoup de vocations : retour sur une semaine intense.',
      en: 'Three schools, six classes, one mobile planetarium and plenty of new vocations: recap of an intense week.',
    },
    image: '/placeholders/ecole.svg',
  },
  {
    id: 'campagne-iasc-2025',
    titre: {
      fr: "Campagne de recherche d'astéroïdes (IASC) — hiver 2025",
      en: 'Asteroid search campaign (IASC) — winter 2025',
    },
    date: '2025-12-06',
    lieu: 'En ligne + UFHB, Abidjan',
    description: {
      fr: "Quatre semaines d'analyse d'images du télescope Pan-STARRS avec l'International Astronomical Search Collaboration, sous l'égide de l'UAI et de la NASA.",
      en: 'Four weeks analysing Pan-STARRS telescope images with the International Astronomical Search Collaboration, under the IAU and NASA umbrella.',
    },
    image: '/placeholders/recherche.svg',
  },
  {
    id: 'eclipse-lune-2025',
    titre: {
      fr: 'Éclipse totale de Lune du 7 septembre 2025',
      en: 'Total lunar eclipse of 7 September 2025',
    },
    date: '2025-09-07',
    lieu: 'Campus UFHB, Abidjan',
    description: {
      fr: 'Observation publique de la Lune rousse avec plus de 200 visiteurs — notre plus grosse affluence à ce jour.',
      en: 'Public observation of the blood Moon with 200+ visitors — our biggest turnout to date.',
    },
    image: '/placeholders/observation.svg',
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
    passe: e.date < aujourdhui,
  }));
}
