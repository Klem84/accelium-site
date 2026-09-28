import { Button } from "@/components/ui/Button";

/**
 * CTA contextualisé (§6.1, §6.4, §6.6, §6.8) : ajoute un paramètre de contexte à
 * /contact pour que le formulaire ou le suivi commercial sache d'où vient la
 * demande, sans jamais mentionner d'honoraires.
 */
export function CtaContext({
  label,
  param,
  value,
  text,
}: {
  label: string;
  param: "dispositif" | "offre" | "secteur" | "objet";
  value: string;
  text?: string;
}) {
  const href = `/contact?${param}=${encodeURIComponent(value)}`;
  return (
    <div className="rounded-2xl bg-ink text-white p-7">
      {text && <p className="text-[0.9rem] text-white/70 mb-4">{text}</p>}
      <Button href={href} variant="primary">
        {label}
      </Button>
    </div>
  );
}
