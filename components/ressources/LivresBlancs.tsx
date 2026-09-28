"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { livresBlancs, type LivreBlanc } from "@/config/livres-blancs";

type Status = "idle" | "submitting" | "success" | "error";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (t: string) => void; "expired-callback"?: () => void }
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

export function LivresBlancs() {
  const [selected, setSelected] = useState<LivreBlanc | null>(null);

  return (
    <>
      <div data-stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {livresBlancs.map((l) => (
          <article
            key={l.slug}
            className="flex flex-col rounded-2xl border border-line bg-surface shadow-soft overflow-hidden"
          >
            <div className="relative bg-ink p-7 pb-8">
              <span className="inline-flex text-[0.72rem] font-600 tracking-wide uppercase text-orange2 bg-white/10 rounded-full px-3 py-1">
                {l.categorie}
              </span>
              <p className="display text-[1.35rem] font-600 text-white mt-5 leading-tight">{l.titre}</p>
              <p className="mt-2 text-[0.9rem] text-white/70">{l.sousTitre}</p>
              <span aria-hidden="true" className="absolute right-6 top-6 text-white/15 text-5xl">↓</span>
            </div>
            <div className="flex flex-1 flex-col p-7">
              <p className="text-[0.95rem] text-body flex-1">{l.description}</p>
              <button
                type="button"
                onClick={() => setSelected(l)}
                className="btn-primary focusable mt-6 rounded-full px-6 py-3 text-[0.95rem] self-start"
              >
                Télécharger gratuitement
              </button>
            </div>
          </article>
        ))}
      </div>

      {selected && <LivreBlancModal livre={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function LivreBlancModal({ livre, onClose }: { livre: LivreBlanc; onClose: () => void }) {
  const router = useRouter();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [token, setToken] = useState<string>("");
  const tsRef = useRef<HTMLDivElement>(null);
  const tsId = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const renderTurnstile = () => {
    if (siteKey && window.turnstile && tsRef.current && !tsId.current) {
      tsId.current = window.turnstile.render(tsRef.current, {
        sitekey: siteKey,
        callback: (t) => setToken(t),
        "expired-callback": () => setToken(""),
      });
    }
  };

  useEffect(() => {
    renderTurnstile();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    setFieldErrors({});

    const fd = new FormData(e.currentTarget);
    const payload = {
      nom: String(fd.get("nom") || ""),
      societe: String(fd.get("societe") || ""),
      email: String(fd.get("email") || ""),
      livreBlanc: livre.slug,
      consentement: fd.get("consentement") === "on",
      website: String(fd.get("website") || ""),
      turnstileToken: token,
    };

    try {
      const res = await fetch("/api/livre-blanc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("success");
        track("livre_blanc_telecharge", { slug: livre.slug, titre: livre.titre });
        router.push(`/merci-livre-blanc?doc=${encodeURIComponent(livre.slug)}`);
      } else {
        setStatus("error");
        setError(json.error || "Une erreur est survenue.");
        const errs = json.fieldErrors || {};
        setFieldErrors(errs);
        if (formRef.current) {
          const order = ["nom", "email"];
          const first = order.find((f) => errs[f]?.length);
          if (first) (formRef.current.elements.namedItem(first) as HTMLElement | null)?.focus();
        }
        if (window.turnstile && tsId.current) {
          window.turnstile.reset(tsId.current);
          setToken("");
        }
      }
    } catch {
      setStatus("error");
      setError("Impossible d'envoyer le formulaire. Vérifiez votre connexion ou appelez-nous.");
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lb-titre"
    >
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-surface shadow-soft border border-line">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 h-9 w-9 rounded-full bg-cream text-ink flex items-center justify-center hover:bg-line focusable"
        >
          ✕
        </button>

        <div className="p-7 sm:p-9">
          {status === "success" ? (
            <div role="status" aria-live="polite">
              <p className="display text-[1.6rem] font-600 text-ink">C'est envoyé&nbsp;!</p>
              <p className="mt-3 text-body">
                Le livre blanc <strong>«&nbsp;{livre.titre}&nbsp;»</strong> vient de vous être envoyé par email,
                avec votre lien de téléchargement. Pensez à vérifier vos spams si vous ne le voyez pas tout de suite.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary focusable mt-6 rounded-full px-6 py-3 text-[0.95rem]"
              >
                Fermer
              </button>
            </div>
          ) : (
            <>
              <p className="kicker text-orange700 mb-2">Livre blanc</p>
              <p id="lb-titre" className="display text-[1.5rem] font-600 text-ink leading-tight">
                {livre.titre}
              </p>
              <p className="mt-2 text-[0.92rem] text-body">
                Renseignez vos coordonnées : nous vous envoyons le document par email, immédiatement.
              </p>

              {siteKey && (
                <Script
                  src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                  strategy="afterInteractive"
                  onLoad={renderTurnstile}
                />
              )}

              <form ref={formRef} onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                {error && (
                  <p className="rounded-xl bg-orange/10 text-orange700 px-4 py-3 text-[0.92rem]" role="alert">
                    {error}
                  </p>
                )}

                <div>
                  <label htmlFor="lb-nom" className="block text-[0.85rem] font-600 text-ink mb-1.5">
                    Nom <span className="text-orange">*</span>
                  </label>
                  <input
                    id="lb-nom"
                    name="nom"
                    required
                    className={fieldClass}
                    autoComplete="name"
                    aria-invalid={!!fieldErrors.nom}
                    aria-describedby={fieldErrors.nom ? "err-lb-nom" : undefined}
                  />
                  {fieldErrors.nom && (
                    <p id="err-lb-nom" className="mt-1 text-[0.8rem] text-orange700">{fieldErrors.nom[0]}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lb-societe" className="block text-[0.85rem] font-600 text-ink mb-1.5">
                    Entreprise
                  </label>
                  <input id="lb-societe" name="societe" className={fieldClass} autoComplete="organization" />
                </div>

                <div>
                  <label htmlFor="lb-email" className="block text-[0.85rem] font-600 text-ink mb-1.5">
                    Email <span className="text-orange">*</span>
                  </label>
                  <input
                    id="lb-email"
                    name="email"
                    type="email"
                    required
                    className={fieldClass}
                    autoComplete="email"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "err-lb-email" : undefined}
                  />
                  {fieldErrors.email && (
                    <p id="err-lb-email" className="mt-1 text-[0.8rem] text-orange700">{fieldErrors.email[0]}</p>
                  )}
                </div>

                {/* Honeypot anti-spam (caché) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="lb-website">Ne pas remplir</label>
                  <input id="lb-website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="lb-consentement"
                    name="consentement"
                    type="checkbox"
                    required
                    className="mt-1 h-5 w-5 accent-orange focusable"
                    aria-invalid={!!fieldErrors.consentement}
                    aria-describedby={fieldErrors.consentement ? "err-lb-consentement" : undefined}
                  />
                  <label htmlFor="lb-consentement" className="text-[0.85rem] text-body">
                    J'accepte que mes données soient utilisées pour recevoir ce document et être recontacté(e),
                    conformément à la{" "}
                    <Link href="/politique-de-confidentialite" className="text-orange700 underline focusable">
                      politique de confidentialité
                    </Link>
                    . <span className="text-orange">*</span>
                  </label>
                </div>
                {fieldErrors.consentement && (
                  <p id="err-lb-consentement" className="text-[0.8rem] text-orange700">{fieldErrors.consentement[0]}</p>
                )}

                {siteKey && <div ref={tsRef} className="cf-turnstile" />}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary focusable w-full rounded-full px-8 py-4 text-[1rem] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? "Envoi en cours…" : "Recevoir le livre blanc"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
