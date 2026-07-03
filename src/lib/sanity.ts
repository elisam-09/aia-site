/**
 * Accès Sanity en HTTP pur (API GROQ publique, CDN) — aucune dépendance npm.
 * Utilisé uniquement au build : les pages restent 100 % statiques.
 */
import type { Lang } from '../i18n/ui';
import { ptToBlocks, type PtBlock } from './blocks';
import type {
  EventItem,
  GalleryItem,
  Localized,
  Member,
  Partner,
  Post,
  Product,
} from './types';
import { pick } from './types';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) ?? 'production';

export const sanityEnabled = Boolean(projectId);

async function q<T>(groq: string): Promise<T> {
  const url = `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { result: T };
  return json.result;
}

/** Ajoute les paramètres d'optimisation du CDN d'images Sanity. */
function img(url: string | null | undefined, w = 900): string | undefined {
  if (!url) return undefined;
  return `${url}?w=${w}&auto=format&q=75`;
}

/* ---------- Requêtes ---------- */

interface SEvent {
  _id: string;
  titre: Localized;
  date: string;
  heure?: string;
  lieu?: string;
  description?: Localized;
  image?: string;
  lien?: string;
}

export async function sanityEvents(lang: Lang): Promise<EventItem[]> {
  const rows = await q<SEvent[]>(
    `*[_type == "evenement"] | order(date desc) {
      _id, titre, date, heure, lieu, description, lien,
      "image": image.asset->url
    }`,
  );
  const now = new Date().toISOString().slice(0, 10);
  return rows.map((r) => ({
    id: r._id,
    titre: pick(r.titre, lang),
    date: r.date,
    heure: r.heure,
    lieu: r.lieu ?? '',
    description: pick(r.description, lang),
    image: img(r.image),
    lien: r.lien,
    passe: r.date < now,
  }));
}

interface SPost {
  slug: string;
  titre: Localized;
  date: string;
  extrait?: Localized;
  corpsFr?: PtBlock[];
  corpsEn?: PtBlock[];
  image?: string;
  auteur?: string;
}

export async function sanityPosts(lang: Lang): Promise<Post[]> {
  const rows = await q<SPost[]>(
    `*[_type == "actualite"] | order(date desc) {
      "slug": slug.current, titre, date, extrait, auteur,
      "corpsFr": corps.fr, "corpsEn": corps.en,
      "image": image.asset->url
    }`,
  );
  return rows.map((r) => ({
    slug: r.slug,
    titre: pick(r.titre, lang),
    date: r.date,
    extrait: pick(r.extrait, lang),
    corps: ptToBlocks(lang === 'en' && r.corpsEn?.length ? r.corpsEn : r.corpsFr),
    image: img(r.image),
    auteur: r.auteur ?? 'AIA',
  }));
}

interface SPhoto {
  _id: string;
  titre: Localized;
  categorie?: GalleryItem['categorie'];
  date?: string;
  image?: string;
}

export async function sanityGallery(lang: Lang): Promise<GalleryItem[]> {
  const rows = await q<SPhoto[]>(
    `*[_type == "photoGalerie"] | order(coalesce(date, _createdAt) desc) {
      _id, titre, categorie, date, "image": image.asset->url
    }`,
  );
  return rows
    .filter((r) => r.image)
    .map((r) => ({
      id: r._id,
      titre: pick(r.titre, lang),
      categorie: r.categorie ?? 'observation',
      date: r.date,
      image: img(r.image, 1200)!,
    }));
}

interface SProduct {
  _id: string;
  nom: Localized;
  description?: Localized;
  prix?: string;
  dispo?: boolean;
  image?: string;
}

export async function sanityProducts(lang: Lang): Promise<Product[]> {
  const rows = await q<SProduct[]>(
    `*[_type == "produit"] | order(_createdAt asc) {
      _id, nom, description, prix, dispo, "image": image.asset->url
    }`,
  );
  return rows.map((r) => ({
    id: r._id,
    nom: pick(r.nom, lang),
    description: pick(r.description, lang),
    prix: r.prix ?? '',
    dispo: r.dispo ?? true,
    image: img(r.image, 700),
  }));
}

interface SPartner {
  _id: string;
  nom: string;
  sigle?: string;
  description?: Localized;
  site?: string;
  logo?: string;
}

export async function sanityPartners(lang: Lang): Promise<Partner[]> {
  const rows = await q<SPartner[]>(
    `*[_type == "partenaire"] | order(coalesce(ordre, 99) asc) {
      _id, nom, sigle, description, site, "logo": logo.asset->url
    }`,
  );
  return rows.map((r) => ({
    id: r._id,
    nom: r.nom,
    sigle: r.sigle,
    description: pick(r.description, lang),
    site: r.site,
    logo: img(r.logo, 400),
  }));
}

interface SMember {
  _id: string;
  nom: string;
  role?: Localized;
  bio?: Localized;
  photo?: string;
}

export async function sanityTeam(lang: Lang): Promise<Member[]> {
  const rows = await q<SMember[]>(
    `*[_type == "membre"] | order(coalesce(ordre, 99) asc) {
      _id, nom, role, bio, "photo": photo.asset->url
    }`,
  );
  return rows.map((r) => ({
    id: r._id,
    nom: r.nom,
    role: pick(r.role, lang),
    bio: pick(r.bio, lang),
    photo: img(r.photo, 500),
  }));
}
