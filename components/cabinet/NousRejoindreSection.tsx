import { CtaContext } from "@/components/collections/CtaContext";
import { rejoindreRaisons, rejoindreProfils } from "@/lib/cabinetData";

/* Page « Nous rejoindre » : sobre, sans offre d'emploi ni chiffre inventé.
   Candidature spontanée via /contact?objet=candidature. */
export function NousRejoindreSection() {
  return (
    <>
      <section className="wrap py-16 lg:py-24">
        <h2 className="display h-sec font-600 text-ink">Pourquoi rejoindre Accelium</h2>
        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {rejoindreRaisons.map((r) => (
            <div key={r.titre} className="rounded-2xl border border-line bg-surface p-7">
              <h3 className="display text-[1.15rem] font-600 text-ink leading-snug">{r.titre}</h3>
              <p className="mt-2 text-[0.95rem] text-body leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream border-y border-line">
        <div className="wrap py-16 lg:py-20">
          <h2 className="display h-sec font-600 text-ink">Les profils que nous aimons rencontrer</h2>
          <p className="mt-6 max-w-[64ch] text-body leading-relaxed">
            Nous ne publions pas d'offre d'emploi en permanence, mais nous lisons toutes les candidatures
            spontanées. Voici les expériences qui nous intéressent le plus.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {rejoindreProfils.map((p) => (
              <div key={p.titre} className="rounded-2xl border border-line bg-surface p-7">
                <h3 className="display text-[1.1rem] font-600 text-ink leading-snug">{p.titre}</h3>
                <p className="mt-2 text-[0.95rem] text-body leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <h2 className="display h-sec font-600 text-ink">Candidature spontanée</h2>
            <p className="mt-4 max-w-[56ch] text-body leading-relaxed">
              Présentez-vous en quelques lignes : votre parcours, ce qui vous attire dans le financement public et
              le type de mission que vous recherchez (poste, stage, alternance). Nous vous répondons.
            </p>
          </div>
          <div className="lg:col-span-5">
            <CtaContext label="Envoyer ma candidature" param="objet" value="candidature" />
          </div>
        </div>
      </section>
    </>
  );
}
