import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

// Repli si content/auteurs/<slug>.mdx n'existe pas encore (rédaction en parallèle) :
// on affiche au moins un nom lisible plutôt que de masquer l'auteur.
function nomAuteurRepli(slug: string): string {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

// Les sources peuvent être un tableau de chaînes ou de {titre, url} : on normalise
// pour un rendu unique.
function sourcesNormalisees(sources?: string[] | { titre: string; url: string }[]): string[] {
  if (!sources?.length) return [];
  return sources.map((s) => (typeof s === "string" ? s : s.url ? `${s.titre} (${s.url})` : s.titre));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug);
  if (!a) notFound();
  const auteurFiche = a.auteur ? getAuteur(a.auteur) : undefined;
  const nomAuteur = auteurFiche?.nom || (a.auteur ? nomAuteurRepli(a.auteur) : undefined);
  const related = getArticles()
    .filter((x) => x.slug !== a.slug && x.cluster === a.cluster)
    .slice(0, 3);
  const sources = sourcesNormalisees(a.sources);

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: a.titre,
          description: a.seo.description,
          url: `/blog/${a.slug}`,
          datePublished: a.publishedAt,
          dateModified: a.updatedAt,
          auteur: a.auteur,
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
          {a.heroImage && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-line photo mb-8">
              <Image src={a.heroImage} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </div>
          )}
          <p className="text-[0.85rem] text-slate border-b border-line pb-6 mb-8">
            {formatDate(a.publishedAt)}
            {nomAuteur && <> · Par {nomAuteur}</>} · {readingTime(a.body)} min de lecture
          </p>
          <Mdx source={a.body} />

          {auteurFiche && (
            <div className="mt-12 rounded-2xl border border-line bg-cream p-7 flex gap-5 items-start">
              {auteurFiche.photo && (
                <Image
                  src={auteurFiche.photo}
                  alt={auteurFiche.nom}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <p className="display text-[1.15rem] font-600 text-ink">{auteurFiche.nom}</p>
                <p className="text-[0.85rem] text-slate">{auteurFiche.fonction}</p>
                <p className="mt-2 text-[0.92rem] text-body">{auteurFiche.bio}</p>
                {auteurFiche.linkedin && (
                  <a href={auteurFiche.linkedin} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[0.85rem] font-600 text-orange700 focusable">
                    LinkedIn →
                  </a>
                )}
              </div>
            </div>
          )}

          {sources.length > 0 ? (
            <p className="mt-8 text-[0.8rem] text-slate">Sources : {sources.join(" ; ")}.</p>
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
