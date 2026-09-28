import Image from "next/image";
import Link from "next/link";
import { getAuteur, type Auteur } from "@/lib/content";
import { equipeMembres, evenements } from "@/lib/cabinetData";
import { JsonLd, personSchema } from "@/lib/schema-org";
import { formatDateEvenement } from "@/components/cabinet/dates";

/* Champs complémentaires des fiches content/auteurs/<slug>.mdx utilisés pour la
   page équipe et le schéma Person (le type Auteur de lib/content.ts ne porte que
   les champs communs). */
type Membre = Auteur & {
  jobTitle?: string;
  honorificSuffix?: string;
  alumniOf?: string[];
  formation?: string;
  knowsAbout?: string[];
  aValider?: boolean;
};

function getMembres(): Membre[] {
  return equipeMembres
    .map((slug) => getAuteur(slug) as Membre | undefined)
    .filter((m): m is Membre => !!m);
}

function membreSchema(m: Membre) {
  return {
    ...personSchema({
      name: m.nom,
      jobTitle: m.jobTitle || m.fonction,
      url: `/cabinet/equipe#${m.slug}`,
      image: m.photo,
      sameAs: m.linkedin ? [m.linkedin] : undefined,
      worksFor: true,
    }),
    ...(m.honorificSuffix ? { honorificSuffix: m.honorificSuffix } : {}),
    description: m.bio,
    ...(m.alumniOf?.length
      ? { alumniOf: m.alumniOf.map((name) => ({ "@type": "CollegeOrUniversity", name })) }
      : {}),
    ...(m.knowsAbout?.length ? { knowsAbout: m.knowsAbout } : {}),
  };
}

export function EquipeSection() {
  const membres = getMembres();

  return (
    <>
      {membres.length > 0 && <JsonLd data={membres.map(membreSchema)} />}

      <section className="wrap py-16 lg:py-24">
        <div className="max-w-[64ch] space-y-4 text-body leading-relaxed mb-14">
          <p>
            L'équipe réunit deux cultures complémentaires : l'analyse financière et le pilotage de projets
            complexes, acquis dans la banque et le conseil, et la recherche appliquée, acquise en laboratoire et
            en direction R&amp;D industrielle.
          </p>
          <p>
            Chaque dossier est suivi par un interlocuteur unique, du diagnostic au versement de l'aide, pour des
            entreprises situées partout en France.
          </p>
        </div>

        <div className="space-y-16 lg:space-y-20">
          {membres.map((m) => {
            const interventions = evenements
              .filter((e) => e.intervenants?.includes(m.slug) && e.role !== "Présence sur le salon")
              .sort((a, b) => b.date.localeCompare(a.date));
            return (
              <article
                key={m.slug}
                id={m.slug}
                className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start scroll-mt-28"
              >
                <div className="lg:col-span-4">
                  {m.photo && (
                    <Image
                      src={m.photo}
                      alt={`Portrait de ${m.nom}`}
                      width={800}
                      height={800}
                      sizes="(min-width: 1024px) 30vw, 100vw"
                      className="w-full max-w-[360px] aspect-square object-cover rounded-3xl border border-line bg-cream"
                    />
                  )}
                </div>
                <div className="lg:col-span-8">
                  <p className="kicker text-orange700 mb-3">{m.fonction}</p>
                  <h2 className="display h-sec font-600 text-ink">
                    {m.nom}
                    {m.honorificSuffix ? <span className="text-slate">, {m.honorificSuffix}</span> : null}
                  </h2>
                  <p className="mt-6 text-body leading-relaxed max-w-[68ch]">{m.bio}</p>

                  <div className="mt-8 grid md:grid-cols-2 gap-8">
                    {m.expertise && m.expertise.length > 0 && (
                      <div>
                        <h3 className="display text-[1.1rem] font-600 text-ink mb-3">Dispositifs maîtrisés</h3>
                        <ul className="flex flex-wrap gap-2">
                          {m.expertise.map((e) => (
                            <li
                              key={e}
                              className="inline-flex rounded-full border border-line bg-cream px-3.5 py-1.5 text-[0.85rem] font-500 text-slateD"
                            >
                              {e}
                            </li>
                          ))}
                        </ul>
                        {m.formation && (
                          <p className="mt-5 text-[0.9rem] text-slateD">
                            <span className="font-600 text-ink">Formation : </span>
                            {m.formation}
                          </p>
                        )}
                      </div>
                    )}
                    {interventions.length > 0 && (
                      <div>
                        <h3 className="display text-[1.1rem] font-600 text-ink mb-3">Interventions</h3>
                        <ul className="space-y-3">
                          {interventions.map((e) => (
                            <li key={e.id} className="text-[0.92rem] text-body leading-snug">
                              <span className="font-600 text-ink">{e.nom}</span>
                              <span className="text-slateD">
                                {" "}
                                ({e.ville}, {formatDateEvenement(e.date, e.dateFin)})
                              </span>
                              <span className="block text-[0.85rem] text-slateD">
                                {e.role}
                                {e.intervention?.length ? ` : « ${e.intervention.join(" » ; « ")} »` : ""}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href="/cabinet/evenements"
                          className="inline-flex mt-4 text-[0.9rem] font-600 text-orange700 hover:text-ink focusable"
                        >
                          Tous les événements
                        </Link>
                      </div>
                    )}
                  </div>

                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Profil LinkedIn de ${m.nom} (nouvel onglet)`}
                      className="inline-flex items-center gap-1 mt-8 display text-[1.02rem] font-600 text-ink hover:text-orange700 focusable"
                    >
                      Profil LinkedIn ↗
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-16 pt-10 border-t border-line">
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
    </>
  );
}
