import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import {
  getOffres,
  getSecteurs,
  getDispositifs,
  getFinanceurs,
  getArticles,
  getCasClients,
  getPages,
} from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/offres",
    "/secteurs",
    "/le-financement-public",
    "/le-financement-public/dispositifs",
    "/le-financement-public/financeurs",
    "/cas-clients",
    "/blog",
    "/contact",
    "/cabinet/a-propos",
    "/cabinet/methodologie",
    "/cabinet/nos-atouts",
    "/cabinet/equipe",
    "/cabinet/partenaires",
    "/cabinet/deontologie",
    "/mentions-legales",
    "/politique-de-confidentialite",
    "/cookies",
    "/cgu",
  ].map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 }));

  const offres = getOffres().map((o) => ({ url: `${base}/offres/${o.slug}`, lastModified: now, priority: 0.8 }));
  const secteurs = getSecteurs().map((s) => ({ url: `${base}/secteurs/${s.slug}`, lastModified: now, priority: 0.8 }));
  const dispositifs = getDispositifs().map((d) => ({ url: `${base}/le-financement-public/dispositifs/${d.slug}`, lastModified: now, priority: 0.8 }));
  const financeurs = getFinanceurs().map((f) => ({ url: `${base}/le-financement-public/financeurs/${f.slug}`, lastModified: now, priority: 0.6 }));
  const typesAides = ["subventions", "prets", "credits-impot", "garanties", "exonerations"].map((s) => ({ url: `${base}/le-financement-public/types-d-aides/${s}`, lastModified: now, priority: 0.5 }));
  const articles = getArticles().map((a) => ({ url: `${base}/blog/${a.slug}`, lastModified: new Date(a.updatedAt || a.publishedAt), priority: 0.6 }));
  const cas = getCasClients().map((c) => ({ url: `${base}/cas-clients/${c.slug}`, lastModified: now, priority: 0.5 }));

  return [...staticRoutes, ...offres, ...secteurs, ...dispositifs, ...financeurs, ...typesAides, ...articles, ...cas];
}
