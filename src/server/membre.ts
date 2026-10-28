/**
 * Numéro de membre et clé d'accès personnelle.
 * La clé est aléatoire (12 caractères sans ambiguïté, ≈ 60 bits) ; seule son empreinte SHA-256 est
 * conservée en base : on ne peut donc pas la relire, seulement la régénérer.
 */
import { createHash, randomBytes, randomInt } from 'node:crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // pas de 0/O ni de 1/I

export function genererCle(): string {
  const c = Array.from({ length: 12 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
  return `AIA-${c.slice(0, 4)}-${c.slice(4, 8)}-${c.slice(8)}`;
}

/** Normalise une saisie (espaces, minuscules, tirets oubliés) avant hachage. */
export function normaliserCle(saisie: string): string {
  const c = saisie.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^AIA/, '');
  return c.length === 12 ? `AIA-${c.slice(0, 4)}-${c.slice(4, 8)}-${c.slice(8)}` : '';
}

export const hashCle = (cle: string): string => createHash('sha256').update(cle).digest('hex');

/** AIA-2026-0042 */
export const formaterNumero = (annee: number, n: number): string => `AIA-${annee}-${String(n).padStart(4, '0')}`;

/** Code aléatoire (8 caractères hexadécimaux) du QR de vérification : le numéro de membre seul est séquentiel, donc devinable. */
export const genererVerif = (): string => randomBytes(4).toString('hex');
