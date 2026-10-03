"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
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

// Validation « à la volée » côté client (fiche H5) : mêmes règles que lib/validation.ts,
// dupliquées ici en version courte pour ne pas dépendre de zod dans le bundle client.
// Libellés lisibles pour les valeurs connues du paramètre ?objet=, utilisés dans le
// texte pré-rempli du champ "projet" (demande d'A1, run V2, 28/09/2026).
const OBJET_LABELS: Record<string, string> = {
  partenariat: "Objet : proposition de partenariat",
  candidature: "Objet : candidature spontanée",
};

function objetLabel(objet: string): string {
  return OBJET_LABELS[objet] || objet;
}

function validateField(name: string, value: string): string | null {
  switch (name) {
    case "nom":
      return value.trim().length >= 2 ? null : "Votre nom est requis.";
    case "societe":
      return value.trim().length >= 1 ? null : "Le nom de votre entreprise est requis.";
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? null : "Adresse email invalide.";
    case "consentement":
      return value === "on" ? null : "Le consentement est requis.";
    default:
      return null;
  }
}

function DiagnosticFormInner({ secteurs }: { secteurs: { slug: string; nom: string }[] }) {
  const router = useRouter();
  // Paramètres d'URL lus après montage (et non via useSearchParams) : useSearchParams sous
  // Suspense fait basculer tout le formulaire en rendu client, d'où un formulaire absent du
  // HTML et un décalage de mise en page (CLS 0,27) quand il apparaît. Ici le formulaire est
  // rendu dans le HTML statique et seuls le select et le textarea sont remontés (key) si un
  // pré-remplissage existe.
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => new URLSearchParams());
  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [token, setToken] = useState<string>("");
  const tsRef = useRef<HTMLDivElement>(null);
  const tsId = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Pré-remplissage depuis l'URL (?offre=, ?secteur=, ?dispositif=, ?objet=), fiche L2.7 :
  // le select secteur est pré-choisi quand la valeur correspond à un secteur connu, et le
  // contexte complet est transmis à la colonne source Monday via le champ "origine".
  const offre = searchParams.get("offre") || "";
  const secteurParam = searchParams.get("secteur") || "";
  const dispositif = searchParams.get("dispositif") || "";
  const objet = searchParams.get("objet") || "";

  const secteurInitial = useMemo(() => {
    const match = secteurs.find(
      (s) => s.slug === secteurParam || s.nom.toLowerCase() === secteurParam.toLowerCase()
    );
    return match?.nom || "";
  }, [secteurParam, secteurs]);

  const origine = useMemo(() => {
    const parts: string[] = [];
    if (offre) parts.push(`offre : ${offre}`);
    if (secteurParam && !secteurInitial) parts.push(`secteur : ${secteurParam}`);
    if (dispositif) parts.push(`dispositif : ${dispositif}`);
    if (objet) parts.push(`objet : ${objet}`);
    return parts.join(" · ");
  }, [offre, secteurParam, secteurInitial, dispositif, objet]);

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

  function focusFirstError(errors: Record<string, string[]>) {
    const order = ["nom", "societe", "email", "telephone", "secteur", "projet", "consentement"];
    const first = order.find((f) => errors[f]?.length);
    if (first && formRef.current) {
      const el = formRef.current.elements.namedItem(first) as HTMLElement | null;
      el?.focus();
    }
  }

  function onFieldBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    const msg = validateField(name, value);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (msg) next[name] = [msg];
      else delete next[name];
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      nom: String(fd.get("nom") || ""),
      societe: String(fd.get("societe") || ""),
      email: String(fd.get("email") || ""),
      telephone: String(fd.get("telephone") || ""),
      secteur: String(fd.get("secteur") || ""),
      projet: String(fd.get("projet") || ""),
      consentement: fd.get("consentement") === "on",
      origine,
      website: String(fd.get("website") || ""),
      turnstileToken: token,
    };

    // Validation à la volée avant envoi : on remonte au premier champ en erreur.
    const clientErrors: Record<string, string[]> = {};
    for (const f of ["nom", "societe", "email", "consentement"] as const) {
      const raw = f === "consentement" ? (payload.consentement ? "on" : "") : String(payload[f]);
      const msg = validateField(f, raw);
      if (msg) clientErrors[f] = [msg];
    }
    if (Object.keys(clientErrors).length) {
      setFieldErrors(clientErrors);
      setStatus("error");
      setError("Merci de corriger les champs signalés ci-dessous.");
      focusFirstError(clientErrors);
      return;
    }

    try {
      const res = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("success");
        setFieldErrors({});
        track("diagnostic_envoye", { secteur: payload.secteur || "non précisé", origine: origine || "contact" });
        const q = payload.secteur ? `?secteur=${encodeURIComponent(payload.secteur)}` : "";
        router.push(`/merci-diagnostic${q}`);
      } else {
        setStatus("error");
        setError(json.error || "Une erreur est survenue.");
        const errs = json.fieldErrors || {};
        setFieldErrors(errs);
        focusFirstError(errs);
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

  const fieldBase =
    "w-full rounded-xl border bg-surface px-4 py-3 text-ink focus:outline-none focus:border-orange700 focus:ring-2 focus:ring-orange/20";
  const fieldBorder = (hasError: boolean) => (hasError ? "border-2 border-orange700" : "border-slate");
  const fieldClass = (hasError: boolean) => `${fieldBase} ${fieldBorder(hasError)}`;
  const errClass = "mt-1 text-[0.8rem] text-orange700";

  return (
    <>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderTurnstile}
        />
      )}
      <form ref={formRef} onSubmit={onSubmit} className="space-y-5" noValidate>
        {error && (
          <p className="rounded-xl bg-orange/5 text-orange700 px-4 py-3 text-[0.92rem]" role="alert">
            {error}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="nom" className="block text-[0.85rem] font-600 text-ink mb-1.5">
              Nom <span className="text-orange700">*</span>
            </label>
            <input
              id="nom"
              name="nom"
              required
              className={fieldClass(!!fieldErrors.nom)}
              autoComplete="name"
              onBlur={onFieldBlur}
              aria-invalid={!!fieldErrors.nom}
              aria-describedby={fieldErrors.nom ? "err-nom" : undefined}
            />
            {fieldErrors.nom && (
              <p id="err-nom" className={errClass}>
                {fieldErrors.nom[0]}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="societe" className="block text-[0.85rem] font-600 text-ink mb-1.5">
              Entreprise <span className="text-orange700">*</span>
            </label>
            <input
              id="societe"
              name="societe"
              required
              className={fieldClass(!!fieldErrors.societe)}
              autoComplete="organization"
              onBlur={onFieldBlur}
              aria-invalid={!!fieldErrors.societe}
              aria-describedby={fieldErrors.societe ? "err-societe" : undefined}
            />
            {fieldErrors.societe && (
              <p id="err-societe" className={errClass}>
                {fieldErrors.societe[0]}
              </p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-[0.85rem] font-600 text-ink mb-1.5">
              Email <span className="text-orange700">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={fieldClass(!!fieldErrors.email)}
              autoComplete="email"
              onBlur={onFieldBlur}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "err-email" : undefined}
            />
            {fieldErrors.email && (
              <p id="err-email" className={errClass}>
                {fieldErrors.email[0]}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="telephone" className="block text-[0.85rem] font-600 text-ink mb-1.5">
              Téléphone
            </label>
            <input id="telephone" name="telephone" type="tel" className={fieldClass(false)} autoComplete="tel" />
          </div>
        </div>

        <div>
          <label htmlFor="secteur" className="block text-[0.85rem] font-600 text-ink mb-1.5">
            Votre secteur
          </label>
          <select key={secteurInitial} id="secteur" name="secteur" className={fieldClass(false)} defaultValue={secteurInitial}>
            <option value="">Sélectionnez</option>
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
          <textarea
            key={`${dispositif}|${objet}`}
            id="projet"
            name="projet"
            rows={4}
            className={fieldClass(false)}
            defaultValue={
              dispositif || objet
                ? `${[dispositif, objet ? objetLabel(objet) : ""].filter(Boolean).join(", ")}\n`
                : undefined
            }
            placeholder="Décrivez votre projet d'investissement, d'innovation ou de transition…"
          />
        </div>

        {/* Honeypot anti-spam (caché) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Ne pas remplir</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex items-start gap-3">
          <input
            id="consentement"
            name="consentement"
            type="checkbox"
            required
            className="mt-1 h-5 w-5 accent-orange focusable"
            onBlur={onFieldBlur}
            aria-invalid={!!fieldErrors.consentement}
            aria-describedby={fieldErrors.consentement ? "err-consentement" : undefined}
          />
          <label htmlFor="consentement" className="text-[0.85rem] text-body">
            J'accepte que mes données soient utilisées pour traiter ma demande de diagnostic, conformément à la{" "}
            <Link href="/politique-de-confidentialite" className="text-orange700 underline focusable">
              politique de confidentialité
            </Link>
            . <span className="text-orange700">*</span>
          </label>
        </div>
        {fieldErrors.consentement && (
          <p id="err-consentement" className={errClass}>
            {fieldErrors.consentement[0]}
          </p>
        )}

        {siteKey && <div ref={tsRef} className="cf-turnstile min-h-[65px]" />}

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

export function DiagnosticForm({ secteurs }: { secteurs: { slug: string; nom: string }[] }) {
  return <DiagnosticFormInner secteurs={secteurs} />;
}
