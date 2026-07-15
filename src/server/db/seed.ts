/**
 * Amorçage : remplit la base avec le contenu de démonstration si (et seulement si)
 * une table est vide. Ainsi le site n'est jamais vide au premier lancement, et on ne
 * réécrase jamais le contenu réel saisi par le bureau.
 */
import type BetterSqlite3 from 'better-sqlite3';
import { renderBlocks } from '../../lib/blocks';
import { EVENTS } from '../../lib/seed/events';
import { POSTS } from '../../lib/seed/posts';
import { PHOTOS } from '../../lib/seed/gallery';
import { PRODUCTS } from '../../lib/seed/products';
import { PARTNERS } from '../../lib/seed/partners';
import { TEAM } from '../../lib/seed/team';

type DB = BetterSqlite3.Database;

const isEmpty = (db: DB, table: string): boolean =>
  (db.prepare(`SELECT COUNT(*) n FROM ${table}`).get() as { n: number }).n === 0;

export function seedIfEmpty(db: DB): void {
  const t = new Date().toISOString();

  if (isEmpty(db, 'evenements')) {
    const stmt = db.prepare(
      `INSERT INTO evenements (titre_fr,titre_en,date,heure,lieu,description_fr,description_en,image,lien,publie,cree_le,maj_le)
       VALUES (@titre_fr,@titre_en,@date,@heure,@lieu,@description_fr,@description_en,@image,@lien,1,@t,@t)`,
    );
    db.transaction(() => {
      for (const e of EVENTS) {
        stmt.run({
          titre_fr: e.titre.fr,
          titre_en: e.titre.en ?? null,
          date: e.date,
          heure: e.heure ?? null,
          lieu: e.lieu,
          description_fr: e.description.fr,
          description_en: e.description.en ?? null,
          image: e.image ?? null,
          lien: null,
          t,
        });
      }
    })();
  }

  if (isEmpty(db, 'actualites')) {
    const stmt = db.prepare(
      `INSERT INTO actualites (slug,titre_fr,titre_en,date,auteur,extrait_fr,extrait_en,corps_fr,corps_en,image,publie,cree_le,maj_le)
       VALUES (@slug,@titre_fr,@titre_en,@date,@auteur,@extrait_fr,@extrait_en,@corps_fr,@corps_en,@image,1,@t,@t)`,
    );
    db.transaction(() => {
      for (const a of POSTS) {
        stmt.run({
          slug: a.slug,
          titre_fr: a.titre.fr,
          titre_en: a.titre.en ?? null,
          date: a.date,
          auteur: a.auteur,
          extrait_fr: a.extrait.fr,
          extrait_en: a.extrait.en ?? null,
          corps_fr: renderBlocks(a.corps.fr),
          corps_en: a.corps.en ? renderBlocks(a.corps.en) : null,
          image: a.image ?? null,
          t,
        });
      }
    })();
  }

  if (isEmpty(db, 'galerie')) {
    const stmt = db.prepare(
      `INSERT INTO galerie (titre_fr,titre_en,image,categorie,date,cree_le)
       VALUES (@titre_fr,@titre_en,@image,@categorie,@date,@t)`,
    );
    db.transaction(() => {
      for (const p of PHOTOS) {
        stmt.run({
          titre_fr: p.titre.fr,
          titre_en: p.titre.en ?? null,
          image: p.image,
          categorie: p.categorie,
          date: p.date ?? null,
          t,
        });
      }
    })();
  }

  if (isEmpty(db, 'produits')) {
    const stmt = db.prepare(
      `INSERT INTO produits (nom_fr,nom_en,description_fr,description_en,image,prix,disponible,ordre)
       VALUES (@nom_fr,@nom_en,@description_fr,@description_en,@image,@prix,@disponible,@ordre)`,
    );
    db.transaction(() => {
      PRODUCTS.forEach((p, i) =>
        stmt.run({
          nom_fr: p.nom.fr,
          nom_en: p.nom.en ?? null,
          description_fr: p.description.fr,
          description_en: p.description.en ?? null,
          image: p.image ?? null,
          prix: p.prix ?? null,
          disponible: p.dispo ? 1 : 0,
          ordre: (i + 1) * 10,
        }),
      );
    })();
  }

  if (isEmpty(db, 'partenaires')) {
    const stmt = db.prepare(
      `INSERT INTO partenaires (nom,sigle,description_fr,description_en,logo,site,ordre)
       VALUES (@nom,@sigle,@description_fr,@description_en,@logo,@site,@ordre)`,
    );
    db.transaction(() => {
      PARTNERS.forEach((p, i) =>
        stmt.run({
          nom: p.nom,
          sigle: p.sigle ?? null,
          description_fr: p.description.fr,
          description_en: p.description.en ?? null,
          logo: null,
          site: p.site ?? null,
          ordre: (i + 1) * 10,
        }),
      );
    })();
  }

  if (isEmpty(db, 'membres')) {
    const stmt = db.prepare(
      `INSERT INTO membres (nom,role_fr,role_en,bio_fr,bio_en,photo,ordre)
       VALUES (@nom,@role_fr,@role_en,@bio_fr,@bio_en,@photo,@ordre)`,
    );
    db.transaction(() => {
      TEAM.forEach((m, i) =>
        stmt.run({
          nom: 'Membre du bureau',
          role_fr: m.role.fr,
          role_en: m.role.en ?? null,
          bio_fr: m.bio.fr,
          bio_en: m.bio.en ?? null,
          photo: '/placeholders/avatar.svg',
          ordre: (i + 1) * 10,
        }),
      );
    })();
  }
}
