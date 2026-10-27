import type { Lang } from '../../i18n/ui';
import type { Block, Localized } from '../types';
import { h2, p, ul } from '../blocks';

interface SeedPost {
  slug: string;
  titre: Localized;
  date: string;
  extrait: Localized;
  auteur: string;
  image?: string;
  /** « AIA » pour nos articles, sinon le nom du média */
  origine: string;
  /** Sources : [libellé, url] */
  liens?: [string, string][];
  corps: Record<Lang, Block[]>;
}

const FB = 'https://www.facebook.com/Association.Ivoirienne.Astronomie';

/**
 * Articles réels : ceux de l'AIA et ceux que la presse a consacrés à l'association.
 * Contenu collecté et sourcé (voir le lien en fin d'article). Pour la presse, la date
 * est celle de parution ; quand seul le mois est connu, on retient le 1er du mois.
 */
const S_ASTROPAUSE: [string, string] = [
  "L'Astronomie Afrique",
  'https://lastronomieafrique.com/lastropause-de-lassociation-ivoirienne-dastronomie-aia-la-cote-divoire-et-le-defi-de-la-conquete-spatiale/',
];
const S_CAFE: [string, string] = [
  "L'Astronomie Afrique",
  'https://lastronomieafrique.com/lessentiel-du-cafe-des-savoir-de-lassociation-ivoirienne-dastronomie-il-ny-a-pas-de-planete-b/',
];
const S_ASTROTOUR: [string, string] = [
  "L'Astronomie Afrique",
  'https://lastronomieafrique.com/astro-tour-edition-ivoire-la-cote-d-ivoire-dans-les-etoiles/',
];
const S_KOACI: [string, string] = [
  'KOACI',
  'https://www.koaci.com/article/2024/02/19/cote-divoire/societe/cote-divoire-sensibilisation-des-eleves-a-travers-le-domaine-spatial-par-la-mise-en-place-des-clubs-dastronomie-au-sein-de-la-communaute-educative_175870.html',
];

export const POSTS: SeedPost[] = [
  {
    slug: 'campagne-asteroides-2026-premiers-resultats',
    titre: {
      fr: "Campagne d'astéroïdes 2026/2027 : premiers résultats",
      en: '2026/2027 asteroid campaign: first results',
    },
    date: '2026-10-05',
    extrait: {
      fr: 'Du 7 septembre au 2 octobre, élèves et bénévoles ont traqué les astéroïdes. Une découverte préliminaire vient du club du Lycée français Blaise Pascal.',
      en: 'From 7 September to 2 October, students and volunteers hunted asteroids. A preliminary discovery comes from the Lycée français Blaise Pascal club.',
    },
    auteur: "Le bureau de l'AIA",
    origine: 'AIA',
    liens: [['Facebook AIA', FB]],
    image: '/images/photos/orion.webp',
    corps: {
      fr: [
        p(
          "Du 7 septembre au 2 octobre 2026, la deuxième campagne de recherche d'astéroïdes de l'année scolaire 2026/2027 a mobilisé élèves et bénévoles, dans le cadre du Pan-African Citizen Science e-Laboratory. Ses résultats préliminaires viennent d'être publiés.",
        ),
        p(
          "L'AIA salue une découverte préliminaire d'astéroïde réalisée par le club d'astronomie du Lycée français Blaise Pascal d'Abidjan. Elle reste à confirmer, mais elle montre que la graine semée dans les clubs scolaires donne déjà des fruits.",
        ),
      ],
      en: [
        p(
          'From 7 September to 2 October 2026, the second asteroid search campaign of the 2026/2027 school year brought together students and volunteers, as part of the Pan-African Citizen Science e-Laboratory. Its preliminary results have just been published.',
        ),
        p(
          'AIA congratulates the astronomy club of the Lycée français Blaise Pascal in Abidjan on a preliminary asteroid discovery. It still has to be confirmed, but it shows that the seeds sown in school clubs are already bearing fruit.',
        ),
      ],
    },
  },
  {
    slug: 'six-asteroides-decouverts-depuis-abidjan',
    titre: {
      fr: 'Six astéroïdes découverts depuis Abidjan : retour sur la campagne 2022',
      en: 'Six asteroids discovered from Abidjan: looking back at the 2022 campaign',
    },
    date: '2026-06-10',
    extrait: {
      fr: "Comment une équipe de bénévoles ivoiriens a détecté six nouveaux astéroïdes dans le cadre des campagnes de l'UAI et de la NASA.",
      en: 'How a team of Ivorian volunteers detected six new asteroids as part of IAU and NASA campaigns.',
    },
    auteur: "Le bureau de l'AIA",
    origine: 'AIA',
    image: '/images/photos/orion.webp',
    corps: {
      fr: [
        p(
          "En 2022, l'AIA a participé pour la première fois à l'International Astronomical Search Collaboration (IASC), un programme de science citoyenne mené avec l'Union Astronomique Internationale et la NASA. Le principe : analyser des séries d'images du télescope Pan-STARRS, à Hawaï, pour y repérer des points lumineux en mouvement.",
        ),
        p(
          'Le soir, après les cours et le travail, nos membres se sont relayés devant ces images. Résultat : six astéroïdes inconnus repérés depuis Abidjan.',
        ),
        h2('Et maintenant ?'),
        ul([
          'Les découvertes suivent la procédure de confirmation orbitale du Minor Planet Center.',
          "Une fois confirmés, l'équipe pourra proposer un nom pour chaque astéroïde.",
          'Les campagnes reviennent chaque année et sont ouvertes aux membres : un ordinateur et de la rigueur suffisent, pas besoin de télescope personnel.',
        ]),
      ],
      en: [
        p(
          'In 2022, AIA took part for the first time in the International Astronomical Search Collaboration (IASC), a citizen-science programme run with the International Astronomical Union and NASA. The principle: analyse image sets from the Pan-STARRS telescope in Hawaii, looking for moving points of light.',
        ),
        p(
          'In the evenings, after classes and work, our members took turns in front of these images. The result: six unknown asteroids spotted from Abidjan.',
        ),
        h2('What happens next?'),
        ul([
          'The discoveries are going through the Minor Planet Center’s orbital confirmation process.',
          'Once confirmed, the team will be able to propose a name for each asteroid.',
          'Campaigns come back every year and are open to members: a computer and rigour are enough, no personal telescope needed.',
        ]),
      ],
    },
  },
  {
    slug: 'clubs-astronomie-lycees',
    titre: {
      fr: "L'AIA en tournée : des clubs d'astronomie naissent dans les lycées",
      en: 'AIA on tour: astronomy clubs are born in high schools',
    },
    date: '2026-04-22',
    extrait: {
      fr: "Planétarium mobile, ateliers fusées à eau et création de clubs : comment nos tournées scolaires sèment l'astronomie chez les plus jeunes.",
      en: 'Mobile planetarium, water-rocket workshops and new clubs: how our school tours plant astronomy in young minds.',
    },
    auteur: "Le bureau de l'AIA",
    origine: 'AIA',
    image: '/images/photos/blaise-pascal.webp',
    corps: {
      fr: [
        p(
          "L'AIA se déplace dans les établissements d'Abidjan et de l'intérieur du pays. Chaque visite suit le même rythme : une séance de planétarium mobile, un atelier pratique (dont des fusées à eau) et, si la météo le permet, une observation au télescope.",
        ),
        p(
          "Le but est de laisser derrière soi un club d'astronomie durable, animé par les élèves eux-mêmes. L'association prête du matériel, fournit des supports de cours et revient régulièrement. L'objectif n'est pas de former des astronomes, mais de montrer que les carrières scientifiques sont à portée de main.",
        ),
        p(
          'Les jeunes filles sont placées au premier rang, y compris aux commandes du télescope : les filières scientifiques ont besoin d’elles.',
        ),
        h2('Ton établissement est intéressé ?'),
        p(
          "Directions d'établissements, professeurs et parents : écrivez-nous via la page Contact pour préparer la prochaine année scolaire.",
        ),
      ],
      en: [
        p(
          'AIA travels to schools in Abidjan and across the country. Every visit follows the same rhythm: a mobile planetarium session, a hands-on workshop (water rockets included) and, weather permitting, a telescope observation.',
        ),
        p(
          'The goal is to leave behind a lasting astronomy club run by the students themselves. The association lends equipment, provides course materials and comes back regularly. The aim is not to train astronomers, but to show that scientific careers are within reach.',
        ),
        p('Girls are put in the front row, including at the telescope controls: science needs them.'),
        h2('Is your school interested?'),
        p(
          'Head teachers, teachers and parents: write to us via the Contact page to prepare the next school year.',
        ),
      ],
    },
  },
  {
    slug: 'astroedu-2025-astronomie-ivoirienne',
    titre: {
      fr: "AstroEdu 2025 : l'astronomie ivoirienne présentée à l'espace francophone",
      en: 'AstroEdu 2025: Ivorian astronomy presented to the French-speaking world',
    },
    date: '2026-04-01',
    extrait: {
      fr: "Au colloque « Astronomie pour l'éducation dans l'espace francophone », le Dr Marc Harris Yao a présenté les activités de l'AIA.",
      en: 'At the “Astronomy for education in the French-speaking world” conference, Dr Marc Harris Yao presented AIA’s activities.',
    },
    auteur: "L'Astronomie Afrique",
    origine: "L'Astronomie Afrique",
    liens: [["L'Astronomie Afrique", 'https://lastronomieafrique.com/constellations-africaines-expertise-et-engagement-a-astroedu-2025/']],
    image: '/images/photos/astropause-salle.webp',
    corps: {
      fr: [
        p(
          "Au troisième colloque « Astronomie pour l'éducation dans l'espace francophone », le Dr Marc Harris Yao Fortune, astrophysicien et enseignant-chercheur à l'UFHB, a présenté le développement de l'astronomie en Côte d'Ivoire.",
        ),
        p(
          "Il a détaillé les activités de l'AIA : observations publiques, clubs scolaires, campagnes de recherche d'astéroïdes avec des élèves et conférences scientifiques, ainsi que les projets pour renforcer les infrastructures de recherche. La rencontre réunissait des acteurs de Guinée, de Mauritanie, du Bénin, de Tunisie, d'Algérie et d'ailleurs.",
        ),
      ],
      en: [
        p(
          'At the third “Astronomy for education in the French-speaking world” conference, Dr Marc Harris Yao Fortune, astrophysicist and lecturer-researcher at UFHB, presented the development of astronomy in Côte d’Ivoire.',
        ),
        p(
          'He described AIA’s activities — public stargazing, school clubs, asteroid search campaigns with students and scientific lectures — as well as plans to strengthen research infrastructure. The meeting brought together people from Guinea, Mauritania, Benin, Tunisia, Algeria and beyond.',
        ),
      ],
    },
  },
  {
    slug: 'observatoire-agence-spatiale-ivoirienne',
    titre: {
      fr: 'Pourquoi la Côte d’Ivoire a besoin de son observatoire',
      en: 'Why Côte d’Ivoire needs its own observatory',
    },
    date: '2026-02-05',
    extrait: {
      fr: "Notre projet le plus ambitieux : un observatoire astronomique national, première pierre d'une future agence spatiale ivoirienne.",
      en: 'Our most ambitious project: a national astronomical observatory, the first stone of a future Ivorian space agency.',
    },
    auteur: "Le bureau de l'AIA",
    origine: 'AIA',
    image: '/images/photos/abidjan-nuit.webp',
    corps: {
      fr: [
        p(
          "L'Afrique de l'Ouest compte peu d'infrastructures d'astronomie. Pourtant, des observatoires modestes, bien placés et bien gérés produisent des données utiles : suivi d'astéroïdes, étude d'étoiles variables.",
        ),
        p(
          "C'est le sens de notre projet : un site permanent, équipé d'instruments de qualité, ouvert aux chercheurs, aux étudiants et au public. Un lieu où un lycéen ivoirien peut faire sa première vraie mesure scientifique.",
        ),
        h2("De l'observatoire à l'agence spatiale"),
        p(
          "Plus d'une quinzaine de pays africains ont déjà une agence ou un programme spatial, avec des retombées concrètes : données satellitaires pour l'agriculture, formation d'ingénieurs. Nous plaidons pour que la Côte d'Ivoire prenne sa place dans cette dynamique.",
        ),
        p('Institutions, mécènes, diaspora scientifique : ce chantier se construira ensemble. Parlons-en.'),
      ],
      en: [
        p(
          'West Africa has few astronomy facilities. Yet modest, well-located, well-run observatories produce useful data: asteroid follow-up, variable-star studies.',
        ),
        p(
          'That is the point of our project: a permanent site with quality instruments, open to researchers, students and the public. A place where an Ivorian high-schooler can make their first real scientific measurement.',
        ),
        h2('From observatory to space agency'),
        p(
          'More than fifteen African countries already have a space agency or programme, with concrete benefits: satellite data for agriculture, engineering training. We advocate for Côte d’Ivoire to take its place in this momentum.',
        ),
        p('Institutions, patrons, scientific diaspora: this will be built together. Let’s talk.'),
      ],
    },
  },
  {
    slug: 'sciences-spatiales-cote-divoire-ca-bouge',
    titre: {
      fr: "Les sciences spatiales en Côte d'Ivoire : ça bouge !",
      en: 'Space science in Côte d’Ivoire: things are moving!',
    },
    date: '2024-04-01',
    extrait: {
      fr: "Un tour d'horizon des sciences spatiales ivoiriennes, où l'AIA tient une place de choix.",
      en: 'An overview of Ivorian space science, in which AIA plays a leading role.',
    },
    auteur: "L'Astronomie Afrique",
    origine: "L'Astronomie Afrique",
    liens: [["L'Astronomie Afrique", 'https://lastronomieafrique.com/les-sciences-spatiales-en-cote-divoire-ca-bouge/']],
    image: '/images/photos/blaise-pascal.webp',
    corps: {
      fr: [
        p(
          "L'AIA y est présentée comme née au sein du Laboratoire de Physique de l'Atmosphère et de Mécanique des Fluides (LAPA-MF) de l'UFHB, avec des observations publiques régulières sur le campus de Cocody.",
        ),
        p(
          "L'article raconte les journées de l'espace du Lycée français Blaise Pascal, où les télescopes de l'AIA ont servi à une séance d'observation du ciel, dans le cadre du programme « Une école, un télescope » de l'ASPP-BGS. Il cite aussi l'Astro Tour Ivoire parmi les actions récentes de l'association.",
        ),
      ],
      en: [
        p(
          'AIA is presented as having been born within the Atmospheric Physics and Fluid Mechanics Laboratory (LAPA-MF) at UFHB, with regular public stargazing on the Cocody campus.',
        ),
        p(
          'The article recounts the space days at the Lycée français Blaise Pascal, where AIA’s telescopes were used for a sky-watching session as part of ASPP-BGS’s “One school, one telescope” programme. It also mentions the Astro Tour Ivoire among the association’s recent actions.',
        ),
      ],
    },
  },
  {
    slug: 'clubs-astronomie-sensibiliser-eleves-spatial',
    titre: {
      fr: "Des clubs d'astronomie pour sensibiliser les élèves au domaine spatial",
      en: 'Astronomy clubs to introduce students to space',
    },
    date: '2024-02-19',
    extrait: {
      fr: "Le Lycée Blaise Pascal inaugure son club d'astronomie ; cinq autres clubs sont annoncés dans le cadre de « Une école, un télescope ».",
      en: 'The Lycée Blaise Pascal opens its astronomy club; five more clubs are announced under “One school, one telescope”.',
    },
    auteur: 'KOACI',
    origine: 'KOACI',
    liens: [S_KOACI],
    image: '/images/photos/blaise-pascal.webp',
    corps: {
      fr: [
        p(
          "Le Lycée Blaise Pascal d'Abidjan a inauguré son club d'astronomie, grâce à un télescope offert par l'Association pour la Sauvegarde et la Promotion de la Pensée d'El-Hadj Boubacar Gamby-Sakho (ASPP-BGS). L'AIA a participé activement à la cérémonie.",
        ),
        p(
          "Les élèves ont observé le ciel, guidés par leur professeur de physique-chimie. L'annonce a aussi été faite de la remise de télescopes et de la création de cinq clubs d'astronomie en mars, dont trois dans des lycées d'excellence et un à Abobo, dans le cadre du programme « Une école, un télescope ».",
        ),
      ],
      en: [
        p(
          'The Lycée Blaise Pascal in Abidjan opened its astronomy club thanks to a telescope donated by the ASPP-BGS association. AIA took an active part in the ceremony.',
        ),
        p(
          'Students observed the sky, guided by their physics and chemistry teacher. Telescope donations and the creation of five astronomy clubs in March were also announced — three in elite high schools and one in Abobo — under the “One school, one telescope” programme.',
        ),
      ],
    },
  },
  {
    slug: 'astro-tour-edition-ivoire-bilan',
    titre: {
      fr: "Astro Tour, édition Ivoire : la Côte d'Ivoire dans les étoiles",
      en: 'Astro Tour, Ivory edition: Côte d’Ivoire among the stars',
    },
    date: '2024-01-01',
    extrait: {
      fr: "Bilan de la première édition de l'AstroTour, portée par l'AIA et SpaceBus France, du 27 novembre au 8 décembre 2023.",
      en: 'Review of the first AstroTour, led by AIA and SpaceBus France, from 27 November to 8 December 2023.',
    },
    auteur: "L'Astronomie Afrique",
    origine: "L'Astronomie Afrique",
    liens: [S_ASTROTOUR],
    image: '/images/photos/fb-1.webp',
    corps: {
      fr: [
        p(
          "Bilan de la première édition de l'AstroTour en Côte d'Ivoire, portée par l'AIA, présidée par le Dr Aziz Diaby, et SpaceBus France, présidée par Raphaël Peralta. Du 27 novembre au 8 décembre 2023, ateliers, formations, observations du ciel et conférences gratuits ont touché élèves, étudiants, enseignants et grand public.",
        ),
        p(
          "La tournée est passée par le groupe scolaire Le Miri, le lycée moderne de Bingerville, l'école internationale Jules Verne, le lycée international Jean-Mermoz, le lycée Félix Houphouët-Boigny de Korhogo et l'Université Félix Houphouët-Boigny. Le Dr Pancrace Aka a conçu une enquête sur les cosmogonies ivoiriennes, pour recenser les visions locales du ciel.",
        ),
        p(
          "Le soir du 8 décembre, le Dr Aziz Diaby était l'invité de l'émission « Le Grand Talk » sur Life TV pour expliquer les enjeux de la tournée et le rôle des sciences spatiales dans le développement du pays.",
        ),
      ],
      en: [
        p(
          'Review of the first AstroTour in Côte d’Ivoire, led by AIA, chaired by Dr Aziz Diaby, and SpaceBus France, chaired by Raphaël Peralta. From 27 November to 8 December 2023, free workshops, training, stargazing and lectures reached pupils, students, teachers and the general public.',
        ),
        p(
          'The tour visited Le Miri school group, the Bingerville modern high school, Jules Verne international school, Jean-Mermoz international high school, the Félix Houphouët-Boigny high school in Korhogo and Félix Houphouët-Boigny University. Dr Pancrace Aka designed a survey of Ivorian cosmogonies to record local views of the sky.',
        ),
        p(
          'On the evening of 8 December, Dr Aziz Diaby was the guest of “Le Grand Talk” on Life TV to explain the tour and the role of space science in the country’s development.',
        ),
      ],
    },
  },
  {
    slug: 'astrotour-astronomie-pour-toutes-cote-divoire',
    titre: {
      fr: "AstroTour : l'astronomie pour tou·te·s en Côte d'Ivoire",
      en: 'AstroTour: astronomy for everyone in Côte d’Ivoire',
    },
    date: '2023-11-27',
    extrait: {
      fr: "L'IRD annonce la tournée : quatre villes, neuf dates, quinze scientifiques ivoiriens et français.",
      en: 'IRD announces the tour: four cities, nine dates, fifteen Ivorian and French scientists.',
    },
    auteur: 'IRD',
    origine: 'IRD',
    liens: [['IRD', 'https://www.ird.fr/astrotour-lastronomie-pour-toutes-en-cote-divoire'], ['SpaceBus France', 'https://www.spacebusfrance.fr/astrotour-edition-ivoire']],
    image: '/images/photos/fb-1.webp',
    corps: {
      fr: [
        p(
          "Quatre villes, neuf dates et quatre volets : scolaire, formation des enseignants, grand public et recensement des cosmogonies. Une équipe de 15 scientifiques, dix Ivoiriens et cinq Français, venus de l'UFHB, du CNRS, du CEA et de l'IRD, parcourt le pays.",
        ),
        ul([
          'Abidjan : 27, 28 et 29 novembre',
          'Yamoussoukro : 1er et 2 décembre',
          'Korhogo : 4 et 5 décembre',
          'Bouaké : 7 et 8 décembre',
        ]),
        p(
          "Les objectifs : initier à la démarche scientifique et à l'esprit critique, montrer la diversité des métiers du spatial, susciter des vocations et promouvoir la place des femmes dans les sciences.",
        ),
      ],
      en: [
        p(
          'Four cities, nine dates and four strands: schools, teacher training, general public and a survey of cosmogonies. A team of 15 scientists — ten Ivorian and five French, from UFHB, CNRS, CEA and IRD — tours the country.',
        ),
        ul([
          'Abidjan: 27, 28 and 29 November',
          'Yamoussoukro: 1 and 2 December',
          'Korhogo: 4 and 5 December',
          'Bouaké: 7 and 8 December',
        ]),
        p(
          'The goals: introduce the scientific method and critical thinking, show the variety of space careers, spark vocations and promote women in science.',
        ),
      ],
    },
  },
  {
    slug: 'astropause-cote-divoire-conquete-spatiale',
    titre: {
      fr: "L'AstroPause de l'AIA : la Côte d'Ivoire et le défi de la conquête spatiale",
      en: 'AIA’s AstroPause: Côte d’Ivoire and the space challenge',
    },
    date: '2023-07-01',
    extrait: {
      fr: 'Compte rendu de la première AstroPause, le 18 mai 2023 au LASMES, devant une cinquantaine de participants.',
      en: 'Report on the first AstroPause, 18 May 2023 at LASMES, in front of some fifty participants.',
    },
    auteur: "L'Astronomie Afrique",
    origine: "L'Astronomie Afrique",
    liens: [S_ASTROPAUSE],
    image: '/images/photos/astropause-public.webp',
    corps: {
      fr: [
        p(
          "Compte rendu de la première AstroPause, le 18 mai 2023 au Laboratoire des Sciences de la Matière et de l'Énergie Solaire (LASMES) de l'UFHB, devant une cinquantaine de participants : universitaires, professionnels, étudiants et élèves.",
        ),
        ul([
          "Le Dr Marc Harris Yao a présenté l'AIA.",
          "Le Dr Pancrace Aka a donné une conférence sur l'agence spatiale ivoirienne : enjeux et défis.",
          "Le Dr Jean-Baptiste Ackah a parlé de communication par satellite et de la reconquête de l'espace.",
        ]),
        p(
          "Le contexte : quelques semaines plus tôt, lors de la conférence NewSpace Africa à Abidjan, le gouvernement avait annoncé la création d'une agence spatiale nationale et un premier nanosatellite, Yam-Sat CI 01.",
        ),
      ],
      en: [
        p(
          'Report on the first AstroPause, held on 18 May 2023 at UFHB’s LASMES laboratory, in front of some fifty participants: academics, professionals, students and pupils.',
        ),
        ul([
          'Dr Marc Harris Yao presented AIA.',
          'Dr Pancrace Aka gave a talk on the Ivorian space agency: stakes and challenges.',
          'Dr Jean-Baptiste Ackah spoke about satellite communication and the reconquest of space.',
        ]),
        p(
          'The context: a few weeks earlier, at the NewSpace Africa conference in Abidjan, the government had announced a national space agency and a first nanosatellite, Yam-Sat CI 01.',
        ),
      ],
    },
  },
  {
    slug: 'cafe-des-savoirs-pas-de-planete-b',
    titre: {
      fr: 'Café des Savoirs : « Il n’y a pas de planète B »',
      en: 'Café des Savoirs: “There is no planet B”',
    },
    date: '2023-04-01',
    extrait: {
      fr: "Le 26 janvier 2023, l'AIA était l'invitée spéciale du Café des Savoirs de l'Institut Français de Côte d'Ivoire.",
      en: 'On 26 January 2023, AIA was the special guest of the Institut Français de Côte d’Ivoire’s Café des Savoirs.',
    },
    auteur: "L'Astronomie Afrique",
    origine: "L'Astronomie Afrique",
    liens: [S_CAFE],
    image: '/placeholders/conference.svg',
    corps: {
      fr: [
        p(
          "Le 26 janvier 2023, l'AIA était l'invitée spéciale du Café des Savoirs de l'Institut Français de Côte d'Ivoire. Le Dr Aziz Diaby a présenté l'association, puis plusieurs voix se sont succédé.",
        ),
        ul([
          "Dr Marc Harris Yao : l'histoire de l'Univers, et pourquoi la Terre reste la seule planète habitée connue.",
          'Dr Pancrace Aka : les astéroïdes, entre curiosité scientifique et risque de collision.',
          "Dr David Baratoux, conseiller scientifique de l'AIA : une planète habitable a besoin d'eau liquide ; Mars a perdu l'essentiel de son atmosphère, il n'existe donc pas de solution de repli.",
          "Ahoua Stéphane, secrétaire à l'organisation : une « promenade dans l'espace » avec le logiciel Stellarium.",
        ]),
      ],
      en: [
        p(
          'On 26 January 2023, AIA was the special guest of the Institut Français de Côte d’Ivoire’s Café des Savoirs. Dr Aziz Diaby presented the association, followed by several speakers.',
        ),
        ul([
          'Dr Marc Harris Yao: the history of the Universe, and why Earth remains the only known inhabited planet.',
          'Dr Pancrace Aka: asteroids, between scientific curiosity and collision risk.',
          'Dr David Baratoux, AIA’s scientific adviser: a habitable planet needs liquid water; Mars has lost most of its atmosphere, so there is no fallback option.',
          'Ahoua Stéphane, organisation secretary: a “walk through space” with the Stellarium software.',
        ]),
      ],
    },
  },
  {
    slug: 'aziz-diaby-chercheur-physique-spatiale',
    titre: {
      fr: "Aziz Diaby, le chercheur en physique spatiale qui veut promouvoir l'astronomie en Côte d'Ivoire",
      en: 'Aziz Diaby, the space physicist who wants to promote astronomy in Côte d’Ivoire',
    },
    date: '2021-03-15',
    extrait: {
      fr: "Portrait du président fraîchement élu de l'AIA, spécialiste de l'ionosphère.",
      en: 'Portrait of AIA’s newly elected president, an ionosphere specialist.',
    },
    auteur: 'AfricaPSS',
    origine: 'AfricaPSS',
    liens: [['AfricaPSS', 'https://africapss.org/2021/03/15/aziz-diaby-le-chercheur-en-physique-spatiale-qui-veut-promouvoir-lastronomie-en-cote-divoire/'], ['Bouaké 360', 'https://bouake360.wordpress.com/2021/03/15/aziz-diaby-le-chercheur-en-physique-spatiale-qui-veut-promouvoir-lastronomie-en-cote-divoire/']],
    image: '/images/photos/p-diaby.webp',
    corps: {
      fr: [
        p(
          'Après le bac, il étudie au Sénégal (licence de physique-chimie, puis masters en physique pure et en physique nucléaire), revient en Côte d’Ivoire en 2012 et commence en 2015 un doctorat en physique spatiale, centré sur l’ionosphère. Il présente ses travaux en Italie, en Inde, aux États-Unis et à Chypre, et reçoit deux prix.',
        ),
        p(
          "Il explique avoir créé l'AIA face au désintérêt des jeunes pour les études scientifiques, faute d'infrastructures, de débouchés et de cours pratiques. Au programme : tournées dans les écoles, observations publiques de la Lune et des planètes, formations, conférences, et à terme un observatoire. Les cotisations doivent financer le matériel.",
        ),
      ],
      en: [
        p(
          'After his baccalaureate he studied in Senegal (a degree in physics and chemistry, then master’s degrees in pure and nuclear physics), returned to Côte d’Ivoire in 2012 and began a PhD in space physics focused on the ionosphere in 2015. He has presented his work in Italy, India, the United States and Cyprus, and received two awards.',
        ),
        p(
          'He explains that he founded AIA because young people were turning away from science, for lack of infrastructure, jobs and practical classes. The plan: school tours, public observations of the Moon and planets, training, lectures, and eventually an observatory. Membership fees are meant to fund equipment.',
        ),
      ],
    },
  },
];
