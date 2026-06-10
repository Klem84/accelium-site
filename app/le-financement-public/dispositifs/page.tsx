import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { getDispositifs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Les dispositifs de financement public | Accelium",
    description:
      "CIR, CII, C3IV, France 2030, CEE, Fonds Chaleur, DECARB IND : les principaux dispositifs d'aide aux entreprises, expliqués par Accelium.",
  },
  "/le-financement-public/dispositifs"
);

export default function DispositifsHub() {
  const dispositifs = getDispositifs();
  return (
    <>
      <PageHero
        kicker="Dispositifs"
        title="Les dispositifs de financement public"
        intro="Crédits d'impôt, appels à projets, primes : les principaux leviers mobilisables pour vos projets."
        crumbs={[
          { name: "Le financement public", url: "/le-financement-public" },
          { name: "Dispositifs", url: "/le-financement-public/dispositifs" },
        ]}
      />
      <section className="wrap py-16 lg:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dispositifs.map((d) => (
            <Link
              key={d.slug}
              href={`/le-financement-public/dispositifs/${d.slug}`}
              className="group rounded-2xl border border-line bg-surface p-6 hover:border-ink transition-colors focusable"
            >
              {d.annee && <span className="kicker text-orange700">{d.annee}</span>}
              <h2 className="display text-[1.25rem] font-600 text-ink group-hover:text-orange700 mt-1">{d.nom}</h2>
              <p className="mt-2 text-[0.9rem] text-body">{d.definition}</p>
              <span className="mt-4 inline-block text-orange text-xl transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
