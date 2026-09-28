"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { track } from "@vercel/analytics";

type Status = "idle" | "submitting" | "success" | "error";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback"?: () => void }) => string;
      reset: (id?: string) => void;
    };
  }
}

function validateEmail(value: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? null : "Adresse email invalide.";
}

/**
 * Formulaire d'inscription à la newsletter (fiche L8.6) : email + consentement obligatoire,
 * double opt-in (l'inscription n'est effective qu'après clic sur le lien reçu par email).
 */
export function NewsletterSignup() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onEmailBlur(e: React.FocusEvent<HTMLInputElement>) {
    const msg = validateEmail(e.target.value);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (msg) next.email = [msg];
      else delete next.email;
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const payload = {
      email,
      consentement: fd.get("consentement") === "on",
      website: String(fd.get("website") || ""),
      turnstileToken: token,
    };

    const clientErrors: Record<string, string[]> = {};
    const emailMsg = validateEmail(email);
    if (emailMsg) clientErrors.email = [emailMsg];
    if (!payload.consentement) clientErrors.consentement = ["Le consentement est requis."];
    if (Object.keys(clientErrors).length) {
      setFieldErrors(clientErrors);
      setStatus("error");
      setError("Merci de corriger les champs signalés ci-dessous.");
      const order = ["email", "consentement"];
      const first = order.find((f) => clientErrors[f]?.length);
      if (first && formRef.current) {
        (formRef.current.elements.namedItem(first) as HTMLElement | null)?.focus();
      }
      return;
    }

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("success");
        setFieldErrors({});
        track("newsletter_inscription_demandee");
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

  const fieldClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";
  const errClass = "mt-1 text-[0.8rem] text-orange700";

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-cream p-6">
        <p className="font-600 text-ink">Vérifiez votre boîte mail</p>
        <p className="mt-1 text-[0.9rem] text-body">
          Un email de confirmation vient de vous être envoyé. Cliquez sur le lien qu'il contient pour finaliser
          votre inscription.
        </p>
      </div>
    );
  }

  return (
    <>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderTurnstile}
        />
      )}
      <form ref={formRef} onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && (
          <p className="rounded-xl bg-orange/10 text-orange700 px-4 py-3 text-[0.9rem]" role="alert">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="newsletter-email" className="block text-[0.85rem] font-600 text-ink mb-1.5">
            Email <span className="text-orange">*</span>
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            className={fieldClass}
            autoComplete="email"
            placeholder="vous@entreprise.fr"
            onBlur={onEmailBlur}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "newsletter-err-email" : undefined}
          />
          {fieldErrors.email && (
            <p id="newsletter-err-email" className={errClass}>
              {fieldErrors.email[0]}
            </p>
          )}
        </div>

        {/* Honeypot anti-spam (caché) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="newsletter-website">Ne pas remplir</label>
          <input id="newsletter-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex items-start gap-3">
          <input
            id="newsletter-consentement"
            name="consentement"
            type="checkbox"
            required
            className="mt-1 h-5 w-5 accent-orange focusable"
            aria-invalid={!!fieldErrors.consentement}
            aria-describedby={fieldErrors.consentement ? "newsletter-err-consentement" : undefined}
          />
          <label htmlFor="newsletter-consentement" className="text-[0.85rem] text-body">
            J'accepte de recevoir la newsletter d'Accelium Conseil par email et que mes données soient utilisées à
            cette fin, conformément à la{" "}
            <Link href="/politique-de-confidentialite" className="text-orange700 underline focusable">
              politique de confidentialité
            </Link>
            . <span className="text-orange">*</span>
          </label>
        </div>
        {fieldErrors.consentement && (
          <p id="newsletter-err-consentement" className={errClass}>
            {fieldErrors.consentement[0]}
          </p>
        )}

        {siteKey && <div ref={tsRef} className="cf-turnstile" />}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary focusable rounded-full px-7 py-3.5 text-[0.95rem] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Envoi en cours…" : "Recevoir la newsletter"}
        </button>
      </form>
    </>
  );
}
