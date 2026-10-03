// Références nommées : clients, partenaires et membres du Cercle Accelium.
//
// Règle absolue (arbitrage de Clément du 27/09/2026) : une entrée ne s'affiche
// sur le site (nom, logo, phrase, verbatim) que si `confirme === true` ET
// `refuse !== true`. `confirme` passe à true uniquement par Clément, après
// réception d'un accord écrit de l'entreprise (modèle d'email :
// docs/email-confirmation-references.md). Les entrées non confirmées ne doivent
// être ni rendues ni présentes dans le HTML : toujours passer par
// `referencesConfirmees()` ou `temoignagesAffichables()`.
//
// Sources (lecture seule, extraction Monday du 27/09/2026) :
// _extraction/monday-communication/ : clients-mis-en-avant.md,
// felicitations-v-claude.md, liste-clients.md, questionnaire-clients.md,
// newsletters.md, cercle-membres.md, liste-partenaires.md,
// liste-partenaires-connectes.md, partenaire-espace-accelium.md.
// Logos : public/logos/references/ (README-logos.md). Un logo absent = champ vide,
// jamais de chemin inventé.
//
// Verbatims : uniquement issus de la campagne de satisfaction de mai-juin 2025
// (questionnaire Monday 1816693203, puis réponses écrites à l'email de
// remerciement et de demande de recommandation ; détail des sources dans
// _run-v2/temoignages-sources.md). Jamais de verbatim d'Edeis ni de MEBOR (retours critiques). Arboriste du Sud a
// refusé toute publication : `refuse: true`, ne jamais l'afficher.
// Aucune donnée de contact de personne physique (email, téléphone) dans ce fichier.

export type TypeReference = "client" | "partenaire" | "cercle";

/** Valeur de la colonne « Accord contact pour publier » du tableau Monday Félicitations. */
export type AccordMonday = "Obtenu" | "En attente" | "Refusé" | "";

export type RegionSlug =
  | "nouvelle-aquitaine"
  | "auvergne-rhone-alpes"
  | "grand-est"
  | "hauts-de-france"
  | "occitanie"
  | "provence-alpes-cote-d-azur"
  | "bretagne"
  | "centre-val-de-loire"
  | "normandie"
  | "pays-de-la-loire"
  | "ile-de-france"
  | "bourgogne-franche-comte"
  | "corse";

export type Reference = {
  /** Identifiant stable (kebab-case), utilisé comme clé React et ancre. */
  id: string;
  nom: string;
  /** Type principal (section de la page où l'entrée apparaît en premier). */
  type: TypeReference;
  /** Autres rôles (ex. un membre du cercle qui est aussi partenaire équipementier). */
  typesSecondaires?: TypeReference[];
  /** Catégorie d'activité (scierie, distillerie, béton, emballage, équipementier, conseil, finance, santé…). */
  categorie: string;
  region?: RegionSlug;
  /** Site public officiel (vide si aucun trouvé). */
  site?: string;
  /** Chemin public du logo (sous /logos/references/), vide si aucun logo exploitable. */
  logo?: string;
  /** Logo blanc : à poser sur fond sombre. */
  logoFondSombre?: boolean;
  /** Pour le cercle : membre représentant l'entreprise (nom public tel que publié sur LinkedIn). */
  membre?: { nom: string; fonction: string };
  /** Clients : aide obtenue (intitulé du dispositif) et financeur. */
  dispositif?: string;
  financeur?: string;
  /** Une phrase factuelle issue du post LinkedIn, de la newsletter ou du portrait publié. */
  phrase: string;
  /** Verbatim du questionnaire de satisfaction (mai-juin 2025), texte exact. */
  verbatim?: string;
  /** Note de recommandation sur 10 (questionnaire de satisfaction). */
  note?: number;
  /** Date de la réponse au questionnaire (AAAA-MM-JJ). */
  dateNote?: string;
  accordMonday: AccordMonday;
  /** Où la matière a été trouvée (post, newsletter…), pour l'email de confirmation. */
  matiere: string[];
  /** Passe à true uniquement par Clément après accord écrit de l'entreprise. */
  confirme: boolean;
  /** Refus explicite de publication : ne jamais afficher, même si confirme passait à true. */
  refuse?: boolean;
};

const L = (chemin: string) => `/logos/references/${chemin}`;

export const references: Reference[] = [
  // ─────────────────────────── Clients ───────────────────────────
  {
    id: "scierie-gauthier",
    nom: "Scierie Gauthier",
    type: "client",
    categorie: "scierie",
    region: "centre-val-de-loire",
    site: "https://www.scierie-gauthier.fr/",
    logo: "",
    dispositif: "CAP Filières Forêt-Bois (5e génération)",
    financeur: "Région Centre-Val de Loire",
    phrase:
      "Scierie familiale depuis trois générations, elle s'est équipée d'une ligne de clouage de palettes et d'un empilage automatique avec le soutien de la Région Centre-Val de Loire.",
    note: 9,
    dateNote: "2025-05-15",
    accordMonday: "Obtenu",
    matiere: ["Post #SuccèsClient du 11/04/2025", "Newsletter de mars 2025", "Mise en relation par Aquitaine Électrique"],
    confirme: false,
  },
  {
    id: "distillerie-du-beaujolais",
    nom: "Distillerie du Beaujolais",
    type: "client",
    categorie: "distillerie",
    region: "auvergne-rhone-alpes",
    site: "",
    logo: "",
    dispositif: "Pack Relocalisation",
    financeur: "Région Auvergne-Rhône-Alpes",
    phrase:
      "Spécialiste de la valorisation des sous-produits vinicoles, elle augmente ses capacités de production et récupère sa chaleur avec le soutien de la Région Auvergne-Rhône-Alpes.",
    note: 10,
    dateNote: "2025-05-06",
    accordMonday: "Obtenu",
    matiere: ["Post #SuccèsClient du 17/03/2026", "Newsletter de février 2026"],
    confirme: false,
  },
  {
    id: "sbi-societe-de-beton-industriel",
    nom: "S.B.I. Société de Béton Industriel",
    type: "client",
    categorie: "béton",
    region: "grand-est",
    site: "https://www.societebetonindustriel.fr/",
    logo: L("clients/sbi-societe-de-beton-industriel.png"),
    logoFondSombre: true,
    dispositif: "Lutte contre les pressions des activités économiques industrielles (12e programme)",
    financeur: "Agence de l'eau Rhin-Meuse",
    phrase:
      "En supprimant le lavage des alluvions au profit de granulats locaux, S.B.I. élimine la consommation d'eau liée à ce lavage, avec le soutien de l'Agence de l'eau Rhin-Meuse.",
    accordMonday: "Obtenu",
    matiere: ["Post #SuccèsClient du 28/04/2026", "Newsletter d'avril 2026"],
    confirme: false,
  },
  {
    id: "cap-bois-pyrenees",
    nom: "Cap Bois Pyrénées",
    type: "client",
    categorie: "scierie",
    region: "occitanie",
    site: "",
    logo: "",
    dispositif: "AAP IPPB 2025 (Industrialisation performante des produits bois)",
    financeur: "ADEME",
    phrase:
      "Création d'une scierie solidaire qui valorise des résineux locaux sous-exploités et crée des emplois pour des personnes en situation de handicap, soutenue par l'ADEME.",
    accordMonday: "Obtenu",
    matiere: ["Post #SuccèsClient du 02/06/2026", "Newsletter de mai 2026"],
    confirme: false,
  },
  {
    id: "cure-emballages",
    nom: "Curé Emballages",
    type: "client",
    categorie: "emballage",
    region: "bourgogne-franche-comte",
    site: "https://cure-emballages.com/",
    logo: L("clients/cure-emballages.png"),
    dispositif: "AAP IPPB 2024 (Industrialisation performante des produits bois)",
    financeur: "ADEME",
    phrase:
      "Déjà engagée dans le reconditionnement des palettes, l'entreprise lance une production de palettes neuves intégrant du bois local et recyclé, avec le soutien de l'ADEME.",
    note: 9,
    dateNote: "2025-05-05",
    accordMonday: "Obtenu",
    matiere: ["Post #SuccèsClient du 07/07/2026", "Newsletter de juin 2026"],
    confirme: false,
  },
  {
    id: "vmc-bois",
    nom: "VMC Bois",
    type: "client",
    categorie: "exploitation forestière et bois énergie",
    region: "auvergne-rhone-alpes",
    site: "https://vmc-bois.fr/",
    logo: L("clients/vmc-bois.jpg"),
    dispositif: "FEADER « Investir dans mon entreprise forestière »",
    financeur: "Région Auvergne-Rhône-Alpes",
    phrase:
      "Acquisition d'un broyeur à plaquettes forestières pour produire localement du bois énergie, projet soutenu par la Région Auvergne-Rhône-Alpes au titre du FEADER.",
    accordMonday: "En attente",
    matiere: ["Post #SuccèsClient du 01/09/2026", "Newsletter d'août 2026"],
    confirme: false,
  },
  {
    id: "crozat-freres",
    nom: "Établissements Crozat Frères",
    type: "client",
    categorie: "scierie",
    region: "hauts-de-france",
    site: "https://www.scieriecrozat.fr/",
    logo: L("clients/crozat-freres.png"),
    dispositif: "Investissement Performance Industrielle ; AAP IPPB 2024 (aide ADEME obtenue)",
    financeur: "Région Hauts-de-France ; ADEME",
    phrase:
      "Entreprise familiale centenaire, la scierie modernise son outil avec une nouvelle ligne de production numérique, soutenue par la Région Hauts-de-France ; l'ADEME lui a aussi accordé une aide pour valoriser les bois dépérissants.",
    accordMonday: "Obtenu",
    matiere: ["Newsletter de juin 2025"],
    confirme: false,
  },
  {
    id: "charpentes-vallery",
    nom: "Charpentes Vallery",
    type: "client",
    categorie: "charpente et construction bois",
    region: "nouvelle-aquitaine",
    site: "https://vallery.fr/",
    logo: L("clients/charpentes-vallery.svg"),
    logoFondSombre: true,
    dispositif: "AAP IPPB 2024 (aide obtenue)",
    financeur: "ADEME",
    phrase:
      "Référence des charpentes en pin maritime, Vallery modernise son outil avec une ligne de montage automatisée et développe des ombrières photovoltaïques en bois des Landes.",
    note: 10,
    dateNote: "2025-05-15",
    accordMonday: "Obtenu",
    matiere: ["Newsletter d'août 2025"],
    confirme: false,
  },
  {
    id: "mokko-agencement",
    nom: "Mokko Agencement (Menuiserie Costil)",
    type: "client",
    categorie: "menuiserie et agencement",
    region: "normandie",
    site: "https://mokko-agencement.fr/",
    logo: L("clients/mokko-agencement.png"),
    dispositif: "Normandie Entreprises Industries, volet Industries de valorisation du bois (FEADER)",
    financeur: "Région Normandie et Union européenne (FEADER)",
    phrase:
      "Concepteur d'agencements sur mesure, l'atelier s'est équipé d'une scie à panneaux, d'un centre d'usinage et d'une plaqueuse de chants avec le soutien de la Région Normandie et de l'Union européenne.",
    note: 10,
    dateNote: "2025-05-21",
    accordMonday: "Obtenu",
    matiere: ["Newsletter d'octobre 2025"],
    confirme: false,
  },
  {
    id: "scierie-labrousse",
    nom: "Scierie Labrousse",
    type: "client",
    categorie: "scierie",
    region: "nouvelle-aquitaine",
    site: "https://www.scierielabrousse.fr/",
    logo: L("clients/scierie-labrousse.svg"),
    phrase:
      "PME familiale du massif des Landes de Gascogne, la scierie engage un projet de modernisation industrielle pour le bois de construction bas carbone en circuit court.",
    accordMonday: "Obtenu",
    matiere: ["Newsletter de janvier 2026"],
    confirme: false,
  },
  {
    id: "aquitaine-electrique",
    nom: "Aquitaine Électrique",
    type: "client",
    typesSecondaires: ["partenaire"],
    categorie: "équipementier (lignes de sciage)",
    region: "nouvelle-aquitaine",
    site: "https://aquitaine-electrique.com/",
    logo: L("clients/aquitaine-electrique.png"),
    dispositif: "Aide aux investissements performance industrielle",
    financeur: "Région Nouvelle-Aquitaine",
    phrase:
      "Depuis trente ans, Aquitaine Électrique conçoit, fabrique et monte des lignes de sciage sur mesure ; elle a créé un atelier d'essai de lignes de sciage à taille réelle.",
    note: 10,
    dateNote: "2025-05-19",
    accordMonday: "Obtenu",
    matiere: ["Newsletter de mai 2025 (30 ans)", "Apporteur de trois scieries (mises en relation)"],
    confirme: false,
  },
  {
    id: "technicant",
    nom: "Technicant",
    type: "client",
    categorie: "ingénierie (machines de sciage)",
    region: "nouvelle-aquitaine",
    site: "",
    logo: "",
    dispositif: "Soutien aux projets innovants",
    financeur: "Région Nouvelle-Aquitaine",
    phrase:
      "Conception de lignes de sciage innovantes, dont une ligne adaptée aux bois de petits diamètres, et de moteurs plus sobres en énergie, soutenue par la Région Nouvelle-Aquitaine.",
    accordMonday: "",
    matiere: ["Tableau Félicitations (convention RDI)"],
    confirme: false,
  },
  {
    id: "termovia",
    nom: "Termovia",
    type: "client",
    categorie: "deeptech biomasse (biochar)",
    region: "grand-est",
    site: "https://www.termovia.eu/",
    logo: L("clients/termovia.png"),
    dispositif: "Grand Est Start-Up : aide aux premiers développements",
    financeur: "Région Grand Est",
    phrase:
      "Start-up spécialisée dans la pyrolyse et la pyro-distillation de biomasse, Termovia conçoit des équipements pour produire du biochar.",
    accordMonday: "Obtenu",
    matiere: ["Newsletter de février 2025", "Conférence Bio360"],
    confirme: false,
  },
  {
    id: "fraktion",
    nom: "Fraktion",
    type: "client",
    categorie: "fintech",
    region: "ile-de-france",
    site: "https://www.fraktion.finance/",
    logo: L("clients/fraktion.svg"),
    phrase:
      "Fraktion propose une plateforme qui permet aux acteurs professionnels de tokeniser leurs actifs et de les proposer directement à des investisseurs.",
    note: 10,
    dateNote: "2025-06-02",
    accordMonday: "Obtenu",
    matiere: ["Newsletter d'avril 2025"],
    confirme: false,
  },
  {
    id: "breizh-bell",
    nom: "Breizh Bell",
    type: "client",
    categorie: "myciculture",
    region: "bretagne",
    site: "https://breizh-bell.bzh",
    logo: "",
    phrase:
      "Entreprise bretonne de myciculture écologique, Breizh Bell cultive des champignons comestibles et médicinaux sur des substrats issus de biodéchets locaux.",
    note: 10,
    dateNote: "2025-05-06",
    accordMonday: "Obtenu",
    matiere: ["Newsletter de juillet 2025", "Questionnaire de satisfaction 2025"],
    confirme: false,
  },
  {
    id: "jaqu-auto",
    nom: "Jaqu'Auto",
    type: "client",
    categorie: "recyclage automobile",
    region: "bourgogne-franche-comte",
    site: "https://www.jaquauto.com/fr/",
    logo: L("clients/jaqu-auto.svg"),
    phrase:
      "Entreprise familiale fondée en 1976, acteur du recyclage automobile, Jaqu'Auto modernise ses installations pour optimiser le tri et accroître le réemploi.",
    note: 10,
    dateNote: "2025-05-06",
    accordMonday: "Obtenu",
    matiere: ["Newsletter de septembre 2025", "Questionnaire de satisfaction 2025"],
    confirme: false,
  },
  {
    id: "edeis-ports-saint-malo-cancale",
    nom: "Edeis, Ports de Saint-Malo et Cancale",
    type: "client",
    typesSecondaires: ["partenaire"],
    categorie: "infrastructures portuaires",
    region: "bretagne",
    site: "https://www.edeis.com/",
    logo: L("clients/edeis.png"),
    dispositif: "Lutte contre les pressions des activités économiques (eaux de carénage)",
    financeur: "Agence de l'eau Loire-Bretagne",
    phrase:
      "Gestionnaire d'infrastructures portuaires, Edeis a mis aux normes le traitement des eaux de carénage d'un port breton avec l'Agence de l'eau Loire-Bretagne.",
    // Pas de verbatim ni de note publiés (arbitrage du plan V2, §5.6.1 et §5.6.3).
    accordMonday: "",
    matiere: ["Tableau Félicitations (convention Agence de l'eau)", "Partenaire connecté (mises en relation)"],
    confirme: false,
  },
  {
    id: "linfini",
    nom: "Linfini",
    type: "client",
    categorie: "filature et textile biosourcé",
    region: "bretagne",
    site: "",
    logo: "",
    dispositif: "INNO R&D ; Résilience et Capacités Agroalimentaires 2030 ; Fonds Vert friches",
    financeur: "Région Bretagne ; Bpifrance ; État",
    phrase:
      "Linfini crée une filature de lin et développe un filet de conditionnement pour légumes fabriqué à partir de lin breton.",
    accordMonday: "",
    matiere: ["Tableau Félicitations (conventions Région Bretagne et Bpifrance)"],
    confirme: false,
  },
  {
    id: "scierie-mourlan",
    nom: "Scierie Mourlan (Groupe Enviris)",
    type: "client",
    categorie: "scierie",
    region: "nouvelle-aquitaine",
    site: "https://mourlan.com/",
    logo: L("clients/scierie-mourlan.svg"),
    logoFondSombre: true,
    dispositif: "Aide aux investissements performance industrielle",
    financeur: "Région Nouvelle-Aquitaine",
    phrase:
      "La scierie a investi dans une ligne dédiée aux petits bois et dans la modernisation de son outil industriel avec le soutien de la Région Nouvelle-Aquitaine.",
    note: 10,
    dateNote: "2025-05-15",
    accordMonday: "",
    matiere: ["Tableau Félicitations", "Mise en relation par Aquitaine Électrique"],
    confirme: false,
  },
  {
    id: "planete-terre-hauts-de-france",
    nom: "Planète Terre Hauts-de-France",
    type: "client",
    categorie: "bois énergie (bois bûche)",
    region: "hauts-de-france",
    site: "",
    logo: "",
    dispositif: "Aide au développement des PME (PME+) ; LEADER (FEADER) ; FRATRI (REV3)",
    financeur: "Région Hauts-de-France et Europe (FEADER, GAL Baie de Somme 3 Vallées)",
    phrase:
      "Développement des capacités de production de bois bûche avec la Région Hauts-de-France et le programme européen LEADER, puis création d'une ligne de granulés bois en circuit court soutenue par la Région.",
    accordMonday: "",
    matiere: ["Tableau Félicitations (conventions Région et LEADER)"],
    confirme: false,
  },
  {
    id: "agriopale",
    nom: "Agriopale",
    type: "client",
    categorie: "bois énergie",
    region: "hauts-de-france",
    site: "https://www.agriopale.fr/",
    logo: L("clients/agriopale.png"),
    dispositif: "Aide à l'investissement des PME",
    financeur: "Région Hauts-de-France",
    phrase: "Acteur du bois énergie en Hauts-de-France, accompagné sur ses investissements de production.",
    accordMonday: "",
    matiere: ["Tableau Félicitations (ligne sans détail)"],
    confirme: false,
  },
  {
    id: "an-c",
    nom: "AN-C",
    type: "client",
    categorie: "assainissement et gestion de l'eau",
    region: "bretagne",
    site: "",
    logo: "",
    phrase: "Concepteur d'équipements d'assainissement non collectif et de valorisation des eaux pluviales.",
    note: 8,
    dateNote: "2025-05-06",
    accordMonday: "",
    matiere: ["Tableau Félicitations (ligne sans détail)", "Questionnaire de satisfaction 2025"],
    confirme: false,
  },
  {
    id: "charier",
    nom: "Charier",
    type: "client",
    categorie: "travaux publics et enrobés",
    region: "pays-de-la-loire",
    site: "https://www.charier.fr/",
    logo: L("clients/charier.png"),
    logoFondSombre: true,
    dispositif: "France 2030 régionalisé, Projet d'innovation",
    financeur: "État et Région Pays de la Loire (opéré par Bpifrance)",
    phrase:
      "Entreprise de travaux publics soutenue par l'État et la Région Pays de la Loire, dans le cadre de France 2030, pour un projet de décarbonation de ses enrobés bitumineux.",
    accordMonday: "",
    matiere: ["Tableau Félicitations (ligne sans détail)"],
    confirme: false,
  },
  {
    id: "human-ocean",
    nom: "Human Ocean",
    type: "client",
    categorie: "cosmétique et filière marine",
    region: "bretagne",
    site: "",
    logo: "",
    dispositif: "France 2030, Alternatives vertes",
    financeur: "État (France 2030)",
    phrase: "Lauréate de France 2030 pour structurer une filière d'excellence de la cosmétique marine.",
    verbatim: "Nous sommes toujours clients, nous n'hésiterons pas à solliciter Accelium Conseil le moment venu.",
    note: 10,
    dateNote: "2025-05-21",
    accordMonday: "",
    matiere: ["Questionnaire de satisfaction 2025"],
    confirme: false,
  },
  {
    id: "arboriste-du-sud",
    nom: "Arboriste du Sud",
    type: "client",
    categorie: "bois énergie",
    region: "provence-alpes-cote-d-azur",
    site: "",
    logo: "",
    phrase: "",
    accordMonday: "Refusé",
    matiere: ["Post #SuccèsClient non publié : accord refusé par le client"],
    confirme: false,
    refuse: true,
  },

  // ─────────────────────────── Cercle Accelium ───────────────────────────
  {
    id: "ampatia",
    nom: "AMPATIA",
    type: "cercle",
    categorie: "psychologie du travail et santé",
    site: "",
    logo: "",
    membre: { nom: "Alexandre Popiolek", fonction: "Psychologue du travail, doctorant en psychologie sociale, fondateur" },
    phrase:
      "Accompagne les organisations dans leurs transformations en travaillant sur les enjeux humains, en s'appuyant sur la psychologie sociale et des données scientifiques robustes.",
    accordMonday: "",
    matiere: ["Portrait LinkedIn n° 1 (10/02/2026)", "Newsletter de février 2026"],
    confirme: false,
  },
  {
    id: "dxsigner",
    nom: "Dxsigner",
    type: "cercle",
    categorie: "design régénératif et économie circulaire",
    region: "bretagne",
    site: "https://dxsigner.com/",
    logo: L("cercle/dxsigner.png"),
    membre: { nom: "Brendan Tangi", fonction: "Fondateur et CEO" },
    phrase:
      "Aide les entreprises à transformer les contraintes écologiques en opportunités, grâce à des méthodes de design régénératif et circulaire.",
    accordMonday: "",
    matiere: ["Portrait LinkedIn n° 2 (10/03/2026)", "Newsletter de mars 2026"],
    confirme: false,
  },
  {
    id: "scenent",
    nom: "Scenent",
    type: "cercle",
    categorie: "stratégie et management de l'innovation",
    region: "ile-de-france",
    site: "https://www.auriach.net/",
    logo: "",
    membre: { nom: "Christian Auriach", fonction: "Consultant et coach en management de l'innovation, fondateur" },
    phrase:
      "Accompagne les entreprises dans la structuration et le déploiement de leur stratégie d'innovation ; enseigne à l'ESCP et au CELSA Sorbonne.",
    accordMonday: "",
    matiere: ["Portrait LinkedIn n° 3 (14/04/2026)", "Newsletter d'avril 2026"],
    confirme: false,
  },
  {
    id: "l-eclaircie-communication",
    nom: "L'Éclaircie Communication",
    type: "cercle",
    categorie: "communication (filière forêt-bois)",
    site: "https://eclaircie-communication.fr/",
    logo: L("cercle/l-eclaircie-communication.svg"),
    membre: { nom: "Delphine Gardin", fonction: "Ingénieure bois et communicante, fondatrice" },
    phrase:
      "Aide les acteurs de la filière forêt-bois à faire connaître leurs activités et leurs savoir-faire ; créatrice du podcast Du Pin sur la Planche.",
    accordMonday: "",
    matiere: ["Portrait LinkedIn n° 4 (12/05/2026)", "Newsletter de mai 2026", "Édito du livre blanc forêt-bois"],
    confirme: false,
  },
  {
    id: "lukeion-advisory",
    nom: "Lukeiōn Advisory",
    type: "cercle",
    categorie: "levée de fonds",
    region: "ile-de-france",
    site: "https://lukeion-advisory.com/",
    logo: "",
    membre: { nom: "Guillaume Mayot", fonction: "Fondateur" },
    phrase: "Cabinet spécialisé dans les levées de fonds des start-up et des entreprises en croissance.",
    accordMonday: "",
    matiere: ["Tableau Contacts du Cercle (pas de portrait publié)"],
    confirme: false,
  },
  {
    id: "stradal",
    nom: "Stradal",
    type: "cercle",
    typesSecondaires: ["partenaire"],
    categorie: "béton préfabriqué et gestion des eaux",
    region: "ile-de-france",
    site: "https://www.stradal.fr/",
    logo: L("partenaires/stradal.png"),
    membre: { nom: "Hugues Julien", fonction: "Chef de marché gestion des eaux" },
    phrase:
      "Accompagne les acteurs publics et privés sur la gestion des eaux pluviales et usées grâce à des solutions intégrées à des infrastructures en béton préfabriqué.",
    accordMonday: "",
    matiere: ["Portrait LinkedIn n° 5 (09/06/2026)", "Newsletter d'avril 2026"],
    confirme: false,
  },
  {
    id: "telos-sante",
    nom: "Telos Santé",
    type: "cercle",
    typesSecondaires: ["partenaire"],
    categorie: "innovation en santé",
    region: "grand-est",
    site: "https://telos-sante.fr/",
    logo: L("partenaires/telos-sante.png"),
    logoFondSombre: true,
    membre: { nom: "Julien Levavasseur", fonction: "Fondateur et CEO" },
    phrase:
      "Écosystème d'experts au service des projets d'innovation en santé : stratégie, structuration, formation et animation de réseaux.",
    accordMonday: "",
    matiere: ["Portrait LinkedIn n° 6 (14/07/2026)", "Newsletter de juillet 2026", "Partenaire connecté (mises en relation)"],
    confirme: false,
  },
  {
    id: "homag-france",
    nom: "HOMAG France",
    type: "cercle",
    typesSecondaires: ["partenaire"],
    categorie: "équipementier (machines pour l'industrie du bois)",
    region: "grand-est",
    site: "https://www.homag.com/fr",
    logo: L("partenaires/homag-france.svg"),
    membre: { nom: "Olivier Ulmann", fonction: "Ingénieur technico-commercial" },
    phrase:
      "Accompagne les fabricants de meubles et les menuiseries dans la modernisation de leurs outils de production : machines, logiciels et organisation des ateliers.",
    accordMonday: "",
    matiere: ["Portrait LinkedIn n° 10 (validé, publication prévue le 10/11/2026)", "Mises en relation (menuiseries)"],
    confirme: false,
  },
  {
    id: "magma-energy",
    nom: "MAGMA Energy",
    type: "cercle",
    categorie: "méthanisation et biogaz",
    region: "grand-est",
    site: "https://magma-energy.net/",
    logo: L("cercle/magma-energy.jpg"),
    membre: { nom: "Thierry Gahamanyi", fonction: "Fondateur et CEO" },
    phrase:
      "Première plateforme d'achat en ligne dédiée aux unités de méthanisation, au service de leur exploitation et de leur optimisation.",
    accordMonday: "",
    matiere: ["Portrait LinkedIn n° 9 (programmé le 13/10/2026)"],
    confirme: false,
  },
  {
    id: "unici-t",
    nom: "Unici'T",
    type: "cercle",
    categorie: "recrutement (executive search)",
    site: "",
    logo: "",
    membre: { nom: "Thomas Varinot", fonction: "Cofondateur et CEO" },
    phrase:
      "Recrute des profils stratégiques (cadres, scientifiques, ingénieurs, docteurs) pour les entreprises innovantes et leurs projets de R&D.",
    accordMonday: "",
    matiere: ["Portrait LinkedIn n° 7 (04/08/2026)", "Newsletter d'août 2026"],
    confirme: false,
  },
  {
    id: "cattinair",
    nom: "Cattinair",
    type: "cercle",
    typesSecondaires: ["partenaire"],
    categorie: "équipementier (aspiration industrielle)",
    region: "bourgogne-franche-comte",
    site: "https://www.cattinair.fr/",
    logo: L("partenaires/cattinair.png"),
    membre: { nom: "Marc Kupietzki", fonction: "Directeur commercial France et export" },
    phrase: "Spécialiste de l'aspiration industrielle pour le bois, la biomasse, l'agroalimentaire et l'économie circulaire.",
    accordMonday: "",
    matiere: ["Tableau Contacts du Cercle", "Réunions partenaires (2)"],
    confirme: false,
  },
  {
    id: "courtage-et-services",
    nom: "Courtage & Services",
    type: "cercle",
    categorie: "conception industrielle et courtage de matières",
    region: "bourgogne-franche-comte",
    site: "",
    logo: "",
    membre: { nom: "Yves Grosjean", fonction: "Consultant senior" },
    phrase:
      "Accompagne les filières de première transformation agricole et forestière en gestion de projets, innovation et valorisation de matières.",
    accordMonday: "",
    matiere: ["Portrait LinkedIn n° 8 (validé, 08/09/2026)"],
    confirme: false,
  },
  {
    id: "pgc-formation",
    nom: "PGC Formation",
    type: "cercle",
    categorie: "prévention des risques professionnels",
    site: "https://www.pgcformation.fr/",
    logo: L("cercle/pgc-formation.png"),
    membre: { nom: "Marleen De Haas", fonction: "Fondatrice et directrice" },
    phrase:
      "Accompagne entreprises et établissements dans la prévention des risques professionnels : PRAP, santé et sécurité au travail, ergonomie et TMS.",
    accordMonday: "",
    matiere: ["Post « nouveau membre » (à valider)"],
    confirme: false,
  },

  // ─────────────────── Partenaires équipementiers et experts ───────────────────
  {
    id: "promill",
    nom: "Promill",
    type: "partenaire",
    categorie: "équipementier (industrie agroalimentaire)",
    region: "centre-val-de-loire",
    site: "https://promill.fr/",
    logo: L("partenaires/promill.png"),
    logoFondSombre: true,
    phrase: "Fabricant d'équipements pour l'industrie agroalimentaire, partenaire équipementier d'Accelium.",
    accordMonday: "",
    matiere: ["Liste partenaires (équipement de production)", "Partenaire connecté"],
    confirme: false,
  },
  {
    id: "vbi-bois",
    nom: "VBI-BOIS",
    type: "partenaire",
    categorie: "équipementier (machines-outils bois)",
    region: "grand-est",
    site: "https://www.vbi-bois.fr/",
    logo: L("partenaires/vbi-bois.png"),
    phrase: "Distributeur de machines-outils pour le travail du bois, partenaire équipementier d'Accelium.",
    accordMonday: "",
    matiere: ["Liste partenaires (équipement de production)", "Partenaire connecté"],
    confirme: false,
  },
  {
    id: "steriflow",
    nom: "Steriflow",
    type: "partenaire",
    categorie: "équipementier (industrie agroalimentaire)",
    region: "auvergne-rhone-alpes",
    site: "https://www.steriflow.com/",
    logo: L("partenaires/steriflow.png"),
    phrase: "Fabricant de machines pour l'industrie agroalimentaire, partenaire équipementier d'Accelium.",
    accordMonday: "",
    matiere: ["Liste partenaires (équipement de production)", "Partenaire connecté"],
    confirme: false,
  },
  {
    id: "cetec-industrie",
    nom: "CETEC Industrie",
    type: "partenaire",
    categorie: "équipementier (emballage et conditionnement)",
    region: "nouvelle-aquitaine",
    site: "https://www.cetec.net/",
    logo: L("partenaires/cetec-industrie.png"),
    phrase: "Fabricant d'équipements d'ensachage, de palettisation et de conditionnement, partenaire équipementier d'Accelium.",
    accordMonday: "",
    matiere: ["Liste partenaires (équipement de production)"],
    confirme: false,
  },
  {
    id: "mebor",
    nom: "MEBOR (Scierie Au Pas de l'Arbre)",
    type: "partenaire",
    categorie: "équipementier (scieries)",
    site: "https://www.mebor.eu/",
    logo: L("partenaires/mebor.png"),
    // Autre logo disponible : partenaires/au-pas-de-l-arbre.png (distributeur).
    phrase: "Fabricant de scieries et d'équipements pour le bois, partenaire équipementier d'Accelium.",
    // Jamais de verbatim publié pour MEBOR (retour critique).
    accordMonday: "",
    matiere: ["Liste partenaires (équipement de production)", "Mises en relation (scieries)"],
    confirme: false,
  },
  {
    id: "mach-diffusion",
    nom: "MACH Diffusion",
    type: "partenaire",
    categorie: "équipementier (machines-outils)",
    region: "ile-de-france",
    site: "",
    logo: "",
    phrase: "Distributeur de machines-outils, partenaire équipementier d'Accelium.",
    accordMonday: "",
    matiere: ["Liste partenaires (équipement de production)"],
    confirme: false,
  },
  {
    id: "aa-biomasse",
    nom: "Aa-Biomasse",
    type: "partenaire",
    categorie: "équipementier (biomasse)",
    site: "https://www.aa-biomasse.com/fr",
    logo: L("partenaires/aa-biomasse.svg"),
    phrase: "Partenaire équipementier d'Accelium dans le domaine de la biomasse.",
    accordMonday: "",
    matiere: ["Liste partenaires (équipement de production)"],
    confirme: false,
  },
  {
    id: "carbon-stop",
    nom: "Carbon Stop",
    type: "partenaire",
    categorie: "équipementier",
    site: "https://www.carbon-stop.com/",
    logo: L("partenaires/carbon-stop.png"),
    phrase: "Partenaire équipementier d'Accelium (activité à préciser avec l'entreprise).",
    accordMonday: "",
    matiere: ["Liste partenaires (équipement de production)"],
    confirme: false,
  },
  {
    id: "3m-maison-machine-menuiserie",
    nom: "3M Maison Machine Menuiserie",
    type: "partenaire",
    categorie: "équipementier (machines de menuiserie)",
    site: "https://3m-machinesmenuiserie.fr/",
    logo: L("partenaires/3m-maison-machine-menuiserie.jpg"),
    phrase: "Spécialiste des machines de menuiserie, partenaire équipementier d'Accelium.",
    accordMonday: "",
    matiere: ["Liste partenaires (équipement de production)"],
    confirme: false,
  },
  {
    id: "atreelog",
    nom: "Atreelog",
    type: "partenaire",
    categorie: "équipementier (machines-outils)",
    region: "auvergne-rhone-alpes",
    site: "",
    logo: "",
    phrase: "Distributeur de machines-outils, partenaire équipementier d'Accelium.",
    accordMonday: "",
    matiere: ["Liste partenaires (équipement de production)"],
    confirme: false,
  },
  {
    id: "filpack",
    nom: "FILPACK",
    type: "partenaire",
    categorie: "ingénierie et études techniques",
    region: "centre-val-de-loire",
    site: "",
    logo: "",
    phrase: "Bureau d'ingénierie et d'études techniques, partenaire équipementier d'Accelium.",
    accordMonday: "",
    matiere: ["Liste partenaires (équipement de production)"],
    confirme: false,
  },
  {
    id: "aloes",
    nom: "Aloès",
    type: "partenaire",
    categorie: "équipementier",
    site: "",
    logo: "",
    phrase: "Partenaire équipementier d'Accelium (activité à préciser avec l'entreprise).",
    accordMonday: "",
    matiere: ["Liste partenaires (équipement de production)"],
    confirme: false,
  },
  {
    id: "andre-technologies",
    nom: "ANDRE Technologies",
    type: "partenaire",
    categorie: "équipementier",
    site: "https://andre-technologies.fr/",
    logo: L("partenaires/andre-technologies.png"),
    phrase: "Partenaire équipementier d'Accelium (activité à préciser avec l'entreprise).",
    accordMonday: "",
    matiere: ["Liste partenaires (équipement de production)"],
    confirme: false,
  },
  // Partenaires connectés à forte notoriété (§5.6.4).
  {
    id: "snbpe",
    nom: "SNBPE (Syndicat national du béton prêt à l'emploi)",
    type: "partenaire",
    categorie: "organisation professionnelle (béton)",
    site: "https://www.snbpe.org/",
    logo: L("partenaires/snbpe.svg"),
    phrase: "Organisation professionnelle du béton prêt à l'emploi, partenaire d'Accelium.",
    accordMonday: "",
    matiere: ["Partenaire connecté (réunion de partenariat)"],
    confirme: false,
  },
  {
    id: "eiffel-investment-group",
    nom: "Eiffel Investment Group",
    type: "partenaire",
    categorie: "finance et investissement",
    region: "ile-de-france",
    site: "",
    logo: "",
    phrase: "Société de gestion de fonds, partenaire d'Accelium sur le financement des projets.",
    accordMonday: "",
    matiere: ["Partenaire connecté (réunion de partenariat)"],
    confirme: false,
  },
  {
    id: "dynergie",
    nom: "Dynergie",
    type: "partenaire",
    categorie: "conseil",
    region: "auvergne-rhone-alpes",
    site: "https://www.dynergie.fr/",
    logo: "",
    phrase: "Cabinet de conseil aux entreprises, partenaire d'Accelium.",
    accordMonday: "",
    matiere: ["Fiche entreprise partenaire", "Mises en relation"],
    confirme: false,
  },
  {
    id: "ynergie",
    nom: "Ynergie",
    type: "partenaire",
    categorie: "ingénierie et études techniques",
    region: "occitanie",
    site: "https://www.ynergie.com/",
    logo: L("partenaires/ynergie.png"),
    logoFondSombre: true,
    phrase: "Groupe d'ingénierie et d'études techniques, partenaire d'Accelium.",
    accordMonday: "",
    matiere: ["Partenaire connecté"],
    confirme: false,
  },
  {
    id: "carbon-impact",
    nom: "Carbon Impact",
    type: "partenaire",
    categorie: "conseil",
    region: "centre-val-de-loire",
    site: "",
    logo: "",
    phrase: "Cabinet de conseil, partenaire d'Accelium.",
    accordMonday: "",
    matiere: ["Partenaire connecté"],
    confirme: false,
  },
];

/** Une référence est affichable si et seulement si Clément l'a confirmée et qu'aucun refus n'est enregistré. */
/**
 * Confirmations simulées (décision de Clément du 03/10/2026) : pour la recette,
 * toutes les références non refusées sont traitées comme confirmées, en attendant
 * les réponses aux emails de confirmation. Repasser à `false` avant toute mise en
 * production si une entreprise n'a pas donné son accord (docs/go-live.md), puis
 * ne passer `confirme: true` que sur les accords réellement reçus.
 */
export const CONFIRMATIONS_SIMULEES = true;

export function estAffichable(r: Pick<Reference, "confirme" | "refuse">): boolean {
  return (r.confirme === true || CONFIRMATIONS_SIMULEES) && !r.refuse;
}

/**
 * Références confirmées (et non refusées), filtrées par type si demandé.
 * Le filtre par type inclut les rôles secondaires (un membre du cercle
 * également partenaire apparaît dans les deux listes).
 */
export function referencesConfirmees(type?: TypeReference): Reference[] {
  return references.filter(
    (r) => estAffichable(r) && (!type || r.type === type || (r.typesSecondaires ?? []).includes(type))
  );
}

// ─────────────────────────── Témoignages (§5.6.3) ───────────────────────────

export type Temoignage = {
  id: string;
  /** id de l'entrée correspondante dans `references` (sert au test `confirme`). */
  referenceId: string;
  /** Version nommée : affichée seulement si la référence est confirmée. */
  auteurNomme: string;
  /** Version anonymisée : affichée sinon. */
  auteurAnonyme: string;
  secteur: string;
  region: RegionSlug;
  note: number;
  date: string;
  /** Citation exacte ; absente tant qu'aucun verbatim publiable n'existe. */
  citation?: string;
  /** Origine de la citation. */
  sourceCitation?: string;
  /** true : citation à faire valider par l'entreprise dans l'email de confirmation avant tout affichage. */
  citationAValider?: boolean;
};

export const methodeEnquete = "Enquête de satisfaction auprès de 18 clients, mai-juin 2025";

export const temoignages: Temoignage[] = [
  {
    id: "breizh-bell",
    referenceId: "breizh-bell",
    auteurNomme: "Breizh Bell, dirigeant",
    auteurAnonyme: "Dirigeant d'une entreprise de myciculture, Bretagne",
    secteur: "myciculture",
    region: "bretagne",
    note: 10,
    date: "2025-05-06",
    // Le questionnaire ne contient pas de remarque écrite pour Breizh Bell. La phrase
    // ci-dessous figure dans sa réponse écrite du 29/05/2025 à la demande de
    // recommandation (Monday, tableau Liste clients, et email). Citation validée par
    // Clément le 03/10/2026.
    citation:
      "J'indique à tous nos participants ou autres entreprises qui cherchent des chasseurs de subventions qu'Accelium est parfaite.",
    sourceCitation: "Réponse écrite à la demande de recommandation (Monday, Liste clients, 2025)",
    citationAValider: false,
  },
  {
    id: "human-ocean",
    referenceId: "human-ocean",
    auteurNomme: "Human Ocean, direction",
    auteurAnonyme: "Direction d'une entreprise de la cosmétique marine, Bretagne",
    secteur: "cosmétique marine",
    region: "bretagne",
    note: 10,
    date: "2025-05-21",
    citation: "Nous sommes toujours clients, nous n'hésiterons pas à solliciter Accelium Conseil le moment venu.",
    sourceCitation: "Questionnaire de satisfaction clients (mai-juin 2025)",
  },
  {
    id: "jaqu-auto",
    referenceId: "jaqu-auto",
    auteurNomme: "Jaqu'Auto, dirigeant",
    auteurAnonyme: "Dirigeant d'une entreprise de recyclage automobile, Bourgogne-Franche-Comté",
    secteur: "recyclage automobile",
    region: "bourgogne-franche-comte",
    note: 10,
    date: "2025-05-06",
    // Note de 10/10 sans remarque écrite dans le questionnaire. La phrase ci-dessous
    // est extraite de sa réponse écrite du 28/05/2025 à la demande de recommandation
    // (Monday, tableau Liste clients, et email) ; seul « En revanche » a été retiré en
    // tête. À faire valider par l'entreprise dans l'email de confirmation.
    citation:
      "Je garde ceci en tête si on me demande ce genre de compétences dans mon réseau et je peux vous aider si vous devez convaincre un prospect.",
    sourceCitation: "Réponse écrite à la demande de recommandation (Monday, Liste clients, 2025)",
    citationAValider: true,
  },
];

/** Témoignage prêt à l'affichage : nom seulement si la référence est confirmée. Sans citation validée, rien n'est rendu. */
export function temoignagesAffichables(): { temoignage: Temoignage; auteur: string; nomme: boolean }[] {
  return temoignages
    .filter((t) => {
      const ref = references.find((r) => r.id === t.referenceId);
      if (ref?.refuse) return false;
      if (!t.citation) return false;
      // Une citation « à valider » n'apparaît qu'une fois l'entreprise confirmée.
      if (t.citationAValider && !(ref && estAffichable(ref))) return false;
      return true;
    })
    .map((t) => {
      const ref = references.find((r) => r.id === t.referenceId);
      const nomme = !!ref && estAffichable(ref);
      return { temoignage: t, auteur: nomme ? t.auteurNomme : t.auteurAnonyme, nomme };
    });
}
