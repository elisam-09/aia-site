/**
 * Calculs de l'onglet Audience : transforme les compteurs bruts (`mesure_jour`) en chiffres
 * clés, séries et classements. Fonctions pures, sans accès à la base.
 */
import type { MesureRow } from '../server/db/repo';

export const PLAGES = [7, 30, 90] as const;

/** Libellés lisibles des clés enregistrées. */
const LIBELLES: Record<string, string> = {
  direct: 'Accès direct', facebook: 'Facebook', google: 'Google', instagram: 'Instagram', whatsapp: 'WhatsApp',
  x: 'X (Twitter)', youtube: 'YouTube', linkedin: 'LinkedIn', moteur: 'Autre moteur de recherche',
  mobile: 'Mobile', tablette: 'Tablette', ordinateur: 'Ordinateur',
  chrome: 'Chrome', safari: 'Safari', firefox: 'Firefox', edge: 'Edge', opera: 'Opera', samsung: 'Samsung Internet',
  android: 'Android', ios: 'iOS', windows: 'Windows', macos: 'macOS', linux: 'Linux', autre: 'Autre',
  fr: 'Français', en: 'Anglais', es: 'Espagnol', ar: 'Arabe', pt: 'Portugais',
  popup_eclipse: 'Fenêtre éclipse ouverte', adhesion_envoyee: 'Demande d’adhésion envoyée',
  clic_whatsapp: 'Clic WhatsApp', clic_telephone: 'Clic téléphone', clic_email: 'Clic e-mail',
  clic_facebook: 'Clic Facebook', clic_instagram: 'Clic Instagram', clic_youtube: 'Clic YouTube',
  clic_tiktok: 'Clic TikTok', clic_linkedin: 'Clic LinkedIn', clic_x: 'Clic X',
  espace: 'Intro télescope', systeme: 'Système solaire', manifeste: 'Manifeste', observer: 'Observer le ciel',
  ceinture: 'Astéroïdes', orbite: 'Orbite et globe', atmosphere: 'Atmosphère', abidjan: 'Abidjan',
  '/': 'Accueil', '/en': 'Accueil (EN)',
};

const NOMS_PAYS = typeof Intl !== 'undefined' && 'DisplayNames' in Intl ? new Intl.DisplayNames(['fr'], { type: 'region' }) : null;

export function libelle(prefixe: string, cle: string): string {
  if (prefixe === 'pays') {
    try {
      return NOMS_PAYS?.of(cle) ?? cle;
    } catch {
      return cle;
    }
  }
  if (prefixe === 'fuseau') return cle === 'Africa_Abidjan' ? 'Côte d’Ivoire (Abidjan)' : cle.replace('_', '/').replace(/_/g, ' ');
  if (prefixe === 'origine' && !LIBELLES[cle]) return cle.replace(/_/g, '.');
  return LIBELLES[cle] ?? cle.replace(/[_-]/g, ' ');
}

export const SECTIONS_ORDRE = ['espace', 'systeme', 'manifeste', 'observer', 'ceinture', 'orbite', 'atmosphere', 'abidjan'];

export const jourIso = (d: Date) => d.toISOString().slice(0, 10);

/** `n` jours calendaires (UTC) se terminant `decalage` jours avant aujourd'hui, du plus ancien au plus récent. */
export function jours(n: number, decalage = 0, ref = new Date()): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(jourIso(new Date(ref.getTime() - (decalage + i) * 864e5)));
  return out.reverse();
}

export interface Classement {
  cle: string;
  nom: string;
  n: number;
}

export interface Audience {
  jours: string[];
  parJour: number[];
  visites: number;
  visitesPrecedentes: number;
  visitesAujourdhui: number;
  visitesHier: number;
  total: number;
  appareilsDistincts: number;
  uniques: number;
  nouveaux: number;
  revenants: number;
  engagees: number;
  vues: number;
  dureeMoyenne: number;
  mobile: number;
  derniereVisite: number;
  heures: number[];
  semaine: number[];
  sections: Classement[];
  actions: Classement[];
  pages: Classement[];
  origines: Classement[];
  pays: Classement[];
  fuseaux: Classement[];
  appareils: Classement[];
  navigateurs: Classement[];
  systemes: Classement[];
  langues: Classement[];
}

export function calculer(rows: MesureRow[], plage: number, ref = new Date()): Audience {
  const index = new Map<string, number>();
  for (const r of rows) index.set(`${r.jour}|${r.cle}`, r.valeur);
  const v = (jour: string, cle: string) => index.get(`${jour}|${cle}`) ?? 0;
  const somme = (js: string[], cle: string) => js.reduce((s, j) => s + v(j, cle), 0);

  const cur = jours(plage, 0, ref);
  const prec = jours(plage, plage, ref);
  const [aujourdhui] = jours(1, 0, ref);
  const [hier] = jours(1, 1, ref);

  const classement = (prefixe: string, ordre?: string[], max = 10): Classement[] => {
    const cumul = new Map<string, number>();
    for (const r of rows) {
      if (r.jour === 'total' || r.jour === 'meta' || !r.cle.startsWith(prefixe + ':') || !cur.includes(r.jour)) continue;
      const cle = r.cle.slice(prefixe.length + 1);
      cumul.set(cle, (cumul.get(cle) ?? 0) + r.valeur);
    }
    let cles = [...cumul.keys()];
    cles = ordre ? ordre.filter((c) => cumul.has(c)) : cles.sort((a, b) => cumul.get(b)! - cumul.get(a)!);
    return cles.slice(0, max).map((cle) => ({ cle, nom: libelle(prefixe, cle), n: cumul.get(cle)! }));
  };
  const serie = (prefixe: string, taille: number) =>
    Array.from({ length: taille }, (_, i) => somme(cur, `${prefixe}:${i}`));

  const visites = somme(cur, 'visites');
  const appareils = classement('appareil');
  const mob = appareils.find((a) => a.cle === 'mobile')?.n ?? 0;
  const totalAppareils = appareils.reduce((s, a) => s + a.n, 0);
  const secondes = somme(cur, 'secondes');

  return {
    jours: cur,
    parJour: cur.map((j) => v(j, 'visites')),
    visites,
    visitesPrecedentes: somme(prec, 'visites'),
    visitesAujourdhui: v(aujourdhui, 'visites'),
    visitesHier: v(hier, 'visites'),
    total: v('total', 'visites'),
    appareilsDistincts: v('total', 'uniques'),
    uniques: somme(cur, 'uniques'),
    nouveaux: somme(cur, 'nouveaux'),
    revenants: somme(cur, 'revenants'),
    engagees: somme(cur, 'engagees'),
    vues: somme(cur, 'vues'),
    dureeMoyenne: visites ? secondes / visites : 0,
    mobile: totalAppareils ? mob / totalAppareils : 0,
    derniereVisite: v('meta', 'derniere_visite'),
    heures: serie('heure', 24),
    semaine: serie('semaine', 7),
    sections: classement('section', SECTIONS_ORDRE),
    actions: classement('action'),
    pages: classement('page'),
    origines: classement('origine'),
    pays: classement('pays'),
    fuseaux: classement('fuseau'),
    appareils,
    navigateurs: classement('navigateur'),
    systemes: classement('systeme'),
    langues: classement('langue'),
  };
}

export const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : '–');
export const nombre = (n: number) => n.toLocaleString('fr-FR');

export function duree(s: number): string {
  if (!s) return '–';
  const m = Math.floor(s / 60);
  return m ? `${m} min ${String(Math.round(s % 60)).padStart(2, '0')} s` : `${Math.round(s)} s`;
}

export function ilYa(ts: number, now = Date.now()): string {
  if (!ts) return 'aucune visite enregistrée';
  const s = Math.max(0, Math.round(now / 1000 - ts));
  if (s < 90) return 'à l’instant';
  if (s < 3600) return `il y a ${Math.round(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.round(s / 3600)} h`;
  return `il y a ${Math.round(s / 86400)} j`;
}

/** Variation en % entre deux périodes (vide si la période précédente est vide). */
export function variation(cur: number, prev: number): { texte: string; sens: 'up' | 'down' | 'flat' } | null {
  if (!prev) return null;
  const p = Math.round(((cur - prev) / prev) * 100);
  return { texte: `${p > 0 ? '+' : ''}${p} %`, sens: p > 0 ? 'up' : p < 0 ? 'down' : 'flat' };
}
