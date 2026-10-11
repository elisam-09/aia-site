/**
 * Connexion SQLite (better-sqlite3) — un seul fichier `data/aia.db`.
 * Singleton stocké sur globalThis pour survivre au rechargement à chaud (HMR) en dev.
 */
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nom TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editeur',
  actif INTEGER NOT NULL DEFAULT 1,
  cree_le TEXT NOT NULL,
  derniere_connexion TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  cree_le TEXT NOT NULL,
  expire_le TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS evenements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre_fr TEXT NOT NULL,
  titre_en TEXT,
  date TEXT NOT NULL,
  heure TEXT,
  lieu TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  image TEXT,
  lien TEXT,
  publie INTEGER NOT NULL DEFAULT 1,
  cree_le TEXT NOT NULL,
  maj_le TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS actualites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  titre_fr TEXT NOT NULL,
  titre_en TEXT,
  date TEXT NOT NULL,
  auteur TEXT NOT NULL DEFAULT 'AIA',
  extrait_fr TEXT,
  extrait_en TEXT,
  corps_fr TEXT,
  corps_en TEXT,
  image TEXT,
  publie INTEGER NOT NULL DEFAULT 1,
  cree_le TEXT NOT NULL,
  maj_le TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS galerie (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre_fr TEXT NOT NULL,
  titre_en TEXT,
  image TEXT NOT NULL,
  categorie TEXT NOT NULL DEFAULT 'observation',
  date TEXT,
  cree_le TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS partenaires (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  sigle TEXT,
  description_fr TEXT,
  description_en TEXT,
  logo TEXT,
  site TEXT,
  ordre INTEGER NOT NULL DEFAULT 10
);

CREATE TABLE IF NOT EXISTS membres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  role_fr TEXT,
  role_en TEXT,
  bio_fr TEXT,
  bio_en TEXT,
  photo TEXT,
  ordre INTEGER NOT NULL DEFAULT 10
);

-- Réglages du site (coordonnées, réseaux, bandeau d'annonce…) : paires clé → valeur
CREATE TABLE IF NOT EXISTS reglages (
  cle TEXT PRIMARY KEY,
  valeur TEXT
);

-- Demandes d'adhésion envoyées depuis la page « Rejoindre l'AIA »
CREATE TABLE IF NOT EXISTS adhesions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  email TEXT,
  telephone TEXT,
  ville TEXT,
  profil TEXT,
  motivation TEXT,
  langue TEXT NOT NULL DEFAULT 'fr',
  statut TEXT NOT NULL DEFAULT 'nouvelle',
  note TEXT,
  cree_le TEXT NOT NULL,
  maj_le TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS adhesions_statut ON adhesions (statut, cree_le);
`;

/** Colonnes ajoutées après la première mise en ligne : créées si absentes (bases existantes). */
const COLONNES_AJOUTEES: [table: string, colonne: string, definition: string][] = [
  ['evenements', 'date_fin', 'TEXT'],
  ['evenements', 'date_libelle', 'TEXT'],
  ['actualites', 'origine', "TEXT NOT NULL DEFAULT 'AIA'"],
  ['actualites', 'liens', 'TEXT'],
  ['membres', 'badge', 'TEXT'],
];

function migrer(db: Database.Database): void {
  // la boutique (produits dérivés) a été retirée du site
  db.exec('DROP TABLE IF EXISTS produits');
  for (const [table, colonne, def] of COLONNES_AJOUTEES) {
    const existe = (db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]).some(
      (c) => c.name === colonne,
    );
    if (!existe) db.exec(`ALTER TABLE ${table} ADD COLUMN ${colonne} ${def}`);
  }
}

export const DB_PATH = resolve(process.env.DATABASE_PATH ?? 'data/aia.db');

type Glob = typeof globalThis & { __aiaDb?: Database.Database };
const g = globalThis as Glob;

function open(): Database.Database {
  mkdirSync(dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);
  migrer(db);
  return db;
}

/** Renvoie la connexion unique, en l'ouvrant (et en créant les tables) au premier appel. */
export function getDb(): Database.Database {
  if (!g.__aiaDb) {
    g.__aiaDb = open();
    // Amorçage du contenu de démonstration si la base est vide (import différé = pas de cycle)
    import('./seed').then(({ seedIfEmpty }) => seedIfEmpty(g.__aiaDb!)).catch((e) =>
      console.error('[db] échec amorçage :', e),
    );
  }
  return g.__aiaDb;
}
