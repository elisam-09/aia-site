/**
 * Actions POST de l'espace membre (connexion avec la clé, déconnexion), partagées par les pages FR et EN.
 * Renvoie une adresse de redirection, ou une erreur à afficher.
 */
import type { APIContext } from 'astro';
import { connecterMembre, deconnecterMembre } from './membre-session';
import { str } from './formutil';

export type ErreurMembre = '' | 'cle' | 'limite';

export async function traiterMembre(Astro: Pick<APIContext, 'request' | 'cookies' | 'url' | 'clientAddress'>): Promise<{ redirection?: string; erreur: ErreurMembre }> {
  if (Astro.request.method !== 'POST') return { erreur: '' };
  const fd = await Astro.request.formData();
  const action = str(fd, '_action');
  if (action === 'quitter') {
    deconnecterMembre(Astro.cookies);
    return { redirection: Astro.url.pathname, erreur: '' };
  }
  if (action === 'connexion') {
    let ip = Astro.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
    if (!ip) {
      try {
        ip = Astro.clientAddress;
      } catch {
        ip = 'inconnue';
      }
    }
    const proto = Astro.request.headers.get('x-forwarded-proto') ?? Astro.url.protocol.replace(':', '');
    const r = connecterMembre(Astro.cookies, str(fd, 'cle'), ip, proto === 'https');
    return r.ok ? { redirection: Astro.url.pathname, erreur: '' } : { erreur: r.raison };
  }
  return { erreur: '' };
}
