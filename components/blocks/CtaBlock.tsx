import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";

export function CtaBlock({
  title = "Prêt à optimiser vos financements publics ?",
  text = "Le premier diagnostic est gratuit et sans engagement. En quelques minutes, identifions votre potentiel d'aides.",
  cta = site.cta,
}: {
  title?: string;
  text?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="bg-ink text-white">
      <div className="wrap py-20 lg:py-28">
        <div className="max-w-2xl reveal">
          <h2 className="display text-[clamp(1.9rem,1.3rem_+_2.4vw,3.2rem)] font-600 leading-tight">
            {title}
          </h2>
          <p className="lede mt-5 text-white/80">{text}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href={cta.href} variant="primary">
              {cta.label}
            </Button>
            <a
              href={`tel:${site.contact.telHref}`}
              className="btn-ghost-d focusable rounded-full px-7 py-4 text-[1rem]"
            >
              {site.contact.tel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
