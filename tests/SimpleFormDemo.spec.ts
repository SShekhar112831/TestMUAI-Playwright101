import { test, expect } from '@playwright/test';

test("Simple Form Demo", async ({ page }) => {
  await page.goto("https://www.testmuai.com/selenium-playground/");

  await page.getByText("Simple Form Demo").click();
  await expect(page).toHaveURL(/.*simple-form-demo/);

  // Allow the layout to settle down fully
  await page.waitForTimeout(1000);

  const message = 'Welcome to TestMu AI';

  // 1. Fill the visible input box
  const visibleInput = page.locator('input#user-message >> visible=true').first();
  await visibleInput.waitFor({ state: 'visible' });
  await visibleInput.fill(message);

  // 2. Execute the synchronous native browser click with a hydration delay
  await page.evaluate(async (expectedMsg) => {
    const inputs = Array.from(document.querySelectorAll('input#user-message'));
    const activeInput = inputs.find(input => input.value === expectedMsg);
    
    if (!activeInput) return;

    // FIX THE FLASHING ERROR: 
    // Sleep for 100 milliseconds inside the browser context. This allows the 
    // web application framework to bind the input value to its state safely.
    await new Promise(resolve => setTimeout(resolve, 100));

    const parentForm = activeInput.closest('div, section, form, .form-group') || activeInput.parentElement;
    
    if (parentForm) {
      const submitBtn = parentForm.querySelector('#showInput') || document.querySelector('#showInput');
      if (submitBtn) {
        submitBtn.click();
      }
    }
  }, message);

  // 3. Assert using Playwright's web-first assertion on the global element.
  // This allows the DOM to safely render the output across all 3 engines.
  const finalOutput = page.locator('#message >> visible=true').first();
  await expect(finalOutput).toHaveText(message);
});
