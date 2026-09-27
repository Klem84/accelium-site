"use client";

import { useState } from "react";
import Link from "next/link";

export type CasCard = {
  slug: string;
  montant: string;
  titre: string;
  contexte: string;
  secteurNom?: string;
  image?: string;
};

export function CasGrid({
  items,
  withImage = false,
  initial = 9,
  step = 9,
}: {
  items: CasCard[];
  withImage?: boolean;
  initial?: number;
  step?: number;
}) {
  const [count, setCount] = useState(initial);
  const shown = items.slice(0, count);
  const reste = items.length - count;

  return (
    <>
      <div className="grid md:grid-cols-3 gap-4">
        {shown.map((c) =>
          withImage ? (
            <Link
              key={c.slug}
              href={`/cas-clients/${c.slug}`}
              className="group rounded-2xl overflow-hidden border border-line bg-surface shadow-soft block"
            >
              {c.image && (
                <div className="photo aspect-[16/10]">
                  <img src={c.image} alt={c.secteurNom || ""} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-7">
                {c.secteurNom && (
                  <span className="inline-flex text-[0.72rem] font-600 tracking-wide uppercase text-orange700 bg-orange/10 rounded-full px-3 py-1">
                    {c.secteurNom}
                  </span>
                )}
                <p className={`display text-[2.2rem] font-600 text-ink leading-none ${c.secteurNom ? "mt-4" : ""}`}>{c.montant}</p>
                <p className="mt-1 text-[0.82rem] font-600 text-slateD">{c.titre}</p>
                <p className="mt-2 text-[0.95rem] text-body">{c.contexte}</p>
              </div>
            </Link>
          ) : (
            <Link
              key={c.slug}
              href={`/cas-clients/${c.slug}`}
              className="rounded-2xl border border-line bg-surface p-6 hover:border-ink transition-colors focusable"
            >
              <p className="display text-[1.8rem] font-600 text-ink leading-none">{c.montant}</p>
              <p className="mt-1 text-[0.82rem] font-600 text-slateD">{c.titre}</p>
              <p className="mt-2 text-[0.92rem] text-body">{c.contexte}</p>
            </Link>
          )
        )}
      </div>

      {reste > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setCount((n) => n + step)}
            className="inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 text-[0.9rem] font-600 text-ink hover:bg-ink hover:text-white transition-colors focusable"
          >
            Charger plus
            <span className="text-slate group-hover:text-white">({reste})</span>
          </button>
        </div>
      )}
    </>
  );
}
