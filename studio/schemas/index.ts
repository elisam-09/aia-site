import { evenement } from './evenement';
import { actualite } from './actualite';
import { photoGalerie } from './photoGalerie';
import { produit } from './produit';
import { partenaire } from './partenaire';
import { membre } from './membre';
import { texteBilingue, blocsBilingues } from './objets';

export const schemaTypes = [
  // Documents
  evenement,
  actualite,
  photoGalerie,
  produit,
  partenaire,
  membre,
  // Objets réutilisables
  texteBilingue,
  blocsBilingues,
];
