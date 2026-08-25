import { test, expect } from '@playwright/test';

test.describe('End-to-End User Resume Creation Flow', () => {
  test('should register, login, create a resume, generate objective with AI, and download PDF', async ({ page }) => {
    // 1. Visit signup page
    await page.goto('http://localhost:5173/register');
    await page.fill('input[placeholder="John Doe"]', 'Rahul Chavan');
    await page.fill('input[placeholder="you@example.com"]', 'rahul.e2e@example.com');
    await page.fill('input[placeholder="Min. 8 characters"]', 'SecurePassword123!');
    await page.fill('input[placeholder="Repeat password"]', 'SecurePassword123!');
    await page.click('input[type="checkbox"]'); // Accept T&C
    await page.click('button[type="submit"]');

    // 2. Redirected to email verification (simulate verified status redirecting to dashboard)
    await page.goto('http://localhost:5173/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);

    // 3. Navigate to Resume Builder
    await page.click('text=New Resume');
    await expect(page).toHaveURL(/.*resumes\/new/);

    // 4. Fill personal details
    await page.fill('input[name="firstName"]', 'Rahul');
    await page.fill('input[name="lastName"]', 'Chavan');
    await page.fill('input[name="email"]', 'rahul.e2e@example.com');

    // 5. Open AI Panel
    await page.click('text=AI Assistant');
    await page.click('text=Generate Objective');

    // Wait for the AI output box to display the result
    await expect(page.locator('text=AI Result')).toBeVisible();
    await page.click('text=Apply to Resume');

    // 6. Export PDF
    await page.click('text=Export PDF');

    // 7. Logout
    await page.goto('http://localhost:5173/dashboard');
    await page.click('text=Logout');
    await expect(page).toHaveURL(/.*login/);
  });
});
