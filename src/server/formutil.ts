/** Petits utilitaires de lecture de champs de formulaire (FormData). */

export function str(fd: FormData, name: string): string {
  const v = fd.get(name);
  return typeof v === 'string' ? v.trim() : '';
}

export function strOrNull(fd: FormData, name: string): string | null {
  return str(fd, name) || null;
}

export function int(fd: FormData, name: string, def = 0): number {
  const n = parseInt(str(fd, name), 10);
  return Number.isNaN(n) ? def : n;
}

/** Case à cocher → 1 (cochée) ou 0. */
export function bool(fd: FormData, name: string): number {
  return fd.get(name) ? 1 : 0;
}

/** Transforme un texte en slug (adresse d'URL). */
export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // retire les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}
