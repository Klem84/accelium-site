import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { Mdx } from "@/components/Mdx";
import { getFinanceur, getFinanceurs, getDispositifs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getFinanceurs().map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const f = getFinanceur(params.slug);
  if (!f) return {};
  return buildMetadata(f.seo, `/le-financement-public/financeurs/${f.slug}`);
}

export default function FinanceurPage({ params }: { params: { slug: string } }) {
  const f = getFinanceur(params.slug);
  if (!f) notFound();
  const dispositifs = getDispositifs().filter((d) => f.dispositifs?.includes(d.slug) || d.financeur === f.slug);

  return (
    <>
      <PageHero
        kicker="Financeur"
        title={f.h1}
        crumbs={[
          { name: "Le financement public", url: "/le-financement-public" },
          { name: "Financeurs", url: "/le-financement-public/financeurs" },
          { name: f.nom, url: `/le-financement-public/financeurs/${f.slug}` },
        ]}
      />

      <section className="wrap py-16 lg:py-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <Mdx source={f.body} />
        </div>
        <aside className="lg:col-span-5">
          {dispositifs.length > 0 && (
            <div className="rounded-2xl border border-line bg-cream p-7">
              <p className="kicker text-orange700 mb-5">Dispositifs opérés</p>
              <ul className="space-y-3">
                {dispositifs.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/le-financement-public/dispositifs/${d.slug}`}
                      className="display text-[1.05rem] font-600 text-ink hover:text-orange700 focusable"
                    >
                      {d.nom} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      <RelatedLinks related={f.related} />
      <CtaBlock />
    </>
  );
}
