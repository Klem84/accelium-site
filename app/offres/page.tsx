import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { getOffres } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Nos offres en financements publics | Accelium",
    description:
      "Recherche d'aides, CIR/CII, agrément, internalisation, veille : découvrez les offres d'Accelium pour financer et sécuriser vos projets.",
  },
  "/offres"
);

export default function OffresHub() {
  const offres = getOffres();
  return (
    <>
      <PageHero
        kicker="Nos offres"
        title="Une réponse pour chaque besoin de financement"
        intro="Du montage de subvention à la maîtrise de votre crédit d'impôt, nous couvrons tout le spectre du financement public."
        crumbs={[{ name: "Nos offres", url: "/offres" }]}
      />
      <section className="wrap py-16 lg:py-24">
        <div className="border-t border-line">
          {offres.map((o, i) => (
            <Link
              key={o.slug}
              href={`/offres/${o.slug}`}
              className="group focusable grid md:grid-cols-12 gap-4 items-center py-8 border-b border-line"
            >
              <span className="md:col-span-1 display text-[1.3rem] font-600 text-orange">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="md:col-span-5 display text-[clamp(1.4rem,1.1rem_+_1.2vw,2rem)] font-500 text-ink group-hover:text-orange700 transition-colors">
                {o.nomCourt}
              </h2>
              <p className="md:col-span-5 text-[0.97rem] text-body">{o.accroche}</p>
              <span className="md:col-span-1 md:text-right text-orange text-2xl transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
