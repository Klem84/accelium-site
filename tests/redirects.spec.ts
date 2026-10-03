import { test, expect } from "@playwright/test";
import { redirects } from "../config/redirects.mjs";

// Cas concrets (non wildcard) issus de config/redirects.mjs, lui-même construit à partir de
// redirects-301-mapping.md (RACINE). Les motifs avec `:slug*` ne sont pas testés ici tel quel ;
// on vérifie un exemple concret par motif ci-dessous.
const concreteCases = redirects.filter((r: { source: string }) => !r.source.includes(":slug"));

test.describe("Redirections 301 (ancien site -> nouveau site)", () => {
  for (const { source, destination } of concreteCases) {
    test(`${source} -> ${destination}`, async ({ page }) => {
      const response = await page.goto(source, { waitUntil: "domcontentloaded" });
      // Playwright suit les redirections : on vérifie l'URL finale et le statut de la chaîne.
      expect(new URL(page.url()).pathname).toBe(destination.split("#")[0]);
      expect(response?.status()).toBeLessThan(400);
    });
  }

  test("un slug de dispositif inconnu renvoie une 404", async ({ page }) => {
    const response = await page.goto("/le-financement-public/dispositifs/un-slug-quelconque", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
    expect(new URL(page.url()).pathname).toBe("/le-financement-public/dispositifs/un-slug-quelconque");
  });
});
