import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { Mdx } from "@/components/Mdx";
import { getCasClient, getCasClients, getSecteur, getDispositif } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getCasClients().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCasClient(params.slug);
  if (!c) return {};
  const seo = c.seo || { title: `Cas client : ${c.montant}`, description: c.contexte };
  const metadata = buildMetadata(seo, `/cas-clients/${c.slug}`);
  // Les fiches non indexables (contrat §6.5) restent accessibles mais ne doivent
  // pas être proposées à l'indexation.
  if (c.indexable === false) {
    return { ...metadata, robots: { index: false, follow: true } };
  }
  return metadata;
}

export default function CasClientPage({ params }: { params: { slug: string } }) {
  const c = getCasClient(params.slug);
  if (!c) notFound();
  const secteur = getSecteur(c.secteur);
  const dispositif = c.dispositif ? getDispositif(c.dispositif) : undefined;
  // Les fiches indexables (§6.5) portent tout le récit dans le corps MDX : afficher
  // Contexte/Résultat en plus le répéterait. On ne les affiche donc que pour les
  // fiches encore sommaires (pas de corps rédigé, ou explicitement non indexables).
  const repeterContexteResultat = c.indexable !== true;

  return (
    <>
      <PageHero
        kicker={secteur?.nom || "Cas client"}
        title={c.h1 || `${c.montant} ${c.titre}`}
        crumbs={[
          { name: "Cas clients", url: "/cas-clients" },
          { name: c.montant, url: `/cas-clients/${c.slug}` },
        ]}
      />
      <section className="wrap py-16 lg:py-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          {c.image && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-line photo mb-8">
              <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </div>
          )}
          {repeterContexteResultat && (
            <>
              <h2 className="display text-[1.4rem] font-600 text-ink">Contexte</h2>
              <p className="mt-3 text-body lede">{c.contexte}</p>
              {c.resultat && (
                <>
                  <h2 className="display text-[1.4rem] font-600 text-ink mt-10">Résultat</h2>
                  <p className="mt-3 text-body lede">{c.resultat}</p>
                </>
              )}
            </>
          )}
          {c.body && (
            <div className="mt-8">
              <Mdx source={c.body} />
            </div>
          )}
        </div>
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-ink text-white p-7">
            <p className="display text-[2.4rem] font-600 leading-none">{c.montant}</p>
            <p className="mt-2 text-white/70 text-[0.9rem]">{c.montantLabel || "d'aide obtenue"}</p>
          </div>
          <div className="rounded-2xl border border-line p-7 space-y-3 text-[0.92rem]">
            {secteur && (
              <p>
                <span className="text-slate">Secteur :</span>{" "}
                <Link href={`/secteurs/${secteur.slug}`} className="text-orange700 font-600 focusable">{secteur.nom}</Link>
              </p>
            )}
            {dispositif && (
              <p>
                <span className="text-slate">Dispositif :</span>{" "}
                <Link href={`/le-financement-public/dispositifs/${dispositif.slug}`} className="text-orange700 font-600 focusable">{dispositif.nom}</Link>
              </p>
            )}
            {c.anonymise && <p className="text-[0.8rem] text-slate">Client anonymisé.</p>}
          </div>
        </aside>
      </section>
      <CtaBlock />
    </>
  );
}
