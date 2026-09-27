/**
 * scripts/check-links.ts
 *
 * Vérifie, sur le HTML généré par `next build`, que tous les liens internes
 * pointent vers une page générée, une route dynamique connue, une redirection
 * de config/redirects.mjs ou un fichier de public/. Liste les liens morts.
 * Nécessite un build préalable ; si absent, avertit et sort en 0.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BUILD_DIR = path.join(ROOT, ".next", "server", "app");
const PUBLIC_DIR = path.join(ROOT, "public");

if (!fs.existsSync(BUILD_DIR)) {
  console.log("check-links : build requis (exécutez `next build` avant ce script). Avertissement, pas d'échec.");
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

function walkPublic(dir: string, base: string, acc: Set<string>) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = base + "/" + entry.name;
    if (entry.isDirectory()) {
      walkPublic(full, rel, acc);
    } else {
      acc.add(rel);
    }
  }
}

const htmlFiles = walkHtml(BUILD_DIR);
if (htmlFiles.length === 0) {
  console.log("check-links : aucun fichier HTML trouvé sous .next/server/app. Avertissement, pas d'échec.");
  process.exit(0);
}

function urlFromFile(file: string): string {
  let rel = path.relative(BUILD_DIR, file).replace(/\\/g, "/");
  rel = rel.replace(/\.html$/, "");
  rel = rel.replace(/\/index$/, "");
  rel = rel.replace(/^index$/, "");
  return "/" + rel;
}

// ── Pages générées ──
const generatedPages = new Set<string>();
for (const file of htmlFiles) {
  generatedPages.add(urlFromFile(file).replace(/\/$/, "") || "/");
}

// ── Routes dynamiques connues : tout segment [slug] devient un motif accepté ──
// Ex : app/offres/[slug]/page.tsx -> /offres/:slug accepte /offres/<n'importe quoi>
function findDynamicPrefixes(): string[] {
  const appDir = path.join(ROOT, "app");
  const prefixes: string[] = [];
  function walk(dir: string, urlPrefix: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith("[")) {
        prefixes.push(urlPrefix);
      } else if (entry.name.startsWith("(") || entry.name === "api") {
        continue;
      } else {
        walk(path.join(dir, entry.name), urlPrefix + "/" + entry.name);
      }
    }
  }
  walk(appDir, "");
  return prefixes;
}
const dynamicPrefixes = findDynamicPrefixes();

// ── Redirections configurées ──
const redirectsPath = path.join(ROOT, "config", "redirects.mjs");
const redirectSources = new Set<string>();
if (fs.existsSync(redirectsPath)) {
  const raw = fs.readFileSync(redirectsPath, "utf8");
  for (const m of raw.matchAll(/source:\s*"([^"]+)"/g)) {
    redirectSources.add(m[1].replace(/\/:slug\*?$/, ""));
  }
}

// ── Fichiers publics ──
const publicFiles = new Set<string>();
walkPublic(PUBLIC_DIR, "", publicFiles);

// ── Fichiers générés à la racine de app/ (robots.ts, sitemap.ts, icon.svg, manifest.ts, etc.) ──
const rootGeneratedFiles = new Set(["/robots.txt", "/sitemap.xml", "/favicon.ico", "/icon.svg", "/apple-icon.png", "/manifest.webmanifest", "/llms.txt", "/llms-full.txt"]);

type LinkIssue = { fromUrl: string; link: string };
const deadLinks: LinkIssue[] = [];

function isKnownTarget(link: string): boolean {
  // Ignore ancres et paramètres pour la comparaison de chemin, mais garde le lien complet pour l'affichage.
  const [pathname] = link.split("#");
  const [cleanPath] = pathname.split("?");
  const normalized = cleanPath.replace(/\/$/, "") || "/";

  if (generatedPages.has(normalized)) return true;
  if (rootGeneratedFiles.has(normalized)) return true;
  if (publicFiles.has(normalized)) return true;
  if (redirectSources.has(normalized)) return true;
  if (dynamicPrefixes.some((prefix) => normalized === prefix || normalized.startsWith(prefix + "/"))) return true;
  // API routes : ne sont pas des pages HTML mais sont des cibles valides (formulaires, etc.)
  if (normalized.startsWith("/api/")) return true;

  return false;
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const fromUrl = urlFromFile(file);
  const links = [...html.matchAll(/<a[^>]*href=["'](\/[^"'\s]*)["'][^>]*>/gi)].map((m) => m[1]);
  const seen = new Set<string>();
  for (const link of links) {
    if (seen.has(link)) continue;
    seen.add(link);
    if (!isKnownTarget(link)) {
      deadLinks.push({ fromUrl, link });
    }
  }
}

if (deadLinks.length === 0) {
  console.log(`check-links : ${htmlFiles.length} page(s) analysée(s), aucun lien mort trouvé.`);
  process.exit(0);
}

deadLinks
  .sort((a, b) => a.fromUrl.localeCompare(b.fromUrl))
  .forEach((issue) => console.log(`${issue.fromUrl} : [lien-mort] -> ${issue.link}`));

console.log(`\n${deadLinks.length} lien(s) mort(s) trouvé(s).`);
process.exit(1);
