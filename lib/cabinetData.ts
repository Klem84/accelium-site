/* Contenu structuré des pages cabinet : source unique du corps de ces pages
   (les fichiers content/pages/cabinet-*.mdx ne portent que le frontmatter :
   h1, intro, seo). Sans tiret long. */

export type Principe = { titre: string; desc: string };

export const atouts: Principe[] = [
  {
    titre: "Une expertise complète, pas un produit unique",
    desc: "Subventions, prêts, crédits d'impôt : tous les leviers, tous les financeurs.",
  },
  {
    titre: "Un accompagnement jusqu'au bout",
    desc: "De l'obtention à la sécurisation, jusqu'au déblocage effectif des fonds.",
  },
  {
    titre: "Une double expertise rare",
    desc: "Financement public et fiscalité de la R&D, mais aussi conduite du changement.",
  },
  {
    titre: "Une connaissance sectorielle pointue",
    desc: "Vos filières, leurs financeurs, leurs calendriers.",
  },
  {
    titre: "L'alignement de nos intérêts",
    desc: "Nous ne recommandons que les dispositifs défendables ; nos intérêts sont alignés sur l'obtention effective de l'aide.",
  },
  {
    titre: "La rigueur, garante de votre sécurité",
    desc: "Des dossiers conçus pour résister à un contrôle.",
  },
];

export const deontologie: Principe[] = [
  {
    titre: "Devoir de conseil et transparence",
    desc: "Une information honnête sur l'éligibilité réelle, sans surpromesse.",
  },
  {
    titre: "Confidentialité",
    desc: "Vos informations sont strictement protégées (RGPD).",
  },
  {
    titre: "Indépendance",
    desc: "Nos recommandations servent votre intérêt, pas la vente d'un dispositif.",
  },
];

/* Ligne « Référencement CIR/CII du Médiateur des entreprises » : affichée
   uniquement si config/chiffres.ts renseigne referencementMediateur (sinon masquée). */
export const mediateurTitre = "Référencement CIR/CII du Médiateur des entreprises";

/* Profils d'expertise mis en avant pour l'équipe (depuis la fiche auteur). */
export const equipeExpertise = [
  "CIR / CII",
  "Subventions & France 2030",
  "Décarbonation industrielle",
  "Conduite du changement",
];

/* Typologies de partenaires recherchés. */
export const partenairesCibles = ["Expert-comptable", "Avocat", "Banquier", "Conseil en innovation"];

/* ─────────────────────────── L'équipe (§5.6.5) ───────────────────────────
   Biographies, photos et données du schéma Person : content/auteurs/<slug>.mdx
   (source unique par personne). Ici : l'ordre d'affichage seulement.
   Yanis Houachine et Candice Lemaître ne sont PAS publiés tant que Clément ne
   les a pas confirmés (plan §5.6.5). */
export const equipeMembres = ["clement-barbier", "alexia-crespo"];

/* ─────────────────────────── Partenaires et cercle (§5.6.4, §6.6) ─────────────────────────── */

export const cerclePrincipes: Principe[] = [
  {
    titre: "Un réseau d'experts de terrain",
    desc: "Des professionnels reconnus dans leur métier (équipement industriel, énergie, santé, conseil, communication, formation), proches des réalités de leurs clients.",
  },
  {
    titre: "La réciprocité",
    desc: "Chaque membre relaie l'information sur les aides publiques auprès de son réseau ; Accelium fait connaître l'expertise des membres auprès du sien.",
  },
  {
    titre: "Une mise en avant mensuelle",
    desc: "Chaque mois, un membre est présenté à la communauté d'Accelium à travers un portrait consacré à son métier et à ses projets.",
  },
  {
    titre: "Des points bimestriels",
    desc: "Tous les deux mois, les membres se retrouvent pour partager les dispositifs ouverts, les appels à projets à venir et les besoins repérés sur le terrain.",
  },
];

export const partenariatModalites: Principe[] = [
  {
    titre: "Apporteur d'affaires",
    desc: "Vous repérez chez un client un projet d'investissement, d'innovation ou de décarbonation : vous nous mettez en relation, nous étudions les financements mobilisables et vous tenons informé de la suite donnée, dans le respect de la confidentialité due au client.",
  },
  {
    titre: "Veille partagée",
    desc: "Nous partageons avec nos partenaires les ouvertures d'appels à projets et les évolutions de dispositifs qui concernent leurs clients ; ils nous font remonter les besoins et les calendriers de leur filière.",
  },
  {
    titre: "Interventions conjointes en salon",
    desc: "Présence commune sur les salons professionnels, conférences et tables rondes : le partenaire présente la solution technique, Accelium présente les financements qui la rendent possible.",
  },
];

/* Salons où Accelium est intervenu avec des partenaires (détail dans `evenements`). */
export const salonsPartenariat = [
  "Eurobois",
  "Carrefour International du Bois",
  "Bio360",
  "SEPEM Industries",
  "Pollutec",
];

/* ─────────────────────────── Événements (L7.5) ───────────────────────────
   Source : _extraction/monday-communication/posts-linkedin-evenements.md
   (tableau Monday « Événements », posts publiés). Aucun nom de tiers (client,
   partenaire, co-intervenant) n'est repris tant qu'il n'est pas confirmé dans
   config/references.ts. Un événement n'apparaît « à venir » que si sa date est
   confirmée dans la source. `date` : premier jour de présence d'Accelium
   (AAAA-MM-JJ) ; `dateFin` : dernier jour, si plusieurs. */

export type RoleEvenement = "Conférence" | "Table ronde" | "Exposant" | "Présence sur le salon";

export type Evenement = {
  id: string;
  nom: string;
  date: string;
  dateFin?: string;
  lieu: string;
  ville: string;
  role: RoleEvenement;
  /** Intervenants Accelium (slugs de content/auteurs). */
  intervenants?: string[];
  /** Titre exact de l'intervention (conférence ou table ronde). */
  intervention?: string[];
  theme: string;
};

export const evenements: Evenement[] = [
  {
    id: "cycleau-2024",
    nom: "Salon Cycl'eau",
    date: "2024-10-09",
    lieu: "CO'Met",
    ville: "Orléans",
    role: "Présence sur le salon",
    intervenants: ["clement-barbier"],
    theme:
      "Les financements publics des projets de traitement et de recyclage de l'eau, et de préservation des ressources et des milieux aquatiques.",
  },
  {
    id: "sepem-grenoble-2024",
    nom: "SEPEM Industries Centre-Est",
    date: "2024-11-19",
    lieu: "Alpexpo",
    ville: "Grenoble",
    role: "Présence sur le salon",
    intervenants: ["clement-barbier"],
    theme: "Le financement public des projets d'innovation industrielle.",
  },
  {
    id: "be50-mulhouse-2024",
    nom: "BE 5.0 Industries du Futur",
    date: "2024-11-26",
    lieu: "Parc Expo",
    ville: "Mulhouse",
    role: "Présence sur le salon",
    intervenants: ["clement-barbier"],
    theme: "Les aides publiques à l'industrie du futur et à la transition écologique des sites industriels.",
  },
  {
    id: "proxi-indus-2024",
    nom: "Salon Proxi Indus",
    date: "2024-12-04",
    lieu: "Parc des expositions et des congrès",
    ville: "Orléans",
    role: "Présence sur le salon",
    intervenants: ["clement-barbier"],
    theme: "L'identification des financements publics pour les projets industriels et innovants.",
  },
  {
    id: "bio360-2025",
    nom: "Bio360",
    date: "2025-02-05",
    lieu: "Parc des Expositions",
    ville: "Nantes",
    role: "Conférence",
    intervenants: ["clement-barbier", "alexia-crespo"],
    intervention: [
      "Financements publics : un levier essentiel pour la décarbonation de l'industrie",
      "Soutenir le biochar : le rôle clé des financements publics",
    ],
    theme:
      "Deux conférences au salon des bioénergies et de la bioéconomie : les aides de l'ADEME et des autres financeurs pour décarboner l'industrie, et les financements mobilisables pour structurer la filière biochar.",
  },
  {
    id: "global-industrie-2025",
    nom: "Global Industrie",
    date: "2025-03-11",
    lieu: "Eurexpo",
    ville: "Lyon",
    role: "Présence sur le salon",
    intervenants: ["clement-barbier"],
    theme:
      "Les dispositifs d'aide aux investissements industriels, à la transition écologique et aux projets d'innovation.",
  },
  {
    id: "lead-innovation-day-2025",
    nom: "Lead Innovation Day, EDHEC Business School",
    date: "2025-05-07",
    lieu: "EDHEC Business School",
    ville: "Paris",
    role: "Table ronde",
    intervenants: ["clement-barbier"],
    intervention: ["L'expertise sublimée par l'IA"],
    theme:
      "Comment l'intelligence artificielle transforme les méthodes de travail, et quels financements publics soutiennent les entreprises qui intègrent l'IA dans leurs projets d'innovation.",
  },
  {
    id: "santexpo-2025",
    nom: "SantExpo",
    date: "2025-05-22",
    lieu: "Paris Expo Porte de Versailles",
    ville: "Paris",
    role: "Présence sur le salon",
    intervenants: ["clement-barbier"],
    theme: "Les financements publics des projets d'innovation en santé.",
  },
  {
    id: "sepem-martigues-2025",
    nom: "SEPEM Industries Sud-Est",
    date: "2025-06-03",
    lieu: "La Halle de Martigues",
    ville: "Martigues",
    role: "Conférence",
    intervenants: ["clement-barbier"],
    intervention: ["Financements publics : un levier essentiel pour la décarbonation de l'industrie"],
    theme:
      "Comment les financements publics soutiennent la décarbonation de l'industrie et la transition énergétique des entreprises.",
  },
  {
    id: "pollutec-2025",
    nom: "Pollutec",
    date: "2025-10-07",
    lieu: "Eurexpo",
    ville: "Lyon",
    role: "Présence sur le salon",
    intervenants: ["clement-barbier"],
    theme:
      "Les aides publiques aux projets environnementaux (déchets, eau, énergie, air), avec des partenaires équipementiers présents sur le salon.",
  },
  {
    id: "eurobois-2026",
    nom: "Eurobois",
    date: "2026-02-03",
    dateFin: "2026-02-06",
    lieu: "Eurexpo",
    ville: "Lyon",
    role: "Exposant",
    intervenants: ["clement-barbier", "alexia-crespo"],
    theme:
      "Stand partagé avec un partenaire équipementier de la filière forêt-bois : financements de la modernisation des scieries, de l'acquisition d'équipements, de la valorisation des connexes et de l'efficacité énergétique.",
  },
  {
    id: "carrefour-international-du-bois-2026",
    nom: "Carrefour International du Bois",
    date: "2026-06-02",
    dateFin: "2026-06-03",
    lieu: "Parc des Expositions",
    ville: "Nantes",
    role: "Présence sur le salon",
    intervenants: ["clement-barbier"],
    theme:
      "Les financements publics des projets d'investissement, d'innovation et de transition de la filière bois, aux côtés d'un membre du cercle Accelium.",
  },
];

/* ─────────────────────────── Nous rejoindre ───────────────────────────
   Page sobre : aucune offre d'emploi ni aucun chiffre inventé. */
export const rejoindreRaisons: Principe[] = [
  {
    titre: "Des projets concrets",
    desc: "Décarbonation d'usines, modernisation de scieries, projets de R&D, innovation en santé : chaque dossier finance un projet réel, partout en France.",
  },
  {
    titre: "Une double culture",
    desc: "Finance et pilotage de projets d'un côté, recherche et industrie de l'autre : vous apprenez des deux, au contact direct des dirigeants et des équipes techniques.",
  },
  {
    titre: "Un cabinet à taille humaine",
    desc: "Des responsabilités réelles dès l'arrivée, un interlocuteur unique pour chaque client et une grande proximité avec la direction.",
  },
  {
    titre: "Une exigence partagée",
    desc: "Des dossiers défendables devant le financeur, une information honnête sur l'éligibilité, une rigueur qui sécurise les aides obtenues.",
  },
];

export const rejoindreProfils: Principe[] = [
  {
    titre: "Financement public",
    desc: "Vous savez lire un projet d'investissement, construire un plan de financement et rédiger un dossier clair pour un financeur public.",
  },
  {
    titre: "Profils scientifiques et techniques",
    desc: "Docteurs, ingénieurs, anciens responsables R&D : vous savez identifier ce qui relève de la recherche ou de l'innovation et le démontrer (CIR, CII, agrément).",
  },
  {
    titre: "Communication et développement",
    desc: "Vous aimez rendre clair un sujet technique, animer un réseau de partenaires et faire connaître le travail du cabinet.",
  },
];
