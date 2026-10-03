import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";

/**
 * CTA contextualisé (§6.1, §6.4, §6.6, §6.8) : ajoute un paramètre de contexte à
 * /contact pour que le formulaire ou le suivi commercial sache d'où vient la
 * demande, sans jamais mentionner d'honoraires.
 */
export function CtaContext({
  title,
  label,
  param,
  value,
  extra,
  text,
  withPhone = false,
}: {
  title?: string;
  label?: string;
  param?: "dispositif" | "offre" | "secteur" | "objet" | "region";
  value?: string;
  /** Paramètres supplémentaires (ex. { pistes: "cir,cii" } pour le Quiz). */
  extra?: Record<string, string>;
  text?: string;
  withPhone?: boolean;
}) {
  if (!label) return null;
  const params = new URLSearchParams();
  if (param && value) params.set(param, value);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v) params.set(k, v);
    }
  }
  const query = params.toString();
  const href = query ? `/contact?${query}` : "/contact";
  return (
    <div className="rounded-2xl bg-ink text-white p-7">
      {title && <p className="display text-[1.35rem] font-600 mb-3">{title}</p>}
      {text && <p className="text-[0.92rem] text-white/70 mb-4">{text}</p>}
      <Button href={href} variant="primary">
        {label}
      </Button>
      {withPhone && (
        <p className="mt-4 text-[0.88rem] text-white">
          ou appelez le{" "}
          <a href={`tel:${site.contact.telHref}`} className="underline decoration-white/40 focusable">
            {site.contact.tel}
          </a>
        </p>
      )}
    </div>
  );
}
