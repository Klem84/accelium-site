"use client";

import { useId, useState } from "react";

export type FaqItem = { question: string; reponse: string };

export function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-accordion-bouton-${i}`;
        const panelId = `${baseId}-accordion-panneau-${i}`;
        return (
          <div key={i}>
            <h3>
              <button
                id={buttonId}
                className="w-full flex items-center justify-between gap-4 py-5 text-left focusable"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="display text-[1.15rem] font-500 text-ink">{it.question}</span>
                <span
                  className={
                    "shrink-0 text-orange700 text-2xl transition-transform " + (isOpen ? "rotate-45" : "")
                  }
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
            >
              <p className="pb-6 text-body leading-relaxed measure">{it.reponse}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
