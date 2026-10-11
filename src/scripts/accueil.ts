/**
 * Orchestration de l'accueil.
 *  - html.anim  : GSAP actif et animations autorisées (sinon tout est visible d'emblée)
 *  - html.webgl : WebGL disponible (télescope + globe) ; sinon hero classique centré
 * Les scènes three.js sont chargées à la demande (import dynamique).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import type { EtatTelescope } from './telescope';
import { initLune } from './lune';
import { initEclipseTeaser } from './eclipse-teaser';
import { activerGlisser, activerRevele } from './interactions';

type Lang = 'fr' | 'en';
const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => c.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) =>
  Array.from(c.querySelectorAll<T>(s));

function webglDispo(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function initAccueil(lang: Lang): void {
  const racine = document.documentElement;
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = webglDispo();
  if (gl) racine.classList.add('webgl');

  // la scène plein écran glisse sous l'en-tête collant
  const entete = document.querySelector<HTMLElement>('header');
  const majEntete = () => racine.style.setProperty('--entete-h', `${entete?.offsetHeight ?? 0}px`);
  majEntete();
  addEventListener('resize', majEntete);

  /* ---------- apparitions simples des couches (sans GSAP) ---------- */
  activerRevele('.apparait', 0.08);

  /* ---------- Lune, éclipse, globe ---------- */
  const lune = $('#lune');
  if (lune) initLune(lune, lang);
  const teaser = $<HTMLButtonElement>('#ecl-teaser');
  if (teaser) initEclipseTeaser(teaser, lang);
  const globe = $('#globe');
  if (globe && gl) {
    const charger = () =>
      import('./globe')
        .then((m) => m.initGlobe(globe, $<HTMLCanvasElement>('#globe-canvas')!, $('#globe-balise')!))
        .catch((e) => console.warn('Globe indisponible', e));
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          io.disconnect();
          charger();
        }
      },
      { rootMargin: '400px' },
    );
    io.observe(globe);
  }

  /* ---------- accordéon d'activités ---------- */
  const volets = $$('.volet');
  const ouvrir = (v: HTMLElement) =>
    volets.forEach((x) => {
      x.classList.toggle('ouvert', x === v);
      x.setAttribute('aria-expanded', String(x === v));
    });
  volets.forEach((v) => {
    v.addEventListener('mouseenter', () => {
      if (matchMedia('(hover: hover) and (min-width: 761px)').matches) ouvrir(v);
    });
    v.addEventListener('click', () => {
      const deja = v.classList.contains('ouvert');
      ouvrir(v);
      if (innerWidth <= 760 && !deja)
        setTimeout(() => {
          const r = v.getBoundingClientRect();
          if (r.top < 80 || r.bottom > innerHeight) scrollBy({ top: r.top - 90, behavior: 'smooth' });
        }, 380);
    });
    v.addEventListener('focus', () => ouvrir(v));
    v.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ouvrir(v);
      }
    });
  });

  /* ---------- bandes à faire glisser à la souris ---------- */
  activerGlisser();

  /* ---------- altimètre (couche visible) ---------- */
  const alt = $('#rail-alt'), point = $('#rail-point');
  const sections = $$<HTMLElement>('[data-alt]');
  const majRail = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (point) point.style.top = `calc(${(max > 0 ? scrollY / max : 0) * 100}% - 3px)`;
    let courant = sections[0];
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.5) courant = s;
    if (alt && courant) alt.textContent = courant.dataset.alt ?? '';
  };
  addEventListener('scroll', majRail, { passive: true });
  majRail();

  /* ---------- écran d'arrivée ---------- */
  const splash = $('#splash');
  const finSplash = () => splash?.classList.add('parti');
  const delaiSplash = splash ? (reduit ? 200 : 1600) : 0;

  /* ---------- compteurs ---------- */
  const compter = (b: HTMLElement, anime: boolean) => {
    if (b.dataset.fait) return;
    b.dataset.fait = '1';
    const n = Number(b.dataset.n), brut = !!b.dataset.brut, plus = !!b.dataset.plus;
    const fmt = (v: number) =>
      (brut ? String(v) : v.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB')) + (plus && v === n ? '+' : '');
    if (!anime) {
      b.textContent = fmt(n);
      return;
    }
    const o = { v: brut ? Math.max(0, n - 60) : 0 };
    gsap.to(o, { v: n, duration: 1.8, ease: 'power3.out', onUpdate: () => (b.textContent = fmt(Math.round(o.v))) });
  };

  /* ---------- sans animations : on s'arrête là ---------- */
  if (reduit) {
    setTimeout(finSplash, delaiSplash);
    $$('.stat b').forEach((b) => compter(b, false));
    if (gl) chargerTelescopeStatique();
    return;
  }

  /* ================= GSAP ================= */
  racine.classList.add('anim');
  gsap.registerPlugin(ScrollTrigger);

  let lenis: Lenis | null = null;
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    (window as unknown as { AIA_LENIS: Lenis }).AIA_LENIS = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis!.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const allerA = (cible: string | number) => {
    if (lenis) lenis.scrollTo(cible as HTMLElement | number, { offset: -10, duration: 1.8 });
    else if (typeof cible === 'number') scrollTo({ top: cible, behavior: 'smooth' });
    else document.querySelector(cible)?.scrollIntoView({ behavior: 'smooth' });
  };
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const h = a.getAttribute('href')!;
      if (h.length > 1 && document.querySelector(h)) {
        e.preventDefault();
        allerA(h);
      }
    }),
  );
  $('#passer')?.addEventListener('click', () => allerA('#systeme'));

  // intro du hero après l'écran d'arrivée
  setTimeout(() => {
    finSplash();
    gsap.to('#hero .masque > span', { y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.14, delay: 0.2 });
    gsap.to('#hero .rv', { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.7 });
  }, delaiSplash);

  /* --- télescope : décomposition puis plongée dans l'objectif --- */
  if (gl) {
    const S: EtatTelescope = { e: 0, o: 0, d: 0, t: 0, l: [0, 0, 0, 0, 0, 0, 0, 0] };
    import('./telescope')
      .then((m) => m.initTelescope($('#scene')!, $<HTMLCanvasElement>('#telescope')!, S))
      .catch((e) => {
        console.warn('Télescope indisponible', e);
        racine.classList.remove('webgl');
      });
    const eclate = $('#eclate')!, label = eclate.dataset.label ?? '';
    const noms = $$('.etiq b').map((b) => b.textContent ?? '');
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '#scene', start: 'top top', end: '+=280%', pin: true, scrub: 0.9, anticipatePin: 1 },
    });
    tl.to('#hero', { opacity: 0, y: -70, duration: 0.5, ease: 'power2.in' }, 0)
      .to('#indice', { opacity: 0, duration: 0.2 }, 0)
      .to('#eclate', { opacity: 1, duration: 0.3 }, 0.3)
      .to(S, {
        e: 1,
        o: 1,
        duration: 1.7,
        ease: 'power2.inOut',
        onUpdate: () => (eclate.textContent = `${label} · ${Math.round(S.e * 100)} %`),
      }, 0.25);
    noms.forEach((_, i) => tl.to(S.l, { [i]: 1, duration: 0.35, ease: 'power2.out' }, 1.0 + i * 0.2));
    tl.to({}, { duration: 0.5 });
    noms.forEach((_, i) => tl.to(S.l, { [i]: 0, duration: 0.3 }, 3.3));
    tl.to('#eclate', { opacity: 0, duration: 0.3 }, 3.3)
      .to(S, { d: 1, duration: 1.1, ease: 'power2.inOut' }, 3.4)
      .to(S, { t: 1, duration: 1.5, ease: 'power1.in' }, 4.5)
      .to('#flash', { opacity: 1, duration: 0.35, ease: 'power2.in' }, 5.55)
      .fromTo('#final', { opacity: 0, y: 50, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, 5.75)
      .to('#flash', { opacity: 0, duration: 0.6 }, 5.9)
      .to({}, { duration: 0.6 });
    // petits écrans : les étiquettes sont masquées, la légende passe dans le compteur
    ScrollTrigger.create({
      trigger: '#scene',
      start: 'top top',
      end: '+=280%',
      onUpdate: () => {
        let best = -1;
        S.l.forEach((v, i) => v > 0.5 && (best = i));
        if (best >= 0 && innerWidth < 1150) eclate.textContent = `${best + 1}/8 · ${noms[best].toUpperCase()}`;
      },
    });
  }

  /* --- manifeste révélé mot à mot --- */
  const manif = $('#manifeste-texte');
  if (manif) {
    const decouper = (el: Node) => {
      Array.from(el.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const f = document.createDocumentFragment();
          (n.textContent ?? '').split(/(\s+)/).forEach((m) => {
            if (!m.trim()) {
              if (m) f.appendChild(document.createTextNode(' '));
              return;
            }
            const s = document.createElement('span');
            s.className = 'mot';
            s.textContent = m;
            f.appendChild(s);
          });
          (n as ChildNode).replaceWith(f);
        } else if (n.nodeType === 1) decouper(n);
      });
    };
    decouper(manif);
    gsap.to('#manifeste-texte .mot', {
      opacity: 1,
      ease: 'none',
      stagger: 0.08,
      scrollTrigger: { trigger: '#manifeste', start: 'top 72%', end: 'center 45%', scrub: 0.6 },
    });
  }

  /* --- général --- */
  gsap.to('#defile', {
    xPercent: -35,
    ease: 'none',
    scrollTrigger: { trigger: '.defile', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
  });
  ScrollTrigger.batch('.rv:not(#hero .rv)', {
    start: 'top 90%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, overwrite: true }),
  });
  $$('.stat b').forEach((b) =>
    ScrollTrigger.create({ trigger: b, start: 'top 90%', once: true, onEnter: () => compter(b, true) }),
  );
  addEventListener('load', () => ScrollTrigger.refresh());

  /** Sans animations : télescope figé, assemblé, à côté du texte. */
  function chargerTelescopeStatique() {
    const S: EtatTelescope = { e: 0, o: 0, d: 0, t: 0, l: [0, 0, 0, 0, 0, 0, 0, 0] };
    import('./telescope')
      .then((m) => m.initTelescope($('#scene')!, $<HTMLCanvasElement>('#telescope')!, S))
      .catch(() => racine.classList.remove('webgl'));
  }
}
