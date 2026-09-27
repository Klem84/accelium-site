import { test, expect } from "@playwright/test";

test.describe("Fichiers techniques SEO/GEO", () => {
  test("/llms.txt répond 200", async ({ request }) => {
    const response = await request.get("/llms.txt");
    expect(response.status()).toBe(200);
  });

  test("/sitemap.xml répond 200 et contient des <url>", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("<url>");
  });

  test("/robots.txt répond 200", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
  });
});
