import Link from "next/link";
import { referencesConfirmees } from "@/config/references";

/** Seuil de rendu fixé par le plan V2 §5.1 : au moins 5 références confirmées. */
const SEUIL = 5;

/**
 * Section « Ils nous font confiance » (plan V2 §5.1). Ne rend RIEN (ni titre, ni
 * nom, ni logo dans le HTML) tant que config/references.ts compte moins de 5
 * entrées `confirme: true` non refusées. Aujourd'hui : aucune, donc section absente.
 */
export function ConfianceSection() {
  const refs = referencesConfirmees();
  if (refs.length < SEUIL) return null;

  return (
    <section className="wrap py-20 lg:py-28 border-b border-line">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div className="reveal">
          <p className="kicker text-orange700 mb-4">Références</p>
          <h2 className="display h-sec font-600 text-ink max-w-[18ch]">Ils nous font confiance</h2>
        </div>
        <Link href="/cabinet/partenaires" className="btn-ghost focusable rounded-full px-6 py-3 text-[0.92rem] reveal">
          Nos partenaires et le cercle
        </Link>
      </div>
      <ul data-stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {refs.slice(0, 12).map((r) => (
          <li
            key={r.id}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface p-5 text-center h-full"
          >
            {r.logo && !r.logoFondSombre ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.logo} alt="" loading="lazy" decoding="async" className="h-12 w-auto max-w-full object-contain" />
            ) : null}
            <span className="text-[0.85rem] font-600 text-ink leading-tight">{r.nom}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
