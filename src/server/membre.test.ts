/** Tests de la clé d'accès, du numéro de membre et du code de vérification (npm test). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formaterNumero, genererCle, genererVerif, hashCle, normaliserCle } from './membre.ts';

test('la clé a le format AIA-XXXX-XXXX-XXXX sans caractère ambigu', () => {
  for (let i = 0; i < 200; i++) {
    const c = genererCle();
    assert.match(c, /^AIA-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/);
  }
});

test('mille clés générées sont toutes différentes', () => {
  const vues = new Set(Array.from({ length: 1000 }, () => genererCle()));
  assert.equal(vues.size, 1000);
});

test('normaliserCle accepte minuscules, espaces et tirets oubliés', () => {
  const c = genererCle();
  assert.equal(normaliserCle(c.toLowerCase()), c);
  assert.equal(normaliserCle(` ${c.replaceAll('-', ' ')} `), c);
  assert.equal(normaliserCle(c.replaceAll('-', '')), c);
});

test('normaliserCle refuse une saisie de mauvaise longueur', () => {
  assert.equal(normaliserCle(''), '');
  assert.equal(normaliserCle('AIA-ABCD-EFGH'), '');
  assert.equal(normaliserCle('AIA-ABCD-EFGH-JKLM-NPQR'), '');
});

test('hashCle est stable et ne contient pas la clé', () => {
  const c = genererCle();
  assert.equal(hashCle(c), hashCle(normaliserCle(c.toLowerCase())));
  assert.match(hashCle(c), /^[0-9a-f]{64}$/);
  assert.ok(!hashCle(c).includes(c));
  assert.notEqual(hashCle(c), hashCle(genererCle()));
});

test('formaterNumero complète à quatre chiffres', () => {
  assert.equal(formaterNumero(2026, 1), 'AIA-2026-0001');
  assert.equal(formaterNumero(2026, 42), 'AIA-2026-0042');
  assert.equal(formaterNumero(2027, 1234), 'AIA-2027-1234');
});

test('le code de vérification fait 8 caractères hexadécimaux', () => {
  assert.match(genererVerif(), /^[0-9a-f]{8}$/);
  assert.notEqual(genererVerif(), genererVerif());
});
