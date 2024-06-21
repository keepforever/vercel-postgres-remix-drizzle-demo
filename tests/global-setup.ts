/* eslint-disable no-empty-pattern */
import { clerkSetup } from "@clerk/testing/playwright";
// import { FullConfig } from "@playwright/test";

// async function globalSetup(config: FullConfig) {
async function globalSetup() {
  console.log("\n", `hello global setup run `, "\n");
  await clerkSetup();
}

export default globalSetup;
