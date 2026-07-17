/**
 * Middleware : s'exécute à chaque requête.
 * - attache l'admin connecté à `locals.admin` (ou null)
 * - protège tout `/admin` (redirige vers la connexion si non authentifié)
 *
 * Défense CSRF : assurée par le cookie de session en SameSite=Lax (non transmis lors
 * d'un POST venant d'un autre site). On ne compare pas Origin/Host ici car un
 * proxy/tunnel (Cloudflare, reverse-proxy Hostinger…) réécrit le Host.
 */
import { defineMiddleware } from 'astro:middleware';
import { currentAdmin } from './server/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, locals, redirect } = context;
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
  }

  return next();
});
