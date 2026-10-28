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

1. Ouvre une demande : nom, profil, e-mail, téléphone, ville, centres d'intérêt, motivation.
2. Contacte la personne avec **Écrire un e-mail** ou **WhatsApp** (message pré-rempli).
3. Suis la demande : *Nouvelle → Contactée → **Retenue** → **Membre*** (ou *Refusée*), et ajoute une
   **note interne** (visible seulement par le bureau). Voir « Du dépôt de la demande au statut de membre » plus bas.
4. Les filtres en haut de la liste trient par statut et par centre d'intérêt (organisation
   d'événements, communication, nouvelles technologies, gestion) ; ils se combinent. Un administrateur peut **exporter**
   toutes les demandes en CSV (Excel).

Ce sont des données personnelles : supprime les demandes dont tu n'as plus besoin.

### Du dépôt de la demande au statut de membre

1. **La demande** : élèves et étudiants indiquent aussi leur niveau d'études, leur filière et leur
   établissement ; tout le monde coche l'accord d'être contacté·e (WhatsApp, appel ou e-mail).
2. **Retenir** : sur la fiche, clique **Retenir cette demande et préparer le message**. Le site crée le
   **numéro de membre** (AIA-2026-0001…) et une **clé d'accès personnelle**, puis prépare le message de
   bienvenue (conditions, droit d'adhésion, cotisation selon le profil, comment payer, numéro et clé).
   Envoie-le avec **Envoyer par WhatsApp** (ou e-mail, ou **Copier le message**). **La clé n'est affichée
   qu'à ce moment-là** (le site n'en garde que l'empreinte) : si tu l'as perdue, **Régénérer la clé d'accès**.
   La personne n'est **pas encore membre**.
3. **Paiement** : quand elle a payé et que tu as vérifié (référence ou capture), enregistre le paiement dans
   le bloc **Paiement** de la fiche (montant, mode, référence, date) : elle devient **Membre**, valable
   pendant la durée réglée (12 mois par défaut) à partir de la date du paiement. Un paiement saisi par erreur
   s'annule ; sans autre paiement, la demande redevient « Retenue ». Un renouvellement s'ajoute de la même façon.
4. Le menu **Paiements** liste tout ce qui a été encaissé (total de l'année, par mode de paiement).
5. **Espace membre** : la personne va sur `/membre`, saisit sa clé d'accès et voit l'état de son adhésion :
   en attente de paiement (avec le montant et comment payer), active (validité) ou expirée. Une fois membre,
   elle **télécharge son certificat d'adhésion en PDF** (modèle « Anneau de feu », avec son nom, son numéro,
   sa période de validité et un QR code). Le QR code mène à une page publique de vérification (`/verifier/AIA-…`)
   qui confirme l'authenticité sans révéler de donnée personnelle (nom abrégé). Le bureau peut aussi
   télécharger le certificat depuis la fiche d'un membre. Régénérer une clé ferme les sessions ouvertes avec l'ancienne.

Les montants, la durée, les modes de paiement et le texte du message se règlent dans
**Réglages → Adhésion et paiement** (variables : `{nom}` `{numero}` `{cle}` `{droit}` `{cotisation}`
`{profil_tarif}` `{total}` `{duree}` `{conditions}` `{paiement}` `{lien}`). Le message contient d'office les prix détaillés, les
conditions d'adhésion (modifiables : ajoute-y le règlement de l'AIA), comment payer, le numéro de membre et la clé.
Le nom et la fonction du signataire du certificat se règlent au même endroit. Renseigne la cotisation des élèves et étudiants avant de retenir leurs demandes.

## Audience (compteur de visites)

Le menu **Audience** montre combien de personnes visitent le site, de façon **anonyme**
(ni adresse IP, ni nom, ni cookie) :

- visites aujourd’hui, sur 7 / 30 / 90 jours et depuis le début, avec la comparaison à la période précédente ;
- nouveaux visiteurs ou revenants, durée moyenne, part de visites « engagées » (défilé, cliqué ou resté 15 s) ;
- heures et jours de pointe, provenance (Facebook, Google, WhatsApp…), pays, appareils, navigateurs ;
- sections de l’accueil réellement vues, pages les plus lues, et actions (fenêtre éclipse ouverte, clics WhatsApp /
  réseaux / téléphone, demandes d’adhésion envoyées).

Le bouton **Exporter (CSV)** télécharge les chiffres pour Excel. Tes propres visites ne sont pas comptées tant que tu es
connecté à l’administration ; les robots et les navigateurs réglés sur « Ne pas suivre » non plus.

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
