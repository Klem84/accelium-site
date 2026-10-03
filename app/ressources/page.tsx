import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { FicheCard } from "@/components/blocks/FicheCard";
import { NewsletterSignup } from "@/components/forms/NewsletterSignup";
import { RessourcesHashRedirect } from "@/components/ressources/RessourcesHashRedirect";
import { fichesDecryptage } from "@/config/fiches-decryptage";
import { getNewsletters } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

// Fiche L7.6 : hub qui regroupe l'ensemble des ressources du site (livres blancs, fiches de
// décryptage, newsletters, application agrément CIR/CII, glossaire, questions fréquentes,
// dispositifs, régions), chacune avec un résumé et, quand elle existe, une date.
export const metadata: Metadata = buildMetadata(
  {
    title: "Ressources : guides, outils et décryptages",
    description:
      "Livres blancs, fiches de décryptage, newsletters, test d'éligibilité à l'agrément CIR/CII et glossaire : toutes nos ressources sur le financement public.",
  },
  "/ressources"
);

type Card = {
  href: string;
  kicker: string;
  titre: string;
  texte: string;
  cta: string;
  featured?: boolean;
};

const ressources: Card[] = [
  {
    href: "/ressources/livres-blancs",
    kicker: "Livres blancs",
    titre: "Nos guides à télécharger gratuitement",
    texte:
      "CIR/CII, filière forêt-bois, programme des agences de l'eau : des référentiels complets, envoyés par email.",
    cta: "Voir les livres blancs",
    featured: true,
  },
  {
    href: "/ressources/agrement-cir-cii",
    kicker: "Outil en ligne · Gratuit",
    titre: "Application agrément CIR/CII",
    texte:
      "Évaluez votre éligibilité à l'agrément CIR/CII en quelques questions et comprenez les étapes pour l'obtenir.",
    cta: "Tester mon éligibilité",
    featured: true,
  },
  {
    href: "/blog",
    kicker: "Blog",
    titre: "Décryptages, actualités et conseils",
    texte:
      "Nos analyses sur les dispositifs, les financeurs et les nouveautés du financement public.",
    cta: "Lire le blog",
  },
  {
    href: "/cas-clients",
    kicker: "Cas clients",
    titre: "Des projets réellement financés",
    texte:
      "Montants obtenus, contextes et résultats : la preuve par l'exemple, secteur par secteur.",
    cta: "Voir les cas clients",
  },
];

// Liens vers les hubs de référence du financement public : chacun a déjà sa page dédiée,
// le rôle de cette section est de les rendre trouvables depuis le hub ressources.
const financementPublic: { href: string; titre: string; texte: string }[] = [
  {
    href: "/le-financement-public/glossaire",
    titre: "Glossaire du financement public",
    texte: "Les acronymes et notions expliqués en clair : AAP, AMI, CIR, CII, FEDER, France 2030 et plus de 40 autres termes.",
  },
  {
    href: "/le-financement-public/questions-frequentes",
    titre: "Questions fréquentes",
    texte: "Éligibilité, calendrier, cumul des aides, contrôle et méthode Accelium : les réponses aux questions les plus posées.",
  },
  {
    href: "/le-financement-public/dispositifs",
    titre: "Les dispositifs de financement public",
    texte: "Subventions, prêts, garanties, exonérations et crédits d'impôt, vérifiés dispositif par dispositif.",
  },
  {
    href: "/regions",
    titre: "Financements publics par région",
    texte: "Les financeurs et dispositifs régionaux mobilisables en plus des aides nationales, région par région.",
  },
];

function formatMoisAnnee(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export default function RessourcesPage() {
  const dernieresNewsletters = getNewsletters().slice(0, 3);
  const fichesAffichees = fichesDecryptage.slice(0, 3);

  return (
    <>
      <RessourcesHashRedirect />
      <PageHero
        kicker="Ressources"
        title="Nos ressources pour décrypter le financement public"
        intro="Livres blancs, décryptages sectoriels, newsletters et outils en ligne : les clés pour comprendre les dispositifs et passer à l'action."
        crumbs={[{ name: "Ressources", url: "/ressources" }]}
      />

      <section className="wrap py-16 lg:py-24">
        <div data-stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ressources.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className={`group flex flex-col focusable rounded-2xl border bg-surface p-8 transition-colors ${
                r.featured ? "border-line hover:border-orange" : "border-line hover:border-ink"
              }`}
            >
              <p className="kicker text-orange700 mb-3">{r.kicker}</p>
              <h2 className="display text-[1.4rem] font-600 text-ink group-hover:text-orange700 transition-colors leading-tight">
                {r.titre}
              </h2>
              <p className="mt-2 text-[0.95rem] text-body flex-1">{r.texte}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-orange700 font-600 text-[0.92rem]">
                {r.cta} <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Fiches de décryptage (config/fiches-decryptage.ts) : téléchargement direct en PDF,
          sans formulaire. Le hub complet est publié sur le blog (cf. RessourcesHashRedirect). */}
      <section className="wrap py-16 lg:py-24 border-t border-line">
        <div className="flex items-end justify-between gap-6 mb-8 flex-wrap">
          <div>
            <p className="kicker text-orange700 mb-2">Fiches de décryptage</p>
            <h2 className="display text-[1.6rem] font-600 text-ink">Des notes courtes, un appel à projets à la fois</h2>
          </div>
          <Link href="/blog#fiches" className="text-orange700 font-600 text-[0.92rem] underline focusable">
            Voir toutes les fiches
          </Link>
        </div>
        <div data-stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {fichesAffichees.map((f) => (
            <FicheCard key={f.slug} fiche={f} />
          ))}
        </div>
      </section>

      {/* Newsletters (content/newsletters, lib/content.ts) : les 3 dernières + lien vers le
          hub complet et le formulaire d'inscription (fiche L8.6). */}
      <section className="wrap py-16 lg:py-24 border-t border-line">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="flex items-end justify-between gap-6 mb-8 flex-wrap">
              <div>
                <p className="kicker text-orange700 mb-2">Newsletters</p>
                <h2 className="display text-[1.6rem] font-600 text-ink">Chaque mois, l'actualité des financements publics</h2>
              </div>
              <Link href="/ressources/newsletters" className="text-orange700 font-600 text-[0.92rem] underline focusable">
                Voir toutes les newsletters
              </Link>
            </div>

            {dernieresNewsletters.length === 0 ? (
              <div className="rounded-2xl border border-line bg-cream p-8 text-center">
                <p className="text-body">
                  Les newsletters republiées arrivent prochainement. Elles seront listées ici par ordre
                  antéchronologique.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-line border-y border-line">
                {dernieresNewsletters.map((n) => (
                  <li key={n.slug} className="py-6">
                    <Link href={`/ressources/newsletters/${n.slug}`} className="group block focusable">
                      <p className="text-[0.78rem] font-600 uppercase tracking-wide text-orange700">
                        {formatMoisAnnee(n.date)}
                        {n.numero ? ` · N°${n.numero}` : ""}
                      </p>
                      <h3 className="display text-[1.1rem] font-600 text-ink group-hover:text-orange700 mt-1">
                        {n.titre}
                      </h3>
                      <p className="mt-2 text-[0.9rem] text-body">{n.resume}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-line bg-cream p-6">
              <p className="kicker text-orange700 mb-2">S'inscrire</p>
              <h3 className="display text-[1.1rem] font-600 text-ink mb-1">Recevoir la prochaine newsletter</h3>
              <p className="text-[0.9rem] text-body mb-5">
                Un email par mois, sans spam, avec un lien de désinscription dans chaque envoi.
              </p>
              <NewsletterSignup />
            </div>
          </aside>
        </div>
      </section>

      {/* Le financement public : glossaire, questions fréquentes, dispositifs, régions. */}
      <section className="wrap py-16 lg:py-24 border-t border-line">
        <p className="kicker text-orange700 mb-2">Le financement public</p>
        <h2 className="display text-[1.6rem] font-600 text-ink mb-8">Comprendre les dispositifs et les financeurs</h2>
        <div data-stagger className="grid md:grid-cols-2 gap-5">
          {financementPublic.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group flex flex-col focusable rounded-2xl border border-line bg-surface p-7 hover:border-ink transition-colors"
            >
              <h3 className="display text-[1.15rem] font-600 text-ink group-hover:text-orange700 transition-colors">
                {f.titre}
              </h3>
              <p className="mt-2 text-[0.9rem] text-body flex-1">{f.texte}</p>
            </Link>
          ))}
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
