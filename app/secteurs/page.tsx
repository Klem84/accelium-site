import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { getSecteurs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Nos secteurs d'intervention | Accelium",
    description:
      "Chaque filière a ses financeurs, ses dispositifs et son calendrier. Découvrez les aides mobilisables dans votre secteur avec Accelium.",
  },
  "/secteurs"
);

export default function SecteursHub() {
  const secteurs = getSecteurs();
  return (
    <>
      <PageHero
        kicker="Secteurs"
        title="Nous connaissons votre secteur"
        intro="Chaque filière a ses financeurs, ses dispositifs et son calendrier. Découvrez les aides mobilisables dans la vôtre."
        crumbs={[{ name: "Secteurs", url: "/secteurs" }]}
      />
      <section className="wrap py-16 lg:py-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {secteurs.map((s) => (
            <Link
              key={s.slug}
              href={`/secteurs/${s.slug}`}
              className="group focusable relative rounded-xl overflow-hidden aspect-[3/4] photo"
            >
              {s.image && <img src={s.image} alt={s.nom} className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <span className="absolute left-4 bottom-4 text-white font-600 display text-[1.15rem]">{s.nom}</span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
