/**
 * Export CSV des demandes d'adhésion (données personnelles : réservé aux administrateurs).
 * Séparateur « ; » et BOM UTF-8 pour une ouverture directe dans Excel.
 */
import type { APIRoute } from 'astro';
import { listAdhesions } from '../../../server/db/repo';
import { PROFILS, STATUTS } from '../../../lib/adhesion';

export const GET: APIRoute = ({ locals }) => {
  if (locals.admin?.role !== 'admin') return new Response('Réservé aux administrateurs', { status: 403 });
  // neutralise les formules (=, +, -, @) et échappe les guillemets
  const cel = (v: string | null) => {
    let s = (v ?? '').replace(/\r?\n/g, ' ');
    if (/^[=+\-@]/.test(s)) s = "'" + s;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lignes = [
    ['Date', 'Nom', 'E-mail', 'Téléphone', 'Ville', 'Profil', 'Motivation', 'Statut', 'Note'].map(cel).join(';'),
    ...listAdhesions().map((a) =>
      [
        a.cree_le.slice(0, 10),
        a.nom,
        a.email,
        a.telephone,
        a.ville,
        a.profil ? PROFILS[a.profil as keyof typeof PROFILS]?.fr ?? a.profil : '',
        a.motivation,
        STATUTS[a.statut],
        a.note,
      ]
        .map(cel)
        .join(';'),
    ),
  ];
  const jour = new Date().toISOString().slice(0, 10);
  return new Response('﻿' + lignes.join('\r\n'), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="aia-adhesions-${jour}.csv"`,
      'cache-control': 'no-store',
    },
  });
};
