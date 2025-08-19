import { expect, test } from "@playwright/test";

test.use({ locale: "en-US", timezoneId: "UTC" });

const INTEGRATIONS = ["react", "preact", "vue", "svelte", "solid", "vanilla"];

test.describe("Integration smoke tests", () => {
  for (const integration of INTEGRATIONS) {
    test.describe(`${integration} integration`, () => {
      test.beforeEach(async ({ page }) => {
        // Leap year
        const testDate = new Date("2028-02-28T14:30:00.000Z");

        await page.goto(`?value=${integration}&date=${testDate.toISOString()}`);
      });

      test("should render timescape inputs", async ({ page }) => {
        const root = page.locator(".timescape-root").first();
        await expect(root).toBeVisible();

        const inputCount = await root.locator(".timescape-input").count();
        expect(inputCount).toBe(6);
      });

      test("should display the correct initial date", async ({ page }) => {
        // Check the output displays the correct ISO string
        const output = page.locator("#output").first();
        await expect(output).toHaveText("2028-02-28T14:30:00.000Z");

        // Verify individual fields have correct values
        const root = page.locator(".timescape-root").first();
        const dayInput = root.locator('[aria-label="days"]').first();
        const monthInput = root.locator('[aria-label="months"]').first();
        const yearInput = root.locator('[aria-label="years"]').first();
        const hourInput = root.locator('[aria-label="hours"]').first();
        const minuteInput = page.locator('[aria-label="minutes"]').first();
        const secondsInput = page.locator('[aria-label="seconds"]').first();

        await expect(dayInput).toHaveValue("28");
        await expect(monthInput).toHaveValue("02");
        await expect(yearInput).toHaveValue("2028");
        await expect(hourInput).toHaveValue("14");
        await expect(minuteInput).toHaveValue("30");
        await expect(secondsInput).toHaveValue("00");
      });

      test("should handle arrow key navigation between fields", async ({
        page,
      }) => {
        const yearInput = page.locator('[aria-label="years"]').first();
        const monthInput = page.locator('[aria-label="months"]').first();
        const dayInput = page.locator('[aria-label="days"]').first();

        // Focus on year input
        await yearInput.click();
        await expect(yearInput).toBeFocused();

        // Arrow right to month
        await page.keyboard.press("ArrowRight");
        await expect(monthInput).toBeFocused();

        // Arrow right to day
        await page.keyboard.press("ArrowRight");
        await expect(dayInput).toBeFocused();

        // Arrow left back to month
        await page.keyboard.press("ArrowLeft");
        await expect(monthInput).toBeFocused();

        // Arrow left back to year
        await page.keyboard.press("ArrowLeft");
        await expect(yearInput).toBeFocused();
      });

      test("should handle Tab navigation", async ({ page }) => {
        const yearInput = page.locator('[aria-label="years"]').first();
        const monthInput = page.locator('[aria-label="months"]').first();

        // Focus on year input
        await yearInput.click();
        await expect(yearInput).toBeFocused();

        // Tab to next field
        await page.keyboard.press("Tab");
        await expect(monthInput).toBeFocused();

        // Shift+Tab back
        await page.keyboard.press("Shift+Tab");
        await expect(yearInput).toBeFocused();
      });

      test("should increment/decrement values with arrow up/down", async ({
        page,
      }) => {
        const dayInput = page.locator('[aria-label="days"]').first();
        const monthInput = page.locator('[aria-label="months"]').first();
        const yearInput = page.locator('[aria-label="years"]').first();

        // Test day increment/decrement
        await dayInput.click();
        await expect(dayInput).toHaveValue("28");

        await page.keyboard.press("ArrowUp");
        await expect(dayInput).toHaveValue("29");

        await page.keyboard.press("ArrowDown");
        await expect(dayInput).toHaveValue("28");

        // Test month increment/decrement
        await monthInput.click();
        await expect(monthInput).toHaveValue("02");

        await page.keyboard.press("ArrowUp");
        await expect(monthInput).toHaveValue("03");

        await page.keyboard.press("ArrowDown");
        await expect(monthInput).toHaveValue("02");

        // Test year increment/decrement
        await yearInput.click();
        await expect(yearInput).toHaveValue("2028");

        await page.keyboard.press("ArrowUp");
        await expect(yearInput).toHaveValue("2029");

        await page.keyboard.press("ArrowDown");
        await expect(yearInput).toHaveValue("2028");
      });

      test("should allow typing values", async ({ page }) => {
        const yearInput = page.locator('[aria-label="years"]').first();
        const monthInput = page.locator('[aria-label="months"]').first();
        const dayInput = page.locator('[aria-label="days"]').first();

        await yearInput.click();
        await yearInput.pressSequentially("2024");
        await expect(yearInput).toHaveValue("2024");

        await monthInput.click();
        await monthInput.pressSequentially("06");
        await expect(monthInput).toHaveValue("06");

        await dayInput.click();
        await dayInput.pressSequentially("15");
        await expect(dayInput).toHaveValue("15");

        const output = page.locator("#output").first();
        const outputValue = await output.textContent();
        expect(outputValue).toContain("2024-06-15");
      });

      test("should auto-focus next field when typing complete values", async ({
        page,
      }) => {
        const yearInput = page.locator('[aria-label="years"]').first();
        const monthInput = page.locator('[aria-label="months"]').first();
        const dayInput = page.locator('[aria-label="days"]').first();

        // Focus year and type a full 4-digit value
        await yearInput.click();
        await yearInput.pressSequentially("2024");
        await expect(yearInput).toHaveValue("2024");
        await expect(monthInput).toBeFocused();

        // Type month value > 1 to auto-advance
        await monthInput.press("2");
        await expect(monthInput).toHaveValue("02");
        // Should auto-focus to next field (day)
        await expect(dayInput).toBeFocused();
      });

      test("should handle time inputs", async ({ page }) => {
        const hourInput = page.locator('[aria-label="hours"]').first();
        const minuteInput = page.locator('[aria-label="minutes"]').first();

        // Test hour increment/decrement
        await hourInput.click();
        const initialHour = await hourInput.inputValue();

        await page.keyboard.press("ArrowUp");
        await expect(hourInput).toHaveValue(
          String((Number(initialHour) + 1) % 24).padStart(2, "0"),
        );

        await page.keyboard.press("ArrowDown");
        await expect(hourInput).toHaveValue(initialHour);

        // Test minute typing
        await minuteInput.click();
        await minuteInput.pressSequentially("45");
        await expect(minuteInput).toHaveValue("45");
      });

      test("should handle Enter key to move to next field", async ({
        page,
      }) => {
        const yearInput = page.locator('[aria-label="years"]').first();
        const monthInput = page.locator('[aria-label="months"]').first();

        await yearInput.click();
        await expect(yearInput).toBeFocused();

        await page.keyboard.press("Enter");
        await expect(monthInput).toBeFocused();
      });

      test("should wrap around at field boundaries", async ({ page }) => {
        const yearInput = page.locator('[aria-label="years"]').first();
        const secondsInput = page.locator('[aria-label="seconds"]').first();

        // If seconds field exists, test wrap around
        if (await secondsInput.isVisible()) {
          await secondsInput.click();
          await expect(secondsInput).toBeFocused();

          // Arrow right from last field should wrap to first
          await page.keyboard.press("ArrowRight");

          // Check if AM/PM field exists
          const amPmInput = page.locator('[aria-label="am/pm"]').first();
          if (await amPmInput.isVisible()) {
            await expect(amPmInput).toBeFocused();
            await page.keyboard.press("ArrowRight");
          }

          await expect(yearInput).toBeFocused();
        }
      });
    });
  }
});
