export const site = {
  name: "Accelium Conseil",
  shortName: "Accelium",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.accelium-conseil.fr",
  description:
    "Accelium identifie, obtient et sécurise vos financements publics : subventions, crédits d'impôt, CIR/CII. Diagnostic gratuit, partout en France.",
  baseline: "Accélère l'obtention de vos financements publics",
  contact: {
    tel: "06 99 79 85 85",
    telHref: "+33699798585",
    email: "contact@accelium-conseil.fr",
    adresse: "57 avenue de Grammont, 37000 Tours",
    horaires: "Du lundi au vendredi, 8h–19h",
    linkedin: "https://www.linkedin.com/company/accelium-conseil",
  },
  cta: {
    label: "Obtenir mon diagnostic gratuit",
    href: "/contact",
  },
} as const;

export type Site = typeof site;
