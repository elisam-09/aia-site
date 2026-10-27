# AGENTS.md — notes pour agents IA

Site bilingue (FR/EN) de l'**Association Ivoirienne d'Astronomie** + **portail
d'administration intégré**. Voir `README.md` (vue d'ensemble), `ADMIN.md` (usage du
portail) et `DEPLOIEMENT.md` (mise en ligne).

## Stack

- **Astro 7 en mode serveur** (`output: 'server'`, adaptateur `@astrojs/node`
  standalone). Toutes les pages sont rendues à la volée.
- **React** uniquement pour l'île 3D (navigation système solaire, `client:visible`,
  three.js chargé en différé avec repli 2D SSR).
- **Effets de l'accueil** (TypeScript, `src/scripts/`) : `accueil.ts` orchestre GSAP
  ScrollTrigger + Lenis ; `telescope.ts` (télescope 3D qui se décompose), `globe.ts`,
  `lune.ts` (phase du jour), `eclipse-teaser.ts` + `eclipse/` (catalogue NASA, fenêtre 3D
  chargée au clic). three.js chargé à la demande. Classes posées sur `<html>` :
  `anim` (animations actives), `webgl` (WebGL dispo) — tout doit rester lisible sans elles.
- **Global** : `Curseur.astro` (curseur fusée), `Starfield.astro` (ciel canvas + barre de
  progression), `scripts/interactions.ts` (bandes à glisser, apparitions).
- **SQLite** via `better-sqlite3` (fichier `data/aia.db`). Accès dans `src/server/db/`
  (connexion + schéma `index.ts`, requêtes `repo.ts`, amorçage `seed.ts`). Pas d'ORM.
- **Auth maison** : `src/server/auth.ts` (scrypt + sessions cookie en table), garde dans
  `src/middleware.ts`. Rôles `admin` / `editeur`.
- **Images** : upload → `sharp` → WebP dans `uploads/`, servi par `src/pages/media/[...file].ts`.
- i18n natif Astro : FR à la racine, EN sous `/en/`.

> Il n'y a **plus de CMS tiers** (Sanity a été retiré). Le contenu vit dans SQLite,
> édité via `/admin`. Ne pas réintroduire de service de contenu externe.

## Conventions

- **Pages publiques** : un composant `…Content.astro` par page, rendu par les fichiers
  FR (`src/pages/`) et EN (`src/pages/en/`). Le contenu se lit via `src/lib/content.ts`
  (qui interroge la base) — garder ces signatures stables.
- **Portail admin** : chaque rubrique = `admin/<type>/index.astro` (liste) +
  `admin/<type>/[id].astro` (id `nouveau` = création ; POST gère save/suppression via
  `_action=supprimer`). Formulaires via les composants de `src/components/admin/`.
- **Contenu de référence** : `src/lib/seed/*` (réel et sourcé). `seed.ts` remplit les tables
  vides et, une seule fois par base (table `meta`, clé `contenu`), remplace l'ancienne démo
  fictive tant qu'elle n'a pas été modifiée. Ne jamais inventer d'événement ou de chiffre.
- **Réglages** (table `reglages`, clé → valeur) : coordonnées, réseaux, phrase d'accueil,
  bandeau d'annonce. Lus via `reglagesSite()` (`src/lib/contact.ts`, valeurs par défaut
  incluses). Édités dans `/admin/reglages`.
- **Adhésions** : formulaire `AdhesionForm.astro` → `POST /api/adhesion` (piège à robots,
  5 envois / 10 min / IP) → table `adhesions` → `/admin/adhesions` (statut, note, filtres
  statut + centre d'intérêt, export CSV réservé au rôle admin). Profils et centres d'intérêt
  (stockés « cle1,cle2 ») : `src/lib/adhesion.ts`. Données personnelles : ne pas les exposer ailleurs.
- **Audience** : `scripts/mesure.ts` (chargé par `Base.astro`) → `POST /api/mesure` (ignore robots, admins
  connectés, limite 240 msg / 10 min / IP) → compteurs anonymes par jour dans `mesure_jour` (clés « préfixe:valeur »,
  jours spéciaux `total` et `meta`) → `/admin/audience` (calculs dans `lib/audience.ts`) + export `audience.csv`.
  Ne jamais y stocker d'IP ni d'identifiant ; les clés libres (page/section/action) sont plafonnées par jour.
- **Colonnes ajoutées** après coup : déclarer dans `COLONNES_AJOUTEES` (`db/index.ts`),
  elles sont créées au démarrage sur les bases existantes.
- **Admin** : thème « nuit nuageuse » (`admin.css`), aucune émoticône, icônes SVG au
  trait dans `AdminLayout.astro`. Après une action, rediriger avec `?ok=enregistre|cree|
  supprime|duplique` pour afficher la notification.
- Dates « AAAA-MM-JJ » : toujours formater avec `timeZone: 'UTC'` (sinon décalage d'un jour).
- Ajout d'un champ de contenu = 4 endroits cohérents : colonne (`db/index.ts` DDL +
  `db/types.ts`), requêtes (`db/repo.ts`), formulaire admin (`admin/<type>/[id].astro`),
  et lecture publique (`lib/content.ts` + le composant de page).
- **Couleurs** via `src/styles/tokens.css`. Vitrine = thème espace (`global.css`) ;
  admin = thème jour/atmosphère (`admin.css`). Accents drapeau ivoirien réservés aux CTA.

## Sécurité — ne pas régresser

- Mots de passe hachés (scrypt), jamais en clair. Sessions httpOnly.
- Toute route `/admin` derrière le middleware ; `/admin/comptes` réservé au rôle admin
  (vérifié en tête de page). Ne jamais permettre l'auto-suppression / auto-rétrogradation.
- Corps d'article passé par `src/server/sanitize.ts` avant stockage (anti-XSS).
- `better-sqlite3` et `sharp` sont dans `vite.ssr.external` (modules natifs).

## Vérifier

```bash
npm run build                  # doit passer ; adaptateur node, mode server
npm run admin:creer            # créer un compte
npm run dev                    # http://localhost:4321  ·  /admin/login
```
Données d'exécution (`data/`, `uploads/`) ignorées par git — ne pas committer.
