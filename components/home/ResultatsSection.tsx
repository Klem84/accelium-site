import Image from "next/image";
import Link from "next/link";
import { getCasClients, getSecteurs } from "@/lib/content";

/**
 * Section « Résultats » de l'accueil (plan V2 §5.1, carte selon spec A8 §4.8).
 * Trois cas `featured`, indexables et « d'aide obtenue » uniquement (jamais
 * d'aide demandée), avec montant, financeur et taux d'aide s'il est renseigné.
 * Cas anonymisés : aucun nom de client.
 */
export function ResultatsSection() {
  const secteurs = new Map(getSecteurs().map((s) => [s.slug, s.nom]));
  const cas = getCasClients()
    .filter(
      (c) =>
        c.featured === true &&
        c.indexable !== false &&
        (c.montantLabel || "").toLowerCase().includes("obtenue")
    )
    .slice(0, 3);

  if (cas.length === 0) return null;

  return (
    <section className="cv-auto wrap py-24 lg:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
        <div className="reveal">
          <p className="kicker text-orange700 mb-4">Résultats</p>
          <h2 className="display h-sec font-600 text-ink max-w-[18ch]">
            Derrière chaque accompagnement, un projet financé
          </h2>
          <p className="mt-4 text-[0.92rem] text-slateD measure">
            Projets réels accompagnés par Accelium : montants d'aide obtenus, clients anonymisés.
          </p>
        </div>
        <Link href="/cas-clients" className="btn-ghost focusable rounded-full px-6 py-3 text-[0.92rem] reveal">
          Tous nos cas clients
        </Link>
      </div>

      <div data-stagger className="grid md:grid-cols-3 gap-4">
        {cas.map((c) => {
          const financeur = c.financeurNom || "";
          const pied = [
            financeur ? { k: "Financeur", v: financeur } : null,
            c.taux ? { k: "Taux d'aide", v: c.taux } : null,
            c.delai ? { k: "Délai", v: c.delai } : null,
          ].filter((x): x is { k: string; v: string } => x !== null);

          return (
            <Link
              key={c.slug}
              href={`/cas-clients/${c.slug}`}
              className="group flex flex-col h-full rounded-2xl overflow-hidden border border-line bg-surface shadow-soft hover:border-ink transition-colors focusable"
            >
              {c.image && (
                <div className="relative photo aspect-[16/10]">
                  <Image src={c.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </div>
              )}
              <div className="p-7 flex flex-col flex-1">
                <span className="inline-flex self-start text-[0.72rem] font-600 tracking-wide uppercase text-orange700 bg-orange/5 rounded-full px-3 py-1">
                  {secteurs.get(c.secteur) || c.secteur}
                </span>
                <p className="display text-[2.2rem] font-600 text-ink group-hover:text-orange700 transition-colors mt-4 leading-none">
                  {c.montant}
                </p>
                <p className="mt-1 text-[0.82rem] font-600 text-slateD">{c.titre}</p>
                <p className="mt-2 text-[0.95rem] text-body flex-1">{c.contexte}</p>
                {pied.length > 0 && (
                  <dl className="mt-5 pt-4 border-t border-line grid grid-cols-2 gap-4">
                    {pied.map((p) => (
                      <div key={p.k}>
                        <dt className="text-[0.7rem] uppercase tracking-wide text-slate">{p.k}</dt>
                        <dd className="mt-1 text-[0.88rem] font-600 text-ink">{p.v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
