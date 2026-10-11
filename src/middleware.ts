/**
 * Middleware : s'exécute à chaque requête.
 * - attache l'admin connecté à `locals.admin` (ou null)
 * - protège tout `/admin` (redirige vers la connexion si non authentifié)
 * - ajoute les en-têtes de sécurité standard à toutes les réponses
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

  const reponse = await next();
  entetesSecurite(reponse, path, url.protocol === 'https:' || context.request.headers.get('x-forwarded-proto') === 'https');
  return reponse;
});

/** En-têtes de sécurité standard (ajoutés s'ils manquent ; certaines réponses sont figées). */
function entetesSecurite(r: Response, path: string, https: boolean): void {
  const admin = path === '/admin' || path.startsWith('/admin/');
  const h: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': admin ? 'DENY' : 'SAMEORIGIN',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
  if (https) h['Strict-Transport-Security'] = 'max-age=31536000';
  if (admin) {
    h['Cache-Control'] = 'no-store';
    h['X-Robots-Tag'] = 'noindex, nofollow';
  }
  try {
    for (const [k, v] of Object.entries(h)) if (!r.headers.has(k)) r.headers.set(k, v);
  } catch {
    // Response.redirect() & co. ont des en-têtes non modifiables : on les laisse tels quels
  }
}
