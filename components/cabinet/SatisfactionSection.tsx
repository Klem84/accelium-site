import { chiffres } from "@/config/chiffres";
import { temoignagesAffichables } from "@/config/references";

/* Satisfaction client et témoignages (§5.6.3) pour /cabinet/a-propos.
   Indicateurs : config/chiffres.ts uniquement, avec leur méthode.
   Témoignages : temoignagesAffichables() (nom seulement si la référence est
   confirmée, version anonymisée sinon ; une citation « à valider » n'est jamais
   rendue tant que l'entreprise n'a pas confirmé). */

const virgule = (n: number) => String(n).replace(".", ",");

function formatMois(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("fr-FR", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });
}

export function SatisfactionSection() {
  const s = chiffres.satisfaction;
  const temoignages = temoignagesAffichables();

  const indicateurs = [
    { valeur: `${virgule(s.recommandation)}/${s.recommandationSur}`, libelle: "note moyenne de recommandation" },
    { valeur: `${virgule(s.satisfaction)}/${s.satisfactionSur}`, libelle: "satisfaction globale" },
  ];

  return (
    <section className="bg-cream border-y border-line">
      <div className="wrap py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <h2 className="display h-sec font-600 text-ink">Ce qu'en disent nos clients</h2>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {indicateurs.map((it) => (
                <div key={it.libelle} className="rounded-2xl border border-line bg-surface p-6">
                  <div className="display text-[2.2rem] font-600 text-ink leading-none">{it.valeur}</div>
                  <p className="mt-2 text-[0.88rem] text-body">{it.libelle}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[0.85rem] text-slateD">
              Méthode : {s.methode.charAt(0).toLowerCase() + s.methode.slice(1)} ; moyenne des notes
              déclarées par les répondants.
            </p>
          </div>

          {temoignages.length > 0 && (
            <div className="lg:col-span-7 space-y-10">
              {temoignages.map(({ temoignage: t, auteur }) => (
                <figure key={t.id} className="max-w-3xl">
                  <span aria-hidden="true" className="display text-[3rem] lg:text-[4rem] leading-none text-orange">
                    «
                  </span>
                  <blockquote className="display text-[clamp(1.3rem,1.1rem_+_0.8vw,1.7rem)] font-500 text-ink leading-snug">
                    {t.citation}
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 text-[0.9rem] text-slateD">
                    <span aria-hidden="true" className="inline-block w-6 h-px bg-orange" />
                    <span>
                      {auteur}, {formatMois(t.date)}, note de recommandation {t.note}/10
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
