# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DragAndDropSliders.spec.ts >> Drag & Drop Slider - navigation click to 95
- Location: tests\DragAndDropSliders.spec.ts:3:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('#slider3').locator('output')
Expected: "95"
Received: "15"
Timeout:  10000ms

Call log:
  - Expect "toHaveText" with timeout 10000ms
  - waiting for locator('#slider3').locator('output')
    22 × locator resolved to <output id="rangeSuccess">15</output>
       - unexpected value "15"

```

```yaml
- status: "15"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("Drag & Drop Slider - navigation click to 95", async ({ page }) => {
  4  |   // 1. Navigate to the stable LambdaTest Playground URL
  5  |   await page.goto("https://www.lambdatest.com/selenium-playground/", {
  6  |     waitUntil: "domcontentloaded",
  7  |     timeout: 20000
  8  |   });
  9  | 
  10 |   // 2. Perform the homepage click transition
  11 |   await page.getByText("Drag & Drop Sliders").click();
  12 | 
  13 |   // 3. Pinpoint selectors inside the target #slider3 container row
  14 |   const targetRow = page.locator('#slider3');
  15 |   const sliderInput = targetRow.locator('input[type="range"]');
  16 |   const outputLabel = targetRow.locator('output');
  17 | 
  18 |   // Hardened structural guard: Ensure elements are painted and active
  19 |   await targetRow.waitFor({ state: "visible", timeout: 15000 });
  20 |   await sliderInput.waitFor({ state: "attached", timeout: 10000 });
  21 | 
  22 |   // 4. STEP 1: Fast State Update
  23 |   // Instantly sets the range value property to 95 on Chrome, Firefox, and WebKit
  24 |   await sliderInput.fill("95");
  25 | 
  26 |   // 5. STEP 2: The Cross-Browser Event Wakeup Handshake
  27 |   // Focus the input and press two quick opposing arrow keys.
  28 |   // This triggers a real browser hardware event stream that forces the 
  29 |   // framework layout listeners to sync and paint the visual output bubble.
  30 |   await sliderInput.focus();
  31 |   await page.keyboard.press("ArrowRight");
  32 |   await page.keyboard.press("ArrowLeft");
  33 | 
  34 |   // 6. Core Verification Assertions
  35 |   // Web-first polling instantly catches the exact text reflection across all 3 engines
> 36 |   await expect(outputLabel).toHaveText("95", { timeout: 10000 });
     |                             ^ Error: expect(locator).toHaveText(expected) failed
  37 |   
  38 |   const finalInputState = await sliderInput.inputValue();
  39 |   expect(finalInputState).toBe("95");
  40 | });
```