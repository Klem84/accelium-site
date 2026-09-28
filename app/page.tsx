import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PresenceNationale } from "@/components/home/PresenceNationale";
import { FinanceursBand } from "@/components/home/FinanceursBand";
import { ConfianceSection } from "@/components/home/ConfianceSection";
import { ResultatsSection } from "@/components/home/ResultatsSection";
import { RessourcesSection } from "@/components/home/RessourcesSection";
import { getSecteurs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { chiffres } from "@/config/chiffres";

// Titre absolu (fiche J.1.16 amendée) : ignore le template `%s | Accelium` du layout.
// Description : message national, investissement, innovation et transition (plan V2 §1).
export const metadata: Metadata = buildMetadata(
  {
    title: "Accelium, conseil en financements publics en France",
    description:
      "Accelium obtient subventions, prêts et crédits d'impôt (CIR, CII) pour vos projets d'investissement, d'innovation et de transition, partout en France.",
    absoluteTitle: true,
  },
  "/"
);

const offres = [
  {
    n: "01",
    titre: "Recherche & obtention de financements publics",
    desc: "Détecter, obtenir et sécuriser les aides adaptées à vos projets.",
    href: "/offres/financements-publics",
  },
  {
    n: "02",
    titre: "Crédit d'impôt recherche & innovation",
    desc: "Maximiser et sécuriser votre CIR/CII, contrôle fiscal compris.",
    href: "/offres/credit-impot-recherche-innovation",
  },
  {
    n: "03",
    titre: "Accompagnement à l'agrément CIR/CII",
    desc: "Transformer l'agrément en avantage commercial.",
    href: "/offres/agrement-cir-cii",
  },
  {
    n: "04",
    titre: "Internalisation du CIR/CII",
    desc: "Reprendre la main et gagner en autonomie sur votre crédit d'impôt.",
    href: "/offres/internaliser-cir-cii",
  },
  {
    n: "05",
    titre: "Veille & intelligence financements",
    desc: "Faire des aides un levier de vente pour vos équipes.",
    href: "/offres/veille-intelligence-financements",
  },
];

/* Chiffres clés : source unique config/chiffres.ts (décision de Clément du
   27/09/2026). Aucun montant d'aides (montantAidesObtenues est null). Les deux
   premiers sont des compteurs animés côté client, rendus avec leur valeur finale
   dans le HTML (data-count) ; la satisfaction est un ratio, affiché en texte
   statique (jamais dans un compteur). */
const statsCompteurs = [
  { n: chiffres.projets.compteur, suffix: chiffres.projets.suffixe, label: chiffres.projets.libelle },
  { n: chiffres.clients.compteur, suffix: chiffres.clients.suffixe, label: chiffres.clients.libelle },
];

const virgule = (n: number, d: number) => n.toFixed(d).replace(".", ",");

/* Ligne de preuve du hero (plan V2 §5.1), rendue dans le HTML et datée. */
const nbRegionsClientes = chiffres.regionsClientes?.length ?? 0;
const preuveHero = [
  `Plus de ${chiffres.projets.compteur} ${chiffres.projets.libelle}`,
  `${chiffres.clients.affichage} clients`,
  `${virgule(chiffres.satisfaction.recommandation, 1)}/${chiffres.satisfaction.recommandationSur} de recommandation`,
  nbRegionsClientes > 0 ? `Clients dans ${nbRegionsClientes} régions` : null,
].filter((x): x is string => Boolean(x));

export default function HomePage() {
  const secteurs = getSecteurs();

  return (
    <>
      {/* ===== HERO plein écran (image de Paris conservée, arbitrage §1) ===== */}
      <section className="relative w-full overflow-hidden flex flex-col min-h-[max(600px,100svh)]">
        <Image
          data-parallax="0.18"
          src="/images/bannieres/hero-paris-vue-aerienne.jpg"
          alt="Paris au coucher du soleil, vue aérienne"
          fill
          priority
          sizes="100vw"
          style={{ height: "118%" }}
          className="object-cover parallax"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/65 to-transparent" />

        <div className="hero-content relative flex-1 wrap w-full flex flex-col justify-end pt-32 lg:pt-40 pb-[6vh]">
          <div className="reveal">
            <p className="kicker text-orange2 mb-6 lg:mb-8 leading-[1.6]">
              Cabinet de conseil en financements publics · Partout en France
            </p>
          </div>
          <h1 className="display text-[clamp(2rem,1.1rem_+_3.4vw,4.2rem)] leading-[1.02] font-600 text-white max-w-[1100px] clip">
            <span className="clip-line">
              <span>Financez vos projets d'investissement,</span>
            </span>
            <span className="clip-line">
              <span>d'innovation et de transition</span>
            </span>
            <span className="clip-line">
              <span>
                grâce aux <em className="not-italic text-orange2">aides publiques</em>
              </span>
            </span>
          </h1>
          <p className="lede measure mt-7 text-white/80 reveal">
            Accelium identifie, obtient et sécurise les subventions, prêts bonifiés et crédits d'impôt de vos
            projets : nouvelle ligne de production, R&amp;D, décarbonation, relocalisation. Tous les financeurs,
            de la Région à l'Union européenne, avec un interlocuteur unique jusqu'au versement.
          </p>

          <p className="mt-6 text-[0.88rem] text-white/80 max-w-[70ch] reveal">
            {preuveHero.map((item, i) => (
              <span key={item}>
                {i > 0 && (
                  <span aria-hidden="true" className="mx-2 text-orange2">
                    ·
                  </span>
                )}
                <span className="font-600 text-white">{item}</span>
              </span>
            ))}
            <span aria-hidden="true" className="mx-2 text-orange2">
              ·
            </span>
            <span className="text-white/70">{chiffres.dateChiffresLabel}</span>
          </p>

          <div className="mt-7 lg:mt-8 flex flex-wrap items-center gap-4 reveal">
            <Button href="/contact" variant="primary" arrow>
              Demander un diagnostic gratuit
            </Button>
            <Button href="/cas-clients" variant="ghost-d">
              Voir les projets financés
            </Button>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 hidden lg:flex items-center gap-2 text-white/60 text-[0.72rem] tracking-[0.25em] uppercase" aria-hidden="true">
          Défiler <span className="block h-8 w-px bg-white/40" />
        </div>
      </section>

      {/* ===== STATEMENT + PREUVE ===== */}
      <section className="wrap py-24 lg:py-36">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <h2 className="display h-mega font-500 text-ink reveal">
              Plusieurs milliers de dispositifs existent, de la Région à l'Union européenne.{" "}
              <span className="text-slate">Une entreprise en mobilise rarement plus de deux.</span>{" "}
              Nous trouvons les vôtres, nous montons les dossiers et nous les défendons.
            </h2>
          </div>
          <div className="lg:col-span-4 flex items-end">
            <p className="lede text-body reveal">
              Subventions, prêts, crédits d'impôt, CIR et CII : nous couvrons tout le spectre du financement
              public, pour les projets industriels comme pour les projets d'innovation et de R&amp;D, de la
              stratégie au versement.
            </p>
          </div>
        </div>

        <div data-stagger className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 border-t border-line pt-12">
          {statsCompteurs.map((s) => (
            <div key={s.label}>
              <div className="display text-[clamp(2.6rem,1.8rem_+_2vw,3.6rem)] font-600 text-ink">
                <span data-count={s.n}>
                  {s.n}
                  {s.suffix}
                </span>
              </div>
              <p className="mt-2 text-[0.9rem] text-body">{s.label}</p>
            </div>
          ))}
          <div>
            <div className="display text-[clamp(2.6rem,1.8rem_+_2vw,3.6rem)] font-600 text-ink">
              {virgule(chiffres.satisfaction.recommandation, 1)}
              <span className="text-[1.4rem]">/{chiffres.satisfaction.recommandationSur}</span>
            </div>
            <p className="mt-2 text-[0.9rem] text-body">de recommandation</p>
          </div>
          <div>
            <div className="display text-[clamp(2.6rem,1.8rem_+_2vw,3.6rem)] font-600 text-ink">
              {virgule(chiffres.satisfaction.satisfaction, 2)}
              <span className="text-[1.4rem]">/{chiffres.satisfaction.satisfactionSur}</span>
            </div>
            <p className="mt-2 text-[0.9rem] text-body">de satisfaction</p>
          </div>
        </div>
        <p className="mt-6 text-[0.8rem] text-slate">
          {chiffres.dateChiffresLabel} · {chiffres.satisfaction.methode}
        </p>
      </section>

      {/* ===== OFFRES ===== */}
      <section id="offres" className="bg-cream border-y border-line">
        <div className="wrap py-24 lg:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div className="reveal">
              <p className="kicker text-orange700 mb-4">Nos offres</p>
              <h2 className="display h-sec font-600 text-ink max-w-[18ch]">
                Une réponse pour chaque besoin de financement
              </h2>
            </div>
            <Link href="/contact" className="btn-ghost focusable rounded-full px-6 py-3 text-[0.92rem] reveal">
              Obtenir mon diagnostic
            </Link>
          </div>

          <div data-stagger className="border-t border-line">
            {offres.map((o) => (
              <Link
                key={o.n}
                href={o.href}
                className="group focusable grid md:grid-cols-12 gap-4 items-center py-8 border-b border-line"
              >
                <span className="md:col-span-1 display text-[1.3rem] font-600 text-orange700">{o.n}</span>
                <h3 className="md:col-span-5 display text-[clamp(1.5rem,1.1rem_+_1.4vw,2.2rem)] font-500 text-ink group-hover:text-orange700 transition-colors">
                  {o.titre}
                </h3>
                <p className="md:col-span-5 text-[0.97rem] text-body">{o.desc}</p>
                <span
                  aria-hidden="true"
                  className="md:col-span-1 md:text-right text-orange700 text-2xl transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRÉSENCE NATIONALE (remplace le bandeau photo de Lyon) ===== */}
      <PresenceNationale />

      {/* ===== SECTEURS (12 cartes, visuels locaux) ===== */}
      <section id="secteurs" className="wrap py-24 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="reveal">
            <p className="kicker text-orange700 mb-4">Secteurs</p>
            <h2 className="display h-sec font-600 text-ink max-w-[16ch]">Nous connaissons votre secteur</h2>
          </div>
          <p className="lede text-body max-w-[34ch] reveal">
            Chaque filière a ses financeurs, ses dispositifs, son calendrier. Nous intervenons en profondeur
            sur les vôtres.
          </p>
        </div>

        <div data-stagger className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {secteurs.map((s) => (
            <Link
              key={s.slug}
              href={`/secteurs/${s.slug}`}
              className="group focusable relative rounded-xl overflow-hidden aspect-[3/4] photo bg-ink"
            >
              {s.image && (
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
              <span className="absolute left-4 right-4 bottom-4 text-white font-600 display text-[1.05rem] leading-tight">
                {s.nom}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FINANCEURS (typographie, docs/logos-financeurs.md) ===== */}
      <FinanceursBand />

      {/* ===== ILS NOUS FONT CONFIANCE (rendue seulement si au moins 5 références confirmées) ===== */}
      <ConfianceSection />

      {/* ===== RÉSULTATS : 3 cas featured d'aide obtenue ===== */}
      <ResultatsSection />

      {/* ===== RESSOURCES : dernière newsletter, dernier article, dernier dispositif vérifié ===== */}
      <RessourcesSection />

      {/* ===== CTA pleine largeur ===== */}
      <section className="relative w-full overflow-hidden">
        <Image
          data-parallax="0.12"
          src="/images/bannieres/usine-nuit-financement-projet.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          style={{ height: "118%" }}
          className="object-cover parallax"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/45" />
        <div className="relative wrap py-28 lg:py-40">
          <div className="max-w-2xl reveal">
            <h2 className="display text-[clamp(2.2rem,1.4rem_+_3vw,4rem)] font-600 text-white leading-tight">
              Prêt à optimiser vos financements publics&nbsp;?
            </h2>
            <p className="lede mt-6 text-white/80">
              Le premier diagnostic est gratuit et sans engagement. En quelques minutes, identifions votre
              potentiel d'aides.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button href="/contact" variant="primary">
                Obtenir mon diagnostic gratuit
              </Button>
              <a href={`tel:${site.contact.telHref}`} className="btn-ghost-d focusable rounded-full px-7 py-4 text-[1rem]">
                {site.contact.tel}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
