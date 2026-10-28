/**
 * Certificat d'adhésion en PDF (A4 paysage), modèle « Anneau de feu » : grand anneau d'éclipse à gauche
 * avec l'emblème de l'AIA dans le disque, barre verte, nom en orange, pastille du numéro de membre et
 * QR code de vérification. Généré à la demande ; rien n'est stocké.
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
const FOND = '#120A12', DISQUE = '#0a050b', ORANGE = '#F77F00', ORANGE_VIF = '#FF9A2E', VERT = '#009E60', CREME = '#F8F7F8', GRIS = '#bdb6bd', GRIS_FONCE = '#8f878f';

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

/** Réduit la taille de police jusqu'à ce que le texte tienne sur `largeur` points (ou atteigne `mini`). */
function ajuster(doc: PDFKit.PDFDocument, texte: string, depart: number, mini: number, largeur: number): number {
  let t = depart;
  while (t > mini && doc.fontSize(t).widthOfString(texte) > largeur) t -= 1;
  return t;
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

  // l'anneau : halo, anneau orange, disque sombre portant l'emblème
  const cx = 186, cy = 297;
  doc.lineWidth(50).strokeOpacity(0.18).strokeColor(ORANGE).circle(cx, cy, 235).stroke();
  doc.strokeOpacity(1).lineWidth(12).strokeColor(ORANGE_VIF).circle(cx, cy, 186).stroke();
  doc.circle(cx, cy, 171).fill(DISQUE);
  if (embleme) doc.image(embleme, cx - 112, cy - 112, { width: 224 });

  doc.rect(426, 59, 5, 477).fill(VERT);

  const X = 466, LARGEUR = L - 60 - X;
  doc.font('Helvetica');
  const tailleOrg = ajuster(doc, 'ASSOCIATION IVOIRIENNE D’ASTRONOMIE', 11, 7, LARGEUR - 70);
  doc.font('Helvetica').fontSize(tailleOrg).fillColor(ORANGE_VIF).text('ASSOCIATION IVOIRIENNE D’ASTRONOMIE', X, 98, { width: LARGEUR, characterSpacing: 2.2, lineBreak: false });
  doc.font('Helvetica-Bold').fontSize(42).fillColor(CREME).text('Certificat', X, 134, { lineBreak: false });
  doc.text('d’adhésion', X, 180, { lineBreak: false });

  doc.font('Helvetica').fontSize(14).fillColor(GRIS).text('Nous certifions que', X, 250, { lineBreak: false });
  doc.font('Helvetica-Bold');
  const taille = ajuster(doc, d.nom, 30, 15, LARGEUR);
  doc.fontSize(taille).fillColor(ORANGE_VIF).text(d.nom, X, 272, { width: LARGEUR, lineBreak: false });
  doc.font('Helvetica').fontSize(13).fillColor(CREME).text('est membre de l’Association Ivoirienne d’Astronomie', X, 316, { width: LARGEUR });
  doc.font('Helvetica-Bold').fontSize(13).fillColor(CREME).text(`du ${jourLong(d.du)} au ${jourLong(d.au)}`, X, 352, { width: LARGEUR });

  doc.roundedRect(X, 392, 246, 36, 18).fill(ORANGE);
  doc.font('Helvetica-Bold').fontSize(13.5).fillColor(FOND).text(`Membre n° ${d.numero}`, X, 403, { width: 246, align: 'center', lineBreak: false });
  doc.font('Helvetica').fontSize(10.5).fillColor(GRIS_FONCE).text(`Délivré à Abidjan, le ${jourLong(d.delivre)}`, X, 446, { lineBreak: false });

  doc.lineWidth(1).strokeColor(GRIS).moveTo(X, 524).lineTo(X + 176, 524).stroke();
  let y = 531;
  if (d.signataireNom) {
    doc.font('Helvetica-Bold').fontSize(11).fillColor(CREME).text(d.signataireNom, X, y, { width: 176, lineBreak: false });
    y += 15;
  }
  doc.font('Helvetica').fontSize(10.5).fillColor(GRIS).text(d.signataireTitre || 'Le Président', X, y, { width: 176, lineBreak: false });

  doc.image(qr, L - 36 - 84, 452, { width: 84 });
  const lien = d.urlVerification.replace(/^https?:[/][/]/, '');
  doc.font('Helvetica').fontSize(7).fillColor(GRIS_FONCE).text(`Vérifier : ${lien}`, L - 36 - 130, 540, { width: 176, align: 'center' });

  doc.end();
  return fin;
}
