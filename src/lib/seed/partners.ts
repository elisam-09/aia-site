import type { Lang } from '../../i18n/ui';
import type { Localized, Partner } from '../types';
import { pick } from '../types';

interface SeedPartner {
  id: string;
  nom: string;
  sigle: string;
  description: Localized;
  site?: string;
}

export const PARTNERS: SeedPartner[] = [
  {
    id: 'uai',
    nom: 'Union Astronomique Internationale',
    sigle: 'UAI',
    description: {
      fr: "L'organisation mondiale des astronomes professionnels, qui parraine les campagnes de science citoyenne auxquelles l'AIA participe.",
      en: 'The world organisation of professional astronomers, sponsor of the citizen-science campaigns AIA takes part in.',
    },
    site: 'https://www.iau.org',
  },
  {
    id: 'nasa',
    nom: 'NASA — programmes de science citoyenne',
    sigle: 'NASA',
    description: {
      fr: "Les campagnes de recherche d'astéroïdes s'appuient sur des données et programmes soutenus par la NASA — dont sont issues nos six découvertes de 2022.",
      en: 'The asteroid search campaigns rely on NASA-supported data and programmes — the source of our six 2022 discoveries.',
    },
    site: 'https://science.nasa.gov/citizen-science/',
  },
  {
    id: 'iasc',
    nom: 'International Astronomical Search Collaboration',
    sigle: 'IASC',
    description: {
      fr: "Le programme qui fournit aux équipes du monde entier les images du télescope Pan-STARRS pour la détection d'astéroïdes.",
      en: 'The programme providing teams worldwide with Pan-STARRS telescope images for asteroid detection.',
    },
    site: 'https://iasc.cosmosearch.org',
  },
  {
    id: 'afas',
    nom: 'African Astronomical Society',
    sigle: 'AfAS',
    description: {
      fr: "La société savante qui fédère l'astronomie africaine et avec laquelle nous portons la voix de la Côte d'Ivoire.",
      en: 'The learned society federating African astronomy, through which we carry Côte d’Ivoire’s voice.',
    },
    site: 'https://www.africanastronomicalsociety.org',
  },
  {
    id: 'ufhb',
    nom: 'Université Félix Houphouët-Boigny — UFR SSMT',
    sigle: 'UFHB',
    description: {
      fr: "Notre berceau : l'AIA est née en 2021 à l'UFR Sciences des Structures de la Matière et Technologies, qui accueille nos conférences.",
      en: 'Our cradle: AIA was born in 2021 at the UFR SSMT (Matter Sciences and Technology), which hosts our lectures.',
    },
    site: 'https://www.univ-fhb.edu.ci',
  },
  {
    id: 'uranoscope',
    nom: 'Uranoscope de France',
    sigle: 'URANOSCOPE',
    description: {
      fr: 'Observatoire associatif français qui nous accompagne en formation et en partage de matériel et de pratiques.',
      en: 'French association observatory supporting us with training, equipment sharing and best practices.',
    },
    site: 'https://uranoscope.org',
  },
];

export function seedPartners(lang: Lang): Partner[] {
  return PARTNERS.map((pa) => ({
    id: pa.id,
    nom: pa.nom,
    sigle: pa.sigle,
    description: pick(pa.description, lang),
    site: pa.site,
  }));
}
