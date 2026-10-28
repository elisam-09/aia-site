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

/** `max` : nombre d'événements tolérés dans la fenêtre (6 par défaut, pour les mots de passe et clés). */
export function tropDeTentatives(cle: string, max = MAX_ESSAIS): boolean {
  const e = registre.get(cle);
  if (!e) return false;
  if (Date.now() - e.premier > FENETRE_MS) {
    registre.delete(cle);
    return false;
  }
  return e.echecs >= max;
}

export function noterEchec(cle: string): void {
  const now = Date.now();
  // la table ne grossit pas sans fin (adresses usurpées) : on purge les entrées périmées au-delà de 5000
  if (registre.size > 5000) for (const [k, v] of registre) if (now - v.premier > FENETRE_MS) registre.delete(k);
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
