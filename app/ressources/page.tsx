import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { RessourcesHashRedirect } from "@/components/ressources/RessourcesHashRedirect";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Ressources : livres blancs & outils | Accelium Conseil",
    description:
      "Livres blancs et application d'éligibilité à l'agrément CIR/CII, plus notre blog et nos cas clients : nos ressources pour décrypter le financement public.",
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

export default function RessourcesPage() {
  return (
    <>
      <RessourcesHashRedirect />
      <PageHero
        kicker="Ressources"
        title="Nos ressources pour décrypter le financement public"
        intro="Livres blancs, décryptages sectoriels et outils en ligne : les clés pour comprendre les dispositifs et passer à l'action."
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

      <CtaBlock />
    </>
  );
}
