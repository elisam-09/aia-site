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

export type StatutAdhesion = 'nouvelle' | 'contactee' | 'acceptee' | 'refusee';

export interface AdhesionRow {
  id: number;
  nom: string;
  email: string | null;
  telephone: string | null;
  ville: string | null;
  profil: string | null;
  motivation: string | null;
  interets: string | null; // clés séparées par des virgules (voir lib/adhesion.ts)
  langue: string;
  statut: StatutAdhesion;
  note: string | null;
  cree_le: string;
  maj_le: string;
}
