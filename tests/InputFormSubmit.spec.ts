import { test, expect, Page, Locator } from '@playwright/test';

test.setTimeout(60_000);

const FORM_URL = 'https://www.testmuai.com/selenium-playground/input-form-demo/';

async function gotoWithRetry(page: Page, url: string, maxRetries = 3) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
      });

      await expect(page).toHaveURL(/input-form-demo/, { timeout: 10000 });
      return;
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await page.waitForTimeout(1000 * attempt);
      }
    }
  }

  throw lastError;
}

async function setInputValue(locator: Locator, value: string) {
  await locator.clear();
  await locator.fill(value);
  await expect(locator).toHaveValue(value, { timeout: 5000 });
}

async function setSelectValue(locator: Locator, labelText: string) {
  await locator.selectOption({ label: labelText });
}

test('Input Form Submit - stable on Chromium Firefox WebKit', async ({ page }) => {
  await gotoWithRetry(page, FORM_URL);

  // Field Locators
  const nameField = page.locator('input[name="name"]').first();
  const emailField = page.locator('#inputEmail4').first();
  const passwordField = page.locator('input[name="password"]').first();
  const companyField = page.locator('input[name="company"]').first();
  const websiteField = page.locator('input[name="website"]').first();
  const countryField = page.locator('select[name="country"]').first();
  const cityField = page.locator('input[name="city"]').first();
  const address1Field = page.locator('input[name="address_line1"]').first();
  const address2Field = page.locator('input[name="address_line2"]').first();
  const stateField = page.locator('#inputState').first();
  const zipField = page.locator('#inputZip').first();
  const submitButton = page.getByRole('button', { name: /^submit$/i });
  const successMessage = page.locator('.success-msg, p.success-msg').first();

  // Populate Form Fields
  await setInputValue(nameField, 'Shantanu Shekhar');
  await setInputValue(emailField, 'shantanu31.shekhar@gmail.com');
  await setInputValue(passwordField, 'password123');
  await setInputValue(companyField, 'Shekhar Systems');
  await setInputValue(websiteField, 'https://www.example.com');
  await setSelectValue(countryField, 'India'); 
  await setInputValue(cityField, 'Bangalore');
  await setInputValue(address1Field, '123 Main St');
  await setInputValue(address2Field, 'D-709');
  await setInputValue(stateField, 'Karnataka');
  await setInputValue(zipField, '560093');

  // Hardened Click Sequence for Firefox Stability
  await submitButton.scrollIntoViewIfNeeded();
  await expect(submitButton).toBeVisible();
  
  // Use force: true to bypass the endless actionability loops in Geckodriver/Firefox
  await submitButton.click({ force: true });

  // Verification
  await expect(successMessage).toBeVisible({ timeout: 15000 });
  await expect(successMessage).toHaveText(
    'Thanks for contacting us, we will get back to you shortly.',
    { timeout: 5000 }
  );
});