import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

const components = {
  a: ({ href = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href.startsWith("/")) return <Link href={href} {...props} />;
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
  },
};

export function Mdx({ source, className = "" }: { source: string; className?: string }) {
  if (!source) return null;
  return (
    <div className={"prose-accelium " + className}>
      <MDXRemote source={source} components={components} />
    </div>
  );
}
