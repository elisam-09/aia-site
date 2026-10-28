/**
 * Certificat d'adhésion en PDF (A4 paysage), modèle « Nuit étoilée » : fond aubergine, double
 * bordure orange et verte, embleme de l'AIA, nom en orange et QR code de vérification.
 * Généré à la demande ; rien n'est stocké.
 */
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export interface DonneesCertificat {
  nom: string;
  numero: string;
  /** AAAA-MM-JJ */
  du: string;
  /** AAAA-MM-JJ */
  au: string;
  /** AAAA-MM-JJ : date de délivrance */
  delivre: string;
  urlVerification: string;
  signataireNom: string;
  signataireTitre: string;
}

const L = 842; // largeur A4 paysage en points
const H = 595;
const FOND = '#1a0f1b', ORANGE = '#F77F00', ORANGE_VIF = '#FF9A2E', VERT = '#009E60', CREME = '#F8F7F8', GRIS = '#bdb6bd', GRIS_FONCE = '#8f878f';

let logoCache: Buffer | null = null;
/** Emblème de l'AIA (version claire), réduit une fois pour toutes. */
async function logo(): Promise<Buffer | null> {
  if (logoCache) return logoCache;
  const fichier = ['public/logo-aia-blanc.png', 'dist/client/logo-aia-blanc.png', 'client/logo-aia-blanc.png'].map((f) => resolve(f)).find(existsSync);
  if (!fichier) return null;
  logoCache = await sharp(fichier).resize(360).png().toBuffer();
  return logoCache;
}

const jourLong = (j: string) => new Date(`${j}T00:00:00Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Étoiles fixes (même ciel sur tous les certificats), hors de la zone centrale du texte. */
function etoiles(): { x: number; y: number; r: number; o: number }[] {
  let s = 17;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const liste: { x: number; y: number; r: number; o: number }[] = [];
  while (liste.length < 46) {
    const x = 34 + rnd() * (L - 68), y = 34 + rnd() * (H - 68);
    if (y > 440 || (x > 150 && x < L - 150 && y > 130 && y < 420)) continue;
    liste.push({ x, y, r: 0.6 + rnd() * 1.3, o: 0.35 + rnd() * 0.6 });
  }
  return liste;
}

export async function genererCertificat(d: DonneesCertificat): Promise<Buffer> {
  const [embleme, qr] = await Promise.all([
    logo(),
    QRCode.toBuffer(d.urlVerification, { margin: 1, width: 360, color: { dark: '#120A12', light: CREME } }),
  ]);
  const doc = new PDFDocument({ size: [L, H], margin: 0, info: { Title: `Certificat d’adhésion ${d.numero}`, Author: 'Association Ivoirienne d’Astronomie', Subject: `Certificat d’adhésion de ${d.nom}` } });
  const morceaux: Buffer[] = [];
  doc.on('data', (c: Buffer) => morceaux.push(c));
  const fin = new Promise<Buffer>((ok) => doc.on('end', () => ok(Buffer.concat(morceaux))));

  doc.rect(0, 0, L, H).fill(FOND);
  for (const e of etoiles()) doc.fillOpacity(e.o).circle(e.x, e.y, e.r).fill('#ffffff');
  doc.fillOpacity(1);
  doc.lineWidth(2).strokeColor(ORANGE).rect(14, 14, L - 28, H - 28).stroke();
  doc.lineWidth(1).strokeColor(VERT).rect(24, 24, L - 48, H - 48).stroke();

  if (embleme) doc.image(embleme, (L - 92) / 2, 44, { width: 92 });
  doc.font('Helvetica').fontSize(11).fillColor(ORANGE_VIF).text('ASSOCIATION IVOIRIENNE D’ASTRONOMIE', 0, 152, { width: L, align: 'center', characterSpacing: 3 });
  doc.font('Helvetica-Bold').fontSize(38).fillColor(CREME).text('Certificat d’adhésion', 0, 176, { width: L, align: 'center' });
  doc.font('Helvetica').fontSize(13).fillColor(GRIS).text('Nous certifions que', 0, 238, { width: L, align: 'center' });

  // le nom rétrécit s'il est long, pour toujours tenir sur une ligne
  let taille = 32;
  doc.font('Helvetica-Bold');
  while (taille > 16 && doc.fontSize(taille).widthOfString(d.nom) > 600) taille -= 1;
  doc.fillColor(ORANGE_VIF).fontSize(taille).text(d.nom, 0, 262, { width: L, align: 'center' });
  doc.lineWidth(1.5).strokeColor(VERT).moveTo(211, 306).lineTo(L - 211, 306).stroke();

  doc.font('Helvetica').fontSize(14).fillColor(CREME).text('est membre de l’Association Ivoirienne d’Astronomie', 0, 322, { width: L, align: 'center' });
  doc.font('Helvetica-Bold').fontSize(14).fillColor(CREME).text(`du ${jourLong(d.du)} au ${jourLong(d.au)}`, 0, 344, { width: L, align: 'center' });

  doc.font('Helvetica').fontSize(12).fillColor(GRIS).text(`Membre n° ${d.numero}`, 58, 478, { lineBreak: false });
  doc.fontSize(10.5).fillColor(GRIS_FONCE).text(`Délivré à Abidjan, le ${jourLong(d.delivre)}`, 58, 496, { lineBreak: false });

  doc.lineWidth(1).strokeColor(GRIS).moveTo(321, 488).lineTo(521, 488).stroke();
  let y = 495;
  if (d.signataireNom) {
    doc.font('Helvetica-Bold').fontSize(11).fillColor(CREME).text(d.signataireNom, 321, y, { width: 200, align: 'center' });
    y += 15;
  }
  doc.font('Helvetica').fontSize(10.5).fillColor(GRIS).text(d.signataireTitre || 'Le Président', 321, y, { width: 200, align: 'center' });

  doc.image(qr, L - 58 - 84, 454, { width: 84 });
  const lien = d.urlVerification.replace(/^https?:[/][/]/, '');
  doc.font('Helvetica').fontSize(7).fillColor(GRIS_FONCE).text(`Vérifier : ${lien}`, L - 58 - 130, 543, { width: 176, align: 'center' });

  doc.end();
  return fin;
}
