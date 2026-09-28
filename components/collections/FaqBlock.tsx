"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { JsonLd, faqSchema } from "@/lib/schema-org";

export type FaqBlockItem = { question: string; reponse: string; lien?: string };

/**
 * Accordéon FAQ accessible (aria-expanded / aria-controls) qui injecte lui-même le
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
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  if (!items?.length) {
    return (
      <p className="text-[0.9rem] text-slate italic">
        Les questions fréquentes de cette page sont en cours de rédaction.
      </p>
    );
  }

  return (
    <div>
      {withSchema && <JsonLd data={faqSchema(items)} />}
      {title && <h2 className="display h-sec font-600 text-ink mb-6">{title}</h2>}
      <div className="divide-y divide-line border-y border-line">
        {items.map((it, i) => {
          const isOpen = open === i;
          const panelId = `${baseId}-panel-${i}`;
          const buttonId = `${baseId}-button-${i}`;
          return (
            <div key={panelId}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  className="w-full flex items-center justify-between gap-4 py-5 text-left focusable"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="display text-[1.1rem] font-500 text-ink">{it.question}</span>
                  <span
                    className={"shrink-0 text-orange text-2xl transition-transform " + (isOpen ? "rotate-45" : "")}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="pb-6"
              >
                <p className="text-body leading-relaxed measure">{it.reponse}</p>
                {it.lien && (
                  <Link href={it.lien} className="inline-flex mt-2 text-[0.88rem] font-600 text-orange700 focusable">
                    En savoir plus →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
