// Registre des fiches de décryptage (notes sectorielles téléchargeables).
// Le PDF est servi directement depuis /public/fiches-decryptage/<fichier>.
// Téléchargement direct, sans formulaire (contrairement aux livres blancs).

// Visuels par thème, hébergés localement (cf. docs/credits-images.md pour l'attribution
// Unsplash d'origine) : plus de dépendance à images.unsplash.com (CSP, fiche J.1.13).
const IMG = {
  industrie: "/images/secteurs/secteur-industrie.jpg",
  foretBois: "/images/secteurs/secteur-foret-bois.jpg",
  recyclage: "/images/secteurs/secteur-industrie-usine.jpg",
  agro: "/images/secteurs/secteur-agroalimentaire.jpg",
  biomasse: "/images/secteurs/secteur-biomasse.jpg",
  energieSol: "/images/secteurs/secteur-agriculture.jpg",
};

export type FicheDecryptage = {
  slug: string;
  titre: string; // nom du dispositif / AAP
  financeur: string; // ex. ADEME, Bpifrance, Union Européenne
  categorie: string; // thématique
  description: string;
  fichier: string; // chemin public, ex. /fiches-decryptage/xxx.pdf
  image: string; // visuel de la carte
};

export const fichesDecryptage: FicheDecryptage[] = [
  {
    slug: "decarb-flash",
    titre: "AAP DECARB FLASH 2025-2027",
    financeur: "ADEME",
    categorie: "Décarbonation industrielle",
    description:
      "Soutenir la décarbonation des sites industriels (jusqu'à 3 M€ d'investissement) dans le cadre de France 2030 : chaleur fatale, efficacité énergétique, évolution du mix énergétique.",
    fichier: "/fiches-decryptage/decarb-flash-2025-2027-ademe.pdf",
    image: IMG.industrie,
  },
  {
    slug: "ippb",
    titre: "AAP IPPB",
    financeur: "ADEME",
    categorie: "Forêt-bois",
    description:
      "Améliorer la valorisation des ressources bois des territoires en optimisant les procédés de transformation, avec une priorité aux feuillus et aux usages à longue durée de vie.",
    fichier: "/fiches-decryptage/ippb-foret-bois-ademe.pdf",
    image: IMG.foretBois,
  },
  {
    slug: "ormat-2025",
    titre: "AAP ORMAT 2025",
    financeur: "ADEME",
    categorie: "Économie circulaire",
    description:
      "Soutenir le surtri, la préparation des déchets au recyclage et l'incorporation de matières premières de recyclage : plastiques, textiles, métaux et batteries, bois, papier-carton, verre.",
    fichier: "/fiches-decryptage/ormat-2025-ademe.pdf",
    image: IMG.recyclage,
  },
  {
    slug: "rca-2030",
    titre: "AAP RCA 2030",
    financeur: "Bpifrance",
    categorie: "Agroalimentaire",
    description:
      "Renforcer la résilience du système alimentaire, structurer les filières agricoles et agroalimentaires et accompagner leur transition écologique.",
    fichier: "/fiches-decryptage/rca-2030-bpifrance.pdf",
    image: IMG.agro,
  },
  {
    slug: "chaufferies-biomasse",
    titre: "Chaufferies biomasse (Fonds Chaleur)",
    financeur: "ADEME",
    categorie: "Énergie & biomasse",
    description:
      "Financer les études de projets et la réalisation d'installations de production de chaleur biomasse / bois via le Fonds Chaleur (énergies renouvelables et de récupération).",
    fichier: "/fiches-decryptage/chaufferies-biomasse-ademe.pdf",
    image: IMG.biomasse,
  },
  {
    slug: "geothermie-aerothermie",
    titre: "Géothermie de surface & aérothermie (Fonds Chaleur)",
    financeur: "ADEME",
    categorie: "Énergie",
    description:
      "Accompagner les projets de géothermie de surface, thalassothermie, cloacothermie et aérothermie via le Fonds Chaleur de l'ADEME.",
    fichier: "/fiches-decryptage/geothermie-aerothermie-ademe.pdf",
    image: IMG.energieSol,
  },
  {
    slug: "centre-de-tri-dechets",
    titre: "Centre de tri de déchets & valorisation de la matière",
    financeur: "ADEME",
    categorie: "Économie circulaire",
    description:
      "Soutenir la création, l'extension ou la modernisation des centres de tri de déchets et la valorisation de la matière, proposé par l'ADEME dans différentes régions.",
    fichier: "/fiches-decryptage/centre-de-tri-dechets-ademe.pdf",
    image: IMG.recyclage,
  },
  {
    slug: "feader-agroalimentaire",
    titre: "FEADER agroalimentaire",
    financeur: "Union Européenne",
    categorie: "Agroalimentaire",
    description:
      "Renforcer la compétitivité, la durabilité et la diversification des zones rurales pour les acteurs de la transformation, du conditionnement, du stockage et de la commercialisation de produits agricoles. Cofinancé par l'UE et les Régions.",
    fichier: "/fiches-decryptage/feader-agroalimentaire-ue.pdf",
    image: IMG.agro,
  },
  {
    slug: "innover-transitions-agroecologique",
    titre: "Innover pour réussir les transitions agroécologique et alimentaire",
    financeur: "Bpifrance",
    categorie: "Agroalimentaire",
    description:
      "AAP France 2030 pour l'innovation dans les transitions agroécologique et alimentaire : projets individuels ou collaboratifs, financés en subvention et avance remboursable.",
    fichier: "/fiches-decryptage/innover-transitions-agroecologique-alimentaire-bpifrance.pdf",
    image: IMG.energieSol,
  },
];

export const getFicheDecryptage = (slug: string) =>
  fichesDecryptage.find((f) => f.slug === slug);
