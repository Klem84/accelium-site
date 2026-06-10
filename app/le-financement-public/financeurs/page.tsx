import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { getFinanceurs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Les financeurs publics des entreprises | Accelium",
    description:
      "ADEME, Bpifrance, FranceAgriMer, Régions, AID, Union européenne : qui finance les entreprises et comment mobiliser chaque acteur.",
  },
  "/le-financement-public/financeurs"
);

export default function FinanceursHub() {
  const financeurs = getFinanceurs();
  return (
    <>
      <PageHero
        kicker="Financeurs"
        title="Qui finance les entreprises ?"
        intro="Le soutien public se déploie à plusieurs échelons : l'Europe, l'État et ses opérateurs, les Régions et des acteurs spécialisés."
        crumbs={[
          { name: "Le financement public", url: "/le-financement-public" },
          { name: "Financeurs", url: "/le-financement-public/financeurs" },
        ]}
      />
      <section className="wrap py-16 lg:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {financeurs.map((f) => (
            <Link
              key={f.slug}
              href={`/le-financement-public/financeurs/${f.slug}`}
              className="group rounded-2xl border border-line bg-surface p-6 hover:border-ink transition-colors focusable"
            >
              <h2 className="display text-[1.3rem] font-600 text-ink group-hover:text-orange700">{f.nom}</h2>
              <p className="mt-2 text-[0.9rem] text-body">{f.seo.description}</p>
              <span className="mt-4 inline-block text-orange text-xl transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
