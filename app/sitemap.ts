import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { noindexTemporaire } from "@/config/indexation";
import {
  getOffres,
  getSecteurs,
  getFinanceurs,
  getArticles,
  getCasClients,
  getPages,
  getDispositifs,
  getRegions,
  getNewsletters,
  getGlossaire,
  getFaqTransversale,
} from "@/lib/content";

type Doc = {
  slug?: string;
  seo?: { noindex?: boolean };
  indexable?: boolean;
  updatedAt?: string;
  derniereVerification?: string;
};

// Exclut les pages noindex (frontmatter `seo.noindex`, `indexable: false`) ou marquées
// temporairement hors index dans config/indexation.ts (L1.10).
function isIndexable(doc: Doc, path?: string): boolean {
  if (doc.seo?.noindex) return false;
  if (doc.indexable === false) return false;
  if (path && noindexTemporaire[path]) return false;
  return true;
}

// `derniereVerification` est une chaîne libre ("juin 2026") : on ne s'en sert que si elle
// se parse en date valide, sinon on retombe sur `updatedAt` puis sur la date du build.
function lastMod(doc: Doc, fallback: Date): Date {
  const raw = doc.updatedAt || doc.derniereVerification;
  if (!raw) return fallback;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticPaths = [
    "",
    "/offres",
    "/secteurs",
    "/le-financement-public",
    "/le-financement-public/types-d-aides",
    "/le-financement-public/financeurs",
    "/le-financement-public/dispositifs",
    "/regions",
    "/cas-clients",
    "/blog",
    "/blog/rss.xml",
    "/contact",
    "/ressources",
    "/ressources/livres-blancs",
    "/ressources/agrement-cir-cii",
    "/ressources/newsletters",
    "/mentions-legales",
    "/politique-de-confidentialite",
    "/cookies",
    "/cgu",
  ];
  const noindexPages = getPages().filter((p) => p.seo?.noindex).map((p) => p.slug);
  const staticRoutes = staticPaths
    .filter((p) => !noindexPages.includes(p.replace(/^\//, "")))
    .map((p) => ({ url: `${base}${p}`, lastModified: now }));

  // Pages du dossier content/pages/cabinet-*.mdx : « équipe » et « partenaires » sont hors
  // sitemap tant que config/indexation.ts les marque `true` (L1.10, Lots 4/5 non livrés).
  const cabinetPages = getPages()
    .filter((p) => p.slug.startsWith("cabinet-"))
    .map((p) => ({ path: `cabinet/${p.slug.replace("cabinet-", "")}`, doc: p }))
    .filter(({ path, doc }) => isIndexable(doc as Doc, path))
    .map(({ path }) => ({ url: `${base}/${path}`, lastModified: now }));

  const offres = getOffres().map((o) => ({ url: `${base}/offres/${o.slug}`, lastModified: lastMod(o as Doc, now) }));

  const secteurs = getSecteurs()
    .filter((s) => isIndexable(s as Doc, `secteurs/${s.slug}`))
    .map((s) => ({ url: `${base}/secteurs/${s.slug}`, lastModified: lastMod(s as Doc, now) }));

  const financeurs = getFinanceurs().map((f) => ({
    url: `${base}/le-financement-public/financeurs/${f.slug}`,
    lastModified: now,
  }));

  const typesAides = ["subventions", "prets", "garanties", "exonerations", "credits-impot"].map((s) => ({
    url: `${base}/le-financement-public/types-d-aides/${s}`,
    lastModified: now,
  }));

  const dispositifs = getDispositifs()
    .filter((d) => isIndexable(d as Doc))
    .map((d) => ({
      url: `${base}/le-financement-public/dispositifs/${d.slug}`,
      lastModified: lastMod(d as Doc, now),
    }));

  const regions = getRegions()
    .filter((r) => isIndexable(r as Doc, `regions/${r.slug}`))
    .map((r) => ({
      url: `${base}/regions/${r.slug}`,
      lastModified: lastMod(r as Doc, now),
    }));

  const articles = getArticles().map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: new Date(a.updatedAt || a.publishedAt),
  }));

  const clusters = Array.from(new Set(getArticles().map((a) => a.cluster))).map((c) => ({
    url: `${base}/blog/cluster/${c}`,
    lastModified: now,
  }));

  const cas = getCasClients()
    .filter((c) => isIndexable(c as Doc))
    .map((c) => ({ url: `${base}/cas-clients/${c.slug}`, lastModified: now }));

  const newsletters = getNewsletters()
    .filter((n) => isIndexable(n as Doc))
    .map((n) => ({ url: `${base}/ressources/newsletters/${n.slug}`, lastModified: new Date(n.date) }));

  const glossaire = getGlossaire();
  const glossaireRoute =
    glossaire.termes?.length && isIndexable(glossaire as Doc)
      ? [{ url: `${base}/le-financement-public/glossaire`, lastModified: now }]
      : [];

  const faq = getFaqTransversale();
  const faqRoute =
    faq.themes?.length && isIndexable(faq as Doc)
      ? [{ url: `${base}/le-financement-public/questions-frequentes`, lastModified: now }]
      : [];

  return [
    ...staticRoutes,
    ...cabinetPages,
    ...offres,
    ...secteurs,
    ...financeurs,
    ...typesAides,
    ...dispositifs,
    ...regions,
    ...articles,
    ...clusters,
    ...cas,
    ...newsletters,
    ...glossaireRoute,
    ...faqRoute,
  ];
}
