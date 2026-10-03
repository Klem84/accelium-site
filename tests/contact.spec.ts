import { test, expect } from "@playwright/test";

test.describe("Formulaire de contact / diagnostic", () => {
  test("affiche les erreurs de validation et les relie aux champs", async ({ page }) => {
    await page.goto("/contact");

    await page.route("**/api/diagnostic", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          error: "Merci de corriger les champs signalés.",
          fieldErrors: {
            nom: ["Le nom est requis."],
            societe: ["L'entreprise est requise."],
            email: ["L'email n'est pas valide."],
            consentement: ["Le consentement est requis."],
          },
        }),
      });
    });

    // Remplit un email invalide pour passer la validation HTML5 native du champ email
    // et déclencher la réponse mockée du serveur.
    await page.fill("#nom", "");
    await page.fill("#societe", "");
    await page.fill("#email", "pas-un-email");
    await page.locator("form").evaluate((form) => (form as HTMLFormElement).noValidate = true);

    await page.getByRole("button", { name: /Obtenir mon diagnostic gratuit/i }).click();

    await expect(page.locator("form [role=alert]")).toContainText("Merci de corriger les champs signalés");
    await expect(page.locator("#nom")).toBeVisible();
    await expect(page.locator("#err-nom")).toBeVisible();
    await expect(page.locator("#err-societe")).toBeVisible();
    await expect(page.locator("#err-consentement")).toBeVisible();
    await expect(page.locator("#nom")).toHaveAttribute("aria-describedby", "err-nom");
    await expect(page.locator("#nom")).toBeFocused();
  });

  test("affiche un succès quand /api/diagnostic répond ok (mock)", async ({ page }) => {
    await page.goto("/contact");

    await page.route("**/api/diagnostic", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.fill("#nom", "Jean Test");
    await page.fill("#societe", "Société Test");
    await page.fill("#email", "jean.test@example.com");
    await page.check("#consentement");

    await page.getByRole("button", { name: /Obtenir mon diagnostic gratuit/i }).click();

    // Succès : le formulaire redirige vers la page de remerciement.
    await expect(page).toHaveURL(/\/merci-diagnostic/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("votre demande est bien reçue");
  });
});
