/**
 * Amorçage : remplit la base avec le contenu de référence si (et seulement si) une table
 * est vide. Ainsi le site n'est jamais vide au premier lancement, et on ne réécrase
 * jamais le contenu saisi par le bureau.
 *
 * `remplacerDemo` (une seule fois par base) remplace l'ancien contenu de démonstration
 * fictif par le contenu réel, uniquement pour les tables encore 100 % « démo ».
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

/** [libellé, url][] → texte « Libellé | url » une ligne par source (format de l'admin). */
const texteLiens = (l?: [string, string][]) => (l?.length ? l.map(([a, b]) => `${a} | ${b}`).join('\n') : null);

const isEmpty = (db: DB, table: string): boolean =>
  (db.prepare(`SELECT COUNT(*) n FROM ${table}`).get() as { n: number }).n === 0;

export function seedIfEmpty(db: DB): void {
  if (isEmpty(db, 'evenements')) insererEvenements(db);
  if (isEmpty(db, 'actualites')) insererActualites(db);
  if (isEmpty(db, 'galerie')) insererGalerie(db);
  if (isEmpty(db, 'produits')) insererProduits(db);
  if (isEmpty(db, 'partenaires')) insererPartenaires(db);
  if (isEmpty(db, 'membres')) insererMembres(db);
  remplacerDemo(db);
}

function insererEvenements(db: DB): void {
  const t = new Date().toISOString();
  {
    const stmt = db.prepare(
      `INSERT INTO evenements (titre_fr,titre_en,date,date_fin,date_libelle,heure,lieu,description_fr,description_en,image,lien,publie,cree_le,maj_le)
       VALUES (@titre_fr,@titre_en,@date,@date_fin,@date_libelle,@heure,@lieu,@description_fr,@description_en,@image,@lien,1,@t,@t)`,
    );
    db.transaction(() => {
      for (const e of EVENTS) {
        stmt.run({
          titre_fr: e.titre.fr,
          titre_en: e.titre.en ?? null,
          date: e.date,
          date_fin: e.dateFin ?? null,
          date_libelle: e.dateLibelle ?? null,
          heure: e.heure ?? null,
          lieu: e.lieu,
          description_fr: e.description.fr,
          description_en: e.description.en ?? null,
          image: e.image ?? null,
          lien: e.lien ?? null,
          t,
        });
      }
    })();
  }

}

function insererActualites(db: DB): void {
  const t = new Date().toISOString();
  {
    const stmt = db.prepare(
      `INSERT OR IGNORE INTO actualites (slug,titre_fr,titre_en,date,auteur,origine,liens,extrait_fr,extrait_en,corps_fr,corps_en,image,publie,cree_le,maj_le)
       VALUES (@slug,@titre_fr,@titre_en,@date,@auteur,@origine,@liens,@extrait_fr,@extrait_en,@corps_fr,@corps_en,@image,1,@t,@t)`,
    );
    db.transaction(() => {
      for (const a of POSTS) {
        stmt.run({
          slug: a.slug,
          titre_fr: a.titre.fr,
          titre_en: a.titre.en ?? null,
          date: a.date,
          auteur: a.auteur,
          origine: a.origine,
          liens: texteLiens(a.liens),
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

}

function insererGalerie(db: DB): void {
  const t = new Date().toISOString();
  {
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

}

function insererProduits(db: DB): void {
  {
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

}

function insererPartenaires(db: DB): void {
  {
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
          logo: p.logo ?? null,
          site: p.site ?? null,
          ordre: (i + 1) * 10,
        }),
      );
    })();
  }

}

function insererMembres(db: DB): void {
  {
    const stmt = db.prepare(
      `INSERT INTO membres (nom,role_fr,role_en,bio_fr,bio_en,photo,ordre,badge)
       VALUES (@nom,@role_fr,@role_en,@bio_fr,@bio_en,@photo,@ordre,@badge)`,
    );
    db.transaction(() => {
      TEAM.forEach((m, i) =>
        stmt.run({
          nom: m.nom,
          role_fr: m.role.fr,
          role_en: m.role.en ?? null,
          bio_fr: m.bio.fr,
          bio_en: m.bio.en ?? null,
          photo: m.photo ?? null,
          ordre: (i + 1) * 10,
          badge: m.badge ?? null,
        }),
      );
    })();
  }
}

/* ---------- Migration unique : contenu de démonstration → contenu réel ---------- */

const DEMO_EVENEMENTS = [
  'Observation publique : la Lune au télescope',
  'Nuit des étoiles filantes — Perséides 2026',
  'AstroPause #7 : « Vivre et travailler dans l’espace »',
  'Tournée scolaire : lycées de Yopougon',
  "Campagne de recherche d'astéroïdes (IASC) — hiver 2025",
  'Éclipse totale de Lune du 7 septembre 2025',
];
const DEMO_GALERIE = [
  'Lune gibbeuse au T200',
  'Voie lactée depuis Assinie',
  'Atelier au lycée de Cocody',
  "File d'attente, éclipse de Lune 2025",
  'Saturne, première lumière',
  'Observation publique au Plateau',
  'Analyse IASC en salle',
  "Naissance du club d'Abobo",
];
const DEMO_PARTENAIRES = ['UAI', 'NASA', 'IASC', 'AfAS', 'UFHB', 'URANOSCOPE'];
const VERSION_CONTENU = 'reel-2026-10b';

/** Vrai si toutes les valeurs de la colonne appartiennent à l'ensemble « démo ». */
function toutDemo(db: DB, sql: string, demo: string[]): boolean {
  const vals = (db.prepare(sql).all() as { v: string | null }[]).map((r) => r.v ?? '');
  return vals.length > 0 && vals.every((v) => demo.includes(v));
}

export function remplacerDemo(db: DB): void {
  db.exec('CREATE TABLE IF NOT EXISTS meta (cle TEXT PRIMARY KEY, valeur TEXT)');
  const fait = db.prepare("SELECT valeur FROM meta WHERE cle = 'contenu'").get() as
    | { valeur: string }
    | undefined;
  if (fait?.valeur === VERSION_CONTENU) return;

  db.transaction(() => {
    if (toutDemo(db, 'SELECT titre_fr v FROM evenements', DEMO_EVENEMENTS)) {
      db.exec('DELETE FROM evenements');
      insererEvenements(db);
    }
    if (toutDemo(db, 'SELECT titre_fr v FROM galerie', DEMO_GALERIE)) {
      db.exec('DELETE FROM galerie');
      insererGalerie(db);
    }
    if (toutDemo(db, 'SELECT nom v FROM membres', ['Membre du bureau'])) {
      db.exec('DELETE FROM membres');
      insererMembres(db);
    }
    if (
      toutDemo(db, 'SELECT sigle v FROM partenaires', DEMO_PARTENAIRES) &&
      (db.prepare('SELECT COUNT(*) n FROM partenaires WHERE logo IS NOT NULL').get() as { n: number }).n === 0
    ) {
      db.exec('DELETE FROM partenaires');
      insererPartenaires(db);
    }
    // Articles : la démo jamais retouchée (maj_le = cree_le) reçoit sa version réelle,
    // puis les nouveaux articles sont ajoutés (les slugs existants sont ignorés).
    const maj = db.prepare(
      `UPDATE actualites SET titre_fr=@titre_fr, titre_en=@titre_en, extrait_fr=@extrait_fr,
         extrait_en=@extrait_en, corps_fr=@corps_fr, corps_en=@corps_en, image=@image,
         origine=@origine, liens=@liens
       WHERE slug=@slug AND maj_le = cree_le`,
    );
    for (const a of POSTS) {
      maj.run({
        slug: a.slug,
        titre_fr: a.titre.fr,
        titre_en: a.titre.en ?? null,
        extrait_fr: a.extrait.fr,
        extrait_en: a.extrait.en ?? null,
        corps_fr: renderBlocks(a.corps.fr),
        corps_en: a.corps.en ? renderBlocks(a.corps.en) : null,
        image: a.image ?? null,
        origine: a.origine,
        liens: texteLiens(a.liens),
      });
    }
    insererActualites(db);
    // Champs ajoutés ensuite (dates de fin, étiquettes) : complétés s'ils sont vides
    const majEv = db.prepare(
      `UPDATE evenements SET date_fin = COALESCE(date_fin, @date_fin), date_libelle = COALESCE(date_libelle, @date_libelle)
       WHERE titre_fr = @titre_fr`,
    );
    for (const e of EVENTS)
      majEv.run({ titre_fr: e.titre.fr, date_fin: e.dateFin ?? null, date_libelle: e.dateLibelle ?? null });
    const majMb = db.prepare('UPDATE membres SET badge = COALESCE(badge, @badge) WHERE nom = @nom');
    for (const m of TEAM) if (m.badge) majMb.run({ nom: m.nom, badge: m.badge });
    db.prepare("INSERT OR REPLACE INTO meta (cle, valeur) VALUES ('contenu', ?)").run(VERSION_CONTENU);
  })();
}
