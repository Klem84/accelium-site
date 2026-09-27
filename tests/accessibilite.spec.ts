import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  "/",
  "/offres/financements-publics",
  "/secteurs/foret-bois",
  "/le-financement-public/financeurs/ademe",
  "/cas-clients",
  "/contact",
  "/regions",
  "/le-financement-public/dispositifs",
];

test.describe("Accessibilité (axe-core)", () => {
  for (const url of PAGES) {
    test(`${url} ne présente aucune violation axe-core (wcag2a, wcag2aa)`, async ({ page }) => {
      await page.goto(url);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

      if (results.violations.length > 0) {
        const details = results.violations
          .map((v) => `- [${v.id}] ${v.help} (${v.nodes.length} nœud(s)) : ${v.nodes[0]?.target.join(" ")}`)
          .join("\n");
        console.log(`Violations axe-core sur ${url} :\n${details}`);
      }

      expect(results.violations, `Violations axe-core sur ${url}`).toEqual([]);
    });
  }
});
