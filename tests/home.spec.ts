import { setupClerkTestingToken } from "@clerk/testing/playwright";
import { test, expect } from "@playwright/test";

test("Unauthenticated home view", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await setupClerkTestingToken({ page });

  await expect(
    page.getByText("Please sign in to view this page")
  ).toBeVisible();
});
