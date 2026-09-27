/* Contenu structuré du cabinet (parties réelles). Sans tiret long.
   todo: true => description à compléter par le client. */

export type Principe = { titre: string; desc?: string; todo?: boolean };

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
    todo: true, // modèle de rémunération à préciser
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
  {
    titre: "Assurance responsabilité civile professionnelle",
    todo: true, // référence du contrat à afficher
  },
  {
    titre: "Référencement CIR/CII du Médiateur des entreprises",
    todo: true, // à afficher si effectivement référencé
  },
];

/* Profils d'expertise mis en avant pour l'équipe (depuis la fiche auteur). */
export const equipeExpertise = [
  "CIR / CII",
  "Subventions & France 2030",
  "Décarbonation industrielle",
  "Conduite du changement",
];

/* Typologies de partenaires recherchés. */
export const partenairesCibles = ["Expert-comptable", "Avocat", "Banquier", "Conseil en innovation"];
