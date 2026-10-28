/**
 * Coordonnées publiques de l'AIA. Valeurs par défaut (source : page Facebook de
 * l'association) ; le bureau les modifie dans /admin → Réglages (table `reglages`).
 */
import * as repo from '../server/db/repo';

export const DEFAUTS = {
  telephone: '+225 07 58 00 29 93',
  whatsapp: '2250758002993',
  email: '',
  facebook: 'https://www.facebook.com/Association.Ivoirienne.Astronomie',
  facebook_reels: 'https://www.facebook.com/Association.Ivoirienne.Astronomie/reels_tab',
  abonnes: '3,7 K',
  reseaux: '[]',
  accroche_fr: '',
  accroche_en: '',
  annonce_fr: '',
  annonce_en: '',
  annonce_bouton_fr: '',
  annonce_bouton_en: '',
  annonce_lien: '',
  // adhésion : montants en francs CFA (champ vide = pas encore renseigné), modes de paiement et message de bienvenue
  droit_adhesion: '5000',
  cotisation_etudiant: '5000',
  cotisation_travailleur: '10000',
  paiement_modes: '',
  validite_mois: '12',
  msg_bienvenue_fr: '',
  msg_bienvenue_en: '',
  conditions_fr: '',
  conditions_en: '',
  signataire_nom: '',
  signataire_titre: 'Le Président',
};
export type CleReglage = keyof typeof DEFAUTS;

export const TYPES_RESEAUX = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  x: 'X (Twitter)',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  site: 'Autre site',
} as const;
export type TypeReseau = keyof typeof TYPES_RESEAUX;

const httpOk = (u: string) => /^https?:\/\//i.test(u);

/** Réglages lus en base, complétés par les valeurs par défaut, prêts pour l'affichage. */
export function reglagesSite() {
  const r = { ...DEFAUTS, ...repo.getReglages() } as Record<CleReglage, string>;
  const chiffres = r.whatsapp.replace(/\D/g, '');
  let reseaux: { type: TypeReseau; url: string }[] = [];
  try {
    reseaux = (JSON.parse(r.reseaux || '[]') as { type: TypeReseau; url: string }[]).filter(
      (n) => n.type in TYPES_RESEAUX && httpOk(n.url),
    );
  } catch {
    reseaux = [];
  }
  return {
    ...r,
    telephoneLien: r.telephone ? 'tel:' + r.telephone.replace(/[^\d+]/g, '') : '',
    whatsappLien: chiffres ? `https://wa.me/${chiffres}` : '',
    facebook: httpOk(r.facebook) ? r.facebook : '',
    facebook_reels: httpOk(r.facebook_reels) ? r.facebook_reels : '',
    annonce_lien: httpOk(r.annonce_lien) || r.annonce_lien.startsWith('/') ? r.annonce_lien : '',
    reseaux,
  };
}

/** Icônes SVG (24×24) des réseaux, partagées par le pied de page et le contact. */
export const ICONES = {
  facebook:
    '<path fill="currentColor" d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.9.4-1.7 1.8-1.7h1.6V3.9s-1.3-.2-2.5-.2c-2.6 0-4.3 1.6-4.3 4.4v2.4H7.3v3.3h2.8V22h3.4z"/>',
  whatsapp:
    '<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.7 1.2 1.5 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.8.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z"/>',
  reels:
    '<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 9h18M8 3l3 6M14 3l3 6"/></g><path fill="currentColor" d="M10.5 13.5v4l3.5-2z"/>',
  instagram:
    '<g fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></g><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>',
  youtube:
    '<path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/>',
  x: '<path fill="currentColor" d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/>',
  linkedin:
    '<path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z"/>',
  tiktok:
    '<path fill="currentColor" d="M16.5 3c.4 2.1 1.7 3.6 3.9 3.9v3.2a7.4 7.4 0 0 1-3.9-1.2v6.3A6.2 6.2 0 1 1 10.3 9v3.3a3 3 0 1 0 2.1 2.9V3z"/>',
  site: '<g fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></g>',
  telephone:
    '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
};
