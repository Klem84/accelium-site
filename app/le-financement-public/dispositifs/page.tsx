import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { getDispositifs, getFinanceur } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Les dispositifs de financement public",
    description:
      "Subventions, prêts, garanties, exonérations et crédits d'impôt mobilisables par les entreprises : taux, calendrier et procédure, vérifiés dispositif par dispositif.",
  },
  "/le-financement-public/dispositifs"
);

const FAMILLES: Record<string, string> = {
  subventions: "Subventions",
  prets: "Prêts",
  garanties: "Garanties",
  exonerations: "Exonérations",
  "credits-impot": "Crédits d'impôt",
};

export default function DispositifsHub() {
  const dispositifs = getDispositifs();

  const groupes = Object.entries(FAMILLES)
    .map(([key, label]) => ({
      key,
      label,
      items: dispositifs.filter((d) => d.famille === key),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHero
        kicker="Le financement public"
        title="Les dispositifs de financement public"
        intro="Chaque dispositif est vérifié auprès de sa source officielle : taux, plafonds, calendrier et procédure, avec la date de dernière vérification."
        crumbs={[
          { name: "Le financement public", url: "/le-financement-public" },
          { name: "Dispositifs", url: "/le-financement-public/dispositifs" },
        ]}
      />

      <section className="wrap py-16 lg:py-24">
        {dispositifs.length === 0 ? (
          <div className="rounded-2xl border border-line bg-cream p-10 text-center max-w-2xl mx-auto">
            <p className="display text-[1.2rem] font-600 text-ink">
              Les fiches dispositifs sont en cours de rédaction et de vérification.
            </p>
            <p className="mt-2 text-body">
              Elles seront publiées ici au fil de leur vérification auprès des financeurs.
            </p>
          </div>
        ) : (
          <div className="space-y-14 lg:space-y-20">
            {groupes.map((g) => (
              <div key={g.key}>
                <h2 className="display text-[1.5rem] lg:text-[1.8rem] font-600 text-ink pb-5 border-b border-line mb-7">
                  {g.label}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {g.items.map((d) => {
                    const financeur = d.financeur ? getFinanceur(d.financeur) : undefined;
                    return (
                      <Link
                        key={d.slug}
                        href={`/le-financement-public/dispositifs/${d.slug}`}
                        className="group flex flex-col rounded-2xl border border-line bg-surface p-6 hover:border-ink hover:shadow-soft transition-all focusable"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="display text-[1.15rem] font-600 text-ink group-hover:text-orange700 transition-colors">
                            {d.nomCourt || d.nom}
                          </h3>
                          <span className="text-orange text-xl transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </div>
                        {financeur && <p className="text-[0.78rem] font-500 text-slate mt-1">{financeur.nom}</p>}
                        <p className="mt-3 text-[0.9rem] text-body leading-relaxed flex-1">{d.definition}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <CtaBlock />
    </>
  );
}
