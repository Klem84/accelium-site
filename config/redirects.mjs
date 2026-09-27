// Redirections 301 : ancien WordPress → nouveau site.
// Source : redirects-301-mapping.md. Complétées au go-live via Search Console.
export const redirects = [
  { source: "/actualites", destination: "/blog", permanent: true },
  { source: "/diagnostic-gratuit", destination: "/contact", permanent: true },
  { source: "/nos-atouts", destination: "/cabinet/nos-atouts", permanent: true },
  { source: "/nos-partenaires", destination: "/cabinet/partenaires", permanent: true },
  { source: "/notre-demarche", destination: "/offres/financements-publics", permanent: true },
  { source: "/cabinet/methodologie", destination: "/offres/financements-publics", permanent: true },
  { source: "/category/uncategorized", destination: "/blog", permanent: true },
  { source: "/hello-world", destination: "/blog", permanent: true },

  // Section « dispositifs » supprimée (2026-06) → redirigée vers Types d'aides / Financeurs.
  { source: "/le-financement-public/dispositifs", destination: "/le-financement-public/types-d-aides", permanent: true },
  { source: "/le-financement-public/dispositifs/credit-impot-recherche-cir", destination: "/le-financement-public/types-d-aides/credits-impot", permanent: true },
  { source: "/le-financement-public/dispositifs/cii", destination: "/le-financement-public/types-d-aides/credits-impot", permanent: true },
  { source: "/le-financement-public/dispositifs/c3iv", destination: "/le-financement-public/types-d-aides/credits-impot", permanent: true },
  { source: "/le-financement-public/dispositifs/decarb-ind", destination: "/le-financement-public/financeurs/ademe", permanent: true },
  { source: "/le-financement-public/dispositifs/fonds-chaleur-bciat", destination: "/le-financement-public/financeurs/ademe", permanent: true },
  { source: "/le-financement-public/dispositifs/:slug*", destination: "/le-financement-public/types-d-aides", permanent: true },

  // Fiches de décryptage déplacées des Ressources vers le Blog (2026-06).
  { source: "/ressources/fiches-decryptage", destination: "/blog#fiches", permanent: true },
];
