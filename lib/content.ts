import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Seo } from "./seo";
import { referencesConfirmees } from "@/config/references";

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
    .filter((f) => (f.endsWith(".mdx") || f.endsWith(".md")) && !f.startsWith("_"))
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

// Lit un fichier MDX unique à la racine de content/ (pas une collection de plusieurs
// fiches) : le frontmatter porte directement les données (ex. content/glossaire.mdx,
// content/faq.mdx). Retourne undefined si le fichier n'existe pas encore.
function readSingle<T = Record<string, unknown>>(filename: string): (T & { body: string }) | undefined {
  const file = path.join(CONTENT_DIR, filename);
  if (!fs.existsSync(file)) return undefined;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return { ...(data as T), body: content.trim() };
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
  enjeux?: string[];
  aides?: { dispositif: string; pourquoi: string; taux?: string; calendrier?: string }[];
  faq?: { question: string; reponse: string; lien?: string }[];
  sources?: { titre: string; url: string }[];
  regionsActives?: string[];
  accompagnement?: string;
  related?: Related;
  seo: Seo;
  derniereVerification?: string;
};

// Source unique de la fiche : ce frontmatter (§6.1 du plan) est le contrat que suivent
// les rédacteurs pour content/dispositifs/<slug>.mdx.
export type Dispositif = {
  slug: string;
  nom: string;
  nomCourt: string;
  financeur?: string; // slug d'un financeur existant
  famille?: "subventions" | "prets" | "garanties" | "exonerations" | "credits-impot";
  h1: string;
  definition: string;
  beneficiaires?: string[];
  depensesEligibles?: string[];
  tauxPlafond?: string;
  forme?: string;
  calendrier?: string;
  cumul?: string;
  lienOfficiel?: string;
  secteurs?: string[];
  offres?: string[];
  casClients?: string[];
  dispositifsVoisins?: string[];
  accompagnement?: string;
  sources?: { titre: string; url: string }[];
  auteur?: string;
  derniereVerification?: string;
  updatedAt?: string;
  seo: Seo;
  faq?: { question: string; reponse: string }[];
  indexable?: boolean;
  related?: Related;
};

// Contrat §6.3 : content/regions/<slug>.mdx.
export type Region = {
  slug: string;
  nom: string;
  h1: string;
  definition: string;
  financeursRegionaux?: { nom: string; role: string; url?: string }[];
  dispositifsRegionaux?: { nom: string; objet: string; taux?: string; calendrier?: string; source?: string }[];
  dispositifsNationaux?: string[]; // slugs de pages dispositifs
  casClients?: string[]; // slugs de content/cas-clients
  projetsAnonymises?: { secteur: string; projet: string; financeur: string; montant?: string }[];
  secteursActifs?: string[];
  sources?: { titre: string; url: string }[];
  derniereVerification?: string;
  seo: Seo;
  faq?: { question: string; reponse: string }[];
  ordre?: number;
  statut?: "complete" | "courte";
};

// Contrat §6.7 : content/newsletters/<aaaa-mm>.mdx.
export type Newsletter = {
  slug: string;
  titre: string;
  date: string; // AAAA-MM-JJ, utilisé pour le tri antéchronologique
  numero?: string | number;
  resume: string;
  themes?: string[];
  dispositifsCites?: string[]; // slugs de pages dispositifs
  // Noms bruts (contrat §6.7). Le filtre confirme: true dans config/references.ts
  // (à créer par A3) doit être appliqué avant affichage : voir isNomClientConfirme
  // ci-dessous, à compléter dès que ce fichier existera.
  clientsFelicites?: string[];
  seo?: Seo;
};

// Contrat §5.8 : content/glossaire.mdx (fiche unique, pas de collection).
export type GlossaireTerme = {
  terme: string;
  slug: string;
  definition: string;
  lien?: string;
};
export type Glossaire = {
  titre?: string;
  h1?: string;
  intro?: string;
  derniereVerification?: string;
  sources?: { titre: string; url: string }[];
  termes: GlossaireTerme[];
  seo?: Seo;
};

// Contrat §5.8 : content/faq.mdx (fiche unique).
export type FaqQuestion = { question: string; reponse: string; lien?: string };
export type FaqTheme = { theme: string; questions: FaqQuestion[] };
export type FaqTransversale = {
  themes: FaqTheme[];
  seo?: Seo;
};

export type Financeur = {
  slug: string;
  nom: string;
  h1: string;
  definition?: string;
  echelon?: "Europe" | "État" | "Région";
  echelonNote?: string;
  echelonIcon?: "europe" | "etat" | "region";
  pourQui?: string;
  interventions?: string[];
  dispositifs?: string[];
  siteOfficiel?: string;
  faq?: { question: string; reponse: string; lien?: string }[];
  sources?: { titre: string; url: string }[];
  auteur?: string;
  derniereVerification?: string;
  related?: Related;
  seo: Seo;
};

export type Article = {
  slug: string;
  titre: string;
  h1?: string;
  publishedAt: string;
  updatedAt?: string;
  auteur: string;
  cluster: "actualite" | "dispositifs" | "secteurs" | "methode" | "cas-clients" | "decryptage" | "agrement-cir-cii";
  excerpt: string;
  heroImage?: string;
  tags?: string[];
  related?: Related;
  seo: Seo;
  draft?: boolean;
  sources?: string[] | { titre: string; url: string }[];
};

export type CasClient = {
  slug: string;
  titre: string;
  h1?: string;
  secteur: string;
  region?: string; // slug d'une région (§6.5)
  dispositif?: string;
  dispositifNom?: string;
  financeur?: string;
  financeurNom?: string;
  montant: string;
  montantLabel?: string;
  montantAide?: number;
  investissement?: string;
  taux?: string;
  delai?: string; // ex. "5 mois entre le dépôt et la notification"
  annee?: number;
  contexte: string;
  resultat?: string;
  image?: string;
  anonymise?: boolean;
  featured?: boolean;
  indexable?: boolean;
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

export const getRegions = () =>
  readCollection<Region>("regions").sort((a, b) => (a.ordre || 0) - (b.ordre || 0));
export const getRegion = (slug: string) => getOne<Region>("regions", slug);

export const getNewsletters = () =>
  readCollection<Newsletter>("newsletters").sort((a, b) => (a.date < b.date ? 1 : -1));
export const getNewsletter = (slug: string) => getOne<Newsletter>("newsletters", slug);

export const getGlossaire = (): Glossaire =>
  readSingle<Glossaire>("glossaire.mdx") || { termes: [] };

export const getFaqTransversale = (): FaqTransversale =>
  readSingle<FaqTransversale>("faq.mdx") || { themes: [] };

// Règle §2.6 du brief commun : un nom de client ne s'affiche que si l'entrée
// correspondante de config/references.ts a confirme === true et n'est pas refusée.
// referencesConfirmees()/estAffichable() (créés par A3) sont la source unique de
// cette vérification.
export function isNomClientConfirme(nom: string): boolean {
  return referencesConfirmees().some((r) => r.nom === nom);
}
