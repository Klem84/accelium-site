import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/motion/MotionProvider";
import { JsonLd, organizationSchema } from "@/lib/schema-org";
import { site } from "@/config/site";

// Polices auto-hébergées via next/font/local : 4 graisses au total (2 par famille), pour
// ne charger que ce qui est réellement utilisé par les classes font-500 / font-600.
// ClashDisplay-700 et GeneralSans-700 (inutilisées, cf. grep "font-700") ne sont plus servies.
const clashDisplay = localFont({
  src: [
    { path: "../public/fonts/ClashDisplay-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/ClashDisplay-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const generalSans = localFont({
  src: [
    { path: "../public/fonts/GeneralSans-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/GeneralSans-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1B2336",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Accelium, conseil en financements publics en France",
    template: `%s | ${site.shortName}`,
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
    <html lang="fr" className={`${clashDisplay.variable} ${generalSans.variable}`}>
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
