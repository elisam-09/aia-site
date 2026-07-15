/**
 * Crée (ou met à jour) un compte administrateur du portail AIA.
 *
 * Usage interactif :   npm run admin:creer
 * Usage automatique :  ADMIN_EMAIL=... ADMIN_MOT_DE_PASSE=... ADMIN_NOM=... ADMIN_ROLE=admin npm run admin:creer
 *
 * Ne dépend d'aucun code de l'app : ouvre directement la base SQLite.
 */
import Database from 'better-sqlite3';
import { randomBytes, scrypt as scryptCb } from 'node:crypto';
import { promisify } from 'node:util';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import readline from 'node:readline';

const scrypt = promisify(scryptCb);
const DB_PATH = resolve(process.env.DATABASE_PATH ?? 'data/aia.db');

const ADMINS_DDL = `CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nom TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editeur',
  actif INTEGER NOT NULL DEFAULT 1,
  cree_le TEXT NOT NULL,
  derniere_connexion TEXT
);`;

function demander(question, { cache = false } = {}) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  if (cache) {
    // Masque la saisie du mot de passe par des astérisques
    rl._writeToOutput = (str) => {
      if (str.includes(question)) rl.output.write(question);
      else if (str === '\r\n' || str === '\n') rl.output.write(str);
      else rl.output.write('*');
    };
  }
  return new Promise((res) => rl.question(question, (a) => { rl.close(); if (cache) process.stdout.write('\n'); res(a.trim()); }));
}

async function hash(password) {
  const salt = randomBytes(16);
  const dk = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${dk.toString('hex')}`;
}

async function main() {
  mkdirSync(dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.exec(ADMINS_DDL);

  const nbAdmins = db.prepare('SELECT COUNT(*) n FROM admins').get().n;
  console.log(`\n🔭 Création d'un administrateur AIA (base : ${DB_PATH})`);
  if (nbAdmins === 0) console.log('   Premier compte : il sera « administrateur » (accès complet).\n');

  let email = process.env.ADMIN_EMAIL ?? (await demander('Email : '));
  email = email.trim().toLowerCase();
  if (!email.includes('@')) {
    console.error('❌ Email invalide.');
    process.exit(1);
  }

  const nom = (process.env.ADMIN_NOM ?? (await demander('Nom affiché : '))) || 'Administrateur';

  let motdepasse = process.env.ADMIN_MOT_DE_PASSE ?? (await demander('Mot de passe (min. 8) : ', { cache: true }));
  if (!motdepasse || motdepasse.length < 8) {
    console.error('❌ Mot de passe trop court (8 caractères minimum).');
    process.exit(1);
  }
  if (!process.env.ADMIN_MOT_DE_PASSE) {
    const confirm = await demander('Confirme le mot de passe : ', { cache: true });
    if (confirm !== motdepasse) {
      console.error('❌ Les mots de passe ne correspondent pas.');
      process.exit(1);
    }
  }

  let role = (process.env.ADMIN_ROLE ?? (nbAdmins === 0 ? 'admin' : 'editeur')).toLowerCase();
  if (role !== 'admin' && role !== 'editeur') role = 'editeur';

  const hashed = await hash(motdepasse);
  const now = new Date().toISOString();
  const existe = db.prepare('SELECT id FROM admins WHERE email = ? COLLATE NOCASE').get(email);

  if (existe) {
    db.prepare('UPDATE admins SET password_hash=?, nom=?, role=?, actif=1 WHERE id=?')
      .run(hashed, nom, role, existe.id);
    console.log(`\n✅ Compte mis à jour : ${email} (${role}).`);
  } else {
    db.prepare('INSERT INTO admins (email,password_hash,nom,role,actif,cree_le) VALUES (?,?,?,?,1,?)')
      .run(email, hashed, nom, role, now);
    console.log(`\n✅ Administrateur créé : ${email} (${role}).`);
  }
  console.log('   Connecte-toi sur /admin/login\n');
  db.close();
}

main().catch((e) => {
  console.error('Erreur :', e);
  process.exit(1);
});
