import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { site } from "@/config/site";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} : ${site.baseline}`;

// Image OG par défaut (fiche J.1.4/F3) : fond bleu nuit, logo, titre et baseline.
// Utilisée par toutes les pages qui ne fournissent pas leur propre ogImage (lib/seo.ts::defaultOgImage).
export default async function OpengraphImage() {
  const logoPath = path.join(process.cwd(), "public/assets/logo-horizontal-blanc.png");
  const logoData = fs.readFileSync(logoPath);
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px",
          backgroundColor: "#1B2336",
        }}
      >
        <img src={logoSrc} width={280} height={56} alt="" style={{ objectFit: "contain" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#ffffff",
              maxWidth: "980px",
              fontFamily: "sans-serif",
            }}
          >
            Accelium, conseil en financements publics en France
          </div>
          <div style={{ fontSize: 30, color: "#F5A25D", fontFamily: "sans-serif" }}>
            {site.baseline}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
