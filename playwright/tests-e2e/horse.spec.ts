import { test, expect } from "../../infrastructure/testing/auth";

test.describe('Horse Management (CRUD)', () => {
  const horseName = `Testpferd ${Date.now()}`;
  const horseBirthYear = '2015';
  const horseColor = 'Rappe';
  const horseNote = 'This is a test horse for Playwright.';

  test.beforeEach(async ({ loggedInPage }) => { // Use the loggedInPage fixture
    // The 'loggedInPage' fixture already handles user creation and login,
    // navigating to the dashboard. Now, navigate from the dashboard to the horses list.
    // Assuming there is a navigation link to the horses page.
    // Using a more robust selector might be needed.
    await loggedInPage.getByRole('link', { name: 'Pferde' }).click();
    await expect(loggedInPage).toHaveURL(/.*\/horses/);
  });

  test('should allow a user to create a new horse and view its details', async ({ page }) => {
    // 1. Click the "New Horse" button
    await page.getByTestId('new-horse-button').click();
    await expect(page).toHaveURL(/.*\/horses\/new/);
    await expect(page.getByRole('heading', { name: 'Neues Pferd' })).toBeVisible();

    // 2. Fill out the form
    await page.getByTestId('horse-form-name-input').fill(horseName);
    await page.getByTestId('horse-form-birthYear-input').fill(horseBirthYear);
    await page.getByTestId('horse-form-color-input').fill(horseColor);
    await page.getByTestId('horse-form-note-textarea').fill(horseNote);
    await page.getByTestId('horse-form-beschlagen-checkbox').check();

    // 3. Save the horse
    await page.getByTestId('horse-form-save-button').click();

    // 4. Verify the horse is in the list
    await expect(page).toHaveURL(/.*\/horses/);
    await expect(page.getByText(horseName)).toBeVisible();

    // 5. Verify the details of the newly created horse
    await page.getByText(horseName).click();
    await expect(page.getByTestId('horse-form-name-input')).toHaveValue(horseName);
    await expect(page.getByTestId('horse-form-birthYear-input')).toHaveValue(horseBirthYear);
    await expect(page.getByTestId('horse-form-color-input')).toHaveValue(horseColor);
    await expect(page.getByTestId('horse-form-note-textarea')).toHaveValue(horseNote);
    await expect(page.getByTestId('horse-form-beschlagen-checkbox')).toBeChecked();
  });

  test('should allow a user to update a horse', async ({ page }) => {
    // 1. Create a horse to update
    const horseToUpdateName = `UpdatePferd ${Date.now()}`;
    await page.getByTestId('new-horse-button').click();
    await page.getByTestId('horse-form-name-input').fill(horseToUpdateName);
    await page.getByTestId('horse-form-birthYear-input').fill('2010');
    await page.getByTestId('horse-form-beschlagen-checkbox').check();
    await page.getByTestId('horse-form-save-button').click();
    await expect(page.getByText(horseToUpdateName)).toBeVisible();

    // 2. Navigate to horse details and open edit dialog
    await page.getByText(horseToUpdateName).click();
    await page.getByTestId('edit-horse-button').click();

    // 3. Fill out the form with updated values
    const updatedHorseName = `${horseToUpdateName}-updated`;
    const updatedBirthYear = '2012';
    const updatedNote = 'This horse has been updated.';

    await expect(page.getByTestId('horse-form-name-input')).toHaveValue(horseToUpdateName);
    await page.getByTestId('horse-form-name-input').fill(updatedHorseName);
    await page.getByTestId('horse-form-birthYear-input').fill(updatedBirthYear);
    await page.getByTestId('horse-form-note-textarea').fill(updatedNote);
    await page.getByTestId('horse-form-beschlagen-checkbox').uncheck();

    // 4. Save the changes
    await page.getByTestId('horse-form-update-button').click();

    // 5. Verify the horse is updated in the list
    await expect(page.getByText(updatedHorseName)).toBeVisible();
    await expect(page.getByText(horseToUpdateName)).not.toBeVisible();

    // 6. Verify the details of the updated horse
    await page.getByText(updatedHorseName).click();
    await expect(page.getByTestId('horse-form-name-input')).toHaveValue(updatedHorseName);
    await expect(page.getByTestId('horse-form-birthYear-input')).toHaveValue(updatedBirthYear);
    await expect(page.getByTestId('horse-form-note-textarea')).toHaveValue(updatedNote);
    await expect(page.getByTestId('horse-form-beschlagen-checkbox')).not.toBeChecked();
  });

  test('should allow a user to delete a horse', async ({ page }) => {
    // 1. Create a horse to delete
    const horseToDeleteName = `DeletePferd ${Date.now()}`;
    await page.getByTestId('new-horse-button').click();
    await page.getByTestId('horse-form-name-input').fill(horseToDeleteName);
    await page.getByTestId('horse-form-save-button').click();
    await expect(page.getByText(horseToDeleteName)).toBeVisible();

    // 2. Navigate to horse details and delete it
    await page.getByText(horseToDeleteName).click();
    await page.getByTestId('delete-horse-button').click();
    await expect(page.getByText(/wirklich entfernen/)).toBeVisible();
    await page.getByTestId('confirm-delete-horse-button').click();

    // 3. Verify the horse is no longer in the list
    await expect(page.getByText(horseToDeleteName)).not.toBeVisible();
  });
});
