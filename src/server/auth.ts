/**
 * Authentification : hachage de mot de passe (scrypt, intégré à Node), et sessions
 * par cookie opaque (jeton aléatoire stocké en base). Aucune dépendance externe.
 */
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { AstroCookies } from 'astro';
import * as repo from './db/repo';
import type { Role } from './db/types';

const scrypt = promisify(scryptCb);

export const SESSION_COOKIE = 'aia_session';
const SESSION_JOURS = 14;
const KEYLEN = 64;

/** Produit une chaîne « scrypt$sel$empreinte » stockable en base. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const dk = (await scrypt(password, salt, KEYLEN)) as Buffer;
  return `scrypt$${salt.toString('hex')}$${dk.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  const dk = (await scrypt(password, salt, expected.length)) as Buffer;
  return dk.length === expected.length && timingSafeEqual(dk, expected);
}

export interface SessionAdmin {
  id: number;
  email: string;
  nom: string;
  role: Role;
}

/** Vérifie les identifiants et, si OK, ouvre une session (pose le cookie). */
export async function login(
  cookies: AstroCookies,
  email: string,
  password: string,
): Promise<SessionAdmin | null> {
  const a = repo.getAdminByEmail(email);
  // On hache toujours (même compte inexistant) pour ne pas révéler l'existence par le temps de réponse
  if (!a || !a.actif) {
    await scrypt(password, randomBytes(16), KEYLEN);
    return null;
  }
  if (!(await verifyPassword(password, a.password_hash))) return null;

  const token = randomBytes(32).toString('hex');
  const expire = new Date(Date.now() + SESSION_JOURS * 86_400_000).toISOString();
  repo.createSession(token, a.id, expire);
  repo.touchLogin(a.id);
  cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
    maxAge: SESSION_JOURS * 86_400,
  });
  return { id: a.id, email: a.email, nom: a.nom, role: a.role };
}

export function logout(cookies: AstroCookies): void {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (token) repo.deleteSession(token);
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

/** Renvoie l'admin connecté d'après le cookie, ou null. Ne touche pas la base si pas de cookie. */
export function currentAdmin(cookies: AstroCookies): SessionAdmin | null {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const s = repo.getSession(token);
  if (!s) return null;
  if (s.expire_le < new Date().toISOString()) {
    repo.deleteSession(token);
    return null;
  }
  const a = repo.getAdminById(s.admin_id);
  if (!a || !a.actif) return null;
  return { id: a.id, email: a.email, nom: a.nom, role: a.role };
}
