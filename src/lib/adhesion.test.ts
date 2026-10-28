/** Tests des tarifs et du message de bienvenue (npm test). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CONDITIONS_DEFAUT, MSG_BIENVENUE_DEFAUT, TARIFS_DEFAUT, dureeTexte, estEtudes, francs, messageBienvenue, remplir, tarifDe, tarifsDepuis, totalAPayer,
} from './adhesion.ts';

test('les tarifs par défaut sont ceux de l’AIA quand rien n’est réglé', () => {
  const t = tarifsDepuis({});
  assert.equal(t.droit, TARIFS_DEFAUT.droit);
  assert.equal(t.cotisationTravailleur, 10000);
  assert.equal(t.droit, 5000);
});

test('un champ vide ou invalide revient au tarif par défaut', () => {
  const t = tarifsDepuis({ droit_adhesion: '', cotisation_travailleur: 'abc', cotisation_etudiant: '-5' });
  assert.deepEqual(t, { droit: 5000, cotisationEtudiant: 5000, cotisationTravailleur: 10000 });
});

test('un tarif saisi remplace le défaut (espaces tolérés)', () => {
  const t = tarifsDepuis({ droit_adhesion: '6 000', cotisation_etudiant: '2500' });
  assert.equal(t.droit, 6000);
  assert.equal(t.cotisationEtudiant, 2500);
});

test('élèves et étudiants ont le tarif étudiant, les autres profils celui des travailleurs', () => {
  for (const p of ['eleve', 'etudiant']) assert.equal(tarifDe(p), 'etudiant');
  for (const p of ['travailleur', 'enseignant', 'passionne', 'autre', null]) assert.equal(tarifDe(p), 'travailleur');
  assert.ok(estEtudes('eleve') && !estEtudes('travailleur') && !estEtudes(null));
});

test('le total à payer additionne le droit et la cotisation du profil', () => {
  const t = tarifsDepuis({ cotisation_etudiant: '2000' });
  assert.equal(totalAPayer(t, 'travailleur'), 15000);
  assert.equal(totalAPayer(t, 'etudiant'), 7000);
});

test('francs sépare les milliers par une espace simple', () => {
  assert.equal(francs(15000), '15 000');
  assert.equal(francs(500), '500');
});

test('dureeTexte écrit les années et les mois', () => {
  assert.equal(dureeTexte(12), '1 an');
  assert.equal(dureeTexte(24), '2 ans');
  assert.equal(dureeTexte(6), '6 mois');
  assert.equal(dureeTexte(12, 'en'), '1 year');
  assert.equal(dureeTexte(36, 'en'), '3 years');
});

test('remplir laisse intacte une variable inconnue et ne réinterprète pas les valeurs', () => {
  assert.equal(remplir('Salut {nom} {inconnue}', { nom: 'Awa' }), 'Salut Awa {inconnue}');
  assert.equal(remplir('{nom}', { nom: '{cle}', cle: 'SECRET' }), '{cle}');
});

const base = { nom: 'Awa Kone', profil: 'travailleur', langue: 'fr', numero: 'AIA-2026-0007', cle: 'AIA-ABCD-EFGH-JKLM', lien: 'https://aia-ci.cloud/membre' };

test('le message de bienvenue contient prix, conditions, paiement, numéro, clé et lien', () => {
  const m = messageBienvenue(base, { paiement_modes: 'Wave au 07 00 00 00 00' });
  for (const attendu of ['Awa Kone', '5 000 F', '10 000 F', '15 000 F', 'valable 1 an', 'Wave au 07 00 00 00 00', 'AIA-2026-0007', 'AIA-ABCD-EFGH-JKLM', 'https://aia-ci.cloud/membre'])
    assert.ok(m.includes(attendu), `manque : ${attendu}`);
  assert.ok(!/\{\w+\}/.test(m), 'variable non remplie dans le message');
});

test('le message d’un étudiant annonce son propre total', () => {
  const m = messageBienvenue({ ...base, profil: 'etudiant' }, { cotisation_etudiant: '2000' });
  assert.ok(m.includes('7 000 F') && m.includes('élèves et étudiants'));
});

test('le message anglais est entièrement en anglais', () => {
  const m = messageBienvenue({ ...base, langue: 'en' }, {});
  assert.ok(m.includes('PRICE') && m.includes('Joining fee') && m.includes('15 000 F'));
  assert.ok(!m.includes('Bonne nouvelle'));
});

test('sans clé en clair, le message le dit au lieu d’inventer une clé', () => {
  const m = messageBienvenue({ ...base, cle: null }, {});
  assert.ok(m.includes('régénère-la'));
});

test('un modèle et des conditions personnalisés sont respectés', () => {
  const m = messageBienvenue(base, { msg_bienvenue_fr: 'Coucou {nom} : {total} F. {conditions}', conditions_fr: 'Règle unique ({duree}).' });
  assert.equal(m, 'Coucou Awa Kone : 15 000 F. Règle unique (1 an).');
});

test('les textes par défaut utilisent seulement des variables connues', () => {
  const connues = new Set(['nom', 'numero', 'cle', 'droit', 'cotisation', 'profil_tarif', 'total', 'duree', 'conditions', 'paiement', 'lien']);
  for (const t of [MSG_BIENVENUE_DEFAUT.fr, MSG_BIENVENUE_DEFAUT.en, CONDITIONS_DEFAUT.fr, CONDITIONS_DEFAUT.en])
    for (const [, v] of t.matchAll(/\{(\w+)\}/g)) assert.ok(connues.has(v), `variable inconnue : ${v}`);
});
