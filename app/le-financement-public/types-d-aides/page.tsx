import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Les types d'aides aux entreprises",
    description:
      "Subventions, prêts et avances remboursables, garanties, exonérations, crédits d'impôt : les cinq grandes formes d'aides publiques, souvent cumulables.",
  },
  "/le-financement-public/types-d-aides"
);

const types = [
  {
    slug: "subventions",
    nom: "Subventions",
    desc: "L'aide non remboursable, en soutien d'un projet d'investissement, d'innovation ou de transition. La plus recherchée — tout se joue dans le dossier.",
  },
  {
    slug: "prets",
    nom: "Prêts & avances remboursables",
    desc: "Des financements à rembourser, mais sans garantie, avec différé et à taux nul ou bonifié. Financer la croissance sans diluer le capital.",
  },
  {
    slug: "garanties",
    nom: "Garanties",
    desc: "Un appui public qui couvre une partie du risque d'un emprunt bancaire et débloque l'accès au crédit.",
  },
  {
    slug: "exonerations",
    nom: "Exonérations",
    desc: "Des allègements fiscaux ou sociaux, souvent liés à un statut (JEI, zones spécifiques…), qui réduisent durablement les charges.",
  },
  {
    slug: "credits-impot",
    nom: "Crédits d'impôt",
    desc: "CIR, CII, C3IV : la voie fiscale. Vous vous l'« auto-attribuez » — à condition de sécuriser l'assiette et la justification.",
  },
];

export default function TypesAidesHub() {
  return (
    <>
      <PageHero
        kicker="Types d'aides"
        title="Sous quelles formes sont versées les aides ?"
        intro="Cinq grandes formes, souvent cumulables. Accelium est spécialisé sur l'ensemble du spectre — au-delà du seul crédit d'impôt — pour combiner les leviers et maximiser votre financement."
        crumbs={[
          { name: "Le financement public", url: "/le-financement-public" },
          { name: "Types d'aides", url: "/le-financement-public/types-d-aides" },
        ]}
      />
      <section className="wrap py-16 lg:py-24">
        <div className="grid sm:grid-cols-2 gap-4">
          {types.map((t) => (
            <Link
              key={t.slug}
              href={`/le-financement-public/types-d-aides/${t.slug}`}
              className="group rounded-2xl border border-line bg-surface p-7 hover:border-ink transition-colors focusable"
            >
              <h2 className="display text-[1.3rem] font-600 text-ink group-hover:text-orange700">{t.nom}</h2>
              <p className="mt-2 text-[0.92rem] text-body">{t.desc}</p>
              <span className="mt-4 inline-block text-orange text-xl transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
