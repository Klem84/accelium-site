import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "ghost-d" | "light";

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  "ghost-d": "btn-ghost-d",
  light: "btn-light",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  arrow = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
  const base =
    "focusable group rounded-full px-7 py-4 text-[1rem] inline-flex items-center gap-2";
  return (
    <Link href={href} className={`${variants[variant]} ${base} ${className}`}>
      {children}
      {arrow && (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-[3px]"
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Link>
  );
}
