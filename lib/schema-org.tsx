import { site } from "@/config/site";

const abs = (p: string) => new URL(p, site.url).toString();
export const ORG_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

/**
 * ProfessionalService + Organization, @id #organization.
 * areaServed : France entière, sans mention régionale (arbitrage Clément du 27/09/2026).
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "@id": ORG_ID,
    name: site.name,
    legalName: "ACCELIUM CONSEIL",
    alternateName: site.shortName,
    url: site.url,
    logo: abs("/assets/logo-horizontal-bleu-orange.png"),
    image: abs(defaultOgImagePath),
    description: site.description,
    slogan: site.baseline,
    telephone: site.contact.telHref,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "57 avenue de Grammont",
      postalCode: "37000",
      addressLocality: "Tours",
      addressRegion: "Centre-Val de Loire",
      addressCountry: "FR",
    },
    areaServed: { "@type": "Country", name: "France" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: site.contact.telHref,
        email: site.contact.email,
        availableLanguage: "fr",
        areaServed: "FR",
      },
    ],
    hasOfferCatalog: offerCatalogSchema(),
    sameAs: [site.contact.linkedin],
  };
}

const defaultOgImagePath = "/opengraph-image";

/** WebSite, @id #website, publisher pointant vers #organization. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    inLanguage: "fr-FR",
    publisher: { "@id": ORG_ID },
  };
}

/** Catalogue des 5 offres, référencé par organizationSchema(). */
export function offerCatalogSchema() {
  const offres = [
    { name: "Recherche et obtention de financements publics", url: "/offres/financements-publics" },
    { name: "Crédit d'impôt recherche et innovation", url: "/offres/credit-impot-recherche-innovation" },
    { name: "Accompagnement à l'agrément CIR/CII", url: "/offres/agrement-cir-cii" },
    { name: "Internalisation du CIR/CII", url: "/offres/internaliser-cir-cii" },
    { name: "Veille et intelligence financements", url: "/offres/veille-intelligence-financements" },
  ];
  return {
    "@type": "OfferCatalog",
    name: "Offres Accelium",
    itemListElement: offres.map((o) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: o.name, url: abs(o.url) },
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  audience?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: abs(opts.url),
    serviceType: opts.serviceType || opts.name,
    ...(opts.audience
      ? { audience: { "@type": "Audience", audienceType: opts.audience } }
      : {}),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "France" },
  };
}

/** Personne (dirigeant, membre d'équipe, auteur). */
export function personSchema(opts: {
  name: string;
  jobTitle?: string;
  url?: string;
  image?: string;
  sameAs?: string | string[];
  worksFor?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: opts.name,
    ...(opts.jobTitle ? { jobTitle: opts.jobTitle } : {}),
    ...(opts.url ? { "@id": abs(opts.url) } : {}),
    ...(opts.image ? { image: abs(opts.image) } : {}),
    ...(opts.sameAs ? { sameAs: opts.sameAs } : {}),
    ...(opts.worksFor ? { worksFor: { "@id": ORG_ID } } : {}),
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: abs(opts.url),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    author: personSchema({ name: opts.authorName, url: opts.authorUrl }),
    publisher: { "@id": ORG_ID },
    ...(opts.image ? { image: abs(opts.image) } : {}),
  };
}

export function faqSchema(faq: { question: string; reponse: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.reponse },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.url),
    })),
  };
}

/** Ensemble de définitions (glossaire). */
export function definedTermSetSchema(opts: {
  name: string;
  url: string;
  terms: { name: string; description: string; url?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: opts.name,
    url: abs(opts.url),
    hasDefinedTerm: opts.terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.name,
      description: t.description,
      inDefinedTermSet: abs(opts.url),
      ...(t.url ? { url: abs(t.url) } : {}),
    })),
  };
}

/** Liste ordonnée générique (dispositifs, régions, cas clients...). */
export function itemListSchema(opts: { name: string; items: { name: string; url: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    itemListElement: opts.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: abs(it.url),
    })),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
