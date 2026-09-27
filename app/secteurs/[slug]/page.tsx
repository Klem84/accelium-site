import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { CasGrid, type CasCard } from "@/components/blocks/CasGrid";
import { Mdx } from "@/components/Mdx";
import { getSecteur, getSecteurs, getCasClients, getDispositifs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { estNoindexTemporaire } from "@/config/indexation";

export function generateStaticParams() {
  return getSecteurs().map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getSecteur(params.slug);
  if (!s) return {};
  const noindex = s.seo.noindex || estNoindexTemporaire(`secteurs/${s.slug}`);
  return buildMetadata({ ...s.seo, noindex }, `/secteurs/${s.slug}`);
}

export default function SecteurPage({ params }: { params: { slug: string } }) {
  const s = getSecteur(params.slug);
  if (!s) notFound();

  const dispositifs = getDispositifs();
  const cas = getCasClients()
    .filter((c) => c.secteur === s.slug)
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  const casItems: CasCard[] = cas.map((c) => ({
    slug: c.slug,
    montant: c.montant,
    titre: c.titre,
    contexte: c.contexte,
  }));

  return (
    <>
      <PageHero
        kicker="Secteur"
        title={s.h1}
        intro={s.accroche}
        crumbs={[
          { name: "Secteurs", url: "/secteurs" },
          { name: s.nom, url: `/secteurs/${s.slug}` },
        ]}
      />

      <section className="wrap py-16 lg:py-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <Mdx source={s.body} />
        </div>
        <aside className="lg:col-span-5">
          {s.aides?.length ? (
            <div className="rounded-2xl border border-line bg-cream p-7">
              <p className="kicker text-orange700 mb-5">Principales aides mobilisables</p>
              <ul className="space-y-4">
                {s.aides.map((a, i) => {
                  const d = a.dispositif ? dispositifs.find((x) => x.slug === a.dispositif) : undefined;
                  return (
                    <li key={i} className="border-b border-line pb-4 last:border-0 last:pb-0">
                      <p className="display text-[1.05rem] font-600 text-ink">{a.famille}</p>
                      <p className="text-[0.92rem] text-body mt-1">{a.finance}</p>
                      {d && (
                        <Link
                          href={`/le-financement-public/dispositifs/${d.slug}`}
                          className="inline-flex items-center gap-1 text-[0.85rem] font-600 text-orange700 mt-2 focusable"
                        >
                          {d.nom} <span>→</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
          {s.derniereVerification && (
            <p className="mt-4 text-[0.8rem] text-slate">
              Aides vérifiées au {s.derniereVerification}. Fiche maintenue à chaque loi de finances.
            </p>
          )}
        </aside>
      </section>

      {cas.length > 0 && (
        <section className="bg-cream border-y border-line">
          <div className="wrap py-16 lg:py-24">
            <h2 className="display h-sec font-600 text-ink mb-8">Cas clients du secteur</h2>
            <CasGrid items={casItems} initial={9} step={9} />
          </div>
        </section>
      )}

      <RelatedLinks related={s.related} title="Secteurs proches & ressources" />
      <CtaBlock />
    </>
  );
}
