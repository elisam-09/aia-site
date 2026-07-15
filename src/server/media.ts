/**
 * Gestion des images uploadées : enregistrement (redimensionné + converti en WebP)
 * dans le dossier local `uploads/`, servi via l'endpoint /media.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { join, resolve } from 'node:path';

export const UPLOADS_DIR = resolve(process.env.UPLOADS_PATH ?? 'uploads');
const MAX_BYTES = 12 * 1024 * 1024; // 12 Mo

/** Enregistre un fichier image et renvoie son chemin public (/media/…), ou null si invalide. */
export async function saveUpload(file: File, maxW = 1600): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  if (!file.type.startsWith('image/')) return null;
  if (file.size > MAX_BYTES) return null;

  mkdirSync(UPLOADS_DIR, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${randomBytes(5).toString('hex')}.webp`;
  await sharp(buf)
    .rotate() // respecte l'orientation EXIF
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(join(UPLOADS_DIR, name));
  return `/media/${name}`;
}

/**
 * Résout la valeur « image » d'un formulaire :
 * - nouveau fichier envoyé → on l'enregistre ;
 * - sinon case « retirer » cochée → null ;
 * - sinon on conserve l'image actuelle (champ caché image_actuelle).
 */
export async function imageFromForm(fd: FormData, maxW = 1600): Promise<string | null> {
  const nouvelle = fd.get('image');
  if (nouvelle instanceof File && nouvelle.size > 0) {
    const saved = await saveUpload(nouvelle, maxW);
    if (saved) return saved;
  }
  if (fd.get('image_supprimer')) return null;
  const actuelle = (fd.get('image_actuelle') ?? '').toString().trim();
  return actuelle || null;
}
