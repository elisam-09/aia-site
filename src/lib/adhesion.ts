/** Libellés partagés des demandes d'adhésion (formulaire public + portail admin). */
import type { StatutAdhesion } from '../server/db/types';

export const PROFILS = {
  eleve: { fr: 'Élève', en: 'Pupil' },
  etudiant: { fr: 'Étudiant·e', en: 'Student' },
  enseignant: { fr: 'Enseignant·e', en: 'Teacher' },
  passionne: { fr: 'Passionné·e', en: 'Enthusiast' },
  travailleur: { fr: 'Travailleur·euse', en: 'Working professional' },
  autre: { fr: 'Autre', en: 'Other' },
} as const;
export type Profil = keyof typeof PROFILS;

/** Centres d'intérêt (cases à cocher, choix multiples, facultatif). Stockés « cle1,cle2 ». */
export const INTERETS = {
  evenements: { fr: "Organisation d'événements", en: 'Event planning' },
  communication: { fr: 'Communication / création de contenu', en: 'Communication / content creation' },
  technologies: { fr: 'Nouvelles technologies / développement web', en: 'New technologies / web development' },
  gestion: { fr: 'Gestion', en: 'Management' },
} as const;
export type Interet = keyof typeof INTERETS;

/** « evenements,gestion » → ['evenements', 'gestion'] (clés inconnues ignorées). */
export function lireInterets(v: string | null | undefined): Interet[] {
  return (v ?? '').split(',').filter((k): k is Interet => k in INTERETS);
}

export const STATUTS: Record<StatutAdhesion, string> = {
  nouvelle: 'Nouvelle',
  contactee: 'Contactée',
  acceptee: 'Acceptée',
  refusee: 'Refusée',
};
