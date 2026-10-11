/**
 * La Lune de ce soir : phase calculée à partir d'une nouvelle Lune de référence
 * (6 janv. 2000, 18 h 14 UTC ; lunaison 29,530588853 j), rendue pixel par pixel sur un
 * canvas avec la texture lunaire NASA et un terminateur adouci. Horloge GMT d'Abidjan.
 * (Porté du site AIA de Jcalixte24.)
 */

type Lang = 'fr' | 'en';

const NOMS: Record<Lang, string[]> = {
  fr: [
    'Nouvelle Lune',
    'Premier croissant',
    'Premier quartier',
    'Gibbeuse croissante',
    'Pleine Lune',
    'Gibbeuse décroissante',
    'Dernier quartier',
    'Dernier croissant',
  ],
  en: [
    'New Moon',
    'Waxing crescent',
    'First quarter',
    'Waxing gibbous',
    'Full Moon',
    'Waning gibbous',
    'Last quarter',
    'Waning crescent',
  ],
};

const LUNAISON = 29.530588853;
const REF = Date.UTC(2000, 0, 6, 18, 14);

export function phaseLune(maintenant = Date.now()) {
  const age = ((((maintenant - REF) / 864e5) % LUNAISON) + LUNAISON) % LUNAISON;
  const ph = age / LUNAISON;
  return { age, ph, eclairage: (1 - Math.cos(2 * Math.PI * ph)) / 2 };
}

export function initLune(racine: HTMLElement, lang: Lang): void {
  const $ = <T extends HTMLElement>(s: string) => racine.querySelector<T>(s);
  const canvas = $<HTMLCanvasElement>('canvas.lune__disque');
  if (!canvas) return;
  const g = canvas.getContext('2d')!;
  let texture: { w: number; h: number; d: Uint8ClampedArray } | null = null;

  const textes = (m: ReturnType<typeof phaseLune>) => {
    const nom = NOMS[lang][Math.round(m.ph * 8) % 8];
    const pct = Math.round(m.eclairage * 100) + ' %';
    const age = m.age.toFixed(1);
    const set = (s: string, v: string) => {
      const el = $(s);
      if (el) el.textContent = v;
    };
    set('[data-lune="phase"]', nom);
    set('[data-lune="eclairage"]', pct);
    set('[data-lune="age"]', lang === 'fr' ? `Âge : ${age.replace('.', ',')} jours` : `Age: ${age} days`);
    set('[data-lune="resume"]', (lang === 'fr' ? "Aujourd'hui : " : 'Today: ') + `${nom} (${pct})`);
  };

  const peindre = (m: ReturnType<typeof phaseLune>) => {
    const N = canvas.width, R = N / 2 - 3, out = g.createImageData(N, N), d = out.data;
    const a = 2 * Math.PI * m.ph, Lx = Math.sin(a), Lz = -Math.cos(a);
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const nx = (x + 0.5 - N / 2) / R, ny = (y + 0.5 - N / 2) / R, r2 = nx * nx + ny * ny;
        if (r2 > 1.01) continue;
        const nz = Math.sqrt(Math.max(0, 1 - r2));
        const bord = Math.min(1, Math.max(0, (1 - Math.sqrt(r2)) * R + 0.5));
        const i = (y * N + x) * 4;
        let v: number;
        if (texture) {
          const lat = Math.asin(-Math.max(-1, Math.min(1, ny))), lon = Math.atan2(nx, nz);
          const u = Math.min(texture.w - 1, Math.max(0, Math.floor(((lon / Math.PI + 1) / 2) * texture.w)));
          const vv = Math.min(texture.h - 1, Math.max(0, Math.floor((0.5 - lat / Math.PI) * texture.h)));
          v = Math.min(255, texture.d[(vv * texture.w + u) * 4] * 1.3);
        } else v = 170 - 60 * r2;
        let l = Math.min(1, Math.max(0, (nx * Lx + nz * Lz + 0.08) * 1.9));
        l = l * l * (3 - 2 * l);
        const k = 0.045 + 0.955 * l;
        // teinte légèrement chaude (crème) plutôt que bleutée
        d[i] = Math.min(255, v * k * 1.03 + 8);
        d[i + 1] = Math.min(255, v * k + 5);
        d[i + 2] = Math.min(255, v * k * 0.98 + 8);
        d[i + 3] = 255 * bord;
      }
    g.putImageData(out, 0, 0);
  };

  const rafraichir = () => {
    const m = phaseLune();
    textes(m);
    peindre(m);
  };

  const img = new Image();
  img.onload = () => {
    try {
      const o = document.createElement('canvas');
      o.width = img.width;
      o.height = img.height;
      const og = o.getContext('2d')!;
      og.drawImage(img, 0, 0);
      texture = { w: o.width, h: o.height, d: og.getImageData(0, 0, o.width, o.height).data };
    } catch {
      texture = null;
    }
    rafraichir();
  };
  img.onerror = rafraichir;
  img.src = '/images/textures/moon.webp';
  rafraichir();
  setInterval(rafraichir, 10 * 60 * 1000);

  const heure = $('[data-lune="heure"]');
  if (heure) {
    const tic = () => {
      const d = new Date();
      heure.textContent = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
    };
    tic();
    setInterval(tic, 20000);
  }
}
