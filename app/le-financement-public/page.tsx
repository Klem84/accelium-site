import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { getPage, getFinanceurs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const SLUG = "le-financement-public";

export function generateMetadata(): Metadata {
  const p = getPage(SLUG);
  return buildMetadata(
    p?.seo || {
      title: "Le financement public en France : le guide | Accelium",
      description:
        "Subventions, prêts, crédits d'impôt : comprenez le financement public des entreprises et identifiez vos aides. Diagnostic gratuit.",
    },
    `/${SLUG}`
  );
}

/* ── Les 3 principes (définition + règle d'or + levier, condensés) ── */
const principes = [
  {
    titre: "Elle finance un projet",
    texte:
      "Jamais une trésorerie en difficulté. C'est la nature de votre projet (investissement, innovation, transition, emploi) qui ouvre les droits.",
    cle: false,
  },
  {
    titre: "Déposez avant d'engager",
    texte:
      "La règle d'or. Toute dépense engagée avant la demande (devis signé, bon de commande, acompte) sort de l'assiette éligible.",
    cle: true,
  },
  {
    titre: "Un effet de levier",
    texte:
      "L'aide arrive après votre financement, parfois après la réalisation. Le projet doit être viable sans elle : elle préserve vos fonds propres.",
    cle: false,
  },
];

/* ── Les formes d'aide ── */
const formes = [
  {
    nom: "Subvention",
    tag: "Non remboursable",
    desc: "Aide non remboursable, la plus recherchée. Imposable et versée par étapes : un acompte, le solde sur factures.",
  },
  {
    nom: "Avance remboursable",
    tag: "À rembourser",
    desc: "À rembourser, mais sans garantie, avec différé et à taux nul. Sa variante conditionnée peut devenir subvention en cas d'échec technique.",
  },
  {
    nom: "Crédit d'impôt",
    tag: "Fiscal",
    desc: "CIR, CII, C3IV : une réduction d'impôt que vous vous « auto-attribuez », après l'engagement des dépenses, exposée au contrôle.",
  },
  {
    nom: "Garantie",
    tag: "Appui bancaire",
    desc: "Un appui public qui couvre une partie du risque d'un emprunt bancaire et facilite l'accès au crédit.",
  },
  {
    nom: "Exonération",
    tag: "Allègement",
    desc: "Allègement fiscal ou social durable, souvent lié à un statut : Jeune Entreprise Innovante, zones spécifiques.",
  },
];

/* ── Les facteurs d'éligibilité (condensés) ── */
const facteurs = [
  { nom: "La nature du projet", desc: "R&D, investissement, transition, emploi : le critère déterminant." },
  { nom: "La taille de l'entreprise", desc: "Micro, PME, ETI ou grande entreprise ; plus c'est grand, plus l'intensité baisse." },
  { nom: "Le secteur", desc: "Agroalimentaire, agriculture et forêt favorisés ; sidérurgie, naval, transport souvent exclus." },
  { nom: "La localisation", desc: "Les zones AFR et les Territoires d'industrie ouvrent des taux majorés." },
  { nom: "La situation financière", desc: "Fonds propres et cotation comptent ; une entreprise « en difficulté » est exclue." },
];

export default function PilierPage() {
  const p = getPage(SLUG);
  const financeurs = getFinanceurs();

  return (
    <>
      <PageHero
        kicker="Le financement public"
        title={p?.h1 || "Le financement public en France : comprendre, identifier et mobiliser les aides"}
        intro={p?.intro}
        crumbs={[{ name: "Le financement public", url: `/${SLUG}` }]}
      />

      {/* ===== DÉFINITION + 3 PRINCIPES ===== */}
      <section className="wrap py-20 lg:py-28">
        <div className="max-w-[58ch] reveal">
          <h2 className="display h-sec font-600 text-ink">Comment fonctionne une aide publique&nbsp;?</h2>
          <p className="lede text-body mt-6">
            Une aide est un{" "}
            <strong className="text-ink font-600">avantage financier accordé à une entreprise sur ressources publiques</strong>{" "}
            pour soutenir un projet de développement. Trois principes en gouvernent toute la logique.
          </p>
        </div>

        <div data-stagger className="mt-12 grid md:grid-cols-3 border-y border-line divide-y md:divide-y-0 md:divide-x divide-line">
          {principes.map((pr) => (
            <div key={pr.titre} className="py-8 md:py-9 md:px-8 md:first:pl-0 md:last:pr-0">
              <h3
                className={
                  "display text-[1.3rem] font-600 " + (pr.cle ? "text-orange700" : "text-ink")
                }
              >
                {pr.titre}
              </h3>
              <p className="mt-3 text-[0.96rem] text-body leading-relaxed">{pr.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== LES FORMES D'AIDE ===== */}
      <section className="bg-cream border-y border-line">
        <div className="wrap py-20 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display h-sec font-600 text-ink max-w-[16ch]">Sous quelles formes&nbsp;?</h2>
            <Link
              href="/le-financement-public/types-d-aides"
              className="btn-ghost focusable rounded-full px-6 py-3 text-[0.92rem] shrink-0"
            >
              Comparer les 5 types
            </Link>
          </div>

          <dl data-stagger className="mt-10 border-t border-line">
            {formes.map((f) => (
              <div
                key={f.nom}
                className="grid sm:grid-cols-[minmax(0,15rem)_1fr] gap-x-10 gap-y-2 border-b border-line py-6 items-baseline"
              >
                <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                  <span className="display text-[1.25rem] font-600 text-ink">{f.nom}</span>
                  <span className="inline-flex text-[0.7rem] font-600 tracking-wide uppercase text-orange700 bg-orange/10 rounded-full px-2.5 py-0.5">
                    {f.tag}
                  </span>
                </dt>
                <dd className="text-[0.96rem] text-body leading-relaxed">{f.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===== ÉLIGIBILITÉ (condensé) ===== */}
      <section className="wrap py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4 reveal">
            <h2 className="display h-sec font-600 text-ink">Êtes-vous éligible&nbsp;?</h2>
            <p className="mt-5 text-body lede measure">
              À projet donné, cinq facteurs propres à votre entreprise décident de l'accès et de l'intensité de
              l'aide.
            </p>
          </div>
          <div className="lg:col-span-8">
            <ol data-stagger className="border-t border-line">
              {facteurs.map((f, i) => (
                <li key={f.nom} className="flex gap-5 border-b border-line py-5">
                  <span className="display text-[1.05rem] font-600 text-orange700 tabular-nums shrink-0 w-6">
                    {i + 1}
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="display text-[1.1rem] font-600 text-ink">{f.nom}</h3>
                    <p className="text-[0.95rem] text-body leading-relaxed flex-1 min-w-[16rem]">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ===== CONCLUSION + NAVIGATION ===== */}
      <section className="bg-ink text-white">
        <div className="wrap py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 reveal">
              <h2 className="display h-mega font-500 leading-[1.06]">
                Le vrai enjeu n'est pas de connaître les dispositifs, mais de les{" "}
                <span className="text-orange2">combiner</span>.
              </h2>
              <p className="mt-6 text-white/75 lede max-w-[48ch]">
                Identifier les bons leviers, vérifier les cumuls, respecter les fenêtres de dépôt et sécuriser
                les versements jusqu'au dernier euro. C'est précisément notre métier.
              </p>
              <Link
                href="/contact"
                className="btn-primary focusable mt-8 inline-flex rounded-full px-7 py-4 text-[1rem]"
              >
                Obtenir mon diagnostic gratuit
              </Link>
            </div>

            <div className="lg:col-span-5 reveal grid sm:grid-cols-2 gap-4">
              <Link
                href="/le-financement-public/financeurs"
                className="group rounded-2xl bg-white/[0.04] border border-white/10 p-6 hover:border-orange2/50 transition-colors focusable"
              >
                <h3 className="display text-[1.2rem] font-600 text-white">Les financeurs</h3>
                <p className="mt-2 text-[0.88rem] text-white/65">De l'échelon local à l'Europe.</p>
                <span className="mt-4 inline-flex items-center gap-1 text-orange2 font-600 text-[0.9rem]">
                  Explorer <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
              <Link
                href="/le-financement-public/types-d-aides"
                className="group rounded-2xl bg-white/[0.04] border border-white/10 p-6 hover:border-orange2/50 transition-colors focusable"
              >
                <h3 className="display text-[1.2rem] font-600 text-white">Les types d'aides</h3>
                <p className="mt-2 text-[0.88rem] text-white/65">Cinq formes, souvent cumulables.</p>
                <span className="mt-4 inline-flex items-center gap-1 text-orange2 font-600 text-[0.9rem]">
                  Explorer <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
              <p className="sm:col-span-2 text-[0.8rem] text-white/45">
                {financeurs.length} financeurs référencés, du régional à l'européen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
