import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { getCasClients } from "@/lib/content";
import { site } from "@/config/site";

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
    desc: "Reprendre la main, gagner en autonomie, réduire vos honoraires.",
    href: "/offres/internaliser-cir-cii",
  },
  {
    n: "05",
    titre: "Veille & intelligence financements",
    desc: "Faire des aides un levier de vente pour vos équipes.",
    href: "/offres/veille-intelligence-financements",
  },
];

const secteurs = [
  { nom: "Forêt-bois", slug: "foret-bois", img: "https://images.unsplash.com/photo-1616761286619-2acae0580383?auto=format&fit=crop&w=600&q=75" },
  { nom: "Industrie", slug: "industrie", img: "https://images.unsplash.com/photo-1511454493857-0a29f2c023c7?auto=format&fit=crop&w=600&q=75" },
  { nom: "Biomasse", slug: "biomasse", img: "https://images.unsplash.com/photo-1673208769691-e74104d853fd?auto=format&fit=crop&w=600&q=75" },
  { nom: "Port maritime", slug: "port-maritime", img: "https://images.unsplash.com/photo-1606185540834-d6e7483ee1a4?auto=format&fit=crop&w=600&q=75" },
  { nom: "Agriculture", slug: "agriculture", img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=600&q=75" },
  { nom: "Agroalimentaire", slug: "agroalimentaire", img: "https://images.unsplash.com/photo-1513257805917-a0da1146eb15?auto=format&fit=crop&w=600&q=75" },
  { nom: "Béton", slug: "beton", img: "https://images.unsplash.com/photo-1578776349090-de61da00ff1a?auto=format&fit=crop&w=600&q=75" },
  { nom: "Enrobés", slug: "enrobes", img: "https://images.unsplash.com/photo-1717386255773-1e3037c81788?auto=format&fit=crop&w=600&q=75" },
  { nom: "Défense", slug: "defense", img: "https://images.unsplash.com/photo-1624027492684-327af1fb7559?auto=format&fit=crop&w=600&q=75" },
  { nom: "Distillerie", slug: "distillerie", img: "https://images.unsplash.com/photo-1620200423727-8127f75d7f53?auto=format&fit=crop&w=600&q=75" },
];

const financeurs = ["Bpifrance", "ADEME", "Régions", "FranceAgriMer", "Agences de l'eau", "ASP", "Union européenne", "France 2030"];

const stats = [
  { n: 40, suffix: "+", label: "réseaux de financement" },
  { n: 300, suffix: "+", label: "dispositifs suivis" },
  { n: 150, suffix: "+", label: "projets accompagnés" },
  { n: 120, suffix: " M€", label: "d'aides obtenues" },
];

export default function HomePage() {
  const cas = getCasClients().filter((c) => c.featured).slice(0, 3);

  return (
    <>
      {/* ===== HERO plein écran ===== */}
      <section className="relative w-full overflow-hidden min-h-[600px] h-[100svh]">
        <img
          data-parallax="0.18"
          src="https://images.unsplash.com/photo-1526821799652-2dc51675628e?auto=format&fit=crop&w=2000&q=80"
          alt="Paris au coucher du soleil, vue aérienne"
          className="absolute inset-0 w-full h-[118%] object-cover parallax"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 to-transparent" />

        <div className="hero-content relative h-full wrap flex flex-col justify-end pt-32 lg:pt-40 pb-[4vh]">
          <div className="reveal">
            <p className="kicker text-orange2 mb-8 lg:mb-12 leading-[1.6]">
              Accélère l'obtention de vos
              <br />
              financements publics
            </p>
          </div>
          <h1
            className="display h-hero font-600 text-white max-w-[16ch] clip"
            aria-label="Financez vos projets grâce aux financements publics"
          >
            <span>Financez vos projets</span>
            <span>
              grâce aux <em className="not-italic text-orange2">financements publics</em>
            </span>
          </h1>
          <p className="lede measure mt-6 lg:mt-8 text-white/80 reveal">
            Accelium identifie, obtient et sécurise toutes les aides auxquelles votre entreprise peut
            prétendre. De la start-up à la grande entreprise, partout en France.
          </p>
          <div className="mt-7 lg:mt-9 flex flex-wrap items-center gap-4 reveal">
            <Button href="/contact" variant="primary" arrow>
              Obtenir mon diagnostic gratuit
            </Button>
            <Button href="/offres" variant="ghost-d">
              Découvrir nos offres
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
              Plusieurs milliers de dispositifs existent.{" "}
              <span className="text-slate">La plupart des entreprises n'en mobilisent qu'une fraction.</span>{" "}
              Nous trouvons les vôtres.
            </h2>
          </div>
          <div className="lg:col-span-4 flex items-end">
            <p className="lede text-body reveal">
              Subventions, prêts, crédits d'impôt, CIR/CII : nous couvrons tout le spectre du financement
              public, de la stratégie au versement.
            </p>
          </div>
        </div>

        <div data-stagger className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 border-t border-line pt-12">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="display text-[clamp(2.6rem,1.8rem_+_2vw,3.6rem)] font-600 text-ink">
                <span data-count={s.n}>0</span>
                {s.suffix.includes("M€") ? <>&nbsp;M€</> : s.suffix}
              </div>
              <p className="mt-2 text-[0.9rem] text-body">{s.label}</p>
            </div>
          ))}
        </div>
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
                <span className="md:col-span-1 display text-[1.3rem] font-600 text-orange">{o.n}</span>
                <h3 className="md:col-span-5 display text-[clamp(1.5rem,1.1rem_+_1.4vw,2.2rem)] font-500 text-ink group-hover:text-orange700 transition-colors">
                  {o.titre}
                </h3>
                <p className="md:col-span-5 text-[0.97rem] text-body">{o.desc}</p>
                <span className="md:col-span-1 md:text-right text-orange text-2xl transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BANDEAU VILLE pleine largeur (Lyon) ===== */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden flex items-center">
        <img
          data-parallax="0.15"
          src="https://images.unsplash.com/photo-1602719092282-f027126b6b74?auto=format&fit=crop&w=2000&q=80"
          alt="Lyon sous la lumière dorée"
          className="absolute inset-0 w-full h-[118%] object-cover parallax"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative wrap text-white">
          <p className="kicker text-orange2 mb-5 reveal">Une présence nationale</p>
          <h2 className="display h-mega font-500 max-w-[18ch] reveal">
            Partout en France, nous mobilisons les financeurs de votre territoire.
          </h2>
          <Link href="/le-financement-public" className="mt-8 inline-flex items-center gap-2 text-white font-600 focusable reveal group">
            Comprendre le financement public{" "}
            <span className="text-orange2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* ===== SECTEURS ===== */}
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

        <div data-stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {secteurs.map((s) => (
            <Link
              key={s.slug}
              href={`/secteurs/${s.slug}`}
              className="group focusable relative rounded-xl overflow-hidden aspect-[3/4] photo"
            >
              <img src={s.img} alt={s.nom} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <span className="absolute left-4 bottom-4 text-white font-600 display text-[1.15rem]">{s.nom}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FINANCEURS marquee ===== */}
      <section className="py-14 border-b border-line overflow-hidden">
        <p className="kicker text-center text-slate mb-8">De l'échelon local à l'Europe, tous les financeurs</p>
        <div className="mq-mask">
          <div className="marquee-track display text-[clamp(1.4rem,1rem_+_1.4vw,2.2rem)] font-500 text-ink/35">
            {[...financeurs, ...financeurs].map((f, i) => (
              <span key={i}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAS CLIENTS ===== */}
      <section className="wrap py-24 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div className="reveal">
            <p className="kicker text-orange700 mb-4">Résultats</p>
            <h2 className="display h-sec font-600 text-ink max-w-[18ch]">
              Derrière chaque accompagnement, un projet financé
            </h2>
            <p className="mt-4 text-[0.92rem] text-slateD measure">
              Projets réels accompagnés par Accelium : montants d'aide mobilisés, clients anonymisés.
            </p>
          </div>
          <Link href="/cas-clients" className="btn-ghost focusable rounded-full px-6 py-3 text-[0.92rem] reveal">
            Tous nos cas clients
          </Link>
        </div>
        <div data-stagger className="grid md:grid-cols-3 gap-4">
          {cas.map((c) => (
            <Link
              key={c.slug}
              href={`/cas-clients/${c.slug}`}
              className="group rounded-2xl overflow-hidden border border-line bg-surface shadow-soft block"
            >
              {c.image && (
                <div className="photo aspect-[16/10]">
                  <img src={c.image} alt={c.secteur} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-7">
                <span className="inline-flex text-[0.72rem] font-600 tracking-wide uppercase text-orange700 bg-orange/10 rounded-full px-3 py-1">
                  {c.secteur}
                </span>
                <p className="display text-[2.2rem] font-600 text-ink mt-4 leading-none">{c.montant}</p>
                <p className="mt-1 text-[0.82rem] font-600 text-slateD">{c.titre}</p>
                <p className="mt-2 text-[0.95rem] text-body">{c.contexte}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== CTA pleine largeur (Marseille) ===== */}
      <section className="relative w-full overflow-hidden">
        <img
          data-parallax="0.12"
          src="https://images.unsplash.com/photo-1566838217578-1903568a76d9?auto=format&fit=crop&w=2000&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-[118%] object-cover parallax"
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
