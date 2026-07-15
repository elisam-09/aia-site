/**
 * Middleware : s'exécute à chaque requête.
 * - attache l'admin connecté à `locals.admin` (ou null)
 * - protège tout `/admin` (redirige vers la connexion si non authentifié)
 * - vérifie l'origine des requêtes POST du portail (défense CSRF, en complément du cookie SameSite=Lax)
 */
import { defineMiddleware } from 'astro:middleware';
import { currentAdmin } from './server/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, locals, redirect, request } = context;
  const path = url.pathname;

  locals.admin = currentAdmin(cookies);

  if (path === '/admin' || path.startsWith('/admin/')) {
    const estConnexion = path.startsWith('/admin/login');
    const estDeconnexion = path.startsWith('/admin/logout');

    if (!locals.admin && !estConnexion && !estDeconnexion) {
      return redirect('/admin/login?suite=' + encodeURIComponent(path));
    }
    if (locals.admin && estConnexion) {
      return redirect('/admin');
    }

    // Défense CSRF : une requête POST doit venir de notre propre origine
    if (request.method === 'POST') {
      const origin = request.headers.get('origin');
      const host = request.headers.get('host');
      if (origin && host) {
        try {
          if (new URL(origin).host !== host) {
            return new Response('Origine non autorisée', { status: 403 });
          }
        } catch {
          return new Response('Origine invalide', { status: 403 });
        }
      }
    }
  }

  return next();
});
