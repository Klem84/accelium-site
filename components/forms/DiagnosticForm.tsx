"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";

type Status = "idle" | "submitting" | "success" | "error";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback"?: () => void }) => string;
      reset: (id?: string) => void;
    };
  }
}

export function DiagnosticForm({ secteurs }: { secteurs: { slug: string; nom: string }[] }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [token, setToken] = useState<string>("");
  const tsRef = useRef<HTMLDivElement>(null);
  const tsId = useRef<string | null>(null);

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
      telephone: String(fd.get("telephone") || ""),
      secteur: String(fd.get("secteur") || ""),
      projet: String(fd.get("projet") || ""),
      consentement: fd.get("consentement") === "on",
      website: String(fd.get("website") || ""),
      turnstileToken: token,
    };

    try {
      const res = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(json.error || "Une erreur est survenue.");
        setFieldErrors(json.fieldErrors || {});
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

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-cream p-8" role="status" aria-live="polite">
        <p className="display text-[1.6rem] font-600 text-ink">Merci, c'est reçu&nbsp;!</p>
        <p className="mt-3 text-body">
          Votre demande de diagnostic nous est bien parvenue. Un expert Accelium reviendra vers vous très
          rapidement. Vous allez également recevoir un email de confirmation.
        </p>
      </div>
    );
  }

  const fieldClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

  return (
    <>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderTurnstile}
        />
      )}
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {error && (
          <p className="rounded-xl bg-orange/10 text-orange700 px-4 py-3 text-[0.92rem]" role="alert">
            {error}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="nom" className="block text-[0.85rem] font-600 text-ink mb-1.5">
              Nom <span className="text-orange">*</span>
            </label>
            <input id="nom" name="nom" required className={fieldClass} autoComplete="name" />
            {fieldErrors.nom && <p className="mt-1 text-[0.8rem] text-orange700">{fieldErrors.nom[0]}</p>}
          </div>
          <div>
            <label htmlFor="societe" className="block text-[0.85rem] font-600 text-ink mb-1.5">
              Entreprise <span className="text-orange">*</span>
            </label>
            <input id="societe" name="societe" required className={fieldClass} autoComplete="organization" />
            {fieldErrors.societe && <p className="mt-1 text-[0.8rem] text-orange700">{fieldErrors.societe[0]}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-[0.85rem] font-600 text-ink mb-1.5">
              Email <span className="text-orange">*</span>
            </label>
            <input id="email" name="email" type="email" required className={fieldClass} autoComplete="email" />
            {fieldErrors.email && <p className="mt-1 text-[0.8rem] text-orange700">{fieldErrors.email[0]}</p>}
          </div>
          <div>
            <label htmlFor="telephone" className="block text-[0.85rem] font-600 text-ink mb-1.5">
              Téléphone
            </label>
            <input id="telephone" name="telephone" type="tel" className={fieldClass} autoComplete="tel" />
          </div>
        </div>

        <div>
          <label htmlFor="secteur" className="block text-[0.85rem] font-600 text-ink mb-1.5">
            Votre secteur
          </label>
          <select id="secteur" name="secteur" className={fieldClass} defaultValue="">
            <option value="">— Sélectionnez —</option>
            {secteurs.map((s) => (
              <option key={s.slug} value={s.nom}>
                {s.nom}
              </option>
            ))}
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div>
          <label htmlFor="projet" className="block text-[0.85rem] font-600 text-ink mb-1.5">
            Votre projet
          </label>
          <textarea id="projet" name="projet" rows={4} className={fieldClass} placeholder="Décrivez votre projet d'investissement, d'innovation ou de transition…" />
        </div>

        {/* Honeypot anti-spam (caché) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Ne pas remplir</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex items-start gap-3">
          <input id="consentement" name="consentement" type="checkbox" required className="mt-1 h-5 w-5 accent-orange focusable" />
          <label htmlFor="consentement" className="text-[0.85rem] text-body">
            J'accepte que mes données soient utilisées pour traiter ma demande de diagnostic, conformément à la{" "}
            <Link href="/politique-de-confidentialite" className="text-orange700 underline focusable">
              politique de confidentialité
            </Link>
            . <span className="text-orange">*</span>
          </label>
        </div>
        {fieldErrors.consentement && <p className="text-[0.8rem] text-orange700">{fieldErrors.consentement[0]}</p>}

        {siteKey && <div ref={tsRef} className="cf-turnstile" />}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary focusable rounded-full px-8 py-4 text-[1rem] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Envoi en cours…" : "Obtenir mon diagnostic gratuit"}
        </button>
      </form>
    </>
  );
}
