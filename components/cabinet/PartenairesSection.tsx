import Link from "next/link";
import { PartnerCard } from "@/components/collections/PartnerCard";
import { CtaContext } from "@/components/collections/CtaContext";
import { IconCheck, IconLever } from "@/components/blocks/Icons";
import { referencesConfirmees, type Reference } from "@/config/references";
import { cerclePrincipes, partenariatModalites, salonsPartenariat, partenairesCibles } from "@/lib/cabinetData";
import { JsonLd } from "@/lib/schema-org";
import { site } from "@/config/site";

/* Page « partenaires et cercle » (§5.6.4, §6.6). Seules les entrées confirmées
   (config/references.ts : confirme true, refuse absent) sont lues : les entrées
   non confirmées ne sont ni rendues ni présentes dans le HTML ni dans le JSON-LD. */

function toPartner(r: Reference, type: string) {
  return {
    nom: r.nom,
    type: r.membre ? `${type} · ${r.membre.fonction}` : type,
    site: r.site || undefined,
    phrase: r.phrase,
    logo: r.logo || undefined,
    confirme: r.confirme,
  };
}

function organisationsSchema(items: Reference[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Partenaires et membres du cercle Accelium",
    url: `${site.url}/cabinet/partenaires`,
    itemListElement: items.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Organization",
        name: r.nom,
        ...(r.site ? { url: r.site } : {}),
      },
    })),
  };
}

function Grille({ items, type }: { items: Reference[]; type: string }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((r) => (
        <PartnerCard key={r.id} partner={toPartner(r, type)} />
      ))}
    </div>
  );
}

export function PartenairesSection() {
  const partenaires = referencesConfirmees("partenaire");
  const cercle = referencesConfirmees("cercle");
  const tous = [...partenaires, ...cercle.filter((c) => !partenaires.some((p) => p.id === c.id))];

  return (
    <>
      {tous.length > 0 && <JsonLd data={organisationsSchema(tous)} />}

      {/* ===== Le cercle Accelium ===== */}
      <section className="wrap py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-6">
            <p className="kicker text-orange700 mb-4">Le cercle Accelium</p>
            <h2 className="display h-sec font-600 text-ink max-w-[20ch]">Un réseau d'experts au service des projets</h2>
          </div>
          <div className="lg:col-span-6 space-y-4 text-body leading-relaxed">
            <p>
              Lancé le 4 juillet 2025, le cercle Accelium est un réseau restreint d'experts sectoriels, reconnus
              pour leur expertise métier et leur proximité avec les réalités de terrain. Son objectif : relayer
              plus efficacement les dispositifs publics auprès des entreprises, des collectivités et des porteurs
              de projets.
            </p>
            <p>
              Le financement public reste mal connu : beaucoup d'entreprises renoncent à une aide faute de
              savoir qu'elle existe, ou la découvrent trop tard, une fois l'investissement engagé. Les membres du
              cercle sont souvent les premiers à connaître un projet. En partageant l'information au bon moment,
              ils permettent à leurs clients de déposer leur demande avant de s'engager, condition posée par la
              plupart des financeurs.
            </p>
          </div>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cerclePrincipes.map((p) => (
            <div key={p.titre} className="rounded-2xl border border-line bg-surface p-6">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-orange/10 text-orange700">
                <IconCheck className="w-5 h-5" />
              </span>
              <h3 className="display text-[1.1rem] font-600 text-ink mt-4 leading-snug">{p.titre}</h3>
              <p className="mt-2 text-[0.92rem] text-body leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Partenaires et membres (confirmés uniquement) ===== */}
      <section className="bg-cream border-y border-line">
        <div className="wrap py-16 lg:py-20">
          <h2 className="display h-sec font-600 text-ink max-w-[24ch]">Nos partenaires</h2>
          <div className="mt-6 max-w-[64ch] space-y-4 text-body leading-relaxed">
            <p>
              Un projet financé mobilise souvent plusieurs expertises : équipementiers et bureaux d'études pour
              le volet technique, experts-comptables pour le plan de financement, banques pour le cofinancement,
              écoles et laboratoires pour la R&amp;D, réseaux professionnels pour faire circuler l'information.
            </p>
            <p>
              Nous travaillons avec ces acteurs dans toute la France, chacun dans son rôle, pour que les dossiers
              de leurs clients soient complets, cohérents et déposés au bon moment.
            </p>
          </div>

          {partenaires.length > 0 && (
            <div className="mt-10">
              <h3 className="kicker text-orange700 mb-4">Partenaires</h3>
              <Grille items={partenaires} type="Partenaire" />
            </div>
          )}

          {cercle.length > 0 && (
            <div className="mt-10">
              <h3 className="kicker text-orange700 mb-4">Les membres du cercle</h3>
              <Grille items={cercle} type="Membre du cercle" />
            </div>
          )}

          <p className="mt-10 text-[0.92rem] text-slateD max-w-[64ch]">
            {tous.length === 0
              ? "Les partenaires et membres du cercle sont présentés ici avec leur accord. La liste s'enrichit au fil des confirmations."
              : "Les membres présentés ici ont donné leur accord ; la liste s'enrichit au fil des confirmations."}
          </p>
        </div>
      </section>

      {/* ===== Comment fonctionne un partenariat ===== */}
      <section className="wrap py-16 lg:py-24">
        <h2 className="display h-sec font-600 text-ink max-w-[24ch]">Comment fonctionne un partenariat</h2>
        <p className="mt-6 max-w-[64ch] text-body leading-relaxed">
          Un partenariat avec Accelium repose sur un principe simple : chacun reste dans son métier, et le client
          y gagne un interlocuteur de plus, spécialiste des aides publiques. Il prend trois formes, que l'on peut
          combiner.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {partenariatModalites.map((m, i) => (
            <div key={m.titre} className="rounded-2xl border border-line bg-surface p-7">
              <span className="display text-[2rem] font-600 text-orange700 leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display text-[1.15rem] font-600 text-ink mt-3">{m.titre}</h3>
              <p className="mt-2 text-[0.95rem] text-body leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 max-w-[64ch]">
          <p className="text-body leading-relaxed">
            Nous sommes intervenus aux côtés de partenaires sur plusieurs salons professionnels :
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {salonsPartenariat.map((s) => (
              <li
                key={s}
                className="inline-flex rounded-full border border-line bg-cream px-4 py-2 text-[0.9rem] font-500 text-slateD"
              >
                {s}
              </li>
            ))}
          </ul>
          <Link
            href="/cabinet/evenements"
            className="inline-flex mt-5 text-[0.95rem] font-600 text-orange700 hover:text-ink focusable"
          >
            Voir tous nos événements
          </Link>
        </div>
      </section>

      {/* ===== Devenir partenaire ===== */}
      <section className="wrap pb-16 lg:pb-24">
        <div className="rounded-3xl bg-ink text-white p-8 lg:p-12">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange/15 text-orange2">
                <IconLever className="w-6 h-6" />
              </span>
              <h2 className="display text-[1.8rem] lg:text-[2.2rem] font-600 mt-5 leading-tight">Devenir partenaire</h2>
              <p className="mt-3 text-white/75 leading-relaxed max-w-[46ch]">
                Vous êtes expert-comptable, avocat, banquier, équipementier ou conseil ? Construisons un partenariat
                au service de vos clients.
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
            <div className="lg:col-span-5">
              <CtaContext
                label="Proposer un partenariat"
                param="objet"
                value="partenariat"
                text="Décrivez votre activité et vos clients : nous revenons vers vous pour en parler."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
