# Back-office AIA (Sanity Studio)

Interface d'administration du site, **en français**, pour le bureau de l'AIA.
On y ajoute et modifie : événements, actualités, photos, produits, partenaires et
membres du bureau — sans toucher au code.

## Installation (une seule fois)

```bash
cd studio
npm install
npx sanity login
```

Renseigne l'identifiant du projet Sanity (créé sur [sanity.io](https://sanity.io))
dans la variable d'environnement, puis lance le back-office :

```bash
# En local (pour tester) :
SANITY_STUDIO_PROJECT_ID=VOTRE_ID npm run dev      # http://localhost:3333

# Pour le publier en ligne (adresse https://…​.sanity.studio) :
SANITY_STUDIO_PROJECT_ID=VOTRE_ID npm run deploy
```

Astuce : pour ne pas retaper l'identifiant, crée un fichier `studio/.env` :

```
SANITY_STUDIO_PROJECT_ID=VOTRE_ID
SANITY_STUDIO_DATASET=production
```

## Ce qu'on peut gérer

| Menu                    | Contenu                                                   |
| ----------------------- | -------------------------------------------------------- |
| 📅 Événements           | Titre, date, lieu, description, image. Les dates passées passent en archives automatiquement. |
| 📰 Actualités (blog)    | Article complet avec image de couverture, chapeau et texte mis en forme. |
| 🖼️ Galerie photos       | Photos classées par catégorie (astrophoto, observation, événement, école). |
| 🛍️ Produits (Support)   | Vitrine des produits dérivés (sans vente en ligne).       |
| 🤝 Partenaires          | Logos et descriptions (UAI, NASA, AfAS…).                 |
| 👤 Membres du bureau    | Trombinoscope du bureau.                                  |

## Bilingue FR / EN

Chaque texte a une case **Français** (obligatoire) et une case **English**
(optionnelle). Si l'anglais est laissé vide, le site affiche le français à la place —
on peut donc publier en français d'abord et traduire plus tard.

## Donner accès à d'autres membres

Sur [sanity.io/manage](https://www.sanity.io/manage) → projet AIA → **Members** →
**Invite** : chaque membre invité peut se connecter au back-office et publier.
Les rôles (administrateur, éditeur…) se règlent au même endroit.

## Reprendre le contenu de démonstration

Le site est livré avec un contenu de démonstration (dans `../src/lib/seed/`). Il sert
de modèle : recopie sa structure dans le back-office pour créer tes vrais contenus,
puis renseigne `PUBLIC_SANITY_PROJECT_ID` côté site (voir `../DEPLOIEMENT.md`) pour
basculer de la démo vers Sanity.
