import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join, normalize } from 'node:path';
import { UPLOADS_DIR } from '../../server/media';

const TYPES: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
};

export const GET: APIRoute = async ({ params }) => {
  const rel = params.file ?? '';
  // Anti path-traversal : on retire les remontées puis on vérifie que le chemin reste dans UPLOADS_DIR
  const safe = normalize(rel).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
  const full = join(UPLOADS_DIR, safe);
  if (!full.startsWith(UPLOADS_DIR)) {
    return new Response('Interdit', { status: 403 });
  }
  try {
    const data = await readFile(full);
    const ext = safe.split('.').pop()?.toLowerCase() ?? '';
    return new Response(new Uint8Array(data), {
      headers: {
        'Content-Type': TYPES[ext] ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Introuvable', { status: 404 });
  }
};
