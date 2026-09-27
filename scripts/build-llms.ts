/**
 * scripts/build-llms.ts
 *
 * Génère `public/llms-full.txt` (fiche J.1.8 / tâche L2.2) : concaténation Markdown des
 * offres, dispositifs, financeurs, types d'aides, secteurs, régions, glossaire et FAQ,
 * chacun précédé de son URL et de sa date de vérification. Appelé par `prebuild`.
 *
 * Tolère l'absence de collections pas encore livrées (content/dispositifs, content/regions).
 */
import fs from "node:fs";
import path from "node:path";
import {
  getOffres,
  getDispositifs,
  getFinanceurs,
  getSecteurs,
  getRegions,
  getGlossaire,
  getFaqTransversale,
} from "../lib/content";
import { site } from "../config/site";

const OUT_PATH = path.join(process.cwd(), "public", "llms-full.txt");

function section(title: string, blocks: string[]): string {
  if (blocks.length === 0) return "";
  return `\n## ${title}\n\n${blocks.join("\n\n---\n\n")}\n`;
}

function verif(date?: string): string {
  return date ? `Vérifié : ${date}` : "Vérifié : non daté";
}

function main() {
  const parts: string[] = [`# ${site.name} : contenu complet\n`];

  parts.push(
    section(
      "Types d'aides",
      ["subventions", "prets", "garanties", "exonerations", "credits-impot"].map(
        (slug) => `### ${slug}\n${site.url}/le-financement-public/types-d-aides/${slug}`
      )
    )
  );

  parts.push(
    section(
      "Offres",
      getOffres().map(
        (o) =>
          `### ${o.h1}\n${site.url}/offres/${o.slug}\n${verif()}\n\n${o.accroche}`
      )
    )
  );

  parts.push(
    section(
      "Dispositifs",
      getDispositifs().map(
        (d) =>
          `### ${d.h1}\n${site.url}/le-financement-public/dispositifs/${d.slug}\n${verif(d.derniereVerification)}\n\n${d.definition}`
      )
    )
  );

  parts.push(
    section(
      "Financeurs",
      getFinanceurs().map((f) => `### ${f.h1}\n${site.url}/le-financement-public/financeurs/${f.slug}`)
    )
  );

  parts.push(
    section(
      "Secteurs",
      getSecteurs().map(
        (s) =>
          `### ${s.h1}\n${site.url}/secteurs/${s.slug}\n${verif(s.derniereVerification)}\n\n${s.accroche}`
      )
    )
  );

  parts.push(
    section(
      "Régions",
      getRegions().map(
        (r) =>
          `### ${r.h1}\n${site.url}/regions/${r.slug}\n${verif(r.derniereVerification)}\n\n${r.definition}`
      )
    )
  );

  const glossaire = getGlossaire();
  parts.push(
    section(
      "Glossaire",
      (glossaire.termes || []).map((t) => `### ${t.terme}\n${t.definition}`)
    )
  );

  const faq = getFaqTransversale();
  parts.push(
    section(
      "Questions fréquentes",
      (faq.themes || []).flatMap((theme) =>
        theme.questions.map((q) => `### ${q.question}\n${q.reponse}`)
      )
    )
  );

  const content = parts.filter(Boolean).join("\n").trim() + "\n";
  fs.writeFileSync(OUT_PATH, content, "utf8");
  console.log(`build-llms : ${OUT_PATH} généré (${content.length} caractères).`);
}

main();
