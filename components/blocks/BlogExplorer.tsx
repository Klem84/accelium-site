"use client";

import { useEffect, useState } from "react";
import { BlogCard } from "@/components/blocks/BlogCard";
import { FicheCard } from "@/components/blocks/FicheCard";
import { fichesDecryptage } from "@/config/fiches-decryptage";
import { clusterLabels } from "@/lib/utils";
import type { Doc, Article } from "@/lib/content";

// Exploration du blog par onglets, filtrage côté client (pas de navigation) :
//  · Tous     → articles ET fiches mêlés dans une seule grille, sans distinction
//  · <cluster>→ uniquement les articles de la catégorie
//  · Fiches   → uniquement les fiches de décryptage
// Deep-link possible via le hash (#fiches, #actualite…).
const FICHES = "fiches";

export function BlogExplorer({ articles }: { articles: Doc<Article>[] }) {
  const clusters = Array.from(new Set(articles.map((a) => a.cluster)));
  const tabs = [
    { id: "all", label: "Tous" },
    ...clusters.map((c) => ({ id: c, label: clusterLabels[c] || c })),
    { id: FICHES, label: "Fiches de décryptage" },
  ];

  const [active, setActive] = useState("all");

  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (h && tabs.some((t) => t.id === h)) setActive(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (id: string) => {
    setActive(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", id === "all" ? window.location.pathname : `#${id}`);
    }
  };

  const articlesAffiches =
    active === FICHES ? [] : active === "all" ? articles : articles.filter((a) => a.cluster === active);
  const montrerFiches = active === "all" || active === FICHES;
  const vide = articlesAffiches.length === 0 && !montrerFiches;

  return (
    <>
      <div role="tablist" aria-label="Filtrer le blog" className="flex flex-wrap gap-2 mb-10">
        {tabs.map((t) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => select(t.id)}
              className={
                on
                  ? "inline-flex rounded-full bg-ink text-white px-4 py-2 text-[0.85rem] font-500 focusable"
                  : "inline-flex rounded-full border border-line px-4 py-2 text-[0.85rem] font-500 text-ink hover:border-ink focusable"
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {vide ? (
        <p className="text-body">Contenu en cours de publication.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {articlesAffiches.map((a) => (
            <BlogCard key={a.slug} article={a} />
          ))}
          {montrerFiches && fichesDecryptage.map((f) => <FicheCard key={f.slug} fiche={f} />)}
        </div>
      )}
    </>
  );
}
