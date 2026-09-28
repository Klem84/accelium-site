export type NavChild = { label: string; href: string; description?: string };
export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
  featured?: { label: string; href: string };
};

export const mainNav: NavItem[] = [
  {
    label: "Le financement public",
    href: "/le-financement-public",
    children: [
      { label: "Comprendre le financement public", href: "/le-financement-public", description: "La carte des aides aux entreprises" },
      { label: "Les types d'aides", href: "/le-financement-public/types-d-aides", description: "Subventions, prêts, garanties, crédits d'impôt…" },
      { label: "Les financeurs", href: "/le-financement-public/financeurs", description: "Régions, Europe, ADEME, Bpifrance…" },
      { label: "Les dispositifs", href: "/le-financement-public/dispositifs", description: "Fonds Chaleur, CIR, France 2030…" },
      { label: "Les aides par région", href: "/regions", description: "La couverture nationale, région par région" },
    ],
  },
  {
    label: "Nos offres",
    href: "/offres",
    children: [
      { label: "Recherche & obtention de financements", href: "/offres/financements-publics" },
      { label: "Crédit d'impôt recherche & innovation", href: "/offres/credit-impot-recherche-innovation" },
      { label: "Accompagnement à l'agrément CIR/CII", href: "/offres/agrement-cir-cii" },
      { label: "Internalisation du CIR/CII", href: "/offres/internaliser-cir-cii" },
      { label: "Veille & intelligence financements", href: "/offres/veille-intelligence-financements" },
    ],
  },
  {
    label: "Secteurs",
    href: "/secteurs",
    children: [
      { label: "Forêt-bois", href: "/secteurs/foret-bois" },
      { label: "Industrie", href: "/secteurs/industrie" },
      { label: "Agroalimentaire", href: "/secteurs/agroalimentaire" },
      { label: "Biomasse", href: "/secteurs/biomasse" },
      { label: "Béton", href: "/secteurs/beton" },
      { label: "Enrobés", href: "/secteurs/enrobes" },
      { label: "Distillerie", href: "/secteurs/distillerie" },
      { label: "Défense", href: "/secteurs/defense" },
      { label: "Port maritime", href: "/secteurs/port-maritime" },
      { label: "Agriculture", href: "/secteurs/agriculture" },
    ],
  },
  {
    label: "Ressources",
    href: "/ressources",
    children: [
      { label: "Livres blancs", href: "/ressources/livres-blancs", description: "Nos guides à télécharger" },
      { label: "Application agrément CIR/CII", href: "/ressources/agrement-cir-cii", description: "Testez votre éligibilité en ligne" },
      { label: "Blog", href: "/blog", description: "Décryptages, actualités et conseils" },
      { label: "Cas clients", href: "/cas-clients", description: "Des projets financés" },
    ],
  },
  {
    label: "Le cabinet",
    href: "/cabinet/a-propos",
    children: [
      { label: "À propos", href: "/cabinet/a-propos" },
      { label: "Nos atouts", href: "/cabinet/nos-atouts" },
      { label: "L'équipe", href: "/cabinet/equipe" },
      { label: "Nos partenaires et le cercle", href: "/cabinet/partenaires" },
      { label: "Événements", href: "/cabinet/evenements" },
      { label: "Nous rejoindre", href: "/cabinet/nous-rejoindre" },
      { label: "Déontologie", href: "/cabinet/deontologie" },
    ],
  },
];

export const footerNav = {
  comprendre: {
    title: "Comprendre",
    links: [
      { label: "Les types d'aides", href: "/le-financement-public/types-d-aides" },
      { label: "Les financeurs", href: "/le-financement-public/financeurs" },
      { label: "Les dispositifs", href: "/le-financement-public/dispositifs" },
      { label: "Les aides par région", href: "/regions" },
      { label: "Glossaire", href: "/le-financement-public/glossaire" },
      { label: "Questions fréquentes", href: "/le-financement-public/questions-frequentes" },
    ],
  },
  secteurs: {
    title: "Secteurs",
    links: [
      { label: "Forêt-bois", href: "/secteurs/foret-bois" },
      { label: "Industrie", href: "/secteurs/industrie" },
      { label: "Agroalimentaire", href: "/secteurs/agroalimentaire" },
      { label: "Biomasse", href: "/secteurs/biomasse" },
      { label: "Béton", href: "/secteurs/beton" },
      { label: "Enrobés", href: "/secteurs/enrobes" },
    ],
  },
  offres: {
    title: "Offres",
    links: [
      { label: "Financements publics", href: "/offres/financements-publics" },
      { label: "CIR / CII", href: "/offres/credit-impot-recherche-innovation" },
      { label: "Agrément CIR/CII", href: "/offres/agrement-cir-cii" },
      { label: "Internalisation", href: "/offres/internaliser-cir-cii" },
      { label: "Veille & intelligence", href: "/offres/veille-intelligence-financements" },
    ],
  },
  ressources: {
    title: "Ressources",
    links: [
      { label: "Livres blancs", href: "/ressources/livres-blancs" },
      { label: "Application agrément CIR/CII", href: "/ressources/agrement-cir-cii" },
      { label: "Blog", href: "/blog" },
      { label: "Cas clients", href: "/cas-clients" },
    ],
  },
  cabinet: {
    title: "Le cabinet",
    links: [
      { label: "À propos", href: "/cabinet/a-propos" },
      { label: "Nos atouts", href: "/cabinet/nos-atouts" },
      { label: "L'équipe", href: "/cabinet/equipe" },
      { label: "Nos partenaires", href: "/cabinet/partenaires" },
      { label: "Événements", href: "/cabinet/evenements" },
      { label: "Nous rejoindre", href: "/cabinet/nous-rejoindre" },
      { label: "Déontologie", href: "/cabinet/deontologie" },
      { label: "Contact", href: "/contact" },
    ],
  },
};

export const legalNav = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/politique-de-confidentialite" },
  { label: "Cookies", href: "/cookies" },
  { label: "CGU", href: "/cgu" },
];
