/**
 * Façade contenu pour les pages publiques : lit la base de données (SQLite) et
 * renvoie des objets déjà localisés dans la langue demandée. Les composants de page
 * n'ont pas changé — seule la source (base au lieu du seed/Sanity) a changé.
 */
import type { Lang } from '../i18n/ui';
import type { EventItem, GalleryItem, Member, Partner, Post, Product } from './types';
import * as repo from '../server/db/repo';

const today = () => new Date().toISOString().slice(0, 10);

/** Choisit la langue : anglais si présent et non vide, sinon repli français. */
function L(fr: string | null, en: string | null, lang: Lang): string {
  if (lang === 'en' && en && en.trim()) return en;
  return fr ?? '';
}

export function getEvents(lang: Lang): EventItem[] {
  const t = today();
  return repo.listEvenements(true).map((e) => ({
    id: String(e.id),
    titre: L(e.titre_fr, e.titre_en, lang),
    date: e.date,
    heure: e.heure ?? undefined,
    lieu: e.lieu,
    description: L(e.description_fr, e.description_en, lang),
    image: e.image ?? undefined,
    lien: e.lien ?? undefined,
    passe: e.date < t,
  }));
}

export function getUpcomingEvents(lang: Lang, limit = 3): EventItem[] {
  return getEvents(lang)
    .filter((e) => !e.passe)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

export function getPastEvents(lang: Lang): EventItem[] {
  return getEvents(lang)
    .filter((e) => e.passe)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPosts(lang: Lang): Post[] {
  return repo.listActualites(true).map((a) => ({
    slug: a.slug,
    titre: L(a.titre_fr, a.titre_en, lang),
    date: a.date,
    extrait: L(a.extrait_fr, a.extrait_en, lang),
    corpsHtml: L(a.corps_fr, a.corps_en, lang),
    image: a.image ?? undefined,
    auteur: a.auteur,
  }));
}

export function getPost(lang: Lang, slug: string): Post | undefined {
  const a = repo.getActualiteBySlug(slug);
  if (!a || !a.publie) return undefined;
  return {
    slug: a.slug,
    titre: L(a.titre_fr, a.titre_en, lang),
    date: a.date,
    extrait: L(a.extrait_fr, a.extrait_en, lang),
    corpsHtml: L(a.corps_fr, a.corps_en, lang),
    image: a.image ?? undefined,
    auteur: a.auteur,
  };
}

export function getGallery(lang: Lang): GalleryItem[] {
  return repo.listGalerie().map((p) => ({
    id: String(p.id),
    titre: L(p.titre_fr, p.titre_en, lang),
    image: p.image,
    categorie: p.categorie,
    date: p.date ?? undefined,
  }));
}

export function getProducts(lang: Lang): Product[] {
  return repo.listProduits().map((p) => ({
    id: String(p.id),
    nom: L(p.nom_fr, p.nom_en, lang),
    description: L(p.description_fr, p.description_en, lang),
    image: p.image ?? undefined,
    prix: p.prix ?? '',
    dispo: Boolean(p.disponible),
  }));
}

export function getPartners(lang: Lang): Partner[] {
  return repo.listPartenaires().map((p) => ({
    id: String(p.id),
    nom: p.nom,
    sigle: p.sigle ?? undefined,
    description: L(p.description_fr, p.description_en, lang),
    site: p.site ?? undefined,
    logo: p.logo ?? undefined,
  }));
}

export function getTeam(lang: Lang): Member[] {
  return repo.listMembres().map((m) => ({
    id: String(m.id),
    nom: m.nom,
    role: L(m.role_fr, m.role_en, lang),
    bio: L(m.bio_fr, m.bio_en, lang) || undefined,
    photo: m.photo ?? undefined,
  }));
}
