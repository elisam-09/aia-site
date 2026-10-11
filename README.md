# Site web — Association Ivoirienne d'Astronomie (AIA)

Site bilingue (FR/EN) de l'AIA avec **portail d'administration intégré** : navigation
« système solaire » interactive, descente narrative de l'espace à l'atmosphère, et un
back-office maison (connexion + tableau de bord) pour que le bureau publie le contenu
sans toucher au code.

> **Architecture en un coup d'œil** — Application **Astro en mode serveur** (Node) +
> base **SQLite** (un seul fichier) + authentification maison. Le site public et le
> portail `/admin` vivent dans **le même projet**, sur ton infrastructure — aucun
> service de contenu tiers.

---

## 1. Démarrer en local

Prérequis : **Node 20+** (idéalement 22).

```bash
npm install                 # dépendances
npm run admin:creer         # crée ton premier compte administrateur (interactif)
npm run dev                 # site : http://localhost:4321  ·  admin : /admin/login
```

Au premier lancement, la base `data/aia.db` est créée et **remplie avec un contenu de
démonstration** (événements, actualités, galerie…). Tu peux tout modifier depuis le
portail, ou repartir de zéro en supprimant `data/aia.db`.

Autres commandes :

```bash
npm run build               # build de production
npm run preview             # lance le serveur de production en local
```

---

## 2. Le portail d'administration

- **Adresse** : `/admin/login`. Chaque personne qui doit publier a un **compte**
  (email + mot de passe) enregistré dans la table `admins`.
- **Deux rôles** : `admin` (gère aussi les comptes) et `editeur` (gère le contenu).
- **On y gère** : Événements, Actualités (avec éditeur de texte enrichi), Galerie
  (upload de photos), Produits, Partenaires, Membres du bureau — le tout **bilingue**
  (Français obligatoire, English optionnel, repli automatique sur le FR).
- **Thème « atmosphère »** : l'admin a volontairement un habillage clair (ciel de jour)
  distinct de l'espace profond du site vitrine.
- Voir **[ADMIN.md](./ADMIN.md)** pour le guide d'utilisation destiné au bureau.

Créer / réinitialiser un compte :

```bash
npm run admin:creer
# ou en non-interactif :
ADMIN_EMAIL=x@aia.ci ADMIN_MOT_DE_PASSE=... ADMIN_NOM="Nom" ADMIN_ROLE=admin npm run admin:creer
```

---

## 3. Structure du projet

```
aia-site/
├── src/
│   ├── pages/
│   │   ├── (site public)          # index, activites, evenements, actualites/[slug]…
│   │   ├── en/                     # versions anglaises
│   │   ├── admin/                  # portail : login, index (tableau de bord),
│   │   │   ├── evenements/         #   chaque rubrique = index.astro (liste)
│   │   │   ├── actualites/         #   + [id].astro (créer / modifier / supprimer)
│   │   │   ├── galerie/ produits/ partenaires/ membres/ comptes/
│   │   │   └── logout.ts
│   │   └── media/[...file].ts      # sert les photos uploadées (dossier uploads/)
│   ├── middleware.ts               # ★ protège /admin + attache l'admin connecté
│   ├── server/                     # ★ code serveur uniquement
│   │   ├── db/                     #   connexion SQLite, schéma, requêtes (repo), seed
│   │   ├── auth.ts                 #   hachage (scrypt) + sessions par cookie
│   │   ├── media.ts                #   enregistrement/redimensionnement des images
│   │   ├── sanitize.ts formutil.ts ratelimit.ts
│   ├── components/
│   │   ├── admin/                  # champs de formulaire réutilisables du portail
│   │   ├── solar/                  # navigation système solaire (3D R3F + repli 2D)
│   │   └── …                       # composants du site vitrine
│   ├── lib/content.ts              # ★ lecture du contenu (base) pour les pages publiques
│   ├── i18n/ui.ts                  # traductions d'interface + table des routes
│   └── styles/                     # tokens (palette du logo), global (vitrine), admin (jour)
├── scripts/creer-admin.mjs         # création du premier admin
├── data/                           # base SQLite (ignorée par git)
├── uploads/                        # photos envoyées (ignorées par git)
└── DEPLOIEMENT.md                  # ★ mise en ligne + sauvegardes + domaine
```

---

## 4. Fonctionnement du contenu

- Les pages publiques **lisent la base** via `src/lib/content.ts` : dès qu'un admin
  publie, le site est à jour.
- Les photos uploadées sont stockées dans `uploads/`, converties en WebP et servies
  par `/media/…`.
- La base est un fichier : **sauvegarder = copier `data/aia.db`** (voir DEPLOIEMENT.md).

---

## 5. Sécurité (déjà en place)

- Mots de passe **hachés** (scrypt) — jamais stockés en clair.
- Sessions par cookie `httpOnly` / `SameSite=Lax` ; vérification d'origine (CSRF) sur
  les envois du portail ; **limitation des tentatives** de connexion.
- Tout `/admin` est derrière un garde d'authentification ; la gestion des comptes est
  réservée au rôle `admin`. Le contenu des articles est nettoyé (anti-XSS).

---

## 6. Déploiement

Cette application a besoin d'un **serveur qui tourne en permanence** + un **disque
persistant** (pour `data/` et `uploads/`). Étapes détaillées, options d'hébergement
(Fly.io, VPS…), sauvegardes et domaine dans **[DEPLOIEMENT.md](./DEPLOIEMENT.md)**.

## Crédits

Le télescope 3D, le globe, la Lune du jour, le module éclipse, le curseur fusée, plusieurs
animations ainsi que le contenu collecté (articles de presse, événements, bureau, photos)
proviennent du site réalisé par [Jcalixte24](https://github.com/Jcalixte24/aia), intégrés
et recolorés aux couleurs de l'AIA. Textures Terre et Lune : NASA (via three.js) ; nébuleuse
d'Orion : NASA/ESA/Hubble ; Voie lactée : NOIRLab/AURA ; Abidjan de nuit : Wikimedia Commons.

