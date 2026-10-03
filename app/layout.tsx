import type { Metadata, Viewport } from "next";
import "./globals.css";
import Telemetry from "@/components/layout/Telemetry";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/motion/MotionProvider";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/schema-org";
import { site } from "@/config/site";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Polices auto-hébergées (@font-face dans globals.css) : seules les 2 graisses de
            General Sans visibles dès le hero sont préchargées, en parallèle du CSS. */}
        <link rel="preload" href="/fonts/GeneralSans-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/GeneralSans-600.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/ClashDisplay-600.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="font-sans">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
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
        <Telemetry />
      </body>
    </html>
  );
}
