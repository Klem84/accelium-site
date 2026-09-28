import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { NewsletterSignup } from "@/components/forms/NewsletterSignup";
import { getNewsletters } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Newsletters",
    description:
      "Les newsletters d'Accelium Conseil sur les financements publics : dispositifs, appels à projets, cas clients et actualité des filières.",
  },
  "/ressources/newsletters"
);

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export default function NewslettersHub() {
  const newsletters = getNewsletters();

  return (
    <>
      <PageHero
        kicker="Ressources"
        title="Newsletters Accelium"
        intro="Chaque mois, l'actualité des financements publics utile aux entreprises : dispositifs, appels à projets et cas clients."
        crumbs={[
          { name: "Ressources", url: "/ressources" },
          { name: "Newsletters", url: "/ressources/newsletters" },
        ]}
      />

      <section className="wrap py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {newsletters.length === 0 ? (
              <div className="rounded-2xl border border-line bg-cream p-8 text-center">
                <p className="text-body">
                  Les newsletters republiées arrivent prochainement. Elles seront listées ici par ordre
                  antéchronologique.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-line border-y border-line">
                {newsletters.map((n) => (
                  <li key={n.slug} className="py-6">
                    <Link href={`/ressources/newsletters/${n.slug}`} className="group block focusable">
                      <p className="text-[0.78rem] font-600 uppercase tracking-wide text-orange700">
                        {formatDate(n.date)}
                        {n.numero ? ` · N°${n.numero}` : ""}
                      </p>
                      <h2 className="display text-[1.25rem] font-600 text-ink group-hover:text-orange700 mt-1">
                        {n.titre}
                      </h2>
                      <p className="mt-2 text-[0.92rem] text-body">{n.resume}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-line bg-cream p-6">
              <p className="kicker text-orange700 mb-2">S'inscrire</p>
              <h2 className="display text-[1.1rem] font-600 text-ink mb-1">Recevoir la prochaine newsletter</h2>
              <p className="text-[0.9rem] text-body mb-5">
                Un email par mois, sans spam, avec un lien de désinscription dans chaque envoi.
              </p>
              <NewsletterSignup />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
