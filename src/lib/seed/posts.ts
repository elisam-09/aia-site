import type { Lang } from '../../i18n/ui';
import type { Block, Localized } from '../types';
import { h2, p, quote } from '../blocks';

interface SeedPost {
  slug: string;
  titre: Localized;
  date: string;
  extrait: Localized;
  auteur: string;
  image?: string;
  corps: Record<Lang, Block[]>;
}

export const POSTS: SeedPost[] = [
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
    image: '/placeholders/recherche.svg',
    corps: {
      fr: [
        p(
          "En 2022, l'AIA participait pour la première fois aux campagnes de l'International Astronomical Search Collaboration (IASC), un programme de science citoyenne mené avec l'Union Astronomique Internationale et la NASA. Le principe : analyser des séries d'images fournies par le télescope Pan-STARRS, à Hawaï, pour y repérer des points qui bougent.",
        ),
        p(
          "Pendant des semaines, nos membres se sont relayés le soir, après les cours et le travail, pour scruter ces images pixel par pixel. Résultat : six détections confirmées comme nouvelles — six astéroïdes que personne n'avait jamais catalogués, identifiés depuis Abidjan.",
        ),
        quote(
          'La première fois que la détection est revenue « provisoirement confirmée », toute la salle a crié. On venait de toucher le ciel du doigt.',
        ),
        h2('Et maintenant ?'),
        p(
          "Ces découvertes suivent désormais le long processus de confirmation orbitale du Minor Planet Center. À terme, l'équipe qui a détecté un astéroïde peut proposer son nom. Un morceau de Côte d'Ivoire finira peut-être par orbiter officiellement entre Mars et Jupiter.",
        ),
        p(
          "Les campagnes continuent chaque année, et elles sont ouvertes à tous nos membres — aucun télescope personnel n'est nécessaire, juste un ordinateur et de la rigueur. Envie d'y participer ? Rejoins-nous.",
        ),
      ],
      en: [
        p(
          'In 2022, AIA took part for the first time in the International Astronomical Search Collaboration (IASC) campaigns, a citizen-science programme run with the International Astronomical Union and NASA. The principle: analyse image sets from the Pan-STARRS telescope in Hawaii, looking for points that move.',
        ),
        p(
          'For weeks, our members took turns in the evening, after classes and work, scanning these images pixel by pixel. The result: six detections confirmed as new — six asteroids nobody had ever catalogued, identified from Abidjan.',
        ),
        quote(
          'The first time a detection came back “provisionally confirmed”, the whole room shouted. We had just touched the sky.',
        ),
        h2('What happens next?'),
        p(
          'These discoveries now follow the Minor Planet Center’s long orbital confirmation process. Eventually, the team that detected an asteroid may propose its name. A piece of Côte d’Ivoire may one day officially orbit between Mars and Jupiter.',
        ),
        p(
          'Campaigns continue every year and are open to all our members — no personal telescope needed, just a computer and rigour. Want in? Join us.',
        ),
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
    image: '/placeholders/ecole.svg',
    corps: {
      fr: [
        p(
          "Depuis sa création, l'AIA sillonne les établissements scolaires d'Abidjan et de l'intérieur du pays. Le format est rodé : une séance de planétarium, un atelier pratique, une observation au télescope quand la météo le permet — et surtout, la création d'un club d'astronomie pérenne dans l'établissement.",
        ),
        p(
          "Ces clubs sont animés par les élèves eux-mêmes, avec un parrainage de l'association : prêt de matériel, supports de cours, visites régulières. L'objectif n'est pas de former des astronomes à tout prix, mais de montrer que les carrières scientifiques sont à portée de main.",
        ),
        p(
          "Une attention particulière est portée aux jeunes filles : à chaque tournée, nous veillons à ce qu'elles soient au premier rang, aux commandes du télescope. Les filières scientifiques ont besoin d'elles.",
        ),
        h2('Ton établissement est intéressé ?'),
        p(
          "Nous préparons le calendrier de la prochaine année scolaire. Directions d'établissements, professeurs, parents d'élèves : écrivez-nous via la page Contact et nous viendrons avec les étoiles.",
        ),
      ],
      en: [
        p(
          'Since its creation, AIA has been touring schools in Abidjan and inland. The format is well-honed: a planetarium session, a hands-on workshop, telescope observation weather permitting — and above all, the creation of a lasting astronomy club in the school.',
        ),
        p(
          'These clubs are run by the students themselves, sponsored by the association: equipment loans, course materials, regular visits. The goal is not to force astronomers into existence, but to show that scientific careers are within reach.',
        ),
        p(
          'Special attention goes to girls: on every tour, we make sure they are in the front row, at the telescope controls. Science needs them.',
        ),
        h2('Is your school interested?'),
        p(
          'We are preparing next school year’s calendar. Head teachers, teachers, parents: write to us via the Contact page and we will come with the stars.',
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
      fr: "Notre projet le plus ambitieux : un observatoire astronomique national, première pierre d'une véritable agence spatiale ivoirienne.",
      en: 'Our most ambitious project: a national astronomical observatory, the first stone of a true Ivorian space agency.',
    },
    auteur: "Le bureau de l'AIA",
    image: '/placeholders/observation.svg',
    corps: {
      fr: [
        p(
          "L'Afrique de l'Ouest est une des régions du monde les moins couvertes en infrastructures astronomiques. Pourtant, la science n'a jamais été aussi accessible : des observatoires modestes, bien situés et bien gérés, produisent aujourd'hui de la donnée utile à la communauté internationale — suivi d'astéroïdes, occultations, étoiles variables.",
        ),
        p(
          "C'est le sens de notre projet d'observatoire : un site permanent, équipé d'instruments de qualité, ouvert à la fois aux chercheurs, aux étudiants et au public. Un lieu où un lycéen d'Abidjan peut faire sa première mesure scientifique réelle.",
        ),
        h2("De l'observatoire à l'agence spatiale"),
        p(
          "Le spatial n'est plus réservé aux grandes puissances : plus d'une quinzaine de pays africains ont déjà une agence ou un programme spatial. Données satellitaires pour l'agriculture, télédétection, formation d'ingénieurs : les retombées sont concrètes. Nous plaidons pour que la Côte d'Ivoire prenne sa place dans cette dynamique, et nous y travaillons, étape par étape.",
        ),
        p(
          'Institutions, mécènes, diaspora scientifique : ce chantier se construira ensemble. Parlons-en.',
        ),
      ],
      en: [
        p(
          'West Africa is one of the least covered regions in the world for astronomical infrastructure. Yet science has never been more accessible: modest, well-located, well-run observatories now produce data useful to the international community — asteroid follow-up, occultations, variable stars.',
        ),
        p(
          'That is the point of our observatory project: a permanent site with quality instruments, open to researchers, students and the public alike. A place where a high-schooler from Abidjan can make their first real scientific measurement.',
        ),
        h2('From observatory to space agency'),
        p(
          'Space is no longer reserved for major powers: more than fifteen African countries already have a space agency or programme. Satellite data for agriculture, remote sensing, engineering training: the benefits are concrete. We advocate for Côte d’Ivoire to take its place in this momentum — and we are working on it, step by step.',
        ),
        p('Institutions, patrons, scientific diaspora: this will be built together. Let’s talk.'),
      ],
    },
  },
];
