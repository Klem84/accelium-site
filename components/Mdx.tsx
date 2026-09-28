import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import remarkGfm from "remark-gfm";

const components = {
  a: ({ href = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href.startsWith("/")) return <Link href={href} {...props} />;
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
  },
  // Tableaux markdown (remark-gfm) : rendu lisible et responsive sans dépendre
  // d'une règle globale (scroll horizontal sur mobile, en-têtes distincts).
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[520px] border-collapse text-[0.92rem]" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-cream" {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="text-left font-600 text-ink px-4 py-3 border-b border-line whitespace-normal"
      {...props}
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="align-top px-4 py-3 border-b border-line text-body whitespace-normal" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="last:[&>td]:border-b-0 even:bg-surface" {...props} />
  ),
};

export function Mdx({ source, className = "" }: { source: string; className?: string }) {
  if (!source) return null;
  return (
    <div className={"prose-accelium " + className}>
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}
