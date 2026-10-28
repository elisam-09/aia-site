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

/** Durée d'adhésion en toutes lettres : 12 → « 1 an », 6 → « 6 mois ». */
export function dureeTexte(mois: number, lang: 'fr' | 'en' = 'fr'): string {
  if (mois % 12 === 0) {
    const a = mois / 12;
    return lang === 'en' ? `${a} year${a > 1 ? 's' : ''}` : `${a} an${a > 1 ? 's' : ''}`;
  }
  return lang === 'en' ? `${mois} months` : `${mois} mois`;
}

/** Conditions par défaut (mécanique du site) ; le bureau peut les remplacer ou les compléter dans Réglages. */
export const CONDITIONS_DEFAUT = {
  fr: `- L'adhésion est personnelle et valable {duree} à partir de la date de ton paiement.
- Le droit d'adhésion se paie une seule fois ; la cotisation annuelle se renouvelle chaque année.
- Tu deviens membre une fois ton paiement validé par le bureau.
- Ton certificat d'adhésion est alors disponible dans ton espace membre.
- Ta clé d'accès est strictement personnelle : ne la partage pas.`,
  en: `- Membership is personal and valid for {duree} from the date of your payment.
- The joining fee is paid once; the yearly membership fee is renewed every year.
- You become a member once the board has validated your payment.
- Your membership certificate is then available in your member area.
- Your access key is strictly personal: do not share it.`,
} as const;

/** Message de bienvenue par défaut ; le bureau peut le modifier dans Réglages. */
export const MSG_BIENVENUE_DEFAUT = {
  fr: `Bonjour {nom}, c'est l'Association Ivoirienne d'Astronomie (AIA) au sujet de ta demande d'adhésion.

Bonne nouvelle : ta demande est retenue ! Voici tout ce qu'il faut savoir pour devenir membre.

PRIX
- Droit d'adhésion (une seule fois, pour tous) : {droit} F
- Cotisation annuelle ({profil_tarif}) : {cotisation} F
- Total à régler maintenant : {total} F
- Ensuite, seule la cotisation annuelle ({cotisation} F) est à renouveler chaque année.

CONDITIONS
{conditions}

COMMENT PAYER
{paiement}
Une fois le paiement effectué, envoie-nous ici la référence ou une capture d'écran. Le bureau valide, et tu deviens officiellement membre.

TON ACCÈS
Numéro de membre : {numero}
Clé d'accès personnelle : {cle}
Garde-la précieusement : avec elle, tu retrouves ton adhésion et tu télécharges ton certificat sur {lien}

À bientôt sous le ciel d'Abidjan !`,
  en: `Hello {nom}, this is the Ivorian Astronomy Association (AIA) about your membership request.

Good news: your request has been accepted! Here is everything you need to know to become a member.

PRICE
- Joining fee (once, for everyone): {droit} F
- Yearly membership fee ({profil_tarif}): {cotisation} F
- Total to pay now: {total} F
- After that, only the yearly membership fee ({cotisation} F) is renewed each year.

CONDITIONS
{conditions}

HOW TO PAY
{paiement}
Once you have paid, send us the reference or a screenshot here. The board validates it and you officially become a member.

YOUR ACCESS
Member number: {numero}
Personal access key: {cle}
Keep it safe: with it you can find your membership and download your certificate at {lien}

See you soon under the Abidjan sky!`,
} as const;

export interface DonneesMessage {
  nom: string;
  profil: string | null;
  langue: string;
  numero: string | null;
  /** clé en clair (seulement juste après sa création), sinon null */
  cle: string | null;
  /** adresse de l'espace membre (https://…/membre) */
  lien: string;
}

/** Message de bienvenue rempli pour une personne : prix détaillés, conditions, paiement, numéro et clé. */
export function messageBienvenue(d: DonneesMessage, reglages: Record<string, string>): string {
  const en = d.langue === 'en';
  const lang = en ? 'en' : 'fr';
  const tarifs = tarifsDepuis(reglages);
  const mois = Math.max(1, Number(reglages.validite_mois) || 12);
  const aPreciser = en ? '(to be confirmed)' : '(à préciser)';
  const etudiant = tarifDe(d.profil) === 'etudiant';
  const cot = etudiant ? tarifs.cotisationEtudiant : tarifs.cotisationTravailleur;
  const total = totalAPayer(tarifs, d.profil);
  const modele = (en ? reglages.msg_bienvenue_en : reglages.msg_bienvenue_fr) || MSG_BIENVENUE_DEFAUT[lang];
  const conditionsBrut = (en ? reglages.conditions_en : reglages.conditions_fr)?.trim() || CONDITIONS_DEFAUT[lang];
  return remplir(modele, {
    nom: d.nom,
    numero: d.numero ?? aPreciser,
    cle: d.cle ?? (en ? '(shown once: regenerate it)' : '(affichée une seule fois : régénère-la)'),
    droit: francs(tarifs.droit),
    cotisation: cot === null ? aPreciser : francs(cot),
    total: total === null ? aPreciser : francs(total),
    profil_tarif: etudiant ? (en ? 'pupils and students' : 'élèves et étudiants') : en ? 'workers and other profiles' : 'travailleurs et autres profils',
    duree: dureeTexte(mois, lang),
    conditions: remplir(conditionsBrut, { duree: dureeTexte(mois, lang) }),
    paiement: reglages.paiement_modes?.trim() || aPreciser,
    lien: d.lien,
  });
}

/** Remplace les {variables} du modèle ; une variable inconnue est laissée telle quelle. */
export function remplir(modele: string, v: Record<string, string>): string {
  return modele.replace(/\{(\w+)\}/g, (m, k: string) => (k in v ? v[k] : m));
}
