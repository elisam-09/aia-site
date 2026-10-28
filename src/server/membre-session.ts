/**
 * Session de l'espace membre : ouverte avec la clé d'accès personnelle, sans mot de passe ni compte.
 * Cookie httpOnly contenant un jeton aléatoire ; seule son empreinte SHA-256 est stockée en base.
 */
import { createHash, randomBytes } from 'node:crypto';
import type { AstroCookies } from 'astro';
import * as repo from './db/repo';
import type { AdhesionRow } from './db/types';
import { hashCle, normaliserCle } from './membre';
import { noterEchec, reinitialiser, tropDeTentatives } from './ratelimit';

export const MEMBRE_COOKIE = 'aia_membre';
const SESSION_JOURS = 7;
const empreinte = (jeton: string) => createHash('sha256').update(jeton).digest('hex');

/** Membre connecté d'après son cookie, ou null. N'accepte que les demandes retenues ou devenues membres. */
export function membreCourant(cookies: AstroCookies): AdhesionRow | null {
  const jeton = cookies.get(MEMBRE_COOKIE)?.value;
  if (!jeton) return null;
  const a = repo.getSessionMembre(empreinte(jeton));
  return a && (a.statut === 'retenue' || a.statut === 'membre') ? a : null;
}

export type ResultatConnexion = { ok: true } | { ok: false; raison: 'cle' | 'limite' };

/** Vérifie la clé saisie et ouvre la session (pose le cookie). Les essais ratés par adresse sont limités. */
export function connecterMembre(cookies: AstroCookies, saisie: string, ip: string, secure: boolean): ResultatConnexion {
  const limite = `membre|${ip}`;
  if (tropDeTentatives(limite)) return { ok: false, raison: 'limite' };
  const cle = normaliserCle(saisie);
  const a = cle ? repo.getAdhesionParCle(hashCle(cle)) : undefined;
  if (!a || (a.statut !== 'retenue' && a.statut !== 'membre')) {
    noterEchec(limite);
    return { ok: false, raison: 'cle' };
  }
  reinitialiser(limite);
  const jeton = randomBytes(32).toString('hex');
  const expire = new Date(Date.now() + SESSION_JOURS * 86_400_000).toISOString();
  repo.creerSessionMembre(empreinte(jeton), a.id, expire);
  cookies.set(MEMBRE_COOKIE, jeton, { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: SESSION_JOURS * 86_400 });
  return { ok: true };
}

export function deconnecterMembre(cookies: AstroCookies): void {
  const jeton = cookies.get(MEMBRE_COOKIE)?.value;
  if (jeton) repo.supprimerSessionMembre(empreinte(jeton));
  cookies.delete(MEMBRE_COOKIE, { path: '/' });
}

/** Adhésion en cours de validité : membre, et date de fin non dépassée. */
export function adhesionActive(a: AdhesionRow, aujourdhui = new Date().toISOString().slice(0, 10)): boolean {
  return a.statut === 'membre' && !!a.expire_le && a.expire_le >= aujourdhui;
}
