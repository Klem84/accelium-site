import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { getFinanceurs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { IconEurope, IconEtat, IconRegion } from "@/components/blocks/Icons";

export const metadata: Metadata = buildMetadata(
  {
    title: "Les financeurs publics des entreprises",
    description:
      "ADEME, Bpifrance, FranceAgriMer, Régions, AID, Union européenne : qui finance les entreprises et comment mobiliser chaque acteur.",
  },
  "/le-financement-public/financeurs"
);

const groupes = [
  {
    echelon: "Europe",
    Icon: IconEurope,
    note: "Encadre et cofinance les grands programmes.",
  },
  {
    echelon: "État",
    Icon: IconEtat,
    note: "Impulse les aides de filière, fiscales et France 2030.",
  },
  {
    echelon: "Région",
    Icon: IconRegion,
    note: "Décide les aides au plus près du terrain.",
  },
];

export default function FinanceursHub() {
  const financeurs = getFinanceurs();

  return (
    <>
      <PageHero
        kicker="Financeurs"
        title="Qui finance les entreprises ?"
        intro="Le soutien public se déploie à plusieurs échelons : l'Europe, l'État et ses opérateurs, les Régions. Ils se complètent, et souvent se cumulent."
        crumbs={[
          { name: "Le financement public", url: "/le-financement-public" },
          { name: "Financeurs", url: "/le-financement-public/financeurs" },
        ]}
      />

      <section className="wrap py-16 lg:py-24">
        <div className="space-y-14 lg:space-y-20">
          {groupes.map((g) => {
            const items = financeurs.filter((f) => f.echelon === g.echelon);
            if (items.length === 0) return null;
            return (
              <div key={g.echelon}>
                <div className="flex items-center gap-4 mb-7 pb-5 border-b border-line">
                  <span className="inline-flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-ink text-white">
                    <g.Icon className="w-6 h-6" />
                  </span>
                  <div>
                    <h2 className="display text-[1.5rem] lg:text-[1.8rem] font-600 text-ink leading-none">
                      {g.echelon}
                    </h2>
                    <p className="text-[0.9rem] text-body mt-1">{g.note}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((f) => (
                    <Link
                      key={f.slug}
                      href={`/le-financement-public/financeurs/${f.slug}`}
                      className="group flex flex-col rounded-2xl border border-line bg-surface p-6 hover:border-ink hover:shadow-soft transition-all focusable"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="display text-[1.25rem] font-600 text-ink group-hover:text-orange700 transition-colors">
                          {f.nom}
                        </h3>
                        <span className="text-orange text-xl transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                      {f.echelonNote && (
                        <p className="text-[0.78rem] font-500 text-slate mt-1">{f.echelonNote}</p>
                      )}
                      {f.pourQui && (
                        <p className="mt-3 text-[0.9rem] text-body leading-relaxed flex-1">{f.pourQui}</p>
                      )}
                      {f.interventions && (
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {f.interventions.slice(0, 3).map((i) => (
                            <li
                              key={i}
                              className="inline-flex rounded-full bg-cream border border-line px-3 py-1 text-[0.76rem] font-500 text-slateD"
                            >
                              {i}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
