// import { setupClerkTestingToken } from "@clerk/testing/playwright";
import { test, expect } from "@playwright/test";

test("Unauthenticated home view", async ({ page }) => {
  //   await setupClerkTestingToken({ page });

  await page.goto("http://localhost:5173/");

  await expect(
    page.getByText("Please sign in to view this page")
  ).toBeVisible();
});
