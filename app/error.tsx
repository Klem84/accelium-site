"use client";

import { useEffect } from "react";
import { site } from "@/config/site";

// Page d'erreur cliente (fiche J.1.14). Pas d'export `metadata` : app/error.tsx est un composant
// client et Next.js n'y accepte pas de metadata statique.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="wrap py-28 lg:py-40 text-center">
      <p className="kicker text-orange700 mb-6">Erreur technique</p>
      <h1 className="display h-sec font-600 text-ink max-w-[26ch] mx-auto">
        Une erreur technique est survenue
      </h1>
      <p className="lede text-body max-w-[42ch] mx-auto mt-6">
        Réessayez ou appelez-nous au {site.contact.tel}.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="btn-primary focusable rounded-full px-7 py-4 text-[1rem]"
        >
          Réessayer
        </button>
        <a href={`tel:${site.contact.telHref}`} className="btn-ghost focusable rounded-full px-7 py-4 text-[1rem]">
          {site.contact.tel}
        </a>
      </div>
    </section>
  );
}
