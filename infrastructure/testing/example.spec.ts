import { test, expect } from '../fixtures/auth'; // Import from our custom fixtures

test('should be able to access dashboard after login', async ({ loggedInPage }) => {
  // 'loggedInPage' is already logged in due to the fixture setup
  await expect(loggedInPage.locator('h1')).toContainText('Welcome to Dashboard'); // Example assertion for dashboard content
  // Perform other tests that require a logged-in user
});

test('should display user specific content', async ({ loggedInPage }) => {
  // Another test using the logged-in page
  await loggedInPage.goto(`${process.env.VUE_APP_BASE_URL}profile`);
  await expect(loggedInPage.locator('.profile-username')).toBeVisible();
});
