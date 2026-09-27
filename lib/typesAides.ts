/* Données structurées des 5 types d'aides : pilotent un rendu par blocs.
   Le texte (intitulés, descriptions) est volontairement sans tiret long. */

export type Section =
  | { kind: "cards"; titre: string; items: { titre: string; desc: string }[] }
  | { kind: "checklist"; titre: string; items: string[] }
  | { kind: "process"; titre: string; items: string[] }
  | { kind: "dispositifs"; titre: string; items: { code: string; nom: string; desc: string }[] }
  | { kind: "callout"; titre: string; text: string };

export type TypeAide = {
  slug: string;
  nom: string;
  iconKey: string;
  figure: { value: string; label: string };
  enBref: string[];
  definition: string;
  sections: Section[];
  role: string;
  roleCta?: { label: string; href: string };
};

export const typesAides: Record<string, TypeAide> = {
  subventions: {
    slug: "subventions",
    nom: "Subventions",
    iconKey: "gift",
    figure: { value: "25 à 70 %", label: "des dépenses éligibles, selon le projet et la taille de l'entreprise" },
    enBref: ["Non remboursable", "Versée par tranches", "Imposable, en haut de bilan"],
    definition:
      "La subvention est une aide financière non remboursable, accordée en soutien d'un projet : investissement, innovation, transition écologique, recrutement. C'est la forme d'aide la plus recherchée, donc la plus concurrentielle : tout se joue dans la qualité du dossier et le respect du calendrier.",
    sections: [
      {
        kind: "cards",
        titre: "Deux grandes natures",
        items: [
          {
            titre: "Subvention d'investissement",
            desc: "Elle finance des immobilisations (machines, bâtiment, terrain, équipement productif) ou l'activité de long terme. C'est la subvention la plus courante pour les projets industriels.",
          },
          {
            titre: "Subvention d'exploitation",
            desc: "Elle compense certaines charges ou l'insuffisance de certains produits. Exemple typique : une aide à l'embauche.",
          },
        ],
      },
      {
        kind: "checklist",
        titre: "Ce qu'il faut savoir avant de se lancer",
        items: [
          "Elle est imposable et s'inscrit en haut de bilan : elle renforce vos capitaux propres, un atout pour votre capacité d'emprunt future.",
          "Elle est versée en plusieurs fois (un acompte au démarrage, le solde sur factures acquittées) : il faut en porter la trésorerie pendant le projet.",
          "Elle se demande avant d'engager le projet : la moindre dépense engagée avant le dépôt sort de l'assiette éligible.",
          "Son intensité est plafonnée par le régime d'aide (RGEC, de minimis), couramment de 25 % à 70 % des dépenses selon le projet et la taille.",
        ],
      },
    ],
    role:
      "Une subvention se gagne sur dossier, face à d'autres candidats. Nous construisons un dossier qui parle au financeur (adéquation aux objectifs du dispositif, impacts économiques, sociaux et environnementaux, plan de financement crédible), puis nous sécurisons chaque versement jusqu'au solde.",
  },

  prets: {
    slug: "prets",
    nom: "Prêts & avances remboursables",
    iconKey: "refund",
    figure: { value: "0 %", label: "de taux, sans garantie et avec différé de remboursement" },
    enBref: ["À rembourser", "Sans garantie", "Ne dilue pas le capital"],
    definition:
      "Ce sont des financements à rembourser, mais à des conditions qu'aucune banque ne propose : taux bonifié ou nul, différé de remboursement, et surtout absence de garantie. Ils permettent de financer la croissance sans diluer le capital ni immobiliser de caution.",
    sections: [
      {
        kind: "cards",
        titre: "Trois outils, un même esprit",
        items: [
          {
            titre: "L'avance remboursable",
            desc: "Pour tous types de projets (matériel, R&D, développement). Aucune garantie, un différé de remboursement, un taux nul. Un vrai effet de trésorerie sur des montants significatifs, sans peser sur votre capacité d'emprunt bancaire.",
          },
          {
            titre: "L'avance conditionnée",
            desc: "Réservée à la R&D-innovation. Elle reprend tous les avantages de l'avance remboursable et y ajoute un filet : si le projet échoue techniquement, une partie peut être transformée en subvention. Vous partagez le risque avec le financeur.",
          },
          {
            titre: "Les prêts bonifiés",
            desc: "Opérés notamment par Bpifrance (prêts sans garantie, prêts verts, prêts à l'innovation), souvent avec les Régions. Ils complètent une dette bancaire classique et renforcent la structure financière du projet.",
          },
        ],
      },
    ],
    role:
      "Prêt, avance remboursable ou avance conditionnée : le bon outil dépend de la nature du projet, de votre situation financière et des cumuls visés. Nous arbitrons le montage le plus avantageux et l'articulons avec les subventions et crédits d'impôt mobilisables.",
  },

  garanties: {
    slug: "garanties",
    nom: "Garanties",
    iconKey: "shield",
    figure: { value: "Sans versement", label: "elle débloque le crédit plutôt que de verser de l'argent" },
    enBref: ["Sécurise un emprunt", "Pas de versement direct", "Compte dans vos plafonds"],
    definition:
      "La garantie publique est un appui qui couvre une partie du risque d'un emprunt bancaire. Elle ne vous verse pas d'argent directement : elle rassure la banque, débloque le crédit et améliore vos conditions de financement.",
    sections: [
      {
        kind: "process",
        titre: "Comment ça marche",
        items: [
          "Un organisme public (le plus souvent Bpifrance, avec les Régions via les Fonds Régionaux de Garantie) se porte garant d'une quote-part de votre prêt.",
          "Il couvre souvent une part majoritaire du risque.",
          "En cas de défaillance, il indemnise la banque à hauteur de cette quotité.",
        ],
      },
      {
        kind: "checklist",
        titre: "Ce qu'elle permet",
        items: [
          "Obtenir un crédit qu'une banque seule jugerait trop risqué (création, première implantation, innovation, transmission).",
          "Préserver vos cautions personnelles, en limitant les garanties demandées au dirigeant.",
          "Améliorer le montant, la durée et le taux du financement.",
        ],
      },
      {
        kind: "callout",
        titre: "Une aide à part entière",
        text:
          "Bien qu'elle ne se traduise pas par un versement, la garantie a une valeur économique réelle : la réglementation européenne la convertit en « équivalent-subvention brut » pour vérifier le respect des plafonds de cumul. Elle compte donc dans votre enveloppe globale d'aides.",
      },
    ],
    role:
      "La garantie se combine presque toujours avec d'autres leviers (prêt bonifié, subvention). Nous l'intégrons à votre stratégie de financement pour sécuriser le tour de table bancaire au bon moment du projet.",
  },

  exonerations: {
    slug: "exonerations",
    nom: "Exonérations",
    iconKey: "tag",
    figure: { value: "Durable", label: "un allègement reconduit tant que les conditions du statut sont remplies" },
    enBref: ["Allègement de charges", "Lié à un statut ou une zone", "Effet récurrent"],
    definition:
      "Les exonérations sont des allègements de charges, fiscales ou sociales, généralement liés à un statut ou à une implantation géographique. Contrairement à une subvention ponctuelle, elles produisent un effet durable et récurrent, année après année.",
    sections: [
      {
        kind: "cards",
        titre: "Deux familles",
        items: [
          {
            titre: "Exonérations fiscales",
            desc: "Elles portent sur l'impôt sur les bénéfices ou sur les impôts locaux (cotisation foncière des entreprises, taxe foncière). Souvent attachées à un statut ou une zone : Jeune Entreprise Innovante, zones de revitalisation, zones franches.",
          },
          {
            titre: "Exonérations sociales",
            desc: "Elles allègent les cotisations sociales (part patronale des salariés concernés, parfois charges du dirigeant). Le statut de JEI ouvre une exonération sur les personnels de R&D, cumulable avec le Crédit d'Impôt Recherche.",
          },
        ],
      },
      {
        kind: "checklist",
        titre: "Ce qui fait leur force",
        items: [
          "Effet dans la durée : tant que les conditions du statut sont remplies, l'allègement se reconduit.",
          "Cumul fréquent avec les crédits d'impôt et certaines aides directes.",
          "Pas de dossier concurrentiel : l'exonération découle de votre situation, dès lors que vous en remplissez et documentez les critères.",
        ],
      },
    ],
    role:
      "Beaucoup d'entreprises éligibles ne réclament pas leurs exonérations, faute de connaître les statuts ou les zonages applicables. Nous vérifions votre éligibilité, sécurisons l'application des dispositifs et veillons à leur articulation avec vos autres aides.",
  },

  "credits-impot": {
    slug: "credits-impot",
    nom: "Crédits d'impôt",
    iconKey: "percent",
    figure: { value: "Rétroactif", label: "l'une des rares aides à fonctionner après l'engagement des dépenses" },
    enBref: ["Réduction d'impôt", "Vous l'auto-attribuez", "Récurrent mais contrôlé"],
    definition:
      "Un crédit d'impôt est une réduction d'impôt (sur les sociétés ou sur le revenu) qui, contrairement à une simple réduction, peut donner lieu à un remboursement si elle dépasse l'impôt dû. C'est un levier puissant et récurrent, mais exigeant en justification.",
    sections: [
      {
        kind: "checklist",
        titre: "Ce qui les distingue des autres aides",
        items: [
          "Vous vous l'auto-attribuez : pas de dossier à faire valider face à des concurrents. La contrepartie, c'est un risque de remise en cause en cas de contrôle fiscal, d'où l'importance d'une justification solide.",
          "Ils interviennent après l'engagement des dépenses, et non avant : l'une des rares aides à logique rétroactive, sur l'exercice.",
          "Ils sont nets d'impôt et se cumulent, sous conditions, avec d'autres aides.",
        ],
      },
      {
        kind: "dispositifs",
        titre: "Les principaux dispositifs",
        items: [
          {
            code: "CIR",
            nom: "Crédit d'Impôt Recherche",
            desc: "Le dispositif phare pour les travaux de recherche fondamentale, de recherche industrielle et de développement expérimental.",
          },
          {
            code: "CII",
            nom: "Crédit d'Impôt Innovation",
            desc: "L'extension du CIR aux PME, pour la conception de prototypes et d'installations pilotes de produits nouveaux.",
          },
          {
            code: "C3IV",
            nom: "Crédit d'Impôt Investissements Industries Vertes",
            desc: "Pour les investissements dans les filières de la transition énergétique : batteries, éolien, solaire, pompes à chaleur, hydrogène.",
          },
        ],
      },
    ],
    role:
      "Le crédit d'impôt récompense l'éligibilité réelle des dépenses, pas la qualité d'un dossier de demande. Nous sécurisons l'assiette (cohérence scientifique et fiscale), documentons les travaux et préparons l'entreprise au contrôle, rescrit à l'appui le cas échéant.",
    roleCta: { label: "Découvrir notre offre CIR / CII", href: "/offres/credit-impot-recherche-innovation" },
  },
};

export const typesOrder = ["subventions", "prets", "garanties", "exonerations", "credits-impot"];
