"use client";

import { useState } from "react";

export type Partner = {
  nom: string;
  type: string; // ex. "Expert-comptable", "Bureau d'études", "Membre du cercle"
  ville?: string;
  site?: string;
  phrase?: string;
  logo?: string;
  confirme: boolean;
};

/**
 * Carte partenaire ou membre du cercle (§6.6, §6.8). Ne rend rien si `confirme`
 * n'est pas strictement true (règle §2.6 du brief commun) : aucun nom ni logo non
 * confirmé ne doit apparaître dans le HTML.
 */
export function PartnerCard({ partner }: { partner: Partner }) {
  const [logoError, setLogoError] = useState(false);
  if (!partner.confirme) return null;

  const inner = (
    <>
      <div className="flex items-center gap-4">
        {partner.logo && !logoError ? (
          <img
            src={partner.logo}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setLogoError(true)}
            className="w-14 h-14 object-contain rounded-lg border border-line bg-white p-1.5"
          />
        ) : (
          <span className="w-14 h-14 rounded-lg bg-cream border border-line flex items-center justify-center text-slateD text-[0.75rem] font-600">
            {partner.nom.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div>
          <p className="display text-[1.05rem] font-600 text-ink leading-tight">{partner.nom}</p>
          <p className="text-[0.8rem] text-slate mt-0.5">
            {partner.type}
            {partner.ville ? ` · ${partner.ville}` : ""}
          </p>
        </div>
      </div>
      {partner.phrase && <p className="mt-3 text-[0.9rem] text-body">{partner.phrase}</p>}
    </>
  );

  if (partner.site) {
    return (
      <a
        href={partner.site}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${partner.nom}, site web (nouvel onglet)`}
        className="block rounded-2xl border border-line bg-surface p-6 hover:border-ink transition-colors focusable"
      >
        {inner}
      </a>
    );
  }

  return <div className="rounded-2xl border border-line bg-surface p-6">{inner}</div>;
}
