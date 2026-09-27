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
