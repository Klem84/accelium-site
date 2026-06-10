// Redirections 301 : ancien WordPress → nouveau site.
// Source : redirects-301-mapping.md. Complétées au go-live via Search Console.
export const redirects = [
  { source: "/actualites", destination: "/blog", permanent: true },
  { source: "/diagnostic-gratuit", destination: "/contact", permanent: true },
  { source: "/nos-atouts", destination: "/cabinet/nos-atouts", permanent: true },
  { source: "/nos-partenaires", destination: "/cabinet/partenaires", permanent: true },
  { source: "/notre-demarche", destination: "/cabinet/methodologie", permanent: true },
  { source: "/category/uncategorized", destination: "/blog", permanent: true },
  { source: "/hello-world", destination: "/blog", permanent: true },
];
