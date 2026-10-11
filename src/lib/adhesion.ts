/** Libellés partagés des demandes d'adhésion (formulaire public + portail admin). */
import type { StatutAdhesion } from '../server/db/types';

export const PROFILS = {
  eleve: { fr: 'Élève', en: 'Pupil' },
  etudiant: { fr: 'Étudiant·e', en: 'Student' },
  enseignant: { fr: 'Enseignant·e', en: 'Teacher' },
  passionne: { fr: 'Passionné·e', en: 'Enthusiast' },
  autre: { fr: 'Autre', en: 'Other' },
} as const;
export type Profil = keyof typeof PROFILS;

export const STATUTS: Record<StatutAdhesion, string> = {
  nouvelle: 'Nouvelle',
  contactee: 'Contactée',
  acceptee: 'Acceptée',
  refusee: 'Refusée',
};
