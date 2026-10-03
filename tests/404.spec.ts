import { test, expect } from "@playwright/test";

test.describe("Page 404", () => {
  test("affiche une page 404 en français avec liens de secours et téléphone", async ({ page }) => {
    const response = await page.goto("/cette-page-nexiste-pas-vraiment");
    expect(response?.status()).toBe(404);

    await expect(page.locator("body")).toContainText(/page.{0,20}(introuvable|n['’]existe pas)/i);

    // Au moins 3 liens internes de secours.
    const internalLinks = page.locator('a[href^="/"]');
    await expect(internalLinks).not.toHaveCount(0);
    expect(await internalLinks.count()).toBeGreaterThanOrEqual(3);

    // Un numéro de téléphone cliquable.
    await expect(page.locator('main a[href^="tel:"]')).toHaveCount(1);
  });
});
