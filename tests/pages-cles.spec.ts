import { test, expect } from "@playwright/test";

test.describe("Pages clés en 200", () => {
  test("/cabinet/equipe répond 200", async ({ page }) => {
    const response = await page.goto("/cabinet/equipe", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });
});
