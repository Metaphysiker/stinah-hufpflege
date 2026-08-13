# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: horse.spec.ts >> Horse Management (CRUD) >> should allow a user to delete a horse
- Location: playwright/tests-e2e/horse.spec.ts:88:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('link', { name: 'Pferde' })

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Horse Management (CRUD)', () => {
  4   |   const horseName = `Testpferd ${Date.now()}`;
  5   |   const horseBirthYear = '2015';
  6   |   const horseColor = 'Rappe';
  7   |   const horseNote = 'This is a test horse for Playwright.';
  8   | 
  9   |   test.beforeEach(async ({ page }) => {
  10  |     // For each test, navigate to the horses list
  11  |     // Assuming login is handled globally or not required for this page
  12  |     await page.goto('/');
  13  |     // Assuming there is a navigation link to the horses page.
  14  |     // Using a more robust selector might be needed.
> 15  |     await page.getByRole('link', { name: 'Pferde' }).click();
      |                                                      ^ Error: locator.click: Target page, context or browser has been closed
  16  |     await expect(page).toHaveURL(/.*\/horses/);
  17  |   });
  18  | 
  19  |   test('should allow a user to create a new horse and view its details', async ({ page }) => {
  20  |     // 1. Click the "New Horse" button
  21  |     await page.getByTestId('new-horse-button').click();
  22  |     await expect(page).toHaveURL(/.*\/horses\/new/);
  23  |     await expect(page.getByRole('heading', { name: 'Neues Pferd' })).toBeVisible();
  24  | 
  25  |     // 2. Fill out the form
  26  |     await page.getByTestId('horse-form-name-input').fill(horseName);
  27  |     await page.getByTestId('horse-form-birthYear-input').fill(horseBirthYear);
  28  |     await page.getByTestId('horse-form-color-input').fill(horseColor);
  29  |     await page.getByTestId('horse-form-note-textarea').fill(horseNote);
  30  |     await page.getByTestId('horse-form-beschlagen-checkbox').check();
  31  | 
  32  |     // 3. Save the horse
  33  |     await page.getByTestId('horse-form-save-button').click();
  34  | 
  35  |     // 4. Verify the horse is in the list
  36  |     await expect(page).toHaveURL(/.*\/horses/);
  37  |     await expect(page.getByText(horseName)).toBeVisible();
  38  | 
  39  |     // 5. Verify the details of the newly created horse
  40  |     await page.getByText(horseName).click();
  41  |     await expect(page.getByTestId('horse-form-name-input')).toHaveValue(horseName);
  42  |     await expect(page.getByTestId('horse-form-birthYear-input')).toHaveValue(horseBirthYear);
  43  |     await expect(page.getByTestId('horse-form-color-input')).toHaveValue(horseColor);
  44  |     await expect(page.getByTestId('horse-form-note-textarea')).toHaveValue(horseNote);
  45  |     await expect(page.getByTestId('horse-form-beschlagen-checkbox')).toBeChecked();
  46  |   });
  47  | 
  48  |   test('should allow a user to update a horse', async ({ page }) => {
  49  |     // 1. Create a horse to update
  50  |     const horseToUpdateName = `UpdatePferd ${Date.now()}`;
  51  |     await page.getByTestId('new-horse-button').click();
  52  |     await page.getByTestId('horse-form-name-input').fill(horseToUpdateName);
  53  |     await page.getByTestId('horse-form-birthYear-input').fill('2010');
  54  |     await page.getByTestId('horse-form-beschlagen-checkbox').check();
  55  |     await page.getByTestId('horse-form-save-button').click();
  56  |     await expect(page.getByText(horseToUpdateName)).toBeVisible();
  57  | 
  58  |     // 2. Navigate to horse details and open edit dialog
  59  |     await page.getByText(horseToUpdateName).click();
  60  |     await page.getByTestId('edit-horse-button').click();
  61  | 
  62  |     // 3. Fill out the form with updated values
  63  |     const updatedHorseName = `${horseToUpdateName}-updated`;
  64  |     const updatedBirthYear = '2012';
  65  |     const updatedNote = 'This horse has been updated.';
  66  | 
  67  |     await expect(page.getByTestId('horse-form-name-input')).toHaveValue(horseToUpdateName);
  68  |     await page.getByTestId('horse-form-name-input').fill(updatedHorseName);
  69  |     await page.getByTestId('horse-form-birthYear-input').fill(updatedBirthYear);
  70  |     await page.getByTestId('horse-form-note-textarea').fill(updatedNote);
  71  |     await page.getByTestId('horse-form-beschlagen-checkbox').uncheck();
  72  | 
  73  |     // 4. Save the changes
  74  |     await page.getByTestId('horse-form-update-button').click();
  75  | 
  76  |     // 5. Verify the horse is updated in the list
  77  |     await expect(page.getByText(updatedHorseName)).toBeVisible();
  78  |     await expect(page.getByText(horseToUpdateName)).not.toBeVisible();
  79  | 
  80  |     // 6. Verify the details of the updated horse
  81  |     await page.getByText(updatedHorseName).click();
  82  |     await expect(page.getByTestId('horse-form-name-input')).toHaveValue(updatedHorseName);
  83  |     await expect(page.getByTestId('horse-form-birthYear-input')).toHaveValue(updatedBirthYear);
  84  |     await expect(page.getByTestId('horse-form-note-textarea')).toHaveValue(updatedNote);
  85  |     await expect(page.getByTestId('horse-form-beschlagen-checkbox')).not.toBeChecked();
  86  |   });
  87  | 
  88  |   test('should allow a user to delete a horse', async ({ page }) => {
  89  |     // 1. Create a horse to delete
  90  |     const horseToDeleteName = `DeletePferd ${Date.now()}`;
  91  |     await page.getByTestId('new-horse-button').click();
  92  |     await page.getByTestId('horse-form-name-input').fill(horseToDeleteName);
  93  |     await page.getByTestId('horse-form-save-button').click();
  94  |     await expect(page.getByText(horseToDeleteName)).toBeVisible();
  95  | 
  96  |     // 2. Navigate to horse details and delete it
  97  |     await page.getByText(horseToDeleteName).click();
  98  |     await page.getByTestId('delete-horse-button').click();
  99  |     await expect(page.getByText(/wirklich entfernen/)).toBeVisible();
  100 |     await page.getByTestId('confirm-delete-horse-button').click();
  101 | 
  102 |     // 3. Verify the horse is no longer in the list
  103 |     await expect(page.getByText(horseToDeleteName)).not.toBeVisible();
  104 |   });
  105 | });
  106 | 
```