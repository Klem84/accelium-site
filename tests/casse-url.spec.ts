import { test, expect } from "@playwright/test";

test.describe("Normalisation de casse des URL", () => {
  test("/OFFRES redirige en 308 vers /offres", async ({ page }) => {
    const response = await page.goto("/OFFRES", { waitUntil: "domcontentloaded" });
    // Playwright ne rapporte que le statut de la dernière réponse de la chaîne ; on vérifie
    // donc l'URL finale (redirection suivie) et, via l'API request, le code 308 de la redirection.
    expect(new URL(page.url()).pathname).toBe("/offres");

    const apiResponse = await page.request.get("/OFFRES", { maxRedirects: 0 });
    expect(apiResponse.status()).toBe(308);
    expect(apiResponse.headers()["location"]).toContain("/offres");
    void response;
  });
});
