/** Types de contenu consommés par les pages (déjà localisés). */

export type BlockType = 'p' | 'h2' | 'quote' | 'ul';

export interface Block {
  type: BlockType;
  /** HTML inline déjà échappé/rendu pour p, h2, quote */
  html?: string;
  /** Items pour les listes */
  items?: string[];
}

export interface EventItem {
  id: string;
  titre: string;
  date: string; // ISO
  heure?: string;
  lieu: string;
  description: string;
  image?: string;
  lien?: string;
  passe: boolean;
}

export interface Post {
  slug: string;
  titre: string;
  date: string; // ISO
  extrait: string;
  /** Corps de l'article déjà en HTML (rendu depuis la base ou l'éditeur admin) */
  corpsHtml: string;
  image?: string;
  auteur: string;
}

export interface GalleryItem {
  id: string;
  titre: string;
  image: string;
  categorie: 'observation' | 'astrophoto' | 'evenement' | 'ecole';
  date?: string;
}

export interface Product {
  id: string;
  nom: string;
  description: string;
  image?: string;
  prix: string;
  dispo: boolean;
}

export interface Partner {
  id: string;
  nom: string;
  sigle?: string;
  description: string;
  site?: string;
  logo?: string;
}

export interface Member {
  id: string;
  nom: string;
  role: string;
  bio?: string;
  photo?: string;
}

/** Champ bilingue tel que stocké dans le seed et dans Sanity. */
export interface Localized {
  fr: string;
  en: string;
}

export function pick(l: Localized | undefined, lang: 'fr' | 'en'): string {
  if (!l) return '';
  return l[lang] || l.fr || '';
}
