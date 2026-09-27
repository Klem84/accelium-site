import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test.describe("Menu mobile au clavier", () => {
  test("s'ouvre, se ferme avec Escape et rend le focus au bouton", async ({ page }) => {
    await page.goto("/");

    const burger = page.getByRole("button", { name: /Ouvrir le menu/i });
    await burger.focus();
    await expect(burger).toBeFocused();

    await burger.press("Enter");

    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: /Fermer le menu/i })).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");

    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: /Ouvrir le menu/i })).toBeFocused();
  });
});
