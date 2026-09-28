import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { getSecteurs, getOffres, getCasClients } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/config/site";

// Fiche J.1.12 : page de remerciement après l'envoi du formulaire de diagnostic. Hors index
// (elle n'a de sens qu'après une soumission) mais suit le même gabarit que le reste du site.
export const metadata: Metadata = buildMetadata(
  {
    title: "Votre demande de diagnostic est reçue",
    description: "Votre demande de diagnostic gratuit a bien été transmise à Accelium Conseil. Un consultant vous recontacte sous 24 heures ouvrées.",
    noindex: true,
  },
  "/merci-diagnostic"
);

export default function MerciDiagnosticPage({
  searchParams,
}: {
  searchParams: { secteur?: string };
}) {
  const secteurNom = searchParams.secteur || "";
  const secteurs = getSecteurs();
  const secteur = secteurs.find((s) => s.nom.toLowerCase() === secteurNom.toLowerCase());
  const offres = getOffres();
  const offre = offres[0];
  const cas = getCasClients().filter((c) => (secteur ? c.secteur === secteur.nom : c.featured));
  const casClient = cas[0] || getCasClients()[0];

  return (
    <>
      <PageHero
        kicker="Merci"
        title="Merci, votre demande est bien reçue"
        intro="Un consultant Accelium vous recontacte sous 24 heures ouvrées, au numéro ou à l'adresse indiqués."
      />
      <section className="wrap py-16 lg:py-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <p className="text-body text-[1.05rem]">
            Vous allez également recevoir un email de confirmation. Pour aller plus vite, vous pouvez nous appeler
            directement :
          </p>
          <a
            href={`tel:${site.contact.telHref}`}
            className="btn-primary focusable mt-6 inline-flex rounded-full px-7 py-4 text-[1rem]"
          >
            {site.contact.tel}
          </a>

          <p className="mt-10 text-[0.85rem] font-600 uppercase tracking-wide text-slate">En attendant, trois lectures utiles</p>
          <ul className="mt-4 space-y-3">
            {secteur && (
              <li>
                <Link href={`/secteurs/${secteur.slug}`} className="text-orange700 underline focusable">
                  Les aides pour le secteur {secteur.nom}
                </Link>
              </li>
            )}
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
            <li>
              <Link href="/ressources" className="text-orange700 underline focusable">
                Nos livres blancs et fiches de décryptage
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
