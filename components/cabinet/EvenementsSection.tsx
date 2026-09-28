import { evenements, type Evenement } from "@/lib/cabinetData";
import { getAuteur } from "@/lib/content";
import { JsonLd } from "@/lib/schema-org";
import { site } from "@/config/site";
import { formatDateEvenement, aujourdhuiIso } from "@/components/cabinet/dates";

/* Page événements (L7.5). Données : lib/cabinetData.ts (evenements). Un événement
   est « à venir » si son dernier jour est postérieur ou égal à la date du build. */

function nomsIntervenants(e: Evenement): string | undefined {
  const noms = (e.intervenants || []).map((s) => getAuteur(s)?.nom).filter(Boolean) as string[];
  return noms.length ? noms.join(" et ") : undefined;
}

function eventSchema(e: Evenement) {
  const intervenants = (e.intervenants || [])
    .map((s) => getAuteur(s)?.nom)
    .filter(Boolean)
    .map((name) => ({ "@type": "Person", name }));
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.nom,
    startDate: e.date,
    endDate: e.dateFin || e.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: e.lieu,
      address: { "@type": "PostalAddress", addressLocality: e.ville, addressCountry: "FR" },
    },
    description: e.theme,
    ...(intervenants.length ? { performer: intervenants } : {}),
    url: `${site.url}/cabinet/evenements#${e.id}`,
  };
}

function Carte({ e }: { e: Evenement }) {
  const qui = nomsIntervenants(e);
  return (
    <li id={e.id} className="scroll-mt-28 rounded-2xl border border-line bg-surface p-6 lg:p-7">
      <div className="grid md:grid-cols-12 gap-4 md:gap-8">
        <div className="md:col-span-4">
          <p className="kicker text-orange700">
            <time dateTime={e.date}>{formatDateEvenement(e.date, e.dateFin)}</time>
          </p>
          <h3 className="display text-[1.3rem] font-600 text-ink mt-2 leading-snug">{e.nom}</h3>
          <p className="mt-1 text-[0.9rem] text-slateD">
            {e.lieu}, {e.ville}
          </p>
        </div>
        <div className="md:col-span-8">
          <p className="inline-flex rounded-full bg-cream border border-line px-3 py-1 text-[0.78rem] font-600 text-slateD">
            {e.role}
          </p>
          {e.intervention?.length ? (
            <ul className="mt-3 space-y-1">
              {e.intervention.map((t) => (
                <li key={t} className="display text-[1.05rem] font-500 text-ink">
                  « {t} »
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-3 text-[0.95rem] text-body leading-relaxed">{e.theme}</p>
          {qui && <p className="mt-3 text-[0.85rem] text-slateD">Pour Accelium : {qui}</p>}
        </div>
      </div>
    </li>
  );
}

export function EvenementsSection() {
  const today = aujourdhuiIso();
  const aVenir = evenements
    .filter((e) => (e.dateFin || e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const passes = evenements
    .filter((e) => (e.dateFin || e.date) < today)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <JsonLd data={evenements.map(eventSchema)} />

      <section className="wrap py-16 lg:py-24">
        <div className="max-w-[64ch] space-y-4 text-body leading-relaxed">
          <p>
            Salons professionnels, conférences, tables rondes : nous allons à la rencontre des dirigeants et des
            équipes techniques là où se préparent leurs projets. Ces rendez-vous sont l'occasion d'expliquer
            concrètement quelles aides publiques peuvent financer un investissement, une innovation ou une
            démarche de décarbonation, et à quel moment les demander.
          </p>
        </div>

        <h2 className="display h-sec font-600 text-ink mt-14">À venir</h2>
        {aVenir.length > 0 ? (
          <ul className="mt-8 space-y-4">
            {aVenir.map((e) => (
              <Carte key={e.id} e={e} />
            ))}
          </ul>
        ) : (
          <p className="mt-6 max-w-[64ch] text-body leading-relaxed">
            Les prochaines dates sont annoncées sur{" "}
            <a
              href="https://www.linkedin.com/company/accelium-conseil"
              target="_blank"
              rel="noopener noreferrer"
              className="font-600 text-orange700 hover:text-ink underline decoration-orange700/40 focusable"
            >
              la page LinkedIn d'Accelium
            </a>{" "}
            dès que notre participation est confirmée.
          </p>
        )}

        <h2 className="display h-sec font-600 text-ink mt-16">Événements passés</h2>
        <ul className="mt-8 space-y-4">
          {passes.map((e) => (
            <Carte key={e.id} e={e} />
          ))}
        </ul>
      </section>
    </>
  );
}
