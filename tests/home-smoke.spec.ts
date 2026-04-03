import { expect, test } from "@playwright/test";

test("home smoke: header and package discovery links render", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/SP TOURS AND TRAVELLS/i);
  await expect(page.getByRole("link", { name: /packages/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /contact/i }).first()).toBeVisible();

  const packageLinks = page.locator('a[href^="/packages/"]');
  await expect(packageLinks.first()).toBeVisible();
  expect(await packageLinks.count()).toBeGreaterThan(0);
});