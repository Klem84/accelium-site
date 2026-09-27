import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { buildMetadata } from "@/lib/seo";

const CIR_CII_APP_URL = "https://agrement-cir-cii.accelium-conseil.fr";

export const metadata: Metadata = buildMetadata(
  {
    title: "Application agrément CIR/CII | Ressources Accelium Conseil",
    description:
      "Testez gratuitement votre éligibilité à l'agrément CIR/CII avec notre application en ligne : évaluation en quelques questions, critères attendus et calendrier de dépôt.",
  },
  "/ressources/agrement-cir-cii"
);

export default function AgrementCirCiiPage() {
  return (
    <>
      <PageHero
        kicker="Ressources · Outil en ligne"
        title="Application agrément CIR/CII"
        intro="Évaluez en quelques minutes votre éligibilité à l'agrément CIR/CII et comprenez les étapes pour l'obtenir. Application gratuite, éditée par Accelium Conseil."
        crumbs={[
          { name: "Ressources", url: "/ressources" },
          { name: "Application agrément CIR/CII", url: "/ressources/agrement-cir-cii" },
        ]}
      />

      <section id="application-cir-cii" className="wrap py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="kicker text-orange700 mb-4">Outil en ligne · Gratuit</p>
            <h2 className="display h-sec font-600 text-ink max-w-[20ch]">
              Évaluez votre éligibilité à l'agrément
            </h2>
            <p className="lede text-body mt-5 measure">
              Vous réalisez de la R&D ou de l'innovation pour le compte de vos clients&nbsp;? Notre application
              en ligne vous permet d'évaluer en quelques minutes votre éligibilité à l'agrément CIR/CII et de
              comprendre les étapes pour l'obtenir.
            </p>
            <ul className="mt-6 space-y-3 text-[0.97rem] text-body">
              {[
                "Évaluez votre éligibilité à l'agrément en quelques questions",
                "Comprenez les critères attendus (R&D, innovation, traçabilité)",
                "Repérez le bon calendrier de dépôt (CIROCO, ministère de l'Industrie)",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="text-orange">→</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={CIR_CII_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary focusable rounded-full px-7 py-4 text-[1rem] inline-flex items-center gap-2"
              >
                Ouvrir l'application
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7 17 17 7M9 7h8v8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <Link
                href="/offres/agrement-cir-cii"
                className="btn-ghost focusable rounded-full px-7 py-4 text-[1rem]"
              >
                Notre accompagnement à l'agrément
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-ink text-white p-8 shadow-soft">
              <p className="kicker text-orange2 mb-4">Pourquoi l'agrément ?</p>
              <p className="text-[0.97rem] text-white/85 leading-relaxed">
                Sans agrément, vos prestations de R&D ou d'innovation ne sont pas valorisables dans le crédit
                d'impôt de vos clients. À devis égal, un prestataire agréé est plus compétitif. C'est un
                véritable avantage commercial.
              </p>
              <p className="mt-5 text-[0.85rem] text-white/55">
                Application éditée par Accelium Conseil ·{" "}
                <a
                  href={CIR_CII_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange2 underline focusable break-all"
                >
                  agrement-cir-cii.accelium-conseil.fr
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
