# AGENTS.md — notes pour agents IA

Site vitrine bilingue (FR/EN) de l'**Association Ivoirienne d'Astronomie**.
Voir `README.md` pour la vue d'ensemble et `DEPLOIEMENT.md` pour la mise en ligne.

## Stack

- **Astro 7** (sortie statique) + intégration **React** pour la seule île 3D.
- **React Three Fiber / three.js** : navigation « système solaire », chargée en
  différé (`lazy` + `client:visible`). Jamais dans le bundle initial.
- **Sanity** (dossier `studio/`) pour le back-office ; le site lit Sanity en GROQ
  HTTP (`src/lib/sanity.ts`) sans SDK. Repli sur le contenu de `src/lib/seed/`.
- i18n natif Astro : FR à la racine, EN sous `/en/`, `prefixDefaultLocale: false`.

## Conventions

- **Un composant `…Content.astro` par page**, rendu par deux fichiers de page
  (FR dans `src/pages/`, EN dans `src/pages/en/`) qui lui passent `lang`.
- Les textes d'interface sont dans `src/i18n/ui.ts` (`useT(lang)`), les longs textes
  éditoriaux sont dans les composants `…Content.astro` (objet `COPY` par langue) ou
  dans le contenu (`src/lib/`).
- **Couleurs uniquement via les tokens** de `src/styles/tokens.css`. Les accents
  drapeau ivoirien (`--ci-orange`, `--ci-vert`) sont réservés aux CTA / éléments
  actifs — jamais en fond ni en aplat large.
- Toute nouvelle rubrique de nav passe par la table `routes` (`src/i18n/ui.ts`) ; le
  mapping astre→rubrique est dans `src/components/solar/config.ts`.
- Images de contenu en `loading="lazy"`. Ne pas réintroduire de polices distantes
  (Google Fonts) : on utilise `@fontsource-variable`.

## Perf (contexte : connexions mobiles lentes à Abidjan)

- Ne jamais charger three.js sur le chemin critique. Le repli 2D (`SolarFallback.tsx`,
  SVG pur) doit rester rendu côté serveur et fonctionner sans JS.
- La 3D est refusée si : petit écran (<760 px), `saveData`, `prefers-reduced-motion`,
  pas de WebGL, ou timeout de 8 s. Garder ces garde-fous dans `SolarSystem.tsx`.

## Vérifier

```bash
npm run build      # doit passer sans erreur ; 27 pages + sitemap
npm run dev        # http://localhost:4321
```
