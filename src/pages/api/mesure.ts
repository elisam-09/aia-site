/**
 * Réception des mesures d'audience envoyées par `scripts/mesure.ts`.
 * Anonyme : seuls des compteurs par jour sont enregistrés (pas d'IP, pas d'identifiant).
 * - ignore les robots et les administrateurs connectés
 * - limite : 240 messages par adresse IP toutes les 10 minutes (en mémoire)
 * - répond toujours 204 : le visiteur n'a rien à savoir de la mesure
 */
import type { APIRoute } from 'astro';
import { currentAdmin } from '../../server/auth';
import { ajouterMesures, fixerMesure } from '../../server/db/repo';
import {
  appareil, chemin, entier, estRobot, fuseau, langue, motSimple, navigateur, origine, pays, systeme,
} from '../../server/mesure';

const FENETRE_MS = 10 * 60_000;
const MAX = 240;
const MAX_SECONDES = 1800;
const envois = new Map<string, number[]>();

function limite(ip: string): boolean {
  const t = Date.now();
  const recents = (envois.get(ip) ?? []).filter((x) => t - x < FENETRE_MS);
  recents.push(t);
  envois.set(ip, recents);
  if (envois.size > 5000) for (const [k, v] of envois) if (!v.some((x) => t - x < FENETRE_MS)) envois.delete(k);
  return recents.length > MAX;
}

const fin = () => new Response(null, { status: 204 });

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const ua = request.headers.get('user-agent') ?? '';
  if (estRobot(ua) || currentAdmin(cookies)) return fin();

  let ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
  if (!ip) {
    try {
      ip = clientAddress;
    } catch {
      ip = 'inconnue';
    }
  }
  if (limite(ip)) return fin();

  let m: Record<string, unknown>;
  try {
    const texte = await request.text();
    if (texte.length > 2000) return fin();
    m = JSON.parse(texte);
    if (!m || typeof m !== 'object') return fin();
  } catch {
    return fin();
  }

  const jour = new Date().toISOString().slice(0, 10);
  const inc: Record<string, number> = {}; // compteurs du jour
  const cumul: Record<string, number> = {}; // compteurs « depuis le début »
  const un = (cle: string) => (inc[cle] = (inc[cle] ?? 0) + 1);
  const toujours = (cle: string) => (cumul[cle] = (cumul[cle] ?? 0) + 1);
  let nouvelleVisite = false;

  switch (m.e) {
    case 'v': {
      const page = chemin(m.p);
      un('vues');
      toujours('vues');
      if (page) un(`page:${page}`);
      if (m.s === true) {
        nouvelleVisite = true;
        const largeur = entier(m.w, 200, 10000) ?? 1024;
        const heure = entier(m.h, 0, 23);
        const jourSemaine = entier(m.d, 0, 6);
        const hote = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '')
          .split(':')[0]
          .toLowerCase()
          .replace(/^www\./, '');
        un('visites');
        toujours('visites');
        un(`appareil:${appareil(largeur)}`);
        un(`navigateur:${navigateur(ua)}`);
        un(`systeme:${systeme(ua)}`);
        un(`origine:${origine(typeof m.r === 'string' ? m.r : '', hote)}`);
        un(`fuseau:${fuseau(m.z)}`);
        un(`langue:${langue(m.l)}`);
        const p = pays(request.headers);
        if (p) un(`pays:${p}`);
        if (heure !== null) un(`heure:${heure}`);
        if (jourSemaine !== null) un(`semaine:${jourSemaine}`);
        un(m.n === true ? 'nouveaux' : 'revenants');
        if (m.u === true) un('uniques');
        if (m.n === true) toujours('uniques');
      }
      break;
    }
    case 'g':
      un('engagees');
      break;
    case 's': {
      const id = motSimple(m.id);
      if (id) un(`section:${id}`);
      break;
    }
    case 'a': {
      const nom = motSimple(m.n);
      if (nom) un(`action:${nom}`);
      break;
    }
    case 't': {
      const s = entier(m.s, 1, MAX_SECONDES);
      if (s !== null) {
        inc.secondes = s;
        if (m.c === true) un('chronometrees');
      }
      break;
    }
    default:
      return fin();
  }

  try {
    ajouterMesures(jour, inc);
    if (Object.keys(cumul).length) ajouterMesures('total', cumul);
    if (nouvelleVisite) fixerMesure('meta', 'derniere_visite', Math.floor(Date.now() / 1000));
  } catch (e) {
    console.error('[mesure] échec enregistrement :', e);
  }
  return fin();
};
