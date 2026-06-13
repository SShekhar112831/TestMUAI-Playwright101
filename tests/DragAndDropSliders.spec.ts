import { test, expect } from "@playwright/test";

test("Drag & Drop Slider - navigation click to 95", async ({ page }) => {
  // 1. Navigate to the stable LambdaTest Playground URL
  await page.goto("https://www.lambdatest.com/selenium-playground/", {
    waitUntil: "domcontentloaded",
    timeout: 20000
  });

  // 2. Perform the homepage click transition
  await page.getByText("Drag & Drop Sliders").click();

  // 3. Pinpoint selectors inside the target #slider3 container row
  const targetRow = page.locator('#slider3');
  const sliderInput = targetRow.locator('input[type="range"]');
  const outputLabel = targetRow.locator('output');

  // Hardened structural guard: Ensure elements are painted and active
  await targetRow.waitFor({ state: "visible", timeout: 15000 });
  await sliderInput.waitFor({ state: "attached", timeout: 10000 });

  // 4. STEP 1: Fast State Update
  // Instantly sets the range value property to 95 on Chrome, Firefox, and WebKit
  await sliderInput.fill("95");

  // 5. STEP 2: The Cross-Browser Event Wakeup Handshake
  // Focus the input and press two quick opposing arrow keys.
  // This triggers a real browser hardware event stream that forces the 
  // framework layout listeners to sync and paint the visual output bubble.
  await sliderInput.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowLeft");

  // 6. Core Verification Assertions
  // Web-first polling instantly catches the exact text reflection across all 3 engines
  await expect(outputLabel).toHaveText("95", { timeout: 10000 });
  
  const finalInputState = await sliderInput.inputValue();
  expect(finalInputState).toBe("95");
});