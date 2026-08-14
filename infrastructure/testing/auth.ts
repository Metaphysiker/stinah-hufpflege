import { test as base, expect, APIRequestContext, Page } from '@playwright/test';


// Define a new type for our test fixtures.
// We'll add a 'loggedInPage' fixture that provides a Page object already logged in.
type MyFixtures = {
  loggedInPage: Page;
};

// Extend the base test with our new fixture.
export const test = base.extend<MyFixtures>({
  // Define the 'loggedInPage' fixture.
  // This fixture will create a user via API and then log in to the UI.
  loggedInPage: async ({ page, request }, use) => {
    // 1. Create a unique test user via API
    const username = `testuser-${Date.now()}`;
    const password = 'TestPassword123!'; // A strong password for the test user

    const apiBaseUrl = process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error('Environment variable API_BASE_URL is not set. Please configure it in your environment or Playwright config.');
    }
    const registerUserEndpoint = `${apiBaseUrl}api/test-users/create-user`;

    // Assuming a registration endpoint on the webapi service
    // Call the test-specific user creation endpoint on the WebApi service
    console.log(`Attempting to register user '${username}' at: ${registerUserEndpoint}`);
    const registerResponse = await request.post(registerUserEndpoint, {
      data: {
        username: username,
        password: password,
        email: `${username}@example.com`, // Assuming email is also required
      },
    });

    // Enhanced error reporting for API registration
    expect(registerResponse.ok(),
      `Failed to register user '${username}'. Status: ${registerResponse.status()} ${registerResponse.statusText()}. Response: ${await registerResponse.text()}`
    ).toBeTruthy();
    console.log(`Created test user: ${username}`);

    // 2. Log in to the Vue.js application using the created user
    // The VUE_APP_BASE_URL is set in docker-compose.yml for the playwright service
    await page.goto(`${process.env.VUE_APP_BASE_URL}login`); // Adjust to your actual login path

    await page.fill('input[name=f"username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]'); // Adjust selector for your login button

    // Wait for navigation or a specific element to appear after successful login
    await page.waitForURL(`${process.env.VUE_APP_BASE_URL}dashboard`); // Adjust to your actual dashboard path
    await expect(page.locator('.user-profile-display')).toContainText(username); // Example assertion for logged-in state

    // Use the logged-in page in the test
    await use(page);

    // 3. Teardown: (Optional) Delete the test user after the test finishes
    // This ensures test isolation and cleans up the database.
    // For this example, we'll assume the test database is reset between runs or
    // the user creation is idempotent/safe. If a deletion API exists and is needed:
    // const registerResponseBody = await registerResponse.json(); // If you need the ID for deletion
    // await request.delete(`${process.env.API_BASE_URL}api/users/${registerResponseBody.id}`);
    // console.log(`Deleted test user: ${username}`);
  },
});
export { expect };
