import Link from "next/link";
import { JsonLd, faqSchema } from "@/lib/schema-org";

export type FaqBlockItem = { question: string; reponse: string; lien?: string };

/**
 * Accordéon FAQ accessible (details/summary natifs, composant serveur, zéro JS client) qui injecte lui-même le
 * JSON-LD FAQPage correspondant. Composant §6.8, réutilisable sur toutes les
 * nouvelles collections (dispositif, région, secteur, glossaire, FAQ transversale).
 */
export function FaqBlock({
  items,
  title = "Questions fréquentes",
  withSchema = true,
}: {
  items: FaqBlockItem[];
  title?: string;
  withSchema?: boolean;
}) {
  if (!items?.length) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <p className="border border-dashed border-slate text-slate text-[0.85rem] p-4 rounded-xl">
          FaqBlock : aucune question fournie (développement uniquement).
        </p>
      );
    }
    return null;
  }

  return (
    <div>
      {withSchema && <JsonLd data={faqSchema(items)} />}
      {title && <h2 className="display h-sec font-600 text-ink mb-6">{title}</h2>}
      <div className="divide-y divide-line border-y border-line">
        {items.map((it, i) => (
          <details key={i} className="group" open={i === 0}>
            <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 py-5 text-left focusable [&::-webkit-details-marker]:hidden">
              <h3 className="display text-[1.1rem] font-500 text-ink">{it.question}</h3>
              <span
                className="shrink-0 text-orange700 text-2xl transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <div className="pb-6">
              <p className="text-body leading-relaxed measure">{it.reponse}</p>
              {it.lien && (
                <Link href={it.lien} className="inline-flex mt-2 text-[0.88rem] font-600 text-orange700 focusable">
                  En savoir plus →
                </Link>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
