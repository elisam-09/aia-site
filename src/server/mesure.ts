/**
 * Mesure d'audience anonyme : outils de lecture des requêtes (navigateur, système, origine,
 * pays) et nettoyage des valeurs reçues. Rien de personnel n'est conservé : ni adresse IP,
 * ni identifiant, ni cookie — seulement des compteurs par jour (voir `mesure_jour`).
 */

const ROBOTS =
  /bot|crawl|spider|slurp|lighthouse|headless|preview|facebookexternalhit|whatsapp|curl|wget|python-requests|monitor|uptime/i;

export const estRobot = (ua: string): boolean => !ua || ROBOTS.test(ua);

export function navigateur(ua: string): string {
  if (/Edg\//.test(ua)) return 'edge';
  if (/OPR\/|Opera/.test(ua)) return 'opera';
  if (/SamsungBrowser/.test(ua)) return 'samsung';
  if (/Firefox\//.test(ua)) return 'firefox';
  if (/Chrome\//.test(ua)) return 'chrome';
  if (/Safari\//.test(ua)) return 'safari';
  return 'autre';
}

export function systeme(ua: string): string {
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Windows/i.test(ua)) return 'windows';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macos';
  if (/Linux/i.test(ua)) return 'linux';
  return 'autre';
}

export function appareil(largeur: number): string {
  return largeur < 640 ? 'mobile' : largeur < 1024 ? 'tablette' : 'ordinateur';
}

/** Provenance : réseau social / moteur connu, sinon le nom de domaine ; « direct » si aucune ou interne. */
export function origine(referent: string, hoteSite: string): string {
  const h = referent.toLowerCase().replace(/^(www|m|l)\./, '');
  if (!h || !/^[a-z0-9.-]{3,80}$/.test(h)) return 'direct';
  if (hoteSite && (h === hoteSite || h.endsWith('.' + hoteSite))) return 'direct';
  if (/facebook\.com|fb\.com|fb\.me/.test(h)) return 'facebook';
  if (/google\./.test(h)) return 'google';
  if (/instagram\.com/.test(h)) return 'instagram';
  if (/whatsapp\.com|wa\.me/.test(h)) return 'whatsapp';
  if (/(^|\.)t\.co$|twitter\.com|(^|\.)x\.com$/.test(h)) return 'x';
  if (/youtube\.com|youtu\.be/.test(h)) return 'youtube';
  if (/linkedin\.com|lnkd\.in/.test(h)) return 'linkedin';
  if (/bing\.com|duckduckgo\.com|yahoo\./.test(h)) return 'moteur';
  return h.replace(/\./g, '_');
}

/** Pays indiqué par le proxy (Cloudflare, Vercel…), sinon vide. */
export function pays(headers: Headers): string {
  for (const n of ['cf-ipcountry', 'x-vercel-ip-country', 'x-country-code']) {
    const v = (headers.get(n) ?? '').toUpperCase();
    if (/^[A-Z]{2}$/.test(v) && v !== 'XX' && v !== 'T1') return v;
  }
  return '';
}

/** Chemin de page nettoyé (sans requête ni ancre), ou '' s'il est suspect. */
export function chemin(p: unknown): string {
  if (typeof p !== 'string') return '';
  const net = p.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return /^\/[a-z0-9\-_/.]{0,80}$/i.test(net) ? net.toLowerCase() : '';
}

export const motSimple = (v: unknown): string =>
  typeof v === 'string' && /^[a-z0-9_-]{1,40}$/i.test(v) ? v.toLowerCase() : '';

export const entier = (v: unknown, min: number, max: number): number | null =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max ? v : null;

export const langue = (v: unknown): string =>
  typeof v === 'string' && /^[a-z]{2}/i.test(v) ? v.slice(0, 2).toLowerCase() : 'autre';

export const fuseau = (v: unknown): string =>
  typeof v === 'string' && v.length <= 40 && /^[A-Za-z]+(\/[A-Za-z_+-]+){0,2}$/.test(v) ? v.replace(/\//g, '_') : 'autre';
