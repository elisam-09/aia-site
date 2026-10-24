/**
 * Mesure d'audience anonyme (voir `pages/api/mesure.ts` et `/admin/audience`).
 * Envoie des évènements sans donnée personnelle : visite, sections vues, actions, durée.
 * Un identifiant aléatoire reste sur l'appareil (localStorage) pour distinguer nouveaux
 * visiteurs et revenants ; il n'est jamais envoyé au serveur. Aucun cookie.
 * Ne fait rien en développement, pour les robots (navigator.webdriver) ni sous « Do Not Track ».
 */
const URL_MESURE = '/api/mesure';
const ENGAGE_APRES_MS = 15_000;
const MAX_SECONDES = 1800;

function actif(): boolean {
  if (import.meta.env.DEV) return false;
  if (navigator.webdriver) return false;
  if (navigator.doNotTrack === '1' || (window as { doNotTrack?: string }).doNotTrack === '1') return false;
  return true;
}

function stock(zone: Storage | null, cle: string, valeur?: string): string | null {
  try {
    if (!zone) return null;
    if (valeur === undefined) return zone.getItem(cle);
    zone.setItem(cle, valeur);
    return valeur;
  } catch {
    return null;
  }
}

function envoyer(msg: Record<string, unknown>, garder = false): void {
  try {
    void fetch(URL_MESURE, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(msg),
      keepalive: garder,
    }).catch(() => {});
  } catch {
    /* la mesure ne doit jamais gêner la navigation */
  }
}

const RESEAUX: [RegExp, string][] = [
  [/wa\.me|whatsapp\.com/i, 'clic_whatsapp'],
  [/^tel:/i, 'clic_telephone'],
  [/^mailto:/i, 'clic_email'],
  [/facebook\.com|fb\.com/i, 'clic_facebook'],
  [/instagram\.com/i, 'clic_instagram'],
  [/youtube\.com|youtu\.be/i, 'clic_youtube'],
  [/tiktok\.com/i, 'clic_tiktok'],
  [/linkedin\.com/i, 'clic_linkedin'],
  [/(^|\/\/)(www\.)?(x|twitter)\.com/i, 'clic_x'],
];

function demarrer(): void {
  const jour = new Date().toISOString().slice(0, 10);
  let local: Storage | null = null;
  let session: Storage | null = null;
  try {
    local = window.localStorage;
    session = window.sessionStorage;
  } catch {
    /* stockage bloqué : on compte quand même la visite */
  }

  const nouveauVisiteur = !stock(local, 'aia_vid');
  if (nouveauVisiteur) stock(local, 'aia_vid', Math.random().toString(36).slice(2) + Date.now().toString(36));
  const dernierJour = stock(local, 'aia_jour');
  stock(local, 'aia_jour', jour);
  const nouvelleSession = !stock(session, 'aia_sid');
  if (nouvelleSession) stock(session, 'aia_sid', '1');

  let referent = '';
  try {
    referent = document.referrer ? new URL(document.referrer).hostname : '';
  } catch {
    /* adresse illisible */
  }
  const maintenant = new Date();
  let fuseau = '';
  try {
    fuseau = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    /* fuseau inconnu */
  }
  envoyer({
    e: 'v',
    p: location.pathname,
    s: nouvelleSession,
    n: nouveauVisiteur,
    u: dernierJour !== jour,
    w: window.innerWidth,
    r: referent,
    l: navigator.language,
    z: fuseau,
    h: maintenant.getHours(),
    d: maintenant.getDay(),
  });

  const action = (nom: string) => envoyer({ e: 'a', n: nom });
  if (new URLSearchParams(location.search).get('adhesion') === 'ok') action('adhesion_envoyee');

  /* Visite « engagée » : défilement, clic ou 15 s de présence */
  let engage = !!stock(session, 'aia_eng');
  const marquerEngage = () => {
    if (engage) return;
    engage = true;
    stock(session, 'aia_eng', '1');
    envoyer({ e: 'g' });
  };
  addEventListener('scroll', () => { if (scrollY > innerHeight * 0.8) marquerEngage(); }, { passive: true });
  document.addEventListener('click', marquerEngage, { once: true, capture: true });
  setTimeout(() => { if (document.visibilityState === 'visible') marquerEngage(); }, ENGAGE_APRES_MS);

  /* Sections vues : 35 % de la section, ou 40 % de l'écran pour les sections plus hautes que l'écran */
  if ('IntersectionObserver' in window) {
    const paliers = Array.from({ length: 21 }, (_, i) => i / 20);
    const io = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          const besoin = Math.min(e.boundingClientRect.height * 0.35, innerHeight * 0.4);
          if (e.isIntersecting && e.intersectionRect.height >= besoin) {
            envoyer({ e: 's', id: e.target.id });
            io.unobserve(e.target);
          }
        }
      },
      { threshold: paliers },
    );
    document.querySelectorAll('section[id]').forEach((s) => io.observe(s));
  }

  /* Actions : fenêtre éclipse, liens vers les réseaux, WhatsApp, téléphone, e-mail */
  document.addEventListener(
    'click',
    (ev) => {
      const cible = ev.target as Element | null;
      if (!cible?.closest) return;
      if (cible.closest('#ecl-teaser')) return action('popup_eclipse');
      const lien = cible.closest('a[href]');
      if (!lien) return;
      const href = lien.getAttribute('href') ?? '';
      const trouve = RESEAUX.find(([re]) => re.test(href));
      if (trouve) action(trouve[1]);
    },
    true,
  );
  addEventListener('hashchange', () => { if (location.hash === '#eclipse') action('popup_eclipse'); });

  /* Durée : temps passé page visible, envoyé quand la page est quittée ou mise en arrière-plan */
  let depuis = document.visibilityState === 'visible' ? Date.now() : 0;
  let cumule = 0;
  let envoye = 0;
  const vider = () => {
    if (depuis) { cumule += Date.now() - depuis; depuis = 0; }
    const s = Math.min(MAX_SECONDES, Math.round(cumule / 1000)) - envoye;
    if (s < 1) return;
    const premier = envoye === 0;
    envoye += s;
    envoyer({ e: 't', s, c: premier }, true);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') vider();
    else depuis = Date.now();
  });
  addEventListener('pagehide', vider);
}

if (actif()) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
}
