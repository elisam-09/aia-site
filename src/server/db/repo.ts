/**
 * Accès aux données (SQLite synchrone). Utilisé par les pages publiques (lecture)
 * et par le portail admin (création / modification / suppression).
 */
import { getDb } from './index';
import type {
  AdhesionRow,
  ActualiteRow,
  AdminRow,
  EvenementRow,
  GalerieRow,
  MembreRow,
  PartenaireRow,
  Role,
  SessionRow,
  StatutAdhesion,
} from './types';

const now = () => new Date().toISOString();

/* ============================ ADMINS ============================ */

export function countAdmins(): number {
  return (getDb().prepare('SELECT COUNT(*) n FROM admins').get() as { n: number }).n;
}

export function listAdmins(): AdminRow[] {
  return getDb().prepare('SELECT * FROM admins ORDER BY cree_le ASC').all() as AdminRow[];
}

export function getAdminByEmail(email: string): AdminRow | undefined {
  return getDb()
    .prepare('SELECT * FROM admins WHERE email = ? COLLATE NOCASE')
    .get(email.trim()) as AdminRow | undefined;
}

export function getAdminById(id: number): AdminRow | undefined {
  return getDb().prepare('SELECT * FROM admins WHERE id = ?').get(id) as AdminRow | undefined;
}

export function createAdmin(a: {
  email: string;
  password_hash: string;
  nom: string;
  role: Role;
}): number {
  const info = getDb()
    .prepare(
      `INSERT INTO admins (email, password_hash, nom, role, actif, cree_le)
       VALUES (@email, @password_hash, @nom, @role, 1, @cree_le)`,
    )
    .run({ ...a, email: a.email.trim(), cree_le: now() });
  return Number(info.lastInsertRowid);
}

export function setAdminRole(id: number, role: Role): void {
  getDb().prepare('UPDATE admins SET role = ? WHERE id = ?').run(role, id);
}

export function setAdminActif(id: number, actif: boolean): void {
  getDb().prepare('UPDATE admins SET actif = ? WHERE id = ?').run(actif ? 1 : 0, id);
}

export function setAdminPassword(id: number, hash: string): void {
  getDb().prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(hash, id);
}

export function updateAdmin(
  id: number,
  a: { email: string; nom: string; role: Role; actif: number },
): void {
  getDb()
    .prepare('UPDATE admins SET email=@email, nom=@nom, role=@role, actif=@actif WHERE id=@id')
    .run({ ...a, email: a.email.trim(), id });
}

export function deleteAdmin(id: number): void {
  getDb().prepare('DELETE FROM admins WHERE id = ?').run(id);
}

export function touchLogin(id: number): void {
  getDb().prepare('UPDATE admins SET derniere_connexion = ? WHERE id = ?').run(now(), id);
}

/* ============================ SESSIONS ============================ */

export function createSession(id: string, adminId: number, expireLe: string): void {
  getDb()
    .prepare('INSERT INTO sessions (id, admin_id, cree_le, expire_le) VALUES (?, ?, ?, ?)')
    .run(id, adminId, now(), expireLe);
}

export function getSession(id: string): SessionRow | undefined {
  return getDb().prepare('SELECT * FROM sessions WHERE id = ?').get(id) as SessionRow | undefined;
}

export function deleteSession(id: string): void {
  getDb().prepare('DELETE FROM sessions WHERE id = ?').run(id);
}

export function purgeExpiredSessions(): void {
  getDb().prepare('DELETE FROM sessions WHERE expire_le < ?').run(now());
}

/* ============================ ÉVÉNEMENTS ============================ */

export interface EvenementInput {
  titre_fr: string;
  titre_en: string | null;
  date: string;
  heure: string | null;
  lieu: string;
  description_fr: string | null;
  description_en: string | null;
  image: string | null;
  lien: string | null;
  publie: number;
  date_fin: string | null;
  date_libelle: string | null;
}

export function listEvenements(onlyPublished = false): EvenementRow[] {
  const where = onlyPublished ? 'WHERE publie = 1' : '';
  return getDb()
    .prepare(`SELECT * FROM evenements ${where} ORDER BY date DESC`)
    .all() as EvenementRow[];
}

export function getEvenement(id: number): EvenementRow | undefined {
  return getDb().prepare('SELECT * FROM evenements WHERE id = ?').get(id) as
    | EvenementRow
    | undefined;
}

export function createEvenement(e: EvenementInput): number {
  const t = now();
  const info = getDb()
    .prepare(
      `INSERT INTO evenements
        (titre_fr, titre_en, date, date_fin, date_libelle, heure, lieu, description_fr, description_en, image, lien, publie, cree_le, maj_le)
       VALUES
        (@titre_fr, @titre_en, @date, @date_fin, @date_libelle, @heure, @lieu, @description_fr, @description_en, @image, @lien, @publie, @t, @t)`,
    )
    .run({ ...e, t });
  return Number(info.lastInsertRowid);
}

export function updateEvenement(id: number, e: EvenementInput): void {
  getDb()
    .prepare(
      `UPDATE evenements SET
        titre_fr=@titre_fr, titre_en=@titre_en, date=@date, date_fin=@date_fin,
        date_libelle=@date_libelle, heure=@heure, lieu=@lieu,
        description_fr=@description_fr, description_en=@description_en, image=@image,
        lien=@lien, publie=@publie, maj_le=@t
       WHERE id=@id`,
    )
    .run({ ...e, id, t: now() });
}

export function deleteEvenement(id: number): void {
  getDb().prepare('DELETE FROM evenements WHERE id = ?').run(id);
}

/** Copie un événement (masqué, titre suffixé « copie ») et renvoie l'id de la copie. */
export function dupliquerEvenement(id: number): number | undefined {
  const e = getEvenement(id);
  if (!e) return undefined;
  return createEvenement({
    titre_fr: `${e.titre_fr} (copie)`,
    titre_en: e.titre_en ? `${e.titre_en} (copy)` : null,
    date: e.date,
    date_fin: e.date_fin,
    date_libelle: e.date_libelle,
    heure: e.heure,
    lieu: e.lieu,
    description_fr: e.description_fr,
    description_en: e.description_en,
    image: e.image,
    lien: e.lien,
    publie: 0,
  });
}

/* ============================ ACTUALITÉS ============================ */

export interface ActualiteInput {
  slug: string;
  titre_fr: string;
  titre_en: string | null;
  date: string;
  auteur: string;
  extrait_fr: string | null;
  extrait_en: string | null;
  corps_fr: string | null;
  corps_en: string | null;
  image: string | null;
  publie: number;
  origine: string;
  liens: string | null;
}

export function listActualites(onlyPublished = false): ActualiteRow[] {
  const where = onlyPublished ? 'WHERE publie = 1' : '';
  return getDb()
    .prepare(`SELECT * FROM actualites ${where} ORDER BY date DESC`)
    .all() as ActualiteRow[];
}

export function getActualite(id: number): ActualiteRow | undefined {
  return getDb().prepare('SELECT * FROM actualites WHERE id = ?').get(id) as
    | ActualiteRow
    | undefined;
}

export function getActualiteBySlug(slug: string): ActualiteRow | undefined {
  return getDb().prepare('SELECT * FROM actualites WHERE slug = ?').get(slug) as
    | ActualiteRow
    | undefined;
}

export function slugExists(slug: string, exceptId?: number): boolean {
  const row = getDb().prepare('SELECT id FROM actualites WHERE slug = ?').get(slug) as
    | { id: number }
    | undefined;
  return Boolean(row && row.id !== exceptId);
}

export function createActualite(a: ActualiteInput): number {
  const t = now();
  const info = getDb()
    .prepare(
      `INSERT INTO actualites
        (slug, titre_fr, titre_en, date, auteur, origine, liens, extrait_fr, extrait_en, corps_fr, corps_en, image, publie, cree_le, maj_le)
       VALUES
        (@slug, @titre_fr, @titre_en, @date, @auteur, @origine, @liens, @extrait_fr, @extrait_en, @corps_fr, @corps_en, @image, @publie, @t, @t)`,
    )
    .run({ ...a, t });
  return Number(info.lastInsertRowid);
}

export function updateActualite(id: number, a: ActualiteInput): void {
  getDb()
    .prepare(
      `UPDATE actualites SET
        slug=@slug, titre_fr=@titre_fr, titre_en=@titre_en, date=@date, auteur=@auteur,
        origine=@origine, liens=@liens,
        extrait_fr=@extrait_fr, extrait_en=@extrait_en, corps_fr=@corps_fr, corps_en=@corps_en,
        image=@image, publie=@publie, maj_le=@t
       WHERE id=@id`,
    )
    .run({ ...a, id, t: now() });
}

export function deleteActualite(id: number): void {
  getDb().prepare('DELETE FROM actualites WHERE id = ?').run(id);
}

/* ============================ GALERIE ============================ */

export interface GalerieInput {
  titre_fr: string;
  titre_en: string | null;
  image: string;
  categorie: string;
  date: string | null;
}

export function listGalerie(): GalerieRow[] {
  return getDb()
    .prepare("SELECT * FROM galerie ORDER BY COALESCE(date, cree_le) DESC")
    .all() as GalerieRow[];
}

export function getGalerieItem(id: number): GalerieRow | undefined {
  return getDb().prepare('SELECT * FROM galerie WHERE id = ?').get(id) as GalerieRow | undefined;
}

export function createGalerie(g: GalerieInput): number {
  const info = getDb()
    .prepare(
      `INSERT INTO galerie (titre_fr, titre_en, image, categorie, date, cree_le)
       VALUES (@titre_fr, @titre_en, @image, @categorie, @date, @cree_le)`,
    )
    .run({ ...g, cree_le: now() });
  return Number(info.lastInsertRowid);
}

export function updateGalerie(id: number, g: GalerieInput): void {
  getDb()
    .prepare(
      `UPDATE galerie SET titre_fr=@titre_fr, titre_en=@titre_en, image=@image,
        categorie=@categorie, date=@date WHERE id=@id`,
    )
    .run({ ...g, id });
}

export function deleteGalerie(id: number): void {
  getDb().prepare('DELETE FROM galerie WHERE id = ?').run(id);
}

/* ============================ PARTENAIRES ============================ */

export interface PartenaireInput {
  nom: string;
  sigle: string | null;
  description_fr: string | null;
  description_en: string | null;
  logo: string | null;
  site: string | null;
  ordre: number;
}

export function listPartenaires(): PartenaireRow[] {
  return getDb()
    .prepare('SELECT * FROM partenaires ORDER BY ordre ASC, id ASC')
    .all() as PartenaireRow[];
}

export function getPartenaire(id: number): PartenaireRow | undefined {
  return getDb().prepare('SELECT * FROM partenaires WHERE id = ?').get(id) as
    | PartenaireRow
    | undefined;
}

export function createPartenaire(p: PartenaireInput): number {
  const info = getDb()
    .prepare(
      `INSERT INTO partenaires (nom, sigle, description_fr, description_en, logo, site, ordre)
       VALUES (@nom, @sigle, @description_fr, @description_en, @logo, @site, @ordre)`,
    )
    .run(p);
  return Number(info.lastInsertRowid);
}

export function updatePartenaire(id: number, p: PartenaireInput): void {
  getDb()
    .prepare(
      `UPDATE partenaires SET nom=@nom, sigle=@sigle, description_fr=@description_fr,
        description_en=@description_en, logo=@logo, site=@site, ordre=@ordre WHERE id=@id`,
    )
    .run({ ...p, id });
}

export function deletePartenaire(id: number): void {
  getDb().prepare('DELETE FROM partenaires WHERE id = ?').run(id);
}

/* ============================ MEMBRES ============================ */

export interface MembreInput {
  nom: string;
  role_fr: string | null;
  role_en: string | null;
  bio_fr: string | null;
  bio_en: string | null;
  photo: string | null;
  ordre: number;
  badge: string | null;
}

export function listMembres(): MembreRow[] {
  return getDb().prepare('SELECT * FROM membres ORDER BY ordre ASC, id ASC').all() as MembreRow[];
}

export function getMembre(id: number): MembreRow | undefined {
  return getDb().prepare('SELECT * FROM membres WHERE id = ?').get(id) as MembreRow | undefined;
}

export function createMembre(m: MembreInput): number {
  const info = getDb()
    .prepare(
      `INSERT INTO membres (nom, role_fr, role_en, bio_fr, bio_en, photo, ordre, badge)
       VALUES (@nom, @role_fr, @role_en, @bio_fr, @bio_en, @photo, @ordre, @badge)`,
    )
    .run(m);
  return Number(info.lastInsertRowid);
}

export function updateMembre(id: number, m: MembreInput): void {
  getDb()
    .prepare(
      `UPDATE membres SET nom=@nom, role_fr=@role_fr, role_en=@role_en, bio_fr=@bio_fr,
        bio_en=@bio_en, photo=@photo, ordre=@ordre, badge=@badge WHERE id=@id`,
    )
    .run({ ...m, id });
}

export function deleteMembre(id: number): void {
  getDb().prepare('DELETE FROM membres WHERE id = ?').run(id);
}

/** Monte (-1) ou descend (+1) un membre d'un cran ; renumérote l'ordre par pas de 10. */
export function deplacerMembre(id: number, sens: -1 | 1): void {
  const db = getDb();
  const ids = listMembres().map((m) => m.id);
  const i = ids.indexOf(id), j = i + sens;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  const maj = db.prepare('UPDATE membres SET ordre = ? WHERE id = ?');
  db.transaction(() => ids.forEach((mid, k) => maj.run((k + 1) * 10, mid)))();
}

/* ============================ RÉGLAGES ============================ */

export function getReglages(): Record<string, string> {
  const rows = getDb().prepare('SELECT cle, valeur FROM reglages').all() as {
    cle: string;
    valeur: string | null;
  }[];
  return Object.fromEntries(rows.map((r) => [r.cle, r.valeur ?? '']));
}

export function setReglages(valeurs: Record<string, string>): void {
  const db = getDb();
  const stmt = db.prepare(
    'INSERT INTO reglages (cle, valeur) VALUES (?, ?) ON CONFLICT(cle) DO UPDATE SET valeur = excluded.valeur',
  );
  db.transaction(() => {
    for (const [k, v] of Object.entries(valeurs)) stmt.run(k, v);
  })();
}

/* ============================ ADHÉSIONS ============================ */

export interface AdhesionInput {
  nom: string;
  email: string | null;
  telephone: string | null;
  ville: string | null;
  profil: string | null;
  motivation: string | null;
  langue: string;
}

export function createAdhesion(a: AdhesionInput): number {
  const t = now();
  const info = getDb()
    .prepare(
      `INSERT INTO adhesions (nom, email, telephone, ville, profil, motivation, langue, statut, cree_le, maj_le)
       VALUES (@nom, @email, @telephone, @ville, @profil, @motivation, @langue, 'nouvelle', @t, @t)`,
    )
    .run({ ...a, t });
  return Number(info.lastInsertRowid);
}

export function listAdhesions(statut?: StatutAdhesion): AdhesionRow[] {
  const db = getDb();
  return (
    statut
      ? db.prepare('SELECT * FROM adhesions WHERE statut = ? ORDER BY cree_le DESC').all(statut)
      : db.prepare('SELECT * FROM adhesions ORDER BY cree_le DESC').all()
  ) as AdhesionRow[];
}

export function getAdhesion(id: number): AdhesionRow | undefined {
  return getDb().prepare('SELECT * FROM adhesions WHERE id = ?').get(id) as AdhesionRow | undefined;
}

export function countAdhesionsParStatut(): Record<StatutAdhesion, number> {
  const c: Record<StatutAdhesion, number> = { nouvelle: 0, contactee: 0, acceptee: 0, refusee: 0 };
  const rows = getDb().prepare('SELECT statut, COUNT(*) n FROM adhesions GROUP BY statut').all() as {
    statut: StatutAdhesion;
    n: number;
  }[];
  for (const r of rows) if (r.statut in c) c[r.statut] = r.n;
  return c;
}

export function updateAdhesion(id: number, statut: StatutAdhesion, note: string | null): void {
  getDb()
    .prepare('UPDATE adhesions SET statut = ?, note = ?, maj_le = ? WHERE id = ?')
    .run(statut, note, now(), id);
}

export function deleteAdhesion(id: number): void {
  getDb().prepare('DELETE FROM adhesions WHERE id = ?').run(id);
}

/* ============================ SAUVEGARDE ============================ */

/** Tout le contenu éditorial (hors comptes, sessions et demandes d'adhésion). */
export function exporterContenu(): Record<string, unknown> {
  const db = getDb();
  const tables = ['evenements', 'actualites', 'galerie', 'partenaires', 'membres', 'reglages'];
  return {
    format: 'aia-sauvegarde',
    version: 1,
    exporte_le: now(),
    ...Object.fromEntries(tables.map((t) => [t, db.prepare(`SELECT * FROM ${t}`).all()])),
  };
}
