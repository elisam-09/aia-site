# Guide du portail d'administration — AIA

Ce guide s'adresse aux membres du bureau qui publient sur le site. Aucune compétence
technique n'est nécessaire.

## Se connecter

1. Va sur l'adresse du site suivie de **`/admin`** (ex. `https://aia-ci.cloud/admin`).
2. Saisis ton **email** et ton **mot de passe**.
3. Tu arrives sur le **tableau de bord** : les nouvelles demandes d'adhésion, les
   prochains événements, des raccourcis et la sauvegarde. Le menu est à gauche.

Tu n'as pas encore de compte ? Demande à un administrateur de t'en créer un
(menu **Comptes**).

## Publier du contenu

Le menu de gauche donne accès à chaque type de contenu :

| Menu | Ce que tu peux faire |
| --- | --- |
| **Adhésions** | Les demandes envoyées depuis la page « Rejoindre l'AIA » (voir plus bas). |
| **Événements** | Annoncer une observation, une conférence… Date de fin pour les événements sur plusieurs jours, texte de date libre (« Février 2024 »), bouton **Dupliquer** pour un rendez-vous récurrent. Un événement passe tout seul dans « Missions accomplies » le lendemain de sa date de fin. |
| **Articles** | Écrire un article (titre, image, texte mis en forme). **Origine** : « AIA » pour vos articles, sinon le nom du média ; **Liens vers la source** affichés en bas de l'article. |
| **Galerie** | Ajouter des photos (astrophoto, observations, écoles…). |
| **Équipe** | Le bureau : photo (sinon initiales sur une constellation), fonction, étiquette sur la photo (ex. FONDATEUR) ; flèches ↑ ↓ pour l'ordre d'affichage. |
| **Partenaires** | Gérer les logos et descriptions des partenaires. |
| **Produits** | Présenter les produits dérivés (vitrine, sans vente en ligne). |
| **Réglages** | Téléphone, WhatsApp, e-mail, Facebook, autres réseaux, phrase d'accueil, et **bandeau d'annonce** en haut de toutes les pages. |

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
- Après **Enregistrer**, une petite notification le confirme et le changement est
  **immédiatement visible** sur le site.

## Demandes d'adhésion

Chaque personne qui remplit le formulaire de la page **Rejoindre l'AIA** apparaît dans
le menu **Adhésions** (le nombre de nouvelles demandes s'affiche en orange dans le menu).

1. Ouvre une demande : nom, profil, e-mail, téléphone, ville, motivation.
2. Contacte la personne avec **Écrire un e-mail** ou **WhatsApp** (message pré-rempli).
3. Change le **statut** : *Nouvelle → Contactée → Acceptée* (ou *Refusée*) et ajoute une
   **note interne** (visible seulement par le bureau).
4. Les filtres en haut de la liste trient par statut. Un administrateur peut **exporter**
   toutes les demandes en CSV (Excel).

Ce sont des données personnelles : supprime les demandes dont tu n'as plus besoin.

## Sauvegarde

Tableau de bord → **Télécharger la sauvegarde (JSON)** : une copie de tout le contenu
(événements, articles, équipe, partenaires, réglages…). Garde-la en lieu sûr, par exemple
avant une grosse modification. Les comptes et les demandes d'adhésion n'y figurent pas.

## Gérer les comptes (administrateurs seulement)

Menu **Comptes** :

- **+ Nouveau compte** : nom, email, rôle, mot de passe.
- **Rôles** : *Éditeur* gère le contenu ; *Administrateur* gère aussi les comptes.
- Tu peux **désactiver** un compte (il ne pourra plus se connecter) sans le supprimer.
- Sécurité : tu ne peux ni te supprimer, ni te retirer tes propres droits (pour éviter
  de te verrouiller dehors).

## Se déconnecter

Bouton **Déconnexion** en bas du menu. Utile sur un ordinateur partagé.

## Mot de passe oublié ?

Il n'y a pas (encore) de réinitialisation en libre-service. Un administrateur peut te
définir un nouveau mot de passe depuis **Comptes → Modifier**. S'il n'y a plus aucun
administrateur disponible, la personne technique peut en recréer un avec la commande
`npm run admin:creer`.
