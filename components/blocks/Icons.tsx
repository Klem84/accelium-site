import type { SVGProps } from "react";

/* Jeu d'icônes maison, trait fin (1.6), cohérent avec le pictogramme Accelium. */

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconEurope = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a14 14 0 0 0 0 18M12 3a14 14 0 0 1 0 18M3.5 9h17M3.5 15h17" />
  </Base>
);

export const IconEtat = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10M12 3 4 8h16Z" />
  </Base>
);

export const IconRegion = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </Base>
);

export const IconGift = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 12v9H4v-9M2 8h20v4H2zM12 8v13M12 8S10.5 3 8 5s4 3 4 3ZM12 8s1.5-5 4-3-4 3-4 3Z" />
  </Base>
);

export const IconRefund = (p: IconProps) => (
  <Base {...p}>
    <path d="M21 12a9 9 0 1 1-2.64-6.36M21 4v4h-4" />
    <path d="M12 8v4l2.5 1.5" />
  </Base>
);

export const IconPercent = (p: IconProps) => (
  <Base {...p}>
    <path d="M19 5 5 19" />
    <circle cx="7.5" cy="7.5" r="2.5" />
    <circle cx="16.5" cy="16.5" r="2.5" />
  </Base>
);

export const IconShield = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Base>
);

export const IconTag = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 12V4h8l9 9-8 8-9-9Z" />
    <circle cx="7.5" cy="7.5" r="1.4" />
  </Base>
);

export const IconTarget = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </Base>
);

export const IconScale = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4v16M7 20h10M6 7l-3 6h6l-3-6Zm12 0-3 6h6l-3-6ZM4 7h16M9 5l3-1 3 1" />
  </Base>
);

export const IconLayers = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Zm9 9-9 5-9-5m18 4-9 5-9-5" />
  </Base>
);

export const IconMap = (p: IconProps) => (
  <Base {...p}>
    <path d="m9 4-6 2.5v13L9 17l6 2.5 6-2.5v-13L15 7 9 4Zm0 0v13m6-10v13" />
  </Base>
);

export const IconCoins = (p: IconProps) => (
  <Base {...p}>
    <ellipse cx="9" cy="7" rx="5.5" ry="2.6" />
    <path d="M3.5 7v4c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6V7" />
    <path d="M9 13.5v3.4c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-4M9 13.6c0 1.4 2.5 2.6 5.5 2.6 1.1 0 2.2-.2 3-.5" />
  </Base>
);

export const IconClock = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
);

export const IconAlert = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4.5 2.5 20h19L12 4.5Z" />
    <path d="M12 10v4.5M12 17.5h.01" />
  </Base>
);

export const IconCheck = (p: IconProps) => (
  <Base {...p}>
    <path d="m4 12.5 5 5 11-11" />
  </Base>
);

export const IconLever = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 17h18M5 17l8-9M13 8l3 3M13 8l-2.5-2.5M16 11l4.5-4.5" />
    <circle cx="6.5" cy="15" r="1.4" />
  </Base>
);

export const IconPhone = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.5 3.5h3l1.4 4.2-2 1.5a12.5 12.5 0 0 0 5.9 5.9l1.5-2 4.2 1.4v3a1.5 1.5 0 0 1-1.6 1.5A17 17 0 0 1 4.5 5.1 1.5 1.5 0 0 1 6 3.5Z" />
  </Base>
);
