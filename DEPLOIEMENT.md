# Mettre le site en ligne — guide pas à pas

Ce guide s'adresse au bureau de l'AIA. Il ne demande **aucune compétence technique**.
Compte un après-midi la première fois. Tout ce qui est proposé ici est **gratuit** au
départ ; seul le nom de domaine est payant (quelques milliers de FCFA par an).

Ordre conseillé : **1) GitHub → 2) Vercel (mise en ligne) → 3) Sanity (back-office) →
4) Formulaires → 5) Nom de domaine.**

---

## 0. Vue d'ensemble (qui fait quoi)

| Outil       | Rôle                                        | Coût            |
| ----------- | ------------------------------------------- | --------------- |
| **GitHub**  | Range le code du site                       | Gratuit         |
| **Vercel**  | Publie le site et le met à jour tout seul   | Gratuit         |
| **Sanity**  | Back-office : le bureau écrit le contenu    | Gratuit         |
| **Web3Forms** | Reçoit les formulaires par e-mail         | Gratuit         |
| **Domaine** | L'adresse du site (ex. `aia-ci.org`)        | ~6 000–12 000 FCFA/an |

> Le site fonctionne **dès l'étape 2**, avec le contenu de démonstration. Les étapes
> 3 à 5 l'améliorent (contenu réel, formulaires, adresse personnalisée).

---

## 1. Ranger le code sur GitHub

1. Crée un compte sur [github.com](https://github.com) (gratuit).
2. Crée un dépôt (**New repository**) nommé `aia-site`, en **Private**.
3. Envoie le code (depuis un ordinateur qui a le projet) :
   ```bash
   git remote add origin https://github.com/VOTRE-COMPTE/aia-site.git
   git push -u origin main
   ```
   > Si tu ne fais pas cette partie toi-même, demande à la personne qui a développé le
   > site de pousser le code sur le dépôt.

---

## 2. Publier le site sur Vercel

1. Va sur [vercel.com](https://vercel.com) → **Sign up** → **Continue with GitHub**.
2. **Add New… → Project** → choisis le dépôt `aia-site`.
3. Vercel détecte Astro tout seul. Laisse les réglages par défaut :
   - Build Command : `npm run build`
   - Output Directory : `dist`
4. Clique **Deploy**. Après ~1 minute, le site est en ligne à une adresse du type
   `https://aia-site-xxxx.vercel.app`.

**C'est fait : le site est public.** Désormais, chaque fois que le code est mis à jour
sur GitHub, Vercel republie automatiquement.

---

## 3. Activer le back-office (Sanity)

Cette étape permet au bureau d'ajouter événements, actualités et photos **sans code**.

### 3.1 Créer le projet Sanity

1. Va sur [sanity.io](https://www.sanity.io) → **Get started** → connexion avec Google
   ou GitHub.
2. Crée un projet nommé « AIA ». Note le **Project ID** (une suite de lettres/chiffres,
   ex. `a1b2c3d4`). Le dataset s'appelle `production`.

### 3.2 Mettre le back-office en ligne

Sur l'ordinateur qui a le projet, dans le dossier `studio/` :

```bash
cd studio
npm install
npx sanity login          # ouvre le navigateur pour se connecter
# Renseigne l'identifiant du projet créé à l'étape 3.1 :
SANITY_STUDIO_PROJECT_ID=VOTRE_ID npx sanity deploy
```

Sanity demande un nom (ex. `aia`). Le back-office est alors accessible en ligne à
`https://aia.sanity.studio` — **c'est l'adresse que le bureau utilisera** pour écrire.
Chaque membre à qui tu donnes accès (bouton **Invite** dans sanity.io) peut publier.

### 3.3 Brancher le site sur Sanity

Dans Vercel : **Project → Settings → Environment Variables**, ajoute :

| Nom                        | Valeur         |
| -------------------------- | -------------- |
| `PUBLIC_SANITY_PROJECT_ID` | votre Project ID |
| `PUBLIC_SANITY_DATASET`    | `production`   |

Puis **Deployments → … → Redeploy**. Le site affiche maintenant le contenu saisi dans
Sanity au lieu de la démo.

> **Mise à jour automatique à chaque publication** (optionnel mais recommandé) :
> dans Vercel, **Settings → Git → Deploy Hooks**, crée un hook « sanity » ; copie
> l'URL obtenue et colle-la dans sanity.io sous **API → Webhooks**. Ainsi, quand un
> membre publie un article, le site se met à jour en ~1 minute, tout seul.

Prise en main du back-office : voir **[studio/README.md](./studio/README.md)**.

---

## 4. Recevoir les formulaires (Rejoindre / Contact)

1. Va sur [web3forms.com](https://web3forms.com) → saisis l'e-mail de l'association →
   tu reçois une **Access Key** gratuite.
2. Dans Vercel (**Settings → Environment Variables**), ajoute :

   | Nom                    | Valeur                                        |
   | ---------------------- | --------------------------------------------- |
   | `PUBLIC_FORM_ENDPOINT` | `https://api.web3forms.com/submit`            |
   | `PUBLIC_CONTACT_EMAIL` | l'e-mail public de l'association              |

   > Web3Forms attend la clé dans un champ `access_key`. Ajoute-la simplement comme
   > champ caché : ouvre `src/components/FormBlock.astro` et insère, à côté du champ
   > `formulaire`, une ligne
   > `<input type="hidden" name="access_key" value="VOTRE_CLÉ" />`.

3. **Redeploy**. Sans cette configuration, les formulaires ouvrent simplement
   l'application e-mail du visiteur (rien n'est cassé, c'est le mode de secours).

---

## 5. Réserver le nom de domaine

Le `.vercel.app` fonctionne, mais une vraie adresse fait plus sérieux vis-à-vis des
institutions (ONU, AfAS…).

### Quel nom ?

- **`.org`** (recommandé) — la convention pour une association. Ex. `aia-ci.org`,
  `astronomie-ci.org`. ~6 000–10 000 FCFA/an. Disponible partout.
- **`.ci`** (le domaine ivoirien) — très fort symboliquement, mais réservation via un
  registraire agréé en Côte d'Ivoire et souvent un peu plus cher/plus lourd
  administrativement. Ex. `aia.ci`. À viser en second temps si le budget suit.

> Conseil : prends **d'abord le `.org`** (rapide, pas cher, international), et garde
> le `.ci` comme objectif quand l'association aura un budget dédié. Vérifie que le nom
> est libre **et** que le compte correspondant existe sur Instagram/Facebook.

### Où réserver ?

Registraires fiables et peu chers : **Namecheap**, **Porkbun**, **OVH** (interface FR,
présence en Afrique de l'Ouest), ou **Cloudflare** (prix coûtant). Évite les options
« payantes » superflues qu'on te propose au paiement (protection WHOIS gratuite chez
la plupart, ça suffit).

### Le brancher à Vercel

1. Dans Vercel : **Project → Settings → Domains → Add** → saisis ton domaine.
2. Vercel affiche 1 ou 2 lignes à copier chez le registraire (des enregistrements
   **A** / **CNAME**). Colle-les dans la zone DNS du domaine.
3. Sous ~30 min à quelques heures, le domaine est actif et le **HTTPS** (cadenas) est
   automatique et gratuit.

Enfin, mets à jour l'URL du site dans deux fichiers puis republie :
`astro.config.mjs` (champ `site`) et `public/robots.txt` (ligne `Sitemap:`).

---

## Récapitulatif des variables d'environnement (Vercel)

| Nom                        | Obligatoire ? | À quoi ça sert                        |
| -------------------------- | ------------- | ------------------------------------- |
| `PUBLIC_SANITY_PROJECT_ID` | non           | Active le back-office Sanity          |
| `PUBLIC_SANITY_DATASET`    | non           | `production` (défaut)                 |
| `PUBLIC_FORM_ENDPOINT`     | non           | Réception des formulaires             |
| `PUBLIC_CONTACT_EMAIL`     | recommandé    | E-mail affiché et de secours          |

Toutes optionnelles : sans elles, le site tourne avec la démo et les formulaires en
mode e-mail. On peut donc mettre en ligne **aujourd'hui** et enrichir ensuite.

---

## Aide-mémoire « qui republie quoi »

- **Le bureau écrit un article / ajoute une photo** → dans Sanity → le site se met à
  jour tout seul (si le webhook de l'étape 3 est en place).
- **On modifie le design ou les textes fixes** → changement dans le code → `git push`
  → Vercel republie tout seul.
- **Rien à faire manuellement sur le serveur** : il n'y en a pas. Le site est statique.
