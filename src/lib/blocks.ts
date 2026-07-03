import type { Block } from './types';

/** Échappe le texte avant injection HTML. */
export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Rend une liste de blocs (contenu seed ou Portable Text converti) en HTML.
 * Volontairement minimal : paragraphes, intertitres, citations, listes.
 */
export function renderBlocks(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'h2':
          return `<h2>${b.html ?? ''}</h2>`;
        case 'quote':
          return `<blockquote><p>${b.html ?? ''}</p></blockquote>`;
        case 'ul':
          return `<ul>${(b.items ?? []).map((i) => `<li>${i}</li>`).join('')}</ul>`;
        default:
          return `<p>${b.html ?? ''}</p>`;
      }
    })
    .join('\n');
}

/** Fabrique un paragraphe seed à partir de texte brut (échappé). */
export function p(text: string): Block {
  return { type: 'p', html: esc(text) };
}

export function h2(text: string): Block {
  return { type: 'h2', html: esc(text) };
}

export function quote(text: string): Block {
  return { type: 'quote', html: esc(text) };
}

export function ul(items: string[]): Block {
  return { type: 'ul', items: items.map(esc) };
}

/* ---------- Conversion Portable Text (Sanity) → Block[] ---------- */

interface PtSpan {
  _type: string;
  text?: string;
  marks?: string[];
}

interface PtMarkDef {
  _key: string;
  _type: string;
  href?: string;
}

export interface PtBlock {
  _type: string;
  style?: string;
  listItem?: string;
  children?: PtSpan[];
  markDefs?: PtMarkDef[];
}

function renderSpans(block: PtBlock): string {
  const defs = block.markDefs ?? [];
  return (block.children ?? [])
    .map((span) => {
      let html = esc(span.text ?? '');
      for (const mark of span.marks ?? []) {
        if (mark === 'strong') html = `<strong>${html}</strong>`;
        else if (mark === 'em') html = `<em>${html}</em>`;
        else {
          const def = defs.find((d) => d._key === mark);
          if (def?._type === 'link' && def.href) {
            html = `<a href="${esc(def.href)}" rel="noopener">${html}</a>`;
          }
        }
      }
      return html;
    })
    .join('');
}

export function ptToBlocks(pt: PtBlock[] | undefined): Block[] {
  if (!pt) return [];
  const out: Block[] = [];
  let liste: string[] | null = null;

  for (const b of pt) {
    if (b._type !== 'block') continue;
    if (b.listItem) {
      liste = liste ?? [];
      liste.push(renderSpans(b));
      continue;
    }
    if (liste) {
      out.push({ type: 'ul', items: liste });
      liste = null;
    }
    const html = renderSpans(b);
    if (!html.trim()) continue;
    if (b.style === 'h2' || b.style === 'h3') out.push({ type: 'h2', html });
    else if (b.style === 'blockquote') out.push({ type: 'quote', html });
    else out.push({ type: 'p', html });
  }
  if (liste) out.push({ type: 'ul', items: liste });
  return out;
}
