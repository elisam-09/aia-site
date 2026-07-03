/**
 * Façade contenu : Sanity si configuré (PUBLIC_SANITY_PROJECT_ID), sinon seed local.
 * En cas d'erreur Sanity au build, on retombe sur le seed pour ne jamais casser le site.
 */
import type { Lang } from '../i18n/ui';
import type { EventItem, GalleryItem, Member, Partner, Post, Product } from './types';
import {
  sanityEnabled,
  sanityEvents,
  sanityGallery,
  sanityPartners,
  sanityPosts,
  sanityProducts,
  sanityTeam,
} from './sanity';
import { seedEvents } from './seed/events';
import { seedPosts } from './seed/posts';
import { seedGallery } from './seed/gallery';
import { seedProducts } from './seed/products';
import { seedPartners } from './seed/partners';
import { seedTeam } from './seed/team';

async function avecRepli<T>(viaSanity: () => Promise<T>, viaSeed: () => T): Promise<T> {
  if (!sanityEnabled) return viaSeed();
  try {
    return await viaSanity();
  } catch (err) {
    console.warn('[contenu] Sanity indisponible, repli sur le contenu local :', err);
    return viaSeed();
  }
}

export function getEvents(lang: Lang): Promise<EventItem[]> {
  return avecRepli(() => sanityEvents(lang), () => seedEvents(lang));
}

export async function getUpcomingEvents(lang: Lang, limit = 3): Promise<EventItem[]> {
  const all = await getEvents(lang);
  return all
    .filter((e) => !e.passe)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

export async function getPastEvents(lang: Lang): Promise<EventItem[]> {
  const all = await getEvents(lang);
  return all.filter((e) => e.passe).sort((a, b) => b.date.localeCompare(a.date));
}

export function getPosts(lang: Lang): Promise<Post[]> {
  return avecRepli(() => sanityPosts(lang), () => seedPosts(lang));
}

export async function getPost(lang: Lang, slug: string): Promise<Post | undefined> {
  const all = await getPosts(lang);
  return all.find((p) => p.slug === slug);
}

export function getGallery(lang: Lang): Promise<GalleryItem[]> {
  return avecRepli(() => sanityGallery(lang), () => seedGallery(lang));
}

export function getProducts(lang: Lang): Promise<Product[]> {
  return avecRepli(() => sanityProducts(lang), () => seedProducts(lang));
}

export function getPartners(lang: Lang): Promise<Partner[]> {
  return avecRepli(() => sanityPartners(lang), () => seedPartners(lang));
}

export function getTeam(lang: Lang): Promise<Member[]> {
  return avecRepli(() => sanityTeam(lang), () => seedTeam(lang));
}
