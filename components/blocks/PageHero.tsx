import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";

export function PageHero({
  kicker,
  title,
  intro,
  crumbs,
}: {
  kicker?: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="bg-cream border-b border-line">
      <div className="wrap pt-32 lg:pt-44 pb-14 lg:pb-20">
        {crumbs && (
          <div className="mb-8">
            <Breadcrumb items={crumbs} />
          </div>
        )}
        {kicker && <p className="kicker text-orange700 mb-4">{kicker}</p>}
        <h1 className="display h-sec font-600 text-ink max-w-[22ch]">{title}</h1>
        {intro && <p className="lede text-body mt-6 measure">{intro}</p>}
      </div>
    </section>
  );
}
