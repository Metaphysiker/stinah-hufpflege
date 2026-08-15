import { test as base, expect, APIRequestContext, Page } from '@playwright/test';

type MyTestOptions = {
  API_BASE_URL: string;
  VUE_APP_BASE_URL: string;
};

// Define a new type for our test fixtures.
// We'll add a 'loggedInPage' fixture that provides a Page object already logged in.
type MyFixtures = {
  loggedInPage: Page;
};

// Extend the base test with our new fixture and options, combining them.
export const test = base.extend<MyFixtures & MyTestOptions>({
  // Define API_BASE_URL as a fixture that provides its value from the config.
  // This makes it available as a parameter to other fixtures.
  API_BASE_URL: [async ({}, use, testInfo) => {
    await use(testInfo.project.use.API_BASE_URL);
  }, { scope: 'worker', option: true }],

  // Define VUE_APP_BASE_URL as a fixture that provides its value from the config.
  // This makes it available as a parameter to other fixtures.
  VUE_APP_BASE_URL: [async ({}, use, testInfo) => {
    await use(testInfo.project.use.VUE_APP_BASE_URL);
  }, { scope: 'worker', option: true }],

  // Define the 'loggedInPage' fixture.
  // This fixture will create a user via API and then log in to the UI.
  loggedInPage: async ({ page, request, API_BASE_URL, VUE_APP_BASE_URL }, use) => {
    // 1. Create a unique test user via API
    const username = `testuser-${Date.now()}`;
    const password = 'TestPassword123!'; // A strong password for the test user
    const apiBaseUrl = API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error('API_BASE_URL is not set in your Playwright config.');
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
    await page.goto(`${VUE_APP_BASE_URL}login`); // Adjust to your actual login path

    // Vuetify fields use labels instead of native input `name` attributes.
    await page.getByLabel('Email oder Username').fill(username);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for navigation to the app root and for the main navigation to appear.
    await page.waitForURL(new RegExp(`${VUE_APP_BASE_URL}.*`));
    await expect(page.getByRole('link', { name: 'Pferde' })).toBeVisible();

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
