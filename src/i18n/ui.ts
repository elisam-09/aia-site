/**
 * i18n — chaînes d'interface partagées.
 * Le contenu éditorial long vit dans les pages (fr/en) et dans la couche contenu.
 */

export const languages = { fr: 'Français', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'fr';

export type PageId =
  | 'home'
  | 'about'
  | 'activities'
  | 'events'
  | 'news'
  | 'gallery'
  | 'join'
  | 'support'
  | 'partners'
  | 'contact';

/** Table des routes par langue — source de vérité pour la nav, le footer et le sélecteur de langue. */
export const routes: Record<PageId, Record<Lang, string>> = {
  home: { fr: '/', en: '/en/' },
  about: { fr: '/qui-sommes-nous/', en: '/en/about/' },
  activities: { fr: '/activites/', en: '/en/activities/' },
  events: { fr: '/evenements/', en: '/en/events/' },
  news: { fr: '/actualites/', en: '/en/news/' },
  gallery: { fr: '/galerie/', en: '/en/gallery/' },
  join: { fr: '/rejoindre/', en: '/en/join/' },
  support: { fr: '/support/', en: '/en/support/' },
  partners: { fr: '/partenaires/', en: '/en/partners/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
};

export const ui = {
  fr: {
    'site.nom': "Association Ivoirienne d'Astronomie",
    'site.sigle': 'AIA',
    'site.description':
      "L'Association Ivoirienne d'Astronomie promeut l'astronomie en Côte d'Ivoire : observations publiques, clubs scolaires, recherche d'astéroïdes avec l'UAI et la NASA.",

    'nav.home': 'Accueil',
    'nav.about': 'Qui sommes-nous',
    'nav.activities': 'Nos activités',
    'nav.events': 'Événements',
    'nav.news': 'Actualités',
    'nav.gallery': 'Galerie',
    'nav.join': "Rejoindre l'AIA",
    'nav.support': 'Nous soutenir',
    'nav.partners': 'Partenaires',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.fermer': 'Fermer',

    'action.decouvrir': 'Découvrir',
    'action.toutVoir': 'Tout voir',
    'action.enSavoirPlus': 'En savoir plus',
    'action.rejoindre': "Rejoindre l'aventure",
    'action.lire': "Lire l'article",
    'action.nousEcrire': 'Nous écrire',
    'action.commencer': 'Commencer la descente',

    'solar.hint':
      'Approche-toi d’un astre : chacun est une porte vers une partie du site.',
    'solar.mode3d': 'Version 3D',
    'solar.mode2d': 'Version allégée',
    'solar.aria': 'Navigation principale en système solaire',
    'solar.belt': 'Recherche d’astéroïdes',

    'events.aVenir': 'À venir',
    'events.passes': 'Archives',
    'events.aucun': 'Aucun événement programmé pour le moment — reviens bientôt.',
    'news.publie': 'Publié le',
    'news.par': 'par',

    'form.nom': 'Nom complet',
    'form.email': 'Adresse e-mail',
    'form.tel': 'Téléphone (WhatsApp)',
    'form.ville': 'Ville',
    'form.motivation': 'Pourquoi veux-tu nous rejoindre ?',
    'form.message': 'Ton message',
    'form.sujet': 'Sujet',
    'form.envoyer': 'Envoyer',
    'form.envoi': 'Envoi en cours…',
    'form.merci': 'Message bien reçu — nous te répondons très vite. Bienvenue à bord !',
    'form.erreur':
      "L'envoi a échoué. Réessaie, ou écris-nous directement par e-mail.",
    'form.mailto':
      'Le formulaire ouvrira ton application e-mail avec le message pré-rempli.',

    'footer.baseline': 'Depuis Abidjan, nous regardons plus loin.',
    'footer.droits': 'Tous droits réservés.',
    'footer.explorer': 'Explorer',
    'footer.association': "L'association",
    'footer.legal': 'Fondée en 2021 · UFR SSMT, Université Félix Houphouët-Boigny, Abidjan',
    'footer.admin': 'Espace bureau',

    'hud.altitude': 'Altitude',
    'hud.temperature': 'Température',
    'hud.zone': 'Zone',
    'hud.fait': 'À savoir',

    'lang.switch': 'Switch to English',
    'lang.label': 'English version',
  },
  en: {
    'site.nom': 'Ivorian Astronomy Association',
    'site.sigle': 'AIA',
    'site.description':
      'The Ivorian Astronomy Association promotes astronomy in Côte d’Ivoire: public stargazing, school clubs, and asteroid search campaigns with the IAU and NASA.',

    'nav.home': 'Home',
    'nav.about': 'About us',
    'nav.activities': 'Our activities',
    'nav.events': 'Events',
    'nav.news': 'News',
    'nav.gallery': 'Gallery',
    'nav.join': 'Join AIA',
    'nav.support': 'Support us',
    'nav.partners': 'Partners',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.fermer': 'Close',

    'action.decouvrir': 'Discover',
    'action.toutVoir': 'See all',
    'action.enSavoirPlus': 'Learn more',
    'action.rejoindre': 'Join the adventure',
    'action.lire': 'Read the article',
    'action.nousEcrire': 'Write to us',
    'action.commencer': 'Begin the descent',

    'solar.hint': 'Move closer to a celestial body: each one is a door to a section of the site.',
    'solar.mode3d': '3D version',
    'solar.mode2d': 'Light version',
    'solar.aria': 'Main navigation as a solar system',
    'solar.belt': 'Asteroid search',

    'events.aVenir': 'Upcoming',
    'events.passes': 'Archive',
    'events.aucun': 'No event scheduled right now — check back soon.',
    'news.publie': 'Published on',
    'news.par': 'by',

    'form.nom': 'Full name',
    'form.email': 'Email address',
    'form.tel': 'Phone (WhatsApp)',
    'form.ville': 'City',
    'form.motivation': 'Why do you want to join us?',
    'form.message': 'Your message',
    'form.sujet': 'Subject',
    'form.envoyer': 'Send',
    'form.envoi': 'Sending…',
    'form.merci': 'Message received — we will get back to you very soon. Welcome aboard!',
    'form.erreur': 'Sending failed. Try again, or email us directly.',
    'form.mailto': 'The form will open your email app with a pre-filled message.',

    'footer.baseline': 'From Abidjan, we look further.',
    'footer.droits': 'All rights reserved.',
    'footer.explorer': 'Explore',
    'footer.association': 'The association',
    'footer.legal': 'Founded in 2021 · UFR SSMT, Félix Houphouët-Boigny University, Abidjan',
    'footer.admin': 'Board area',

    'hud.altitude': 'Altitude',
    'hud.temperature': 'Temperature',
    'hud.zone': 'Zone',
    'hud.fait': 'Did you know',

    'lang.switch': 'Passer en français',
    'lang.label': 'Version française',
  },
} as const;

export type UiKey = keyof (typeof ui)['fr'];

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first === 'en') return 'en';
  return 'fr';
}

export function useT(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[defaultLang][key] ?? key;
  };
}

/** URL équivalente dans l'autre langue (retombe sur l'accueil de la langue cible si inconnue). */
export function altLangUrl(pathname: string, target: Lang): string {
  const clean = pathname.endsWith('/') ? pathname : pathname + '/';
  for (const page of Object.keys(routes) as PageId[]) {
    const r = routes[page];
    if (r.fr === clean || r.en === clean) return r[target];
  }
  // Cas dynamiques (ex. article) : renvoie vers la liste correspondante
  if (clean.startsWith('/actualites/')) return target === 'en' ? routes.news.en : clean;
  if (clean.startsWith('/en/news/')) return target === 'fr' ? routes.news.fr : clean;
  return routes.home[target];
}

/** Formate une date ISO selon la langue. */
export function formatDate(iso: string, lang: Lang): string {
  // dates « AAAA-MM-JJ » = minuit UTC : on formate en UTC pour ne pas reculer d'un jour
  return new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Date d'un événement : texte libre saisi dans l'admin (version française uniquement),
 * sinon période « 27 nov. – 8 déc. 2023 » si une date de fin existe, sinon date simple.
 */
export function formatPeriode(
  e: { date: string; dateFin?: string; dateLibelle?: string },
  lang: Lang,
): string {
  if (e.dateLibelle && lang === 'fr') return e.dateLibelle;
  if (!e.dateFin || e.dateFin === e.date) return formatDate(e.date, lang);
  const loc = lang === 'fr' ? 'fr-FR' : 'en-GB';
  const d1 = new Date(e.date), d2 = new Date(e.dateFin);
  const memeAnnee = d1.getUTCFullYear() === d2.getUTCFullYear();
  const memeMois = memeAnnee && d1.getUTCMonth() === d2.getUTCMonth();
  const tz = { timeZone: 'UTC' } as const;
  const debut = d1.toLocaleDateString(
    loc,
    memeMois ? { day: 'numeric', ...tz } : { day: 'numeric', month: 'short', ...(memeAnnee ? {} : { year: 'numeric' }), ...tz },
  );
  const fin = d2.toLocaleDateString(loc, { day: 'numeric', month: memeMois ? 'long' : 'short', year: 'numeric', ...tz });
  return `${debut} – ${fin}`;
}

