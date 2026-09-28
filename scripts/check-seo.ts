/**
 * scripts/check-seo.ts
 *
 * Analyse le HTML généré par `next build` (.next/server/app/**\/*.html) :
 * title, meta description, canonical, og:title, un seul H1, doublons,
 * pages orphelines, placeholders. Nécessite un build préalable ; si absent,
 * avertit et sort en 0 (ne bloque pas `npm run check` avant le premier build).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BUILD_DIR = path.join(ROOT, ".next", "server", "app");

type Issue = { file: string; rule: string; message: string };
const issues: Issue[] = [];
function report(file: string, rule: string, message: string) {
  issues.push({ file, rule, message });
}

if (!fs.existsSync(BUILD_DIR)) {
  console.log("check-seo : build requis (exécutez `next build` avant ce script). Avertissement, pas d'échec.");
  process.exit(0);
}

function walkHtml(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(full, acc);
    } else if (entry.name.endsWith(".html")) {
      acc.push(full);
    }
  }
  return acc;
}

const htmlFiles = walkHtml(BUILD_DIR);
if (htmlFiles.length === 0) {
  console.log("check-seo : aucun fichier HTML trouvé sous .next/server/app. Avertissement, pas d'échec.");
  process.exit(0);
}

function urlFromFile(file: string): string {
  let rel = path.relative(BUILD_DIR, file).replace(/\\/g, "/");
  rel = rel.replace(/\.html$/, "");
  rel = rel.replace(/\/index$/, "");
  rel = rel.replace(/^index$/, "");
  return "/" + rel;
}

function extractTag(html: string, tag: string): string | null {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
}

function extractMeta(html: string, name: string, attr: "name" | "property" = "name"): string | null {
  const re = new RegExp(`<meta[^>]*${attr}=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, "i");
  const reAlt = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${name}["'][^>]*>`, "i");
  const m = html.match(re) || html.match(reAlt);
  return m ? m[1] : null;
}

function extractLinkHref(html: string, rel: string): string | null {
  const re = new RegExp(`<link[^>]*rel=["']${rel}["'][^>]*href=["']([^"']*)["'][^>]*>`, "i");
  const reAlt = new RegExp(`<link[^>]*href=["']([^"']*)["'][^>]*rel=["']${rel}["'][^>]*>`, "i");
  const m = html.match(re) || html.match(reAlt);
  return m ? m[1] : null;
}

/** Décode les entités HTML courantes pour mesurer la longueur réelle des textes. */
function decode(v: string | null): string | null {
  if (v == null) return v;
  return v
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

const PLACEHOLDER_RE = /(À COMPLÉTER|A COMPLETER|lorem ipsum)/i;

type PageInfo = {
  url: string;
  file: string;
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogTitle: string | null;
  h1Count: number;
  internalLinks: string[];
  /** Page exclue de l'index (meta robots noindex) ou page technique (404) : ignorée pour doublons et orphelines. */
  horsIndex: boolean;
};

const pages: PageInfo[] = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const url = urlFromFile(file);
  const title = decode(extractTag(html, "title"));
  const description = decode(extractMeta(html, "description"));
  const robots = extractMeta(html, "robots") || "";
  const horsIndex = /noindex/i.test(robots) || url === "/_not-found";
  const canonical = extractLinkHref(html, "canonical");
  const ogTitle = extractMeta(html, "og:title", "property");
  const h1Matches = html.match(/<h1[^>]*>/gi) || [];

  const internalLinks = [...html.matchAll(/<a[^>]*href=["'](\/[^"'#?]*)["'][^>]*>/gi)].map((m) => m[1]);

  pages.push({ url, file, title, description, canonical, ogTitle, h1Count: h1Matches.length, internalLinks, horsIndex });

  if (!title) {
    report(url, "title-absent", "Aucun <title>.");
  } else {
    if (title.length > 60) {
      report(url, "title-trop-long", `Title de ${title.length} caractères (max 60) : "${title}"`);
    }
    // Double suffixe « | Accelium ... | Accelium »
    const suffixMatches = title.match(/\|\s*Accelium[^|]*/gi) || [];
    if (suffixMatches.length > 1) {
      report(url, "title-double-suffixe", `Title avec double suffixe Accelium : "${title}"`);
    }
    if (PLACEHOLDER_RE.test(title)) {
      report(url, "placeholder", `Placeholder dans le title : "${title}"`);
    }
  }

  if (!description) {
    report(url, "description-absente", "Aucune meta description.");
  } else {
    if (description.length < 70 || description.length > 160) {
      report(url, "description-longueur", `Meta description de ${description.length} caractères (attendu 70 à 160) : "${description}"`);
    }
    if (PLACEHOLDER_RE.test(description)) {
      report(url, "placeholder", `Placeholder dans la meta description : "${description}"`);
    }
  }

  if (!canonical) {
    report(url, "canonical-absent", "Aucune balise <link rel=\"canonical\">.");
  }

  if (!ogTitle) {
    report(url, "og-title-absent", "Aucune meta og:title.");
  }

  if (h1Count(html) === 0) {
    report(url, "h1-absent", "Aucun <h1> sur la page.");
  } else if (h1Count(html) > 1) {
    report(url, "h1-multiple", `${h1Count(html)} balises <h1> trouvées (une seule attendue).`);
  }
}

function h1Count(html: string): number {
  return (html.match(/<h1[^>]*>/gi) || []).length;
}

// ── Doublons title / description / H1 ──
function findDuplicates(getValue: (p: PageInfo) => string | null, label: string) {
  const byValue = new Map<string, string[]>();
  for (const p of pages) {
    if (p.horsIndex) continue;
    const v = getValue(p);
    if (!v) continue;
    byValue.set(v, [...(byValue.get(v) || []), p.url]);
  }
  for (const [value, urls] of byValue) {
    if (urls.length > 1) {
      for (const url of urls) {
        report(url, `${label}-duplique`, `${label} identique sur ${urls.length} pages : ${urls.filter((u) => u !== url).join(", ")}`);
      }
    }
  }
}

findDuplicates((p) => p.title, "title");
findDuplicates((p) => p.description, "description");

// H1 dupliqué : extrait le premier H1 texte pour comparaison.
const h1Texts = new Map<string, string | null>();
for (const p of pages) {
  if (p.horsIndex) continue;
  const html = fs.readFileSync(p.file, "utf8");
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  h1Texts.set(p.url, m ? m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : null);
}
{
  const byValue = new Map<string, string[]>();
  for (const [url, value] of h1Texts) {
    if (!value) continue;
    byValue.set(value, [...(byValue.get(value) || []), url]);
  }
  for (const [, urls] of byValue) {
    if (urls.length > 1) {
      for (const url of urls) {
        report(url, "h1-duplique", `H1 identique sur ${urls.length} pages : ${urls.filter((u) => u !== url).join(", ")}`);
      }
    }
  }
}

// ── Pages orphelines : aucun lien interne entrant depuis les autres pages HTML ──
const linkedTargets = new Set<string>();
for (const p of pages) {
  for (const link of p.internalLinks) {
    const normalized = link.replace(/\/$/, "") || "/";
    linkedTargets.add(normalized);
  }
}
for (const p of pages) {
  const normalizedUrl = p.url.replace(/\/$/, "") || "/";
  const isHomepage = normalizedUrl === "/";
  const isLegalOrUtility = /^\/(mentions-legales|politique-de-confidentialite|cgu|cookies)$/.test(normalizedUrl);
  if (!p.horsIndex && !isHomepage && !linkedTargets.has(normalizedUrl)) {
    report(p.url, "page-orpheline", "Aucun lien interne entrant trouvé depuis les autres pages HTML générées." + (isLegalOrUtility ? " (page légale : vérifier le lien footer.)" : ""));
  }
}

// ── Sortie ──
if (issues.length === 0) {
  console.log(`check-seo : ${pages.length} page(s) analysée(s), aucun problème détecté.`);
  process.exit(0);
}

const byRule = new Map<string, number>();
for (const issue of issues) byRule.set(issue.rule, (byRule.get(issue.rule) || 0) + 1);

issues
  .sort((a, b) => a.file.localeCompare(b.file))
  .forEach((issue) => console.log(`${issue.file} : [${issue.rule}] ${issue.message}`));

console.log(`\n${issues.length} problème(s) sur ${byRule.size} règle(s), ${pages.length} page(s) analysée(s) :`);
for (const [rule, count] of [...byRule.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  - ${rule} : ${count}`);
}

process.exit(1);
