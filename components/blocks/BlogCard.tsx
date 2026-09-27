import Link from "next/link";
import type { Doc, Article } from "@/lib/content";
import { formatDate, readingTime, clusterLabels } from "@/lib/utils";

export function BlogCard({ article }: { article: Doc<Article> }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-line bg-surface hover:border-ink transition-colors focusable h-full"
    >
      {article.heroImage && (
        <div className="photo aspect-[16/9]">
          <img src={article.heroImage} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <span className="kicker text-orange700">{clusterLabels[article.cluster] || article.cluster}</span>
        <h3 className="display text-[1.25rem] font-600 text-ink group-hover:text-orange700 mt-2 leading-tight">
          {article.titre}
        </h3>
        <p className="mt-2 text-[0.92rem] text-body flex-1">{article.excerpt}</p>
        <p className="mt-4 text-[0.8rem] text-slate">
          {formatDate(article.publishedAt)} · {readingTime(article.body)} min de lecture
        </p>
      </div>
    </Link>
  );
}
