import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Seo } from "./seo";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Doc<T> = T & {
  slug: string;
  body: string;
};

function readCollection<T = Record<string, unknown>>(name: string): Doc<T>[] {
  const dir = path.join(CONTENT_DIR, name);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const slug = (data.slug as string) || file.replace(/\.mdx?$/, "");
      return { ...(data as T), slug, body: content.trim() };
    });
}

function getOne<T>(name: string, slug: string): Doc<T> | undefined {
  return readCollection<T>(name).find((d) => d.slug === slug);
}

// ── Types de collections (frontmatter) ──
export type Offre = {
  slug: string;
  ordre: number;
  nomCourt: string;
  h1: string;
  accroche: string;
  cible?: string;
  benefices?: string[];
  pourquoi?: string[];
  niveaux?: { nom: string; pourQui?: string; description: string }[];
  tableau?: { entete: string[]; lignes: string[][] };
  faq?: { question: string; reponse: string }[];
  cta?: { label: string; href: string };
  related?: Related;
  seo: Seo;
};

export type Secteur = {
  slug: string;
  ordre: number;
  nom: string;
  h1: string;
  accroche: string;
  image?: string;
  enjeux: string;
  aides?: { famille: string; finance: string; dispositif?: string }[];
  accompagnement?: string;
  related?: Related;
  seo: Seo;
  derniereVerification?: string;
};

export type Dispositif = {
  slug: string;
  nom: string;
  annee?: string;
  h1: string;
  definition: string;
  enBref?: { pourQui: string; finance: string; combien: string; quand: string };
  faq?: { question: string; reponse: string }[];
  financeur?: string;
  secteurs?: string[];
  offres?: string[];
  related?: Related;
  seo: Seo;
  sources?: string[];
  derniereVerification?: string;
};

export type Financeur = {
  slug: string;
  nom: string;
  h1: string;
  dispositifs?: string[];
  siteOfficiel?: string;
  related?: Related;
  seo: Seo;
  sources?: string[];
};

export type Article = {
  slug: string;
  titre: string;
  h1?: string;
  publishedAt: string;
  updatedAt?: string;
  auteur: string;
  cluster: "actualite" | "dispositifs" | "secteurs" | "methode" | "cas-clients";
  excerpt: string;
  heroImage?: string;
  tags?: string[];
  related?: Related;
  seo: Seo;
  draft?: boolean;
  sources?: string[];
};

export type CasClient = {
  slug: string;
  titre: string;
  secteur: string;
  dispositif?: string;
  financeur?: string;
  montant: string;
  montantLabel?: string;
  contexte: string;
  resultat?: string;
  image?: string;
  anonymise?: boolean;
  featured?: boolean;
  seo?: Seo;
};

export type Auteur = {
  slug: string;
  nom: string;
  fonction: string;
  bio: string;
  photo?: string;
  linkedin?: string;
  expertise?: string[];
};

export type Page = {
  slug: string;
  titre: string;
  h1: string;
  intro?: string;
  cta?: { label: string; href: string };
  related?: Related;
  seo: Seo;
};

export type Related = {
  offres?: string[];
  dispositifs?: string[];
  secteurs?: string[];
  financeurs?: string[];
  articles?: string[];
};

// ── Accès collections ──
export const getOffres = () =>
  readCollection<Offre>("offres").sort((a, b) => (a.ordre || 0) - (b.ordre || 0));
export const getOffre = (slug: string) => getOne<Offre>("offres", slug);

export const getSecteurs = () =>
  readCollection<Secteur>("secteurs").sort((a, b) => (a.ordre || 0) - (b.ordre || 0));
export const getSecteur = (slug: string) => getOne<Secteur>("secteurs", slug);

export const getDispositifs = () => readCollection<Dispositif>("dispositifs");
export const getDispositif = (slug: string) => getOne<Dispositif>("dispositifs", slug);

export const getFinanceurs = () => readCollection<Financeur>("financeurs");
export const getFinanceur = (slug: string) => getOne<Financeur>("financeurs", slug);

export const getArticles = () =>
  readCollection<Article>("blog")
    .filter((a) => !a.draft)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
export const getArticle = (slug: string) => getOne<Article>("blog", slug);

export const getCasClients = () => readCollection<CasClient>("cas-clients");
export const getCasClient = (slug: string) => getOne<CasClient>("cas-clients", slug);

export const getAuteurs = () => readCollection<Auteur>("auteurs");
export const getAuteur = (slug: string) => getOne<Auteur>("auteurs", slug);

export const getPage = (slug: string) => getOne<Page>("pages", slug);
export const getPages = () => readCollection<Page>("pages");
