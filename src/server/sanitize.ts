/**
 * Nettoyage HTML conservateur pour le corps des articles (saisi par des admins de
 * confiance via l'éditeur). Liste blanche de balises, suppression des attributs
 * (sauf href sur les liens), neutralisation de script/style et des URL javascript:.
 */
const ALLOWED = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'blockquote',
]);

export function sanitizeHtml(input: string): string {
  if (!input) return '';
  let html = input;

  // Retire entièrement les blocs dangereux
  html = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '');

  // Les <div> produits par l'éditeur deviennent des paragraphes
  html = html.replace(/<div[^>]*>/gi, '<p>').replace(/<\/div>/gi, '</p>');

  // Passe en liste blanche
  html = html.replace(/<(\/?)([a-zA-Z0-9]+)([^>]*)>/g, (_m, slash: string, tagRaw: string, attrs: string) => {
    const tag = tagRaw.toLowerCase();
    if (!ALLOWED.has(tag)) return '';
    if (slash) return `</${tag}>`;
    if (tag === 'a') {
      const m = attrs.match(/href\s*=\s*"([^"]*)"/i) || attrs.match(/href\s*=\s*'([^']*)'/i);
      let url = m ? m[1] : '';
      if (/^\s*javascript:/i.test(url) || /^\s*data:/i.test(url)) url = '';
      return url ? `<a href="${url.replace(/"/g, '&quot;')}" rel="noopener">` : '<a>';
    }
    return `<${tag}>`;
  });

  // Nettoie les paragraphes vides
  html = html.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, '');
  return html.trim();
}
