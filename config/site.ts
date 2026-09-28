const FALLBACK_URL = "https://www.accelium-conseil.fr";

// Normalise NEXT_PUBLIC_SITE_URL : tolère une valeur sans schéma (« www.accelium-conseil.fr »)
// et retombe sur l'URL canonique si la variable est absente ou invalide, pour ne jamais
// faire planter `new URL()` au build (cf. metadata / sitemap).
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK_URL;
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(candidate).origin;
  } catch {
    return FALLBACK_URL;
  }
}

export const site = {
  name: "Accelium Conseil",
  shortName: "Accelium",
  url: resolveSiteUrl(),
  description:
    "Accelium identifie, obtient et sécurise vos financements publics : subventions, crédits d'impôt, CIR/CII. Diagnostic gratuit, partout en France.",
  baseline: "Accélère l'obtention de vos financements publics",
  contact: {
    tel: "06 99 79 85 85",
    telHref: "+33699798585",
    email: "contact@accelium-conseil.fr",
    adresse: "57 avenue de Grammont, 37000 Tours",
    horaires: "Du lundi au vendredi, de 8h à 19h",
    linkedin: "https://www.linkedin.com/company/accelium-conseil",
  },
  cta: {
    label: "Obtenir mon diagnostic gratuit",
    href: "/contact",
  },
} as const;

export type Site = typeof site;
