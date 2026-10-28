/** Libellés partagés des demandes d'adhésion (formulaire public + portail admin). */
import type { ModePaiement, StatutAdhesion } from '../server/db/types';

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

/**
 * Parcours d'une demande : Nouvelle → Contactée → Retenue (le bureau est d'accord, les conditions
 * et le paiement sont communiqués) → Membre (paiement validé). « Refusée » est à part.
 */
export const STATUTS: Record<StatutAdhesion, string> = {
  nouvelle: 'Nouvelle',
  contactee: 'Contactée',
  retenue: 'Retenue',
  membre: 'Membre',
  refusee: 'Refusée',
};
/** Statuts que le bureau choisit à la main (« Retenue » et « Membre » passent par leurs boutons). */
export const STATUTS_MANUELS: StatutAdhesion[] = ['nouvelle', 'contactee', 'refusee'];

/** Profils pour lesquels on demande niveau d'études, filière et établissement. */
export const PROFILS_ETUDES: string[] = ['eleve', 'etudiant'];
export const estEtudes = (profil: string | null | undefined) => !!profil && PROFILS_ETUDES.includes(profil);

export const MODES_PAIEMENT: Record<ModePaiement, string> = {
  orange_money: 'Orange Money',
  mtn_money: 'MTN Money',
  moov_money: 'Moov Money',
  wave: 'Wave',
  especes: 'Espèces',
  virement: 'Virement',
  autre: 'Autre',
};

/** Tarif applicable : élèves et étudiants d'un côté, tous les autres profils de l'autre. */
export const tarifDe = (profil: string | null | undefined): 'etudiant' | 'travailleur' => (estEtudes(profil) ? 'etudiant' : 'travailleur');

export interface Tarifs {
  droit: number;
  cotisationEtudiant: number | null;
  cotisationTravailleur: number | null;
}

/** Montants en francs CFA à partir des réglages (champ vide = non renseigné). */
export function tarifsDepuis(r: Record<string, string>): Tarifs {
  const n = (v: string | undefined) => (v && /^\d+$/.test(v.replace(/\s/g, '')) ? Number(v.replace(/\s/g, '')) : null);
  return { droit: n(r.droit_adhesion) ?? 0, cotisationEtudiant: n(r.cotisation_etudiant), cotisationTravailleur: n(r.cotisation_travailleur) };
}

export const francs = (n: number) => n.toLocaleString('fr-FR').replace(/[  ]/g, ' ');

/** Total à régler à l'entrée (droit d'adhésion + première cotisation), ou null si la cotisation n'est pas renseignée. */
export function totalAPayer(t: Tarifs, profil: string | null | undefined): number | null {
  const c = tarifDe(profil) === 'etudiant' ? t.cotisationEtudiant : t.cotisationTravailleur;
  return c === null ? null : t.droit + c;
}

/** Message de bienvenue par défaut ; le bureau peut le modifier dans Réglages. Variables : {nom} {numero} {cle} {droit} {cotisation} {total} {paiement}. */
export const MSG_BIENVENUE_DEFAUT = {
  fr: `Bonjour {nom}, c'est l'Association Ivoirienne d'Astronomie (AIA) au sujet de ta demande d'adhésion.

Bonne nouvelle : ta demande est retenue ! Voici comment devenir membre.

Le droit d'adhésion est de {droit} F pour tous. La cotisation annuelle est de {cotisation} F pour ton profil. Total à régler : {total} F.

Paiement : {paiement}
Une fois le paiement effectué, envoie-nous ici la référence ou une capture. Le bureau valide, et tu deviens membre.

Ton numéro de membre : {numero}
Ta clé d'accès personnelle : {cle}
Garde-la précieusement et ne la partage pas : elle te permettra d'accéder à ton espace membre et à ton certificat d'adhésion.

À bientôt sous le ciel d'Abidjan !`,
  en: `Hello {nom}, this is the Ivorian Astronomy Association (AIA) about your membership request.

Good news: your request has been accepted! Here is how to become a member.

The joining fee is {droit} F for everyone. The yearly membership fee is {cotisation} F for your profile. Total to pay: {total} F.

Payment: {paiement}
Once you have paid, send us the reference or a screenshot here. The board validates it and you become a member.

Your member number: {numero}
Your personal access key: {cle}
Keep it safe and do not share it: it will give you access to your member area and your membership certificate.

See you soon under the Abidjan sky!`,
} as const;

/** Remplace les {variables} du modèle ; une variable inconnue est laissée telle quelle. */
export function remplir(modele: string, v: Record<string, string>): string {
  return modele.replace(/\{(\w+)\}/g, (m, k: string) => (k in v ? v[k] : m));
}
