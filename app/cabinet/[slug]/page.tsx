import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { getPages, getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { estNoindexTemporaire } from "@/config/indexation";
import {
  atouts,
  deontologie,
  mediateurTitre,
  equipeExpertise,
  partenairesCibles,
  type Principe,
} from "@/lib/cabinetData";
import { chiffres } from "@/config/chiffres";
import { IconCheck, IconShield, IconLever } from "@/components/blocks/Icons";

const PREFIX = "cabinet-";

const labels: Record<string, string> = {
  "a-propos": "À propos",
  "nos-atouts": "Nos atouts",
  equipe: "L'équipe",
  partenaires: "Nos partenaires",
  deontologie: "Déontologie",
};

export function generateStaticParams() {
  return getPages()
    .filter((p) => p.slug.startsWith(PREFIX))
    .map((p) => ({ slug: p.slug.replace(PREFIX, "") }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(PREFIX + params.slug);
  if (!p) return {};
  const noindex = p.seo.noindex || estNoindexTemporaire(`cabinet/${params.slug}`);
  return buildMetadata({ ...p.seo, noindex }, `/cabinet/${params.slug}`);
}

/* Référencement Médiateur des entreprises : lu dans config/chiffres.ts.
   Champ null ou vide : la ligne n'est pas rendue. Une chaîne non vide est
   affichée comme description. */
function getReferencementMediateur(): string | null {
  const raw: string | null = chiffres.referencementMediateur;
  return raw && raw.trim() ? raw.trim() : null;
}

/* Indicateurs de la page À propos : valeurs de config/chiffres.ts uniquement
   (aucun chiffre en dur). Les champs null ne sont pas affichés. */
const indicateurs: { valeur: string; libelle: string }[] = [
  { valeur: chiffres.projets.affichage, libelle: chiffres.projets.libelle },
  { valeur: chiffres.clients.affichage, libelle: chiffres.clients.libelle },
  {
    valeur: `${String(chiffres.satisfaction.recommandation).replace(".", ",")}/${chiffres.satisfaction.recommandationSur}`,
    libelle: `de recommandation (${chiffres.satisfaction.methode.toLowerCase()})`,
  },
  {
    valeur: `${String(chiffres.satisfaction.satisfaction).replace(".", ",")}/${chiffres.satisfaction.satisfactionSur}`,
    libelle: "de satisfaction globale",
  },
];

const histoire = [
  {
    titre: "Création",
    desc: "Accelium Conseil est créé en juin 2022 à Tours, avec une conviction : le financement public doit être accessible à toutes les entreprises qui investissent, innovent ou se transforment, quelle que soit leur taille.",
  },
  {
    titre: "Étapes clés",
    desc: "En 2023, une docteure en physique appliquée, ancienne responsable R&D dans l'industrie, rejoint la direction générale et renforce l'expertise CIR, CII et agrément. Le cabinet accompagne depuis des projets partout en France, auprès de l'ADEME, de Bpifrance, des Régions, des agences de l'eau, de l'Europe et de France 2030.",
  },
  {
    titre: "Ce qui distingue Accelium",
    desc: "Une double culture : l'analyse financière et le pilotage de projets complexes d'un côté, la recherche et l'industrie de l'autre. Chaque dossier est construit pour être défendable devant le financeur, jusqu'au versement de l'aide.",
  },
];

function PrincipeGrid({ items, icon: Icon }: { items: Principe[]; icon: (p: { className?: string }) => JSX.Element }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((it) => (
        <div key={it.titre} className="rounded-2xl border border-line bg-surface p-7 flex flex-col">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-orange/10 text-orange700">
            <Icon className="w-6 h-6" />
          </span>
          <h3 className="display text-[1.15rem] font-600 text-ink mt-5 leading-snug">{it.titre}</h3>
          <p className="mt-2 text-[0.95rem] text-body leading-relaxed">{it.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default function CabinetPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const p = getPage(PREFIX + slug);
  if (!p) notFound();

  const mediateur = getReferencementMediateur();
  const deontologieItems: Principe[] = mediateur
    ? [...deontologie, { titre: mediateurTitre, desc: mediateur }]
    : deontologie;

  const crumbs = [
    { name: "Le cabinet", url: "/cabinet/a-propos" },
    { name: labels[slug] || slug, url: `/cabinet/${slug}` },
  ];

  return (
    <>
      <PageHero kicker="Le cabinet" title={p.h1} intro={p.intro} crumbs={crumbs} />

      {/* ===== À PROPOS ===== */}
      {slug === "a-propos" && (
        <>
          <section className="wrap py-16 lg:py-24">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-7">
                <p className="lede text-ink leading-relaxed">
                  Nous aidons les entreprises, de la start-up à la grande entreprise, à identifier, mobiliser
                  et sécuriser toutes les aides auxquelles elles peuvent prétendre.
                </p>
              </div>
              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-ink text-white p-8 lg:p-10">
                  <p className="kicker text-orange2 mb-4">Notre mission</p>
                  <p className="display text-[1.4rem] font-500 leading-snug">
                    Rendre le financement public accessible et sûr.
                  </p>
                  <p className="mt-4 text-white/75 leading-relaxed">
                    Pour que vous financiez vos projets sans y consacrer un temps que vous n'avez pas, ni
                    prendre de risque non anticipé.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-cream border-y border-line">
            <div className="wrap py-16 lg:py-20">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
                <h2 className="display h-sec font-600 text-ink">Notre histoire</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {histoire.map((h, i) => (
                  <div key={h.titre} className="rounded-2xl border border-line bg-surface p-7">
                    <span className="display text-[2rem] font-600 text-orange700 leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="display text-[1.1rem] font-600 text-ink mt-3">{h.titre}</h3>
                    <p className="mt-2 text-[0.95rem] text-body leading-relaxed">{h.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="wrap py-16 lg:py-20">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
              <h2 className="display h-sec font-600 text-ink">En chiffres</h2>
              <p className="text-[0.88rem] text-slate">{chiffres.dateChiffresLabel}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {indicateurs.map((it) => (
                <div key={it.libelle} className="rounded-2xl border border-line bg-cream p-7">
                  <div className="display text-[2.4rem] font-600 text-ink leading-none">{it.valeur}</div>
                  <p className="mt-2 text-[0.88rem] text-body">{it.libelle}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ===== NOS ATOUTS ===== */}
      {slug === "nos-atouts" && (
        <section className="wrap py-16 lg:py-24">
          <p className="lede text-body max-w-[60ch] mb-12">
            Ce qui fait la différence quand il s'agit d'identifier, d'obtenir et de sécuriser vos
            financements publics.
          </p>
          <PrincipeGrid items={atouts} icon={IconCheck} />
        </section>
      )}

      {/* ===== DÉONTOLOGIE ===== */}
      {slug === "deontologie" && (
        <section className="wrap py-16 lg:py-24">
          <p className="lede text-body max-w-[60ch] mb-12">
            Nos engagements vis-à-vis de chaque client, à chaque étape de la mission.
          </p>
          <PrincipeGrid items={deontologieItems} icon={IconShield} />
        </section>
      )}

      {/* ===== L'ÉQUIPE ===== */}
      {slug === "equipe" && (
        <section className="wrap py-16 lg:py-24">
          <ul className="flex flex-wrap gap-2 mb-12">
            {equipeExpertise.map((e) => (
              <li
                key={e}
                className="inline-flex rounded-full border border-line bg-cream px-4 py-2 text-[0.9rem] font-500 text-slateD"
              >
                {e}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between gap-4 flex-wrap mb-7">
            <h2 className="display h-sec font-600 text-ink">Les experts Accelium</h2>
          </div>
          <div className="max-w-[64ch] space-y-4 text-body leading-relaxed">
            <p>
              L'équipe réunit deux cultures complémentaires : l'analyse financière et le pilotage de
              projets complexes, acquis dans la banque et le conseil, et la recherche appliquée,
              acquise en laboratoire et en direction R&amp;D industrielle.
            </p>
            <p>
              Chaque dossier est suivi par un interlocuteur unique, du diagnostic au versement de l'aide,
              pour des entreprises situées partout en France.
            </p>
          </div>

          <div className="mt-10">
            <a
              href="https://www.linkedin.com/company/accelium-conseil"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 display text-[1.02rem] font-600 text-ink hover:text-orange700 focusable"
            >
              Accelium sur LinkedIn ↗
            </a>
          </div>
        </section>
      )}

      {/* ===== PARTENAIRES ===== */}
      {slug === "partenaires" && (
        <section className="wrap py-16 lg:py-24">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
            <h2 className="display h-sec font-600 text-ink max-w-[20ch]">Notre écosystème</h2>
          </div>
          <div className="max-w-[64ch] space-y-4 text-body leading-relaxed mb-16">
            <p>
              Un projet financé mobilise souvent plusieurs expertises : bureaux d'études pour le volet
              technique, experts-comptables pour le plan de financement, banques pour le cofinancement,
              écoles et laboratoires pour la R&amp;D.
            </p>
            <p>
              Nous travaillons avec ces acteurs dans toute la France, chacun dans son rôle, pour que vos
              dossiers soient complets et cohérents.
            </p>
          </div>

          <div className="rounded-3xl bg-ink text-white p-8 lg:p-12">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange/15 text-orange2">
                  <IconLever className="w-6 h-6" />
                </span>
                <h3 className="display text-[1.8rem] lg:text-[2.2rem] font-600 mt-5 leading-tight">
                  Devenez partenaire
                </h3>
                <p className="mt-3 text-white/75 leading-relaxed max-w-[46ch]">
                  Vous êtes expert-comptable, avocat, banquier ou conseil ? Construisons un partenariat au
                  service de vos clients.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {partenairesCibles.map((c) => (
                    <li
                      key={c}
                      className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[0.8rem] font-500 text-white/90"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-5 lg:text-right">
                <Link href="/contact" className="btn-primary focusable rounded-full px-7 py-4 text-[1rem] inline-flex">
                  Proposer un partenariat
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <CtaBlock />
    </>
  );
}
