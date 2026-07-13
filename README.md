# Site web — Association Ivoirienne d'Astronomie (AIA)

Site vitrine bilingue (FR/EN) de l'AIA : navigation « système solaire » interactive,
descente narrative de l'espace profond au ciel d'Abidjan, et back-office simple pour
le bureau de l'association.

> **En bref** — Astro (site statique, ultra-léger) + une scène 3D React Three Fiber
> chargée à la demande, avec repli 2D. Contenu géré par le bureau via **Sanity**
> (interface en français). Le site fonctionne **sans compte Sanity** grâce à un
> contenu de démonstration intégré : idéal pour développer et tester.

---

## 1. Démarrer en local

Prérequis : **Node 20+** (idéalement 22).

```bash
npm install          # dépendances du site
npm run dev          # http://localhost:4321
```

Autres commandes :

```bash
npm run build        # build de production (dossier dist/)
npm run preview      # prévisualise le build de production
```

Au premier lancement, **aucune configuration n'est nécessaire** : le site affiche le
contenu de démonstration (événements, actualités, galerie, produits, partenaires)
défini dans `src/lib/seed/`.

---

## 2. Structure du projet

```
aia-site/
├── src/
│   ├── pages/                 # Pages FR (racine) et EN (/en/…) — routage par fichier
│   │   ├── index.astro        # Accueil FR   ·   en/index.astro = Accueil EN
│   │   ├── actualites/[slug]  # Articles générés depuis le contenu
│   │   └── …
│   ├── components/
│   │   ├── Home.astro         # Les 6 couches de l'accueil (espace → Abidjan)
│   │   ├── solar/             # Navigation système solaire
│   │   │   ├── config.ts      # ★ Table astre → rubrique (à éditer pour re-mapper)
│   │   │   ├── SolarSystem.tsx # Aiguillage 2D/3D + garde-fous perf
│   │   │   ├── SolarScene.tsx  # Scène 3D (three.js) — chargée à la demande
│   │   │   └── SolarFallback.tsx # Repli 2D (SVG, sans JS/WebGL)
│   │   └── …Content.astro     # Contenu de chaque page intérieure (bilingue)
│   ├── i18n/ui.ts             # ★ Traductions d'interface + table des routes
│   ├── lib/
│   │   ├── content.ts         # Façade : Sanity si configuré, sinon seed local
│   │   ├── sanity.ts          # Lecture Sanity (GROQ en HTTP, zéro dépendance)
│   │   └── seed/              # Contenu de démonstration bilingue
│   └── styles/                # tokens.css (palette du logo) + global.css
├── studio/                    # Back-office Sanity (voir studio/README.md)
├── public/                    # Logo, favicons, images de démonstration (SVG)
├── .env.example               # Variables à copier dans .env
└── DEPLOIEMENT.md             # ★ Mise en ligne pas à pas + domaine à réserver
```

Les fichiers marqués ★ sont ceux qu'on édite le plus souvent.

---

## 3. Palette & identité

Les couleurs sont **échantillonnées directement depuis le logo officiel**
(`src/assets/logo-aia-blanc.png`) et centralisées dans `src/styles/tokens.css` :

- Aubergine profond `#291928` / `#221422` / `#120A12` (fonds)
- Crème `#F8F7F8` (texte)
- Accents **drapeau ivoirien** (`--ci-orange`, `--ci-vert`) réservés aux boutons,
  liens actifs et indicateurs — jamais en fond, conformément à la charte.

Typographie : **Space Grotesk** (titres) + **Inter** (texte), auto-hébergées
(`@fontsource-variable`, aucune requête vers Google Fonts).

---

## 4. Navigation « système solaire »

- **Mapping astre → rubrique** dans `src/components/solar/config.ts`
  (Soleil = Accueil, Mercure = Qui sommes-nous, Vénus = Actualités, Terre = Rejoindre,
  Lune = Contact, Mars = Activités, ceinture = Recherche d'astéroïdes, Jupiter =
  Événements, Saturne = Galerie, Uranus = Support, Neptune = Partenaires).
- **Perf & accessibilité** : le repli 2D (SVG) est rendu côté serveur et s'affiche
  immédiatement. La scène 3D ne se charge que sur grand écran, si WebGL est
  disponible, hors mode « économie de données » et hors `prefers-reduced-motion`.
  Sur mobile, le 2D reste la valeur par défaut (le bouton « Version 3D » permet de
  forcer la 3D). Three.js (~875 Ko) n'est donc jamais téléchargé inutilement.

---

## 5. Contenu dynamique

Deux modes, choisis automatiquement selon les variables d'environnement :

| Variable `PUBLIC_SANITY_PROJECT_ID` | Comportement                               |
| ----------------------------------- | ------------------------------------------ |
| **vide** (défaut)                   | Contenu de démonstration (`src/lib/seed/`) |
| **renseignée**                      | Contenu saisi par le bureau dans Sanity    |

En cas d'erreur réseau avec Sanity au moment du build, le site retombe
automatiquement sur le contenu de démonstration : **le build ne casse jamais**.

Pour activer Sanity et former le bureau : voir **[DEPLOIEMENT.md](./DEPLOIEMENT.md)**
et **[studio/README.md](./studio/README.md)**.

---

## 6. Formulaires (Rejoindre / Contact)

Sans backend. Deux modes selon `.env` :

- `PUBLIC_FORM_ENDPOINT` renseigné (Web3Forms, Formspree…) → envoi direct.
- vide → ouverture de l'application e-mail avec un message pré-rempli vers
  `PUBLIC_CONTACT_EMAIL`.

---

## 7. Déploiement

Résumé : pousser sur GitHub → connecter à **Vercel** (build `npm run build`, sortie
`dist/`). Détails, création des comptes et réservation du domaine dans
**[DEPLOIEMENT.md](./DEPLOIEMENT.md)**.
