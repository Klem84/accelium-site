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
      { label: "Les dispositifs", href: "/le-financement-public/dispositifs", description: "CIR, CII, C3IV, France 2030, CEE…" },
      { label: "Les financeurs", href: "/le-financement-public/financeurs", description: "ADEME, Bpifrance, Régions, UE…" },
      { label: "Types d'aides", href: "/le-financement-public/types-d-aides/subventions", description: "Subventions, prêts, crédits d'impôt…" },
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
    href: "/blog",
    children: [
      { label: "Blog", href: "/blog", description: "Décryptages, actualités et conseils" },
      { label: "Cas clients", href: "/cas-clients", description: "Des projets financés" },
    ],
  },
  {
    label: "Le cabinet",
    href: "/cabinet/a-propos",
    children: [
      { label: "À propos", href: "/cabinet/a-propos" },
      { label: "Notre méthodologie", href: "/cabinet/methodologie" },
      { label: "Nos atouts", href: "/cabinet/nos-atouts" },
      { label: "L'équipe", href: "/cabinet/equipe" },
      { label: "Nos partenaires", href: "/cabinet/partenaires" },
      { label: "Déontologie", href: "/cabinet/deontologie" },
    ],
  },
];

export const footerNav = {
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
      { label: "Le financement public", href: "/le-financement-public" },
      { label: "Dispositifs", href: "/le-financement-public/dispositifs" },
      { label: "Secteurs", href: "/secteurs" },
      { label: "Blog", href: "/blog" },
      { label: "Cas clients", href: "/cas-clients" },
    ],
  },
  cabinet: {
    title: "Le cabinet",
    links: [
      { label: "À propos", href: "/cabinet/a-propos" },
      { label: "Méthodologie", href: "/cabinet/methodologie" },
      { label: "Nos atouts", href: "/cabinet/nos-atouts" },
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
