/**
 * Plan du site des articles (FR + EN), généré à la volée depuis la base :
 * le module @astrojs/sitemap ne voit que les pages fixes en mode serveur.
 */
import type { APIRoute } from 'astro';
import { listActualites } from '../server/db/repo';

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL('https://aia-ci.cloud')).origin;
  const urls = listActualites(true).flatMap((a) => {
    const lastmod = (a.maj_le || a.date).slice(0, 10);
    return [`/actualites/${a.slug}/`, `/en/news/${a.slug}/`].map(
      (p) => `<url><loc>${base}${p}</loc><lastmod>${lastmod}</lastmod></url>`,
    );
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`;
  return new Response(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' },
  });
};
