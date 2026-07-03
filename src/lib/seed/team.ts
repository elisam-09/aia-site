import type { Lang } from '../../i18n/ui';
import type { Localized, Member } from '../types';
import { pick } from '../types';

/**
 * Seed volontairement générique : les vrais noms et photos du bureau
 * seront saisis dans le back-office (type de contenu « Membre du bureau »).
 */
interface SeedMember {
  id: string;
  role: Localized;
  bio: Localized;
}

const TEAM: SeedMember[] = [
  {
    id: 'presidence',
    role: { fr: 'Présidence', en: 'Presidency' },
    bio: {
      fr: "Porte la vision de l'association et la représente auprès des institutions ivoiriennes et internationales.",
      en: 'Carries the association’s vision and represents it before Ivorian and international institutions.',
    },
  },
  {
    id: 'secretariat',
    role: { fr: 'Secrétariat général', en: 'General secretariat' },
    bio: {
      fr: "Coordonne la vie de l'association, les adhésions et le lien avec les membres.",
      en: 'Coordinates the association’s life, memberships and member relations.',
    },
  },
  {
    id: 'observations',
    role: { fr: 'Responsable observations', en: 'Head of observations' },
    bio: {
      fr: 'Planifie les sorties, gère les télescopes et forme les nouveaux observateurs.',
      en: 'Plans outings, manages telescopes and trains new observers.',
    },
  },
  {
    id: 'pedagogie',
    role: { fr: 'Responsable pédagogie & clubs', en: 'Head of education & clubs' },
    bio: {
      fr: "Conçoit les tournées scolaires et accompagne les clubs d'astronomie des lycées.",
      en: 'Designs school tours and supports high-school astronomy clubs.',
    },
  },
  {
    id: 'recherche',
    role: { fr: 'Responsable recherche', en: 'Head of research' },
    bio: {
      fr: "Anime les campagnes IASC et le suivi de nos six astéroïdes auprès du Minor Planet Center.",
      en: 'Leads IASC campaigns and the follow-up of our six asteroids with the Minor Planet Center.',
    },
  },
  {
    id: 'communication',
    role: { fr: 'Communication', en: 'Communications' },
    bio: {
      fr: "Raconte l'AIA au grand public : réseaux sociaux, presse, et ce site.",
      en: 'Tells AIA’s story to the public: social media, press, and this website.',
    },
  },
];

export function seedTeam(lang: Lang): Member[] {
  return TEAM.map((m) => ({
    id: m.id,
    nom: lang === 'fr' ? 'Membre du bureau' : 'Board member',
    role: pick(m.role, lang),
    bio: pick(m.bio, lang),
    photo: '/placeholders/avatar.svg',
  }));
}
