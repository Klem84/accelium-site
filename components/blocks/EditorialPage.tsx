import { notFound } from "next/navigation";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { Mdx } from "@/components/Mdx";
import { getPage } from "@/lib/content";
import type { Crumb } from "@/components/ui/Breadcrumb";

export function EditorialPage({
  slug,
  kicker,
  crumbs,
  showCta = true,
}: {
  slug: string;
  kicker?: string;
  crumbs?: Crumb[];
  showCta?: boolean;
}) {
  const p = getPage(slug);
  if (!p) notFound();
  return (
    <>
      <PageHero kicker={kicker} title={p.h1} intro={p.intro} crumbs={crumbs} />
      <section className="wrap py-16 lg:py-24">
        <div className="max-w-[72ch]">
          <Mdx source={p.body} />
        </div>
      </section>
      <RelatedLinks related={p.related} />
      {showCta && <CtaBlock />}
    </>
  );
}
