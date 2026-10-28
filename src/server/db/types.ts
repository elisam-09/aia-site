/** Types des lignes de la base (miroir des colonnes SQLite). */

export type Role = 'admin' | 'editeur';

export interface AdminRow {
  id: number;
  email: string;
  password_hash: string;
  nom: string;
  role: Role;
  actif: number; // 0 | 1
  cree_le: string;
  derniere_connexion: string | null;
}

export interface SessionRow {
  id: string;
  admin_id: number;
  cree_le: string;
  expire_le: string;
}

export interface EvenementRow {
  id: number;
  titre_fr: string;
  titre_en: string | null;
  date: string; // ISO yyyy-mm-dd
  heure: string | null;
  lieu: string;
  description_fr: string | null;
  description_en: string | null;
  image: string | null;
  lien: string | null;
  publie: number;
  cree_le: string;
  maj_le: string;
  date_fin: string | null; // ISO, si l'événement dure plusieurs jours
  date_libelle: string | null; // texte de date affiché tel quel (facultatif)
}

export interface ActualiteRow {
  id: number;
  slug: string;
  titre_fr: string;
  titre_en: string | null;
  date: string;
  auteur: string;
  extrait_fr: string | null;
  extrait_en: string | null;
  corps_fr: string | null; // HTML
  corps_en: string | null; // HTML
  image: string | null;
  publie: number;
  cree_le: string;
  maj_le: string;
  origine: string; // « AIA » ou nom du média (presse)
  liens: string | null; // une source par ligne : « Libellé | https://… »
}

export type Categorie = 'astrophoto' | 'observation' | 'evenement' | 'ecole';

export interface GalerieRow {
  id: number;
  titre_fr: string;
  titre_en: string | null;
  image: string;
  categorie: Categorie;
  date: string | null;
  cree_le: string;
}

export interface PartenaireRow {
  id: number;
  nom: string;
  sigle: string | null;
  description_fr: string | null;
  description_en: string | null;
  logo: string | null;
  site: string | null;
  ordre: number;
}

export interface MembreRow {
  id: number;
  nom: string;
  role_fr: string | null;
  role_en: string | null;
  bio_fr: string | null;
  bio_en: string | null;
  photo: string | null;
  ordre: number;
  badge: string | null; // étiquette sur la photo (ex. FONDATEUR)
}

export type StatutAdhesion = 'nouvelle' | 'contactee' | 'retenue' | 'membre' | 'refusee';

export interface AdhesionRow {
  id: number;
  nom: string;
  email: string | null;
  telephone: string | null;
  ville: string | null;
  profil: string | null;
  motivation: string | null;
  interets: string | null; // clés séparées par des virgules (voir lib/adhesion.ts)
  niveau: string | null; // élèves et étudiants : classe ou année d'études
  specialite: string | null; // filière ou spécialité
  etablissement: string | null;
  consentement: number; // 1 = accepte d'être contacté·e (WhatsApp, e-mail)
  langue: string;
  statut: StatutAdhesion;
  note: string | null;
  numero_membre: string | null; // AIA-AAAA-NNNN, créé quand la demande est retenue
  cle_hash: string | null; // empreinte SHA-256 de la clé d'accès (la clé n'est jamais stockée)
  retenue_le: string | null;
  membre_le: string | null; // date du premier paiement validé
  expire_le: string | null; // fin de validité de l'adhésion (AAAA-MM-JJ)
  cree_le: string;
  maj_le: string;
}

export type ModePaiement = 'orange_money' | 'mtn_money' | 'moov_money' | 'wave' | 'especes' | 'virement' | 'autre';

export interface PaiementRow {
  id: number;
  adhesion_id: number;
  montant: number; // en francs CFA
  mode: ModePaiement;
  reference: string | null;
  date: string; // AAAA-MM-JJ
  note: string | null;
  valide_par: number | null; // id de l'admin qui a validé
  cree_le: string;
}

export interface PaiementAvecMembre extends PaiementRow {
  nom: string;
  numero_membre: string | null;
}
