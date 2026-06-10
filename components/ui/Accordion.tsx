"use client";

import { useState } from "react";

export type FaqItem = { question: string; reponse: string };

export function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3>
              <button
                className="w-full flex items-center justify-between gap-4 py-5 text-left focusable"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="display text-[1.15rem] font-500 text-ink">{it.question}</span>
                <span
                  className={
                    "shrink-0 text-orange text-2xl transition-transform " + (isOpen ? "rotate-45" : "")
                  }
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </h3>
            {isOpen && <p className="pb-6 text-body leading-relaxed measure">{it.reponse}</p>}
          </div>
        );
      })}
    </div>
  );
}
