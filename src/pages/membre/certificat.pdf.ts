/** Téléchargement du certificat par le membre connecté (clé d'accès). */
import type { APIRoute } from 'astro';
import { membreCourant } from '../../server/membre-session';
import { reponseCertificat } from '../../server/certificat-reponse';

export const GET: APIRoute = async ({ cookies, site, url }) => {
  const m = membreCourant(cookies);
  if (!m) return new Response(null, { status: 303, headers: { location: '/membre/' } });
  return reponseCertificat(m, site ?? url.origin);
};
