/**
 * Bouton « Prochaine éclipse » : compte à rebours vers l'éclipse la plus proche visible
 * depuis Abidjan (catalogue NASA, eclipse-core.js), et ouverture à la demande de la fenêtre
 * immersive 3D (eclipse.js + eclipse.css, chargés seulement au clic).
 * Module éclipse : travail de Jcalixte24, recoloré aux couleurs AIA. Fenêtre en français.
 */
import './eclipse/eclipse-core.js';

type Lang = 'fr' | 'en';
const LAT = 5.36, LON = -4.0083, TZ = 'Africa/Abidjan';

const T = {
  fr: {
    prochaine: 'Prochaine éclipse',
    depuis: 'Depuis Abidjan : ',
    enCours: 'EN COURS',
    unites: ['JOURS', 'HEURES', 'MIN', 'SEC'],
    cta: 'Tout savoir sur l’éclipse du ',
    erreur: 'Impossible de charger la fenêtre éclipse. Réessaie dans un instant.',
  },
  en: {
    prochaine: 'Next eclipse',
    depuis: 'From Abidjan: ',
    enCours: 'IN PROGRESS',
    unites: ['DAYS', 'HOURS', 'MIN', 'SEC'],
    cta: 'All about the eclipse of ',
    erreur: 'Could not load the eclipse window. Please try again shortly.',
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ECL = () => (window as any).ECL;

export function initEclipseTeaser(bouton: HTMLButtonElement, lang: Lang): void {
  if (!ECL()) return;
  const t = T[lang];
  const loc = lang === 'fr' ? 'fr-FR' : 'en-GB';
  const fD = (d: Date, o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(loc, { timeZone: TZ, ...o }).format(d);
  let charge: Promise<{ open: () => void }> | null = null;

  const ouvrir = () => {
    if (!charge) {
      charge = Promise.all([import('./eclipse/eclipse.css'), import('./eclipse/eclipse.js')]).then(
        ([, m]) => m as { open: () => void },
      );
    }
    bouton.disabled = true;
    charge
      .then((m) => {
        bouton.disabled = false;
        m.open();
      })
      .catch(() => {
        bouton.disabled = false;
        charge = null;
        alert(t.erreur);
      });
  };

  const peindre = () => {
    const n = ECL().nextEclipse(Date.now(), LAT, LON);
    if (!n) {
      bouton.hidden = true;
      return;
    }
    const c = n.c, r = n.r, solaire = c.kind === 'solar', max: Date = r.dateMax;
    const debut =
      solaire && r.visible ? r.c1.date.getTime() : !solaire && r.u1 ? r.u1.getTime() : max.getTime();
    const reste = Math.max(0, debut - Date.now());
    const j = Math.floor(reste / 864e5), h = Math.floor((reste % 864e5) / 36e5);
    const mi = Math.floor((reste % 36e5) / 6e4), s = Math.floor((reste % 6e4) / 1e3);
    const enCours = Date.now() >= debut && Date.now() <= ECL().endTime(c);
    const long = fD(max, { day: 'numeric', month: 'long', year: 'numeric' });
    const jour = fD(max, { weekday: 'long' });
    const vis = t.depuis + (n.notable ? n.label : String(n.label).toLowerCase());
    const pad = (x: number) => String(x).padStart(2, '0');
    bouton.hidden = false;
    bouton.innerHTML =
      `<small>${t.prochaine}</small><strong>${ECL().title(c)}</strong>` +
      `<div class="dt">${jour} ${long} · ${vis}</div>` +
      (enCours
        ? `<div class="cdm"><span><b style="color:#19b878">●</b>${t.enCours}</span></div>`
        : `<div class="cdm">${[j, pad(h), pad(mi), pad(s)]
            .map((v, i) => `<span><b>${v}</b>${t.unites[i]}</span>`)
            .join('')}</div>`) +
      `<span class="go">${t.cta}${fD(max, { day: 'numeric', month: 'long' })}${
        max.getUTCFullYear() !== new Date().getFullYear() ? ' ' + max.getUTCFullYear() : ''
      } →</span>`;
  };

  bouton.addEventListener('click', ouvrir);
  peindre();
  setInterval(peindre, 1000);
  if (location.hash === '#eclipse') setTimeout(ouvrir, 600);
  addEventListener('hashchange', () => location.hash === '#eclipse' && ouvrir());
}
