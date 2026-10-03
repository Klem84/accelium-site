import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { Mdx } from "@/components/Mdx";
import { FaqBlock } from "@/components/collections/FaqBlock";
import { VerifiedBadge } from "@/components/collections/VerifiedBadge";
import { SourcesBlock } from "@/components/collections/SourcesBlock";
import { getRegion, getRegions, getDispositif } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, articleSchema } from "@/lib/schema-org";

export function generateStaticParams() {
  return getRegions().map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = getRegion(params.slug);
  if (!r) return {};
  return buildMetadata(r.seo, `/regions/${r.slug}`);
}

// Le corps MDX de la fiche région (rédigé par les rédacteurs, §6.3) porte déjà les
// sections "Les financeurs", "Les dispositifs régionaux", "Nos projets financés" et
// "Comment nous intervenons" : c'est la source de texte (règle "une source par
// page"). Cette page n'ajoute que ce que le frontmatter seul sait faire : les
// cartes vers les pages dispositifs nationaux, la FAQ et les sources.
export default function RegionPage({ params }: { params: { slug: string } }) {
  const r = getRegion(params.slug);
  if (!r) notFound();

  const dispositifsNationaux = (r.dispositifsNationaux || [])
    .map((s) => getDispositif(s))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: r.seo.title,
          description: r.seo.description,
          url: `/regions/${r.slug}`,
          datePublished: r.derniereVerification || new Date().toISOString(),
          auteur: r.auteur,
        })}
      />

      <PageHero
        kicker="Région"
        title={r.h1}
        intro={r.definition}
        crumbs={[
          { name: "Régions", url: "/regions" },
          { name: r.nom, url: `/regions/${r.slug}` },
        ]}
      />

      <section className="wrap py-16 lg:py-24 max-w-3xl space-y-14">
        <VerifiedBadge derniereVerification={r.derniereVerification} auteur={r.auteur} />

        {r.body && <Mdx source={r.body} />}

        {dispositifsNationaux.length > 0 && (
          <div>
            <h2 className="display h-sec font-600 text-ink mb-6">Les dispositifs nationaux mobilisables</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {dispositifsNationaux.map((d) => (
                <Link
                  key={d.slug}
                  href={`/le-financement-public/dispositifs/${d.slug}`}
                  className="group flex flex-col rounded-2xl border border-line bg-surface p-6 hover:border-ink transition-colors focusable"
                >
                  <h3 className="display text-[1.1rem] font-600 text-ink group-hover:text-orange700">
                    {d.nomCourt || d.nom}
                  </h3>
                  <p className="mt-2 text-[0.88rem] text-body flex-1">{d.definition}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <FaqBlock items={r.faq || []} />
        </div>

        <SourcesBlock sources={r.sources} />
      </section>

      <CtaBlock />
    </>
  );
}
