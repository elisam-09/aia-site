# Mettre le site en ligne — guide pas à pas

> 👉 **Tu déploies sur Hostinger ?** Suis le guide dédié, pas à pas :
> **[DEPLOIEMENT-HOSTINGER.md](./DEPLOIEMENT-HOSTINGER.md)** (VPS Ubuntu). Ce document-ci
> présente les principes généraux et les autres hébergeurs possibles.

Le site est une **application dynamique** (serveur Node + base SQLite + portail admin).
Elle a besoin d'un **serveur allumé en permanence** et d'un **disque persistant** (pour
conserver la base `data/aia.db` et les photos `uploads/`). Ce n'est donc pas de
l'hébergement statique gratuit — compte quelques euros par mois.

> **En local, tout est gratuit et fonctionne déjà** : `npm install`, `npm run admin:creer`,
> `npm run dev`. Ce guide concerne uniquement la **mise en ligne** pour que le bureau
> publie à distance.

---

## 0. Ce qu'il te faut

1. Le code sur **GitHub** (déjà fait : `github.com/elisam-09/aia-site`).
2. Un **hébergeur** capable de faire tourner Node **avec un disque persistant**.
3. Un **nom de domaine** (optionnel au début).

Prix indicatifs (à revérifier) : hébergement **~3–7 €/mois**, domaine **~6–12 000 FCFA/an**.

---

## 1. Choisir l'hébergeur

| Option | Coût/mois | Entretien | Pour qui |
| --- | --- | --- | --- |
| **Fly.io** (recommandé) | ~3–5 € | faible | Simplicité + disque persistant facile |
| **Railway** | ~5 € | faible | Très simple, interface claire |
| **VPS** (Hetzner, OVH…) | ~4–6 € | à ta charge | Contrôle total, si quelqu'un est à l'aise |

> ⚠️ Évite Vercel/Netlify **pour cette app** : leur mode gratuit est « sans serveur
> permanent » et **sans disque** → la base SQLite ne survivrait pas. (Le site *statique*
> aurait pu y aller, mais on a choisi le portail admin intégré, qui exige un serveur.)

---

## 2. Déployer sur Fly.io (recommandé)

1. Crée un compte sur [fly.io](https://fly.io) et installe l'outil `flyctl`
   (`brew install flyctl` sur Mac), puis `fly auth login`.
2. Dans le dossier du projet :
   ```bash
   fly launch --no-deploy      # détecte Node ; choisis une région (ex. Paris CDG)
   ```
3. **Crée un disque persistant** et monte-le sur `/data` :
   ```bash
   fly volumes create aia_data --size 1        # 1 Go, largement suffisant au début
   ```
   Puis, dans le fichier `fly.toml` généré, ajoute le montage et les variables :
   ```toml
   [mounts]
     source = "aia_data"
     destination = "/data"

   [env]
     DATABASE_PATH = "/data/aia.db"
     UPLOADS_PATH  = "/data/uploads"
     HOST = "0.0.0.0"
     PORT = "8080"
   ```
   (Le serveur Node de l'adaptateur écoute `HOST`/`PORT`.)
4. Déploie :
   ```bash
   fly deploy
   ```
5. **Crée le premier administrateur** sur le serveur :
   ```bash
   fly ssh console -C "npm run admin:creer"
   ```
   (ou en une ligne avec les variables `ADMIN_EMAIL`, `ADMIN_MOT_DE_PASSE`, `ADMIN_NOM`, `ADMIN_ROLE`.)

Le site est en ligne à `https://<ton-app>.fly.dev`. Le portail est sur `/admin`.

> Mises à jour du code ensuite : `git push` puis `fly deploy` (ou un déploiement
> automatique via GitHub Actions, à configurer plus tard).

### Variante VPS (résumé)

Sur un petit serveur Ubuntu : installer Node 22, cloner le dépôt, `npm ci && npm run build`,
lancer `node ./dist/server/entry.mjs` derrière un service **systemd** (redémarrage auto)
et un reverse-proxy **Caddy** (HTTPS automatique). Placer `data/` et `uploads/` sur le
disque et les inclure dans les sauvegardes. Plus souverain, mais tout l'entretien
(sécurité, HTTPS, sauvegardes) est à ta charge.

---

## 3. Sauvegardes (important)

Toutes les données (contenu + comptes + photos) sont dans **`data/` et `uploads/`**.

- **Base** = un fichier `aia.db`. Le copier régulièrement suffit.
  ```bash
  # Sur Fly.io :
  fly ssh console -C "sqlite3 /data/aia.db '.backup /data/sauvegarde.db'"
  # puis récupère le fichier :
  fly ssh sftp get /data/sauvegarde.db ./sauvegarde-$(date +%F).db
  ```
- Programme une sauvegarde **hebdomadaire** et garde-en plusieurs. Une association qui
  perd 40 fiches de contenu, c'est récupérable ; perdre la base sans sauvegarde, non.

---

## 4. Nom de domaine

1. Réserve un domaine (**`.org` recommandé** au début : `aia-ci.org`, ~6–10 000 FCFA/an
   chez Namecheap/Porkbun/OVH. Le **`.ci`** est plus symbolique mais plus lourd à
   obtenir — à viser ensuite).
2. Rattache-le à l'hébergeur :
   ```bash
   fly certs add aia-ci.org          # Fly génère le HTTPS automatiquement
   ```
   Puis copie chez le registraire les enregistrements DNS que Fly indique.
3. Mets à jour l'URL du site dans `astro.config.mjs` (champ `site`) et
   `public/robots.txt`, puis redéploie.

---

## 5. Formulaires publics (Rejoindre / Contact)

Indépendants du portail admin. Pour recevoir les messages par e-mail, crée une clé
gratuite sur [web3forms.com](https://web3forms.com) et renseigne, côté serveur, les
variables `PUBLIC_FORM_ENDPOINT` et `PUBLIC_CONTACT_EMAIL` (voir `.env.example`). Sans
configuration, les formulaires ouvrent simplement l'application e-mail du visiteur.

---

## Récapitulatif des variables (production)

| Variable | Rôle |
| --- | --- |
| `DATABASE_PATH` | Chemin de la base (ex. `/data/aia.db` sur disque persistant) |
| `UPLOADS_PATH` | Dossier des photos (ex. `/data/uploads`) |
| `HOST` / `PORT` | Écoute du serveur (souvent `0.0.0.0` / `8080`) |
| `PUBLIC_FORM_ENDPOINT` | (optionnel) réception des formulaires publics |
| `PUBLIC_CONTACT_EMAIL` | (recommandé) e-mail affiché et de repli |
