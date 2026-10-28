/** Certificat PDF d'un membre, téléchargeable par le bureau (route protégée par le middleware /admin). */
import type { APIRoute } from 'astro';
import { getAdhesion } from '../../../../server/db/repo';
import { reponseCertificat } from '../../../../server/certificat-reponse';

export const GET: APIRoute = async ({ params, site, url }) => {
  const a = getAdhesion(Number(params.id));
  if (!a) return new Response('Introuvable', { status: 404 });
  return reponseCertificat(a, site ?? url.origin);
};
