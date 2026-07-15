# Guide du portail d'administration — AIA

Ce guide s'adresse aux membres du bureau qui publient sur le site. Aucune compétence
technique n'est nécessaire.

## Se connecter

1. Va sur l'adresse du site suivie de **`/admin`** (ex. `https://aia-ci.org/admin`).
2. Saisis ton **email** et ton **mot de passe**.
3. Tu arrives sur le **tableau de bord** : un résumé, et un menu à gauche.

Tu n'as pas encore de compte ? Demande à un administrateur de t'en créer un
(menu **Comptes**).

## Publier du contenu

Le menu de gauche donne accès à chaque type de contenu :

| Menu | Ce que tu peux faire |
| --- | --- |
| 📅 **Événements** | Annoncer une observation, une conférence… Les dates passées vont automatiquement dans les archives. |
| 📰 **Actualités** | Écrire un article (titre, image, texte mis en forme). |
| 🖼️ **Galerie** | Ajouter des photos (astrophoto, observations, écoles…). |
| 🛍️ **Produits** | Présenter les produits dérivés (vitrine, sans vente en ligne). |
| 🤝 **Partenaires** | Gérer les logos et descriptions des partenaires. |
| 👤 **Membres** | Le trombinoscope du bureau. |

Pour chaque type : **la liste** montre ce qui existe, le bouton **« + »** en haut à
droite crée un nouvel élément, et **« Modifier »** ouvre un élément existant (où tu
peux aussi le **Supprimer**, tout en bas).

### Bon à savoir

- **Bilingue** : chaque texte a une case *Français* (obligatoire) et une case
  *English* (facultative). Si tu laisses l'anglais vide, le site affiche le français.
- **Images** : clique sur « Choisir un fichier ». La photo est redimensionnée
  automatiquement. Coche « Retirer l'image » pour l'enlever.
- **Publié / brouillon** : décoche « Publié » pour préparer un contenu sans qu'il
  apparaisse tout de suite sur le site.
- Après **Enregistrer**, le changement est **immédiatement visible** sur le site.

## Gérer les comptes (administrateurs seulement)

Menu **Comptes** :

- **+ Nouveau compte** : nom, email, rôle, mot de passe.
- **Rôles** : *Éditeur* gère le contenu ; *Administrateur* gère aussi les comptes.
- Tu peux **désactiver** un compte (il ne pourra plus se connecter) sans le supprimer.
- Sécurité : tu ne peux ni te supprimer, ni te retirer tes propres droits (pour éviter
  de te verrouiller dehors).

## Se déconnecter

Bouton **Déconnexion** en haut à droite. Utile sur un ordinateur partagé.

## Mot de passe oublié ?

Il n'y a pas (encore) de réinitialisation en libre-service. Un administrateur peut te
définir un nouveau mot de passe depuis **Comptes → Modifier**. S'il n'y a plus aucun
administrateur disponible, la personne technique peut en recréer un avec la commande
`npm run admin:creer`.
