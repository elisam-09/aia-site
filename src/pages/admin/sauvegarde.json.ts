/** Télécharge tout le contenu éditorial en JSON (protégé par le middleware /admin). */
import type { APIRoute } from 'astro';
import { exporterContenu } from '../../server/db/repo';

export const GET: APIRoute = () => {
  const jour = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(exporterContenu(), null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': `attachment; filename="aia-sauvegarde-${jour}.json"`,
      'cache-control': 'no-store',
    },
  });
};
