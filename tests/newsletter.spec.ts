import { test, expect } from "@playwright/test";

test.describe("Formulaire d'inscription newsletter (composant NewsletterSignup)", () => {
  test("affiche une erreur reliée au champ si le consentement est absent", async ({ page }) => {
    await page.goto("/ressources/newsletters");

    // NewsletterSignup valide le consentement côté client avant tout appel réseau (voir
    // components/forms/NewsletterSignup.tsx) : le mock ci-dessous garantit que le test reste
    // vert même si cette validation cliente disparaissait et que la requête atteignait
    // réellement /api/newsletter, qui renvoie le même message d'erreur (route.ts).
    await page.route("**/api/newsletter", async (route) => {
      await route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          error: "Merci de corriger les champs signalés ci-dessous.",
          fieldErrors: { consentement: ["Le consentement est requis."] },
        }),
      });
    });

    await page.fill("#newsletter-email", "jean.test@example.com");
    // Le consentement n'est volontairement pas coché.
    await page.getByRole("button", { name: /Recevoir la newsletter/i }).click();

    await expect(page.locator("form [role=alert]")).toContainText("Merci de corriger les champs signalés");
    await expect(page.locator("#newsletter-consentement")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Le consentement est requis.")).toBeVisible();
  });
});
