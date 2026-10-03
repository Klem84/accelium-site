import type { Metadata } from "next";
import { PageHero } from "@/components/blocks/PageHero";
import { DiagnosticForm } from "@/components/forms/DiagnosticForm";
import { getSecteurs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/config/site";

export const metadata: Metadata = buildMetadata(
  {
    title: "Contact et diagnostic gratuit",
    description:
      "Demandez un diagnostic gratuit de vos financements publics : réponse sous 24 h ouvrées. Accelium Conseil, 57 avenue de Grammont, Tours. 06 99 79 85 85.",
  },
  "/contact"
);

export default function ContactPage() {
  const secteurs = getSecteurs().map((s) => ({ slug: s.slug, nom: s.nom }));
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Contacter Accelium"
        intro="Un projet, une question, un doute sur votre éligibilité ? Échangeons. Le premier diagnostic est gratuit et sans engagement."
        crumbs={[{ name: "Contact", url: "/contact" }]}
      />
      <section className="wrap py-16 lg:py-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h2 className="display text-[1.6rem] font-600 text-ink mb-6">Demander mon diagnostic</h2>
          <DiagnosticForm secteurs={secteurs} />
        </div>
        <aside className="lg:col-span-5">
          <div className="rounded-2xl bg-ink text-white p-8">
            <p className="kicker text-orange2 mb-5">Coordonnées</p>
            <ul className="space-y-4 text-[0.95rem] text-white/85">
              <li>
                <span className="block text-white/70 text-[0.78rem] uppercase tracking-wider">Téléphone</span>
                <a href={`tel:${site.contact.telHref}`} className="hover:text-orange2 focusable">{site.contact.tel}</a>
              </li>
              <li>
                <span className="block text-white/70 text-[0.78rem] uppercase tracking-wider">Email</span>
                <a href={`mailto:${site.contact.email}`} className="hover:text-orange2 focusable">{site.contact.email}</a>
              </li>
              <li>
                <span className="block text-white/70 text-[0.78rem] uppercase tracking-wider">Adresse</span>
                {site.contact.adresse}
              </li>
              <li>
                <span className="block text-white/70 text-[0.78rem] uppercase tracking-wider">Horaires</span>
                {site.contact.horaires}
              </li>
              <li>
                <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-orange2 focusable">
                  LinkedIn →
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
