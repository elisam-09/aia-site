/** Réponse HTTP du certificat PDF d'un membre (utilisée par l'espace membre et par l'admin). */
import * as repo from './db/repo';
import type { AdhesionRow } from './db/types';
import { genererCertificat } from './certificat';
import { DEFAUTS } from '../lib/contact';

export async function reponseCertificat(a: AdhesionRow, site: string | URL): Promise<Response> {
  const aujourdhui = new Date().toISOString().slice(0, 10);
  if (a.statut !== 'membre' || !a.numero_membre || !a.membre_le || !a.expire_le || a.expire_le < aujourdhui) {
    return new Response('Aucun certificat valide pour cette adhésion.', { status: 403, headers: { 'cache-control': 'no-store' } });
  }
  const r = { ...DEFAUTS, ...repo.getReglages() } as Record<string, string>;
  // début de la période en cours : date du dernier paiement
  const paiements = repo.listPaiementsDe(a.id);
  const du = paiements[0]?.date ?? a.membre_le;
  const pdf = await genererCertificat({
    nom: a.nom,
    numero: a.numero_membre,
    du,
    au: a.expire_le,
    delivre: aujourdhui,
    urlVerification: new URL(`/verifier/${a.numero_membre}`, site).toString(),
    signataireNom: r.signataire_nom.trim(),
    signataireTitre: r.signataire_titre.trim() || 'Le Président',
  });
  return new Response(new Uint8Array(pdf), {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="certificat-${a.numero_membre}.pdf"`,
      'cache-control': 'no-store',
    },
  });
}
