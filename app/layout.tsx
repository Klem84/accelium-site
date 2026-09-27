import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/motion/MotionProvider";
import { JsonLd, organizationSchema } from "@/lib/schema-org";
import { site } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Cabinet de conseil en financements publics | Accelium",
    template: "%s | Accelium",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
  },
  icons: {
    icon: "/assets/logo-symbole.png",
    shortcut: "/assets/logo-symbole.png",
    apple: "/assets/logo-symbole.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preload" href="/fonts/ClashDisplay-600.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/GeneralSans-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="font-sans">
        <JsonLd data={organizationSchema()} />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[80] focus:top-3 focus:left-3 focus:bg-ink focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Aller au contenu
        </a>
        <MotionProvider />
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
