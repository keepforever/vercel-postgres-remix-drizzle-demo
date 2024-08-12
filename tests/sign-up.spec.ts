import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { test, expect } from '@playwright/test'

test('sign up', async ({ page }) => {
  await setupClerkTestingToken({ page })

  await page.goto('http://localhost:5173/sign-up')

  // Expect the header to be present and contain the correct text
  await expect(page.locator('h1')).toHaveText('Sign Up route')

  // Expect the sign-up form to be present by checking for a specific element within the form
  // This assumes your SignUp component renders a form element or an input/button with a specific test ID or role
  // Adjust the selector as necessary to match your actual markup
  await expect(page.locator('form')).toBeVisible()
  // Or, if you have specific identifiable elements within the SignUp component:
  // await expect(page.locator('input[name="email"]')).toBeVisible();
  // await expect(page.locator('button[type="submit"]')).toBeVisible();
})
