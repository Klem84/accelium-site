import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { Mdx } from "@/components/Mdx";
import { getPage, getDispositifs, getFinanceurs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const SLUG = "le-financement-public";

export function generateMetadata(): Metadata {
  const p = getPage(SLUG);
  return buildMetadata(
    p?.seo || {
      title: "Le financement public en France : le guide | Accelium",
      description:
        "Subventions, prêts, crédits d'impôt : comprenez le financement public des entreprises et identifiez vos aides. Diagnostic gratuit.",
    },
    `/${SLUG}`
  );
}

const typesAides = [
  { slug: "subventions", nom: "Subventions" },
  { slug: "prets", nom: "Prêts & avances remboursables" },
  { slug: "credits-impot", nom: "Crédits d'impôt" },
  { slug: "garanties", nom: "Garanties" },
  { slug: "exonerations", nom: "Exonérations" },
];

export default function PilierPage() {
  const p = getPage(SLUG);
  const dispositifs = getDispositifs().slice(0, 8);
  const financeurs = getFinanceurs();

  return (
    <>
      <PageHero
        kicker="Le financement public"
        title={p?.h1 || "Le financement public en France : comprendre, identifier et mobiliser les aides"}
        intro={p?.intro}
        crumbs={[{ name: "Le financement public", url: `/${SLUG}` }]}
      />

      <section className="wrap py-16 lg:py-24">
        <div className="max-w-[70ch]">{p?.body && <Mdx source={p.body} />}</div>

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-line bg-cream p-8">
            <h2 className="display text-[1.5rem] font-600 text-ink">Les financeurs</h2>
            <p className="mt-2 text-[0.92rem] text-body">De l'échelon local à l'Europe.</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {financeurs.map((f) => (
                <li key={f.slug}>
                  <Link
                    href={`/le-financement-public/financeurs/${f.slug}`}
                    className="inline-flex rounded-full border border-line bg-surface px-4 py-2 text-[0.9rem] font-500 text-ink hover:border-ink focusable"
                  >
                    {f.nom}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/le-financement-public/financeurs" className="mt-6 inline-flex items-center gap-1 text-orange700 font-600 focusable">
              Tous les financeurs →
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-cream p-8">
            <h2 className="display text-[1.5rem] font-600 text-ink">Les types d'aides</h2>
            <p className="mt-2 text-[0.92rem] text-body">Cinq grandes formes, souvent cumulables.</p>
            <ul className="mt-5 space-y-2">
              {typesAides.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/le-financement-public/types-d-aides/${t.slug}`}
                    className="inline-flex items-center gap-1 text-ink font-500 hover:text-orange700 focusable"
                  >
                    {t.nom} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="display h-sec font-600 text-ink mb-6">Les dispositifs phares</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {dispositifs.map((d) => (
              <Link
                key={d.slug}
                href={`/le-financement-public/dispositifs/${d.slug}`}
                className="group rounded-2xl border border-line bg-surface p-5 hover:border-ink transition-colors focusable"
              >
                <span className="display text-[1.1rem] font-600 text-ink group-hover:text-orange700">{d.nom}</span>
                <span className="block mt-2 text-[0.88rem] text-body">{d.definition}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
