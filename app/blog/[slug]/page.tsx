import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { BlogCard } from "@/components/blocks/BlogCard";
import { Mdx } from "@/components/Mdx";
import { getArticle, getArticles, getAuteur } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, articleSchema } from "@/lib/schema-org";
import { formatDate, readingTime, clusterLabels } from "@/lib/utils";
import { site } from "@/config/site";

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArticle(params.slug);
  if (!a) return {};
  return buildMetadata(a.seo, `/blog/${a.slug}`);
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug);
  if (!a) notFound();
  const auteur = a.auteur ? getAuteur(a.auteur) : undefined;
  const related = getArticles()
    .filter((x) => x.slug !== a.slug && x.cluster === a.cluster)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: a.titre,
          description: a.seo.description,
          url: `/blog/${a.slug}`,
          datePublished: a.publishedAt,
          dateModified: a.updatedAt,
          authorName: auteur?.nom || "Accelium Conseil",
          image: a.heroImage,
        })}
      />
      <PageHero
        kicker={clusterLabels[a.cluster] || a.cluster}
        title={a.h1 || a.titre}
        crumbs={[
          { name: "Blog", url: "/blog" },
          { name: a.titre, url: `/blog/${a.slug}` },
        ]}
      />

      <article className="wrap py-16 lg:py-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <p className="text-[0.85rem] text-slate border-b border-line pb-6 mb-8">
            {formatDate(a.publishedAt)}
            {auteur && <> · Par {auteur.nom}</>} · {readingTime(a.body)} min de lecture
          </p>
          <Mdx source={a.body} />

          {auteur && (
            <div className="mt-12 rounded-2xl border border-line bg-cream p-7 flex gap-5 items-start">
              {auteur.photo && (
                <img src={auteur.photo} alt={auteur.nom} loading="lazy" decoding="async" className="w-16 h-16 rounded-full object-cover" />
              )}
              <div>
                <p className="display text-[1.15rem] font-600 text-ink">{auteur.nom}</p>
                <p className="text-[0.85rem] text-slate">{auteur.fonction}</p>
                <p className="mt-2 text-[0.92rem] text-body">{auteur.bio}</p>
                {auteur.linkedin && (
                  <a href={auteur.linkedin} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[0.85rem] font-600 text-orange700 focusable">
                    LinkedIn →
                  </a>
                )}
              </div>
            </div>
          )}

          {a.sources?.length ? (
            <p className="mt-8 text-[0.8rem] text-slate">Sources : {a.sources.join(" ; ")}.</p>
          ) : null}
        </div>

        <aside className="lg:col-span-4">
          <div className="rounded-2xl bg-ink text-white p-7 sticky top-28">
            <p className="display text-[1.2rem] font-600">Vérifiez votre éligibilité</p>
            <p className="mt-2 text-[0.92rem] text-white/75">Le premier diagnostic est gratuit et sans engagement.</p>
            <Link href="/contact" className="btn-primary focusable rounded-full px-6 py-3 text-[0.95rem] mt-5 inline-flex">
              {site.cta.label}
            </Link>
          </div>
        </aside>
      </article>

      {related.length > 0 && (
        <section className="bg-cream border-y border-line">
          <div className="wrap py-16">
            <h2 className="display h-sec font-600 text-ink mb-8">Articles liés</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((r) => (
                <BlogCard key={r.slug} article={r} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBlock />
    </>
  );
}
