/**
 * scripts/check-freshness.ts (L8.5)
 *
 * Signale (avertissement uniquement, ne fait jamais échouer) les fiches de
 * contenu dont `derniereVerification` a plus de 6 mois, ou est absente sur
 * une collection qui devrait la porter (dispositifs, régions, financeurs,
 * secteurs).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const SIX_MONTHS_MS = 183 * 24 * 60 * 60 * 1000;

// Collections où la fraîcheur de l'information a un sens (chiffres, taux, dispositifs).
const WATCHED_COLLECTIONS = ["dispositifs", "regions", "financeurs", "secteurs"];

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const str = String(value).trim();
  // Formats attendus : "juin 2026", "2026-06", "2026-06-15"
  const isoMatch = str.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3] || "1"));
  }
  const moisFr: Record<string, number> = {
    janvier: 0, février: 1, fevrier: 1, mars: 2, avril: 3, mai: 4, juin: 5,
    juillet: 6, août: 7, aout: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11, decembre: 11,
  };
  const frMatch = str.toLowerCase().match(/^([a-zéû]+)\s+(\d{4})$/);
  if (frMatch && moisFr[frMatch[1]] !== undefined) {
    return new Date(Number(frMatch[2]), moisFr[frMatch[1]], 1);
  }
  const generic = new Date(str);
  if (!isNaN(generic.getTime())) return generic;
  return null;
}

type Stale = { file: string; collection: string; derniereVerification: string | null; ageJours: number | null };
const stale: Stale[] = [];
const now = new Date();

for (const collection of WATCHED_COLLECTIONS) {
  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue;
    if (file.startsWith("_")) continue;
    const full = path.join(dir, file);
    const { data } = matter(fs.readFileSync(full, "utf8"));
    const raw = (data as Record<string, unknown>).derniereVerification as string | undefined;
    const date = parseDate(raw);
    const rel = path.relative(ROOT, full).replace(/\\/g, "/");

    if (!raw) {
      stale.push({ file: rel, collection, derniereVerification: null, ageJours: null });
      continue;
    }
    if (!date) {
      stale.push({ file: rel, collection, derniereVerification: raw, ageJours: null });
      continue;
    }
    const ageMs = now.getTime() - date.getTime();
    if (ageMs > SIX_MONTHS_MS) {
      stale.push({ file: rel, collection, derniereVerification: raw, ageJours: Math.round(ageMs / (24 * 60 * 60 * 1000)) });
    }
  }
}

if (stale.length === 0) {
  console.log("check-freshness : aucune fiche de plus de 6 mois ou sans derniereVerification.");
  process.exit(0);
}

stale
  .sort((a, b) => a.file.localeCompare(b.file))
  .forEach((s) => {
    if (s.derniereVerification === null) {
      console.log(`${s.file} : [fraicheur] derniereVerification absente.`);
    } else if (s.ageJours === null) {
      console.log(`${s.file} : [fraicheur] derniereVerification illisible : "${s.derniereVerification}".`);
    } else {
      console.log(`${s.file} : [fraicheur] derniereVerification "${s.derniereVerification}" vieille de ${s.ageJours} jours (> 6 mois).`);
    }
  });

console.log(`\n${stale.length} fiche(s) à vérifier ou dater. Avertissement uniquement, sortie 0.`);
process.exit(0);
