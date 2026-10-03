/**
 * scripts/build-llms.ts
 *
 * Génère `public/llms-full.txt` (fiche J.1.8 / tâche L2.2) : concaténation Markdown des
 * offres, dispositifs, financeurs, types d'aides, secteurs, régions, glossaire et FAQ,
 * chacun précédé de son URL et de sa date de vérification. Appelé par `prebuild`.
 *
 * Chiffres clés lus dans config/chiffres.ts (aucun chiffre en dur), alignés sur la
 * ligne « Chiffres clés » de public/llms.txt (fichier statique, à tenir à jour à la main).
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
import { chiffres } from "../config/chiffres";

const OUT_PATH = path.join(process.cwd(), "public", "llms-full.txt");

function section(title: string, blocks: string[]): string {
  if (blocks.length === 0) return "";
  return `\n## ${title}\n\n${blocks.join("\n\n---\n\n")}\n`;
}

function verif(date?: string): string {
  return date ? `Vérifié : ${date}` : "Vérifié : non daté";
}

const virgule = (n: number, d: number) => n.toFixed(d).replace(".", ",");

function chiffresCles(): string {
  const items = [
    `plus de ${chiffres.projets.compteur} ${chiffres.projets.libelle} (${chiffres.dateChiffresLabel.toLowerCase()})`,
    chiffres.montantAidesObtenues !== null
      ? `${chiffres.montantAides.affichage} ${chiffres.montantAides.libelle} (${chiffres.montantAides.nombreAides} aides conventionnées, ${chiffres.montantAides.dateLabel})`
      : null,
    `${virgule(chiffres.satisfaction.recommandation, 1)}/${chiffres.satisfaction.recommandationSur} de recommandation et ${virgule(chiffres.satisfaction.satisfaction, 2)}/${chiffres.satisfaction.satisfactionSur} de satisfaction (${chiffres.satisfaction.methode.toLowerCase()})`,
  ].filter((x): x is string => Boolean(x));
  return `Chiffres clés : ${items.join(" ; ")}.\n`;
}

function main() {
  const parts: string[] = [`# ${site.name} : contenu complet\n`, chiffresCles()];

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
