import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { getLivreBlanc, livresBlancs } from "@/config/livres-blancs";
import { getOffres, getCasClients } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/config/site";

// Fiche J.1.12 : page de remerciement après la demande d'un livre blanc. Hors index (elle
// n'a de sens qu'après une soumission).
export const metadata: Metadata = buildMetadata(
  {
    title: "Votre livre blanc est en route",
    description: "Votre demande de livre blanc a bien été transmise à Accelium Conseil. Le document vous est envoyé par email avec votre lien de téléchargement.",
    noindex: true,
  },
  "/merci-livre-blanc"
);

export default function MerciLivreBlancPage({
  searchParams,
}: {
  searchParams: { doc?: string };
}) {
  const livre = getLivreBlanc(searchParams.doc || "") || livresBlancs[0];
  const offre = getOffres()[0];
  const casClient = getCasClients().filter((c) => c.featured)[0] || getCasClients()[0];
  const autresLivres = livresBlancs.filter((l) => l.slug !== livre?.slug).slice(0, 1)[0];

  return (
    <>
      <PageHero
        kicker="Merci"
        title="C'est envoyé, votre livre blanc arrive"
        intro={
          livre
            ? `« ${livre.titre} » vient de vous être envoyé par email, avec votre lien de téléchargement. Pensez à vérifier vos spams si vous ne le voyez pas tout de suite.`
            : "Votre livre blanc vient de vous être envoyé par email, avec votre lien de téléchargement."
        }
      />
      <section className="wrap py-16 lg:py-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <p className="text-body text-[1.05rem]">
            Une question, un projet à financer ? Un consultant Accelium peut vous rappeler directement.
          </p>
          <a
            href={`tel:${site.contact.telHref}`}
            className="btn-primary focusable mt-6 inline-flex rounded-full px-7 py-4 text-[1rem]"
          >
            {site.contact.tel}
          </a>

          <p className="mt-10 text-[0.85rem] font-600 uppercase tracking-wide text-slate">En attendant, trois lectures utiles</p>
          <ul className="mt-4 space-y-3">
            {offre && (
              <li>
                <Link href={`/offres/${offre.slug}`} className="text-orange700 underline focusable">
                  {offre.nomCourt || offre.h1}
                </Link>
              </li>
            )}
            {casClient && (
              <li>
                <Link href={`/cas-clients/${casClient.slug}`} className="text-orange700 underline focusable">
                  Cas client : {casClient.titre}
                </Link>
              </li>
            )}
            {autresLivres ? (
              <li>
                <Link href="/ressources" className="text-orange700 underline focusable">
                  Un autre livre blanc : {autresLivres.titre}
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/contact" className="text-orange700 underline focusable">
                  Demander un diagnostic gratuit
                </Link>
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
