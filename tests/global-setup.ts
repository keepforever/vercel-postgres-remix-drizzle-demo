/* eslint-disable no-empty-pattern */
import { clerkSetup } from "@clerk/testing/playwright";
// import { FullConfig } from "@playwright/test";

// async function globalSetup(config: FullConfig) {
async function globalSetup() {
  console.log("\n", `hello global setup run `, "\n");
  await clerkSetup();

  if (
    !process.env.E2E_CLERK_USER_USERNAME ||
    !process.env.E2E_CLERK_USER_PASSWORD
  ) {
    throw new Error(
      "Please provide E2E_CLERK_USER_USERNAME and E2E_CLERK_USER_PASSWORD environment variables."
    );
  }
}

export default globalSetup;
