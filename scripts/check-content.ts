/**
 * scripts/check-content.ts
 *
 * Vérifie le contenu source (MDX + config + textes des pages) avant build :
 * placeholders, tirets interdits, lorem, seo.title trop long, seo.description
 * manquante, fraîcheur/sources des fiches dispositifs et régions, pourcentages
 * d'honoraires.
 *
 * Usage : npx tsx scripts/check-content.ts [--warn-only]
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const WARN_ONLY = process.argv.includes("--warn-only");

type Issue = { file: string; line: number; rule: string; message: string };
const issues: Issue[] = [];

function report(file: string, line: number, rule: string, message: string) {
  issues.push({ file: path.relative(ROOT, file).replace(/\\/g, "/"), line, rule, message });
}

// ── Collecte des fichiers à analyser ──
function walk(dir: string, exts: string[], acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, exts, acc);
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      acc.push(full);
    }
  }
  return acc;
}

const contentFiles = walk(path.join(ROOT, "content"), [".mdx", ".md"]);
const libFiles = walk(path.join(ROOT, "lib"), [".ts", ".tsx"]);
const configFiles = walk(path.join(ROOT, "config"), [".ts", ".mjs"]);
const appTextFiles = walk(path.join(ROOT, "app"), [".tsx"]);

const allTextFiles = [...contentFiles, ...libFiles, ...configFiles, ...appTextFiles];

// ── Règles texte ligne à ligne ──
const PLACEHOLDER_RE = /(À COMPLÉTER|A COMPLETER)/;
const LOREM_RE = /lorem/i;
const EM_DASH = "—"; // —
const EN_DASH = "–"; // –
const HONORAIRES_PCT_RE = /\b\d{1,3}\s?%\s*(d[e']\s*)?honoraires\b|honoraires[^.\n]{0,15}\d{1,3}\s?%/i;

function isFrontmatterDelimiterLine(line: string, lineIndex: number, lines: string[]): boolean {
  // Les frontmatters YAML utilisent des lignes « --- » seules pour ouvrir/fermer le bloc.
  return line.trim() === "---";
}

function isCliFlagOrCssCustomProperty(line: string): boolean {
  // Flags CLI (--warn-only, --foo=bar) ou custom properties CSS (--color-ink: ...)
  return /(^|[\s"'`(])--[a-zA-Z][\w-]*(\s|=|:|$)/.test(line);
}

function checkTextRules(file: string, raw: string, isMdx: boolean) {
  const lines = raw.split(/\r?\n/);
  let inFrontmatter = false;
  let frontmatterDelims = 0;

  lines.forEach((line, idx) => {
    const lineNo = idx + 1;

    if (isMdx && line.trim() === "---" && (idx === 0 || frontmatterDelims === 1)) {
      frontmatterDelims++;
      inFrontmatter = frontmatterDelims === 1;
      return;
    }

    // Ignore les commentaires de code (custom properties CSS, flags CLI) pour --.
    const isCodeLikeDoubleDash = isCliFlagOrCssCustomProperty(line);

    if (PLACEHOLDER_RE.test(line)) {
      report(file, lineNo, "placeholder", "Placeholder « À COMPLÉTER » trouvé.");
    }
    if (LOREM_RE.test(line)) {
      report(file, lineNo, "lorem", "Texte « lorem » (texte de remplissage) trouvé.");
    }
    if (line.includes(EM_DASH)) {
      report(file, lineNo, "tiret-long", "Tiret long « — » (U+2014) interdit dans le texte.");
    }
    if (line.includes(EN_DASH)) {
      report(file, lineNo, "tiret-moyen", "Tiret moyen « – » (U+2013) interdit dans le texte.");
    }
    // Le double tiret « -- » n'est vérifié que dans le contenu MDX (texte éditorial) : dans les
    // fichiers .ts/.tsx, "--" apparaît légitimement dans du code (regex, décrément i--, flags CLI,
    // custom properties CSS) et une détection fiable en texte JSX pur n'est pas possible ligne à ligne.
    if (isMdx && !isCodeLikeDoubleDash && !inFrontmatter && line.includes("--") && !isFrontmatterDelimiterLine(line, idx, lines)) {
      // Exclut aussi les séparateurs de tableau markdown (|---|---|) et les liens/identifiants avec double tiret technique.
      const isMarkdownTableSeparator = /^\s*\|?[\s:-]+\|[\s:|-]+$/.test(line);
      if (!isMarkdownTableSeparator) {
        report(file, lineNo, "double-tiret", "Double tiret « -- » interdit dans le texte (hors flags CLI / CSS custom properties).");
      }
    }
    if (HONORAIRES_PCT_RE.test(line)) {
      report(file, lineNo, "honoraires-pourcentage", "Pourcentage accolé au mot « honoraires » : aucune mention d'honoraires autorisée.");
    }
  });
}

for (const file of allTextFiles) {
  const raw = fs.readFileSync(file, "utf8");
  checkTextRules(file, raw, file.endsWith(".mdx") || file.endsWith(".md"));
}

// ── Règles frontmatter MDX ──
const DISPOSITIF_REGION_DIRS = ["dispositifs", "regions"];

for (const file of contentFiles) {
  const raw = fs.readFileSync(file, "utf8");
  const { data } = matter(raw);
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const collection = rel.split("/")[1]; // content/<collection>/...

  // seo.title / seo.description
  const seo = (data as Record<string, unknown>).seo as { title?: string; description?: string } | undefined;
  if (seo) {
    if (typeof seo.title === "string" && seo.title.length > 60) {
      report(file, 1, "seo-title-trop-long", `seo.title fait ${seo.title.length} caractères (max 60) : "${seo.title}"`);
    }
    if (!seo.description || !seo.description.trim()) {
      report(file, 1, "seo-description-manquante", "seo.description manquante.");
    }
  } else if (collection !== "auteurs") {
    // Les pages de contenu doivent porter un bloc seo ; les fiches auteurs sont hors périmètre SEO direct.
    report(file, 1, "seo-manquant", "Bloc seo (title/description) absent du frontmatter.");
  }

  // Dispositifs / régions : derniereVerification + au moins 3 sources.
  if (DISPOSITIF_REGION_DIRS.includes(collection)) {
    const derniereVerification = (data as Record<string, unknown>).derniereVerification;
    if (!derniereVerification || String(derniereVerification).trim() === "") {
      report(file, 1, "fraicheur-manquante", "derniereVerification absente pour une fiche dispositif/région.");
    }
    const sources = (data as Record<string, unknown>).sources;
    const sourcesCount = Array.isArray(sources) ? sources.length : 0;
    if (sourcesCount < 3) {
      report(file, 1, "sources-insuffisantes", `${sourcesCount} source(s) trouvée(s) (minimum 3 requis) pour une fiche dispositif/région.`);
    }
  }

  // todo: true
  if ((data as Record<string, unknown>).todo === true) {
    report(file, 1, "todo-true", "Frontmatter marqué todo: true.");
  }
}

// todo: true dans les fichiers lib/*.ts (objets de données, hors frontmatter MDX)
for (const file of libFiles) {
  const raw = fs.readFileSync(file, "utf8");
  raw.split(/\r?\n/).forEach((line, idx) => {
    if (/\btodo\s*:\s*true\b/.test(line)) {
      report(file, idx + 1, "todo-true", "todo: true trouvé.");
    }
  });
}

// ── Sortie ──
const byRule = new Map<string, number>();
for (const issue of issues) {
  byRule.set(issue.rule, (byRule.get(issue.rule) || 0) + 1);
}

if (issues.length === 0) {
  console.log("check-content : aucun problème détecté.");
  process.exit(0);
}

issues
  .sort((a, b) => (a.file === b.file ? a.line - b.line : a.file.localeCompare(b.file)))
  .forEach((issue) => {
    console.log(`${issue.file}:${issue.line} : [${issue.rule}] ${issue.message}`);
  });

console.log(`\n${issues.length} problème(s) sur ${byRule.size} règle(s) :`);
for (const [rule, count] of [...byRule.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  - ${rule} : ${count}`);
}

if (WARN_ONLY) {
  console.log("\n--warn-only : sortie 0 malgré les problèmes ci-dessus.");
  process.exit(0);
}

process.exit(1);
