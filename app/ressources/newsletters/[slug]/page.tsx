import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/blocks/PageHero";
import { Mdx } from "@/components/Mdx";
import { CtaContext } from "@/components/collections/CtaContext";
import { getNewsletter, getNewsletters, getDispositif, isNomClientConfirme } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, articleSchema } from "@/lib/schema-org";

export function generateStaticParams() {
  return getNewsletters().map((n) => ({ slug: n.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const n = getNewsletter(params.slug);
  if (!n) return {};
  return buildMetadata(
    n.seo || { title: n.titre, description: n.resume },
    `/ressources/newsletters/${n.slug}`
  );
}

export default function NewsletterPage({ params }: { params: { slug: string } }) {
  const n = getNewsletter(params.slug);
  if (!n) notFound();

  const dispositifsCites = (n.dispositifsCites || [])
    .map((s) => getDispositif(s))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));
  const clients = (n.clientsFelicites || []).filter(isNomClientConfirme);

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: n.titre,
          description: n.resume,
          url: `/ressources/newsletters/${n.slug}`,
          datePublished: n.date,
          // pas d'auteur personne : Organization
        })}
      />

      <PageHero
        kicker={`Newsletter${n.numero ? ` · N°${n.numero}` : ""}`}
        title={n.titre}
        intro={n.resume}
        crumbs={[
          { name: "Ressources", url: "/ressources" },
          { name: "Newsletters", url: "/ressources/newsletters" },
          { name: n.titre, url: `/ressources/newsletters/${n.slug}` },
        ]}
      />

      <section className="wrap py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <Mdx source={n.body || ""} />

            {clients.length > 0 && (
              <div className="mt-10 rounded-2xl border border-line bg-cream p-6">
                <p className="kicker text-orange700 mb-3">Toutes nos félicitations</p>
                <ul className="text-[0.92rem] text-body space-y-1">
                  {clients.map((nom) => (
                    <li key={nom}>{nom}</li>
                  ))}
                </ul>
              </div>
            )}

            {dispositifsCites.length > 0 && (
              <div className="mt-10">
                <p className="kicker text-orange700 mb-4">Dispositifs cités dans ce numéro</p>
                <div className="flex flex-wrap gap-3">
                  {dispositifsCites.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/le-financement-public/dispositifs/${d.slug}`}
                      className="inline-flex rounded-full border border-line px-4 py-2 text-[0.88rem] font-500 text-ink hover:border-ink focusable"
                    >
                      {d.nomCourt || d.nom}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-4">
            <CtaContext
              label="Recevoir la prochaine newsletter"
              param="objet"
              value="newsletter"
              text="Un email par mois, sans spam, avec un lien de désinscription."
            />
            <Link
              href="/ressources/newsletters"
              className="inline-flex text-[0.88rem] font-600 text-orange700 focusable"
            >
              Toutes les newsletters →
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
