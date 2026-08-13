import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Hufpflege/);
});

test('login form is visible and has correct labels', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByLabel('Email oder Username')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
});
