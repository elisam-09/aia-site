import type { Lang } from '../../i18n/ui';
import type { Localized, Member } from '../types';
import { pick } from '../types';

/**
 * Membres du bureau cités publiquement (AfricaPSS, L'Astronomie Afrique, IRD).
 * Photos et ordre modifiables dans /admin → Membres.
 */
interface SeedMember {
  id: string;
  nom: string;
  role: Localized;
  bio: Localized;
  photo?: string;
}

export const TEAM: SeedMember[] = [
  {
    id: 'diaby',
    nom: 'Dr Aziz Diaby',
    role: { fr: 'Fondateur · Président', en: 'Founder · President' },
    bio: {
      fr: "Chercheur en physique spatiale, spécialiste de l'ionosphère, et enseignant de physique-chimie. Il a présenté ses travaux en Italie, en Inde, aux États-Unis et à Chypre. Élu président de l'AIA pour six ans en 2021.",
      en: 'Space physicist specialising in the ionosphere, and physics and chemistry teacher. He has presented his work in Italy, India, the United States and Cyprus. Elected AIA president for six years in 2021.',
    },
    photo: '/images/photos/p-diaby.webp',
  },
  {
    id: 'yao',
    nom: 'Dr Marc Harris Yao',
    role: { fr: 'Premier vice-président', en: 'First vice-president' },
    bio: {
      fr: "Astrophysicien, enseignant-chercheur à l'Université Félix Houphouët-Boigny. Il présente l'AIA et porte le développement de l'astronomie ivoirienne : observations publiques, clubs dans les lycées, campagnes d'astéroïdes.",
      en: 'Astrophysicist and lecturer-researcher at Félix Houphouët-Boigny University. He represents AIA and drives the development of Ivorian astronomy: public stargazing, school clubs, asteroid campaigns.',
    },
  },
  {
    id: 'aka',
    nom: 'Dr Pancrace Aka',
    role: { fr: 'Secrétaire général adjoint', en: 'Deputy secretary general' },
    bio: {
      fr: "Épistémologue, historien des sciences et logicien, maître-assistant au département de philosophie de l'UFHB. Il a donné la conférence « Agence spatiale ivoirienne : enjeux et défis ».",
      en: 'Epistemologist, historian of science and logician, assistant professor in UFHB’s philosophy department. He gave the talk “Ivorian space agency: stakes and challenges”.',
    },
  },
  {
    id: 'ackah',
    nom: 'Dr Jean-Baptiste Ackah',
    role: { fr: 'Secrétaire à la communication', en: 'Communications secretary' },
    bio: {
      fr: "Docteur en physique de l'atmosphère et de l'espace (UFHB), ingénieur en météorologie aéronautique à l'ASECNA, membre du programme URSI Young Scientist.",
      en: 'PhD in atmospheric and space physics (UFHB), aeronautical meteorology engineer at ASECNA, member of the URSI Young Scientist programme.',
    },
  },
  {
    id: 'baratoux',
    nom: 'Dr David Baratoux',
    role: { fr: 'Conseiller scientifique', en: 'Scientific adviser' },
    bio: {
      fr: "Planétologue, directeur de recherche à l'IRD. Partenaire de longue date de l'AIA, il a co-organisé l'AstroTour Ivoire et est intervenu au Café des Savoirs.",
      en: 'Planetary scientist and research director at IRD. A long-standing AIA partner, he co-organised the AstroTour Ivoire and spoke at the Café des Savoirs.',
    },
  },
  {
    id: 'ahoua',
    nom: 'Ahoua Stéphane',
    role: { fr: "Secrétaire à l'organisation", en: 'Organisation secretary' },
    bio: {
      fr: "Doctorant en physique de l'atmosphère. Il fait voyager le public dans l'espace avec le logiciel de planétarium Stellarium.",
      en: 'PhD student in atmospheric physics. He takes the public on journeys through space with the Stellarium planetarium software.',
    },
  },
];

export function seedTeam(lang: Lang): Member[] {
  return TEAM.map((m) => ({
    id: m.id,
    nom: m.nom,
    role: pick(m.role, lang),
    bio: pick(m.bio, lang),
    photo: m.photo,
  }));
}
