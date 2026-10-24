/**
 * Export CSV (Excel, séparateur « ; ») des statistiques d'audience : une ligne par jour,
 * puis les classements de la période. Réservé aux administrateurs connectés (middleware).
 */
import type { APIRoute } from 'astro';
import { lireMesures } from '../../server/db/repo';
import { PLAGES, calculer, jours, type Classement } from '../../lib/audience';

const cellule = (v: string | number) => {
  const s = String(v);
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const GET: APIRoute = ({ url }) => {
  const demande = Number(url.searchParams.get('jours'));
  const plage = (PLAGES as readonly number[]).includes(demande) ? demande : 30;
  const lignes = lireMesures(jours(plage * 2)[0]);
  const a = calculer(lignes, plage);

  const parJour = new Map<string, Map<string, number>>();
  for (const r of lignes) {
    if (r.jour === 'total' || r.jour === 'meta') continue;
    if (!parJour.has(r.jour)) parJour.set(r.jour, new Map());
    parJour.get(r.jour)!.set(r.cle, r.valeur);
  }

  const rows: (string | number)[][] = [
    ['Rapport d’audience – AIA'],
    ['Généré le', new Date().toISOString()],
    [],
    ['Date', 'Visites', 'Pages vues', 'Visiteurs uniques', 'Nouveaux', 'Revenants', 'Visites engagées', 'Durée totale (s)'],
  ];
  for (const j of [...parJour.keys()].sort()) {
    const m = parJour.get(j)!;
    rows.push([j, m.get('visites') ?? 0, m.get('vues') ?? 0, m.get('uniques') ?? 0, m.get('nouveaux') ?? 0, m.get('revenants') ?? 0, m.get('engagees') ?? 0, m.get('secondes') ?? 0]);
  }
  const bloc = (titre: string, liste: Classement[]) => {
    rows.push([], [`${titre} (${plage} derniers jours)`], ['Élément', 'Total']);
    if (!liste.length) rows.push(['Aucune donnée']);
    for (const l of liste) rows.push([l.nom, l.n]);
  };
  bloc('Sections vues', a.sections);
  bloc('Actions', a.actions);
  bloc('Pages', a.pages);
  bloc('Provenance', a.origines);
  bloc('Pays', a.pays);
  bloc('Fuseaux horaires', a.fuseaux);
  bloc('Appareils', a.appareils);
  bloc('Navigateurs', a.navigateurs);
  bloc('Systèmes', a.systemes);
  bloc('Langues', a.langues);

  const csv = '﻿' + rows.map((r) => r.map(cellule).join(';')).join('\n');
  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="audience-aia-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
};
