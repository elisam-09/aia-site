/**
 * Réception d'une demande d'adhésion (formulaire de la page « Rejoindre l'AIA »).
 * - champ piège `_gotcha` : rempli = robot → on fait semblant d'accepter
 * - limite : 5 demandes par adresse IP toutes les 10 minutes (en mémoire)
 * - sans JS : redirection 303 vers la page avec ?adhesion=ok|erreur ; avec JS : réponse JSON
 */
import type { APIRoute } from 'astro';
import { createAdhesion } from '../../server/db/repo';
import { str } from '../../server/formutil';
import { routes } from '../../i18n/ui';
import { PROFILS, INTERETS, estEtudes } from '../../lib/adhesion';

const FENETRE_MS = 10 * 60_000;
const MAX = 5;
const envois = new Map<string, number[]>();

function limite(ip: string): boolean {
  const t = Date.now();
  const recents = (envois.get(ip) ?? []).filter((x) => t - x < FENETRE_MS);
  recents.push(t);
  envois.set(ip, recents);
  return recents.length > MAX;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const fd = await request.formData();
  const langue = str(fd, 'langue') === 'en' ? 'en' : 'fr';
  const veutJson = (request.headers.get('accept') ?? '').includes('application/json');
  const repondre = (ok: boolean, code?: string) =>
    veutJson
      ? new Response(JSON.stringify({ ok, code }), {
          status: ok ? 200 : 400,
          headers: { 'content-type': 'application/json' },
        })
      : new Response(null, {
          status: 303,
          headers: { location: `${routes.join[langue]}?adhesion=${ok ? 'ok' : code ?? 'erreur'}#formulaire` },
        });

  if (str(fd, '_gotcha')) return repondre(true);

  let ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
  if (!ip) {
    try {
      ip = clientAddress;
    } catch {
      ip = 'inconnue';
    }
  }
  if (limite(ip)) return repondre(false, 'limite');

  const nom = str(fd, 'nom').slice(0, 120);
  const email = str(fd, 'email').slice(0, 160);
  const telephone = str(fd, 'telephone').slice(0, 40);
  const ville = str(fd, 'ville').slice(0, 80);
  const profil = str(fd, 'profil');
  const motivation = str(fd, 'motivation').slice(0, 2000);
  const consentement = fd.get('consentement') === 'on';
  const etudes = estEtudes(profil);
  // niveau, filière et établissement ne concernent que les élèves et étudiants
  const niveau = etudes ? str(fd, 'niveau').slice(0, 80) : '';
  const specialite = etudes ? str(fd, 'specialite').slice(0, 120) : '';
  const etablissement = etudes ? str(fd, 'etablissement').slice(0, 120) : '';
  // cases à cocher : on ne garde que les clés connues, sans doublon
  const interets = [...new Set(fd.getAll('interets').map(String))].filter((k) => k in INTERETS);

  const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const telOk = !telephone || /^[+\d][\d\s().-]{5,}$/.test(telephone);
  if (nom.length < 2 || (!email && !telephone) || !emailOk || !telOk) return repondre(false, 'champs');
  if (!consentement) return repondre(false, 'consentement');

  createAdhesion({
    nom,
    email: email || null,
    telephone: telephone || null,
    ville: ville || null,
    profil: profil in PROFILS ? profil : null,
    motivation: motivation || null,
    interets: interets.length ? interets.join(',') : null,
    niveau: niveau || null,
    specialite: specialite || null,
    etablissement: etablissement || null,
    consentement,
    langue,
  });
  return repondre(true);
};
