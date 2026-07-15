/**
 * Limitation simple des tentatives de connexion (en mémoire, un seul processus).
 * Bloque temporairement après trop d'échecs, par clé (email + IP).
 */
const MAX_ESSAIS = 6;
const FENETRE_MS = 15 * 60_000; // 15 min

interface Etat {
  echecs: number;
  premier: number;
}

const registre = new Map<string, Etat>();

export function tropDeTentatives(cle: string): boolean {
  const e = registre.get(cle);
  if (!e) return false;
  if (Date.now() - e.premier > FENETRE_MS) {
    registre.delete(cle);
    return false;
  }
  return e.echecs >= MAX_ESSAIS;
}

export function noterEchec(cle: string): void {
  const now = Date.now();
  const e = registre.get(cle);
  if (!e || now - e.premier > FENETRE_MS) {
    registre.set(cle, { echecs: 1, premier: now });
  } else {
    e.echecs += 1;
  }
}

export function reinitialiser(cle: string): void {
  registre.delete(cle);
}
