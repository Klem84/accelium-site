/**
 * Génère l'image OG par défaut (public/og-default.png, 1200 × 630) selon docs/components-v2.md §6.
 * Remplace app/opengraph-image.tsx : @vercel/og échoue au build sous Windows (chemin avec espaces).
 * Usage : npx tsx scripts/build-og.ts
 */
import sharp from "sharp";
import path from "node:path";

const W = 1200;
const H = 630;
const root = process.cwd();
const font = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const titre = ["Financez vos projets d'investissement,", "d'innovation et de transition"];
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/'/g, "&#39;");

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#1B2336"/>
  <text x="80" y="302" font-family="${font}" font-weight="600" font-size="20" letter-spacing="4" fill="#FF7536">CABINET DE CONSEIL EN FINANCEMENTS PUBLICS</text>
  ${titre.map((l, i) => `<text x="80" y="${378 + i * 66}" font-family="${font}" font-weight="600" font-size="58" letter-spacing="-1.2" fill="#FFFFFF">${esc(l)}</text>`).join("\n  ")}
  <text x="80" y="558" font-family="${font}" font-size="26" fill="rgba(255,255,255,0.72)">Partout en France · accelium-conseil.fr</text>
  <rect x="0" y="622" width="${W}" height="8" fill="#F26122"/>
</svg>`;

async function main() {
  const logo = await sharp(path.join(root, "public/assets/logo-horizontal-blanc.png")).resize({ height: 52 }).png().toBuffer();
  await sharp(Buffer.from(svg))
    .composite([{ input: logo, left: 80, top: 72 }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, "public/og-default.png"));
  console.log("public/og-default.png généré");
}
main();
